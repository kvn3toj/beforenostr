import React, { useState, useRef } from 'react';
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
  Slide,
  Stack,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  Star,
  Verified,
  LocationOn,
  Share,
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Visibility,
  AccessTime,
  LocalOffer,
  TrendingUp,
  FlashOn,
  CheckCircle,
  ShoppingCart,
  Chat,
  MoreVert,
  ZoomIn,
  AutoAwesome,
  Fire,
  WorkspacePremium,
  Schedule,
  DeliveryDining,
} from '@mui/icons-material';

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  location: string;
  rating: number;
  reviewCount?: number;
  seller: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    isOnline?: boolean;
    responseTime?: string;
    viewCount?: number;
    favoriteCount?: number;
    rating?: number;
  };
  image: string;
  images?: string[];
  isFavorited?: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  variant?: 'recommended' | 'category' | 'featured' | 'trending' | 'compact';
  tags?: string[];
  featured?: boolean;
  trending?: boolean;
  discount?: number;
  deliveryTime?: string;
  hasVideo?: boolean;
  is24Hours?: boolean;
  isUrgent?: boolean;
  viewMode?: 'grid' | 'list';
  showQuickActions?: boolean;
  enableHover?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  currency,
  location,
  rating,
  reviewCount = 0,
  seller,
  image,
  images = [],
  isFavorited = false,
  onToggleFavorite,
  onClick,
  variant = 'recommended',
  tags = [],
  featured = false,
  trending = false,
  discount,
  deliveryTime,
  hasVideo = false,
  is24Hours = false,
  isUrgent = false,
  viewMode = 'grid',
  showQuickActions = true,
  enableHover = true,
  size = 'medium',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Configuraciones por tamaño
  const sizeConfig = {
    small: {
      height: 200,
      imageHeight: 100,
      padding: 1,
      titleVariant: 'body2' as const,
      priceVariant: 'subtitle2' as const,
    },
    medium: {
      height: 280,
      imageHeight: 140,
      padding: 1.5,
      titleVariant: 'subtitle1' as const,
      priceVariant: 'h6' as const,
    },
    large: {
      height: 350,
      imageHeight: 180,
      padding: 2,
      titleVariant: 'h6' as const,
      priceVariant: 'h5' as const,
    },
  };

  const config = sizeConfig[size];

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${price.toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getVariantStyles = () => {
    const baseStyles = {
      cursor: 'pointer',
      height: config.height,
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: 3,
    };

    const variantStyles = {
      recommended: {
        ...baseStyles,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': enableHover
          ? {
              transform: 'translateY(-6px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              borderColor: '#1976d2',
            }
          : {},
      },
      category: {
        ...baseStyles,
        border: '1px solid #f0f0f0',
        backgroundColor: '#fafafa',
        '&:hover': enableHover
          ? {
              backgroundColor: '#f5f5f5',
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            }
          : {},
      },
      featured: {
        ...baseStyles,
        border: '2px solid #FFD700',
        background: 'linear-gradient(135deg, #FFF9C4 0%, #FFFFFF 100%)',
        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
        '&:hover': enableHover
          ? {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: '0 12px 30px rgba(255, 215, 0, 0.4)',
            }
          : {},
      },
      trending: {
        ...baseStyles,
        border: '2px solid #FF6B6B',
        background: 'linear-gradient(135deg, #FFE3E3 0%, #FFFFFF 100%)',
        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
        '&:hover': enableHover
          ? {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: '0 12px 30px rgba(255, 107, 107, 0.4)',
            }
          : {},
      },
      compact: {
        ...baseStyles,
        height: 180,
        border: '1px solid #e8e8e8',
        '&:hover': enableHover
          ? {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
          : {},
      },
    };

    return variantStyles[variant];
  };

  // Vista de lista
  if (viewMode === 'list') {
    return (
      <Card
        ref={cardRef}
        onClick={() => onClick(id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          p: 2,
          height: 160,
          transition: 'all 0.3s ease',
          borderRadius: 2,
          border: featured ? '2px solid #FFD700' : '1px solid #e0e0e0',
          background: featured
            ? 'linear-gradient(135deg, #FFF9C4 0%, #FFFFFF 100%)'
            : trending
              ? 'linear-gradient(135deg, #FFE3E3 0%, #FFFFFF 100%)'
              : 'white',
          '&:hover': enableHover
            ? {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                borderColor: '#1976d2',
              }
            : {},
        }}
        className="card-micro-interactive"
      >
        {/* Imagen */}
        <Box
          sx={{
            width: 120,
            height: '100%',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f5f5f5',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Overlays y badges */}
          <StatusBadges
            featured={featured}
            trending={trending}
            discount={discount}
            is24Hours={is24Hours}
            isUrgent={isUrgent}
            hasVideo={hasVideo}
            size="small"
          />

          {/* Estado online del vendedor */}
          {seller.isOnline && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 6,
                left: 6,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          )}
        </Box>

        {/* Contenido */}
        <Box sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column' }}>
          {/* Header con título y favorito */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                lineHeight: 1.2,
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </Typography>
            <Zoom in={isHovered || isFavorited}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(id);
                }}
                sx={{ ml: 1 }}
                className="icon-micro-interactive"
              >
                {isFavorited ? (
                  <Favorite sx={{ color: '#FF4444' }} />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </Zoom>
          </Box>

          {/* Descripción */}
          {description && (
            <Typography
              variant="body2"
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
          )}

          {/* Tags (solo los primeros 3) */}
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
              {tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '10px', height: 20 }}
                />
              ))}
            </Box>
          )}

          {/* Rating y estadísticas */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating value={rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              ({reviewCount})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Visibility sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {seller.viewCount || 0}
              </Typography>
            </Box>
          </Box>

          {/* Precio y seller info */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <PriceDisplay
              price={price}
              originalPrice={originalPrice}
              currency={currency}
              discount={discount}
              size="medium"
            />

            <SellerInfo
              seller={seller}
              location={location}
              deliveryTime={deliveryTime}
              compact
            />
          </Box>
        </Box>
      </Card>
    );
  }

  // Vista de grilla (predeterminada)
  return (
    <Card
      ref={cardRef}
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={getVariantStyles()}
      className="card-micro-interactive"
    >
      {/* Imagen del producto */}
      <Box
        sx={{
          height: config.imageHeight,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* Imagen principal con lazy loading */}
        <Box
          component="img"
          src={image}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0,
          }}
        />

        {/* Skeleton mientras carga */}
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

        {/* Overlay de hover con acciones rápidas */}
        <Fade in={isHovered && showQuickActions}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Stack direction="row" spacing={1}>
              <Tooltip title="Vista rápida">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'white' },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickPreview(true);
                  }}
                >
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Compartir">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'white' },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implementar compartir
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title="Contactar">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'white' },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implementar chat
                  }}
                >
                  <Chat />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Fade>

        {/* Badges de estado */}
        <StatusBadges
          featured={featured}
          trending={trending}
          discount={discount}
          is24Hours={is24Hours}
          isUrgent={isUrgent}
          hasVideo={hasVideo}
          size={size}
        />

        {/* Botón de favorito */}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Zoom in={isHovered || isFavorited}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(id);
              }}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'white' },
                width: 36,
                height: 36,
              }}
              className="icon-micro-interactive"
            >
              {isFavorited ? (
                <Favorite sx={{ color: '#FF4444' }} />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
          </Zoom>
        </Box>

        {/* Rating badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Star sx={{ fontSize: 16, color: '#FFD700' }} />
          <Typography variant="body2" fontWeight="bold">
            {rating}
          </Typography>
          {reviewCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              ({reviewCount})
            </Typography>
          )}
        </Box>

        {/* Estado online del vendedor */}
        {seller.isOnline && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              border: '3px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        )}
      </Box>

      {/* Contenido de la tarjeta */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: config.padding,
          '&:last-child': { pb: config.padding },
        }}
      >
        {/* Título */}
        <Typography
          variant={config.titleVariant}
          fontWeight="bold"
          sx={{
            mb: 1,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: size === 'small' ? 32 : size === 'medium' ? 40 : 48,
          }}
        >
          {title}
        </Typography>

        {/* Descripción (solo en tamaños medium y large) */}
        {description && size !== 'small' && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: size === 'large' ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: size === 'large' ? 1 : 'none',
            }}
          >
            {description}
          </Typography>
        )}

        {/* Tags (solo en large) */}
        {tags.length > 0 && size === 'large' && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '10px', height: 20 }}
              />
            ))}
          </Box>
        )}

        {/* Precio */}
        <Box sx={{ mb: 1 }}>
          <PriceDisplay
            price={price}
            originalPrice={originalPrice}
            currency={currency}
            discount={discount}
            size={size}
          />
        </Box>

        {/* Información del vendedor */}
        <SellerInfo
          seller={seller}
          location={location}
          deliveryTime={deliveryTime}
          compact={size === 'small'}
        />
      </CardContent>

      {/* Progreso de carga de imagen */}
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
  );
};

