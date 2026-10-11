# Metadata-Driven Mascot Framework & Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, pluggable metadata-driven mascot framework and developer studio in React, TypeScript, Tailwind CSS, Zustand, and Floating UI, complete with a Makefile, multi-mascot vector engines, dual tour providers, devtools inspector, and automated test suite.

**Architecture:** A single-source-of-truth metadata schema drives a central Zustand store and extensible registries (Mascots, Validators, Tours, Telemetry). UI inputs automatically hook into validation rules and trigger reactions in collision-aware vector mascots (`@floating-ui/react`). A developer studio provides live telemetry inspection, hot-reloading JSON schema editor, state view, and plugin directory.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Zustand, @floating-ui/react, driver.js, lucide-react, Vitest, @testing-library/react, jsdom.

**Spec:** `docs/superpowers/specs/2026-10-11-metadata-mascot-framework-studio-design.md`

## Global Constraints
- Node >= 20, Vite 6+, React 19, TypeScript 5+.
- Extensibility: All mascots, custom validators, tour providers, and telemetry sinks must register through decoupled plug-in-play registries.
- Accessibility: Mascot speech bubble must maintain `role="status"` and `aria-live="polite"`.
- Zero audio asset downloads: Sound effects synthesized via Web Audio API.
- Makefile standard targets: `help`, `install`, `dev`, `build`, `test`, `lint`, `preview`, `clean`.

---

### Task 1: Project Scaffolding & Makefile

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `Makefile`
- Create: `src/main.tsx`
- Create: `src/index.css`

**Interfaces:**
- Produces: Runnable development environment and build pipeline verified via `make dev`, `make build`, and `make test`.

