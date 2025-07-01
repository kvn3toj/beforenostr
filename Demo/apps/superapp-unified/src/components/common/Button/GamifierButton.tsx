import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface GamifierButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const StyledButton = styled(Button)<GamifierButtonProps>(({ theme, variant, size }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.palette.primary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: '0 4px 12px rgba(205, 171, 90, 0.3)',
          },
          '&:active': {
            backgroundColor: theme.palette.primary.dark,
            transform: 'translateY(1px)',
          },
        };
      case 'secondary':
        return {
          backgroundColor: theme.palette.secondary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1a1a1a',
            boxShadow: '0 4px 12px rgba(39, 39, 39, 0.3)',
          },
          '&:active': {
            backgroundColor: '#1a1a1a',
            transform: 'translateY(1px)',
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          border: `2px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(205, 171, 90, 0.2)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&:active': {
            backgroundColor: theme.palette.action.selected,
            transform: 'translateY(1px)',
          },
        };
      case 'danger':
        return {
          backgroundColor: theme.palette.error.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
          },
          '&:active': {
            backgroundColor: theme.palette.error.dark,
            transform: 'translateY(1px)',
          },
        };
      default:
        return {
          backgroundColor: theme.palette.primary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: '0 4px 12px rgba(205, 171, 90, 0.3)',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '6px 16px',
          fontSize: '0.875rem',
          minHeight: '32px',
        };
      case 'large':
        return {
          padding: '12px 24px',
          fontSize: '1.125rem',
          minHeight: '48px',
        };
      default: // medium
        return {
          padding: '8px 20px',
          fontSize: '1rem',
          minHeight: '40px',
        };
    }
  };

  return {
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
    ...getVariantStyles(),
    ...getSizeStyles(),
  };
});

export const GamifierButton: React.FC<GamifierButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <CircularProgress
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color="inherit"
            sx={{ mr: 1 }}
          />
          {children}
        </>
      );
    }

    if (icon) {
      return iconPosition === 'left' ? (
        <>
          {React.cloneElement(icon as React.ReactElement, {
            sx: { mr: 1, fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem' }
          })}
          {children}
        </>
      ) : (
        <>
          {children}
          {React.cloneElement(icon as React.ReactElement, {
            sx: { ml: 1, fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem' }
          })}
        </>
      );
    }

    return children;
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {renderContent()}
    </StyledButton>
  );
};
