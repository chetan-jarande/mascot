import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { GuideBubble } from '../src/framework/components/GuideBubble';
import { useGuideStore } from '../src/framework/store/guideStore';
import { initMascots } from '../src/mascots/initMascots';

describe('Collision-Aware GuideBubble Component', () => {
  beforeEach(() => {
    initMascots();
    useGuideStore.getState().resetForm();
  });

  it('renders with accessibility live region attributes', () => {
    render(React.createElement(GuideBubble));
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeDefined();
    expect(liveRegion.getAttribute('aria-live')).toBe('polite');
  });

  it('displays active mascot name badge and current message', () => {
    useGuideStore.setState({
      currentMessage: 'Welcome to early access!',
      activeMascotId: 'nova',
      currentExpression: 'happy',
    });

    render(React.createElement(GuideBubble));
    expect(screen.getByText(/Nova/i)).toBeDefined();
    expect(screen.getByText(/happy/i)).toBeDefined();
  });
});