- [ ] **Step 1: Create package.json with dependencies**
Define dependencies (`react`, `react-dom`, `zustand`, `@floating-ui/react`, `driver.js`, `lucide-react`) and devDependencies (`vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `vitest`, `@testing-library/react`, `jsdom`).

- [ ] **Step 2: Create TypeScript and Vite configurations**
Set up `tsconfig.json`, `tsconfig.node.json`, and `vite.config.ts` configured with React and Vitest environment `jsdom`.

- [ ] **Step 3: Create Tailwind and PostCSS configurations**
Set up `tailwind.config.js`, `postcss.config.js`, and `src/index.css` with dark theme foundations, custom glow utilities, and keyframe animations.

- [ ] **Step 4: Create Makefile**
Set up standard targets (`help`, `install`, `dev`, `build`, `test`, `lint`, `preview`, `clean`).

- [ ] **Step 5: Run npm install and verify make commands**
Run `npm install` and verify `make lint` / `make build` pass on empty scaffold.

---

### Task 2: Core TypeScript Contracts & Types

**Files:**
- Create: `src/framework/types/guide-framework.ts`

**Interfaces:**
- Produces: `MascotExpression`, `ValidationRule`, `ComponentMetadata`, `GuideConfig`, `TelemetryEvent`, `MascotDefinition`, `TourStep`, `TourProvider`.

- [ ] **Step 1: Define types file**
Write complete types for expressions, validations, component metadata, walkthrough tour steps, and telemetry events as specified in the design doc.

- [ ] **Step 2: Verify type check passes**
Run `npx tsc --noEmit` to confirm no syntax or type errors.

---

### Task 3: Plug-in-Play Registries & Telemetry Pipeline

**Files:**
- Create: `src/framework/registries/mascotRegistry.ts`
- Create: `src/framework/registries/validationRegistry.ts`
- Create: `src/framework/registries/tourRegistry.ts`
- Create: `src/framework/registries/telemetryPipeline.ts`
- Test: `tests/registries.test.ts`

**Interfaces:**
- Consumes: `guide-framework.ts` types.
- Produces: `mascotRegistry`, `validationRegistry`, `tourRegistry`, `telemetryPipeline` singletons and methods (`registerMascot`, `registerValidator`, `registerTourProvider`, `addTelemetrySink`).

- [ ] **Step 1: Write failing tests for registries**
Write unit tests verifying registration and retrieval of mascots, custom validators, tour providers, and telemetry broadcast.

- [ ] **Step 2: Run test to verify it fails**
Run `npx vitest run tests/registries.test.ts`. Expected: FAIL (files missing).

- [ ] **Step 3: Implement registries and telemetry pipeline**
Implement each registry with type-safe maps, fallback defaults, and subscriber callbacks.

- [ ] **Step 4: Run test to verify it passes**
Run `npx vitest run tests/registries.test.ts`. Expected: PASS.

---

### Task 4: Zustand Reactive Guide Store

**Files:**
- Create: `src/framework/store/guideStore.ts`
- Test: `tests/store.test.ts`

**Interfaces:**
- Consumes: `guide-framework.ts`, `validationRegistry.ts`, `telemetryPipeline.ts`.
- Produces: `useGuideStore` hook and `guideStore` API (`setFieldValue`, `setActiveComponent`, `startTour`, `nextTourStep`, `prevTourStep`, `endTour`, `setMascot`, `setTourProvider`, `resetForm`, `setConfig`).

- [ ] **Step 1: Write failing tests for guideStore**
Test field validation runner (`required`, `email`, `min_length`, regex, custom validator), state updates, error clearing, active component focus, and telemetry emission.

- [ ] **Step 2: Run test to verify it fails**
Run `npx vitest run tests/store.test.ts`. Expected: FAIL.

- [ ] **Step 3: Implement guideStore with Zustand**
Implement state interface, actions, and validation engine hooking into `validationRegistry` and broadcasting to `telemetryPipeline`.

- [ ] **Step 4: Run test to verify it passes**
Run `npx vitest run tests/store.test.ts`. Expected: PASS.

---

### Task 5: Web Audio Procedural Sound Engine

**Files:**
- Create: `src/framework/audio/synthAudio.ts`

**Interfaces:**
- Produces: `synthAudio` singleton with `playFocus()`, `playSuccess()`, `playError()`, `playFanfare()`, `toggleMute()`, `isMuted()`.

- [ ] **Step 1: Implement Web Audio API procedural sound synthesizer**
Create safe AudioContext manager with gentle sine/triangle oscillators for friendly UI feedback tones. Gracefully handles SSR or browser autoplay restrictions.

- [ ] **Step 2: Verify type check passes**
Run `npx tsc --noEmit`.

---

### Task 6: Pluggable Vector Mascot Roster

**Files:**
- Create: `src/mascots/types.ts`
- Create: `src/mascots/NovaMascot.tsx`
- Create: `src/mascots/ByteMascot.tsx`
- Create: `src/mascots/PipMascot.tsx`
- Create: `src/mascots/initMascots.ts`

**Interfaces:**
- Consumes: `MascotExpression`, `MascotProps`, `mascotRegistry`.
- Produces: Renderers for Nova, Byte, and Pip with mathematical mouse eye-tracking, dynamic expression facial rigging, and registration in `mascotRegistry`.

- [ ] **Step 1: Implement NovaMascot (Cosmic Spark)**
Procedural SVG with fluid body gradient, pulsing antenna bulb, blushing cheeks, dynamic pupil coordinates, and expression styling.

- [ ] **Step 2: Implement ByteMascot (Cyber Droid)**
Retro robot SVG with CRT screen face, digital matrix LED eyes, dual antennas, and cyan/neon glowing shaders.

- [ ] **Step 3: Implement PipMascot (Sage Owl)**
Geometric avian mascot with tilting head, large circular owl lenses, expressive feather tufts, and violet/amber gradient body.

- [ ] **Step 4: Register all three mascots in mascotRegistry**
Write `initMascots.ts` and verify registration via unit test.

---

### Task 7: Collision-Aware Speech Bubble

**Files:**
- Create: `src/framework/components/GuideBubble.tsx`
- Test: `tests/bubble.test.ts`

**Interfaces:**
- Consumes: `useGuideStore`, `mascotRegistry`, `@floating-ui/react`.
- Produces: `<GuideBubble targetElement={...} />` component.

- [ ] **Step 1: Write test for GuideBubble formatting and a11y live region**
Verify `role="status"` and `aria-live="polite"` presence.

- [ ] **Step 2: Implement GuideBubble with @floating-ui/react**
Integrate `useFloating` with `autoUpdate`, `offset(14)`, `flip()`, `shift({ padding: 12 })`, dynamic directional tail pointer, active mascot renderer, and typewriter effect.

- [ ] **Step 3: Run test to verify it passes**
Run `npx vitest run tests/bubble.test.ts`. Expected: PASS.

---

### Task 8: Pluggable Tour System

**Files:**
- Create: `src/framework/tours/nativeSpotlightProvider.ts`
- Create: `src/framework/tours/driverJsProvider.ts`
- Create: `src/framework/components/NativeSpotlight.tsx`
- Test: `tests/tour.test.ts`

**Interfaces:**
- Consumes: `TourProvider` interface, `tourRegistry`, `driver.js`.
- Produces: Both Native SVG Spotlight overlay and Driver.js tour execution.

- [ ] **Step 1: Write unit test for Tour state and navigation**
Verify step progression, boundary clamping, and completion callbacks.

- [ ] **Step 2: Implement NativeSpotlightProvider and SVG overlay component**
Implement SVG mask cutout calculating bounding rect of target element, smooth scroll-into-view, and animated beacon ring.

- [ ] **Step 3: Implement DriverJsProvider**
Wrap `driver.js` with dark theme styling, integrating with guide store so mascot tracks active driver popover step.

- [ ] **Step 4: Run test to verify it passes**
Run `npx vitest run tests/tour.test.ts`. Expected: PASS.

---

### Task 9: Guided Form Inputs & Demo Playground

**Files:**
- Create: `src/framework/components/GuidedField.tsx`
- Create: `src/studio/components/PlaygroundForm.tsx`
- Create: `src/studio/config/defaultSchema.ts`

**Interfaces:**
- Consumes: `useGuideStore`, metadata configuration.
- Produces: `<GuidedField componentId="..." />` and full agency onboarding form demo.

- [ ] **Step 1: Implement GuidedField component**
Support text, email, select, textarea with metadata labels, required indicator, inline errors, focus tracking, and floating bubble anchor ref.

- [ ] **Step 2: Implement PlaygroundForm**
Build agency registration form card with Full Name, Work Email, Company Size, and a Custom Field demo showing pluggable validation.

---

### Task 10: Developer Studio & Pipeline Inspector

**Files:**
- Create: `src/studio/config/presets.ts`
- Create: `src/studio/components/HeaderBar.tsx`
- Create: `src/studio/components/inspector/InspectorPanel.tsx`
- Create: `src/studio/components/inspector/TelemetryTab.tsx`
- Create: `src/studio/components/inspector/SchemaEditorTab.tsx`
- Create: `src/studio/components/inspector/StateStoreTab.tsx`
- Create: `src/studio/components/inspector/PluginsTab.tsx`
- Create: `src/studio/components/inspector/EmotionSandboxTab.tsx`
- Create: `src/studio/StudioApp.tsx`

**Interfaces:**
- Consumes: All framework and mascot components.
- Produces: Full interactive studio application.

- [ ] **Step 1: Implement HeaderBar with quick controls**
Mascot dropdown, tour engine toggle, audio mute switch, Start Tour button, Reset Form button, Export JSON button.

- [ ] **Step 2: Implement 5 Inspector Tabs**
1. TelemetryTab: Live event feed with action badges, payload inspection, filtering, and copy-to-clipboard.
2. SchemaEditorTab: Live editable JSON editor with syntax error detection, preset picker (Agency, SaaS Checkout, DevOps CLI), and instant Apply button.
3. StateStoreTab: Live reactive view of Zustand store.
4. PluginsTab: Directory of registered mascots, validators, tour engines, and telemetry sinks with interactive custom validator registration demo.
5. EmotionSandboxTab: Grid of emotion buttons to trigger expressions on demand.

- [ ] **Step 3: Assemble StudioApp**
Layout with header, left column (mascot floating speech bubble + interactive form), right column (sticky DevTools inspector), and footer.

---

### Task 11: End-to-End Verification & Browser Validation

**Files:**
- Verify: `make test`
- Verify: `make lint`
- Verify: `make build`
- Verify: Dev server and browser rendering via Chrome DevTools / Playwright.

- [ ] **Step 1: Run full test suite via Makefile**
Run `make test`. Confirm 100% test pass.

- [ ] **Step 2: Run linter and typecheck via Makefile**
Run `make lint`. Confirm 0 errors.

- [ ] **Step 3: Run production build via Makefile**
Run `make build`. Confirm clean bundle output.

- [ ] **Step 4: Launch dev server and inspect in browser**
Run dev server and test mascot animation, eye tracking, validation reactions, tour execution, and devtools tabs.
