import type { Metadata } from 'next';
import Link from 'next/link';
import { geist, vazirmatn } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: '404 — Page not found | صفحه پیدا نشد',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geist.variable} ${vazirmatn.variable}`}>
      <body>
        <main id="main" className="not-found dark-section">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p>This address is unavailable. You can return to the portfolio.</p>
          <Link href="/en" className="button button-primary">
            Back to the portfolio
          </Link>
          <div lang="fa" dir="rtl" className="not-found-persian">
            <h2>صفحه پیدا نشد</h2>
            <p>این آدرس در دسترس نیست. می‌توانید به پورتفولیو برگردید.</p>
            <Link href="/fa" className="button button-outline">
              بازگشت به پورتفولیو
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
