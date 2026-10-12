import type { MascotDefinition } from '../types/guide-framework';

/**
 * Registry for pluggable mascot avatars.
 */
export class MascotRegistry {
  private mascots: Map<string, MascotDefinition> = new Map();

  register(mascot: MascotDefinition): void {
    this.mascots.set(mascot.id, mascot);
  }

  get(id: string): MascotDefinition | undefined {
    return this.mascots.get(id);
  }

  has(id: string): boolean {
    return this.mascots.has(id);
  }

  getAll(): MascotDefinition[] {
    return Array.from(this.mascots.values());
  }

  clear(): void {
    this.mascots.clear();
  }
}

export const mascotRegistry = new MascotRegistry();
