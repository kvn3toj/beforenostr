import React, { useMemo, useState } from 'react';
// Imports específicos siguiendo reglas Builder.io
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Imports específicos de iconos siguiendo reglas Builder.io
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import LaunchIcon from '@mui/icons-material/Launch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import {
  errorColors,
  successColors,
  warningColors,
  primaryColors,
  secondaryColors,
  grayColors,
  moduleColors,
  elementColors,
} from '../../utils/theme-helpers';
import { useNavigate } from 'react-router-dom';

interface ModuleData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactElement;
  color: string;
  gradient: string;
  path: string;
  stats: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  benefits: string[];
  nextSteps: string[];
  userLevel: string;
  lastActivity: string;
  completionRate: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  element: 'tierra' | 'agua' | 'fuego' | 'aire';
  relevanceScore: number;
}

interface ModuleFocusProps {
  reciprocidadBalance: number;
  userLevel: string;
  elementos: {
    fuego: number;
    agua: number;
    tierra: number;
    aire: number;
  };
  onModuleClick?: (moduleId: string, path: string) => void;
}

const allModules: ModuleData[] = [
  {
    id: 'uplay',
    name: 'ÜPlay',
    subtitle: 'Aprendizaje Gamificado',
    description: 'Videos interactivos con sistema de progreso personalizado',
    detailedDescription:
      'Sumérgete en experiencias de aprendizaje únicas donde cada video es una aventura. Con nuestro sistema de preguntas gamificadas, no solo consumes contenido, sino que lo integras activamente en tu proceso de crecimiento personal.',
    icon: <VideoLibraryIcon />,
    color: moduleColors.uplay.primary,
    gradient: moduleColors.uplay.gradient,
    path: '/uplay',
    stats: [
      { label: 'Videos completados', value: '12', trend: 'up' },
      { label: 'Horas de aprendizaje', value: '24h', trend: 'up' },
      { label: 'Streak actual', value: '7 días', trend: 'stable' },
    ],
    benefits: [
      'Desarrollo de habilidades prácticas',
      'Gamificación que mantiene motivación',
      'Progreso medible y recompensas',
      'Comunidad de aprendizaje activa',
    ],
    nextSteps: [
      'Completar el curso "Liderazgo Consciente"',
      'Participar en sesión Q&A grupal',
      'Crear tu primer video educativo',
    ],
    userLevel: 'Explorador Visual',
    lastActivity: 'Hace 2 horas',
    completionRate: 68,
    difficulty: 'intermediate',
    estimatedTime: '20 min/día',
    element: 'fuego',
    relevanceScore: 0,
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    subtitle: 'Intercambio Reciprocidad',
    description: 'Ecosistema de intercambio basado en reciprocidad',
    detailedDescription:
      'Participa en una economía alternativa donde el valor se mide por la contribución al Bien Común. Intercambia servicios, conocimientos y productos siguiendo los principios ancestrales del Reciprocidad.',
    icon: <StoreIcon />,
    color: moduleColors.marketplace.primary,
    gradient: moduleColors.marketplace.gradient,
    path: '/marketplace',
    stats: [
      { label: 'Intercambios exitosos', value: '8', trend: 'up' },
      { label: 'Confianza comunitaria', value: '95%', trend: 'stable' },
      { label: 'Valor generado', value: '1,240 Ł', trend: 'up' },
    ],
    benefits: [
      'Equilibra tu balance Reciprocidad',
      'Expande tu red de confianza',
      'Acceso a recursos únicos',
      'Contribución al Bien Común',
    ],
    nextSteps: [
      'Ofrecer tu habilidad principal',
      'Completar un intercambio pendiente',
      'Escribir reseña de colaborador',
    ],
    userLevel: 'Comerciante Confiable',
    lastActivity: 'Hace 1 día',
    completionRate: 45,
    difficulty: 'beginner',
    estimatedTime: '15 min/día',
    element: 'tierra',
    relevanceScore: 0,
  },
  {
    id: 'social',
    name: 'Social',
    subtitle: 'Red de Bien Común',
    description: 'Conexiones auténticas y colaboración comunitaria',
    detailedDescription:
      'Construye relaciones significativas basadas en valores compartidos. Participa en círculos de confianza, ofrece y recibe ayuda, y contribuye al tejido social de la comunidad.',
    icon: <PeopleIcon />,
    color: moduleColors.social.primary,
    gradient: moduleColors.social.gradient,
    path: '/social',
    stats: [
      { label: 'Conexiones activas', value: '34', trend: 'up' },
      { label: 'Ayudas ofrecidas', value: '12', trend: 'up' },
      { label: 'Círculos participando', value: '3', trend: 'stable' },
    ],
    benefits: [
      'Red de apoyo auténtica',
      'Oportunidades de colaboración',
      'Crecimiento personal conjunto',
      'Impacto comunitario real',
    ],
    nextSteps: [
      'Unirse al círculo "Emprendedores"',
      'Ofrecer mentoría en tu especialidad',
      'Participar en evento comunitario',
    ],
    userLevel: 'Tejedor Social',
    lastActivity: 'Hace 30 min',
    completionRate: 72,
    difficulty: 'intermediate',
    estimatedTime: '25 min/día',
    element: 'agua',
    relevanceScore: 0,
  },
  {
    id: 'ustats',
    name: 'ÜStats',
    subtitle: 'Análisis de Crecimiento',
    description: 'Dashboard inteligente de progreso y métricas',
    detailedDescription:
      'Visualiza tu evolución personal con métricas avanzadas e insights inteligentes. Comprende patrones, identifica oportunidades y celebra tu crecimiento con datos significativos.',
    icon: <TimelineIcon />,
    color: moduleColors.ustats.primary,
    gradient: moduleColors.ustats.gradient,
    path: '/ustats',
    stats: [
      { label: 'Insights generados', value: '15', trend: 'up' },
      { label: 'Progreso semanal', value: '+23%', trend: 'up' },
      { label: 'Metas alcanzadas', value: '8/12', trend: 'stable' },
    ],
    benefits: [
      'Claridad en tu progreso',
      'Identificación de patrones',
      'Decisiones basadas en datos',
      'Motivación visual constante',
    ],
    nextSteps: [
      'Revisar insights semanales',
      'Configurar nueva meta trimestral',
      'Analizar correlaciones de actividad',
    ],
    userLevel: 'Analista de Progreso',
    lastActivity: 'Hace 3 horas',
    completionRate: 55,
    difficulty: 'advanced',
    estimatedTime: '10 min/día',
    element: 'aire',
    relevanceScore: 0,
  },
];

