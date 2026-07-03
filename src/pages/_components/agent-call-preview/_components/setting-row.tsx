import { cn } from 'cnfast';
import * as React from 'react';

import SingleCombobox from '@/components/ui/combobox/single';
import Typography from '@/components/ui/typography';

/**
 * Labelled dropdown for one Voice & delivery setting — the shared combobox
 * recolored for the dark preview panel.
 */
export function SettingRow({
  label,
  value,
  options,
  onPick,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Typography
        as='label'
        variant='c1'
        htmlFor={`${label}-combobox`}
        className='w-16 flex-none font-medium text-neutral-400'
      >
        {label}
      </Typography>
      <SingleCombobox
        className='flex-1'
        id={`${label}-combobox`}
        trigger='button'
        value={value}
        setValue={onPick}
        options={options.map((option) => ({ value: option, label: option }))}
        placeholder={{ search: `Search ${label.toLowerCase()}…` }}
        classNames={{
          trigger: cn([
            'border-white/10 bg-white/6 text-white',
            'hover:border-white/25 focus:border-primary-500',
            'focus:ring-primary-500/25',
          ]),
          content: cn([
            'border-white/15 bg-neutral-800',
            'shadow-[0_14px_32px_rgba(0,0,0,0.28)]',
          ]),
          commandWrapper: cn([
            'bg-neutral-800 text-white',
            // the command building blocks are light-only; recolor them from here
            // search row's border-b separator; cmdk puts a hidden <label>
            // before it, so it's the first div but not the first child
            '[&>div:first-of-type]:border-white/10',
            '[&_[cmdk-item]]:text-white',
            '[&_[cmdk-item][data-selected=true]]:bg-white/10',
            '[&_[cmdk-item]_svg]:text-primary-400', // selected tick
          ]),
        }}
      />
    </div>
  );
}
