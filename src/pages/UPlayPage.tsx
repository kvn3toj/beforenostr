// UPlay Page - Página Principal del Sistema de Aprendizaje Gamificado
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Paper,
  Breadcrumbs,
  Link,
  Alert,
  Skeleton,
  Fade,
  Tooltip,
  Badge,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  PlayArrow,
  Star,
  AccessTime,
  Quiz,
  Bookmark,
  BookmarkBorder,
  Share,
  Download,
  TrendingUp,
  School,
  Psychology,
  VideoLibrary,
  FlashOn,
  Timeline,
  Home,
  Dashboard,
  Collections,
  Group,
  EmojiEvents,
  NavigateNext
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  VideoItem,
  VideoFilters,
  VideoCategory,
  DifficultyLevel,
  UserStats,
  VideoSortBy,
  SortOrder
} from '../types/uplay';
import { uplayService } from '../services/uplay/uplayService';
import { UPlayDashboard } from '../components/modules/uplay/components/UPlayDashboard';
import { AdvancedVideoPlayer } from '../components/modules/uplay/components/AdvancedVideoPlayer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Componente de tarjeta de video mejorada
const VideoCard: React.FC<{
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
  onBookmark?: (videoId: string) => void;
  isBookmarked?: boolean;
}> = ({ video, onPlay, onBookmark, isBookmarked = false }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    const colors = {
      [DifficultyLevel.BEGINNER]: '#4caf50',
      [DifficultyLevel.INTERMEDIATE]: '#ff9800',
      [DifficultyLevel.ADVANCED]: '#f44336',
      [DifficultyLevel.EXPERT]: '#9c27b0'
    };
    return colors[difficulty];
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={video.thumbnailUrl || 'https://via.placeholder.com/400x200?text=Video'}
          alt={video.title}
          sx={{ objectFit: 'cover' }}
        />
        
        {/* Play Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            cursor: 'pointer',
            '&:hover': { opacity: 1 }
          }}
          onClick={() => onPlay(video)}
        >
          <IconButton
            size="large"
            sx={{
              backgroundColor: 'rgba(255,107,53,0.9)',
              color: 'white',
              '&:hover': { backgroundColor: '#ff6b35' }
            }}
          >
            <PlayArrow sx={{ fontSize: 48 }} />
          </IconButton>
        </Box>

        {/* Duration Badge */}
        <Chip
          label={formatDuration(video.duration)}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '0.75rem'
          }}
        />

        {/* Question Indicator */}
        {video.questions && video.questions.length > 0 && (
          <Chip
            icon={<Quiz />}
            label={video.questions.length}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#ff6b35',
              color: 'white'
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {video.title}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {video.description}
        </Typography>

        {/* Tags y Metadata */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={video.category.replace(/_/g, ' ')}
            size="small"
            sx={{
              backgroundColor: getCategoryColor(video.category),
              color: 'white',
              fontSize: '0.7rem'
            }}
          />
          <Chip
            label={video.difficulty}
            size="small"
            sx={{
              backgroundColor: getDifficultyColor(video.difficulty),
              color: 'white',
              fontSize: '0.7rem'
            }}
          />
        </Stack>

        {/* Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Star sx={{ fontSize: 16, color: '#ffd700' }} />
            <Typography variant="caption">
              {video.analytics?.averageScore || 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {video.analytics?.totalViews || 0} vistas
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title={isBookmarked ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
              <IconButton
                size="small"
                onClick={() => onBookmark?.(video.id)}
                sx={{ color: isBookmarked ? '#ff6b35' : 'text.secondary' }}
              >
                {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Compartir">
              <IconButton size="small">
                <Share />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Rewards Preview */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">Recompensas:</Typography>
            <Chip
              label={`${video.rewards?.meritos || 0} méritos`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Stack>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<PlayArrow />}
            onClick={() => onPlay(video)}
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': { backgroundColor: '#e55a2e' },
              borderRadius: 2
            }}
          >
            Ver
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export const UPlayPage: React.FC = () => {
  // Navigation and Routing
  const navigate = useNavigate();
  const { videoId } = useParams<{ videoId?: string }>();
  const location = useLocation();

  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Set<string>>(new Set());

  // Filters
  const [filters, setFilters] = useState<VideoFilters>({
    sortBy: VideoSortBy.CREATED_AT,
    sortOrder: SortOrder.DESC
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;

  // Navigation tabs configuration
  const tabs = [
    { label: 'Dashboard', icon: <Dashboard />, id: 'dashboard' },
    { label: 'Biblioteca', icon: <VideoLibrary />, id: 'library' },
    { label: 'Salas de Estudio', icon: <Group />, id: 'study-rooms' },
    { label: 'Logros', icon: <EmojiEvents />, id: 'achievements' }
  ];

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [videosResponse, userStatsResponse] = await Promise.all([
          uplayService.getVideos(filters, 1, 50),
          uplayService.getUserStats()
        ]);

        if (videosResponse.success) {
          setVideos(videosResponse.data.items);
          setFilteredVideos(videosResponse.data.items);
        }

        if (userStatsResponse.success) {
          setUserStats(userStatsResponse.data);
        }

        // Load specific video if videoId in URL
        if (videoId) {
          const videoResponse = await uplayService.getVideoById(videoId);
          if (videoResponse.success) {
            setCurrentVideo(videoResponse.data);
            setActiveTab(1); // Switch to library/player view
          }
        }

      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [videoId, filters]);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...videos];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(video => video.category === filters.category);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(video => video.difficulty === filters.difficulty);
    }

    // Apply duration filter
    if (filters.duration) {
      filtered = filtered.filter(video =>
        video.duration >= filters.duration!.min && video.duration <= filters.duration!.max
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case VideoSortBy.TITLE:
            aValue = a.title;
            bValue = b.title;
            break;
          case VideoSortBy.DURATION:
            aValue = a.duration;
            bValue = b.duration;
            break;
          case VideoSortBy.RATING:
            aValue = a.analytics?.averageScore || 0;
            bValue = b.analytics?.averageScore || 0;
            break;
          case VideoSortBy.VIEWS:
            aValue = a.analytics?.totalViews || 0;
            bValue = b.analytics?.totalViews || 0;
            break;
          case VideoSortBy.CREATED_AT:
          default:
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
        }

        if (typeof aValue === 'string') {
          return filters.sortOrder === SortOrder.ASC
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return filters.sortOrder === SortOrder.ASC
          ? aValue - bValue
          : bValue - aValue;
      });
    }

    setFilteredVideos(filtered);
    setCurrentPage(1);
  }, [videos, searchQuery, filters]);

  // Event Handlers
  const handleVideoPlay = (video: VideoItem) => {
    setCurrentVideo(video);
    navigate(`/uplay/video/${video.id}`, { 
      state: { videoData: video } 
    });
    
    // Track video view
    uplayService.trackUserAction('video_started', {
      videoId: video.id,
      title: video.title,
      category: video.category
    });
  };

  const handleBookmarkToggle = (videoId: string) => {
    const newBookmarks = new Set(bookmarkedVideos);
    if (newBookmarks.has(videoId)) {
      newBookmarks.delete(videoId);
    } else {
      newBookmarks.add(videoId);
    }
    setBookmarkedVideos(newBookmarks);
    
    // Here you would also sync with backend
    uplayService.trackUserAction('bookmark_toggle', { videoId });
  };

  const handleCategoryNavigate = (category: VideoCategory) => {
    setFilters(prev => ({ ...prev, category }));
    setActiveTab(1); // Switch to library
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Pagination
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
  );

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={60} />
          <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
            <Link 
              color="inherit" 
              href="/" 
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Home sx={{ mr: 0.5, fontSize: 20 }} />
              Inicio
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 0.5, fontSize: 20 }} />
              ÜPlay
            </Typography>
          </Breadcrumbs>

          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            ÜPlay
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Plataforma de Aprendizaje Gamificado
          </Typography>

          {userStats && (
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                icon={<TrendingUp />}
                label={`Nivel ${userStats.level}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Star />}
                label={`${userStats.totalPoints.toLocaleString()} puntos`}
                color="secondary"
                variant="outlined"
              />
              <Chip
                icon={<AccessTime />}
                label={`${Math.floor(userStats.totalTimeSpent / 60)}h estudiadas`}
                color="success"
                variant="outlined"
              />
            </Stack>
          )}
        </Box>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          {/* Dashboard */}
          <UPlayDashboard
            onNavigateToVideo={(videoId: string) => {
              // Find video by ID and navigate
              const video = videos.find(v => v.id === videoId);
              if (video) {
                handleVideoPlay(video);
              }
            }}
            onNavigateToCategory={handleCategoryNavigate}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Video Library */}
          {currentVideo ? (
            <Box>
              <Button
                startIcon={<NavigateNext sx={{ transform: 'rotate(180deg)' }} />}
                onClick={() => setCurrentVideo(null)}
                sx={{ mb: 3 }}
              >
                Volver a la biblioteca
              </Button>
              
              <AdvancedVideoPlayer
                video={currentVideo}
                onVideoEnd={() => {
                  // Handle video completion
                  uplayService.trackUserAction('video_completed', {
                    videoId: currentVideo.id
                  });
                }}
                onQuestionAnswer={(questionId, correct, points) => {
                  // Handle question answers
                  console.log('Question answered:', { questionId, correct, points });
                }}
              />
            </Box>
          ) : (
            <Box>
              {/* Search and Filters */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      placeholder="Buscar videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        value={filters.category || ''}
                        label="Categoría"
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          category: e.target.value as VideoCategory || undefined 
                        }))}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        {Object.values(VideoCategory).map(category => (
                          <MenuItem key={category} value={category}>
                            {category.replace(/_/g, ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Dificultad</InputLabel>
                      <Select
                        value={filters.difficulty || ''}
                        label="Dificultad"
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          difficulty: e.target.value as DifficultyLevel || undefined 
                        }))}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        {Object.values(DifficultyLevel).map(difficulty => (
                          <MenuItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Ordenar por</InputLabel>
                      <Select
                        value={filters.sortBy || VideoSortBy.CREATED_AT}
                        label="Ordenar por"
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          sortBy: e.target.value as VideoSortBy 
                        }))}
                      >
                        <MenuItem value={VideoSortBy.CREATED_AT}>Más recientes</MenuItem>
                        <MenuItem value={VideoSortBy.VIEWS}>Más vistos</MenuItem>
                        <MenuItem value={VideoSortBy.RATING}>Mejor valorados</MenuItem>
                        <MenuItem value={VideoSortBy.DURATION}>Duración</MenuItem>
                        <MenuItem value={VideoSortBy.TITLE}>Título</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<FilterList />}
                      onClick={() => setFilters({})}
                    >
                      Limpiar filtros
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Results Summary */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {filteredVideos.length} videos encontrados
                </Typography>
                
                {filteredVideos.length > videosPerPage && (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                  />
                )}
              </Box>

              {/* Video Grid */}
              {filteredVideos.length > 0 ? (
                <Grid container spacing={3}>
                  {paginatedVideos.map((video) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={video.id}>
                      <VideoCard
                        video={video}
                        onPlay={handleVideoPlay}
                        onBookmark={handleBookmarkToggle}
                        isBookmarked={bookmarkedVideos.has(video.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <VideoLibrary sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No se encontraron videos
                  </Typography>
                  <Typography color="text.secondary">
                    Intenta ajustar los filtros de búsqueda
                  </Typography>
                </Paper>
              )}

              {/* Bottom Pagination */}
              {filteredVideos.length > videosPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* Study Rooms - Placeholder */}
          <Alert severity="info">
            Las Salas de Estudio Colaborativas estarán disponibles próximamente. Esta funcionalidad incluirá:
            <ul>
              <li>Salas de video sincronizadas</li>
              <li>Chat en tiempo real</li>
              <li>Quizzes grupales</li>
              <li>Pizarra colaborativa</li>
            </ul>
          </Alert>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Achievements - Placeholder */}
          <Alert severity="info">
            El sistema de logros expandido estará disponible próximamente con:
            <ul>
              <li>Sistema de badges por categorías</li>
              <li>Logros de velocidad y precisión</li>
              <li>Challenges comunitarios</li>
              <li>Temporadas y eventos especiales</li>
            </ul>
          </Alert>
        </TabPanel>
      </Container>
    </Box>
  );
};