import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/content/projects';
import { safeExternalUrl } from '@/content/contacts';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { ScreenshotPlaceholder } from './screenshot-placeholder';

export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = await getTranslations('projects');
  return (
    <section id="projects" tabIndex={-1} className="section projects-section dark-section">
      <div className="container">
        <Reveal className="projects-heading">
          <SectionHeading label={t('label')} title={t('title')} accent={t('accent')} />
          <p className="section-intro">{t('intro')}</p>
        </Reveal>
        <div className="project-list">
          {projects.map((project, index) => {
            const cover = project.cover.src
              ? project.cover
              : project.screenshots.find((photo) => photo.src);
            const live = safeExternalUrl(project.liveUrl);
            const source = safeExternalUrl(project.repositoryUrl);
            return (
              <Reveal key={project.slug}>
                <article className={`project-card ${project.featured ? 'is-featured' : ''}`}>
                  <Link className="project-visual-link" href={`/projects/${project.slug}`}>
                    <span className="sr-only">
                      {t('details')}: {project.title[locale]}
                    </span>
                    <div className="project-browser">
                      <div className="browser-chrome" aria-hidden="true">
                        <span className="browser-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span>{project.title.en.toUpperCase()}</span>
                        <span className="mono">0{index + 1}</span>
                      </div>
                      <div className="project-stage">
                        {cover?.src ? (
                          <Image
                            src={cover.src}
                            alt={cover.alt[locale]}
                            fill
                            sizes="(max-width: 767px) 92vw, (max-width: 1199px) 55vw, 650px"
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          <ScreenshotPlaceholder
                            title={t('noScreenshots')}
                            description={t('imagePending')}
                          />
                        )}
                      </div>
                      <div className="project-stage-caption">
                        <span>{project.category[locale]}</span>
                        <ArrowUpRight size={18} className="directional" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                  <div className="project-info">
                    <p className="eyebrow">
                      {project.featured ? t('featured') : project.category[locale]}
                    </p>
                    <h3>
                      <Link href={`/projects/${project.slug}`}>
                        {project.title[locale]}
                        <span className="project-native-name" lang={locale === 'en' ? 'fa' : 'en'}>
                          {project.title[locale === 'en' ? 'fa' : 'en']}
                        </span>
                      </Link>
                    </h3>
                    <p className="project-summary">{project.summary[locale]}</p>
                    <div className="project-tags">
                      <span className="project-status">
                        <span className="status-dot" />
                        {project.status[locale]}
                      </span>
                      {project.technologies.map((tech) => (
                        <span key={tech} dir="ltr">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-link project-detail-link"
                    >
                      {t('details')}
                      <ArrowUpRight size={18} className="directional" />
                    </Link>
                    {(live || source) && (
                      <div className="project-external-links">
                        {live && (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link"
                          >
                            {t('live')}
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                        {source && (
                          <a
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link"
                          >
                            {t('source')}
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
