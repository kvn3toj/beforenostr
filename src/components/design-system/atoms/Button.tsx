import React from 'react';
import { Button as MuiButton, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../tokens/colors';
import { spacing, componentSpacing, fluidSpacing } from '../tokens/spacing';
import { textStyles } from '../tokens/typography';
import { buttonFocusStyles } from '../../../utils/accessibility/focus-styles';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  
  // === NUEVAS PROPS RESPONSIVAS ===
  fluidSize?: boolean; // Tamaño que se adapta fluido
  responsiveHide?: {
    xs?: boolean;
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
  }; // Ocultar en ciertos breakpoints
  compactMode?: boolean; // Modo compacto para mobile
  pixelPerfect?: boolean; // Optimizaciones para pixel perfect
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => 
    !['fluidSize', 'compactMode', 'pixelPerfect', 'currentBreakpoint', 'isTouch', 'responsiveHide'].includes(prop as string)
})<ButtonProps & { 
  currentBreakpoint?: string;
  isTouch?: boolean;
}>(({ 
  theme, 
  variant: customVariant, 
  size: customSize,
  fluidSize,
  compactMode,
  pixelPerfect,
  currentBreakpoint,
  isTouch
}) => {
  const getVariantStyles = () => {
    switch (customVariant) {
      case 'primary':
        return {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
          '&:hover': {
            backgroundColor: colors.primary.dark,
            boxShadow: `0 4px 12px ${colors.action.focus}`,
            transform: pixelPerfect ? 'none' : 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: colors.primary.dark,
            transform: 'translateY(0px)',
          },
        };
      
      case 'secondary':
        return {
          backgroundColor: colors.secondary.main,
          color: colors.secondary.contrastText,
          '&:hover': {
            backgroundColor: colors.secondary.dark,
            boxShadow: `0 4px 12px rgba(39, 39, 39, 0.3)`,
            transform: pixelPerfect ? 'none' : 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: colors.secondary.dark,
            transform: 'translateY(0px)',
          },
        };
        
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primary.main,
          border: `2px solid ${colors.primary.main}`,
          '&:hover': {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
            boxShadow: `0 4px 12px ${colors.action.hover}`,
            transform: pixelPerfect ? 'none' : 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        };
        
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.action.hover,
            transform: pixelPerfect ? 'none' : 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: colors.action.selected,
            transform: 'translateY(0px)',
          },
        };
        
      case 'danger':
        return {
          backgroundColor: colors.error.main,
          color: colors.error.contrastText,
          '&:hover': {
            backgroundColor: colors.error.dark,
            boxShadow: `0 4px 12px rgba(239, 68, 68, 0.3)`,
            transform: pixelPerfect ? 'none' : 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: colors.error.dark,
            transform: 'translateY(0px)',
          },
        };
        
      case 'success':
        return {
          backgroundColor: colors.success.main,
          color: colors.success.contrastText,
          '&:hover': {
            backgroundColor: colors.success.dark,
            boxShadow: `0 4px 12px rgba(16, 185, 129, 0.3)`,
            transform: pixelPerfect ? 'none' : 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: colors.success.dark,
            transform: 'translateY(0px)',
          },
        };
        
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    // === TAMAÑO FLUIDO ===
    if (fluidSize) {
      return {
        padding: componentSpacing.padding.button.medium,
        minHeight: 'clamp(36px, 8vw, 48px)',
        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
        ...textStyles.button,
      };
    }
    
    // === MODO COMPACTO PARA MOBILE ===
    if (compactMode && currentBreakpoint === 'xs') {
      return {
        padding: componentSpacing.padding.button.small,
        minHeight: '32px',
        fontSize: '0.75rem',
        ...textStyles.buttonSmall,
      };
    }

    // === TAMAÑOS TRADICIONALES ===
    switch (customSize) {
      case 'small':
        return {
          padding: fluidSize ? 
            componentSpacing.padding.button.small : 
            'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
          minHeight: fluidSize ? 'clamp(32px, 6vw, 36px)' : '32px',
          ...textStyles.buttonSmall,
        };
      case 'large':
        return {
          padding: fluidSize ? 
            componentSpacing.padding.button.large : 
            'clamp(12px, 2.5vw, 16px) clamp(20px, 5vw, 32px)',
          minHeight: fluidSize ? 'clamp(44px, 10vw, 52px)' : '48px',
          ...textStyles.buttonLarge,
        };
      default: // medium
        return {
          padding: fluidSize ? 
            componentSpacing.padding.button.medium : 
            'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
          minHeight: fluidSize ? 'clamp(36px, 8vw, 44px)' : '40px',
          ...textStyles.button,
        };
    }
  };

  return {
    borderRadius: `${spacing.md}px`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    textTransform: 'none',
    fontFamily: 'inherit',
    letterSpacing: '0.025em',
    
    // === ESTILOS DE ACCESIBILIDAD ===
    ...buttonFocusStyles,
    
    // === ESTILOS DISABLED ===
    '&:disabled': {
      backgroundColor: colors.action.disabled,
      color: colors.text.disabled,
      cursor: 'not-allowed',
      boxShadow: 'none',
      transform: 'none',
      '&:hover': {
        backgroundColor: colors.action.disabled,
        boxShadow: 'none',
        transform: 'none',
      },
    },

    // === APLICAR ESTILOS ===
    ...getVariantStyles(),
    ...getSizeStyles(),

    // === TOUCH OPTIMIZATIONS ===
    ...(isTouch && {
      '&:hover': {
        transform: 'none', // Desactivar hover en touch
      },
      minHeight: '44px', // Tamaño mínimo para touch
    }),

    // === BEFORE PARA EFECTOS ===
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 1%, transparent 1%)',
      transform: 'scale(10, 10)',
      opacity: 0,
      transition: 'transform 0.3s, opacity 0.3s',
      pointerEvents: 'none',
    },

    '&:active::before': {
      transform: 'scale(0, 0)',
      opacity: 0.3,
      transition: 'transform 0s, opacity 0s',
    },

    // Enhanced focus styles
    '&:focus': {
      outline: 'none', // Remove default outline
    },
    '&:focus-visible': {
      outline: `3px solid ${colors.accessibility.focusRing}`,
      outlineOffset: '2px',
      boxShadow: `0 0 0 4px ${colors.accessibility.focusRingOpacity}`,
      zIndex: 1, // Ensure focus ring is visible above other elements
    },
  };
});

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  fluidSize = false,
  responsiveHide,
  compactMode = true, // Por defecto activado
  pixelPerfect = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  const isTouch = useMediaQuery('(pointer: coarse)');

  // Función para obtener el breakpoint actual
  const getCurrentBreakpoint = () => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    return 'lg';
  };

  // Función para determinar si debe ocultarse
  const shouldHide = () => {
    if (!responsiveHide) return false;
    const currentBreakpoint = getCurrentBreakpoint();
    return responsiveHide[currentBreakpoint as keyof typeof responsiveHide];
  };

  // Generar aria-label automáticamente si loading o si es un botón de solo ícono
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (loading) return 'Cargando...';
    
    // Si es un botón que solo contiene ícono (sin texto), requiere aria-label
    const isIconOnly = icon && (!children || (typeof children === 'string' && children.trim() === ''));
    if (isIconOnly) {
      console.warn('Button con solo ícono debe incluir aria-label para accesibilidad');
      return 'Botón'; // Fallback básico
    }
    
    return undefined;
  };

  // Mejorar aria-describedby para incluir el ID del helper text si existe
  const getAriaDescribedBy = () => {
    const parts = [];
    if (ariaDescribedBy) parts.push(ariaDescribedBy);
    if (loading) parts.push('loading-status');
    return parts.length > 0 ? parts.join(' ') : undefined;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <CircularProgress 
            size={16} 
            sx={{ 
              color: 'inherit',
              marginRight: children ? 1 : 0
            }} 
          />
          {children && <span>{children}</span>}
        </>
      );
    }

    if (!icon) {
      return children;
    }

    const iconSize = () => {
      switch (size) {
        case 'small': return 14;
        case 'large': return 20;
        default: return 16;
      }
    };

    const iconElement = React.cloneElement(icon, {
      style: { 
        fontSize: iconSize(), 
        width: iconSize(), 
        height: iconSize() 
      }
    });

    return iconPosition === 'left' ? (
      <>
        {iconElement}
        <span style={{ marginLeft: spacing.xs }}>{children}</span>
      </>
    ) : (
      <>
        <span style={{ marginRight: spacing.xs }}>{children}</span>
        {iconElement}
      </>
    );
  };

  if (shouldHide()) {
    return null;
  }

  // Filtrar props para evitar que lleguen al DOM
  const {
    fluidSize: _fluidSize,
    responsiveHide: _responsiveHide,
    compactMode: _compactMode,
    pixelPerfect: _pixelPerfect,
    ...safeProps
  } = props;

  return (
    <StyledButton
      variant="contained"
      size="medium"
      fullWidth={fullWidth}
      disabled={disabled || loading}
      fluidSize={fluidSize}
      compactMode={compactMode}
      pixelPerfect={pixelPerfect}
      currentBreakpoint={getCurrentBreakpoint()}
      isTouch={isTouch}
      aria-label={getAriaLabel()}
      aria-describedby={getAriaDescribedBy()}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || loading}
      role="button"
      {...safeProps}
    >
      {renderContent()}
    </StyledButton>
  );
}; 