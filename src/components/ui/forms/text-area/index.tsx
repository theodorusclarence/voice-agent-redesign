'use client';

import { cn } from 'cnfast';
import get from 'lodash.get';
import * as React from 'react';
import { useFormContext, type UseFormRegisterReturn } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';

import FormErrorMessage from '@/components/ui/forms/error-message';
import FormHelperText from '@/components/ui/forms/helper-text';
import FormLabel from '@/components/ui/forms/label';

export interface FormTextAreaProps
  extends Omit<
      React.ComponentProps<'textarea'>,
      'ref' | 'onChange' | 'onBlur' | 'name' | 'style'
    >,
    UseFormRegisterReturn<string> {
  /** Will be applied to the wrapper div, for other node use `classNames` */
  className?: string;
  classNames?: {
    textArea?: string;
    wrapper?: string;
    label?: string;
    helperText?: string;
    errorMessage?: string;
  };

  label: string | null;
  showOptionalLabel?: boolean;
  helperText?: string;

  withErrorMessage?: boolean;

  maxCharacter?: number;
  minRows?: number;
  maxRows?: number;

  unstyled?: boolean;
}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    {
      className,
      label,
      showOptionalLabel = false,
      helperText,
      classNames,
      readOnly,
      disabled: _disabled,
      maxCharacter,
      name,
      minRows = 3,
      maxRows,
      withErrorMessage = true,
      unstyled = false,
      ...rest
    },
    ref
  ) => {
    const withLabel = label !== null;
    const id = React.useId();
    const labelId = `${id}-${name}`;

    const { formState, watch } = useFormContext();
    const error = get(formState.errors, name);

    const value = maxCharacter !== undefined ? watch(name) : '';

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
          <div className={cn(['relative flex flex-col', classNames?.wrapper])}>
            <TextareaAutosize
              id={labelId}
              minRows={minRows}
              maxRows={maxRows}
              className={cn([
                !unstyled && [
                  'w-full resize-none rounded-2xl text-sm',
                  'border transition',
                  // Colors — mirrors `ui/input` so both controls read the same
                  [
                    'text-neutral-900 placeholder:text-neutral-400',

                    'bg-white hover:bg-white',

                    'focus:outline-none',
                    'focus:ring-4 focus:ring-primary-500/[0.16]',
                    'border-neutral-200 hover:border-neutral-300 focus:border-primary-600',
                  ],
                  maxCharacter !== undefined && 'pb-6',
                ],

                // NOTE: this override is outside of !unstyled
                classNames?.textArea,

                !unstyled && [
                  // NOTE: Error, disabled, & readOnly should be prioritized
                  error && [
                    'border-red-300 hover:border-red-400 focus:border-red-500',
                    'focus:ring-red-500/[0.16]',
                  ],
                  disabled && [
                    'cursor-not-allowed text-neutral-400 placeholder:text-neutral-400',
                    'bg-neutral-100 hover:bg-neutral-100',

                    'border-transparent hover:border-transparent',
                  ],
                  readOnly && [
                    'cursor-not-allowed text-neutral-500',
                    'bg-neutral-100 hover:bg-neutral-100',
                  ],
                ],
              ])}
              disabled={disabled}
              name={name}
              data-1p-ignore
              {...rest}
              ref={ref}
            />
            {maxCharacter !== undefined && (
              <span className='absolute bottom-2.5 right-4 text-xs text-neutral-400'>
                {value?.length ?? 0}/{maxCharacter}
              </span>
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
      </div>
    );
  }
);
FormTextArea.displayName = 'FormTextArea';

export default FormTextArea;
