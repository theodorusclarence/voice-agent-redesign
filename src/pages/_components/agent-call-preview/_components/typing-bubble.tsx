import { motion } from 'motion/react';
import * as React from 'react';

/** Three bouncing dots while the caller is "answering". */
export function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className='flex gap-[5px] self-end rounded-[16px_16px_5px_16px] bg-white/6 px-4 py-3.5'
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className='size-[7px] rounded-full bg-white/40'
          animate={{ y: [0, -4, 0, 0], opacity: [0.45, 1, 0.45, 0.45] }}
          transition={{
            duration: 1.1,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.16,
            times: [0, 0.3, 0.6, 1],
          }}
        />
      ))}
    </motion.div>
  );
}
