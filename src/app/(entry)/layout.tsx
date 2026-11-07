import type { ReactNode } from 'react';
import { geist, vazirmatn } from '../fonts';
import '../globals.css';

export default function EntryLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${vazirmatn.variable}`}>
      <body>{children}</body>
    </html>
  );
}
