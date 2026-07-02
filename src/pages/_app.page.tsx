import type { AppProps } from 'next/app';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
