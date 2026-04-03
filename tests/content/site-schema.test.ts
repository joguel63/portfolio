import { describe, expect, it } from 'vitest';

import { navigationSchema } from '../../src/lib/content/schemas/navigation';
import { siteSchema } from '../../src/lib/content/schemas/site';
import { homeSchema } from '../../src/lib/content/schemas/home';
import { projectsSchema } from '../../src/lib/content/schemas/projects';
import { seoSchema } from '../../src/lib/content/schemas/seo';
import { stackSchema } from '../../src/lib/content/schemas/stack';

describe('siteSchema', () => {
  it('accepts the canonical site shape', () => {
    const parsed = siteSchema.parse({
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
        defaultOgImage: '/images/og/home.jpg',
        resume: '/files/resume.pdf',
      },
    });

    expect(parsed.author.name).toBe('Miguel Muñoz');
    expect(parsed.assets.defaultOgImage).toBe('/images/og/home.jpg');
  });

  it('preserves the shared default og image in site assets', () => {
    const parsed = siteSchema.parse({
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
        defaultOgImage: '/images/og/home.jpg',
        resume: '/files/resume.pdf',
      },
    });

    expect(parsed.assets).toEqual({
      defaultOgImage: '/images/og/home.jpg',
      resume: '/files/resume.pdf',
    });
  });

  it('accepts the canonical navigation shape', () => {
    const parsed = navigationSchema.parse({
      sections: [
        { id: 'sobre-mi', labels: { es: 'Sobre mí', en: 'About' } },
        { id: 'stack', labels: { es: 'Stack', en: 'Stack' } },
        { id: 'proyectos', labels: { es: 'Proyectos', en: 'Projects' } },
        { id: 'contacto', labels: { es: 'Contacto', en: 'Contact' } },
      ],
      localeLabels: {
        es: 'ES',
        en: 'EN',
      },
    });

    expect(parsed.sections[0].labels.es).toBe('Sobre mí');
    expect(parsed.localeLabels.en).toBe('EN');
  });

  it('uses validating Astro collection schemas instead of permissive any schemas', async () => {
    await expect(homeSchema.parseAsync({})).rejects.toThrow();
    await expect(projectsSchema.parseAsync({})).rejects.toThrow();
    await expect(
      seoSchema.parseAsync({ title: 'SEO title', description: 'SEO description' }),
    ).rejects.toThrow();
    await expect(
      seoSchema.parseAsync({
        title: 'SEO title',
        description: 'SEO description',
        ogImage: '/images/og/home.jpg',
      }),
    ).resolves.toEqual({
      title: 'SEO title',
      description: 'SEO description',
      ogImage: '/images/og/home.jpg',
    });
    await expect(stackSchema.parseAsync({})).rejects.toThrow();
    await expect(siteSchema.parseAsync({ unsupported: true })).rejects.toThrow();
  });

  it('preserves localized about alt text and contact action href in home content', () => {
    const parsed = homeSchema.parse({
      hero: {
        eyebrow: 'Full Stack & Systems Architect',
        title: 'Miguel Munoz',
        description: 'Description',
        chips: ['Programación Agéntica con IA', 'High-Performance Systems'],
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
        heading: 'Designing the future of autonomous engineering.',
        body: ['Body'],
        stats: [
          { value: '8+', label: 'Years of Exp.' },
          { value: '40+', label: 'AI Systems' },
        ],
        image: '/images/about/miguel-portrait.jpg',
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
        secondaryAction: {
          label: 'LinkedIn',
          href: 'https://linkedin.com/in/example',
        },
      },
    });

    expect(parsed.about.imageAlt).toBe('Portrait of Miguel Munoz');
    expect(parsed.contact.primaryAction.href).toBe('mailto:hello@example.com');
  });

  it('accepts localized project image alt text', () => {
    const parsed = projectsSchema.parse([
      {
        id: 'portfolio',
        title: 'Miguel Portfolio',
        summary: 'Summary',
        year: '2026',
        role: 'Design and development',
        stack: ['Astro'],
        featured: true,
        image: '/images/projects/cognitive-engine-v2.jpg',
        imageAlt: 'Miguel Portfolio project preview',
        links: {
          repo: {
            label: 'Code',
            url: 'https://github.com/miguelmunoz/portfolio',
          },
        },
      },
    ]);

    expect(parsed[0].imageAlt).toBe('Miguel Portfolio project preview');
  });

  it('accepts stitch-style stack cards with inline skills', () => {
    const parsed = stackSchema.parse([
      {
        id: 'ia-agentes',
        label: 'IA & Agentes',
        category: 'Autonomy',
        order: 1,
        description: 'Ecosistemas autónomos y flujos de trabajo agénticos.',
        skills: ['LangChain', 'AutoGPT', 'LLMs'],
      },
    ]);

    expect(parsed[0].skills).toEqual(['LangChain', 'AutoGPT', 'LLMs']);
  });
});
