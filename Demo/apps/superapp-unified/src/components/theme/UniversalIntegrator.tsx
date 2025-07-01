import React, { ReactNode, useEffect } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  UniversalGuardianProvider,
  useUniversalGuardian,
  CosmicElement,
  CoomunityConcept
} from './UniversalGuardianSystem';
import { UniversalComponent } from '../universal/UniversalComponent';

// ===== 🌟 MAPEO INTELIGENTE DE RUTAS ===== //
interface RouteMapping {
  element: CosmicElement;
  concept: CoomunityConcept;
  themeVariant: string;
  philosophical: {
    essence: string;
    intention: string;
    energy: string;
  };
}

const ROUTE_MAPPINGS: Record<string, RouteMapping> = {
  // 🏠 PÁGINA PRINCIPAL - AIRE (Vision) + RECIPROCIDAD (Reciprocidad)
  '/': {
    element: 'aire',
    concept: 'reciprocidad',
    themeVariant: 'cosmic-harmony',
    philosophical: {
      essence: 'El hogar donde convergen todas las energías cósmicas',
      intention: 'Brindar una bienvenida armoniosa que refleje el equilibrio universal',
      energy: 'Claridad mental, visión amplia, conexión espiritual'
    }
  },
  '/home': {
    element: 'aire',
    concept: 'reciprocidad',
    themeVariant: 'cosmic-harmony',
    philosophical: {
      essence: 'El hogar donde convergen todas las energías cósmicas',
      intention: 'Brindar una bienvenida armoniosa que refleje el equilibrio universal',
      energy: 'Claridad mental, visión amplia, conexión espiritual'
    }
  },

  // 🎬 ÜPLAY - AIRE (Vision) + ONDAS (Vibraciones)
  '/uplay': {
    element: 'aire',
    concept: 'ondas',
    themeVariant: 'elemental-balance',
    philosophical: {
      essence: 'La experiencia interactiva donde el conocimiento fluye como ondas de luz',
      intention: 'Facilitar el aprendizaje a través de vibraciones positivas de contenido',
      energy: 'Inspiración, claridad mental, expansión de consciencia'
    }
  },

  // 🏪 MARKETPLACE - TIERRA (Stability) + LUKAS (Intercambio)
  '/marketplace': {
    element: 'tierra',
    concept: 'lukas',
    themeVariant: 'earthen-prosperity',
    philosophical: {
      essence: 'El punto de encuentro sólido donde se intercambia valor real',
      intention: 'Crear un espacio confiable para el comercio consciente',
      energy: 'Estabilidad, confianza, abundancia material equilibrada'
    }
  },

  // 🌊 SOCIAL - AGUA (Flow) + RECIPROCIDAD (Reciprocidad)
  '/social': {
    element: 'agua',
    concept: 'reciprocidad',
    themeVariant: 'aquatic-flow',
    philosophical: {
      essence: 'El río social donde las relaciones fluyen con reciprocidad natural',
      intention: 'Nutrir conexiones humanas auténticas y colaboración mutua',
      energy: 'Fluidez emocional, empatía, conexión profunda'
    }
  },

  // 📊 USTATS - FUEGO (Action) + MÉRITOS (Reconocimiento)
  '/ustats': {
    element: 'fuego',
    concept: 'meritos',
    themeVariant: 'fiery-achievement',
    philosophical: {
      essence: 'El fuego transformador que revela el progreso y los logros',
      intention: 'Reconocer y celebrar los méritos ganados en el camino',
      energy: 'Motivación, logro, transformación personal'
    }
  },

  // 💰 WALLET - ÉTER (Transcendence) + BIEN COMÚN (Propósito Superior)
  '/wallet': {
    element: 'eter',
    concept: 'bien-comun',
    themeVariant: 'etheric-transcendence',
    philosophical: {
      essence: 'El espacio etérico donde los recursos se alinean con el bien superior',
      intention: 'Gestionar la abundancia con consciencia del propósito colectivo',
      energy: 'Trascendencia, sabiduría económica, responsabilidad cósmica'
    }
  },

  // 👤 PROFILE - AIRE (Vision) + MÉRITOS (Identidad)
  '/profile': {
    element: 'aire',
    concept: 'meritos',
    themeVariant: 'cosmic-identity',
    philosophical: {
      essence: 'El reflejo cristalino de la identidad y los logros personales',
      intention: 'Mostrar la evolución personal con claridad y autenticidad',
      energy: 'Autoconocimiento, visión personal, crecimiento consciente'
    }
  },

  // 🔍 DISCOVERY/PILGRIM - ÉTER (Transcendence) + RECIPROCIDAD (Guía)
  '/discovery': {
    element: 'eter',
    concept: 'reciprocidad',
    themeVariant: 'cosmic-initiation',
    philosophical: {
      essence: 'El umbral etérico hacia el despertar de consciencia',
      intention: 'Guiar el primer paso en el viaje de transformación',
      energy: 'Revelación, iniciación, despertar espiritual'
    }
  },
  '/pilgrim': {
    element: 'eter',
    concept: 'reciprocidad',
    themeVariant: 'cosmic-initiation',
    philosophical: {
      essence: 'El umbral etérico hacia el despertar de consciencia',
      intention: 'Guiar el primer paso en el viaje de transformación',
      energy: 'Revelación, iniciación, despertar espiritual'
    }
  }
};

