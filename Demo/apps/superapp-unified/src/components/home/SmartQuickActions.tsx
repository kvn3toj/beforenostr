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

interface SmartAction {
  id: string;
  icon: React.ReactElement;
  label: string;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  description: string;
  category: 'ayni' | 'modules' | 'create' | 'discover';
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
  // Acciones Ayni (Reciprocidad)
  {
    id: 'give-help',
    icon: <AutoAwesomeIcon />,
    label: 'Dar Ayuda',
    path: '/social/give-help',
    color: 'success',
    description: 'Ofrece tu conocimiento o servicios a la comunidad',
    category: 'ayni',
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
    category: 'ayni',
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
    category: 'ayni',
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
    category: 'ayni',
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
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      default:
        return theme.palette.success.main;
    }
  };

  return (
    <Card
      elevation={0}
      onClick={() => onClick(action)}
      sx={{
        cursor: 'pointer',
        bgcolor: alpha(getColorValue(action.color), 0.08),
        border: `1px solid ${alpha(getColorValue(action.color), 0.2)}`,
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'visible',
        height: isCompact ? 'auto' : 140,
        '&:hover': {
          bgcolor: alpha(getColorValue(action.color), 0.12),
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 20px ${alpha(getColorValue(action.color), 0.2)}`,
        },
        '&:active': {
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Badges */}
      {action.isRecommended && (
        <Chip
          icon={<RecommendIcon />}
          label="Recomendado"
          size="small"
          color="success"
          sx={{
            position: 'absolute',
            top: -8,
            right: 8,
            zIndex: 1,
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
          color="warning"
          sx={{
            position: 'absolute',
            top: -8,
            left: 8,
            zIndex: 1,
            fontWeight: 'bold',
            fontSize: '0.7rem',
          }}
        />
      )}

      <CardContent sx={{ p: isCompact ? 1.5 : 2, height: '100%' }}>
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
              sx={{ color: getColorValue(action.color), mb: 0.5 }}
            >
              {action.label}
            </Typography>

            {/* Descripción (solo en modo expandido) */}
            {!isCompact && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: 'block', lineHeight: 1.4 }}
              >
                {action.description}
              </Typography>
            )}

            {/* Métricas */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 'auto' }}
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
                      sx={{ fontSize: 12, color: 'success.main' }}
                    />
                    <Typography variant="caption" color="success.main">
                      {action.completionRate}%
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
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
    let actions = smartActions.filter((action) => {
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
    <Box className={className}>
      <Card
        elevation={1}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Acciones Inteligentes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Personalizadas para tu nivel: {userLevel}
              </Typography>
            </Box>

            {filteredActions.length > 4 && (
              <IconButton onClick={toggleExpanded}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Stack>

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
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: alpha(theme.palette.info.main, 0.08),
                borderRadius: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="caption" fontWeight="bold">
                  📊 Estadísticas:
                </Typography>
                <Chip
                  label={`${filteredActions.filter((a) => a.isRecommended).length} recomendadas`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`${filteredActions.filter((a) => a.urgency === 'high').length} alta prioridad`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
                <Chip
                  label={`${filteredActions.filter((a) => a.isNew).length} nuevas`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SmartQuickActions;