// 🏷️ Componente de badges de estado
interface StatusBadgesProps {
  featured: boolean;
  trending: boolean;
  discount?: number;
  is24Hours: boolean;
  isUrgent: boolean;
  hasVideo: boolean;
  size: 'small' | 'medium' | 'large';
}

const StatusBadges: React.FC<StatusBadgesProps> = ({
  featured,
  trending,
  discount,
  is24Hours,
  isUrgent,
  hasVideo,
  size,
}) => {
  const badgeSize = size === 'small' ? 'small' : 'medium';

  return (
    <>
      {/* Badges superiores izquierdos */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          zIndex: 2,
        }}
      >
        {featured && (
          <Chip
            icon={<WorkspacePremium />}
            label="Destacado"
            size={badgeSize}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
        {trending && (
          <Chip
            icon={<TrendingUp />}
            label="Tendencia"
            size={badgeSize}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
        {isUrgent && (
          <Chip
            icon={<FlashOn />}
            label="Urgente"
            size={badgeSize}
            sx={{
              background: 'linear-gradient(45deg, #FF4444, #FF6666)',
              color: 'white',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
      </Box>

      {/* Badges superiores derechos */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 48, // Espacio para el botón de favorito
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          alignItems: 'flex-end',
          zIndex: 2,
        }}
      >
        {discount && (
          <Chip
            label={`-${discount}%`}
            size={badgeSize}
            sx={{
              backgroundColor: '#FF4444',
              color: 'white',
              fontWeight: 'bold',
              fontSize: size === 'small' ? '10px' : '12px',
            }}
          />
        )}
        {is24Hours && (
          <Chip
            icon={<Schedule />}
            label="24h"
            size={badgeSize}
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
      </Box>

      {/* Badge de video */}
      {hasVideo && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 40, // Arriba del rating
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 2,
          }}
        >
          <PlayArrow sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant="caption" color="white" fontWeight="bold">
            Video
          </Typography>
        </Box>
      )}
    </>
  );
};

// 💰 Componente de precio
interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency: string;
  discount?: number;
  size: 'small' | 'medium' | 'large';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency,
  discount,
  size,
}) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${price.toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  const priceVariant =
    size === 'small' ? 'subtitle2' : size === 'medium' ? 'h6' : 'h5';

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
    >
      {/* Precio original tachado */}
      {originalPrice && (
        <Typography
          variant="body2"
          sx={{
            textDecoration: 'line-through',
            color: 'text.secondary',
            fontSize: size === 'small' ? '12px' : '14px',
          }}
        >
          {formatPrice(originalPrice, currency)}
        </Typography>
      )}

      {/* Precio actual */}
      <Typography
        variant={priceVariant}
        fontWeight="bold"
        color="primary"
        sx={{
          fontSize:
            size === 'small' ? '16px' : size === 'medium' ? '18px' : '24px',
        }}
      >
        {formatPrice(price, currency)}
      </Typography>

      {/* Badge de descuento */}
      {discount && (
        <Chip
          label={`${discount}% OFF`}
          size="small"
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '10px',
            height: 20,
          }}
        />
      )}
    </Box>
  );
};

