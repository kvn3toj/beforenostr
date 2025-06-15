import React from 'react';
import {
  Grid,
  Typography,
  Avatar,
  Chip,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  VideoLibrary,
  Store,
  People,
  Timeline,
  Circle,
  TrendingUp,
  Star,
  Launch,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import our new design system components
import { ModuleCard, Button } from '../ui';
import { cn, getElementColor } from '../../utils/styles';

interface ModuleData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  gradient: string;
  path: string;
  stats: {
    label: string;
    value: string;
  };
  isActive: boolean;
  isNew?: boolean;
  lastActivity?: string;
  userLevel?: string;
  element?: 'tierra' | 'agua' | 'fuego' | 'aire';
}

interface ModuleCardsProps {
  onModuleClick?: (moduleId: string, path: string) => void;
}

const modules: ModuleData[] = [
  {
    id: 'uplay',
    name: 'ÜPlay',
    subtitle: 'GPL - Gamified Play List',
    description:
      'Videos interactivos con preguntas gamificadas y sistema de progreso personalizado',
    icon: <VideoLibrary />,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
    path: '/uplay',
    stats: { label: 'Videos completados', value: '12' },
    isActive: true,
    userLevel: 'Explorador Visual',
    lastActivity: 'Hace 2 horas',
    element: 'fuego', // Passion and action
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    subtitle: 'GMP - Gamified Match Place',
    description:
      'Intercambio de productos y servicios basado en principios de Ayni y Bien Común',
    icon: <Store />,
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
    path: '/marketplace',
    stats: { label: 'Intercambios Ayni', value: '8' },
    isActive: true,
    userLevel: 'Comerciante Confiable',
    lastActivity: 'Hace 1 día',
    element: 'tierra', // Stability and trust
  },
  {
    id: 'social',
    name: 'Social',
    subtitle: 'Red de Bien Común',
    description:
      'Conexiones auténticas, colaboración y construcción de comunidades basadas en valores',
    icon: <People />,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
    path: '/social',
    stats: { label: 'Conexiones activas', value: '34' },
    isActive: true,
    isNew: true,
    userLevel: 'Tejedor Social',
    lastActivity: 'Hace 30 min',
    element: 'agua', // Flow and adaptability
  },
  {
    id: 'ustats',
    name: 'ÜStats',
    subtitle: 'Métricas de Crecimiento',
    description:
      'Dashboard personalizado de progreso, estadísticas y insights de desarrollo personal',
    icon: <Timeline />,
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
    path: '/ustats',
    stats: { label: 'Insights generados', value: '15' },
    isActive: true,
    userLevel: 'Analista de Progreso',
    lastActivity: 'Hace 3 horas',
    element: 'aire', // Vision and structure
  },
];

