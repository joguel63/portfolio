type CssCustomProperty = `--${string}`;

function cssVarToken<TTokenName extends CssCustomProperty>(tokenName: TTokenName): TTokenName {
  return tokenName;
}

export function tokenVar(tokenName: CssCustomProperty): `var(${CssCustomProperty})` {
  return `var(${tokenName})`;
}

export const designTokens = {
  color: {
    accent: {
      primary: cssVarToken('--color-accent-primary'),
      secondary: cssVarToken('--color-accent-secondary'),
      tertiary: cssVarToken('--color-accent-tertiary'),
    },
    canvas: {
      base: cssVarToken('--color-canvas-base'),
      elevated: cssVarToken('--color-canvas-elevated'),
      panel: cssVarToken('--color-canvas-panel'),
      muted: cssVarToken('--color-canvas-muted'),
      border: cssVarToken('--color-border-soft'),
    },
    overlay: {
      soft: cssVarToken('--color-overlay-soft'),
      accentSoft: cssVarToken('--color-overlay-accent-soft'),
    },
    surface: {
      tint: cssVarToken('--color-surface-tint'),
    },
    grid: {
      line: cssVarToken('--color-grid-line'),
    },
    glow: {
      primary: cssVarToken('--color-glow-primary'),
    },
    text: {
      primary: cssVarToken('--color-text-primary'),
      secondary: cssVarToken('--color-text-secondary'),
      muted: cssVarToken('--color-text-muted'),
      inverse: cssVarToken('--color-text-inverse'),
    },
  },
  font: {
    family: {
      heading: cssVarToken('--font-heading'),
      body: cssVarToken('--font-body'),
      mono: cssVarToken('--font-mono'),
    },
    size: {
      xs: cssVarToken('--font-size-xs'),
      sm: cssVarToken('--font-size-sm'),
      base: cssVarToken('--font-size-base'),
      md: cssVarToken('--font-size-md'),
      lg: cssVarToken('--font-size-lg'),
      xl: cssVarToken('--font-size-xl'),
      hero: cssVarToken('--font-size-hero'),
    },
    leading: {
      tight: cssVarToken('--font-leading-tight'),
      snug: cssVarToken('--font-leading-snug'),
      normal: cssVarToken('--font-leading-normal'),
    },
    tracking: {
      tight: cssVarToken('--font-tracking-tight'),
      normal: cssVarToken('--font-tracking-normal'),
      wide: cssVarToken('--font-tracking-wide'),
    },
  },
  space: {
    xxs: cssVarToken('--space-xxs'),
    xs: cssVarToken('--space-xs'),
    sm: cssVarToken('--space-sm'),
    md: cssVarToken('--space-md'),
    lg: cssVarToken('--space-lg'),
    xl: cssVarToken('--space-xl'),
    '2xl': cssVarToken('--space-2xl'),
    '3xl': cssVarToken('--space-3xl'),
    badgePaddingInline: cssVarToken('--badge-padding-inline'),
    heroColumnMinWidth: cssVarToken('--hero-column-min-width'),
    aboutColumnMaxWidth: cssVarToken('--about-column-max-width'),
    bodyMeasure: cssVarToken('--body-measure'),
    contactLinkMinHeight: cssVarToken('--contact-link-min-height'),
    contactLinkPaddingInline: cssVarToken('--contact-link-padding-inline'),
    section: {
      desktop: cssVarToken('--section-space'),
      tablet: cssVarToken('--section-space'),
      mobile: cssVarToken('--section-space'),
    },
  },
  radius: {
    sm: cssVarToken('--radius-sm'),
    md: cssVarToken('--radius-md'),
    lg: cssVarToken('--radius-lg'),
    surface: cssVarToken('--radius-surface'),
    pill: cssVarToken('--radius-pill'),
  },
  shadow: {
    soft: cssVarToken('--shadow-soft'),
    card: cssVarToken('--shadow-card'),
    glow: cssVarToken('--shadow-glow'),
  },
  effect: {
    blur: {
      panel: cssVarToken('--blur-panel'),
    },
  },
  motion: {
    duration: {
      fast: cssVarToken('--motion-duration-fast'),
    },
    easing: {
      standard: cssVarToken('--motion-easing-standard'),
    },
  },
  screen: {
    tablet: cssVarToken('--screen-tablet'),
    mobile: cssVarToken('--screen-mobile'),
    tabletQuery: cssVarToken('--screen-tablet'),
    mobileQuery: cssVarToken('--screen-mobile'),
  },
} as const;

export type DesignTokens = typeof designTokens;
