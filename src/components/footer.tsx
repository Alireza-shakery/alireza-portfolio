import { getTranslations } from 'next-intl/server';
import { ArrowUp } from 'lucide-react';
import { profile } from '@/content/profile';
import type { Locale } from '@/content/types';
import { visibleContacts } from '@/content/contacts';
import { Link } from '@/i18n/navigation';
import { ContactLink } from './contact-link';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const n = await getTranslations('nav');
  const contacts = visibleContacts();
  return (
    <footer className="site-footer dark-section">
      <div className="container">
        <div className="footer-top">
          <div className="footer-identity">
            <strong>{profile.name[locale]}</strong>
            <span>{t('line')}</span>
          </div>
          <a href="#top" className="back-top">
            {t('top')}
            <span>
              <ArrowUp size={18} />
            </span>
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {profile.name[locale]}. {t('copyright')}
          </p>
          <nav aria-label={t('navigation')}>
            {(['about', 'projects', 'contact'] as const).map((id) => (
              <Link key={id} href={`/#${id}`}>
                {n(id)}
              </Link>
            ))}
          </nav>
          {contacts.length > 0 && (
            <div className="footer-socials">
              {contacts.map((contact) => (
                <ContactLink key={contact.id} contact={contact} />
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
