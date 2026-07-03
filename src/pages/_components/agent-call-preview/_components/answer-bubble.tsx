import { motion } from 'motion/react';
import * as React from 'react';

/** Skeleton placeholder for the caller's answer. */
export function AnswerBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className='flex max-w-[66%] flex-col gap-2 self-end rounded-[16px_16px_5px_16px] bg-white/5 px-3.5 py-3'
    >
      <div className='h-[9px] w-[130px] rounded-[5px] bg-white/13' />
      <div className='h-[9px] w-[86px] rounded-[5px] bg-white/13' />
    </motion.div>
  );
}
