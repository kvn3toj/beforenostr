import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  EmojiEvents,
  Whatshot,
  Speed,
  Timer,
  PlayCircle,
  CheckCircle,
  Star,
  Bolt,
  Diamond,
  Notifications,
  Settings,
} from '@mui/icons-material';
import { usePlayerMetrics, useUnlockedAchievements, useUnreadNotifications } from '../../../../stores/uplayStore';

// ============================================================================
// INTERFACES
// ============================================================================

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: number;
  format?: 'number' | 'percentage' | 'time' | 'level';
}

interface ProgressRingProps {
  value: number;
  max: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
  format = 'number',
}) => {
  const formatValue = (val: number | string, fmt: string) => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'time':
        const hours = Math.floor(val / 3600);
        const minutes = Math.floor((val % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      case 'level':
        return `Nivel ${val}`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
            {icon}
          </Avatar>
          {trend !== undefined && (
            <Chip
              size="small"
              icon={<TrendingUp />}
              label={`${trend > 0 ? '+' : ''}${trend}`}
              color={trend > 0 ? 'success' : trend < 0 ? 'error' : 'default'}
              variant="outlined"
            />
          )}
        </Box>
        
        <Typography variant="h4" fontWeight="bold" color={color} gutterBottom>
          {formatValue(value, format)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max,
  size,
  strokeWidth,
  color,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      <Box
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const PlayerMetricsDashboard: React.FC = () => {
  const playerMetrics = usePlayerMetrics();
  const unlockedAchievements = useUnlockedAchievements();
  const unreadNotifications = useUnreadNotifications();

  // Cálculos derivados
  const derivedMetrics = useMemo(() => {
    const {
      meritos,
      ondas,
      level,
      experience,
      experienceToNext,
      questionsAnswered,
      correctAnswers,
      currentStreak,
      maxStreak,
      totalWatchTime,
      completedVideos,
      precision,
    } = playerMetrics;

    return {
      // Progreso de nivel
      levelProgress: experienceToNext > 0 ? ((experience / (experience + experienceToNext)) * 100) : 100,
      
      // Eficiencia de aprendizaje
      learningEfficiency: questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0,
      
      // Tiempo promedio por video
      avgTimePerVideo: completedVideos > 0 ? totalWatchTime / completedVideos : 0,
      
      // Puntuación de engagement
      engagementScore: Math.min(100, (currentStreak * 10) + (precision * 0.5) + (completedVideos * 2)),
      
      // Ratio Mëritos/Öndas
      meritOndasRatio: ondas > 0 ? meritos / ondas : 0,
      
      // Logros recientes (últimos 7 días)
      recentAchievements: unlockedAchievements.filter(
        a => a.unlockedAt && new Date(a.unlockedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
    };
  }, [playerMetrics, unlockedAchievements]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con notificaciones */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard de Métricas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tu progreso en el ecosistema CoomÜnity
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Tooltip title="Notificaciones">
            <IconButton>
              <Badge badgeContent={unreadNotifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Configuración">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Mëritos Totales"
            value={playerMetrics.meritos}
            icon={<Diamond />}
            color="#9c27b0"
            subtitle="Contribuciones al Bien Común"
          />
        </Grid>
        
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Öndas Generadas"
            value={playerMetrics.ondas}
            icon={<Bolt />}
            color="#ff9800"
            subtitle="Energía vibracional positiva"
          />
        </Grid>
        
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Nivel Actual"
            value={playerMetrics.level}
            icon={<Star />}
            color="#2196f3"
            format="level"
            subtitle={`${playerMetrics.experienceToNext} XP para siguiente`}
          />
        </Grid>
        
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Racha Actual"
            value={playerMetrics.currentStreak}
            icon={<Whatshot />}
            color="#f44336"
            subtitle={`Máxima: ${playerMetrics.maxStreak}`}
          />
        </Grid>
      </Grid>

      {/* Progreso y estadísticas detalladas */}
      <Grid container spacing={3} mb={4}>
        {/* Progreso de nivel */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progreso de Nivel
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <ProgressRing
                  value={playerMetrics.level}
                  max={playerMetrics.level + 1}
                  size={80}
                  strokeWidth={8}
                  color="#2196f3"
                  label="Nivel"
                />
                
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Experiencia: {playerMetrics.experience.toLocaleString()} XP
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={derivedMetrics.levelProgress}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {playerMetrics.experienceToNext} XP para nivel {playerMetrics.level + 1}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Estadísticas de aprendizaje */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas de Aprendizaje
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Precisión"
                    secondary={`${playerMetrics.precision.toFixed(1)}% (${playerMetrics.correctAnswers}/${playerMetrics.questionsAnswered})`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PlayCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Videos Completados"
                    secondary={`${playerMetrics.completedVideos} videos`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Timer color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tiempo Total"
                    secondary={`${Math.floor(playerMetrics.totalWatchTime / 3600)}h ${Math.floor((playerMetrics.totalWatchTime % 3600) / 60)}m`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Speed color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Engagement"
                    secondary={`${derivedMetrics.engagementScore.toFixed(0)}/100`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logros y análisis */}
      <Grid container spacing={3}>
        {/* Logros recientes */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  Logros Desbloqueados
                </Typography>
                <Chip
                  icon={<EmojiEvents />}
                  label={`${unlockedAchievements.length} total`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {unlockedAchievements.length > 0 ? (
                <List dense>
                  {unlockedAchievements.slice(0, 5).map((achievement) => (
                    <ListItem key={achievement.id}>
                      <ListItemIcon>
                        <Typography variant="h6">{achievement.icon}</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={achievement.title}
                        secondary={achievement.description}
                      />
                      <Chip
                        size="small"
                        label={`+${achievement.reward.meritos}M +${achievement.reward.ondas}Ö`}
                        color="success"
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  ¡Completa tu primer video para desbloquear logros!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Análisis de rendimiento */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Análisis de Rendimiento
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid size={{xs:6}}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {derivedMetrics.learningEfficiency.toFixed(0)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Eficiencia de Aprendizaje
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{xs:6}}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="secondary" fontWeight="bold">
                      {derivedMetrics.avgTimePerVideo.toFixed(0)}m
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tiempo Promedio/Video
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{xs:6}}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {derivedMetrics.meritOndasRatio.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ratio Mëritos/Öndas
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{xs:6}}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {derivedMetrics.recentAchievements}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Logros Esta Semana
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {derivedMetrics.engagementScore >= 80 && "🔥 ¡Excelente engagement!"}
                  {derivedMetrics.engagementScore >= 60 && derivedMetrics.engagementScore < 80 && "👍 Buen progreso"}
                  {derivedMetrics.engagementScore < 60 && "💪 ¡Sigue así, vas mejorando!"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerMetricsDashboard; 