import React, { useState, useCallback, useMemo, Suspense } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Zoom,
  Fade,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';

// 🌌 COSMIC DESIGN SYSTEM IMPORTS
import { RevolutionaryWidget } from '../../../design-system/templates/RevolutionaryWidget';
import { useTheme as useCoomunityTheme } from '../../../contexts/ThemeContext';
import { formatPrice, safeToLocaleString } from '../../../utils/numberUtils';

// 🎯 PERFORMANCE OPTIMIZED COMPONENTS
import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 🎮 ENHANCED FEATURES
import {
  SearchIcon,
  FilterIcon,
  TrendingUpIcon,
  StarIcon,
  VerifiedIcon,
  LocalOfferIcon,
  GroupIcon,
  AttachMoneyIcon
} from '@mui/icons-material';

// 🔄 TIPOS MEJORADOS
interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'service' | 'collaboration';
  price: number;
  currency: 'lukas' | 'ondas' | 'meritos';
  seller: {
    id: string;
    name: string;
    verified: boolean;
    meritos: number;
    trustLevel: 'bronze' | 'silver' | 'gold' | 'diamond';
  };
  tags: string[];
  featured: boolean;
  trending: boolean;
  ayniScore: number; // 🌱 Puntuación de reciprocidad
  bienComunScore: number; // 🌍 Contribución al bien común
  images: string[];
  createdAt: string;
  location?: string;
  category: string;
}

interface EnhancedMarketplaceProps {
  initialFilters?: {
    type?: 'product' | 'service' | 'collaboration' | 'all';
    category?: string;
    priceRange?: [number, number];
    currency?: 'lukas' | 'ondas' | 'meritos' | 'all';
    trustLevel?: 'bronze' | 'silver' | 'gold' | 'diamond' | 'all';
  };
  cosmicEffectsEnabled?: boolean;
  performanceMode?: 'high' | 'balanced' | 'economy';
}

// 🎭 COMPONENTE ITEM OPTIMIZADO CON MEMO
const MarketplaceItemCard = memo<{
  item: MarketplaceItem;
  onItemClick: (item: MarketplaceItem) => void;
  cosmicEffectsEnabled: boolean;
}>(({ item, onItemClick, cosmicEffectsEnabled }) => {
  const theme = useTheme();
  const { isDark } = useCoomunityTheme();

  const getTrustLevelColor = (level: string) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      diamond: '#B9F2FF'
    };
    return colors[level as keyof typeof colors] || colors.bronze;
  };

  const getCurrencyIcon = (currency: string) => {
    const icons = {
      lukas: '🌟',
      ondas: '🌊',
      meritos: '🏆'
    };
    return icons[currency as keyof typeof icons] || '💰';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        scale: 1.03,
        boxShadow: cosmicEffectsEnabled
          ? '0 8px 32px rgba(139, 69, 219, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.3 }}
      style={{
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(145deg, rgba(45, 27, 105, 0.8), rgba(17, 153, 142, 0.6))'
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 255, 0.8))',
        backdropFilter: 'blur(20px)',
        border: cosmicEffectsEnabled
          ? '1px solid rgba(139, 69, 219, 0.3)'
          : '1px solid rgba(0, 0, 0, 0.1)',
      }}
      onClick={() => onItemClick(item)}
    >
      <Box sx={{ p: 3 }}>
        {/* 🏷️ HEADER CON BADGES */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {item.featured && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '16px' }} />}
                label="Destacado"
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            )}
            {item.trending && (
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: '16px' }} />}
                label="Tendencia"
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            )}
            <Chip
              label={item.type}
              size="small"
              sx={{
                background: item.type === 'product'
                  ? 'linear-gradient(45deg, #667eea, #764ba2)'
                  : item.type === 'service'
                  ? 'linear-gradient(45deg, #f093fb, #f5576c)'
                  : 'linear-gradient(45deg, #4facfe, #00f2fe)',
                color: 'white',
                textTransform: 'capitalize'
              }}
            />
          </Box>

          {/* 🎖️ TRUST LEVEL BADGE */}
          <Tooltip title={`Nivel de Confianza: ${item.seller.trustLevel.toUpperCase()}`}>
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: '14px' }} />}
              label={item.seller.trustLevel}
              size="small"
              sx={{
                backgroundColor: getTrustLevelColor(item.seller.trustLevel),
                color: 'white',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            />
          </Tooltip>
        </Box>

        {/* 📝 CONTENIDO PRINCIPAL */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          {item.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {item.description}
        </Typography>

        {/* 💰 PRECIO Y MONEDA */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {getCurrencyIcon(item.currency)} {safeToLocaleString(item.price)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              {item.currency}
            </Typography>
          </Box>

          {/* 🌱 SCORES DE AYNI Y BIEN COMÚN */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={`Ayni Score: ${item.ayniScore}/100`}>
              <Chip
                label={`A:${item.ayniScore}`}
                size="small"
                sx={{
                  backgroundColor: `rgba(76, 175, 80, ${item.ayniScore / 100})`,
                  color: 'white',
                  fontSize: '11px'
                }}
              />
            </Tooltip>
            <Tooltip title={`Bien Común Score: ${item.bienComunScore}/100`}>
              <Chip
                label={`BC:${item.bienComunScore}`}
                size="small"
                sx={{
                  backgroundColor: `rgba(33, 150, 243, ${item.bienComunScore / 100})`,
                  color: 'white',
                  fontSize: '11px'
                }}
              />
            </Tooltip>
          </Box>
        </Box>

        {/* 🏪 VENDEDOR INFO */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              por
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {item.seller.name}
            </Typography>
            {item.seller.verified && (
              <VerifiedIcon sx={{ fontSize: '16px', color: 'success.main' }} />
            )}
          </Box>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            🏆 {item.seller.meritos} mëritos
          </Typography>
        </Box>

        {/* 🏷️ TAGS */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 2 }}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '10px',
                height: '20px',
                borderColor: 'primary.main',
                color: 'primary.main'
              }}
            />
          ))}
          {item.tags.length > 3 && (
            <Chip
              label={`+${item.tags.length - 3}`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '10px',
                height: '20px',
                borderColor: 'text.secondary',
                color: 'text.secondary'
              }}
            />
          )}
        </Box>
      </Box>
    </motion.div>
  );
});

