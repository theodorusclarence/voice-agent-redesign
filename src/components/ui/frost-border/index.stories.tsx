import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';

import { getFrostBorder } from './class';

// `getFrostBorder` is a class/style helper, not a component — stories are
// render-only demos of spreading its className + style onto an element.
const meta = {
  title: 'Components/FrostBorder',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Dark, glowy backdrop so the gradient ring and backdrop blur read. */
function Desk({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-dark relative flex w-fit flex-wrap items-start gap-6 overflow-hidden rounded-3xl p-10'>
      <div className='bg-primary-500/40 absolute -left-8 -top-10 size-44 rounded-full blur-2xl' />
      <div className='absolute -bottom-12 right-0 size-40 rounded-full bg-white/10 blur-2xl' />
      {children}
    </div>
  );
}

function FrostCard({
  label,
  sublabel,
  style,
  className,
}: {
  label: string;
  sublabel: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={getFrostBorder().getClassName([
        'w-56 rounded-2xl bg-white/5 p-5',
        className,
      ])}
      style={style ?? getFrostBorder().getStyle()}
    >
      <div className='text-sm font-medium text-white'>{label}</div>
      <div className='c1 mt-1 text-neutral-400'>{sublabel}</div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Desk>
      <FrostCard
        label='Voice and delivery'
        sublabel='Fred · Professional · 1x · 10 mins'
      />
    </Desk>
  ),
};

export const Variants: Story = {
  render: () => (
    <Desk>
      <FrostCard
        label='Default'
        sublabel='Bright ring, fades mid-edge'
        style={getFrostBorder().getStyle()}
      />
      <FrostCard
        label='White'
        sublabel="variant: 'white' — softer ring"
        style={getFrostBorder().getStyle({ variant: 'white' })}
      />
      <FrostCard
        label='Thick'
        sublabel='borderWidth: 1.5'
        style={getFrostBorder().getStyle({ borderWidth: 1.5 })}
      />
      <FrostCard
        label='Dimmed'
        sublabel='before:opacity-20 on the ring'
        className='before:opacity-20'
        style={getFrostBorder().getStyle()}
      />
    </Desk>
  ),
};
