import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormInput from './index';

const meta = {
  title: 'Components/FormInput',
  component: FormInput,
  tags: ['autodocs'],
} satisfies Meta<typeof FormInput>;

export default meta;
// `FormInput` is only usable inside a form context, so stories drive it through
// a wrapper via `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  name: string;
  email: string;
  company: string;
};

function DemoFormExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', company: '' },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form<DemoFormValues>
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-80 flex-col gap-5 p-4'
    >
      <FormInput
        label='Full name'
        helperText="This is how we'll address you."
        {...form.register('name', { required: 'Full name is required' })}
      />
      <FormInput
        label='Email address'
        leftNode={<HugeiconsIcon icon={Mail01Icon} size={16} />}
        {...form.register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address.',
          },
        })}
      />
      <FormInput
        label='Company name'
        showOptionalLabel
        withClearButton
        {...form.register('company')}
      />

      <Button type='submit' variant='primary'>
        Submit
      </Button>

      {submitted && (
        <pre className='rounded-lg bg-neutral-100 p-3 text-xs text-neutral-700'>
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </Form>
  );
}

export const WithReactHookForm: Story = {
  render: () => <DemoFormExample />,
};
