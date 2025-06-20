// UPlay Dashboard - Dashboard Dinámico con Métricas Avanzadas
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Badge,
  IconButton,
  Button,
  Tooltip,
  Stack,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  EmojiEvents,
  Timer,
  Quiz,
  PlayCircle,
  School,
  Speed,
  GpsFixed,
  Celebration,
  ExpandMore,
  Leaderboard,
  Insights,
  Timeline,
  LocalFireDepartment,
  Psychology,
  Groups,
  BookmarkBorder,
  VideoLibrary,
  AccessTime,
  AccountBalance,
  FlashOn,
  Brightness1
} from '@mui/icons-material';
import {
  UserStats,
  Achievement,
  CategoryProgress,
  WeeklyGoals,
  LearningPath,
  VideoCategory,
  AchievementCategory,
  BadgeRarity
} from '../../../../types/uplay';
import { uplayService } from '../../../../services/uplay/uplayService';

interface UPlayDashboardProps {
  userId?: string;
  onNavigateToVideo?: (videoId: string) => void;
  onNavigateToCategory?: (category: VideoCategory) => void;
}

// Componente para gráfico de línea simple (simulado con CSS)
const SparkLine: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#ff6b35' }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <Box sx={{ display: 'flex', alignItems: 'end', height: 40, gap: 0.5 }}>
      {data.map((value, index) => {
        const height = ((value - min) / range) * 100;
        return (
          <Box
            key={index}
            sx={{
              width: 3,
              height: `${Math.max(height, 5)}%`,
              backgroundColor: color,
              borderRadius: 0.5,
              opacity: 0.7 + (height / 100) * 0.3
            }}
          />
        );
      })}
    </Box>
  );
};

