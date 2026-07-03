import { clsx, cn } from 'cnfast';
import * as React from 'react';

import { useConditionalVerticalMask } from '@/hooks/use-conditional-vertical-mask';

import Typography from '@/components/ui/typography';

import { AgentBubble } from './_components/agent-bubble';
import { AnswerBubble } from './_components/answer-bubble';
import { VoiceDeliveryCard } from './_components/voice-delivery-card';
import type { AgentPreview } from './_hooks/use-agent-preview';

/**
 * Live call preview (right panel of the builder, or the mobile drawer body).
 * All state comes in through `preview` (see `useAgentPreview`) so the same
 * simulation can render here and on the mobile peek bar at once. Idle, it
 * shows the first few questions as a mock transcript; play walks through
 * every question with speaking/listening states. Voice & delivery settings
 * live in the bottom card and stay visible as a summary while collapsed.
 */
export default function AgentCallPreview({
  preview,
  className,
}: {
  preview: AgentPreview;
  className?: string;
}) {
  const {
    displayName,
    questionTexts,
    settings,
    onSettingsChange,
    playing,
    step,
    phase,
    toggle,
  } = preview;

  // Idle: a static three-turn sample. Playing: turns appear as the call runs.
  const shownCount = playing ? step + 1 : Math.max(questionTexts.length, 1);
  const turns: React.ReactNode[] = [];
  for (let i = 0; i < shownCount; i++) {
    const text = questionTexts[i] ?? 'Add a question to preview it here';
    const active = playing && i === step && phase === 'ask';
    turns.push(
      <AgentBubble
        // Keyed on play mode so the first question — already on screen from
        // the idle transcript — remounts and word-animates when play starts.
        key={playing ? `agent-live-${i}` : `agent-${i}`}
        text={text}
        active={active}
        animated={playing}
      />
    );
    // Same key (and layoutId prefix) across phases: the typing bubble is the
    // answer bubble in its `typing` state, so the dots morph into the
    // skeleton lines instead of a swap.
    if (!playing || i < step)
      turns.push(<AnswerBubble key={`answer-${i}`} id={`answer-${i}`} />);
    else if (i === step && phase === 'answer')
      turns.push(
        <AnswerBubble key={`answer-${i}`} id={`answer-${i}`} typing />
      );
  }

  // Top-only fade: bubbles dissolve under the header when scrolled, but stay
  // fully visible at the bottom until they slide under the frost card.
  const { ref: scrollRef, maskImage } =
    useConditionalVerticalMask<HTMLDivElement>({ fadeTop: 8, fadeBottom: 0 });

  // Keep the newest turn in view as the call plays.
  React.useEffect(() => {
    if (!playing) return;
    const el = scrollRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [playing, shownCount, phase, scrollRef]);

  return (
    <div className={cn(['relative flex h-full min-h-0 flex-col', className])}>
      <header className='flex flex-none flex-col items-center gap-1 pb-1 pt-0.5 text-center'>
        {/* s2 supplies the weight; the 17px size is bespoke to this header */}
        <Typography
          as='h2'
          variant='s2'
          className='max-w-full truncate text-[17px] text-white'
        >
          {displayName}
        </Typography>
        <div className='flex items-center gap-2'>
          <Typography as='span' variant='c1' className='text-neutral-400'>
            {playing ? 'On the call' : 'Call preview'}
          </Typography>
        </div>
      </header>

      <div
        ref={scrollRef}
        style={{ maskImage }}
        // pb clears the collapsed card overlaying the bottom, so the last
        // bubble stays readable while older ones scroll under its frost.
        className={clsx([
          'hide-scrollbar -mx-1 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-1 pb-32 pt-5 mb-2',
          'rounded-b-2xl',
        ])}
      >
        {turns}
      </div>

      <div className='absolute inset-x-0 bottom-0'>
        <VoiceDeliveryCard
          playing={playing}
          phase={phase}
          settings={settings}
          onSettingsChange={onSettingsChange}
          onPlayToggle={toggle}
        />
      </div>
    </div>
  );
}
