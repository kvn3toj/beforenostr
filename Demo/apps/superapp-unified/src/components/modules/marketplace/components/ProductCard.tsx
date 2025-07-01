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
  alpha,
  useTheme,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AddShoppingCart,
  Share,
  VerifiedUser,
} from '@mui/icons-material';
import type { Product } from '../../../../types/marketplace';
import { THEME_PALETTES, BRAND_COLORS, MODULE_COLORS } from '../../../../theme/colors';
import { useGuardianColors } from '../../../../components/theme/GuardianColorProvider';

interface ProductCardProps extends Product {
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = (product) => {
  const {
    id,
    images,
    title,
    seller,
    price,
    currency,
    category,
    rating,
    reviewCount,
    isFavorited,
    onToggleFavorite,
    onAddToCart,
  } = product;

  const theme = useTheme();
  const { palette, getElementColor } = useGuardianColors();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        backgroundColor: palette.background,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(palette.text.primary, 0.08)}`,
        },
        overflow: 'hidden',
        border: `1px solid ${alpha(palette.divider, 0.8)}`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: getElementColor('tierra'),
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={images[0] || '/images/placeholder.png'}
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.png';
          }}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <Chip
          label={category}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: alpha(MODULE_COLORS.marketplace, 0.85),
            color: BRAND_COLORS.white,
            fontWeight: 500,
            fontSize: '0.7rem',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      </Box>
      <CardContent sx={{
        flexGrow: 1,
        p: 2.5,
        pb: 1.5,
        backgroundColor: palette.background,
      }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: palette.text.primary,
            fontSize: '1rem',
            lineHeight: 1.3,
            mb: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Vendido por:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
            {seller?.name}
          </Typography>
          {seller?.verified && (
            <Tooltip title="Vendedor verificado">
              <VerifiedUser sx={{ fontSize: 14, color: palette.info }} />
            </Tooltip>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Rating
            value={rating || 0}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: BRAND_COLORS.gold,
              },
              '& .MuiRating-iconEmpty': {
                color: alpha(BRAND_COLORS.gold, 0.3),
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            ({reviewCount || 0} opiniones)
          </Typography>
        </Stack>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          borderTop: `1px solid ${palette.divider}`,
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          backgroundColor: alpha(palette.background, 0.9),
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: MODULE_COLORS.marketplace,
            fontSize: '1.15rem',
          }}
        >
          {price} <Typography variant="caption" component="span" sx={{ fontWeight: 400, fontSize: '0.75rem' }}>{currency}</Typography>
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
            <IconButton
              aria-label="add to favorites"
              size="small"
              onClick={handleToggleFavorite}
              sx={{
                color: isFavorited ? BRAND_COLORS.burgundy : palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(palette.divider, 0.8),
                },
              }}
            >
              {isFavorited ? <Favorite color="inherit" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Añadir al carrito">
            <IconButton
              aria-label="add to cart"
              size="small"
              onClick={handleAddToCart}
              sx={{
                color: palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(palette.divider, 0.8),
                  color: MODULE_COLORS.marketplace,
                },
              }}
            >
              <AddShoppingCart />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
