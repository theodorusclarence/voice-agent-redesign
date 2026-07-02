'use client';

import { cn } from 'cnfast';
import * as React from 'react';

import FormTextArea from '@/components/ui/forms/text-area';

/**
 * A `FormTextArea` stripped of its chrome — transparent, borderless, no ring —
 * so it reads as plain text (a title, a heading) while staying editable and
 * registered to the form. Unlike `FormTextLikeInput` it wraps onto new lines
 * automatically as the text grows (autosized). Style the text through
 * `classNames.textArea` (size, weight, color).
 */
const FormTextLikeTextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithRef<typeof FormTextArea>
>(({ classNames, minRows = 1, ...rest }, ref) => {
  return (
    <FormTextArea
      classNames={{
        ...classNames,
        textArea: cn([
          'w-full resize-none rounded-none border-0 bg-transparent p-0',
          'focus:outline-none focus:ring-0',
          'text-neutral-900 placeholder:text-neutral-400',
          'caret-primary-600',
          'disabled:cursor-not-allowed disabled:text-neutral-400',
          classNames?.textArea,
        ]),
      }}
      minRows={minRows}
      unstyled
      {...rest}
      ref={ref}
    />
  );
});
FormTextLikeTextArea.displayName = 'FormTextLikeTextArea';

export default FormTextLikeTextArea;
