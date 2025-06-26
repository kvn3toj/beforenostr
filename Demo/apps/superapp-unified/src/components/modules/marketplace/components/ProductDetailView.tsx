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
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(
    product.deliveryOptions[0]?.id || ''
  );
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: match, isLoading: matchLoading } = useMatch(matchId || '');
  const buyerConfirmMutation = useConfirmMatch(matchId || '', 'buyer');
  const sellerConfirmMutation = useConfirmMatch(matchId || '', 'seller');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const formatPrice = (price: number, currency: string) => {
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice.toLocaleString()}`;
    }
    return `$${safePrice.toLocaleString()}`;
  };

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
      if (role === 'buyer') buyerConfirmMutation.mutate();
      if (role === 'seller') sellerConfirmMutation.mutate();
    }
  };

  const handleReviewSubmit = (reviewData: any) => {
    setReviewModalOpen(false);
  };

  const handleSendMessage = (content: string) => {
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        senderId: 'yo',
        senderName: 'Yo',
        content,
        createdAt: new Date(),
        read: false,
      },
    ]);
  };

  return (
    <Grid container spacing={4}>
      {/* Columna izquierda - Galería */}
      <Grid item xs={12} md={7}>
        <Fade in timeout={500}>
          <Box>
            <ProductGallery
              images={product.images}
              title={product.title}
              hasVideo={product.hasVideo}
            />
            {/* BADGES FILOSÓFICOS Y DE ESTADO */}
            <Box sx={{ mt: 2 }}>
              <StatusBadges
                featured={!!product.featured}
                trending={!!product.trending}
                discount={product.discount}
                is24Hours={!!product.is24Hours}
                isUrgent={!!product.urgent}
                hasVideo={!!product.hasVideo}
                size="medium"
                ayniScore={product.seller.badges?.some(b => b.name.toLowerCase().includes('ayni')) ? 90 : undefined}
                meritos={product.seller.badges?.filter(b => b.category === 'achievement').length || 0}
                isSustainable={product.tags?.some(tag => tag.toLowerCase().includes('sostenible'))}
                isEmprendedorConfiable={product.seller.badges?.some(b => b.category === 'verification' && b.name.toLowerCase().includes('confiable'))}
              />
            </Box>
          </Box>
        </Fade>
      </Grid>

      {/* Columna derecha - Información del producto */}
      <Grid item xs={12} md={5}>
        <Zoom in timeout={700} style={{ transitionDelay: '200ms' }}>
          <Box>
            {/* Header del producto */}
            <Box sx={{ mb: 3 }}>
              {/* Badges ahora centralizados arriba */}
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                {product.title}
              </Typography>
              {/* MICROCOPY FILOSÓFICO */}
              <Typography variant="subtitle2" color="success.main" fontWeight={600} sx={{ mb: 1 }}>
                Cada intercambio aquí es un acto de Ayni: reciprocidad y Bien Común. Los Mëritos y Lükas reflejan tu contribución al ecosistema.
              </Typography>
              {/* Rating y estadísticas */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={product.rating} precision={0.1} readOnly />
                  <Typography variant="body1" fontWeight="bold">
                    {product.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({product.reviewCount} reseñas)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {(product.viewCount || 0).toLocaleString()} vistas
                  </Typography>
                  •
                  <Typography variant="body2" color="text.secondary">
                    {product.favoriteCount} favoritos
                  </Typography>
                </Box>
              </Box>

              {/* Precio */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {product.originalPrice && (
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      {formatPrice(product.originalPrice, product.currency)}
                    </Typography>
                  )}
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {formatPrice(product.price, product.currency)}
                    {product.discount && (
                      <Chip
                        label={`${product.discount}% OFF`}
                        color="error"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}
                  </Typography>
                </Box>

                {product.type === 'service' && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Precio por proyecto completo
                  </Typography>
                )}
              </Box>

              {/* Descripción corta */}
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {product.description}
              </Typography>

              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {product.tags.slice(0, 6).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    size="small"
                    clickable
                  />
                ))}
                {product.tags.length > 6 && (
                  <Chip
                    label={`+${product.tags.length - 6} más`}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                )}
              </Box>
            </Box>

            {/* Información de entrega */}
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Opciones de entrega
              </Typography>
              {product.deliveryOptions.map((option) => (
                <Box
                  key={option.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom:
                      option !==
                      product.deliveryOptions[
                        product.deliveryOptions.length - 1
                      ]
                        ? '1px solid #f0f0f0'
                        : 'none',
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {option.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description} • {option.estimatedTime}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {option.price > 0
                      ? formatPrice(option.price, product.currency)
                      : 'Gratis'}
                  </Typography>
                </Box>
              ))}
            </Paper>

            {/* Acciones principales */}
            <ProductActions
              product={product}
              selectedDeliveryOption={selectedDeliveryOption}
              onDeliveryOptionChange={setSelectedDeliveryOption}
              isFavorited={isFavorited}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Garantías y características destacadas */}
            <Paper elevation={1} sx={{ p: 2, mt: 3, borderRadius: 2 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Garantía de 30 días" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Support color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Soporte técnico incluido" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Revisiones ilimitadas" />
                </ListItem>
              </List>
            </Paper>

            {/* --- SECCIÓN DE CONFIRMACIÓN Y CALIFICACIÓN --- */}
            {matchId ? (
              <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 3 }} role="region" aria-label="Confirmación de entrega o finalización">
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Confirmación de Entrega/Finalización
                </Typography>
                {matchLoading ? (
                  <Typography variant="body2">Cargando estado...</Typography>
                ) : (
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button
                      variant={match?.buyerConfirmed ? 'contained' : 'outlined'}
                      color="success"
                      onClick={() => handleConfirm('buyer')}
                      disabled={!!match?.buyerConfirmed || buyerConfirmMutation.isLoading}
                      aria-label="Confirmar como comprador"
                    >
                      {match?.buyerConfirmed ? 'Confirmado (Comprador)' : 'Confirmar como Comprador'}
                    </Button>
                    <Button
                      variant={match?.sellerConfirmed ? 'contained' : 'outlined'}
                      color="info"
                      onClick={() => handleConfirm('seller')}
                      disabled={!!match?.sellerConfirmed || sellerConfirmMutation.isLoading}
                      aria-label="Confirmar como vendedor"
                    >
                      {match?.sellerConfirmed ? 'Confirmado (Vendedor)' : 'Confirmar como Vendedor'}
                    </Button>
                  </Stack>
                )}
                {(match?.buyerConfirmed && match?.sellerConfirmed) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setReviewModalOpen(true)}
                    aria-label="Calificar experiencia (Compartir mi Ayni)"
                  >
                    Compartir mi Ayni (Calificar experiencia)
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={() => setChatOpen(true)}
                  aria-label="Abrir chat con el vendedor"
                >
                  Chatear con el vendedor
                </Button>
              </Paper>
            ) : (
              <Paper elevation={1} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Para confirmar entrega o calificar, accede desde tu historial de compras o espera a que la transacción esté activa.
                </Typography>
              </Paper>
            )}
            {/* --- FIN SECCIÓN --- */}
          </Box>
        </Zoom>
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
                value={selectedTab}
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
              <TabPanel value={selectedTab} index={0}>
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
              <TabPanel value={selectedTab} index={1}>
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
              <TabPanel value={selectedTab} index={2}>
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
              <TabPanel value={selectedTab} index={3}>
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
        onSubmit={handleReviewSubmit}
        productName={product.title}
        sellerName={product.seller.name}
      />
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSend={handleSendMessage}
        sellerName={product.seller.name}
      />
    </Grid>
  );
};
