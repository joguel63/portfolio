import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_KEY,
  LOCALE_COOKIE_MAX_AGE,
  type AppLocale,
} from './config';

export { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE_KEY, LOCALE_COOKIE_MAX_AGE };
export type { AppLocale };

export function isSupportedLocale(value: string): value is AppLocale {
  return LOCALES.includes(value as AppLocale);
}

export function getLocaleFromPath(pathname: string): AppLocale {
  return /^\/en(?:\/|$)/.test(pathname) ? 'en' : DEFAULT_LOCALE;
}
