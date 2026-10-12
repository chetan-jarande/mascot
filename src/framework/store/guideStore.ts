import { create } from 'zustand';
import type {
  GuideConfig,
  MascotExpression,
  TelemetryEvent,
  TelemetryAction,
} from '../types/guide-framework';
import { validationRegistry } from '../registries/validationRegistry';
import { telemetryPipeline } from '../registries/telemetryPipeline';

export interface GuideState {
  config: GuideConfig | null;
  activeComponentId: string | null;
  fieldValues: Record<string, string>;
  fieldErrors: Record<string, string | null>;
  currentMessage: string;
  currentExpression: MascotExpression;
  activeMascotId: string;
  tourProviderId: string;
  tourActive: boolean;
  tourStep: number;
  telemetryLogs: TelemetryEvent[];
  soundEnabled: boolean;
  isSpeaking: boolean;

  // Actions
  initialize: (config: GuideConfig) => void;
  setConfig: (config: GuideConfig) => void;
  setActiveComponent: (componentId: string | null) => void;
  setFieldValue: (componentId: string, value: string) => void;
  validateField: (componentId: string, value?: string) => boolean;
  validateAll: () => boolean;
  setMascot: (mascotId: string) => void;
  setTourProvider: (providerId: string) => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  triggerExpression: (expression: MascotExpression, message?: string) => void;
  toggleSound: () => boolean;
  resetForm: () => void;
  clearTelemetry: () => void;
  logTelemetry: (
    componentId: string,
    action: TelemetryAction,
    metadata?: Record<string, any>
  ) => void;
}

const DEFAULT_FALLBACK_MESSAGE = 'Welcome! Let’s get you set up.';