// ===== 🎨 INTERFAZ DEL INTEGRADOR UNIVERSAL ===== //
interface UniversalIntegratorProps {
  children: ReactNode;
  forceElement?: CosmicElement;
  forceConcept?: CoomunityConcept;
  forceTheme?: string;
  disableAutoMapping?: boolean;
  className?: string;
  enableCosmicBackground?: boolean;
  philosophical?: boolean;
}

// ===== 🌌 COMPONENTE INTERNO CON ACCESO AL CONTEXTO ===== //
const UniversalIntegratorInner: React.FC<UniversalIntegratorProps> = ({
  children,
  forceElement,
  forceConcept,
  forceTheme,
  disableAutoMapping = false,
  className = '',
  enableCosmicBackground = true,
  philosophical = true
}) => {
  const location = useLocation();
  const {
    setCurrentTheme,
    currentTheme,
    theme,
    getElementColor,
    getElementGradient,
    getConceptColor
  } = useUniversalGuardian();

  // Determinar el mapeo actual basado en la ruta
  const currentMapping = disableAutoMapping
    ? null
    : ROUTE_MAPPINGS[location.pathname] || ROUTE_MAPPINGS['/'];

  const activeElement = forceElement || currentMapping?.element || 'aire';
  const activeConcept = forceConcept || currentMapping?.concept || 'reciprocidad';
  const activeTheme = forceTheme || currentMapping?.themeVariant || 'cosmic-harmony';

  // Aplicar el tema automáticamente cuando cambie la ruta
  useEffect(() => {
    if (!disableAutoMapping && currentMapping && currentTheme !== activeTheme) {
      setCurrentTheme(activeTheme);
    }
  }, [location.pathname, activeTheme, currentTheme, setCurrentTheme, disableAutoMapping, currentMapping]);

  // Generar estilos dinámicos del contenedor
  const containerStyles = {
    minHeight: '100vh',
    background: enableCosmicBackground
      ? `linear-gradient(135deg,
          ${getElementColor(activeElement)}03 0%,
          ${getConceptColor(activeConcept)}02 50%,
          transparent 100%),
          var(--universal-bg-default)`
      : 'var(--universal-bg-default)',
    position: 'relative' as const,
    transition: 'all var(--universal-transition-smooth)',
    fontFamily: 'var(--universal-font-primary)',
    overflow: 'hidden'
  };

  // Partículas cósmicas de fondo
  const cosmicParticles = enableCosmicBackground && (
    <>
      {/* Partícula del elemento activo */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${getElementColor(activeElement)}15 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'universal-float 8s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Partícula del concepto activo */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${getConceptColor(activeConcept)}12 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'universal-pulse 6s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Líneas de conexión energética */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 49%, ${getElementColor(activeElement)}08 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, ${getConceptColor(activeConcept)}06 50%, transparent 51%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.3
        }}
      />
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        className={`universal-integrator ${className}`}
        sx={containerStyles}
        data-element={activeElement}
        data-concept={activeConcept}
        data-theme={activeTheme}
      >
        {/* Partículas cósmicas de fondo */}
        {cosmicParticles}

        {/* Información filosófica (solo en desarrollo) */}
        {philosophical && currentMapping && process.env.NODE_ENV === 'development' && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              maxWidth: '300px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: 2,
              borderRadius: 2,
              fontSize: '0.75rem',
              zIndex: 9999,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${getElementColor(activeElement)}40`
            }}
          >
            <Box sx={{ fontWeight: 'bold', mb: 1, color: getElementColor(activeElement) }}>
              {activeElement.toUpperCase()} + {activeConcept.toUpperCase()}
            </Box>
            <Box sx={{ mb: 0.5 }}>
              <strong>Esencia:</strong> {currentMapping.philosophical.essence}
            </Box>
            <Box sx={{ mb: 0.5 }}>
              <strong>Intención:</strong> {currentMapping.philosophical.intention}
            </Box>
            <Box>
              <strong>Energía:</strong> {currentMapping.philosophical.energy}
            </Box>
          </Box>
        )}

        {/* Contenido principal con contexto universal */}
        <UniversalComponent
          element={activeElement}
          concept={activeConcept}
          variant="container"
          cosmic={enableCosmicBackground}
          sx={{ zIndex: 1, position: 'relative' }}
        >
          {children}
        </UniversalComponent>
      </Box>
    </ThemeProvider>
  );
};

// ===== 🌟 COMPONENTE PRINCIPAL DEL INTEGRADOR ===== //
export const UniversalIntegrator: React.FC<UniversalIntegratorProps> = (props) => {
  return (
    <UniversalGuardianProvider>
      <UniversalIntegratorInner {...props} />
    </UniversalGuardianProvider>
  );
};

// ===== 🎯 HOOKS ESPECIALIZADOS PARA CONTEXTO ===== //

/**
 * Hook para obtener el contexto de la ruta actual
 */
export const useUniversalContext = () => {
  const location = useLocation();
  const currentMapping = ROUTE_MAPPINGS[location.pathname] || ROUTE_MAPPINGS['/'];

  return {
    currentRoute: location.pathname,
    element: currentMapping.element,
    concept: currentMapping.concept,
    themeVariant: currentMapping.themeVariant,
    philosophical: currentMapping.philosophical,
    isHomePage: location.pathname === '/' || location.pathname === '/home',
    isUPlay: location.pathname === '/uplay',
    isMarketplace: location.pathname === '/marketplace',
    isSocial: location.pathname === '/social',
    isUStats: location.pathname === '/ustats',
    isWallet: location.pathname === '/wallet',
    isProfile: location.pathname === '/profile',
    isDiscovery: location.pathname === '/discovery' || location.pathname === '/pilgrim'
  };
};

/**
 * Hook para aplicar automáticamente los estilos universales a un componente
 */
export const useUniversalContextStyling = () => {
  const context = useUniversalContext();
  const { getElementColor, getElementGradient, getConceptColor } = useUniversalGuardian();

  return {
    ...context,
    elementColor: getElementColor(context.element),
    elementGradient: getElementGradient(context.element),
    conceptColor: getConceptColor(context.concept),
    applyContextStyling: (baseStyles: any = {}) => ({
      ...baseStyles,
      borderLeft: `4px solid ${getElementColor(context.element)}`,
      background: `linear-gradient(135deg,
        ${getElementColor(context.element)}08 0%,
        ${getConceptColor(context.concept)}05 50%,
        transparent 100%)`,
      transition: 'var(--universal-transition-normal)'
    })
  };
};

// ===== 📤 EXPORTACIONES ===== //
export default UniversalIntegrator;
export { ROUTE_MAPPINGS, type RouteMapping };
export type { UniversalIntegratorProps };
