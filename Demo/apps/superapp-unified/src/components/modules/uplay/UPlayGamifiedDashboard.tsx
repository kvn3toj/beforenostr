import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Fab,
  Badge,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  Dashboard,
  EmojiEvents,
  Settings,
  Notifications,
  Menu,
  Close,
  VideoLibrary,
  TrendingUp,
  Whatshot,
  Diamond,
  Bolt,
  Star,
  AutoAwesome,
  Celebration,
} from '@mui/icons-material';

// Importar componentes mejorados
import { PlayerMetricsDashboard } from './components/PlayerMetricsDashboard';
import { EnhancedRewardFeedback, useRewardFeedback } from './components/EnhancedRewardFeedback';
import { UnifiedUPlayPlayer } from './UnifiedUPlayPlayer';

// Importar hooks y stores
import { useOptimizedQuestions } from '../../hooks/interactive-video/useOptimizedQuestions';
import { 
  useUPlayStore, 
  usePlayerMetrics, 
  useUnreadNotifications,
  useCurrentSession,
  useUnlockedAchievements 
} from '../../../stores/uplayStore';

// ============================================================================
// INTERFACES
// ============================================================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  rewards: {
    meritos: number;
    ondas: number;
  };
  isCompleted: boolean;
  progress: number;
  questionsCount?: number;
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  videos: VideoItem[];
  totalRewards: {
    meritos: number;
    ondas: number;
  };
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const VideoCard: React.FC<{ video: VideoItem; onPlay: (videoId: string) => void }> = ({ 
  video, 
  onPlay 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#757575';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          '& .play-overlay': {
            opacity: 1,
          },
        },
      }}
      onClick={() => onPlay(video.id)}
    >
      <Box
        sx={{
          height: 180,
          background: `linear-gradient(135deg, ${getDifficultyColor(video.difficulty)}20, ${getDifficultyColor(video.difficulty)}10)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
        }}
      >
        {/* Emoji como thumbnail */}
        <Typography variant="h1" sx={{ fontSize: '4rem' }}>
          {video.thumbnail}
        </Typography>
        
        {/* Overlay de play */}
        <Box
          className="play-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Fab
            size="large"
            color="primary"
            sx={{
              bgcolor: 'rgba(255,255,255,0.95)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <PlayArrow sx={{ color: '#1976d2', fontSize: '2rem' }} />
          </Fab>
        </Box>
        
        {/* Badge de completado */}
        {video.isCompleted && (
          <Chip
            label="✓ Completado"
            color="success"
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              fontWeight: 'bold',
            }}
          />
        )}
        
        {/* Badge de dificultad */}
        <Chip
          label={getDifficultyLabel(video.difficulty)}
          size="small"
          sx={{ 
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: getDifficultyColor(video.difficulty),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>
      
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {video.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {video.description}
        </Typography>
        
        {/* Información del video */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="caption" color="text.secondary">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            {video.questionsCount && ` • ${video.questionsCount} preguntas`}
          </Typography>
        </Box>
        
        {/* Recompensas */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" gap={1}>
            <Chip
              icon={<Diamond sx={{ fontSize: '16px !important' }} />}
              label={`${video.rewards.meritos} Mëritos`}
              size="small"
              variant="outlined"
              sx={{ 
                color: '#9c27b0',
                borderColor: '#9c27b0',
                '& .MuiChip-icon': { color: '#9c27b0' },
              }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '16px !important' }} />}
              label={`${video.rewards.ondas} Öndas`}
              size="small"
              variant="outlined"
              sx={{ 
                color: '#ff9800',
                borderColor: '#ff9800',
                '& .MuiChip-icon': { color: '#ff9800' },
              }}
            />
          </Box>
        </Box>
        
        {/* Barra de progreso */}
        {video.progress > 0 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" color="text.secondary">
                Progreso
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(video.progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={video.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: video.isCompleted ? '#4caf50' : '#1976d2',
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const UPlayGamifiedDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados locales
  const [tabValue, setTabValue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Zustand store
  const playerMetrics = usePlayerMetrics();
  const unreadNotifications = useUnreadNotifications();
  const currentSession = useCurrentSession();
  const unlockedAchievements = useUnlockedAchievements();
  const { showRewardFeedback, setCurrentVideo } = useUPlayStore();

  // Hook de feedback de recompensas
  const { showReward, hideReward } = useRewardFeedback();

  // ========================================================================
  // DATOS MOCK MEJORADOS
  // ========================================================================

  const mockCategories: CategoryData[] = [
    {
      id: 'filosofia',
      name: 'Filosofía CoomÜnity',
      description: 'Aprende los principios fundamentales de Ayni y Bien Común',
      icon: <AutoAwesome />,
      color: '#9c27b0',
      totalRewards: { meritos: 500, ondas: 250 },
      videos: [
        {
          id: 'ayni-intro',
          title: 'Introducción al Ayni',
          description: 'Descubre el principio de reciprocidad que guía nuestra comunidad',
          thumbnail: '🌱',
          duration: 180,
          difficulty: 'easy' as const,
          category: 'Filosofía',
          rewards: { meritos: 100, ondas: 50 },
          isCompleted: false,
          progress: 0,
          questionsCount: 3,
        },
        {
          id: 'bien-comun',
          title: 'El Bien Común',
          description: 'Cómo priorizamos el bienestar colectivo sobre el individual',
          thumbnail: '🤝',
          duration: 240,
          difficulty: 'medium' as const,
          category: 'Filosofía',
          rewards: { meritos: 150, ondas: 75 },
          isCompleted: true,
          progress: 100,
          questionsCount: 4,
        },
        {
          id: 'ondas-energia',
          title: 'Öndas: Energía Vibracional',
          description: 'Comprende cómo generar y compartir energía positiva',
          thumbnail: '⚡',
          duration: 300,
          difficulty: 'hard' as const,
          category: 'Filosofía',
          rewards: { meritos: 200, ondas: 100 },
          isCompleted: false,
          progress: 25,
          questionsCount: 5,
        },
      ],
    },
    {
      id: 'gamificacion',
      name: 'Sistema de Gamificación',
      description: 'Domina las mecánicas de juego y progresión',
      icon: <EmojiEvents />,
      color: '#ff9800',
      totalRewards: { meritos: 750, ondas: 400 },
      videos: [
        {
          id: 'meritos-sistema',
          title: 'Sistema de Mëritos',
          description: 'Aprende cómo ganar y usar Mëritos efectivamente',
          thumbnail: '💎',
          duration: 200,
          difficulty: 'easy' as const,
          category: 'Gamificación',
          rewards: { meritos: 120, ondas: 60 },
          isCompleted: false,
          progress: 0,
          questionsCount: 3,
        },
        {
          id: 'niveles-progresion',
          title: 'Niveles y Progresión',
          description: 'Entiende cómo avanzar en tu viaje de aprendizaje',
          thumbnail: '📈',
          duration: 220,
          difficulty: 'medium' as const,
          category: 'Gamificación',
          rewards: { meritos: 180, ondas: 90 },
          isCompleted: false,
          progress: 60,
          questionsCount: 4,
        },
        {
          id: 'logros-avanzados',
          title: 'Logros Avanzados',
          description: 'Desbloquea los logros más desafiantes de CoomÜnity',
          thumbnail: '🏆',
          duration: 350,
          difficulty: 'hard' as const,
          category: 'Gamificación',
          rewards: { meritos: 300, ondas: 150 },
          isCompleted: false,
          progress: 0,
          questionsCount: 6,
        },
      ],
    },
    {
      id: 'colaboracion',
      name: 'Colaboración y Comunidad',
      description: 'Aprende a colaborar efectivamente en el ecosistema',
      icon: <Celebration />,
      color: '#4caf50',
      totalRewards: { meritos: 600, ondas: 350 },
      videos: [
        {
          id: 'trabajo-equipo',
          title: 'Trabajo en Equipo',
          description: 'Estrategias para colaborar efectivamente',
          thumbnail: '👥',
          duration: 190,
          difficulty: 'easy' as const,
          category: 'Colaboración',
          rewards: { meritos: 110, ondas: 70 },
          isCompleted: false,
          progress: 0,
          questionsCount: 3,
        },
        {
          id: 'liderazgo-consciente',
          title: 'Liderazgo Consciente',
          description: 'Desarrolla habilidades de liderazgo alineadas con Ayni',
          thumbnail: '🌟',
          duration: 280,
          difficulty: 'medium' as const,
          category: 'Colaboración',
          rewards: { meritos: 200, ondas: 120 },
          isCompleted: false,
          progress: 40,
          questionsCount: 5,
        },
        {
          id: 'resolucion-conflictos',
          title: 'Resolución de Conflictos',
          description: 'Maneja desacuerdos manteniendo la armonía comunitaria',
          thumbnail: '🕊️',
          duration: 320,
          difficulty: 'hard' as const,
          category: 'Colaboración',
          rewards: { meritos: 250, ondas: 140 },
          isCompleted: false,
          progress: 0,
          questionsCount: 6,
        },
      ],
    },
  ];

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleVideoPlay = useCallback((videoId: string) => {
    setSelectedVideo(videoId);
    setCurrentVideo(videoId);
    // Aquí podrías navegar a la página del reproductor
    console.log('Playing video:', videoId);
  }, [setCurrentVideo]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // ========================================================================
  // RENDER HELPERS
  // ========================================================================

  const renderHeader = () => (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
        )}
        
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PlayArrow />
          </Avatar>
          <Box>
            <Typography variant="h6" color="text.primary" fontWeight="bold">
              ÜPlay - GPL Gamified Play List
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Aprendizaje interactivo gamificado
            </Typography>
          </Box>
        </Box>

        {/* Métricas rápidas en el header */}
        <Box display="flex" gap={1} alignItems="center">
          <Chip
            icon={<Diamond />}
            label={playerMetrics.meritos.toLocaleString()}
            size="small"
            sx={{ color: '#9c27b0', fontWeight: 'bold' }}
          />
          <Chip
            icon={<Bolt />}
            label={playerMetrics.ondas.toLocaleString()}
            size="small"
            sx={{ color: '#ff9800', fontWeight: 'bold' }}
          />
          <Chip
            icon={<Star />}
            label={`Nivel ${playerMetrics.level}`}
            size="small"
            sx={{ color: '#2196f3', fontWeight: 'bold' }}
          />
          
          <IconButton color="inherit">
            <Badge badgeContent={unreadNotifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );

  const renderTabs = () => (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            minHeight: 64,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          },
        }}
      >
        <Tab 
          icon={<Dashboard />} 
          label="Dashboard" 
          iconPosition="start"
        />
        <Tab 
          icon={<VideoLibrary />} 
          label="Biblioteca" 
          iconPosition="start"
        />
        <Tab 
          icon={<TrendingUp />} 
          label="Métricas" 
          iconPosition="start"
        />
        <Tab 
          icon={<EmojiEvents />} 
          label="Logros" 
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );

  const renderVideoLibrary = () => (
    <Container maxWidth="xl">
      {mockCategories.map((category) => (
        <Box key={category.id} mb={4}>
          {/* Header de categoría */}
          <Card sx={{ mb: 2, bgcolor: `${category.color}10` }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: category.color }}>
                  {category.icon}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary" display="block">
                    Recompensas totales
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      icon={<Diamond />}
                      label={category.totalRewards.meritos}
                      size="small"
                      sx={{ color: '#9c27b0' }}
                    />
                    <Chip
                      icon={<Bolt />}
                      label={category.totalRewards.ondas}
                      size="small"
                      sx={{ color: '#ff9800' }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Grid de videos */}
          <Grid container spacing={3}>
            {category.videos.map((video) => (
              <Grid size={{xs:12,sm:6,md:4,lg:3}} key={video.id}>
                <VideoCard video={video} onPlay={handleVideoPlay} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );

  const renderAchievements = () => (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {unlockedAchievements.map((achievement) => (
          <Grid size={{xs:12,sm:6,md:4}} key={achievement.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="h4">{achievement.icon}</Typography>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Desbloqueado: {achievement.unlockedAt?.toLocaleDateString()}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      icon={<Diamond />}
                      label={achievement.reward.meritos}
                      size="small"
                      sx={{ color: '#9c27b0' }}
                    />
                    <Chip
                      icon={<Bolt />}
                      label={achievement.reward.ondas}
                      size="small"
                      sx={{ color: '#ff9800' }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const renderSidebar = () => (
    <Drawer
      anchor="left"
      open={sidebarOpen}
      onClose={handleCloseSidebar}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.default',
        },
      }}
    >
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            ÜPlay Menu
          </Typography>
          <IconButton onClick={handleCloseSidebar}>
            <Close />
          </IconButton>
        </Box>
        
        {/* Métricas del jugador en sidebar */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Tu Progreso
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Mëritos:</Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {playerMetrics.meritos.toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Öndas:</Typography>
                <Typography variant="body2" fontWeight="bold" color="secondary">
                  {playerMetrics.ondas.toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Nivel:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {playerMetrics.level}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );

  // ========================================================================
  // RENDER PRINCIPAL
  // ========================================================================

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {renderHeader()}
      {renderTabs()}
      {renderSidebar()}

      {/* Contenido principal */}
      <TabPanel value={tabValue} index={0}>
        <PlayerMetricsDashboard />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderVideoLibrary()}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PlayerMetricsDashboard />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {renderAchievements()}
      </TabPanel>

      {/* Sistema de feedback de recompensas */}
      {showRewardFeedback && (
        <EnhancedRewardFeedback
          reward={{
            meritos: 100,
            ondas: 50,
            experience: 25,
          }}
          isVisible={showRewardFeedback}
          onClose={hideReward}
          variant="celebration"
        />
      )}
    </Box>
  );
};

export default UPlayGamifiedDashboard; 