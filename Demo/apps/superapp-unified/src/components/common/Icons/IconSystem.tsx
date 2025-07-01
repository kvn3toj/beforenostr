import React from 'react';
import { SvgIconProps, Box, Tooltip, alpha } from '@mui/material';
import { useGuardianColors } from '../../../theme/GuardianColorProvider';
import * as Icons from '../Icons';

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';
export type IconVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';

export interface IconSystemProps extends Omit<SvgIconProps, 'fontSize'> {
  /**
   * Nombre del icono de Material UI
   */
  icon: keyof typeof Icons;

  /**
   * Tamaño del icono
   * @default 'medium'
   */
  size?: IconSize;

  /**
   * Variante de color del icono
   * @default 'default'
   */
  variant?: IconVariant;

  /**
   * Texto del tooltip (opcional)
   */
  tooltip?: string;

  /**
   * Si el icono debe tener un fondo circular
   * @default false
   */
  withBackground?: boolean;

  /**
   * Función a ejecutar al hacer clic en el icono
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Sistema de iconos unificado para CoomÜnity SuperApp
 *
 * Proporciona una interfaz consistente para todos los iconos con soporte para:
 * - Tamaños predefinidos
 * - Variantes de color basadas en el sistema de temas
 * - Tooltips opcionales
 * - Fondos circulares opcionales
 * - Integración con el sistema de colores Guardian
 */
export const IconSystem: React.FC<IconSystemProps> = ({
  icon,
  size = 'medium',
  variant = 'default',
  tooltip,
  withBackground = false,
  onClick,
  sx,
  ...props
}) => {
  const { palette } = useGuardianColors();

  // Obtener el componente de icono
  const IconComponent = Icons[icon] || Icons.InfoIcon;

  // Determinar el tamaño del icono
  const getIconSize = () => {
    switch (size) {
      case 'small': return '1rem';
      case 'medium': return '1.5rem';
      case 'large': return '2rem';
      case 'xlarge': return '3rem';
      default: return '1.5rem';
    }
  };

  // Determinar el color del icono basado en la variante
  const getIconColor = () => {
    switch (variant) {
      case 'primary': return palette.primary;
      case 'secondary': return palette.secondary;
      case 'accent': return palette.accent;
      case 'success': return palette.success;
      case 'warning': return palette.warning;
      case 'error': return palette.error;
      case 'info': return palette.info;
      default: return palette.text.primary;
    }
  };

  // Determinar el tamaño del contenedor si hay fondo
  const getContainerSize = () => {
    switch (size) {
      case 'small': return '1.75rem';
      case 'medium': return '2.5rem';
      case 'large': return '3.5rem';
      case 'xlarge': return '5rem';
      default: return '2.5rem';
    }
  };

  const iconColor = getIconColor();
  const iconSize = getIconSize();

  const icon_element = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: withBackground ? getContainerSize() : 'auto',
        height: withBackground ? getContainerSize() : 'auto',
        borderRadius: withBackground ? '50%' : 0,
        backgroundColor: withBackground ? alpha(iconColor, 0.1) : 'transparent',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          backgroundColor: withBackground ? alpha(iconColor, 0.2) : 'transparent',
          transform: 'scale(1.05)',
        } : {},
        ...sx
      }}
      onClick={onClick}
    >
      <IconComponent
        sx={{
          fontSize: iconSize,
          color: iconColor,
          transition: 'all 0.2s ease',
        }}
        {...props}
      />
    </Box>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow>
        {icon_element}
      </Tooltip>
    );
  }

  return icon_element;
};
