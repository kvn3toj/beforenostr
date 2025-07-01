// Demo/apps/superapp-unified/src/theme/themeConfig.ts
import { MODULE_COLORS } from './colors';

export interface ThemePalette {
  uplayPrimary: string;
  headerBackground: string;
  headerText: string;
  navMenuBackground: string;
  navMenuText: string;
  navMenuItemActive: string;
  mainBackground: string;
  primaryText: string;
  secondaryText: string;
  buttonPrimaryBackground: string;
  buttonPrimaryText: string;
  buttonSecondaryBackground: string;
  buttonSecondaryText: string;
  accentColor: string;
  loadingPlaceholderBackground: string;
}

export const defaultTheme: ThemePalette = {
  uplayPrimary: MODULE_COLORS.uplay,
  headerBackground: '#1E1B24', // Dark violet/blue
  headerText: '#FFFFFF',
  navMenuBackground: '#110F18',
  navMenuText: '#A0A0A0',
  navMenuItemActive: MODULE_COLORS.social,
  mainBackground: '#111111',
  primaryText: '#FFFFFF',
  secondaryText: '#A0A0A0',
  buttonPrimaryBackground: MODULE_COLORS.social,
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBackground: '#333333',
  buttonSecondaryText: '#FFFFFF',
  accentColor: '#FFFFFF',
  loadingPlaceholderBackground: '#2A2A2A',
};

export const lightTheme: ThemePalette = {
    uplayPrimary: MODULE_COLORS.uplay,
    headerBackground: '#FFFFFF',
    headerText: '#111111',
    navMenuBackground: '#F0F0F0',
    navMenuText: '#333333',
    navMenuItemActive: MODULE_COLORS.social,
    mainBackground: '#FAFAFA',
    primaryText: '#111111',
    secondaryText: '#555555',
    buttonPrimaryBackground: MODULE_COLORS.social,
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryBackground: '#E0E0E0',
    buttonSecondaryText: '#111111',
    accentColor: '#000000',
    loadingPlaceholderBackground: '#E0E0E0',
};

export const themes = {
    dark: defaultTheme,
    light: lightTheme
};
