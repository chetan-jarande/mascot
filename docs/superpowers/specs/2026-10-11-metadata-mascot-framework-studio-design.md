# Metadata-Driven Mascot Framework & Studio — Design Specification

- **Date:** 2026-10-11
- **Status:** Approved
- **Target:** Production-Grade Pluggable Mascot Framework & Live Interactive Studio

---

## 1. Executive Summary & Architectural Intent

The goal is to establish a pluggable, zero-AI-latency, metadata-driven mascot and guided walkthrough framework alongside an interactive Developer Studio. 

Modern web apps often struggle with static, unhelpful onboarding and validation feedback. Rather than relying on unpredictable LLMs with slow roundtrip latencies, this framework operates on a **Single-Source-of-Truth (SSOT) Metadata Schema**. A centralized reactive store evaluates user interactions, runs client-side validations, drives multi-mascot vector avatars with facial expressions and real-time eye tracking, emits telemetry events, and anchors collision-aware speech bubbles via `@floating-ui/react`.

A first-class **Plug-in-Play architecture** ensures developers can register custom mascots, custom validation rules, custom tour providers, and external telemetry sinks without modifying core framework code.

---

## 2. System Architecture

```
+---------------------------------------------------------------------------------------+
|                                    Guide Metadata                                     |
|           (Field IDs, labels, validation rules, tour steps, fallback messages)        |
+------------------------------------------+--------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                       Zustand Reactive Store & Extensible Registries                  |
|  - Active Component ID        - Field Values & Errors      - Current Expression/Msg   |
|  - Mascot Registry            - Validation Registry        - Tour Registry            |
|  - Audio Synth Engine         - Telemetry Event Pipeline   - Tour Step Tracker        |
+-------------------+-----------------------------------+-------------------------------+
                    |                                   |
                    v                                   v
+---------------------------------------+   +-------------------------------------------+
|          UI Application Canvas        |   |         Studio Pipeline Inspector         |
|  - GuidedField (inputs, selects, etc.)|   |  - Real-time Telemetry Event Stream       |
|  - Floating UI GuideBubble            |   |  - Live JSON Schema Editor + Hot-Reload   |
|  - Pluggable Vector Mascot (Nova/Byte)|   |  - Reactive Store State Inspector         |
|  - Pluggable Tour (SVG / driver.js)   |   |  - Pluggable Extensions Directory         |
|  - Web Audio Synthetic Chimes         |   |  - Mascot Emotion Sandbox Grid            |
+---------------------------------------+   +-------------------------------------------+
```

---

## 3. Directory Structure

