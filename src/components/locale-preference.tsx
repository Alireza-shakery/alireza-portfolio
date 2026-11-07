'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export const localePreferenceKey = 'portfolio.locale.v1';

export function LocalePreference() {
  const locale = useLocale();

  useEffect(() => {
    try {
      localStorage.setItem(localePreferenceKey, locale);
    } catch {
      // Language routing still works when browser storage is unavailable.
    }
  }, [locale]);

  return null;
}
