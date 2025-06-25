import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Rating,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AddShoppingCart,
  Share,
  VerifiedUser,
} from '@mui/icons-material';
import type { Product } from '../../../../types/marketplace';

interface ProductCardProps extends Product {
  isFavorited?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = (product) => {
  const {
    images,
    title,
    seller,
    price,
    currency,
    category,
    rating,
    reviewCount,
    isFavorited,
  } = product;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={images[0] || '/images/placeholder.png'}
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.png';
          }}
        />
        <Chip
          label={category}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Vendido por:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {seller.name}
          </Typography>
          {seller.verified && (
            <Tooltip title="Vendedor verificado">
              <VerifiedUser color="primary" sx={{ fontSize: 16 }} />
            </Tooltip>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            ({reviewCount} opiniones)
          </Typography>
        </Stack>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
          {price} <Typography variant="caption" component="span">{currency}</Typography>
        </Typography>
        <Stack direction="row">
          <Tooltip title={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
            <IconButton aria-label="add to favorites">
              {isFavorited ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Añadir al carrito">
            <IconButton aria-label="add to cart">
              <AddShoppingCart />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
