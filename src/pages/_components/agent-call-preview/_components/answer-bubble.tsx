import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

/**
 * The caller's side of a turn. While `typing`, three bouncing dots; once the
 * answer "lands", the same bubble morphs into the skeleton lines — one
 * persistent element whose size animates via `layout` while the contents
 * crossfade, instead of a hard swap between two components.
 */
export function AnswerBubble({ typing, id }: { typing?: boolean; id: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className='max-w-[66%] self-end overflow-hidden shrink-0 rounded-[16px_16px_5px_16px] bg-white/5'
    >
      <AnimatePresence mode='popLayout' initial={false}>
        {typing ? (
          <motion.div
            key='typing'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='flex gap-[5px] px-4 py-3.5'
          >
            {/* Bounce lives in CSS on `translate`, which stacks with the
                `transform` the layout projection writes every frame — a
                motion keyframe animation on `y` gets stomped by it. */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                layoutId={`${id}-dot-${i + 1}`}
                className='animate-typing-dot size-[7px] rounded-full bg-white/40'
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key='answer'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='flex flex-col gap-2 px-3.5 py-3'
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
              className='h-[9px] w-[130px] rounded-[5px] bg-white/5'
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2, ease: 'easeOut' }}
              className='h-[9px] w-[86px] rounded-[5px] bg-white/3'
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
