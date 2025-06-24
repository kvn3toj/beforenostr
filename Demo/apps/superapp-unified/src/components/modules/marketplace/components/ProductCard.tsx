import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  CardContent,
  Tooltip,
  Fade,
  Stack,
  Dialog,
  DialogContent,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Rating,
  DialogActions,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Warning,
  ChevronLeft,
  ChevronRight,
  Favorite,
  FavoriteBorder,
  AddShoppingCart,
  Visibility,
  Share,
} from '@mui/icons-material';

import { useProductCard } from '../../../../hooks/modules/marketplace/useProductCard';
import { CosmicCard } from '../../../../design-system/components/cosmic/CosmicCard';
import StatusBadges from './StatusBadges';
import PriceDisplay from './PriceDisplay';
import SellerInfo from './SellerInfo';
import { EditItemModal } from './EditItemModal';
import type { Product, Seller } from '../../../../types/marketplace';

type ProductCardProps = Product & {
  isFavorited?: boolean;
  image?: string;
  onRefresh?: () => void;
  viewMode?: 'grid' | 'list';
  enableHover?: boolean;
  size?: 'small' | 'medium' | 'large';
};

const ProductCard: React.FC<ProductCardProps> = props => {
  const {
    id,
    title,
    shortDescription,
    price,
    originalPrice,
    currency,
    location,
    rating,
    reviewCount,
    seller,
    images = [],
    isFavorited = false,
    image,
    onRefresh,
    viewMode = 'grid',
    tags,
    featured,
    trending,
    discount,
    deliveryTime,
    type,
    size = 'medium',
    enableHover = true,
  } = props;

  const {
    cardRef,
    isHovered,
    showDeleteDialog,
    anchorEl,
    showQuickView,
    isAddingToCart,
    currentImageIndex,
    isMenuOpen,
    editModalOpen,
    isFavoritedLocal,
    isOwner,
    deleteItemMutation,
    handleCardClick,
    handleMenuOpen,
    handleMenuClose,
    handleQuickView,
    handleCloseQuickView,
    handleAddToCart,
    handleImageNavigation,
    handleToggleFavorite,
    handleEditClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleEditSave,
    setIsHovered,
    setShowDeleteDialog,
    setEditModalOpen,
  } = useProductCard({
    id,
    sellerId: seller.id,
    images,
    isFavorited,
    onRefresh,
  });

  const imageToDisplay =
    images[currentImageIndex] ||
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop';

  // The item prop for EditItemModal requires a specific structure.
  // We construct it from the props received by ProductCard.
  const itemForModal = {
    id,
    title,
    description: props.description || '',
    type: type || 'PRODUCT', // Default to PRODUCT if not specified
    priceUnits: price || 0, // Assuming price maps to priceUnits
    priceToins: 0, // Assuming no toins price for now, can be enhanced
    currency: currency || 'LUKAS',
    location: location || '',
    tags: tags || [],
  };

  return (
    <>
      <CosmicCard
        element="tierra"
        variant="elevated"
        enableAnimations={enableHover}
        enableGlow
        enableParticles={featured || trending}
        onClick={handleCardClick}
        sx={{
          borderRadius: '12px',
          boxShadow: isHovered ? '0 6px 24px 0 rgba(0,0,0,0.12)' : '0 1px 2px 0 rgba(0,0,0,0.05)',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 1.5, md: 2.5 },
          ...(viewMode === 'list' && {
            flexDirection: 'row',
          }),
        }}
        className="card-micro-interactive marketplace-card"
        data-testid={`product-card-${id}`}
      >
        <Box
          ref={cardRef}
          onMouseEnter={() => enableHover && setIsHovered(true)}
          onMouseLeave={() => enableHover && setIsHovered(false)}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            ...(viewMode === 'list' && {
              flexDirection: 'row',
              flex: 1,
            }),
          }}
        >
          {/* --- Image Section --- */}
          <Box
            sx={{
              height: { xs: 120, md: 200 },
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: 'grey.200',
              borderRadius: '12px 12px 0 0',
              ...(viewMode === 'list' && {
                width: 200,
                height: 'auto',
                flexShrink: 0,
              }),
            }}
          >
            <Box
              component="img"
              src={imageToDisplay}
              alt={title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px 12px 0 0',
                transition: 'transform 0.3s ease-in-out',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            <StatusBadges
              featured={featured || false}
              trending={trending || false}
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 2,
                bgcolor: featured ? '#FFD700' : trending ? '#FF6B6B' : 'white',
                color: featured || trending ? 'black' : 'text.primary',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                borderRadius: 2,
                px: 1,
                py: 0.5,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                bgcolor: 'white',
                borderRadius: 2,
                px: 1,
                py: 0.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Rating value={rating} precision={0.1} size="small" readOnly sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">{rating.toFixed(1)}</Typography>
            </Box>
            <IconButton
              aria-label={isFavoritedLocal ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              onClick={handleToggleFavorite}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'white',
                color: isFavoritedLocal ? 'error.main' : 'grey.500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                zIndex: 2,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              {isFavoritedLocal ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>

          {/* --- Content Section --- */}
          <CardContent sx={{ flex: 1, p: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, lineHeight: 1.2 }}>
              {title}
            </Typography>
            <PriceDisplay price={price} originalPrice={originalPrice} currency={currency} sx={{ mb: 0.5, fontWeight: 700 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 36 }}>
              {shortDescription}
            </Typography>
            <SellerInfo seller={seller} />
          </CardContent>
        </Box>
      </CosmicCard>

      {/* --- Modals and Dialogs --- */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={e => e.stopPropagation()}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onClick={e => e.stopPropagation()}>
         <DialogContent sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <Warning color="error" sx={{fontSize: 40}} />
          <Box>
            <Typography variant="h6">Confirm Deletion</Typography>
            <Typography>Are you sure you want to delete this item? This action cannot be undone.</Typography>
          </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
           <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteItemMutation.isPending}>
             {deleteItemMutation.isPending ? 'Deleting...' : 'Delete'}
           </Button>
         </DialogActions>
      </Dialog>

      <Dialog open={showQuickView} onClose={handleCloseQuickView} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>{props.description}</Typography>
          <Box component="img" src={imageToDisplay} alt={title} sx={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 2, my: 2 }} />
          <PriceDisplay price={price} originalPrice={originalPrice} currency={currency} discount={discount} size="large" />
        </DialogContent>
      </Dialog>

      {editModalOpen && (
        <EditItemModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          item={itemForModal}
          onSuccess={handleEditSave}
        />
      )}
    </>
  );
};

export default ProductCard;
