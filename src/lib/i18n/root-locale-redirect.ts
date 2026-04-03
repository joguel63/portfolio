import { DEFAULT_LOCALE, LOCALE_COOKIE_KEY, type AppLocale } from './config';
import { getHomePath } from './navigation';

const ENGLISH_LOCALE = 'en';

export function readPreferredLocale(cookie: string): AppLocale | null {
  const match = cookie
    .split('; ')
    .find((item) => item.startsWith(`${LOCALE_COOKIE_KEY}=`));

  const value = match ? decodeURIComponent(match.split('=')[1]) : null;

  return value === 'es' || value === 'en' ? value : null;
}

export function browserPrefersEnglish(languages: readonly string[]): boolean {
  return languages.some((locale) => locale.toLowerCase().startsWith(ENGLISH_LOCALE));
}

export function getRootRedirectTarget(cookie: string, languages: readonly string[]): string | null {
  const savedLocale = readPreferredLocale(cookie);

  if (savedLocale && savedLocale !== DEFAULT_LOCALE) {
    return getHomePath(savedLocale);
  }

  if (!savedLocale && browserPrefersEnglish(languages)) {
    return getHomePath('en');
  }

  return null;
}

export function createRootLocaleRedirectScript(): string {
  return `(() => {
  const DEFAULT_LOCALE = ${JSON.stringify(DEFAULT_LOCALE)};
  const LOCALE_COOKIE_KEY = ${JSON.stringify(LOCALE_COOKIE_KEY)};
  const ENGLISH_LOCALE = ${JSON.stringify(ENGLISH_LOCALE)};

  function getHomePath(locale) {
    return locale === ENGLISH_LOCALE ? '/en/' : '/';
  }

  function readPreferredLocale(cookie) {
    const match = cookie
      .split('; ')
      .find((item) => item.startsWith(LOCALE_COOKIE_KEY + '='));

    const value = match ? decodeURIComponent(match.split('=')[1]) : null;

    return value === 'es' || value === 'en' ? value : null;
  }

  function browserPrefersEnglish(languages) {
    return Array.from(languages).some((locale) => locale.toLowerCase().startsWith(ENGLISH_LOCALE));
  }

  function getRootRedirectTarget(cookie, languages) {
    const savedLocale = readPreferredLocale(cookie);

    if (savedLocale && savedLocale !== DEFAULT_LOCALE) {
      return getHomePath(savedLocale);
    }

    if (!savedLocale && browserPrefersEnglish(languages)) {
      return getHomePath(ENGLISH_LOCALE);
    }

    return null;
  }

  const target = getRootRedirectTarget(document.cookie, navigator.languages || []);

  if (window.location.pathname === '/' && target) {
    window.location.replace(target);
  }
})();`;
}
