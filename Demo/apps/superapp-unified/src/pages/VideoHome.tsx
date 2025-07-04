import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  LinearProgress,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Slider
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  SkipPrevious,
  SkipNext,
  Settings,
  Subtitles,
  Star,
  Visibility,
  ThumbUp,
  Share,
  Download,
  PlaylistAdd,
  History,
  TrendingUp,
  LocalMovies,
  VideoLibrary,
  Subscriptions,
  Schedule,
  Category,
  Search,
  FilterList,
  ViewList,
  ViewModule,
  PhotoCamera,
  FavoriteOutlined,
  Code,
  Business,
  FitnessCenter,
  AccessTime,
  Palette,
  AttachMoney,
  Chat,
  Group
} from '@mui/icons-material';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Datos del sistema de videos basados en el análisis extraído
const videoSystemData = {
  categories: [
    { id: 'photography', icon: PhotoCamera, name: 'Fotografía', videoCount: 127, ucoinsReward: 15 },
    { id: 'mindfulness', icon: FavoriteOutlined, name: 'Mindfulness', videoCount: 89, ucoinsReward: 20 },
    { id: 'technology', icon: Code, name: 'Tecnología', videoCount: 203, ucoinsReward: 25 },
    { id: 'business', icon: Business, name: 'Negocios', videoCount: 156, ucoinsReward: 30 },
    { id: 'health', icon: FitnessCenter, name: 'Salud', videoCount: 98, ucoinsReward: 18 },
    { id: 'productivity', icon: AccessTime, name: 'Productividad', videoCount: 134, ucoinsReward: 22 },
    { id: 'art', icon: Palette, name: 'Arte', videoCount: 76, ucoinsReward: 12 },
    { id: 'finance', icon: AttachMoney, name: 'Finanzas', videoCount: 112, ucoinsReward: 28 },
    { id: 'communication', icon: Chat, name: 'Comunicación', videoCount: 67, ucoinsReward: 16 },
    { id: 'social', icon: Group, name: 'Emprendimiento', videoCount: 145, ucoinsReward: 35 }
  ],

  featuredVideos: [
    {
      id: 1,
      title: 'Diseño UX/UI: Principios fundamentales para interfaces exitosas',
      thumbnail: '/assets/videos/ux-design-fundamentals.jpg',
      duration: 1847, // 30:47
      views: '12.5k',
      rating: 4.9,
      category: 'technology',
      uploadDate: '2025-01-15',
      channelName: 'CoomÜnity Academy',
      description: 'Aprende los principios fundamentales del diseño UX/UI con casos prácticos del ecosistema CoomÜnity.',
      ucoinsReward: 45,
      hasQuestions: true,
      questionCount: 8,
      hasAttentionButtons: true,
      completionRate: 87,
      isInteractive: true,
      playerType: 'vimeo',
      videoId: '383005433',
      hasSubtitles: true,
      languages: ['es', 'en'],
      difficulty: 'intermediate',
      tags: ['ux', 'ui', 'design', 'coomunity']
    },
    {
      id: 2,
      title: 'Emprendimiento Digital: De la idea al MVP en 30 días',
      thumbnail: '/assets/videos/digital-entrepreneurship.jpg',
      duration: 2156, // 35:56
      views: '8.9k',
      rating: 4.7,
      category: 'business',
      uploadDate: '2025-01-12',
      channelName: 'Emprendedores CoomÜnity',
      description: 'Guía completa para desarrollar tu idea de negocio usando las herramientas del ecosistema.',
      ucoinsReward: 65,
      hasQuestions: true,
      questionCount: 12,
      hasAttentionButtons: true,
      completionRate: 92,
      isInteractive: true,
      playerType: 'vimeo',
      videoId: 'entrepreneur-demo',
      hasSubtitles: true,
      languages: ['es', 'en', 'pt'],
      difficulty: 'advanced',
      tags: ['emprendimiento', 'mvp', 'negocios', 'startup']
    },
    {
      id: 3,
      title: 'Mindfulness y Productividad: Técnicas para el equilibrio laboral',
      thumbnail: '/assets/videos/mindfulness-productivity.jpg',
      duration: 1523, // 25:23
      views: '15.2k',
      rating: 4.8,
      category: 'mindfulness',
      uploadDate: '2025-01-10',
      channelName: 'Bienestar CoomÜnity',
      description: 'Integra técnicas de mindfulness en tu rutina diaria para mejorar tu productividad.',
      ucoinsReward: 35,
      hasQuestions: true,
      questionCount: 5,
      hasAttentionButtons: true,
      completionRate: 95,
      isInteractive: true,
      playerType: 'coomunity-player',
      videoId: 'mindfulness-prod',
      hasSubtitles: true,
      languages: ['es'],
      difficulty: 'beginner',
      tags: ['mindfulness', 'productividad', 'bienestar', 'equilibrio']
    },
    {
      id: 4,
      title: 'React.js Avanzado: Optimización y mejores prácticas',
      thumbnail: '/assets/videos/react-advanced.jpg',
      duration: 2834, // 47:14
      views: '6.7k',
      rating: 4.9,
      category: 'technology',
      uploadDate: '2025-01-08',
      channelName: 'Dev CoomÜnity',
      description: 'Técnicas avanzadas de React.js para aplicaciones de alto rendimiento.',
      ucoinsReward: 75,
      hasQuestions: true,
      questionCount: 15,
      hasAttentionButtons: true,
      completionRate: 78,
      isInteractive: true,
      playerType: 'coomunity-player',
      videoId: 'react-advanced-demo',
      hasSubtitles: true,
      languages: ['es', 'en'],
      difficulty: 'expert',
      tags: ['react', 'javascript', 'desarrollo', 'optimización']
    },
    {
      id: 5,
      title: 'Sistema de Recompensas CoomÜnity: Ganando ÜCoins',
      thumbnail: '/assets/videos/ucoins-system.jpg',
      duration: 1245, // 20:45
      views: '18.3k',
      rating: 4.6,
      category: 'social',
      uploadDate: '2025-01-20',
      channelName: 'CoomÜnity Tutorial',
      description: 'Aprende cómo maximizar tus ganancias de ÜCoins en el ecosistema.',
      ucoinsReward: 50,
      hasQuestions: true,
      questionCount: 6,
      hasAttentionButtons: true,
      completionRate: 89,
      isInteractive: true,
      playerType: 'coomunity-player',
      videoId: 'ucoins-tutorial',
      hasSubtitles: true,
      languages: ['es', 'en'],
      difficulty: 'beginner',
      tags: ['ucoins', 'recompensas', 'gamificación', 'tutorial']
    },
    {
      id: 6,
      title: 'Fotografía Profesional para Redes Sociales',
      thumbnail: '/assets/videos/social-photography.jpg',
      duration: 1689, // 28:09
      views: '9.4k',
      rating: 4.5,
      category: 'photography',
      uploadDate: '2025-01-18',
      channelName: 'Visual CoomÜnity',
      description: 'Técnicas y consejos para crear contenido visual impactante.',
      ucoinsReward: 40,
      hasQuestions: true,
      questionCount: 9,
      hasAttentionButtons: true,
      completionRate: 84,
      isInteractive: true,
      playerType: 'vimeo',
      videoId: 'photo-social-media',
      hasSubtitles: true,
      languages: ['es'],
      difficulty: 'intermediate',
      tags: ['fotografía', 'redes sociales', 'contenido', 'visual']
    }
  ],

  playlists: [
    {
      id: 'pl_1',
      name: 'Desarrollo Full Stack CoomÜnity',
      videoCount: 24,
      totalDuration: 18432, // 5:07:12
      isPrivate: false,
      thumbnail: '/assets/playlists/fullstack-dev.jpg',
      description: 'Serie completa de desarrollo full stack usando las tecnologías del ecosistema',
      totalUcoinsReward: 850,
      difficulty: 'advanced',
      category: 'technology',
      completionRate: 67,
      createdBy: 'Dev CoomÜnity',
      tags: ['fullstack', 'desarrollo', 'tecnología']
    },
    {
      id: 'pl_2',
      name: 'Diseño de Experiencias Digitales',
      videoCount: 18,
      totalDuration: 14256, // 3:57:36
      isPrivate: false,
      thumbnail: '/assets/playlists/ux-design.jpg',
      description: 'Aprende a diseñar experiencias excepcionales para usuarios',
      totalUcoinsReward: 620,
      difficulty: 'intermediate',
      category: 'technology',
      completionRate: 78,
      createdBy: 'CoomÜnity Academy',
      tags: ['ux', 'ui', 'diseño', 'experiencia']
    },
    {
      id: 'pl_3',
      name: 'Emprendimiento y Negocios Digitales',
      videoCount: 31,
      totalDuration: 22890, // 6:21:30
      isPrivate: false,
      thumbnail: '/assets/playlists/digital-business.jpg',
      description: 'Todo lo que necesitas para emprender en el mundo digital',
      totalUcoinsReward: 1250,
      difficulty: 'advanced',
      category: 'business',
      completionRate: 45,
      createdBy: 'Emprendedores CoomÜnity',
      tags: ['emprendimiento', 'negocios', 'startup', 'digital']
    },
    {
      id: 'pl_4',
      name: 'Mindfulness y Bienestar Digital',
      videoCount: 15,
      totalDuration: 9876, // 2:44:36
      isPrivate: false,
      thumbnail: '/assets/playlists/mindfulness.jpg',
      description: 'Encuentra el equilibrio perfecto entre tecnología y bienestar',
      totalUcoinsReward: 380,
      difficulty: 'beginner',
      category: 'mindfulness',
      completionRate: 92,
      createdBy: 'Bienestar CoomÜnity',
      tags: ['mindfulness', 'bienestar', 'equilibrio', 'digital']
    }
  ],

  analytics: {
    totalVideosWatched: 89,
    totalWatchTime: 45623, // 12:40:23
    favoriteCategory: 'technology',
    avgSessionDuration: 1847, // 30:47
    completionRate: 78,
    streakDays: 12,
    totalUcoinsEarned: 2340,
    monthlyUcoinsGoal: 1000,
    currentUcoinsProgress: 750,
    questionsAnswered: 234,
    correctAnswerRate: 87,
    attentionButtonsClicked: 156,
    attentionButtonAccuracy: 92,
    levelsUnlocked: 8,
    currentLevel: 'Advanced Explorer',
    nextLevelProgress: 65,
    favoriteChannels: ['Dev CoomÜnity', 'CoomÜnity Academy', 'Emprendedores CoomÜnity'],
    weeklyGoalProgress: 85,
    learningStreak: {
      current: 12,
      longest: 28,
      thisWeek: 5
    }
  },

  currentUser: {
    subscriptions: 23,
    uploadedVideos: 8,
    createdPlaylists: 5,
    watchHistory: 156,
    ucoinsBalance: 2340,
    level: 8,
    xpPoints: 15680,
    nextLevelXp: 18000,
    badges: [
      { id: 'early_bird', name: 'Madrugador', description: 'Ve videos antes de las 8 AM', unlocked: true },
      { id: 'tech_expert', name: 'Experto Tech', description: 'Completa 50 videos de tecnología', unlocked: true },
      { id: 'question_master', name: 'Maestro de Preguntas', description: 'Responde 100 preguntas correctamente', unlocked: true },
      { id: 'attention_pro', name: 'Pro de Atención', description: 'Mantén 95% de precisión en botones', unlocked: false },
      { id: 'streak_champion', name: 'Campeón de Rachas', description: 'Mantén racha de 30 días', unlocked: false }
    ],
    achievements: [
      { name: 'Primera Semana Completa', points: 100, date: '2025-01-10' },
      { name: 'Experto en UX/UI', points: 250, date: '2025-01-15' },
      { name: 'Mentor de la Comunidad', points: 500, date: '2025-01-18' }
    ],
    preferences: {
      autoplay: true,
      quality: 'auto',
      subtitles: true,
      notifications: true,
      language: 'es',
      playbackSpeed: 1.0,
      skipIntro: false,
      darkMode: true,
      soundEffects: true,
      vibrationFeedback: true
    },
    subscriptionTier: 'premium',
    weeklyStats: {
      videosWatched: 12,
      timeSpent: 8943, // 2:29:03
      ucoinsEarned: 345,
      questionsAnswered: 28,
      perfectSessions: 4
    }
  },

  gamification: {
    dailyChallenge: {
      title: 'Experto en Tecnología',
      description: 'Completa 3 videos de tecnología hoy',
      progress: 2,
      target: 3,
      reward: 75,
      timeLeft: '14:32:15'
    },
    weeklyChallenge: {
      title: 'Racha de Aprendizaje',
      description: 'Mantén tu racha de aprendizaje por 7 días',
      progress: 5,
      target: 7,
      reward: 200,
      timeLeft: '2 días'
    },
    leaderboard: [
      { rank: 1, name: 'Ana García', points: 12450, avatar: '/avatars/ana.jpg' },
      { rank: 2, name: 'Carlos Mendez', points: 11890, avatar: '/avatars/carlos.jpg' },
      { rank: 3, name: 'Tú', points: 10240, avatar: '/avatars/user.jpg', isCurrentUser: true },
      { rank: 4, name: 'María López', points: 9650, avatar: '/avatars/maria.jpg' },
      { rank: 5, name: 'Diego Ruiz', points: 8900, avatar: '/avatars/diego.jpg' }
    ],
    nextReward: {
      type: 'badge',
      name: 'Explorador Avanzado',
      requirement: 'Completa 100 videos',
      progress: 89,
      target: 100
    }
  },

  liveFeatures: {
    currentLiveStreams: [
      {
        id: 'live_1',
        title: 'Masterclass: Futuro del Desarrollo Web',
        host: 'Experto CoomÜnity',
        viewers: 1247,
        startTime: '2025-01-22T19:00:00Z',
        thumbnail: '/assets/live/web-future.jpg',
        category: 'technology'
      }
    ],
    upcomingEvents: [
      {
        id: 'event_1',
        title: 'Workshop: Diseño de Apps Móviles',
        date: '2025-01-25T15:00:00Z',
        presenter: 'UX Team CoomÜnity',
        registrations: 89,
        maxCapacity: 100
      }
    ]
  },

  socialFeatures: {
    communityDiscussions: [
      {
        id: 'disc_1',
        videoId: 1,
        title: '¿Cuál es tu herramienta UX favorita?',
        replies: 23,
        lastActivity: '2025-01-22T10:30:00Z'
      }
    ],
    collaborativePlaylists: [
      {
        id: 'collab_1',
        name: 'Lo Mejor de la Comunidad 2025',
        contributors: 156,
        videos: 34,
        isPublic: true
      }
    ]
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`videos-tabpanel-${index}`}
      aria-labelledby={`videos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const VideoHome: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 1500);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = videoSystemData.categories.find(cat => cat.id === categoryId);
    return category ? category.icon : LocalMovies;
  };

  const filteredVideos = videoSystemData.featuredVideos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show loading state for initial load
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingSpinner
          variant="circular"
          size="large"
          message="Cargando biblioteca de videos..."
          data-testid="video-home-loading"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🎬 ÜPlay Video Center
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Descubre, aprende y comparte contenido transformador
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Buscar videos, cursos, tutoriales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            data-testid="video-search-button"
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
        </Box>

        {/* Search loading indicator */}
        {isSearching && (
          <LoadingSpinner
            variant="linear"
            message="Buscando en la biblioteca de videos..."
            data-testid="video-search-loading"
          />
        )}
      </Paper>

      {/* Rest of the component */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header Mejorado - CAMBIADO: Eliminado el segundo h1 y ajustado jerarquía */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom sx={{ 
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                📹 CoomÜnity Videos
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Plataforma de contenido multimedia educativo y entretenimiento
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Chip 
                  label={`${videoSystemData.analytics.totalVideosWatched} Videos Vistos`} 
                  color="primary" 
                  size="small" 
                  icon={<Visibility />}
                />
                <Chip 
                  label={`${formatDuration(videoSystemData.analytics.totalWatchTime)} de Contenido`} 
                  color="secondary" 
                  size="small" 
                  icon={<Schedule />}
                />
                <Chip 
                  label={`${videoSystemData.analytics.streakDays} Días de Racha`} 
                  color="success" 
                  size="small" 
                  icon={<TrendingUp />}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="primary" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
              </IconButton>
              <IconButton color="primary">
                <Badge badgeContent={videoSystemData.currentUser.subscriptions} color="error">
                  <Subscriptions />
                </Badge>
              </IconButton>
              <IconButton color="primary">
                <Settings />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Tabs de Navegación */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="video tabs">
            <Tab label="Inicio" icon={<LocalMovies />} />
            <Tab label="Tendencias" icon={<TrendingUp />} />
            <Tab label="Mis Playlists" icon={<VideoLibrary />} />
            <Tab label="Historial" icon={<History />} />
          </Tabs>
        </Box>

        {/* Tab Panel 0: Inicio */}
        <TabPanel value={tabValue} index={0}>
          {/* Categorías */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" component="h4" gutterBottom color="primary">
                🎯 Categorías de Contenido
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={4} md={3}>
                  <Button
                    fullWidth
                    variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedCategory('all')}
                    startIcon={<Category />}
                    sx={{ py: 1.5 }}
                  >
                    Todas
                  </Button>
                </Grid>
                {videoSystemData.categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Grid item xs={6} sm={4} md={3} key={category.id}>
                      <Button
                        fullWidth
                        variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                        onClick={() => setSelectedCategory(category.id)}
                        startIcon={<IconComponent />}
                        sx={{ py: 1.5 }}
                      >
                        {category.name}
                        <Chip 
                          label={category.videoCount} 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>

          {/* Videos Destacados */}
          <Typography variant="h5" component="h3" gutterBottom color="primary">
            ⭐ Videos Destacados
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredVideos.map((video) => (
              <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} key={video.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  {/* Thumbnail */}
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        aspectRatio: '16/9',
                        backgroundColor: 'grey.200',
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <LocalMovies sx={{ fontSize: 48, opacity: 0.7 }} />
                      
                      {/* Play Button Overlay */}
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            transform: 'translate(-50%, -50%) scale(1.1)'
                          }
                        }}
                        onClick={() => setCurrentlyPlaying(video.id)}
                      >
                        <PlayArrow sx={{ fontSize: 40 }} />
                      </IconButton>

                      {/* Duration Badge */}
                      <Chip
                        label={formatDuration(video.duration)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white'
                        }}
                      />

                      {/* Category Badge */}
                      <Chip
                        label={videoSystemData.categories.find(cat => cat.id === video.category)?.name}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          color: 'text.primary'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Content */}
                  <CardContent>
                    <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {video.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                      {video.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="caption" fontWeight="bold">
                          {video.rating}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {video.views} vistas
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {video.uploadDate}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                      {video.channelName}
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <ThumbUp />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Share />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Download />
                        </IconButton>
                      </Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => setPlaylistDialogOpen(true)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <PlaylistAdd />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab Panel 1: Tendencias */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    📈 Videos en Tendencia
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Los videos más populares del ecosistema CoomÜnity en las últimas 24 horas
                  </Typography>
                  
                  <List>
                    {videoSystemData.featuredVideos.map((video, index) => (
                      <React.Fragment key={video.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              #{index + 1}
                            </Typography>
                          </ListItemIcon>
                          <ListItemText
                            primary={video.title}
                            secondary={
                              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {video.views} vistas
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDuration(video.duration)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Star sx={{ fontSize: 12, color: 'warning.main' }} />
                                  <Typography variant="caption">{video.rating}</Typography>
                                </Box>
                              </Box>
                            }
                          />
                          <IconButton color="primary">
                            <PlayArrow />
                          </IconButton>
                        </ListItem>
                        {index < videoSystemData.featuredVideos.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    📊 Tu Progreso de Visualización
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Videos completados esta semana
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={78} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      78% de tu meta semanal
                    </Typography>
                  </Box>

                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Tiempo total visto"
                        secondary={formatDuration(videoSystemData.analytics.totalWatchTime)}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Videos completados"
                        secondary={`${videoSystemData.analytics.totalVideosWatched} videos`}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Racha actual"
                        secondary={`${videoSystemData.analytics.streakDays} días consecutivos`}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Categoría favorita"
                        secondary={videoSystemData.categories.find(cat => cat.id === videoSystemData.analytics.favoriteCategory)?.name}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel 2: Mis Playlists */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" color="primary">
                  📚 Mis Listas de Reproducción
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<PlaylistAdd />}
                  onClick={() => setPlaylistDialogOpen(true)}
                >
                  Nueva Playlist
                </Button>
              </Box>
            </Grid>

            {videoSystemData.playlists.map((playlist) => (
              <Grid item xs={12} md={6} key={playlist.id}>
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <Box
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      position: 'relative'
                    }}
                  >
                    <VideoLibrary sx={{ fontSize: 48, opacity: 0.7 }} />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 32 }} />
                    </IconButton>
                    <Chip
                      label={`${playlist.videoCount} videos`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white'
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {playlist.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {playlist.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDuration(playlist.totalDuration)} total
                      </Typography>
                      <Chip 
                        label={playlist.isPrivate ? 'Privada' : 'Pública'} 
                        size="small" 
                        color={playlist.isPrivate ? 'secondary' : 'primary'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" startIcon={<PlayArrow />} size="small">
                        Reproducir
                      </Button>
                      <Button variant="outlined" size="small">
                        Aleatorio
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab Panel 3: Historial */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📝 Historial de Reproducción
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tus últimos {videoSystemData.currentUser.watchHistory} videos vistos
              </Typography>
              
              <List>
                {videoSystemData.featuredVideos.map((video, index) => (
                  <React.Fragment key={video.id}>
                    <ListItem sx={{ px: 0 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <LocalMovies />
                      </Avatar>
                      <ListItemText
                        primary={video.title}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Visto el {video.uploadDate}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Progreso: {Math.floor(Math.random() * 100)}%
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.floor(Math.random() * 100)} 
                              sx={{ width: 100, height: 8, borderRadius: 4, mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                      <IconButton color="primary">
                        <PlayArrow />
                      </IconButton>
                    </ListItem>
                    {index < videoSystemData.featuredVideos.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  💡 <strong>Tip:</strong> Termina los videos para desbloquear nuevos contenidos y 
                  ganar ÜCoins por tu progreso de aprendizaje.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </TabPanel>
      </Container>

      {/* Diálogo de Nueva Playlist */}
      <Dialog open={playlistDialogOpen} onClose={() => setPlaylistDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📚 Crear Nueva Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Playlist"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Privacidad</InputLabel>
            <Select value="public" label="Privacidad">
              <MenuItem value="public">Pública</MenuItem>
              <MenuItem value="private">Privada</MenuItem>
              <MenuItem value="unlisted">No listada</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlaylistDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained">Crear Playlist</Button>
        </DialogActions>
      </Dialog>

      {/* Reproductor Flotante */}
      {currentlyPlaying && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 300,
            zIndex: 1000,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ bgcolor: 'grey.900', color: 'white', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                {videoSystemData.featuredVideos.find(v => v.id === currentlyPlaying)?.title}
              </Typography>
              <IconButton 
                size="small" 
                sx={{ color: 'white' }}
                onClick={() => setCurrentlyPlaying(null)}
              >
                ×
              </IconButton>
            </Box>
            
            <LinearProgress variant="determinate" value={45} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white' }}>
                <SkipPrevious />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <PlayArrow />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <SkipNext />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <VolumeUp />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Fullscreen />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}; 