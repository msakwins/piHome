export type ThemeMode = 'dark' | 'light';

/**
 * Applied to .app as CSS custom properties. Everything else reads them with
 * var(--font-color) / var(--font-shadow) so there is one source of truth and
 * no component can quietly opt out with a hardcoded colour.
 */
export interface ThemeStyle {
  '--font-color': string;
  '--font-shadow': string;
}

export interface Theme {
  dark: ThemeStyle;
  light: ThemeStyle;
}
