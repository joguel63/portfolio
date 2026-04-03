import { describe, expect, it } from 'vitest';

import { designTokens, tokenVar } from '../../src/lib/design-system/tokens';
import baseLayoutSource from '../../src/layouts/BaseLayout.astro?raw';

describe('designTokens', () => {
  it('maps shared design tokens to CSS custom properties instead of duplicating literal values', () => {
    expect(designTokens.color.accent.primary).toBe('--color-accent-primary');
    expect(designTokens.color.canvas.base).toBe('--color-canvas-base');
    expect(designTokens.color.overlay.soft).toBe('--color-overlay-soft');
    expect(designTokens.color.overlay.accentSoft).toBe('--color-overlay-accent-soft');
    expect(designTokens.color.grid.line).toBe('--color-grid-line');
    expect(designTokens.color.glow.primary).toBe('--color-glow-primary');
    expect(designTokens.font.family.heading).toBe('--font-heading');
    expect(designTokens.font.family.body).toBe('--font-body');
    expect(designTokens.space.section.desktop).toBe('--section-space');
    expect(designTokens.space.badgePaddingInline).toBe('--badge-padding-inline');
    expect(designTokens.space.heroColumnMinWidth).toBe('--hero-column-min-width');
    expect(designTokens.space.aboutColumnMaxWidth).toBe('--about-column-max-width');
    expect(designTokens.space.bodyMeasure).toBe('--body-measure');
    expect(designTokens.space.contactLinkMinHeight).toBe('--contact-link-min-height');
    expect(designTokens.color.surface.tint).toBe('--color-surface-tint');
    expect(designTokens.radius.surface).toBe('--radius-surface');
    expect(designTokens.shadow.glow).toBe('--shadow-glow');
    expect(designTokens.effect.blur.panel).toBe('--blur-panel');
    expect(designTokens.motion.duration.fast).toBe('--motion-duration-fast');
    expect(designTokens.motion.easing.standard).toBe('--motion-easing-standard');
    expect(designTokens.screen.tabletQuery).toBe('--screen-tablet');
    expect(designTokens.screen.mobileQuery).toBe('--screen-mobile');
  });

  it('builds var() references from token names', () => {
    expect(tokenVar(designTokens.color.accent.primary)).toBe('var(--color-accent-primary)');
  });

  it('registers self-hosted font packages once at the layout layer', () => {
    expect(baseLayoutSource.match(/import '\.\.\/styles\/globals\/fonts\.css';/g)).toHaveLength(1);
    expect(designTokens.font.family.heading).toBe('--font-heading');
    expect(designTokens.font.family.body).toBe('--font-body');
    expect(tokenVar(designTokens.font.family.heading)).toBe('var(--font-heading)');
    expect(tokenVar(designTokens.font.family.body)).toBe('var(--font-body)');
  });
});
