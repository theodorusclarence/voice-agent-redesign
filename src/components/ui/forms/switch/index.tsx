'use client';

import { type SwitchProps } from '@radix-ui/react-switch';
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
import { Switch } from '@/components/ui/switch';

interface FormSwitchProps
  extends Omit<SwitchProps, 'ref' | 'onChange' | 'onBlur' | 'name'>,
    UseFormRegisterReturn<string> {
  classNames?: {
    label?: string;
    helperText?: string;
    errorMessage?: string;
  };

  label: string | null;
  showOptionalLabel?: boolean;
  helperText?: string;
  showLabelFirst?: boolean;

  size?: 'sm' | 'md';

  /**
   * By using this prop, you must ensure that id won't clash.
   * Useful when you want a custom label outside the layout with custom
   * `htmlFor` & `id`.
   */
  id?: string;

  withErrorMessage?: boolean;
}

const FormSwitch = React.forwardRef<HTMLButtonElement, FormSwitchProps>(
  (
    {
      className,
      label,
      helperText,
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
              <Switch
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                id={labelId}
                disabled={disabled}
                name={field.name}
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
              className={cn(['block', classNames?.label])}
              disabled={disabled}
              optional={showOptionalLabel}
            >
              {label}
            </FormLabel>
          )}
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
FormSwitch.displayName = 'FormSwitch';

export default FormSwitch;
