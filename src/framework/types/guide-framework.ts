import type React from 'react';

/**
 * Valid facial & emotional expressions supported across all mascot avatar renderers.
 */
export type MascotExpression =
  | 'neutral'
  | 'thinking'
  | 'happy'
  | 'error'
  | 'surprised'
  | 'guiding'
  | 'celebrating';

/**
 * Built-in and extensible validation strategies for form fields.
 */
export type ValidationType =
  | 'required'
  | 'email'
  | 'min_length'
  | 'regex'
  | 'custom';

/**
 * Configuration for a validation check attached to a guided component.
 */
export interface ValidationRule {
  id: string;
  type: ValidationType;
  value?: string | number | RegExp;
  errorMessage: string;
  mascotReaction?: string;
  customValidatorId?: string;
}

/**
 * Tour step configuration associated with a specific guided component.
 */
export interface WalkthroughStepMetadata {
  stepIndex: number;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Metadata definition for a single UI component or form field.
 */
export interface ComponentMetadata {
  componentId: string;
  label: string;
  placeholder?: string;
  infoMessage?: string;
  defaultExpression: MascotExpression;
  validations?: ValidationRule[];
  walkthrough?: {
    stepIndex: number;
    title: string;
    description: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
  };
}

/**
 * Default fallback messages used when no component-specific prompt is active.
 */
export interface GlobalFallbacks {
  idleMessage: string;
  successMessage: string;
  defaultError: string;
}

/**
 * Root metadata schema defining components, tour steps, and guide behaviors.
 */
export interface GuideConfig {
  version: string;
  appNamespace: string;
  components: Record<string, ComponentMetadata>;
  globalFallbacks: {
    idleMessage: string;
    successMessage: string;
    defaultError: string;
  };
}

/**
 * Supported telemetry interaction actions emitted across the guide lifecycle.
 */
export type TelemetryAction =
  | 'focus'
  | 'blur'
  | 'validation_failed'
  | 'validation_success'
  | 'tour_start'
  | 'tour_step'
  | 'tour_end'
  | 'form_submit'
  | 'expression_trigger';

/**
 * Structured analytics and telemetry event payload.
 */
export interface TelemetryEvent {
  id: string;
  componentId: string;
  action: TelemetryAction;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Normalized walkthrough tour step passed to tour engine implementations.
 */
export interface TourStep {
  stepIndex: number;
  componentId: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Contract that all pluggable onboarding tour engines must satisfy.
 */
export interface TourProvider {
  start(
    steps: TourStep[],
    onStepChange: (stepIndex: number) => void,
    onComplete: () => void
  ): void;
  next(): void;
  prev(): void;
  destroy(): void;
  getCurrentStep(): number;
}

/**
 * Props passed to vector mascot avatar components.
 */
export interface MascotRendererProps {
  expression: MascotExpression;
  isTalking?: boolean;
  size?: number;
  className?: string;
}

/**
 * Metadata and component binding for a registered mascot avatar.
 */
export interface MascotDefinition {
  id: string;
  name: string;
  description: string;
  personality: string;
  component: React.ComponentType<MascotRendererProps>;
}

/**
 * Signature for pluggable custom validator functions.
 */
export type CustomValidator = (
  value: unknown,
  rule: ValidationRule
) => boolean;

/**
 * Signature for pluggable telemetry analytics sinks.
 */
export type TelemetrySink = (event: TelemetryEvent) => void;
