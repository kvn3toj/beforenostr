import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { alpha } from '@mui/material/styles';
import { Box, Grid, Typography, ButtonBase } from '@mui/material';

// ===== 🌟 TIPOS UNIVERSALES GUARDIAN =====
export type UniversalGuardianTheme =
  | 'cosmic-harmony' | 'elemental-balance' | 'ayni-flow' | 'bien-comun'
  | 'transcendent' | 'guardian-elements' | 'autumn-warmth' | 'cosmic-vision'
  | 'universal-harmony' | 'ethereal-unity';

export type CosmicElement = 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
export type CoomunityConcept = 'ayni' | 'meritos' | 'ondas' | 'lukas' | 'bien-comun';

// ===== 🎨 PALETAS UNIVERSALES GUARDIAN MEJORADAS =====
const UNIVERSAL_GUARDIAN_PALETTES = {
  'cosmic-harmony': {
    name: 'Armonía Cósmica Universal',
    description: 'Unificación de todos los elementos en perfecta armonía',
    elements: {
      fuego: {
        primary: '#f59e0b',
        secondary: '#fbbf24',
        light: '#fef3c7',
        dark: '#d97706',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
      },
      agua: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        light: '#cffafe',
        dark: '#0e7490',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
      },
      tierra: {
        primary: '#16a34a',
        secondary: '#22c55e',
        light: '#dcfce7',
        dark: '#15803d',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
      },
      aire: {
        primary: '#a855f7',
        secondary: '#c084fc',
        light: '#f3e8ff',
        dark: '#9333ea',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)'
      },
      eter: {
        primary: '#6b7280',
        secondary: '#9ca3af',
        light: '#f9fafb',
        dark: '#4b5563',
        gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
      }
    },
    concepts: {
      ayni: '#10b981',
      meritos: '#f59e0b',
      ondas: '#8b5cf6',
      lukas: '#06b6d4',
      'bien-comun': '#ef4444'
    },
    background: {
      default: '#ffffff',
      paper: '#fefefe',
      surface: '#f9fafb',
      elevated: '#f3f4f6'
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(168, 85, 247, 0.3)',
      cosmicGlow: '0 0 30px rgba(59, 130, 246, 0.4)',
      elementalGlow: '0 0 25px rgba(16, 185, 129, 0.35)',
      ayniGlow: '0 0 20px rgba(16, 185, 129, 0.5)'
    }
  },
  'elemental-balance': {
    name: 'Equilibrio Elemental',
    description: 'Balance perfecto entre los cinco elementos cósmicos',
    elements: {
      fuego: {
        primary: '#dc2626',
        secondary: '#ef4444',
        light: '#fee2e2',
        dark: '#b91c1c',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
      },
      agua: {
        primary: '#1d4ed8',
        secondary: '#3b82f6',
        light: '#dbeafe',
        dark: '#1e40af',
        gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
      },
      tierra: {
        primary: '#059669',
        secondary: '#10b981',
        light: '#d1fae5',
        dark: '#047857',
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
      },
      aire: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        light: '#ede9fe',
        dark: '#6d28d9',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
      },
      eter: {
        primary: '#374151',
        secondary: '#6b7280',
        light: '#f3f4f6',
        dark: '#1f2937',
        gradient: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)'
      }
    },
    concepts: {
      ayni: '#059669',
      meritos: '#dc2626',
      ondas: '#7c3aed',
      lukas: '#1d4ed8',
      'bien-comun': '#f59e0b'
    },
    background: {
      default: '#fefefe',
      paper: '#ffffff',
      surface: '#f8fafc',
      elevated: '#f1f5f9'
    },
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(124, 58, 237, 0.3)',
      cosmicGlow: '0 0 30px rgba(29, 78, 216, 0.4)',
      elementalGlow: '0 0 25px rgba(5, 150, 105, 0.35)',
      ayniGlow: '0 0 20px rgba(5, 150, 105, 0.5)'
    }
  },
  'ayni-flow': {
    name: 'Flujo de Ayni',
    description: 'Reciprocidad y equilibrio en movimiento constante',
    elements: {
      fuego: {
        primary: '#ea580c',
        secondary: '#f97316',
        light: '#fed7aa',
        dark: '#c2410c',
        gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)'
      },
      agua: {
        primary: '#0284c7',
        secondary: '#0ea5e9',
        light: '#bae6fd',
        dark: '#0369a1',
        gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)'
      },
      tierra: {
        primary: '#65a30d',
        secondary: '#84cc16',
        light: '#ecfccb',
        dark: '#4d7c0f',
        gradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)'
      },
      aire: {
        primary: '#9333ea',
        secondary: '#a855f7',
        light: '#f3e8ff',
        dark: '#7e22ce',
        gradient: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)'
      },
      eter: {
        primary: '#475569',
        secondary: '#64748b',
        light: '#f8fafc',
        dark: '#334155',
        gradient: 'linear-gradient(135deg, #475569 0%, #64748b 100%)'
      }
    },
    concepts: {
      ayni: '#65a30d',
      meritos: '#ea580c',
      ondas: '#9333ea',
      lukas: '#0284c7',
      'bien-comun': '#dc2626'
    },
    background: {
      default: '#ffffff',
      paper: '#fefefe',
      surface: '#f9fafb',
      elevated: '#f3f4f6'
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      muted: '#64748b',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(147, 51, 234, 0.3)',
      cosmicGlow: '0 0 30px rgba(2, 132, 199, 0.4)',
      elementalGlow: '0 0 25px rgba(101, 163, 13, 0.35)',
      ayniGlow: '0 0 20px rgba(101, 163, 13, 0.5)'
    }
  },
  'bien-comun': {
    name: 'Bien Común Universal',
    description: 'Prioridad del bien colectivo sobre el individual',
    elements: {
      fuego: {
        primary: '#b91c1c',
        secondary: '#dc2626',
        light: '#fecaca',
        dark: '#991b1b',
        gradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)'
      },
      agua: {
        primary: '#1e40af',
        secondary: '#2563eb',
        light: '#dbeafe',
        dark: '#1d4ed8',
        gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'
      },
      tierra: {
        primary: '#047857',
        secondary: '#059669',
        light: '#d1fae5',
        dark: '#065f46',
        gradient: 'linear-gradient(135deg, #047857 0%, #059669 100%)'
      },
      aire: {
        primary: '#6d28d9',
        secondary: '#7c3aed',
        light: '#ede9fe',
        dark: '#581c87',
        gradient: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)'
      },
      eter: {
        primary: '#1f2937',
        secondary: '#374151',
        light: '#f9fafb',
        dark: '#111827',
        gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
      }
    },
    concepts: {
      ayni: '#047857',
      meritos: '#b91c1c',
      ondas: '#6d28d9',
      lukas: '#1e40af',
      'bien-comun': '#dc2626'
    },
    background: {
      default: '#fefefe',
      paper: '#ffffff',
      surface: '#f8fafc',
      elevated: '#f1f5f9'
    },
    text: {
      primary: '#111827',
      secondary: '#1f2937',
      muted: '#4b5563',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(109, 40, 217, 0.3)',
      cosmicGlow: '0 0 30px rgba(30, 64, 175, 0.4)',
      elementalGlow: '0 0 25px rgba(4, 120, 87, 0.35)',
      ayniGlow: '0 0 20px rgba(4, 120, 87, 0.5)'
    }
  },
  'transcendent': {
    name: 'Trascendencia Cósmica',
    description: 'Elevación hacia la conciencia universal',
    elements: {
      fuego: {
        primary: '#f97316',
        secondary: '#fb923c',
        light: '#fed7aa',
        dark: '#ea580c',
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
      },
      agua: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        light: '#bae6fd',
        dark: '#0284c7',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
      },
      tierra: {
        primary: '#84cc16',
        secondary: '#a3e635',
        light: '#ecfccb',
        dark: '#65a30d',
        gradient: 'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)'
      },
      aire: {
        primary: '#a855f7',
        secondary: '#c084fc',
        light: '#f3e8ff',
        dark: '#9333ea',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)'
      },
      eter: {
        primary: '#64748b',
        secondary: '#94a3b8',
        light: '#f8fafc',
        dark: '#475569',
        gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
      }
    },
    concepts: {
      ayni: '#84cc16',
      meritos: '#f97316',
      ondas: '#a855f7',
      lukas: '#0ea5e9',
      'bien-comun': '#ef4444'
    },
    background: {
      default: '#ffffff',
      paper: '#fefefe',
      surface: '#f9fafb',
      elevated: '#f3f4f6'
    },
    text: {
      primary: '#0f172a',
      secondary: '#1e293b',
      muted: '#475569',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(168, 85, 247, 0.3)',
      cosmicGlow: '0 0 30px rgba(14, 165, 233, 0.4)',
      elementalGlow: '0 0 25px rgba(132, 204, 22, 0.35)',
      ayniGlow: '0 0 20px rgba(132, 204, 22, 0.5)'
    }
  },
  'guardian-elements': {
    name: 'Guardian Elements',
    description: 'Los cinco elementos en armonía máxima',
    elements: {
      fuego: {
        primary: '#f5a623',
        secondary: '#fbbf24',
        light: '#fef3c7',
        dark: '#d97706',
        gradient: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)'
      },
      agua: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        light: '#cffafe',
        dark: '#0e7490',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
      },
      tierra: {
        primary: '#16a34a',
        secondary: '#22c55e',
        light: '#dcfce7',
        dark: '#15803d',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
      },
      aire: {
        primary: '#a855f7',
        secondary: '#c084fc',
        light: '#f3e8ff',
        dark: '#9333ea',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)'
      },
      eter: {
        primary: '#e8e7e3',
        secondary: '#f5f5f4',
        light: '#fafaf9',
        dark: '#d6d3d1',
        gradient: 'linear-gradient(135deg, #e8e7e3 0%, #f5f5f4 100%)'
      }
    },
    concepts: {
      ayni: '#10b981',
      meritos: '#f59e0b',
      ondas: '#8b5cf6',
      lukas: '#06b6d4',
      'bien-comun': '#ef4444'
    },
    background: {
      default: '#fffffe',
      paper: '#fdfdfb',
      surface: '#faf9f6',
      elevated: '#f8f7f4'
    },
    text: {
      primary: '#000000',
      secondary: '#2d2d2d',
      muted: '#595959',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(245, 166, 35, 0.3)',
      cosmicGlow: '0 0 30px rgba(8, 145, 178, 0.4)',
      elementalGlow: '0 0 25px rgba(22, 163, 74, 0.35)',
      ayniGlow: '0 0 20px rgba(168, 85, 247, 0.5)'
    }
  },
  'autumn-warmth': {
    name: 'Autumn Warmth',
    description: 'Calidez otoñal con tonos terrosos',
    elements: {
      fuego: {
        primary: '#f97316',
        secondary: '#fb923c',
        light: '#fed7aa',
        dark: '#ea580c',
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
      },
      agua: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        light: '#cffafe',
        dark: '#0e7490',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
      },
      tierra: {
        primary: '#16a34a',
        secondary: '#22c55e',
        light: '#dcfce7',
        dark: '#15803d',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
      },
      aire: {
        primary: '#dc2626',
        secondary: '#ef4444',
        light: '#fee2e2',
        dark: '#b91c1c',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
      },
      eter: {
        primary: '#78716c',
        secondary: '#a8a29e',
        light: '#fafaf9',
        dark: '#57534e',
        gradient: 'linear-gradient(135deg, #78716c 0%, #a8a29e 100%)'
      }
    },
    concepts: {
      ayni: '#16a34a',
      meritos: '#f97316',
      ondas: '#dc2626',
      lukas: '#0891b2',
      'bien-comun': '#f59e0b'
    },
    background: {
      default: '#fffefb',
      paper: '#fafaf9',
      surface: '#f5f5f4',
      elevated: '#f0f0ef'
    },
    text: {
      primary: '#292524',
      secondary: '#57534e',
      muted: '#78716c',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(249, 115, 22, 0.3)',
      cosmicGlow: '0 0 30px rgba(220, 38, 38, 0.4)',
      elementalGlow: '0 0 25px rgba(22, 163, 74, 0.35)',
      ayniGlow: '0 0 20px rgba(22, 163, 74, 0.5)'
    }
  },
  'cosmic-vision': {
    name: 'Cosmic Vision',
    description: 'Visión espacial y futurista',
    elements: {
      fuego: {
        primary: '#f59e0b',
        secondary: '#fbbf24',
        light: '#fef3c7',
        dark: '#d97706',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
      },
      agua: {
        primary: '#06b6d4',
        secondary: '#67e8f9',
        light: '#cffafe',
        dark: '#0891b2',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)'
      },
      tierra: {
        primary: '#10b981',
        secondary: '#34d399',
        light: '#d1fae5',
        dark: '#059669',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
      },
      aire: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        light: '#ede9fe',
        dark: '#7c3aed',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
      },
      eter: {
        primary: '#64748b',
        secondary: '#94a3b8',
        light: '#f1f5f9',
        dark: '#475569',
        gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
      }
    },
    concepts: {
      ayni: '#10b981',
      meritos: '#f59e0b',
      ondas: '#8b5cf6',
      lukas: '#06b6d4',
      'bien-comun': '#ec4899'
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
      surface: '#334155',
      elevated: '#475569'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      muted: '#94a3b8',
      inverse: '#0f172a'
    },
    effects: {
      glow: '0 0 20px rgba(139, 92, 246, 0.5)',
      cosmicGlow: '0 0 30px rgba(6, 182, 212, 0.6)',
      elementalGlow: '0 0 25px rgba(16, 185, 129, 0.5)',
      ayniGlow: '0 0 20px rgba(16, 185, 129, 0.7)'
    }
  },
  'universal-harmony': {
    name: 'Universal Harmony',
    description: 'Equilibrio universal entre todos los elementos',
    elements: {
      fuego: {
        primary: '#f59e0b',
        secondary: '#fbbf24',
        light: '#fef3c7',
        dark: '#d97706',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
      },
      agua: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
        light: '#dbeafe',
        dark: '#2563eb',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
      },
      tierra: {
        primary: '#10b981',
        secondary: '#34d399',
        light: '#d1fae5',
        dark: '#059669',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
      },
      aire: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        light: '#ede9fe',
        dark: '#7c3aed',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
      },
      eter: {
        primary: '#6b7280',
        secondary: '#9ca3af',
        light: '#f9fafb',
        dark: '#4b5563',
        gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
      }
    },
    concepts: {
      ayni: '#10b981',
      meritos: '#f59e0b',
      ondas: '#8b5cf6',
      lukas: '#3b82f6',
      'bien-comun': '#ef4444'
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
      surface: '#f3f4f6',
      elevated: '#e5e7eb'
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(139, 92, 246, 0.3)',
      cosmicGlow: '0 0 30px rgba(59, 130, 246, 0.4)',
      elementalGlow: '0 0 25px rgba(16, 185, 129, 0.35)',
      ayniGlow: '0 0 20px rgba(16, 185, 129, 0.5)'
    }
  },
  'ethereal-unity': {
    name: 'Ethereal Unity',
    description: 'Unidad etérea que trasciende las fronteras',
    elements: {
      fuego: {
        primary: '#f472b6',
        secondary: '#fb7185',
        light: '#fce7f3',
        dark: '#ec4899',
        gradient: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)'
      },
      agua: {
        primary: '#06b6d4',
        secondary: '#67e8f9',
        light: '#cffafe',
        dark: '#0891b2',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)'
      },
      tierra: {
        primary: '#84cc16',
        secondary: '#a3e635',
        light: '#ecfccb',
        dark: '#65a30d',
        gradient: 'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)'
      },
      aire: {
        primary: '#a855f7',
        secondary: '#c084fc',
        light: '#f3e8ff',
        dark: '#9333ea',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)'
      },
      eter: {
        primary: '#e1bee7',
        secondary: '#ddd6fe',
        light: '#faf5ff',
        dark: '#c084fc',
        gradient: 'linear-gradient(135deg, #e1bee7 0%, #ddd6fe 100%)'
      }
    },
    concepts: {
      ayni: '#84cc16',
      meritos: '#f472b6',
      ondas: '#a855f7',
      lukas: '#06b6d4',
      'bien-comun': '#fbbf24'
    },
    background: {
      default: '#fefefe',
      paper: '#faf5ff',
      surface: '#f5f3ff',
      elevated: '#ede9fe'
    },
    text: {
      primary: '#1e1b4b',
      secondary: '#3730a3',
      muted: '#6366f1',
      inverse: '#ffffff'
    },
    effects: {
      glow: '0 0 20px rgba(168, 85, 247, 0.4)',
      cosmicGlow: '0 0 30px rgba(244, 114, 182, 0.5)',
      elementalGlow: '0 0 25px rgba(132, 204, 22, 0.4)',
      ayniGlow: '0 0 20px rgba(132, 204, 22, 0.6)'
    }
  }
};

