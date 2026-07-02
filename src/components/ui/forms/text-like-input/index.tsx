'use client';

import { cn } from 'cnfast';
import * as React from 'react';

import FormInput, { type FormInputProps } from '@/components/ui/forms/input';

/**
 * A `FormInput` stripped of its input chrome — transparent, borderless, no
 * ring — so it reads as plain text (a title, a heading) while staying
 * editable and registered to the form. Style the text through
 * `classNames.input` (size, weight, color).
 */
const FormTextLikeInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ classNames, ...rest }, ref) => {
    return (
      <FormInput
        classNames={{
          ...classNames,
          input: cn([
            'w-full rounded-none border-0 bg-transparent p-0',
            'focus:outline-none focus:ring-0',
            'text-neutral-900 placeholder:text-neutral-400',
            'caret-primary-600',
            'disabled:cursor-not-allowed disabled:text-neutral-400',
            classNames?.input,
          ]),
        }}
        unstyled
        {...rest}
        ref={ref}
      />
    );
  }
);
FormTextLikeInput.displayName = 'FormTextLikeInput';

export default FormTextLikeInput;
