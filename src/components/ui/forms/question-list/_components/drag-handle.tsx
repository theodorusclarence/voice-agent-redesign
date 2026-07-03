import { DragDropVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

/** The 2×3 dotted grip that also acts as the keyboard-focusable drag handle. */
export const DragHandle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & { isDragging?: boolean }
>((props, ref) => {
  const { isDragging, className, ...rest } = props;
  return (
    <button
      ref={ref}
      type='button'
      aria-label='Drag to reorder question'
      className={cn(
        'grid place-items-center rounded-md p-1 px-0.5 text-neutral-400',
        'touch-none outline-none transition',
        'hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary-600/60',
        isDragging ? 'cursor-grabbing bg-neutral-100' : 'cursor-grab',
        className
      )}
      {...rest}
    >
      <HugeiconsIcon icon={DragDropVerticalIcon} size={17} />
    </button>
  );
});
