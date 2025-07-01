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
import { EnhancedMarketplaceCardSkeleton } from './components/EnhancedMarketplaceCard.skeleton';
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
import { motion, AnimatePresence } from 'framer-motion';
import {
  impactCategories,
  getConsciousnessStyle,
} from './marketplace.constants.tsx';
import { QuickViewModal } from './components/QuickViewModal';
import MarketplaceAtrium from './components/MarketplaceAtrium';
import {
  MarketplaceItem,
  MarketplaceSearchFilters,
} from '../../../types/marketplace';
import { ChatModal } from './components/ChatModal';
import { MODULE_COLORS } from '../../../theme/colors';
import { useGuardianColors } from '../../../components/theme/GuardianColorProvider';

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
    reciprocidadMode: true,
  }
};

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', // community garden
  'https://images.unsplash.com/photo-1584147791147-4e72b042ad2f?w=600&q=80', // seed exchange
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80', // holistic circle
];

const needsImageReplacement = (url: string) => {
  if (!url) return true;
  // Detect common loremflickr domains or obvious cat statue keywords
  const lower = url.toLowerCase();
  return lower.includes('loremflickr') || lower.includes('cat') || lower.includes('statue');
};

const sanitizeImages = (imgs: string[] | undefined): string[] => {
  if (!imgs || imgs.length === 0) return [FALLBACK_IMGS[0]];
  const sanitized = imgs.map((url, idx) => (needsImageReplacement(url) ? FALLBACK_IMGS[idx % FALLBACK_IMGS.length] : url));
  return sanitized;
};

