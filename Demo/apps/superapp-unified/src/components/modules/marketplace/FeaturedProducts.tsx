import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Rating,
  alpha
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  AttachMoney as AttachMoneyIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatPrice, safeToLocaleString } from '../../../utils/numberUtils';
import { BRAND_COLORS } from '../../../theme/colors';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  reciprocidadRating: number;
  category: string;
  seller: string;
  featured?: boolean;
}

interface FeaturedProductsProps {
  products?: Product[];
  maxItems?: number;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Café Orgánico CoomÜnity',
    description: 'Café cultivado por cooperativas locales con principios de Reciprocidad',
    image: '/images/productos/cafe-organico.jpg',
    price: 25000,
    reciprocidadRating: 4.8,
    category: 'Alimentos',
    seller: 'Cooperativa Valle Verde',
    featured: true
  },
  {
    id: '2',
    title: 'Textiles Ancestrales',
    description: 'Tejidos tradicionales elaborados por artesanas de la comunidad',
    image: '/images/productos/textiles.jpg',
    price: 85000,
    reciprocidadRating: 4.9,
    category: 'Artesanías',
    seller: 'Tejedoras Unidos',
    featured: true
  },
  {
    id: '3',
    title: 'Miel de Abeja Nativa',
    description: 'Miel pura extraída respetando el equilibrio natural',
    image: '/images/productos/miel.jpg',
    price: 35000,
    reciprocidadRating: 4.7,
    category: 'Alimentos',
    seller: 'Apiarios Sostenibles',
    featured: true
  }
];

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products = sampleProducts,
  maxItems = 6
}) => {
  const featuredProducts = products.filter(p => p.featured).slice(0, maxItems);

  return (
    <Box sx={{ py: 2.5 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 2.5,
          fontWeight: '600',
          color: BRAND_COLORS.deepPurple,
          fontSize: '1.25rem'
        }}
      >
        ⭐ Productos Destacados
      </Typography>

      <Grid container spacing={2.5}>
        {featuredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: BRAND_COLORS.white,
                  border: `1px solid ${BRAND_COLORS.gray100}`,
                  borderRadius: 1.5,
                  boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 6px 16px ${alpha(BRAND_COLORS.gray300, 0.2)}`,
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />

                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: '0.85rem' }} />}
                    label="Destacado"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: alpha(BRAND_COLORS.deepBlue, 0.8),
                      color: BRAND_COLORS.white,
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      borderRadius: '3px',
                      '& .MuiChip-label': {
                        px: 0.8,
                      },
                    }}
                  />

                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    display: 'flex',
                    gap: 0.8
                  }}>
                    <IconButton
                      size="small"
                      sx={{
                        color: BRAND_COLORS.white,
                        bgcolor: alpha(BRAND_COLORS.black, 0.2),
                        width: 28,
                        height: 28,
                        '&:hover': {
                          bgcolor: alpha(BRAND_COLORS.black, 0.3),
                        }
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: BRAND_COLORS.white,
                        bgcolor: alpha(BRAND_COLORS.black, 0.2),
                        width: 28,
                        height: 28,
                        '&:hover': {
                          bgcolor: alpha(BRAND_COLORS.black, 0.3),
                        }
                      }}
                    >
                      <ShareIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ p: 2, pb: 1.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      lineHeight: 1.3,
                      mb: 1.2,
                      color: BRAND_COLORS.black,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.title}
                  </Typography>

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
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                    <Rating
                      value={product.reciprocidadRating}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: BRAND_COLORS.gold,
                        },
                        '& .MuiRating-iconEmpty': {
                          color: alpha(BRAND_COLORS.gold, 0.3),
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ ml: 0.8, fontWeight: 500, fontSize: '0.7rem' }}>
                      {product.reciprocidadRating} Reciprocidad
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: BRAND_COLORS.deepPurple,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.3,
                        fontSize: '1.15rem',
                      }}
                    >
                      <AttachMoneyIcon sx={{ fontSize: 18 }} />
                      {safeToLocaleString(product.price, 0, 'es-CO')}
                    </Typography>

                    <Chip
                      label={product.category}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: BRAND_COLORS.deepBlue,
                        color: BRAND_COLORS.deepBlue,
                        fontSize: '0.7rem',
                        borderRadius: '3px',
                        '& .MuiChip-label': {
                          px: 0.8,
                        },
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.8, display: 'block', fontSize: '0.7rem' }}
                  >
                    Por: {product.seller}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;
