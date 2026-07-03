import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormCheckbox from './index';

const meta = {
  title: 'Components/Form/FormCheckbox',
  component: FormCheckbox,
  tags: ['autodocs'],
} satisfies Meta<typeof FormCheckbox>;

export default meta;
// `FormCheckbox` needs a form context, so stories drive it through a wrapper
// via `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  participantName: boolean;
  participantEmail: boolean;
  terms: boolean;
};

function DemoCheckboxExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: {
      participantName: true,
      participantEmail: false,
      terms: false,
    },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form<DemoFormValues>
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-80 flex-col gap-5 p-4'
    >
      {/* Locked-on requirement, like the builder's mandatory Name field. */}
      <div className='flex items-center gap-6'>
        <FormCheckbox
          label='Name'
          disabled
          {...form.register('participantName')}
        />
        <FormCheckbox label='Email' {...form.register('participantEmail')} />
      </div>

      <FormCheckbox
        label='I agree to the terms'
        {...form.register('terms', {
          validate: (value) => value === true || 'You must accept the terms.',
        })}
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
  render: () => <DemoCheckboxExample />,
};
