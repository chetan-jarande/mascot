import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mascotRegistry } from '../src/framework/registries/mascotRegistry';
import { validationRegistry } from '../src/framework/registries/validationRegistry';
import { tourRegistry } from '../src/framework/registries/tourRegistry';
import { telemetryPipeline } from '../src/framework/registries/telemetryPipeline';
import type { MascotDefinition, TourProvider, TelemetryEvent } from '../src/framework/types/guide-framework';

describe('Plug-in-Play Registries & Telemetry Pipeline', () => {
  describe('MascotRegistry', () => {
    beforeEach(() => {
      mascotRegistry.clear();
    });

    it('registers and retrieves a mascot definition', () => {
      const mockComponent = () => null;
      const def: MascotDefinition = {
        id: 'test-mascot',
        name: 'Test Mascot',
        description: 'Test description',
        personality: 'Friendly',
        component: mockComponent,
      };

      mascotRegistry.register(def);
      expect(mascotRegistry.has('test-mascot')).toBe(true);
      expect(mascotRegistry.get('test-mascot')).toEqual(def);
      expect(mascotRegistry.getAll()).toHaveLength(1);
    });

    it('returns undefined for non-existent mascot', () => {
      expect(mascotRegistry.get('unknown')).toBeUndefined();
    });
  });

  describe('ValidationRegistry', () => {
    beforeEach(() => {
      validationRegistry.clear();
    });

    it('registers and runs custom validation rules', () => {
      validationRegistry.register('starts_with_test', (val) => {
        return typeof val === 'string' && val.startsWith('test');
      });

      expect(validationRegistry.has('starts_with_test')).toBe(true);
      expect(
        validationRegistry.validate('starts_with_test', 'test-123', {
          id: 'v1',
          type: 'custom',
          errorMessage: 'Invalid',
        })
      ).toBe(true);
      expect(
        validationRegistry.validate('starts_with_test', 'invalid', {
          id: 'v1',
          type: 'custom',
          errorMessage: 'Invalid',
        })
      ).toBe(false);
    });

    it('returns true if validator not found to avoid hard-locking unhandled rules', () => {
      expect(
        validationRegistry.validate('missing_validator', 'any', {
          id: 'v1',
          type: 'custom',
          errorMessage: 'Missing',
        })
      ).toBe(true);
    });
  });

  describe('TourRegistry', () => {
    beforeEach(() => {
      tourRegistry.clear();
    });

    it('registers and instantiates tour providers', () => {
      const mockProvider: TourProvider = {
        start: vi.fn(),
        next: vi.fn(),
        prev: vi.fn(),
        destroy: vi.fn(),
        getCurrentStep: () => 0,
      };

      tourRegistry.register('mock-tour', 'Mock Tour Provider', () => mockProvider);
      expect(tourRegistry.has('mock-tour')).toBe(true);
      const factory = tourRegistry.get('mock-tour');
      expect(factory).toBeDefined();
      expect(factory!()).toBe(mockProvider);
      expect(tourRegistry.getAll()).toEqual([{ id: 'mock-tour', name: 'Mock Tour Provider' }]);
    });
  });

  describe('TelemetryPipeline', () => {
    beforeEach(() => {
      telemetryPipeline.clearSinks();
    });

    it('subscribes sinks and broadcasts telemetry events', () => {
      const sink1 = vi.fn();
      const sink2 = vi.fn();

      const unsubscribe1 = telemetryPipeline.addSink(sink1);
      telemetryPipeline.addSink(sink2);

      const event: TelemetryEvent = {
        id: 'evt-1',
        componentId: 'field-name',
        action: 'focus',
        timestamp: 123456789,
        metadata: { input: 'hello' },
      };

      telemetryPipeline.emit(event);
      expect(sink1).toHaveBeenCalledWith(event);
      expect(sink2).toHaveBeenCalledWith(event);

      unsubscribe1();
      telemetryPipeline.emit({ ...event, id: 'evt-2' });
      expect(sink1).toHaveBeenCalledTimes(1);
      expect(sink2).toHaveBeenCalledTimes(2);
    });
  });
});
