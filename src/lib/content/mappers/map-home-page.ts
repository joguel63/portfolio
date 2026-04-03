import type { AppLocale } from '../../i18n/config';
import type { HomePageModel, SiteContentCollection } from '../types/content';

export function mapHomePage(locale: AppLocale, content: SiteContentCollection): HomePageModel {
  const emailHref = `mailto:${content.site.author.email}`;

  return {
    locale,
    navigation: content.navigation,
    hero: content.home.hero,
    about: content.home.about,
    stack: {
      ...content.home.stack,
      items: [...content.stack].sort((left, right) => left.order - right.order),
    },
    projects: {
      ...content.home.projects,
      items: content.projects,
    },
    contact: {
      ...content.home.contact,
      primaryAction: content.home.contact.primaryAction,
      links: {
        email: emailHref,
        github: content.site.social.github,
        linkedin: content.site.social.linkedin,
        resume: content.site.assets.resume,
      },
    },
    seo: content.seo,
  };
}
