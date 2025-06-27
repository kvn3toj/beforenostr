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
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  Share,
  Star,
  RemoveRedEyeOutlined,
  VerifiedUser,
  ShoppingCart,
  ChatBubbleOutline,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { impactCategories, Category, getConsciousnessStyle } from '../marketplace.constants';
import { useAuth } from '../../../../contexts/AuthContext';
import { MarketplaceItem } from '../../../../types/marketplace';
// Navigation handled via onClick handler
import { ConsciousProductImage } from './ConsciousProductImageSystem';

// Asumiendo que la moneda de Coomunity se llama Lúkas
const LUKAS_SYMBOL = 'LÜ';

interface EnhancedMarketplaceCardProps {
  item: MarketplaceItem;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
  onShare: (id: string) => void;
  onOpenChat: (item: MarketplaceItem) => void;
  onProductClick?: (id: string) => void; // Vista rápida (QuickView)
  onNavigateToDetail?: (id: string) => void; // Navegación a página completa
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const EnhancedMarketplaceCard: React.FC<EnhancedMarketplaceCardProps> = ({
  item,
  onToggleFavorite,
  onAddToCart,
  onShare,
  onOpenChat,
  onProductClick,
  onNavigateToDetail,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const controlsRef = useRef<HTMLDivElement>(null);
  const categoryStyle = impactCategories.find(cat => cat.name === item.category);
  const consciousnessStyle = getConsciousnessStyle(item.consciousnessLevel);

  const stockColor = item.stock > 10 ? 'success.main' : item.stock > 0 ? 'warning.main' : 'error.main';

  const handleActionClick = (e: React.MouseEvent, action: (id: string) => void) => {
    e.preventDefault();
    e.stopPropagation();
    action(item.id);
  };

  const handleOpenChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenChat(item);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      onToggleFavorite(item.id);
    }
  };

  const handleCardClick = () => {
    // 🎯 Zeno: Quick view (vista rápida) - modal overlay
    if (onProductClick) {
      onProductClick(item.id);
    } else {
      console.log(`Quick view for ${item.id}`);
    }
  };

  const handleNavigateToDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 🎯 Zeno: Navigate to full product page
    if (onNavigateToDetail) {
      onNavigateToDetail(item.id);
    } else {
      console.log(`Navigate to /marketplace/item/${item.id}`);
    }
  };

  return (
    <motion.div variants={cardVariants} style={{ height: '100%' }}>
     <div onClick={handleCardClick} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%', cursor: 'pointer' }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          borderTop: `4px solid ${consciousnessStyle.color}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ position: 'relative' }}>
          <ConsciousProductImage
            images={item.images}
            title={item.title}
            description={item.description}
            category={item.category}
            height={180}
            width="100%"
            showBadges={true}
            showHoverEffects={true}
            isPopular={item.stats?.isPopular}
            isSustainable={item.stats?.isSustainable}
            rating={item.stats?.rating}
            borderRadius={0}
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
              onClick={(e) => handleActionClick(e, onShare)}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
              }}
            >
              <Share fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Abrir chat con el vendedor"
              onClick={handleOpenChat}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
              }}
            >
              <ChatBubbleOutline fontSize="small" />
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
              <Star fontSize="small" sx={{ color: 'warning.main' }} />
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

          <Stack direction="row" spacing={1} mt="auto" sx={{ p: 2, pt: 0 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleNavigateToDetail}
              sx={{
                minWidth: 'auto',
                px: 1,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              Ver detalles
            </Button>
            <Button
              size="medium"
              variant="contained"
              fullWidth
              onClick={(e) => handleActionClick(e, onAddToCart)}
              startIcon={<ShoppingCart />}
            >
              Agregar
            </Button>
          </Stack>
        </CardContent>
      </Card>
      </div>
    </motion.div>
  );
};