```
mascot/
├── Makefile                                # make help, install, dev, build, test, lint, preview
├── package.json                            # Vite + React 19 + TypeScript + Tailwind + Zustand
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.tsx                            # Root React entry
│   ├── index.css                           # Tailwind CSS & custom animations
│   │
│   ├── framework/                          # Reusable framework core
│   │   ├── types/
│   │   │   └── guide-framework.ts          # Core TypeScript types and contracts
│   │   ├── store/
│   │   │   └── guideStore.ts               # Zustand store with validation and event dispatch
│   │   ├── registries/
│   │   │   ├── mascotRegistry.ts           # Registry for avatar renderers
│   │   │   ├── validationRegistry.ts       # Registry for custom validation rules
│   │   │   ├── tourRegistry.ts             # Registry for onboarding tour engines
│   │   │   └── telemetryPipeline.ts        # Pluggable analytics sinks
│   │   ├── audio/
│   │   │   └── synthAudio.ts               # Web Audio API procedural sound synthesizer
│   │   ├── tours/
│   │   │   ├── nativeSpotlightProvider.ts  # Bespoke SVG mask cutout & pulse beacon
│   │   │   └── driverJsProvider.ts         # driver.js wrapper
│   │   └── components/
│   │       ├── GuideBubble.tsx             # @floating-ui/react collision-aware speech bubble
│   │       ├── GuidedField.tsx             # Form input wrapper hooking into metadata
│   │       └── NativeSpotlight.tsx         # Backdrop overlay for native tour
│   │
│   ├── mascots/                            # Vector Mascot Implementations
│   │   ├── types.ts                        # Mascot renderer props contract
│   │   ├── NovaMascot.tsx                  # Bioluminescent spark alien with antenna glow
│   │   ├── ByteMascot.tsx                  # Cyber droid with CRT matrix eyes
│   │   └── PipMascot.tsx                   # Geometric owl mentor with expressive eyelids
│   │
│   └── studio/                             # Developer Studio & Playground
│       ├── StudioApp.tsx                   # Studio layout container
│       ├── components/
│       │   ├── HeaderBar.tsx               # Controls: Tour, Mascot, Tour Engine, Audio, Reset
│       │   ├── PlaygroundForm.tsx          # Agency onboarding interactive demo form
│       │   └── inspector/
│       │       ├── InspectorPanel.tsx      # Tab container
│       │       ├── TelemetryTab.tsx        # Live event log list & JSON viewer
│       │       ├── SchemaEditorTab.tsx     # Editable JSON schema editor with live apply
│       │       ├── StateStoreTab.tsx       # Live Zustand store inspector
│       │       ├── PluginsTab.tsx          # Registry inspector & custom validator demo
│       │       └── EmotionSandboxTab.tsx   # Interactive emotion trigger buttons
│       └── config/
│           ├── defaultSchema.ts            # Default agency onboarding schema
│           └── presets.ts                  # Schema presets (Agency, SaaS Checkout, DevOps)
└── tests/
    ├── store.test.ts                       # Store actions and validation pipeline
    ├── registries.test.ts                  # Mascot, Validator, and Telemetry plugins
    └── tour.test.ts                        # Tour navigation and event dispatch
```

---

## 4. Component & Engine Specifications

### 4.1 Schema & Contracts (`src/framework/types/guide-framework.ts`)
- **`MascotExpression`**: `'neutral' | 'thinking' | 'happy' | 'error' | 'surprised' | 'guiding' | 'celebrating'`.
- **`ValidationRule`**:
  - `id`: string.
  - `type`: `'required' | 'email' | 'min_length' | 'regex' | 'custom'`.
  - `value?`: number | string | RegExp.
  - `errorMessage`: string.
  - `mascotReaction?`: string.
  - `customValidatorId?`: string (references a registered custom validator).
- **`ComponentMetadata`**:
  - `componentId`: string.
  - `label`: string.
  - `placeholder?`: string.
  - `infoMessage?`: string.
  - `defaultExpression`: `MascotExpression`.
  - `validations?: ValidationRule[]`.
  - `walkthrough?: { stepIndex: number; title: string; description: string; placement?: 'top' | 'bottom' | 'left' | 'right' }`.
- **`GuideConfig`**:
  - `version`: string.
  - `appNamespace`: string.
  - `components`: `Record<string, ComponentMetadata>`.
  - `globalFallbacks`: `{ idleMessage: string; successMessage: string; defaultError: string }`.
- **`TelemetryEvent`**:
  - `id`: string.
  - `componentId`: string.
  - `action`: `'focus' | 'blur' | 'validation_failed' | 'validation_success' | 'tour_start' | 'tour_step' | 'tour_end' | 'form_submit' | 'expression_trigger'`.
  - `timestamp`: number.
  - `metadata?: Record<string, any>`.

### 4.2 Plug-in-Play Registries
1. **`MascotRegistry`**:
   - `registerMascot(id, metadata, component)`: adds custom avatar.
   - Built-ins: `nova`, `byte`, `pip`.
2. **`ValidationRegistry`**:
   - `registerValidator(id, (value, rule) => boolean)`: allows dynamic validation plugins (e.g. tax IDs, domains, custom regexes).
3. **`TourRegistry`**:
   - `registerTourProvider(id, providerInstance)`: supports swapping between `NativeSpotlight` and `driver.js`.
