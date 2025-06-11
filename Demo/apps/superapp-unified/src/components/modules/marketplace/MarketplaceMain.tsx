import React, { useState, useCallback, useMemo } from 'react';
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
} from '@mui/material';
import '../../../styles/marketplace-mobile.css';
import { FilterList, Add as AddIcon } from '@mui/icons-material';
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

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

const MarketplaceMain: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados
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
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // 🔗 Conectar al backend real con fallback a datos mockeados
  const backendAvailability = useBackendAvailability();
  const marketplaceDataQuery = useMarketplaceData();
  const merchantProfileQuery = useMerchantProfile();
  const productsQuery = useProducts();

  // 🎭 Datos mock para desarrollo
  const mockCategories: Category[] = [
    { id: 'tecnologia', name: 'Tecnología', icon: '/images/category-tech.jpg' },
    { id: 'diseno', name: 'Diseño', icon: '/images/category-design.jpg' },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: '/images/category-marketing.jpg',
    },
    {
      id: 'educacion',
      name: 'Educación',
      icon: '/images/category-education.jpg',
    },
    {
      id: 'consultoria',
      name: 'Consultoría',
      icon: '/images/category-consulting.jpg',
    },
  ];

  const mockProducts: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Desarrollo Web Profesional',
      description:
        'Desarrollo de aplicaciones web modernas con React y TypeScript',
      price: 250,
      currency: 'Lükas',
      category: 'tecnologia',
      images: ['/images/service-placeholder.jpg'],
      seller: {
        id: '1',
        name: 'Proveedor',
        username: '@Nickname',
        avatar: '/images/user-default.jpg',
        verified: true,
        rating: 4.5,
        reviewCount: 23,
      },
      location: 'Cali, Valle del Cauca',
      rating: 4.5,
      reviewCount: 23,
      tags: ['web', 'react', 'typescript'],
      featured: true,
      createdAt: '2024-01-01',
      viewCount: 44,
      favoriteCount: 33,
      isFavorited: false,
    },
    {
      id: '2',
      title: 'Diseño UX/UI Premium',
      description:
        'Diseño de interfaces intuitivas y experiencias excepcionales',
      price: 180,
      currency: 'Lükas',
      category: 'diseno',
      images: ['/images/service-placeholder.jpg'],
      seller: {
        id: '2',
        name: 'Proveedor',
        username: '@Nickname',
        avatar: '/images/user-default.jpg',
        verified: true,
        rating: 4.5,
        reviewCount: 15,
      },
      location: 'Cali, Valle del Cauca',
      rating: 4.5,
      reviewCount: 15,
      tags: ['ux', 'ui', 'design'],
      featured: true,
      createdAt: '2024-01-02',
      viewCount: 32,
      favoriteCount: 28,
      isFavorited: false,
    },
    {
      id: '3',
      title: 'Marketing Digital Estratégico',
      description: 'Estrategia completa de marketing digital consciente',
      price: 320,
      currency: 'L��kas',
      category: 'marketing',
      images: ['/images/service-placeholder.jpg'],
      seller: {
        id: '3',
        name: 'Proveedor',
        username: '@Nickname',
        avatar: '/images/user-default.jpg',
        verified: true,
        rating: 4.5,
        reviewCount: 31,
      },
      location: 'Cali, Valle del Cauca',
      rating: 4.5,
      reviewCount: 31,
      tags: ['marketing', 'digital', 'strategy'],
      featured: true,
      createdAt: '2024-01-03',
      viewCount: 67,
      favoriteCount: 45,
      isFavorited: false,
    },
    {
      id: '4',
      title: 'Curso Online de Programación',
      description: 'Curso completo de desarrollo full-stack desde cero',
      price: 95,
      currency: 'Lükas',
      category: 'educacion',
      images: ['/images/service-placeholder.jpg'],
      seller: {
        id: '4',
        name: 'Proveedor',
        username: '@Nickname',
        avatar: '/images/user-default.jpg',
        verified: true,
        rating: 4.5,
        reviewCount: 18,
      },
      location: 'Cali, Valle del Cauca',
      rating: 4.5,
      reviewCount: 18,
      tags: ['programming', 'course', 'fullstack'],
      featured: true,
      createdAt: '2024-01-04',
      viewCount: 89,
      favoriteCount: 52,
      isFavorited: false,
    },
  ];

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

  // Handlers
  const handleRoleChange = (role: 'consumer' | 'provider') => {
    setSelectedRole(role);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentFilters((prev) => ({ ...prev, query: searchQuery }));
    setIsSearchActive(searchQuery.length > 0);
    // TODO: Implementar búsqueda real
  };

  const handleCategoryClick = (categoryId: string) => {
    setCurrentFilters((prev) => ({ ...prev, category: categoryId }));
    setIsSearchActive(true);
  };

  const handleViewAllCategories = () => {
    setShowAdvancedSearch(true);
  };

  const handleProductClick = (productId: string) => {
    console.log('Producto clickeado:', productId);
    // TODO: Navegar a página de detalle del producto
  };

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

  // Handle search results
  const handleSearchResults = useCallback(
    (results: MarketplaceItem[]) => {
      setSearchResults(results);
      setIsSearchActive(results.length > 0 || currentFilters.query.length > 0);
    },
    [currentFilters.query]
  );

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

  // Get items to display
  const itemsToDisplay = useMemo(() => {
    const items = isSearchActive
      ? searchResults
      : featuredItems.length > 0
        ? featuredItems
        : mockProducts;

    // Add favorite status to items
    return items.map((item) => ({
      ...item,
      isFavorited: userFavorites.some((fav: any) => fav.itemId === item.id),
    }));
  }, [
    isSearchActive,
    searchResults,
    featuredItems,
    userFavorites,
    mockProducts,
  ]);

  // Mobile Layout
  if (isMobile) {
    return (
      <MobileMarketplaceView
        onMenuClick={handleMenuClick}
        onChatClick={handleChatClick}
        onNotificationsClick={handleNotificationsClick}
      />
    );
  }

  // Desktop Layout (mantenemos el diseño existente)
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🏪 Marketplace CoomÜnity
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Descubre productos y servicios de emprendedores confiables en nuestra
          economía colaborativa
        </Typography>
      </Box>

      {/* Advanced Search */}
      <AdvancedSearch
        onSearchResults={handleSearchResults}
        onFiltersChange={handleFiltersChange}
        initialFilters={currentFilters}
      />

      {/* Content */}
      {featuredLoading && !isSearchActive ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : itemsToDisplay.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {isSearchActive
              ? 'No se encontraron resultados'
              : 'No hay productos disponibles'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {isSearchActive
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'Sé el primero en publicar un producto o servicio'}
          </Typography>
          {!isSearchActive && (
            <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Publicar Producto/Servicio
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {itemsToDisplay.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ProductCard
                id={item.id}
                title={item.title}
                price={item.price}
                currency={item.currency}
                location={item.location}
                rating={item.rating}
                seller={item.seller}
                image={item.images[0] || '/images/service-placeholder.jpg'}
                isFavorited={item.isFavorited}
                onToggleFavorite={handleToggleFavorite}
                onClick={handleProductClick}
              />
            </Grid>
          ))}
        </Grid>
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
