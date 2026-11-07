import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { projects } from '@/content/projects';
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return ['', ...projects.map((project) => `/projects/${project.slug}`)].flatMap((path) =>
    ['en', 'fa'].map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      alternates: { languages: { en: `${site.url}/en${path}`, fa: `${site.url}/fa${path}` } },
    })),
  );
}
