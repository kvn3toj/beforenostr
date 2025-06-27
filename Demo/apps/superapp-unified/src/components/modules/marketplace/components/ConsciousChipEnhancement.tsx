import React, { useState } from 'react';
import {
  Chip,
  ChipProps,
  Box,
  Tooltip,
  useTheme,
  alpha,
  IconButton,
  Badge,
  Zoom,
  Fade,
  ButtonBase,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Balance, EmojiNature, VolunteerActivism } from '@mui/icons-material';

// 🌱 Props extendidas para Chips Conscientes
interface ConsciousChipProps extends Omit<ChipProps, 'onClick'> {
  // 📏 Accesibilidad táctil (WCAG AAA)
  touchCompliant?: boolean; // Garantiza 48x48px mínimo

  // 🌟 Filosofía CoomÜnity
  ayniLevel?: 'seed' | 'growing' | 'flourishing' | 'transcendent';
  bienComunImpact?: 'individual' | 'community' | 'collective' | 'global';

  // 🎯 Interacción mejorada
  onClick?: (value: any) => void;
  onAyniActivation?: () => void; // Callback cuando se activa principio Ayni
  value?: any;

  // 🎨 Efectos visuales conscientes
  cosmicGlow?: boolean;
  pulseOnHover?: boolean;
  showTooltip?: boolean;
  tooltipContent?: string;

  // 📊 Estado consciente
  isActive?: boolean;
  loadingState?: boolean;

  // 🔄 Feedback visual
  showFeedback?: boolean;
  feedbackMessage?: string;
}

// 🎨 Estilos filosóficos basados en niveles Ayni
const getAyniStyle = (level: ConsciousChipProps['ayniLevel'], theme: any) => {
  switch (level) {
    case 'transcendent':
      return {
        color: '#fbbf24', // Dorado trascendente
        glow: '0 0 12px rgba(251, 191, 36, 0.4)',
        icon: <Balance sx={{ fontSize: 16 }} />,
        description: 'Maestría en Reciprocidad'
      };
    case 'flourishing':
      return {
        color: '#10b981', // Verde floreciente
        glow: '0 0 8px rgba(16, 185, 129, 0.3)',
        icon: <EmojiNature sx={{ fontSize: 16 }} />,
        description: 'Equilibrio en Crecimiento'
      };
    case 'growing':
      return {
        color: '#3b82f6', // Azul en crecimiento
        glow: '0 0 6px rgba(59, 130, 246, 0.2)',
        icon: <VolunteerActivism sx={{ fontSize: 16 }} />,
        description: 'Aprendiendo Reciprocidad'
      };
    case 'seed':
    default:
      return {
        color: theme.palette.text.secondary,
        glow: 'none',
        icon: null,
        description: 'Potencial Ayni'
      };
  }
};