const ModuleCardComponent: React.FC<{
  module: ModuleData;
  onClick: (moduleId: string, path: string) => void;
}> = ({ module, onClick }) => {
  return (
    <ModuleCard
      onClick={() => onClick(module.id, module.path)}
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:-translate-y-2",
        "hover:shadow-coomunity-lg",
        "border-2 border-transparent hover:border-coomunity-300"
      )}
      style={{
        '--module-color': module.color,
        '--module-gradient': module.gradient,
      } as React.CSSProperties}
    >
      {/* Header with gradient and animation */}
      <Box
        className={cn(
          "relative h-36 flex items-center justify-center overflow-hidden",
          "transition-transform duration-300 group-hover:scale-105"
        )}
        sx={{
          background: module.gradient,
        }}
      >
        {/* Decorative background elements */}
        <Box
          className={cn(
            "absolute -top-8 -right-8 w-32 h-32 rounded-full",
            "bg-white/10 animate-pulse-slow"
          )}
        />
        <Box
          className={cn(
            "absolute -bottom-5 -left-5 w-20 h-20 rounded-full",
            "bg-white/5 animate-pulse-slow"
          )}
          style={{ animationDelay: '1.5s' }}
        />

        {/* Main icon */}
        <Avatar
          className={cn(
            "w-18 h-18 bg-white/25 backdrop-blur-sm border-2 border-white/30",
            "transition-all duration-300 group-hover:scale-110"
          )}
          sx={{ color: '#fff' }}
        >
          <Box sx={{ fontSize: 32 }}>{module.icon}</Box>
        </Avatar>

        {/* Launch icon on hover */}
        <IconButton
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "opacity-0 scale-0 transition-all duration-300",
            "group-hover:opacity-100 group-hover:scale-100",
            "bg-white/90 hover:bg-white z-10"
          )}
          sx={{ color: module.color }}
        >
          <Launch />
        </IconButton>

        {/* New module badge */}
        {module.isNew && (
          <Chip
            label="NUEVO"
            size="small"
            className={cn(
              "absolute top-3 right-3 bg-white font-bold text-xs",
              "animate-bounce"
            )}
            sx={{ color: module.color }}
          />
        )}

        {/* Status indicator */}
        <Box className="absolute top-3 left-3 flex items-center gap-1">
          <Circle
            sx={{
              fontSize: 8,
              color: module.isActive ? '#4caf50' : '#f44336',
            }}
          />
          <Typography
            variant="caption"
            className="text-white/90 font-bold text-xs"
          >
            {module.isActive ? 'ACTIVO' : 'INACTIVO'}
          </Typography>
        </Box>
      </Box>

      {/* Content using design tokens */}
      <Box className="p-6 space-y-4">
        {/* Title and subtitle */}
        <Box className="space-y-2">
          <Typography 
            variant="h6" 
            className="coomunity-h6 font-bold text-coomunity-900"
          >
            {module.name}
          </Typography>
          <Typography
            variant="caption"
            className={cn(
              "block font-bold text-xs uppercase tracking-wider mb-2",
              getElementColor(module.element || 'aire', 'text')
            )}
          >
            {module.subtitle}
          </Typography>
          <Typography
            variant="body2"
            className="coomunity-body-sm text-coomunity-600 line-clamp-2"
          >
            {module.description}
          </Typography>
        </Box>

        {/* Statistics and user level */}
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label={`${module.stats.value} ${module.stats.label}`}
              size="small"
              className={cn(
                "font-bold border",
                getElementColor(module.element || 'aire', 'chip')
              )}
              icon={<TrendingUp sx={{ fontSize: 16 }} />}
            />
            <Tooltip title={`Nivel actual en ${module.name}`}>
              <Star 
                sx={{ 
                  color: module.color, 
                  fontSize: 18,
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.2)' }
                }} 
              />
            </Tooltip>
          </Stack>

          {/* User level and last activity */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="caption"
              className={cn(
                "font-bold text-xs",
                getElementColor(module.element || 'aire', 'text')
              )}
            >
              {module.userLevel}
            </Typography>
            <Typography
              variant="caption"
              className="text-coomunity-500 text-xs"
            >
              {module.lastActivity}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </ModuleCard>
  );
};

export const ModuleCards: React.FC<ModuleCardsProps> = ({ onModuleClick }) => {
  const navigate = useNavigate();

  const handleModuleClick = (moduleId: string, path: string) => {
    if (onModuleClick) {
      onModuleClick(moduleId, path);
    } else {
      navigate(path);
    }
  };

  return (
    <Box className="space-y-6">
      {/* Header section with design tokens */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="mb-6"
      >
        <Box>
          <Typography 
            variant="h5" 
            className="coomunity-h5 font-bold text-coomunity-900 mb-2"
          >
            Módulos CoomÜnity
          </Typography>
          <Typography 
            variant="body2" 
            className="coomunity-body-sm text-coomunity-600"
          >
            Explora las diferentes dimensiones de tu crecimiento personal y
            comunitario
          </Typography>
        </Box>
        <Badge
          badgeContent={modules.filter((m) => m.isNew).length}
          color="secondary"
        >
          <Chip
            label={`${modules.filter((m) => m.isActive).length} activos`}
            color="success"
            variant="outlined"
            size="small"
            className="font-medium"
          />
        </Badge>
      </Stack>

      {/* Module grid */}
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} lg={3} key={module.id}>
            <ModuleCardComponent module={module} onClick={handleModuleClick} />
          </Grid>
        ))}
      </Grid>

      {/* Inspirational message with design tokens */}
      <Box
        className={cn(
          "mt-6 p-6 rounded-xl text-center",
          "bg-gradient-to-r from-coomunity-50 via-blue-50 to-green-50",
          "border border-dashed border-coomunity-300"
        )}
      >
        <Typography
          variant="body2"
          className="coomunity-body-sm text-coomunity-700 italic mb-2"
        >
          🌟 "Cada módulo es una puerta hacia una nueva dimensión de tu
          potencial"
        </Typography>
        <Typography 
          variant="caption" 
          className="coomunity-caption text-coomunity-600"
        >
          Desarrolla equilibradamente todas las áreas de tu ser para contribuir
          plenamente al Bien Común
        </Typography>
      </Box>
    </Box>
  );
};

// Agregar keyframes para animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 0.4; }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
`;
document.head.appendChild(style);
