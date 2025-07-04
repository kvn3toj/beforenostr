import { Theme } from '@mui/material/styles';

// Definir los estilos base para accesibilidad
export const accessibilityStyles = (theme: Theme) => ({
  // Estilos globales para mejorar la accesibilidad
  '@global': {
    // Mejorar la visibilidad del foco
    '*:focus': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
    '*:focus:not(:focus-visible)': {
      outline: 'none',
    },
    '*:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },

    // Mejorar la legibilidad del texto
    body: {
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
      wordSpacing: '0.1em',
    },

    // Asegurar contraste suficiente para enlaces
    a: {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
      '&:hover': {
        color: theme.palette.primary.dark,
      },
      '&:active': {
        color: theme.palette.primary.dark,
      },
      '&:visited': {
        color: theme.palette.secondary.main,
      },
    },

    // Mejorar la visibilidad de los elementos interactivos
    'button, [role="button"]': {
      cursor: 'pointer',
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.7,
      },
    },

    // Asegurar que los elementos ocultos sean accesibles para lectores de pantalla
    '.visually-hidden': {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    },

    // Mejorar la legibilidad en modo de alto contraste
    '@media (forced-colors: active)': {
      '*': {
        borderColor: 'ButtonText',
      },
      'a, button': {
        color: 'LinkText',
        '&:hover': {
          color: 'HighlightText',
          backgroundColor: 'Highlight',
        },
      },
    },

    // Reducir el movimiento para usuarios que lo prefieren
    '@media (prefers-reduced-motion: reduce)': {
      '*': {
        animationDuration: '0.01ms !important',
        animationIterationCount: '1 !important',
        transitionDuration: '0.01ms !important',
        scrollBehavior: 'auto !important',
      },
    },
  },

  // Estilos específicos para componentes
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationThickness: '1px',
          textUnderlineOffset: '2px',
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            '&:focus': {
              outline: 'none',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});

// Función para obtener los estilos de alto contraste
export const getHighContrastStyles = (theme: Theme) => ({
  palette: {
    primary: {
      main: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    divider: '#000000',
  },
  typography: {
    allVariants: {
      color: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: '2px solid #000000',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: '2px solid #000000',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #000000',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid #000000',
        },
      },
    },
  },
});

// Función para obtener los estilos de movimiento reducido
export const getReducedMotionStyles = () => ({
  transitions: {
    create: () => 'none',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'none',
          '&:hover': {
            transform: 'none',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'none',
          '&:hover': {
            transform: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'none',
          '&:hover': {
            transform: 'none',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          transition: 'none',
          '&:hover': {
            transform: 'none',
          },
        },
      },
    },
  },
});

// Función para obtener los estilos de tamaño de fuente aumentado
export const getLargeFontStyles = (scale: number = 1.2) => ({
  typography: {
    htmlFontSize: 16 * scale,
    fontSize: 14 * scale,
    h1: {
      fontSize: '2.75rem' * scale,
    },
    h2: {
      fontSize: '2.25rem' * scale,
    },
    h3: {
      fontSize: '1.875rem' * scale,
    },
    h4: {
      fontSize: '1.5rem' * scale,
    },
    h5: {
      fontSize: '1.25rem' * scale,
    },
    h6: {
      fontSize: '1.125rem' * scale,
    },
    body1: {
      fontSize: '1rem' * scale,
    },
    body2: {
      fontSize: '0.875rem' * scale,
    },
    subtitle1: {
      fontSize: '1rem' * scale,
    },
    subtitle2: {
      fontSize: '0.875rem' * scale,
    },
    caption: {
      fontSize: '0.75rem' * scale,
    },
    overline: {
      fontSize: '0.75rem' * scale,
    },
    button: {
      fontSize: '0.875rem' * scale,
    },
  },
});

// Función para obtener los estilos de espaciado aumentado
export const getLargeSpacingStyles = (scale: number = 1.2) => ({
  spacing: (factor: number) => `${8 * factor * scale}px`,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: `${8 * scale}px ${16 * scale}px`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: `${8 * scale}px`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: `${16 * scale}px`,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: `${16 * scale}px`,
          '&:last-child': {
            paddingBottom: `${16 * scale}px`,
          },
        },
      },
    },
  },
});
