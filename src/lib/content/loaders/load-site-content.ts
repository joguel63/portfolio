import navigationJson from '../../../content/global/navigation.json';
import siteJson from '../../../content/global/site.json';
import homeEnJson from '../../../content/pages/home.en.json';
import homeEsJson from '../../../content/pages/home.es.json';
import projectsEnJson from '../../../content/projects/projects.en.json';
import projectsEsJson from '../../../content/projects/projects.es.json';
import seoEnJson from '../../../content/seo/seo.en.json';
import seoEsJson from '../../../content/seo/seo.es.json';
import stackEnJson from '../../../content/stack/stack.en.json';
import stackEsJson from '../../../content/stack/stack.es.json';

import type { AppLocale } from '../../i18n/config';
import type {
  HomeContent,
  NavigationContent,
  NavigationContentSource,
  ProjectsContent,
  SeoContent,
  SiteContent,
  SiteContentCollection,
  StackContent,
} from '../types/content';
import { loadJson } from './load-json';
import { homeSchema } from '../schemas/home';
import { navigationSchema } from '../schemas/navigation';
import { projectsSchema } from '../schemas/projects';
import { seoSchema } from '../schemas/seo';
import { siteSchema } from '../schemas/site';
import { stackSchema } from '../schemas/stack';

const homeByLocale: Record<AppLocale, unknown> = {
  es: homeEsJson,
  en: homeEnJson,
};

const stackByLocale: Record<AppLocale, unknown> = {
  es: stackEsJson,
  en: stackEnJson,
};

const projectsByLocale: Record<AppLocale, unknown> = {
  es: projectsEsJson,
  en: projectsEnJson,
};

const seoByLocale: Record<AppLocale, unknown> = {
  es: seoEsJson,
  en: seoEnJson,
};

function localizeNavigation(locale: AppLocale, content: NavigationContentSource): NavigationContent {
  return {
    sections: content.sections.map((section) => ({
      id: section.id,
      label: section.labels[locale],
    })),
    localeLabels: content.localeLabels,
  };
}

export async function loadSiteContent(locale: AppLocale): Promise<SiteContentCollection> {
  const site = loadJson<SiteContent>('site.json', siteSchema, siteJson);
  const navigationSource = loadJson<NavigationContentSource>(
    'navigation.json',
    navigationSchema,
    navigationJson,
  );
  const home = loadJson<HomeContent>(`home.${locale}.json`, homeSchema, homeByLocale[locale]);
  const stack = loadJson<StackContent>(`stack.${locale}.json`, stackSchema, stackByLocale[locale]);
  const projects = loadJson<ProjectsContent>(
    `projects.${locale}.json`,
    projectsSchema,
    projectsByLocale[locale],
  );
  const seo = loadJson<SeoContent>(`seo.${locale}.json`, seoSchema, seoByLocale[locale]);

  return {
    site,
    navigation: localizeNavigation(locale, navigationSource),
    home,
    stack,
    projects,
    seo,
  };
}
