export const ButtonVariant = ['primary', 'secondary', 'ghost'] as const;

export function getButtonVariant(variant: (typeof ButtonVariant)[number]) {
  return [
    'inline-flex select-none items-center justify-center gap-2 px-4 py-2.5 text-sm',
    'relative font-geist font-medium leading-none',
    'rounded-xl border border-transparent',
    'transition-[background-color_.15s,box-shadow_.15s,border-color_.15s,transform_.09s_ease]',
    'enabled:active:scale-[0.955]',
    'disabled:cursor-not-allowed',

    variant === 'primary' && [
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-700',
      'disabled:border-transparent disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:bg-neutral-100 disabled:active:bg-neutral-100',
    ],

    variant === 'secondary' && [
      'border-black/[.14] bg-white text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200',
      'disabled:border-transparent disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:bg-neutral-100 disabled:active:bg-neutral-100',
    ],

    variant === 'ghost' && [
      'border-transparent bg-transparent text-zinc-600 hover:bg-black/5 active:bg-black/[.09]',
      'disabled:border-transparent disabled:bg-transparent disabled:text-neutral-400 disabled:hover:bg-transparent disabled:active:bg-transparent',
    ],
  ];
}
