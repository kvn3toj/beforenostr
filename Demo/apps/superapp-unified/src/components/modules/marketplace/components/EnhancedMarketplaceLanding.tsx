import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Grow,
  Zoom,
  IconButton,
  Badge,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Star,
  Eco,
  VerifiedUser,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Visibility,
  AutoAwesome,
  LocalOffer,
  Groups,
  EmojiEvents,
  FlashOn,
  WaterDrop,
  AccessTime,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsciousProductImage, ConsciousProductGallery } from './ConsciousProductImageSystem';
import { impactCategories, getConsciousnessStyle } from '../marketplace.constants';

// 🎯 Aria + Kira: Enhanced Product Interface with CoomÜnity Philosophy
interface EnhancedMarketplaceItem {
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
    isEmprendedorConfiable: boolean;
    ayniScore: number;
    meritos: number;
    verified: boolean;
    rating: number;
  };
  stats: {
    views: number;
    likes: number;
    rating: number;
    reviewCount: number;
    isPopular: boolean;
    isSustainable: boolean;
  };
  type: 'product' | 'service';
  tags: string[];
  createdAt: string;
  location?: string;
  isFavorited?: boolean;
  stock: number;
  consciousnessLevel?: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
  ayniImpact?: {
    bienComun: number;
    reciprocidad: number;
    sostenibilidad: number;
  };
}

// 🌟 Sample Enhanced Products with Conscious Details
const ENHANCED_SAMPLE_PRODUCTS: EnhancedMarketplaceItem[] = [
  {
    id: 'conscious-yoga-1',
    title: 'Clases de Yoga Consciente y Meditación',
    description: 'Transforma tu bienestar con sesiones de yoga personalizadas que integran mindfulness, respiración consciente y filosofía Ayni para el equilibrio cuerpo-mente-espíritu.',
    price: 45,
    currency: 'LUKAS',
    category: 'Salud & Bienestar',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    ],
    seller: {
      id: 'seller-1',
      name: 'María Luz Wellness',
      avatar: 'https://i.pravatar.cc/150?img=5',
      isEmprendedorConfiable: true,
      ayniScore: 94,
      meritos: 2850,
      verified: true,
      rating: 4.9,
    },
    stats: {
      views: 1247,
      likes: 184,
      rating: 4.9,
      reviewCount: 67,
      isPopular: true,
      isSustainable: true,
    },
    type: 'service',
    tags: ['yoga', 'meditación', 'bienestar', 'ayni', 'consciencia'],
    createdAt: '2024-01-15T10:00:00Z',
    location: 'Santiago, Chile',
    isFavorited: false,
    stock: 12,
    consciousnessLevel: 'FLOURISHING',
    ayniImpact: {
      bienComun: 88,
      reciprocidad: 92,
      sostenibilidad: 85,
    },
  },
  {
    id: 'conscious-dev-2',
    title: 'Desarrollo Web Sostenible con Tecnologías Verdes',
    description: 'Crea aplicaciones web eficientes y ecológicas usando frameworks modernos, optimización energética y principios de diseño sostenible para el futuro digital.',
    price: 120,
    currency: 'LUKAS',
    category: 'Tecnología Social',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    ],
    seller: {
      id: 'seller-2',
      name: 'TechCoop Consciente',
      avatar: 'https://i.pravatar.cc/150?img=8',
      isEmprendedorConfiable: true,
      ayniScore: 89,
      meritos: 3200,
      verified: true,
      rating: 4.8,
    },
    stats: {
      views: 892,
      likes: 156,
      rating: 4.8,
      reviewCount: 43,
      isPopular: true,
      isSustainable: true,
    },
    type: 'service',
    tags: ['desarrollo', 'web', 'sostenible', 'green-tech', 'innovación'],
    createdAt: '2024-01-20T14:30:00Z',
    location: 'Online',
    isFavorited: true,
    stock: 8,
    consciousnessLevel: 'GROWING',
    ayniImpact: {
      bienComun: 79,
      reciprocidad: 84,
      sostenibilidad: 95,
    },
  },
  {
    id: 'conscious-garden-3',
    title: 'Kit de Huerto Urbano Orgánico Completo',
    description: 'Todo lo que necesitas para crear tu propio huerto urbano: semillas orgánicas, macetas biodegradables, tierra enriquecida y guía de cultivo sustentable.',
    price: 65,
    currency: 'LUKAS',
    category: 'Agricultura Consciente',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80',
    ],
    seller: {
      id: 'seller-3',
      name: 'Semillas de Ayni',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isEmprendedorConfiable: true,
      ayniScore: 96,
      meritos: 1890,
      verified: true,
      rating: 4.9,
    },
    stats: {
      views: 1156,
      likes: 203,
      rating: 4.9,
      reviewCount: 84,
      isPopular: true,
      isSustainable: true,
    },
    type: 'product',
    tags: ['huerto', 'orgánico', 'sostenible', 'urbano', 'autocultivo'],
    createdAt: '2024-01-18T09:15:00Z',
    location: 'Valparaíso, Chile',
    isFavorited: false,
    stock: 24,
    consciousnessLevel: 'TRANSCENDENT',
    ayniImpact: {
      bienComun: 94,
      reciprocidad: 87,
      sostenibilidad: 97,
    },
  },
];

