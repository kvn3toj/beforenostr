/**
 * 🌸 CONCILIO CARD - ARIA + ZENO
 * ===============================================================================
 * Componente Card unificado que combina la estética de ARIA con los flujos de ZENO
 * Reemplaza todos los Card components existentes con una experiencia consciente
 * ===============================================================================
 */

import React, { useState } from 'react';
import { Card, CardProps, Box, CardContent, CardActions, useTheme, alpha } from '@mui/material';
import { motion, MotionProps } from 'framer-motion';
import {
  getConcilioTheme,
  ConcilioTheme,
  CONCILIO_TRANSITIONS,
  CONCILIO_SHADOWS
} from '../../design-system/unified-theme-system';

// 🌟 Tipos del Concilio
interface ConcilioCardProps extends Omit<CardProps, 'elevation'> {
  // Configuración estética (ARIA)
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass' | 'cosmic';
  elementTheme?: ConcilioTheme;
  glowEffect?: boolean;
  consciousnessLevel?: 'base' | 'elevated' | 'transcendent';

  // Configuración de flujo (ZENO)
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'rotate' | 'organic' | 'none';
  transitionType?: keyof typeof CONCILIO_TRANSITIONS;
  interactive?: boolean;
  floatingHeader?: boolean;

  // Contenido especial
  headerGradient?: boolean;
  elementsBorder?: boolean;
  ayniIndicator?: boolean;

  // Props de motion (para animaciones fluidas)
  motionProps?: MotionProps;
}

// 🎨 ARIA: Estilos estéticos conscientes
const getVariantStyles = (
  variant: ConcilioCardProps['variant'],
  theme: any,
  concilioTheme: ConcilioTheme
) => {
  const themeData = getConcilioTheme(concilioTheme);

  const variants = {
    elevated: {
      background: themeData.surfaces.elevated,
      boxShadow: CONCILIO_SHADOWS.elevated,
      border: 'none',
    },
    outlined: {
      background: themeData.surfaces.paper,
      boxShadow: CONCILIO_SHADOWS.subtle,
      border: `2px solid ${alpha(themeData.primary.main, 0.2)}`,
    },
    filled: {
      background: alpha(themeData.primary.main, 0.05),
      boxShadow: CONCILIO_SHADOWS.soft,
      border: `1px solid ${alpha(themeData.primary.main, 0.1)}`,
    },
    glass: {
      background: alpha(themeData.surfaces.paper, 0.8),
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(themeData.primary.main, 0.2)}`,
      boxShadow: CONCILIO_SHADOWS.medium,
    },
    cosmic: {
      background: `linear-gradient(135deg, ${alpha(themeData.primary.main, 0.1)} 0%, ${alpha(themeData.secondary.main, 0.05)} 100%)`,
      border: `1px solid ${alpha(themeData.primary.main, 0.3)}`,
      boxShadow: CONCILIO_SHADOWS.cosmic,
    },
  };

  return variants[variant || 'elevated'];
};

// 🌊 ZENO: Efectos de interacción orgánicos
const getHoverAnimation = (hoverEffect: ConcilioCardProps['hoverEffect']) => {
  const effects = {
    lift: {
      y: -8,
      scale: 1.02,
    },
    glow: {
      scale: 1.01,
      filter: 'brightness(1.05)',
    },
    scale: {
      scale: 1.05,
    },
    rotate: {
      scale: 1.02,
      rotateY: 2,
    },
    organic: {
      y: -6,
      scale: 1.01,
      rotateX: 2,
      rotateY: 1,
    },
    none: {},
  };

  return effects[hoverEffect || 'lift'];
};

export const ConcilioCard: React.FC<ConcilioCardProps> = ({
  children,
  variant = 'elevated',
  elementTheme = 'guardian-harmony',
  glowEffect = false,
  consciousnessLevel = 'base',
  hoverEffect = 'lift',
  transitionType = 'normal',
  interactive = true,
  floatingHeader = false,
  headerGradient = false,
  elementsBorder = false,
  ayniIndicator = false,
  motionProps = {},
  sx = {},
  ...cardProps
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const themeData = getConcilioTheme(elementTheme);
  const variantStyles = getVariantStyles(variant, theme, elementTheme);

  // 🌟 Estilos conscientes combinados
  const cardStyles = {
    ...variantStyles,
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    transition: `all ${CONCILIO_TRANSITIONS[transitionType]}`,
    cursor: interactive ? 'pointer' : 'default',

    // Efecto de consciencia
    ...(consciousnessLevel === 'elevated' && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: themeData.primary.gradient,
        opacity: 0.8,
      },
    }),

    ...(consciousnessLevel === 'transcendent' && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg,
          ${themeData.elements.fuego.primary} 0%,
          ${themeData.elements.agua.primary} 25%,
          ${themeData.elements.tierra.primary} 50%,
          ${themeData.elements.aire.primary} 75%,
          ${themeData.elements.eter.primary} 100%)`,
      },
    }),

    // Indicador Ayni
    ...(ayniIndicator && {
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: themeData.consciousness.harmony,
        boxShadow: `0 0 12px ${alpha(themeData.consciousness.harmony, 0.5)}`,
      },
    }),

    // Borde de elementos
    ...(elementsBorder && {
      border: `2px solid transparent`,
      background: `linear-gradient(${variantStyles.background}, ${variantStyles.background}) padding-box,
                   linear-gradient(135deg,
                     ${themeData.elements.fuego.primary},
                     ${themeData.elements.agua.primary},
                     ${themeData.elements.tierra.primary},
                     ${themeData.elements.aire.primary}) border-box`,
    }),

    // Efecto glow
    ...(glowEffect && {
      boxShadow: `${variantStyles.boxShadow}, 0 0 30px ${alpha(themeData.primary.main, 0.3)}`,
    }),

    ...sx,
  };

  // 🎭 Props de animación de Framer Motion
  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: interactive ? getHoverAnimation(hoverEffect) : undefined,
    whileFocus: interactive ? { scale: 1.01 } : undefined,
    whileTap: interactive ? { scale: 0.98 } : undefined,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
    ...motionProps,
  };

  return (
    <motion.div
      {...animationProps}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocusStart={() => setIsFocused(true)}
      onFocusEnd={() => setIsFocused(false)}
    >
      <Card
        {...cardProps}
        sx={cardStyles}
        elevation={0} // Manejamos las sombras manualmente
      >
        {/* Header flotante opcional */}
        {floatingHeader && (
          <Box
            sx={{
              position: 'absolute',
              top: '-8px',
              left: '16px',
              right: '16px',
              height: '4px',
              borderRadius: '2px',
              background: headerGradient
                ? themeData.primary.gradient
                : themeData.primary.main,
              zIndex: 1,
            }}
          />
        )}

        {children}
      </Card>
    </motion.div>
  );
};

