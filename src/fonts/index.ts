import { clsx } from 'cnfast';
import localFont from 'next/font/local';

export const SuisseIntl = localFont({
  src: [
    {
      path: './suisse-intl/SuisseIntl-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './suisse-intl/SuisseIntl-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './suisse-intl/SuisseIntl-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './suisse-intl/SuisseIntl-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './suisse-intl/SuisseIntl-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-suisse-intl',
});

/** @see https://github.com/rsms/inter, sourced via the `inter-ui` npm package */
export const Inter = localFont({
  src: './inter/InterVariable.woff2',
  display: 'swap',
  variable: '--font-inter',
});

export const fontsClassName = clsx(SuisseIntl.variable, Inter.variable);
