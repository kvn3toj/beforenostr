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
  Fade,
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
import type { PlayerMetrics as PlayerMetricsType } from '../../../../hooks/interactive-video/useGamificationMetrics';

interface PlayerMetricsProps {
  metrics: PlayerMetricsType;
  progressToNextLevel: {
    current: number;
    required: number;
    percentage: number;
  };
  accuracyRate: number;
  showDetailed?: boolean;
  compact?: boolean;
}

const PlayerMetrics: React.FC<PlayerMetricsProps> = ({
  metrics,
  progressToNextLevel,
  accuracyRate,
  showDetailed = false,
  compact = false,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return '#7c3aed'; // Epic purple
    if (streak >= 5) return '#f59e0b';  // Gold
    if (streak >= 3) return '#10b981';  // Green
    return '#6b7280'; // Gray
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return '#10b981'; // Excellent
    if (accuracy >= 75) return '#f59e0b'; // Good
    if (accuracy >= 60) return '#ef4444'; // Needs improvement
    return '#6b7280'; // Starting
  };

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Level */}
        <Tooltip title={`Nivel ${metrics.level} - ${progressToNextLevel.percentage.toFixed(0)}% al siguiente nivel`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
              {metrics.level}
            </Typography>
          </Box>
        </Tooltip>

        {/* Mëritos */}
        <Tooltip title="Mëritos - Recompensas por contribuir al Bien Común">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DiamondIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
              {formatNumber(metrics.meritos)}
            </Typography>
          </Box>
        </Tooltip>

        {/* Öndas */}
        <Tooltip title="Öndas - Energía vibracional positiva">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BoltIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
              {formatNumber(metrics.ondas)}
            </Typography>
          </Box>
        </Tooltip>

        {/* Streak */}
        {metrics.currentStreak > 0 && (
          <Tooltip title={`Racha actual: ${metrics.currentStreak} respuestas correctas consecutivas`}>
            <Chip
              label={`${metrics.currentStreak}🔥`}
              size="small"
              sx={{
                backgroundColor: getStreakColor(metrics.currentStreak),
                color: 'white',
                fontWeight: 600,
                fontSize: '10px',
                height: 20,
              }}
            />
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#1f2937',
              mb: 1,
            }}
          >
            Progreso Ayni
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              fontWeight: 500,
            }}
          >
            Tu viaje de aprendizaje consciente
          </Typography>
        </Box>

        {/* Level and Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ fontSize: 20, color: '#f59e0b' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Nivel {metrics.level}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
              {progressToNextLevel.current} / {progressToNextLevel.required} EXP
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressToNextLevel.percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#f3f4f6',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#7c3aed',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Main Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          {/* Mëritos */}
          <Box
            sx={{
              p: 2,
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
            }}
          >
            <DiamondIcon sx={{ fontSize: 24, color: '#7c3aed', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
              {formatNumber(metrics.meritos)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
              Mëritos
            </Typography>
          </Box>

          {/* Öndas */}
          <Box
            sx={{
              p: 2,
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
            }}
          >
            <BoltIcon sx={{ fontSize: 24, color: '#f59e0b', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
              {formatNumber(metrics.ondas)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
              Öndas
            </Typography>
          </Box>
        </Box>

        {/* Performance Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: showDetailed ? 3 : 0 }}>
          {/* Accuracy */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: getAccuracyColor(accuracyRate),
                mb: 0.5,
              }}
            >
              {accuracyRate.toFixed(0)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
              Precisión
            </Typography>
          </Box>

          {/* Current Streak */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: getStreakColor(metrics.currentStreak),
                mb: 0.5,
              }}
            >
              {metrics.currentStreak}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
              Racha Actual
            </Typography>
          </Box>
        </Box>

        {/* Detailed Stats */}
        {showDetailed && (
          <Box
            sx={{
              pt: 3,
              borderTop: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {metrics.questionsAnswered}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Preguntas Respondidas
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {metrics.correctAnswers}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Respuestas Correctas
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {formatTime(metrics.totalWatchTime)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Tiempo de Estudio
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {formatNumber(metrics.experiencePoints)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Experiencia Total
              </Typography>
            </Box>
          </Box>
        )}

        {/* Ayni Philosophy Note */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#0369a1',
              fontWeight: 500,
              fontStyle: 'italic',
              textAlign: 'center',
              display: 'block',
            }}
          >
            "En el equilibrio del Ayni, cada respuesta correcta fortalece el Bien Común"
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default PlayerMetrics;
