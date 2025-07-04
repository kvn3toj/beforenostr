import { Theme as MuiTheme, PaletteOptions, Palette, TypeText, TypeBackground, CommonColors, PaletteColor } from '@mui/material/styles';

interface CustomColors {
  [key: string]: string;
}

export interface CoomunityPaletteOptions extends Omit<Palette, 'text' | 'background' | 'common'> {
  text: TypeText;
  background: TypeBackground;
  common: CommonColors & {
    gold: string;
    white: string;
    black: string;
    lightGrey: string;
    darkGrey: string;
  };
  primary: PaletteColor;
  secondary: PaletteColor;
  error: PaletteColor;
  warning: PaletteColor;
  info: PaletteColor;
  success: PaletteColor;
  category: CustomColors;
  difficulty: CustomColors;
  grey: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    A100: string;
    A200: string;
    A400: string;
    A700: string;
  };
  mode: 'light' | 'dark';
  contrastThreshold: number;
  tonalOffset: number;
  getContrastText: (background: string) => string;
  augmentColor: Palette['augmentColor'];
}

export interface CoomunityTheme extends Omit<MuiTheme, 'palette'> {
  palette: CoomunityPaletteOptions;
}

export interface CoomunityThemeOptions {
  palette?: Partial<CoomunityPaletteOptions>;
  typography?: Partial<MuiTheme['typography']>;
  spacing?: MuiTheme['spacing'];
  breakpoints?: Partial<MuiTheme['breakpoints']>;
  direction?: MuiTheme['direction'];
  components?: MuiTheme['components'];
  shape?: Partial<MuiTheme['shape']>;
  mixins?: Partial<MuiTheme['mixins']>;
  shadows?: MuiTheme['shadows'];
  transitions?: Partial<MuiTheme['transitions']>;
  zIndex?: Partial<MuiTheme['zIndex']>;
}
