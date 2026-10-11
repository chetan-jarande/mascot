import { describe, it, expect } from 'vitest';

describe('Project Scaffold Environment', () => {
  it('loads test runner with jsdom environment properly', () => {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
    const div = document.createElement('div');
    div.textContent = 'Mascot Studio';
    expect(div.textContent).toBe('Mascot Studio');
  });
});
