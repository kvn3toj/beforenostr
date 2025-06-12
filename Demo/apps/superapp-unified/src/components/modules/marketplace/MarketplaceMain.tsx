import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import '../../../styles/marketplace-mobile.css';
import '../../../styles/micro-interactions.css';
import '../../../styles/performance-optimizations.css';
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
  Star,
  Verified,
  LocationOn,
  Search,
  AutoAwesome,
  ShoppingCart,
  Store,
} from '@mui/icons-material';
import {
  useMarketplaceData,
  useMerchantProfile,
  useProducts,
  useBackendAvailability,
} from '../../../hooks/useRealBackendData';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../lib/api-service';
import { useAuth } from '../../../contexts/AuthContext';
import AdvancedSearch from './components/AdvancedSearch';
import { RoleToggle } from './components/RoleToggle';
import { MobileHeader } from './components/MobileHeader';
import { MobileSearchBar } from './components/MobileSearchBar';
import { CategoryCarousel } from './components/CategoryCarousel';
import { ProductCard } from './components/ProductCard';
import { MobileMarketplaceView } from './components';

// 🏷️ Tipos de datos
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
    | 'popular';
  tags: string[];
  hasDiscount: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  count?: number;
}

const MarketplaceMain: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados mejorados
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

  // 🔗 Conectar al backend real con fallback a datos mockeados
  const backendAvailability = useBackendAvailability();
  const marketplaceDataQuery = useMarketplaceData();
  const merchantProfileQuery = useMerchantProfile();
  const productsQuery = useProducts();

  // 🎭 Datos mejorados para desarrollo
  const enhancedCategories: Category[] = [
    {
      id: 'tecnologia',
      name: 'Tecnología',
      icon: '💻',
      color: '#3B82F6',
      count: 45,
    },
    {
      id: 'diseno',
      name: 'Diseño',
      icon: '🎨',
      color: '#8B5CF6',
      count: 32,
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: '📢',
      color: '#10B981',
      count: 28,
    },
    {
      id: 'educacion',
      name: 'Educación',
      icon: '📚',
      color: '#F59E0B',
      count: 38,
    },
    {
      id: 'consultoria',
      name: 'Consultoría',
      icon: '💼',
      color: '#EF4444',
      count: 22,
    },
    {
      id: 'salud',
      name: 'Salud & Bienestar',
      icon: '🏥',
      color: '#06B6D4',
      count: 19,
    },
    {
      id: 'arte',
      name: 'Arte & Creatividad',
      icon: '🎭',
      color: '#EC4899',
      count: 15,
    },
    {
      id: 'servicios',
      name: 'Servicios',
      icon: '🔧',
      color: '#84CC16',
      count: 41,
    },
  ];

  const enhancedMockProducts: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Desarrollo Web Full-Stack Premium',
      description:
        'Desarrollo completo de aplicaciones web modernas con React, Node.js y base de datos optimizada. Incluye diseño responsive, SEO y deployment.',
      price: 450,
      originalPrice: 650,
      currency: 'Lükas',
      category: 'tecnologia',
      images: ['/images/service-web-dev.jpg'],
      seller: {
        id: '1',
        name: 'Alex Rodriguez',
        username: '@alexdev',
        avatar: '/images/avatar-alex.jpg',
        verified: true,
        rating: 4.9,
        reviewCount: 47,
      },
      location: 'Cali, Valle del Cauca',
      rating: 4.9,
      reviewCount: 47,
      tags: ['react', 'nodejs', 'fullstack', 'premium'],
      featured: true,
      trending: true,
      createdAt: '2024-01-01',
      viewCount: 156,
      favoriteCount: 89,
      isFavorited: false,
      discount: 31,
    },
    {
      id: '2',
      title: 'Branding & Identidad Visual Completa',
      description:
        'Creación de identidad visual profesional: logo, paleta de colores, tipografía, manual de marca y material publicitario.',
      price: 320,
      currency: 'Lükas',
      category: 'diseno',
      images: ['/images/service-branding.jpg'],
      seller: {
        id: '2',
        name: 'María García',
        username: '@maria_design',
        avatar: '/images/avatar-maria.jpg',
        verified: true,
        rating: 4.8,
        reviewCount: 38,
      },
      location: 'Medellín, Antioquia',
      rating: 4.8,
      reviewCount: 38,
      tags: ['branding', 'logo', 'identidad', 'diseño'],
      featured: true,
      trending: false,
      createdAt: '2024-01-02',
      viewCount: 124,
      favoriteCount: 67,
      isFavorited: false,
    },
    {
      id: '3',
      title: 'Estrategia Digital Marketing 360°',
      description:
        'Plan integral de marketing digital: análisis de mercado, estrategia de contenidos, gestión de redes sociales y campañas publicitarias.',
      price: 275,
      currency: 'Lükas',
      category: 'marketing',
      images: ['/images/service-marketing.jpg'],
      seller: {
        id: '3',
        name: 'Carlos Mendoza',
        username: '@carlos_mkt',
        avatar: '/images/avatar-carlos.jpg',
        verified: true,
        rating: 4.7,
        reviewCount: 52,
      },
      location: 'Bogotá, Cundinamarca',
      rating: 4.7,
      reviewCount: 52,
      tags: ['marketing', 'digital', 'redes sociales', 'campañas'],
      featured: true,
      trending: true,
      createdAt: '2024-01-03',
      viewCount: 198,
      favoriteCount: 134,
      isFavorited: true,
    },
    {
      id: '4',
      title: 'Curso Intensivo de Programación',
      description:
        'Bootcamp intensivo de 12 semanas: fundamentos, frontend, backend, base de datos. Incluye proyectos reales y certificación.',
      price: 850,
      originalPrice: 1200,
      currency: 'Lükas',
      category: 'educacion',
      images: ['/images/service-course.jpg'],
      seller: {
        id: '4',
        name: 'Tech Academy CoomU',
        username: '@tech_academy',
        avatar: '/images/avatar-academy.jpg',
        verified: true,
        rating: 4.9,
        reviewCount: 156,
      },
      location: 'Virtual - Online',
      rating: 4.9,
      reviewCount: 156,
      tags: ['programación', 'bootcamp', 'certificación', 'online'],
      featured: true,
      trending: true,
      createdAt: '2024-01-04',
      viewCount: 298,
      favoriteCount: 201,
      isFavorited: false,
      discount: 29,
    },
    {
      id: '5',
      title: 'Consultoría Empresarial Estratégica',
      description:
        'Análisis empresarial completo, optimización de procesos, plan estratégico a 3 años y mentorías ejecutivas.',
      price: 650,
      currency: 'Lükas',
      category: 'consultoria',
      images: ['/images/service-consulting.jpg'],
      seller: {
        id: '5',
        name: 'Dr. Patricia Luna',
        username: '@dra_luna',
        avatar: '/images/avatar-patricia.jpg',
        verified: true,
        rating: 5.0,
        reviewCount: 29,
      },
      location: 'Barranquilla, Atlántico',
      rating: 5.0,
      reviewCount: 29,
      tags: ['consultoría', 'estrategia', 'procesos', 'mentoría'],
      featured: true,
      trending: false,
      createdAt: '2024-01-05',
      viewCount: 87,
      favoriteCount: 45,
      isFavorited: false,
    },
    {
      id: '6',
      title: 'Terapia Holística y Bienestar',
      description:
        'Sesiones de terapia holística: reiki, aromaterapia, meditación guiada y plan de bienestar personalizado.',
      price: 120,
      currency: 'Lükas',
      category: 'salud',
      images: ['/images/service-therapy.jpg'],
      seller: {
        id: '6',
        name: 'Luz Elena Vargas',
        username: '@luz_bienestar',
        avatar: '/images/avatar-luz.jpg',
        verified: true,
        rating: 4.8,
        reviewCount: 94,
      },
      location: 'Manizales, Caldas',
      rating: 4.8,
      reviewCount: 94,
      tags: ['reiki', 'bienestar', 'meditación', 'terapia'],
      featured: false,
      trending: true,
      createdAt: '2024-01-06',
      viewCount: 167,
      favoriteCount: 112,
      isFavorited: true,
    },
  ];

  // Datos de tendencias y estadísticas
  const marketplaceStats = {
    totalProducts: 342,
    activeProviders: 89,
    successfulDeals: 1247,
    averageRating: 4.7,
  };

  // 🔍 Consultas mejoradas
  const { data: featuredItems = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['marketplace-featured', selectedRole],
    queryFn: () => apiService.get(`/marketplace/featured?role=${selectedRole}`),
    enabled: !isSearchActive,
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendingItems = [] } = useQuery({
    queryKey: ['marketplace-trending'],
    queryFn: () => apiService.get('/marketplace/trending'),
    staleTime: 10 * 60 * 1000,
  });

  const { data: userFavorites = [] } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: () => apiService.get('/marketplace/favorites'),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // 🔄 Mutaciones mejoradas
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      itemId,
      isFavorited,
    }: {
      itemId: string;
      isFavorited: boolean;
    }) => {
      if (isFavorited) {
        return apiService.delete(`/marketplace/favorites/${itemId}`);
      } else {
        return apiService.post(`/marketplace/favorites/${itemId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-featured'] });
    },
  });

  // 🎯 Handlers mejorados
  const handleRoleChange = useCallback((role: 'consumer' | 'provider') => {
    setSelectedRole(role);
    // Trigger analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'role_change', {
        event_category: 'marketplace',
        event_label: role,
      });
    }
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentFilters((prev) => ({ ...prev, query: searchQuery }));
      setIsSearchActive(searchQuery.length > 0);
    },
    [searchQuery]
  );

  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentFilters((prev) => ({ ...prev, category: categoryId }));
    setIsSearchActive(true);
  }, []);

  const handleViewAllCategories = useCallback(() => {
    setShowAdvancedSearch(true);
  }, []);

  const handleProductClick = useCallback((productId: string) => {
    console.log('Producto clickeado:', productId);
    // TODO: Navegar a página de detalle del producto
  }, []);

  const handleToggleFavorite = useCallback(
    (itemId: string) => {
      if (!user) return;

      const currentlyFavorited = userFavorites.some(
        (fav: any) => fav.itemId === itemId
      );
      toggleFavoriteMutation.mutate({
        itemId,
        isFavorited: currentlyFavorited,
      });
    },
    [user, userFavorites, toggleFavoriteMutation]
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

  // 🔍 Resultados de búsqueda mejorados
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
        filters.priceRange[1] < 1000 ||
        filters.hasDiscount
    );
  }, []);

  // 🔄 Función para transformar datos del backend al formato del frontend
  const transformBackendItems = (backendItems: any[]): MarketplaceItem[] => {
    return backendItems.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.priceUnits || 0,
      currency: item.currency || 'Lükas',
      category: item.type?.toLowerCase() || 'general',
      images: item.images || (item.imageUrl ? [item.imageUrl] : []),
      seller: {
        id: item.seller.id,
        name: `${item.seller.firstName || ''} ${item.seller.lastName || ''}`.trim() || item.seller.username || 'Usuario',
        username: item.seller.username || item.seller.email?.split('@')[0] || 'user',
        avatar: item.seller.avatarUrl || '/images/default-avatar.jpg',
        verified: true, // Asumir verificado por defecto desde el backend
        rating: 4.5, // Por ahora usar valor por defecto
        reviewCount: item.favoriteCount || 0,
      },
      location: item.location || 'No especificado',
      rating: 4.5, // Por ahora usar valor por defecto
      reviewCount: item.favoriteCount || 0,
      tags: Array.isArray(item.tags) ? item.tags : [],
      featured: item.viewCount > 50, // Lógica simple para determinar featured
      trending: item.viewCount > 30, // Lógica simple para determinar trending
      createdAt: item.createdAt,
      viewCount: item.viewCount || 0,
      favoriteCount: item.favoriteCount || 0,
      isFavorited: false, // Se actualizará con lógica de favoritos
    }));
  };

  // 📊 Items a mostrar - MIGRADO AL BACKEND REAL
  const itemsToDisplay = useMemo(() => {
    // Datos reales del backend transformados
    const rawBackendItems = marketplaceDataQuery.data?.items || [];
    const backendItems = transformBackendItems(rawBackendItems);
    
    let items = isSearchActive
      ? searchResults
      : backendItems.length > 0
        ? backendItems
        : enhancedMockProducts; // Solo como fallback si no hay datos del backend

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
      case 'popular':
        items = [...items].sort((a, b) => b.favoriteCount - a.favoriteCount);
        break;
      default:
        // relevance - no cambiar orden
        break;
    }

    // Añadir estado de favorito
    return items.map((item) => ({
      ...item,
      isFavorited: userFavorites.some((fav: any) => fav.itemId === item.id),
    }));
  }, [
    isSearchActive,
    searchResults,
    marketplaceDataQuery.data,
    userFavorites,
    enhancedMockProducts,
    selectedCategory,
    currentFilters.sortBy,
  ]);

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

  // 🖥️ Layout de escritorio mejorado
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header mejorado */}
        <Box sx={{ mb: 4 }}>
          <Fade in timeout={800}>
            <Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Store sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    className="animate-slide-up"
                  >
                    🏪 ÜMarket
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Economía colaborativa consciente
                  </Typography>
                </Box>
              </Box>

              {/* Estadísticas del marketplace */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3,
                  mb: 3,
                }}
                className="animate-scale-in animate-stagger-1"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold">
                        {marketplaceStats.totalProducts}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Productos y Servicios
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold">
                        {marketplaceStats.activeProviders}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Proveedores Activos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold">
                        {marketplaceStats.successfulDeals}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Intercambios Exitosos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold">
                          {marketplaceStats.averageRating}
                        </Typography>
                        <Star sx={{ color: '#FFD700' }} />
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Calificación Promedio
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Fade>
        </Box>

        {/* Toggle de rol mejorado */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Grow in timeout={1000}>
            <Box>
              <RoleToggle
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
            </Box>
          </Grow>
        </Box>

        {/* Búsqueda avanzada */}
        <Box sx={{ mb: 4 }} className="animate-slide-up animate-stagger-2">
          <AdvancedSearch
            onSearchResults={handleSearchResults}
            onFiltersChange={handleFiltersChange}
            initialFilters={currentFilters}
          />
        </Box>

        {/* Estado de carga del marketplace */}
        {marketplaceDataQuery.isLoading && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              🔄 Cargando datos del marketplace...
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          </Box>
        )}

        {/* Mensaje de confirmación de datos reales */}
        {marketplaceDataQuery.data?.items && marketplaceDataQuery.data.items.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              ✅ Mostrando {marketplaceDataQuery.data.items.length} elementos reales del marketplace
            </Alert>
          </Box>
        )}

        {/* Sección de categorías */}
        <Box sx={{ mb: 4 }} className="animate-slide-up animate-stagger-3">
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Explorar por Categorías
          </Typography>
          <Grid container spacing={2}>
            {enhancedCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Card
                  onClick={() => handleCategoryClick(category.id)}
                  sx={{
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, ${category.color}15, ${category.color}25)`,
                    border:
                      selectedCategory === category.id
                        ? `2px solid ${category.color}`
                        : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${category.color}30`,
                    },
                  }}
                  className="card-micro-interactive"
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h4">{category.icon}</Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.count} servicios
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
          className="animate-slide-up animate-stagger-4"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {selectedCategory
                ? `${enhancedCategories.find((c) => c.id === selectedCategory)?.name} (${itemsToDisplay.length})`
                : `Todos los Productos (${itemsToDisplay.length})`}
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
            {/* Filtros de ordenamiento */}
            <Chip
              label="Más Relevantes"
              variant={
                currentFilters.sortBy === 'relevance' ? 'filled' : 'outlined'
              }
              onClick={() =>
                setCurrentFilters((prev) => ({ ...prev, sortBy: 'relevance' }))
              }
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
              className="chip-micro-interactive"
            />
            <Chip
              label="Menor Precio"
              variant={
                currentFilters.sortBy === 'price_asc' ? 'filled' : 'outlined'
              }
              onClick={() =>
                setCurrentFilters((prev) => ({ ...prev, sortBy: 'price_asc' }))
              }
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

            <Tooltip title="Filtros Avanzados">
              <IconButton
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="icon-micro-interactive"
              >
                <TuneOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Contenido principal */}
        {featuredLoading && !isSearchActive ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={280}
                  sx={{ borderRadius: 2 }}
                  className="loading-skeleton"
                />
              </Grid>
            ))}
          </Grid>
        ) : itemsToDisplay.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AutoAwesome
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {isSearchActive
                ? 'No se encontraron resultados'
                : 'No hay productos disponibles'}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {isSearchActive
                ? 'Intenta ajustar tus filtros de búsqueda o explora diferentes categorías'
                : 'Sé el primero en publicar un producto o servicio en nuestra comunidad'}
            </Typography>
            {!isSearchActive && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                sx={{ mt: 2 }}
                className="btn-micro-interactive"
              >
                Publicar Producto/Servicio
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {itemsToDisplay.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={viewMode === 'grid' ? 4 : 12}
                lg={viewMode === 'grid' ? 3 : 12}
                key={item.id}
              >
                <Fade in timeout={500 + index * 100}>
                  <Box>
                    <EnhancedProductCard
                      {...item}
                      viewMode={viewMode}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={handleProductClick}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button mejorado */}
        <Fab
          color="primary"
          aria-label="add product"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }}
          className="btn-micro-interactive"
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

// 🎨 Componente de tarjeta de producto mejorado
interface EnhancedProductCardProps extends MarketplaceItem {
  viewMode: 'grid' | 'list';
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  currency,
  location,
  rating,
  seller,
  images,
  isFavorited,
  onToggleFavorite,
  onClick,
  viewMode,
  tags,
  featured,
  trending,
  discount,
  viewCount,
  favoriteCount,
}) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${price}`;
    }
    return `$${price.toLocaleString()}`;
  };

  if (viewMode === 'list') {
    return (
      <Card
        onClick={() => onClick(id)}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          p: 2,
          height: 200,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          },
        }}
        className="card-micro-interactive"
      >
        {/* Imagen */}
        <Box
          sx={{
            width: 180,
            height: '100%',
            borderRadius: 2,
            backgroundColor: '#f5f5f5',
            backgroundImage: `url(${images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {trending && (
            <Chip
              label="Tendencia"
              size="small"
              icon={<TrendingUp />}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                color: 'white',
              }}
            />
          )}
          {discount && (
            <Chip
              label={`-${discount}%`}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: '#FF4444',
                color: 'white',
              }}
            />
          )}
        </Box>

        {/* Contenido */}
        <Box sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ lineHeight: 1.2 }}
              >
                {title}
              </Typography>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(id);
                }}
                className="icon-micro-interactive"
              >
                {isFavorited ? (
                  <FavoriteOutlined sx={{ color: '#FF4444' }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {tags.slice(0, 3).map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {originalPrice && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    {formatPrice(originalPrice, currency)}
                  </Typography>
                )}
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatPrice(price, currency)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({seller.reviewCount})
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
              >
                <Avatar src={seller.avatar} sx={{ width: 24, height: 24 }} />
                <Typography variant="body2" fontWeight="bold">
                  {seller.name}
                </Typography>
                {seller.verified && (
                  <Verified sx={{ fontSize: 16, color: '#1976d2' }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {location}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }

  // Vista de grilla (mejorada)
  return (
    <Card
      onClick={() => onClick(id)}
      sx={{
        cursor: 'pointer',
        height: 380,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
      }}
      className="card-micro-interactive"
    >
      {/* Imagen del producto */}
      <Box
        sx={{
          height: 200,
          position: 'relative',
          backgroundColor: '#f5f5f5',
          backgroundImage: `url(${images[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Badges superiores */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          {featured && (
            <Chip
              label="Destacado"
              size="small"
              icon={<AutoAwesome />}
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                color: 'white',
              }}
            />
          )}
          {trending && (
            <Chip
              label="Tendencia"
              size="small"
              icon={<TrendingUp />}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                color: 'white',
              }}
            />
          )}
        </Box>

        {/* Descuento y precio */}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          {discount && (
            <Chip
              label={`-${discount}%`}
              size="small"
              sx={{
                backgroundColor: '#FF4444',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>

        {/* Botones de acción */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' },
            }}
            className="icon-micro-interactive"
          >
            {isFavorited ? (
              <FavoriteOutlined sx={{ color: '#FF4444' }} />
            ) : (
              <FavoriteBorderOutlined />
            )}
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implementar compartir
            }}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' },
            }}
            className="icon-micro-interactive"
          >
            <ShareOutlined />
          </IconButton>
        </Box>

        {/* Rating */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Star sx={{ fontSize: 16, color: '#FFD700' }} />
          <Typography variant="body2" fontWeight="bold">
            {rating}
          </Typography>
        </Box>
      </Box>

      {/* Contenido de la tarjeta */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1, lineHeight: 1.2 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {tags.slice(0, 2).map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        {/* Precio */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {originalPrice && (
            <Typography
              variant="body2"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              {formatPrice(originalPrice, currency)}
            </Typography>
          )}
          <Typography variant="h6" fontWeight="bold" color="primary">
            {formatPrice(price, currency)}
          </Typography>
        </Box>

        {/* Información del vendedor */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={seller.avatar} sx={{ width: 32, height: 32 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" fontWeight="bold">
                  {seller.name}
                </Typography>
                {seller.verified && (
                  <Verified sx={{ fontSize: 14, color: '#1976d2' }} />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {seller.username}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {location.split(',')[0]}
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                👁 {viewCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ❤️ {favoriteCount}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MarketplaceMain;
