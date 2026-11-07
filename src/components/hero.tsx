import { getTranslations } from 'next-intl/server';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';
import { PhotoSlot } from './photo';

export async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('hero');
  return (
    <section id="home" tabIndex={-1} className="hero dark-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-enter enter-1">
            <span className="short-rule" aria-hidden="true" />
            {t('eyebrow')}
          </p>
          <h1 className="hero-name hero-enter enter-2">
            <span className="hero-line">{profile.firstName[locale]}</span>{' '}
            <span className="hero-line name-accent">{profile.lastName[locale]}</span>
          </h1>
          <p className="hero-title hero-enter enter-3">{profile.title[locale]}</p>
          <p className="hero-description hero-enter enter-3">{profile.introduction[locale]}</p>
          <div className="hero-buttons hero-enter enter-4">
            <a className="button button-primary" href="#projects">
              {t('work')}
              <ArrowUpRight size={18} className="directional" />
            </a>
            <a className="button button-outline" href="#contact">
              {t('contact')}
              <ArrowUpRight size={18} className="directional" />
            </a>
          </div>
        </div>
        <figure className="portrait-composition hero-enter enter-3">
          <div className="portrait-frame">
            <PhotoSlot photo={profile.portrait} locale={locale} label={t('portrait')} priority />
          </div>
          <figcaption className="portrait-caption">
            <span>{profile.name[locale]}</span>
            <span className="portrait-caption-rule" aria-hidden="true" />
            <span className="mono" aria-hidden="true">
              AS / 01
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="container hero-bottom">
        <a href="#projects" className="scroll-cue">
          <ArrowDown size={16} />
          {t('scroll')}
        </a>
        <p>{t('footnote')}</p>
        <span className="mono hero-index" aria-hidden="true">
          01 — 05
        </span>
      </div>
    </section>
  );
}
