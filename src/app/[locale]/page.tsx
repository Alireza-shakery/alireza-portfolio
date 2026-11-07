import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { HeroSection } from '@/components/hero';
import { AboutSection } from '@/components/about';
import { FeaturedProjects } from '@/components/projects';
import { SkillsSection } from '@/components/skills';
import { ProcessSection } from '@/components/process';
import { ContactSection } from '@/components/contact';
import { profile } from '@/content/profile';
import { site } from '@/content/site';
import { visibleContacts, contactHref } from '@/content/contacts';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: profile.name[locale],
        jobTitle: profile.title[locale],
        ...(site.url ? { url: `${site.url}/${locale}` } : {}),
        sameAs: visibleContacts()
          .filter((contact) => contact.kind === 'url')
          .map((contact) => contactHref(contact)),
      },
      {
        '@type': 'WebSite',
        name: profile.name[locale],
        inLanguage: ['en', 'fa'],
        ...(site.url ? { url: site.url } : {}),
      },
    ],
  };
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <HeroSection locale={locale} />
      <FeaturedProjects locale={locale} />
      <AboutSection locale={locale} />
      <SkillsSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
