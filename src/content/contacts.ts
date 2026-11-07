import type { ContactMethod } from './types';

// Only verified, enabled values appear. Empty values never become public links.
export const contacts: ContactMethod[] = [
  {
    id: 'email',
    name: { en: 'Email', fa: 'ایمیل' },
    icon: 'mail',
    kind: 'email',
    value: null,
    enabled: true,
    priority: 1,
  },
  {
    id: 'phone',
    name: { en: 'Phone', fa: 'تلفن' },
    icon: 'phone',
    kind: 'phone',
    value: '+989134975033',
    subtitle: { en: '09134975033', fa: '09134975033' },
    enabled: true,
    phoneVisibility: 'direct',
    priority: 2,
  },
  {
    id: 'instagram',
    name: { en: 'Instagram', fa: 'اینستاگرام' },
    icon: 'instagram',
    kind: 'url',
    value: 'https://www.instagram.com/its.shakeri/',
    subtitle: { en: '@its.shakeri', fa: '@its.shakeri' },
    enabled: true,
    priority: 3,
  },
  {
    id: 'telegram',
    name: { en: 'Telegram', fa: 'تلگرام' },
    icon: 'telegram',
    kind: 'url',
    value: 'https://t.me/Alireza_Shakery',
    subtitle: { en: '@Alireza_Shakery', fa: '@Alireza_Shakery' },
    enabled: true,
    priority: 4,
  },
  {
    id: 'github',
    name: { en: 'GitHub', fa: 'گیت‌هاب' },
    icon: 'github',
    kind: 'url',
    value: 'https://github.com/Alireza-shakery',
    subtitle: { en: '@Alireza-shakery', fa: '@Alireza-shakery' },
    enabled: true,
    priority: 5,
  },
  {
    id: 'linkedin',
    name: { en: 'LinkedIn', fa: 'لینکدین' },
    icon: 'linkedin',
    kind: 'url',
    value: 'https://www.linkedin.com/in/alireza-shakery-705431446',
    subtitle: { en: 'Alireza Shakeri', fa: 'Alireza Shakeri' },
    enabled: true,
    priority: 6,
  },
  {
    id: 'whatsapp',
    name: { en: 'WhatsApp', fa: 'واتساپ' },
    icon: 'whatsapp',
    kind: 'url',
    value: null,
    enabled: false,
  },
  {
    id: 'eitaa',
    name: { en: 'Eitaa', fa: 'ایتا' },
    icon: 'message',
    kind: 'url',
    value: null,
    enabled: false,
  },
  {
    id: 'bale',
    name: { en: 'Bale', fa: 'بله' },
    icon: 'message',
    kind: 'url',
    value: null,
    enabled: false,
  },
];

export function contactHref(contact: ContactMethod): string | null {
  if (!contact.enabled || !contact.value?.trim()) return null;
  const value = contact.value.trim();
  if (contact.kind === 'email')
    return /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value) ? `mailto:${value}` : null;
  if (contact.kind === 'phone') {
    const number = value.replace(/[\s()-]/g, '');
    return /^\+[1-9]\d{6,14}$/.test(number) ? `tel:${number}` : null;
  }
  return safeExternalUrl(value);
}

export function safeExternalUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function visibleContacts() {
  return contacts
    .filter((contact) => contactHref(contact))
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
}
