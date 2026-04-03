export const LOCALES = ['es', 'en'] as const;
export const DEFAULT_LOCALE = 'es';
export const LOCALE_COOKIE_KEY = 'preferred-locale';
export const LOCALE_COOKIE_MAX_AGE = 31536000;

export type AppLocale = (typeof LOCALES)[number];
