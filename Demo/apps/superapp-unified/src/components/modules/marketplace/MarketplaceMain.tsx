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
  LinearProgress,
  Slide,
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
  SelfImprovement,
  Psychology,
  FavoriteRounded,
  Balance,
  WaterDrop,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { ProductCard, ItemGrid } from './components';
import { EnhancedMarketplaceCard } from './components';
import { MobileMarketplaceView } from './components';
import {
  useMarketplaceData,
} from '../../../hooks/useRealBackendData';
import { useQueryClient } from '@tanstack/react-query';
import { CreateItemModal } from './components/CreateItemModal';
import UnitsWallet from './components/UnitsWallet';
import { LetsListings } from './components/LetsListings';
import MarketplaceFilterBar from './components/MarketplaceFilterBar';
import { RevolutionaryWidget } from '../../../design-system/templates/RevolutionaryWidget';
import { ConsciousLoadingState } from '../../ui/enhanced/ConsciousLoadingState';
import { motion } from 'framer-motion';
import { impactCategories } from './marketplace.constants';
import { QuickViewModal } from './components/QuickViewModal';

const marketplaceCosmicEffects = {
  enableGlow: true,
  enableParticles: true,
  enableAnimations: true,
  enableOrbitalEffects: true,
  enableConsciousnessAura: true,
  glowIntensity: 1.2,
  particleConfig: {
    count: 8,
    size: 4,
    color: '#4f46e5',
    speed: 0.3,
    opacity: 0.7,
    blur: true,
    ayniMode: true,
  }
};

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  lukas: number;
  category: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    isEmprendedorConfiable: boolean;
    ayniScore: number;
    meritos: number;
  };
  stats: {
    views: number;
    likes: number;
    rating: number;
    reviewCount: number;
    isPopular: boolean;
    isSustainable: boolean;
  };
  type: 'product' | 'service';
  tags: string[];
  createdAt: string;
  location?: string;
  isFavorited?: boolean;
  stock: number;
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
    | 'impact'
    | 'ayni_score'
    | 'consciousness';
  tags: string[];
  hasDiscount: boolean;
  impactLevel?: 'local' | 'regional' | 'global';
  consciousnessLevel?: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
  minimumAyniScore?: number;
}

const getConsciousnessStyle = (level?: string) => {
  switch (level) {
    case 'TRANSCENDENT':
      return {
        color: '#fbbf24',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        glow: '0 0 20px rgba(251, 191, 36, 0.3)',
        icon: <AutoAwesome />,
      };
    case 'FLOURISHING':
      return {
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        glow: '0 0 15px rgba(16, 185, 129, 0.2)',
        icon: <EmojiNature />,
      };
    case 'GROWING':
      return {
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        glow: '0 0 10px rgba(59, 130, 246, 0.2)',
        icon: <SelfImprovement />,
      };
    case 'SEED':
    default:
      return {
        color: '#6b7280',
        gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        glow: '0 0 5px rgba(107, 114, 128, 0.1)',
        icon: <WaterDrop />,
      };
  }
};

