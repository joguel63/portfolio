import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_KEY,
  LOCALE_COOKIE_MAX_AGE,
  getLocaleFromPath,
  isSupportedLocale,
} from '../../src/lib/i18n/locale';
import { createRootLocaleRedirectScript, getRootRedirectTarget } from '../../src/lib/i18n/root-locale-redirect';
import languageSwitcherSource from '../../src/components/molecules/LanguageSwitcher.astro?raw';

function createLanguageSwitcherCookie(locale: 'es' | 'en') {
  const cookieWrites: string[] = [];
  const document = {
    cookie: '',
  };

  Object.defineProperty(document, 'cookie', {
    get() {
      return cookieWrites.at(-1) ?? '';
    },
    set(value: string) {
      cookieWrites.push(value);
    },
  });

  const switcher = {
    dataset: {
      cookieKey: LOCALE_COOKIE_KEY,
      cookieMaxAge: String(LOCALE_COOKIE_MAX_AGE),
    },
  };

  const cookieLocale = locale;
  const cookieKeyValue = switcher.dataset.cookieKey;
  const cookieMaxAgeValue = switcher.dataset.cookieMaxAge;

  if (cookieLocale && cookieKeyValue && cookieMaxAgeValue) {
    document.cookie = `${cookieKeyValue}=${encodeURIComponent(cookieLocale)}; path=/; max-age=${cookieMaxAgeValue}`;
  }

  return cookieWrites.at(-1);
}

describe('locale config', () => {
  it('exposes the supported locales', () => {
    expect(LOCALES).toEqual(['es', 'en']);
    expect(DEFAULT_LOCALE).toBe('es');
    expect(LOCALE_COOKIE_KEY).toBe('preferred-locale');
    expect(LOCALE_COOKIE_MAX_AGE).toBe(31536000);
  });

  it('extracts locale from localized and default paths', () => {
    expect(getLocaleFromPath('/')).toBe('es');
    expect(getLocaleFromPath('/en')).toBe('en');
    expect(getLocaleFromPath('/en/')).toBe('en');
    expect(getLocaleFromPath('/en/projects')).toBe('en');
    expect(getLocaleFromPath('/engineering')).toBe('es');
    expect(getLocaleFromPath('/english')).toBe('es');
  });

  it('accepts es and en only', () => {
    expect(isSupportedLocale('es')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(false);
  });
});

describe('getRootRedirectTarget', () => {
  it('redirects to en on first visit when browser prefers english', () => {
    expect(getRootRedirectTarget('', ['en-US', 'es-ES'])).toBe('/en/');
  });

  it('does not redirect when browser prefers spanish', () => {
    expect(getRootRedirectTarget('', ['es-ES'])).toBeNull();
  });

  it('honors saved english preference', () => {
    expect(getRootRedirectTarget('preferred-locale=en', ['es-ES'])).toBe('/en/');
  });

  it('creates build-safe inline redirect code without typescript syntax', () => {
    const script = createRootLocaleRedirectScript();

    expect(script).toContain('window.location.replace(target);');
    expect(script).not.toContain('readonly');
    expect(script).not.toContain(': string');
    expect(script).not.toContain('export ');
  });
});

describe('LanguageSwitcher cookie contract', () => {
  it('persists the manual locale choice with the expected cookie attributes', () => {
    expect(languageSwitcherSource).toContain('document.cookie = `${cookieKey}=${encodeURIComponent(locale)}; path=/; max-age=${maxAge}`;');
    expect(languageSwitcherSource).toContain('data-cookie-key={LOCALE_COOKIE_KEY}');
    expect(languageSwitcherSource).toContain('data-cookie-max-age={String(LOCALE_COOKIE_MAX_AGE)}');
    expect(createLanguageSwitcherCookie('en')).toBe(
      'preferred-locale=en; path=/; max-age=31536000',
    );
  });
});
