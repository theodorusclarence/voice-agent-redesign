import { cn } from 'cnfast';
import * as React from 'react';

import { ROW_HEIGHT } from './constants';
import { DragHandle } from './drag-handle';

/** Presentational row — shared by the live list and the drag overlay. */
export const QuestionRow = React.forwardRef<
  HTMLDivElement,
  {
    isDragging?: boolean;
    isOverlay?: boolean;
    handleProps?: React.ComponentPropsWithRef<'button'>;
    inputProps?: React.ComponentPropsWithoutRef<'input'>;
    inputRef?: React.Ref<HTMLInputElement>;
    value: string;
    style?: React.CSSProperties;
  } & React.ComponentPropsWithoutRef<'div'>
>(
  (
    {
      isDragging,
      isOverlay,
      handleProps,
      inputProps,
      inputRef,
      value,
      style,
      ...rest
    },
    ref
  ) => {
    // The overlay row carries the lifted look statically (tilt + scale + shadow);
    // `question-lift` is a mount animation that eases in from the resting state,
    // so the pickup always animates without a requestAnimationFrame race. Using
    // the `transform` shorthand (not `rotate-*`/`scale-*`) keeps the static value
    // and the keyframe on the same property so they don't compose/fight.
    const restingCard =
      'border-black/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.03)]';
    const liftedCard = cn(
      '[transform:rotate(-1.6deg)_scale(1.025)]',
      'border-black/10 shadow-[0_18px_38px_rgba(0,0,0,0.18)]',
      'motion-safe:animate-question-lift'
    );

    return (
      <div
        ref={ref}
        style={{ height: ROW_HEIGHT, ...style }}
        className={cn('touch-none', isDragging && !isOverlay && 'opacity-0')}
        {...rest}
      >
        <div
          className={cn(
            'question-card',
            'flex h-full origin-center items-center gap-[13px] rounded-[14px] border bg-white pl-4 pr-2',
            isOverlay ? liftedCard : restingCard
          )}
        >
          <span className='h-5 w-5 flex-none rounded-full border-2 border-[#d6d6d0]' />
          <input
            ref={inputRef}
            value={value}
            placeholder='Type a question…'
            className={cn(
              'min-w-0 flex-1 border-none bg-transparent p-0 text-[15px] font-medium text-[#141414] outline-none',
              'placeholder:text-neutral-400',
              'focus-visible:ring-0'
            )}
            {...inputProps}
          />
          <DragHandle isDragging={isDragging || isOverlay} {...handleProps} />
        </div>
      </div>
    );
  }
);
