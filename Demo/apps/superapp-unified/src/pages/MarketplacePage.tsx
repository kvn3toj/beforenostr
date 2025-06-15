import React, { Suspense, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../contexts/ThemeContext';
import { CoomunityCard } from '../components/ui';
import CoomunityButton from '../components/ui/CoomunityButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SearchIcon, FilterIcon, GridIcon, ListIcon } from '@mui/icons-material';

// Lazy loading de componentes del marketplace
const ProductGrid = React.lazy(() => import('../components/modules/marketplace/ProductGrid'));
const ServicesList = React.lazy(() => import('../components/modules/marketplace/ServicesList'));
const MarketplaceFilters = React.lazy(() => import('../components/modules/marketplace/MarketplaceFilters'));
const FeaturedProducts = React.lazy(() => import('../components/modules/marketplace/FeaturedProducts'));

const MarketplacePage: React.FC = () => {
  const theme = useTheme();
  const { isDark } = useTheme as useCoomunityTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [showFilters, setShowFilters] = useState(false);

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
        {/* Header */}
        <motion.div variants={itemVariants}>
          <CoomunityCard
            variant="elevated"
            padding="lg"
            className="mb-6 backdrop-blur-sm bg-opacity-90"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography
                  variant="h3"
                  className="coomunity-h1"
                  sx={{
                    background: isDark
                      ? 'linear-gradient(45deg, #bb86fc, #03dac6)'
                      : 'linear-gradient(45deg, #7c3aed, #d97706)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  GMP Gamified Match Place
                </Typography>
                <Typography
                  variant="body1"
                  className="coomunity-body-lg"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Intercambio de valor basado en Ayni y reciprocidad
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

            {/* Navigation Tabs */}
            <Box display="flex" gap={2} mb={3}>
              <CoomunityButton
                variant={activeTab === 'products' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => setActiveTab('products')}
              >
                Productos
              </CoomunityButton>
              <CoomunityButton
                variant={activeTab === 'services' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => setActiveTab('services')}
              >
                Servicios
              </CoomunityButton>
            </Box>

            {/* Search and Filters */}
            <Box display="flex" gap={2} alignItems="center">
              <Box flex={1}>
                <input
                  type="text"
                  placeholder="Buscar productos y servicios..."
                  className={`
                    w-full px-4 py-3 rounded-lg border transition-all duration-200
                    ${isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20
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
          </CoomunityCard>
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
              <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={showFilters ? 9 : 12}>
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
                      <ProductGrid viewMode={viewMode} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="services"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ServicesList viewMode={viewMode} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Suspense>
            </motion.div>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <motion.div variants={itemVariants}>
          <CoomunityCard
            variant="elevated"
            padding="lg"
            className="mt-8 text-center"
          >
            <Typography variant="h5" className="coomunity-h2" mb={2}>
              ¿Tienes algo que ofrecer?
            </Typography>
            <Typography
              variant="body1"
              className="coomunity-body"
              sx={{ color: theme.palette.text.secondary, mb: 3 }}
            >
              Únete a nuestra comunidad de Emprendedores Confiables y comparte tu valor
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <CoomunityButton variant="primary" size="lg">
                Publicar Producto
              </CoomunityButton>
              <CoomunityButton variant="secondary" size="lg">
                Ofrecer Servicio
              </CoomunityButton>
            </Box>
          </CoomunityCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default MarketplacePage; 