// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { readFileSync } from 'node:fs';
// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import headerSource from '../../src/components/organisms/Header.astro?raw';
import footerSource from '../../src/components/organisms/Footer.astro?raw';
import heroSource from '../../src/components/organisms/HeroSection.astro?raw';
import heroOrbSource from '../../src/components/atoms/HeroOrb.astro?raw';
import aboutSource from '../../src/components/organisms/AboutSection.astro?raw';
import contactSource from '../../src/components/organisms/ContactSection.astro?raw';
import projectsSource from '../../src/components/organisms/ProjectsSection.astro?raw';
import skillChipSource from '../../src/components/molecules/SkillChip.astro?raw';
import stackSource from '../../src/components/organisms/StackSection.astro?raw';
import { loadSiteContent } from '../../src/lib/content/loaders/load-site-content';
import { mapHomePage } from '../../src/lib/content/mappers/map-home-page';
import type { SiteContentCollection } from '../../src/lib/content/types/content';

const stackStylesSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/stack.css', import.meta.url)),
  'utf8',
);
const headerStylesSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/header.css', import.meta.url)),
  'utf8',
);
const heroOrbStylesSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/hero-orb.css', import.meta.url)),
  'utf8',
);
const contactStylesSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/contact.css', import.meta.url)),
  'utf8',
);
const buttonStylesSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/button.css', import.meta.url)),
  'utf8',
);
const aboutStylesSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/about.css', import.meta.url)),
  'utf8',
);
const typographyTokensSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/tokens/typography.css', import.meta.url)),
  'utf8',
);
const projectsStylesSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/projects.css', import.meta.url)),
  'utf8',
);

