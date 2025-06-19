import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
} from '@mui/material';
import '../../../styles/marketplace-mobile.css';
import '../../../styles/marketplace-enhanced.css';
import '../../../styles/marketplace-enhanced-v2.css';
import '../../../styles/micro-interactions.css';
import '../../../styles/marketplace-performance.css';
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
  StarBorder as Star, // ✅ CORRECTO - StarBorder existe en @mui/icons-material
  Verified,
  LocationOn,
  Search,
  AutoAwesome,
  ShoppingCart,
  Store,
  // Eco, // No existe en @mui/icons-material
  // Volunteer, // No existe - usar VolunteerActivism
  School,
  Healing,
  Agriculture,
  RecyclingOutlined,
  EmojiNature,
  VolunteerActivism,
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
// 🔄 LETS Integration
import UnitsWallet from './components/UnitsWallet';
import LetsListings from './components/LetsListings';

// 🌌 DESIGN SYSTEM CÓSMICO IMPORTS
import { RevolutionaryWidget } from '../../../design-system/templates/RevolutionaryWidget';

// 🌍 COSMIC EFFECTS PARA MARKETPLACE (ELEMENTO TIERRA) - INTENSIFICADOS
const marketplaceCosmicEffects = {
  enableGlow: true,
  enableParticles: true,
  enableAnimations: true,
  enableOrbitalEffects: true,
  glowIntensity: 1.5, // Incrementado para mayor impacto
  particleConfig: {
    count: 8, // Más partículas
    size: 5, // Partículas más grandes
    color: '#8BC34A', // Verde tierra
    speed: 1.2, // Movimiento más dinámico
    opacity: 0.7, // Mayor visibilidad
    blur: true
  }
};

// 🌱 Tipos de datos optimizados para el bien común
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

