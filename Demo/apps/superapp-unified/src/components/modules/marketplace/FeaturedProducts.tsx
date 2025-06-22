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
  Rating
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  AttachMoney as AttachMoneyIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatPrice, safeToLocaleString } from '../../../utils/numberUtils';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  ayniRating: number;
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
    description: 'Café cultivado por cooperativas locales con principios de Ayni',
    image: '/images/productos/cafe-organico.jpg',
    price: 25000,
    ayniRating: 4.8,
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
    ayniRating: 4.9,
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
    ayniRating: 4.7,
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
    <Box sx={{ py: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        ⭐ Productos Destacados
      </Typography>

      <Grid container spacing={3}>
        {featuredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      objectFit: 'cover',
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />

                  <Chip
                    icon={<VerifiedIcon />}
                    label="Destacado"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />

                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    display: 'flex',
                    gap: 1
                  }}>
                    <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}>
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}>
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {product.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating
                      value={product.ayniRating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="caption" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {product.ayniRating} Ayni
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <AttachMoneyIcon fontSize="small" />
                      {safeToLocaleString(product.price, 0, 'es-CO')}
                    </Typography>

                    <Chip
                      label={product.category}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
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
