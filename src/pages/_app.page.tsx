import type { AppProps } from 'next/app';

import '@/styles/globals.css';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
