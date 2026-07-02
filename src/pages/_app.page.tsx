import cn from 'cnfast';
import type { AppProps } from 'next/app';

import '@/styles/globals.css';

import { fontsClassName } from '@/fonts';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={cn(['font-primary', fontsClassName])}>
      <Component {...pageProps} />
    </div>
  );
}