4. **`TelemetryPipeline`**:
   - `addTelemetrySink(sink: (event: TelemetryEvent) => void)`: broadcasts events to console, Studio inspector, and any external analytics adapters.

### 4.3 Procedural Vector Mascots (`src/mascots/`)
- Pure SVG procedural characters with zero external sprite/canvas assets.
- Mouse pupil tracking: calculates eye gaze towards cursor or focused form field.
- Distinct styling:
  - **Nova**: Fluid blob gradient, pulsing antenna bulb, blushing cheeks.
  - **Byte**: Cybernetic chassis, CRT scanlines, LED matrix pixel eyes, cyan-green accents.
  - **Pip**: Geometric owl, spectacles, animated eyelids, sage purple-amber palette.

### 4.4 Collision-Aware Speech Bubble (`src/framework/components/GuideBubble.tsx`)
- Connected to active input or tour target using `@floating-ui/react` (`offset(14)`, `flip()`, `shift({ padding: 12 })`).
- Directional tail pointer adapting to floating position.
- Typewriter animation with accessible `aria-live="polite"` and `role="status"` live region.

### 4.5 Web Audio Synthesizer (`src/framework/audio/synthAudio.ts`)
- Zero audio asset downloads. Pure Web Audio API synthesized frequencies.
- Gentle clicks for focus, positive major third chords for success, low soft thuds for errors, and celebratory arpeggios for tour completion.
- Audio toggle switch with localStorage persistence.

---

## 5. Developer Studio Specifications

1. **Header Bar**:
   - Mascot selection dropdown.
   - Tour engine switcher (Native SVG Spotlight vs. driver.js).
   - Sound toggle button with animated audio indicator.
   - Action buttons: "Start Interactive Tour", "Reset Form", "Export Schema".
2. **Interactive Form Canvas**:
   - Agency Early Access Registration form demonstrating `GuidedField` with required, min-length, email, and custom team-size dropdown fields.
   - Dynamic validation error cards and mascot reactions.
3. **Framework Pipeline Inspector**:
   - **Telemetry Tab**: Live event feed with action badges, timestamps, JSON payload viewer, clear and export buttons.
   - **Schema Editor Tab**: Syntax-validated JSON editor with instant "Apply to Studio" hot-reload, and schema preset selectors (Agency, SaaS Checkout, DevOps CLI).
   - **Live Store Tab**: Real-time Zustand store state inspector (active node, field values, errors, expressions).
   - **Plugins & Extensions Tab**: Registry directory showing registered mascots, validators, tour engines, and telemetry sinks.
   - **Emotion Sandbox Tab**: Direct emotion triggers (`neutral`, `thinking`, `happy`, `error`, `surprised`, `guiding`, `celebrating`) to test facial animations and speech.

---

## 6. Makefile & Build System

Standardized Makefile commands:
- `make help`: Display targets with descriptions.
- `make install`: Install dependencies with npm.
- `make dev`: Start local Vite dev server.
- `make build`: Run TypeScript type-check and Vite production build.
- `make test`: Run Vitest automated test suite.
- `make lint`: Run TypeScript type-checking (`tsc --noEmit`).
- `make preview`: Preview production build locally.
- `make clean`: Remove `dist/` and `node_modules/.vite`.

---

## 7. Verification & Quality Gates

1. **Automated Unit & Integration Tests**:
   - `tests/store.test.ts`: Verify Zustand store mutations, validation pipelines, error tracking.
   - `tests/registries.test.ts`: Verify plug-in-play registries and custom validator execution.
   - `tests/tour.test.ts`: Verify step progression, bounds checking, and telemetry dispatch.
2. **Build Integrity**:
   - `make build` completes with 0 errors and 0 type warnings.
3. **End-to-End Validation**:
   - Verify dev server launch.
   - Verify browser rendering of mascots, floating speech bubble, form validation, and devtools tabs via Chrome DevTools / Playwright.
