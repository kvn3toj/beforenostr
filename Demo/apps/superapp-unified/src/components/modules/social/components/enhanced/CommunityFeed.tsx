import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Avatar,
  Stack,
  Chip,
  Divider,
  IconButton,
  Paper,
  alpha,
  useTheme,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  Add,
  Favorite,
  Comment,
  Share,
  TrendingUp,
  Schedule,
  EmojiEvents,
  Handshake,
  Psychology,
  Groups,
  Send,
  FilterList,
  Refresh,
  Circle,
  Star,
  Visibility,
  MoreVert,
  KeyboardArrowUp,
} from '@mui/icons-material';

// 🌌 NUEVO: Import del Design System Cósmico
import { CosmicCard } from '../../../../../design-system/components/cosmic/CosmicCard';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  category: 'ayni' | 'collaboration' | 'knowledge';
  path: string;
}

interface CommunityMetrics {
  activeConnections: number;
  onlineMembers: number;
  dailyInteractions: number;
  ayniExchanges: number;
  activeCircles: number;
  weeklyGrowth: number;
}

interface CommunityPost {
  id: string;
  author: {
    name: string;
    level: string;
    avatar?: string;
    trustScore: number;
  };
  content: string;
  timestamp: string;
  category: 'ayni' | 'knowledge' | 'collaboration' | 'celebration';
  ayniType?: 'offer' | 'request' | 'exchange';
  interactions: {
    likes: number;
    comments: number;
    shares: number;
    ayniOffers: number;
  };
  merits: number;
  tags: string[];
  isPopular?: boolean;
  isPinned?: boolean;
}

interface CommunityFeedProps {
  isConnected: boolean;
  quickActions: QuickAction[];
  onQuickAction: (actionId: string, path: string) => void;
  communityMetrics: CommunityMetrics;
}

// 🎭 Datos mock de posts comunitarios
const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Ana María Rodríguez',
      level: 'Guardiana de Sabiduría',
      trustScore: 4.9,
    },
    content:
      '🌱 Comparto mi experiencia creando una huerta urbana colaborativa. He documentado todo el proceso y lo ofrezco a cualquier comunidad que quiera replicarlo. ¡El Bien Común crece cuando compartimos conocimiento!',
    timestamp: '2h',
    category: 'knowledge',
    interactions: {
      likes: 24,
      comments: 8,
      shares: 12,
      ayniOffers: 5,
    },
    merits: 50,
    tags: ['agricultura', 'sostenibilidad', 'comunidad'],
    isPopular: true,
  },
  {
    id: '2',
    author: {
      name: 'Carlos Mendoza',
      level: 'Tejedor de Redes',
      trustScore: 4.7,
    },
    content:
      '🤝 Necesito ayuda para traducir un manual de permacultura al quechua. A cambio, ofrezco sesiones de diseño gráfico ecológico. ¡Busquemos el equilibrio Ayni!',
    timestamp: '4h',
    category: 'ayni',
    ayniType: 'exchange',
    interactions: {
      likes: 18,
      comments: 12,
      shares: 6,
      ayniOffers: 8,
    },
    merits: 35,
    tags: ['traducción', 'permacultura', 'diseño'],
  },
  {
    id: '3',
    author: {
      name: 'Luz Elena Castro',
      level: 'Colaboradora Equilibrada',
      trustScore: 4.8,
    },
    content:
      '🎉 ¡Celebremos! Nuestro círculo "Emprendedores Sostenibles" completó 50 intercambios Ayni este mes. Cada colaboración es una semilla para un futuro más justo.',
    timestamp: '1d',
    category: 'celebration',
    interactions: {
      likes: 47,
      comments: 15,
      shares: 23,
      ayniOffers: 0,
    },
    merits: 25,
    tags: ['celebración', 'emprendimiento', 'logros'],
    isPinned: true,
  },
];

