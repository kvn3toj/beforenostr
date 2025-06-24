import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency: string;
  discount?: number;
  size: 'small' | 'medium' | 'large';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency,
  discount,
  size,
}) => {
  const formatPrice = (price: number, currency: string) => {
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice.toLocaleString()}`;
    }
    return `$${safePrice.toLocaleString()}`;
  };

  const priceVariant =
    size === 'small' ? 'subtitle2' : size === 'medium' ? 'h6' : 'h5';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      {/* Precio original tachado */}
      {originalPrice && (
        <Typography
          variant="body2"
          sx={{
            textDecoration: 'line-through',
            color: 'text.secondary',
            fontSize: size === 'small' ? '12px' : '14px',
          }}
        >
          {formatPrice(originalPrice, currency)}
        </Typography>
      )}

      {/* Precio actual */}
      <Typography
        variant={priceVariant}
        color="primary"
        sx={{
          fontWeight: 700,
          fontSize:
            size === 'small' ? '16px' : size === 'medium' ? '18px' : '24px',
        }}
      >
        {formatPrice(price, currency)}
      </Typography>

      {/* Badge de descuento */}
      {discount && (
        <Chip
          label={`${discount}% OFF`}
          size="small"
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '10px',
            height: 20,
          }}
        />
      )}
    </Box>
  );
};

export default PriceDisplay;
