import React, { useState } from 'react';
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

// Import our enhanced design system components
import { ModuleCard, Button } from '../ui';
import { EnhancedModuleCard, EnhancedLoadingState } from '../ui/enhanced';
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
  }[];
  isActive: boolean;
  isNew?: boolean;
  lastActivity?: string;
  userLevel?: string;
  element?: 'tierra' | 'agua' | 'fuego' | 'aire';
}

interface ModuleCardsProps {
  onModuleClick?: (moduleId: string, path: string) => void;
  onModuleHover?: (moduleId: string | null) => void;
  hoveredModule?: string | null;
  isLoading?: boolean;
  performanceMode?: 'normal' | 'optimized';
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
    stats: [
      { label: 'Videos completados', value: '12', icon: <VideoLibrary /> },
      { label: 'Horas de aprendizaje', value: '24h', icon: <TrendingUp /> },
    ],
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
      'Intercambio de productos y servicios basado en principios de Reciprocidad y Bien Común',
    icon: <Store />,
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
    path: '/marketplace',
    stats: [
      { label: 'Intercambios Reciprocidad', value: '8', icon: <Store /> },
      { label: 'Confianza', value: '95%', icon: <Star /> },
    ],
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
    stats: [
      { label: 'Conexiones activas', value: '34', icon: <People /> },
      { label: 'Colaboraciones', value: '12', icon: <TrendingUp /> },
    ],
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
    stats: [
      { label: 'Insights generados', value: '15', icon: <Timeline /> },
      { label: 'Progreso semanal', value: '+23%', icon: <TrendingUp /> },
    ],
    isActive: true,
    userLevel: 'Analista de Progreso',
    lastActivity: 'Hace 3 horas',
    element: 'aire', // Vision and structure
  },
];

export const ModuleCards: React.FC<ModuleCardsProps> = ({
  onModuleClick,
  onModuleHover,
  hoveredModule: externalHoveredModule,
  isLoading = false,
  performanceMode = 'normal',
}) => {
  const navigate = useNavigate();
  const [internalHoveredModule, setInternalHoveredModule] = useState<
    string | null
  >(null);

  // Use external hover state if provided, otherwise use internal state
  const hoveredModule = externalHoveredModule ?? internalHoveredModule;

  const handleModuleClick = (moduleId: string, path: string) => {
    if (onModuleClick) {
      onModuleClick(moduleId, path);
    } else {
      navigate(path);
    }
  };

  const handleModuleHover = (moduleId: string | null) => {
    if (onModuleHover) {
      onModuleHover(moduleId);
    } else {
      setInternalHoveredModule(moduleId);
    }
  };

  if (isLoading) {
    return (
      <Box className="space-y-6">
        {/* Header skeleton */}
        <EnhancedLoadingState
          type="skeleton"
          variant="text"
          size="sm"
          showMessage={false}
        />

        {/* Module cards skeleton */}
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <EnhancedLoadingState
                type="skeleton"
                variant="card"
                size="md"
                showMessage={false}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      {/* Header section with enhanced design tokens */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="mb-6"
      >
        <Box>
          <Typography
            variant="h5"
            className="coomunity-h5 font-bold text-coomunity-900 mb-2 animate-fade-in"
          >
            Módulos CoomÜnity
          </Typography>
          <Typography
            variant="body2"
            className="coomunity-body-sm text-coomunity-600 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            Explora las diferentes dimensiones de tu crecimiento personal y
            comunitario
          </Typography>
        </Box>
        <Badge
          badgeContent={modules.filter((m) => m.isNew).length}
          color="secondary"
          className="animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <Chip
            label={`${modules.filter((m) => m.isActive).length} activos`}
            color="success"
            variant="outlined"
            size="small"
            className="font-medium hover-lift"
          />
        </Badge>
      </Stack>

      {/* Enhanced module grid */}
      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} lg={3} key={module.id}>
            <Box
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <EnhancedModuleCard
                title={module.name}
                description={module.description}
                icon={module.icon}
                color={module.color}
                stats={module.stats}
                isActive={hoveredModule === module.id}
                onClick={() => handleModuleClick(module.id, module.path)}
                className={cn(
                  'module-card-enhanced',
                  getElementColor(module.element || 'aire', 'border'),
                  module.isNew && 'module-card-new'
                )}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced inspirational message */}
      <Box
        className={cn(
          'mt-6 p-6 rounded-xl text-center animate-fade-in',
          'bg-gradient-subtle border border-dashed border-coomunity-300',
          'hover-lift smooth-transition'
        )}
        style={{ animationDelay: '0.5s' }}
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