const mapItemToUIItem = (item: any): MarketplaceItem => {
  const sellerData = item.seller || {};
  const isEmprendedorConfiable = (sellerData.rating || 0) >= 4.5 && (sellerData.reviewCount || 0) > 10;

  return {
    id: item.id || 'unknown-product',
    title: item.title || 'Producto Sin Título',
    description: item.description || 'No hay descripción disponible.',
    priceUSD: item.price || 0,
    lukas: item.price || 0,
    category: item.category || 'General',
    images: sanitizeImages(item.images),
    seller: {
      id: sellerData.id || 'unknown-seller',
      name: sellerData.name || 'Vendedor Anónimo',
      avatar: sellerData.avatar || 'https://via.placeholder.com/150',
      isEmprendedorConfiable,
      reciprocidadScore: sellerData.reciprocidadScore || Math.floor(Math.random() * 50) + 50,
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
    consciousnessLevel: item.consciousnessLevel,
  };
};

const MarketplaceMain: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { palette, getElementColor } = useGuardianColors();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();
  const [hasEntered, setHasEntered] = useState(false);

  const {
    data: marketplaceItemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchMarketplaceData,
  } = useMarketplaceData();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<Partial<MarketplaceSearchFilters>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);
  const [activeQuickViewItem, setActiveQuickViewItem] = useState<MarketplaceItem | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [currentItemForChat, setCurrentItemForChat] = useState<MarketplaceItem | null>(null);

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
  };

  const handleFiltersChange = useCallback((filters: Partial<MarketplaceSearchFilters>) => {
    setCurrentFilters(prev => ({ ...prev, ...filters }));
  }, []);

  const handleQuickView = (item: MarketplaceItem) => {
    setActiveQuickViewItem(item);
  };

  const handleFavorite = (itemId: string) => {
    // Lógica para manejar favoritos
    console.log(`Toggled favorite for ${itemId}`);
  };

  const handleShare = (itemId: string) => {
    // Lógica para compartir
    console.log(`Shared item ${itemId}`);
  };

  const handleAddToCart = (itemId: string) => {
    // Lógica para añadir al carro
    console.log(`Added item ${itemId} to cart`);
  };

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleCreateSuccess = () => {
    setFeedbackMessage({ type: 'success', text: '¡Publicación creada con éxito!' });
    handleCloseCreateModal();
    queryClient.invalidateQueries({ queryKey: ['marketplace-items'] });
  };

  const handleOpenChatModal = (item: MarketplaceItem) => {
    setCurrentItemForChat(item);
    setChatModalOpen(true);
  };

  const filteredItems = useMemo(() => {
    if (!marketplaceItemsResponse?.items) return [];
    const items = marketplaceItemsResponse.items.map(mapItemToUIItem);
    // Aquí se aplicaría la lógica de filtrado basada en currentFilters
    return items;
  }, [marketplaceItemsResponse, currentFilters]);

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
      if (feedbackMessage && feedbackMessage.type === 'warning') {
        setFeedbackMessage(null);
      }
    }
  }, [itemsError, marketplaceItemsResponse]);

  const handleRetry = async () => {
    try {
      await refetchMarketplaceData();
      setFeedbackMessage({
        type: 'info',
        text: '🔄 Reintentando conexión...'
      });
    } catch (error) {
      console.error('Error en reintento:', error);
    }
  };

  const [selectedRole, setSelectedRole] = useState<'consumer' | 'provider'>(
    'consumer'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [displayedItems, setDisplayedItems] = useState<MarketplaceItem[]>([]);

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
        title="🏪 GMP - Gamified Match Place"
        subtitle="Conectando con el ecosistema de intercambio consciente"
        variant="elevated"
        element="tierra"
        cosmicEffects={marketplaceCosmicEffects}
        cosmicIntensity="subtle"
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Estado de carga consciente principal */}
          <Box sx={{
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ConsciousLoadingState
              element="tierra"
              variant="meditation"
              size="large"
              context="marketplace"
              showProgress={true}
              message="Descubriendo tesoros del ecosistema..."
            />
          </Box>

          {/* Esqueletos minimalistas de productos */}
          <Grid container spacing={3}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <EnhancedMarketplaceCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Container>
      </RevolutionaryWidget>
    );
  }

  if (itemsError && !marketplaceItems.length) {
    return (
      <RevolutionaryWidget
        title="🏪 GMP - Gamified Match Place"
        subtitle="Ecosistema de intercambio consciente"
        variant="elevated"
        element="tierra"
        cosmicEffects={{}}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: alpha(palette.background, 0.9),
              border: `1px solid ${alpha(palette.divider, 0.8)}`,
              textAlign: 'center',
              maxWidth: 600,
              mx: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                color: palette.text.primary,
                fontWeight: 600,
                mb: 2
              }}
            >
              No pudimos conectar con el Marketplace
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: palette.text.secondary,
                mb: 3
              }}
            >
              Estamos experimentando dificultades para cargar los productos y servicios.
              Por favor, intenta nuevamente en unos momentos.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRetry}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  backgroundColor: MODULE_COLORS.marketplace,
                  '&:hover': {
                    backgroundColor: alpha(MODULE_COLORS.marketplace, 0.9),
                  }
                }}
              >
                Intentar nuevamente
              </Button>

              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                startIcon={<HomeIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  borderColor: alpha(MODULE_COLORS.marketplace, 0.5),
                  color: MODULE_COLORS.marketplace,
                  '&:hover': {
                    borderColor: MODULE_COLORS.marketplace,
                    backgroundColor: alpha(MODULE_COLORS.marketplace, 0.05),
                  }
                }}
              >
                Recargar página
              </Button>
            </Stack>

            {feedbackMessage && feedbackMessage.text && (
              <Alert
                severity={feedbackMessage.type || 'info'}
                sx={{ mt: 3, textAlign: 'left' }}
              >
                {feedbackMessage.text}
              </Alert>
            )}
          </Box>
        </Container>
      </RevolutionaryWidget>
    );
  }

  if (isMobile) {
    return <MobileMarketplaceView />;
  }

  if (!hasEntered) {
    return <MarketplaceAtrium onEnter={() => setHasEntered(true)} />;
  }

  return (
    <Box sx={{
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      py: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {!isMobile && (
            <Grid item xs={12} md={3} lg={2.5}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: theme.shape.borderRadius,
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.background.paper,
                  position: 'sticky',
                  top: 80,
                }}
              >
                <MarketplaceFilterBar
                  onSearch={handleFiltersChange}
                  onOpenAdvancedFilters={() => { console.log("Open advanced filters"); }}
                  categories={impactCategories}
                />
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={9} lg={9.5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              mb={3}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Mercado Consciente
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Descubre productos y servicios que generan Bien Común.
                </Typography>
              </Box>

              {!isMobile && (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                    sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    Publicar
                  </Button>
                  <IconButton onClick={() => handleViewChange('list')}>
                    <ViewList color={view === 'list' ? 'primary' : 'inherit'} />
                  </IconButton>
                  <IconButton onClick={() => handleViewChange('grid')}>
                    <GridView color={view === 'grid' ? 'primary' : 'inherit'} />
                  </IconButton>
                </Stack>
              )}
            </Stack>

    <AnimatePresence>
              {feedbackMessage && (
      <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert severity={feedbackMessage.type} sx={{ mb: 2 }}>
                    {feedbackMessage.text}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {isMobile && (
              <Paper sx={{ p: 1, mb: 2, borderRadius: 2, borderColor: 'divider', backgroundColor: 'background.paper' }} variant="outlined">
            <MarketplaceFilterBar
                  onSearch={handleFiltersChange}
                  onOpenAdvancedFilters={() => { console.log("Open advanced filters"); }}
              categories={impactCategories}
            />
              </Paper>
            )}

            <Box>
              {isLoadingItems && !itemsError ? (
                <ConsciousLoadingState />
              ) : (
            <ItemGrid
                  items={filteredItems}
                  viewMode={view}
                  onToggleFavorite={handleFavorite}
                  onShare={handleShare}
              onAddToCart={handleAddToCart}
              onOpenChat={handleOpenChatModal}
                  isLoading={isLoadingItems}
            />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {isMobile && (
        <Fab
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            '&:hover': {
              bgcolor: 'secondary.dark'
            }
          }}
              onClick={handleOpenCreateModal}
            >
              <AddIcon />
            </Fab>
      )}

          <CreateItemModal
        open={showCreateModal}
            onClose={handleCloseCreateModal}
            onSuccess={handleCreateSuccess}
          />

          {currentItemForChat && (
            <ChatModal
              open={chatModalOpen}
              onClose={() => setChatModalOpen(false)}
              matchId={currentItemForChat.id}
              sellerName={currentItemForChat.seller.name}
              currentUserId={user?.id || ''}
            />
          )}
        </Box>
  );
};

export default MarketplaceMain;
