'use client';

import { type CheckboxProps } from '@radix-ui/react-checkbox';
import { cn } from 'cnfast';
import get from 'lodash.get';
import * as React from 'react';
import {
  Controller,
  useFormContext,
  type UseFormRegisterReturn,
} from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import FormErrorMessage from '@/components/ui/forms/error-message';
import FormLabel from '@/components/ui/forms/label';

interface FormCheckboxProps
  extends Omit<
      CheckboxProps,
      'ref' | 'onChange' | 'onBlur' | 'name' | 'id' | 'defaultValue'
    >,
    UseFormRegisterReturn<string> {
  classNames?: {
    label?: string;
    errorMessage?: string;
    checkbox?: string;
  };

  label: string | null;
  showOptionalLabel?: boolean;
  showLabelFirst?: boolean;

  /**
   * By using this prop, you must ensure that id won't clash.
   * Useful when you want a custom label outside the layout with custom
   * `htmlFor` & `id`.
   */
  id?: string;

  withErrorMessage?: boolean;
}

const FormCheckbox = React.forwardRef<HTMLButtonElement, FormCheckboxProps>(
  (
    {
      className,
      label,
      classNames,
      name,
      disabled,
      // onBlur and onChange are omitted since they're managed by the controller
      onBlur: _onBlur,
      onChange: _onChange,
      showLabelFirst = false,
      showOptionalLabel = false,

      id: idProp,
      withErrorMessage = true,
      ...rest
    },
    ref
  ) => {
    const withLabel = label !== null;
    const id = React.useId();
    const labelId = idProp ? idProp : `${id}-${name}`;

    const { formState, control } = useFormContext();
    const error = get(formState.errors, name);

    return (
      <div className={cn([className])}>
        <div
          className={cn([
            'flex items-center gap-2',
            showLabelFirst && 'flex-row-reverse',
          ])}
        >
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                id={labelId}
                disabled={disabled}
                name={field.name}
                className={cn([
                  error && 'data-[state=unchecked]:border-red-500',
                  classNames?.checkbox,
                ])}
                ref={(el) => {
                  field.ref(el);
                  if (typeof ref === 'function') ref(el);
                  else if (ref) ref.current = el;
                }}
                {...rest}
              />
            )}
          />
          {withLabel && (
            <FormLabel
              htmlFor={labelId}
              className={cn(['block font-normal', classNames?.label])}
              disabled={disabled}
              optional={showOptionalLabel}
            >
              {label}
            </FormLabel>
          )}
        </div>

        {withErrorMessage && error && (
          <FormErrorMessage className={cn(['mt-2', classNames?.errorMessage])}>
            {error.message?.toString()}
          </FormErrorMessage>
        )}
      </div>
    );
  }
);
FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;
