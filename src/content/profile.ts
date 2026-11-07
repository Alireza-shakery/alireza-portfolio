import type { Localized, Photo } from './types';

export const profile = {
  name: { en: 'Alireza Shakeri', fa: 'علیرضا شاکری' },
  firstName: { en: 'Alireza', fa: 'علیرضا' },
  lastName: { en: 'Shakeri', fa: 'شاکری' },
  title: { en: 'Full-Stack Developer', fa: 'توسعه‌دهنده فول‌استک' },
  introduction: {
    en: 'I build websites and web applications, with a focus on clear interfaces, performance, and maintainable code.',
    fa: 'وب‌سایت و اپلیکیشن وب می‌سازم؛ با تمرکز بر رابط کاربری روشن، عملکرد مناسب و کد قابل نگهداری.',
  },
  // Provisional introduction supplied in the brief; refine before launch.
  biography: {
    en: 'I’m Alireza, a Full-Stack Developer interested in how interfaces and application logic work together. I enjoy working through the details that make a website easier to use and maintain.',
    fa: 'من علیرضا هستم، توسعه‌دهنده فول‌استک. به ارتباط رابط کاربری و منطق برنامه علاقه دارم و از کار روی جزئیاتی لذت می‌برم که استفاده و نگهداری یک وب‌سایت را ساده‌تر می‌کنند.',
  },
  philosophy: {
    en: 'My focus is on understanding the problem, keeping the structure clear, and improving the result through testing.',
    fa: 'تمرکزم روی شناخت مسئله، ساختار روشن و بهبود نتیجه با آزمون و بازبینی است.',
  },
  portrait: {
    src: '/images/profile/hero.png',
    position: '50% 42%',
    alt: { en: 'Portrait of Alireza Shakeri', fa: 'پرتره علیرضا شاکری' },
  } as Photo,
  photos: [
    { src: null, alt: { en: 'Alireza at his workspace', fa: 'علیرضا در فضای کار' } },
    {
      src: null,
      alt: { en: 'A personal moment outside the screen', fa: 'لحظه‌ای دور از صفحه نمایش' },
    },
    { src: null, alt: { en: 'Details from the creative process', fa: 'جزئیاتی از فرایند خلاقیت' } },
  ] satisfies Photo[],
};

export const skillCategories: {
  id: string;
  title: Localized;
  description: Localized;
  technologies: string[];
}[] = [
  {
    id: 'frontend',
    title: { en: 'Frontend', fa: 'فرانت‌اند' },
    description: { en: 'Structure, styling, and interaction.', fa: 'ساختار، ظاهر و تعامل.' },
    technologies: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js'],
  },
  {
    id: 'backend',
    title: { en: 'Backend', fa: 'بک‌اند' },
    description: { en: 'Application logic and APIs.', fa: 'منطق برنامه و رابط‌های API.' },
    technologies: ['Node.js', 'NestJS', 'Prisma'],
  },
  {
    id: 'data',
    title: { en: 'Data', fa: 'داده' },
    description: { en: 'Storage, queries, and caching.', fa: 'ذخیره‌سازی، پرس‌وجو و کش.' },
    technologies: ['MySQL', 'Redis'],
  },
  {
    id: 'workflow',
    title: { en: 'Tools & deployment', fa: 'ابزارها و استقرار' },
    description: { en: 'Version control and delivery.', fa: 'کنترل نسخه و انتشار.' },
    technologies: ['Git', 'GitHub', 'Docker', 'Vercel'],
  },
];
