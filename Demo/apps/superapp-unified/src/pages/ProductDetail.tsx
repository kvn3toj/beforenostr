import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Fade,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  ChevronRight,
} from '@mui/icons-material';
import { ProductDetailView } from '../components/modules/marketplace/components/ProductDetailView';
import type { Product, Seller } from '../types/marketplace';
import { useMarketplaceItem } from '../hooks/useRealBackendData';
import { ProductDetailSkeleton } from '../components/modules/marketplace/components/ProductDetailView.skeleton';

const mapBackendItemToProduct = (item: any): Product => {
  const sellerData = item.seller || {};
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    fullDescription: item.fullDescription || item.description,
    price: item.price,
    currency: item.currency || 'UNIT',
    category: item.category,
    tags: item.tags || [],
    images: item.images && item.images.length > 0 ? item.images : ['https://via.placeholder.com/800x600'],
    mainImage: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/800x600',
    seller: {
      id: sellerData.id,
      name: sellerData.name || 'Vendedor Anónimo',
      username:
        sellerData.username ||
        (sellerData.name
          ? sellerData.name.toLowerCase().replace(/\\s+/g, '')
          : `vendedor_${sellerData.id || 'id'}`),
      avatar: sellerData.avatar,
      verified: sellerData.isEmprendedorConfiable,
      rating: sellerData.rating || 0,
      reviewCount: sellerData.reviewCount || 0,
      location: sellerData.location || 'Online',
      badges: [],
      contactMethods: [],
      isOnline: true,
      isActive: true,
      allowMessages: true,
      memberSince: new Date(sellerData.createdAt || Date.now()),
      responseTime: 'N/A',
      responseRate: 0,
    } as Seller,
    rating: item.rating || 0,
    reviewCount: item.reviewCount || 0,
    reviews: item.reviews || [],
    deliveryOptions: [],
    status: 'active',
    location: item.location || 'Online',
    viewCount: item.viewCount || 0,
    favoriteCount: item.favoriteCount || 0,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt || item.createdAt),
    type: item.type || 'product',
  };
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const { data: rawProduct, isLoading, error } = useMarketplaceItem(id || '');

  const product = useMemo(() => {
    if (!rawProduct) return null;
    return mapBackendItemToProduct(rawProduct);
  }, [rawProduct]);

  const handleBack = () => {
    navigate('/marketplace');
  };

  const handleToggleFavorite = () => {
    setIsFavorited(prev => !prev);
    // TODO: Add API call to persist favorite status
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          No se pudo cargar el producto. Por favor, intenta de nuevo.
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>Volver al Marketplace</Button>
      </Container>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Breadcrumbs separator={<ChevronRight />} sx={{ mb: 2 }}>
            <MuiLink component="button" onClick={handleBack} underline="hover" color="inherit">
              Marketplace
            </MuiLink>
            <Typography color="text.primary">{product.title}</Typography>
          </Breadcrumbs>
          <IconButton onClick={handleBack} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <ProductDetailView
            product={product}
            isFavorited={isFavorited}
            onToggleFavorite={handleToggleFavorite}
          />
        </Container>
      </Box>
    </Fade>
  );
};

export default ProductDetail;
