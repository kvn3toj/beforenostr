import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  Popover,
  Tooltip,
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
  StarBorder as StarIcon,
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
  FavoriteBorder,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';
import { useAuth } from '../../../../contexts/AuthContext';
import ProductCard from './ProductCard';
import { MobileHeader } from './MobileHeader';
import { MobileSearchBar } from './MobileSearchBar';
import { CategoryCarousel } from './CategoryCarousel';
import { RoleToggle } from './RoleToggle';
import { useMarketplaceData } from '../../../../hooks/useRealBackendData';
import '../../../../styles/marketplace-enhanced.css';
import consciousDesignSystem from '../../../../theme/consciousDesignSystem';
import { AxiosResponse } from 'axios';
import type { Product, Seller } from '../../../../types/marketplace';
import { CreateItemModal } from './CreateItemModal';

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

  // 🔗 Hook para datos reales del marketplace
  const {
    data: marketplaceItemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchMarketplaceData,
  } = useMarketplaceData();

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

  // Estado local para favoritos (Set de IDs)
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Estado para popover LETS/Wallet
  const [walletAnchorEl, setWalletAnchorEl] = useState<null | HTMLElement>(null);
  const [letsAnchorEl, setLetsAnchorEl] = useState<null | HTMLElement>(null);

  // Simulación de datos de wallet (reemplazar por hook real si está disponible)
  const walletBalance = 120.5; // TODO: usar hook real
  const walletCredit = 200;
  const letsBalance = 80.0; // TODO: usar hook real

  const handleWalletClick = (event: React.MouseEvent<HTMLElement>) => {
    setWalletAnchorEl(event.currentTarget);
  };
  const handleLetsClick = (event: React.MouseEvent<HTMLElement>) => {
    setLetsAnchorEl(event.currentTarget);
  };
  const handleWalletClose = () => setWalletAnchorEl(null);
  const handleLetsClose = () => setLetsAnchorEl(null);

  // 🌍 Categorías enfocadas en el bien común (SINCRONIZADAS CON DESKTOP)
  const impactCategories: Category[] = [
    {
      id: 'sostenibilidad',
      name: 'Sostenibilidad',
      icon: '🌱',
      color: '#4CAF50',
      count: 32,
    },
    {
      id: 'educacion',
      name: 'Educación',
      icon: '📚',
      color: '#2196F3',
      count: 28,
    },
    {
      id: 'salud',
      name: 'Salud & Bienestar',
      icon: '🏥',
      color: '#FF5722',
      count: 24,
    },
    {
      id: 'comunidad',
      name: 'Desarrollo Comunitario',
      icon: '🤝',
      color: '#9C27B0',
      count: 19,
    },
    {
      id: 'tecnologia-social',
      name: 'Tecnología Social',
      icon: '💻',
      color: '#607D8B',
      count: 22,
    },
    {
      id: 'agricultura',
      name: 'Agricultura Consciente',
      icon: '🌾',
      color: '#8BC34A',
      count: 15,
    },
    {
      id: 'economia-circular',
      name: 'Economía Circular',
      icon: '♻️',
      color: '#00BCD4',
      count: 18,
    },
    {
      id: 'inclusion',
      name: 'Inclusión Social',
      icon: '🌈',
      color: '#E91E63',
      count: 14,
    },
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

  // 🎨 ARIA + 🔥 PHOENIX: Sistema de Favoritos Consciente
  const useFavoriteToggle = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ itemId, action }: { itemId: string; action: 'add' | 'remove' }) => {
        // 🎯 ATLAS: Llamada real al backend para toggle de favorito
        const response: AxiosResponse<any> = await apiService.post(`/marketplace/items/${itemId}/favorite`, {
          action
        });
        return response.data;
      },
      onSuccess: (data: any, variables: { itemId: string; action: 'add' | 'remove' }) => {
        // 🔍 NIRA: Invalidar queries relacionadas para actualizar estado
        queryClient.invalidateQueries({ queryKey: ['marketplace', 'data'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'favorites'] });

        // 🌸 ZENO: Feedback visual consciente
        console.log(`✨ ${variables.action === 'add' ? 'Agregado a' : 'Removido de'} favoritos con amor`);
      },
      onError: (error: any) => {
        // 🔮 PAX: Manejo consciente de errores
        console.error('Error al actualizar favorito:', error);
      }
    });
  };

  // 🔄 Función para mapear datos del backend/mock a la estructura de la UI (SINCRONIZADA CON DESKTOP)
  const mapItemToUIItem = useCallback((item: any): MarketplaceItem => {
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
          responseTime: item.seller?.responseTime || '< 1 hora',
          isOnline: item.seller?.isOnline || true,
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
        deliveryTime: item.deliveryTime || '3-7 días',
        hasVideo: item.hasVideo || false,
        is24Hours: item.is24Hours || false,
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
        responseTime: '< 1 hora',
        isOnline: true,
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
      deliveryTime: '3-7 días',
      hasVideo: Math.random() > 0.7,
      is24Hours: Math.random() > 0.8,
    };
  }, []);

  // 🎯 Mapear datos del backend/mock a la estructura de la UI (SINCRONIZADO CON DESKTOP)
  const impactProducts = useMemo(() => {
    if (!marketplaceItemsResponse?.items) {
      return [];
    }
    return marketplaceItemsResponse.items.map(mapItemToUIItem);
  }, [marketplaceItemsResponse, mapItemToUIItem]);

  const { data: userFavorites = [] } = useQuery<string[]>({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      const res: AxiosResponse<string[]> = await apiService.get('/marketplace/favorites');
      return res.data;
    },
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

  // Reemplazar por:
  const { mutate: toggleFavorite } = useFavoriteToggle();

  const handleToggleFavorite = useCallback((itemId: string) => {
    if (!user) return;

    // 🔍 NIRA: Determinar estado actual de favorito
    const currentlyFavorited = userFavorites.includes(itemId);

    toggleFavorite({
      itemId,
      action: currentlyFavorited ? 'remove' : 'add'
    });

    // 🌸 ZENO: Actualizar estado local inmediatamente para UX fluida
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (currentlyFavorited) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });

    setShowFeedback(true);
    setFeedbackMessage(currentlyFavorited ? 'Removido de favoritos' : '¡Agregado a favoritos!');
  }, [user, toggleFavorite, userFavorites]);

  // Items a mostrar - SINCRONIZADO CON DESKTOP
  const itemsToDisplay = useMemo(() => {
    let items: MarketplaceItem[] = isSearchActive ? searchResults : impactProducts;

    // Filtrar por categoría seleccionada
    if (selectedCategory && selectedCategory !== '') {
      items = items.filter((item: MarketplaceItem) => item.category === selectedCategory);
    }

    // Aplicar ordenamiento
    switch (filters.sortBy) {
      case 'price_asc':
        items = [...items].sort((a: MarketplaceItem, b: MarketplaceItem) => a.price - b.price);
        break;
      case 'price_desc':
        items = [...items].sort((a: MarketplaceItem, b: MarketplaceItem) => b.price - a.price);
        break;
      case 'rating':
        items = [...items].sort((a: MarketplaceItem, b: MarketplaceItem) => b.rating - a.rating);
        break;
      case 'newest':
        items = [...items].sort(
          (a: MarketplaceItem, b: MarketplaceItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'trending':
        items = [...items].sort((a: MarketplaceItem, b: MarketplaceItem) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return b.viewCount - a.viewCount;
        });
        break;
      case 'popular':
        items = [...items].sort((a: MarketplaceItem, b: MarketplaceItem) => b.viewCount - a.viewCount);
        break;
      case 'nearby':
        items = [...items].sort((a: MarketplaceItem, b: MarketplaceItem) => {
          // Priorizar items locales
          if (a.location.includes('Online') && !b.location.includes('Online'))
            return 1;
          if (!a.location.includes('Online') && b.location.includes('Online'))
            return -1;
          return 0;
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
    filters.sortBy,
  ]);

  const handleProductClick = useCallback(
    (productId: string) => {
      const product = itemsToDisplay.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setShowProductDetail(true);
      }
    },
    [itemsToDisplay]
  );

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

  // Estadísticas del marketplace sincronizadas con desktop
  const marketplaceStats = {
    totalProducts: impactProducts.length,
    activeProviders: 8,
    totalImpact: '2.4K',
    communitiesServed: 47,
  };

  // 🚨 Manejo de errores mejorado
  if (itemsError) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
        }}
      >
        <MobileHeader
          onMenuClick={onMenuClick}
          onChatClick={onChatClick}
          onNotificationsClick={onNotificationsClick}
        />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 300 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error al cargar marketplace
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No se pudo conectar con el servidor. Verifica tu conexión e
              inténtalo de nuevo.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ['marketplace-items'],
                });
                refetchMarketplaceData();
              }}
              fullWidth
              sx={{ mb: 2 }}
            >
              Reintentar
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              fullWidth
            >
              Recargar App
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // Estados adicionales para el modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Handlers para el modal de creación
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setFeedbackMessage('¡Producto/servicio creado exitosamente!');
    setShowFeedback(true);
    // TODO: Refrescar la lista de productos/servicios
  };

  return (
    <Box
      data-testid="mobile-marketplace"
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        position: 'relative',
      }}
    >
      {/* Header redesigned with conscious design system */}
      <Slide direction="down" in={showTopBar} mountOnEnter unmountOnExit>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: consciousDesignSystem.colors.grey[50],
            borderBottom: `1px solid ${consciousDesignSystem.colors.grey[200]}`,
            zIndex: 1100,
            boxShadow: consciousDesignSystem.components.card.shadow.soft,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            height: '72px', // Increased from 68px for better touch targets
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Toolbar
            sx={{
              width: '100%',
              px: consciousDesignSystem.spacing[5],
              py: consciousDesignSystem.spacing[3],
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 'unset !important',
            }}
          >
            {/* Left section - Menu button */}
            <IconButton
              onClick={onMenuClick}
              aria-label="Abrir menú principal"
              sx={{
                color: consciousDesignSystem.colors.primary.main,
                width: consciousDesignSystem.components.touchTarget.minimum,
                height: consciousDesignSystem.components.touchTarget.minimum,
                borderRadius: consciousDesignSystem.components.button.borderRadius,
                transition: consciousDesignSystem.transitions.normal,
                '&:hover': {
                  backgroundColor: `${consciousDesignSystem.colors.primary.main}10`,
                  transform: consciousDesignSystem.accessibility.hover.transform,
                },
                '&:focus': {
                  outline: `2px solid ${consciousDesignSystem.colors.primary.main}`,
                  outlineOffset: '2px',
                },
              }}
            >
              <Menu fontSize="medium" />
            </IconButton>

            {/* Center section - Logo and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: consciousDesignSystem.typography.fontFamily.consciousness,
                  fontSize: consciousDesignSystem.typography.fontSize.xl,
                  fontWeight: consciousDesignSystem.typography.fontWeight.bold,
                  color: consciousDesignSystem.colors.primary.main,
                  background: `linear-gradient(135deg, ${consciousDesignSystem.colors.primary.main} 0%, ${consciousDesignSystem.colors.accent.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textAlign: 'center',
                  letterSpacing: '0.5px',
                }}
              >
                🌱 Marketplace CoomÜnity
              </Typography>
            </Box>

            {/* Right section - Notifications and Chat */}
            <Box sx={{ display: 'flex', gap: consciousDesignSystem.spacing[2] }}>
              <Tooltip title="Abrir chat de soporte" placement="bottom">
                <IconButton
                  onClick={onChatClick}
                  aria-label="Abrir chat de soporte"
                  sx={{
                    color: consciousDesignSystem.colors.secondary.main,
                    width: consciousDesignSystem.components.touchTarget.minimum,
                    height: consciousDesignSystem.components.touchTarget.minimum,
                    borderRadius: consciousDesignSystem.components.button.borderRadius,
                    transition: consciousDesignSystem.transitions.normal,
                    '&:hover': {
                      backgroundColor: `${consciousDesignSystem.colors.secondary.main}10`,
                      transform: consciousDesignSystem.accessibility.hover.transform,
                    },
                    '&:focus': {
                      outline: `2px solid ${consciousDesignSystem.colors.secondary.main}`,
                      outlineOffset: '2px',
                    },
                  }}
                >
                  <Chat fontSize="medium" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Ver notificaciones" placement="bottom">
                <IconButton
                  onClick={onNotificationsClick}
                  aria-label="Ver notificaciones"
                  sx={{
                    color: consciousDesignSystem.colors.accent.main,
                    width: consciousDesignSystem.components.touchTarget.minimum,
                    height: consciousDesignSystem.components.touchTarget.minimum,
                    borderRadius: consciousDesignSystem.components.button.borderRadius,
                    transition: consciousDesignSystem.transitions.normal,
                    '&:hover': {
                      backgroundColor: `${consciousDesignSystem.colors.accent.main}10`,
                      transform: consciousDesignSystem.accessibility.hover.transform,
                    },
                    '&:focus': {
                      outline: `2px solid ${consciousDesignSystem.colors.accent.main}`,
                      outlineOffset: '2px',
                    },
                  }}
                >
                  <Notifications fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
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

        {/* Hero Section Rediseñada */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Zoom in timeout={300}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, var(--primary-green, #10b981) 0%, #059669 100%)',
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      Conectando Propósitos
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      Encuentra productos y servicios que regeneran nuestro mundo.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: 'white',
                        color: 'var(--primary-green, #10b981)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Descubre Sostenibilidad
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Fade in timeout={1000}>
                      <AutoAwesome
                        sx={{
                          fontSize: 80,
                          color: 'white',
                          opacity: 0.2,
                          transform: 'rotate(-15deg)',
                        }}
                      />
                    </Fade>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Zoom>
        </Box>

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
                onFilterClick={() => setShowFilters(true)}
                placeholder="🔍 Descubre productos y servicios CoomÜnity"
                showVoiceSearch={true}
              />
            </Box>
          </Fade>
        </Box>

        {/* Quick Filters */}
        <Box sx={{ px: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {quickFilters.map((filter: { id: string; label: string; icon: string }, index: number) => (
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
                categories={impactCategories}
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
            mb: 1.5,
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.5,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: selectedCategory ? 'primary.main' : '#059669', mb: 0.5 }}>
            {selectedCategory
              ? `${impactCategories.find((c) => c.id === selectedCategory)?.name} (${itemsToDisplay.length})`
              : `Recomendados (${itemsToDisplay.length})`}
          </Typography>
          <Typography variant="body2" sx={{ color: '#059669', opacity: 0.95, mb: 1 }}>
            {selectedCategory
              ? 'Mostrando resultados filtrados por categoría.'
              : 'Productos y servicios destacados para ti en CoomÜnity.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Box>
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
            {selectedCategory && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedCategory('');
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                sx={{ ml: 1, borderColor: '#059669', color: '#059669', fontWeight: 500 }}
              >
                Ver todos
              </Button>
            )}
          </Box>
        </Box>

        {/* Mensaje de confirmación de datos del marketplace */}
        {impactProducts.length > 0 && (
          <Box sx={{ px: 2, mb: 2 }}>
            <Alert
              severity="success"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                },
              }}
            >
              ✅ Mostrando {impactProducts.length} productos y servicios
              diversos de CoomÜnity
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
          </Box>
        )}

        {/* Products Grid/List */}
        <Box sx={{ px: 2 }}>
          {isLoadingItems ? (
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
            <Grid
              container
              spacing={{ xs: 2, sm: 2.5 }}
              sx={{
                '& .MuiGrid-item': {
                  minHeight:
                    viewMode === 'grid' ? { xs: 280, sm: 300 } : 'auto',
                },
              }}
            >
              {itemsToDisplay.map((item: MarketplaceItem, index: number) => (
                <Grid item xs={6} sm={6} key={item.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <Zoom in timeout={300 + index * 50}>
                    <Box sx={{ height: '100%' }}>
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

        {/* Call to Action para el bien común (mobile) */}
        <Box sx={{ px: 2, py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              🌱 ¿Tienes un servicio de impacto?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Únete a nuestra comunidad de agentes de cambio
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => console.log('Crear servicio')}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
                },
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Publicar Servicio
            </Button>
          </Paper>
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
          display: { xs: 'block', md: 'none' }, // Solo mobile
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
            label="LETS"
            icon={<span role="img" aria-label="Saldo LETS" style={{fontSize: 22}}>💰</span>}
            onClick={handleLetsClick}
            aria-label="Ver saldo LETS"
            sx={{ minWidth: 48, minHeight: 48 }}
          />
          <BottomNavigationAction
            label="Wallet"
            icon={<AccountBalanceWallet />}
            onClick={handleWalletClick}
            aria-label="Ver saldo Wallet"
            sx={{ minWidth: 48, minHeight: 48 }}
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
            icon={<Avatar sx={{ width: 24, height: 24 }} src={user && 'avatar' in user ? (user as any).avatar ?? '' : ''} />}
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
          onClick={() => {
            setShowQuickActions(false);
            handleOpenCreateModal();
          }}
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
          categories={impactCategories}
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

      {/* Popover LETS */}
      <Popover
        open={Boolean(letsAnchorEl)}
        anchorEl={letsAnchorEl}
        onClose={handleLetsClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{ sx: { p: 2, minWidth: 220, borderRadius: 3 } }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <span role="img" aria-label="Saldo LETS" style={{fontSize: 28}}>💰</span>
          <Typography variant="h6" fontWeight={700}>Saldo LETS</Typography>
        </Box>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>{letsBalance.toFixed(2)} Ünits</Typography>
        <Typography variant="body2" color="text.secondary">Límite de crédito: {walletCredit} Ünits</Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2, width: '100%' }}
          onClick={() => { handleLetsClose(); /* TODO: navegar a dashboard LETS */ }}
        >Ir al dashboard LETS</Button>
      </Popover>

      {/* Popover Wallet */}
      <Popover
        open={Boolean(walletAnchorEl)}
        anchorEl={walletAnchorEl}
        onClose={handleWalletClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{ sx: { p: 2, minWidth: 220, borderRadius: 3 } }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <AccountBalanceWallet sx={{ fontSize: 28, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700}>Mi Wallet</Typography>
        </Box>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>{walletBalance.toFixed(2)} Ünits</Typography>
        <Typography variant="body2" color="text.secondary">Límite de crédito: {walletCredit} Ünits</Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2, width: '100%' }}
          onClick={() => { handleWalletClose(); /* TODO: navegar a dashboard Wallet */ }}
        >Ir al dashboard Wallet</Button>
      </Popover>

      {/* Modal de Creación de Items */}
      <CreateItemModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
};

// 🎨 Componente de tarjeta móvil mejorada
interface EnhancedMobileProductCardProps extends Product {
  isFavorited?: boolean;
  viewMode: 'grid' | 'list';
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
}

export const EnhancedMobileProductCard: React.FC<EnhancedMobileProductCardProps> = ({
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
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice}`;
    }
    return `$${safePrice.toLocaleString()}`;
  };

  if (viewMode === 'list') {
    return (
      <Card
        onClick={() => onClick(id)}
        tabIndex={0}
        role="button"
        aria-label={`Ver detalles de ${title}`}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(id);
          }
        }}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          p: 2,
          height: 140,
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            borderColor: featured ? '#FFD700' : '#c0c0c0',
          },
          border: featured ? '2px solid #FFD700' : '1px solid #e0e0e0',
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#23272f' : '#fff',
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {featured && (
            <Chip
              label="★"
              size="small"
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                minWidth: 'auto',
                height: 20,
                backgroundColor: '#FFD700',
                color: 'black',
                fontWeight: 700,
                zIndex: 2,
              }}
            />
          )}
          {trending && (
            <Chip
              label="🔥"
              size="small"
              sx={{
                position: 'absolute',
                top: 28,
                left: 4,
                minWidth: 'auto',
                height: 20,
                backgroundColor: '#FF6B6B',
                color: 'white',
                fontWeight: 700,
                zIndex: 2,
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
          sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}
        >
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
            {/* Rating visual reforzado */}
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                px: 0.5,
                py: 0.25,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                ml: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Rating value={rating} precision={0.1} size="small" readOnly sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">{rating?.toFixed(1)}</Typography>
            </Box>
            <IconButton
              aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite(id);
              }}
              sx={{
                ml: 1,
                bgcolor: 'white',
                color: isFavorited ? 'error.main' : 'grey.500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                zIndex: 2,
                '&:hover': { bgcolor: 'grey.100' },
              }}
              size="small"
            >
              {isFavorited ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, minHeight: 32 }}>
            {description}
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 0.5 }}>
            {formatPrice(price, currency)}
          </Typography>
          {/* Aquí puedes agregar botón de favorito si lo deseas, asegurando que no tape info clave */}
        </Box>
      </Card>
    );
  }

  // Vista de grilla mejorada
  return (
    <Card
      onClick={() => onClick(id)}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${title}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(id);
        }
      }}
      sx={{
        cursor: 'pointer',
        height: '100%',
        minHeight: { xs: 300, sm: 340 },
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: '16px', sm: '20px' },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
        border: featured ? '2px solid #FFD700' : '1px solid #e0e0e0',
        background: '#ffffff',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
          borderColor: featured ? '#FFD700' : '#c0c0c0',
        },
      }}
      className="card-micro-interactive marketplace-card"
    >
      {/* Imagen del producto mejorada */}
      <Box
        className="marketplace-card-image-container"
        sx={{
          height: { xs: 160, sm: 200 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=240&fit=crop&crop=center'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: { xs: '16px', sm: '20px' },
        }}
      >
        {/* Badges superiores */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {featured && (
            <Chip
              label="⭐"
              size="small"
              sx={{
                minWidth: 'auto',
                height: 22,
                backgroundColor: '#FFD700',
                color: 'black',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              }}
            />
          )}
          {trending && (
            <Chip
              label="🔥"
              size="small"
              sx={{
                minWidth: 'auto',
                height: 22,
                backgroundColor: '#FF6B6B',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              }}
            />
          )}
          {is24Hours && (
            <Chip
              label="24h"
              size="small"
              sx={{
                minWidth: 'auto',
                height: 22,
                backgroundColor: '#4CAF50',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
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
              top: 10,
              right: 10,
              backgroundColor: '#FF4444',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
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
            bottom: 10,
            right: 10,
            backgroundColor: 'rgba(255,255,255,0.95)',
            '&:hover': { backgroundColor: 'white' },
            width: 36,
            height: 36,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          }}
          className="icon-micro-interactive"
        >
          {isFavorited ? (
            <Favorite sx={{ fontSize: 20, color: '#FF4444' }} />
          ) : (
            <Favorite sx={{ fontSize: 20, color: '#ccc' }} />
          )}
        </IconButton>

        {/* Rating y características */}
        <Box sx={{ position: 'absolute', bottom: 10, left: 10 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: hasVideo ? 0.5 : 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            }}
          >
            <StarIcon sx={{ fontSize: 18, color: '#FFD700' }} />
            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: 15 }}>
              {rating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({seller.reviewCount})
            </Typography>
            {hasVideo && (
              <Typography variant="caption" sx={{ ml: 0.5, fontSize: 12 }}>
                📹
              </Typography>
            )}
          </Box>
        </Box>

        {/* Indicador online del vendedor */}
        {seller.isOnline && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: discount ? 80 : 10,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              border: '2px solid white',
            }}
          />
        )}
      </Box>

      {/* Contenido de la tarjeta mejorado */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: '14px', sm: '16px' },
          '&:last-child': { pb: { xs: '14px', sm: '16px' } },
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="600"
          sx={{
            mb: 0.5,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            color: '#1a1a1a',
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
                {(seller.name || 'Usuario').split(' ')[0]}
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
              📍 {(location || 'Online').split(',')[0]}
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
                      {product.seller?.name || 'Usuario'}
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
