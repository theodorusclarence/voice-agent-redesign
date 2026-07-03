import * as React from 'react';

import { pixelFrames } from '../_utils/pixel-frames';

const FRAME_MS = 190;

/**
 * Grid of glowing pixels that morphs through shapes while the call plays,
 * and rests as a dim solid glyph when idle.
 *
 * Inspired by dessn_loader
 * Code generated from flutter codebase with Claude Code
 * @see https://github.com/ksokolovskyi/dessn_loader
 */
export function PixelLoader({
  playing,
  n = 4,
  size = 6,
  gap = 3.5,
  glow = 6,
}: {
  playing: boolean;
  n?: number;
  size?: number;
  gap?: number;
  glow?: number;
}) {
  const frames = React.useMemo(() => pixelFrames(n), [n]);
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(id);
  }, [playing]);

  // Idle always shows the solid first frame; frame counting only matters
  // while playing, so it doesn't need a reset on pause.
  const grid = frames[(playing ? frame : 0) % frames.length];

  return (
    <div
      className='grid w-max'
      style={{ gridTemplateColumns: `repeat(${n}, ${size}px)`, gap }}
    >
      {grid.map((cell, i) => {
        const on = cell === 1;
        return (
          <div
            key={i}
            className='bg-primary-500'
            style={{
              width: size,
              height: size,
              opacity: on ? 1 : 0.08,
              transform: on ? 'scale(1)' : 'scale(0.58)',
              boxShadow: on
                ? `0 0 ${glow}px var(--color-primary-500), 0 0 ${
                    glow * 2
                  }px color-mix(in oklab, var(--color-primary-500) 33%, transparent)`
                : 'none',
              transition:
                'opacity .17s ease, transform .17s ease, box-shadow .17s ease',
            }}
          />
        );
      })}
    </div>
  );
}
