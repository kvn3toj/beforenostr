import React, { useState, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShareIcon from '@mui/icons-material/Share';
import GroupsIcon from '@mui/icons-material/Groups';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreateIcon from '@mui/icons-material/Create';
import ExploreIcon from '@mui/icons-material/Explore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RecommendIcon from '@mui/icons-material/Recommend';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlashOnIcon from '@mui/icons-material/FlashOn';

// 🌌 COSMIC DESIGN SYSTEM IMPORTS - ARIA (Frontend Artist)
import { CosmicCard } from '../../design-system';
import { UNIFIED_COLORS } from '../../theme/colors';

interface SmartAction {
  id: string;
  icon: React.ReactElement;
  label: string;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  description: string;
  category: 'reciprocidad' | 'modules' | 'create' | 'discover';
  urgency: 'high' | 'medium' | 'low';
  completionRate?: number;
  timeEstimate?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  isRecommended?: boolean;
  isNew?: boolean;
}

interface SmartQuickActionsProps {
  onActionClick?: (action: SmartAction) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  performanceMode?: 'normal' | 'optimized';
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

// 🎯 Configuración de acciones inteligentes
const smartActions: SmartAction[] = [
  // Acciones Reciprocidad (Reciprocidad)
  {
    id: 'give-help',
    icon: <AutoAwesomeIcon />,
    label: 'Dar Ayuda',
    path: '/social/give-help',
    color: 'success',
    description: 'Ofrece tu conocimiento o servicios a la comunidad',
    category: 'reciprocidad',
    urgency: 'high',
    completionRate: 85,
    timeEstimate: '10-30 min',
    userLevel: 'beginner',
    isRecommended: true,
  },
  {
    id: 'ask-help',
    icon: <HelpOutlineIcon />,
    label: 'Pedir Ayuda',
    path: '/social/ask-help',
    color: 'primary',
    description: 'Solicita apoyo de otros miembros de CoomÜnity',
    category: 'reciprocidad',
    urgency: 'medium',
    completionRate: 70,
    timeEstimate: '5-15 min',
    userLevel: 'beginner',
  },
  {
    id: 'share-wisdom',
    icon: <ShareIcon />,
    label: 'Compartir Sabiduría',
    path: '/social/share-knowledge',
    color: 'secondary',
    description: 'Comparte una experiencia o lección aprendida',
    category: 'reciprocidad',
    urgency: 'medium',
    completionRate: 60,
    timeEstimate: '15-45 min',
    userLevel: 'intermediate',
  },
  {
    id: 'form-circle',
    icon: <GroupsIcon />,
    label: 'Formar Círculo',
    path: '/social/create-circle',
    color: 'warning',
    description: 'Crea un círculo temático para colaborar',
    category: 'reciprocidad',
    urgency: 'low',
    completionRate: 45,
    timeEstimate: '30-60 min',
    userLevel: 'advanced',
  },

  // Módulos principales
  {
    id: 'continue-learning',
    icon: <VideoLibraryIcon />,
    label: 'Continuar Aprendiendo',
    path: '/uplay',
    color: 'primary',
    description: 'Retoma donde dejaste en ÜPlay',
    category: 'modules',
    urgency: 'high',
    completionRate: 75,
    timeEstimate: '20-60 min',
    userLevel: 'beginner',
    isRecommended: true,
  },
  {
    id: 'browse-marketplace',
    icon: <StoreIcon />,
    label: 'Explorar Marketplace',
    path: '/marketplace',
    color: 'info',
    description: 'Descubre productos y servicios en el Marketplace',
    category: 'modules',
    urgency: 'medium',
    completionRate: 55,
    timeEstimate: '10-30 min',
    userLevel: 'beginner',
  },
  {
    id: 'connect-socially',
    icon: <PeopleIcon />,
    label: 'Red Social',
    path: '/social',
    color: 'secondary',
    description: 'Conecta con otros miembros de la comunidad',
    category: 'modules',
    urgency: 'medium',
    completionRate: 65,
    timeEstimate: '15-45 min',
    userLevel: 'intermediate',
  },
  {
    id: 'view-stats',
    icon: <BarChartIcon />,
    label: 'Ver Estadísticas',
    path: '/ustats',
    color: 'success',
    description: 'Revisa tu progreso y métricas personales',
    category: 'modules',
    urgency: 'low',
    completionRate: 40,
    timeEstimate: '5-15 min',
    userLevel: 'intermediate',
  },

  // Acciones de creación
  {
    id: 'create-content',
    icon: <CreateIcon />,
    label: 'Crear Contenido',
    path: '/create',
    color: 'warning',
    description: 'Crea nuevo contenido para la comunidad',
    category: 'create',
    urgency: 'low',
    completionRate: 30,
    timeEstimate: '45-120 min',
    userLevel: 'advanced',
    isNew: true,
  },
  {
    id: 'discover-opportunities',
    icon: <ExploreIcon />,
    label: 'Explorar Oportunidades',
    path: '/discover',
    color: 'info',
    description: 'Encuentra nuevas oportunidades de colaboración',
    category: 'discover',
    urgency: 'medium',
    completionRate: 50,
    timeEstimate: '15-30 min',
    userLevel: 'intermediate',
    isNew: true,
  },
];

const ActionCard: React.FC<{
  action: SmartAction;
  onClick: (action: SmartAction) => void;
  isCompact?: boolean;
}> = ({ action, onClick, isCompact = false }) => {
  const theme = useTheme();

  const getColorValue = (colorName: typeof action.color) => {
    return theme.palette[colorName].main;
  };

  const getUrgencyColor = (urgency: typeof action.urgency) => {
    switch (urgency) {
      case 'high':
        return UNIFIED_COLORS.elements.fuego.primary;
      case 'medium':
        return UNIFIED_COLORS.elements.aire.primary;
      default:
        return UNIFIED_COLORS.elements.tierra.primary;
    }
  };

  // Mapeo de categorías a elementos cósmicos
  const getCategoryElement = (category: typeof action.category) => {
    switch (category) {
      case 'reciprocidad':
        return 'fuego' as const;
      case 'modules':
        return 'agua' as const;
      case 'create':
        return 'aire' as const;
      case 'discover':
        return 'tierra' as const;
      default:
        return 'espiritu' as const;
    }
  };

  return (
    <CosmicCard
      variant="elevated"
      element={getCategoryElement(action.category)}
      cosmicIntensity="subtle"
      enableGlow={action.isRecommended}
      onClick={() => onClick(action)}
      sx={{
        cursor: 'pointer',
        height: isCompact ? 'auto' : 140,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* Badges */}
      {action.isRecommended && (
        <Chip
          icon={<RecommendIcon />}
          label="Recomendado"
          size="small"
          sx={{
            position: 'absolute',
            top: -8,
            right: 8,
            zIndex: 1,
            background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.tierra.primary} 0%, ${UNIFIED_COLORS.elements.tierra.dark} 100%)`,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem',
          }}
        />
      )}
      {action.isNew && (
        <Chip
          icon={<FlashOnIcon />}
          label="Nuevo"
          size="small"
          sx={{
            position: 'absolute',
            top: -8,
            left: 8,
            zIndex: 1,
            background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.aire.primary} 0%, ${UNIFIED_COLORS.elements.aire.dark} 100%)`,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem',
          }}
        />
      )}

      <CardContent sx={{ padding: isCompact ? 1.5 : 2, height: '100%' }}>
        <Stack
          direction={isCompact ? 'row' : 'column'}
          spacing={isCompact ? 2 : 1}
          alignItems={isCompact ? 'center' : 'flex-start'}
          sx={{ height: '100%' }}
        >
          {/* Icon y urgencia */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: getColorValue(action.color), fontSize: 24 }}>
              {action.icon}
            </Box>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: getUrgencyColor(action.urgency),
                opacity: 0.8,
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            {/* Título */}
            <Typography
              variant={isCompact ? 'body2' : 'subtitle1'}
              fontWeight="bold"
              sx={{
                color: getColorValue(action.color),
                marginBottom: 0.5
              }}
            >
              {action.label}
            </Typography>

            {/* Descripción (solo en modo expandido) */}
            {!isCompact && (
              <Typography
                variant="caption"
                sx={{
                  marginBottom: 1,
                  display: 'block',
                  lineHeight: 1.4,
                  color: alpha('#000', 0.7)
                }}
              >
                {action.description}
              </Typography>
            )}

            {/* Métricas */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ marginTop: 'auto' }}
            >
              <Chip
                label={action.timeEstimate}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
              {action.completionRate !== undefined && (
                <Tooltip title={`${action.completionRate}% tasa de éxito`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon
                      sx={{ fontSize: 12, color: UNIFIED_COLORS.elements.tierra.primary }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: UNIFIED_COLORS.elements.tierra.primary }}
                    >
                      {action.completionRate}%
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </CosmicCard>
  );
};

export const SmartQuickActions: React.FC<SmartQuickActionsProps> = ({
  onActionClick,
  isExpanded = false,
  onToggleExpanded,
  performanceMode = 'normal',
  userLevel = 'beginner',
  className,
}) => {
  const theme = useTheme();

  // 🎯 Filtrar acciones según nivel de usuario y modo de performance
  const filteredActions = useMemo(() => {
    const actions = smartActions.filter((action) => {
      // En modo optimizado, mostrar solo acciones de alta prioridad
      if (performanceMode === 'optimized' && action.urgency === 'low') {
        return false;
      }

      // Filtrar por nivel de usuario
      if (userLevel === 'beginner' && action.userLevel === 'advanced') {
        return false;
      }

      return true;
    });

    // Ordenar por relevancia (recomendadas primero, luego por urgencia)
    actions.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;

      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });

    return actions;
  }, [performanceMode, userLevel]);

  const displayActions = isExpanded
    ? filteredActions
    : filteredActions.slice(0, 4);

  const handleActionClick = useCallback(
    (action: SmartAction) => {
      console.log('🎯 Smart action clicked:', action);
      if (onActionClick) {
        onActionClick(action);
      }
    },
    [onActionClick]
  );

  const toggleExpanded = useCallback(() => {
    if (onToggleExpanded) {
      onToggleExpanded();
    }
  }, [onToggleExpanded]);

  return (
    <CosmicCard
      variant="elevated"
      element="aire"
      cosmicIntensity="subtle"
      enableGlow
      enableAnimations
      sx={{
        minHeight: '320px',
        padding: 3,
      }}
      className={`smart-quick-actions ${className}`}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.agua.primary} 0%, ${UNIFIED_COLORS.elements.fuego.primary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.3rem',
              marginBottom: 0.5
            }}
          >
            💡 Acciones Inteligentes
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha('#000', 0.7),
              fontSize: '0.85rem'
            }}
          >
            Personalizadas para tu nivel: {userLevel}
          </Typography>
        </Box>

        {filteredActions.length > 4 && (
          <IconButton
            onClick={toggleExpanded}
            sx={{
              color: UNIFIED_COLORS.elements.agua.primary,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>

      {/* Actions Grid */}
      <Grid container spacing={2}>
        {displayActions.map((action) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={isExpanded ? 4 : 6}
            key={action.id}
          >
            <ActionCard
              action={action}
              onClick={handleActionClick}
              isCompact={performanceMode === 'optimized'}
            />
          </Grid>
        ))}
      </Grid>

      {/* Summary stats cuando está expandido */}
      {isExpanded && (
        <CosmicCard
          variant="elevated"
          element="aire"
          cosmicIntensity="subtle"
          sx={{
            marginTop: 2,
            padding: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{ color: alpha('#000', 0.8) }}
            >
              📊 Estadísticas:
            </Typography>
            <Chip
              label={`${filteredActions.filter((a) => a.isRecommended).length} recomendadas`}
              size="small"
              sx={{
                background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.tierra.primary} 0%, ${UNIFIED_COLORS.elements.tierra.dark} 100%)`,
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${filteredActions.filter((a) => a.urgency === 'high').length} alta prioridad`}
              size="small"
              sx={{
                background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.fuego.primary} 0%, ${UNIFIED_COLORS.elements.fuego.dark} 100%)`,
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${filteredActions.filter((a) => a.isNew).length} nuevas`}
              size="small"
              sx={{
                background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.aire.primary} 0%, ${UNIFIED_COLORS.elements.aire.dark} 100%)`,
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Stack>
        </CosmicCard>
      )}
    </CosmicCard>
  );
};

export default SmartQuickActions;
