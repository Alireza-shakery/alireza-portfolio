import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <main id="main" className="not-found dark-section">
      <p className="eyebrow">404</p>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/" className="button button-primary">
        {t('home')}
      </Link>
    </main>
  );
}
