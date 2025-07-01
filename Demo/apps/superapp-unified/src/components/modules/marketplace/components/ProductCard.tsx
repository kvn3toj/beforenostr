import React from 'react';
import {
  Box,
  Typography,
  IconButton,
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
import { CosmicCard } from '../../../../design-system/components/cosmic/CosmicCard';

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

  const cardActions = (
    <CardActions
      disableSpacing
      sx={{
        borderTop: `1px solid ${alpha(palette.divider, 0.3)}`,
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.5,
        backgroundColor: alpha(palette.background, 0.7),
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: getElementColor('tierra'),
          fontSize: '1.15rem',
          textShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
              background: alpha(palette.background, 0.6),
              backdropFilter: 'blur(4px)',
              border: `1px solid ${alpha(palette.divider, 0.3)}`,
              '&:hover': {
                backgroundColor: alpha(getElementColor('tierra'), 0.2),
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
              background: alpha(palette.background, 0.6),
              backdropFilter: 'blur(4px)',
              border: `1px solid ${alpha(palette.divider, 0.3)}`,
              '&:hover': {
                backgroundColor: alpha(getElementColor('tierra'), 0.2),
                color: getElementColor('tierra'),
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <AddShoppingCart />
          </IconButton>
        </Tooltip>
      </Stack>
    </CardActions>
  );

  return (
    <CosmicCard
      element="tierra"
      variant="primary"
      enableAnimations={true}
      enableGlow={true}
      cosmicIntensity="medium"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${getElementColor('tierra')}, ${alpha(getElementColor('tierra'), 0.6)})`,
          zIndex: 1,
        },
      }}
      actions={cardActions}
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
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            borderRadius: '12px 12px 0 0',
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
            background: `linear-gradient(135deg, ${alpha(getElementColor('tierra'), 0.9)}, ${alpha(getElementColor('tierra'), 0.7)})`,
            color: BRAND_COLORS.white,
            fontWeight: 600,
            fontSize: '0.7rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${alpha(BRAND_COLORS.white, 0.3)}`,
            '& .MuiChip-label': {
              px: 1.5,
            },
          }}
        />
        {/* 🌟 Efecto de resplandor cósmico en la imagen */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: `linear-gradient(to top, ${alpha(palette.background, 0.8)}, transparent)`,
            backdropFilter: 'blur(2px)',
          }}
        />
      </Box>

      <CardContent sx={{
        flexGrow: 1,
        p: 2.5,
        pb: 1.5,
        background: `linear-gradient(135deg, ${alpha(palette.background, 0.9)}, ${alpha(palette.background, 0.7)})`,
        backdropFilter: 'blur(8px)',
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
            textShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Vendido por:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: '0.8rem',
              color: getElementColor('tierra'),
            }}
          >
            {seller?.name}
          </Typography>
          {seller?.verified && (
            <Tooltip title="Vendedor verificado">
              <VerifiedUser sx={{
                fontSize: 14,
                color: getElementColor('tierra'),
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
              }} />
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
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
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
    </CosmicCard>
  );
};

export default ProductCard;
