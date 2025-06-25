import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  Avatar,
  Rating,
  alpha,
  useTheme,
} from '@mui/material';
import { Close, Share, FavoriteBorder, Favorite, ShoppingCart } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MarketplaceItem } from './EnhancedMarketplaceCard';
import { impactCategories } from '../marketplace.constants';

interface QuickViewModalProps {
  open: boolean;
  onClose: () => void;
  item: MarketplaceItem | null;
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  open,
  onClose,
  item,
  onAddToCart,
  onToggleFavorite,
}) => {
  const theme = useTheme();

  if (!item) return null;

  const categoryStyle = impactCategories.find(cat => cat.name === item.category);
  const stockColor = item.stock > 10 ? 'success.main' : item.stock > 0 ? 'warning.main' : 'error.main';
  const stockText = item.stock > 10 ? 'En stock' : item.stock > 0 ? `¡Solo quedan ${item.stock}!` : 'Agotado';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip
            label={item.category}
            size="small"
            sx={{
              color: categoryStyle?.color,
              backgroundColor: categoryStyle?.bgColor,
              fontWeight: 'medium',
            }}
          />
        <IconButton onClick={onClose} sx={{ zIndex: 1 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box sx={{ flex: 1 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Box
                component="img"
                src={item.images[0]}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          </Box>
          <Stack sx={{ flex: 1 }} spacing={2}>
            <Typography variant="h4" fontWeight="bold">
              {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {item.description}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
              <Avatar src={item.seller.avatar} alt={item.seller.name} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">{item.seller.name}</Typography>
                <Chip label={`Ayni: ${item.seller.ayniScore}%`} size="small" color="success" variant='outlined' />
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Rating value={item.stats.rating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ color: stockColor, fontWeight: 'medium' }}>
                  {stockText}
                </Typography>
            </Stack>

            <Stack direction="row" alignItems="flex-end" spacing={1} sx={{py: 2}}>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                    {item.lukas}
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{pb: 0.5}}>LKS</Typography>
                <Typography variant="body1" color="text.secondary" sx={{pb: 0.5}}>
                    (${item.priceUSD})
                </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{pt: 2}}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={() => onAddToCart(item.id)}
                disabled={item.stock === 0}
                fullWidth
              >
                {item.stock === 0 ? 'Agotado' : 'Agregar'}
              </Button>
              <IconButton onClick={() => onToggleFavorite(item.id)} size="large">
                {item.isFavorited ? <Favorite sx={{color: 'error.main'}} /> : <FavoriteBorder />}
              </IconButton>
              <IconButton size="large">
                <Share />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
