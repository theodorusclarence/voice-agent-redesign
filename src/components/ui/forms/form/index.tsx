'use client';

import * as React from 'react';
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

import { processFormData } from '@/components/ui/forms/process-form-data';

export interface FormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

const FormComponent = <T extends FieldValues>(
  { className, form, onSubmit, children, ...rest }: FormProps<T>,
  ref: React.ForwardedRef<HTMLFormElement>
) => {
  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        className={className}
        onSubmit={(e) => {
          // stop propagating in case there's a nested form
          e.stopPropagation();
          form.handleSubmit(processFormData(onSubmit))(e);
        }}
        {...rest}
      >
        {children}
      </form>
    </FormProvider>
  );
};

const Form = React.forwardRef(FormComponent) as <T extends FieldValues>(
  props: FormProps<T> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement;

export default Form;
