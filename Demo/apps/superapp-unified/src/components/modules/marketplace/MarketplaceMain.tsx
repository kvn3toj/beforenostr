import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  LinearProgress,
  Alert,
  Stack,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
  Badge,
  CardMedia,
  CardActions,
  Skeleton,
  Tooltip,
  Paper,
  Fab
} from '@mui/material';
import {
  Search,
  FilterList,
  Star,
  ShoppingCart,
  Visibility,
  MoreVert,
  TrendingUp,
  TrendingDown,
  LocalOffer,
  Store,
  Refresh,
  Close,
  Tune,
  Sort,
  Info,
  StarBorder,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Add as AddIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { useMarketplaceData, useMerchantProfile, useProducts, useBackendAvailability } from '../../../hooks/useRealBackendData';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../lib/api-service';
import { useAuth } from '../../../contexts/AuthContext';
import AdvancedSearch from './components/AdvancedSearch';

// 🏷️ Tipos de datos
interface GigCard {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  images: string[];
  type: string;
  category?: string;
  rating?: number;
  options: {
    delivery: boolean;
    virtual: boolean;
    onSite: boolean;
  };
}

// 🎛️ Interfaz para filtros
interface MarketplaceFilters {
  category: string;
  contentType: string;
  priceRange: [number, number];
  deliveryType: string[];
  minRating: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

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
  createdAt: string;
  viewCount: number;
  favoriteCount: number;
  isFavorited?: boolean;
}

interface SearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  location: string;
  rating: number;
  verified: boolean;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  tags: string[];
}