// 🔄 Función para mapear datos del backend/mock a la estructura de la UI
const mapItemToUIItem = (item: any): MarketplaceItem => {
  // Si es un item mock (tiene la estructura completa)
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

  // Si es un item del backend (estructura diferente)
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

  // 🔗 Hooks para datos reales del backend
  const {
    data: marketplaceItemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchMarketplaceData,
  } = useMarketplaceData();
  // 🧹 Limpiar caché antigua al montar el componente
  useEffect(() => {
    // Invalidar cachés antiguas que puedan tener datos de test del backend
    queryClient.invalidateQueries({ queryKey: ['marketplace-items'] });
  }, [queryClient]);

  // 🔍 Detectar y limpiar datos de test del backend
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

  // Estados optimizados
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'provider'>(
    'consumer'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    priceRange: [0, 1000],
    location: '',
    rating: 0,
    verified: false,
    sortBy: 'relevance',
    tags: [],
    hasDiscount: false,
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading] = useState(false); // Eliminamos loading persistente

  // 🆕 Estado para el modal de creación de items
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 🎯 Mapear datos del backend/mock a la estructura de la UI
  const impactProducts = useMemo(() => {
    if (!marketplaceItemsResponse?.items) {
      return [];
    }
    return marketplaceItemsResponse.items.map(mapItemToUIItem);
  }, [marketplaceItemsResponse]);

  // 🌍 Categorías enfocadas en el bien común
  const impactCategories: Category[] = [
    {
      id: 'sostenibilidad',
      name: 'Sostenibilidad',
      icon: '🌱',
      color: '#4CAF50',
      count: 32,
      impact: 'Proyectos eco-friendly y sostenibles',
    },
    {
      id: 'educacion',
      name: 'Educación',
      icon: '📚',
      color: '#2196F3',
      count: 28,
      impact: 'Conocimiento accesible para todos',
    },
    {
      id: 'salud',
      name: 'Salud & Bienestar',
      icon: '🏥',
      color: '#FF5722',
      count: 24,
      impact: 'Bienestar físico y mental',
    },
    {
      id: 'comunidad',
      name: 'Desarrollo Comunitario',
      icon: '🤝',
      color: '#9C27B0',
      count: 19,
      impact: 'Fortalecimiento social',
    },
    {
      id: 'tecnologia-social',
      name: 'Tecnología Social',
      icon: '💻',
      color: '#607D8B',
      count: 22,
      impact: 'Tech para impacto positivo',
    },
    {
      id: 'agricultura',
      name: 'Agricultura Consciente',
      icon: '🌾',
      color: '#8BC34A',
      count: 15,
      impact: 'Alimentación sostenible',
    },
    {
      id: 'economia-circular',
      name: 'Economía Circular',
      icon: '♻️',
      color: '#00BCD4',
      count: 18,
      impact: 'Reducir, reutilizar, reciclar',
    },
    {
      id: 'inclusion',
      name: 'Inclusión Social',
      icon: '🌈',
      color: '#E91E63',
      count: 14,
      impact: 'Oportunidades para todos',
    },
  ];

  // Navegación optimizada
  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/marketplace/product/${productId}`);
    },
    [navigate]
  );

  const handleToggleFavorite = useCallback(
    (itemId: string) => {
      if (!user) return;
      // Lógica optimizada de favoritos
      console.log('Toggle favorite:', itemId);
    },
    [user]
  );

  // Funciones de interfaz
  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  const handleChatClick = () => {
    console.log('Chat clicked');
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  // 🎯 Manejo del modal de creación
  const handleOpenCreateModal = () => {
    if (!user) {
      // Redirigir a login si no está autenticado
      navigate('/login');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    // Cerrar el modal tras éxito
    setIsCreateModalOpen(false);
    // La lista se actualiza automáticamente por la invalidación de query en el hook
    console.log('✅ Item creado exitosamente');
  };

  const handleSearchResults = useCallback(
    (results: MarketplaceItem[]) => {
      setSearchResults(results);
      setIsSearchActive(results.length > 0 || currentFilters.query.length > 0);
    },
    [currentFilters.query]
  );

  // Función para manejar cambios de filtros (disponible para extensión futura)
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
        filters.priceRange[1] < 1000 ||
        filters.hasDiscount
    );
  }, []);

  // Items a mostrar - OPTIMIZADO SIN DELAYS
  const itemsToDisplay = useMemo(() => {
    let items = isSearchActive ? searchResults : impactProducts;

    // Filtrar por categoría seleccionada
    if (selectedCategory && selectedCategory !== '') {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Aplicar ordenamiento
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

  // 🚨 Estados de carga y error mejorados
  if (isLoadingItems) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Header skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
            <Skeleton
              variant="rectangular"
              height={120}
              sx={{ borderRadius: 3, mb: 3 }}
            />
          </Box>

          {/* Categories skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width={250} height={40} sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid size={{xs:12,sm:6,md:3}} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Products grid skeleton */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {Array.from({ length: 12 }).map((_, index) => (
              <Grid size={{xs:12,sm:6,md:4,lg:3}} key={index}>
                <Box>
                  <Skeleton
                    variant="rectangular"
                    height={180}
                    sx={{ borderRadius: 2, mb: 1 }}
                  />
                  <Skeleton variant="text" width="80%" height={30} />
                  <Skeleton variant="text" width="60%" height={25} />
                  <Skeleton variant="text" width="40%" height={25} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (itemsError) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Container
          maxWidth="xl"
          sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2, md: 3 } }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Error al cargar el marketplace
            </Typography>
            <Typography variant="body2">
              No se pudo conectar con el backend. Verifica que esté ejecutándose
              en puerto 3002.
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, opacity: 0.8 }}
            >
              Error: {itemsError?.message || 'Conexión fallida'}
            </Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ['marketplace-items'],
                });
                refetchMarketplaceData();
              }}
            >
              Reintentar Conexión
            </Button>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Recargar Página
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // 📱 Layout móvil
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
    <RevolutionaryWidget
      title="🏪 Marketplace CoomÜnity"
      subtitle="Economía colaborativa para el bien común"
      variant="elevated"
      element="tierra"
      cosmicEffects={{ 
        enableGlow: true,
        enableAnimations: true,
        enableParticles: true,
        enableOrbitalEffects: true,
        glowIntensity: 1.5,
        particleTheme: 'dust',
        particleConfig: {
          count: 8,
          size: 5,
          color: '#8BC34A',
          speed: 1.2,
          opacity: 0.7
        }
      }}
      cosmicIntensity="intense"
      style={{ minHeight: '100vh' }}
      data-testid="marketplace-main"
    >
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header mejorado para el bien común */}
        <Box sx={{ mb: 4 }}>
          <Fade in timeout={300}>
            <Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <EmojiNature sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    className="animate-slide-up"
                  >
                    🌱 ÜMarket
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Economía colaborativa para el bien común
                  </Typography>
                </Box>
              </Box>

              {/* Estadísticas de impacto mejoradas */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  background:
                    'linear-gradient(135deg, #4CAF50 0%, #2E7D32 85%, #1B5E20 100%)',
                  color: 'white',
                  borderRadius: 4,
                  mb: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.6,
                  },
                }}
                className="animate-scale-in"
              >
                <Grid container spacing={3}>
                  <Grid size={{xs:6,sm:3}}>
                    <Box
                      textAlign="center"
                      sx={{ position: 'relative', zIndex: 1 }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.15)',
                          mb: 2,
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Store sx={{ fontSize: 28, color: '#E8F5E8' }} />
                      </Box>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          mb: 0.5,
                          background:
                            'linear-gradient(45deg, #E8F5E8, #FFFFFF)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        className="animate-slide-up animate-stagger-1"
                      >
                        {marketplaceStats.totalProducts}+
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                        }}
                        className="animate-slide-up animate-stagger-2"
                      >
                        Servicios de Impacto
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{xs:6,sm:3}}>
                    <Box
                      textAlign="center"
                      sx={{ position: 'relative', zIndex: 1 }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.15)',
                          mb: 2,
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <VolunteerActivism
                          sx={{ fontSize: 28, color: '#E8F5E8' }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          mb: 0.5,
                          background:
                            'linear-gradient(45deg, #E8F5E8, #FFFFFF)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        className="animate-slide-up animate-stagger-2"
                      >
                        {marketplaceStats.activeProviders}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                        }}
                        className="animate-slide-up animate-stagger-3"
                      >
                        Agentes de Cambio
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{xs:6,sm:3}}>
                    <Box
                      textAlign="center"
                      sx={{ position: 'relative', zIndex: 1 }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.15)',
                          mb: 2,
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 28, color: '#E8F5E8' }} />
                      </Box>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          mb: 0.5,
                          background:
                            'linear-gradient(45deg, #E8F5E8, #FFFFFF)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        className="animate-slide-up animate-stagger-3"
                      >
                        {marketplaceStats.totalImpact}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                        }}
                        className="animate-slide-up animate-stagger-4"
                      >
                        Personas Impactadas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{xs:6,sm:3}}>
                    <Box
                      textAlign="center"
                      sx={{ position: 'relative', zIndex: 1 }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.15)',
                          mb: 2,
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <EmojiNature sx={{ fontSize: 28, color: '#E8F5E8' }} />
                      </Box>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          mb: 0.5,
                          background:
                            'linear-gradient(45deg, #E8F5E8, #FFFFFF)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        className="animate-slide-up animate-stagger-4"
                      >
                        {marketplaceStats.communitiesServed}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                        }}
                        className="animate-slide-up animate-stagger-5"
                      >
                        Comunidades Atendidas
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(20px)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    filter: 'blur(25px)',
                  }}
                />
              </Paper>
            </Box>
          </Fade>
        </Box>

        {/* Categorías de impacto mejoradas */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 3 }}
            className="animate-slide-up"
          >
            🎯 Categorías de Impacto
          </Typography>
          <Grid container spacing={2}>
            {impactCategories.map((category, index) => (
              <Grid size={{xs:12,sm:6,md:3}} key={category.id}>
                <Fade in timeout={400 + index * 100}>
                  <Card
                    onClick={() => {
                      setSelectedCategory(
                        selectedCategory === category.id ? '' : category.id
                      );
                    }}
                    sx={{
                      cursor: 'pointer',
                      border: `2px solid ${
                        selectedCategory === category.id
                          ? category.color
                          : 'transparent'
                      }`,
                      background:
                        selectedCategory === category.id
                          ? `linear-gradient(135deg, ${category.color}20 0%, ${category.color}05 100%)`
                          : 'white',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 12px 35px ${category.color}25`,
                        '& .category-icon': {
                          transform: 'scale(1.2) rotate(5deg)',
                        },
                        '& .category-overlay': {
                          opacity: 1,
                        },
                      },
                      '&:active': {
                        transform: 'translateY(-2px) scale(0.98)',
                      },
                    }}
                    className="card-micro-interactive"
                  >
                    {/* Overlay de hover */}
                    <Box
                      className="category-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${category.color}10 0%, transparent 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                      }}
                    />

                    <CardContent
                      sx={{ p: 2.5, position: 'relative', zIndex: 1 }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}
                      >
                        <Box
                          className="category-icon"
                          sx={{
                            fontSize: '2.5rem',
                            transition:
                              'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            background: `${category.color}15`,
                          }}
                        >
                          <Typography variant="h4" component="span">
                            {category.icon}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              mb: 0.5,
                              transition: 'color 0.3s ease',
                              color:
                                selectedCategory === category.id
                                  ? category.color
                                  : 'inherit',
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              mb: 0.5,
                              fontWeight: 500,
                            }}
                          >
                            {category.count} servicios disponibles
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: category.color,
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {category.impact}
                          </Typography>
                        </Box>

                        {/* Indicador de selección */}
                        {selectedCategory === category.id && (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: category.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '14px',
                              animation: 'scaleIn 0.3s ease',
                            }}
                          >
                            ✓
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 🔄 Sección LETS - Sistema de Intercambio Local */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 3 }}
            className="animate-slide-up"
          >
            🔄 Sistema LETS - Intercambio Colaborativo
          </Typography>
          
          <Grid container spacing={3}>
            {/* UnitsWallet */}
            <Grid size={{xs:12,md:4}}>
              <UnitsWallet userId={user?.id || ''} />
            </Grid>
            
            {/* LETS Quick Actions */}
            <Grid size={{xs:12,md:8}}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  💫 Intercambios Locales con Ünits
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Participa en la economía colaborativa usando Ünits, nuestra moneda local basada en reciprocidad (Ayni)
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{xs:12,sm:6}}>
                                         <Button
                       fullWidth
                       variant="outlined"
                       startIcon={<LocalOffer />}
                       onClick={() => navigate('/lets')}
                       sx={{
                         borderColor: '#4ECDC4',
                         color: '#4ECDC4',
                         '&:hover': {
                           borderColor: '#45B7B8',
                           backgroundColor: 'rgba(78, 205, 196, 0.1)',
                         }
                       }}
                     >
                       Ver Ofertas LETS
                     </Button>
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                                         <Button
                       fullWidth
                       variant="contained"
                       startIcon={<AddIcon />}
                       onClick={() => navigate('/lets')}
                       sx={{
                         background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                         '&:hover': {
                           background: 'linear-gradient(45deg, #FF5252, #45B7B8)',
                         }
                       }}
                     >
                       Crear Intercambio
                     </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Controles de vista y filtros */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {selectedCategory
                ? `${
                    impactCategories.find((c) => c.id === selectedCategory)
                      ?.name
                  } (${itemsToDisplay.length})`
                : `Todos los Servicios (${itemsToDisplay.length})`}
            </Typography>
            {selectedCategory && (
              <Chip
                label="Limpiar filtro"
                onDelete={() => {
                  setSelectedCategory('');
                  setIsSearchActive(false);
                }}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Filtros de ordenamiento optimizados */}
            <Chip
              label="Más Relevantes"
              variant={
                currentFilters.sortBy === 'relevance' ? 'filled' : 'outlined'
              }
              onClick={() =>
                setCurrentFilters((prev) => ({ ...prev, sortBy: 'relevance' }))
              }
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  backgroundColor:
                    currentFilters.sortBy === 'relevance'
                      ? 'primary.main'
                      : 'rgba(25, 118, 210, 0.08)',
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                },
              }}
              className="chip-micro-interactive"
            />
            <Chip
              label="Mayor Impacto"
              variant={
                currentFilters.sortBy === 'impact' ? 'filled' : 'outlined'
              }
              onClick={() =>
                setCurrentFilters((prev) => ({ ...prev, sortBy: 'impact' }))
              }
              icon={<EmojiNature />}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.25)',
                  backgroundColor:
                    currentFilters.sortBy === 'impact'
                      ? '#4CAF50'
                      : 'rgba(76, 175, 80, 0.08)',
                  '& .MuiChip-icon': {
                    transform: 'scale(1.2)',
                  },
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                },
                '& .MuiChip-icon': {
                  transition: 'transform 0.3s ease',
                },
              }}
              className="chip-micro-interactive"
            />
            <Chip
              label="Mejor Calificados"
              variant={
                currentFilters.sortBy === 'rating' ? 'filled' : 'outlined'
              }
              onClick={() =>
                setCurrentFilters((prev) => ({ ...prev, sortBy: 'rating' }))
              }
              icon={<Star />}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 193, 7, 0.3)',
                  backgroundColor:
                    currentFilters.sortBy === 'rating'
                      ? '#FFC107'
                      : 'rgba(255, 193, 7, 0.08)',
                  color:
                    currentFilters.sortBy === 'rating' ? 'black' : 'inherit',
                  '& .MuiChip-icon': {
                    transform: 'rotate(360deg) scale(1.2)',
                    color: '#FFD700',
                  },
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                },
                '& .MuiChip-icon': {
                  transition: 'all 0.5s ease',
                },
              }}
              className="chip-micro-interactive"
            />
            <Chip
              label="Tendencia"
              variant={
                currentFilters.sortBy === 'trending' ? 'filled' : 'outlined'
              }
              onClick={() =>
                setCurrentFilters((prev) => ({ ...prev, sortBy: 'trending' }))
              }
              icon={<TrendingUp />}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)',
                  backgroundColor:
                    currentFilters.sortBy === 'trending'
                      ? '#FF6B6B'
                      : 'rgba(255, 107, 107, 0.08)',
                  '& .MuiChip-icon': {
                    transform: 'translateY(-2px) scale(1.2)',
                  },
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                },
                '& .MuiChip-icon': {
                  transition: 'transform 0.3s ease',
                },
              }}
              className="chip-micro-interactive"
            />

            <Divider orientation="vertical" flexItem />

            {/* Toggle de vista */}
            <Tooltip title="Vista en Grilla">
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                className="icon-micro-interactive"
              >
                <GridView />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vista en Lista">
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
                className="icon-micro-interactive"
              >
                <ViewList />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Mensaje de confirmación de datos del marketplace */}
        {impactProducts.length > 0 && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={async () => {
                  // Limpiar toda la caché de React Query
                  await queryClient.clear();
                  // Invalidar específicamente las queries del marketplace
                  await queryClient.invalidateQueries({
                    queryKey: ['marketplace-items'],
                  });
                  // Forzar refetch
                  refetchMarketplaceData();
                  // Mostrar feedback
                  console.log('🔄 Caché limpiada, recargando datos...');
                }}
              >
                🔄 Recargar
              </Button>
            }
          >
            ✅ Mostrando {impactProducts.length} productos y servicios diversos
            de CoomÜnity
            {marketplaceItemsResponse?.source && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 0.5, opacity: 0.8 }}
              >
                Fuente:{' '}
                {marketplaceItemsResponse.source === 'mock-rich-data'
                  ? 'Datos demo ricos'
                  : 'Backend NestJS'}
              </Typography>
            )}
          </Alert>
        )}

        {/* Contenido principal - OPTIMIZADO */}
        {isLoading ? (
          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid size={{xs:12,sm:6,md:4,xl:3}} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={{ xs: 320, sm: 300, md: 280 }}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : itemsToDisplay.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <VolunteerActivism
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {isSearchActive
                ? 'No se encontraron servicios'
                : 'No hay servicios disponibles'}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {isSearchActive
                ? 'Intenta ajustar tus filtros o explora diferentes categorías de impacto'
                : 'Sé el primero en ofrecer un servicio para el bien común en nuestra comunidad'}
            </Typography>
            {!isSearchActive && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                onClick={handleOpenCreateModal}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
                  },
                }}
                className="btn-micro-interactive"
                data-testid="create-item-button"
              >
                Ofrecer Servicio de Impacto
              </Button>
            )}
          </Box>
        ) : (
          <Grid
            container
            spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5 }}
            sx={{
              mb: 4,
              '& .marketplace-grid-item': {
                minHeight: { xs: 320, sm: 340, md: 360, lg: 380 },
              },
            }}
            className="marketplace-grid-container marketplace-grid-enhanced"
          >
            {itemsToDisplay.map((item, index) => (
              <Grid size={{xs:6,sm:6,md:6,lg:6,xl:6}} key={item.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  '&> div': {
                    height: '100%',
                    minHeight: 'inherit',
                  },
                }}
                className="marketplace-grid-item"
              >
                <Fade in timeout={200 + index * 50}>
                  <Box sx={{ height: '100%' }}>
                    <ProductCardEnhanced
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      price={item.price}
                      originalPrice={item.originalPrice}
                      currency={item.currency}
                      location={item.location}
                      rating={item.rating}
                      reviewCount={item.reviewCount}
                      seller={item.seller}
                      image={item.images[0] || '/images/placeholder.jpg'}
                      images={item.images}
                      tags={item.tags}
                      featured={item.featured}
                      trending={item.trending}
                      discount={item.discount}
                      isFavorited={item.isFavorited || false}
                      viewMode={viewMode}
                      type={
                        item.category === 'tecnologia-social'
                          ? 'service'
                          : 'product'
                      }
                      onToggleFavorite={handleToggleFavorite}
                      onClick={handleProductClick}
                      onRefresh={refetchMarketplaceData}
                      size="medium"
                      enableHover={true}
                      showQuickActions={true}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Call to Action para el bien común */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
              borderRadius: 3,
            }}
          >
            <EmojiNature sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              ¿Tienes un servicio que genere impacto positivo?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Únete a nuestra comunidad de agentes de cambio y comparte tus
              conocimientos para construir un mundo mejor.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
                },
                borderRadius: 2,
                px: 4,
                py: 1.5,
              }}
              data-testid="create-item-button"
            >
              Publicar Servicio de Impacto
            </Button>
          </Paper>
        </Box>
      </Container>

      {/* 🎯 FAB para crear item - mejorado con animaciones avanzadas */}
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
            background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            '&:hover': {
              background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
              transform: 'scale(1.1) translateY(-4px)',
              boxShadow: '0 12px 35px rgba(76, 175, 80, 0.5)',
              '& .MuiSvgIcon-root': {
                transform: 'rotate(180deg) scale(1.2)',
              },
            },
            '&:active': {
              transform: 'scale(1.05) translateY(-2px)',
              transition: 'all 0.1s ease',
            },
            '& .MuiSvgIcon-root': {
              transition: 'transform 0.3s ease',
              fontSize: '1.8rem',
            },
            // Pulse animation para llamar la atención
            animation: 'fabPulse 3s infinite',
            '@keyframes fabPulse': {
              '0%': {
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              },
              '50%': {
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.6)',
              },
              '100%': {
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              },
            },
            // Resplandor sutil
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
              borderRadius: '50%',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: -1,
            },
            '&:hover::before': {
              opacity: 0.3,
            },
          }}
          className="btn-micro-interactive"
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* 🆕 Modal de Creación de Items */}
      <CreateItemModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </RevolutionaryWidget>
  );
};

export default MarketplaceMain;
