'use client';

import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import * as React from 'react';

import SingleComboboxTrigger, {
  type SingleComboboxTriggerType,
} from '@/components/ui/combobox/single/triggers';
import { type ComboboxOption } from '@/components/ui/combobox/type';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface SingleComboboxProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  value: string;
  setValue: (value: string) => void;

  options: ComboboxOption[];

  trigger: SingleComboboxTriggerType;

  placeholder?: {
    icon?: React.ReactNode;
    label?: string;
    search?: string;
    empty?: string;
  };

  onClose?: (value: string) => void;

  classNames?: {
    trigger?: string;
    /**
     * Can be used to customize the width of the popover
     * @example `w-[300px]`
     */
    content?: string;
    commandWrapper?: string;
  };

  disabled?: boolean;
}

const SingleCombobox = React.forwardRef<HTMLButtonElement, SingleComboboxProps>(
  (
    {
      value,
      setValue,
      options,
      trigger,
      placeholder,
      onClose,
      classNames,
      disabled,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    function closePopover(currentValue: string) {
      setOpen(false);
      onClose?.(currentValue);
    }

    function onSelectItem(currentValue: string) {
      setValue(currentValue);
      closePopover(currentValue);
    }

    const selectedOption = options.find((option) => option.value === value);

    return (
      <Popover
        modal
        open={open}
        onOpenChange={(v) => (v ? setOpen(true) : closePopover(value))}
      >
        <PopoverTrigger asChild>
          <SingleComboboxTrigger
            triggerType={trigger}
            option={selectedOption}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            {...rest}
            className={cn([classNames?.trigger, rest.className])}
          />
        </PopoverTrigger>

        <PopoverContent
          align='start'
          className={cn([
            'w-[var(--radix-popover-trigger-width)] p-0',
            classNames?.content,
          ])}
        >
          <Command className={classNames?.commandWrapper}>
            <CommandInput placeholder={placeholder?.search ?? 'Search...'} />
            <CommandList>
              <CommandEmpty>
                {placeholder?.empty ?? 'No results found.'}
              </CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  // include value to keep entries unique; label drives search
                  value={`${option.label} ${option.value}`}
                  disabled={option.disabled}
                  onSelect={() => onSelectItem(option.value)}
                >
                  {option.icon}
                  <div className='flex flex-grow flex-col'>
                    <span className='line-clamp-1'>{option.label}</span>
                    {option.description && (
                      <span className='text-xs text-neutral-400'>
                        {option.description}
                      </span>
                    )}
                  </div>
                  {option.value === value && (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={16}
                      className='ml-auto shrink-0 text-primary-600'
                    />
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

SingleCombobox.displayName = 'SingleCombobox';

export default SingleCombobox;
