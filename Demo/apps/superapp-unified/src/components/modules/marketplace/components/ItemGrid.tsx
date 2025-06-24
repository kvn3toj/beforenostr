import React from 'react';
import { Grid, Box } from '@mui/material';
import { ProductCard } from './ProductCard';
import ProductCardEnhanced from './ProductCardEnhanced';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    ayniScore?: number;
    consciousnessLevel?: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
  };
  location: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  createdAt: string;
  viewCount: number;
  favoriteCount: number;
  isFavorited?: boolean;
  discount?: number;
  originalPrice?: number;
  impactLevel?: 'local' | 'regional' | 'global';
  sustainabilityScore?: number;
  ayniScore?: number;
  consciousnessLevel?: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
  bienComunContribution?: number;
  reciprocityBalance?: number;
}

interface ItemGridProps {
  items: MarketplaceItem[];
  onToggleFavorite: (id: string) => void;
  onProductClick: (id: string) => void;
  viewMode?: 'grid' | 'list';
  variant?: 'enhanced' | 'standard';
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  onToggleFavorite,
  onProductClick,
  viewMode = 'grid',
  variant = 'enhanced'
}) => {
  const getGridColumns = () => {
    if (viewMode === 'list') {
      return { xs: 12 };
    }
    // Grid mode columns based on screen size
    return { xs: 12, sm: 6, md: 4, lg: 3 };
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid
            item
            {...getGridColumns()}
            key={item.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {variant === 'enhanced' ? (
              <ProductCardEnhanced
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                originalPrice={item.originalPrice}
                currency={item.currency}
                location={item.location}
                rating={item.rating}
                reviewCount={item.reviewCount}
                seller={item.seller}
                image={item.images[0] || '/placeholder.jpg'}
                images={item.images}
                isFavorited={item.isFavorited}
                onToggleFavorite={onToggleFavorite}
                onClick={onProductClick}
                tags={item.tags}
                featured={item.featured}
                trending={item.trending}
                discount={item.discount}
                viewMode={viewMode}
                ayniScore={item.ayniScore}
                consciousnessLevel={item.consciousnessLevel}
                impactLevel={item.impactLevel}
                sustainabilityScore={item.sustainabilityScore}
                bienComunContribution={item.bienComunContribution}
              />
            ) : (
              <ProductCard
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                originalPrice={item.originalPrice}
                currency={item.currency}
                location={item.location}
                rating={item.rating}
                reviewCount={item.reviewCount}
                seller={item.seller}
                image={item.images[0] || '/placeholder.jpg'}
                images={item.images}
                isFavorited={item.isFavorited}
                onToggleFavorite={onToggleFavorite}
                onClick={onProductClick}
                tags={item.tags}
                featured={item.featured}
                trending={item.trending}
                discount={item.discount}
                viewMode={viewMode}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ItemGrid;
