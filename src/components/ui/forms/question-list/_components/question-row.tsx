import NumberFlow from '@number-flow/react';
import { cn } from 'cnfast';
import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { ROW_HEIGHT } from './constants';
import { DragHandle } from './drag-handle';

/** Presentational row — shared by the live list and the drag overlay. */
export const QuestionRow = React.forwardRef<
  HTMLDivElement,
  {
    isDragging?: boolean;
    isOverlay?: boolean;
    handleProps?: React.ComponentPropsWithRef<'button'>;
    // `style` omitted — TextareaAutosize owns it (numeric height while sizing).
    inputProps?: Omit<React.ComponentPropsWithoutRef<'textarea'>, 'style'>;
    inputRef?: React.Ref<HTMLTextAreaElement>;
    value: string;
    /** 1-based position shown at the start of the row. */
    position: number;
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
      position,
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
        style={style}
        className={cn('touch-none', isDragging && !isOverlay && 'opacity-0')}
        {...rest}
      >
        <div
          // min-height keeps the single-line rhythm; the autosizing textarea
          // grows the card for wrapped questions. `items-start` + `py-4`
          // (16 + 20px line + 16 = 52) pins the number and handle to the first
          // text line, so multi-line rows stay balanced instead of the number
          // floating between lines.
          style={{ minHeight: ROW_HEIGHT }}
          className={cn(
            'question-card',
            'flex origin-center items-start rounded-2xl border bg-white',
            'gap-1.5',
            'py-2.5 pl-2.25 pr-1.5',
            isOverlay ? liftedCard : restingCard
          )}
        >
          <span className='w-5 flex-none text-center b3 font-medium leading-5 tabular-nums text-neutral-400'>
            {isOverlay ? (
              // The overlay's number tracks the projected drop position while
              // dragging; NumberFlow rolls between values instead of snapping.
              // Background rows keep a plain number — they swap identity, not
              // value, so animating them would roll on every reorder shift.
              <NumberFlow
                value={position}
                transformTiming={{
                  duration: 300,
                  easing: 'cubic-bezier(.2,.8,.2,1)',
                }}
                spinTiming={{
                  duration: 300,
                  easing: 'cubic-bezier(.2,.8,.2,1)',
                }}
              />
            ) : (
              position
            )}
          </span>
          <TextareaAutosize
            ref={inputRef}
            value={value}
            minRows={1}
            placeholder='Type a question…'
            spellCheck={false}
            className={cn(
              'min-w-0 flex-1 resize-none border-none bg-transparent p-0 b3 text-[#141414] outline-none',
              'placeholder:text-neutral-400',
              'focus-visible:ring-0',
              'hide-scrollbar'
            )}
            {...inputProps}
          />
          {/* -my-1 collapses the 28px button to a 20px line box so it centers
              on the first text line without inflating the row. */}
          <DragHandle
            className='-mt-[2px] -mb-[2px]'
            isDragging={isDragging || isOverlay}
            {...handleProps}
          />
        </div>
      </div>
    );
  }
);
