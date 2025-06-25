import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Button,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  Share,
  Star,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { impactCategories, Category } from '../marketplace.constants';
import { useAuth } from '../../../../contexts/AuthContext';

// Asumiendo que la moneda de Coomunity se llama Lúkas
const LUKAS_SYMBOL = 'LÜ';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  lukas: number;
  images: string[];
  seller: {
    name: string;
    avatar: string;
    ayniScore: number;
    meritos: number;
  };
  stats: {
    views: number;
    rating: number;
  };
  category: string;
  stock: number;
  isFavorited?: boolean;
}

interface EnhancedMarketplaceCardProps {
  item: MarketplaceItem;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
  onAddToCart: (id: string) => void;
  onShare: (id: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const EnhancedMarketplaceCard: React.FC<EnhancedMarketplaceCardProps> = ({
  item,
  onToggleFavorite,
  onViewDetails,
  onAddToCart,
  onShare,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const controlsRef = useRef<HTMLDivElement>(null);
  const categoryStyle = impactCategories.find(cat => cat.name === item.category);

  const stockColor = item.stock > 10 ? 'success.main' : item.stock > 0 ? 'warning.main' : 'error.main';

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      onToggleFavorite(item.id);
    }
  };

  return (
    <motion.div variants={cardVariants}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          borderTop: `4px solid ${categoryStyle?.color || theme.palette.primary.main}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 40px 0 ${alpha(categoryStyle?.color || theme.palette.primary.main, 0.2)}`,
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={item.images[0] || 'https://via.placeholder.com/300'}
            alt={item.title}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <IconButton
              size="small"
              onClick={handleToggleFavorite}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
              }}
            >
              <motion.div
                key={item.isFavorited ? 'favorited' : 'not-favorited'}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.3 }}
              >
              {item.isFavorited ? (
                <Favorite sx={{ color: theme.palette.error.main }} fontSize="small" />
              ) : (
                <FavoriteBorder fontSize="small" />
              )}
              </motion.div>
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onShare(item.id)}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
              }}
            >
              <Share fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 1 }}>
              {item.title}
            </Typography>
          </Stack>

          <Chip
            label={item.category}
            size="small"
            sx={{
              mb: 1,
              alignSelf: 'flex-start',
              color: categoryStyle?.color,
              backgroundColor: categoryStyle?.bgColor,
              fontWeight: 'medium',
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {item.description}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" mr={0.5}>
                    Vendedor:
                </Typography>
                <Typography variant="body2" fontWeight="500">{item.seller.name}</Typography>
            </Box>
            <Chip label={`Ayni: ${item.seller.ayniScore}%`} size="small" color="success" variant='outlined' />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <RemoveRedEyeOutlined fontSize="small" color="action" />
                <Typography variant="caption">{item.stats.views} vistas</Typography>
            </Stack>
             <Stack direction="row" alignItems="center" spacing={0.5}>
                <Star fontSize="small" sx={{color: 'warning.main'}} />
                <Typography variant="caption">{item.stats.rating} ({item.seller.meritos} méritos)</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {item.lukas} <Typography variant='caption' component='span'>{LUKAS_SYMBOL}</Typography>
            </Typography>
             <Typography variant="body2" color="text.secondary">
              (${item.priceUSD})
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, pt: 0 }}>
            <Stack>
              <Typography variant="caption" color="text.secondary">Precio</Typography>
              <Typography fontWeight="bold" color="primary">
                {item.lukas} LÜKAS
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: stockColor }}>
              {item.stock > 0 ? `${item.stock} disponibles` : 'Agotado'}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} mt="auto">
            <Button
              size="medium"
              variant="outlined"
              fullWidth
              onClick={() => onViewDetails(item.id)}
            >
              Ver detalles
            </Button>
            <Button
              size="medium"
              variant="contained"
              fullWidth
              onClick={() => onAddToCart(item.id)}
            >
              Agregar
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};
