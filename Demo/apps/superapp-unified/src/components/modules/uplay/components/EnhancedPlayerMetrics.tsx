import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  Divider,
  Zoom,
  Fade,
  IconButton,
  Badge,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Diamond as DiamondIcon,
  Bolt as BoltIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface PlayerMetricsData {
  merits: number;
  ondas: number;
  level: number;
  experience: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  sessionScore: number;
  engagementLevel: number;
  timeSpent: number;
  videosCompleted: number;
}

interface MetricChange {
  merits: number;
  ondas: number;
  experience: number;
  score: number;
}

interface EnhancedPlayerMetricsProps {
  metrics: PlayerMetricsData;
  progressToNextLevel: number;
  experienceForNextLevel: number;
  accuracyRate: number;
  sessionStartTime: Date;
  isCompact?: boolean;
  showAnimations?: boolean;
  onMetricClick?: (metric: string) => void;
}

const EnhancedPlayerMetrics: React.FC<EnhancedPlayerMetricsProps> = ({
  metrics,
  progressToNextLevel,
  experienceForNextLevel,
  accuracyRate,
  sessionStartTime,
  isCompact = false,
  showAnimations = true,
  onMetricClick,
}) => {
  const [previousMetrics, setPreviousMetrics] =
    useState<PlayerMetricsData>(metrics);
  const [changes, setChanges] = useState<MetricChange>({
    merits: 0,
    ondas: 0,
    experience: 0,
    score: 0,
  });
  const [showChangeAnimation, setShowChangeAnimation] = useState(false);

  // Track changes in metrics for animations
  useEffect(() => {
    const newChanges = {
      merits: metrics.merits - previousMetrics.merits,
      ondas: metrics.ondas - previousMetrics.ondas,
      experience: metrics.experience - previousMetrics.experience,
      score: metrics.sessionScore - previousMetrics.sessionScore,
    };

    if (
      newChanges.merits ||
      newChanges.ondas ||
      newChanges.experience ||
      newChanges.score
    ) {
      setChanges(newChanges);
      setShowChangeAnimation(true);

      setTimeout(() => {
        setShowChangeAnimation(false);
      }, 3000);
    }

    setPreviousMetrics(metrics);
  }, [metrics, previousMetrics]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 0.9) return '#10b981'; // green
    if (engagement >= 0.7) return '#f59e0b'; // yellow
    if (engagement >= 0.5) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getEngagementLabel = (engagement: number) => {
    if (engagement >= 0.9) return 'Excelente';
    if (engagement >= 0.7) return 'Muy Bueno';
    if (engagement >= 0.5) return 'Bueno';
    return 'Puede Mejorar';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    if (streak >= 3) return '✨';
    return '💫';
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return '#8b5cf6'; // purple
    if (level >= 15) return '#3b82f6'; // blue
    if (level >= 10) return '#10b981'; // green
    if (level >= 5) return '#f59e0b'; // yellow
    return '#6b7280'; // gray
  };

  const sessionDuration = Math.floor(
    (Date.now() - sessionStartTime.getTime()) / 1000
  );

  if (isCompact) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: '#fbbf24',
                    position: 'relative',
                  }}
                >
                  {metrics.merits}
                  {showAnimations && changes.merits > 0 && (
                    <Zoom in={showChangeAnimation}>
                      <Chip
                        label={`+${changes.merits}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -20,
                          backgroundColor: '#fbbf24',
                          color: 'white',
                          fontSize: '10px',
                          height: 20,
                        }}
                      />
                    </Zoom>
                  )}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Mëritos
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: '#10b981',
                    position: 'relative',
                  }}
                >
                  {metrics.ondas}
                  {showAnimations && changes.ondas > 0 && (
                    <Zoom in={showChangeAnimation}>
                      <Chip
                        label={`+${changes.ondas}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -20,
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontSize: '10px',
                          height: 20,
                        }}
                      />
                    </Zoom>
                  )}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Öndas
                </Typography>
              </Box>
            </Grid>

            <Grid size={3}>
              <Box textAlign="center">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: getLevelColor(metrics.level),
                  }}
                >
                  {metrics.level}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Nivel
                </Typography>
              </Box>
            </Grid>

            <Grid size={3}>
              <Box textAlign="center">
                {metrics.currentStreak > 0 && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#ef4444',
                      }}
                    >
                      {metrics.currentStreak}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Racha {getStreakEmoji(metrics.currentStreak)}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header Card */}
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            p: 3,
            position: 'relative',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <TrophyIcon sx={{ mr: 1, fontSize: 32 }} />
            Panel de Jugador
            <IconButton
              size="small"
              sx={{ ml: 'auto', color: 'rgba(255,255,255,0.8)' }}
              onClick={() => onMetricClick?.('refresh')}
            >
              <RefreshIcon />
            </IconButton>
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Nivel {metrics.level} • {accuracyRate.toFixed(1)}% precisión •{' '}
            {formatTime(sessionDuration)} sesión
          </Typography>

          {/* Level Progress */}
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Progreso al Nivel {metrics.level + 1}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {progressToNextLevel}/{experienceForNextLevel} XP
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(progressToNextLevel / experienceForNextLevel) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background:
                    'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                },
              }}
            />
          </Box>
        </Box>

        {/* Achievement Notifications */}
        {showAnimations && changes.experience > 0 && (
          <Zoom in={showChangeAnimation}>
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
              }}
            >
              <Chip
                icon={<StarIcon />}
                label={`+${changes.experience} XP`}
                sx={{
                  backgroundColor: '#fbbf24',
                  color: 'white',
                  fontWeight: 600,
                  animation: 'bounce 1s ease-in-out',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '40%': {
                      transform: 'translateY(-10px)',
                    },
                    '60%': {
                      transform: 'translateY(-5px)',
                    },
                  },
                }}
              />
            </Box>
          </Zoom>
        )}
      </Card>

      {/* Core Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-4px)' },
              position: 'relative',
              overflow: 'visible',
            }}
            onClick={() => onMetricClick?.('merits')}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <DiamondIcon sx={{ color: '#fbbf24', mr: 1 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background:
                      'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {(metrics.merits || 0).toLocaleString()}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Mëritos
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Moneda del ecosistema
              </Typography>

              {/* Change indicator */}
              {showAnimations && changes.merits > 0 && (
                <Fade in={showChangeAnimation}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    +{changes.merits}
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-4px)' },
              position: 'relative',
              overflow: 'visible',
            }}
            onClick={() => onMetricClick?.('ondas')}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <BoltIcon sx={{ color: '#10b981', mr: 1 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background:
                      'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {metrics.ondas}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Öndas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Energía vibracional
              </Typography>

              {/* Change indicator */}
              {showAnimations && changes.ondas > 0 && (
                <Fade in={showChangeAnimation}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    +{changes.ondas}
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => onMetricClick?.('level')}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <StarIcon sx={{ color: getLevelColor(metrics.level), mr: 1 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: getLevelColor(metrics.level),
                  }}
                >
                  {metrics.level}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Nivel
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(progressToNextLevel / experienceForNextLevel) * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  mt: 1,
                  bgcolor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    backgroundColor: getLevelColor(metrics.level),
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => onMetricClick?.('streak')}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <FireIcon sx={{ color: '#ef4444', mr: 1 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background:
                      'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {metrics.maxStreak}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Mejor Racha
              </Typography>
              {metrics.currentStreak > 0 && (
                <Chip
                  label={`Actual: ${metrics.currentStreak} ${getStreakEmoji(metrics.currentStreak)}`}
                  size="small"
                  sx={{
                    mt: 0.5,
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    fontWeight: 600,
                    fontSize: '11px',
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <PsychologyIcon sx={{ mr: 1, color: '#6366f1' }} />
                Nivel de Compromiso
                <Tooltip title="Basado en precisión de respuestas y participación">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.engagementLevel * 100}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: '#f3f4f6',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        backgroundColor: getEngagementColor(
                          metrics.engagementLevel
                        ),
                      },
                    }}
                  />
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {Math.round(metrics.engagementLevel * 100)}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: getEngagementColor(metrics.engagementLevel),
                      fontWeight: 600,
                    }}
                  >
                    {getEngagementLabel(metrics.engagementLevel)}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  icon={<QuizIcon />}
                  label={`${metrics.questionsAnswered} preguntas`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<CheckIcon />}
                  label={`${accuracyRate.toFixed(1)}% precisión`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: getEngagementColor(accuracyRate / 100),
                    color: getEngagementColor(accuracyRate / 100),
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TimerIcon sx={{ mr: 1, color: '#10b981' }} />
                Estadísticas de Sesión
              </Typography>

              <Grid container spacing={2}>
                <Grid size={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      {formatTime(sessionDuration)}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Tiempo Activo
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        background:
                          'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {metrics.sessionScore}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Puntos de Sesión
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h5"
                      color="success.main"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      {metrics.videosCompleted}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Videos Completados
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h5"
                      color="warning.main"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      {Math.round(metrics.timeSpent)}s
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Tiempo Total
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Session Summary */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SchoolIcon sx={{ mr: 1, color: '#8b5cf6' }} />
            Resumen de Aprendizaje
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Tu rendimiento en esta sesión ha sido{' '}
                  <strong
                    style={{
                      color: getEngagementColor(metrics.engagementLevel),
                    }}
                  >
                    {getEngagementLabel(metrics.engagementLevel).toLowerCase()}
                  </strong>
                  . Has demostrado un gran compromiso con el aprendizaje de la
                  filosofía CoomÜnity.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    icon={<StarIcon />}
                    label={`Nivel ${metrics.level}`}
                    size="small"
                    sx={{
                      bgcolor: '#e0e7ff',
                      color: '#3730a3',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<FireIcon />}
                    label={`Racha máxima: ${metrics.maxStreak}`}
                    size="small"
                    sx={{
                      bgcolor: '#fef2f2',
                      color: '#991b1b',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<TrophyIcon />}
                    label={`${metrics.sessionScore} puntos`}
                    size="small"
                    sx={{
                      bgcolor: '#f0fdf4',
                      color: '#166534',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      background:
                        'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    {Math.round(metrics.engagementLevel * 100)}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Compromiso Total
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EnhancedPlayerMetrics;