// Componente para gráfico circular de progreso
const CircularProgressWithLabel: React.FC<{ 
  value: number; 
  size?: number; 
  thickness?: number;
  color?: string;
  label?: string;
}> = ({ value, size = 80, thickness = 4, color = '#ff6b35', label }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{ color }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary" fontWeight="bold">
          {`${Math.round(value)}%`}
        </Typography>
        {label && (
          <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center' }}>
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export const UPlayDashboard: React.FC<UPlayDashboardProps> = ({
  userId,
  onNavigateToVideo,
  onNavigateToCategory
}) => {
  // State Management
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'week' | 'month' | 'year'>('week');

  // Load Dashboard Data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [statsResponse, achievementsResponse, leaderboardResponse] = await Promise.all([
          uplayService.getUserStats(),
          uplayService.getUserAchievements(),
          uplayService.getLeaderboard(selectedTimePeriod)
        ]);

        if (statsResponse.success) {
          setUserStats(statsResponse.data);
        }

        if (achievementsResponse.success) {
          setAchievements(achievementsResponse.data);
        }

        if (leaderboardResponse.success) {
          setLeaderboard(leaderboardResponse.data);
        }

        // Simular datos de la semana para el gráfico
        setWeeklyData([12, 19, 15, 25, 22, 30, 28]);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedTimePeriod]);

  // Utility Functions
  const getCategoryIcon = (category: VideoCategory) => {
    const icons = {
      [VideoCategory.CHARLAS_INSPIRADORAS]: <Psychology />,
      [VideoCategory.LIFEHACKS_SABIDURIA]: <FlashOn />,
      [VideoCategory.DOCUMENTALES_CONSCIENTES]: <VideoLibrary />,
      [VideoCategory.SABIDURIA_TRANSFORMADORA]: <School />,
      [VideoCategory.SERIES_TEMATICAS]: <Timeline />
    };
    return icons[category] || <PlayCircle />;
  };

  const getCategoryColor = (category: VideoCategory) => {
    const colors = {
      [VideoCategory.CHARLAS_INSPIRADORAS]: '#9c27b0',
      [VideoCategory.LIFEHACKS_SABIDURIA]: '#ff9800',
      [VideoCategory.DOCUMENTALES_CONSCIENTES]: '#2196f3',
      [VideoCategory.SABIDURIA_TRANSFORMADORA]: '#4caf50',
      [VideoCategory.SERIES_TEMATICAS]: '#f44336'
    };
    return colors[category] || '#ff6b35';
  };

  const getBadgeColor = (rarity: BadgeRarity) => {
    const colors = {
      [BadgeRarity.COMMON]: '#95a5a6',
      [BadgeRarity.RARE]: '#3498db',
      [BadgeRarity.EPIC]: '#9b59b6',
      [BadgeRarity.LEGENDARY]: '#f39c12'
    };
    return colors[rarity];
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} sx={{ color: '#ff6b35' }} />
      </Box>
    );
  }

  if (!userStats) {
    return (
      <Alert severity="error">
        Error al cargar las estadísticas del usuario. Por favor, intenta nuevamente.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Estadísticas Generales */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            {/* Videos Completados */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <PlayCircle sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.totalVideosWatched}
                  </Typography>
                  <Typography variant="body2">Videos Completados</Typography>
                  <SparkLine data={weeklyData} color="rgba(255,255,255,0.7)" />
                </CardContent>
              </Card>
            </Grid>

            {/* Tiempo Total */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <AccessTime sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {formatTime(userStats.totalTimeSpent)}
                  </Typography>
                  <Typography variant="body2">Tiempo de Estudio</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+12% esta semana</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Puntos Totales */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Star sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.totalPoints.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Puntos Totales</Typography>
                  <Chip 
                    label={`Nivel ${userStats.level}`} 
                    size="small" 
                    sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Racha Actual */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <LocalFireDepartment sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.currentStreak}
                  </Typography>
                  <Typography variant="body2">Días Consecutivos</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Récord: {userStats.longestStreak} días
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Nivel y Progreso */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Nivel {userStats.level}
              </Typography>
              
              <CircularProgressWithLabel 
                value={(userStats.experiencePoints / userStats.nextLevelXP) * 100}
                size={120}
                thickness={6}
                color="#ff6b35"
                label="Progreso"
              />

              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                {userStats.experiencePoints} / {userStats.nextLevelXP} XP
              </Typography>

              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {userStats.nextLevelXP - userStats.experiencePoints} XP para el siguiente nivel
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Objetivos Semanales */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <GpsFixed sx={{ mr: 1, color: '#ff6b35' }} />
            Objetivos Semanales
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Videos</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {userStats.weeklyGoals.videosWatched}/{userStats.weeklyGoals.videosToWatch}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(userStats.weeklyGoals.videosWatched / userStats.weeklyGoals.videosToWatch) * 100}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,107,53,0.1)' }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tiempo</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatTime(userStats.weeklyGoals.minutesSpent)}/{formatTime(userStats.weeklyGoals.minutesToSpend)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(userStats.weeklyGoals.minutesSpent / userStats.weeklyGoals.minutesToSpend) * 100}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(76,175,80,0.1)' }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Puntos</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {userStats.weeklyGoals.pointsEarned}/{userStats.weeklyGoals.pointsToEarn}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(userStats.weeklyGoals.pointsEarned / userStats.weeklyGoals.pointsToEarn) * 100}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(33,150,243,0.1)' }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Preguntas</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {userStats.weeklyGoals.questionsAnswered}/{userStats.weeklyGoals.questionsToAnswer}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(userStats.weeklyGoals.questionsAnswered / userStats.weeklyGoals.questionsToAnswer) * 100}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(156,39,176,0.1)' }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Progreso por Categorías */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Insights sx={{ mr: 1, color: '#ff6b35' }} />
                Progreso por Categorías
              </Typography>

              <Stack spacing={3}>
                {userStats.categoriesProgress.map((categoryProgress, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: getCategoryColor(categoryProgress.category),
                          width: 32,
                          height: 32,
                          mr: 2
                        }}
                      >
                        {getCategoryIcon(categoryProgress.category)}
                      </Avatar>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {categoryProgress.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                              label={`Nivel ${categoryProgress.level}`}
                              size="small"
                              sx={{ backgroundColor: getCategoryColor(categoryProgress.category), color: 'white' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {categoryProgress.videosCompleted}/{categoryProgress.totalVideos}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <LinearProgress 
                          variant="determinate" 
                          value={(categoryProgress.videosCompleted / categoryProgress.totalVideos) * 100}
                          sx={{ 
                            mt: 1,
                            height: 6, 
                            borderRadius: 3,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getCategoryColor(categoryProgress.category)
                            }
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Promedio: {categoryProgress.averageScore}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Tiempo: {formatTime(categoryProgress.timeSpent)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <IconButton 
                        size="small" 
                        onClick={() => onNavigateToCategory?.(categoryProgress.category)}
                        sx={{ ml: 1 }}
                      >
                        <Brightness1 sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Logros Recientes y Leaderboard */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Logros Recientes */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEvents sx={{ mr: 1, color: '#ffd700' }} />
                  Logros Recientes
                </Typography>

                <List dense>
                  {userStats.recentAchievements.slice(0, 4).map((achievement, index) => (
                    <ListItem key={achievement.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          backgroundColor: getBadgeColor(achievement.rarity),
                          width: 40,
                          height: 40
                        }}>
                          <EmojiEvents sx={{ color: 'white' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={achievement.name}
                        secondary={achievement.description}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button 
                  fullWidth 
                  variant="outlined" 
                  size="small"
                  sx={{ mt: 1, borderColor: '#ff6b35', color: '#ff6b35' }}
                >
                  Ver Todos los Logros
                </Button>
              </CardContent>
            </Card>

            {/* Mini Leaderboard */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Leaderboard sx={{ mr: 1, color: '#ff6b35' }} />
                  Top Semanal
                </Typography>

                <List dense>
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <ListItem key={entry.userId} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Chip
                          label={index + 1}
                          size="small"
                          sx={{
                            backgroundColor: index < 3 ? '#ffd700' : '#e0e0e0',
                            color: index < 3 ? 'white' : 'black',
                            fontWeight: 'bold',
                            width: 24,
                            height: 24
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={entry.username}
                        secondary={`${entry.points} puntos`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Rutas de Aprendizaje */}
      {userStats.learningPath.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Timeline sx={{ mr: 1, color: '#ff6b35' }} />
              Rutas de Aprendizaje Activas
            </Typography>

            <Grid container spacing={2}>
              {userStats.learningPath.slice(0, 3).map((path, index) => (
                <Grid size={{ xs: 12, sm: 4 }} key={path.id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        {path.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {path.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Progreso</Typography>
                          <Typography variant="caption">{Math.round(path.progress)}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={path.progress}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          label={path.difficulty}
                          size="small"
                          color="primary"
                        />
                        <Chip 
                          label={`${path.estimatedTime}min`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        Video {path.currentVideoIndex + 1} de {path.videos.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};