// ===== 🎯 INTERFAZ DEL CONTEXTO UNIVERSAL MEJORADA =====
interface UniversalGuardianContextType {
  currentTheme: UniversalGuardianTheme;
  palette: typeof UNIVERSAL_GUARDIAN_PALETTES[UniversalGuardianTheme];
  switchTheme: (theme: UniversalGuardianTheme) => void;
  getElementColor: (element: CosmicElement) => string;
  getElementGradient: (element: CosmicElement) => string;
  getConceptColor: (concept: CoomunityConcept) => string;
  getEffectStyle: (effect: 'glow' | 'cosmicGlow' | 'elementalGlow' | 'ayniGlow') => string;
  applyElementClass: (element: CosmicElement) => string;
  applyConceptClass: (concept: CoomunityConcept) => string;
  createMuiTheme: () => Theme;
  getUniversalClassName: (variant: 'card' | 'button' | 'chip', element?: CosmicElement, concept?: CoomunityConcept) => string;
  applyUniversalStyles: (element?: CosmicElement, concept?: CoomunityConcept) => React.CSSProperties;
  getThemeList: () => Array<{key: UniversalGuardianTheme, name: string, description: string}>;
}

// ===== 🌟 CONTEXTO UNIVERSAL GUARDIAN =====
const UniversalGuardianContext = createContext<UniversalGuardianContextType | undefined>(undefined);

