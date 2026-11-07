import type { Metadata } from 'next';
import type { Locale } from '@/content/types';
import { site } from '@/content/site';
import { profile } from '@/content/profile';

export function pageMetadata(
  locale: Locale,
  title: string,
  description: string,
  path = '',
): Metadata {
  const url = site.url ? `${site.url}/${locale}${path}` : undefined;
  return {
    title,
    description,
    icons: { icon: '/icon.svg' },
    metadataBase: site.url ? new URL(site.url) : undefined,
    robots: { index: Boolean(site.url), follow: Boolean(site.url) },
    alternates: site.url
      ? {
          canonical: url,
          languages: {
            en: `${site.url}/en${path}`,
            fa: `${site.url}/fa${path}`,
            'x-default': `${site.url}/en${path}`,
          },
        }
      : undefined,
    openGraph: {
      type: 'website',
      title,
      description,
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      alternateLocale: locale === 'fa' ? 'en_US' : 'fa_IR',
      siteName: profile.name[locale],
      url,
      images: site.url
        ? [
            {
              url: site.socialImage,
              width: 1200,
              height: 630,
              alt: `${profile.name[locale]} — ${profile.title[locale]}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: site.url ? [site.socialImage] : undefined,
    },
  };
}
