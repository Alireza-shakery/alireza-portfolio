import { getTranslations } from 'next-intl/server';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { PhotoSlot } from './photo';

export async function AboutSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('about');
  const photos = profile.photos.filter((photo) => photo.src);
  return (
    <section id="about" tabIndex={-1} className="section about-section dark-section">
      <div className="container">
        <div className="about-grid">
          <Reveal>
            <SectionHeading label={t('label')} title={t('title')} accent={t('accent')} />
            <div className="about-copy">
              <p>{profile.biography[locale]}</p>
              <p className="secondary-copy">{profile.philosophy[locale]}</p>
            </div>
          </Reveal>
          <Reveal className="about-focus" delay={0.08}>
            <h3>{t('focus')}</h3>
            <ol>
              {(['quality', 'performance', 'experience'] as const).map((key, index) => (
                <li key={key}>
                  <span className="mono" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div>
                    <strong>{t(key)}</strong>
                    <p>{t(`${key}Text`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        {photos.length > 0 && (
          <div className="photo-collage">
            {photos.map((photo) => (
              <Reveal key={photo.src} className="collage-item">
                <PhotoSlot photo={photo} locale={locale} label={t('photo')} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
