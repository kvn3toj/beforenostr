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
  Slide,
  Stack,
  Badge,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
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
  Edit,
  Delete,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  useUpdateMarketplaceItem,
  useDeleteMarketplaceItem,
} from '../../../../hooks/useRealBackendData';
import { EditItemModal } from './EditItemModal';

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
    id?: string; // Added seller ID for authorization
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
  // Additional props for edit/delete functionality
  type?: 'product' | 'service';
  onRefresh?: () => void; // Callback to refresh the marketplace data
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
  type = 'product',
  onRefresh,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Hooks for edit/delete functionality
  const updateItemMutation = useUpdateMarketplaceItem();
  const deleteItemMutation = useDeleteMarketplaceItem();

  // Authorization logic - check if current user owns this item
  const isOwner = user?.id === seller?.id;

  const handleCardClick = () => {
    // Usar React Router para navegar a la página de detalle
    navigate(`/marketplace/product/${id}`);
    // También llamar al onClick original si existe
    if (onClick) {
      onClick(id);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteItemMutation.mutateAsync(id);
      setDeleteDialogOpen(false);
      // Refresh the marketplace data if callback provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Error handling is managed by the mutation hook
    }
  };

  const handleEditSave = async () => {
    // This function is called by EditItemModal on successful update
    // The EditItemModal handles the actual API call
    setEditModalOpen(false);
    // Refresh the marketplace data if callback provided
    if (onRefresh) {
      onRefresh();
    }
  };

  // Configuraciones por tamaño
  const sizeConfig = {
    small: {
      height: 280,
      imageHeight: 120,
      padding: 1.5,
      titleVariant: 'body1' as const,
      priceVariant: 'subtitle1' as const,
    },
    medium: {
      height: 340,
      imageHeight: 180,
      padding: 2,
      titleVariant: 'h6' as const,
      priceVariant: 'h6' as const,
    },
    large: {
      height: 400,
      imageHeight: 220,
      padding: 2.5,
      titleVariant: 'h5' as const,
      priceVariant: 'h5' as const,
    },
  };

  const config = sizeConfig[size];

  const formatPrice = (price: number, currency: string) => {
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice.toLocaleString()}`;
    }
    return `$${safePrice.toLocaleString()}`;
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
      <>
        <Card
          ref={cardRef}
          onClick={handleCardClick}
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
          data-testid="item-card"
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
                backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
              onError={() => {
                // Si hay error en el background image, aplicar imagen de fallback
                console.warn('Error loading background image for:', title);
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
          <Box
            sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column' }}
          >
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {/* Edit/Delete Menu - Only for owners */}
                {isOwner && (
                  <Zoom in={isHovered}>
                    <IconButton
                      onClick={handleMenuOpen}
                      size="small"
                      sx={{ ml: 1 }}
                      className="icon-micro-interactive"
                      data-testid="item-options-menu"
                    >
                      <MoreVert />
                    </IconButton>
                  </Zoom>
                )}
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
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}
              >
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

        {/* Owner Actions Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 2,
            },
          }}
        >
          <MenuItem onClick={handleEditClick} data-testid="edit-item-button">
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleDeleteClick}
            sx={{ color: 'error.main' }}
            data-testid="delete-item-button"
          >
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Eliminar</ListItemText>
          </MenuItem>
        </Menu>

        {/* Edit Modal */}
        {editModalOpen && (
          <EditItemModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSuccess={handleEditSave}
            item={{
              id,
              title,
              description: description || '',
              type: type || 'SERVICE',
              priceUnits: price || 0,
              priceToins: originalPrice || 0,
              currency: currency || 'LUKAS',
              location,
              tags: tags || [],
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Esta acción no se puede deshacer
            </Alert>
            <Typography>
              ¿Estás seguro de que deseas eliminar "{title}"?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Se eliminará permanentemente de CoomÜnity Marketplace.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              disabled={deleteItemMutation.isPending}
            >
              {deleteItemMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Vista de grilla (predeterminada)
  return (
    <>
      <Card
        ref={cardRef}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          ...getVariantStyles(),
          height: '100%',
          minHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: '14px', sm: '16px', md: '18px' },
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
          border: featured
            ? '2px solid #FFD700'
            : trending
              ? '2px solid #FF6B6B'
              : '1px solid rgba(0, 0, 0, 0.04)',
          background: featured
            ? 'linear-gradient(135deg, #FFF9C4 0%, #FFFFFF 100%)'
            : trending
              ? 'linear-gradient(135deg, #FFE3E3 0%, #FFFFFF 100%)'
              : '#ffffff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': enableHover
            ? {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                borderColor: featured
                  ? '#FFD700'
                  : trending
                    ? '#FF6B6B'
                    : 'rgba(116, 0, 86, 0.1)',
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
            height: {
              xs: config.imageHeight - 20,
              sm: config.imageHeight,
              md: config.imageHeight + 10,
            },
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
          }}
        >
          {/* Imagen principal con lazy loading */}
          <Box
            component="img"
            src={
              image ||
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
            }
            alt={title}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback si la imagen no carga
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop';
              setImageLoaded(true);
            }}
            className="marketplace-card-image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuickPreview(true);
                      }}
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
                  <Tooltip title="Compartir" arrow>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        // Implementar compartir con micro-feedback
                        console.log('🔗 Compartir:', title);
                      }}
                      className="icon-micro-interactive"
                    >
                      <Share />
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
                        // Implementar chat directo
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

          {/* Botones de favorito y menú del propietario */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 0.5,
            }}
          >
            {/* Owner menu - Only visible to item owner */}
            {isOwner && (
              <Zoom in={isHovered}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'white' },
                    width: 36,
                    height: 36,
                  }}
                  className="icon-micro-interactive"
                  data-testid="item-options-menu"
                >
                  <MoreVert />
                </IconButton>
              </Zoom>
            )}

            {/* Favorite button */}
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

        {/* Contenido de la tarjeta mejorado */}
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: '14px', sm: '16px', md: '18px' },
            '&:last-child': { pb: { xs: '14px', sm: '16px', md: '18px' } },
            justifyContent: 'space-between',
            minHeight: 0,
          }}
        >
          {/* Título mejorado */}
          <Typography
            variant={config.titleVariant}
            fontWeight="600"
            sx={{
              mb: 1,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: size === 'small' ? 32 : size === 'medium' ? 40 : 48,
              color: '#1a1a1a',
              fontSize: {
                xs: size === 'small' ? '0.875rem' : '1rem',
                sm: size === 'small' ? '0.9rem' : '1.1rem',
                md: size === 'small' ? '1rem' : '1.15rem',
              },
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

      {/* Owner Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleEditClick} data-testid="edit-item-button">
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: 'error.main' }}
          data-testid="delete-item-button"
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Modal */}
      {editModalOpen && (
        <EditItemModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSave}
          item={{
            id,
            title,
            description: description || '',
            type: type || 'SERVICE',
            priceUnits: price || 0,
            priceToins: originalPrice || 0,
            currency: currency || 'LUKAS',
            location,
            tags: tags || [],
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer
          </Alert>
          <Typography>
            ¿Estás seguro de que deseas eliminar "{title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Se eliminará permanentemente de CoomÜnity Marketplace.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteItemMutation.isPending}
          >
            {deleteItemMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice.toLocaleString()}`;
    }
    return `$${safePrice.toLocaleString()}`;
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
              {seller.name || 'Usuario'}
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
            {(location || 'Online').split(',')[0]}
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
