import { describe, it, expect, beforeEach, vi } from 'vitest';
import { synthAudio } from '../src/framework/audio/synthAudio';

describe('SynthAudio Procedural Synthesizer', () => {
  beforeEach(() => {
    synthAudio.setMuted(false);
  });

  it('toggles and manages mute state with persistence', () => {
    expect(synthAudio.isMuted()).toBe(false);
    synthAudio.toggleMute();
    expect(synthAudio.isMuted()).toBe(true);
    synthAudio.setMuted(false);
    expect(synthAudio.isMuted()).toBe(false);
  });

  it('safely invokes audio play methods without throwing in unmocked environment', () => {
    expect(() => synthAudio.playFocus()).not.toThrow();
    expect(() => synthAudio.playSuccess()).not.toThrow();
    expect(() => synthAudio.playError()).not.toThrow();
    expect(() => synthAudio.playFanfare()).not.toThrow();
  });

  it('connects and schedules audio nodes on Web Audio timeline when AudioContext is present', () => {
    const mockOsc = {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      onended: null as (() => void) | null,
    };

    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    const mockAudioContext = vi.fn().mockImplementation(() => ({
      state: 'running',
      currentTime: 10,
      destination: {},
      createOscillator: () => mockOsc,
      createGain: () => mockGain,
      resume: vi.fn().mockResolvedValue(undefined),
    }));

    (window as any).AudioContext = mockAudioContext;

    synthAudio.playFocus();

    expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalledWith(520, 10);
    expect(mockGain.gain.setValueAtTime).toHaveBeenCalled();
    expect(mockOsc.connect).toHaveBeenCalledWith(mockGain);
    expect(mockGain.connect).toHaveBeenCalled();
    expect(mockOsc.start).toHaveBeenCalledWith(10);

    // Call onended
    if (mockOsc.onended) {
      mockOsc.onended();
      expect(mockOsc.disconnect).toHaveBeenCalled();
      expect(mockGain.disconnect).toHaveBeenCalled();
    }
  });
});
