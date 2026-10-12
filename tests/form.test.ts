import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuidedField } from '../src/framework/components/GuidedField';
import { PlaygroundForm } from '../src/studio/components/PlaygroundForm';
import { useGuideStore } from '../src/framework/store/guideStore';
import { DEFAULT_GUIDE_CONFIG } from '../src/studio/config/defaultSchema';
import { validationRegistry } from '../src/framework/registries/validationRegistry';

describe('GuidedField & PlaygroundForm', () => {
  beforeEach(() => {
    validationRegistry.clear();
    validationRegistry.register('vip_token_validator', (val) => {
      return typeof val === 'string' && val.startsWith('VIP-');
    });

    useGuideStore.getState().initialize(DEFAULT_GUIDE_CONFIG);
    useGuideStore.getState().resetForm();
  });

  it('renders GuidedField with label, placeholder, and metadata id', () => {
    render(React.createElement(GuidedField, { componentId: 'full-name' }));

    expect(screen.getByText(/Full Legal Name/i)).toBeDefined();
    const input = screen.getByPlaceholderText(/e.g. Alex Morgan/i);
    expect(input).toBeDefined();

    // Focus triggers active component in store
    fireEvent.focus(input);
    expect(useGuideStore.getState().activeComponentId).toBe('full-name');
  });

  it('renders PlaygroundForm and submits valid entries', () => {
    render(React.createElement(PlaygroundForm));

    const nameInput = screen.getByPlaceholderText(/e.g. Alex Morgan/i);
    const emailInput = screen.getByPlaceholderText(/alex@agency.com/i);
    const submitBtn = screen.getByText(/Submit Access Request/i);

    fireEvent.change(nameInput, { target: { value: 'Alex Morgan' } });
    fireEvent.change(emailInput, { target: { value: 'alex@company.com' } });

    // Try submit without required company size
    fireEvent.click(submitBtn);
    expect(useGuideStore.getState().fieldErrors['company-size']).toBe('Please select your team size.');

    // Provide company size
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '6-25' } });

    // Submit now succeeds
    fireEvent.click(submitBtn);
    expect(screen.getByText(/Registration Complete!/i)).toBeDefined();
  });
});
