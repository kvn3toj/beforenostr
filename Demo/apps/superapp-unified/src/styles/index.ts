// Exportar tipos
export * from './theme.types';

// Exportar temas
export { coomunityTheme, coomunityThemeDark } from './theme-autumn';

// Exportar variantes de tema
export {
  fuegoTheme,
  aguaTheme,
  tierraTheme,
  aireTheme,
  getElementTheme,
  getElementAccentColor,
  getElementGradient,
  getElementBackgroundColor,
  getElementTextColor,
  getElementBorderColor,
  getElementHoverColor,
  getElementShadowColor,
  getElementContrastColor,
  getElementFocusColor,
  getElementDisabledColor,
  getElementErrorColor,
  getElementSuccessColor,
  getElementWarningColor,
  getElementInfoColor,
} from './theme.variants';

// Exportar utilidades
export {
  getContrastColor,
  withAlpha,
  getBackgroundColor,
  getTextColor,
  getBorderColor,
  getHoverColor,
  getCardBackgroundColor,
  getShadowColor,
  getGradientColor,
  getGlassmorphismStyles,
  getElevationStyles,
  getTransitionStyles,
  getHoverStyles,
  getActiveStyles,
  getFocusStyles,
} from './theme.utils';

// Exportar componentes estilizados
export {
  RevolutionaryWidget,
  CosmicCard,
  ElementalButton,
  ElementalIconButton,
  GlassContainer,
  ElevatedPaper,
  GradientContainer,
} from './theme.components';

// Exportar hooks
export {
  useCoomunityTheme,
  useDarkMode,
  useElement,
  useGlassmorphism,
  useElevation,
  useContrastMode,
  useVisualEffects,
  useAnimationPreferences,
  useFontSize,
  useSpacing,
  useBorderRadius,
  useThemePreferences,
} from './theme.hooks';

// Exportar contexto y proveedor
export {
  ThemeProvider,
  useThemeContext,
  useCurrentTheme,
  useElementColors,
  useGlassmorphismStyles,
  useElevationStyles,
  useGradientStyles,
  useAnimationStyles,
} from './theme.context';

// Exportar componentes de configuración
export {
  DarkModeToggle,
  ElementSelector,
  ContrastToggle,
  ReducedMotionToggle,
  FontSizeControl,
  SpacingControl,
  BorderRadiusControl,
  IntensityControl,
  ResetThemeButton,
  ThemeSettings,
  ThemeToolbar,
} from './theme.settings';

// Exportar utilidades de accesibilidad
export {
  accessibilityStyles,
  getHighContrastStyles,
  getReducedMotionStyles,
  getLargeFontStyles,
  getLargeSpacingStyles,
} from './theme.accessibility';