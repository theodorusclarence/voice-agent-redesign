import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { clsx, cn } from 'cnfast';
import * as React from 'react';
import { Drawer } from 'vaul';

import Button from '@/components/ui/buttons/button';

import AgentCallPreview from '@/pages/_components/agent-call-preview';
import { PixelLoader } from '@/pages/_components/agent-call-preview/_components/pixel-loader';
import type { AgentPreview } from '@/pages/_components/agent-call-preview/_hooks/use-agent-preview';

/**
 * Mobile take on the call preview: a docked peek bar (glyph · status · play)
 * floating above the form footer, expanding into a bottom drawer with the
 * full call. Play on the closed bar opens the drawer and starts the call in
 * one tap; the simulation lives outside (see `useAgentPreview`), so closing
 * the drawer mid-call keeps it running and the bar narrates the live status.
 */
export default function MobilePreviewDrawer({
  preview,
}: {
  preview: AgentPreview;
}) {
  const [open, setOpen] = React.useState(false);
  const { playing, phase, toggle } = preview;

  const statusTitle = playing
    ? phase === 'ask'
      ? 'Speaking…'
      : 'Listening…'
    : 'Preview agent';
  const statusSub = playing ? 'Agent is on the call' : 'Tap to hear it live';

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <div
        className={clsx([
          'fixed inset-x-3 bottom-[80px] sm:bottom-[92px] z-30 lg:hidden',
          'flex items-center gap-3 rounded-[18px] p-2.5 pl-3.5',
          'bg-dark border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.3)]',
          'transition-all duration-200',
          open && 'pointer-events-none translate-y-4 opacity-0',
        ])}
      >
        {/* The bar and its play button both need to be tappable, and buttons
            can't nest — so the "open" hit area is a full-cover button laid
            under the content instead of a wrapper. */}
        <button
          type='button'
          aria-label='Open call preview'
          onClick={() => setOpen(true)}
          className={clsx([
            'absolute inset-0 rounded-[inherit]',
            'ring-offset-0 focus:outline-none',
            'shadow-soft',
            'focus-visible:ring-4 focus-visible:ring-primary-500/[0.4]',
          ])}
        />
        <div className='pointer-events-none flex size-[38px] flex-none items-center justify-center rounded-xl'>
          <PixelLoader playing={playing} size={4.5} gap={3} n={4} />
        </div>
        <div className='pointer-events-none min-w-0 flex-1'>
          <div className='truncate text-sm font-medium text-white'>
            {statusTitle}
          </div>
          <div className='c1 truncate text-neutral-400'>{statusSub}</div>
        </div>
        <Button
          variant='primary'
          onClick={() => {
            // Starting a call from the closed bar also surfaces the drawer,
            // so the first tap lands you on the live transcript.
            if (!playing) setOpen(true);
            toggle();
          }}
          aria-label={playing ? 'Pause preview' : 'Play preview'}
          className={cn([
            'relative size-10 flex-none rounded-full p-0',
            'focus-visible:ring-4 focus-visible:ring-primary-500/[0.2] focus-visible:ring-offset-0',
          ])}
        >
          <HugeiconsIcon
            icon={playing ? PauseIcon : PlayIcon}
            fill='currentColor'
            className='drop-shadow-sm'
            size={18}
          />
        </Button>
      </div>

      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 z-40 bg-black/45 lg:hidden' />
        <Drawer.Content
          aria-describedby={undefined}
          className={clsx([
            'fixed inset-x-0 bottom-0 z-50 lg:hidden',
            'flex h-[85svh] flex-col rounded-t-3xl',
            'bg-dark text-stone-25 outline-none',
            'shadow-[0_-16px_44px_rgba(0,0,0,0.34)]',
          ])}
        >
          <Drawer.Title className='sr-only'>Call preview</Drawer.Title>
          <div className='flex-none py-2.5'>
            <div className='mx-auto h-[5px] w-[42px] rounded-full bg-white/20' />
          </div>
          <div className='min-h-0 flex-1 px-5 pb-5'>
            <AgentCallPreview preview={preview} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
