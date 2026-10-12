import type { CustomValidator, ValidationRule } from '../types/guide-framework';

/**
 * Registry for custom validation rules.
 */
export class ValidationRegistry {
  private validators: Map<string, CustomValidator> = new Map();

  register(id: string, validator: CustomValidator): void {
    this.validators.set(id, validator);
  }

  get(id: string): CustomValidator | undefined {
    return this.validators.get(id);
  }

  has(id: string): boolean {
    return this.validators.has(id);
  }

  validate(id: string, value: unknown, rule: ValidationRule): boolean {
    const validator = this.validators.get(id);
    if (!validator) {
      // Gracefully pass if validator definition is missing to prevent hard-blocking forms
      return true;
    }
    return validator(value, rule);
  }

  getAll(): string[] {
    return Array.from(this.validators.keys());
  }

  clear(): void {
    this.validators.clear();
  }
}

export const validationRegistry = new ValidationRegistry();
