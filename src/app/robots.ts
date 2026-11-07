import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', ...(site.url ? { allow: '/' } : { disallow: '/' }) },
    ...(site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
