import React from 'react';
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
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Diamond as DiamondIcon,
  Bolt as BoltIcon,
  TrendingUp as TrendingIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

interface PlayerMetricsProps {
  gameState: {
    score: number;
    merits: number;
    ondas: number;
    questionsAnswered: number;
    correctAnswers: number;
    currentStreak: number;
    maxStreak: number;
    level: number;
    experience: number;
    experienceToNext: number;
    totalWatchTime: number;
    videosCompleted: number;
    averageEngagement: number;
    achievements: any[];
    badges: any[];
    sessionStartTime: Date;
    sessionWatchTime: number;
    sessionsThisWeek: number;
    weeklyGoal: number;
  };
}

const PlayerMetrics: React.FC<PlayerMetricsProps> = ({ gameState }) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 0.9) return '#10b981'; // green
    if (engagement >= 0.7) return '#f59e0b'; // yellow
    if (engagement >= 0.5) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    if (streak >= 3) return '✨';
    return '💫';
  };

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Header with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <TrophyIcon sx={{ mr: 1 }} />
          Panel de Métricas del Jugador
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Nivel {gameState.level} • {gameState.achievements.length} Logros •{' '}
          {formatTime(gameState.totalWatchTime)} total
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Core Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {gameState.merits.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Mëritos
              </Typography>
              <Chip
                icon={<DiamondIcon />}
                label="Moneda del ecosistema"
                size="small"
                sx={{
                  bgcolor: '#fef3c7',
                  color: '#92400e',
                  '& .MuiChip-icon': { color: '#f59e0b' },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background:
                    'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {gameState.ondas}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Öndas
              </Typography>
              <Chip
                icon={<BoltIcon />}
                label="Energía vibracional"
                size="small"
                sx={{
                  bgcolor: '#dcfce7',
                  color: '#166534',
                  '& .MuiChip-icon': { color: '#10b981' },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
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
                {gameState.level}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Nivel
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(gameState.experience % 500) / 5}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background:
                      'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {gameState.experience % 500}/500 XP
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background:
                    'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {gameState.maxStreak}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Mejor Racha
              </Typography>
              {gameState.currentStreak > 0 && (
                <Chip
                  icon={<span>{getStreakEmoji(gameState.currentStreak)}</span>}
                  label={`Actual: ${gameState.currentStreak}`}
                  size="small"
                  sx={{
                    bgcolor: '#fee2e2',
                    color: '#991b1b',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Engagement and Performance Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box>
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
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={gameState.averageEngagement * 100}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: '#f3f4f6',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        backgroundColor: getEngagementColor(
                          gameState.averageEngagement
                        ),
                      },
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 60 }}>
                  {Math.round(gameState.averageEngagement * 100)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {gameState.questionsAnswered > 0
                  ? `${gameState.correctAnswers}/${gameState.questionsAnswered} respuestas correctas`
                  : 'Sin preguntas respondidas aún'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
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
                Progreso Semanal
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (gameState.sessionsThisWeek / gameState.weeklyGoal) * 100
                    }
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: '#f3f4f6',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        background:
                          'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                      },
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 60 }}>
                  {gameState.sessionsThisWeek}/{gameState.weeklyGoal}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {gameState.weeklyGoal - gameState.sessionsThisWeek > 0
                  ? `Faltan ${gameState.weeklyGoal - gameState.sessionsThisWeek} sesiones para completar tu meta`
                  : '¡Meta semanal completada! 🎉'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Learning Stats */}
        <Box>
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
            Estadísticas de Aprendizaje
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  {gameState.videosCompleted}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Videos Completados
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color="success.main"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  {formatTime(gameState.totalWatchTime)}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Tiempo Total
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color="warning.main"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  {gameState.achievements.length}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Logros Desbloqueados
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color="error.main"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  {gameState.badges.length}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Insignias Activas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Session Info */}
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: '#1e293b' }}
          >
            📊 Sesión Actual
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip
              icon={<TimerIcon />}
              label={`Iniciada: ${gameState.sessionStartTime.toLocaleTimeString()}`}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<TrendingIcon />}
              label={`Tiempo: ${Math.floor(gameState.sessionWatchTime / 60)}m`}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<CheckIcon />}
              label={`Precisión: ${gameState.questionsAnswered > 0 ? Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100) : 0}%`}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlayerMetrics;
