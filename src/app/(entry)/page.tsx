import type { Metadata } from 'next';
import Link from 'next/link';
import { LocaleRedirect } from '@/components/locale-redirect';

export const metadata: Metadata = {
  title: 'Alireza Shakeri — Choose your language | انتخاب زبان',
  robots: { index: false, follow: true },
};

export default function EntryPage() {
  return (
    <main id="main" className="not-found dark-section">
      <LocaleRedirect />
      <p className="eyebrow">Alireza Shakeri / علیرضا شاکری</p>
      <h1>Choose your language</h1>
      <p>Continue to the portfolio in English or Persian.</p>
      <Link href="/en" hrefLang="en" className="button button-primary">
        English
      </Link>
      <div lang="fa" dir="rtl" className="not-found-persian">
        <h2>زبان خود را انتخاب کنید</h2>
        <p>پورتفولیو را به فارسی یا انگلیسی مشاهده کنید.</p>
        <Link href="/fa" hrefLang="fa" className="button button-outline">
          فارسی
        </Link>
      </div>
    </main>
  );
}