const calculateRelevanceScore = (
  module: ModuleData,
  balance: number,
  elementos: { [key: string]: number }
): number => {
  let score = 0;

  // Factor 1: Balance Reciprocidad (40% del peso)
  if (module.id === 'marketplace' && balance < 0.6) {
    score += 40; // Marketplace es crítico para balance bajo
  } else if (module.id === 'social' && balance >= 0.6 && balance < 0.8) {
    score += 35; // Social es bueno para balance medio
  } else if (module.id === 'uplay' && balance >= 0.8) {
    score += 35; // UPlay es ideal para balance alto
  } else if (module.id === 'ustats') {
    score += 25; // UStats siempre es útil pero no crítico
  }

  // Factor 2: Elemento dominante (25% del peso)
  const elementValue = elementos[module.element];
  if (elementValue >= 85) {
    score += 25; // Elemento muy fuerte, aprovechar
  } else if (elementValue <= 70) {
    score += 15; // Elemento débil, necesita desarrollo
  } else {
    score += 20; // Elemento equilibrado
  }

  // Factor 3: Completion rate (20% del peso)
  if (module.completionRate < 50) {
    score += 20; // Mucho por completar
  } else if (module.completionRate < 80) {
    score += 15; // Progreso medio
  } else {
    score += 10; // Casi completado
  }

  // Factor 4: Actividad reciente (15% del peso)
  if (module.lastActivity.includes('min')) {
    score += 15; // Actividad muy reciente
  } else if (module.lastActivity.includes('hora')) {
    score += 12; // Actividad reciente
  } else {
    score += 8; // Actividad menos reciente
  }

  return score;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return successColors[500];
    case 'intermediate':
      return warningColors[500];
    case 'advanced':
      return errorColors[500];
    default:
      return grayColors[500];
  }
};

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up':
      return (
        <TrendingUpIcon sx={{ fontSize: 16, color: successColors[500] }} />
      );
    case 'down':
      return (
        <TrendingUpIcon
          sx={{
            fontSize: 16,
            color: errorColors[500],
            transform: 'rotate(180deg)',
          }}
        />
      );
    case 'stable':
      return <AutoAwesomeIcon sx={{ fontSize: 16, color: grayColors[500] }} />;
    default:
      return null;
  }
};

