import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';

import QuestionList, { Question } from './index';

const meta = {
  title: 'Forms/QuestionList',
  component: QuestionList,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QuestionList>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE: Question[] = [
  { id: 'q1', text: 'What are you hoping to get out of this session?' },
  { id: 'q2', text: 'What have you been working on since we last spoke?' },
  { id: 'q3', text: 'Is anything blocking your progress right now?' },
];

/** Turn 3a card shell — the "?" header + "Drag to reorder" copy from the design. */
function QuestionsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-[660px] rounded-[22px] border border-black/[0.06] bg-white p-[30px] pb-[26px] shadow-[0_6px_30px_rgba(0,0,0,0.07)]'>
      <div className='mb-[22px] flex items-start gap-3'>
        <div className='mt-px flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 border-[#f5a623] text-sm font-bold text-[#f5a623]'>
          ?
        </div>
        <div>
          <div className='text-base font-bold text-[#141414]'>Questions</div>
          <div className='mt-0.5 text-[13.5px] text-[#8a8a86]'>
            Enter the questions you&apos;d like your Voice Agent to ask. Drag to
            reorder.
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <QuestionsCard>
      <QuestionList defaultQuestions={SAMPLE} />
    </QuestionsCard>
  ),
};

export const EmptyStart: Story = {
  render: () => (
    <QuestionsCard>
      <QuestionList />
    </QuestionsCard>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [questions, setQuestions] = React.useState<Question[]>(SAMPLE);
    return (
      <div className='flex flex-col gap-4'>
        <QuestionsCard>
          <QuestionList
            questions={questions}
            onQuestionsChange={setQuestions}
          />
        </QuestionsCard>
        <pre className='w-[660px] overflow-auto rounded-xl bg-neutral-900 p-4 text-xs text-neutral-100'>
          {JSON.stringify(
            questions.map((q, i) => `${i + 1}. ${q.text || '(empty)'}`),
            null,
            2
          )}
        </pre>
      </div>
    );
  },
};
