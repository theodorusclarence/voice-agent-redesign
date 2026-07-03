import { describe, expect, it } from 'vitest';

import { pixelFrames } from '.';

describe('pixelFrames', () => {
  it('returns n×n masks of only 0s and 1s', () => {
    for (const n of [4, 5]) {
      for (const frame of pixelFrames(n)) {
        expect(frame).toHaveLength(n * n);
        expect(frame.every((cell) => cell === 0 || cell === 1)).toBe(true);
      }
    }
  });

  it('starts fully lit so the idle state shows a solid glyph', () => {
    const [full] = pixelFrames(4);
    expect(full.every((cell) => cell === 1)).toBe(true);
  });

  it('keeps the diamond edge cells on odd sizes', () => {
    const diamond = pixelFrames(5)[2];
    // middle row of a 5×5 diamond spans the full width
    expect(diamond.slice(10, 15)).toEqual([1, 1, 1, 1, 1]);
  });
});