// 🌟 Chip Consciente Principal
export const ConsciousChip: React.FC<ConsciousChipProps> = ({
  touchCompliant = true,
  ayniLevel = 'seed',
  bienComunImpact = 'individual',
  onClick,
  onAyniActivation,
  value,
  cosmicGlow = true,
  pulseOnHover = true,
  showTooltip = true,
  tooltipContent,
  isActive = false,
  loadingState = false,
  showFeedback = false,
  feedbackMessage,
  sx,
  ...chipProps
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showActivationFeedback, setShowActivationFeedback] = useState(false);

  const ayniStyle = getAyniStyle(ayniLevel, theme);

  // 📏 Garantizar área táctil mínima de 48px (WCAG AAA)
  const minTouchSize = touchCompliant ? 48 : 'auto';

  // 🎯 Handler consciente de clicks
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // ✨ Activación consciente de Ayni
    if (onAyniActivation && ayniLevel !== 'seed') {
      onAyniActivation();
      setShowActivationFeedback(true);
      setTimeout(() => setShowActivationFeedback(false), 2000);
    }

    // 🔄 Callback principal
    if (onClick) {
      onClick(value || chipProps.label);
    }
  };

  // 🌟 Estilos dinámicos conscientes
  const consciousStyles = {
    minWidth: minTouchSize,
    minHeight: minTouchSize,
    cursor: onClick ? 'pointer' : 'default',
    borderColor: isActive ? ayniStyle.color : 'transparent',
    backgroundColor: isActive
      ? alpha(ayniStyle.color, 0.2)
      : alpha(theme.palette.action.hover, 0.08),
    color: isActive ? ayniStyle.color : theme.palette.text.primary,
    boxShadow: cosmicGlow && (isActive || isHovered) ? ayniStyle.glow : 'none',
    transform: pulseOnHover && isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    // 🎨 Indicador de Bien Común
    '&::before': bienComunImpact !== 'individual' ? {
      content: '""',
      position: 'absolute',
      top: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: getBienComunColor(bienComunImpact),
      boxShadow: `0 0 4px ${getBienComunColor(bienComunImpact)}`,
    } : {},

    // 🔄 Estados de interacción
    '&:hover': onClick ? {
      backgroundColor: alpha(ayniStyle.color, 0.15),
      transform: 'scale(1.05)',
    } : {},

    '&:active': onClick ? {
      transform: 'scale(0.98)',
    } : {},

    // 📱 Responsive para móvil
    [theme.breakpoints.down('md')]: {
      minWidth: touchCompliant ? 44 : 'auto', // iOS mínimo: 44px
      minHeight: touchCompliant ? 44 : 'auto',
      fontSize: '0.875rem',
    },

    ...sx,
  };

  // 🎁 Contenido del tooltip consciente
  const tooltipText = tooltipContent ||
    `${ayniStyle.description} • ${getBienComunDescription(bienComunImpact)}`;

  const chipElement = (
    <motion.div
      whileHover={pulseOnHover ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      animate={showActivationFeedback ? {
        boxShadow: [`0 0 0px ${ayniStyle.color}`, `0 0 20px ${ayniStyle.color}`, `0 0 0px ${ayniStyle.color}`]
      } : {}}
      transition={{ duration: 0.3 }}
    >
      <Chip
        {...chipProps}
        sx={consciousStyles}
        onClick={onClick ? handleClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // 🎯 Iconos dinámicos según nivel Ayni
        icon={ayniStyle.icon || chipProps.icon}
        // ♿ Accesibilidad mejorada
        role={onClick ? 'button' : 'status'}
        aria-label={`${chipProps.label} - ${ayniStyle.description}${isActive ? ' (activo)' : ''}`}
        tabIndex={onClick ? 0 : -1}
        // 🎹 Navegación por teclado
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
          }
        } : undefined}
      />
    </motion.div>
  );

  // 🎁 Envolver en tooltip si está habilitado
  if (showTooltip && tooltipText) {
    return (
      <Tooltip
        title={tooltipText}
        placement="top"
        arrow
        TransitionComponent={Zoom}
        sx={{
          '& .MuiTooltip-tooltip': {
            backgroundColor: alpha(theme.palette.common.black, 0.9),
            color: theme.palette.common.white,
            fontSize: '0.75rem',
            maxWidth: 200,
            textAlign: 'center',
          },
          '& .MuiTooltip-arrow': {
            color: alpha(theme.palette.common.black, 0.9),
          }
        }}
      >
        {chipElement}
      </Tooltip>
    );
  }

  return chipElement;
};

// 🌍 Función auxiliar para colores del Bien Común
const getBienComunColor = (impact: ConsciousChipProps['bienComunImpact']) => {
  switch (impact) {
    case 'global': return '#fbbf24'; // Dorado global
    case 'collective': return '#10b981'; // Verde colectivo
    case 'community': return '#3b82f6'; // Azul comunitario
    case 'individual':
    default: return 'transparent';
  }
};

