export type Locale = 'en' | 'fa';
export type Localized<T = string> = Record<Locale, T>;
export type Photo = { src: string | null; alt: Localized; position?: string };
export type Project = {
  slug: string;
  title: Localized;
  summary: Localized;
  category: Localized;
  featured: boolean;
  status: Localized;
  cover: Photo;
  screenshots: Photo[];
  technologies: string[];
  liveUrl: string | null;
  repositoryUrl: string | null;
  caseStudy: {
    overview: Localized;
    role: Localized;
    technologyNote: Localized;
    plannedFeatures: Localized<string[]>;
    implementedFeatures: Localized<string[]>;
    challenge: Localized;
    solution: Localized;
  };
};
export type ContactIcon =
  | 'mail'
  | 'phone'
  | 'instagram'
  | 'telegram'
  | 'github'
  | 'linkedin'
  | 'whatsapp'
  | 'message'
  | 'link';
export type ContactMethod = {
  id: string;
  name: Localized;
  icon: ContactIcon;
  kind: 'email' | 'phone' | 'url';
  value: string | null;
  enabled: boolean;
  priority?: number;
  subtitle?: Localized;
  phoneVisibility?: 'direct' | 'reveal';
};
