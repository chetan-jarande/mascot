import { describe, it, expect, beforeEach } from 'vitest';
import { useGuideStore } from '../src/framework/store/guideStore';
import { validationRegistry } from '../src/framework/registries/validationRegistry';
import type { GuideConfig } from '../src/framework/types/guide-framework';

const testConfig: GuideConfig = {
  version: '1.0.0',
  appNamespace: 'test-app',
  globalFallbacks: {
    idleMessage: 'Hello! I am ready to help.',
    successMessage: 'Everything looks great!',
    defaultError: 'Please check this field.',
  },
  components: {
    'user-name': {
      componentId: 'user-name',
      label: 'Your Name',
      placeholder: 'Enter name',
      infoMessage: 'Tell us your name.',
      defaultExpression: 'thinking',
      walkthrough: {
        stepIndex: 1,
        title: 'Your Name',
        description: 'First, introduce yourself.',
      },
      validations: [
        {
          id: 'req_name',
          type: 'required',
          errorMessage: 'Name is required.',
          mascotReaction: 'Please do not forget your name!',
        },
        {
          id: 'min_name',
          type: 'min_length',
          value: 3,
          errorMessage: 'Name must have at least 3 characters.',
          mascotReaction: 'A bit too short!',
        },
      ],
    },
    'user-email': {
      componentId: 'user-email',
      label: 'Your Email',
      placeholder: 'user@example.com',
      infoMessage: 'We send updates here.',
      defaultExpression: 'neutral',
      walkthrough: {
        stepIndex: 2,
        title: 'Work Email',
        description: 'Where should we contact you?',
      },
      validations: [
        {
          id: 'req_email',
          type: 'required',
          errorMessage: 'Email is required.',
        },
        {
          id: 'fmt_email',
          type: 'email',
          errorMessage: 'Enter a valid email.',
          mascotReaction: 'Hmm, check your email format.',
        },
      ],
    },
  },
};

