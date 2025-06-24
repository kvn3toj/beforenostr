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
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
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
                transition: 'transform 0.3s ease-in-out',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            <StatusBadges
              featured={featured || false}
              trending={trending || false}
              discount={discount}
              is24Hours={props.is24Hours || false}
              isUrgent={props.urgent || false}
              hasVideo={props.hasVideo || false}
              size={size}
            />
            {images.length > 1 && isHovered && (
              <>
                <IconButton
                  onClick={e => handleImageNavigation(e, 'prev')}
                  size="small"
                  sx={{ position: 'absolute', top: '50%', left: 4, transform: 'translateY(-50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)'} }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                   onClick={e => handleImageNavigation(e, 'next')}
                   size="small"
                   sx={{ position: 'absolute', top: '50%', right: 4, transform: 'translateY(-50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)'} }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}
            <Tooltip title={isFavoritedLocal ? 'Remove from Wishlist' : 'Add to Wishlist'}>
              <IconButton
                onClick={handleToggleFavorite}
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)'} }}
              >
                {isFavoritedLocal ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
             {isOwner && (
                <IconButton
                  aria-label="settings"
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ position: 'absolute', top: 8, left: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)'} }}
                >
                  <MoreVert />
                </IconButton>
              )}
          </Box>

          {/* --- Content Section --- */}
          <CardContent
            sx={{
              p: '16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '16px', fontWeight: 600 }}>
                {title}
              </Typography>
              <SellerInfo seller={seller} location={location} deliveryTime={deliveryTime} />
              <Rating name="read-only" value={rating} readOnly size="small" sx={{ my: 1, color: '#FBBF24' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {shortDescription || 'No description available.'}
              </Typography>
            </Box>

            <Box mt={2}>
              <PriceDisplay price={price} originalPrice={originalPrice} currency={currency} discount={discount} size={size} />
              <Fade in={isHovered}>
                <Stack direction="row" spacing={1} mt={1}>
                  <Tooltip title="Add to Cart">
                    <IconButton size="small" onClick={handleAddToCart} disabled={isAddingToCart}>
                      <AddShoppingCart />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Quick View">
                    <IconButton size="small" onClick={handleQuickView}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton size="small">
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Fade>
            </Box>
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
