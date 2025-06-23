// Demo/apps/superapp-unified/src/theme/themeConfig.ts

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

export interface ModuleColors {
  uplay: string;
  superappGeneral: string;
  marketplace: string;
}

export const moduleColors: ModuleColors = {
  uplay: '#2563eb', // Blue
  superappGeneral: '#5B21B6', // Violet
  marketplace: '#059669', // Green
};

export const defaultTheme: ThemePalette = {
  uplayPrimary: moduleColors.uplay,
  headerBackground: '#1E1B24', // Dark violet/blue
  headerText: '#FFFFFF',
  navMenuBackground: '#110F18',
  navMenuText: '#A0A0A0',
  navMenuItemActive: moduleColors.superappGeneral,
  mainBackground: '#111111',
  primaryText: '#FFFFFF',
  secondaryText: '#A0A0A0',
  buttonPrimaryBackground: moduleColors.superappGeneral,
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBackground: '#333333',
  buttonSecondaryText: '#FFFFFF',
  accentColor: '#FFFFFF',
  loadingPlaceholderBackground: '#2A2A2A',
};

export const lightTheme: ThemePalette = {
    uplayPrimary: moduleColors.uplay,
    headerBackground: '#FFFFFF',
    headerText: '#111111',
    navMenuBackground: '#F0F0F0',
    navMenuText: '#333333',
    navMenuItemActive: moduleColors.superappGeneral,
    mainBackground: '#FAFAFA',
    primaryText: '#111111',
    secondaryText: '#555555',
    buttonPrimaryBackground: moduleColors.superappGeneral,
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
