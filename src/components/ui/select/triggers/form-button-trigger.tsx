import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

import { SelectPrimitiveTrigger } from '@/components/ui/select';
import { type BaseSelectTriggerProps } from '@/components/ui/select/triggers';

const FormButtonTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitiveTrigger>,
  BaseSelectTriggerProps
>(({ className, error, disabled, children, ...rest }, ref) => {
  return (
    <SelectPrimitiveTrigger
      className={cn([
        'flex w-full items-center justify-between gap-2',
        'rounded-xl px-3 py-2 text-left text-sm',
        'border transition',
        'default-ring',
        [
          'text-neutral-900 data-[placeholder]:text-neutral-400',
          'bg-white',
          'focus:outline-none',
          'border-neutral-200 hover:border-neutral-300 focus:border-primary-600',
          'focus:ring-4 focus:ring-primary-500/[0.16]',
        ],
        error && [
          'border-red-500 hover:border-red-500 focus:border-red-500',
          'focus:ring-red-500/[0.16]',
        ],
        disabled && [
          'cursor-not-allowed text-neutral-400',
          'bg-neutral-100 hover:bg-neutral-100',
          'border-transparent hover:border-transparent',
        ],
        className,
      ])}
      disabled={disabled}
      ref={ref}
      {...rest}
    >
      {children}
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={16}
        className='ml-2 shrink-0 text-neutral-400'
      />
    </SelectPrimitiveTrigger>
  );
});

FormButtonTrigger.displayName = 'FormButtonTrigger';

export default FormButtonTrigger;
