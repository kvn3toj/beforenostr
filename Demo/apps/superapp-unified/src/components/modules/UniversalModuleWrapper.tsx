import React, { ReactNode } from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';
import {
  PlayArrow, Store, People, Analytics, AccountBalance,
  LocalFireDepartment, Waves, Park, Air, AllInclusive
} from '@mui/icons-material';
import {
  UniversalComponent,
  UniversalFlex,
  UniversalText,
  useUniversalGuardian,
  CosmicElement,
  CoomunityConcept
} from '../theme/UniversalComponent';

// ===== 🌌 CONFIGURACIÓN DE MÓDULOS UNIVERSALES ===== //
interface ModuleConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  element: CosmicElement;
  concept: CoomunityConcept;
  icon: React.ComponentType;
  philosophy: string;
  energyDescription: string;
  color: string;
  gradient: string;
}

const UNIVERSAL_MODULE_CONFIGS: Record<string, ModuleConfig> = {
  uplay: {
    id: 'uplay',
    name: 'ÜPlay',
    subtitle: 'GPL - Gamified Play List',
    description: 'Centro de aprendizaje gamificado con videos interactivos y progreso personalizado',
    element: 'aire',
    concept: 'ondas',
    icon: PlayArrow,
    philosophy: 'El elemento Aire representa la comunicación de ideas, la sabiduría compartida y la transformación a través del conocimiento. En ÜPlay, cada video es una ráfaga de inspiración que eleva la consciencia.',
    energyDescription: 'Energía de transformación intelectual y expansión de consciencia',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)'
  },
  marketplace: {
    id: 'marketplace',
    name: 'Marketplace',
    subtitle: 'GMP - Gamified Match Place',
    description: 'Intercambio de productos y servicios basado en principios de Reciprocidad y Bien Común',
    element: 'tierra',
    concept: 'lukas',
    icon: Store,
    philosophy: 'El elemento Tierra simboliza la estabilidad, el crecimiento sostenible y la abundancia compartida. En el Marketplace, cada intercambio fortalece las raíces de la comunidad.',
    energyDescription: 'Energía de abundancia sostenible y crecimiento comunitario',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
  },
  social: {
    id: 'social',
    name: 'Social',
    subtitle: 'Red de Bien Común',
    description: 'Conexiones auténticas, colaboración y construcción de comunidades basadas en valores',
    element: 'agua',
    concept: 'reciprocidad',
    icon: People,
    philosophy: 'El elemento Agua fluye y conecta, adaptándose y nutriendo todo a su paso. En el módulo Social, las relaciones fluyen naturalmente hacia el equilibrio y la reciprocidad.',
    energyDescription: 'Energía de fluidez emocional y conexión empática',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
  },
  ustats: {
    id: 'ustats',
    name: 'UStats',
    subtitle: 'Centro de Métricas y Progreso',
    description: 'Estadísticas, analytics y dashboard de progreso personal y comunitario',
    element: 'fuego',
    concept: 'meritos',
    icon: Analytics,
    philosophy: 'El elemento Fuego representa la pasión, la energía vital y la iluminación. En UStats, cada métrica es una chispa que revela el camino hacia la excelencia personal.',
    energyDescription: 'Energía de pasión transformadora y iluminación personal',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
  },
  wallet: {
    id: 'wallet',
    name: 'Wallet',
    subtitle: 'Centro Financiero Universal',
    description: 'Gestión de Lükas, tokens y recursos financieros de la comunidad',
    element: 'eter',
    concept: 'bien-comun',
    icon: AccountBalance,
    philosophy: 'El elemento Éter trasciende lo material y conecta con la consciencia universal. En Wallet, cada transacción refleja la unidad y el bien común por encima del beneficio individual.',
    energyDescription: 'Energía de trascendencia y consciencia universal',
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
  }
};

// ===== 🎯 INTERFAZ DEL WRAPPER UNIVERSAL ===== //
interface UniversalModuleWrapperProps {
  moduleId: string;
  children: ReactNode;
  element?: CosmicElement;
  concept?: CoomunityConcept;
  showHeader?: boolean;
  showPhilosophy?: boolean;
  showElementIndicator?: boolean;
  customTitle?: string;
  customSubtitle?: string;
  headerActions?: ReactNode;
  className?: string;
}

