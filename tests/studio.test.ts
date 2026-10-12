import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudioApp } from '../src/studio/StudioApp';
import { InspectorPanel } from '../src/studio/components/inspector/InspectorPanel';

describe('StudioApp & InspectorPanel', () => {
  it('renders StudioApp with header, mascot companion, form, and inspector', () => {
    render(React.createElement(StudioApp));

    expect(screen.getByText(/Metadata-Driven Mascot Framework/i)).toBeDefined();
    expect(screen.getByText(/Agency Early Access Registration/i)).toBeDefined();
    expect(screen.getByText(/Telemetry Stream/i)).toBeDefined();
  });

  it('switches between inspector tabs correctly', () => {
    render(React.createElement(InspectorPanel));

    // Telemetry tab default
    expect(screen.getByText(/Telemetry Stream/i)).toBeDefined();

    // Switch to Schema Editor
    const schemaTabBtn = screen.getByText(/Schema Editor/i);
    fireEvent.click(schemaTabBtn);
    expect(screen.getByText(/Apply Schema/i)).toBeDefined();

    // Switch to Store State
    const stateTabBtn = screen.getByText(/Store State/i);
    fireEvent.click(stateTabBtn);
    expect(screen.getByText(/Active Focused Node/i)).toBeDefined();

    // Switch to Plugins & Registries
    const pluginsTabBtn = screen.getByText(/Plugins & Registries/i);
    fireEvent.click(pluginsTabBtn);
    expect(screen.getByText(/Decoupled Registries/i)).toBeDefined();

    // Switch to Emotion Sandbox
    const emotionsTabBtn = screen.getByText(/Emotion Sandbox/i);
    fireEvent.click(emotionsTabBtn);
    expect(screen.getByText(/Direct Facial Rigging Triggers/i)).toBeDefined();
  });
});