// ===== 🎨 HOOK UNIVERSAL GUARDIAN =====
export const useUniversalGuardian = (): UniversalGuardianContextType => {
  const context = useContext(UniversalGuardianContext);
  if (!context) {
    throw new Error('useUniversalGuardian must be used within a UniversalGuardianProvider');
  }
  return context;
};

// ===== 🎨 CREACIÓN DEL TEMA MATERIAL-UI UNIVERSAL MEJORADO =====
const createUniversalMuiTheme = (themeName: UniversalGuardianTheme): Theme => {
  const palette = UNIVERSAL_GUARDIAN_PALETTES[themeName];
  const isDark = themeName === 'cosmic-vision';

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: palette.elements.fuego.primary,
        light: palette.elements.fuego.light,
        dark: palette.elements.fuego.dark,
        contrastText: '#ffffff'
      },
      secondary: {
        main: palette.elements.agua.primary,
        light: palette.elements.agua.light,
        dark: palette.elements.agua.dark,
        contrastText: '#ffffff'
      },
      background: {
        default: palette.background.default,
        paper: palette.background.paper
      },
      text: {
        primary: palette.text.primary,
        secondary: palette.text.secondary,
        disabled: palette.text.muted
      },
      success: {
        main: palette.elements.tierra.primary,
        light: palette.elements.tierra.light,
        dark: palette.elements.tierra.dark
      },
      warning: {
        main: palette.concepts.meritos,
        light: '#fef3c7',
        dark: '#d97706'
      },
      error: {
        main: palette.concepts['bien-comun'],
        light: '#fee2e2',
        dark: '#dc2626'
      },
      info: {
        main: palette.elements.aire.primary,
        light: palette.elements.aire.light,
        dark: palette.elements.aire.dark
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        color: palette.text.primary
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.3,
        color: palette.text.primary
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        color: palette.text.primary
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: palette.text.secondary
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: palette.text.muted
      }
    },
    shape: {
      borderRadius: 12
    },
    shadows: [
      'none',
      '0 1px 3px rgba(0, 0, 0, 0.1)',
      '0 4px 6px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 20px 25px rgba(0, 0, 0, 0.15)',
      ...Array(20).fill('0 20px 25px rgba(0, 0, 0, 0.15)')
    ] as any,
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '1.5rem',
            border: '2px solid rgba(245, 158, 11, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(135deg, ${palette.elements.fuego.primary} 0%, ${palette.elements.agua.primary} 25%, ${palette.elements.tierra.primary} 50%, ${palette.elements.aire.primary} 75%, ${palette.elements.eter.primary} 100%)`,
              borderRadius: '1.5rem 1.5rem 0 0'
            },
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 20px 25px rgba(0, 0, 0, 0.15), ${palette.effects.glow}`,
              borderColor: 'rgba(245, 158, 11, 0.3)'
            },
            transition: '0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            background: palette.elements.fuego.gradient,
            borderRadius: '1rem',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 10px 15px rgba(0, 0, 0, 0.1), ${palette.effects.glow}`,
              background: palette.elements.fuego.gradient
            },
            transition: '0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem',
            fontWeight: 600,
            fontSize: '0.75rem',
            '&:hover': {
              transform: 'translateY(-1px)'
            },
            transition: '0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }
        }
      }
    }
  });
};