// ===== 🌟 COMPONENTE WRAPPER UNIVERSAL ===== //
export const UniversalModuleWrapper: React.FC<UniversalModuleWrapperProps> = ({
  moduleId,
  children,
  element: overrideElement,
  concept: overrideConcept,
  showHeader = true,
  showPhilosophy = false,
  showElementIndicator = true,
  customTitle,
  customSubtitle,
  headerActions,
  className = ''
}) => {
  const { getElementColor, getElementGradient, getConceptColor } = useUniversalGuardian();

  const config = UNIVERSAL_MODULE_CONFIGS[moduleId];
  if (!config) {
    console.warn(`Module configuration not found for: ${moduleId}`);
    return <>{children}</>;
  }

  const element = overrideElement || config.element;
  const concept = overrideConcept || config.concept;
  const IconComponent = config.icon;

  const elementColor = getElementColor(element);
  const elementGradient = getElementGradient(element);
  const conceptColor = getConceptColor(concept);

  return (
    <UniversalComponent
      variant="container"
      element={element}
      concept={concept}
      className={`universal-module-wrapper universal-module-${moduleId} ${className}`}
      sx={{
        background: `var(--universal-bg-default)`,
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${elementColor}08 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${conceptColor}08 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: -1
        }
      }}
    >
      {/* Header Universal del Módulo */}
      {showHeader && (
        <UniversalComponent
          variant="card"
          element={element}
          sx={{
            borderRadius: '0 0 24px 24px',
            marginBottom: 3,
            background: `linear-gradient(135deg, ${elementColor}10, ${conceptColor}10)`,
            backdropFilter: 'blur(10px)',
            border: `2px solid ${elementColor}30`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Indicador de Elemento */}
          {showElementIndicator && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: elementGradient,
                borderRadius: '24px 24px 0 0'
              }}
            />
          )}

          <Container maxWidth="xl" sx={{ py: 3 }}>
            <UniversalFlex justify="between" align="center" gap="lg">
              {/* Información del Módulo */}
              <UniversalFlex align="center" gap="lg">
                {/* Icono del Módulo */}
                <UniversalComponent
                  variant="card"
                  element={element}
                  sx={{
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: elementGradient,
                    boxShadow: `0 8px 32px ${elementColor}30`,
                    border: `2px solid ${elementColor}50`
                  }}
                >
                  <IconComponent sx={{ fontSize: 32, color: 'white' }} />
                </UniversalComponent>

                {/* Títulos */}
                <Box>
                  <UniversalText
                    variant="h2"
                    element={element}
                    sx={{
                      fontWeight: 800,
                      marginBottom: 0.5,
                      background: elementGradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: 'none'
                    }}
                  >
                    {customTitle || config.name}
                  </UniversalText>

                  <UniversalText
                    variant="body"
                    concept={concept}
                    sx={{
                      fontWeight: 600,
                      opacity: 0.8,
                      marginBottom: 0
                    }}
                  >
                    {customSubtitle || config.subtitle}
                  </UniversalText>

                  <UniversalText
                    variant="small"
                    sx={{
                      opacity: 0.7,
                      marginTop: 0.5,
                      marginBottom: 0
                    }}
                  >
                    {config.description}
                  </UniversalText>
                </Box>
              </UniversalFlex>

              {/* Acciones del Header */}
              {headerActions && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {headerActions}
                </Box>
              )}
            </UniversalFlex>

            {/* Filosofía del Elemento (Opcional) */}
            {showPhilosophy && (
              <>
                <Divider sx={{ my: 3, borderColor: `${elementColor}30` }} />

                <UniversalComponent
                  variant="card"
                  element={element}
                  sx={{
                    background: `linear-gradient(135deg, ${elementColor}05, ${conceptColor}05)`,
                    border: `1px solid ${elementColor}20`,
                    padding: 3
                  }}
                >
                  <UniversalFlex align="start" gap="md">
                    {/* Icono del Elemento */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: elementGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {getElementIcon(element)}
                    </Box>

                    {/* Texto Filosófico */}
                    <Box>
                      <UniversalText
                        variant="h3"
                        element={element}
                        sx={{ marginBottom: 1 }}
                      >
                        Energía {getElementName(element)}
                      </UniversalText>

                      <UniversalText
                        variant="small"
                        sx={{
                          fontStyle: 'italic',
                          opacity: 0.8,
                          marginBottom: 2
                        }}
                      >
                        {config.energyDescription}
                      </UniversalText>

                      <UniversalText
                        variant="body"
                        sx={{
                          lineHeight: 1.7,
                          marginBottom: 0
                        }}
                      >
                        {config.philosophy}
                      </UniversalText>
                    </Box>
                  </UniversalFlex>
                </UniversalComponent>
              </>
            )}
          </Container>
        </UniversalComponent>
      )}

      {/* Contenido del Módulo */}
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <UniversalComponent
          variant="container"
          element={element}
          concept={concept}
          sx={{
            background: 'transparent',
            minHeight: 'auto'
          }}
        >
          {children}
        </UniversalComponent>
      </Container>

      {/* Footer Universal (Opcional) */}
      <Box
        sx={{
          mt: 'auto',
          py: 2,
          background: `linear-gradient(135deg, ${elementColor}05, transparent)`,
          borderTop: `1px solid ${elementColor}20`
        }}
      >
        <Container maxWidth="xl">
          <UniversalFlex justify="center" align="center" gap="sm">
            <UniversalText
              variant="small"
              sx={{
                opacity: 0.6,
                textAlign: 'center',
                marginBottom: 0
              }}
            >
              Potenciado por la energía {getElementName(element)} • CoomÜnity Universal
            </UniversalText>
          </UniversalFlex>
        </Container>
      </Box>
    </UniversalComponent>
  );
};

