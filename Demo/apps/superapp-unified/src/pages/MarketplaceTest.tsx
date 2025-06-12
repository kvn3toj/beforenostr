import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  marketplaceMockData,
  getItemsByCategory,
  getFeaturedItems,
  getTrendingItems,
} from '../data/marketplaceMockData';

/**
 * 🧪 Página de prueba para verificar que los datos del marketplace funcionen correctamente
 * Esta página muestra una vista previa de todos los datos mock generados
 */
export const MarketplaceTest: React.FC = () => {
  const featuredItems = getFeaturedItems();
  const trendingItems = getTrendingItems();
  const sustainabilityItems = getItemsByCategory('sostenibilidad');
  const educationItems = getItemsByCategory('educacion');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        🧪 Test de Datos del Marketplace
      </Typography>

      <Typography variant="h6" color="text.secondary" paragraph>
        Esta página muestra todos los datos mock generados para verificar que
        las imágenes y navegación funcionan correctamente.
      </Typography>

      {/* Estadísticas generales */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography variant="h4" fontWeight="bold">
              {marketplaceMockData.length}
            </Typography>
            <Typography variant="body2">Items Totales</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h4" fontWeight="bold">
              {featuredItems.length}
            </Typography>
            <Typography variant="body2">Items Destacados</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h4" fontWeight="bold">
              {trendingItems.length}
            </Typography>
            <Typography variant="body2">Items Trending</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h4" fontWeight="bold">
              {new Set(marketplaceMockData.map((item) => item.category)).size}
            </Typography>
            <Typography variant="body2">Categorías</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Sección: Items Destacados */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        🌟 Items Destacados
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {featuredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.images[0]}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={item.category} size="small" color="primary" />
                  <Chip label={item.type} size="small" variant="outlined" />
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" color="primary">
                    ü {item.price}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    href={`#/marketplace/product/${item.id}`}
                  >
                    Ver Detalle
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sección: Items Trending */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        🔥 Items Trending
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {trendingItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.images[0]}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={item.ayniCategory}
                    size="small"
                    color="secondary"
                  />
                  <Chip
                    label={`${item.sustainabilityScore}% sostenible`}
                    size="small"
                    color="success"
                  />
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" color="primary">
                    ü {item.price}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    href={`#/marketplace/product/${item.id}`}
                  >
                    Ver Detalle
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sección: Por Categorías */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        🏷️ Por Categorías
      </Typography>

      <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
        🌱 Sostenibilidad ({sustainabilityItems.length} items)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {sustainabilityItems.slice(0, 3).map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={item.images[0]}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ü {item.price} - {item.seller.firstName}{' '}
                  {item.seller.lastName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
        📚 Educación ({educationItems.length} items)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {educationItems.slice(0, 3).map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={item.images[0]}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ü {item.price} - {item.seller.firstName}{' '}
                  {item.seller.lastName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lista completa para debugging */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        📋 Lista Completa (para debugging)
      </Typography>
      <Box
        sx={{
          bgcolor: 'grey.100',
          p: 2,
          borderRadius: 1,
          maxHeight: 400,
          overflow: 'auto',
        }}
      >
        <pre style={{ fontSize: '12px', margin: 0 }}>
          {JSON.stringify(
            marketplaceMockData.map((item) => ({
              id: item.id,
              title: item.title,
              price: item.price,
              category: item.category,
              type: item.type,
              seller: `${item.seller.firstName} ${item.seller.lastName}`,
              images: item.images.length,
              featured: item.featured,
              trending: item.trending,
            })),
            null,
            2
          )}
        </pre>
      </Box>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
        <Typography variant="h6" color="success.dark">
          ✅ Test Completado
        </Typography>
        <Typography variant="body1" color="success.dark">
          Si puedes ver todas las imágenes y los enlaces funcionan, la
          integración está completa. Cada item tiene datos únicos y lleva a su
          página de detalle específica.
        </Typography>
      </Box>
    </Container>
  );
};

export default MarketplaceTest;
