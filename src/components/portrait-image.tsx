'use client';

import Image from 'next/image';

export function PortraitImage({
  src,
  alt,
  position,
}: {
  src: string;
  alt: string;
  position: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload
      className="portrait-image"
      sizes="(max-width: 767px) 290px, (max-width: 1199px) 34vw, 330px"
      style={{ objectFit: 'cover', objectPosition: position }}
      onLoad={(event) => {
        // Start the fade only once the real photo has loaded, including cached loads.
        event.currentTarget.classList.add('is-loaded');
      }}
    />
  );
}
