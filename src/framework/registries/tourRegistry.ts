import type { TourProvider } from '../types/guide-framework';

export interface TourProviderEntry {
  id: string;
  name: string;
  factory: () => TourProvider;
}

/**
 * Registry for onboarding walkthrough tour providers.
 */
export class TourRegistry {
  private providers: Map<string, TourProviderEntry> = new Map();

  register(id: string, name: string, factory: () => TourProvider): void {
    this.providers.set(id, { id, name, factory });
  }

  get(id: string): (() => TourProvider) | undefined {
    return this.providers.get(id)?.factory;
  }

  has(id: string): boolean {
    return this.providers.has(id);
  }

  getAll(): { id: string; name: string }[] {
    return Array.from(this.providers.values()).map(({ id, name }) => ({ id, name }));
  }

  clear(): void {
    this.providers.clear();
  }
}

export const tourRegistry = new TourRegistry();
