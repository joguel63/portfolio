import type { AppLocale } from './config';

export function getHomePath(locale: AppLocale): string {
  return locale === 'en' ? '/en/' : '/';
}

export function getSectionPath(locale: AppLocale, sectionId: string): string {
  return `${getHomePath(locale)}#${sectionId}`;
}
