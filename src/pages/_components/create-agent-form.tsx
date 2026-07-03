import { Edit04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { clsx, cn } from 'cnfast';
import { nanoid } from 'nanoid';
import * as React from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';

import { useConditionalVerticalMask } from '@/hooks/use-conditional-vertical-mask';

import FirefliesLogo from '@/components/logo/fireflies-logo';
import Button from '@/components/ui/buttons/button';
import TextButton from '@/components/ui/buttons/text-button';
import FormErrorMessage from '@/components/ui/forms/error-message';
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

/**
 * Owns the builder form instance. Lives on the page so the sibling call
 * preview can `useWatch` the same values through `<Form>`'s provider.
 */
export function useCreateAgentForm() {
  return useForm<CreateAgentFormValues>({
    mode: 'onTouched',
    defaultValues: defaultValues(),
  });
}

interface CreateAgentFormProps {
  className?: string;
  onCancel?: () => void;
}

export default function CreateAgentForm({
  className,
  onCancel,
}: CreateAgentFormProps) {
  const form = useFormContext<CreateAgentFormValues>();

  const { ref: scrollRef, maskImage } = useConditionalVerticalMask<HTMLElement>(
    { fadeTop: 5, fadeBottom: 2 }
  );

  // The heading fields hide their inline errors (stacked red lines wreck the
  // header look) and surface the first one here, below the description.
  const { errors } = form.formState;
  const headerErrorMessage =
    errors.name?.message ?? errors.description?.message;

  return (
    <div className={cn(['flex h-full min-h-0 flex-col', className])}>
      <header
        className={clsx([
          'flex items-start gap-4 p-5 pb-0 sm:p-10 sm:pb-0',
          'max-sm:flex-col max-sm:gap-3',
        ])}
      >
        <button
          type='button'
          className={cn([
            'group relative flex size-14 flex-none items-center justify-center rounded-2xl',
            'bg-stone-150/80 transition hover:bg-stone-150',
            'max-sm:size-10 max-sm:rounded-lg',
          ])}
        >
          <FirefliesLogo className='size-8 max-sm:size-6 text-neutral-600' />
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
            withErrorMessage={false}
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
            withErrorMessage={false}
            {...form.register('description')}
          />
          {headerErrorMessage && (
            <FormErrorMessage className='mt-2'>
              {headerErrorMessage}
            </FormErrorMessage>
          )}
        </div>
      </header>

      <main
        ref={scrollRef}
        // Fade the content near the scroll edges that still overflow.
        style={{ maskImage }}
        className={clsx([
          'mt-6 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto py-1',
          'pb-24 lg:pb-8', // clear the floating preview bar on mobile
          'overscroll-none',
          // 3*4px -> offset px-3, 5*4px -> px-5, 10*4px -> px-10
          'px-[calc(3*4px_+_5*4px)] sm:px-[calc(3*4px_+_10*4px)]', // keep focus rings from clipping at the scroll container's edges
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

        <div>
          <FormTextArea
            label='Knowledge'
            showOptionalLabel
            minRows={3}
            placeholder='Background info the agent can lean on — product details, FAQs, docs…'
            {...form.register('knowledge')}
          />
          <TextButton
            className={clsx([
              'mt-2 ml-auto block c1',
              '-mb-3', // give the gap visual balance between form field
            ])}
          >
            Add Knowledge Base
          </TextButton>
        </div>

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
          'flex items-center gap-2.5 border-t border-black/[0.06]',
          'px-5 py-4 sm:px-10 sm:py-6',
        ])}
      >
        <Typography
          variant='c1'
          className='mr-auto hidden text-neutral-400 sm:block'
        >
          1 AI credit per minute
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
        <Button type='submit' variant='primary' className='grow sm:grow-0'>
          Create agent
        </Button>
      </footer>
    </div>
  );
}
