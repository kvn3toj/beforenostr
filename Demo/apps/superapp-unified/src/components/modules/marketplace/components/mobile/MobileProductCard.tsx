import React, { useState } from 'react';
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
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  ShoppingCart,
  Star,
  Verified,
  Nature as Eco,
  LocalOffer,
  TrendingUp,
  AutoAwesome,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsciousProductImage } from '../ConsciousProductImageSystem';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Product, Seller } from '../../../../../types/marketplace';

interface MobileProductCardProps extends Omit<Product, 'seller'> {
  isFavorited?: boolean;
  viewMode: 'grid' | 'list';
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  seller: Pick<Seller, 'reviewCount' | 'name' | 'id' | 'avatar' | 'username' | 'verified' | 'rating'>;
  category?: string;
  isPopular?: boolean;
  isSustainable?: boolean;
  consciousnessLevel?: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
}

// 🌟 Kira: Consciousness Level Styling
const getConsciousnessStyle = (level?: string) => {
  switch (level) {
    case 'TRANSCENDENT':
      return { color: '#9c27b0', glow: '#e1bee7' };
    case 'FLOURISHING':
      return { color: '#4caf50', glow: '#c8e6c9' };
    case 'GROWING':
      return { color: '#ff9800', glow: '#ffe0b2' };
    case 'SEED':
    default:
      return { color: '#607d8b', glow: '#cfd8dc' };
  }
};

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
  rating = 0,
  reviewCount = 0,
  category = 'General',
  isPopular = false,
  isSustainable = false,
  consciousnessLevel,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const consciousStyle = getConsciousnessStyle(consciousnessLevel);

  // 🎨 Aria: Enhanced Action Handlers
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality would be implemented here
    console.log('Share product:', id);
  };

  const handleCardClick = () => {
    onClick(id);
  };

  // 💰 Enhanced Price Display
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'LUKAS' || currency === 'ü') {
      return `ü ${price.toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <motion.div
      whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: 'flex',
          flexDirection: viewMode === 'list' ? 'row' : 'column',
          height: '100%',
          boxShadow: 'none',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          borderTop: `3px solid ${consciousStyle.color}`,
          '&:hover': {
            borderColor: consciousStyle.color,
            boxShadow: `0 4px 12px ${alpha(consciousStyle.color, 0.2)}`,
          },
        }}
      >
        {/* 🖼️ Enhanced Product Image with Conscious System */}
        <Box sx={{ position: 'relative', flex: viewMode === 'list' ? '0 0 120px' : 'auto' }}>
          <ConsciousProductImage
            images={images}
            title={title}
            category={category}
            width={viewMode === 'list' ? 120 : '100%'}
            height={viewMode === 'list' ? '100%' : 140}
            showBadges={false}
            showHoverEffects={true}
            isPopular={isPopular}
            isSustainable={isSustainable}
            rating={rating}
            borderRadius={0}
          />

          {/* 🏆 Enhanced Badges */}
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              left: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {isPopular && (
              <Chip
                icon={<TrendingUp sx={{ fontSize: 12 }} />}
                label="Popular"
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
            {isSustainable && (
              <Chip
                icon={<Eco sx={{ fontSize: 12 }} />}
                label="Eco"
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  background: 'linear-gradient(45deg, #4CAF50, #81C784)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
          </Box>

          {/* 💝 Enhanced Action Buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              opacity: isHovered ? 1 : 0.7,
              transition: 'opacity 0.3s ease',
            }}
          >
            <IconButton
              size="small"
              onClick={handleToggleFavorite}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                width: 28,
                height: 28,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 1),
                },
              }}
            >
              <motion.div
                key={isFavorited ? 'favorited' : 'not-favorited'}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {isFavorited ? (
                  <Favorite sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: 16 }} />
                )}
              </motion.div>
            </IconButton>
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                width: 28,
                height: 28,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 1),
                },
              }}
            >
              <Share sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* 📝 Enhanced Product Content */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: viewMode === 'list' ? 1.5 : 2,
            '&:last-child': { pb: viewMode === 'list' ? 1.5 : 2 },
          }}
        >
          {/* Category Chip */}
          <Chip
            label={category}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mb: 1,
              height: 20,
              fontSize: 10,
              fontWeight: 'medium',
              backgroundColor: alpha(consciousStyle.color, 0.1),
              color: consciousStyle.color,
              border: `1px solid ${alpha(consciousStyle.color, 0.3)}`,
            }}
          />

          {/* Product Title */}
          <Typography
            variant={viewMode === 'list' ? 'body2' : 'subtitle1'}
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: viewMode === 'list' ? 2 : 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>

          {/* 💰 Enhanced Price */}
          <Typography
            variant={viewMode === 'list' ? 'body1' : 'h6'}
            color="primary"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${consciousStyle.color})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {formatPrice(price, currency)}
          </Typography>

          {/* 🌟 Enhanced Rating & Seller Info */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Rating
              value={rating}
              precision={0.5}
              readOnly
              size="small"
              sx={{ fontSize: viewMode === 'list' ? 12 : 14 }}
            />
            <Typography variant="caption" color="text.secondary">
              ({reviewCount})
            </Typography>
            {seller.verified && (
              <Tooltip title="Emprendedor Confiable">
                <Verified sx={{ fontSize: 14, color: 'success.main' }} />
              </Tooltip>
            )}
          </Stack>

          {/* 👤 Seller Name */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Por: {seller.name}
          </Typography>

          {/* 🧠 Consciousness Level Indicator */}
          {consciousnessLevel && (
            <Box sx={{ mt: 'auto', pt: 1 }}>
              <Chip
                icon={<AutoAwesome sx={{ fontSize: 12 }} />}
                label={`Nivel: ${consciousnessLevel}`}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: 9,
                  borderColor: consciousStyle.color,
                  color: consciousStyle.color,
                  backgroundColor: alpha(consciousStyle.color, 0.05),
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
