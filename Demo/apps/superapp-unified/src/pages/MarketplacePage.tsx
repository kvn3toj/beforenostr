import React, { Suspense, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
  Tooltip,
  Fade,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../contexts/ThemeContext';
import { CoomunityCard } from '../components/ui';
import CoomunityButton from '../components/ui/CoomunityButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  SearchIcon, 
  FilterIcon, 
  GridIcon, 
  ListIcon,
  TrendingUpIcon,
  StarIcon,
  VerifiedIcon,
  AttachMoneyIcon,
  GroupIcon
} from '@mui/icons-material';

// 🌌 COSMIC DESIGN SYSTEM IMPORT
import { RevolutionaryWidget } from '../design-system/templates/RevolutionaryWidget';

// Lazy loading de componentes del marketplace
const ProductGrid = React.lazy(() => import('../components/modules/marketplace/ProductGrid'));
const ServicesList = React.lazy(() => import('../components/modules/marketplace/ServicesList'));
const MarketplaceFilters = React.lazy(() => import('../components/modules/marketplace/MarketplaceFilters'));
const FeaturedProducts = React.lazy(() => import('../components/modules/marketplace/FeaturedProducts'));

const MarketplacePage: React.FC = () => {
  const theme = useTheme();
  const { isDark } = useCoomunityTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'collaborations'>('products');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'ayni' | 'popular'>('newest');

  // 🎯 PERFORMANCE: Memoized filter options
  const filterStats = useMemo(() => ({
    products: 156,
    services: 89,
    collaborations: 23,
    trending: 12,
    featured: 8
  }), []);

  // 🎬 PERFORMANCE: Callback optimization
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleTabChange = useCallback((tab: 'products' | 'services' | 'collaborations') => {
    setActiveTab(tab);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pt: 2,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* 🌌 ENHANCED HEADER WITH COSMIC DESIGN SYSTEM */}
        <motion.div variants={itemVariants}>
          <RevolutionaryWidget
            title="🏪 GMP - Gamified Match Place"
            subtitle="Intercambio de Valor basado en Ayni y Bien Común"
            variant="elevated"
            element="tierra" // Verde para marketplace/comercio
            cosmicEffects={{
              enableParticles: true,
              enableGlow: true,
              enableAnimations: true,
              enableOrbitalEffects: true,
              particleConfig: {
                count: 10,
                size: 6,
                color: '#8BC34A',
                speed: 1.2,
                opacity: 0.7
              },
              glowIntensity: 1.0
            }}
            cosmicIntensity="intense"
            style={{ marginBottom: '2rem' }}
          >
            {/* 📊 ENHANCED STATS ROW */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip 
                icon={<AttachMoneyIcon />}
                label={`${filterStats.products} Productos`}
                sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white' }}
              />
              <Chip 
                icon={<GroupIcon />}
                label={`${filterStats.services} Servicios`}
                sx={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)', color: 'white' }}
              />
              <Chip 
                icon={<VerifiedIcon />}
                label={`${filterStats.collaborations} Colaboraciones`}
                sx={{ background: 'linear-gradient(45deg, #4facfe, #00f2fe)', color: 'white' }}
              />
              <Chip 
                icon={<TrendingUpIcon />}
                label={`${filterStats.trending} Trending`}
                sx={{ background: 'linear-gradient(45deg, #43e97b, #38f9d7)', color: 'white' }}
              />
              <Chip 
                icon={<StarIcon />}
                label={`${filterStats.featured} Destacados`}
                sx={{ background: 'linear-gradient(45deg, #fa709a, #fee140)', color: 'white' }}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px' }}>
                  Descubre productos, servicios y proyectos colaborativos que fortalecen 
                  los principios de <strong>Ayni</strong> y contribuyen al <strong>Bien Común</strong> de nuestra comunidad.
                </Typography>
              </Box>
              
              {!isMobile && (
                <Box display="flex" gap={1}>
                  <CoomunityButton
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    startIcon={<GridIcon />}
                  >
                    Cuadrícula
                  </CoomunityButton>
                  <CoomunityButton
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    startIcon={<ListIcon />}
                  >
                    Lista
                  </CoomunityButton>
                </Box>
              )}
            </Box>

            {/* 🎯 ENHANCED NAVIGATION TABS */}
            <Box display="flex" gap={2} mb={3} justifyContent="center">
              <CoomunityButton
                variant={activeTab === 'products' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('products')}
                startIcon={<AttachMoneyIcon />}
              >
                Productos ({filterStats.products})
              </CoomunityButton>
              <CoomunityButton
                variant={activeTab === 'services' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('services')}
                startIcon={<GroupIcon />}
              >
                Servicios ({filterStats.services})
              </CoomunityButton>
              <CoomunityButton
                variant={activeTab === 'collaborations' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('collaborations')}
                startIcon={<VerifiedIcon />}
              >
                Colaboraciones ({filterStats.collaborations})
              </CoomunityButton>
            </Box>

            {/* 🔍 ENHANCED SEARCH AND FILTERS */}
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <Box flex={1} sx={{ position: 'relative' }}>
                <SearchIcon sx={{ 
                  position: 'absolute', 
                  left: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'text.secondary'
                }} />
                <input
                  type="text"
                  placeholder="Buscar productos, servicios y colaboraciones..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200
                    ${isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20
                  `}
                />
              </Box>
              <CoomunityButton
                variant="outline"
                size="md"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterIcon />}
              >
                Filtros
              </CoomunityButton>
            </Box>

            {/* 📊 ENHANCED SORTING OPTIONS */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Más recientes"
                  onClick={() => setSortBy('newest')}
                  variant={sortBy === 'newest' ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ backgroundColor: sortBy === 'newest' ? 'primary.main' : 'transparent' }}
                />
                <Chip
                  label="Mejor precio"
                  onClick={() => setSortBy('price')}
                  variant={sortBy === 'price' ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ backgroundColor: sortBy === 'price' ? 'primary.main' : 'transparent' }}
                />
                <Chip
                  label="Mayor Ayni"
                  onClick={() => setSortBy('ayni')}
                  variant={sortBy === 'ayni' ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ backgroundColor: sortBy === 'ayni' ? 'primary.main' : 'transparent' }}
                />
                <Chip
                  label="Más populares"
                  onClick={() => setSortBy('popular')}
                  variant={sortBy === 'popular' ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ backgroundColor: sortBy === 'popular' ? 'primary.main' : 'transparent' }}
                />
              </Box>

              {!isMobile && (
                <Box display="flex" gap={1}>
                  <CoomunityButton
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    startIcon={<GridIcon />}
                  >
                    Cuadrícula
                  </CoomunityButton>
                  <CoomunityButton
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    startIcon={<ListIcon />}
                  >
                    Lista
                  </CoomunityButton>
                </Box>
              )}
            </Box>
          </RevolutionaryWidget>
        </motion.div>

        {/* Featured Section */}
        <motion.div variants={itemVariants}>
          <Suspense fallback={<LoadingSpinner size="large" />}>
            <FeaturedProducts />
          </Suspense>
        </motion.div>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <Grid size={{xs:12,md:3}}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <MarketplaceFilters />
                  </Suspense>
                </motion.div>
              </Grid>
            )}
          </AnimatePresence>

          {/* Products/Services Grid */}
          <Grid size={{xs:12}} md={showFilters ? 9 : 12}>
            <motion.div variants={itemVariants}>
              <Suspense fallback={<LoadingSpinner size="large" />}>
                <AnimatePresence mode="wait">
                  {activeTab === 'products' ? (
                    <motion.div
                      key="products"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductGrid viewMode={viewMode} searchTerm={searchTerm} sortBy={sortBy} />
                    </motion.div>
                  ) : activeTab === 'services' ? (
                    <motion.div
                      key="services"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ServicesList viewMode={viewMode} searchTerm={searchTerm} sortBy={sortBy} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="collaborations"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* 🤝 COLLABORATIONS SECTION */}
                      <RevolutionaryWidget
                        title="🤝 Proyectos Colaborativos"
                        subtitle="Iniciativas basadas en Bien Común y Ayni"
                        variant="elevated"
                        element="espiritu"
                        cosmicEffects={{
                          enableParticles: true,
                          enableGlow: true,
                          particleConfig: {
                            count: 8,
                            size: 5,
                            color: '#9C27B0',
                            speed: 0.8,
                            opacity: 0.6
                          }
                        }}
                        cosmicIntensity="medium"
                      >
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Typography variant="h6" gutterBottom>
                            🌱 Sección en Desarrollo
                          </Typography>
                          <Typography variant="body1" color="text.secondary" paragraph>
                            Los proyectos colaborativos permiten a la comunidad unirse para crear valor compartido.
                            Aquí encontrarás iniciativas de reforestación, educación comunitaria, desarrollo tecnológico
                            y más, todas guiadas por los principios de <strong>Ayni</strong> y <strong>Bien Común</strong>.
                          </Typography>
                          <CoomunityButton variant="primary" size="lg">
                            Proponer Colaboración
                          </CoomunityButton>
                        </Box>
                      </RevolutionaryWidget>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Suspense>
            </motion.div>
          </Grid>
        </Grid>

        {/* 🌟 ENHANCED CTA SECTION WITH COSMIC EFFECTS */}
        <motion.div variants={itemVariants}>
          <RevolutionaryWidget
            title="🌟 ¿Tienes algo que ofrecer?"
            subtitle="Únete a nuestra comunidad de Emprendedores Confiables"
            variant="elevated"
            element="fuego" // Naranja/rojo para acción y llamado
            cosmicEffects={{
              enableParticles: true,
              enableGlow: true,
              enableAnimations: true,
              enableOrbitalEffects: true,
              particleConfig: {
                count: 12,
                size: 7,
                color: '#FF5722',
                speed: 1.5,
                opacity: 0.8
              },
              glowIntensity: 1.2
            }}
            cosmicIntensity="intense"
            style={{ marginTop: '3rem' }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '600px', mx: 'auto' }}>
                Comparte tu conocimiento, productos y servicios con una comunidad que valora 
                la <strong>reciprocidad</strong>, la <strong>calidad</strong> y el <strong>Bien Común</strong>. 
                Cada contribución fortalece nuestro ecosistema colaborativo.
              </Typography>
              
              <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" sx={{ mt: 3 }}>
                <CoomunityButton variant="primary" size="lg" startIcon={<AttachMoneyIcon />}>
                  Publicar Producto
                </CoomunityButton>
                <CoomunityButton variant="secondary" size="lg" startIcon={<GroupIcon />}>
                  Ofrecer Servicio
                </CoomunityButton>
                <CoomunityButton variant="outline" size="lg" startIcon={<VerifiedIcon />}>
                  Proponer Colaboración
                </CoomunityButton>
              </Box>

              {/* 🎯 BENEFICIOS DESTACADOS */}
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    🏆 Gana Mëritos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reconocimiento por contribuir al Bien Común
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                    🌊 Genera Öndas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Energía positiva que se multiplica en la comunidad
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    🌟 Recibe Lükas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Moneda interna para intercambios de valor
                  </Typography>
                </Box>
              </Box>
            </Box>
          </RevolutionaryWidget>
        </motion.div>
      </Container>
    </Box>
  );
};

export default MarketplacePage; 