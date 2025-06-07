/**
 * 📰 SocialFeed Component - Enhanced Social Experience
 * 
 * Componente mejorado para el feed social que incluye:
 * - Formulario avanzado para crear publicaciones con media
 * - Feed interactivo con likes, comentarios y compartir
 * - Notificaciones en tiempo real
 * - Estados de carga optimizados
 * - UX/UI avanzada con animaciones y micro-interacciones
 * - Sistema de filtros y ordenamiento
 * - Integración con sistema de mëritos CoomÜnity
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Skeleton,
  Divider,
  Fab,
  Backdrop,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Zoom,
  Slide,
  Collapse,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  FavoriteRounded as LikeIcon,
  ChatBubbleRounded as CommentIcon,
  ShareRounded as ShareIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingIcon,
  Schedule as RecentIcon,
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  PhotoCamera as PhotoIcon,
  Videocam as VideoIcon,
  Poll as PollIcon,
  EmojiEmotions as EmojiIcon,
  Send as SendIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  StarRounded as StarIcon,
  PersonAdd as FollowIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

// Componentes
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { LoadingSpinner } from '../../../ui/LoadingSpinner';

// Hooks
import { useSocialPosts, useSocialPost } from '../../../../hooks/useRealBackendData';

// Tipos
import type { SocialPost } from '../../../../types';

// 🎮 Tipos para funcionalidades avanzadas
interface SocialInteraction {
  type: 'like' | 'comment' | 'share' | 'follow';
  postId?: string;
  userId: string;
  timestamp: string;
  merit?: number;
}

interface FilterOptions {
  sortBy: 'recent' | 'trending' | 'merits';
  contentType: 'all' | 'text' | 'image' | 'video' | 'poll';
  timeRange: 'today' | 'week' | 'month' | 'all';
}

interface SocialFeedProps {
  onPostClick?: (postId: string) => void;
  showCreatePost?: boolean;
  enableNotifications?: boolean;
}

const SocialFeed: React.FC<SocialFeedProps> = ({
  onPostClick,
  showCreatePost = true,
  enableNotifications = true
}) => {
  // Estados principales
  const [currentPage, setCurrentPage] = useState(0);
  const [allPosts, setAllPosts] = useState<SocialPost[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // 🎮 Estados de gamificación social
  const [userMerits, setUserMerits] = useState(0);
  const [socialLevel, setSocialLevel] = useState(1);
  const [todayInteractions, setTodayInteractions] = useState(0);
  
  // 🎛️ Estados de filtros y UI avanzada
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'recent',
    contentType: 'all',
    timeRange: 'week'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  
  // 🔔 Estados de notificaciones y feedback
  const [notifications, setNotifications] = useState<SocialInteraction[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // 📱 Estados de interacciones en tiempo real
  const [recentInteractions, setRecentInteractions] = useState<SocialInteraction[]>([]);
  const [isInteracting, setIsInteracting] = useState(false);

  // Referencias y hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const feedRef = useRef<HTMLDivElement>(null);
  const createPostRef = useRef<HTMLDivElement>(null);

  // Hook para datos del feed con filtros
  const {
    data: postsData,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useSocialPosts(currentPage, 10);

  // 🎮 Funciones de gamificación social
  const handleSocialInteraction = useCallback((interaction: SocialInteraction) => {
    setRecentInteractions(prev => [interaction, ...prev.slice(0, 4)]);
    setIsInteracting(true);
    
    // Calcular mëritos ganados
    const meritsByAction = {
      'like': 2,
      'comment': 5,
      'share': 8,
      'follow': 10
    };
    
    const meritsEarned = meritsByAction[interaction.type];
    setUserMerits(prev => prev + meritsEarned);
    setTodayInteractions(prev => prev + 1);
    
    // Feedback visual
    setSnackbarMessage(`+${meritsEarned} Mëritos por ${interaction.type === 'like' ? 'dar like' : interaction.type === 'comment' ? 'comentar' : interaction.type === 'share' ? 'compartir' : 'seguir'} 🎉`);
    setSnackbarOpen(true);
    
    // Calcular nivel social
    const newLevel = Math.floor(userMerits / 100) + 1;
    if (newLevel > socialLevel) {
      setSocialLevel(newLevel);
      setSnackbarMessage(`¡Subiste al nivel social ${newLevel}! 🏆`);
    }
    
    setTimeout(() => setIsInteracting(false), 500);
  }, [userMerits, socialLevel]);

  // 🎛️ Funciones de filtros avanzados
  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
    setAllPosts([]);
  };

  // 📰 Funciones de gestión de posts
  const handlePostInteraction = useCallback((postId: string, action: 'like' | 'comment' | 'share') => {
    const interaction: SocialInteraction = {
      type: action,
      postId,
      userId: 'current-user', // En producción viene del contexto de auth
      timestamp: new Date().toISOString()
    };
    
    handleSocialInteraction(interaction);
    
    // Actualizar estado local del post
    setAllPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: action === 'like' ? (post.likes || 0) + 1 : post.likes,
            comments: action === 'comment' ? (post.comments || 0) + 1 : post.comments,
            shares: action === 'share' ? (post.shares || 0) + 1 : post.shares,
          }
        : post
    ));
  }, [handleSocialInteraction]);

  // Formatear tiempo relativo mejorado
  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `hace ${minutes}m`;
    if (hours < 24) return `hace ${hours}h`;
    if (days < 7) return `hace ${days}d`;
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  }, []);

  // Filtrar y ordenar posts según filtros seleccionados
  const filteredPosts = allPosts
    .filter(post => {
      if (filters.contentType !== 'all') {
        // Filtrar por tipo de contenido (simulado)
        return true; // En producción se filtraría por post.type
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'trending':
          return ((b.likes || 0) + (b.comments || 0) + (b.shares || 0)) - 
                 ((a.likes || 0) + (a.comments || 0) + (a.shares || 0));
        case 'merits':
          return (b.merits || 0) - (a.merits || 0);
        case 'recent':
        default:
          return new Date(b.createdAt || b.timestamp || 0).getTime() - 
                 new Date(a.createdAt || a.timestamp || 0).getTime();
      }
    });

  // Actualizar posts cuando lleguen nuevos datos
  useEffect(() => {
    if (postsData?.data) {
      if (currentPage === 0) {
        setAllPosts(postsData.data);
      } else {
        setAllPosts(prev => [...prev, ...postsData.data]);
      }
    }
  }, [postsData?.data, currentPage]);

  // Manejar scroll para mostrar botón "scroll to top"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simular notificaciones en tiempo real
  useEffect(() => {
    if (enableNotifications) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% probabilidad cada 10 segundos
          const newNotification: SocialInteraction = {
            type: ['like', 'comment', 'follow'][Math.floor(Math.random() * 3)] as any,
            userId: `user-${Math.floor(Math.random() * 100)}`,
            timestamp: new Date().toISOString()
          };
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [enableNotifications]);

  // Manejar carga de más posts
  const handleLoadMore = () => {
    if (postsData?.pagination?.hasNextPage && !isFetching) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Manejar refresh del feed
  const handleRefresh = () => {
    setCurrentPage(0);
    setAllPosts([]);
    refetch();
  };

  // Manejar post creado
  const handlePostCreated = () => {
    handleRefresh();
    setShowCreateDialog(false);
    handleSocialInteraction({
      type: 'comment', // Crear post cuenta como comentario para mëritos
      userId: 'current-user',
      timestamp: new Date().toISOString()
    });
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🎨 Componente del Header gamificado
  const SocialHeader = () => (
    <Card sx={{ 
      mb: 3, 
      background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)'
    }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrophyIcon sx={{ mr: 1, fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Feed Social CoomÜnity
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {filteredPosts.length} publicaciones • {todayInteractions} interacciones hoy
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              icon={<TrophyIcon />}
              label={`${userMerits} Mëritos`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              icon={<StarIcon />}
              label={`Nivel ${socialLevel}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <IconButton 
              onClick={() => setShowNotifications(!showNotifications)}
              sx={{ color: 'white' }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Box>
        
        {/* Barra de progreso de nivel social */}
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={(userMerits % 100)} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { 
                bgcolor: 'white',
                borderRadius: 3 
              }
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {userMerits % 100}/100 para nivel {socialLevel + 1}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // 🎛️ Panel de filtros avanzados
  const FiltersPanel = () => (
    <Collapse in={showFilters}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FilterIcon sx={{ mr: 1 }} />
            Filtros del Feed
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Ordenar por:
              </Typography>
              <ToggleButtonGroup
                value={filters.sortBy}
                exclusive
                onChange={(_, value) => value && handleFilterChange('sortBy', value)}
                size="small"
              >
                <ToggleButton value="recent">
                  <RecentIcon sx={{ mr: 1 }} />
                  Recientes
                </ToggleButton>
                <ToggleButton value="trending">
                  <TrendingIcon sx={{ mr: 1 }} />
                  Trending
                </ToggleButton>
                <ToggleButton value="merits">
                  <TrophyIcon sx={{ mr: 1 }} />
                  Mëritos
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Tipo de contenido:
              </Typography>
              <ToggleButtonGroup
                value={filters.contentType}
                exclusive
                onChange={(_, value) => value && handleFilterChange('contentType', value)}
                size="small"
              >
                <ToggleButton value="all">Todos</ToggleButton>
                <ToggleButton value="text">Texto</ToggleButton>
                <ToggleButton value="image">Imágenes</ToggleButton>
                <ToggleButton value="video">Videos</ToggleButton>
                <ToggleButton value="poll">Encuestas</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Collapse>
  );

  // 📱 Post Card mejorado con interacciones
  const EnhancedPostCard = ({ post }: { post: SocialPost }) => (
    <Card sx={{ 
      mb: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { 
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }
    }}>
      <CardContent>
        {/* Header del post */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: '#E91E63', mr: 2 }}>
            {post.authorName?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {post.authorName || 'Usuario Anónimo'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(post.createdAt || post.timestamp || '')}
              {post.merits && (
                <Chip 
                  icon={<TrophyIcon />}
                  label={`${post.merits} mëritos`}
                  size="small"
                  sx={{ ml: 1, height: 20 }}
                />
              )}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>
        
        {/* Contenido del post */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.content}
        </Typography>
        
        {/* Acciones del post */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              startIcon={<LikeIcon />}
              onClick={() => handlePostInteraction(post.id, 'like')}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: '#E91E63' }
              }}
            >
              {post.likes || 0}
            </Button>
            <Button
              size="small"
              startIcon={<CommentIcon />}
              onClick={() => handlePostInteraction(post.id, 'comment')}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: '#1976d2' }
              }}
            >
              {post.comments || 0}
            </Button>
            <Button
              size="small"
              startIcon={<ShareIcon />}
              onClick={() => handlePostInteraction(post.id, 'share')}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: '#388e3c' }
              }}
            >
              {post.shares || 0}
            </Button>
          </Stack>
          
          <IconButton size="small">
            <ViewIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  // Loading inicial
  if (isLoading && currentPage === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <LoadingSpinner message="Cargando feed social..." />
        </Box>
      </Container>
    );
  }

  // Error state
  if (isError && allPosts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Reintentar
            </Button>
          }
        >
          Error cargando el feed social. Verifica tu conexión.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 2, px: isMobile ? 1 : 2 }}>
      {/* Header gamificado */}
      <SocialHeader />

      {/* Panel de controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={isFetching}
                size="small"
              >
                Actualizar
              </Button>
              <Button
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                size="small"
                variant={showFilters ? 'contained' : 'outlined'}
              >
                Filtros
              </Button>
            </Stack>
            
            {showCreatePost && (
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowCreateDialog(true)}
                variant="contained"
                sx={{ bgcolor: '#E91E63' }}
              >
                Crear Post
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Panel de filtros */}
      <FiltersPanel />

      {/* Notificaciones recientes */}
      <Collapse in={showNotifications}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🔔 Notificaciones Recientes
            </Typography>
            {notifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay notificaciones nuevas
              </Typography>
            ) : (
              <Stack spacing={1}>
                {notifications.slice(0, 5).map((notification, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1, 
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <Avatar sx={{ bgcolor: '#E91E63', mr: 2, width: 32, height: 32 }}>
                      {notification.type === 'like' ? '❤️' : notification.type === 'comment' ? '💬' : '👤'}
                    </Avatar>
                    <Typography variant="body2">
                      {notification.type === 'like' && 'Le gustó tu publicación'}
                      {notification.type === 'comment' && 'Comentó en tu publicación'}
                      {notification.type === 'follow' && 'Comenzó a seguirte'}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                      {formatTime(notification.timestamp)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Collapse>

      {/* Lista de posts */}
      <Box ref={feedRef}>
        {filteredPosts.length === 0 && !isLoading ? (
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <CardContent>
              <EmojiIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No hay publicaciones que mostrar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {showCreatePost ? 'Sé el primero en crear una publicación' : 'Cambia los filtros para ver más contenido'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Zoom key={post.id} in={true} style={{ transitionDelay: '100ms' }}>
              <div>
                <EnhancedPostCard post={post} />
              </div>
            </Zoom>
          ))
        )}

        {/* Botón cargar más */}
        {postsData?.pagination?.hasNextPage && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Button
              onClick={handleLoadMore}
              disabled={isFetching}
              variant="outlined"
              startIcon={isFetching ? <CircularProgress size={16} /> : undefined}
            >
              {isFetching ? 'Cargando...' : 'Cargar más publicaciones'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Dialog para crear post */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          ✍️ Crear Nueva Publicación
        </DialogTitle>
        <DialogContent>
          <CreatePost 
            onPostCreated={handlePostCreated}
            authorName="Tú"
          />
        </DialogContent>
      </Dialog>

      {/* SpeedDial para acciones rápidas */}
      {!isMobile && (
        <SpeedDial
          ariaLabel="Acciones rápidas"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<AddIcon />}
            tooltipTitle="Crear Post"
            onClick={() => setShowCreateDialog(true)}
          />
          <SpeedDialAction
            icon={<PhotoIcon />}
            tooltipTitle="Compartir Foto"
            onClick={() => setShowCreateDialog(true)}
          />
          <SpeedDialAction
            icon={<PollIcon />}
            tooltipTitle="Crear Encuesta"
            onClick={() => setShowCreateDialog(true)}
          />
        </SpeedDial>
      )}

      {/* Botón scroll to top */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 16 : 80,
            right: isMobile ? 16 : 80,
            bgcolor: '#E91E63'
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      {/* Feedback de interacciones */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSnackbarOpen(false)}
          sx={{ fontWeight: 'bold' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Loading overlay durante interacciones */}
      <Backdrop open={isInteracting} sx={{ zIndex: 1000 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Procesando interacción...
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default SocialFeed; 