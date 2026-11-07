'use client';

import { useEffect } from 'react';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { localePreferenceKey } from './locale-preference';

export function LocaleRedirect() {
  useEffect(() => {
    let savedLocale: string | null = null;
    try {
      savedLocale = localStorage.getItem(localePreferenceKey);
    } catch {
      // Fall back to browser languages when storage is blocked.
    }
    const browserLocale = (navigator.languages ?? [navigator.language])
      .map((language) => language.toLowerCase().split('-')[0])
      .find((language) => hasLocale(routing.locales, language));
    const locale = hasLocale(routing.locales, savedLocale)
      ? savedLocale
      : (browserLocale ?? routing.defaultLocale);

    window.location.replace(`/${locale}${window.location.search}${window.location.hash}`);
  }, []);

  return null;
}