// 🌸 Variantes especializadas para módulos específicos

export const UPlayCard: React.FC<ConcilioCardProps> = (props) => (
  <ConcilioCard
    elementTheme="cosmic-transcendence"
    variant="cosmic"
    hoverEffect="organic"
    consciousnessLevel="elevated"
    glowEffect
    {...props}
  />
);

export const MarketplaceCard: React.FC<ConcilioCardProps> = (props) => (
  <ConcilioCard
    elementTheme="autumn-serenity"
    variant="filled"
    hoverEffect="lift"
    consciousnessLevel="base"
    ayniIndicator
    {...props}
  />
);

export const SocialCard: React.FC<ConcilioCardProps> = (props) => (
  <ConcilioCard
    elementTheme="bien-comun"
    variant="outlined"
    hoverEffect="glow"
    consciousnessLevel="elevated"
    floatingHeader
    {...props}
  />
);

export const ConsciousnessCard: React.FC<ConcilioCardProps> = (props) => (
  <ConcilioCard
    elementTheme="cosmic-transcendence"
    variant="cosmic"
    hoverEffect="organic"
    consciousnessLevel="transcendent"
    elementsBorder
    glowEffect
    {...props}
  />
);

export const ProfileCard: React.FC<ConcilioCardProps> = (props) => (
  <ConcilioCard
    elementTheme="ayni-balance"
    variant="glass"
    hoverEffect="scale"
    consciousnessLevel="elevated"
    ayniIndicator
    {...props}
  />
);

export default ConcilioCard;
