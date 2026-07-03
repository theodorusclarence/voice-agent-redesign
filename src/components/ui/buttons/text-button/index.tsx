import { cn } from 'cnfast';
import * as React from 'react';

export const TextButtonVariant = ['primary', 'secondary'] as const;

export interface TextButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: (typeof TextButtonVariant)[number];
}

/**
 * An inline, chrome-less button that reads as a link — for actions that live
 * inside or next to text (e.g. "Show all", "Clear"). The global button focus
 * ring applies.
 */
export const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ className, variant = 'primary', ...rest }, ref) => {
    return (
      <button
        type='button'
        className={cn([
          'select-none transition-colors',
          'hover:underline disabled:cursor-not-allowed disabled:hover:no-underline',

          variant === 'primary' &&
            'text-primary-600 active:text-primary-700 disabled:text-primary-300',

          variant === 'secondary' &&
            'text-neutral-800 active:text-neutral-950 disabled:text-neutral-400',

          className,
        ])}
        {...rest}
        ref={ref}
      />
    );
  }
);

TextButton.displayName = 'TextButton';

export default TextButton;
