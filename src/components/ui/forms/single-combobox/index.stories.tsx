import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormSingleCombobox from './index';

const meta = {
  title: 'Components/FormSingleCombobox',
  component: FormSingleCombobox,
  tags: ['autodocs'],
} satisfies Meta<typeof FormSingleCombobox>;

export default meta;
// `FormSingleCombobox` needs a form context, so stories drive it through a
// wrapper via `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  country: string;
};

const COUNTRY_OPTIONS = [
  { value: 'id', label: 'Indonesia', description: 'Asia' },
  { value: 'sg', label: 'Singapore', description: 'Asia' },
  { value: 'us', label: 'United States', description: 'North America' },
  { value: 'de', label: 'Germany', description: 'Europe' },
  { value: 'br', label: 'Brazil', description: 'South America' },
];

function DemoComboboxExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: { country: '' },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-80 flex-col gap-5 p-4'
    >
      <FormSingleCombobox
        label='Country'
        helperText='Type to search the list.'
        options={COUNTRY_OPTIONS}
        placeholder={{
          label: 'Select a country',
          search: 'Search countries...',
        }}
        {...form.register('country', { required: 'Country is required' })}
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
  render: () => <DemoComboboxExample />,
};
