/**
 * Web Audio API procedural sound synthesizer.
 * Zero external audio downloads. Generates UI sound feedback in real-time.
 */
export class SynthAudio {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('mascot_sound_muted');
        if (stored !== null) {
          this.muted = stored === 'true';
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (this.ctx && this.ctx.state === 'closed') {
      this.ctx = null;
    }
    if (!this.ctx) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('mascot_sound_muted', String(muted));
      }
    } catch {
      // Ignore
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private playTone(
    freq: number,
    durationMs: number,
    type: OscillatorType = 'sine',
    startGain: number = 0.05,
    delaySec: number = 0
  ): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime + delaySec;
      const stopTime = startTime + durationMs / 1000;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(startGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore
        }
      };

      osc.start(startTime);
      osc.stop(stopTime);
    } catch {
      // Safely ignore audio generation failures
    }
  }

  public playFocus(): void {
    this.playTone(520, 60, 'sine', 0.04);
  }

  public playSuccess(): void {
    if (this.muted) return;
    // Arpeggiated cheerful major chord (D5, F#5, A5) scheduled directly on audio timeline
    const notes = [587.33, 739.99, 880];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 120, 'sine', 0.04, idx * 0.06);
    });
  }

  public playError(): void {
    if (this.muted) return;
    // Soft low double warning blip scheduled directly on audio timeline
    this.playTone(220, 100, 'triangle', 0.05, 0);
    this.playTone(185, 120, 'triangle', 0.05, 0.07);
  }

  public playFanfare(): void {
    if (this.muted) return;
    // Celebratory ascending sequence (C5, E5, G5, C6) scheduled on audio timeline
    const arpeggio = [523.25, 659.25, 783.99, 1046.5];
    arpeggio.forEach((freq, idx) => {
      this.playTone(freq, 160, 'sine', 0.05, idx * 0.08);
    });
  }
}

export const synthAudio = new SynthAudio();
