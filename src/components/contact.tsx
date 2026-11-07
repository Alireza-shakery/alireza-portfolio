import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { visibleContacts } from '@/content/contacts';
import { Link } from '@/i18n/navigation';
import { SectionHeading } from './section-heading';
import { Reveal } from './reveal';
import { ContactLink } from './contact-link';

export async function ContactSection() {
  const t = await getTranslations('contact');
  const methods = visibleContacts();
  return (
    <section id="contact" tabIndex={-1} className="section contact-section dark-section">
      <div className="container contact-grid">
        <Reveal>
          <SectionHeading
            label={t('label')}
            title={t('title')}
            accent={t('accent')}
            description={t('intro')}
          />
        </Reveal>
        <Reveal className="contact-content" delay={0.1}>
          {methods.length > 0 ? (
            <div className="contact-links" aria-label={t('available')}>
              {methods.map((contact) => (
                <ContactLink key={contact.id} contact={contact} />
              ))}
            </div>
          ) : (
            <div className="contact-empty">
              <span className="contact-empty-icon">
                <MessageCircle size={29} strokeWidth={1.3} />
              </span>
              <h3>{t('emptyTitle')}</h3>
              <p>{t('emptyText')}</p>
              <Link href="/#projects" className="text-link">
                {t('explore')}
                <ArrowUpRight size={18} className="directional" />
              </Link>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
