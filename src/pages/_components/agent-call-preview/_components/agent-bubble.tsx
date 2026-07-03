import { cn } from 'cnfast';
import { motion, type Variants } from 'motion/react';
import * as React from 'react';

import Typography from '@/components/ui/typography';

import { SpeakingBars } from './speaking-bars';

const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut', staggerChildren: 0.045 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 2, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/**
 * A question the agent asks, highlighted while it is being spoken. `animated`
 * plays the word-by-word fade — only wanted while the call simulation runs;
 * the idle transcript renders statically.
 */
export function AgentBubble({
  text,
  active,
  animated,
}: {
  text: string;
  active?: boolean;
  animated?: boolean;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <motion.div
      // `initial={false}` renders straight in the visible state, skipping
      // the enter animation for the whole tree (words included).
      initial={animated ? 'hidden' : false}
      animate='visible'
      variants={bubbleVariants}
      className='flex max-w-[88%] flex-col gap-1.5 self-start shrink-0'
    >
      <div className='flex items-center gap-2 pl-1'>
        <Typography
          as='span'
          variant='c2'
          className='font-normal tracking-wide text-neutral-400'
        >
          Voice Agent
        </Typography>
        {active && <SpeakingBars />}
      </div>
      <div
        className={cn([
          'w-fit',
          'rounded-[5px_16px_16px_16px] border-[0.5px] pt-1.5 pl-2.5 pr-3 pb-2 text-sm leading-normal',
          'transition-colors duration-300',
          active
            ? 'border-primary-500/50 bg-primary-500/20 text-stone-50'
            : 'border-white/8 bg-white/7 text-stone-300',
        ])}
      >
        {animated
          ? words.map((word, i) => (
              <React.Fragment key={i}>
                <motion.span variants={wordVariants} className='inline-block'>
                  {word}
                </motion.span>{' '}
              </React.Fragment>
            ))
          : text}
      </div>
    </motion.div>
  );
}
