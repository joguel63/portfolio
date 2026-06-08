import { describe, expect, it } from 'vitest';

import { loadSiteContent } from '../../src/lib/content/loaders/load-site-content';

describe('loadSiteContent', () => {
  it('loads validated content for es and en', async () => {
    const es = await loadSiteContent('es');
    const en = await loadSiteContent('en');

    expect(es.navigation.sections.map((section) => section.id)).toEqual([
      'sobre-mi',
      'stack',
      'proyectos',
      'contacto',
    ]);
    expect(es.navigation.sections[0].label).toBe('Sobre mí');
    expect(en.navigation.sections[0].label).toBe('About');
    expect(es.navigation.localeLabels.es).toBe('ES');
    expect(es.home.hero.title).toBe('Miguel Muñoz');
    expect(es.home.hero.eyebrow).toBe('Full Stack Software Engineer');
    expect(es.home.hero.chips).toEqual([
      'Desarrollo Full Stack',
      'Sistemas de Alto Rendimiento',
    ]);
    expect(es.home.hero.primaryCta.label).toBe('Ver proyectos');
    expect(es.home.hero.secondaryCta.label).toBe('Contactar');
    expect(es.home.hero.primaryCta.href).toBe('#proyectos');
    expect(es.home.about.imageAlt).toBe('Retrato de Miguel Munoz');
    expect(es.home.about.heading).toBe('Construyendo soluciones de software escalables, de la idea a producción.');
    expect(es.home.about.stats[0]).toEqual({ value: '5+', label: 'Años de Exp.' });
    expect(en.home.about.imageAlt).toBe('Portrait of Miguel Munoz');
    expect(es.home.stack.title).toBe('Tech Stack');
    expect(es.home.projects.sublabel).toBe('Portfolio Beta');
    expect(es.home.contact.title).toBe('Colaboración');
    expect(es.home.contact.heading).toBe('¿Tienes una idea de software o un desafío técnico?');
    expect(es.home.contact.primaryAction.label).toBe('Empezar un proyecto');
    expect(es.home.contact.secondaryAction?.label).toBe('LinkedIn');
    expect(en.home.hero.title).toBe('Miguel Muñoz');
    expect(es.site.assets.defaultOgImage).toBe('/images/og/home.svg');
    expect(es.site.assets.resume?.es).toBe('/docs/Miguel Mu%C3%B1oz cv.pdf');
    expect(es.site.assets.resume?.en).toBe('/docs/Miguel Mu%C3%B1oz Resume.pdf');
    expect(es.stack).toHaveLength(5);
    expect(en.stack).toHaveLength(5);
    expect(es.stack[0].id).toBe('frontend-engineering');
    expect(es.stack[0].label).toBe('Arquitectura Frontend');
    expect(es.stack[0].skills).toEqual([
      'React',
      'Next.js',
      'Vite',
      'TypeScript',
      'Material UI',
      'Tailwind',
      'Ant Design',
    ]);
    expect(en.stack[0].id).toBe('frontend-engineering');
    expect(en.stack[0].label).toBe('Frontend Architecture');
    expect(en.stack[0].skills).toEqual([
      'React',
      'Next.js',
      'Vite',
      'TypeScript',
      'Material UI',
      'Tailwind',
      'Ant Design',
    ]);
    expect(es.projects[0].title).toBe('Plataforma Web Escalable');
    expect(es.projects[0].role).toBe('Arquitectura Full Stack');
    expect(en.projects[0].imageAlt).toBe(
      'Abstract technological landscape with connected data nodes and neon cyan highlights',
    );
    expect(es.projects[0].links.repo?.url).toContain('github.com');
    expect(es.projects[0].stack.length).toBeGreaterThan(0);
  });
});
