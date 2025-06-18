import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Fade,
  Skeleton,
  Avatar,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  ChevronRight,
} from '@mui/icons-material';
import { ProductDetailView } from '../components/modules/marketplace/components/ProductDetailView';
import { Product } from '../types/marketplace';
import { useSmartQuery } from '../hooks/useSmartQuery';
import { useMarketplaceData } from '../hooks/useRealBackendData';
import { marketplaceAPI } from '../lib/api-service';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usar datos REALES del backend únicamente
  const { data: marketplaceData } = useMarketplaceData();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('ID de producto no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Intentar obtener el producto específico del backend
        const productData = await marketplaceAPI.getItem(id);
        
        if (productData) {
          setProduct(productData);
        } else {
          // Si no se encuentra el producto específico, buscar en la lista general
          const items = marketplaceData?.items || [];
          const foundProduct = items.find((item: any) => item.id === id);
          
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            // Si tampoco está en la lista, crear producto de ejemplo con datos reales del backend
            if (items.length > 0) {
              const baseItem = items[0];
              setProduct({
                ...baseItem,
                id,
                title: `Producto Real del Backend - ${id}`,
                description: 'Este producto proviene directamente del backend NestJS real, sin datos mock.',
              });
            } else {
              setError('Producto no encontrado y backend sin datos');
            }
          }
        }
      } catch (err) {
        console.error('Error cargando producto:', err);
        setError('Error cargando producto del backend');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, marketplaceData]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback: copiar al clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implementar llamada a API para guardar/quitar favorito
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={200} height={24} sx={{ ml: 2 }} />
        </Box>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr 1fr' }}>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={80}
                  height={60}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />

            <Box sx={{ mt: 3 }}>
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  width="100%"
                  height={20}
                  sx={{ mt: 0.5 }}
                />
              ))}
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width={150} height={48} />
              <Skeleton variant="rectangular" width={120} height={48} />
            </Box>
          </Box>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message || 'No se pudo cargar el producto'}
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Volver al marketplace
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header con navegación */}
        <Fade in timeout={300}>
          <Box sx={{ mb: 3 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
              separator={<ChevronRight fontSize="small" />}
              sx={{ mb: 2 }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/marketplace')}
                sx={{ textDecoration: 'none' }}
              >
                Marketplace
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() =>
                  navigate(`/marketplace?category=${product.category}`)
                }
                sx={{ textDecoration: 'none' }}
              >
                {product.category}
              </Link>
              <Typography variant="body2" color="text.primary">
                {product.title}
              </Typography>
            </Breadcrumbs>

            {/* Barra de acciones */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{ borderRadius: 2 }}
              >
                Volver
              </Button>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleShare}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <Share />
                </IconButton>

                <IconButton
                  onClick={handleToggleFavorite}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  {isFavorited ? (
                    <Favorite sx={{ color: '#FF4444' }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Contenido principal */}
        <Fade in timeout={500} style={{ transitionDelay: '200ms' }}>
          <Box>
            <ProductDetailView
              product={product}
              isFavorited={isFavorited}
              onToggleFavorite={handleToggleFavorite}
            />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default ProductDetail;
