import React, { ReactNode, CSSProperties } from 'react';
import { Card, CardContent, CardActions, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { revolutionaryPattern, cosmicCardPattern, animationPatterns, elementalPatterns } from '../../patterns';
import { homeGradients, homeElementalGradients, applyHomeGradient, applyElementalHomeGradient } from '../../styles/gradients/cosmic-home';
import { ElementType } from '../../types';

/**
 * 🌌 COSMIC CARD - DESIGN SYSTEM COMPONENT
 * =======================================
 * 
 * Componente revolucionario que encapsula todos los patrones cósmicos
 * extraídos del Dashboard HOME de CoomÜnity SuperApp.
 * 
 * Incluye:
 * - Glassmorphism avanzado
 * - Efectos 3D y orbitales
 * - Gradientes elementales
 * - Animaciones cósmicas
 * - Partículas flotantes
 * - Responsividad completa
 */

export interface CosmicCardProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'elevated';
  element?: ElementType;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  enableAnimations?: boolean;
  enableParticles?: boolean;
  enableGlow?: boolean;
  enableOrbitalEffects?: boolean;
  cosmicIntensity?: 'subtle' | 'medium' | 'intense';
  onClick?: () => void;
  sx?: CSSProperties;
  className?: string;
}

export const CosmicCard: React.FC<CosmicCardProps> = ({
  children,
  variant = 'primary',
  element,
  title,
  subtitle,
  actions,
  enableAnimations = true,
  enableParticles = false,
  enableGlow = true,
  enableOrbitalEffects = false,
  cosmicIntensity = 'medium',
  onClick,
  sx,
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // 🎨 Generar estilos base revolucionarios - CORREGIDO: Ahora son funciones
  const basePattern = revolutionaryPattern(theme);
  const cosmicPattern = cosmicCardPattern(theme, variant, cosmicIntensity);

  // 🌟 Aplicar gradientes elementales si se especifica elemento
  const elementalStyles = element ? applyElementalHomeGradient(element) : {};

  // ✨ Configurar animaciones según la intensidad
  const animationStyle = enableAnimations ? {
    animation: cosmicIntensity === 'intense' 
      ? `${animationPatterns.cosmicPulse} 3s ease-in-out infinite`
      : cosmicIntensity === 'medium'
      ? `${animationPatterns.gentleFloat} 4s ease-in-out infinite`
      : 'none'
  } : {};

  // 🔮 Estilos de efectos orbitales
  const orbitalStyles = enableOrbitalEffects ? {
    position: 'relative' as const,
    overflow: 'visible' as const,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-10px',
      left: '-10px',
      right: '-10px',
      bottom: '-10px',
      background: 'radial-gradient(circle, rgba(255,183,77,0.3) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: `${animationPatterns.orbitalRotation} 8s linear infinite`,
      zIndex: -1,
      opacity: 0.6
    }
  } : {};

  // 💫 Estilos de resplandor cósmico
  const glowStyles = enableGlow ? {
    boxShadow: `
      ${basePattern.boxShadow},
      0 0 30px rgba(255,183,77,0.2),
      inset 0 0 20px rgba(255,254,251,0.1)
    `
  } : {
    boxShadow: basePattern.boxShadow
  };

  // 📱 Ajustes responsivos
  const responsiveStyles = {
    padding: isMobile ? theme.spacing(2) : isTablet ? theme.spacing(3) : theme.spacing(4),
    borderRadius: isMobile ? 16 : 24,
    backdropFilter: isMobile ? 'blur(8px)' : 'blur(12px)'
  };

  // 🎭 Estilos finales combinados
  const finalStyles: CSSProperties = {
    ...basePattern,
    ...cosmicPattern,
    ...elementalStyles,
    ...animationStyle,
    ...orbitalStyles,
    ...glowStyles,
    ...responsiveStyles,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transformStyle: 'preserve-3d',
    
    // Estados interactivos
    '&:hover': onClick ? {
      transform: 'perspective(1000px) rotateX(2deg) rotateY(2deg) translateY(-4px)',
      boxShadow: `
        ${basePattern.boxShadow},
        0 8px 32px rgba(255,183,77,0.3),
        0 0 40px rgba(255,152,0,0.2)
      `,
      backdropFilter: 'blur(16px) saturate(1.2)'
    } : undefined,

    '&:active': onClick ? {
      transform: 'perspective(1000px) rotateX(1deg) rotateY(1deg) translateY(-2px)',
      transition: 'all 0.1s ease-out'
    } : undefined,

    ...sx
  };

  return (
    <>
      {/* 🌟 Partículas flotantes de fondo */}
      {enableParticles && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: -2,
            overflow: 'hidden',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'radial-gradient(circle, rgba(255,183,77,0.8) 0%, transparent 100%)',
              borderRadius: '50%',
              animation: `${animationPatterns.gentleFloat} 6s ease-in-out infinite`
            },
            '&::before': {
              top: '20%',
              left: '10%',
              animationDelay: '0s'
            },
            '&::after': {
              top: '60%',
              right: '15%',
              animationDelay: '3s'
            }
          }}
        />
      )}

      {/* 🎴 Tarjeta principal */}
      <Card
        onClick={onClick}
        className={className}
        sx={finalStyles}
        elevation={0}
      >
        {/* 📝 Header opcional con título y subtítulo */}
        {(title || subtitle) && (
          <Box
            sx={{
              p: isMobile ? 2 : 3,
              pb: 1,
              background: 'linear-gradient(135deg, rgba(255,254,251,0.9) 0%, rgba(255,248,220,0.5) 100%)',
              borderRadius: `${isMobile ? 16 : 24}px ${isMobile ? 16 : 24}px 0 0`,
              backdropFilter: 'blur(8px)'
            }}
          >
            {title && (
              <Typography
                variant={isMobile ? "h6" : "h5"}
                component="h2"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(145deg, #8B4513 0%, #CD853F  50%, #DEB887 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(139,69,19,0.1)',
                  mb: subtitle ? 0.5 : 0
                }}
              >
                {title}
              </Typography>
            )}
            
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(139,69,19,0.7)',
                  fontWeight: 400,
                  letterSpacing: '0.025em'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* 📋 Contenido principal */}
        <CardContent
          sx={{
            p: isMobile ? 2 : 3,
            pt: (title || subtitle) ? 2 : 3,
            '&:last-child': {
              pb: actions ? 2 : 3
            }
          }}
        >
          {children}
        </CardContent>

        {/* 🎬 Acciones opcionales */}
        {actions && (
          <CardActions
            sx={{
              p: isMobile ? 2 : 3,
              pt: 1,
              background: 'linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,228,181,0.2) 100%)',
              borderRadius: `0 0 ${isMobile ? 16 : 24}px ${isMobile ? 16 : 24}px`,
              backdropFilter: 'blur(6px)'
            }}
          >
            {actions}
          </CardActions>
        )}
      </Card>
    </>
  );
};

