import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingMascotCompanion } from '../src/framework/components/FloatingMascotCompanion';
import { useGuideStore } from '../src/framework/store/guideStore';
import { initMascots } from '../src/mascots/initMascots';
import { DEFAULT_GUIDE_CONFIG } from '../src/studio/config/defaultSchema';

describe('FloatingMascotCompanion Spatial Component', () => {
  beforeEach(() => {
    initMascots();
    useGuideStore.getState().initialize(DEFAULT_GUIDE_CONFIG);
    useGuideStore.getState().resetForm();
  });

  it('renders floating companion with accessible status role', () => {
    render(React.createElement(FloatingMascotCompanion));

    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeDefined();
    expect(statusRegion.getAttribute('aria-live')).toBe('polite');
  });

  it('advances tour step when floating mascot is clicked during tour', () => {
    useGuideStore.getState().startTour();
    expect(useGuideStore.getState().tourStep).toBe(1);

    render(React.createElement(FloatingMascotCompanion));

    const mascotContainer = screen.getByTestId('floating-mascot-companion');
    const clickableMascot = mascotContainer.querySelector('.cursor-pointer');
    expect(clickableMascot).not.toBeNull();

    // Clicking mascot in tour advances step
    fireEvent.click(clickableMascot!);
    expect(useGuideStore.getState().tourStep).toBe(2);
  });

  it('toggles speech bubble open and closed on close button click', () => {
    render(React.createElement(FloatingMascotCompanion));

    const closeBtn = screen.getByTitle(/Minimize Bubble/i);
    expect(closeBtn).toBeDefined();

    fireEvent.click(closeBtn);
    // Bubble is now closed, reopen button appears
    const reopenBtn = screen.getByTitle(/Open Speech Bubble/i);
    expect(reopenBtn).toBeDefined();

    fireEvent.click(reopenBtn);
    expect(screen.getByRole('status')).toBeDefined();
  });
});
