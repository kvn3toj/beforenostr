/**
 * 🌌 SISTEMA DE TEMAS UNIFICADO - CONCILIO ARIA + ZENO
 * ===============================================================================
 * Unificación consciente de todos los sistemas de colores y temas existentes
 * Diseño: ARIA - Artista del Frontend
 * Experiencia: ZENO - Arquitecto de Experiencias
 * ===============================================================================
 */

import { alpha, Theme } from '@mui/material/styles';
import { COLOR_PALETTES, PaletteType } from './color-system';
import {
  COOMUNITY_BRAND_COLORS,
  BRAND_ELEMENT_MAPPING,
  COOMUNITY_THEME_PALETTES,
  BRAND_GRADIENTS
} from './coomunity-brand-colors';

// 🌟 TIPOS UNIVERSALES DEL CONCILIO
export type ConcilioTheme =
  | 'guardian-harmony'     // Elementos + Guardianes (Principal)
  | 'autumn-serenity'      // Otoñal + Calma
  | 'cosmic-transcendence' // Cósmico + Elevación
  | 'reciprocidad-balance'         // Reciprocidad + Equilibrio
  | 'bien-comun'           // Bien Común + Comunidad

// 🎨 PALETA MAESTRA DEL CONCILIO
export interface ConcilioColorSystem {
  // Colores Base
  primary: {
    main: string;
    light: string;
    dark: string;
    gradient: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    gradient: string;
  };

  // Elementos CoomÜnity (Cinco Elementos)
  elements: {
    fuego: { primary: string; secondary: string; gradient: string };
    agua: { primary: string; secondary: string; gradient: string };
    tierra: { primary: string; secondary: string; gradient: string };
    aire: { primary: string; secondary: string; gradient: string };
    eter: { primary: string; secondary: string; gradient: string };
  };

  // Colores Semánticos Conscientes
  consciousness: {
    elevation: string;     // Para métricas espirituales
    harmony: string;       // Para balance Reciprocidad
    growth: string;        // Para progreso personal
    community: string;     // Para bien común
    wisdom: string;        // Para conocimiento
  };

  // Estados de Interacción
  interaction: {
    hover: string;
    active: string;
    focus: string;
    disabled: string;
  };

  // Fondos y Superficies
  surfaces: {
    background: string;
    paper: string;
    elevated: string;
    overlay: string;
  };
}