// 🌈 Componentes de conveniencia pre-configurados
export const CosmicCardPrimary: React.FC<Omit<CosmicCardProps, 'variant'>> = (props) => (
  <CosmicCard {...props} variant="primary" />
);

export const CosmicCardSecondary: React.FC<Omit<CosmicCardProps, 'variant'>> = (props) => (
  <CosmicCard {...props} variant="secondary" />
);

export const CosmicCardAccent: React.FC<Omit<CosmicCardProps, 'variant'>> = (props) => (
  <CosmicCard {...props} variant="accent" />
);

export const CosmicCardElevated: React.FC<Omit<CosmicCardProps, 'variant'>> = (props) => (
  <CosmicCard {...props} variant="elevated" enableGlow enableAnimations />
);

// 🔥 Componentes elementales específicos
export const CosmicCardFuego: React.FC<Omit<CosmicCardProps, 'element'>> = (props) => (
  <CosmicCard {...props} element="fuego" enableGlow enableAnimations />
);

export const CosmicCardAgua: React.FC<Omit<CosmicCardProps, 'element'>> = (props) => (
  <CosmicCard {...props} element="agua" enableGlow enableAnimations />
);

export const CosmicCardTierra: React.FC<Omit<CosmicCardProps, 'element'>> = (props) => (
  <CosmicCard {...props} element="tierra" enableGlow enableAnimations />
);

export const CosmicCardAire: React.FC<Omit<CosmicCardProps, 'element'>> = (props) => (
  <CosmicCard {...props} element="aire" enableGlow enableAnimations />
);

export const CosmicCardEspiritu: React.FC<Omit<CosmicCardProps, 'element'>> = (props) => (
  <CosmicCard {...props} element="espiritu" enableGlow enableAnimations enableOrbitalEffects />
);

export default CosmicCard; 