export const ModuleFocus: React.FC<ModuleFocusProps> = ({
  reciprocidadBalance,
  userLevel,
  elementos,
  onModuleClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [showAllModules, setShowAllModules] = useState(false);

  // Calculate relevance scores and get the most relevant module
  const modulesWithScores = useMemo(() => {
    return allModules
      .map((module) => ({
        ...module,
        relevanceScore: calculateRelevanceScore(module, reciprocidadBalance, elementos),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [reciprocidadBalance, elementos]);

  const recommendedModule = modulesWithScores[0];
  const otherModules = modulesWithScores.slice(1);

  const handleModuleClick = (moduleId: string, path: string) => {
    if (onModuleClick) {
      onModuleClick(moduleId, path);
    } else {
      navigate(path);
    }
  };

  const getRecommendationReason = (module: ModuleData, balance: number) => {
    if (module.id === 'marketplace' && balance < 0.6) {
      return 'Recomendado para equilibrar tu balance Reciprocidad';
    } else if (module.id === 'social' && balance >= 0.6 && balance < 0.8) {
      return 'Perfecto para expandir tu red mientras mantienes balance';
    } else if (module.id === 'uplay' && balance >= 0.8) {
      return 'Ideal para explorar y aprender con balance excelente';
    } else {
      return 'Recomendado según tu progreso actual';
    }
  };

  return (
    <Card
      className="focus-outline"
      role="region"
      aria-label="Módulo recomendado para ti"
      sx={{
        borderRadius: 'var(--radius-3xl)',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        transition: 'var(--transition-normal)',
        '&:hover': {
          boxShadow: 'var(--shadow-xl)',
        },
      }}
    >
      {/* Recommended Module - Hero Section */}
      <Box
        sx={{
          background: recommendedModule.gradient,
          color: 'white',
          p: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-25%',
            width: '150%',
            height: '200%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'gentle-float 8s ease-in-out infinite',
            '@keyframes gentle-float': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-10px) rotate(5deg)' },
            },
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 'var(--space-4)' }}
          >
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Chip
                  label="Recomendado para ti"
                  size="small"
                  icon={<StarIcon />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'var(--font-semibold)',
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
                <Chip
                  label={recommendedModule.difficulty}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: 'var(--text-xs)',
                  }}
                />
              </Stack>
              <Typography
                variant="h5"
                className="text-xl font-bold"
                sx={{ mb: 'var(--space-1)' }}
              >
                {recommendedModule.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.9, fontSize: 'var(--text-sm)' }}
              >
                {recommendedModule.subtitle}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 'var(--space-3)',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {React.cloneElement(recommendedModule.icon, {
                sx: { fontSize: 32, color: 'white' },
              })}
            </Box>
          </Stack>

          {/* Recommendation reason */}
          <Typography
            variant="body2"
            sx={{
              fontStyle: 'italic',
              mb: 'var(--space-4)',
              opacity: 0.9,
            }}
          >
            💡 {getRecommendationReason(recommendedModule, reciprocidadBalance)}
          </Typography>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 'var(--space-4)' }}>
            {recommendedModule.stats.map((stat, index) => (
              <Grid item xs={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.5}
                    sx={{ mb: 'var(--space-1)' }}
                  >
                    <Typography
                      variant="h6"
                      className="font-bold"
                      sx={{ fontSize: 'var(--text-lg)' }}
                    >
                      {stat.value}
                    </Typography>
                    {getTrendIcon(stat.trend)}
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 'var(--text-xs)',
                      opacity: 0.8,
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<LaunchIcon />}
            onClick={() =>
              handleModuleClick(recommendedModule.id, recommendedModule.path)
            }
            className="focus-outline"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'var(--font-semibold)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
              transition: 'var(--transition-normal)',
            }}
          >
            Continuar en {recommendedModule.name}
          </Button>
        </Box>
      </Box>

      {/* Module Details */}
      <Box sx={{ p: 'var(--space-6)' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'var(--gray-700)',
            lineHeight: 'var(--leading-relaxed)',
            mb: 'var(--space-4)',
          }}
        >
          {recommendedModule.detailedDescription}
        </Typography>

        {/* Progress */}
        <Box sx={{ mb: 'var(--space-4)' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 'var(--space-1)' }}
          >
            <Typography
              variant="body2"
              className="font-medium"
              sx={{ color: 'var(--gray-700)' }}
            >
              Tu progreso
            </Typography>
            <Typography
              variant="body2"
              className="font-semibold"
              sx={{ color: recommendedModule.color }}
            >
              {recommendedModule.completionRate}%
            </Typography>
          </Stack>
          <Box
            sx={{
              width: '100%',
              height: 6,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--gray-200)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${recommendedModule.completionRate}%`,
                height: '100%',
                background: recommendedModule.gradient,
                transition: 'width 1s ease-out',
              }}
            />
          </Box>
        </Box>

        {/* Other modules - Collapsed */}
        <Box>
          <Button
            variant="text"
            onClick={() => setShowAllModules(!showAllModules)}
            endIcon={showAllModules ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            fullWidth
            className="focus-outline"
            sx={{
              py: 'var(--space-3)',
              color: 'var(--gray-600)',
              '&:hover': {
                backgroundColor: 'var(--gray-100)',
              },
            }}
          >
            {showAllModules ? 'Ocultar otros módulos' : 'Ver todos los módulos'}
          </Button>

          <Collapse in={showAllModules}>
            <Box sx={{ pt: 'var(--space-4)' }}>
              <Typography
                variant="h6"
                className="font-semibold"
                sx={{ mb: 'var(--space-3)', color: 'var(--gray-800)' }}
              >
                Otros Módulos Disponibles
              </Typography>

              <Grid container spacing={3}>
                {otherModules.map((module) => (
                  <Grid item xs={12} sm={6} md={4} key={module.id}>
                    <Card
                      className="interactive focus-outline"
                      onClick={() => handleModuleClick(module.id, module.path)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleModuleClick(module.id, module.path);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Acceder a ${module.name}: ${module.description}`}
                      sx={{
                        p: 'var(--space-4)',
                        borderRadius: 'var(--radius-xl)',
                        background: alpha(module.color, 0.05),
                        border: `1px solid ${alpha(module.color, 0.2)}`,
                        cursor: 'pointer',
                        height: '100%',
                        '&:hover': {
                          borderColor: module.color,
                          boxShadow: `0 4px 12px ${alpha(module.color, 0.2)}`,
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            p: 'var(--space-2)',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: alpha(module.color, 0.15),
                          }}
                        >
                          {React.cloneElement(module.icon, {
                            sx: { color: module.color, fontSize: 20 },
                          })}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            className="font-semibold"
                            sx={{
                              mb: 'var(--space-1)',
                              color: 'var(--gray-800)',
                            }}
                          >
                            {module.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'var(--gray-600)', display: 'block' }}
                          >
                            {module.subtitle}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: module.color,
                              fontWeight: 'var(--font-medium)',
                              fontSize: 'var(--text-xs)',
                              mt: 'var(--space-1)',
                              display: 'block',
                            }}
                          >
                            {module.completionRate}% completado
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Card>
  );
};
