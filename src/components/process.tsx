import { getTranslations } from 'next-intl/server';
import { Scan, Network, Code2, SlidersHorizontal } from 'lucide-react';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

const stages = [
  { key: 'one', icon: Scan },
  { key: 'two', icon: Network },
  { key: 'three', icon: Code2 },
  { key: 'four', icon: SlidersHorizontal },
] as const;
export async function ProcessSection() {
  const t = await getTranslations('process');
  return (
    <section className="section process-section dark-section">
      <div className="container process-grid">
        <Reveal className="process-heading">
          <SectionHeading
            label={t('label')}
            title={t('title')}
            accent={t('accent')}
            description={t('intro')}
          />
        </Reveal>
        <div className="process-steps">
          {stages.map(({ key, icon: Icon }, index) => (
            <Reveal delay={index * 0.04} key={key}>
              <article className="process-step">
                <div className="process-step-number mono">0{index + 1}</div>
                <div className="process-step-content">
                  <div className="process-step-title">
                    <h3>{t(`${key}Title`)}</h3>
                    <Icon size={24} strokeWidth={1.3} />
                  </div>
                  <p>{t(`${key}Text`)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
