'use client';

import { MinusSignIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from 'cnfast';
import * as React from 'react';

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn([
      'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center',
      'rounded-md border transition-colors',
      'data-[state=unchecked]:border-neutral-300 data-[state=unchecked]:bg-white',
      'data-[state=unchecked]:hover:border-neutral-400',
      // Checked reads as a soft tint with a strong check, per the builder's
      // light palette — not a solid primary fill.
      'data-[state=checked]:border-primary-200 data-[state=checked]:bg-primary-100',
      'data-[state=indeterminate]:border-primary-200 data-[state=indeterminate]:bg-primary-100',
      'disabled:cursor-not-allowed disabled:opacity-60',
      'ring-offset-0 focus:outline-none',
      'focus-visible:ring-4 focus-visible:ring-primary-500/[0.2]',
      className,
    ])}
    {...props}
  >
    <CheckboxPrimitive.Indicator className='flex items-center justify-center text-primary-600'>
      <HugeiconsIcon
        icon={props.checked === 'indeterminate' ? MinusSignIcon : Tick02Icon}
        size={13}
        strokeWidth={2.5}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
