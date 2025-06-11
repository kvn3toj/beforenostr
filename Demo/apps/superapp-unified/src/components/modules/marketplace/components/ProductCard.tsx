import React from 'react';
import { Box, Typography, Avatar, IconButton, Chip } from '@mui/material';
import { Bookmark, BookmarkBorder, Star } from '@mui/icons-material';

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  location: string;
  rating: number;
  seller: {
    name: string;
    username: string;
    avatar: string;
    viewCount?: number;
    favoriteCount?: number;
  };
  image: string;
  isFavorited?: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  variant?: 'recommended' | 'category';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  currency,
  location,
  rating,
  seller,
  image,
  isFavorited = false,
  onToggleFavorite,
  onClick,
  variant = 'recommended',
}) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${price}`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <Box
      onClick={() => onClick(id)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '160px',
        height: '220px',
        backgroundColor: '#E8E8E8',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Product Image with Overlay */}
      <Box
        sx={{
          position: 'relative',
          height: '90px',
          backgroundColor: '#D0D0D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Gray Triangle Placeholder */}
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderBottom: '30px solid #A0A0A0',
          }}
        />

        {/* Currency and Price Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#740056',
            }}
          >
            ü
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {price}
          </Typography>
        </Box>

        {/* Bookmark Icon */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            width: '32px',
            height: '32px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          {isFavorited ? (
            <Bookmark sx={{ fontSize: '18px', color: '#740056' }} />
          ) : (
            <BookmarkBorder sx={{ fontSize: '18px', color: '#666' }} />
          )}
        </IconButton>

        {/* Star Rating */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <Star sx={{ fontSize: '14px', color: '#000' }} />
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {rating}
          </Typography>
        </Box>

        {/* Position Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(108, 108, 108, 0.9)',
            color: '#FFF',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          1st
        </Box>
      </Box>

      {/* Product Info */}
      <Box sx={{ padding: '8px 12px' }}>
        {/* Product Title */}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
            mb: 0.5,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        {/* Location */}
        <Typography
          sx={{
            fontSize: '11px',
            color: '#888',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {location}
        </Typography>

        {/* Seller Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            mb: 1,
          }}
        >
          <Avatar
            src={seller.avatar}
            sx={{
              width: '24px',
              height: '24px',
              backgroundColor: '#DDD',
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                lineHeight: 1.2,
              }}
            >
              {seller.name}
            </Typography>
            <Typography
              sx={{
                fontSize: '11px',
                color: '#666',
                lineHeight: 1.2,
              }}
            >
              {seller.username}
            </Typography>
          </Box>
        </Box>

        {/* Business Name */}
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          Nombre del emprendimiento
        </Typography>

        {/* Stats and Product Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Box
                component="img"
                src="/icons/truck.svg"
                alt="delivery"
                sx={{ width: '14px', height: '14px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Typography
                sx={{
                  fontSize: '11px',
                  color: '#888',
                }}
              >
                {seller.viewCount || 44}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Box
                component="img"
                src="/icons/comment.svg"
                alt="comments"
                sx={{ width: '14px', height: '14px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Typography
                sx={{
                  fontSize: '11px',
                  color: '#888',
                }}
              >
                {seller.favoriteCount || 33}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Box
                component="img"
                src="/icons/location.svg"
                alt="location"
                sx={{ width: '14px', height: '14px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
          </Box>

          {/* Product Badge */}
          <Box
            sx={{
              border: '1px dashed #888',
              borderRadius: '4px',
              padding: '2px 6px',
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                color: '#888',
                fontWeight: '500',
              }}
            >
              Producto
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
