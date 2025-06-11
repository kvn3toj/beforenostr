import React, { useState, useCallback, useMemo } from 'react';
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
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';
import { useAuth } from '../../../../contexts/AuthContext';
import { ProductCard } from './ProductCard';

// Types
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

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
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

  // States
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'provider'>(
    'consumer'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    priceRange: [0, 100],
    location: '',
    rating: 0,
    verified: false,
    sortBy: 'relevance',
    tags: [],
  });

  // Mock data for development
  const mockCategories: Category[] = [
    { id: 'categoria1', name: 'Categoría', icon: '🏪' },
    { id: 'categoria2', name: 'Categoría', icon: '🛍️' },
    { id: 'categoria3', name: 'Categoría', icon: '🎯' },
    { id: 'categoria4', name: 'Categoría', icon: '⚡' },
  ];

  // Filter categories for advanced search
  const filterCategories = [
    { value: '', label: 'Todas las categorías', icon: '🏪' },
    { value: 'tecnologia', label: 'Tecnología', icon: '💻' },
    { value: 'diseno', label: 'Diseño', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'educacion', label: 'Educación', icon: '📚' },
    { value: 'salud', label: 'Salud y Bienestar', icon: '🏥' },
    { value: 'arte', label: 'Arte y Creatividad', icon: '🎭' },
    { value: 'consultoria', label: 'Consultoría', icon: '💼' },
    { value: 'servicios', label: 'Servicios Generales', icon: '🔧' },
  ];

  // Popular tags for filtering
  const popularTags = [
    'Digital',
    'Presencial',
    'Remoto',
    'Urgente',
    'Personalizado',
    'Emprendimiento',
    'Sostenible',
    'Innovador',
    'Colaborativo',
    'Ayni',
  ];

  // Search suggestions for mobile search
  const suggestedProducts = [
    'Alimentos orgánicos',
    'Clases de baile',
    'Alimentación saludable',
    'Categoría',
    'Diseño gráfico',
    'Tutoría matemáticas',
    'Repostería casera',
    'Yoga presencial',
  ];

  const suggestedCategories = [
    { name: 'Alimentos orgánicos', type: 'category' },
    { name: 'Clases de baile', type: 'category' },
    { name: 'Alimentación saludable', type: 'category' },
    { name: 'Categoría', type: 'category' },
  ];

  const mockProducts: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Nombre del producto',
      description: 'Descripción del producto',
      price: 7,
      currency: 'ü',
      category: 'categoria1',
      images: ['/images/product-placeholder.jpg'],
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
      tags: ['producto'],
      featured: true,
      createdAt: '2024-01-01',
      viewCount: 44,
      favoriteCount: 33,
      isFavorited: false,
    },
    {
      id: '2',
      title: 'Nombre del producto',
      description: 'Descripción del segundo producto',
      price: 7,
      currency: 'ü',
      category: 'categoria2',
      images: ['/images/product-placeholder-2.jpg'],
      seller: {
        id: '2',
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
      tags: ['producto'],
      featured: true,
      createdAt: '2024-01-02',
      viewCount: 32,
      favoriteCount: 28,
      isFavorited: false,
    },
    {
      id: '3',
      title: 'Nombre del producto',
      description: 'Descripción del tercer producto',
      price: 7,
      currency: 'ü',
      category: 'categoria3',
      images: ['/images/product-placeholder-3.jpg'],
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
      tags: ['producto'],
      featured: true,
      createdAt: '2024-01-03',
      viewCount: 67,
      favoriteCount: 45,
      isFavorited: false,
    },
    {
      id: '4',
      title: 'Nombre del producto',
      description: 'Descripción del cuarto producto',
      price: 7,
      currency: 'ü',
      category: 'categoria4',
      images: ['/images/product-placeholder-4.jpg'],
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
      tags: ['producto'],
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
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user's favorites
  const { data: userFavorites = [] } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: () => apiService.get('/marketplace/favorites'),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
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

  // Event handlers
  const handleRoleChange = useCallback((role: 'consumer' | 'provider') => {
    setSelectedRole(role);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsSearchActive(searchQuery.length > 0);
    },
    [searchQuery]
  );

  const handleCategoryClick = useCallback((categoryId: string) => {
    console.log('Category clicked:', categoryId);
  }, []);

  const handleProductClick = useCallback((productId: string) => {
    console.log('Producto clickeado:', productId);
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

  // Filter handlers
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      // TODO: Apply filters to search results
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      query: '',
      category: '',
      priceRange: [0, 100],
      location: '',
      rating: 0,
      verified: false,
      sortBy: 'relevance',
      tags: [],
    });
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.rating > 0) count++;
    if (filters.verified) count++;
    if (filters.tags.length > 0) count += filters.tags.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++;
    return count;
  }, [filters]);

  const activeFiltersCount = getActiveFiltersCount();

  // Search handlers
  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => setSearchFocused(false), 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchFocused(false);
    // Trigger search with the suggestion
    setIsSearchActive(true);
  };

  const handleCreateRequest = () => {
    console.log('Creating request...');
    // TODO: Navigate to request creation page
    setSearchFocused(false);
  };

  // Get items to display
  const itemsToDisplay = useMemo(() => {
    const items = isSearchActive
      ? searchResults
      : featuredItems.length > 0
        ? featuredItems
        : mockProducts;

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

  return (
    <Box
      data-testid="mobile-marketplace"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        maxWidth: '360px',
        margin: '0 auto',
        flexDirection: 'column',
        overflow: 'auto',
        alignItems: 'stretch',
        zIndex: 1000,
      }}
    >
      {/* Device Status Bar */}
      <Box
        sx={{
          backgroundColor: 'rgba(254, 247, 255, 1)',
          display: 'flex',
          minHeight: '44px',
          width: '100%',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '19px',
          paddingBottom: '8px',
          alignItems: 'end',
          gap: '40px 100px',
          fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: '12px',
          color: 'var(--M3-ref-neutral-neutral10, #1D1B20)',
          fontWeight: 400,
          whiteSpace: 'nowrap',
          letterSpacing: '0.12px',
          lineHeight: 1.43,
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            color: 'var(--M3-ref-neutral-neutral10, #1D1B20)',
            fontVariantNumeric: 'lining-nums proportional-nums',
            fontFeatureSettings: "'dlig' on, 'ss02' on",
          }}
        >
          9:30
        </Typography>
        <Box
          component="img"
          src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/48990f66438cd47749f63d78b69a322944b49623?placeholderIfAbsent=true"
          alt="right icons"
          sx={{
            position: 'relative',
            display: 'flex',
            width: '39px',
            aspectRatio: 0.385,
            flexShrink: 0,
          }}
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
      </Box>

      {/* Top App Bar */}
      <Box
        sx={{
          alignItems: 'center',
          zIndex: 10,
          display: 'flex',
          minHeight: '40px',
          width: '100%',
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '2px',
          paddingBottom: '2px',
          gap: '8px',
          justifyContent: 'start',
          background: 'var(--M3-sys-light-surface, #FFF8F8)',
        }}
      >
        {/* Leading Icon (Menu) */}
        <Box
          sx={{
            alignSelf: 'stretch',
            display: 'flex',
            marginTop: 'auto',
            marginBottom: 'auto',
            minHeight: '36px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
          }}
        >
          <Box
            sx={{
              borderRadius: '100px',
              display: 'flex',
              width: '100%',
              maxWidth: '32px',
              alignItems: 'center',
              gap: '4px',
              overflow: 'hidden',
              justifyContent: 'center',
            }}
          >
            <IconButton
              onClick={onMenuClick}
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                marginTop: 'auto',
                marginBottom: 'auto',
                width: '32px',
                height: '32px',
                padding: '4px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/5f1dd79827c224f42052f2dfcb5ce45c2f5fa303?placeholderIfAbsent=true"
                alt="menu"
                sx={{
                  position: 'relative',
                  display: 'flex',
                  width: '20px',
                  height: '20px',
                  aspectRatio: 1,
                }}
                onError={(e) => {
                  // Fallback to Menu icon if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Headline */}
        <Typography
          sx={{
            color: 'var(--Schemes-Secondary, #625B71)',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.2,
            alignSelf: 'stretch',
            marginTop: 'auto',
            marginBottom: 'auto',
            flex: 1,
            flexShrink: 1,
            flexBasis: '0%',
          }}
        >
          ÜMarket
        </Typography>

        {/* Trailing Icons */}
        <Box
          component="img"
          src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/39207d834a47541f58c45c111c09d20a3bc6d486?placeholderIfAbsent=true"
          alt="trailing-icon"
          sx={{
            position: 'relative',
            display: 'flex',
            height: '32px',
            width: '64px',
            aspectRatio: 2,
            flexShrink: 0,
          }}
          onError={(e) => {
            // Fallback to individual icons if image doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          marginTop: '12px',
          width: '100%',
          paddingLeft: '7px',
          paddingRight: '7px',
          flexDirection: 'column',
        }}
      >
        {/* Consumer/Provider Toggle */}
        <Box
          sx={{
            borderRadius: '42px',
            backgroundColor: 'rgba(236, 239, 243, 1)',
            alignSelf: 'center',
            display: 'flex',
            width: '237px',
            maxWidth: '100%',
            paddingLeft: '5px',
            paddingRight: '16px',
            paddingTop: '6px',
            paddingBottom: '6px',
            alignItems: 'stretch',
            gap: '2px',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            letterSpacing: '0.08px',
            lineHeight: 1.18,
          }}
        >
          {/* Consumidor Button */}
          <Box
            onClick={() => handleRoleChange('consumer')}
            sx={{
              borderRadius: '83px',
              backgroundColor:
                selectedRole === 'consumer'
                  ? 'rgba(116, 0, 86, 1)'
                  : 'transparent',
              alignSelf: 'start',
              display: 'flex',
              minHeight: '33px',
              flexDirection: 'column',
              overflow: 'hidden',
              alignItems: 'stretch',
              color:
                selectedRole === 'consumer'
                  ? 'var(--Schemes-On-Secondary, #FFF)'
                  : 'rgba(116, 0, 86, 1)',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                color:
                  selectedRole === 'consumer'
                    ? 'var(--Schemes-On-Secondary, #FFF)'
                    : 'rgba(116, 0, 86, 1)',
                alignSelf: 'stretch',
                display: 'flex',
                width: '100%',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '8px',
                paddingBottom: '8px',
                alignItems: 'center',
                gap: '7px',
                justifyContent: 'center',
                flex: 1,
                height: '100%',
              }}
            >
              Consumidor
            </Box>
          </Box>

          {/* Proveedor Button */}
          <Box
            onClick={() => handleRoleChange('provider')}
            sx={{
              borderRadius: '83px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              alignItems: 'stretch',
              color:
                selectedRole === 'provider'
                  ? 'var(--Schemes-On-Secondary, #FFF)'
                  : 'rgba(116, 0, 86, 1)',
              backgroundColor:
                selectedRole === 'provider'
                  ? 'rgba(116, 0, 86, 1)'
                  : 'transparent',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                width: '100%',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '8px',
                paddingBottom: '8px',
                alignItems: 'center',
                gap: '7px',
                justifyContent: 'center',
              }}
            >
              Proveedor
            </Box>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            minWidth: '315px',
            maxWidth: '315px',
            alignItems: 'stretch',
            borderRadius: '24.466px',
            alignSelf: 'center',
            display: 'flex',
            marginTop: '16px',
            minHeight: '34px',
            width: '100%',
            gap: '3px',
            overflow: 'hidden',
            justifyContent: 'start',
            background: 'var(--material-theme-sys-light-on-primary, #FFF)',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              minWidth: '240px',
              width: '100%',
              paddingLeft: '3px',
              paddingRight: '3px',
              paddingTop: '3px',
              paddingBottom: '3px',
              gap: '3px',
              justifyContent: 'start',
              height: '100%',
              flex: 1,
              flexShrink: 1,
              flexBasis: '0%',
              background:
                'var(--m-3-state-layers-light-on-surface-opacity-008, rgba(29, 27, 32, 0.08))',
            }}
          >
            {/* Leading Icon */}
            <Box
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                marginTop: 'auto',
                marginBottom: 'auto',
                minHeight: '42px',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
              }}
            >
              <Box
                sx={{
                  borderRadius: '87px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  overflow: 'hidden',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    alignSelf: 'stretch',
                    display: 'flex',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    paddingLeft: '7px',
                    paddingRight: '7px',
                    paddingTop: '7px',
                    paddingBottom: '7px',
                    alignItems: 'center',
                    gap: '9px',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/c5ee4a16501d18c667d5b01c1c84203c4e28c2fa?placeholderIfAbsent=true"
                    alt="Icon"
                    sx={{
                      alignSelf: 'stretch',
                      position: 'relative',
                      display: 'flex',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      width: '21px',
                      aspectRatio: 0.952,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Search Input */}
            <Box
              component="input"
              placeholder="¿Qué quieres encontrar?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              sx={{
                color: 'var(--M3-sys-light-on-surface-variant, #55414B)',
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                fontFamily:
                  'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '0.44px',
                lineHeight: '21px',
                justifyContent: 'start',
                height: '100%',
                flex: 1,
                flexShrink: 1,
                flexBasis: '0%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
              }}
            />

            {/* Trailing Icon */}
            <Box
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                marginTop: 'auto',
                marginBottom: 'auto',
                alignItems: 'center',
                justifyContent: 'end',
                width: '42px',
              }}
            >
              <Box
                sx={{
                  alignSelf: 'stretch',
                  display: 'flex',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  minHeight: '42px',
                  width: '42px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    borderRadius: '87px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    overflow: 'hidden',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      alignSelf: 'stretch',
                      display: 'flex',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      paddingLeft: '7px',
                      paddingRight: '7px',
                      paddingTop: '7px',
                      paddingBottom: '7px',
                      alignItems: 'center',
                      gap: '9px',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/1334d62b5db4ddb227417f4965f30f715ef3004c?placeholderIfAbsent=true"
                      alt="Icon"
                      sx={{
                        alignSelf: 'stretch',
                        position: 'relative',
                        display: 'flex',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        width: '21px',
                        aspectRatio: 0.952,
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Search Suggestions Dropdown */}
        {searchFocused && (
          <Box
            sx={{
              position: 'absolute',
              top: '160px',
              left: '16px',
              right: '16px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              maxHeight: '400px',
              overflow: 'hidden',
            }}
          >
            {/* Suggested Categories */}
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#888',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Categorías populares
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {suggestedCategories.map((category, index) => (
                  <Box
                    key={index}
                    onClick={() => handleSuggestionClick(category.name)}
                    sx={{
                      backgroundColor: '#F3E5F5',
                      borderRadius: '16px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: '#E1BEE7',
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#740056',
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Suggested Products/Services */}
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#888',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Sugerencias
              </Typography>
              {suggestedProducts.slice(0, 4).map((product, index) => (
                <Box
                  key={index}
                  onClick={() => handleSuggestionClick(product)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 0',
                    cursor: 'pointer',
                    borderBottom: index < 3 ? '1px solid #F0F0F0' : 'none',
                    '&:hover': {
                      backgroundColor: '#F9F9F9',
                    },
                  }}
                >
                  <Search sx={{ fontSize: '16px', color: '#888', mr: 2 }} />
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#333',
                      flex: 1,
                    }}
                  >
                    {product}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Create Request Section */}
            <Box
              sx={{
                borderTop: '1px solid #F0F0F0',
                padding: '16px',
                textAlign: 'center',
                backgroundColor: '#FAFAFA',
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#666',
                  mb: 1.5,
                  fontFamily:
                    'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                }}
              >
                ¿No encuentras lo que quieres?
              </Typography>
              <Button
                onClick={handleCreateRequest}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: '#740056',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#8B1658',
                  },
                }}
              >
                Crear solicitud
              </Button>
            </Box>
          </Box>
        )}

        {/* Categories Section */}
        <Box
          sx={{
            display: 'flex',
            marginTop: '12px',
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
            alignItems: 'stretch',
            gap: '8px',
          }}
        >
          {/* Category 1 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '39px',
                cursor: 'pointer',
              }}
              onClick={() => handleCategoryClick('categoria1')}
            >
              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/fc4bfdea31ffd6f925e70387b5594c86e308bd9e?placeholderIfAbsent=true"
                alt="Categoría 1"
                sx={{
                  width: '38px',
                  height: '39px',
                  borderRadius: '28px',
                  backgroundColor: '#E5E5E5',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
            <Typography
              sx={{
                color: 'rgba(34, 34, 34, 1)',
                fontSize: '11px',
                fontFamily:
                  'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              Categoría
            </Typography>
          </Box>

          {/* Category 2 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '39px',
                cursor: 'pointer',
              }}
              onClick={() => handleCategoryClick('categoria2')}
            >
              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/fc4bfdea31ffd6f925e70387b5594c86e308bd9e?placeholderIfAbsent=true"
                alt="Categoría 2"
                sx={{
                  width: '38px',
                  height: '39px',
                  borderRadius: '28px',
                  backgroundColor: '#E5E5E5',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
            <Typography
              sx={{
                color: 'rgba(34, 34, 34, 1)',
                fontSize: '11px',
                fontFamily:
                  'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              Categoría
            </Typography>
          </Box>

          {/* Category 3 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '39px',
                cursor: 'pointer',
              }}
              onClick={() => handleCategoryClick('categoria3')}
            >
              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/fc4bfdea31ffd6f925e70387b5594c86e308bd9e?placeholderIfAbsent=true"
                alt="Categoría 3"
                sx={{
                  width: '38px',
                  height: '39px',
                  borderRadius: '28px',
                  backgroundColor: '#E5E5E5',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
            <Typography
              sx={{
                color: 'rgba(34, 34, 34, 1)',
                fontSize: '11px',
                fontFamily:
                  'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              Categoría
            </Typography>
          </Box>

          {/* Category 4 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '39px',
                cursor: 'pointer',
              }}
              onClick={() => handleCategoryClick('categoria4')}
            >
              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/fc4bfdea31ffd6f925e70387b5594c86e308bd9e?placeholderIfAbsent=true"
                alt="Categoría 4"
                sx={{
                  width: '38px',
                  height: '39px',
                  borderRadius: '28px',
                  backgroundColor: '#E5E5E5',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
            <Typography
              sx={{
                color: 'rgba(34, 34, 34, 1)',
                fontSize: '11px',
                fontFamily:
                  'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              Categoría
            </Typography>
          </Box>

          {/* View All Button */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '39px',
                cursor: 'pointer',
                border: '0.759px solid #79747E',
                borderRadius: '50%',
                backgroundColor: 'transparent',
              }}
              onClick={() => console.log('Ver todo clicked')}
            >
              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/1711994ab6d8b280218d3bbc8dbe14968cec8948?placeholderIfAbsent=true"
                alt="Ver todo"
                sx={{
                  width: '18px',
                  height: '18px',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '+';
                    parent.style.fontSize = '18px';
                    parent.style.fontWeight = 'bold';
                    parent.style.color = '#79747E';
                  }
                }}
              />
            </Box>
            <Typography
              sx={{
                color: 'rgba(34, 34, 34, 1)',
                fontSize: '11px',
                fontFamily:
                  'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              Ver todo
            </Typography>
          </Box>
        </Box>
        {/* Recomendados Section Header */}
        <Box
          sx={{
            alignSelf: 'start',
            display: 'flex',
            marginTop: '11px',
            marginLeft: '13px',
            alignItems: 'stretch',
            gap: '40px 100px',
          }}
        >
          <Typography
            sx={{
              color: 'rgba(43, 42, 42, 1)',
              fontSize: '16px',
              fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
              fontWeight: 600,
              lineHeight: '36px',
            }}
          >
            Recomendados
          </Typography>
          <Box
            sx={{
              alignSelf: 'start',
              display: 'flex',
              minHeight: '36px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <IconButton
              size="small"
              onClick={() => setShowFilters(true)}
              sx={{
                borderRadius: '76px',
                padding: '6px',
                backgroundColor:
                  activeFiltersCount > 0 ? '#740056' : 'transparent',
                color: activeFiltersCount > 0 ? 'white' : '#740056',
                '&:hover': {
                  backgroundColor:
                    activeFiltersCount > 0
                      ? '#8B1658'
                      : 'rgba(116, 0, 86, 0.1)',
                },
              }}
            >
              <TuneIcon sx={{ fontSize: '18px' }} />
            </IconButton>

            {/* Active filters count badge */}
            {activeFiltersCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  minWidth: 16,
                }}
              >
                {activeFiltersCount}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Recommended Products Section */}
      <Box
        sx={{
          display: 'flex',
          marginTop: '8px',
          width: '100%',
          paddingLeft: '16px',
          paddingRight: '16px',
          gap: '8px',
        }}
      >
        {/* Product Card 1 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleProductClick('1')}
        >
          {/* Product Image */}
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Gray Triangle */}
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '20px solid #A0A0A0',
              }}
            />

            {/* Price Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                7
              </Typography>
            </Box>

            {/* Bookmark */}
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            >
              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/1878308fcbf04f29b5059022aa7f4447/bookmark-icon.svg"
                alt="bookmark"
                sx={{ width: '100%', height: '100%' }}
                onError={(e) => {
                  e.currentTarget.innerHTML = '♡';
                  e.currentTarget.style.fontSize = '16px';
                  e.currentTarget.style.textAlign = 'center';
                  e.currentTarget.style.lineHeight = '20px';
                }}
              />
            </Box>

            {/* Rating */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#000' }}>
                ★
              </Typography>
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}
              >
                4.5
              </Typography>
            </Box>

            {/* Position Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                backgroundColor: 'rgba(108, 108, 108, 0.9)',
                color: '#FFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              1st
            </Box>
          </Box>

          {/* Product Info */}
          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              Nombre del producto
            </Typography>
            <Typography
              sx={{
                fontSize: '10px',
                color: '#888',
                mb: 0.5,
              }}
            >
              Cali, Valle del Cauca
            </Typography>

            {/* Seller Info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#DDD',
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#000',
                    lineHeight: 1,
                  }}
                >
                  Proveedor
                </Typography>
                <Typography
                  sx={{ fontSize: '9px', color: '#666', lineHeight: 1 }}
                >
                  @Nickname
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
              }}
            >
              Nombre del emprendimiento
            </Typography>

            {/* Bottom Stats */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  44
                </Typography>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  33
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px dashed #888',
                  borderRadius: '2px',
                  padding: '1px 4px',
                }}
              >
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  Producto
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Product Card 2 - Similar structure */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleProductClick('2')}
        >
          {/* Product Image */}
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Gray Triangle */}
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '20px solid #A0A0A0',
              }}
            />

            {/* Price Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                7
              </Typography>
            </Box>

            {/* Rating */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#000' }}>
                ★
              </Typography>
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}
              >
                4.5
              </Typography>
            </Box>

            {/* Position Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                backgroundColor: 'rgba(108, 108, 108, 0.9)',
                color: '#FFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              1st
            </Box>
          </Box>

          {/* Product Info */}
          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              Nombre del producto
            </Typography>
            <Typography
              sx={{
                fontSize: '10px',
                color: '#888',
                mb: 0.5,
              }}
            >
              Cali, Valle del Cauca
            </Typography>

            {/* Seller Info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#DDD',
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#000',
                    lineHeight: 1,
                  }}
                >
                  Proveedor
                </Typography>
                <Typography
                  sx={{ fontSize: '9px', color: '#666', lineHeight: 1 }}
                >
                  @Nickname
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
              }}
            >
              Nombre del emprendimiento
            </Typography>

            {/* Bottom Stats */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  44
                </Typography>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  33
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px dashed #888',
                  borderRadius: '2px',
                  padding: '1px 4px',
                }}
              >
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  Producto
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Categories Section */}
      <Typography
        sx={{
          color: 'rgba(43, 42, 42, 1)',
          fontSize: '16px',
          fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
          fontWeight: 600,
          lineHeight: '36px',
          alignSelf: 'start',
          marginTop: '16px',
          marginLeft: '20px',
        }}
      >
        Categorías
      </Typography>

      {/* Categories Section */}
      <Box
        sx={{
          display: 'flex',
          marginTop: '8px',
          width: '100%',
          paddingLeft: '16px',
          paddingRight: '16px',
          gap: '8px',
          marginBottom: '80px', // Space for bottom navigation
        }}
      >
        {/* Category Card 1 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleCategoryClick('cat1')}
        >
          {/* Category Image */}
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Price Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                7
              </Typography>
            </Box>

            {/* Bookmark */}
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '16px', color: '#000' }}>
                ♡
              </Typography>
            </Box>
          </Box>

          {/* Category Info */}
          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Categoría
            </Typography>
          </Box>
        </Box>

        {/* Category Card 2 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleCategoryClick('cat2')}
        >
          {/* Category Image */}
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Price Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                7
              </Typography>
            </Box>

            {/* Bookmark */}
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '16px', color: '#000' }}>
                ♡
              </Typography>
            </Box>
          </Box>

          {/* Category Info */}
          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Categoría
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Additional Categories Grid */}
      <Box
        sx={{
          display: 'flex',
          marginTop: '16px',
          width: '100%',
          paddingLeft: '16px',
          paddingRight: '16px',
          gap: '8px',
        }}
      >
        {/* Category Card 3 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleCategoryClick('cat3')}
        >
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                7
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '16px', color: '#000' }}>
                ♡
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Categoría
            </Typography>
          </Box>
        </Box>

        {/* Category Card 4 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleCategoryClick('cat4')}
        >
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                7
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '16px', color: '#000' }}>
                ♡
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Categoría
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* New Featured Section */}
      <Typography
        sx={{
          color: 'rgba(43, 42, 42, 1)',
          fontSize: '16px',
          fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
          fontWeight: 600,
          lineHeight: '36px',
          alignSelf: 'start',
          marginTop: '24px',
          marginLeft: '20px',
        }}
      >
        Destacados
      </Typography>

      {/* Featured Products Section */}
      <Box
        sx={{
          display: 'flex',
          marginTop: '8px',
          width: '100%',
          paddingLeft: '16px',
          paddingRight: '16px',
          gap: '8px',
        }}
      >
        {/* Featured Product 1 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleProductClick('featured1')}
        >
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '20px solid #A0A0A0',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                12
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#000' }}>
                ★
              </Typography>
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}
              >
                4.8
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                backgroundColor: 'rgba(108, 108, 108, 0.9)',
                color: '#FFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              1st
            </Box>
          </Box>

          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              Servicio Premium
            </Typography>
            <Typography
              sx={{
                fontSize: '10px',
                color: '#888',
                mb: 0.5,
              }}
            >
              Medellín, Antioquia
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#DDD',
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#000',
                    lineHeight: 1,
                  }}
                >
                  Experto
                </Typography>
                <Typography
                  sx={{ fontSize: '9px', color: '#666', lineHeight: 1 }}
                >
                  @expert
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
              }}
            >
              Empresa Innovadora
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  89
                </Typography>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  67
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px dashed #888',
                  borderRadius: '2px',
                  padding: '1px 4px',
                }}
              >
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  Servicio
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Featured Product 2 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleProductClick('featured2')}
        >
          <Box
            sx={{
              position: 'relative',
              height: '80px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '20px solid #A0A0A0',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#740056' }}
              >
                ü
              </Typography>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}
              >
                15
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#000' }}>
                ★
              </Typography>
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}
              >
                4.9
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                backgroundColor: 'rgba(108, 108, 108, 0.9)',
                color: '#FFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              2nd
            </Box>
          </Box>

          <Box
            sx={{
              padding: '6px 8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              Producto Artesanal
            </Typography>
            <Typography
              sx={{
                fontSize: '10px',
                color: '#888',
                mb: 0.5,
              }}
            >
              Bogotá, Cundinamarca
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#DDD',
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#000',
                    lineHeight: 1,
                  }}
                >
                  Artesano
                </Typography>
                <Typography
                  sx={{ fontSize: '9px', color: '#666', lineHeight: 1 }}
                >
                  @craft
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
              }}
            >
              Taller Creativo
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  72
                </Typography>
                <Typography sx={{ fontSize: '9px', color: '#888' }}>
                  54
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px dashed #888',
                  borderRadius: '2px',
                  padding: '1px 4px',
                }}
              >
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  Producto
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Trending Section */}
      <Typography
        sx={{
          color: 'rgba(43, 42, 42, 1)',
          fontSize: '16px',
          fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
          fontWeight: 600,
          lineHeight: '36px',
          alignSelf: 'start',
          marginTop: '24px',
          marginLeft: '20px',
        }}
      >
        Tendencias
      </Typography>

      {/* Trending Items */}
      <Box
        sx={{
          display: 'flex',
          marginTop: '8px',
          width: '100%',
          paddingLeft: '16px',
          paddingRight: '16px',
          gap: '8px',
        }}
      >
        {/* Trending Item 1 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleProductClick('trending1')}
        >
          <Box
            sx={{
              position: 'relative',
              height: '70px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: '16px solid #A0A0A0',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                backgroundColor: 'rgba(255, 215, 0, 0.95)',
                borderRadius: '6px',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}
              >
                🔥 HOT
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '6px',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#740056' }}
              >
                ü 8
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              padding: '4px 6px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              Curso Online
            </Typography>
            <Typography
              sx={{
                fontSize: '9px',
                color: '#888',
                mb: 0.5,
              }}
            >
              Bucaramanga, Santander
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  156
                </Typography>
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  92
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px dashed #888',
                  borderRadius: '2px',
                  padding: '1px 3px',
                }}
              >
                <Typography sx={{ fontSize: '7px', color: '#888' }}>
                  Curso
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Trending Item 2 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleProductClick('trending2')}
        >
          <Box
            sx={{
              position: 'relative',
              height: '70px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: '16px solid #A0A0A0',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                backgroundColor: 'rgba(76, 175, 80, 0.95)',
                borderRadius: '6px',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#FFF' }}
              >
                ⭐ NEW
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '6px',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#740056' }}
              >
                ü 5
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              padding: '4px 6px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              Consultoría Digital
            </Typography>
            <Typography
              sx={{
                fontSize: '9px',
                color: '#888',
                mb: 0.5,
              }}
            >
              Pereira, Risaralda
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  23
                </Typography>
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  18
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px dashed #888',
                  borderRadius: '2px',
                  padding: '1px 3px',
                }}
              >
                <Typography sx={{ fontSize: '7px', color: '#888' }}>
                  Servicio
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Trending Item 3 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E8E8',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => handleProductClick('trending3')}
        >
          <Box
            sx={{
              position: 'relative',
              height: '70px',
              backgroundColor: '#D0D0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: '16px solid #A0A0A0',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '6px',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Typography
                sx={{ fontSize: '10px', fontWeight: 'bold', color: '#740056' }}
              >
                ü 10
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              padding: '4px 6px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000',
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              Evento Especial
            </Typography>
            <Typography
              sx={{
                fontSize: '9px',
                color: '#888',
                mb: 0.5,
              }}
            >
              Cartagena, Bolívar
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  95
                </Typography>
                <Typography sx={{ fontSize: '8px', color: '#888' }}>
                  76
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px dashed #888',
                  borderRadius: '2px',
                  padding: '1px 3px',
                }}
              >
                <Typography sx={{ fontSize: '7px', color: '#888' }}>
                  Evento
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom spacing for navigation */}
      <Box sx={{ height: '100px' }} />

      {/* Advanced Filters Drawer */}
      <Drawer
        anchor="bottom"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            maxHeight: '85vh',
            backgroundColor: '#FEF7FF',
          },
        }}
      >
        <Box sx={{ p: 3, pb: 4 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#740056' }}>
              Filtros avanzados
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{
                    color: '#740056',
                    borderColor: '#740056',
                    '&:hover': {
                      backgroundColor: 'rgba(116, 0, 86, 0.1)',
                    },
                  }}
                >
                  Limpiar
                </Button>
              )}
              <IconButton onClick={() => setShowFilters(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Search Query */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Buscar"
              placeholder="¿Qué quieres encontrar?"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: '#740056', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: '#740056' },
                  '&:hover fieldset': { borderColor: '#740056' },
                  '&.Mui-focused fieldset': { borderColor: '#740056' },
                },
                '& .MuiInputLabel-root': { color: '#740056' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#740056' },
              }}
            />
          </Box>

          {/* Category Filter */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#740056' }}>Categoría</InputLabel>
              <Select
                value={filters.category}
                label="Categoría"
                onChange={(e) => handleFilterChange('category', e.target.value)}
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#740056',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#740056',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#740056',
                  },
                }}
                startAdornment={
                  <CategoryIcon sx={{ color: '#740056', mr: 1 }} />
                }
              >
                <MenuItem value="">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>🏪</Typography>
                    <Typography>Todas las categorías</Typography>
                  </Box>
                </MenuItem>
                {filterCategories.slice(1).map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{category.icon}</Typography>
                      <Typography>{category.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Location Filter */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Ubicación"
              placeholder="Ciudad, región..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: (
                  <LocationIcon sx={{ color: '#740056', mr: 1 }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: '#740056' },
                  '&:hover fieldset': { borderColor: '#740056' },
                  '&.Mui-focused fieldset': { borderColor: '#740056' },
                },
                '& .MuiInputLabel-root': { color: '#740056' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#740056' },
              }}
            />
          </Box>

          {/* Price Range */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: '#740056',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <PriceIcon fontSize="small" />
              Rango de precio: ü{filters.priceRange[0]} - ü
              {filters.priceRange[1]}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, value) => handleFilterChange('priceRange', value)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={5}
              sx={{
                color: '#740056',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#740056',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#740056',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(116, 0, 86, 0.3)',
                },
              }}
              marks={[
                { value: 0, label: 'ü0' },
                { value: 25, label: 'ü25' },
                { value: 50, label: 'ü50' },
                { value: 75, label: 'ü75' },
                { value: 100, label: 'ü100+' },
              ]}
            />
          </Box>

          {/* Rating Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: '#740056',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <StarIcon fontSize="small" />
              Calificación mínima
            </Typography>
            <Rating
              value={filters.rating}
              onChange={(_, value) => handleFilterChange('rating', value || 0)}
              precision={0.5}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#740056',
                },
                '& .MuiRating-iconHover': {
                  color: '#740056',
                },
              }}
            />
          </Box>

          {/* Verified Only Switch */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.verified}
                  onChange={(e) =>
                    handleFilterChange('verified', e.target.checked)
                  }
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#740056',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#740056',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VerifiedIcon sx={{ color: '#740056', fontSize: '18px' }} />
                  <Typography sx={{ fontWeight: 600, color: '#740056' }}>
                    Solo emprendedores verificados
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Sort By */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#740056' }}>Ordenar por</InputLabel>
              <Select
                value={filters.sortBy}
                label="Ordenar por"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#740056',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#740056',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#740056',
                  },
                }}
              >
                <MenuItem value="relevance">Relevancia</MenuItem>
                <MenuItem value="newest">Más recientes</MenuItem>
                <MenuItem value="price_asc">Precio: menor a mayor</MenuItem>
                <MenuItem value="price_desc">Precio: mayor a menor</MenuItem>
                <MenuItem value="rating">Mejor valorados</MenuItem>
                <MenuItem value="ayni_score">Puntuación Ayni</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Popular Tags */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ mb: 2, fontWeight: 600, color: '#740056' }}
            >
              Etiquetas populares:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {popularTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant={filters.tags.includes(tag) ? 'filled' : 'outlined'}
                  color={filters.tags.includes(tag) ? 'primary' : 'default'}
                  size="small"
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag];
                    handleFilterChange('tags', newTags);
                  }}
                  sx={{
                    borderColor: '#740056',
                    color: filters.tags.includes(tag) ? 'white' : '#740056',
                    backgroundColor: filters.tags.includes(tag)
                      ? '#740056'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: filters.tags.includes(tag)
                        ? '#8B1658'
                        : 'rgba(116, 0, 86, 0.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: '#740056' }}
              >
                Filtros activos ({activeFiltersCount}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.query && (
                  <Chip
                    label={`"${filters.query}"`}
                    onDelete={() => handleFilterChange('query', '')}
                    size="small"
                    sx={{ backgroundColor: '#740056', color: 'white' }}
                  />
                )}
                {filters.category && (
                  <Chip
                    label={
                      filterCategories.find((c) => c.value === filters.category)
                        ?.label || filters.category
                    }
                    onDelete={() => handleFilterChange('category', '')}
                    size="small"
                    sx={{ backgroundColor: '#740056', color: 'white' }}
                  />
                )}
                {filters.location && (
                  <Chip
                    label={`📍 ${filters.location}`}
                    onDelete={() => handleFilterChange('location', '')}
                    size="small"
                    sx={{ backgroundColor: '#740056', color: 'white' }}
                  />
                )}
                {filters.rating > 0 && (
                  <Chip
                    label={`⭐ ${filters.rating}+ estrellas`}
                    onDelete={() => handleFilterChange('rating', 0)}
                    size="small"
                    sx={{ backgroundColor: '#740056', color: 'white' }}
                  />
                )}
                {filters.verified && (
                  <Chip
                    label="✅ Verificados"
                    onDelete={() => handleFilterChange('verified', false)}
                    size="small"
                    sx={{ backgroundColor: '#740056', color: 'white' }}
                  />
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100) && (
                  <Chip
                    label={`💰 ü${filters.priceRange[0]} - ü${filters.priceRange[1]}`}
                    onDelete={() => handleFilterChange('priceRange', [0, 100])}
                    size="small"
                    sx={{ backgroundColor: '#740056', color: 'white' }}
                  />
                )}
                {filters.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() =>
                      handleFilterChange(
                        'tags',
                        filters.tags.filter((t) => t !== tag)
                      )
                    }
                    size="small"
                    sx={{ backgroundColor: '#740056', color: 'white' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Apply Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={() => setShowFilters(false)}
            sx={{
              backgroundColor: '#740056',
              color: 'white',
              borderRadius: '12px',
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#8B1658',
              },
            }}
          >
            Aplicar filtros{' '}
            {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MobileMarketplaceView;
