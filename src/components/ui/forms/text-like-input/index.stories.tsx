import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormTextLikeInput from './index';

const meta = {
  title: 'Components/Form/FormTextLikeInput',
  component: FormTextLikeInput,
  tags: ['autodocs'],
} satisfies Meta<typeof FormTextLikeInput>;

export default meta;
// `FormTextLikeInput` needs a form context, so stories drive it through a
// wrapper via `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  title: string;
  subtitle: string;
};

function DemoTextLikeInputExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: {
      title: 'Screening Interview Agent',
      subtitle: '',
    },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form<DemoFormValues>
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-96 flex-col gap-5 p-4'
    >
      {/* Reads as a heading but is a registered, editable input — the text
          styling comes entirely from classNames.input. */}
      <div>
        <FormTextLikeInput
          label={null}
          placeholder='Untitled agent'
          classNames={{ input: 'text-2xl font-semibold' }}
          spellCheck={false}
          {...form.register('title', { required: 'Title is required' })}
        />
        <FormTextLikeInput
          label={null}
          placeholder='Add a short tagline…'
          classNames={{ input: 'text-sm text-neutral-500' }}
          {...form.register('subtitle')}
        />
      </div>

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
  render: () => <DemoTextLikeInputExample />,
};
