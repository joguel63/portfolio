import type { AppLocale } from '../../i18n/config';

export type LocalizedValue<T> = Record<AppLocale, T>;

export type SectionId = 'hero' | 'sobre-mi' | 'stack' | 'proyectos' | 'contacto';

export interface SiteContent {
  siteUrl: string;
  author: {
    name: string;
    role: string;
    email: string;
  };
  social: {
    github: string;
    linkedin: string;
  };
  assets: {
    defaultOgImage?: string;
    resume?: string;
  };
}

export interface NavigationSectionSource {
  id: SectionId;
  labels: LocalizedValue<string>;
}

export interface NavigationContentSource {
  sections: NavigationSectionSource[];
  localeLabels: LocalizedValue<string>;
}

export interface NavigationSection {
  id: SectionId;
  label: string;
}

export interface NavigationContent {
  sections: NavigationSection[];
  localeLabels: LocalizedValue<string>;
}

export interface ActionContent {
  label: string;
  href: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  primaryCta: ActionContent;
  secondaryCta: ActionContent;
}

export interface HomeStatContent {
  value: string;
  label: string;
}

export interface HomeAboutContent {
  title: string;
  heading: string;
  body: string[];
  stats: HomeStatContent[];
  image?: string;
  imageAlt: string;
}

export interface HomeSectionContent {
  title: string;
  intro: string;
  sublabel?: string;
}

export interface HomeContactContent {
  title: string;
  heading: string;
  description: string;
  primaryAction: ActionContent;
  secondaryAction?: ActionContent;
}

export interface HomeContent {
  hero: HomeHeroContent;
  about: HomeAboutContent;
  stack: HomeSectionContent;
  projects: HomeSectionContent;
  contact: HomeContactContent;
}

export interface StackItemContent {
  id: string;
  label: string;
  category: string;
  order: number;
  icon?: string;
  description?: string;
  skills: string[];
}

export type StackContent = StackItemContent[];

export interface ProjectLinkContent {
  url: string;
  label?: string;
}

export interface ProjectLinksContent {
  demo?: ProjectLinkContent;
  repo?: ProjectLinkContent;
  caseStudy?: ProjectLinkContent;
}

export interface ProjectItemContent {
  id: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  stack: string[];
  featured: boolean;
  image?: string;
  imageAlt?: string;
  links: ProjectLinksContent;
}

export type ProjectsContent = ProjectItemContent[];

export interface SeoContent {
  title: string;
  description: string;
  ogImage: string;
}

export interface SiteContentCollection {
  site: SiteContent;
  navigation: NavigationContent;
  home: HomeContent;
  stack: StackContent;
  projects: ProjectsContent;
  seo: SeoContent;
}

export interface HomePageModel {
  locale: AppLocale;
  navigation: NavigationContent;
  hero: HomeHeroContent;
  about: HomeAboutContent;
  stack: HomeSectionContent & { items: StackItemContent[] };
  projects: HomeSectionContent & { items: ProjectItemContent[] };
  contact: Omit<HomeContactContent, 'primaryAction'> & {
    primaryAction: ActionContent;
    links: {
      email: string;
      github: string;
      linkedin: string;
      resume?: string;
    };
  };
  seo: SeoContent;
}