// 👤 Componente de información del vendedor
interface SellerInfoProps {
  seller: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    isOnline?: boolean;
    responseTime?: string;
    rating?: number;
  };
  location: string;
  deliveryTime?: string;
  compact?: boolean;
}

const SellerInfo: React.FC<SellerInfoProps> = ({
  seller,
  location,
  deliveryTime,
  compact = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: compact ? 'center' : 'flex-start',
        gap: 1,
      }}
    >
      {/* Info del vendedor */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            seller.isOnline ? (
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  border: '2px solid white',
                }}
              />
            ) : null
          }
        >
          <Avatar
            src={seller.avatar}
            sx={{ width: compact ? 24 : 32, height: compact ? 24 : 32 }}
          />
        </Badge>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant={compact ? 'caption' : 'body2'}
              fontWeight="bold"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {seller.name}
            </Typography>
            {seller.verified && (
              <Verified
                sx={{ fontSize: compact ? 12 : 16, color: '#1976d2' }}
              />
            )}
          </Box>

          {!compact && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {seller.username}
            </Typography>
          )}

          {seller.responseTime && !compact && (
            <Typography variant="caption" color="text.secondary">
              Responde en {seller.responseTime}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Info de ubicación y entrega */}
      <Box sx={{ textAlign: 'right', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <LocationOn
            sx={{ fontSize: compact ? 12 : 14, color: 'text.secondary' }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 80,
            }}
          >
            {location.split(',')[0]}
          </Typography>
        </Box>

        {deliveryTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DeliveryDining
              sx={{ fontSize: compact ? 12 : 14, color: 'text.secondary' }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 80,
              }}
            >
              {deliveryTime}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
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
