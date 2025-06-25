import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import {
  EnhancedMarketplaceCard,
  MarketplaceItem,
} from './EnhancedMarketplaceCard';
import { EnhancedMarketplaceCardSkeleton } from './EnhancedMarketplaceCard.skeleton';
import { motion } from 'framer-motion';

interface ItemGridProps {
  items: MarketplaceItem[];
  isLoading: boolean;
  onToggleFavorite: (id: string) => void;
  onProductClick: (id: string) => void;
  onAddToCart: (id: string) => void;
  onShare: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  isLoading,
  onToggleFavorite,
  onProductClick,
  onAddToCart,
  onShare,
  viewMode = 'grid',
}) => {
  const getGridColumns = () => {
    if (viewMode === 'list') {
      return { xs: 12, md: 6 };
    }
    // Grid mode columns based on screen size
    return { xs: 12, sm: 6, md: 4, lg: 3 };
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(8)).map((_, index) => (
          <Grid item {...getGridColumns()} key={index}>
            <EnhancedMarketplaceCardSkeleton />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          No se encontraron tesoros
        </Typography>
        <Typography color="text.secondary">
          Intenta ajustar tu búsqueda o explora otras categorías.
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Grid container spacing={3}>
        {items.map((item: MarketplaceItem) => (
          <Grid
            item
            {...getGridColumns()}
            key={item.id}
          >
            <EnhancedMarketplaceCard
              item={item}
              onToggleFavorite={() => onToggleFavorite(item.id)}
              onViewDetails={() => onProductClick(item.id)}
              onAddToCart={() => onAddToCart(item.id)}
              onShare={() => onShare(item.id)}
            />
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default ItemGrid;
