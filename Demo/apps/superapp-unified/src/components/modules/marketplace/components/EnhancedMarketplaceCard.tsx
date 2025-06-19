import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Box,
  Rating,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  Share,
  ShoppingCart,
  Star,
  Verified,
  LocalOffer,
  TrendingUp,
  Nature,
} from '@mui/icons-material';
import { cn, animations, gradients, focus } from '../../../../utils/styles';
import { formatPrice, safeToLocaleString } from '../../../../utils/numberUtils';
import { Card as CoomunityCard, Button as CoomunityButton } from '../../../ui';

// 🎯 Types
interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  lukas: number; // Lükas (CoomÜnity currency)
  category: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    isEmprendedorConfiable: boolean; // Trusted Entrepreneur
    ayniScore: number; // Ayni reciprocity score
    meritos: number; // Mëritos earned
  };
  stats: {
    views: number;
    likes: number;
    rating: number;
    reviewCount: number;
    isPopular: boolean;
    isSustainable: boolean; // Bien Común indicator
  };
  type: 'product' | 'service';
  tags: string[];
  createdAt: string;
  location?: string;
}

interface EnhancedMarketplaceCardProps {
  item: MarketplaceItem;
  onLike?: (itemId: string) => void;
  onShare?: (itemId: string) => void;
  onAddToCart?: (itemId: string) => void;
  onViewDetails?: (itemId: string) => void;
  isLiked?: boolean;
  className?: string;
  variant?: 'compact' | 'detailed' | 'featured';
}

// 🎨 Animation Variants
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    }
  }
};

const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    }
  }
};

