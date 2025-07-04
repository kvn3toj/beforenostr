import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { ProductCard } from './components/ProductCard';
import { Product } from '../../../types/marketplace';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onProductClick
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Cargando productos...</Typography>
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="text.secondary">
          No se encontraron productos
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <ProductCard 
            product={product}
            onClick={() => onProductClick?.(product)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid; 