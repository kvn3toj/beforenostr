import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../tokens/colors';
import { buttonFocusStyles } from '../../../utils/accessibility/focus-styles';

export interface IconButtonProps extends Omit<MuiIconButtonProps, 'aria-label'> {
  children: React.ReactElement;
  'aria-label': string; // Hacer aria-label obligatorio
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'standard' | 'filled' | 'outlined';
  loading?: boolean;
}

const StyledIconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => !['size'].includes(prop as string),
})<IconButtonProps>(({ theme, size, variant, loading }) => ({
  // Aplicar estilos de foco consistentes
  ...buttonFocusStyles,
  
  // Transiciones suaves
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Tamaños táctiles mínimos
  minWidth: size === 'small' ? '32px' : size === 'large' ? '56px' : '44px',
  minHeight: size === 'small' ? '32px' : size === 'large' ? '56px' : '44px',
  
  // Estados disabled
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'none',
    },
  },
  
  // Estados de carga
  ...(loading && {
    '&:disabled': {
      opacity: 0.8,
    },
  }),
  
  // Variantes de estilo
  ...(variant === 'filled' && {
    backgroundColor: colors.action.hover,
    '&:hover': {
      backgroundColor: colors.action.selected,
    },
  }),
  
  ...(variant === 'outlined' && {
    border: `1px solid ${colors.divider}`,
    '&:hover': {
      backgroundColor: colors.action.hover,
      borderColor: colors.primary.main,
    },
  }),
  
  // Efecto hover
  '&:hover:not(:disabled)': {
    transform: 'scale(1.05)',
    boxShadow: `0 2px 8px ${colors.action.focus}`,
  },
  
  // Estados de prensa
  '&:active:not(:disabled)': {
    transform: 'scale(0.95)',
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
}));

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  tooltip,
  disabled,
  loading = false,
  size = 'medium',
  variant = 'standard',
  ...props
}) => {
  // Validar que aria-label esté presente
  if (!ariaLabel) {
    console.error('IconButton requiere aria-label para accesibilidad');
  }
  
  const button = (
    <StyledIconButton
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled || loading}
      size={size}
      variant={variant}
      loading={loading}
      {...props}
    >
      {loading ? (
        <div className="icon-button-spinner" style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid currentColor', 
          borderTop: '2px solid transparent', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite' 
        }} />
      ) : children}
    </StyledIconButton>
  );
  
  // Si hay tooltip, envolver en Tooltip
  if (tooltip && !disabled) {
    return (
      <Tooltip title={tooltip} arrow>
        {button}
      </Tooltip>
    );
  }
  
  return button;
};

// Añadir animación de spinner
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Inyectar CSS de animación si no existe
if (typeof document !== 'undefined' && !document.querySelector('#icon-button-animations')) {
  const style = document.createElement('style');
  style.id = 'icon-button-animations';
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
} 