import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

import { type SingleComboboxTriggerProps } from '@/components/ui/combobox/single/triggers';

const ButtonTrigger = React.forwardRef<
  HTMLButtonElement,
  SingleComboboxTriggerProps
>(
  (
    {
      className,
      option,
      placeholder,
      triggerType: _triggerType,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        //? required aria props will be added by radix
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
        role='combobox'
        type='button'
        className={cn([
          'flex w-full items-center justify-between gap-2 font-normal',
          'rounded-xl px-3 py-2 text-sm',
          'border transition',
          'default-ring',
          [
            'text-neutral-900',
            'bg-white',
            'focus:outline-none',
            'border-neutral-200 hover:border-neutral-300 focus:border-primary-600',
            'focus:ring-4 focus:ring-primary-500/[0.16] focus:ring-offset-0',
            '[&>svg]:shrink-0',
          ],
          disabled && [
            'cursor-not-allowed text-neutral-400',
            'bg-neutral-100 hover:bg-neutral-100',
            'border-transparent hover:border-transparent',
          ],
          // only show error style if not disabled
          !disabled && [
            'data-[is-error=true]:border-red-500 data-[is-error=true]:hover:border-red-500',
            'data-[is-error=true]:focus:border-red-500 data-[is-error=true]:focus:ring-red-500/[0.16]',
          ],
          className,
        ])}
        ref={ref}
        disabled={disabled}
        {...rest}
      >
        {option?.icon}
        <span
          className={cn([
            'line-clamp-1 flex-grow break-all text-left',
            !option && 'text-neutral-400',
          ])}
        >
          {option ? option.label : placeholder?.label ?? 'Select an option'}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className='ml-2 shrink-0 text-neutral-400'
        />
      </button>
    );
  }
);
ButtonTrigger.displayName = 'ButtonTrigger';

export default ButtonTrigger;