// 📖 Función auxiliar para descripciones del Bien Común
const getBienComunDescription = (impact: ConsciousChipProps['bienComunImpact']) => {
  switch (impact) {
    case 'global': return 'Impacto Global';
    case 'collective': return 'Beneficio Colectivo';
    case 'community': return 'Fortalece Comunidad';
    case 'individual':
    default: return 'Crecimiento Personal';
  }
};

// 🎯 Chips Específicos para Marketplace

// 🏷️ Chip de Categoría Consciente
export const CategoryConsciousChip: React.FC<{
  category: string;
  isActive?: boolean;
  onClick?: (category: string) => void;
  impactLevel?: ConsciousChipProps['bienComunImpact'];
}> = ({ category, isActive = false, onClick, impactLevel = 'community' }) => {
  return (
    <ConsciousChip
      label={category}
      value={category}
      isActive={isActive}
      onClick={onClick}
      ayniLevel={isActive ? 'flourishing' : 'growing'}
      bienComunImpact={impactLevel}
      touchCompliant={true}
      cosmicGlow={true}
      showTooltip={true}
      tooltipContent={`Categoría: ${category} • Explora productos que contribuyen al ${getBienComunDescription(impactLevel)}`}
      sx={{
        // 📱 Área táctil garantizada [[memory:6998341476761920864]]
        minWidth: 48,
        minHeight: 48,
        '@media (max-width: 768px)': {
          minWidth: 44,
          minHeight: 44,
        }
      }}
    />
  );
};

// 🔍 Chip de Filtro Consciente
export const FilterConsciousChip: React.FC<{
  filter: string;
  count?: number;
  isActive?: boolean;
  onClick?: (filter: string) => void;
}> = ({ filter, count, isActive = false, onClick }) => {
  return (
    <Badge
      badgeContent={count}
      color="primary"
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.625rem',
          minWidth: 16,
          height: 16,
        }
      }}
    >
      <ConsciousChip
        label={filter}
        value={filter}
        isActive={isActive}
        onClick={onClick}
        ayniLevel={isActive ? 'growing' : 'seed'}
        bienComunImpact="community"
        touchCompliant={true}
        pulseOnHover={true}
        showTooltip={true}
        tooltipContent={`Filtro: ${filter}${count ? ` (${count} resultados)` : ''}`}
        sx={{
          // 📱 Área táctil garantizada [[memory:6998341476761920864]]
          minWidth: 48,
          minHeight: 48,
          '@media (max-width: 768px)': {
            minWidth: 44,
            minHeight: 44,
          }
        }}
      />
    </Badge>
  );
};

// 🏆 Chip de Estado/Badge Consciente
export const StatusConsciousChip: React.FC<{
  status: 'nuevo' | 'popular' | 'sostenible' | 'emprendedor-confiable';
  size?: 'small' | 'medium';
}> = ({ status, size = 'small' }) => {
  const statusConfig = {
    'nuevo': {
      color: 'info',
      ayni: 'seed' as const,
      impacto: 'individual' as const,
      descripcion: 'Nuevo en el ecosistema'
    },
    'popular': {
      color: 'secondary',
      ayni: 'growing' as const,
      impacto: 'community' as const,
      descripcion: 'Popular en la comunidad'
    },
    'sostenible': {
      color: 'success',
      ayni: 'flourishing' as const,
      impacto: 'collective' as const,
      descripcion: 'Contribuye a la sostenibilidad'
    },
    'emprendedor-confiable': {
      color: 'warning',
      ayni: 'transcendent' as const,
      impacto: 'global' as const,
      descripcion: 'Emprendedor verificado y confiable'
    },
  };

  const config = statusConfig[status];

  return (
    <ConsciousChip
      label={status.replace('-', ' ')}
      size={size}
      ayniLevel={config.ayni}
      bienComunImpact={config.impacto}
      cosmicGlow={true}
      showTooltip={true}
      tooltipContent={config.descripcion}
      touchCompliant={false} // Los badges no necesitan área táctil
      sx={{
        textTransform: 'capitalize',
        fontWeight: 500,
      }}
    />
  );
};

export default ConsciousChip;
