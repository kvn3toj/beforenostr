import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useMarketplaceData } from '../hooks/useRealBackendData';

/**
 * 🧪 Página de prueba para verificar que los datos del marketplace funcionen correctamente
 * Esta página muestra una vista previa de todos los datos mock generados
 */
export const MarketplaceTest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Usar datos REALES del backend únicamente
  const { data: marketplaceData, isLoading, error } = useMarketplaceData();
  
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando productos reales del marketplace...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Error cargando productos del marketplace: {error.message}
        </Alert>
      </Container>
    );
  }

  const items = marketplaceData?.items || [];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🏪 Marketplace CoomÜnity
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
        {items.length} productos y servicios del bien común
      </Typography>

      <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
        Categorías: {new Set(items.map((item) => item.category || item.type)).size} | 
        Datos: BACKEND REAL ✅
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
          <Grid size={{xs:12,md:3}}>
            <Typography variant="h4" fontWeight="bold">
              {items.length}
            </Typography>
            <Typography variant="body2">Items Totales</Typography>
          </Grid>
          <Grid size={{xs:12,md:3}}>
            <Typography variant="h4" fontWeight="bold">
              {items.filter((item) => item.featured).length}
            </Typography>
            <Typography variant="body2">Items Destacados</Typography>
          </Grid>
          <Grid size={{xs:12,md:3}}>
            <Typography variant="h4" fontWeight="bold">
              {items.filter((item) => item.trending).length}
            </Typography>
            <Typography variant="body2">Items Trending</Typography>
          </Grid>
          <Grid size={{xs:12,md:3}}>
            <Typography variant="h4" fontWeight="bold">
              {new Set(items.map((item) => item.category)).size}
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
        {items.filter((item) => item.featured).map((item) => (
          <Grid size={{xs:12,sm:6,md:4}} key={item.id}>
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
        {items.filter((item) => item.trending).map((item) => (
          <Grid size={{xs:12,sm:6,md:4}} key={item.id}>
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
        🌱 Sostenibilidad ({items.filter((item) => item.category === 'sostenibilidad').length} items)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {items.filter((item) => item.category === 'sostenibilidad').slice(0, 3).map((item) => (
          <Grid size={{xs:12,sm:4}} key={item.id}>
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
        📚 Educación ({items.filter((item) => item.category === 'educacion').length} items)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {items.filter((item) => item.category === 'educacion').slice(0, 3).map((item) => (
          <Grid size={{xs:12,sm:4}} key={item.id}>
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
            items.map((item) => ({
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
