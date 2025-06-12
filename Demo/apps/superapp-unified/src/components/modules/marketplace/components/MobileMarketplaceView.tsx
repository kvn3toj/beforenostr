import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  useTheme,
  Skeleton,
  Drawer,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Chip,
  Rating,
  TextField,
  Divider,
  Badge,
  Stack,
  Card,
  CardContent,
  Avatar,
  Fab,
  SwipeableDrawer,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Grow,
  Fade,
  Slide,
  Zoom,
} from '@mui/material';
import {
  Menu,
  Chat,
  Notifications,
  Search,
  Mic,
  FilterList,
  Add as AddIcon,
  Clear as ClearIcon,
  TuneOutlined as TuneIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  AttachMoney as PriceIcon,
  VerifiedUser as VerifiedIcon,
  Close as CloseIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Refresh,
  Sort,
  ViewModule,
  ViewList,
  LocalOffer,
  TrendingUp,
  Favorite,
  Share,
  ShoppingCart,
  Store,
  AutoAwesome,
  FlashOn,
  WhatsApp,
  Instagram,
  Facebook,
  ExpandLess,
  ExpandMore,
  FilterAlt,
  SwipeUp,
  TouchApp,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';
import { useAuth } from '../../../../contexts/AuthContext';
import { ProductCard } from './ProductCard';
import { MobileHeader } from './MobileHeader';
import { MobileSearchBar } from './MobileSearchBar';
import { CategoryCarousel } from './CategoryCarousel';
import { RoleToggle } from './RoleToggle';

// Types
interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
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
    responseTime?: string;
    isOnline?: boolean;
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
  deliveryTime?: string;
  hasVideo?: boolean;
  is24Hours?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  count?: number;
}

interface SearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  location: string;
  rating: number;
  verified: boolean;
  sortBy: string;
  tags: string[];
  hasDiscount: boolean;
  deliveryType: string;
  availability: string;
}

interface MobileMarketplaceViewProps {
  onMenuClick: () => void;
  onChatClick: () => void;
  onNotificationsClick: () => void;
}

