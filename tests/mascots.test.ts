import { describe, it, expect, beforeEach } from 'vitest';
import { mascotRegistry } from '../src/framework/registries/mascotRegistry';
import { initMascots } from '../src/mascots/initMascots';
import { NovaMascot } from '../src/mascots/NovaMascot';
import { ByteMascot } from '../src/mascots/ByteMascot';
import { PipMascot } from '../src/mascots/PipMascot';
import React from 'react';
import { render } from '@testing-library/react';

describe('Pluggable Vector Mascot Roster', () => {
  beforeEach(() => {
    mascotRegistry.clear();
    initMascots();
  });

  it('registers Nova, Byte, and Pip in mascotRegistry', () => {
    expect(mascotRegistry.has('nova')).toBe(true);
    expect(mascotRegistry.has('byte')).toBe(true);
    expect(mascotRegistry.has('pip')).toBe(true);

    const all = mascotRegistry.getAll();
    expect(all).toHaveLength(3);
    expect(all.map((m) => m.id)).toEqual(['nova', 'byte', 'pip']);
  });

  it('renders NovaMascot with vector SVG elements', () => {
    const { container } = render(React.createElement(NovaMascot, { expression: 'happy' }));
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 120 120');
  });

  it('renders ByteMascot with CRT screen face and matrix styling', () => {
    const { container } = render(React.createElement(ByteMascot, { expression: 'error' }));
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 120 120');
  });

  it('renders PipMascot with geometric owl plumage and lenses', () => {
    const { container } = render(React.createElement(PipMascot, { expression: 'thinking' }));
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 120 120');
  });
});
