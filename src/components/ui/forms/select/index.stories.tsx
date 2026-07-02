import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormSelect from './index';

const meta = {
  title: 'Components/FormSelect',
  component: FormSelect,
  tags: ['autodocs'],
} satisfies Meta<typeof FormSelect>;

export default meta;
// `FormSelect` needs a form context, so stories drive it through a wrapper via
// `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  role: string;
};

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

function DemoSelectExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: { role: '' },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form<DemoFormValues>
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-80 flex-col gap-5 p-4'
    >
      <FormSelect
        label='Role'
        helperText='Controls what this member can access.'
        options={ROLE_OPTIONS}
        {...form.register('role', { required: 'Role is required' })}
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
  render: () => <DemoSelectExample />,
};
