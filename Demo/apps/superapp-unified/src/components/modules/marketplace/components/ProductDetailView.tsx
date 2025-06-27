import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Rating,
  Avatar,
  Badge,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Zoom,
  Container,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  StarBorder as Star,
  Verified,
  LocationOn,
  AccessTime,
  Language,
  Message as MessageIcon,
  VideoCall,
  Phone,
  Share,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Schedule,
  Security,
  Support,
  Description,
  Reviews,
  Person,
  LocalOffer,
  LocalShipping,
  WorkspacePremium,
  TrendingUp,
  OnlinePredictionOutlined,
  CalendarToday,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import { ProductGallery } from './ProductGallery';
import { ProductActions } from './ProductActions';
import { SellerInfoCard } from './SellerInfoCard';
import { ProductReviews } from './ProductReviews';
import { RelatedProducts } from './RelatedProducts';
import { Product } from '../../../../types/marketplace';
import StatusBadges from './StatusBadges';
import { MarketplaceReviewModal } from './MarketplaceReviewModal';
import { ChatModal } from './ChatModal';
import { useMatch } from '@/hooks/useMatch';
import { useConfirmMatch } from '@/hooks/useConfirmMatch';
import type { Message } from '../../../../types/marketplace';
import { useAuth } from '../../../../contexts/AuthContext';
import { ConsciousProductImage, ConsciousProductGallery } from './ConsciousProductImageSystem';
import { ConsciousLoadingState } from '../../../ui/enhanced/ConsciousLoadingState';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailViewProps {
  product: Product;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  matchId?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  isFavorited,
  onToggleFavorite,
  matchId,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(
    product.deliveryOptions && product.deliveryOptions.length > 0 ? product.deliveryOptions[0].id : ''
  );
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { user } = useAuth();

  // 🌟 Aria: Enhanced Loading State with Consciousness
  const [isLoading, setIsLoading] = useState(false);
  const [consciousLoadingPhase, setConsciousLoadingPhase] = useState<'entering' | 'processing' | 'manifesting' | 'complete'>('entering');

  const {
    data: matchData,
    isLoading: isMatchLoading,
    error: matchError,
  } = useMatch(matchId || '');

    const confirmMatchMutation = useConfirmMatch();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 🎨 Zeno + Aria: Enhanced Image Gallery Integration
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleImageModalOpen = () => {
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  // 🌱 ANA: Conscious Product Loading with Philosophy
  const handleConsciousAction = async (action: () => Promise<void>, actionName: string) => {
    setIsLoading(true);
    setConsciousLoadingPhase('entering');

    try {
      // Simulate conscious processing phases
      setTimeout(() => setConsciousLoadingPhase('processing'), 300);
      setTimeout(() => setConsciousLoadingPhase('manifesting'), 600);

      await action();

      setConsciousLoadingPhase('complete');
      setTimeout(() => {
        setIsLoading(false);
        setConsciousLoadingPhase('entering');
      }, 500);
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      setIsLoading(false);
      setConsciousLoadingPhase('entering');
    }
  };

  // Format price helper
  const formatPrice = (price: number, currency: string) => {
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice.toLocaleString()}`;
    }
    return `$${safePrice.toLocaleString()}`;
  };

  // Get safe tags for display
  const safeTags: string[] = Array.isArray(product.tags)
    ? product.tags
    : typeof product.tags === 'string'
    ? product.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  // Calculate aspect ratings from reviews
  const averageAspectRating = product.reviews?.length
    ? product.reviews.reduce(
        (acc, review) => {
          if (review.aspects) {
            acc.communication += review.aspects.communication;
            acc.quality += review.aspects.quality;
            acc.delivery += review.aspects.delivery;
            acc.value += review.aspects.value;
            acc.count += 1;
          }
          return acc;
        },
        { communication: 0, quality: 0, delivery: 0, value: 0, count: 0 }
      )
    : null;

  const aspectRatings = averageAspectRating
    ? {
        communication:
          averageAspectRating.communication / averageAspectRating.count,
        quality: averageAspectRating.quality / averageAspectRating.count,
        delivery: averageAspectRating.delivery / averageAspectRating.count,
        value: averageAspectRating.value / averageAspectRating.count,
      }
    : null;

  const handleConfirm = (role: 'buyer' | 'seller') => {
    if (matchId) {
      if (role === 'buyer') confirmMatchMutation.mutate();
      if (role === 'seller') confirmMatchMutation.mutate();
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* 🌟 Conscious Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ConsciousLoadingState
              phase={consciousLoadingPhase}
              message={
                consciousLoadingPhase === 'entering' ? 'Iniciando conexión consciente...' :
                consciousLoadingPhase === 'processing' ? 'Procesando con principios de Ayni...' :
                consciousLoadingPhase === 'manifesting' ? 'Manifestando el Bien Común...' :
                '¡Proceso completado con consciencia!'
              }
              showPhilosophy={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* 🎨 Enhanced Product Gallery Section */}
          <Grid item xs={12} md={7}>
            <Fade in timeout={600}>
              <Box>
                {/* 🖼️ Main Conscious Product Image */}
                <Box sx={{ mb: 2 }}>
                  <ConsciousProductImage
                    images={product.images}
                    title={product.title}
                    description={product.description}
                    category={product.category}
                    height={400}
                    width="100%"
                    showBadges={true}
                    showHoverEffects={true}
                    isPopular={product.featured}
                    isSustainable={product.sustainabilityScore > 70}
                    rating={product.rating}
                    onImageClick={handleImageModalOpen}
                    borderRadius={3}
                  />
                </Box>

                {/* 🎨 Enhanced Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                  <Box sx={{ mt: 2 }}>
                    <ConsciousProductGallery
                      images={product.images}
                      title={product.title}
                      description={product.description}
                      category={product.category}
                      maxImages={6}
                      selectedIndex={selectedImageIndex}
                      onImageSelect={handleImageSelect}
                    />
                  </Box>
                )}

                {/* 🌟 Original Gallery Component for Advanced Features */}
                <Box sx={{ mt: 3 }}>
                  <ProductGallery
                    images={product.images}
                    title={product.title}
                    hasVideo={false}
                  />
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Product Details Section */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={800} style={{ transitionDelay: '200ms' }}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                {/* Enhanced Header with Consciousness Indicators */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {product.title}
                  </Typography>

                  {/* 🏆 Enhanced Status Badges */}
                  <Box sx={{ mb: 2 }}>
                    <StatusBadges product={product} />
                  </Box>

                  {/* 💰 Enhanced Price Display */}
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      ü {product.price?.toLocaleString() || 'Precio por consultar'}
                    </Typography>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: 'line-through',
                          color: 'text.secondary',
                        }}
                      >
                        ü {product.originalPrice.toLocaleString()}
                      </Typography>
                    )}
                  </Stack>

                  {/* ⭐ Enhanced Rating Display */}
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Rating value={product.rating} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({product.reviewCount} reseñas)
                    </Typography>
                    <Chip
                      label={`Nivel: ${product.consciousnessLevel || 'En crecimiento'}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                {/* Enhanced Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ProductActions
                    product={product}
                    isFavorited={isFavorited}
                    onToggleFavorite={onToggleFavorite}
                    onConsciousAction={handleConsciousAction}
                  />
                </motion.div>

                {/* Enhanced Seller Information */}
                <Box sx={{ mt: 4 }}>
                  <SellerInfoCard seller={product.seller} />
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Sección completa - Información del vendedor */}
        <Grid item xs={12}>
          <Fade in timeout={800} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ mt: 4 }}>
              <SellerInfoCard seller={product.seller} />
            </Box>
          </Fade>
        </Grid>

        {/* Sección completa - Tabs con información detallada */}
        <Grid item xs={12}>
          <Fade in timeout={1000} style={{ transitionDelay: '600ms' }}>
            <Box sx={{ mt: 4 }}>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '16px',
                    },
                  }}
                >
                  <Tab
                    icon={<Description />}
                    iconPosition="start"
                    label="Descripción"
                  />
                  <Tab
                    icon={<LocalOffer />}
                    iconPosition="start"
                    label="Qué incluye"
                  />
                  <Tab
                    icon={<Reviews />}
                    iconPosition="start"
                    label={`Reseñas (${product.reviewCount})`}
                  />
                  <Tab
                    icon={<Schedule />}
                    iconPosition="start"
                    label="Especificaciones"
                  />
                </Tabs>

                {/* Panel 1: Descripción completa */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ px: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.8,
                        whiteSpace: 'pre-line',
                        '& strong': { fontWeight: 'bold' },
                      }}
                    >
                      {product.fullDescription}
                    </Typography>

                    {product.features && product.features.length > 0 && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                          Características principales
                        </Typography>
                        <Grid container spacing={2}>
                          {product.features.map((feature, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  p: 1,
                                }}
                              >
                                <CheckCircle
                                  color="success"
                                  sx={{ fontSize: 20 }}
                                />
                                <Typography variant="body2">{feature}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </TabPanel>

                {/* Panel 2: Qué incluye */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ px: 3 }}>
                    {product.includes && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                          ✅ Incluido en el servicio
                        </Typography>
                        <List>
                          {product.includes.map((item, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckCircle color="success" />
                              </ListItemIcon>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {product.requirements && (
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                          📋 Requisitos del cliente
                        </Typography>
                        <List>
                          {product.requirements.map((requirement, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Description color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={requirement} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                </TabPanel>

                {/* Panel 3: Reseñas */}
                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ px: 3 }}>
                    {/* Resumen de calificaciones */}
                    <Grid container spacing={4} sx={{ mb: 4 }}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h2" fontWeight="bold">
                            {product.rating}
                          </Typography>
                          <Rating
                            value={product.rating}
                            precision={0.1}
                            readOnly
                            size="large"
                          />
                          <Typography variant="body2" color="text.secondary">
                            Basado en {product.reviewCount} reseñas
                          </Typography>
                        </Box>
                      </Grid>

                      {aspectRatings && (
                        <Grid item xs={12} md={8}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                            }}
                          >
                            {Object.entries(aspectRatings).map(
                              ([aspect, rating]) => (
                                <Box
                                  key={aspect}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      minWidth: 100,
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {aspect === 'communication'
                                      ? 'Comunicación'
                                      : aspect === 'quality'
                                        ? 'Calidad'
                                        : aspect === 'delivery'
                                          ? 'Entrega'
                                          : 'Valor'}
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={(rating / 5) * 100}
                                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{ minWidth: 30 }}
                                  >
                                    {rating.toFixed(1)}
                                  </Typography>
                                </Box>
                              )
                            )}
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    {/* Lista de reseñas */}
                    <ProductReviews reviews={product.reviews || []} />
                  </Box>
                </TabPanel>

                {/* Panel 4: Especificaciones */}
                <TabPanel value={tabValue} index={3}>
                  <Box sx={{ px: 3 }}>
                    {product.specifications && (
                      <Grid container spacing={3}>
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  border: '1px solid #f0f0f0',
                                  borderRadius: 2,
                                  textAlign: 'center',
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  {key}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {value}
                                </Typography>
                              </Paper>
                            </Grid>
                          )
                        )}
                      </Grid>
                    )}
                  </Box>
                </TabPanel>
              </Paper>
            </Box>
          </Fade>
        </Grid>

        {/* Productos relacionados */}
        <Grid item xs={12}>
          <Fade in timeout={1200} style={{ transitionDelay: '800ms' }}>
            <Box sx={{ mt: 6 }}>
              <RelatedProducts productId={product.id} currentProductId={product.id} category={product.category} sellerId={product.seller.id} />
            </Box>
          </Fade>
        </Grid>

        {/* Modales globales */}
        <MarketplaceReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          matchId={product.id}
        />
        <ChatModal
          open={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          matchId={product.id}
          sellerName={product.seller.name}
          currentUserId={user?.id || ''}
        />
      </Container>
    </Box>
  );
};
