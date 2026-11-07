import type { ReactNode } from 'react';
import { geist, vazirmatn } from '../fonts';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { pageMetadata } from '@/lib/metadata';
import { SiteHeader } from '@/components/header';
import { Footer } from '@/components/footer';
import { AnimationProvider } from '@/components/animation-provider';
import { LocalePreference } from '@/components/locale-preference';
import '../globals.css';

export const dynamicParams = false;
export const dynamic = 'error';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata(locale, t('title'), t('description'));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      className={`${geist.variable} ${vazirmatn.variable}`}
    >
      <body id="top">
        <NextIntlClientProvider locale={locale}>
          <LocalePreference />
          <AnimationProvider>
            <SiteHeader />
            {children}
            <Footer locale={locale} />
          </AnimationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
