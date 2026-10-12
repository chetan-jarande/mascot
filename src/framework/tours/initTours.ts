import { tourRegistry } from '../registries/tourRegistry';
import { NativeSpotlightProvider } from './nativeSpotlightProvider';
import { DriverJsProvider } from './driverJsProvider';

export function initTours(): void {
  tourRegistry.register('native', 'Native SVG Spotlight', () => new NativeSpotlightProvider());
  tourRegistry.register('driver', 'Driver.js Guided Tour', () => new DriverJsProvider());
}
