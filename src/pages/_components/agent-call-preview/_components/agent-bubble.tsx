import { cn } from 'cnfast';
import { motion } from 'motion/react';
import * as React from 'react';

import { SpeakingBars } from './speaking-bars';

/** A question the agent asks, highlighted while it is being spoken. */
export function AgentBubble({
  name,
  text,
  active,
}: {
  name: string;
  text: string;
  active?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className='flex max-w-[88%] flex-col gap-1.5 self-start'
    >
      <div className='flex items-center gap-2 pl-1'>
        <span className='c2 font-semibold tracking-wide text-neutral-400'>
          {name}
        </span>
        {active && <SpeakingBars />}
      </div>
      <div
        className={cn([
          'rounded-[5px_16px_16px_16px] border-[0.5px] pt-1.5 pl-2.5 pr-3 pb-2 text-sm leading-normal',
          'transition-colors duration-300',
          active
            ? 'border-primary-500/50 bg-primary-500/20 text-white'
            : 'border-white/8 bg-white/7 text-stone-200',
        ])}
      >
        {text}
      </div>
    </motion.div>
  );
}
