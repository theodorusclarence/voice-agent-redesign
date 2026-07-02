import { Head, Html, Main, NextScript } from 'next/document';

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

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
