'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowUpRight,
  Mail,
  Phone,
  Instagram,
  Github,
  Linkedin,
  MessageCircle,
  Link as LinkIcon,
} from 'lucide-react';
import type { ContactMethod, Locale } from '@/content/types';
import { contactHref } from '@/content/contacts';

function TelegramIcon({ size = 23 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24ZM17.56 8.16l-1.97 9.28c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.22-3.05 5.55-5.02c.24-.22-.05-.34-.37-.13l-6.86 4.32-2.96-.93c-.64-.2-.65-.64.13-.95l11.57-4.46c.54-.2 1.01.13.84.95Z" />
    </svg>
  );
}

const icons = {
  mail: Mail,
  phone: Phone,
  instagram: Instagram,
  telegram: TelegramIcon,
  github: Github,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  message: MessageCircle,
  link: LinkIcon,
};
export function ContactLink({ contact }: { contact: ContactMethod }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('contact');
  const [revealed, setRevealed] = useState(false);
  const href = contactHref(contact);
  if (!href) return null;
  const Icon = icons[contact.icon];
  const content = (
    <>
      <Icon size={23} />
      <span>
        <strong>{contact.name[locale]}</strong>
        <span>
          <bdi dir="ltr">{contact.subtitle?.[locale] ?? contact.value}</bdi>
        </span>
      </span>
      <ArrowUpRight size={20} className="directional" />
    </>
  );
  if (contact.kind === 'phone' && contact.phoneVisibility === 'reveal' && !revealed)
    return (
      <button className="contact-link" onClick={() => setRevealed(true)}>
        <Icon size={23} />
        <span>
          <strong>{contact.name[locale]}</strong>
          <span>{t('reveal')}</span>
        </span>
        <span>+</span>
      </button>
    );
  return (
    <a
      className="contact-link"
      href={href}
      aria-label={`${contact.name[locale]}: ${contact.subtitle?.[locale] ?? contact.value}`}
      target={contact.kind === 'url' ? '_blank' : undefined}
      rel={contact.kind === 'url' ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  );
}
