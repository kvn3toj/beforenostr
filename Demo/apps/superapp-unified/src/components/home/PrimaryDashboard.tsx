import React, { useState, useCallback, useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Imports específicos de iconos siguiendo reglas Builder.io
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WavesIcon from '@mui/icons-material/Waves';
import ParkIcon from '@mui/icons-material/Park';
import AirIcon from '@mui/icons-material/Air';
import {
  errorColors,
  successColors,
  warningColors,
  primaryColors,
  secondaryColors,
  grayColors,
  elementColors,
  getElementColor,
} from '../../utils/theme-helpers';
import { useComponentPerformance } from '../../hooks/home/useHomePerformance';

// Import de colores mejorados
import '../../styles/tokens/colors-enhanced.css';

interface ElementStats {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface PrimaryDashboardProps {
  ondas: number;
  meritos: number;
  ayniLevel: string;
  nextLevel: string;
  ayniProgress: number;
  bienComunContributions: number;
  balanceAyni: number;
  elementos: ElementStats;
  isLoading?: boolean;
}

interface SmartInsight {
  id: string;
  icon: React.ReactElement;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  priority: 'high' | 'medium' | 'low';
}

const generateSmartInsights = (
  balance: number,
  elementos: ElementStats,
  ondas: number,
  meritos: number
): SmartInsight[] => {
  const insights: SmartInsight[] = [];

  // Balance insights
  if (balance >= 0.8) {
    insights.push({
      id: 'excellent-balance',
      icon: <AutoAwesomeIcon sx={{ color: successColors[500] }} />,
      title: 'Excelente Balance Ayni',
      message:
        'Mantienes un equilibrio perfecto entre dar y recibir. ¡Sigue así!',
      actionLabel: 'Explorar nuevas oportunidades',
      priority: 'medium',
    });
  } else if (balance >= 0.6) {
    insights.push({
      id: 'good-balance',
      icon: <TrendingUpIcon sx={{ color: warningColors[500] }} />,
      title: 'Buen Balance, Puede Mejorar',
      message: 'Considera dar un poco más de ayuda para equilibrar tu Ayni.',
      actionLabel: 'Dar ayuda a la comunidad',
      priority: 'high',
    });
  } else {
    insights.push({
      id: 'needs-balance',
      icon: <PsychologyIcon sx={{ color: errorColors[500] }} />,
      title: 'Oportunidad de Crecimiento',
      message: 'Tu balance Ayni mejorará ofreciendo más ayuda a otros.',
      actionLabel: 'Empezar a ayudar',
      priority: 'high',
    });
  }

  // Element insights
  const dominantElement = Object.entries(elementos).reduce((a, b) =>
    elementos[a[0] as keyof ElementStats] >
    elementos[b[0] as keyof ElementStats]
      ? a
      : b
  )[0] as keyof ElementStats;

  const elementIcons = {
    fuego: (
      <LocalFireDepartmentIcon sx={{ color: elementColors.fuego.primary }} />
    ),
    agua: <WavesIcon sx={{ color: elementColors.agua.primary }} />,
    tierra: <ParkIcon sx={{ color: elementColors.tierra.primary }} />,
    aire: <AirIcon sx={{ color: elementColors.aire.primary }} />,
  };

  const elementMessages = {
    fuego: 'Tu pasión y energía transformadora están en su punto máximo.',
    agua: 'Tu capacidad de adaptación y fluidez destacan en la comunidad.',
    tierra: 'Tu estabilidad y confianza son el fundamento sólido del grupo.',
    aire: 'Tus ideas y comunicación elevan el nivel de toda la comunidad.',
  };

  insights.push({
    id: 'dominant-element',
    icon: elementIcons[dominantElement],
    title: `Elemento ${dominantElement.charAt(0).toUpperCase() + dominantElement.slice(1)} Dominante`,
    message: elementMessages[dominantElement],
    priority: 'medium',
  });

  // Progress insights
  const ratio = meritos / ondas;
  if (ratio > 0.5) {
    insights.push({
      id: 'merit-efficiency',
      icon: <EmojiEventsIcon sx={{ color: warningColors[500] }} />,
      title: 'Alta Eficiencia en Mëritos',
      message: `Generas ${ratio.toFixed(
        1
      )} Mëritos por cada Önda. ¡Excelente enfoque!`,
      priority: 'low',
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

const ElementProgressRing: React.FC<{
  element: keyof ElementStats;
  value: number;
  size?: number;
}> = ({ element, value, size = 60 }) => {
  const elementConfig = {
    fuego: {
      color: elementColors.fuego.primary,
      emoji: elementColors.fuego.emoji,
    },
    agua: {
      color: elementColors.agua.primary,
      emoji: elementColors.agua.emoji,
    },
    tierra: {
      color: elementColors.tierra.primary,
      emoji: elementColors.tierra.emoji,
    },
    aire: {
      color: elementColors.aire.primary,
      emoji: elementColors.aire.emoji,
    },
  };

  const config = elementConfig[element];
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={18}
          stroke={grayColors[200]}
          strokeWidth={4}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={18}
          stroke={config.color}
          strokeWidth={4}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          fontSize: size * 0.4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {config.emoji}
      </Box>
    </Box>
  );
};

export const PrimaryDashboard: React.FC<PrimaryDashboardProps> = memo(
  ({
    ondas,
    meritos,
    ayniLevel,
    nextLevel,
    ayniProgress,
    bienComunContributions,
    balanceAyni,
    elementos,
    isLoading = false,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showDetails, setShowDetails] = useState(false);

    // Hook de performance
    const { renderCount, isOptimized } =
      useComponentPerformance('PrimaryDashboard');

    // Memoizar cálculos costosos
    const balancePercentage = useMemo(
      () => Math.round(balanceAyni * 100),
      [balanceAyni]
    );

    const insights = useMemo(
      () => generateSmartInsights(balanceAyni, elementos, ondas, meritos),
      [balanceAyni, elementos, ondas, meritos]
    );

    const formatNumber = useCallback((num: number) => {
      return new Intl.NumberFormat('es-ES').format(num);
    }, []);

    // Log performance en desarrollo
    if (process.env.NODE_ENV === 'development' && !isOptimized) {
      console.warn(
        `⚠️ PrimaryDashboard performance issue - ${renderCount} renders`
      );
    }

    if (isLoading) {
      return (
        <Card className="p-6 rounded-3xl">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Calculando tu balance Ayni...
            </Typography>
          </Box>
        </Card>
      );
    }

    return (
      <Card
        className="home-card-enhanced interactive focus-outline"
        tabIndex={0}
        role="region"
        aria-label="Dashboard principal de Balance Ayni"
        data-testid="primary-dashboard"
        sx={{
          p: 'var(--space-6)',
          borderRadius: 'var(--radius-3xl)',
          background: 'var(--home-card-bg-pure)',
          border: '1px solid var(--home-card-border-enhanced)',
          boxShadow: 'var(--shadow-card-enhanced)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'var(--transition-normal)',
          '&:hover': {
            transform: 'translateY(-4px) translateZ(0)',
            boxShadow: 'var(--shadow-card-hover)',
          },
          '&:focus-within': {
            boxShadow: 'var(--shadow-card-focus)',
          },
        }}
      >
        {/* Hero Section - Balance Principal */}
        <Box sx={{ textAlign: 'center', mb: 'var(--space-6)' }}>
          <Typography
            variant="h1"
            className="home-percentage-display text-6xl font-extrabold leading-none"
            sx={{
              color: 'var(--home-percentage-text) !important',
              mb: 'var(--space-2)',
              fontSize: { xs: '3rem', sm: '4rem', md: '6rem' },
              fontWeight: 800,
              lineHeight: 0.9,
              textShadow: 'none',
              // Forzar negro puro para máximo contraste
              background: 'none !important',
              backgroundClip: 'unset !important',
              WebkitBackgroundClip: 'unset !important',
              WebkitTextFillColor: 'var(--home-percentage-text) !important',
              // Asegurar máximo contraste sin gradientes
              '@supports (background-clip: text)': {
                background: 'none !important',
                WebkitTextFillColor: 'var(--home-percentage-text) !important',
              },
            }}
          >
            {balancePercentage}%
          </Typography>

          <Typography
            variant="h2"
            className="home-heading-enhanced text-2xl font-semibold"
            sx={{
              color: 'var(--home-heading-primary) !important',
              mb: 'var(--space-4)',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              fontWeight: 700,
            }}
          >
            Balance Ayni Personal
          </Typography>

          {/* Smart Progress Indicator */}
          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 'var(--space-4)' }}>
            <LinearProgress
              variant="determinate"
              value={balancePercentage}
              className="progress-enhanced"
              sx={{
                height: 8,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--progress-bg-enhanced)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 'var(--radius-full)',
                  backgroundColor:
                    balanceAyni >= 0.8
                      ? 'var(--progress-fill-success)'
                      : balanceAyni >= 0.6
                        ? 'var(--progress-fill-warning)'
                        : 'var(--progress-fill-error)',
                  transition: 'var(--transition-normal)',
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'right',
                mt: 'var(--space-1)',
                color: 'var(--gray-500)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {ayniLevel} → {nextLevel}
            </Typography>
          </Box>
        </Box>

        {/* Smart Insights */}
        <Box sx={{ mb: 'var(--space-6)' }}>
          <Typography
            variant="h6"
            className="text-lg font-semibold home-heading-enhanced"
            sx={{
              mb: 'var(--space-3)',
              color: 'var(--home-heading-primary) !important',
              fontWeight: 700,
            }}
          >
            Insights Inteligentes
          </Typography>

          <Stack spacing={2}>
            {insights.slice(0, 2).map((insight) => (
              <Box
                key={insight.id}
                sx={{
                  p: 'var(--space-4)',
                  borderRadius: 'var(--radius-xl)',
                  background:
                    insight.priority === 'high'
                      ? errorColors[50]
                      : insight.priority === 'medium'
                        ? primaryColors[50]
                        : grayColors[50],
                  border: `1px solid ${
                    insight.priority === 'high'
                      ? errorColors[200]
                      : insight.priority === 'medium'
                        ? primaryColors[200]
                        : grayColors[200]
                  }`,
                  transition: 'var(--transition-normal)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 'var(--shadow-md)',
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ mt: 0.5 }}>{insight.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      className="font-semibold"
                      sx={{ mb: 'var(--space-1)', color: 'var(--gray-800)' }}
                    >
                      {insight.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'var(--gray-600)', mb: 'var(--space-2)' }}
                    >
                      {insight.message}
                    </Typography>
                    {insight.actionLabel && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={insight.onAction}
                        sx={{
                          fontSize: 'var(--text-xs)',
                          py: 'var(--space-1)',
                          px: 'var(--space-2)',
                        }}
                      >
                        {insight.actionLabel}
                      </Button>
                    )}
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Key Metrics Preview */}
        <Grid container spacing={3} sx={{ mb: 'var(--space-6)' }}>
          <Grid size={{ xs: 4 }}>
            <Box className="text-center">
              <Typography
                variant="h4"
                className="metric-ondas home-metric-enhanced text-xl font-bold"
                sx={{
                  color: 'var(--metric-ondas-text) !important',
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(ondas)}
              </Typography>
              <Typography
                variant="caption"
                className="text-xs font-medium"
                sx={{
                  color: 'var(--home-text-subtle)',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Öndas
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Box className="text-center">
              <Typography
                variant="h4"
                className="metric-meritos home-metric-enhanced text-xl font-bold"
                sx={{
                  color: 'var(--metric-meritos-text) !important',
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(meritos)}
              </Typography>
              <Typography
                variant="caption"
                className="text-xs font-medium"
                sx={{
                  color: 'var(--home-text-subtle)',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Mëritos
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Box className="text-center">
              <Typography
                variant="h4"
                className="metric-bien-comun home-metric-enhanced text-xl font-bold"
                sx={{
                  color: 'var(--metric-bien-comun-text) !important',
                  mb: 'var(--space-1)',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(bienComunContributions)}
              </Typography>
              <Typography
                variant="caption"
                className="text-xs font-medium"
                sx={{
                  color: 'var(--home-text-subtle)',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Bien Común
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progressive Disclosure */}
        <Button
          variant="text"
          onClick={() => setShowDetails(!showDetails)}
          endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          fullWidth
          className="home-interactive-enhanced focus-outline"
          sx={{
            py: 'var(--space-3)',
            color: 'var(--home-interactive-default)',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'var(--home-card-bg-subtle)',
              color: 'var(--home-interactive-hover)',
            },
            '&:focus-visible': {
              backgroundColor: 'var(--home-card-bg-subtle)',
              color: 'var(--home-interactive-focus)',
              outline: '2px solid var(--home-interactive-focus)',
              outlineOffset: '2px',
            },
          }}
        >
          {showDetails ? 'Ocultar análisis detallado' : 'Ver análisis completo'}
        </Button>

        {/* Detailed Analysis - Collapsed */}
        <Collapse in={showDetails}>
          <Box
            sx={{
              pt: 'var(--space-4)',
              borderTop: '1px solid var(--gray-200)',
            }}
          >
            {/* Level Progress */}
            <Box sx={{ mb: 'var(--space-6)' }}>
              <Typography
                variant="h6"
                className="font-semibold"
                sx={{ mb: 'var(--space-3)' }}
              >
                Progreso de Nivel
              </Typography>
              <Box sx={{ mb: 'var(--space-2)' }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 'var(--space-1)' }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {ayniLevel}
                  </Typography>
                  <Chip
                    label={`Próximo: ${nextLevel}`}
                    size="small"
                    variant="outlined"
                    icon={<TrendingUpIcon />}
                    sx={{
                      color: 'var(--home-text-medium)',
                      borderColor: 'var(--home-card-border-enhanced)',
                      backgroundColor: 'var(--home-card-bg-subtle)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      '& .MuiChip-icon': {
                        color: 'var(--home-interactive-default)',
                      },
                    }}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={ayniProgress}
                  sx={{
                    height: 6,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: primaryColors[100],
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--gradient-primary)',
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    mt: 'var(--space-1)',
                    color: 'var(--gray-500)',
                  }}
                >
                  {ayniProgress}% completado
                </Typography>
              </Box>
            </Box>

            {/* Elemental Balance */}
            <Box sx={{ mb: 'var(--space-6)' }}>
              <Typography
                variant="h6"
                className="font-semibold"
                sx={{ mb: 'var(--space-4)' }}
              >
                Balance Elemental
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {(Object.keys(elementos) as Array<keyof ElementStats>).map(
                  (element) => (
                    <Grid size={{ xs: 3 }} key={element}>
                      <Box className="text-center">
                        <ElementProgressRing
                          element={element}
                          value={elementos[element]}
                          size={isMobile ? 50 : 60}
                        />
                        <Typography
                          variant="caption"
                          className="text-xs font-medium"
                          sx={{
                            display: 'block',
                            mt: 'var(--space-2)',
                            color: 'var(--gray-600)',
                            textTransform: 'capitalize',
                          }}
                        >
                          {element}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-xs"
                          sx={{ color: 'var(--gray-500)' }}
                        >
                          {elementos[element]}%
                        </Typography>
                      </Box>
                    </Grid>
                  )
                )}
              </Grid>
            </Box>

            {/* All Insights */}
            <Box>
              <Typography
                variant="h6"
                className="font-semibold"
                sx={{ mb: 'var(--space-3)' }}
              >
                Todos los Insights
              </Typography>
              <Stack spacing={2}>
                {insights.map((insight) => (
                  <Box
                    key={insight.id}
                    sx={{
                      p: 'var(--space-3)',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--gray-50)',
                      border: '1px solid var(--gray-200)',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      {insight.icon}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          className="font-medium"
                          sx={{ color: 'var(--gray-800)' }}
                        >
                          {insight.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'var(--gray-600)' }}
                        >
                          {insight.message}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Collapse>
      </Card>
    );
  }
);
