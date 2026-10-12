import type { TourProvider, TourStep } from '../types/guide-framework';

export class NativeSpotlightProvider implements TourProvider {
  private steps: TourStep[] = [];
  private currentStepIndex: number = 0;
  private onStepChangeCallback: ((stepIndex: number) => void) | null = null;
  private onCompleteCallback: (() => void) | null = null;

  public start(
    steps: TourStep[],
    onStepChange: (stepIndex: number) => void,
    onComplete: () => void
  ): void {
    this.steps = [...steps].sort((a, b) => a.stepIndex - b.stepIndex);
    this.onStepChangeCallback = onStepChange;
    this.onCompleteCallback = onComplete;
    this.currentStepIndex = 1;

    this.scrollToStep(1);
    this.onStepChangeCallback?.(1);
  }

  public next(): void {
    if (this.currentStepIndex < this.steps.length) {
      this.currentStepIndex++;
      this.scrollToStep(this.currentStepIndex);
      this.onStepChangeCallback?.(this.currentStepIndex);
    } else {
      const onComplete = this.onCompleteCallback;
      this.destroy();
      onComplete?.();
    }
  }

  public prev(): void {
    if (this.currentStepIndex > 1) {
      this.currentStepIndex--;
      this.scrollToStep(this.currentStepIndex);
      this.onStepChangeCallback?.(this.currentStepIndex);
    }
  }

  public destroy(): void {
    this.currentStepIndex = 0;
    this.onStepChangeCallback = null;
    this.onCompleteCallback = null;
  }

  public getCurrentStep(): number {
    return this.currentStepIndex;
  }

  private scrollToStep(stepNumber: number): void {
    if (typeof document === 'undefined') return;
    const step = this.steps.find((s) => s.stepIndex === stepNumber);
    if (!step) return;

    const el = document.querySelector(`[data-guide-id="${step.componentId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