// ===== 🌟 PROVEEDOR UNIVERSAL GUARDIAN MEJORADO =====
interface UniversalGuardianProviderProps {
  children: ReactNode;
  defaultTheme?: UniversalGuardianTheme;
}

export const UniversalGuardianProvider: React.FC<UniversalGuardianProviderProps> = ({
  children,
  defaultTheme = 'cosmic-harmony'
}) => {
  const [currentTheme, setCurrentTheme] = useState<UniversalGuardianTheme>(
    () => {
      // Intentar recuperar el tema del localStorage
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('universal-guardian-theme') as UniversalGuardianTheme;
        return savedTheme && UNIVERSAL_GUARDIAN_PALETTES[savedTheme] ? savedTheme : defaultTheme;
      }
      return defaultTheme;
    }
  );

  const palette = UNIVERSAL_GUARDIAN_PALETTES[currentTheme];

  // ===== 🎨 APLICACIÓN DE VARIABLES CSS MEJORADA =====
  useEffect(() => {
    const root = document.documentElement;

    // Variables de elementos cósmicos
    Object.entries(palette.elements).forEach(([element, colors]) => {
      root.style.setProperty(`--universal-${element}-primary`, colors.primary);
      root.style.setProperty(`--universal-${element}-secondary`, colors.secondary);
      root.style.setProperty(`--universal-${element}-light`, colors.light);
      root.style.setProperty(`--universal-${element}-dark`, colors.dark);
      root.style.setProperty(`--universal-${element}-gradient`, colors.gradient);
    });

    // Variables de conceptos CoomÜnity
    Object.entries(palette.concepts).forEach(([concept, color]) => {
      root.style.setProperty(`--universal-${concept}`, color);
    });

    // Variables de fondo y texto
    root.style.setProperty('--universal-bg-default', palette.background.default);
    root.style.setProperty('--universal-bg-paper', palette.background.paper);
    root.style.setProperty('--universal-bg-surface', palette.background.surface);
    root.style.setProperty('--universal-bg-elevated', palette.background.elevated);

    root.style.setProperty('--universal-text-primary', palette.text.primary);
    root.style.setProperty('--universal-text-secondary', palette.text.secondary);
    root.style.setProperty('--universal-text-muted', palette.text.muted);
    root.style.setProperty('--universal-text-inverse', palette.text.inverse);

    // Variables de efectos
    Object.entries(palette.effects).forEach(([effect, value]) => {
      root.style.setProperty(`--universal-effect-${effect}`, value);
    });

    // Gradientes universales especiales
    root.style.setProperty('--universal-gradient-harmony',
      `linear-gradient(135deg, ${palette.elements.fuego.primary} 0%, ${palette.elements.agua.primary} 25%, ${palette.elements.tierra.primary} 50%, ${palette.elements.aire.primary} 75%, ${palette.elements.eter.primary} 100%)`);

    root.style.setProperty('--universal-gradient-concepts',
      `linear-gradient(135deg, ${palette.concepts.ayni} 0%, ${palette.concepts.meritos} 25%, ${palette.concepts.ondas} 50%, ${palette.concepts.lukas} 75%, ${palette.concepts['bien-comun']} 100%)`);

    // Aplicar clase de tema al body
    document.body.className = `universal-guardian-theme-${currentTheme} universal-guardian-system`;

    // Guardar tema en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('universal-guardian-theme', currentTheme);
    }

  }, [currentTheme, palette]);

  const switchTheme = (theme: UniversalGuardianTheme) => {
    setCurrentTheme(theme);
  };

  const getElementColor = (element: CosmicElement): string => {
    return UNIVERSAL_GUARDIAN_PALETTES[currentTheme].elements[element].primary;
  };

  const getElementGradient = (element: CosmicElement): string => {
    return UNIVERSAL_GUARDIAN_PALETTES[currentTheme].elements[element].gradient;
  };

  const getConceptColor = (concept: CoomunityConcept): string => {
    return UNIVERSAL_GUARDIAN_PALETTES[currentTheme].concepts[concept];
  };

  const getEffectStyle = (effect: 'glow' | 'cosmicGlow' | 'elementalGlow' | 'ayniGlow'): string => {
    return UNIVERSAL_GUARDIAN_PALETTES[currentTheme].effects[effect];
  };

  const applyElementClass = (element: CosmicElement): string => {
    return `universal-${element}-${currentTheme}`;
  };

  const applyConceptClass = (concept: CoomunityConcept): string => {
    return `universal-${concept}-${currentTheme}`;
  };

  // ===== 🆕 NUEVAS FUNCIONES PARA COHERENCIA TOTAL =====
  const getUniversalClassName = (
    variant: 'card' | 'button' | 'chip',
    element?: CosmicElement,
    concept?: CoomunityConcept
  ): string => {
    let className = `universal-${variant}`;

    if (element) {
      className += ` universal-${element}-${variant}`;
    }

    if (concept) {
      className += ` universal-${concept}-${variant}`;
    }

    return className;
  };

  const applyUniversalStyles = (
    element?: CosmicElement,
    concept?: CoomunityConcept
  ): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (element) {
      const elementColor = getElementColor(element);
      styles.borderColor = `rgba(${hexToRgb(elementColor)}, 0.3)`;
      styles.boxShadow = `var(--universal-shadow-lg), 0 0 20px rgba(${hexToRgb(elementColor)}, 0.1)`;
    }

    if (concept) {
      const conceptColor = getConceptColor(concept);
      styles.accentColor = conceptColor;
    }

    return styles;
  };

  const getThemeList = () => {
    return Object.entries(UNIVERSAL_GUARDIAN_PALETTES).map(([key, value]) => ({
      key: key as UniversalGuardianTheme,
      name: value.name,
      description: value.description
    }));
  };

  const contextValue: UniversalGuardianContextType = {
    currentTheme,
    palette: UNIVERSAL_GUARDIAN_PALETTES[currentTheme],
    switchTheme,
    getElementColor,
    getElementGradient,
    getConceptColor,
    getEffectStyle,
    applyElementClass,
    applyConceptClass,
    createMuiTheme: () => createUniversalMuiTheme(currentTheme),
    getUniversalClassName,
    applyUniversalStyles,
    getThemeList
  };

  const theme = createUniversalMuiTheme(currentTheme);

  return (
    <UniversalGuardianContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </UniversalGuardianContext.Provider>
  );
};

// ===== 🛠️ UTILIDADES AUXILIARES =====
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// ===== 📤 EXPORTACIONES =====
export default UniversalGuardianProvider;
export { UNIVERSAL_GUARDIAN_PALETTES };
export type { UniversalGuardianContextType };
