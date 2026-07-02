import Head from 'next/head';
import { useRouter } from 'next/router';

import { siteConfig } from '@/constant/config';

const defaultMeta = {
  title: siteConfig.title,
  siteName: siteConfig.title,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}/images/og.jpg`,
  type: 'website',
  robots: 'follow, index',
};

type SeoProps = {
  templateTitle?: string;
  canonical?: string;
} & Partial<typeof defaultMeta>;

export default function Seo(props: SeoProps) {
  const router = useRouter();
  const meta = {
    ...defaultMeta,
    ...props,
  };
  meta['title'] = props.templateTitle
    ? `${props.templateTitle} | ${meta.siteName}`
    : meta.title;

  return (
    <Head>
      <title key='title'>{meta.title}</title>
      <meta name='robots' content={meta.robots} key='robots' />
      <meta content={meta.description} name='description' key='description' />
      <meta
        property='og:url'
        key='og:url'
        content={`${meta.url}${router.asPath}`}
      />
      <link
        rel='canonical'
        key='canonical'
        href={meta.canonical ? meta.canonical : `${meta.url}${router.asPath}`}
      />
      {/* Open Graph */}
      <meta property='og:type' content={meta.type} key='og:type' />
      <meta
        property='og:site_name'
        content={meta.siteName}
        key='og:site_name'
      />
      <meta
        property='og:description'
        content={meta.description}
        key='og:description'
      />
      <meta property='og:title' content={meta.title} key='og:title' />
      <meta
        name='image'
        property='og:image'
        content={meta.image}
        key='og:image'
      />
      {/* Twitter */}
      <meta
        name='twitter:card'
        content='summary_large_image'
        key='twitter:card'
      />
      <meta name='twitter:title' content={meta.title} key='twitter:title' />
      <meta
        name='twitter:description'
        content={meta.description}
        key='twitter:description'
      />
      <meta name='twitter:image' content={meta.image} key='twitter:image' />
    </Head>
  );
}
