import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/buttons/button';
import Form from '@/components/ui/forms/form';

import FormTextArea from './index';

const meta = {
  title: 'Components/Form/FormTextArea',
  component: FormTextArea,
  tags: ['autodocs'],
} satisfies Meta<typeof FormTextArea>;

export default meta;
// `FormTextArea` is only usable inside a form context, so stories drive it
// through a wrapper via `render` rather than args — hence the loose story type.
type Story = StoryObj;

type DemoFormValues = {
  knowledge: string;
  instructions: string;
  bio: string;
};

function DemoFormExample() {
  const form = useForm<DemoFormValues>({
    mode: 'onTouched',
    defaultValues: { knowledge: '', instructions: '', bio: '' },
  });
  const [submitted, setSubmitted] = React.useState<DemoFormValues | null>(null);

  return (
    <Form<DemoFormValues>
      form={form}
      onSubmit={(data) => setSubmitted(data)}
      className='flex w-96 flex-col gap-5 p-4'
    >
      <FormTextArea
        label='Knowledge'
        showOptionalLabel
        helperText='Background info the agent can lean on.'
        placeholder='Product details, FAQs, docs…'
        {...form.register('knowledge')}
      />
      <FormTextArea
        label='Instructions'
        minRows={4}
        maxRows={8}
        placeholder='How should the agent behave?'
        {...form.register('instructions', {
          required: 'Instructions are required',
        })}
      />
      <FormTextArea
        label='Bio'
        maxCharacter={200}
        placeholder='Tell us about yourself…'
        {...form.register('bio', {
          maxLength: { value: 200, message: 'Keep it under 200 characters.' },
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
  render: () => <DemoFormExample />,
};