const MarketplaceMain: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    priceRange: [0, 1000],
    location: '',
    rating: 0,
    verified: false,
    sortBy: 'relevance',
    tags: []
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // 🎛️ Estados para filtros avanzados
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: 'all',
    contentType: 'all',
    priceRange: [0, 1000],
    deliveryType: [],
    minRating: 0,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // 🔗 Conectar al backend real con fallback a datos mockeados
  const backendAvailability = useBackendAvailability();
  const marketplaceDataQuery = useMarketplaceData();
  const merchantProfileQuery = useMerchantProfile();
  const productsQuery = useProducts();

  // 🎯 Decidir qué datos usar basado en disponibilidad del backend
  const marketplaceData = marketplaceDataQuery.data;
  const merchantProfile = merchantProfileQuery.data;
  const products = productsQuery.data || [];

  // 🔄 Función para refrescar datos
  const handleRefresh = () => {
    marketplaceDataQuery.refetch?.();
    merchantProfileQuery.refetch?.();
    productsQuery.refetch?.();
  };

  // 🎛️ Funciones para manejo de filtros
  const handleFilterChange = (filterKey: keyof MarketplaceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      contentType: 'all',
      priceRange: [0, 1000],
      deliveryType: [],
      minRating: 0,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    setActiveFiltersCount(0);
  };

  const applyFilters = () => {
    // Contar filtros activos
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.contentType !== 'all') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.deliveryType.length > 0) count++;
    if (filters.minRating > 0) count++;
    if (filters.sortBy !== 'relevance') count++;
    
    setActiveFiltersCount(count);
    setShowFilters(false);
  };

  // 🎭 Datos de fallback/mock cuando el backend no está disponible
  const mockGigs: GigCard[] = [
    {
      id: 'servicio-1',
      title: 'Desarrollo Web Profesional',
      description: 'Desarrollo de aplicaciones web modernas con React y TypeScript. Incluye diseño responsive, optimización SEO y deployment. Como miembro CoomÜnity, obtén hasta 30% de descuento.',
      price: 250,
      currency: 'Lükas',
      category: 'tecnologia',
      rating: 4.8,
      author: {
        name: 'Jhonatan Arias',
        username: '@jhonatan_arias_35 • Emprendedor Confiable',
        avatar: '/images/user-default.jpg',
      },
      images: ['/images/service-placeholder.jpg'],
      type: 'servicio',
      options: {
        delivery: true,
        virtual: true,
        onSite: false,
      },
    },
    // 🎮 Gigs migrados desde ÜPlay
    {
      id: 'servicio-mobile-dev',
      title: 'Desarrollo de aplicaciones móviles',
      description: 'Desarrollo de apps nativas para iOS y Android con tecnologías modernas. Experiencia en Flutter, React Native y desarrollo nativo.',
      price: 500,
      currency: 'Lükas',
      category: 'tecnologia',
      rating: 4.9,
      author: {
        name: 'Alex Móvil',
        username: '@alex_mobile_dev • Emprendedor Confiable',
        avatar: '/images/user-default.jpg',
      },
      images: ['/images/service-placeholder.jpg'],
      type: 'servicio',
      options: {
        delivery: true,
        virtual: true,
        onSite: false,
      },
    },
    {
      id: 'experiencia-guitarra',
      title: 'Clases de guitarra online',
      description: 'Aprende guitarra desde cero con clases personalizadas. Metodología interactiva con videos gamificados y seguimiento de progreso.',
      price: 50,
      currency: 'Lükas',
      category: 'educacion',
      rating: 4.7,
      author: {
        name: 'Carlos Músico',
        username: '@carlos_guitar • Emprendedor Confiable',
        avatar: '/images/user-default.jpg',
      },
      images: ['/images/service-placeholder.jpg'],
      type: 'experiencia',
      options: {
        delivery: false,
        virtual: true,
        onSite: false,
      },
    },
    {
      id: 'servicio-2',
      title: 'Diseño UX/UI Premium',
      description: 'Diseño de interfaces intuitivas y experiencias excepcionales. Incluye prototipado, testing y handoff. Apoyando el talento local con descuentos exclusivos CoomÜnity.',
      price: 180,
      currency: 'Lükas',
      category: 'diseno',
      rating: 4.9,
      author: {
        name: 'Ana González',
        username: '@ana_designer • Emprendedora Confiable',
        avatar: '/images/user-default.jpg',
      },
      images: ['/images/service-placeholder.jpg'],
      type: 'servicio',
      options: {
        delivery: true,
        virtual: true,
        onSite: true,
      },
    },
    {
      id: 'servicio-3',
      title: 'Marketing Digital Estratégico',
      description: 'Estrategia completa de marketing digital consciente: SEO, SEM, redes sociales y análisis de métricas para impulsar tu negocio de forma ética y sostenible.',
      price: 320,
      currency: 'Lükas',
      category: 'marketing',
      rating: 4.7,
      author: {
        name: 'Carlos Mendez',
        username: '@carlos_marketing • Emprendedor Confiable',
        avatar: '/images/user-default.jpg',
      },
      images: ['/images/service-placeholder.jpg'],
      type: 'servicio',
      options: {
        delivery: true,
        virtual: true,
        onSite: false,
      },
    },
    {
      id: 'producto-1',
      title: 'Curso Online de Programación',
      description: 'Curso completo de desarrollo full-stack desde cero. 40 horas de contenido, proyectos prácticos y certificación. Educación consciente para la transformación digital.',
      price: 95,
      currency: 'Lükas',
      category: 'educacion',
      rating: 4.6,
      author: {
        name: 'María Tech',
        username: '@maria_tech • Emprendedora Confiable',
        avatar: '/images/user-default.jpg',
      },
      images: ['/images/service-placeholder.jpg'],
      type: 'producto',
      options: {
        delivery: true,
        virtual: true,
        onSite: false,
      },
    },
    {
      id: 'servicio-4',
      title: 'Consultoría Empresarial Consciente',
      description: 'Asesoría especializada en transformación digital y optimización de procesos empresariales con enfoque en el Bien Común y la sostenibilidad.',
      price: 150,
      currency: 'Lükas',
      category: 'consultoria',
      rating: 4.5,
      author: {
        name: 'Roberto Silva',
        username: '@roberto_consulting • Emprendedor Confiable',
        avatar: '/images/user-default.jpg',
      },
      images: ['/images/service-placeholder.jpg'],
      type: 'servicio',
      options: {
        delivery: false,
        virtual: true,
        onSite: true,
      },
    },
  ];

  // 📋 Categorías disponibles (expandidas para incluir tipos de ÜPlay)
  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'diseno', label: 'Diseño' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'educacion', label: 'Educación' },
    { value: 'consultoria', label: 'Consultoría' },
    { value: 'entretenimiento', label: 'Entretenimiento' },
    { value: 'manufactura', label: 'Manufactura' },
    { value: 'logistica', label: 'Logística' },
    { value: 'coaching', label: 'Coaching' },
    { value: 'reutilizacion', label: 'Reutilización' },
  ];

  // 🎯 Tipos de contenido (productos, servicios, experiencias)
  const contentTypes = [
    { value: 'all', label: 'Todo' },
    { value: 'producto', label: 'Productos' },
    { value: 'servicio', label: 'Servicios' },
    { value: 'experiencia', label: 'Experiencias' },
  ];

  // 🔧 Opciones de ordenamiento
  const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price', label: 'Precio' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Más recientes' },
    { value: 'popular', label: 'Más populares' },
  ];

  const popularDesires = [
    { name: 'Desarrollo Web', progress: 85 },
    { name: 'Diseño Gráfico', progress: 72 },
    { name: 'Marketing Digital', progress: 68 },
    { name: 'Consultoría Consciente', progress: 55 },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando:', currentFilters.query);
    // TODO: Implementar búsqueda real en el backend
  };

  const handleQuickFilter = (type: string) => {
    switch (type) {
      case 'popular':
        handleFilterChange('sortBy', 'popular');
        break;
      case 'price':
        handleFilterChange('sortBy', 'price');
        handleFilterChange('sortOrder', 'asc');
        break;
      case 'rating':
        handleFilterChange('minRating', 4);
        break;
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilters(true);
  };

  const handleMenuClose = () => {
    setShowFilters(false);
  };

  // 🎨 Mapear datos del backend al formato esperado por la UI
  const normalizedProducts = products.map((product: any) => ({
    id: product.id,
    title: product.name,
    description: product.description || 'Producto disponible en el marketplace',
    price: product.price,
    currency: 'COP',
    category: product.category || 'tecnologia',
    rating: product.rating || 4.0,
    author: {
      name: merchantProfile?.owner || 'Merchant CoomÜnity',
      username: '@merchant',
      avatar: '/images/user-default.jpg',
    },
    images: product.images || ['/images/service-placeholder.jpg'],
    type: 'producto',
    options: {
      delivery: product.delivery || true,
      virtual: product.virtual || false,
      onSite: product.onSite || true,
    },
  }));

  // 🔍 Aplicar filtros y ordenamiento
  const filterAndSortGigs = (gigs: GigCard[]) => {
    let filteredGigs = [...gigs];

    // Filtrar por búsqueda
    if (currentFilters.query.trim()) {
      const searchTerm = currentFilters.query.toLowerCase();
      filteredGigs = filteredGigs.filter(gig =>
        gig.title.toLowerCase().includes(searchTerm) ||
        gig.description.toLowerCase().includes(searchTerm) ||
        gig.author.name.toLowerCase().includes(searchTerm) ||
        gig.category?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por categoría - usar filters en lugar de currentFilters
    if (filters.category !== 'all') {
      filteredGigs = filteredGigs.filter(gig => gig.category === filters.category);
    }

    // Filtrar por tipo de contenido (productos, servicios, experiencias)
    if (filters.contentType !== 'all') {
      filteredGigs = filteredGigs.filter(gig => gig.type === filters.contentType);
    }

    // Filtrar por rango de precio - usar filters
    filteredGigs = filteredGigs.filter(gig =>
      gig.price >= filters.priceRange[0] && gig.price <= filters.priceRange[1]
    );

    // Filtrar por tipo de entrega - usar filters y verificar que deliveryType existe
    if (filters.deliveryType && filters.deliveryType.length > 0) {
      filteredGigs = filteredGigs.filter(gig => {
        return filters.deliveryType.some(type => {
          switch (type) {
            case 'delivery': return gig.options.delivery;
            case 'virtual': return gig.options.virtual;
            case 'onSite': return gig.options.onSite;
            default: return false;
          }
        });
      });
    }

    // Filtrar por rating mínimo - usar filters
    if (filters.minRating > 0) {
      filteredGigs = filteredGigs.filter(gig => (gig.rating || 0) >= filters.minRating);
    }

    // Ordenar resultados - usar filters
    filteredGigs.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'newest':
          // Para demo, usar ID como proxy de fecha
          comparison = b.id.localeCompare(a.id);
          break;
        case 'popular':
          // Para demo, usar rating como proxy de popularidad
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'relevance':
        default:
          // Por defecto, mantener orden original (relevancia)
          return 0;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filteredGigs;
  };

  const displayGigs = filterAndSortGigs(normalizedProducts.length > 0 ? normalizedProducts : mockGigs);

  // 📊 Total de productos disponibles
  const totalProducts = displayGigs.length;

  // Fetch featured items when no search is active
  const { data: featuredItems = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['marketplace-featured'],
    queryFn: () => apiService.get('/marketplace/featured'),
    enabled: !isSearchActive,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user's favorites
  const { data: userFavorites = [] } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: () => apiService.get('/marketplace/favorites'),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ itemId, isFavorited }: { itemId: string; isFavorited: boolean }) => {
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

  // Handle search results
  const handleSearchResults = useCallback((results: MarketplaceItem[]) => {
    setSearchResults(results);
    setIsSearchActive(results.length > 0 || currentFilters.query.length > 0);
  }, [currentFilters.query]);

  // Handle filters change
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
      filters.priceRange[1] < 1000
    );
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback((itemId: string, currentlyFavorited: boolean) => {
    if (!user) return;
    
    toggleFavoriteMutation.mutate({
      itemId,
      isFavorited: currentlyFavorited
    });
  }, [user, toggleFavoriteMutation]);

  // Get items to display
  const itemsToDisplay = useMemo(() => {
    const items = isSearchActive ? searchResults : featuredItems;
    
    // Add favorite status to items
    return items.map(item => ({
      ...item,
      isFavorited: userFavorites.some((fav: any) => fav.itemId === item.id)
    }));
  }, [isSearchActive, searchResults, featuredItems, userFavorites]);

  // Format price
  const formatPrice = (price: number, currency: string = 'USD') => {
    if (currency === 'LUKAS') {
      return `${price} Lükas`;
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  // Render marketplace item card
  const renderItemCard = (item: MarketplaceItem) => (
    <Card 
      key={item.id} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      {/* Item Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={item.images[0] || '/placeholder-image.jpg'}
          alt={item.title}
          sx={{ objectFit: 'cover' }}
        />
        
        {/* Featured Badge */}
        {item.featured && (
          <Chip
            label="Destacado"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold'
            }}
          />
        )}

        {/* Favorite Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
          }}
          onClick={() => handleToggleFavorite(item.id, item.isFavorited || false)}
          disabled={!user || toggleFavoriteMutation.isPending}
        >
          {item.isFavorited ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Title and Price */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {item.title}
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatPrice(item.price, item.currency)}
          </Typography>
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {item.description}
        </Typography>

        {/* Seller Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            src={item.seller.avatar} 
            alt={item.seller.name}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" noWrap>
                {item.seller.name}
              </Typography>
              {item.seller.verified && (
                <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                ({item.seller.reviewCount})
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Location and Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {item.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <ViewIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.25 }} />
              {item.viewCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <FavoriteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.25 }} />
              {item.favoriteCount}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {item.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          ))}
          {item.tags.length > 3 && (
            <Chip
              label={`+${item.tags.length - 3}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<CartIcon />}
          sx={{ borderRadius: 2 }}
        >
          Ver Detalles
        </Button>
        <IconButton size="small">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  // Render list view item
  const renderListItem = (item: MarketplaceItem) => (
    <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3} md={2}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="120"
              image={item.images[0] || '/placeholder-image.jpg'}
              alt={item.title}
              sx={{ borderRadius: 1, objectFit: 'cover' }}
            />
            {item.featured && (
              <Chip
                label="Destacado"
                color="primary"
                size="small"
                sx={{ position: 'absolute', top: 4, left: 4 }}
              />
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={7}>
          <Typography variant="h6" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {item.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Avatar src={item.seller.avatar} sx={{ width: 24, height: 24 }} />
              <Typography variant="body2">{item.seller.name}</Typography>
              {item.seller.verified && <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {item.location}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {item.tags.slice(0, 5).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={3} md={3}>
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
              {formatPrice(item.price, item.currency)}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                ({item.reviewCount})
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
              <Button variant="contained" size="small" startIcon={<CartIcon />}>
                Ver Detalles
              </Button>
              <IconButton 
                size="small"
                onClick={() => handleToggleFavorite(item.id, item.isFavorited || false)}
                disabled={!user}
              >
                {item.isFavorited ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🏪 Marketplace CoomÜnity
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Descubre productos y servicios de emprendedores confiables en nuestra economía colaborativa
        </Typography>
      </Box>

      {/* Advanced Search */}
      <AdvancedSearch
        onSearchResults={handleSearchResults}
        onFiltersChange={handleFiltersChange}
        initialFilters={currentFilters}
      />

      {/* View Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          {isSearchActive ? (
            `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''} encontrado${searchResults.length !== 1 ? 's' : ''}`
          ) : (
            `${featuredItems.length} producto${featuredItems.length !== 1 ? 's' : ''} destacado${featuredItems.length !== 1 ? 's' : ''}`
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Vista en cuadrícula">
            <IconButton
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              <GridViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Vista en lista">
            <IconButton
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              <ListViewIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Content */}
      {featuredLoading && !isSearchActive ? (
        // Loading skeletons
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={24} width="60%" />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : itemsToDisplay.length === 0 ? (
        // Empty state
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {isSearchActive ? 'No se encontraron resultados' : 'No hay productos disponibles'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {isSearchActive 
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'Sé el primero en publicar un producto o servicio'
            }
          </Typography>
          {!isSearchActive && (
            <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Publicar Producto/Servicio
            </Button>
          )}
        </Box>
      ) : (
        // Items display
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {itemsToDisplay.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  {renderItemCard(item)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {itemsToDisplay.map(renderListItem)}
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default MarketplaceMain; 