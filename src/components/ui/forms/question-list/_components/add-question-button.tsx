import { AddIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

export const AddQuestionButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'flex w-full items-center gap-2 rounded-[14px] border border-dashed border-black/[0.14]',
        'bg-[#fafaf8] px-2.5 py-2.5 text-sm text-neutral-400',
        'transition hover:border-primary-600/40 hover:text-primary-600',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/60',
        'group',
        className
      )}
      {...rest}
    >
      <HugeiconsIcon icon={AddIcon} size={18} />
      <span>Add question</span>
    </button>
  );
});
