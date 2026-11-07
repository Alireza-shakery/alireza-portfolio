'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Code2, Database, Layers, Terminal } from 'lucide-react';
import { skillCategories } from '@/content/profile';
import type { Locale } from '@/content/types';
import { SectionHeading } from './section-heading';
import { Reveal } from './reveal';

const icons = [Code2, Terminal, Database, Layers];
export function SkillsSection() {
  const t = useTranslations('skills');
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState('all');
  const categories =
    selected === 'all' ? skillCategories : skillCategories.filter((item) => item.id === selected);
  return (
    <section id="skills" tabIndex={-1} className="section skills-section dark-section">
      <div className="container">
        <Reveal>
          <SectionHeading
            label={t('label')}
            title={t('title')}
            accent={t('accent')}
            description={t('intro')}
          />
        </Reveal>
        <Reveal>
          <div className="skill-filters" role="group" aria-label={t('filter')}>
            <button aria-pressed={selected === 'all'} onClick={() => setSelected('all')}>
              {t('all')}
            </button>
            {skillCategories.map((category) => (
              <button
                key={category.id}
                aria-pressed={selected === category.id}
                onClick={() => setSelected(category.id)}
              >
                {category.title[locale]}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="skills-grid" aria-live="polite">
          {categories.map((category) => {
            const index = skillCategories.findIndex((item) => item.id === category.id);
            const Icon = icons[index];
            return (
              <article className="skill-card" key={category.id}>
                <div className="skill-card-top">
                  <Icon size={23} strokeWidth={1.4} />
                  <span className="mono">0{index + 1}</span>
                </div>
                <div>
                  <h3>{category.title[locale]}</h3>
                  <p className="skill-description">{category.description[locale]}</p>
                </div>
                <div className="tech-tags">
                  {category.technologies.map((tech) => (
                    <span key={tech} dir="ltr">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <p className="skills-note">
          <span className="status-dot" />
          {t('note')}
        </p>
      </div>
    </section>
  );
}