const MobileMarketplaceView: React.FC<MobileMarketplaceViewProps> = ({
  onMenuClick,
  onChatClick,
  onNotificationsClick,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Estados mejorados
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'provider'>(
    'consumer'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedProduct, setSelectedProduct] =
    useState<MarketplaceItem | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    priceRange: [0, 1000],
    location: '',
    rating: 0,
    verified: false,
    sortBy: 'relevance',
    tags: [],
    hasDiscount: false,
    deliveryType: '',
    availability: '',
  });

  // Datos mejorados para móvil
  const enhancedMobileCategories: Category[] = [
    {
      id: 'popular',
      name: 'Popular',
      icon: '🔥',
      color: '#FF6B6B',
      count: 124,
    },
    { id: 'nuevos', name: 'Nuevos', icon: '✨', color: '#4ECDC4', count: 89 },
    { id: 'ofertas', name: 'Ofertas', icon: '💰', color: '#45B7D1', count: 45 },
    { id: 'premium', name: 'Premium', icon: '👑', color: '#F9CA24', count: 67 },
    { id: 'express', name: 'Express', icon: '⚡', color: '#6C5CE7', count: 34 },
    { id: 'local', name: 'Local', icon: '📍', color: '#A29BFE', count: 78 },
  ];

  const quickFilters = [
    { id: 'all', label: 'Todos', icon: '🏪' },
    { id: 'trending', label: 'Tendencia', icon: '📈' },
    { id: 'offers', label: 'Ofertas', icon: '🏷️' },
    { id: 'nearby', label: 'Cerca', icon: '📍' },
    { id: 'new', label: 'Nuevos', icon: '✨' },
    { id: 'top', label: 'Top Rated', icon: '⭐' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Más Relevantes', icon: '🎯' },
    { value: 'rating', label: 'Mejor Calificados', icon: '⭐' },
    { value: 'price_asc', label: 'Menor Precio', icon: '💰' },
    { value: 'price_desc', label: 'Mayor Precio', icon: '💎' },
    { value: 'newest', label: 'Más Recientes', icon: '🆕' },
    { value: 'trending', label: 'Tendencia', icon: '🔥' },
    { value: 'popular', label: 'Más Populares', icon: '👥' },
    { value: 'nearby', label: 'Más Cercanos', icon: '📍' },
  ];

  const enhancedMockProducts: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Desarrollo Web Premium',
      description:
        'Aplicación web completa con React, Node.js, base de datos y deployment. Incluye SEO, optimización y soporte.',
      price: 450,
      originalPrice: 650,
      currency: 'ü',
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
        responseTime: '< 1 hora',
        isOnline: true,
      },
      location: 'Cali, Valle del Cauca',
      rating: 4.9,
      reviewCount: 47,
      tags: ['react', 'nodejs', 'premium', 'seo'],
      featured: true,
      trending: true,
      createdAt: '2024-01-01',
      viewCount: 156,
      favoriteCount: 89,
      isFavorited: false,
      discount: 31,
      deliveryTime: '15-30 días',
      hasVideo: true,
      is24Hours: false,
    },
    {
      id: '2',
      title: 'Diseño UX/UI Completo',
      description:
        'Diseño de experiencia de usuario e interfaz completa para apps móviles y web. Wireframes, prototipos y guías de estilo.',
      price: 320,
      currency: 'ü',
      category: 'diseno',
      images: ['/images/service-design.jpg'],
      seller: {
        id: '2',
        name: 'María García',
        username: '@maria_design',
        avatar: '/images/avatar-maria.jpg',
        verified: true,
        rating: 4.8,
        reviewCount: 38,
        responseTime: '< 2 horas',
        isOnline: true,
      },
      location: 'Medellín, Antioquia',
      rating: 4.8,
      reviewCount: 38,
      tags: ['ux', 'ui', 'prototyping', 'figma'],
      featured: true,
      trending: false,
      createdAt: '2024-01-02',
      viewCount: 124,
      favoriteCount: 67,
      isFavorited: true,
      deliveryTime: '7-14 días',
      hasVideo: false,
      is24Hours: false,
    },
    {
      id: '3',
      title: 'Marketing Digital 360°',
      description:
        'Estrategia completa de marketing digital: redes sociales, content marketing, SEO, SEM y analytics.',
      price: 275,
      currency: 'ü',
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
        responseTime: '< 30 min',
        isOnline: false,
      },
      location: 'Bogotá, Cundinamarca',
      rating: 4.7,
      reviewCount: 52,
      tags: ['marketing', 'social media', 'seo', 'analytics'],
      featured: true,
      trending: true,
      createdAt: '2024-01-03',
      viewCount: 198,
      favoriteCount: 134,
      isFavorited: false,
      deliveryTime: '5-10 días',
      hasVideo: true,
      is24Hours: true,
    },
    {
      id: '4',
      title: 'Bootcamp Programación',
      description:
        'Curso intensivo de 12 semanas para convertirte en desarrollador full-stack. Proyectos reales y mentorías.',
      price: 850,
      originalPrice: 1200,
      currency: 'ü',
      category: 'educacion',
      images: ['/images/service-course.jpg'],
      seller: {
        id: '4',
        name: 'Tech Academy',
        username: '@tech_academy',
        avatar: '/images/avatar-academy.jpg',
        verified: true,
        rating: 4.9,
        reviewCount: 156,
        responseTime: '< 4 horas',
        isOnline: true,
      },
      location: 'Online - Virtual',
      rating: 4.9,
      reviewCount: 156,
      tags: ['bootcamp', 'fullstack', 'certificación', 'mentoría'],
      featured: true,
      trending: true,
      createdAt: '2024-01-04',
      viewCount: 298,
      favoriteCount: 201,
      isFavorited: false,
      discount: 29,
      deliveryTime: '12 semanas',
      hasVideo: true,
      is24Hours: false,
    },
    {
      id: '5',
      title: 'Consultoría Empresarial',
      description:
        'Optimización de procesos empresariales, análisis financiero y plan estratégico personalizado.',
      price: 650,
      currency: 'ü',
      category: 'consultoria',
      images: ['/images/service-consulting.jpg'],
      seller: {
        id: '5',
        name: 'Patricia Luna',
        username: '@dra_luna',
        avatar: '/images/avatar-patricia.jpg',
        verified: true,
        rating: 5.0,
        reviewCount: 29,
        responseTime: '< 6 horas',
        isOnline: false,
      },
      location: 'Barranquilla, Atlántico',
      rating: 5.0,
      reviewCount: 29,
      tags: ['consultoría', 'estrategia', 'finanzas', 'procesos'],
      featured: false,
      trending: false,
      createdAt: '2024-01-05',
      viewCount: 87,
      favoriteCount: 45,
      isFavorited: false,
      deliveryTime: '2-4 semanas',
      hasVideo: false,
      is24Hours: false,
    },
    {
      id: '6',
      title: 'Terapia Holística',
      description:
        'Sesiones de reiki, aromaterapia, meditación guiada y plan de bienestar integral personalizado.',
      price: 120,
      currency: 'ü',
      category: 'salud',
      images: ['/images/service-therapy.jpg'],
      seller: {
        id: '6',
        name: 'Luz Elena',
        username: '@luz_bienestar',
        avatar: '/images/avatar-luz.jpg',
        verified: true,
        rating: 4.8,
        reviewCount: 94,
        responseTime: '< 1 hora',
        isOnline: true,
      },
      location: 'Manizales, Caldas',
      rating: 4.8,
      reviewCount: 94,
      tags: ['reiki', 'bienestar', 'meditación', 'holístico'],
      featured: false,
      trending: true,
      createdAt: '2024-01-06',
      viewCount: 167,
      favoriteCount: 112,
      isFavorited: true,
      deliveryTime: '1-3 días',
      hasVideo: false,
      is24Hours: true,
    },
  ];

  // 🔍 Queries mejoradas
  const { data: featuredItems = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['marketplace-featured-mobile', selectedRole],
    queryFn: () =>
      apiService.get(`/marketplace/featured?role=${selectedRole}&mobile=true`),
    enabled: !isSearchActive,
    staleTime: 5 * 60 * 1000,
  });

  const { data: userFavorites = [] } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: () => apiService.get('/marketplace/favorites'),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // 🎯 Handlers mejorados
  const handleRoleChange = useCallback((role: 'consumer' | 'provider') => {
    setSelectedRole(role);
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setFilters((prev) => ({ ...prev, query: searchQuery }));
      setIsSearchActive(searchQuery.length > 0);
      setSearchFocused(false);
    },
    [searchQuery]
  );

  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilters((prev) => ({ ...prev, category: categoryId }));
    setIsSearchActive(true);
    setShowFeedback(true);
    setFeedbackMessage(`Explorando ${categoryId}`);
  }, []);

  const handleViewAllCategories = useCallback(() => {
    setShowFilters(true);
  }, []);

  const handleToggleFavorite = useCallback(
    (itemId: string) => {
      if (!user) return;
      // TODO: Implementar toggle de favorito
      setShowFeedback(true);
      setFeedbackMessage('¡Agregado a favoritos!');
    },
    [user]
  );

  const handleProductClick = useCallback((productId: string) => {
    const product = itemsToDisplay.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowProductDetail(true);
    }
  }, []);

  const handleQuickFilter = useCallback((filterId: string) => {
    setFilters((prev) => ({ ...prev, sortBy: filterId }));
    setIsSearchActive(true);
  }, []);

  const handlePullToRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ['marketplace-featured-mobile'],
    });
    setTimeout(() => setRefreshing(false), 1500);
  }, [queryClient]);

  // 📱 Scroll handling para esconder/mostrar header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowTopBar(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // 📊 Items a mostrar
  const itemsToDisplay = useMemo(() => {
    let items = isSearchActive
      ? searchResults
      : featuredItems.length > 0
        ? featuredItems
        : enhancedMockProducts;

    // Filtros
    if (selectedCategory) {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'trending':
          items = [...items].sort((a, b) => {
            if (a.trending && !b.trending) return -1;
            if (!a.trending && b.trending) return 1;
            return b.viewCount - a.viewCount;
          });
          break;
        case 'rating':
          items = [...items].sort((a, b) => b.rating - a.rating);
          break;
        case 'price_asc':
          items = [...items].sort((a, b) => a.price - b.price);
          break;
        case 'popular':
          items = [...items].sort((a, b) => b.favoriteCount - a.favoriteCount);
          break;
        default:
          break;
      }
    }

    return items.map((item) => ({
      ...item,
      isFavorited: userFavorites.some((fav: any) => fav.itemId === item.id),
    }));
  }, [
    isSearchActive,
    searchResults,
    featuredItems,
    enhancedMockProducts,
    selectedCategory,
    filters.sortBy,
    userFavorites,
  ]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        position: 'relative',
      }}
    >
      {/* Header mejorado con animación */}
      <Slide direction="down" in={showTopBar} mountOnEnter unmountOnExit>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: '#fff8f8',
            borderBottom: '1px solid #f0f0f0',
            zIndex: 1100,
          }}
        >
          <MobileHeader
            onMenuClick={onMenuClick}
            onChatClick={onChatClick}
            onNotificationsClick={onNotificationsClick}
          />
        </AppBar>
      </Slide>

      {/* Contenido principal */}
      <Box sx={{ pt: showTopBar ? '68px' : '8px', pb: '80px' }}>
        {/* Progress bar para refresh */}
        {refreshing && (
          <LinearProgress
            sx={{
              position: 'fixed',
              top: showTopBar ? '68px' : '0px',
              left: 0,
              right: 0,
              zIndex: 1200,
            }}
          />
        )}

        {/* Role Toggle */}
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'center' }}>
          <Grow in timeout={500}>
            <Box>
              <RoleToggle
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
            </Box>
          </Grow>
        </Box>

        {/* Search Bar mejorada */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Fade in timeout={700}>
            <Box>
              <MobileSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
                placeholder="¿Qué necesitas hoy?"
              />
            </Box>
          </Fade>
        </Box>

        {/* Quick Filters */}
        <Box sx={{ px: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {quickFilters.map((filter, index) => (
              <Grow in timeout={500 + index * 100} key={filter.id}>
                <Chip
                  icon={<span>{filter.icon}</span>}
                  label={filter.label}
                  variant={filters.sortBy === filter.id ? 'filled' : 'outlined'}
                  onClick={() => handleQuickFilter(filter.id)}
                  sx={{
                    minWidth: 'auto',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  className="chip-micro-interactive"
                />
              </Grow>
            ))}
          </Box>
        </Box>

        {/* Categories Carousel */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ px: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Explora por Categorías
            </Typography>
          </Box>
          <Fade in timeout={800}>
            <Box>
              <CategoryCarousel
                categories={enhancedMobileCategories}
                onCategoryClick={handleCategoryClick}
                onViewAll={handleViewAllCategories}
              />
            </Box>
          </Fade>
        </Box>

        {/* Content Header */}
        <Box
          sx={{
            px: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {selectedCategory
              ? `${enhancedMobileCategories.find((c) => c.id === selectedCategory)?.name} (${itemsToDisplay.length})`
              : `Recomendados (${itemsToDisplay.length})`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="icon-micro-interactive"
            >
              {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setShowFilters(true)}
              className="icon-micro-interactive"
            >
              <FilterAlt />
            </IconButton>
          </Box>
        </Box>

        {/* Products Grid/List */}
        <Box sx={{ px: 2 }}>
          {featuredLoading ? (
            <Grid container spacing={2}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={6} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={220}
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No encontramos resultados
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Intenta ajustar tus filtros o explora otras categorías
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedCategory('');
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                className="btn-micro-interactive"
              >
                Ver todos los productos
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {itemsToDisplay.map((item, index) => (
                <Grid item xs={viewMode === 'grid' ? 6 : 12} key={item.id}>
                  <Zoom in timeout={300 + index * 50}>
                    <Box>
                      <EnhancedMobileProductCard
                        {...item}
                        viewMode={viewMode}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleProductClick}
                      />
                    </Box>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTop: '1px solid #e0e0e0',
        }}
        elevation={3}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction
            label="Inicio"
            icon={<Store />}
            onClick={() => {
              setSelectedCategory('');
              setIsSearchActive(false);
            }}
          />
          <BottomNavigationAction
            label="Categorías"
            icon={<CategoryIcon />}
            onClick={() => setShowFilters(true)}
          />
          <BottomNavigationAction
            label="Favoritos"
            icon={
              <Badge badgeContent={userFavorites.length} color="primary">
                <Favorite />
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Perfil"
            icon={<Avatar sx={{ width: 24, height: 24 }} src={user?.avatar} />}
          />
        </BottomNavigation>
      </Paper>

      {/* Floating Action Button */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 16,
          '& .MuiFab-primary': {
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          },
        }}
        icon={<SpeedDialIcon />}
        open={showQuickActions}
        onOpen={() => setShowQuickActions(true)}
        onClose={() => setShowQuickActions(false)}
        className="btn-micro-interactive"
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Publicar Servicio"
          onClick={() => console.log('Publicar')}
        />
        <SpeedDialAction
          icon={<Search />}
          tooltipTitle="Búsqueda Avanzada"
          onClick={() => setShowFilters(true)}
        />
        <SpeedDialAction
          icon={<WhatsApp />}
          tooltipTitle="Soporte WhatsApp"
          onClick={() => console.log('WhatsApp')}
        />
        <SpeedDialAction
          icon={<Refresh />}
          tooltipTitle="Actualizar"
          onClick={handlePullToRefresh}
        />
      </SpeedDial>

      {/* Filters Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        onOpen={() => setShowFilters(true)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
          },
        }}
      >
        <AdvancedFiltersContent
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
          categories={enhancedMobileCategories}
          sortOptions={sortOptions}
        />
      </SwipeableDrawer>

      {/* Product Detail Dialog */}
      <Dialog
        fullScreen
        open={showProductDetail}
        onClose={() => setShowProductDetail(false)}
        TransitionComponent={Slide}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedProduct && (
            <ProductDetailView
              product={selectedProduct}
              onClose={() => setShowProductDetail(false)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={showFeedback}
        autoHideDuration={2000}
        onClose={() => setShowFeedback(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// 🎨 Componente de tarjeta móvil mejorada
interface EnhancedMobileProductCardProps extends MarketplaceItem {
  viewMode: 'grid' | 'list';
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
}

const EnhancedMobileProductCard: React.FC<EnhancedMobileProductCardProps> = ({
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
  deliveryTime,
  hasVideo,
  is24Hours,
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
          p: 1.5,
          height: 140,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          },
          border: featured ? '2px solid #FFD700' : 'none',
        }}
        className="card-micro-interactive"
      >
        {/* Imagen */}
        <Box
          sx={{
            width: 100,
            height: '100%',
            borderRadius: 2,
            backgroundColor: '#f5f5f5',
            backgroundImage: `url(${images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {trending && (
            <Chip
              label="🔥"
              size="small"
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                minWidth: 'auto',
                height: 20,
                backgroundColor: '#FF6B6B',
                color: 'white',
              }}
            />
          )}
          {hasVideo && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 1,
                px: 0.5,
                py: 0.25,
              }}
            >
              <Typography variant="caption" color="white" fontSize="10px">
                📹
              </Typography>
            </Box>
          )}
        </Box>

        {/* Contenido */}
        <Box
          sx={{ flex: 1, ml: 1.5, display: 'flex', flexDirection: 'column' }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 0.5,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ lineHeight: 1.2, flex: 1 }}
              >
                {title}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(id);
                }}
                sx={{ ml: 0.5 }}
              >
                {isFavorited ? (
                  <Favorite sx={{ fontSize: 16, color: '#FF4444' }} />
                ) : (
                  <Favorite sx={{ fontSize: 16, color: '#ccc' }} />
                )}
              </IconButton>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 0.5 }}
            >
              {description.substring(0, 60)}...
            </Typography>

            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
            >
              <Star sx={{ fontSize: 12, color: '#FFD700' }} />
              <Typography variant="caption" fontWeight="bold">
                {rating}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({seller.reviewCount})
              </Typography>
              {seller.isOnline && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    ml: 0.5,
                  }}
                />
              )}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {originalPrice && (
                  <Typography
                    variant="caption"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    ü{originalPrice}
                  </Typography>
                )}
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="primary"
                >
                  {formatPrice(price, currency)}
                </Typography>
              </Box>
              {deliveryTime && (
                <Typography variant="caption" color="text.secondary">
                  📦 {deliveryTime}
                </Typography>
              )}
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Avatar src={seller.avatar} sx={{ width: 16, height: 16 }} />
                <Typography variant="caption" fontWeight="bold">
                  {seller.name.split(' ')[0]}
                </Typography>
                {seller.verified && (
                  <VerifiedIcon sx={{ fontSize: 12, color: '#1976d2' }} />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {location.split(',')[0]}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }

  // Vista de grilla
  return (
    <Card
      onClick={() => onClick(id)}
      sx={{
        cursor: 'pointer',
        height: 280,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        border: featured ? '2px solid #FFD700' : 'none',
      }}
      className="card-micro-interactive"
    >
      {/* Imagen del producto */}
      <Box
        sx={{
          height: 140,
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
            top: 6,
            left: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {featured && (
            <Chip
              label="⭐"
              size="small"
              sx={{
                minWidth: 'auto',
                height: 20,
                backgroundColor: '#FFD700',
                color: 'white',
                fontSize: '10px',
              }}
            />
          )}
          {trending && (
            <Chip
              label="🔥"
              size="small"
              sx={{
                minWidth: 'auto',
                height: 20,
                backgroundColor: '#FF6B6B',
                color: 'white',
                fontSize: '10px',
              }}
            />
          )}
          {is24Hours && (
            <Chip
              label="24h"
              size="small"
              sx={{
                minWidth: 'auto',
                height: 20,
                backgroundColor: '#4CAF50',
                color: 'white',
                fontSize: '10px',
              }}
            />
          )}
        </Box>

        {/* Descuento */}
        {discount && (
          <Chip
            label={`-${discount}%`}
            size="small"
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              backgroundColor: '#FF4444',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '10px',
            }}
          />
        )}

        {/* Botón de favorito */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          sx={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'white' },
            width: 32,
            height: 32,
          }}
          className="icon-micro-interactive"
        >
          {isFavorited ? (
            <Favorite sx={{ fontSize: 16, color: '#FF4444' }} />
          ) : (
            <Favorite sx={{ fontSize: 16, color: '#ccc' }} />
          )}
        </IconButton>

        {/* Rating y características */}
        <Box sx={{ position: 'absolute', bottom: 6, left: 6 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              mb: hasVideo ? 0.5 : 0,
            }}
          >
            <Star sx={{ fontSize: 12, color: '#FFD700' }} />
            <Typography variant="caption" fontWeight="bold">
              {rating}
            </Typography>
          </Box>

          {hasVideo && (
            <Box
              sx={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 1,
                px: 0.5,
                py: 0.25,
              }}
            >
              <Typography variant="caption" color="white" fontSize="10px">
                📹 Video
              </Typography>
            </Box>
          )}
        </Box>

        {/* Indicador online del vendedor */}
        {seller.isOnline && (
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              right: discount ? 80 : 6,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              border: '2px solid white',
            }}
          />
        )}
      </Box>

      {/* Contenido de la tarjeta */}
      <CardContent
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            mb: 0.5,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
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

        {/* Precio */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          {originalPrice && (
            <Typography
              variant="caption"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              ü{originalPrice}
            </Typography>
          )}
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {formatPrice(price, currency)}
          </Typography>
        </Box>

        {/* Información del vendedor y entrega */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Avatar src={seller.avatar} sx={{ width: 20, height: 20 }} />
            <Box>
              <Typography
                variant="caption"
                fontWeight="bold"
                display="block"
                lineHeight={1}
              >
                {seller.name.split(' ')[0]}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                lineHeight={1}
              >
                {seller.responseTime}
              </Typography>
            </Box>
            {seller.verified && (
              <VerifiedIcon sx={{ fontSize: 12, color: '#1976d2' }} />
            )}
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              lineHeight={1}
            >
              📍 {location.split(',')[0]}
            </Typography>
            {deliveryTime && (
              <Typography
                variant="caption"
                color="text.secondary"
                lineHeight={1}
              >
                📦 {deliveryTime}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// 🛠️ Componente de filtros avanzados
interface AdvancedFiltersContentProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose: () => void;
  categories: Category[];
  sortOptions: any[];
}

const AdvancedFiltersContent: React.FC<AdvancedFiltersContentProps> = ({
  filters,
  onFiltersChange,
  onClose,
  categories,
  sortOptions,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: SearchFilters = {
      query: '',
      category: '',
      priceRange: [0, 1000],
      location: '',
      rating: 0,
      verified: false,
      sortBy: 'relevance',
      tags: [],
      hasDiscount: false,
      deliveryType: '',
      availability: '',
    };
    setLocalFilters(resetFilters);
  };

  return (
    <Box sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Filtros Avanzados
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Categorías */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Categorías
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.icon} ${category.name}`}
              variant={
                localFilters.category === category.id ? 'filled' : 'outlined'
              }
              onClick={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  category: prev.category === category.id ? '' : category.id,
                }))
              }
              className="chip-micro-interactive"
            />
          ))}
        </Box>
      </Box>

      {/* Rango de precios */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Rango de Precios (ü)
        </Typography>
        <Slider
          value={localFilters.priceRange}
          onChange={(_, value) =>
            setLocalFilters((prev) => ({
              ...prev,
              priceRange: value as [number, number],
            }))
          }
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={10}
          marks={[
            { value: 0, label: 'ü0' },
            { value: 250, label: 'ü250' },
            { value: 500, label: 'ü500' },
            { value: 750, label: 'ü750' },
            { value: 1000, label: 'ü1000+' },
          ]}
        />
      </Box>

      {/* Calificación mínima */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Calificación Mínima
        </Typography>
        <Rating
          value={localFilters.rating}
          onChange={(_, value) =>
            setLocalFilters((prev) => ({ ...prev, rating: value || 0 }))
          }
          precision={0.5}
        />
      </Box>

      {/* Ordenar por */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Ordenar por
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sortOptions.map((option) => (
            <Chip
              key={option.value}
              label={`${option.icon} ${option.label}`}
              variant={
                localFilters.sortBy === option.value ? 'filled' : 'outlined'
              }
              onClick={() =>
                setLocalFilters((prev) => ({ ...prev, sortBy: option.value }))
              }
              className="chip-micro-interactive"
            />
          ))}
        </Box>
      </Box>

      {/* Switches */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={localFilters.verified}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  verified: e.target.checked,
                }))
              }
            />
          }
          label="Solo proveedores verificados"
        />
        <FormControlLabel
          control={
            <Switch
              checked={localFilters.hasDiscount}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  hasDiscount: e.target.checked,
                }))
              }
            />
          }
          label="Solo ofertas con descuento"
        />
      </Box>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleResetFilters}
          className="btn-micro-interactive"
        >
          Limpiar Filtros
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleApplyFilters}
          className="btn-micro-interactive"
        >
          Aplicar Filtros
        </Button>
      </Box>
    </Box>
  );
};

