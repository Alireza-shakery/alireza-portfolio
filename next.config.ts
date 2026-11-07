import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'export',
  // Cloudflare Pages serves /en.html as /en, preserving existing URLs.
  trailingSlash: false,
  images: { unoptimized: true },
  poweredByHeader: false,
  // The root layout lives under [locale]; unmatched URLs need their own document.
  experimental: { globalNotFound: true },
};
export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
