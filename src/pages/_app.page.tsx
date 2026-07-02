import type { AppProps } from 'next/app';
import Head from 'next/head';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { siteConfig } from '@/constant/config';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{siteConfig.title}</title>
        <meta name='description' content={siteConfig.description} />
        <meta name='robots' content='index, follow' />

        <meta property='og:url' content={siteConfig.url} />
        <meta property='og:title' content={siteConfig.title} />
        <meta property='og:description' content={siteConfig.description} />
        <meta property='og:site_name' content={siteConfig.title} />
        <meta property='og:image' content={`${siteConfig.url}/images/og.jpg`} />
        <meta property='og:type' content='website' />
        <meta property='og:locale' content='en_US' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={siteConfig.title} />
        <meta name='twitter:description' content={siteConfig.description} />
        <meta
          name='twitter:image'
          content={`${siteConfig.url}/images/og.jpg`}
        />
        {/* <meta name='twitter:creator' content='@th_clarence' /> */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}
