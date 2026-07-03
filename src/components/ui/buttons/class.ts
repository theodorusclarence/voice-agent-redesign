export const ButtonVariant = ['primary', 'secondary', 'ghost', 'dark'] as const;

export function getButtonVariant(variant: (typeof ButtonVariant)[number]) {
  return [
    'inline-flex select-none items-center justify-center gap-2 px-4 py-2.5 text-sm',
    'relative font-primary font-normal leading-none',
    'rounded-xl border border-transparent',
    'transition-[background-color_.15s,box-shadow_.15s,border-color_.15s,transform_.09s_ease]',
    'enabled:active:scale-[0.955]',
    'disabled:cursor-not-allowed',

    variant === 'primary' && [
      'bg-primary-500 text-white hover:bg-primary-550 active:bg-primary-550',
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

    // Secondary for dark surfaces (the call preview panel) — the light
    // variants disappear there, and the global focus ring's offset reads
    // wrong against a dark background, so it brings its own soft ring.
    variant === 'dark' && [
      'border-white/10 bg-white/6 text-white hover:border-white/25 active:bg-white/10',
      'focus-visible:border-primary-500 focus-visible:ring-4 focus-visible:ring-primary-500/25 focus-visible:ring-offset-0',
      'disabled:border-transparent disabled:bg-white/5 disabled:text-neutral-500 disabled:hover:border-transparent disabled:active:bg-white/5',
    ],
  ];
}
