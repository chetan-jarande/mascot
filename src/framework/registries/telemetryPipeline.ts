import type { TelemetryEvent, TelemetrySink } from '../types/guide-framework';

/**
 * Event bus and pipeline for telemetry and analytics.
 */
export class TelemetryPipeline {
  private sinks: Set<TelemetrySink> = new Set();

  addSink(sink: TelemetrySink): () => void {
    this.sinks.add(sink);
    return () => {
      this.sinks.delete(sink);
    };
  }

  emit(event: TelemetryEvent): void {
    this.sinks.forEach((sink) => {
      try {
        sink(event);
      } catch (err) {
        console.error('[TelemetryPipeline] Sink threw an error:', err);
      }
    });
  }

  clearSinks(): void {
    this.sinks.clear();
  }

  getSinkCount(): number {
    return this.sinks.size;
  }
}

export const telemetryPipeline = new TelemetryPipeline();
