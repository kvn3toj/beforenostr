import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Rating,
  Card,
  CardContent,
  Tooltip,
  Fade,
  Zoom,
  Stack,
  Dialog,
  DialogContent,
  Button,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  Star,
  Verified,
  LocationOn,
  Share,
  Favorite,
  FavoriteBorder,
  Visibility,
  TrendingUp,
  FlashOn,
  CheckCircle,
  ShoppingCart,
  Chat,
  ZoomIn,
  Schedule,
  ChevronLeft,
  ChevronRight,
  AddShoppingCart,
} from '@mui/icons-material';
import {
  useUpdateMarketplaceItem,
  useDeleteMarketplaceItem,
} from '../../../../hooks/useRealBackendData';

interface ProductCardEnhancedProps {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  location: string;
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    responseTime?: string;
  };
  image: string;
  images: string[];
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  discount?: number;
  isFavorited?: boolean;
  viewMode?: 'grid' | 'list';
  type?: 'product' | 'service';
  onToggleFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
  onRefresh?: () => void;
  size?: 'small' | 'medium' | 'large';
  enableHover?: boolean;
  showQuickActions?: boolean;
}

const ProductCardEnhanced: React.FC<ProductCardEnhancedProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  currency,
  location,
  rating,
  reviewCount,
  seller,
  image,
  images,
  tags,
  featured = false,
  trending = false,
  discount,
  isFavorited = false,
  viewMode = 'grid',
  type = 'product',
  onToggleFavorite,
  onClick,
  onRefresh,
  size = 'medium',
  enableHover = true,
  showQuickActions = true,
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavoritedLocal, setIsFavoritedLocal] = useState(isFavorited);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleProductClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      navigate(`/marketplace/product/${id}`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);

    // Simular agregado al carrito
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsAddingToCart(false);

    // Mostrar feedback visual
    if (cardRef.current) {
      cardRef.current.style.transform = 'scale(1.05)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = '';
        }
      }, 150);
    }
  };

  const handleImageNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavoritedLocal(!isFavoritedLocal);
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const config = {
    imageHeight: size === 'small' ? 140 : size === 'medium' ? 180 : 220,
    spacing: size === 'small' ? 1 : size === 'medium' ? 1.5 : 2,
  };

  return (
    <>
      <Card
        ref={cardRef}
        onMouseEnter={() => enableHover && setIsHovered(true)}
        onMouseLeave={() => enableHover && setIsHovered(false)}
        onClick={handleProductClick}
        sx={{
          cursor: 'pointer',
          height: '100%',
          minHeight: { xs: 280, sm: 300, md: 320 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: '14px', sm: '16px', md: '18px' },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
          border: featured ? '2px solid #FFD700' : '1px solid #e0e0e0',
          background: '#ffffff',
          '&:hover': enableHover
            ? {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                borderColor: featured ? '#FFD700' : '#c0c0c0',
              }
            : {},
        }}
        className="card-micro-interactive marketplace-card marketplace-fade-in"
        data-testid="item-card"
      >
        {/* Imagen del producto mejorada */}
        <Box
          className="marketplace-card-image-container"
          sx={{
            height: config.imageHeight,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
          }}
        >
          {/* Imagen principal con navegación mejorada */}
          <Box
            component="img"
            src={
              images[currentImageIndex] ||
              image ||
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
            }
            alt={title}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop';
              setImageLoaded(true);
            }}
            className="marketplace-card-image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              opacity: imageLoaded ? 1 : 0,
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            }}
          />

          {/* Navegación de imágenes */}
          {images.length > 1 && isHovered && (
            <>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation('prev');
                }}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                }}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation('next');
                }}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>

              {/* Indicadores de imagen */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                {images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor:
                        index === currentImageIndex
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </Box>
            </>
          )}

          {/* Overlay de hover con acciones rápidas mejorado */}
          <Fade in={isHovered && showQuickActions} timeout={200}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                p: 1.5,
                backdropFilter: 'blur(2px)',
              }}
            >
              <Stack direction="row" spacing={1.5}>
                <Zoom
                  in={isHovered}
                  timeout={300}
                  style={{ transitionDelay: '50ms' }}
                >
                  <Tooltip title="Vista rápida" arrow>
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      onClick={handleQuickView}
                      className="icon-micro-interactive"
                    >
                      <ZoomIn />
                    </IconButton>
                  </Tooltip>
                </Zoom>

                <Zoom
                  in={isHovered}
                  timeout={300}
                  style={{ transitionDelay: '100ms' }}
                >
                  <Tooltip title="Agregar al carrito" arrow>
                    <IconButton
                      size="small"
                      disabled={isAddingToCart}
                      sx={{
                        backgroundColor: isAddingToCart
                          ? 'rgba(76, 175, 80, 0.9)'
                          : 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: isAddingToCart ? 'white' : 'inherit',
                        '&:hover': {
                          backgroundColor: isAddingToCart
                            ? 'rgba(76, 175, 80, 1)'
                            : '#4CAF50',
                          color: 'white',
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      onClick={handleAddToCart}
                      className="icon-micro-interactive"
                    >
                      {isAddingToCart ? <CheckCircle /> : <AddShoppingCart />}
                    </IconButton>
                  </Tooltip>
                </Zoom>

                <Zoom
                  in={isHovered}
                  timeout={300}
                  style={{ transitionDelay: '150ms' }}
                >
                  <Tooltip title="Contactar vendedor" arrow>
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(37, 211, 102, 0.95)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        '&:hover': {
                          backgroundColor: '#25d366',
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('💬 Contactar:', seller.name);
                      }}
                      className="icon-micro-interactive"
                    >
                      <Chat />
                    </IconButton>
                  </Tooltip>
                </Zoom>
              </Stack>
            </Box>
          </Fade>

          {/* Botón de favorito */}
          <IconButton
            size="small"
            onClick={handleToggleFavorite}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isFavoritedLocal ? (
              <Favorite sx={{ color: '#FF4444' }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>

          {/* Badges de estado */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {featured && (
              <Chip
                label="Destacado"
                size="small"
                sx={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}
              />
            )}
            {trending && (
              <Chip
                icon={<TrendingUp />}
                label="Tendencia"
                size="small"
                sx={{
                  backgroundColor: '#FF6B6B',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            )}
            {discount && (
              <Chip
                label={`-${discount}%`}
                size="small"
                sx={{
                  backgroundColor: '#FF4444',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}
              />
            )}
          </Box>

          {/* Loading skeleton */}
          {!imageLoaded && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          )}
        </Box>

        {/* Contenido de la card */}
        <CardContent
          sx={{
            p: config.spacing,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Título y rating */}
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 0.5,
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={rating} readOnly size="small" />
              <Typography variant="caption" color="text.secondary">
                ({reviewCount})
              </Typography>
            </Box>
          </Box>

          {/* Descripción */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1.5,
              flex: 1,
            }}
          >
            {description}
          </Typography>

          {/* Precio */}
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {currency === 'ü' || currency === 'Lükas' ? 'ü' : '$'}{' '}
                {price.toLocaleString()}
              </Typography>
              {originalPrice && originalPrice > price && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {currency === 'ü' || currency === 'Lükas' ? 'ü' : '$'}{' '}
                  {originalPrice.toLocaleString()}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Información del vendedor */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}
          >
            <Avatar src={seller.avatar} sx={{ width: 32, height: 32 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {seller.name}
                </Typography>
                {seller.verified && (
                  <Verified sx={{ fontSize: 16, color: '#1976d2' }} />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                📍 {location}
              </Typography>
            </Box>
          </Box>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '10px', height: 20 }}
                />
              ))}
            </Box>
          )}
        </CardContent>

        {/* Progress bar de carga */}
        {!imageLoaded && (
          <LinearProgress
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
            }}
          />
        )}
      </Card>

      {/* Modal de Vista Rápida */}
      <Dialog
        open={showQuickView}
        onClose={() => setShowQuickView(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', height: 400 }}>
            {/* Galería de imágenes */}
            <Box
              sx={{ flex: 1, position: 'relative', backgroundColor: '#f5f5f5' }}
            >
              <Box
                component="img"
                src={images[currentImageIndex] || image}
                alt={title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Navegación de imágenes en modal */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Información del producto */}
            <Box sx={{ flex: 1, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {description}
              </Typography>

              <Typography
                variant="h5"
                color="primary"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                {currency === 'ü' || currency === 'Lükas' ? 'ü' : '$'}{' '}
                {price.toLocaleString()}
              </Typography>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <Rating value={rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({reviewCount} reseñas)
                </Typography>
              </Box>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
                <Avatar src={seller.avatar} sx={{ width: 32, height: 32 }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {seller.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {seller.username}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddShoppingCart />}
                  sx={{ borderRadius: 2 }}
                >
                  Agregar al carrito
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Chat />}
                  sx={{ borderRadius: 2 }}
                >
                  Contactar vendedor
                </Button>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Animaciones CSS
const styles = `
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ProductCardEnhanced;