describe('mapHomePage', () => {
  it('maps content into template-friendly props', async () => {
    const content = await loadSiteContent('es');
    const page = mapHomePage('es', content);

    expect(page.locale).toBe('es');
    expect(page.navigation.localeLabels.en).toBe('EN');
    expect(page.hero.title).toBe('Miguel Muñoz');
    expect(page.hero.chips).toContain('Programación Agéntica con IA');
    expect(page.hero.primaryCta.href).toBe('#proyectos');
    expect(page.contact.primaryAction.href).toBe(content.home.contact.primaryAction.href);
    expect(page.contact.links.email).toBe(`mailto:${content.site.author.email}`);
    expect(page.projects.items.length).toBeGreaterThan(0);
    expect(page.projects.sublabel).toBe('Curaduría 2026');
    expect(page.projects.items[0].imageAlt).toBe(
      'Paisaje tecnológico abstracto con nodos de datos conectados y resaltados cian neón',
    );
    expect(page.projects.items[0].links.repo?.url).toContain('github.com');
    expect(page.stack.items[0].label).toBe('IA & Agentes');
    expect(page.stack.items[0].skills).toEqual(['LangChain', 'AutoGPT', 'LLMs']);
    expect(page.contact.links.github).toContain('github.com');
    expect(page.about.imageAlt).toBe('Retrato de Miguel Munoz');
    expect(page.about.heading).toBe('Diseñando el futuro de la ingeniería autónoma.');
    expect(page.contact.heading).toBe('¿Listo para escalar su infraestructura?');
    expect(page.seo.title.length).toBeGreaterThan(0);
  });

  it('keeps the contact primary action href from localized content instead of shared site email', () => {
    const content: SiteContentCollection = {
      site: {
        siteUrl: 'https://example.com',
        author: {
          name: 'Miguel Muñoz',
          role: 'Software Engineer',
          email: 'hello@example.com',
        },
        social: {
          github: 'https://github.com/example',
          linkedin: 'https://linkedin.com/in/example',
        },
        assets: {
          resume: '/files/resume.pdf',
        },
      },
      navigation: {
        sections: [],
        localeLabels: {
          es: 'ES',
          en: 'EN',
        },
      },
      home: {
        hero: {
          eyebrow: 'Full Stack & Systems Architect',
          title: 'Miguel Muñoz',
          description: 'Description',
          chips: ['Agentic Systems', 'High-Performance Systems'],
          primaryCta: {
            label: 'Projects',
            href: '#proyectos',
          },
          secondaryCta: {
            label: 'Contact',
            href: '#contacto',
          },
        },
        about: {
          title: 'About',
          heading: 'About heading',
          body: ['Body'],
          stats: [
            { value: '8+', label: 'Years of Exp.' },
            { value: '40+', label: 'AI Systems' },
          ],
          imageAlt: 'Portrait of Miguel Munoz',
        },
        stack: {
          title: 'Stack',
          intro: 'Intro',
        },
        projects: {
          title: 'Projects',
          intro: 'Intro',
          sublabel: 'Curated 2026',
        },
        contact: {
          title: 'Contact',
          heading: 'Ready to scale your infrastructure?',
          description: 'Description',
          primaryAction: {
            label: 'Email me',
            href: 'mailto:contact@example.com',
          },
        },
      },
      stack: [],
      projects: [],
      seo: {
        title: 'SEO title',
        description: 'SEO description',
        ogImage: '/images/og/home.jpg',
      },
    };

    const page = mapHomePage('en', content);

    expect(page.contact.links.email).toBe('mailto:hello@example.com');
    expect(page.contact.primaryAction.href).toBe('mailto:contact@example.com');
  });

  it('keeps the locale seo og image when a site default also exists', () => {
    const content: SiteContentCollection = {
      site: {
        siteUrl: 'https://example.com',
        author: {
          name: 'Miguel Muñoz',
          role: 'Software Engineer',
          email: 'hello@example.com',
        },
        social: {
          github: 'https://github.com/example',
          linkedin: 'https://linkedin.com/in/example',
        },
        assets: {
          defaultOgImage: '/images/og/default.jpg',
        },
      },
      navigation: {
        sections: [],
        localeLabels: {
          es: 'ES',
          en: 'EN',
        },
      },
      home: {
        hero: {
          eyebrow: 'Full Stack & Systems Architect',
          title: 'Miguel Muñoz',
          description: 'Description',
          chips: ['Agentic Systems', 'High-Performance Systems'],
          primaryCta: {
            label: 'Projects',
            href: '#proyectos',
          },
          secondaryCta: {
            label: 'Contact',
            href: '#contacto',
          },
        },
        about: {
          title: 'About',
          heading: 'About heading',
          body: ['Body'],
          stats: [
            { value: '8+', label: 'Years of Exp.' },
            { value: '40+', label: 'AI Systems' },
          ],
          imageAlt: 'Portrait of Miguel Munoz',
        },
        stack: {
          title: 'Stack',
          intro: 'Intro',
        },
        projects: {
          title: 'Projects',
          intro: 'Intro',
          sublabel: 'Curated 2026',
        },
        contact: {
          title: 'Contact',
          heading: 'Ready to scale your infrastructure?',
          description: 'Description',
          primaryAction: {
            label: 'Email me',
            href: 'mailto:hello@example.com',
          },
        },
      },
      stack: [],
      projects: [],
      seo: {
        title: 'SEO title',
        description: 'SEO description',
        ogImage: '/images/og/locale.jpg',
      },
    };

    const page = mapHomePage('en', content);

    expect(page.seo.ogImage).toBe('/images/og/locale.jpg');
    expect(content.site.assets.defaultOgImage).toBe('/images/og/default.jpg');
  });

  it('renders a stitch-faithful centered hero structure without the CTA row', () => {
    expect(heroSource).toContain('class="hero hero--faithful"');
    expect(heroSource).toContain('import HeroOrb from');
    expect(heroSource).toContain('<HeroOrb />');
    expect(heroOrbSource).toContain('class="hero__orb"');
    expect(heroOrbSource).toContain('class="hero__orb-core"');
    expect(heroOrbSource).toContain('class="hero__orb-pulse hero__orb-pulse--inner"');
    expect(heroOrbSource).toContain('class="hero__orb-pulse hero__orb-pulse--middle"');
    expect(heroOrbSource).toContain('class="hero__orb-pulse hero__orb-pulse--outer"');
    expect(heroOrbStylesSource).toContain('.hero__orb');
    expect(heroSource).toContain('class="hero__descriptor-list"');
    expect(heroSource).toContain('class="hero__scroll-label"');
    expect(heroSource).toContain('{scrollLabel}');
    expect(heroSource).toContain('{hero.chips.map((chip, index) => (');
    expect(heroSource).toContain('class="hero__descriptor-divider"');
    expect(heroSource).toContain('</div>\n\n    <a href="#sobre-mi" class="hero__scroll"');
    expect(heroSource).not.toContain('class="hero__actions"');
    expect(heroSource).not.toContain('{hero.primaryCta.href}');
    expect(heroSource).not.toContain('{hero.secondaryCta.href}');
    expect(heroSource).toContain('href="#sobre-mi"');
    expect(heroSource).not.toContain('>Scroll<');
  });

  it('keeps the hero vertically centered with stitch-like title hierarchy and scroll placement', () => {
    expect(heroSource).toContain('class="hero__title-name"');
    expect(heroSource).toContain('class="hero__title-support"');
    expect(heroSource).toContain('</div>\n\n    <a href="#sobre-mi" class="hero__scroll"');
  });

  it('renders a full-width stitch-style header structure', () => {
    expect(headerSource).toContain('class="site-header__bar"');
    expect(headerSource).toContain('class="site-header__inner"');
    expect(headerSource).toContain('class="site-brand"');
    expect(headerSource).toContain('class="site-brand__name"');
    expect(headerSource).toContain('class="site-header__nav"');
    expect(headerSource).toContain('class="site-header__actions"');
    expect(headerSource).toContain('class="language-switcher"');
    expect(headerSource).toContain('className="header-resume"');
    expect(headerSource).not.toContain('class="container"');
  });

  it('keeps the header resume button slim like the stitch reference', () => {
    expect(headerSource).toContain('className="header-resume"');
    expect(headerSource).toContain('variant="ghost"');
  });

  it('renders a stitch-faithful stack section with eyebrow intro and modular cards', () => {
    expect(stackSource).toContain('id="stack"');
    expect(stackSource).toContain('class="section section--stack"');
    expect(stackSource).toContain('class="section-header section-header--stack"');
    expect(stackSource).toContain('class="eyebrow stack__eyebrow"');
    expect(stackSource).toContain('class="stack__grid"');
    expect(stackSource).toContain('class="stack__item"');
    expect(stackSource).toContain('class="stack__cards"');
    expect(skillChipSource).toContain('class="panel skill-card stack-card"');
    expect(skillChipSource).toContain('class="stack-card__icon"');
    expect(skillChipSource).toContain('class="cluster stack-card__tags"');
  });

  it('keeps the stack intro at 30px and only highlights cards on hover', () => {
    expect(stackStylesSource).toContain('.section-header--stack h2');
    expect(stackStylesSource).toContain('font-size: 30px');
    expect(stackStylesSource).toContain('.stack-card:hover');
    expect(stackStylesSource).toContain('.stack-card:hover .stack-card__icon');
    expect(stackStylesSource).not.toContain('.stack__item:first-child .stack-card');
  });

  it('matches stitch tracking-widest at 0.1em for the same uppercase label family', () => {
    expect(typographyTokensSource).toContain('--font-tracking-wide: 0.1em');
    expect(headerStylesSource).toContain('letter-spacing: 0.1em');
    expect(contactStylesSource).toContain('letter-spacing: 0.1em');
    expect(aboutStylesSource).toContain('letter-spacing: 0.1em');
    expect(projectsStylesSource).toContain('.project-card__eyebrow--featured');
    expect(projectsStylesSource).toContain('letter-spacing: 0.1em');
  });

  it('applies the latest global button and contact typography adjustments', () => {
    expect(buttonStylesSource).toContain('letter-spacing: 0.1em');
    expect(contactStylesSource).toContain('.contact-header .heading--sm');
    expect(contactStylesSource).toContain('color: var(--color-accent-primary)');
    expect(contactStylesSource).toContain('.contact__heading');
    expect(contactStylesSource).toContain('font-size: 48px');
    expect(contactStylesSource).toContain('.contact__description');
    expect(contactStylesSource).toContain('color: #a1a1aa');
  });

  it('renders a stitch-literal about split with media and copy columns', () => {
    expect(aboutSource).toContain('id="sobre-mi"');
    expect(aboutSource).toContain('class="section section--about"');
    expect(aboutSource).toContain('class="container about about--stitch"');
    expect(aboutSource).toContain('class="about__media-column"');
    expect(aboutSource).toContain('class="about__content-column"');
    expect(aboutSource).toContain('class="about__heading-block"');
    expect(aboutSource).toContain('class="about__eyebrow"');
    expect(aboutSource).toContain('class="about__stats about__stats--stitch"');
    expect(aboutSource).not.toContain('section-header section-header--compact');
    expect(aboutSource).not.toContain('<Heading as="h2" size="sm">');
    expect(aboutSource).not.toContain('about__content--editorial');
  });

  it('renders a stitch-faithful projects section with featured-first editorial cards', () => {
    expect(projectsSource).toContain('id="proyectos"');
    expect(projectsSource).toContain('class="section section--projects"');
    expect(projectsSource).toContain('class="container projects"');
    expect(projectsSource).toContain('class="section-header section-header--projects"');
    expect(projectsSource).toContain('class="projects__featured project-card__link-shell"');
    expect(projectsSource).toContain('class="projects__featured-copy"');
    expect(projectsSource).toContain('class="projects__featured-meta"');
    expect(projectsSource).toContain('class="project-card__arrow"');
    expect(projectsSource).toContain('class="projects__grid"');
    expect(projectsSource).toContain('class="project-card project-card--support project-card__link-shell"');
    expect(projectsSource).not.toContain('class="projects__rail"');
    expect(projectsSource).not.toContain('class="project-actions"');
    expect(projectsSource).not.toContain('projects__sublabel');
  });

  it('keeps the projects eyebrow cyan, removes the sublabel, and matches the stitch featured card emphasis', () => {
    expect(projectsStylesSource).toContain('.section-header--projects h2');
    expect(projectsStylesSource).toContain('color: var(--color-accent-primary)');
    expect(projectsStylesSource).toContain('.section-header--projects h3');
    expect(projectsStylesSource).toContain('font-size: 30px');
    expect(projectsStylesSource).toContain('.project-card__media {');
    expect(projectsStylesSource).toContain('background: #18181b;');
    expect(projectsStylesSource).toContain('.project-card__media::after {\n  background: linear-gradient(0deg, #09090b 0%, transparent 100%);');
    expect(projectsStylesSource).toContain('.project-card__media--featured');
    expect(projectsStylesSource).toContain('min-height: clamp(24rem, 39vw, 30rem)');
    expect(projectsStylesSource).toContain('.project-card__media--featured > img {\n  opacity: 0.5;');
    expect(projectsStylesSource).toContain('.project-card__media--featured::after');
    expect(projectsStylesSource).toContain('rgba(9, 9, 11, 0.2) 45%');
    expect(projectsStylesSource).toContain('.projects__featured-overlay');
    expect(projectsStylesSource).toContain('background: none');
  });

  it('removes the featured chip and side line from the featured project card', () => {
    expect(projectsSource).not.toContain('projects__featured-label');
    expect(projectsSource).not.toContain('project-card__arrow-line');
  });

  it('aligns the support cards flush with the featured card edges', () => {
    expect(projectsStylesSource).toContain('.project-card--support {\n  padding: 0;');
  });

  it('keeps support project cards square-ish and equal height', () => {
    expect(projectsStylesSource).toContain('.project-card__media--support {\n  aspect-ratio: 4 / 3;');
    expect(projectsStylesSource).toContain('.project-card__media--support > img {\n  opacity: 0.4;');
    expect(projectsStylesSource).toContain('.project-card__media--support::after {\n  background: linear-gradient(0deg, #09090b 0%, transparent 100%);');
    expect(projectsStylesSource).toContain('.project-card__body--support {\n  display: grid;\n  padding-inline: 0.25rem;\n  gap: 16px;\n  grid-template-rows: minmax(2.3em, auto) auto;');
    expect(projectsStylesSource).toContain('.project-card__support-article {\n  display: grid;\n  height: 100%;');
  });

  it('renders a stitch-faithful contact conversion block and simplified footer', () => {
    expect(contactSource).toContain('id="contacto"');
    expect(contactSource).toContain('class="section section--contact"');
    expect(contactSource).toContain('class="contact-card contact-card--closing"');
    expect(contactSource).toContain('contact-card__surface');
    expect(contactSource).toContain('class="contact-copy"');
    expect(contactSource).toContain('class="contact-actions"');
    expect(contactSource).not.toContain('class="contact-card__glow"');
    expect(contactSource).toContain('className="contact__heading"');
    expect(footerSource).toContain('class="site-footer__content"');
    expect(footerSource).toContain('class="site-footer__line"');
    expect(footerSource).toContain('class="site-footer__links"');
    expect(footerSource).toContain('aria-label={`${siteName} footer links`}');
    expect(footerSource).not.toContain('class="site-brand"');
    expect(footerSource).not.toContain('class="footer-shell"');
  });

  it('keeps the contact cyan glow in the surface background instead of a separate corner blob', () => {
    expect(contactStylesSource).toContain('radial-gradient(circle at top right');
  });

  it('uses the same eyebrow-to-subtitle spacing in stack and projects headers', () => {
    expect(stackStylesSource).toContain('.section-header--stack {\n  margin-bottom: clamp(1.2rem, 2.5vw, 1.9rem);\n  max-width: none;\n  gap: 0.42rem;');
    expect(stackStylesSource).toContain('.stack__eyebrow {\n  color: var(--color-accent-primary);');
    expect(projectsStylesSource).toContain('.projects__header-copy {\n  display: grid;\n  gap: 0.42rem;');
  });

  it('does not hardcode a shared resume label in the header source', () => {
    expect(headerSource).not.toContain('>Resume<');
  });
});
