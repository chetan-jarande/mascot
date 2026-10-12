import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tourRegistry } from '../src/framework/registries/tourRegistry';
import { NativeSpotlightProvider } from '../src/framework/tours/nativeSpotlightProvider';
import { initTours } from '../src/framework/tours/initTours';
import type { TourStep } from '../src/framework/types/guide-framework';

describe('Pluggable Tour System', () => {
  beforeEach(() => {
    tourRegistry.clear();
    initTours();
  });

  it('registers native and driver tour providers in tourRegistry', () => {
    expect(tourRegistry.has('native')).toBe(true);
    expect(tourRegistry.has('driver')).toBe(true);
    const providers = tourRegistry.getAll();
    expect(providers.map((p) => p.id)).toEqual(['native', 'driver']);
  });

  it('navigates tour steps sequentially with boundary clamping in NativeSpotlightProvider', () => {
    const provider = new NativeSpotlightProvider();
    const steps: TourStep[] = [
      { stepIndex: 1, componentId: 'comp-1', title: 'Step 1', description: 'Desc 1' },
      { stepIndex: 2, componentId: 'comp-2', title: 'Step 2', description: 'Desc 2' },
    ];

    const onStepChange = vi.fn();
    const onComplete = vi.fn();

    provider.start(steps, onStepChange, onComplete);
    expect(provider.getCurrentStep()).toBe(1);
    expect(onStepChange).toHaveBeenCalledWith(1);

    provider.next();
    expect(provider.getCurrentStep()).toBe(2);
    expect(onStepChange).toHaveBeenCalledWith(2);

    // Call next past end -> triggers onComplete
    provider.next();
    expect(onComplete).toHaveBeenCalled();

    provider.destroy();
  });

  it('navigates backward with boundary check in NativeSpotlightProvider', () => {
    const provider = new NativeSpotlightProvider();
    const steps: TourStep[] = [
      { stepIndex: 1, componentId: 'comp-1', title: 'Step 1', description: 'Desc 1' },
      { stepIndex: 2, componentId: 'comp-2', title: 'Step 2', description: 'Desc 2' },
    ];

    const onStepChange = vi.fn();
    const onComplete = vi.fn();

    provider.start(steps, onStepChange, onComplete);
    provider.next(); // to step 2
    expect(provider.getCurrentStep()).toBe(2);

    provider.prev(); // back to step 1
    expect(provider.getCurrentStep()).toBe(1);

    provider.prev(); // cannot go before 1
    expect(provider.getCurrentStep()).toBe(1);

    provider.destroy();
  });
});