// 📱 Componente de detalle de producto
interface ProductDetailViewProps {
  product: MarketplaceItem;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onClose,
  onToggleFavorite,
}) => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <IconButton edge="start" onClick={onClose} sx={{ color: 'black' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, color: 'black' }}>
            Detalle del Producto
          </Typography>
          <IconButton
            onClick={() => onToggleFavorite(product.id)}
            sx={{ color: 'black' }}
          >
            {product.isFavorited ? (
              <Favorite sx={{ color: '#FF4444' }} />
            ) : (
              <Favorite />
            )}
          </IconButton>
          <IconButton sx={{ color: 'black' }}>
            <Share />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenido */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Imagen principal */}
        <Box
          sx={{
            height: 250,
            backgroundColor: '#f5f5f5',
            backgroundImage: `url(${product.images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {product.discount && (
            <Chip
              label={`-${product.discount}%`}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: '#FF4444',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>

        {/* Información del producto */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            {product.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.reviewCount} reseñas)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {product.originalPrice && (
              <Typography
                variant="h6"
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ü{product.originalPrice}
              </Typography>
            )}
            <Typography variant="h4" fontWeight="bold" color="primary">
              ü{product.price}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {product.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Box>

          {/* Información del vendedor */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={product.seller.avatar}
                  sx={{ width: 60, height: 60 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {product.seller.name}
                    </Typography>
                    {product.seller.verified && (
                      <VerifiedIcon sx={{ color: '#1976d2' }} />
                    )}
                    {product.seller.isOnline && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#4CAF50',
                          }}
                        />
                        <Typography variant="caption" color="success.main">
                          En línea
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {product.seller.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Responde en {product.seller.responseTime}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Rating
                      value={product.seller.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                    <Typography variant="caption">
                      ({product.seller.reviewCount} reseñas)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Información de entrega */}
          {product.deliveryTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalOffer />
              <Typography variant="body2">
                Tiempo de entrega: {product.deliveryTime}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationIcon />
            <Typography variant="body2">{product.location}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Botones de acción */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Chat />}
            className="btn-micro-interactive"
          >
            Chatear
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCart />}
            className="btn-micro-interactive"
          >
            Contratar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export { MobileMarketplaceView };
