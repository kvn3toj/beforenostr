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

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  sellerId: string;
}

interface RelatedProductCardProps {
  product: Product;
  onFavoriteToggle: (productId: string) => void;
  isFavorited: boolean;
}

// Mock data para productos relacionados
const generateMockRelatedProducts = (
  category: string,
  sellerId: string,
  currentProductId: string
): Product[] => {
  const mockProducts: Partial<Product>[] = [
    {
      id: 'smart-contract-audit',
      title: 'Auditoría de Smart Contracts',
      description:
        'Revisión completa de seguridad para tus contratos inteligentes',
      price: 300,
      originalPrice: 400,
      currency: 'ü',
      category: 'Tecnología',
      rating: 4.8,
      reviewCount: 42,
      mainImage:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      featured: true,
      seller: {
        id: 'seller-001',
        name: 'Carlos Mendoza',
        username: '@carlosmendoza',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: true,
        rating: 4.9,
        reviewCount: 87,
        responseTime: '2 horas',
        responseRate: 98,
        isOnline: true,
        isActive: true,
        allowMessages: true,
        memberSince: new Date('2021-03-10'),
        location: 'Madrid, España',
        badges: [],
        contactMethods: [],
      },
      tags: ['Blockchain', 'Security', 'Auditoría'],
      viewCount: 856,
      favoriteCount: 34,
      type: 'service',
      status: 'active',
      deliveryOptions: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'dapp-development',
      title: 'Desarrollo de DApp Completa',
      description:
        'Aplicación descentralizada desde cero con frontend y backend',
      price: 1200,
      currency: 'ü',
      category: 'Tecnología',
      rating: 4.9,
      reviewCount: 23,
      mainImage:
        'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop',
      trending: true,
      seller: {
        id: 'seller-002',
        name: 'Ana López',
        username: '@analopez',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        verified: true,
        rating: 4.8,
        reviewCount: 56,
        responseTime: '1 hora',
        responseRate: 100,
        isOnline: false,
        isActive: true,
        allowMessages: true,
        memberSince: new Date('2021-08-15'),
        location: 'Barcelona, España',
        badges: [],
        contactMethods: [],
      },
      tags: ['DApp', 'Frontend', 'React'],
      viewCount: 1245,
      favoriteCount: 78,
      type: 'service',
      status: 'active',
      deliveryOptions: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'nft-marketplace',
      title: 'Marketplace NFT Personalizado',
      description: 'Plataforma completa para crear, vender y comprar NFTs',
      price: 800,
      currency: 'ü',
      category: 'Tecnología',
      rating: 4.7,
      reviewCount: 19,
      mainImage:
        'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=300&fit=crop',
      seller: {
        id: 'seller-003',
        name: 'Miguel Torres',
        username: '@migueltorres',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        verified: true,
        rating: 4.6,
        reviewCount: 34,
        responseTime: '3 horas',
        responseRate: 95,
        isOnline: true,
        isActive: true,
        allowMessages: true,
        memberSince: new Date('2022-01-20'),
        location: 'Valencia, España',
        badges: [],
        contactMethods: [],
      },
      tags: ['NFT', 'Marketplace', 'Web3'],
      viewCount: 672,
      favoriteCount: 45,
      type: 'service',
      status: 'active',
      deliveryOptions: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'defi-protocol',
      title: 'Protocolo DeFi Personalizado',
      description: 'Desarrollo de protocolos de finanzas descentralizadas',
      price: 2000,
      currency: 'ü',
      category: 'Tecnología',
      rating: 5.0,
      reviewCount: 8,
      mainImage:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      featured: true,
      seller: {
        id: 'seller-001',
        name: 'Carlos Mendoza',
        username: '@carlosmendoza',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: true,
        rating: 4.9,
        reviewCount: 87,
        responseTime: '2 horas',
        responseRate: 98,
        isOnline: true,
        isActive: true,
        allowMessages: true,
        memberSince: new Date('2021-03-10'),
        location: 'Madrid, España',
        badges: [],
        contactMethods: [],
      },
      tags: ['DeFi', 'Solidity', 'Yield'],
      viewCount: 234,
      favoriteCount: 12,
      type: 'service',
      status: 'active',
      deliveryOptions: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'blockchain-course',
      title: 'Curso Avanzado de Blockchain',
      description: 'Aprende desarrollo blockchain desde cero hasta experto',
      price: 250,
      currency: 'ü',
      category: 'Educación',
      rating: 4.9,
      reviewCount: 156,
      mainImage:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      trending: true,
      seller: {
        id: 'seller-004',
        name: 'Laura Martín',
        username: '@lauramartin',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        verified: true,
        rating: 4.9,
        reviewCount: 203,
        responseTime: '1 hora',
        responseRate: 99,
        isOnline: true,
        isActive: true,
        allowMessages: true,
        memberSince: new Date('2020-05-10'),
        location: 'Sevilla, España',
        badges: [],
        contactMethods: [],
      },
      tags: ['Curso', 'Blockchain', 'Educación'],
      viewCount: 3421,
      favoriteCount: 289,
      type: 'course',
      status: 'active',
      deliveryOptions: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return mockProducts
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4) as Product[];
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
    navigate(`/marketplace/product/${product.id}`);
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
  currentProductId,
  category,
  sellerId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Generar productos relacionados mock
  const relatedProducts = generateMockRelatedProducts(
    category,
    sellerId,
    currentProductId
  );

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
