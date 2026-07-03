import { motion } from 'motion/react';
import * as React from 'react';

/** Tiny 4-bar equalizer shown next to the agent's name while it speaks. */
export function SpeakingBars() {
  return (
    <div className='flex h-[11px] items-end gap-[2.5px]'>
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className='h-full w-[2.5px] origin-bottom rounded-xs bg-primary-500'
          animate={{ scaleY: [0.32, 1, 0.32] }}
          transition={{
            duration: 0.85,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  );
}
