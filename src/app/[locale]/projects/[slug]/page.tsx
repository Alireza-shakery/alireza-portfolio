import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check, Circle } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getProject, projects } from '@/content/projects';
import { safeExternalUrl } from '@/content/contacts';
import { pageMetadata } from '@/lib/metadata';
import { ProjectGallery } from '@/components/project-gallery';
import { Reveal } from '@/components/reveal';
import { ContactSection } from '@/components/contact';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project || !hasLocale(routing.locales, locale)) return {};
  return pageMetadata(
    locale,
    `${project.title[locale]} — ${locale === 'fa' ? 'علیرضا شاکری' : 'Alireza Shakeri'}`,
    project.summary[locale],
    `/projects/${slug}`,
  );
}
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project || !hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const live = safeExternalUrl(project.liveUrl),
    source = safeExternalUrl(project.repositoryUrl);
  return (
    <main id="main" className="project-page">
      <section className="project-hero dark-section">
        <div className="container">
          <Link href="/#projects" className="text-link project-back">
            <ArrowLeft size={18} className="directional" />
            {t('back')}
          </Link>
          <p className="eyebrow">{project.category[locale]}</p>
          <h1>
            {project.title[locale]}
            <span>.</span>
          </h1>
          <div className="project-hero-bottom">
            <p>{project.summary[locale]}</p>
            <span className="project-status">
              <span className="status-dot" />
              {project.status[locale]}
            </span>
          </div>
        </div>
      </section>
      <section className="section dark-section project-story">
        <div className="container">
          <Reveal>
            <div className="project-overview">
              <div>
                <p className="eyebrow">01 / {t('overview')}</p>
                <h2>{t('overview')}</h2>
                <p>{project.caseStudy.overview[locale]}</p>
              </div>
              <dl className="project-facts">
                <div>
                  <dt>{t('status')}</dt>
                  <dd>{project.status[locale]}</dd>
                </div>
                <div>
                  <dt>{t('role')}</dt>
                  <dd>{project.caseStudy.role[locale]}</dd>
                </div>
                <div>
                  <dt>{t('stack')}</dt>
                  <dd>
                    {project.technologies.length
                      ? project.technologies.join(' · ')
                      : project.caseStudy.technologyNote[locale]}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
          <Reveal>
            <div className="gallery-heading">
              <p className="eyebrow">02 / {t('gallery')}</p>
              <h2>{t('gallery')}</h2>
              <p>
                {project.cover.src || project.screenshots.some((photo) => photo.src)
                  ? project.title[locale]
                  : t('galleryNote')}
              </p>
            </div>
            <ProjectGallery
              screenshots={
                project.screenshots.some((photo) => photo.src)
                  ? project.screenshots
                  : project.cover.src
                    ? [project.cover]
                    : []
              }
            />
          </Reveal>
          <div className="project-features">
            <Reveal>
              <h2>{t('planned')}</h2>
              <ul>
                {project.caseStudy.plannedFeatures[locale].map((feature) => (
                  <li key={feature}>
                    <Circle size={15} />
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <h2>{t('implemented')}</h2>
              {project.caseStudy.implementedFeatures[locale].length ? (
                <ul>
                  {project.caseStudy.implementedFeatures[locale].map((feature) => (
                    <li key={feature}>
                      <Check size={17} />
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t('unverified')}</p>
              )}
            </Reveal>
          </div>
          <div className="project-thinking">
            <Reveal>
              <p className="eyebrow">03 / {t('challenge')}</p>
              <h2>{t('challenge')}</h2>
              <p>{project.caseStudy.challenge[locale]}</p>
            </Reveal>
            <Reveal>
              <p className="eyebrow">04 / {t('solution')}</p>
              <h2>{t('solution')}</h2>
              <p>{project.caseStudy.solution[locale]}</p>
            </Reveal>
          </div>
          <div className="project-outbound">
            {live && (
              <a
                className="button button-primary"
                href={live}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('live')}
                <ArrowUpRight size={18} />
              </a>
            )}
            {source && (
              <a
                className="button button-outline"
                href={source}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('source')}
                <ArrowUpRight size={18} />
              </a>
            )}
            {!live && !source && <p>{t('noLinks')}</p>}
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