// 🌌 DEFINICIÓN DE TEMAS DEL CONCILIO
export const CONCILIO_THEMES: Record<ConcilioTheme, ConcilioColorSystem> = {
  'guardian-harmony': {
    primary: {
      main: COOMUNITY_BRAND_COLORS.gold,        // #FBBA00 - Dorado oficial
      light: '#FDCF4A',
      dark: '#E6A800',
      gradient: BRAND_GRADIENTS.primary,
    },
    secondary: {
      main: COOMUNITY_BRAND_COLORS.blue,        // #005CA9 - Azul oficial
      light: '#4A8BC2',
      dark: '#004080',
      gradient: BRAND_GRADIENTS.secondary,
    },
    elements: BRAND_ELEMENT_MAPPING,            // Usar mapeo oficial de marca
    consciousness: {
      elevation: COOMUNITY_BRAND_COLORS.purple,     // #5C2483
      harmony: COOMUNITY_BRAND_COLORS.green,        // #3E8638
      growth: COOMUNITY_BRAND_COLORS.blue,          // #005CA9
      community: COOMUNITY_BRAND_COLORS.gold,       // #FBBA00
      wisdom: COOMUNITY_BRAND_COLORS.deepPurple,    // #392768
    },
    interaction: {
      hover: `rgba(251, 186, 0, 0.08)`,     // Dorado con transparencia
      active: `rgba(251, 186, 0, 0.12)`,
      focus: `rgba(251, 186, 0, 0.24)`,
      disabled: 'rgba(156, 163, 175, 0.6)',
    },
    surfaces: {
      background: '#FAFAFA',                // Blanco ligeramente cálido
      paper: COOMUNITY_BRAND_COLORS.white, // #FFFFFF
      elevated: COOMUNITY_BRAND_COLORS.white,
      overlay: `rgba(29, 29, 27, 0.5)`,    // Negro oficial con transparencia
    },
  },

  'autumn-serenity': {
    primary: {
      main: '#EA580C',      // Naranja otoñal
      light: '#FED7AA',
      dark: '#C2410C',
      gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
    },
    secondary: {
      main: '#DC2626',      // Rojo tierra
      light: '#FECACA',
      dark: '#991B1B',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
    },
    elements: {
      fuego: {
        primary: '#EA580C',
        secondary: '#FED7AA',
        gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
      },
      agua: {
        primary: '#0F766E',
        secondary: '#CCFBF1',
        gradient: 'linear-gradient(135deg, #0F766E 0%, #134E4A 100%)',
      },
      tierra: {
        primary: '#A16207',
        secondary: '#FEF3C7',
        gradient: 'linear-gradient(135deg, #A16207 0%, #92400E 100%)',
      },
      aire: {
        primary: '#7C2D12',
        secondary: '#FFEDD5',
        gradient: 'linear-gradient(135deg, #7C2D12 0%, #9A3412 100%)',
      },
      eter: {
        primary: '#BE185D',
        secondary: '#FCE7F3',
        gradient: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)',
      },
    },
    consciousness: {
      elevation: '#BE185D',
      harmony: '#059669',
      growth: '#0369A1',
      community: '#EA580C',
      wisdom: '#7C2D12',
    },
    interaction: {
      hover: 'rgba(234, 88, 12, 0.08)',
      active: 'rgba(234, 88, 12, 0.12)',
      focus: 'rgba(234, 88, 12, 0.24)',
      disabled: 'rgba(120, 113, 108, 0.6)',
    },
    surfaces: {
      background: '#FFFBF5',  // Blanco cálido
      paper: '#FFFFFF',
      elevated: '#FEFEFE',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
  },

  'cosmic-transcendence': {
    primary: {
      main: '#8B5CF6',      // Púrpura cósmico
      light: '#C4B5FD',
      dark: '#5B21B6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)',
    },
    secondary: {
      main: '#06B6D4',      // Cian estelar
      light: '#A5F3FC',
      dark: '#0891B2',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    },
    elements: {
      fuego: {
        primary: '#F59E0B',
        secondary: '#FEF3C7',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
      agua: {
        primary: '#06B6D4',
        secondary: '#CFFAFE',
        gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      },
      tierra: {
        primary: '#10B981',
        secondary: '#D1FAE5',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      },
      aire: {
        primary: '#8B5CF6',
        secondary: '#EDE9FE',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)',
      },
      eter: {
        primary: '#EC4899',
        secondary: '#FCE7F3',
        gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
      },
    },
    consciousness: {
      elevation: '#8B5CF6',
      harmony: '#06B6D4',
      growth: '#10B981',
      community: '#F59E0B',
      wisdom: '#EC4899',
    },
    interaction: {
      hover: 'rgba(139, 92, 246, 0.08)',
      active: 'rgba(139, 92, 246, 0.12)',
      focus: 'rgba(139, 92, 246, 0.24)',
      disabled: 'rgba(148, 163, 184, 0.6)',
    },
    surfaces: {
      background: '#FAFAFF',  // Blanco púrpura muy sutil
      paper: '#FFFFFF',
      elevated: '#FEFEFF',
      overlay: 'rgba(59, 7, 100, 0.7)',
    },
  },

  'reciprocidad-balance': {
    primary: {
      main: '#10B981',      // Verde equilibrio
      light: '#6EE7B7',
      dark: '#047857',
      gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
    },
    secondary: {
      main: '#F59E0B',      // Dorado reciprocidad
      light: '#FDE68A',
      dark: '#D97706',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
    elements: {
      fuego: {
        primary: '#EF4444',
        secondary: '#FEE2E2',
        gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      },
      agua: {
        primary: '#3B82F6',
        secondary: '#DBEAFE',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      },
      tierra: {
        primary: '#10B981',
        secondary: '#D1FAE5',
        gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      },
      aire: {
        primary: '#6366F1',
        secondary: '#E0E7FF',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
      },
      eter: {
        primary: '#F59E0B',
        secondary: '#FEF3C7',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
    },
    consciousness: {
      elevation: '#6366F1',
      harmony: '#10B981',
      growth: '#3B82F6',
      community: '#F59E0B',
      wisdom: '#8B5CF6',
    },
    interaction: {
      hover: 'rgba(16, 185, 129, 0.08)',
      active: 'rgba(16, 185, 129, 0.12)',
      focus: 'rgba(16, 185, 129, 0.24)',
      disabled: 'rgba(156, 163, 175, 0.6)',
    },
    surfaces: {
      background: '#F8FDF8',  // Verde muy sutil
      paper: '#FFFFFF',
      elevated: '#FEFFFE',
      overlay: 'rgba(6, 78, 59, 0.5)',
    },
  },

  'bien-comun': {
    primary: {
      main: '#3B82F6',      // Azul comunidad
      light: '#93C5FD',
      dark: '#1D4ED8',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    },
    secondary: {
      main: '#10B981',      // Verde cooperación
      light: '#6EE7B7',
      dark: '#047857',
      gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
    },
    elements: {
      fuego: {
        primary: '#F97316',
        secondary: '#FFEDD5',
        gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      },
      agua: {
        primary: '#3B82F6',
        secondary: '#DBEAFE',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      },
      tierra: {
        primary: '#10B981',
        secondary: '#D1FAE5',
        gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      },
      aire: {
        primary: '#06B6D4',
        secondary: '#CFFAFE',
        gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      },
      eter: {
        primary: '#8B5CF6',
        secondary: '#EDE9FE',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)',
      },
    },
    consciousness: {
      elevation: '#8B5CF6',
      harmony: '#10B981',
      growth: '#3B82F6',
      community: '#F97316',
      wisdom: '#06B6D4',
    },
    interaction: {
      hover: 'rgba(59, 130, 246, 0.08)',
      active: 'rgba(59, 130, 246, 0.12)',
      focus: 'rgba(59, 130, 246, 0.24)',
      disabled: 'rgba(148, 163, 184, 0.6)',
    },
    surfaces: {
      background: '#F8FAFF',  // Azul muy sutil
      paper: '#FFFFFF',
      elevated: '#FDFDFF',
      overlay: 'rgba(29, 78, 216, 0.5)',
    },
  },
};

// 🎨 FUNCIONES UTILITIES DEL CONCILIO
export const getConcilioTheme = (theme: ConcilioTheme): ConcilioColorSystem => {
  return CONCILIO_THEMES[theme];
};

export const createElementGradient = (element: keyof ConcilioColorSystem['elements']): string => {
  return CONCILIO_THEMES['guardian-harmony'].elements[element].gradient;
};

export const getConsciousnessColor = (
  type: keyof ConcilioColorSystem['consciousness'],
  theme: ConcilioTheme = 'guardian-harmony'
): string => {
  return CONCILIO_THEMES[theme].consciousness[type];
};

export const getInteractionState = (
  state: keyof ConcilioColorSystem['interaction'],
  theme: ConcilioTheme = 'guardian-harmony'
): string => {
  return CONCILIO_THEMES[theme].interaction[state];
};

// 🌟 SISTEMA DE MÓDULOS TEMÁTICOS
export const MODULE_THEME_MAPPING = {
  home: 'guardian-harmony',
  uplay: 'cosmic-transcendence',
  marketplace: 'autumn-serenity',
  social: 'bien-comun',
  wallet: 'guardian-harmony',
  consciousness: 'cosmic-transcendence',
  profile: 'reciprocidad-balance',
  ustats: 'bien-comun',
} as const;

// 🔄 TRANSICIONES CONSCIENTES
export const CONCILIO_TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  organic: '600ms cubic-bezier(0.23, 1, 0.32, 1)',
} as const;

// 🌌 SOMBRAS CONSCIENTES
export const CONCILIO_SHADOWS = {
  subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
  soft: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
  medium: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  elevated: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  cosmic: '0 25px 50px rgba(139, 92, 246, 0.25)',
  reciprocidad: '0 25px 50px rgba(16, 185, 129, 0.25)',
} as const;

export default {
  CONCILIO_THEMES,
  getConcilioTheme,
  createElementGradient,
  getConsciousnessColor,
  getInteractionState,
  MODULE_THEME_MAPPING,
  CONCILIO_TRANSITIONS,
  CONCILIO_SHADOWS,
};