export const useGuideStore = create<GuideState>((set, get) => ({
  config: null,
  activeComponentId: null,
  fieldValues: {},
  fieldErrors: {},
  currentMessage: DEFAULT_FALLBACK_MESSAGE,
  currentExpression: 'neutral',
  activeMascotId: 'nova',
  tourProviderId: 'native',
  tourActive: false,
  tourStep: 0,
  telemetryLogs: [],
  soundEnabled: true,
  isSpeaking: false,

  logTelemetry: (componentId, action, metadata = {}) => {
    const event: TelemetryEvent = {
      id: Math.random().toString(36).substring(2, 9),
      componentId,
      action,
      timestamp: Date.now(),
      metadata,
    };

    set((state) => ({
      telemetryLogs: [event, ...state.telemetryLogs.slice(0, 99)],
    }));

    telemetryPipeline.emit(event);
  },

  initialize: (config: GuideConfig) => {
    set({
      config,
      currentMessage: config.globalFallbacks?.idleMessage || DEFAULT_FALLBACK_MESSAGE,
      currentExpression: 'neutral',
    });
  },

  setConfig: (config: GuideConfig) => {
    set({ config });
  },

  setActiveComponent: (componentId: string | null) => {
    const { config, fieldErrors } = get();

    if (!componentId) {
      const hasErrors = Object.values(fieldErrors).some((err) => Boolean(err));
      set({
        activeComponentId: null,
        currentMessage: hasErrors
          ? (config?.globalFallbacks?.defaultError || 'Please resolve form errors.')
          : (config?.globalFallbacks?.idleMessage || DEFAULT_FALLBACK_MESSAGE),
        currentExpression: hasErrors ? 'error' : 'neutral',
      });
      get().logTelemetry('system', 'blur');
      return;
    }

    const comp = config?.components[componentId];
    if (comp) {
      const existingError = fieldErrors[componentId];
      if (!existingError) {
        set({
          activeComponentId: componentId,
          currentMessage: comp.infoMessage || config?.globalFallbacks?.idleMessage || 'Looking at this field...',
          currentExpression: comp.defaultExpression || 'neutral',
        });
      } else {
        set({
          activeComponentId: componentId,
          currentMessage: existingError,
          currentExpression: 'error',
        });
      }
      get().logTelemetry(componentId, 'focus');
    }
  },

  validateField: (componentId: string, customValue?: string): boolean => {
    const { config, fieldValues } = get();
    const value = customValue !== undefined ? customValue : (fieldValues[componentId] || '');
    const comp = config?.components[componentId];

    if (!comp || !comp.validations || comp.validations.length === 0) {
      set((state) => ({
        fieldErrors: { ...state.fieldErrors, [componentId]: null },
      }));
      return true;
    }

    let errorFound: string | null = null;
    let reactionFound: string | null = null;
    let failedRuleId: string | null = null;

    for (const rule of comp.validations) {
      let isInvalid = false;

      if (rule.type === 'required') {
        isInvalid = !value.trim();
      } else if (!value.trim()) {
        // Skip format and custom validation if empty and not required
        continue;
      } else if (rule.type === 'min_length') {
        const minLen = Number(rule.value) || 0;
        isInvalid = value.length < minLen;
      } else if (rule.type === 'email') {
        isInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      } else if (rule.type === 'regex') {
        if (rule.value == null || rule.value === '') continue;
        try {
          const regex = rule.value instanceof RegExp ? rule.value : new RegExp(String(rule.value));
          regex.lastIndex = 0;
          isInvalid = !regex.test(value);
        } catch {
          isInvalid = false;
        }
      } else if (rule.type === 'custom') {
        const validatorId = rule.customValidatorId || rule.id;
        const passed = validationRegistry.validate(validatorId, value, rule);
        isInvalid = !passed;
      }

      if (isInvalid) {
        errorFound = rule.errorMessage;
        reactionFound = rule.mascotReaction || rule.errorMessage;
        failedRuleId = rule.id;
        break;
      }
    }

    if (errorFound) {
      set((state) => ({
        fieldErrors: { ...state.fieldErrors, [componentId]: errorFound },
        currentMessage: reactionFound || errorFound,
        currentExpression: 'error',
      }));
      get().logTelemetry(componentId, 'validation_failed', {
        ruleId: failedRuleId,
        error: errorFound,
      });
      return false;
    }

    set((state) => ({
      fieldErrors: { ...state.fieldErrors, [componentId]: null },
      currentMessage: config?.globalFallbacks?.successMessage || 'Looking great! That input is valid. ✨',
      currentExpression: 'happy',
    }));
    get().logTelemetry(componentId, 'validation_success');
    return true;
  },

  setFieldValue: (componentId: string, value: string) => {
    set((state) => ({
      fieldValues: { ...state.fieldValues, [componentId]: value },
    }));

    get().validateField(componentId, value);
  },

  validateAll: (): boolean => {
    const { config } = get();
    if (!config) return true;

    let allValid = true;
    let firstFailedError: string | null = null;
    const keys = Object.keys(config.components);
    for (const key of keys) {
      const isValid = get().validateField(key);
      if (!isValid) {
        allValid = false;
        if (!firstFailedError) {
          firstFailedError = get().fieldErrors[key];
        }
      }
    }

    if (!allValid) {
      set({
        currentExpression: 'error',
        currentMessage: firstFailedError || config.globalFallbacks?.defaultError || 'Please resolve form errors.',
      });
    }

    get().logTelemetry('form', 'form_submit', { allValid });
    return allValid;
  },

  setMascot: (mascotId: string) => {
    set({ activeMascotId: mascotId });
    get().logTelemetry('mascot', 'expression_trigger', { activeMascotId: mascotId });
  },

  setTourProvider: (providerId: string) => {
    set({ tourProviderId: providerId });
  },

  startTour: () => {
    const { config } = get();
    if (!config) return;

    const firstStepKey = Object.keys(config.components).find(
      (k) => config.components[k].walkthrough?.stepIndex === 1
    );

    if (firstStepKey) {
      const comp = config.components[firstStepKey];
      set({
        tourActive: true,
        tourStep: 1,
        activeComponentId: firstStepKey,
        currentMessage: `Step 1: ${comp.walkthrough?.description || comp.label}`,
        currentExpression: 'guiding',
      });
      get().logTelemetry(firstStepKey, 'tour_start', { step: 1 });
    }
  },

  nextTourStep: () => {
    const { config, tourStep, tourActive } = get();
    if (!config || !tourActive) return;

    const totalSteps = Object.values(config.components).filter((c) => Boolean(c.walkthrough)).length;
    const nextStepNum = tourStep + 1;

    if (nextStepNum <= totalSteps) {
      const targetKey = Object.keys(config.components).find(
        (k) => config.components[k].walkthrough?.stepIndex === nextStepNum
      );

      if (targetKey) {
        const comp = config.components[targetKey];
        set({
          tourStep: nextStepNum,
          activeComponentId: targetKey,
          currentMessage: `Step ${nextStepNum}: ${comp.walkthrough?.description || comp.label}`,
          currentExpression: 'guiding',
        });
        get().logTelemetry(targetKey, 'tour_step', { step: nextStepNum });
      }
    } else {
      get().endTour();
    }
  },

  prevTourStep: () => {
    const { config, tourStep, tourActive } = get();
    if (!config || !tourActive || tourStep <= 1) return;

    const prevStepNum = tourStep - 1;
    const targetKey = Object.keys(config.components).find(
      (k) => config.components[k].walkthrough?.stepIndex === prevStepNum
    );

    if (targetKey) {
      const comp = config.components[targetKey];
      set({
        tourStep: prevStepNum,
        activeComponentId: targetKey,
        currentMessage: `Step ${prevStepNum}: ${comp.walkthrough?.description || comp.label}`,
        currentExpression: 'guiding',
      });
      get().logTelemetry(targetKey, 'tour_step', { step: prevStepNum });
    }
  },

  endTour: () => {
    const { config } = get();
    set({
      tourActive: false,
      tourStep: 0,
      activeComponentId: null,
      currentMessage: config?.globalFallbacks?.successMessage || 'Tour complete! You’re all set.',
      currentExpression: 'celebrating',
    });
    get().logTelemetry('walkthrough', 'tour_end');
  },

  triggerExpression: (expression: MascotExpression, message?: string) => {
    set({
      currentExpression: expression,
      ...(message ? { currentMessage: message } : {}),
    });
    get().logTelemetry('sandbox', 'expression_trigger', { expression, message });
  },

  toggleSound: () => {
    const newSoundState = !get().soundEnabled;
    set({ soundEnabled: newSoundState });
    return newSoundState;
  },

  resetForm: () => {
    const { config } = get();
    set({
      fieldValues: {},
      fieldErrors: {},
      activeComponentId: null,
      currentMessage: config?.globalFallbacks?.idleMessage || DEFAULT_FALLBACK_MESSAGE,
      currentExpression: 'neutral',
      tourActive: false,
      tourStep: 0,
    });
    get().logTelemetry('system', 'blur', { reset: true });
  },

  clearTelemetry: () => {
    set({ telemetryLogs: [] });
  },
}));

export const guideStore = useGuideStore;
