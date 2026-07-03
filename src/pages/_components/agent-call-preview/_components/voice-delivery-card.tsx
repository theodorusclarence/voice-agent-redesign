import {
  ArrowDown01Icon,
  PauseIcon,
  PlayIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from 'cnfast';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import {
  DURATION_OPTIONS,
  LANGUAGE_OPTIONS,
  SPEED_OPTIONS,
  TONE_OPTIONS,
  VOICE_OPTIONS,
  type VoiceDeliverySettings,
} from './constants';
import { PixelLoader } from './pixel-loader';
import { SettingRow } from './setting-row';
import type { CallPhase } from '../_utils/use-call-simulation';

/**
 * Bottom card of the call preview: status row (pixel glyph + play button)
 * with a collapsible Voice & delivery section under it. Collapsed, the
 * header row shows a "Fred · Professional · 1x · 10 mins" summary.
 */
export function VoiceDeliveryCard({
  playing,
  phase,
  settings,
  onSettingsChange,
  onPlayToggle,
}: {
  playing: boolean;
  phase: CallPhase;
  settings: VoiceDeliverySettings;
  onSettingsChange: (patch: Partial<VoiceDeliverySettings>) => void;
  onPlayToggle: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const statusTitle = playing
    ? phase === 'ask'
      ? 'Speaking…'
      : 'Listening…'
    : 'Ready to preview';
  const statusSub = playing ? 'Agent is on the call' : 'Press play to hear it';
  const summary = [
    settings.voice,
    settings.tone,
    settings.speed,
    settings.duration,
  ].join(' · ');

  const rows: Array<{
    key: keyof VoiceDeliverySettings;
    label: string;
    options: readonly string[];
  }> = [
    { key: 'voice', label: 'Voice', options: VOICE_OPTIONS },
    { key: 'tone', label: 'Tone', options: TONE_OPTIONS },
    { key: 'speed', label: 'Speed', options: SPEED_OPTIONS },
    { key: 'duration', label: 'Duration', options: DURATION_OPTIONS },
    { key: 'language', label: 'Language', options: LANGUAGE_OPTIONS },
  ];

  return (
    <div className='flex-none rounded-2xl border border-white/10 bg-white/5'>
      <div className='flex items-center gap-3.5 p-3'>
        <div className='flex size-11 flex-none items-center justify-center rounded-xl bg-white/5'>
          <PixelLoader playing={playing} />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='truncate text-[15px] font-bold text-white'>
            {statusTitle}
          </div>
          <div className='c1 text-neutral-400'>{statusSub}</div>
        </div>
        <button
          type='button'
          onClick={onPlayToggle}
          aria-label={playing ? 'Pause preview' : 'Play preview'}
          className={cn([
            'flex size-11 flex-none items-center justify-center rounded-full',
            'bg-primary-500 text-white transition-colors hover:bg-primary-400',
          ])}
        >
          <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={18} />
        </button>
      </div>

      <button
        type='button'
        onClick={() => setExpanded((prev) => !prev)}
        className='flex w-full items-center gap-2.5 border-t border-white/10 px-4 py-3 text-left'
      >
        <span className='flex-none text-[13px] font-bold text-white'>
          Voice & delivery
        </span>
        {expanded ? (
          <span className='flex-1' />
        ) : (
          <span className='c1 mr-1 min-w-0 flex-1 truncate text-right text-neutral-400'>
            {summary}
          </span>
        )}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          className={cn([
            'flex-none text-neutral-400 transition-transform duration-150',
            expanded && 'rotate-180',
          ])}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            // the dropdowns render in a portal, so clipping is safe here
            className='overflow-hidden'
          >
            <div className='flex flex-col gap-2.5 px-4 pb-4 pt-1'>
              {rows.map((row) => (
                <SettingRow
                  key={row.key}
                  label={row.label}
                  value={settings[row.key]}
                  options={row.options}
                  onPick={(value) => onSettingsChange({ [row.key]: value })}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
