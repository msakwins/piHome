export type ThemeMode = 'dark' | 'light';

export interface ThemeStyle {
  color: string;
  textShadow: string;
}

export interface Theme {
  dark: ThemeStyle;
  light: ThemeStyle;
}