const PostCard: React.FC<{
  post: CommunityPost;
  onInteraction: (postId: string, action: string) => void;
}> = ({ post, onInteraction }) => {
  const theme = useTheme();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ayni':
        return '#E91E63';
      case 'knowledge':
        return '#9C27B0';
      case 'collaboration':
        return '#2196F3';
      case 'celebration':
        return '#4CAF50';
      default:
        return theme.palette.primary.main;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ayni':
        return 'Intercambio Ayni';
      case 'knowledge':
        return 'Compartir Sabiduría';
      case 'collaboration':
        return 'Colaboración';
      case 'celebration':
        return 'Celebración';
      default:
        return 'Comunidad';
    }
  };

  return (
    <CosmicCard
      element="aire" // Elemento aire para fluidez social
      variant="elevated"
      intensity={0.15}
      glow={post.isPinned || post.isPopular}
      style={{
        marginBottom: '16px',
        border: post.isPinned ? `2px solid ${getCategoryColor(post.category)}` : undefined,
      }}
      sx={{
        '&:hover': {
          transform: 'perspective(1000px) rotateX(1deg) rotateY(1deg) translateY(-2px)',
        },
      }}
    >
      <CardContent>
        {/* Header del post */}
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: getCategoryColor(post.category),
                width: 48,
                height: 48,
              }}
            >
              {post.author.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {post.author.level} • {post.timestamp}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Star sx={{ fontSize: 12, color: 'warning.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    {post.author.trustScore}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            {post.isPinned && (
              <Chip
                label="Destacado"
                color="primary"
                size="small"
                variant="outlined"
              />
            )}
            {post.isPopular && (
              <Chip label="Popular" color="success" size="small" />
            )}
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Stack>
        </Stack>

        {/* Categoría del post */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getCategoryLabel(post.category)}
            sx={{
              bgcolor: alpha(getCategoryColor(post.category), 0.1),
              color: getCategoryColor(post.category),
              fontWeight: 'bold',
              mb: 1,
            }}
            size="small"
          />
          {post.ayniType && (
            <Chip
              label={
                post.ayniType === 'offer'
                  ? 'Ofrezco'
                  : post.ayniType === 'request'
                    ? 'Necesito'
                    : 'Intercambio'
              }
              color={
                post.ayniType === 'offer'
                  ? 'success'
                  : post.ayniType === 'request'
                    ? 'error'
                    : 'warning'
              }
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        {/* Contenido del post */}
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {post.content}
        </Typography>

        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
          {post.tags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Stack>

        {/* Métricas de méritos */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            mb: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <EmojiEvents sx={{ color: 'warning.main', fontSize: 20 }} />
            <Typography variant="body2" fontWeight="bold">
              +{post.merits} Mëritos por contribuir al Bien Común
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Acciones del post */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<Favorite />}
              onClick={() => onInteraction(post.id, 'like')}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: '#E91E63' },
              }}
            >
              {post.interactions.likes}
            </Button>
            <Button
              size="small"
              startIcon={<Comment />}
              onClick={() => onInteraction(post.id, 'comment')}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: '#1976d2' },
              }}
            >
              {post.interactions.comments}
            </Button>
            <Button
              size="small"
              startIcon={<Share />}
              onClick={() => onInteraction(post.id, 'share')}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: '#388e3c' },
              }}
            >
              {post.interactions.shares}
            </Button>
            {post.category === 'ayni' && (
              <Button
                size="small"
                startIcon={<Handshake />}
                onClick={() => onInteraction(post.id, 'ayni')}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#E91E63' },
                }}
              >
                {post.interactions.ayniOffers}
              </Button>
            )}
          </Stack>
          <IconButton size="small">
            <Visibility />
          </IconButton>
        </Stack>
      </CardContent>
    </CosmicCard>
  );
};

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  isConnected,
  quickActions,
  onQuickAction,
  communityMetrics,
}) => {
  const theme = useTheme();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<string>('knowledge');

  // 🎯 Filtrar posts según el filtro seleccionado
  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.category === filter;
  });

  // 🎯 Manejar interacciones con posts
  const handlePostInteraction = useCallback(
    (postId: string, action: string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                interactions: {
                  ...post.interactions,
                  likes:
                    action === 'like'
                      ? post.interactions.likes + 1
                      : post.interactions.likes,
                  comments:
                    action === 'comment'
                      ? post.interactions.comments + 1
                      : post.interactions.comments,
                  shares:
                    action === 'share'
                      ? post.interactions.shares + 1
                      : post.interactions.shares,
                  ayniOffers:
                    action === 'ayni'
                      ? post.interactions.ayniOffers + 1
                      : post.interactions.ayniOffers,
                },
              }
            : post
        )
      );
    },
    []
  );

  // 🎯 Crear nuevo post
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `new-${Date.now()}`,
      author: {
        name: 'Tú',
        level: 'Colaborador Activo',
        trustScore: 4.5,
      },
      content: newPostContent,
      timestamp: 'Ahora',
      category: newPostCategory as any,
      interactions: {
        likes: 0,
        comments: 0,
        shares: 0,
        ayniOffers: 0,
      },
      merits: 10,
      tags: ['nuevo'],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCreateDialog(false);
  };

  return (
    <Box>
      {/* 🎯 Header del feed comunitario */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(
            '#E91E63',
            0.9
          )} 0%, ${alpha('#9C27B0', 0.9)} 100%)`,
          color: 'white',
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Feed Comunitario CoomÜnity
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Donde el Bien Común cobra vida a través del Ayni
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Badge
                badgeContent={communityMetrics.onlineMembers}
                color="error"
              >
                <Circle sx={{ color: '#4CAF50' }} />
              </Badge>
              <Typography variant="body2">
                {communityMetrics.onlineMembers} en línea
              </Typography>
            </Stack>
          </Stack>

          {/* Métricas rápidas */}
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {communityMetrics.dailyInteractions}
                </Typography>
                <Typography variant="caption">Interacciones hoy</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {communityMetrics.ayniExchanges}
                </Typography>
                <Typography variant="caption">Intercambios Ayni</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {communityMetrics.activeCircles}
                </Typography>
                <Typography variant="caption">Círculos activos</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  +{communityMetrics.weeklyGrowth}%
                </Typography>
                <Typography variant="caption">Crecimiento</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 🎯 Acciones rápidas */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Acciones Ayni Rápidas
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} sm={3} key={action.id}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onQuickAction(action.id, action.path)}
                  sx={{
                    flexDirection: 'column',
                    py: 2,
                    minHeight: 80,
                    border: `2px solid ${alpha('#E91E63', 0.2)}`,
                    '&:hover': {
                      bgcolor: alpha('#E91E63', 0.05),
                      border: `2px solid ${alpha('#E91E63', 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {action.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {action.description}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* 🎯 Controles del feed */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? 'contained' : 'outlined'}
                size="small"
              >
                Filtros
              </Button>
              <Button startIcon={<Refresh />} size="small">
                Actualizar
              </Button>
            </Stack>
            <Button
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              variant="contained"
              sx={{ bgcolor: '#E91E63' }}
            >
              Crear Post
            </Button>
          </Stack>

          {/* Panel de filtros */}
          {showFilters && (
            <Box sx={{ mt: 2 }}>
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, value) => value && setFilter(value)}
                size="small"
              >
                <ToggleButton value="all">Todos</ToggleButton>
                <ToggleButton value="ayni">Ayni</ToggleButton>
                <ToggleButton value="knowledge">Sabiduría</ToggleButton>
                <ToggleButton value="collaboration">Colaboración</ToggleButton>
                <ToggleButton value="celebration">Celebración</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 🎯 Lista de posts */}
      <Box>
        {filteredPosts.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <CardContent>
              <Psychology
                sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No hay publicaciones en esta categoría
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sé el primero en compartir algo significativo
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Zoom key={post.id} in={true} style={{ transitionDelay: '100ms' }}>
              <div>
                <PostCard post={post} onInteraction={handlePostInteraction} />
              </div>
            </Zoom>
          ))
        )}
      </Box>

      {/* 🎯 Dialog para crear post */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>✍️ Compartir con la Comunidad CoomÜnity</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="¿Qué quieres compartir con la comunidad?"
              multiline
              rows={4}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Comparte conocimiento, haz una propuesta Ayni, celebra un logro..."
              fullWidth
            />
            <Box>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Categoría:
              </Typography>
              <ToggleButtonGroup
                value={newPostCategory}
                exclusive
                onChange={(_, value) => value && setNewPostCategory(value)}
                size="small"
              >
                <ToggleButton value="knowledge">
                  Compartir Sabiduría
                </ToggleButton>
                <ToggleButton value="ayni">Intercambio Ayni</ToggleButton>
                <ToggleButton value="collaboration">Colaboración</ToggleButton>
                <ToggleButton value="celebration">Celebración</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPostContent.trim()}
            sx={{ bgcolor: '#E91E63' }}
          >
            Publicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🎯 FAB de scroll to top */}
      <Fab
        color="primary"
        size="small"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: '#E91E63',
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <KeyboardArrowUp />
      </Fab>
    </Box>
  );
};
