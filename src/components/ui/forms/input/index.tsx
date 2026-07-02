'use client';

import { cn } from 'cnfast';
import get from 'lodash.get';
import * as React from 'react';
import { useFormContext, type UseFormRegisterReturn } from 'react-hook-form';

import FormErrorMessage from '@/components/ui/forms/error-message';
import FormHelperText from '@/components/ui/forms/helper-text';
import FormLabel from '@/components/ui/forms/label';
import Input from '@/components/ui/input';

export interface FormInputProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Input>,
      'ref' | 'onChange' | 'onBlur' | 'name'
    >,
    UseFormRegisterReturn<string> {
  /** Will be applied to the wrapper div, for other node use `classNames` */
  className?: string;
  classNames?: {
    input?: string;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    leftNode?: string;
    rightNode?: string;
  };

  label: string | null;
  showOptionalLabel?: boolean;
  helperText?: string;

  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;

  withClearButton?: boolean;
  onClear?: () => void;

  withErrorMessage?: boolean;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      label,
      showOptionalLabel = false,
      helperText,
      classNames,
      readOnly,
      disabled: _disabled,
      name,
      leftNode,
      rightNode,
      withClearButton = false,
      withErrorMessage = true,
      onClear,
      ...rest
    },
    ref
  ) => {
    const withLabel = label !== null;
    const id = React.useId();
    const labelId = `${id}-${name}`;

    const { formState, setValue } = useFormContext();
    const error = get(formState.errors, name);

    const disabled = _disabled || readOnly;

    return (
      <div className={cn([className])}>
        {withLabel && (
          <FormLabel
            htmlFor={labelId}
            className={cn(['block', classNames?.label])}
            disabled={_disabled}
            readOnly={readOnly}
            optional={showOptionalLabel}
          >
            {label}
          </FormLabel>
        )}
        <div className={cn([withLabel && 'mt-1.5'])}>
          <Input
            id={labelId}
            classNames={{
              input: classNames?.input,
              leftNode: classNames?.leftNode,
              rightNode: classNames?.rightNode,
            }}
            disabled={disabled}
            readOnly={readOnly}
            error={!!error}
            name={name}
            leftNode={leftNode}
            rightNode={rightNode}
            withClearButton={withClearButton}
            onClear={() => {
              setValue(name, '');
              onClear?.();
            }}
            {...rest}
            ref={ref}
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
FormInput.displayName = 'FormInput';

export default FormInput;
