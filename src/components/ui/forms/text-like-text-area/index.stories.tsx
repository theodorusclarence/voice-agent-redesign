import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormTextLikeTextArea from './index';

const meta = {
  title: 'Components/Form/FormTextLikeTextArea',
  component: FormTextLikeTextArea,
  tags: ['autodocs'],
} satisfies Meta<typeof FormTextLikeTextArea>;

export default meta;
// `FormTextLikeTextArea` needs a form context, so stories drive it through a
// wrapper via `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  name: string;
  description: string;
};

/**
 * The builder-header pattern: a heading and description that wrap and grow
 * as you type (unlike `FormTextLikeInput`, which stays on one line). Enter
 * in the heading hops to the description instead of inserting a newline.
 */
function DemoTextLikeTextAreaExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: {
      name: 'Screening Interview Agent',
      description:
        'Hire faster with automatic calls that assess candidate skills.',
    },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form<DemoFormValues>
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-96 flex-col gap-5 p-4'
    >
      <div>
        <FormTextLikeTextArea
          label={null}
          placeholder='Untitled agent'
          classNames={{
            textArea: 'text-2xl font-semibold leading-tight',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              form.setFocus('description');
            }
          }}
          spellCheck={false}
          withErrorMessage={false}
          {...form.register('name', { required: 'Name is required' })}
        />
        <FormTextLikeTextArea
          label={null}
          className='mt-1'
          placeholder='Add a short description of what this agent does…'
          classNames={{
            textArea: 'text-sm leading-snug text-neutral-500',
          }}
          {...form.register('description')}
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
  render: () => <DemoTextLikeTextAreaExample />,
};
