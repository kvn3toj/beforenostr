/**
 * 🌸 ARIA BUTTON - BOTÓN OFICIAL COOMUNITY
 * ===============================================================================
 * Componente Button que embodies los principios de ARIA y usa colores oficiales
 * "Yo soy la armonía visible que deleita al alma"
 * ===============================================================================
 */

import React, { forwardRef } from 'react';
import {
  Button,
  ButtonProps,
  alpha
} from '@mui/material';
import { motion, MotionProps } from 'framer-motion';
import {
  COOMUNITY_BRAND_COLORS,
  BRAND_ELEMENT_MAPPING,
  BRAND_GRADIENTS,
  getBrandColor
} from '../../design-system/coomunity-brand-colors';

// 🌟 Tipos del Aria Button
type AriaVariant = 'primary' | 'secondary' | 'element' | 'consciousness' | 'ghost';
type ElementType = 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
type ConsciousnessType = 'elevation' | 'harmony' | 'growth' | 'community' | 'wisdom';

interface AriaButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  variant?: AriaVariant;
  element?: ElementType;
  consciousness?: ConsciousnessType;
  glowing?: boolean;
  reciprocidadAnimated?: boolean;
}



// 🌸 Componente principal
export const AriaButton = forwardRef<HTMLButtonElement, AriaButtonProps>(
  ({
    children,
    variant = 'primary',
    element,
    consciousness,
    glowing = false,
    reciprocidadAnimated = false,
    disabled = false,
    onClick,
    ...props
  }, ref) => {

    // ✨ Configuración de animaciones ARIA
    const ariaAnimations: MotionProps = {
      initial: reciprocidadAnimated ? { scale: 0.95, opacity: 0.8 } : { scale: 1 },
      animate: { scale: 1, opacity: 1 },
      whileHover: !disabled ? {
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      } : {},
      whileTap: !disabled ? {
        scale: 0.98,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      } : {},
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    };

    // 🎨 Obtener estilos para el botón
    const getButtonColors = () => {
      switch (variant) {
        case 'primary':
          return {
            background: BRAND_GRADIENTS.primary,
            color: COOMUNITY_BRAND_COLORS.black,
            hover: alpha(COOMUNITY_BRAND_COLORS.gold, 0.9),
          };
        case 'secondary':
          return {
            background: BRAND_GRADIENTS.secondary,
            color: COOMUNITY_BRAND_COLORS.white,
            hover: alpha(COOMUNITY_BRAND_COLORS.blue, 0.9),
          };
        case 'element': {
          if (!element) element = 'eter';
          const elementColors = BRAND_ELEMENT_MAPPING[element];
          return {
            background: elementColors.gradient,
            color: COOMUNITY_BRAND_COLORS.white,
            hover: alpha(elementColors.primary, 0.9),
          };
        }
        case 'consciousness': {
          const consciousnessColor = consciousness ?
            COOMUNITY_BRAND_COLORS[consciousness === 'elevation' ? 'purple' :
                                     consciousness === 'harmony' ? 'green' :
                                     consciousness === 'growth' ? 'blue' :
                                     consciousness === 'community' ? 'gold' :
                                     'deepPurple'] :
            COOMUNITY_BRAND_COLORS.purple;
          return {
            background: `linear-gradient(135deg, ${consciousnessColor} 0%, ${alpha(consciousnessColor, 0.8)} 100%)`,
            color: COOMUNITY_BRAND_COLORS.white,
            hover: alpha(consciousnessColor, 0.9),
          };
        }
        case 'ghost':
          return {
            background: 'transparent',
            color: COOMUNITY_BRAND_COLORS.gold,
            hover: alpha(COOMUNITY_BRAND_COLORS.gold, 0.1),
            border: `1px solid ${COOMUNITY_BRAND_COLORS.gold}`,
          };
        default:
          return {
            background: BRAND_GRADIENTS.primary,
            color: COOMUNITY_BRAND_COLORS.black,
            hover: alpha(COOMUNITY_BRAND_COLORS.gold, 0.9),
          };
      }
    };

    const colors = getButtonColors();

    return (
      <motion.div {...ariaAnimations}>
        <Button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          sx={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: colors.border || 'none',
            background: colors.background,
            color: colors.color,
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'none',
            letterSpacing: '0.5px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': !disabled ? {
              background: colors.hover,
              transform: 'translateY(-1px)',
              boxShadow: `0 8px 25px ${alpha(colors.hover, 0.3)}`,
            } : {},
            ...(glowing && !disabled && {
              boxShadow: `0 0 20px ${alpha(colors.color === COOMUNITY_BRAND_COLORS.white ? colors.background : colors.color, 0.6)}`,
            }),
            ...(disabled && {
              opacity: 0.5,
              background: alpha(COOMUNITY_BRAND_COLORS.black, 0.1),
              color: alpha(COOMUNITY_BRAND_COLORS.black, 0.4),
            }),
          }}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AriaButton.displayName = 'AriaButton';

// 🌟 Exportaciones específicas para diferentes usos
export const PrimaryButton = (props: Omit<AriaButtonProps, 'variant'>) => (
  <AriaButton variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<AriaButtonProps, 'variant'>) => (
  <AriaButton variant="secondary" {...props} />
);

export const ElementButton = (props: Omit<AriaButtonProps, 'variant'> & { element: ElementType }) => (
  <AriaButton variant="element" {...props} />
);

export const ConsciousnessButton = (props: Omit<AriaButtonProps, 'variant'> & { consciousness: ConsciousnessType }) => (
  <AriaButton variant="consciousness" {...props} />
);

export const GhostButton = (props: Omit<AriaButtonProps, 'variant'>) => (
  <AriaButton variant="ghost" {...props} />
);

export default AriaButton;
