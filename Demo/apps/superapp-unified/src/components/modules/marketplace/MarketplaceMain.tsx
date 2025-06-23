import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  Button,
  Alert,
  AlertTitle,
  Fab,
  Paper,
  Chip,
  Stack,
  Divider,
  Card,
  CardContent,
  Avatar,
  Rating,
  Tooltip,
  Badge,
  Fade,
  Grow,
  Zoom,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  FilterList,
  Add as AddIcon,
  GridView,
  ViewList,
  TuneOutlined,
  FavoriteOutlined,
  FavoriteBorderOutlined,
  ShareOutlined,
  LocalOffer,
  TrendingUp,
  StarBorder as Star,
  Verified,
  LocationOn,
  Search,
  AutoAwesome,
  ShoppingCart,
  Store,
  School,
  Healing,
  Agriculture,
  RecyclingOutlined,
  EmojiNature,
  VolunteerActivism,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { ProductCard } from './components';
import ProductCardEnhanced from './components/ProductCardEnhanced';
import { MobileMarketplaceView } from './components';
import {
  useMarketplaceData,
} from '../../../hooks/useRealBackendData';
import { useQueryClient } from '@tanstack/react-query';
import CreateItemModal from './components/CreateItemModal';
import UnitsWallet from './components/UnitsWallet';
import { LetsListings } from './components/LetsListings';
import SearchBar from './components/SearchBar';
import ItemGrid from './components/ItemGrid';
import LoadingSkeleton from './components/LoadingSkeleton';
import NoResults from './components/NoResults';
import { RevolutionaryWidget } from '../../design-system/templates/RevolutionaryWidget';

const marketplaceCosmicEffects = {
  enableGlow: true,
  enableParticles: true,
  enableAnimations: true,
  enableOrbitalEffects: true,
  glowIntensity: 1.0,
  particleConfig: {
    count: 5,
    size: 3,
    color: '#888888',
    speed: 0.5,
    opacity: 0.5,
    blur: true,
  }
};

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
  };
  location: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  createdAt: string;
  viewCount: number;
  favoriteCount: number;
  isFavorited?: boolean;
  discount?: number;
  originalPrice?: number;
  impactLevel?: 'local' | 'regional' | 'global';
  sustainabilityScore?: number;
}

interface SearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  location: string;
  rating: number;
  verified: boolean;
  sortBy:
    | 'relevance'
    | 'price_asc'
    | 'price_desc'
    | 'rating'
    | 'newest'
    | 'trending'
    | 'impact';
  tags: string[];
  hasDiscount: boolean;
  impactLevel?: 'local' | 'regional' | 'global';
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  count?: number;
  impact?: string;
}

const mapItemToUIItem = (item: any): MarketplaceItem => {
  if (item.seller?.firstName && item.seller?.lastName) {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      currency: item.currency === 'LUKAS' ? 'ü' : item.currency,
      category: item.category,
      images: item.images || [],
      seller: {
        id: item.seller?.id || 'unknown',
        name:
          `${item.seller?.firstName || ''} ${item.seller?.lastName || ''}`.trim() ||
          'Usuario',
        username: item.seller?.username || '@usuario',
        avatar:
          item.seller?.avatarUrl ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: item.seller?.verified || true,
        rating: item.seller?.rating || item.rating || 4.5,
        reviewCount: item.seller?.reviewCount || item.reviewCount || 0,
      },
      location: item.location || 'Online',
      rating: item.rating || 4.5,
      reviewCount: item.reviewCount || 0,
      tags: item.tags || [],
      featured: item.featured || false,
      trending: item.trending || false,
      createdAt: item.createdAt || new Date().toISOString(),
      viewCount: item.viewCount || 0,
      favoriteCount: item.favoriteCount || 0,
      isFavorited: false,
      discount: item.originalPrice
        ? Math.round(
            ((item.originalPrice - item.price) / item.originalPrice) * 100
          )
        : undefined,
      impactLevel: item.impactLevel || 'local',
      sustainabilityScore: item.sustainabilityScore || 85,
    };
  }

  return {
    id: item.id || 'unknown',
    title: item.title || 'Producto sin título',
    description: item.description || 'Sin descripción disponible',
    price: item.priceUnits || 0,
    currency: item.currency === 'LUKAS' ? 'ü' : item.currency || 'ü',
    category:
      item.type === 'SERVICE'
        ? 'tecnologia-social'
        : item.type === 'PRODUCT'
          ? 'sostenibilidad'
          : item.type === 'DIGITAL_CONTENT'
            ? 'educacion'
            : item.type === 'EXPERIENCE'
              ? 'comunidad'
              : item.type === 'SKILL_EXCHANGE'
                ? 'economia-circular'
                : 'sostenibilidad',
    images: item.images || (item.imageUrl ? [item.imageUrl] : []),
    seller: {
      id: item.seller?.id || 'unknown',
      name:
        `${item.seller?.firstName || ''} ${item.seller?.lastName || ''}`.trim() ||
        'Usuario',
      username: item.seller?.username || '@usuario',
      avatar:
        item.seller?.avatarUrl ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.8,
      reviewCount: Math.floor(Math.random() * 100) + 20,
    },
    location: item.location || 'Online',
    rating: 4.8,
    reviewCount: Math.floor(Math.random() * 100) + 20,
    tags: item.tags || [],
    featured: Math.random() > 0.7,
    trending: item.viewCount > 40,
    createdAt: item.createdAt,
    viewCount: item.viewCount || 0,
    favoriteCount: item.favoriteCount || 0,
    isFavorited: false,
    impactLevel:
      Math.random() > 0.6
        ? 'global'
        : Math.random() > 0.3
          ? 'regional'
          : 'local',
    sustainabilityScore: Math.floor(Math.random() * 20) + 80,
  };
};