// 🌟 Enhanced Marketplace Card Component
export const EnhancedMarketplaceCard: React.FC<EnhancedMarketplaceCardProps> = ({
  item,
  onLike,
  onShare,
  onAddToCart,
  onViewDetails,
  isLiked = false,
  className,
  variant = 'detailed',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 🎨 Dynamic styling based on item properties
  const getCardGradient = () => {
    if (item.stats.isPopular) return gradients.coomunity;
    if (item.stats.isSustainable) return gradients.earth;
    if (item.seller.isEmprendedorConfiable) return gradients.gold;
    return 'bg-white';
  };

  const getAyniColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn('group', className)}
    >
      <CoomunityCard
        variant={item.stats.isPopular ? 'coomunity' : 'elevated'}
        padding="none"
        interactive
        className={cn(
          'relative overflow-hidden',
          'border-2 border-transparent',
          'hover:border-coomunity-200',
          'transition-all duration-300',
          getCardGradient(),
          focus.visible
        )}
      >
        {/* 🏷️ Status Badges */}
        <Box className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <AnimatePresence>
            {item.stats.isPopular && (
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Chip
                  icon={<TrendingUp className="text-white" />}
                  label="Popular"
                  size="small"
                  className={cn(
                    'bg-coomunity-500 text-white',
                    'shadow-lg backdrop-blur-sm',
                    animations.pulse
                  )}
                />
              </motion.div>
            )}

            {item.stats.isSustainable && (
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Chip
                                      icon={<Nature className="text-white" />}
                  label="Bien Común"
                  size="small"
                  className="bg-success-500 text-white shadow-lg backdrop-blur-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* ❤️ Action Buttons */}
        <Box className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <Tooltip title={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(item.id);
              }}
              className={cn(
                'bg-white/90 backdrop-blur-sm shadow-lg',
                'hover:bg-white hover:scale-110',
                'transition-all duration-200',
                focus.visible
              )}
              size="small"
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {isLiked ? (
                  <Favorite className="text-error-500" />
                ) : (
                  <FavoriteBorder className="text-gray-600" />
                )}
              </motion.div>
            </IconButton>
          </Tooltip>

          <Tooltip title="Compartir">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(item.id);
              }}
              className={cn(
                'bg-white/90 backdrop-blur-sm shadow-lg',
                'hover:bg-white hover:scale-110',
                'transition-all duration-200',
                focus.visible
              )}
              size="small"
            >
              <Share className="text-gray-600" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 🖼️ Image Section */}
        <Box className="relative h-48 overflow-hidden">
          <motion.img
            src={item.images[0]}
            alt={item.title}
            className={cn(
              'w-full h-full object-cover',
              'transition-all duration-300',
              !imageLoaded && 'opacity-0'
            )}
            variants={imageVariants}
            animate={isHovered ? 'hover' : 'initial'}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Loading skeleton */}
          {!imageLoaded && (
            <Box className={cn(
              'absolute inset-0 bg-gray-200',
              animations.pulse
            )} />
          )}

          {/* Gradient overlay */}
          <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </Box>

        {/* 📝 Content Section */}
        <CardContent className="p-4 space-y-3">
          {/* Title and Category */}
          <Box>
            <Typography
              variant="h6"
              className={cn(
                'font-semibold text-gray-900 line-clamp-2',
                'group-hover:text-coomunity-700',
                'transition-colors duration-200'
              )}
            >
              {item.title}
            </Typography>
            <Chip
              label={item.category}
              size="small"
              variant="outlined"
              className="mt-1"
            />
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            className="text-gray-600 line-clamp-2"
          >
            {item.description}
          </Typography>

          {/* Seller Info */}
          <Box className="flex items-center gap-2">
            <Avatar
              src={item.seller.avatar}
              alt={item.seller.name}
              className="w-8 h-8"
            />
            <Box className="flex-1 min-w-0">
              <Box className="flex items-center gap-1">
                <Typography
                  variant="body2"
                  className="font-medium text-gray-900 truncate"
                >
                  {item.seller.name}
                </Typography>
                {item.seller.isEmprendedorConfiable && (
                  <Tooltip title="Emprendedor Confiable">
                    <Verified className="w-4 h-4 text-gold-500" />
                  </Tooltip>
                )}
              </Box>

              {/* Ayni Score */}
              <Box className="flex items-center gap-1">
                <Typography variant="caption" className="text-gray-500">
                  Ayni:
                </Typography>
                <Chip
                  label={`${item.seller.ayniScore}%`}
                  size="small"
                  color={getAyniColor(item.seller.ayniScore) as any}
                  className="h-5 text-xs"
                />
              </Box>
            </Box>
          </Box>

          {/* Rating and Stats */}
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-1">
              <Rating
                value={item.stats.rating}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography variant="caption" className="text-gray-500">
                ({item.stats.reviewCount})
              </Typography>
            </Box>

            <Typography variant="caption" className="text-gray-500">
              {item.stats.views} vistas
            </Typography>
          </Box>

          {/* Price Section */}
          <Box className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Box>
              <Typography
                variant="h6"
                className="font-bold text-coomunity-600"
              >
                ${safeToLocaleString(item.price)}
              </Typography>
              <Typography
                variant="caption"
                className="text-gold-600 font-medium"
              >
                {item.lukas} Lükas
              </Typography>
            </Box>

            {/* Mëritos Badge */}
            <Tooltip title={`${item.seller.meritos} Mëritos ganados`}>
              <Chip
                icon={<Star className="text-gold-600" />}
                label={item.seller.meritos}
                size="small"
                className="bg-gold-50 text-gold-700 border-gold-200"
              />
            </Tooltip>
          </Box>
        </CardContent>

        {/* 🎬 Action Buttons */}
        <CardActions className="p-4 pt-0 gap-2">
          <CoomunityButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(item.id);
            }}
            className="flex-1"
          >
            Ver detalles
          </CoomunityButton>

          <CoomunityButton
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(item.id);
            }}
            className={cn(
              'flex-1 gap-2',
              animations.hoverScale
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            {item.type === 'service' ? 'Contratar' : 'Agregar'}
          </CoomunityButton>
        </CardActions>

        {/* ✨ Hover Glow Effect */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-lg',
            'bg-gradient-to-r from-coomunity-500/10 to-gold-500/10',
            'opacity-0 pointer-events-none',
            'transition-opacity duration-300'
          )}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      </CoomunityCard>
    </motion.div>
  );
};

export default EnhancedMarketplaceCard;
