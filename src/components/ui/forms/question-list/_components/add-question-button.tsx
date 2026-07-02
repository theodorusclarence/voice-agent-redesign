import { AddCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

/** Dashed row control for appending a new question to the list. */
export const AddQuestionButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'flex w-full items-center gap-2.5 rounded-[14px] border border-dashed border-black/[0.14]',
        'bg-[#fafaf8] px-4 py-3.5 text-sm font-medium text-[#8a8a86]',
        'transition hover:border-primary-600/40 hover:text-primary-600',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/60',
        className
      )}
      {...rest}
    >
      <HugeiconsIcon icon={AddCircleIcon} size={20} />
      Add question
    </button>
  );
});
