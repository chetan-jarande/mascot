import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import type { TourProvider, TourStep } from '../types/guide-framework';

export class DriverJsProvider implements TourProvider {
  private driverObj: ReturnType<typeof driver> | null = null;
  private currentStepIndex: number = 0;
  private steps: TourStep[] = [];

  public start(
    steps: TourStep[],
    onStepChange: (stepIndex: number) => void,
    onComplete: () => void
  ): void {
    this.steps = [...steps].sort((a, b) => a.stepIndex - b.stepIndex);
    this.currentStepIndex = 1;

    const driverSteps = this.steps.map((step) => ({
      element: `[data-guide-id="${step.componentId}"]`,
      popover: {
        title: step.title,
        description: step.description,
        side: step.placement || 'bottom',
        align: 'start' as const,
      },
    }));

    try {
      this.driverObj = driver({
        showProgress: true,
        allowClose: true,
        steps: driverSteps,
        onDestroyed: () => {
          this.destroy();
          onComplete();
        },
        onHighlightStarted: (_element, _step, options) => {
          const activeIndex = options?.state?.activeIndex ?? 0;
          this.currentStepIndex = activeIndex + 1;
          onStepChange(this.currentStepIndex);
        },
      });

      this.driverObj.drive();
    } catch {
      // Fallback for non-browser/test environments
      onStepChange(1);
    }
  }

  public next(): void {
    if (this.driverObj) {
      this.driverObj.moveNext();
    }
  }

  public prev(): void {
    if (this.driverObj) {
      this.driverObj.movePrevious();
    }
  }

  public destroy(): void {
    if (this.driverObj) {
      try {
        this.driverObj.destroy();
      } catch {
        // Ignore
      }
      this.driverObj = null;
    }
    this.currentStepIndex = 0;
  }

  public getCurrentStep(): number {
    return this.currentStepIndex;
  }
}
