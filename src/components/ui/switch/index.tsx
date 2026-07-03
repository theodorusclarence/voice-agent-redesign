'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from 'cnfast';
import * as React from 'react';

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  classNames?: {
    thumb?: string;
  };
  size?: 'sm' | 'md';
}

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, classNames, size = 'md', ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn([
      'inline-flex shrink-0 cursor-pointer items-center transition-colors',
      'rounded-full border-2 border-transparent',
      'data-[state=checked]:bg-primary-500 data-[state=checked]:hover:bg-primary-500/90',
      'data-[state=unchecked]:bg-stone-175 data-[state=unchecked]:hover:bg-neutral-300',
      'disabled:cursor-not-allowed disabled:opacity-60',
      'ring-offset-0 focus:outline-none',
      'focus-visible:ring-4 focus-visible:ring-primary-500/[0.2]',
      size === 'sm' && 'h-5 w-9',
      size === 'md' && 'h-6 w-11',
      className,
    ])}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn([
        'pointer-events-none block rounded-full bg-white',
        'shadow-[0px_1px_3px_rgba(0,0,0,0.2)]',
        'transition-transform data-[state=unchecked]:translate-x-0',
        size === 'sm' && 'size-4 data-[state=checked]:translate-x-4',
        size === 'md' && 'size-5 data-[state=checked]:translate-x-5',
        classNames?.thumb,
      ])}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