MarketplaceItemCard.displayName = 'MarketplaceItemCard';

// 🚀 COMPONENTE PRINCIPAL ENHANCED MARKETPLACE
const EnhancedMarketplace: React.FC<EnhancedMarketplaceProps> = ({
  initialFilters = { type: 'all' },
  cosmicEffectsEnabled = true,
  performanceMode = 'balanced'
}) => {
  const theme = useTheme();
  const { isDark } = useCoomunityTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🎯 ESTADO LOCAL OPTIMIZADO
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'ayni' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 🔄 DATOS SIMULADOS MEJORADOS
  const mockItems = useMemo<MarketplaceItem[]>(() => [
    {
      id: '1',
      title: 'Curso de Permacultura Avanzada',
      description: 'Aprende técnicas avanzadas de permacultura para crear sistemas sustentables que honren los principios de Ayni y Bien Común.',
      type: 'service',
      price: 150,
      currency: 'lukas',
      seller: {
        id: 'seller1',
        name: 'María Pachamama',
        verified: true,
        meritos: 2500,
        trustLevel: 'gold'
      },
      tags: ['permacultura', 'sustentabilidad', 'ayni', 'pachamama'],
      featured: true,
      trending: true,
      ayniScore: 95,
      bienComunScore: 88,
      images: ['/images/permacultura.jpg'],
      createdAt: '2024-01-15',
      category: 'educacion'
    },
    {
      id: '2',
      title: 'Miel Orgánica de Abejas Nativas',
      description: 'Miel pura extraída de colmenas de abejas nativas, producida con prácticas regenerativas que benefician el ecosistema local.',
      type: 'product',
      price: 45,
      currency: 'ondas',
      seller: {
        id: 'seller2',
        name: 'Cooperativa Abeja Dorada',
        verified: true,
        meritos: 1800,
        trustLevel: 'silver'
      },
      tags: ['miel', 'orgánico', 'abejas', 'regenerativo'],
      featured: false,
      trending: true,
      ayniScore: 92,
      bienComunScore: 94,
      images: ['/images/miel.jpg'],
      createdAt: '2024-01-10',
      category: 'alimentos'
    },
    {
      id: '3',
      title: 'Proyecto de Reforestación Comunitaria',
      description: 'Iniciativa colaborativa para reforestar 50 hectáreas en la Cordillera de los Andes usando especies nativas.',
      type: 'collaboration',
      price: 0,
      currency: 'meritos',
      seller: {
        id: 'seller3',
        name: 'Red Bosques del Futuro',
        verified: true,
        meritos: 3200,
        trustLevel: 'diamond'
      },
      tags: ['reforestación', 'colaboración', 'cordillera', 'nativo'],
      featured: true,
      trending: false,
      ayniScore: 98,
      bienComunScore: 97,
      images: ['/images/reforestacion.jpg'],
      createdAt: '2024-01-08',
      category: 'medio-ambiente'
    }
  ], []);

  // 🎯 FILTRADO Y BÚSQUEDA OPTIMIZADOS
  const filteredItems = useMemo(() => {
    return mockItems.filter(item => {
      // Filtro por tipo
      if (filters.type && filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }

      // Filtro por búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          item.seller.name.toLowerCase().includes(searchLower)
        );
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'ayni':
          return b.ayniScore - a.ayniScore;
        case 'popular':
          return (b.seller.meritos + b.ayniScore) - (a.seller.meritos + a.ayniScore);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [mockItems, filters, searchTerm, sortBy]);

  // 🎬 CALLBACK OPTIMIZADO PARA CLICKS
  const handleItemClick = useCallback((item: MarketplaceItem) => {
    console.log('Item clicked:', item.title);
    // Aquí iría la navegación al detalle del producto/servicio
  }, []);

  // 🎨 VARIANTES DE ANIMACIÓN
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: performanceMode === 'high' ? 0.1 : 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <ErrorBoundary fallback={<Typography>Error loading marketplace</Typography>}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* 🌌 HEADER PRINCIPAL CON EFECTOS CÓSMICOS */}
        <RevolutionaryWidget
          title="🏪 GMP - Gamified Match Place"
          subtitle="Intercambio de Valor basado en Ayni y Bien Común"
          variant="elevated"
          element="tierra" // Verde/marrón para marketplace/comercio
          cosmicEffects={cosmicEffectsEnabled ? {
            enableParticles: true,
            enableGlow: true,
            enableAnimations: true,
            enableOrbitalEffects: true,
            particleConfig: {
              count: performanceMode === 'high' ? 12 : 6,
              size: 7,
              color: '#8BC34A',
              speed: 1.2,
              opacity: 0.7
            },
            glowIntensity: 1.0
          } : {}}
          cosmicIntensity="intense"
          style={{ marginBottom: '2rem' }}
        >
          {/* 🔍 BARRA DE BÚSQUEDA AVANZADA */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{xs: 12, md: 6}}>
                <Box sx={{ position: 'relative' }}>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {/* 🏷️ FILTROS RÁPIDOS */}
                  {['all', 'product', 'service', 'collaboration'].map((type) => (
                    <Chip
                      key={type}
                      label={type === 'all' ? 'Todos' :
                             type === 'product' ? 'Productos' :
                             type === 'service' ? 'Servicios' : 'Colaboraciones'}
                      onClick={() => setFilters(prev => ({ ...prev, type: type as any }))}
                      variant={filters.type === type ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: filters.type === type ? 'primary.main' : 'transparent',
                        color: filters.type === type ? 'white' : 'primary.main',
                        '&:hover': {
                          backgroundColor: filters.type === type ? 'primary.dark' : 'primary.light',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* 📊 ESTADÍSTICAS Y ORDENAMIENTO */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredItems.length} elementos encontrados
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`
                  px-3 py-1 rounded border text-sm transition-all duration-200
                  ${isDark
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:border-primary-500
                `}
              >
                <option value="newest">Más recientes</option>
                <option value="price">Precio menor</option>
                <option value="ayni">Mayor Ayni</option>
                <option value="popular">Más populares</option>
              </select>
            </Box>
          </Box>
        </RevolutionaryWidget>

        {/* 🎨 GRID DE PRODUCTOS CON VIRTUALIZATION (SI HAY MUCHOS ITEMS) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <Grid key={item.id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                  <MarketplaceItemCard
                    item={item}
                    onItemClick={handleItemClick}
                    cosmicEffectsEnabled={cosmicEffectsEnabled && performanceMode !== 'economy'}
                  />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {/* 📝 MENSAJE SI NO HAY RESULTADOS */}
          {filteredItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron elementos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar los filtros o términos de búsqueda
              </Typography>
            </Box>
          )}
        </motion.div>

        {/* 🌱 FOOTER FILOSÓFICO */}
        <RevolutionaryWidget
          title="🌍 Filosofía del Intercambio CoomÜnity"
          variant="elevated"
          element="espiritu"
          cosmicEffects={cosmicEffectsEnabled ? {
            enableParticles: true,
            enableGlow: true,
            particleConfig: {
              count: 8,
              size: 6,
              color: '#9C27B0',
              speed: 0.8,
              opacity: 0.6
            }
          } : {}}
          cosmicIntensity="medium"
          style={{ marginTop: '3rem' }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            En el Marketplace CoomÜnity, cada intercambio fortalece los lazos de <strong>Ayni</strong> (reciprocidad equilibrada)
            y contribuye al <strong>Bien Común</strong>. Los <strong>Lükas</strong>, <strong>Öndas</strong> y <strong>Mëritos</strong>
            no son solo monedas, sino manifestaciones de valor regenerativo que nutren nuestra comunidad.
          </Typography>
        </RevolutionaryWidget>
      </Container>
    </ErrorBoundary>
  );
};

export default EnhancedMarketplace;
