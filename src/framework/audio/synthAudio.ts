/**
 * Web Audio API procedural sound synthesizer.
 * Zero external audio downloads. Generates UI sound feedback in real-time.
 */
export class SynthAudio {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check localStorage if available
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
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
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
    startGain: number = 0.05
  ): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(startGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationMs / 1000);
    } catch {
      // Safely ignore audio generation failures
    }
  }

  public playFocus(): void {
    this.playTone(520, 60, 'sine', 0.04);
  }

  public playSuccess(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [587.33, 739.99, 880]; // D5, F#5, A5 chord
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 120, 'sine', 0.04);
        }, idx * 60);
      });
    } catch {
      // Ignore
    }
  }

  public playError(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.playTone(220, 100, 'triangle', 0.05);
      setTimeout(() => {
        this.playTone(185, 120, 'triangle', 0.05);
      }, 70);
    } catch {
      // Ignore
    }
  }

  public playFanfare(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const arpeggio = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      arpeggio.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 160, 'sine', 0.05);
        }, idx * 80);
      });
    } catch {
      // Ignore
    }
  }
}

export const synthAudio = new SynthAudio();
