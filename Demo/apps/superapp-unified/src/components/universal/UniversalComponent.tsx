import React, { ReactNode, CSSProperties } from 'react';
import { Box, BoxProps, Typography, TypographyProps, Button, ButtonProps, Chip, ChipProps } from '@mui/material';
import { useUniversalGuardian, CosmicElement, CoomunityConcept } from '../theme/UniversalGuardianSystem';

// ===== 🌟 TIPOS UNIVERSALES MEJORADOS ===== //
interface UniversalStyleProps {
  element?: CosmicElement;
  concept?: CoomunityConcept;
  variant?: 'card' | 'button' | 'chip' | 'container' | 'text' | 'surface' | 'header' | 'section';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  animated?: boolean;
  elevated?: boolean;
  cosmic?: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
}

interface UniversalComponentProps extends BoxProps, UniversalStyleProps {
  children: ReactNode;
  className?: string;
  cosmicEffect?: 'pulse' | 'float' | 'glow' | 'fade-in';
}

// ===== 🎨 HOOK UNIVERSAL DE ESTILOS MEJORADO ===== //
export const useUniversalStyles = (props: UniversalStyleProps) => {
  const guardian = useUniversalGuardian();

  return React.useMemo(() => {
    const {
      getElementColor,
      getElementGradient,
      getConceptColor,
      getEffectStyle,
    } = guardian;

    // Memoize size multipliers to prevent recreation on each render
    const sizeMultipliers = React.useMemo(() => ({
      xs: 0.75,
      sm: 0.875,
      md: 1,
      lg: 1.125,
      xl: 1.25
    }), []);

    // Memoize intensity map
    const intensityMap = React.useMemo(() => ({
      subtle: 0.1,
      medium: 0.2,
      strong: 0.3
    }), []);

    // Extract base styles creation to a separate, memoized function
    const createBaseStyles = () => {
      const {
        element,
        concept,
        variant = 'card',
        size = 'md',
        glow,
        animated,
        elevated,
        cosmic,
        intensity = 'medium'
      } = props;

      // Validate inputs
      if (!['xs', 'sm', 'md', 'lg', 'xl'].includes(size)) {
        console.warn(`Invalid size: ${size}. Defaulting to 'md'.`);
      }

      let styles: CSSProperties = {
        transition: 'var(--universal-transition-normal)',
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        position: 'relative'
      };

      // Variant-specific base styles (simplified for brevity)
      const variantStyles = {
        card: {
          background: 'var(--universal-bg-paper)',
          border: '2px solid rgba(245, 158, 11, 0.1)',
          borderRadius: 'var(--universal-border-radius-xl)',
          boxShadow: 'var(--universal-shadow-lg)',
          padding: 'var(--universal-space-lg)',
          overflow: 'hidden'
        },
        // ... other variant styles
      };

      // Apply base variant styles
      styles = {
        ...styles,
        ...(variantStyles[variant] || variantStyles.card)
      };

      // Element-specific styling
      if (element) {
        try {
          const elementColor = getElementColor(element);
          const elementGradient = getElementGradient(element);
          const alpha = intensityMap[intensity] || 0.2;

          // Element-specific style modifications
          switch (variant) {
            case 'card':
              styles.borderColor = `rgba(${hexToRgb(elementColor)}, ${alpha + 0.1})`;
              break;
            case 'button':
              styles.background = elementGradient;
              break;
          }
        } catch (error) {
          console.warn(`Error applying element styles for ${element}:`, error);
        }
      }

      // Size scaling
      const multiplier = sizeMultipliers[size] || 1;
      if (variant === 'text') {
        styles.fontSize = `${multiplier}rem`;
      }

      return styles;
    };

    // Memoize hover styles to prevent unnecessary recalculations
    const createHoverStyles = () => {
      const { variant = 'card', element } = props;

      const hoverStyleMap = {
        card: {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--universal-shadow-xl), var(--universal-effect-glow)',
          borderColor: element ?
            `rgba(${hexToRgb(getElementColor(element))}, 0.4)` :
            'rgba(245, 158, 11, 0.3)'
        },
        button: {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--universal-shadow-lg), var(--universal-effect-glow)',
          filter: 'brightness(1.05)'
        },
        // Add other variant hover styles
      };

      return hoverStyleMap[variant] || hoverStyleMap.card;
    };

    return {
      getBaseStyles: createBaseStyles,
      getHoverStyles: createHoverStyles
    };
  }, [props, guardian]);
};

