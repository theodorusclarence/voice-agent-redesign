import { clsx } from 'cnfast';
import { Head, Html, Main, NextScript } from 'next/document';

import { fontsClassName } from '@/fonts';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        {/* !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/ */}
        {/* ! copy to /favicon folder */}
        <link rel='icon' href='/favicon/favicon.ico' />
        <link rel='shortcut icon' href='/favicon/favicon-16x16.png' />
        <link rel='apple-touch-icon' href='/favicon/apple-touch-icon.png' />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-96x96.png'
          sizes='96x96'
        />
        <link rel='icon' type='image/svg+xml' href='/favicon/favicon.svg' />
        <link rel='shortcut icon' href='/favicon/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon/apple-touch-icon.png'
        />
        <link rel='manifest' href='/favicon/site.webmanifest' />
      </Head>
      <body className={clsx([fontsClassName, 'antialiased'])}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
