import localFont from 'next/font/local';

export const geist = localFont({
  src: '../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
  variable: '--font-geist',
  display: 'swap',
  weight: '100 900',
});

export const vazirmatn = localFont({
  src: '../../node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2',
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: '100 900',
});