// ===== 🌟 COMPONENTE UNIVERSAL PRINCIPAL ===== //
export const UniversalComponent: React.FC<UniversalComponentProps> = ({
  children,
  element,
  concept,
  variant = 'card',
  size = 'md',
  glow = false,
  animated = false,
  elevated = false,
  cosmic = false,
  intensity = 'medium',
  cosmicEffect,
  className = '',
  sx = {},
  ...boxProps
}) => {
  const { getBaseStyles, getHoverStyles } = useUniversalStyles({
    element,
    concept,
    variant,
    size,
    glow,
    animated,
    elevated,
    cosmic,
    intensity
  });

  const { getUniversalClassName, getElementColor } = useUniversalGuardian();

  const baseStyles = getBaseStyles();
  const hoverStyles = getHoverStyles();

  // Generar clases CSS automáticamente
  const universalClassName = getUniversalClassName(variant as any, element, concept);

  // Clases de animación
  let animationClass = '';
  if (cosmicEffect) {
    animationClass = `universal-${cosmicEffect}`;
  } else if (animated) {
    animationClass = 'universal-fade-in';
  }

  const combinedClassName = [
    universalClassName,
    animationClass,
    cosmic ? 'universal-cosmic' : '',
    elevated ? 'universal-elevated' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Box
      className={combinedClassName}
      sx={{
        ...baseStyles,
        '&:hover': hoverStyles,
        ...sx
      }}
      {...boxProps}
    >
      {/* Efecto cósmico de fondo si está habilitado */}
      {cosmic && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: element ?
              `radial-gradient(circle at 20% 20%, ${getElementColor(element)}08 0%, transparent 50%)` :
              `radial-gradient(circle at 20% 20%, var(--universal-fuego-primary)08 0%, transparent 50%)`,
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
      )}

      {/* Contenido */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

// ===== 🎨 COMPONENTES ESPECIALIZADOS POR ELEMENTO ===== //

export const FuegoComponent: React.FC<Omit<UniversalComponentProps, 'element'>> = (props) => (
  <UniversalComponent element="fuego" {...props} />
);

export const AguaComponent: React.FC<Omit<UniversalComponentProps, 'element'>> = (props) => (
  <UniversalComponent element="agua" {...props} />
);

export const TierraComponent: React.FC<Omit<UniversalComponentProps, 'element'>> = (props) => (
  <UniversalComponent element="tierra" {...props} />
);

export const AireComponent: React.FC<Omit<UniversalComponentProps, 'element'>> = (props) => (
  <UniversalComponent element="aire" {...props} />
);

export const EterComponent: React.FC<Omit<UniversalComponentProps, 'element'>> = (props) => (
  <UniversalComponent element="eter" {...props} />
);

// ===== 🎯 COMPONENTES ESPECIALIZADOS POR CONCEPTO ===== //

export const AyniComponent: React.FC<Omit<UniversalComponentProps, 'concept'>> = (props) => (
  <UniversalComponent concept="ayni" {...props} />
);

export const MeritosComponent: React.FC<Omit<UniversalComponentProps, 'concept'>> = (props) => (
  <UniversalComponent concept="meritos" {...props} />
);

export const OndasComponent: React.FC<Omit<UniversalComponentProps, 'concept'>> = (props) => (
  <UniversalComponent concept="ondas" {...props} />
);

export const LukasComponent: React.FC<Omit<UniversalComponentProps, 'concept'>> = (props) => (
  <UniversalComponent concept="lukas" {...props} />
);

export const BienComunComponent: React.FC<Omit<UniversalComponentProps, 'concept'>> = (props) => (
  <UniversalComponent concept="bien-comun" {...props} />
);

// ===== 🏗️ COMPONENTES DE LAYOUT UNIVERSALES ===== //

interface UniversalGridProps extends BoxProps {
  columns?: number | 'auto';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  element?: CosmicElement;
  concept?: CoomunityConcept;
}

export const UniversalGrid: React.FC<UniversalGridProps> = ({
  children,
  columns = 'auto',
  gap = 'lg',
  responsive = true,
  element,
  concept,
  sx = {},
  ...boxProps
}) => {
  const gapMap = {
    xs: 'var(--universal-space-xs)',
    sm: 'var(--universal-space-sm)',
    md: 'var(--universal-space-md)',
    lg: 'var(--universal-space-lg)',
    xl: 'var(--universal-space-xl)'
  };

  const gridColumns = columns === 'auto' ?
    'repeat(auto-fit, minmax(300px, 1fr))' :
    `repeat(${columns}, 1fr)`;

  return (
    <Box
      className="universal-grid"
      sx={{
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gap: gapMap[gap],
        ...(responsive && {
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
            gap: gapMap.md
          }
        }),
        ...sx
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

interface UniversalFlexProps extends BoxProps {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  element?: CosmicElement;
  concept?: CoomunityConcept;
}

export const UniversalFlex: React.FC<UniversalFlexProps> = ({
  children,
  direction = 'row',
  align = 'center',
  justify = 'start',
  gap = 'md',
  wrap = false,
  element,
  concept,
  sx = {},
  ...boxProps
}) => {
  const gapMap = {
    xs: 'var(--universal-space-xs)',
    sm: 'var(--universal-space-sm)',
    md: 'var(--universal-space-md)',
    lg: 'var(--universal-space-lg)',
    xl: 'var(--universal-space-xl)'
  };

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  };

  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around'
  };

  return (
    <Box
      className="universal-flex"
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        gap: gapMap[gap],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...sx
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

// ===== 📝 COMPONENTES DE TEXTO UNIVERSALES ===== //

interface UniversalTextProps extends Omit<TypographyProps, 'variant'> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
  element?: CosmicElement;
  concept?: CoomunityConcept;
  glow?: boolean;
  cosmic?: boolean;
}

export const UniversalText: React.FC<UniversalTextProps> = ({
  children,
  variant = 'body',
  element,
  concept,
  glow = false,
  cosmic = false,
  sx = {},
  ...typographyProps
}) => {
  const { getElementColor, getConceptColor } = useUniversalGuardian();

  const variantMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    body: 'body1',
    small: 'body2',
    caption: 'caption'
  } as const;

  let textColor = 'var(--universal-text-primary)';
  let textShadow = 'none';

  if (element) {
    textColor = getElementColor(element);
  }

  if (concept) {
    textColor = getConceptColor(concept);
  }

  if (glow) {
    textShadow = `0 0 10px ${textColor}40`;
  }

  if (cosmic) {
    textColor = 'var(--universal-gradient-harmony)';
    textShadow = '0 0 15px rgba(168, 85, 247, 0.5)';
  }

  return (
    <Typography
      variant={variantMap[variant]}
      sx={{
        color: textColor,
        textShadow,
        transition: 'var(--universal-transition-normal)',
        ...sx
      }}
      {...typographyProps}
    >
      {children}
    </Typography>
  );
};

// ===== 🔘 COMPONENTES DE BOTÓN UNIVERSALES ===== //

interface UniversalButtonProps extends Omit<ButtonProps, 'size'> {
  element?: CosmicElement;
  concept?: CoomunityConcept;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  cosmic?: boolean;
}

export const UniversalButton: React.FC<UniversalButtonProps> = ({
  children,
  element,
  concept,
  size = 'md',
  glow = false,
  cosmic = false,
  sx = {},
  ...buttonProps
}) => {
  const { getElementGradient, getElementColor } = useUniversalGuardian();

  const sizeMap = {
    xs: { fontSize: '0.7rem', padding: '6px 12px' },
    sm: { fontSize: '0.8rem', padding: '8px 16px' },
    md: { fontSize: '0.875rem', padding: '10px 20px' },
    lg: { fontSize: '1rem', padding: '12px 24px' },
    xl: { fontSize: '1.125rem', padding: '14px 28px' }
  };

  let backgroundStyle = 'var(--universal-fuego-gradient)';
  if (element) {
    backgroundStyle = getElementGradient(element);
  }
  if (cosmic) {
    backgroundStyle = 'var(--universal-gradient-harmony)';
  }

  return (
    <Button
      variant="contained"
      sx={{
        background: backgroundStyle,
        borderRadius: 'var(--universal-border-radius-lg)',
        fontWeight: 700,
        textTransform: 'none',
        boxShadow: 'var(--universal-shadow-md)',
        transition: 'var(--universal-transition-normal)',
        ...sizeMap[size],
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: glow ?
            `var(--universal-shadow-lg), ${element ? `0 0 20px ${getElementColor(element)}40` : 'var(--universal-effect-glow)'}` :
            'var(--universal-shadow-lg)',
          background: backgroundStyle,
          filter: 'brightness(1.05)'
        },
        '&:active': {
          transform: 'translateY(0)'
        },
        ...sx
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

// ===== 🏷️ COMPONENTES DE CHIP UNIVERSALES ===== //

interface UniversalChipProps extends ChipProps {
  element?: CosmicElement;
  concept?: CoomunityConcept;
  glow?: boolean;
  cosmic?: boolean;
}

export const UniversalChip: React.FC<UniversalChipProps> = ({
  label,
  element,
  concept,
  glow = false,
  cosmic = false,
  sx = {},
  ...chipProps
}) => {
  const { getElementColor, getConceptColor } = useUniversalGuardian();

  let chipColor = 'var(--universal-fuego-primary)';
  if (element) {
    chipColor = getElementColor(element);
  }
  if (concept) {
    chipColor = getConceptColor(concept);
  }

  let backgroundStyle = `rgba(${hexToRgb(chipColor)}, 0.1)`;
  let borderStyle = `1px solid rgba(${hexToRgb(chipColor)}, 0.2)`;

  if (cosmic) {
    backgroundStyle = 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(168, 85, 247, 0.1))';
    borderStyle = '1px solid rgba(168, 85, 247, 0.3)';
    chipColor = 'var(--universal-aire-primary)';
  }

  return (
    <Chip
      label={label}
      sx={{
        background: backgroundStyle,
        border: borderStyle,
        color: chipColor,
        borderRadius: 'var(--universal-border-radius-md)',
        fontWeight: 600,
        fontSize: '0.75rem',
        transition: 'var(--universal-transition-normal)',
        '&:hover': {
          transform: 'translateY(-1px)',
          background: cosmic ?
            'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.2))' :
            `rgba(${hexToRgb(chipColor)}, 0.2)`,
          boxShadow: glow ? `0 0 10px ${chipColor}30` : 'var(--universal-shadow-sm)'
        },
        ...sx
      }}
      {...chipProps}
    />
  );
};

// ===== 🛠️ UTILIDADES AUXILIARES ===== //
const hexToRgb = (hex: string): string => {
  // Robust hex color validation
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const result = hexRegex.exec(hex);

  if (!result) {
    console.warn(`Invalid hex color: ${hex}. Defaulting to black.`);
    return '0, 0, 0';
  }

  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// ===== 📤 EXPORTACIONES ===== //
export { useUniversalGuardian } from '../theme/UniversalGuardianSystem';
export type { CosmicElement, CoomunityConcept };
