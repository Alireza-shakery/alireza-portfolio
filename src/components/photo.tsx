import Image from 'next/image';
import type { Locale, Photo } from '@/content/types';
import { PortraitImage } from './portrait-image';

export function PhotoSlot({
  photo,
  locale,
  variant = 0,
  label,
  priority = false,
}: {
  photo: Photo;
  locale: Locale;
  variant?: number;
  label: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo-slot photo-variant-${variant}`}>
      {photo.src && priority ? (
        <PortraitImage
          src={photo.src}
          alt={photo.alt[locale]}
          position={photo.position ?? 'center'}
        />
      ) : photo.src ? (
        <Image
          src={photo.src}
          alt={photo.alt[locale]}
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: photo.position ?? 'center' }}
        />
      ) : (
        <>
          <div className="photo-art" aria-hidden="true">
            <div className="art-arch" />
            <div className="art-orbit" />
            <div className="art-line" />
            <span className="art-monogram">as.</span>
          </div>
          <span className="photo-placeholder-label">
            <span className="tiny-cross" aria-hidden="true">
              +
            </span>
            {label}
          </span>
        </>
      )}
    </div>
  );
}
