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
  const {
    getElementColor,
    getElementGradient,
    getConceptColor,
    getEffectStyle,
    getUniversalClassName,
    applyUniversalStyles
  } = useUniversalGuardian();

  const getBaseStyles = (): CSSProperties => {
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

    let styles: CSSProperties = {
      transition: 'var(--universal-transition-normal)',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      position: 'relative'
    };

    // Aplicar estilos base por variante
    switch (variant) {
      case 'card':
        styles = {
          ...styles,
          background: 'var(--universal-bg-paper)',
          border: '2px solid rgba(245, 158, 11, 0.1)',
          borderRadius: 'var(--universal-border-radius-xl)',
          boxShadow: 'var(--universal-shadow-lg)',
          padding: 'var(--universal-space-lg)',
          overflow: 'hidden'
        };
        break;

      case 'button':
        styles = {
          ...styles,
          background: 'var(--universal-fuego-gradient)',
          color: 'var(--universal-text-inverse)',
          border: 'none',
          borderRadius: 'var(--universal-border-radius-lg)',
          padding: 'var(--universal-space-md) var(--universal-space-lg)',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: 'var(--universal-shadow-md)',
          textTransform: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--universal-space-sm)'
        };
        break;

      case 'chip':
        styles = {
          ...styles,
          background: 'rgba(245, 158, 11, 0.1)',
          color: 'var(--universal-fuego-dark)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--universal-border-radius-md)',
          padding: 'var(--universal-space-xs) var(--universal-space-md)',
          fontWeight: 600,
          fontSize: '0.75rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--universal-space-xs)'
        };
        break;

      case 'container':
        styles = {
          ...styles,
          background: 'var(--universal-bg-default)',
          minHeight: '100vh',
          position: 'relative'
        };
        break;

      case 'surface':
        styles = {
          ...styles,
          background: 'var(--universal-bg-surface)',
          borderRadius: 'var(--universal-border-radius-lg)',
          padding: 'var(--universal-space-md)',
          boxShadow: 'var(--universal-shadow-sm)'
        };
        break;

      case 'header':
        styles = {
          ...styles,
          background: 'var(--universal-bg-paper)',
          borderRadius: '0 0 var(--universal-border-radius-xl) var(--universal-border-radius-xl)',
          padding: 'var(--universal-space-lg)',
          boxShadow: 'var(--universal-shadow-md)',
          marginBottom: 'var(--universal-space-lg)'
        };
        break;

      case 'section':
        styles = {
          ...styles,
          background: 'var(--universal-bg-surface)',
          borderRadius: 'var(--universal-border-radius-lg)',
          padding: 'var(--universal-space-xl)',
          marginBottom: 'var(--universal-space-lg)'
        };
        break;

      case 'text':
        styles = {
          ...styles,
          color: 'var(--universal-text-primary)',
          fontWeight: 500
        };
        break;
    }

    // Aplicar estilos por elemento cósmico
    if (element) {
      const elementColor = getElementColor(element);
      const elementGradient = getElementGradient(element);
      const intensityMap = {
        subtle: 0.1,
        medium: 0.2,
        strong: 0.3
      };
      const alpha = intensityMap[intensity];

      switch (variant) {
        case 'card':
          styles.borderColor = `rgba(${hexToRgb(elementColor)}, ${alpha + 0.1})`;
          styles.boxShadow = `var(--universal-shadow-lg), 0 0 20px rgba(${hexToRgb(elementColor)}, ${alpha})`;
          // Agregar borde superior con gradiente del elemento
          styles.borderTopColor = elementColor;
          styles.borderTopWidth = '4px';
          break;
        case 'button':
          styles.background = elementGradient;
          break;
        case 'chip':
          styles.background = `rgba(${hexToRgb(elementColor)}, ${alpha})`;
          styles.borderColor = `rgba(${hexToRgb(elementColor)}, ${alpha + 0.1})`;
          styles.color = elementColor;
          break;
        case 'surface':
        case 'section':
          styles.background = `linear-gradient(135deg, rgba(${hexToRgb(elementColor)}, ${alpha * 0.3}) 0%, var(--universal-bg-surface) 100%)`;
          styles.borderLeft = `4px solid ${elementColor}`;
          break;
        case 'header':
          styles.background = `linear-gradient(135deg, rgba(${hexToRgb(elementColor)}, ${alpha * 0.2}) 0%, var(--universal-bg-paper) 100%)`;
          break;
      }
    }

    // Aplicar estilos por concepto CoomÜnity
    if (concept) {
      const conceptColor = getConceptColor(concept);
      const alpha = 0.15;

      switch (variant) {
        case 'card':
          styles.accentColor = conceptColor;
          // Agregar un indicador de concepto
          styles.borderRightColor = conceptColor;
          styles.borderRightWidth = '3px';
          break;
        case 'chip':
          styles.background = `rgba(${hexToRgb(conceptColor)}, ${alpha})`;
          styles.borderColor = `rgba(${hexToRgb(conceptColor)}, ${alpha + 0.1})`;
          styles.color = conceptColor;
          break;
      }
    }

    // Efectos especiales
    if (cosmic) {
      styles.background = element ?
        `linear-gradient(135deg, ${getElementColor(element)}15, ${getConceptColor(concept || 'ayni')}15)` :
        'var(--universal-gradient-harmony)';
      styles.backdropFilter = 'blur(10px)';
    }

    if (glow) {
      styles.boxShadow = `${styles.boxShadow}, ${getEffectStyle('glow')}`;
    }

    if (elevated) {
      styles.transform = 'translateY(-4px)';
      styles.boxShadow = 'var(--universal-shadow-xl)';
    }

    // Aplicar estilos por tamaño
    const sizeMultipliers = {
      xs: 0.75,
      sm: 0.875,
      md: 1,
      lg: 1.125,
      xl: 1.25
    };

    const multiplier = sizeMultipliers[size];
    if (variant === 'text') {
      styles.fontSize = `${multiplier}rem`;
    } else if (variant === 'button' || variant === 'chip') {
      styles.fontSize = `${multiplier * 0.875}rem`;
      styles.padding = `${multiplier * 12}px ${multiplier * 24}px`;
    }

    return styles;
  };

  const getHoverStyles = (): CSSProperties => {
    const { variant = 'card', element } = props;

    let hoverStyles: CSSProperties = {};

    switch (variant) {
      case 'card':
        hoverStyles = {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--universal-shadow-xl), var(--universal-effect-glow)',
          borderColor: element ? `rgba(${hexToRgb(getElementColor(element))}, 0.4)` : 'rgba(245, 158, 11, 0.3)'
        };
        break;

      case 'button':
        hoverStyles = {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--universal-shadow-lg), var(--universal-effect-glow)',
          filter: 'brightness(1.05)'
        };
        break;

      case 'chip':
        hoverStyles = {
          transform: 'translateY(-1px)',
          background: element ?
            `rgba(${hexToRgb(getElementColor(element))}, 0.2)` :
            'rgba(245, 158, 11, 0.2)'
        };
        break;

      case 'surface':
      case 'section':
        hoverStyles = {
          boxShadow: 'var(--universal-shadow-md)',
          transform: 'translateY(-1px)'
        };
        break;
    }

    return hoverStyles;
  };

  return { getBaseStyles, getHoverStyles };
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

  const { getUniversalClassName } = useUniversalGuardian();

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

interface UniversalTextProps extends TypographyProps {
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

interface UniversalButtonProps extends ButtonProps {
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
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// ===== 📤 EXPORTACIONES ===== //
export { useUniversalGuardian } from '../theme/UniversalGuardianSystem';
export type { CosmicElement, CoomunityConcept };
