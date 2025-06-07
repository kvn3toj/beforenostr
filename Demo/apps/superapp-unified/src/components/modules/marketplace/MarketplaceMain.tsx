import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { useMarketplaceData, useMerchantProfile, useProducts, useBackendAvailability } from '../../../hooks/useRealBackendData';

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

const MarketplaceMain: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
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
    console.log('Buscando:', searchValue);
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
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase();
      filteredGigs = filteredGigs.filter(gig =>
        gig.title.toLowerCase().includes(searchTerm) ||
        gig.description.toLowerCase().includes(searchTerm) ||
        gig.author.name.toLowerCase().includes(searchTerm) ||
        gig.category?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por categoría
    if (filters.category !== 'all') {
      filteredGigs = filteredGigs.filter(gig => gig.category === filters.category);
    }

    // Filtrar por tipo de contenido (productos, servicios, experiencias)
    if (filters.contentType !== 'all') {
      filteredGigs = filteredGigs.filter(gig => gig.type === filters.contentType);
    }

    // Filtrar por rango de precio
    filteredGigs = filteredGigs.filter(gig =>
      gig.price >= filters.priceRange[0] && gig.price <= filters.priceRange[1]
    );

    // Filtrar por tipo de entrega
    if (filters.deliveryType.length > 0) {
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

    // Filtrar por rating mínimo
    if (filters.minRating > 0) {
      filteredGigs = filteredGigs.filter(gig => (gig.rating || 0) >= filters.minRating);
    }

    // Ordenar resultados
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 🔗 Backend Connection Status */}
      {!backendAvailability.isAvailable && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
            <Typography variant="body2">
              🔌 Modo Offline - Mostrando contenido simulado del marketplace
            </Typography>
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              color="inherit"
            >
              Reintentar
            </Button>
          </Stack>
        </Alert>
      )}

      {(marketplaceDataQuery.isLoading || productsQuery.isLoading) && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔄 Cargando datos del marketplace...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {/* Header del Marketplace */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                🏪 Marketplace CoomÜnity
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Economía Colaborativa • Productos • Servicios • Experiencias • Bien Común
              </Typography>
            </Box>
            
            {/* Indicador de productos */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold">
                {displayGigs.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {displayGigs.length === 1 ? 'Item' : 'Items'}
              </Typography>
            </Box>
          </Box>

          {/* Mensaje sobre Méritos y Sistema de Confianza */}
          <Alert 
            severity="info" 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)',
              '& .MuiAlert-icon': { color: 'white' },
              '& .MuiAlert-message': { color: 'white' }
            }}
          >
            <Typography variant="body2">
              💎 <strong>Solo Emprendedores Confiables:</strong> Los servicios aquí ofrecidos son de miembros que han ganado Mëritos 
              por contribuir al Bien Común. Como Consumidor Consciente, obtienes descuentos del 10% al 50% y apoyas el talento local.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Barra de controles */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {backendAvailability.isAvailable ? 
              `🌐 Conectado al servidor` : 
              `📱 Modo offline`}
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''}`}
              size="small" 
              color="primary" 
              onDelete={resetFilters}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setShowSearch(!showSearch)} color={showSearch ? 'primary' : 'default'}>
            <Search />
          </IconButton>
          <Badge badgeContent={activeFiltersCount} color="primary">
            <IconButton onClick={() => setShowFilters(true)} color={activeFiltersCount > 0 ? 'primary' : 'default'}>
              <Tune />
            </IconButton>
          </Badge>
          <IconButton onClick={handleRefresh} disabled={marketplaceDataQuery.isLoading}>
            <Refresh />
          </IconButton>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Barra de búsqueda mejorada */}
      {showSearch && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <form onSubmit={handleSearch}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    placeholder="Buscar servicios, productos, personas..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={filters.sortBy}
                      label="Ordenar por"
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      {sortOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Panel Principal - Servicios/Productos */}
        <Grid item xs={12} md={8}>
          {/* Perfil del Merchant (si está disponible) */}
          {merchantProfile && backendAvailability.isAvailable && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                    <Store />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {merchantProfile.businessName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por {merchantProfile.owner}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Star sx={{ color: 'warning.main', fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2">
                        {merchantProfile.rating} ({merchantProfile.reviewCount} reseñas)
                      </Typography>
                      {merchantProfile.verified && (
                        <Chip label="Verificado" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  </Box>
                </Box>
                {merchantProfile.description && (
                  <Typography variant="body2" color="text.secondary">
                    {merchantProfile.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lista de Servicios/Productos */}
          <Typography variant="h6" gutterBottom>
            {backendAvailability.isAvailable ? 'Productos Disponibles' : 'Servicios Destacados'}
          </Typography>
          
          <Grid container spacing={2}>
            {displayGigs.map((gig) => (
              <Grid item xs={12} sm={6} key={gig.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      📷 Imagen del servicio
                    </Typography>
                  </Box>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {gig.title}
                        </Typography>
                        {/* Indicador de tipo de contenido */}
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                          <Chip 
                            label={gig.type === 'producto' ? '📦 Producto' : 
                                   gig.type === 'servicio' ? '🛠️ Servicio' : 
                                   '🎬 Experiencia'}
                            size="small" 
                            color={gig.type === 'producto' ? 'secondary' : 
                                   gig.type === 'servicio' ? 'primary' : 
                                   'success'}
                            variant="filled"
                          />
                        </Box>
                      </Box>
                      {gig.category && (
                        <Chip 
                          label={categories.find(cat => cat.value === gig.category)?.label || gig.category}
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      )}
                    </Box>
                    
                    {/* Rating */}
                    {gig.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="bold" sx={{ mr: 0.5 }}>
                          {gig.rating.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({Math.floor(Math.random() * 50) + 10} reseñas)
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ flex: 1 }}>
                      {gig.description}
                    </Typography>
                    
                    {/* Autor */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {gig.author.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" fontWeight="bold">
                          {gig.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {gig.author.username}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Opciones */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                      {gig.options.delivery && (
                        <Chip label="📦 Entrega" size="small" variant="outlined" />
                      )}
                      {gig.options.virtual && (
                        <Chip label="💻 Virtual" size="small" variant="outlined" />
                      )}
                      {gig.options.onSite && (
                        <Chip label="📍 Presencial" size="small" variant="outlined" />
                      )}
                    </Box>

                    {/* Precio y acciones */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          {gig.price} {gig.currency}
                        </Typography>
                        {gig.currency === 'Lükas' && (
                          <Typography variant="caption" color="text.secondary">
                            ≈ ${(gig.price * 1.1).toFixed(0)} USD
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <IconButton size="small" title="Ver detalles">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary" title="Agregar al carrito">
                          <ShoppingCart />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {displayGigs.length === 0 && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Store sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay productos disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {backendAvailability.isAvailable ? 
                    'El marketplace está vacío o no hay productos que coincidan con tu búsqueda.' :
                    'No se pudo cargar el contenido del marketplace. Intenta más tarde.'
                  }
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Panel Lateral */}
        <Grid item xs={12} md={4}>
          {/* Estadísticas del Merchant (si está disponible) */}
          {merchantProfile?.sales && backendAvailability.isAvailable && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Estadísticas del Vendedor
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Ventas este mes:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    €{merchantProfile.sales.thisMonth.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Crecimiento:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      +{merchantProfile.sales.growth}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Deseos Populares */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📈 Necesidades Más Demandadas en CoomÜnity
                <Chip label="Bien Común" size="small" color="primary" />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Servicios que nuestra comunidad más busca para su desarrollo consciente
              </Typography>
              {popularDesires.map((desire) => (
                <Box key={desire.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{desire.name}</Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      {desire.progress}% demanda
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={desire.progress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #6366f1, #8b5cf6)'
                      }
                    }} 
                  />
                </Box>
              ))}
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  🎯 <strong>Oportunidad:</strong> Los servicios más demandados tienen mayor visibilidad 
                  y pueden generar más Mëritos para emprendedores confiables.
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚡ Acciones Rápidas
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<LocalOffer />}
                >
                  Publicar en Marketplace
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Store />}
                >
                  Mi Tienda
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Star />}
                >
                  Mis Favoritos
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🎛️ Drawer de Filtros Avanzados */}
      <Drawer
        anchor="right"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        PaperProps={{
          sx: { width: 320, p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            🎛️ Filtros Avanzados
          </Typography>
          <IconButton onClick={() => setShowFilters(false)}>
            <Close />
          </IconButton>
        </Box>

        <Stack spacing={3}>
          {/* Categoría */}
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filters.category}
              label="Categoría"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(category => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tipo de Contenido */}
          <FormControl fullWidth>
            <InputLabel>Tipo de Contenido</InputLabel>
            <Select
              value={filters.contentType}
              label="Tipo de Contenido"
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
            >
              {contentTypes.map(contentType => (
                <MenuItem key={contentType.value} value={contentType.value}>
                  {contentType.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Rango de Precio */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Rango de Precio (Lükas)
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={25}
              marks={[
                { value: 0, label: '0' },
                { value: 250, label: '250' },
                { value: 500, label: '500' },
                { value: 750, label: '750' },
                { value: 1000, label: '1000+' }
              ]}
            />
            <Typography variant="caption" color="text.secondary">
              {filters.priceRange[0]} - {filters.priceRange[1]} Lükas
            </Typography>
          </Box>

          {/* Tipo de Entrega */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tipo de Entrega
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.deliveryType.includes('delivery')}
                    onChange={(e) => {
                      const newDeliveryType = e.target.checked
                        ? [...filters.deliveryType, 'delivery']
                        : filters.deliveryType.filter(type => type !== 'delivery');
                      handleFilterChange('deliveryType', newDeliveryType);
                    }}
                  />
                }
                label="📦 Entrega a domicilio"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.deliveryType.includes('virtual')}
                    onChange={(e) => {
                      const newDeliveryType = e.target.checked
                        ? [...filters.deliveryType, 'virtual']
                        : filters.deliveryType.filter(type => type !== 'virtual');
                      handleFilterChange('deliveryType', newDeliveryType);
                    }}
                  />
                }
                label="💻 Virtual/Online"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.deliveryType.includes('onSite')}
                    onChange={(e) => {
                      const newDeliveryType = e.target.checked
                        ? [...filters.deliveryType, 'onSite']
                        : filters.deliveryType.filter(type => type !== 'onSite');
                      handleFilterChange('deliveryType', newDeliveryType);
                    }}
                  />
                }
                label="📍 Presencial"
              />
            </FormGroup>
          </Box>

          {/* Rating Mínimo */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Rating Mínimo
            </Typography>
            <RadioGroup
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
            >
              <FormControlLabel value={0} control={<Radio />} label="Cualquier rating" />
              <FormControlLabel 
                value={3} 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">3+ estrellas</Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value={4} 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">4+ estrellas</Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value={4.5} 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">4.5+ estrellas</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Box>

          {/* Ordenamiento */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Ordenar por
            </Typography>
            <FormControl fullWidth>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.sortOrder === 'desc'}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.checked ? 'desc' : 'asc')}
                  />
                }
                label="Orden descendente"
              />
            </FormGroup>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Botones de Acción */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={resetFilters}
            startIcon={<Close />}
          >
            Limpiar
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
            startIcon={<Tune />}
          >
            Aplicar
          </Button>
        </Stack>
      </Drawer>

      {/* Menú contextual */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { setShowFilters(true); handleMenuClose(); }}>
          <Tune sx={{ mr: 1 }} />
          Filtros avanzados
        </MenuItem>
        <MenuItem onClick={() => { handleQuickFilter('popular'); handleMenuClose(); }}>
          <Star sx={{ mr: 1 }} />
          Más populares
        </MenuItem>
        <MenuItem onClick={() => { handleQuickFilter('price'); handleMenuClose(); }}>
          <TrendingDown sx={{ mr: 1 }} />
          Precio menor
        </MenuItem>
        <MenuItem onClick={() => { handleQuickFilter('rating'); handleMenuClose(); }}>
          <StarBorder sx={{ mr: 1 }} />
          Solo 4+ estrellas
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { resetFilters(); handleMenuClose(); }}>
          <Refresh sx={{ mr: 1 }} />
          Restablecer filtros
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <Info sx={{ mr: 1 }} />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              🎫 Solo por Invitación
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Como miembro, tienes acceso exclusivo a descuentos del 10% al 50%
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default MarketplaceMain; 