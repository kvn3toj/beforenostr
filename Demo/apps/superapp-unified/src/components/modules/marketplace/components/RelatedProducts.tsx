import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Avatar,
  Skeleton,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Favorite,
  FavoriteBorder,
  Verified,
  TrendingUp,
  WorkspacePremium,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../../types/marketplace';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  sellerId: string;
  productId: string;
  tags?: string[];
  limit?: number;
  showTitle?: boolean;
}

interface RelatedProductCardProps {
  product: Product;
  onFavoriteToggle: (productId: string) => void;
  isFavorited: boolean;
}

// 🌌 COSMOS + 🔥 PHOENIX: Sistema Inteligente de Productos Relacionados
const useRelatedProducts = (productId: string, category?: string, tags?: string[]) => {
  return useQuery({
    queryKey: ['marketplace', 'related-products', productId, category, tags],
    queryFn: async () => {
      try {
        // 🎯 ATLAS: Llamada real al backend para productos relacionados inteligentes
        const response = await apiService.get(`/marketplace/items/${productId}/related`, {
          params: {
            category,
            tags: tags?.join(','),
            limit: 8,
            includeConscious: true, // Priorizar productos conscientes
          }
        });
        return response.data?.relatedItems || [];
      } catch (error) {
        // 🔮 PAX + 🌸 ZENO: Fallback consciente basado en patrones de reciprocidad
        return generateConsciousRelatedProducts(productId, category, tags);
      }
    },
    enabled: !!productId,
    staleTime: 300000, // 5 minutos cache para productos relacionados
  });
};

// 🌱 GAIA + 🌙 LUNA: Generación consciente de productos relacionados
const generateConsciousRelatedProducts = (
  productId: string,
  category?: string,
  tags?: string[]
): Partial<Product>[] => {
  // 🎭 Sistema consciente que prioriza el Bien Común y la reciprocidad
  const consciousProducts: Partial<Product>[] = [
    {
      id: 'conscious-1',
      name: 'Producto Consciente Local',
      description: 'Apoya a emprendedores de tu comunidad',
      price: 25000,
      currency: 'Lükas',
      category: category || 'productos-conscientes',
      images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'],
      seller: {
        id: 'seller-conscious-1',
        name: 'María Tierra',
        username: '@maria_tierra',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        verified: true,
        rating: 4.9,
        reviewCount: 127,
        ayniScore: 95,
        consciousnessLevel: 'FLOURISHING' as const,
      },
      rating: 4.8,
      reviewCount: 89,
      tags: ['sustentable', 'local', 'artesanal', ...(tags || [])],
      ayniScore: 92,
      consciousnessLevel: 'FLOURISHING' as const,
      bienComunContribution: 88,
      sustainabilityScore: 95,
    },
    {
      id: 'conscious-2',
      name: 'Servicio de Impacto Social',
      description: 'Generando cambio positivo en la comunidad',
      price: 45000,
      currency: 'Lükas',
      category: category || 'servicios-conscientes',
      images: ['https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300'],
      seller: {
        id: 'seller-conscious-2',
        name: 'Carlos Armonía',
        username: '@carlos_armonia',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        verified: true,
        rating: 4.8,
        reviewCount: 156,
        ayniScore: 89,
        consciousnessLevel: 'TRANSCENDENT' as const,
      },
      rating: 4.9,
      reviewCount: 134,
      tags: ['transformador', 'social', 'consciente', ...(tags || [])],
      ayniScore: 89,
      consciousnessLevel: 'TRANSCENDENT' as const,
      bienComunContribution: 94,
      impactLevel: 'regional' as const,
    },
    {
      id: 'conscious-3',
      name: 'Creación Artística Única',
      description: 'Arte que eleva la consciencia y embellece el alma',
      price: 35000,
      currency: 'Lükas',
      category: category || 'arte-consciente',
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300'],
      seller: {
        id: 'seller-conscious-3',
        name: 'Ana Creatividad',
        username: '@ana_creatividad',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        verified: true,
        rating: 4.7,
        reviewCount: 98,
        ayniScore: 86,
        consciousnessLevel: 'GROWING' as const,
      },
      rating: 4.6,
      reviewCount: 76,
      tags: ['artístico', 'único', 'inspirador', ...(tags || [])],
      ayniScore: 86,
      consciousnessLevel: 'GROWING' as const,
      bienComunContribution: 82,
      sustainabilityScore: 88,
    }
  ];

  // 🔍 NIRA: Filtrar y personalizar basado en contexto consciente
  return consciousProducts
    .filter(product => {
      // Priorizar productos con valores similares
      if (tags?.length) {
        return tags.some(tag =>
          product.tags?.includes(tag) ||
          product.description?.toLowerCase().includes(tag.toLowerCase())
        );
      }
      return true;
    })
    .slice(0, 6);
};

