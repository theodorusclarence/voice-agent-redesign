import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormSwitch from './index';

const meta = {
  title: 'Components/Form/FormSwitch',
  component: FormSwitch,
  tags: ['autodocs'],
} satisfies Meta<typeof FormSwitch>;

export default meta;
// `FormSwitch` needs a form context, so stories drive it through a wrapper via
// `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  visibility: boolean;
  notifications: boolean;
};

function DemoSwitchExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: { visibility: false, notifications: true },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form<DemoFormValues>
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-80 flex-col gap-5 p-4'
    >
      <FormSwitch
        label='Visibility'
        helperText='Allow workspace members to discover this agent.'
        {...form.register('visibility')}
      />

      <FormSwitch
        label='Email notifications'
        showLabelFirst
        size='sm'
        {...form.register('notifications')}
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
  render: () => <DemoSwitchExample />,
};
