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
  Card,
  CardMedia,
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
import { motion } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton';

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
  loading?: boolean;
  onToggleFavorite?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ loading, onToggleFavorite, ...product }) => {
  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={320}
        sx={{ borderRadius: 3, mb: 2 }}
        animation="wave"
      />
    );
  }
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 8px 32px rgba(80,80,120,0.18)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      tabIndex={0}
      aria-label={`Ver detalles de ${product.title}`}
      style={{ outline: 'none' }}
      className="focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <Card
        sx={{
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(80,80,120,0.10)',
          overflow: 'hidden',
          position: 'relative',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ overflow: 'hidden' }}
        >
          <CardMedia
            component="img"
            height="180"
            image={product.images[0]}
            alt={product.title}
            sx={{ objectFit: 'cover', transition: 'transform 0.3s' }}
          />
        </motion.div>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            {product.featured && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Chip label="Destacado" color="success" size="small" sx={{ fontWeight: 600 }} />
              </motion.div>
            )}
            {product.trending && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Chip label="Tendencia" color="warning" size="small" sx={{ fontWeight: 600 }} />
              </motion.div>
            )}
          </Stack>
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={product.category} size="small" color="primary" />
            {product.type && <Chip label={product.type} size="small" variant="outlined" />}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">
              ü {product.price}
            </Typography>
            <motion.button
              whileTap={{ scale: 0.8 }}
              aria-label={product.isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
              }}
              className="focus-visible:ring-2 focus-visible:ring-pink-500"
              onClick={onToggleFavorite}
            >
              <span style={{ fontSize: 24, color: product.isFavorited ? '#e91e63' : '#bdbdbd', transition: 'color 0.2s' }}>
                {product.isFavorited ? '❤️' : '🤍'}
              </span>
            </motion.button>
          </Box>
        </CardContent>
        <Box sx={{ bgcolor: 'grey.50', p: 1.5, textAlign: 'center', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
          <Typography variant="caption" color="success.main" fontWeight={600}>
            Contribuyes al Bien Común con cada intercambio
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
