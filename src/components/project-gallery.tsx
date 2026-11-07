'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale, Photo } from '@/content/types';
import { ScreenshotPlaceholder } from './screenshot-placeholder';

export function ProjectGallery({ screenshots }: { screenshots: Photo[] }) {
  const t = useTranslations('projects');
  const locale = useLocale() as Locale;
  const images = screenshots.filter((photo) => photo.src);
  const count = images.length;
  const [index, setIndex] = useState(0);
  const move = (step: number) => setIndex((value) => (value + step + count) % count);
  if (!count)
    return (
      <div className="gallery-empty">
        <ScreenshotPlaceholder title={t('noScreenshots')} description={t('imagePending')} />
      </div>
    );
  return (
    <div
      className="project-gallery"
      role="region"
      aria-roledescription={locale === 'fa' ? 'گالری' : 'carousel'}
      aria-label={t('gallery')}
      tabIndex={count > 1 ? 0 : undefined}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          move(locale === 'fa' ? -1 : 1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          move(locale === 'fa' ? 1 : -1);
        }
      }}
    >
      <div
        className="gallery-stage"
        role="group"
        aria-label={`${t('slide')} ${index + 1} / ${count}`}
      >
        <Image
          key={images[index].src}
          src={images[index].src!}
          alt={images[index].alt[locale]}
          fill
          sizes="(max-width: 768px) 92vw, 75vw"
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="gallery-controls">
        <p aria-live="polite">
          {t('slide')}{' '}
          <span className="mono">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </p>
        <a
          className="gallery-original"
          href={images[index].src!}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('fullImage')}
          <ArrowUpRight size={15} className="directional" />
        </a>
        {count > 1 && (
          <div className="gallery-dots">
            {Array.from({ length: count }, (_, slide) => (
              <button
                key={slide}
                aria-label={`${t('slide')} ${slide + 1}`}
                aria-current={slide === index ? 'true' : undefined}
                onClick={() => setIndex(slide)}
              >
                <span />
              </button>
            ))}
          </div>
        )}
        {count > 1 && (
          <div className="gallery-arrows">
            <button onClick={() => move(-1)} aria-label={t('previous')}>
              <ArrowLeft size={19} className="directional" />
            </button>
            <button onClick={() => move(1)} aria-label={t('nextSlide')}>
              <ArrowRight size={19} className="directional" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