const MarketplaceMain: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  const {
    data: marketplaceItemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchMarketplaceData,
  } = useMarketplaceData();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['marketplace-items'] });
  }, [queryClient]);

  useEffect(() => {
    if (marketplaceItemsResponse?.items) {
      const hasTestData = marketplaceItemsResponse.items.some(
        (item: any) =>
          item.title?.includes('Test Item by Admin') ||
          item.description?.includes('test E2E')
      );

      if (hasTestData && marketplaceItemsResponse.source !== 'mock-rich-data') {
        console.warn(
          '🚨 Detectados datos de test del backend, forzando recarga con datos mock...'
        );
        queryClient.clear();
        setTimeout(() => refetchMarketplaceData(), 100);
      }
    }
  }, [marketplaceItemsResponse, queryClient, refetchMarketplaceData]);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    text: string;
  } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (itemsError) {
      console.error('❌ Error en marketplace:', itemsError);

      const errorMessage = itemsError.message || 'Error desconocido';

      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setFeedbackMessage({
          type: 'warning',
          text: '🌐 Problemas de conexión. Mostrando datos locales.'
        });
      } else if (errorMessage.includes('timeout')) {
        setFeedbackMessage({
          type: 'warning',
          text: '⏱️ El servidor está tardando. Usando datos de respaldo.'
        });
      } else {
        setFeedbackMessage({
          type: 'info',
          text: '🎨 Modo demo activado. ¡Explora la experiencia CoomÜnity!'
        });
      }

      setTimeout(() => setFeedbackMessage(null), 5000);
    } else if (marketplaceItemsResponse?.success) {
      if (retryCount > 0) {
        setFeedbackMessage({
          type: 'success',
          text: '✅ Conexión restaurada. Datos actualizados.'
        });
        setTimeout(() => setFeedbackMessage(null), 3000);
        setRetryCount(0);
      }
    }
  }, [itemsError, marketplaceItemsResponse, retryCount]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      await refetchMarketplaceData();
      setFeedbackMessage({
        type: 'info',
        text: '🔄 Reintentando conexión...'
      });
    } catch (error) {
      console.error('Error en reintento:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const [selectedRole, setSelectedRole] = useState<'consumer' | 'provider'>(
    'consumer'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priceRange: [0, 5000],
    location: 'any',
    rating: 0,
    verified: false,
    sortBy: 'relevance',
    tags: [],
    hasDiscount: false,
    impactLevel: undefined,
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const impactProducts = useMemo(() => {
    if (!marketplaceItemsResponse?.items) {
      return [];
    }
    return marketplaceItemsResponse.items.map(mapItemToUIItem);
  }, [marketplaceItemsResponse]);

  const impactCategories: Category[] = [
    {
      id: 'sostenibilidad',
      name: 'Sostenibilidad',
      icon: 'eco',
      impact: 'PROYECTOS ECO-FRIENDLY Y SOSTENIBLES',
    },
    {
      id: 'educacion',
      name: 'Educación',
      icon: 'school',
      impact: 'CONOCIMIENTO ACCESIBLE PARA TODOS',
    },
    {
      id: 'salud-bienestar',
      name: 'Salud & Bienestar',
      icon: 'healing',
      impact: 'BIENESTAR FÍSICO Y MENTAL',
    },
    {
      id: 'desarrollo-comunitario',
      name: 'Desarrollo Comunitario',
      icon: 'volunteer',
      impact: 'FORTALECIMIENTO SOCIAL',
    },
    {
      id: 'tecnologia-social',
      name: 'Tecnología Social',
      icon: 'tech',
      impact: 'TECH PARA IMPACTO POSITIVO',
    },
    {
      id: 'agricultura-consciente',
      name: 'Agricultura Consciente',
      icon: 'agriculture',
      impact: 'ALIMENTACIÓN SOSTENIBLE',
    },
    {
      id: 'economia-circular',
      name: 'Economía Circular',
      icon: 'recycling',
      impact: 'REDUCIR, REUTILIZAR, RECICLAR',
    },
    {
      id: 'inclusion-social',
      name: 'Inclusión Social',
      icon: 'inclusion',
      impact: 'OPORTUNIDADES PARA TODOS',
    },
  ];

  const getCategoryIcon = (iconName: string) => {
    const commonSx = {
      fontSize: { xs: 24, md: 32 },
      mb: 1,
      color: theme.palette.text.primary,
    };
    switch (iconName) {
      case 'eco':
        return <EmojiNature sx={commonSx} />;
      case 'school':
        return <School sx={commonSx} />;
      case 'healing':
        return <Healing sx={commonSx} />;
      case 'volunteer':
        return <VolunteerActivism sx={commonSx} />;
      case 'tech':
        return <Store sx={commonSx} />;
      case 'agriculture':
        return <Agriculture sx={commonSx} />;
      case 'recycling':
        return <RecyclingOutlined sx={commonSx} />;
      case 'inclusion':
        return <AutoAwesome sx={commonSx} />;
      default:
        return <Star sx={commonSx} />;
    }
  };

  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/marketplace/product/${productId}`);
    },
    [navigate]
  );

  const handleToggleFavorite = useCallback(
    (itemId: string) => {
      if (!user) return;
      console.log('Toggle favorite:', itemId);
    },
    [user]
  );

  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  const handleChatClick = () => {
    console.log('Chat clicked');
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  const handleOpenCreateModal = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    console.log('✅ Item creado exitosamente');
  };

  const handleSearchResults = useCallback(
    (results: MarketplaceItem[]) => {
      setSearchResults(results);
      setIsSearchActive(results.length > 0 || currentFilters.query.length > 0);
    },
    [currentFilters.query]
  );

  const handleFiltersChange = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters);
    setIsSearchActive(
      filters.query.length > 0 ||
        filters.category.length > 0 ||
        filters.location.length > 0 ||
        filters.rating > 0 ||
        filters.verified ||
        filters.tags.length > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 5000 ||
        filters.hasDiscount
    );
  }, []);

  const itemsToDisplay = useMemo(() => {
    let items = isSearchActive ? searchResults : impactProducts;

    if (selectedCategory && selectedCategory !== '') {
      items = items.filter((item) => item.category === selectedCategory);
    }

    switch (currentFilters.sortBy) {
      case 'price_asc':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items = [...items].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        items = [...items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'trending':
        items = [...items].sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return b.viewCount - a.viewCount;
        });
        break;
      case 'impact':
        items = [...items].sort((a, b) => {
          const scoreA = a.sustainabilityScore || 0;
          const scoreB = b.sustainabilityScore || 0;
          return scoreB - scoreA;
        });
        break;
      default:
        break;
    }

    return items;
  }, [
    isSearchActive,
    searchResults,
    impactProducts,
    selectedCategory,
    currentFilters.sortBy,
  ]);

  const marketplaceStats = {
    totalProducts: impactProducts.length,
    activeProviders: 8,
    totalImpact: '2.4K',
    communitiesServed: 47,
  };

  const marketplaceItems = useMemo(() => {
    if (!marketplaceItemsResponse?.items) return [];

    return marketplaceItemsResponse.items.map((item: any) => ({
      ...item,
      id: item.id || `item-${Date.now()}-${Math.random()}`,
      title: item.title || 'Producto sin título',
      description: item.description || 'Descripción no disponible',
      price: typeof item.price === 'number' ? item.price : 0,
      currency: item.currency || 'LUKAS',
      images: Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : ['https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400'],
      seller: {
        ...item.seller,
        name: item.seller?.name || 'Vendedor anónimo',
        verified: Boolean(item.seller?.verified),
        rating: typeof item.seller?.rating === 'number' ? item.seller.rating : 4.0,
        avatarUrl: item.seller?.avatarUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10) + 1}`
      },
      rating: typeof item.rating === 'number' ? Math.max(0, Math.min(5, item.rating)) : 4.0,
      reviewCount: typeof item.reviewCount === 'number' ? Math.max(0, item.reviewCount) : 0,
      tags: Array.isArray(item.tags) ? item.tags.filter(tag => typeof tag === 'string' && tag.trim()) : [],
      featured: Boolean(item.featured),
      trending: Boolean(item.trending)
    }));
  }, [marketplaceItemsResponse]);

  if (isLoadingItems) {
    return (
      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.default', color: 'text.primary' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 3, mb: 3 }} />
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ mt: 4 }}>
            <CircularProgress
              size={40}
              thickness={3}
              sx={{
                color: theme.palette.primary.main,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round'
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              🌱 Cargando productos que contribuyen al Bien Común...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (itemsError && !marketplaceItems.length) {
    return (
      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.default', color: 'text.primary' }}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              background: `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.main, 0.02)})`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 3
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 16px',
                background: `linear-gradient(145deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.8)})`,
                fontSize: '2rem'
              }}
            >
              🛒
            </Avatar>

            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
              Marketplace en Modo Demo
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Estamos mostrando una experiencia de demostración del marketplace CoomÜnity.
              Explora cómo funciona nuestro sistema de intercambio basado en Reciprocidad y Bien Común.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={handleRetry}
                disabled={isRetrying}
                startIcon={isRetrying ? <CircularProgress size={20} /> : <RefreshIcon />}
                sx={{ minWidth: 160 }}
              >
                {isRetrying ? 'Reintentando...' : 'Intentar de Nuevo'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                startIcon={<HomeIcon />}
              >
                Recargar Página
              </Button>
            </Stack>

            {retryCount > 0 && (
              <Alert
                severity="info"
                sx={{ mt: 3, textAlign: 'left' }}
                icon={<InfoIcon />}
              >
                <AlertTitle>Intentos de conexión: {retryCount}</AlertTitle>
                Continuamos en modo demo para que puedas explorar la plataforma.
                Los datos que ves son representativos de la experiencia real.
              </Alert>
            )}
          </Card>
        </Container>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <MobileMarketplaceView
        onMenuClick={handleMenuClick}
        onChatClick={handleChatClick}
        onNotificationsClick={handleNotificationsClick}
      />
    );
  }

  // 🖥️ Layout de escritorio optimizado
  return (
    <RevolutionaryWidget>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Marketplace
        </Typography>

        {/* Search Bar */}
        <SearchBar
          onSearch={(query) => setCurrentFilters(prev => ({ ...prev, query }))}
          onFilterChange={(newFilters) => setCurrentFilters(prev => ({ ...prev, ...newFilters }))}
        />

        {/* Categories Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Categorías de Impacto
          </Typography>
          <Grid container spacing={isMobile ? 2 : 3}>
            {impactCategories.map((category) => (
              <Grid item xs={6} sm={4} md={3} key={category.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    border: `1px solid`,
                    borderColor: 'divider',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                    }
                  }}
                >
                  {getCategoryIcon(category.icon)}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {category.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* LETS Integration Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
               <UnitsWallet />
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
             <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
              <LetsListings />
             </Paper>
          </Grid>
        </Grid>

        {/* Items Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Todos los Servicios</Typography>
          {isLoadingItems ? (
            <LoadingSkeleton />
          ) : itemsToDisplay.length === 0 ? (
            <NoResults
              isSearchActive={isSearchActive}
              onClearSearch={() => handleFiltersChange({ query: '' })}
              onCreateItem={handleOpenCreateModal}
            />
          ) : (
            <ItemGrid
              items={itemsToDisplay}
              onToggleFavorite={handleToggleFavorite}
              onProductClick={handleProductClick}
              viewMode={viewMode}
            />
          )}
        </Box>
      </Container>

      {/* FAB para crear item */}
      <Zoom in timeout={500} style={{ transitionDelay: '300ms' }}>
        <Fab
          color="primary"
          aria-label="crear item"
          onClick={handleOpenCreateModal}
          data-testid="create-item-fab"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* Modal de Creación de Items */}
      <CreateItemModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </RevolutionaryWidget>
  );
};

export default MarketplaceMain;
