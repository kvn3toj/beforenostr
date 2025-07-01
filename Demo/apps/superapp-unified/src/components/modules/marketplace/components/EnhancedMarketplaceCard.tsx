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
import { useNavigate } from 'react-router-dom';
import { BRAND_COLORS } from '../../../../theme/colors';

// Asumiendo que la moneda de Coomunity se llama Lúkas
const LUKAS_SYMBOL = 'LÜ';

interface EnhancedMarketplaceCardProps {
  item: MarketplaceItem;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
  onShare: (id: string) => void;
  onOpenChat: (item: MarketplaceItem) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const EnhancedMarketplaceCard: React.FC<EnhancedMarketplaceCardProps> = ({
  item,
  onToggleFavorite,
  onAddToCart,
  onShare,
  onOpenChat,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const controlsRef = useRef<HTMLDivElement>(null);
  const categoryStyle = impactCategories.find(cat => cat.name === item.category);
  const consciousnessStyle = getConsciousnessStyle(item.consciousnessLevel);

  const stockColor = item.stock > 10 ? BRAND_COLORS.green : item.stock > 0 ? BRAND_COLORS.gold : BRAND_COLORS.burgundy;

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
    navigate(`/marketplace/item/${item.id}`);
  };

  return (
    <motion.div variants={cardVariants} style={{ height: '100%' }}>
      <Box
        onClick={handleCardClick}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          height: '100%',
          cursor: 'pointer'
        }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRadius: 1.5,
            boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            backgroundColor: BRAND_COLORS.white,
            border: `1px solid ${BRAND_COLORS.gray100}`,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: `0 6px 16px ${alpha(BRAND_COLORS.gray300, 0.2)}`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: alpha(consciousnessStyle.color, 0.8),
              zIndex: 1,
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="180"
              image={item.images[0] || 'https://via.placeholder.com/300'}
              alt={item.title}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.35s ease-in-out',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              }}
            />
            <Stack
              direction="row"
              spacing={0.8}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
            >
              <IconButton
                size="small"
                onClick={handleToggleFavorite}
                sx={{
                  backgroundColor: alpha(BRAND_COLORS.white, 0.9),
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: BRAND_COLORS.white,
                  },
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <motion.div
                  key={item.isFavorited ? 'favorited' : 'not-favorited'}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {item.isFavorited ? (
                    <Favorite sx={{ color: BRAND_COLORS.burgundy, fontSize: 16 }} />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: 16, color: BRAND_COLORS.gray600 }} />
                  )}
                </motion.div>
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => handleActionClick(e, onShare)}
                sx={{
                  backgroundColor: alpha(BRAND_COLORS.white, 0.9),
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: BRAND_COLORS.white,
                  },
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <Share sx={{ fontSize: 16, color: BRAND_COLORS.gray600 }} />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Abrir chat con el vendedor"
                onClick={handleOpenChat}
                sx={{
                  backgroundColor: alpha(BRAND_COLORS.white, 0.9),
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: BRAND_COLORS.white,
                  },
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <ChatBubbleOutline sx={{ fontSize: 16, color: BRAND_COLORS.gray600 }} />
              </IconButton>
            </Stack>
          </Box>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, pb: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  mb: 1.2,
                  fontSize: '0.95rem',
                  color: BRAND_COLORS.black,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.title}
              </Typography>
            </Stack>

            <Chip
              label={item.category}
              size="small"
              sx={{
                mb: 1.2,
                alignSelf: 'flex-start',
                color: categoryStyle?.color || BRAND_COLORS.deepBlue,
                backgroundColor: categoryStyle?.bgColor || alpha(BRAND_COLORS.gray100, 0.7),
                fontWeight: 500,
                fontSize: '0.7rem',
                borderRadius: '3px',
                '& .MuiChip-label': {
                  px: 0.8,
                },
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.2,
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item.description}
            </Typography>

            <Box sx={{ mt: 'auto' }}>
              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Avatar
                  src={item.seller.avatar}
                  alt={item.seller.name}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  {item.seller.name}
                </Typography>
                {item.seller.isEmprendedorConfiable && (
                  <Tooltip title="Emprendedor Confiable">
                    <VerifiedUser sx={{ fontSize: 14, color: BRAND_COLORS.blue }} />
                  </Tooltip>
                )}
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: BRAND_COLORS.deepPurple,
                    fontSize: '1.15rem',
                  }}
                >
                  {item.lukas} <Typography component="span" variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 400 }}>{LUKAS_SYMBOL}</Typography>
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => handleActionClick(e, onAddToCart)}
                  startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
                  sx={{
                    borderColor: BRAND_COLORS.deepGreen,
                    color: BRAND_COLORS.deepGreen,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    py: 0.5,
                    borderRadius: '3px',
                    '&:hover': {
                      borderColor: BRAND_COLORS.deepGreen,
                      backgroundColor: alpha(BRAND_COLORS.deepGreen, 0.04),
                    },
                  }}
                >
                  Añadir
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};