const mapItemToUIItem = (item: any): MarketplaceItem => {
  const consciousnessStyle = getConsciousnessStyle(item.consciousnessLevel);

  const sellerData = item.seller || {};
  const isEmprendedorConfiable = (sellerData.rating || 0) >= 4.5 && (sellerData.reviewCount || 0) > 10;

  return {
    id: item.id || 'unknown-product',
    title: item.title || 'Producto Sin Título',
    description: item.description || 'No hay descripción disponible.',
    priceUSD: item.price || 0,
    lukas: item.price || 0,
    category: item.category || 'General',
    images: item.images && item.images.length > 0 ? item.images : ['https://via.placeholder.com/300'],
    seller: {
      id: sellerData.id || 'unknown-seller',
      name: sellerData.name || 'Vendedor Anónimo',
      avatar: sellerData.avatar || 'https://via.placeholder.com/150',
      isEmprendedorConfiable,
      ayniScore: sellerData.ayniScore || Math.floor(Math.random() * 50) + 50,
      meritos: sellerData.meritos || Math.floor(Math.random() * 1000),
    },
    stats: {
      views: item.viewCount || 0,
      likes: item.favoriteCount || 0,
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      isPopular: item.trending || false,
      isSustainable: (item.sustainabilityScore || 0) > 70,
    },
    type: item.type || 'product',
    tags: item.tags || [],
    createdAt: item.createdAt || new Date().toISOString(),
    location: item.location || 'Online',
    isFavorited: item.isFavorited || false,
    stock: Math.floor(Math.random() * 50),
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
    consciousnessLevel: undefined,
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [displayedItems, setDisplayedItems] = useState<MarketplaceItem[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<MarketplaceItem | null>(null);

  const impactProducts = useMemo(() => {
    if (!marketplaceItemsResponse?.items) {
      return [];
    }
    return marketplaceItemsResponse.items.map(mapItemToUIItem);
  }, [marketplaceItemsResponse]);

  useEffect(() => {
    if (marketplaceItemsResponse?.items) {
      setDisplayedItems(marketplaceItemsResponse.items.map(mapItemToUIItem));
    }
  }, [marketplaceItemsResponse]);

  const handleProductClick = useCallback(
    (productId: string) => {
      const item = displayedItems.find(p => p.id === productId);
      if (item) {
        setQuickViewItem(item);
      }
    },
    [displayedItems]
  );

  const handleToggleFavorite = useCallback(
    (itemId: string) => {
      if (!user) return;
      setDisplayedItems(currentItems =>
        currentItems.map(item =>
          item.id === itemId ? { ...item, isFavorited: !item.isFavorited } : item
        )
      );
      // TODO: API call to persist favorite status
    },
    [user]
  );

  const handleQuickViewToggleFavorite = (itemId: string) => {
    handleToggleFavorite(itemId);
    setQuickViewItem(prev => (prev ? { ...prev, isFavorited: !prev.isFavorited } : null));
  };

  const handleShare = (itemId: string) => {
    console.log('Sharing item:', itemId);
    // Lógica para compartir aquí
  };

  const handleAddToCart = (itemId: string) => {
    console.log('Adding to cart:', itemId);
    // Lógica para agregar al carrito aquí
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
    let items = isSearchActive ? searchResults : displayedItems;

    if (selectedCategory && selectedCategory !== '') {
      items = items.filter((item: MarketplaceItem) => item.category === selectedCategory);
    }

    switch (currentFilters.sortBy) {
      case 'price_asc':
        items = [...items].sort((a, b) => a.priceUSD - b.priceUSD);
        break;
      case 'price_desc':
        items = [...items].sort((a, b) => b.priceUSD - a.priceUSD);
        break;
      case 'rating':
        items = [...items].sort((a, b) => b.stats.rating - a.stats.rating);
        break;
      case 'newest':
        items = [...items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'trending':
        items = [...items].sort((a, b) => {
          if (a.stats.isPopular && !b.stats.isPopular) return -1;
          if (!a.stats.isPopular && b.stats.isPopular) return 1;
          return b.stats.views - a.stats.views;
        });
        break;
      case 'impact':
        items = [...items].sort((a, b) => {
          const scoreA = a.stats.isSustainable ? 1 : 0;
          const scoreB = b.stats.isSustainable ? 1 : 0;
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
    displayedItems,
    selectedCategory,
    currentFilters.sortBy,
  ]);

  const marketplaceStats = {
    totalProducts: displayedItems.length,
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
      priceUSD: typeof item.price === 'number' ? item.price : 0,
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
      tags: Array.isArray(item.tags) ? item.tags.filter((tag: any) => typeof tag === 'string' && tag.trim()) : [],
      featured: Boolean(item.featured),
      trending: Boolean(item.trending)
    }));
  }, [marketplaceItemsResponse]);

  if (isLoadingItems) {
    return (
      <RevolutionaryWidget
        title="💧 GMP - Gamified Match Place"
        subtitle="Conectando con el ecosistema de intercambio consciente"
        variant="elevated"
        element="agua"
        cosmicEffects={marketplaceCosmicEffects}
        cosmicIntensity="medium"
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* 🌊 Estado de carga consciente principal */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <ConsciousLoadingState
              element="agua"
              variant="meditation"
              size="large"
              context="marketplace"
              showProgress={false}
            />
          </Box>

          {/* 💧 Esqueletos conscientes de productos */}
          <Box sx={{ mb: 4 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={120}
              sx={{
                borderRadius: 3,
                mb: 3,
                background: 'linear-gradient(90deg, rgba(78, 205, 196, 0.1) 25%, rgba(78, 205, 196, 0.2) 50%, rgba(78, 205, 196, 0.1) 75%)',
                backgroundSize: '200px 100%',
                animation: 'shimmer 1.5s infinite'
              }}
            />

            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: 'rgba(78, 205, 196, 0.02)',
                      border: '1px solid rgba(78, 205, 196, 0.1)'
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      sx={{
                        background: 'linear-gradient(90deg, rgba(78, 205, 196, 0.1) 25%, rgba(78, 205, 196, 0.2) 50%, rgba(78, 205, 196, 0.1) 75%)',
                        backgroundSize: '200px 100%',
                        animation: 'shimmer 1.5s infinite'
                      }}
                    />
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

          {/* ✨ Mensaje inspirador de carga */}
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#4ECDC4',
                fontWeight: 500,
                textAlign: 'center',
                textShadow: '0 0 10px rgba(78, 205, 196, 0.3)'
              }}
            >
              🌊 Sincronizando con emprendedores confiables...
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 400 }}>
              Conectando con productos y servicios que priorizan el <strong>Bien Común</strong> y
              practican la <strong>Reciprocidad (Ayni)</strong> en cada intercambio.
            </Typography>
          </Box>

          <style>
            {`
              @keyframes shimmer {
                0% { background-position: -200px 0; }
                100% { background-position: calc(200px + 100%) 0; }
              }
            `}
          </style>
        </Container>
      </RevolutionaryWidget>
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
    return <MobileMarketplaceView />;
  }

  // 🖥️ Layout de escritorio optimizado
  return (
    <Box data-testid="marketplace-container">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <MarketplaceFilterBar
          categories={impactCategories}
          activeCategory={selectedCategory}
          onCategoryChange={(category: string) => {
            setSelectedCategory(category === 'all' ? '' : category);
          }}
          onSearch={(query: string) =>
            handleFiltersChange({ ...currentFilters, query })
          }
          onOpenAdvancedFilters={() => setShowAdvancedSearch(true)}
        />

        <ItemGrid
          items={itemsToDisplay}
          isLoading={isLoadingItems}
          onToggleFavorite={handleToggleFavorite}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onShare={handleShare}
          viewMode={viewMode}
        />

        <QuickViewModal
          open={!!quickViewItem}
          onClose={() => setQuickViewItem(null)}
          item={quickViewItem}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleQuickViewToggleFavorite}
        />

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleOpenCreateModal}
        >
          <AddIcon />
        </Fab>
      </Container>

      <CreateItemModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
};

export default MarketplaceMain;
