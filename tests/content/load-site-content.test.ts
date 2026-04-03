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
    expect(es.home.hero.eyebrow).toBe('Full Stack & Systems Architect');
    expect(es.home.hero.chips).toEqual([
      'Programación Agéntica con IA',
      'High-Performance Systems',
    ]);
    expect(es.home.hero.primaryCta.label).toBe('Ver proyectos');
    expect(es.home.hero.secondaryCta.label).toBe('Contactar');
    expect(es.home.hero.primaryCta.href).toBe('#proyectos');
    expect(es.home.about.imageAlt).toBe('Retrato de Miguel Munoz');
    expect(es.home.about.heading).toBe('Diseñando el futuro de la ingeniería autónoma.');
    expect(es.home.about.stats[0]).toEqual({ value: '8+', label: 'Años de Exp.' });
    expect(en.home.about.imageAlt).toBe('Portrait of Miguel Munoz');
    expect(es.home.stack.title).toBe('Tech Stack');
    expect(es.home.projects.sublabel).toBe('Curaduría 2026');
    expect(es.home.contact.title).toBe('Colaboración');
    expect(es.home.contact.heading).toBe('¿Listo para escalar su infraestructura?');
    expect(es.home.contact.primaryAction.label).toBe('Empezar un proyecto');
    expect(es.home.contact.secondaryAction?.label).toBe('LinkedIn');
    expect(en.home.hero.title).toBe('Miguel Muñoz');
    expect(es.site.assets.defaultOgImage).toBe('/images/og/home.svg');
    expect(es.site.assets.resume).toBeUndefined();
    expect(es.stack[0].id).toBe('ia-agentes');
    expect(es.stack[0].label).toBe('IA & Agentes');
    expect(es.stack[0].skills).toEqual(['LangChain', 'AutoGPT', 'LLMs']);
    expect(es.projects[0].title).toBe('Cognitive Engine v2.0');
    expect(es.projects[0].role).toBe('Featured — Agéntica');
    expect(en.projects[0].imageAlt).toBe(
      'Abstract technological landscape with connected data nodes and neon cyan highlights',
    );
    expect(es.projects[0].links.repo?.url).toContain('github.com');
    expect(es.projects[0].stack.length).toBeGreaterThan(0);
  });
});
