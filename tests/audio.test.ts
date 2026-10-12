import { describe, it, expect, beforeEach } from 'vitest';
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

  it('safely invokes audio play methods without throwing', () => {
    expect(() => synthAudio.playFocus()).not.toThrow();
    expect(() => synthAudio.playSuccess()).not.toThrow();
    expect(() => synthAudio.playError()).not.toThrow();
    expect(() => synthAudio.playFanfare()).not.toThrow();
  });
});
