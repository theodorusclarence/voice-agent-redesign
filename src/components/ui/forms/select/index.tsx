'use client';

import { type SelectProps } from '@radix-ui/react-select';
import { cn } from 'cnfast';
import get from 'lodash.get';
import * as React from 'react';
import {
  Controller,
  useFormContext,
  type UseFormRegisterReturn,
} from 'react-hook-form';

import FormErrorMessage from '@/components/ui/forms/error-message';
import FormHelperText from '@/components/ui/forms/helper-text';
import FormLabel from '@/components/ui/forms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import SelectTrigger, {
  type SelectTriggerType,
} from '@/components/ui/select/triggers';

interface FormSelectProps
  extends Omit<SelectProps, 'ref' | 'onChange' | 'onBlur' | 'name'>,
    UseFormRegisterReturn<string> {
  classNames?: {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    value?: string;
    trigger?: string;
    option?: string;
  };
  options: {
    value: string;
    label: string;
  }[];

  label: string | null;
  showOptionalLabel?: boolean;
  placeholder?: string;
  helperText?: string;

  className?: string;

  triggerType?: SelectTriggerType;

  /**
   * By using this prop, you must ensure that id won't clash.
   * Useful when you want a custom label outside the layout with custom `htmlFor` & `id`.
   */
  id?: string;

  withErrorMessage?: boolean;
}

const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      className,
      classNames,
      options,
      name,
      disabled,
      // onBlur and onChange are omitted since they're managed by the controller
      onBlur: _onBlur,
      onChange: _onChange,

      showOptionalLabel = false,
      placeholder = 'Select an option',
      helperText,
      id: idProp,
      triggerType = 'form-button',
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
    const labelId = idProp ? idProp : `${id}-${name}`;

    const { formState, control } = useFormContext();
    const error = get(formState.errors, name);

    return (
      <div className={cn([className])}>
        {withLabel && (
          <FormLabel
            htmlFor={labelId}
            className={cn(['block', classNames?.label])}
            disabled={disabled}
            optional={showOptionalLabel}
          >
            {label}
          </FormLabel>
        )}
        <div className={cn([withLabel && 'mt-1.5'])}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger
                  id={labelId}
                  triggerType={triggerType}
                  error={!!error}
                  disabled={disabled}
                  ref={(el) => {
                    internalRef.current = el;
                    field.ref(el);
                  }}
                  className={classNames?.trigger}
                  {...rest}
                >
                  <span className={classNames?.value}>
                    <SelectValue placeholder={placeholder} />
                  </span>
                </SelectTrigger>

                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={classNames?.option}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

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
    );
  }
);
FormSelect.displayName = 'FormSelect';

export default FormSelect;