// 🎨 Enhanced Product Card with Conscious Details
interface EnhancedProductCardProps {
  item: EnhancedMarketplaceItem;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
  onShare: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  item,
  onToggleFavorite,
  onAddToCart,
  onShare,
  onViewDetails,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAyniDetails, setShowAyniDetails] = useState(false);

  const consciousnessStyle = getConsciousnessStyle(item.consciousnessLevel);
  const categoryStyle = impactCategories.find(cat => cat.name === item.category);

  const handleActionClick = (e: React.MouseEvent, action: (id: string) => void) => {
    e.preventDefault();
    e.stopPropagation();
    action(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          border: `2px solid transparent`,
          transition: 'all 0.3s ease',
          '&:hover': {
            border: `2px solid ${consciousnessStyle.color}`,
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(consciousnessStyle.color, 0.3)}`,
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewDetails(item.id)}
      >
        {/* Consciousness Level Border */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: consciousnessStyle.gradient,
            zIndex: 2,
          }}
        />

        {/* Product Image with Enhanced System */}
        <Box sx={{ position: 'relative' }}>
          <ConsciousProductImage
            images={item.images}
            title={item.title}
            description={item.description}
            category={item.category}
            height={220}
            width="100%"
            showBadges={true}
            showHoverEffects={true}
            isPopular={item.stats.isPopular}
            isSustainable={item.stats.isSustainable}
            rating={item.stats.rating}
            borderRadius={0}
          />

          {/* Action Buttons Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 3,
                }}
              >
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionClick(e, onToggleFavorite)}
                    sx={{
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper,
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {item.isFavorited ? (
                      <Favorite sx={{ color: theme.palette.error.main }} fontSize="small" />
                    ) : (
                      <FavoriteBorder fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionClick(e, onShare)}
                    sx={{
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper,
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Share fontSize="small" />
                  </IconButton>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Consciousness Level Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              zIndex: 3,
            }}
          >
            <Chip
              icon={consciousnessStyle.icon}
              label={consciousnessStyle.name}
              size="small"
              sx={{
                backgroundColor: alpha(consciousnessStyle.color, 0.9),
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
              }}
            />
          </Box>
        </Box>

        {/* Product Content */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          {/* Title and Category */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 700,
                lineHeight: 1.3,
                color: 'text.primary',
                fontSize: '1.1rem',
              }}
            >
              {item.title}
            </Typography>
            <Chip
              label={item.category}
              size="small"
              sx={{
                backgroundColor: alpha(categoryStyle?.color || theme.palette.primary.main, 0.1),
                color: categoryStyle?.color || theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          </Stack>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {item.description}
          </Typography>

          {/* Seller Info */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Avatar
              src={item.seller.avatar}
              sx={{
                width: 32,
                height: 32,
                border: item.seller.verified ? `2px solid ${theme.palette.success.main}` : 'none',
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {item.seller.name}
                </Typography>
                {item.seller.verified && (
                  <VerifiedUser sx={{ fontSize: 16, color: 'success.main' }} />
                )}
                {item.seller.isEmprendedorConfiable && (
                  <Tooltip title="Emprendedor Confiable">
                    <EmojiEvents sx={{ fontSize: 16, color: 'warning.main' }} />
                  </Tooltip>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={`Ayni: ${item.seller.ayniScore}%`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {item.seller.meritos} méritos
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Stats Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Visibility fontSize="small" color="action" />
              <Typography variant="caption">{item.stats.views}</Typography>
              <Favorite fontSize="small" sx={{ color: 'error.main' }} />
              <Typography variant="caption">{item.stats.likes}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Star fontSize="small" sx={{ color: 'warning.main' }} />
              <Typography variant="caption" fontWeight={600}>
                {item.stats.rating} ({item.stats.reviewCount})
              </Typography>
            </Stack>
          </Stack>

          {/* Ayni Impact Meters */}
          {item.ayniImpact && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                Impacto Ayni
              </Typography>
              <Stack spacing={0.5}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Bien Común</Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {item.ayniImpact.bienComun}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.ayniImpact.bienComun}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Sostenibilidad</Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {item.ayniImpact.sostenibilidad}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.ayniImpact.sostenibilidad}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.success.main,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          )}

          {/* Price and Actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
            <Box>
              <Typography variant="h5" component="span" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {item.price}
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 0.5, color: 'text.secondary' }}>
                {item.currency}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                {item.stock > 0 ? `${item.stock} disponibles` : 'Agotado'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<ShoppingCart />}
              onClick={(e) => handleActionClick(e, onAddToCart)}
              disabled={item.stock === 0}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: consciousnessStyle.gradient,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: consciousnessStyle.glow,
                },
              }}
            >
              Agregar
            </Button>
          </Stack>
        </CardContent>

        {/* Image Gallery Thumbnail */}
        {item.images.length > 1 && (
          <Box sx={{ p: 2, pt: 0 }}>
            <ConsciousProductGallery
              images={item.images}
              title={item.title}
              description={item.description}
              category={item.category}
              maxImages={3}
              onImageSelect={setSelectedImageIndex}
              selectedIndex={selectedImageIndex}
            />
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

// 🌟 Main Enhanced Marketplace Landing Component
interface EnhancedMarketplaceLandingProps {
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onShare?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export const EnhancedMarketplaceLanding: React.FC<EnhancedMarketplaceLandingProps> = ({
  onToggleFavorite = (id) => console.log('Toggle favorite:', id),
  onAddToCart = (id) => console.log('Add to cart:', id),
  onShare = (id) => console.log('Share:', id),
  onViewDetails = (id) => console.log('View details:', id),
}) => {
  const theme = useTheme();
  const [featuredProducts] = useState<EnhancedMarketplaceItem[]>(ENHANCED_SAMPLE_PRODUCTS);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in={isVisible} timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2,
            }}
          >
            🌟 Marketplace Consciente CoomÜnity
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Descubre productos y servicios que honran la filosofía Ayni,
            promoviendo el Bien Común y la reciprocidad consciente en cada intercambio.
          </Typography>
        </Box>
      </Fade>

      {/* Statistics Row */}
      <Fade in={isVisible} timeout={1000}>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { icon: <Groups />, label: 'Emprendedores Confiables', value: '248+', color: theme.palette.primary.main },
            { icon: <Eco />, label: 'Productos Sostenibles', value: '1,342', color: theme.palette.success.main },
            { icon: <AutoAwesome />, label: 'Méritos Generados', value: '24.8K', color: theme.palette.warning.main },
            { icon: <WaterDrop />, label: 'Proyectos de Impacto', value: '127', color: theme.palette.info.main },
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${alpha(stat.color, 0.3)}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: alpha(stat.color, 0.1),
                      color: stat.color,
                      width: 48,
                      height: 48,
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" fontWeight={800} color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Fade>

      {/* Featured Products Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          ✨ Productos Destacados
        </Typography>

        <Grid container spacing={4}>
          {featuredProducts.map((item, index) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <EnhancedProductCard
                  item={item}
                  onToggleFavorite={onToggleFavorite}
                  onAddToCart={onAddToCart}
                  onShare={onShare}
                  onViewDetails={onViewDetails}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Fade in={isVisible} timeout={1200}>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            🚀 ¿Listo para unirte a la economía consciente?
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              Explorar Marketplace
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'scale(1.05)',
                },
              }}
            >
              Convertirme en Vendedor
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Container>
  );
};

export default EnhancedMarketplaceLanding;
