import type { Preview } from '@storybook/nextjs';
import { clsx } from 'cnfast';
import localFont from 'next/font/local';
import * as React from 'react';

import '../src/styles/globals.css';

export const SuisseIntl = localFont({
  src: [
    {
      path: '../src/fonts/suisse-intl/SuisseIntl-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../src/fonts/suisse-intl/SuisseIntl-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../src/fonts/suisse-intl/SuisseIntl-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../src/fonts/suisse-intl/SuisseIntl-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../src/fonts/suisse-intl/SuisseIntl-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-suisse-intl',
});

/** @see https://github.com/rsms/inter, sourced via the `inter-ui` npm package */
export const Inter = localFont({
  src: '../src/fonts/inter/InterVariable.woff2',
  display: 'swap',
  variable: '--font-inter',
});

export const fontsClassName = clsx(SuisseIntl.variable, Inter.variable);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      // `SuisseIntl.className` sets font-family directly, independent of
      // whether Tailwind's `.font-primary` utility (which relies on the
      // `.variable`-only `fontsClassName` CSS vars) gets generated in
      // Storybook's separate webpack pipeline.
      <div className={clsx(['font-primary', fontsClassName])}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
