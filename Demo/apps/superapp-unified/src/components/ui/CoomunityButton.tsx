import React from 'react';
import { Button, ButtonProps, CircularProgress, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/styles';

export interface CoomunityButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'minimal'
    | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  elevated?: boolean;
  animated?: boolean;
  pulse?: boolean;
  reciprocidadLevel?: 1 | 2 | 3 | 4 | 5; // Nivel de Reciprocidad para styling especial
}

const CoomunityButton: React.FC<CoomunityButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  elevated = false,
  animated = true,
  pulse = false,
  reciprocidadLevel,
  children,
  disabled,
  className,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const { isDark } = useCoomunityTheme();

  // Variantes de color MINIMALISTAS
  const getVariantStyles = () => {
    const baseStyles = {
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: 500,
      textTransform: 'none' as const,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      backgroundColor: theme.palette.background.paper, // SIEMPRE BLANCO BASE
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            transform: elevated ? 'translateY(-2px)' : 'none',
            boxShadow: elevated ? theme.shadows[4] : theme.shadows[2],
          },
        };

      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.primary.main,
            transform: elevated ? 'translateY(-1px)' : 'none',
          },
        };

      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          border: `2px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            transform: elevated ? 'translateY(-1px)' : 'none',
          },
        };

      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        };

      case 'destructive':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
          },
        };

      case 'success':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.palette.success.dark,
          },
        };

      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.palette.warning.dark,
          },
        };

      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
          },
        };

      case 'subtle':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        };

      default:
        return baseStyles;
    }
  };

  // Tamaños
  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return {
          padding: '4px 8px',
          fontSize: '0.75rem',
          minHeight: '24px',
        };
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '0.875rem',
          minHeight: '32px',
        };
      case 'md':
        return {
          padding: '8px 16px',
          fontSize: '1rem',
          minHeight: '40px',
        };
      case 'lg':
        return {
          padding: '12px 24px',
          fontSize: '1.125rem',
          minHeight: '48px',
        };
      case 'xl':
        return {
          padding: '16px 32px',
          fontSize: '1.25rem',
          minHeight: '56px',
        };
      default:
        return {
          padding: '8px 16px',
          fontSize: '1rem',
          minHeight: '40px',
        };
    }
  };

  // Estilos de Reciprocidad MINIMALISTAS
  const getReciprocidadStyles = () => {
    if (!reciprocidadLevel) return {};

    const reciprocidadColors = {
      1: theme.palette.error.main,
      2: theme.palette.warning.main,
      3: theme.palette.success.main,
      4: theme.palette.info.main,
      5: theme.palette.secondary.main,
    };

    const reciprocidadColor = reciprocidadColors[reciprocidadLevel];

    return {
      borderLeft: `4px solid ${reciprocidadColor}`, // Indicador minimalista de reciprocidad
      '&:hover': {
        boxShadow: `0 0 0 2px ${reciprocidadColor}20`, // Glow sutil al hover
      },
    };
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getReciprocidadStyles(),
    borderRadius: rounded ? '50px' : theme.shape.borderRadius,
    width: fullWidth ? '100%' : 'auto',
    animation: pulse ? 'pulse 2s infinite' : 'none',
    ...sx,
  };

  const buttonContent = (
    <>
      {loading && (
        <CircularProgress
          size={size === 'xs' ? 12 : size === 'sm' ? 16 : 20}
          sx={{
            color: 'currentColor',
            mr: 1,
          }}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span style={{ marginRight: '8px' }}>{icon}</span>
      )}
      {loading ? loadingText || 'Cargando...' : children}
      {!loading && icon && iconPosition === 'right' && (
        <span style={{ marginLeft: '8px' }}>{icon}</span>
      )}
    </>
  );

  const MotionButton = animated ? motion(Button) : Button;

  return (
    <MotionButton
      {...props}
      disabled={disabled || loading}
      className={cn('coomunity-button', className)}
      sx={buttonStyles}
      whileHover={animated ? { scale: 1.02 } : undefined}
      whileTap={animated ? { scale: 0.98 } : undefined}
      transition={animated ? { type: 'spring', stiffness: 400, damping: 17 } : undefined}
    >
      {buttonContent}
    </MotionButton>
  );
};

export default CoomunityButton;