const RelatedProductCard: React.FC<RelatedProductCardProps> = ({
  product,
  onFavoriteToggle,
  isFavorited,
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice.toLocaleString()}`;
    }
    return `$${safePrice.toLocaleString()}`;
  };

  const handleCardClick = () => {
          navigate(`/marketplace/item/${product.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(product.id);
  };

  return (
    <Card
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Imagen del producto */}
      <Box sx={{ position: 'relative', height: 180 }}>
        <CardMedia
          component="img"
          height="180"
          image={product.mainImage}
          alt={product.title}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg';
          }}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0,
          }}
        />

        {/* Skeleton de carga */}
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ position: 'absolute', top: 0 }}
          />
        )}

        {/* Badges */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {product.featured && (
            <Chip
              icon={<WorkspacePremium />}
              label="Destacado"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
          {product.trending && (
            <Chip
              icon={<TrendingUp />}
              label="Tendencia"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>

        {/* Botón de favorito */}
        <Fade in={isHovered || isFavorited}>
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' },
              width: 36,
              height: 36,
            }}
          >
            {isFavorited ? (
              <Favorite sx={{ color: '#FF4444' }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Fade>

        {/* Rating */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Rating
            value={product.rating}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="caption" fontWeight="bold">
            {product.rating}
          </Typography>
        </Box>
      </Box>

      {/* Contenido de la tarjeta */}
      <CardContent
        sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Título */}
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            mb: 1,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 40,
          }}
        >
          {product.title}
        </Typography>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {product.description}
        </Typography>

        {/* Precio */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {product.originalPrice && (
              <Typography
                variant="caption"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                }}
              >
                {formatPrice(product.originalPrice, product.currency)}
              </Typography>
            )}
            <Typography variant="h6" fontWeight="bold" color="primary">
              {formatPrice(product.price, product.currency)}
            </Typography>
          </Box>
        </Box>

        {/* Información del vendedor */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={product.seller.avatar} sx={{ width: 24, height: 24 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {product.seller?.name || 'Usuario'}
              </Typography>
              {product.seller.verified && (
                <Verified sx={{ fontSize: 12, color: '#1976d2' }} />
              )}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {product.reviewCount} reseñas
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  category,
  tags,
  limit = 6,
  showTitle = true,
}) => {
  const { data: relatedProducts = [], isLoading, error } = useRelatedProducts(productId, category, tags);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  const handleFavoriteToggle = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Productos Relacionados
        </Typography>

        {/* Controles de navegación */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Anterior">
            <IconButton
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                '&:disabled': { opacity: 0.3 },
              }}
            >
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title="Siguiente">
            <IconButton
              onClick={scrollRight}
              disabled={!canScrollRight}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                '&:disabled': { opacity: 0.3 },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Container de productos con scroll horizontal */}
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: '#999',
            },
          },
        }}
      >
        {relatedProducts.map((product, index) => (
          <Fade
            in
            timeout={500}
            style={{ transitionDelay: `${index * 100}ms` }}
            key={product.id}
          >
            <Box sx={{ minWidth: 280, maxWidth: 280 }}>
              <RelatedProductCard
                product={product}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorited={favorites.has(product.id)}
              />
            </Box>
          </Fade>
        ))}
      </Box>
    </Box>
  );
};
