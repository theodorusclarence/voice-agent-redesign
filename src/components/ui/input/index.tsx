import { CancelCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

export interface InputProps extends React.ComponentPropsWithRef<'input'> {
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;

  withClearButton?: boolean;
  onClear?: () => void;

  error?: boolean;

  className?: string;
  classNames?: {
    input?: string;
    leftNode?: string;
    rightNode?: string;
  };

  unstyled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      style,
      disabled,
      readOnly,
      leftNode,
      rightNode,
      withClearButton = false,
      onClear,
      error,
      classNames,
      unstyled = false,
      ...rest
    },
    ref
  ) => {
    //#region  //*=========== Automatic Left & Right Node Width Detection ===========
    const leftNodeRef = React.useRef<HTMLDivElement>(null);
    const rightNodeRef = React.useRef<HTMLDivElement>(null);
    const [leftNodeWidth, setLeftNodeWidth] = React.useState(0);
    const [rightNodeWidth, setRightNodeWidth] = React.useState(0);

    // useLayoutEffect to update input padding based on the width of prefix and suffix elements
    // This ensures the input field adjusts its padding dynamically as the widths of the prefix or suffix change.
    React.useLayoutEffect(() => {
      leftNodeRef.current && setLeftNodeWidth(leftNodeRef.current.offsetWidth);
      rightNodeRef.current &&
        setRightNodeWidth(rightNodeRef.current.offsetWidth);
    }, [leftNode, rightNode]);
    //#endregion  //*======== Automatic Left & Right Node Width Detection ===========

    const shouldShowClearButton = withClearButton && rest.value !== '';

    return (
      <div className={cn(['relative', className])}>
        {leftNode && (
          <div
            className={cn([
              'absolute left-3 top-1/2 -translate-y-1/2',
              'pointer-events-none select-none',
              'flex items-center justify-center',
              classNames?.leftNode,
            ])}
            ref={leftNodeRef}
          >
            {typeof leftNode === 'string' ? (
              <span className='text-sm text-neutral-500'>{leftNode}</span>
            ) : React.isValidElement(leftNode) ? (
              React.cloneElement(
                leftNode as React.ReactElement<{ className?: string }>,
                {
                  className: cn([
                    'text-sm text-neutral-500',
                    (leftNode.props as { className?: string }).className,
                  ]),
                }
              )
            ) : (
              leftNode
            )}
          </div>
        )}
        <input
          className={cn([
            !unstyled && [
              'w-full rounded-xl text-sm',
              'border transition',
              'default-ring',
              // Colors
              [
                'text-neutral-900 placeholder:text-neutral-400',

                'bg-white hover:bg-white active:bg-white',

                'focus:outline-none',
                'border-neutral-200 hover:border-neutral-300 focus:border-primary-600',

                'focus:ring-4 focus:ring-primary-500/[0.16]',
              ],
            ],

            // NOTE: this override is outside of !unstyled
            classNames?.input,

            !unstyled && [
              // NOTE: Error, disabled, & readOnly should be prioritized
              error && [
                'border-red-500 hover:border-red-500 focus:border-red-500',
                'focus:ring-red-500/[0.16]',
              ],
              disabled && [
                'cursor-not-allowed text-neutral-400 placeholder:text-neutral-400',
                'bg-neutral-100 hover:bg-neutral-100',

                'border-transparent hover:border-transparent',
              ],
              readOnly && [
                'cursor-not-allowed text-neutral-500',
                'bg-neutral-100 hover:bg-neutral-100',
              ],
            ],
          ])}
          style={
            {
              '--left-node-width': `${leftNodeWidth + 11}px`,
              '--right-node-width': `${rightNodeWidth + 14}px`,
              paddingLeft: leftNode
                ? `max(var(--left-node-width), 2.25rem)`
                : undefined,
              paddingRight:
                rightNode || withClearButton
                  ? rightNode && withClearButton
                    ? `max(var(--right-node-width), 3.5rem)`
                    : `max(var(--right-node-width), 2.25rem)`
                  : undefined,
              ...style,
            } as React.CSSProperties
          }
          disabled={disabled || readOnly}
          data-1p-ignore
          {...rest}
          ref={ref}
        />
        {(rightNode || withClearButton) && (
          <div
            className={cn([
              'absolute right-3 top-1/2 -translate-y-1/2',
              'pointer-events-none select-none',
              'flex items-center justify-center gap-2',
              classNames?.rightNode,
            ])}
            ref={rightNodeRef}
          >
            {rightNode && (
              <div className='flex items-center justify-center'>
                {typeof rightNode === 'string' ? (
                  <span className='text-sm text-neutral-500'>{rightNode}</span>
                ) : React.isValidElement(rightNode) ? (
                  React.cloneElement(
                    rightNode as React.ReactElement<{ className?: string }>,
                    {
                      className: cn([
                        'text-sm text-neutral-500',
                        (rightNode.props as { className?: string }).className,
                      ]),
                    }
                  )
                ) : (
                  rightNode
                )}
              </div>
            )}
            {withClearButton && (
              <button
                className={cn([
                  'text-sm text-neutral-500',
                  'pointer-events-auto',
                  'rounded-sm',
                  'default-ring',
                  !shouldShowClearButton && 'pointer-events-auto',
                ])}
                type='button'
                onClick={onClear}
              >
                <HugeiconsIcon icon={CancelCircleIcon} size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
