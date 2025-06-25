import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Rating,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import { Favorite, FavoriteBorder, Share } from '@mui/icons-material';
import type { Product, Seller } from '../../../../types/marketplace';

interface MobileProductCardProps extends Omit<Product, 'seller'> {
  isFavorited?: boolean;
  viewMode: 'grid' | 'list';
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  seller: Pick<Seller, 'reviewCount' | 'name' | 'id' | 'avatar' | 'username' | 'verified' | 'rating'>;
}

export const MobileProductCard: React.FC<MobileProductCardProps> = ({
  id,
  title,
  price,
  currency,
  seller,
  images,
  isFavorited,
  onToggleFavorite,
  onClick,
  viewMode,
  rating,
}) => {
  return (
    <Card
      onClick={() => onClick(id)}
      sx={{
        display: 'flex',
        flexDirection: viewMode === 'list' ? 'row' : 'column',
        height: '100%',
        boxShadow: 'none',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: viewMode === 'list' ? 120 : '100%',
          height: viewMode === 'list' ? '100%' : 140,
          objectFit: 'cover',
          borderTopLeftRadius: viewMode === 'grid' ? 'inherit' : '0px',
          borderTopRightRadius: viewMode === 'grid' ? 'inherit' : '0px',
        }}
        image={images?.[0] || '/images/placeholder.png'}
        alt={title}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent>
          <Typography variant="body1" fontWeight="600" gutterBottom noWrap>
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
            <Rating value={rating} precision={0.5} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              ({seller.reviewCount})
            </Typography>
          </Stack>
          <Typography variant="h6" color="primary.main" fontWeight="700">
            {price} <Typography variant="caption" component="span">{currency}</Typography>
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ mt: 'auto' }}>
          <IconButton
            aria-label="add to favorites"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
          >
            {isFavorited ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
            aria-label="share"
            onClick={(e) => e.stopPropagation()}
          >
            <Share />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
};
