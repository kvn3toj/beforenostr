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
    | 'gradient'
    | 'glassmorphism'
    | 'neon';
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
  glow?: boolean;
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
  glow = false,
  reciprocidadLevel,
  children,
  disabled,
  className,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const { isDark } = useCoomunityTheme();

  // Variantes de color
  const getVariantStyles = () => {
    const baseStyles = {
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: 500,
      textTransform: 'none' as const,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, #bb86fc 0%, #7c3aed 100%)'
            : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
          color: 'white',
          border: 'none',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #d4b3ff 0%, #8b5cf6 100%)'
              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            transform: elevated ? 'translateY(-2px)' : 'none',
            boxShadow: elevated ? theme.shadows[8] : theme.shadows[4],
          },
        };

      case 'secondary':
        return {
          ...baseStyles,
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
          color: theme.palette.text.primary,
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          '&:hover': {
            background: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
            transform: elevated ? 'translateY(-1px)' : 'none',
          },
        };

      case 'outline':
        return {
          ...baseStyles,
          background: 'transparent',
          color: isDark ? '#bb86fc' : '#7c3aed',
          border: `2px solid ${isDark ? '#bb86fc' : '#7c3aed'}`,
          '&:hover': {
            background: isDark ? 'rgba(187, 134, 252, 0.1)' : 'rgba(124, 58, 237, 0.1)',
            transform: elevated ? 'translateY(-1px)' : 'none',
          },
        };

      case 'ghost':
        return {
          ...baseStyles,
          background: 'transparent',
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          },
        };

      case 'destructive':
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
          border: 'none',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          },
        };

      case 'success':
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: 'white',
          border: 'none',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
        };

      case 'warning':
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
          color: 'white',
          border: 'none',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          },
        };

      case 'gradient':
        return {
          ...baseStyles,
          background: isDark
            ? 'linear-gradient(135deg, #bb86fc 0%, #03dac6 50%, #ffc107 100%)'
            : 'linear-gradient(135deg, #7c3aed 0%, #0891b2 50%, #d97706 100%)',
          color: 'white',
          border: 'none',
          backgroundSize: '200% 200%',
          animation: animated ? 'gradientShift 3s ease infinite' : 'none',
          '&:hover': {
            backgroundPosition: 'right center',
          },
        };

      case 'glassmorphism':
        return {
          ...baseStyles,
          background: isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
          color: theme.palette.text.primary,
          '&:hover': {
            background: isDark
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.3)',
          },
        };

      case 'neon':
        return {
          ...baseStyles,
          background: 'transparent',
          color: isDark ? '#03dac6' : '#0891b2',
          border: `2px solid ${isDark ? '#03dac6' : '#0891b2'}`,
          boxShadow: glow
            ? `0 0 20px ${isDark ? 'rgba(3, 218, 198, 0.5)' : 'rgba(8, 145, 178, 0.5)'}`
            : 'none',
          '&:hover': {
            boxShadow: `0 0 30px ${isDark ? 'rgba(3, 218, 198, 0.8)' : 'rgba(8, 145, 178, 0.8)'}`,
            textShadow: `0 0 10px ${isDark ? '#03dac6' : '#0891b2'}`,
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

  // Estilos de Reciprocidad
  const getReciprocidadStyles = () => {
    if (!reciprocidadLevel) return {};

    const reciprocidadColors = {
      1: { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' },
      2: { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' },
      3: { color: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' },
      4: { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)' },
      5: { color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
    };

    const reciprocidadColor = reciprocidadColors[reciprocidadLevel];

    return {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, transparent 30%, ${reciprocidadColor.color}20 50%, transparent 70%)`,
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&:hover::before': {
        opacity: 1,
      },
      boxShadow: glow ? `0 0 20px ${reciprocidadColor.glow}` : 'none',
    };
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getReciprocidadStyles(),
    borderRadius: rounded ? '50px' : '8px',
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