import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  Stack,
  alpha,
  useTheme,
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
  },
];

const ModuleCard: React.FC<{
  module: ModuleData;
  onClick: (moduleId: string, path: string) => void;
}> = ({ module, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `2px solid transparent`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: `0 20px 40px ${alpha(module.color, 0.3)}`,
          border: `2px solid ${alpha(module.color, 0.4)}`,
          '& .module-header': {
            transform: 'scale(1.05)',
          },
          '& .launch-icon': {
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      }}
      onClick={() => onClick(module.id, module.path)}
    >
      {/* Header con gradiente y animación */}
      <Box
        className="module-header"
        sx={{
          height: 140,
          background: module.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {/* Elementos decorativos de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.1),
            animation: 'pulse 3s infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
            animation: 'pulse 3s infinite 1.5s',
          }}
        />

        {/* Icono principal */}
        <Avatar
          sx={{
            bgcolor: alpha('#fff', 0.25),
            color: '#fff',
            width: 72,
            height: 72,
            zIndex: 2,
            backdropFilter: 'blur(10px)',
            border: `2px solid ${alpha('#fff', 0.3)}`,
          }}
        >
          <Box sx={{ fontSize: 32 }}>{module.icon}</Box>
        </Avatar>

        {/* Icono de lanzamiento en hover */}
        <IconButton
          className="launch-icon"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0,
            transition: 'all 0.3s ease-in-out',
            bgcolor: alpha('#fff', 0.9),
            color: module.color,
            zIndex: 3,
            '&:hover': {
              bgcolor: '#fff',
              transform: 'translate(-50%, -50%) scale(1.1)',
            },
          }}
        >
          <Launch />
        </IconButton>

        {/* Badge de nuevo módulo */}
        {module.isNew && (
          <Chip
            label="NUEVO"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: '#fff',
              color: module.color,
              fontWeight: 'bold',
              fontSize: '0.7rem',
              animation: 'bounce 2s infinite',
            }}
          />
        )}

        {/* Indicador de estado */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Circle
            sx={{
              fontSize: 8,
              color: module.isActive ? '#4caf50' : '#f44336',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: alpha('#fff', 0.9),
              fontWeight: 'bold',
              fontSize: '0.7rem',
            }}
          >
            {module.isActive ? 'ACTIVO' : 'INACTIVO'}
          </Typography>
        </Box>
      </Box>

      {/* Contenido de la tarjeta */}
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          {/* Título y subtítulo */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {module.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                mb: 1,
              }}
            >
              {module.subtitle}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {module.description}
            </Typography>
          </Box>

          {/* Estadísticas y nivel de usuario */}
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Chip
                label={`${module.stats.value} ${module.stats.label}`}
                size="small"
                sx={{
                  bgcolor: alpha(module.color, 0.1),
                  color: module.color,
                  fontWeight: 'bold',
                  border: `1px solid ${alpha(module.color, 0.2)}`,
                }}
                icon={<TrendingUp sx={{ fontSize: 16 }} />}
              />
              <Tooltip title={`Nivel actual en ${module.name}`}>
                <Star sx={{ color: module.color, fontSize: 18 }} />
              </Tooltip>
            </Stack>

            {/* Nivel de usuario y última actividad */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'bold',
                  color: module.color,
                  fontSize: '0.7rem',
                }}
              >
                {module.userLevel}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.7rem' }}
              >
                {module.lastActivity}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
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
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Módulos CoomÜnity
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
          />
        </Badge>
      </Stack>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} lg={3} key={module.id}>
            <ModuleCard module={module} onClick={handleModuleClick} />
          </Grid>
        ))}
      </Grid>

      {/* Mensaje inspiracional */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha('#9c27b0', 0.05)} 0%, ${alpha('#2196f3', 0.05)} 50%, ${alpha('#4caf50', 0.05)} 100%)`,
          border: `1px dashed ${alpha('#9c27b0', 0.2)}`,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: 'italic', mb: 1 }}
        >
          🌟 "Cada módulo es una puerta hacia una nueva dimensión de tu
          potencial"
        </Typography>
        <Typography variant="caption" color="text.secondary">
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