describe('GuideStore & Validation Engine', () => {
  beforeEach(() => {
    validationRegistry.clear();
    useGuideStore.getState().initialize(testConfig);
    useGuideStore.getState().resetForm();
  });

  it('initializes with default state and config', () => {
    const state = useGuideStore.getState();
    expect(state.config).toEqual(testConfig);
    expect(state.activeComponentId).toBeNull();
    expect(state.currentExpression).toBe('neutral');
    expect(state.currentMessage).toBe(testConfig.globalFallbacks.idleMessage);
  });

  it('updates active component and triggers default expression on focus', () => {
    const store = useGuideStore.getState();
    store.setActiveComponent('user-name');

    const updated = useGuideStore.getState();
    expect(updated.activeComponentId).toBe('user-name');
    expect(updated.currentExpression).toBe('thinking');
    expect(updated.currentMessage).toBe('Tell us your name.');
  });

  it('validates required fields and updates mascot emotion to error', () => {
    const store = useGuideStore.getState();
    store.setFieldValue('user-name', '   ');

    const updated = useGuideStore.getState();
    expect(updated.fieldErrors['user-name']).toBe('Name is required.');
    expect(updated.currentExpression).toBe('error');
    expect(updated.currentMessage).toBe('Please do not forget your name!');
  });

  it('validates min_length rule', () => {
    const store = useGuideStore.getState();
    store.setFieldValue('user-name', 'Al');

    const updated = useGuideStore.getState();
    expect(updated.fieldErrors['user-name']).toBe('Name must have at least 3 characters.');
    expect(updated.currentExpression).toBe('error');
  });

  it('marks valid input and updates mascot emotion to happy', () => {
    const store = useGuideStore.getState();
    store.setFieldValue('user-name', 'Alex Morgan');

    const updated = useGuideStore.getState();
    expect(updated.fieldErrors['user-name']).toBeNull();
    expect(updated.currentExpression).toBe('happy');
  });

  it('validates email format', () => {
    const store = useGuideStore.getState();
    store.setFieldValue('user-email', 'invalid-email');

    let state = useGuideStore.getState();
    expect(state.fieldErrors['user-email']).toBe('Enter a valid email.');
    expect(state.currentExpression).toBe('error');

    store.setFieldValue('user-email', 'alex@company.com');
    state = useGuideStore.getState();
    expect(state.fieldErrors['user-email']).toBeNull();
    expect(state.currentExpression).toBe('happy');
  });

  it('supports pluggable custom validator from ValidationRegistry', () => {
    validationRegistry.register('valid_vip_code', (val) => val === 'VIP-999');

    const configWithCustom: GuideConfig = {
      ...testConfig,
      components: {
        ...testConfig.components,
        'vip-code': {
          componentId: 'vip-code',
          label: 'VIP Access Code',
          defaultExpression: 'thinking',
          validations: [
            {
              id: 'vip_val',
              type: 'custom',
              customValidatorId: 'valid_vip_code',
              errorMessage: 'Invalid VIP code.',
              mascotReaction: 'Only true VIPs allowed!',
            },
          ],
        },
      },
    };

    useGuideStore.getState().setConfig(configWithCustom);
    useGuideStore.getState().setFieldValue('vip-code', 'WRONG');

    expect(useGuideStore.getState().fieldErrors['vip-code']).toBe('Invalid VIP code.');

    useGuideStore.getState().setFieldValue('vip-code', 'VIP-999');
    expect(useGuideStore.getState().fieldErrors['vip-code']).toBeNull();
    expect(useGuideStore.getState().currentExpression).toBe('happy');
  });

  it('progresses through tour steps correctly', () => {
    const store = useGuideStore.getState();
    store.startTour();

    let state = useGuideStore.getState();
    expect(state.tourActive).toBe(true);
    expect(state.tourStep).toBe(1);
    expect(state.activeComponentId).toBe('user-name');
    expect(state.currentExpression).toBe('guiding');

    store.nextTourStep();
    state = useGuideStore.getState();
    expect(state.tourStep).toBe(2);
    expect(state.activeComponentId).toBe('user-email');

    store.prevTourStep();
    state = useGuideStore.getState();
    expect(state.tourStep).toBe(1);

    store.endTour();
    state = useGuideStore.getState();
    expect(state.tourActive).toBe(false);
  });

  it('sets error message and expression on focus when field has existing error', () => {
    const store = useGuideStore.getState();
    store.setFieldValue('user-name', '  '); // triggers error
    store.setActiveComponent(null); // blur

    store.setActiveComponent('user-name'); // re-focus
    const state = useGuideStore.getState();
    expect(state.activeComponentId).toBe('user-name');
    expect(state.currentExpression).toBe('error');
    expect(state.currentMessage).toBe('Name is required.');
  });

  it('does not advance tour step if tour is inactive', () => {
    const store = useGuideStore.getState();
    expect(store.tourActive).toBe(false);
    store.nextTourStep();
    expect(useGuideStore.getState().tourStep).toBe(0);
  });

  it('allows empty value on optional fields with format validations', () => {
    const configWithOptional: GuideConfig = {
      ...testConfig,
      components: {
        'opt-field': {
          componentId: 'opt-field',
          label: 'Optional Bio',
          defaultExpression: 'neutral',
          validations: [
            {
              id: 'min_opt',
              type: 'min_length',
              value: 10,
              errorMessage: 'Bio must be at least 10 chars if provided.',
            },
          ],
        },
      },
    };

    useGuideStore.getState().setConfig(configWithOptional);
    useGuideStore.getState().setFieldValue('opt-field', '');
    expect(useGuideStore.getState().fieldErrors['opt-field']).toBeNull();
    expect(useGuideStore.getState().currentExpression).toBe('happy');
  });

  it('validates regex patterns safely with state reset', () => {
    const configWithRegex: GuideConfig = {
      ...testConfig,
      components: {
        'phone-field': {
          componentId: 'phone-field',
          label: 'Phone Number',
          defaultExpression: 'neutral',
          validations: [
            {
              id: 'regex_phone',
              type: 'regex',
              value: /^[0-9]{3}-[0-9]{4}$/g,
              errorMessage: 'Format must be 123-4567.',
            },
          ],
        },
      },
    };

    useGuideStore.getState().setConfig(configWithRegex);
    useGuideStore.getState().setFieldValue('phone-field', '123-4567');
    expect(useGuideStore.getState().fieldErrors['phone-field']).toBeNull();

    // Call again with same valid string to verify lastIndex reset prevents false failures
    useGuideStore.getState().setFieldValue('phone-field', '123-4567');
    expect(useGuideStore.getState().fieldErrors['phone-field']).toBeNull();

    useGuideStore.getState().setFieldValue('phone-field', 'abc-defg');
    expect(useGuideStore.getState().fieldErrors['phone-field']).toBe('Format must be 123-4567.');
  });

  it('keeps error expression after validateAll if any field fails', () => {
    useGuideStore.getState().initialize(testConfig);
    const store = useGuideStore.getState();
    store.setFieldValue('user-email', 'valid@company.com');
    const allValid = store.validateAll(); // user-name is still empty
    expect(allValid).toBe(false);
    expect(useGuideStore.getState().currentExpression).toBe('error');
  });
});
