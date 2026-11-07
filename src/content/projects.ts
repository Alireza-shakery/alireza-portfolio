import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'danafa',
    title: { en: 'DANAFA', fa: 'دانافا' },
    summary: {
      en: 'An online education and webinar platform, bringing courses and live learning into one place.',
      fa: 'پلتفرم آموزش و وبینار آنلاین؛ برای دسترسی به دوره‌ها و یادگیری زنده در یک محیط یکپارچه.',
    },
    category: { en: 'Education & webinars', fa: 'آموزش و وبینار آنلاین' },
    featured: true,
    status: { en: 'Project concept', fa: 'طرح مفهومی پروژه' },
    cover: {
      src: '/images/projects/danafa/cover.webp',
      alt: {
        en: 'Screenshot of the DANAFA online education and webinar platform',
        fa: 'اسکرین‌شات پلتفرم آموزش و وبینار آنلاین دانافا',
      },
    },
    screenshots: [],
    technologies: [],
    liveUrl: null,
    repositoryUrl: null,
    caseStudy: {
      overview: {
        en: 'DANAFA is an online education and webinar project. The proposed scope connects courses, live sessions, and a personal learning space. The features below remain planned until their implementation is confirmed.',
        fa: 'دانافا پروژه‌ای در زمینه آموزش و وبینار آنلاین است. محدوده پیشنهادی آن، دوره‌ها، جلسات زنده و فضای شخصی یادگیری را به هم متصل می‌کند. قابلیت‌های زیر تا زمان تأیید پیاده‌سازی، به‌عنوان برنامه پروژه معرفی می‌شوند.',
      },
      role: {
        en: 'Personal project. Detailed responsibilities and implementation contributions are awaiting confirmation.',
        fa: 'پروژه شخصی. جزئیات مسئولیت‌ها و مشارکت در پیاده‌سازی هنوز تأیید نشده است.',
      },
      technologyNote: {
        en: 'The implementation stack has not been confirmed. Technology tags will be added when verified.',
        fa: 'فناوری‌های پیاده‌سازی هنوز تأیید نشده‌اند. برچسب‌ها پس از تأیید اضافه خواهند شد.',
      },
      plannedFeatures: {
        en: [
          'Online courses and recorded lessons',
          'Live educational sessions and webinars',
          'Instructor profiles',
          'Personal learner dashboards',
          'Course management',
        ],
        fa: [
          'دوره‌های آنلاین و درس‌های ضبط‌شده',
          'جلسات آموزشی زنده و وبینارها',
          'پروفایل مدرس‌ها',
          'داشبورد شخصی یادگیرنده',
          'مدیریت دوره‌ها',
        ],
      },
      implementedFeatures: { en: [], fa: [] },
      challenge: {
        en: 'Make it easy to move between courses, live webinars, and recorded lessons without losing context.',
        fa: 'جابه‌جایی میان دوره‌ها، وبینارهای زنده و درس‌های ضبط‌شده باید ساده باشد و مسیر یادگیری را قطع نکند.',
      },
      solution: {
        en: 'Use a consistent course structure and a personal learning area with clear routes to finding content and continuing a lesson. This approach has not yet been validated.',
        fa: 'ساختار یکسان برای دوره‌ها و فضای شخصی یادگیری، با مسیر مشخص برای یافتن محتوا و ادامه درس. این رویکرد هنوز ارزیابی نشده است.',
      },
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
