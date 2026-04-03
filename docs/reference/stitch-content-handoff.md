# Stitch Content Handoff

This branch uses a typed JSON content layer for provisional portfolio copy.

## Content Sources

- `src/content/global/site.json`: shared site metadata and contact links.
- `src/content/global/navigation.json`: canonical section ids with `sections[].labels` and top-level `localeLabels`.
- `src/content/pages/home.{es,en}.json`: localized page copy using `hero.eyebrow`, CTA objects, and `contact.primaryAction`.
- `src/content/stack/stack.{es,en}.json`: top-level arrays of stack items with `id`, `label`, `category`, and `order`.
- `src/content/projects/projects.{es,en}.json`: top-level arrays of project items with canonical link-entry objects.
- `src/content/seo/seo.{es,en}.json`: locale-specific metadata.

## Loader Contract

- `loadSiteContent(locale)` validates each JSON source with a schema-specific error message.
- `loadSiteContent(locale)` keeps locale contact CTA copy but drops duplicate contact/OG href data from the runtime model.
- `mapHomePage(locale, content)` produces template-friendly props, derives the contact CTA href from `site.author.email`, and uses locale SEO as the canonical `ogImage` source.

## Notes

- Content is provisional but approved in structure.
- The allowed home sections are Hero, About, Stack, Projects, and Contact.