// ===== 🌟 WRAPPERS ESPECIALIZADOS POR MÓDULO ===== //

// Wrapper UPlay
export const UPlayModuleWrapper: React.FC<Omit<UniversalModuleWrapperProps, 'moduleId' | 'element'>> = (props) => (
  <UniversalModuleWrapper moduleId="uplay" element="aire" {...props} />
);

// Wrapper Marketplace
export const MarketplaceModuleWrapper: React.FC<Omit<UniversalModuleWrapperProps, 'moduleId' | 'element'>> = (props) => (
  <UniversalModuleWrapper moduleId="marketplace" element="tierra" {...props} />
);

// Wrapper Social
export const SocialModuleWrapper: React.FC<Omit<UniversalModuleWrapperProps, 'moduleId' | 'element'>> = (props) => (
  <UniversalModuleWrapper moduleId="social" element="agua" {...props} />
);

// Wrapper UStats
export const UStatsModuleWrapper: React.FC<Omit<UniversalModuleWrapperProps, 'moduleId' | 'element'>> = (props) => (
  <UniversalModuleWrapper moduleId="ustats" element="fuego" {...props} />
);

// Wrapper Wallet
export const WalletModuleWrapper: React.FC<Omit<UniversalModuleWrapperProps, 'moduleId' | 'element'>> = (props) => (
  <UniversalModuleWrapper moduleId="wallet" element="eter" {...props} />
);

// ===== 🛠️ UTILIDADES ===== //

const getElementIcon = (element: CosmicElement) => {
  const iconMap = {
    fuego: <LocalFireDepartment sx={{ fontSize: 24, color: 'white' }} />,
    agua: <Waves sx={{ fontSize: 24, color: 'white' }} />,
    tierra: <Park sx={{ fontSize: 24, color: 'white' }} />,
    aire: <Air sx={{ fontSize: 24, color: 'white' }} />,
    eter: <AllInclusive sx={{ fontSize: 24, color: 'white' }} />
  };
  return iconMap[element];
};

const getElementName = (element: CosmicElement): string => {
  const nameMap = {
    fuego: 'Fuego',
    agua: 'Agua',
    tierra: 'Tierra',
    aire: 'Aire',
    eter: 'Éter'
  };
  return nameMap[element];
};

// ===== 🎯 HOOK PARA CONFIGURACIÓN DE MÓDULOS ===== //
export const useModuleConfig = (moduleId: string) => {
  return UNIVERSAL_MODULE_CONFIGS[moduleId] || null;
};

// ===== 🚀 EXPORTACIONES ===== //
export default UniversalModuleWrapper;

export {
  UNIVERSAL_MODULE_CONFIGS,
  UPlayModuleWrapper,
  MarketplaceModuleWrapper,
  SocialModuleWrapper,
  UStatsModuleWrapper,
  WalletModuleWrapper,
  useModuleConfig
};
