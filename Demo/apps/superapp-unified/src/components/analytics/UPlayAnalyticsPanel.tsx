import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as TrophyIcon,
  Favorite as HeartIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useAnalytics, useUserProgress } from '../../hooks/useAnalytics';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div" fontWeight="bold" color={`${color}.main`}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingIcon 
                fontSize="small" 
                color={trend.isPositive ? 'success' : 'error'}
                sx={{ 
                  transform: trend.isPositive ? 'none' : 'rotate(180deg)',
                  mr: 0.5
                }}
              />
              <Typography 
                variant="caption" 
                color={trend.isPositive ? 'success.main' : 'error.main'}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  unit?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  label, 
  value, 
  max, 
  color = 'primary',
  unit = ''
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight="medium">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}{unit} / {max}{unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(percentage, 100)}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        {percentage.toFixed(1)}% completado
      </Typography>
    </Box>
  );
};

export const UPlayAnalyticsPanel: React.FC = () => {
  const { 
    dashboardMetrics, 
    videoAnalytics, 
    myEngagement, 
    systemHealth,
    isLoading 
  } = useAnalytics();
  
  const { progress, isLoading: isLoadingProgress } = useUserProgress();

  if (isLoading || isLoadingProgress) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} md={6} lg={3} key={item}>
              <Skeleton variant="rectangular" height={140} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatAccuracy = (accuracy: number) => {
    return `${accuracy.toFixed(1)}%`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Mis Estadísticas ÜPlay
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rastrea tu progreso y mejora en tu experiencia de aprendizaje gamificado
        </Typography>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Videos Vistos"
            value={progress.totalViews}
            subtitle="Total de reproducciones"
            icon={<PlayIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Videos Completados"
            value={progress.completedVideos}
            subtitle="Terminados completamente"
            icon={<CheckIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Tiempo Total"
            value={formatTime(progress.totalWatchTime)}
            subtitle="Tiempo de visualización"
            icon={<TimerIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Precisión"
            value={formatAccuracy(progress.accuracy)}
            subtitle={`${progress.correctAnswers}/${progress.questionsAnswered} preguntas`}
            icon={<QuizIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Progress Section */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🎯 Mi Progreso
            </Typography>
            
            <ProgressBar
              label="Videos Completados"
              value={progress.completedVideos}
              max={progress.totalViews || 1}
              color="success"
            />
            
            <ProgressBar
              label="Preguntas Correctas"
              value={progress.correctAnswers}
              max={progress.questionsAnswered || 1}
              color="warning"
            />
            
            <ProgressBar
              label="Tiempo Promedio por Video"
              value={progress.averageWatchTime}
              max={1800} // 30 minutos como máximo esperado
              color="secondary"
              unit="s"
            />

            <Divider sx={{ my: 3 }} />

            {/* Achievement Badges */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🏆 Logros Recientes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {progress.completedVideos >= 5 && (
                <Chip 
                  icon={<TrophyIcon />} 
                  label="Explorer: 5+ Videos" 
                  color="primary" 
                  size="small"
                />
              )}
              {progress.accuracy >= 80 && (
                <Chip 
                  icon={<QuizIcon />} 
                  label="Maestro: 80%+ Precisión" 
                  color="success" 
                  size="small"
                />
              )}
              {progress.totalWatchTime >= 3600 && (
                <Chip 
                  icon={<TimerIcon />} 
                  label="Dedicated: 1+ Hora" 
                  color="secondary" 
                  size="small"
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📈 Actividad Reciente
            </Typography>
            
            {myEngagement.length > 0 ? (
              <List>
                {myEngagement.slice(0, 6).map((engagement, index) => {
                  const getActivityIcon = (eventType: string) => {
                    switch (eventType) {
                      case 'video_view': return <PlayIcon color="primary" />;
                      case 'video_complete': return <CheckIcon color="success" />;
                      case 'question_answer': return <QuizIcon color="warning" />;
                      case 'video_shared': return <ShareIcon color="secondary" />;
                      default: return <HeartIcon color="action" />;
                    }
                  };

                  const getActivityText = (eventType: string, metadata?: any) => {
                    switch (eventType) {
                      case 'video_view': return 'Reprodujo un video';
                      case 'video_complete': return 'Completó un video';
                      case 'question_answer': 
                        return `Respondió pregunta ${metadata?.isCorrect ? '✅' : '❌'}`;
                      case 'video_shared': return 'Compartió un video';
                      default: return 'Actividad registrada';
                    }
                  };

                  return (
                    <ListItem key={`${engagement.id}-${index}`} divider={index < 5}>
                      <ListItemIcon>
                        {getActivityIcon(engagement.eventType)}
                      </ListItemIcon>
                      <ListItemText
                        primary={getActivityText(engagement.eventType, engagement.metadata)}
                        secondary={
                          new Date(engagement.createdAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        }
                      />
                      {engagement.duration && (
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(engagement.duration)}
                        </Typography>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No hay actividad reciente
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ¡Empieza a ver videos para ver tu progreso aquí!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* System Health (if available) */}
        {systemHealth && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Estado del Sistema:
                </Typography>
                <Chip
                  label={systemHealth.status}
                  color={
                    systemHealth.status === 'healthy' ? 'success' :
                    systemHealth.status === 'warning' ? 'warning' : 'error'
                  }
                  size="small"
                />
                {systemHealth.memoryUsage && (
                  <Typography variant="caption" color="text.secondary">
                    Memoria: {systemHealth.memoryUsage.percentage.toFixed(1)}%
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};