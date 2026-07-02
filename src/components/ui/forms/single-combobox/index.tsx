'use client';

import { cn } from 'cnfast';
import get from 'lodash.get';
import * as React from 'react';
import {
  Controller,
  useFormContext,
  type UseFormRegisterReturn,
} from 'react-hook-form';

import SingleCombobox, {
  type SingleComboboxProps,
} from '@/components/ui/combobox/single';
import { type SingleComboboxTriggerType } from '@/components/ui/combobox/single/triggers';
import FormErrorMessage from '@/components/ui/forms/error-message';
import FormHelperText from '@/components/ui/forms/helper-text';
import FormLabel from '@/components/ui/forms/label';

interface FormSingleComboboxProps
  extends Omit<
      SingleComboboxProps,
      'value' | 'setValue' | 'name' | 'ref' | 'onChange' | 'onBlur' | 'trigger'
    >,
    UseFormRegisterReturn<string> {
  label: string | null;
  showOptionalLabel?: boolean;
  helperText?: string;

  trigger?: SingleComboboxTriggerType;

  classNames?: SingleComboboxProps['classNames'] & {
    label?: string;
    errorMessage?: string;
    helperText?: string;
  };
  className?: string;

  disabled?: boolean;
  withErrorMessage?: boolean;
}

/**
 * @example
 * ```tsx
 * <FormSingleCombobox
 *   {...register('fruit', { required: 'Fruit is required' })}
 *   label='Favorite fruit'
 *   options={[
 *     { label: 'Apple', value: 'apple' },
 *     { label: 'Banana', value: 'banana' },
 *   ]}
 * />
 * ```
 */
const FormSingleCombobox = React.forwardRef<
  HTMLButtonElement,
  FormSingleComboboxProps
>(
  (
    {
      name,
      label,
      showOptionalLabel = false,
      helperText,
      className,
      classNames,
      options,
      disabled,
      trigger = 'button',
      // onBlur and onChange are omitted since they're managed by the controller
      onBlur: _onBlur,
      onChange: _onChange,
      withErrorMessage = true,
      ...rest
    },
    ref
  ) => {
    // Internal ref is needed so we can merge the ref from parent and controller
    const internalRef = React.useRef<HTMLButtonElement | null>(null);
    React.useImperativeHandle<
      HTMLButtonElement | null,
      HTMLButtonElement | null
    >(ref, () => internalRef.current);

    const withLabel = label !== null;
    const id = React.useId();
    const labelId = `${id}-${name}`;

    const { control, formState } = useFormContext();
    const error = get(formState.errors, name);

    return (
      <div className={cn([className])}>
        {withLabel && (
          <FormLabel
            htmlFor={labelId}
            className={cn(['block', classNames?.label])}
            optional={showOptionalLabel}
            disabled={disabled}
          >
            {label}
          </FormLabel>
        )}
        <div className={cn([withLabel && 'mt-1.5'])}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <SingleCombobox
                value={field.value ?? ''}
                setValue={field.onChange}
                options={options}
                trigger={trigger}
                onClose={(value) => {
                  field.onChange(value);
                  rest.onClose?.(value);
                }}
                disabled={disabled}
                data-is-error={!!error}
                classNames={classNames}
                {...rest}
                ref={(el) => {
                  field.ref(el);
                  internalRef.current = el;
                }}
              />
            )}
          />
          {(helperText || (withErrorMessage && error)) && (
            <div className='mt-2'>
              {helperText && (
                <FormHelperText className={cn([classNames?.helperText])}>
                  {helperText}
                </FormHelperText>
              )}
              {withErrorMessage && error && (
                <FormErrorMessage
                  className={cn(['mt-1', classNames?.errorMessage])}
                >
                  {error.message?.toString()}
                </FormErrorMessage>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FormSingleCombobox.displayName = 'FormSingleCombobox';

export default FormSingleCombobox;
