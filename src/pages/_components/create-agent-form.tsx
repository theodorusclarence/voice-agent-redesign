import { Edit04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { clsx, cn } from 'cnfast';
import { nanoid } from 'nanoid';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';

import FirefliesLogo from '@/components/logo/fireflies-logo';
import Button from '@/components/ui/buttons/button';
import FormErrorMessage from '@/components/ui/forms/error-message';
import Form from '@/components/ui/forms/form';
import FormLabel from '@/components/ui/forms/label';
import QuestionList, {
  type Question,
} from '@/components/ui/forms/question-list';
import FormTextArea from '@/components/ui/forms/text-area';
import FormTextLikeTextArea from '@/components/ui/forms/text-like-text-area';
import Typography from '@/components/ui/typography';

export interface CreateAgentFormValues {
  name: string;
  description: string;
  questions: Question[];
  knowledge?: string;
  instructions?: string;
}

const defaultValues = (): CreateAgentFormValues => ({
  name: 'Screening Interview Agent',
  description: 'Hire faster with automatic calls that assess candidate skills.',
  questions: [
    {
      id: nanoid(),
      text: 'Can you briefly walk me through your current role and responsibilities?',
    },
    {
      id: nanoid(),
      text: 'What skills or tools do you use most in your day-to-day work?',
    },
    {
      id: nanoid(),
      text: 'Tell me about a recent project you worked on and your role in it.',
    },
  ],
  knowledge: '',
  instructions: '',
});

interface CreateAgentFormProps {
  className?: string;
  onCreate?: (values: CreateAgentFormValues) => void;
  onCancel?: () => void;
}

export default function CreateAgentForm({
  className,
  onCreate,
  onCancel,
}: CreateAgentFormProps) {
  const form = useForm<CreateAgentFormValues>({
    mode: 'onTouched',
    defaultValues: defaultValues(),
  });

  return (
    <Form<CreateAgentFormValues>
      form={form}
      onSubmit={(values) => onCreate?.(values)}
      className={cn(['flex h-full min-h-0 flex-col', className])}
    >
      <header className='flex items-start gap-4 p-10 pb-0'>
        <button
          type='button'
          className={cn([
            'group relative flex h-14 w-14 flex-none items-center justify-center rounded-2xl',
            'bg-stone-150/80 transition hover:bg-stone-150',
          ])}
        >
          <FirefliesLogo className='size-8 text-neutral-600' />
          <span
            className={cn([
              'absolute right-0 translate-x-1/3 bottom-0 flex size-5 items-center justify-center rounded-md',
              'bg-white text-neutral-600 shadow-sm',
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
            ])}
          >
            <HugeiconsIcon icon={Edit04Icon} size={12} />
          </span>
        </button>
        <div className='min-w-0 flex-1 mt-px'>
          <FormTextLikeTextArea
            label={null}
            classNames={{
              textArea:
                'text-2xl font-semibold  hide-scrollbar leading-tight placeholder:text-neutral-300',
            }}
            placeholder='Untitled agent'
            // A heading wraps, it doesn't take literal newlines.
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                form.setFocus('description');
              }
            }}
            spellCheck={false}
            {...form.register('name', { required: 'Name is required' })}
          />
          <FormTextLikeTextArea
            label={null}
            className='mt-1'
            classNames={{
              textArea: 'text-sm hide-scrollbar  leading-snug text-neutral-500',
            }}
            placeholder='Add a short description of what this agent does…'
            spellCheck={false}
            {...form.register('description', {
              required: 'Description is required',
            })}
          />
        </div>
      </header>

      <main
        className={clsx([
          'mt-6 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto py-1',
          // 3*4px -> offset px-3, 10*4px -> px-10
          '-mx-3 px-[calc(3*4px_+_10*4px)]', // keep focus rings from clipping at the scroll container's edges
          'hide-scrollbar',
        ])}
      >
        <Controller
          control={form.control}
          name='questions'
          rules={{
            validate: (questions) =>
              questions.some((q) => q.text.trim() !== '') ||
              'Add at least one question.',
          }}
          render={({ field, fieldState }) => (
            <div>
              <FormLabel className='block'>Questions</FormLabel>
              <QuestionList
                className='mt-1.5'
                questions={field.value}
                onQuestionsChange={field.onChange}
              />
              {fieldState.error && (
                <FormErrorMessage className='mt-2'>
                  {fieldState.error.message}
                </FormErrorMessage>
              )}
            </div>
          )}
        />

        <FormTextArea
          label='Knowledge'
          showOptionalLabel
          minRows={3}
          placeholder='Background info the agent can lean on — product details, FAQs, docs…'
          {...form.register('knowledge')}
        />
        <FormTextArea
          label='Instructions'
          showOptionalLabel
          minRows={3}
          placeholder='How should the agent behave? Tone, rules, things to avoid…'
          {...form.register('instructions')}
        />
      </main>

      <footer
        className={clsx([
          'flex items-center gap-2.5 border-t border-black/[0.06] px-10 py-6',
          // '-mx-10',
        ])}
      >
        <Typography variant='c1' className='mr-auto text-neutral-400'>
          Voice agent costs 1 AI credit per minute
        </Typography>

        <Button
          variant='secondary'
          onClick={() => {
            form.reset(defaultValues());
            onCancel?.();
          }}
        >
          Cancel
        </Button>
        <Button type='submit' variant='primary'>
          Create agent
        </Button>
      </footer>
    </Form>
  );
}
