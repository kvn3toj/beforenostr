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
// import { getItemById, marketplaceMockData } from '../data/marketplaceMockData';

// Mock database - En producción esto vendría de la API
const mockProducts: Record<string, Product> = {
  'blockchain-consulting-001': {
    id: 'blockchain-consulting-001',
    title: 'Consultoría especializada en Blockchain',
    description:
      'Asesoría profesional en implementación de soluciones blockchain para empresas. Más de 5 años de experiencia en el sector.',
    fullDescription: `
      Ofrezco servicios de consultoría especializada en tecnología blockchain para empresas que buscan implementar soluciones innovadoras y eficientes. Con más de 5 años de experiencia en el sector, he trabajado con startups y empresas Fortune 500.

      **Mi experiencia incluye:**
      - Desarrollo de smart contracts en Solidity
      - Arquitectura de aplicaciones descentralizadas (dApps)
      - Tokenización de activos
      - Implementación de protocolos DeFi
      - Auditorías de seguridad blockchain
      - NFTs y marketplaces digitales

      **Metodología de trabajo:**
      1. Análisis inicial de necesidades
      2. Propuesta de arquitectura técnica
      3. Plan de implementación detallado
      4. Desarrollo y testing
      5. Deployment y monitoreo
      6. Soporte post-implementación

      Trabajo con las principales blockchains: Ethereum, Polygon, BSC, Solana, y redes de segunda capa como Arbitrum y Optimism.
    `,
    price: 150,
    originalPrice: 200,
    currency: 'ü',
    category: 'Tecnología',
    subcategory: 'Blockchain',
    tags: [
      'Blockchain',
      'Smart Contracts',
      'DeFi',
      'Web3',
      'Consultoría',
      'Ethereum',
      'Solidity',
    ],
    images: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=800&h=600&fit=crop',
    ],
    mainImage:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',

    seller: {
      id: 'seller-001',
      name: 'Carlos Mendoza',
      username: '@carlosmendoza',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      coverImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
      bio: 'Senior Blockchain Developer con 5+ años de experiencia. Especialista en DeFi y smart contracts. Apasionado por Web3 y las tecnologías descentralizadas.',
      location: 'Madrid, España',
      verified: true,
      badges: [
        {
          id: 'expert',
          name: 'Experto Verificado',
          description: 'Experiencia comprobada en blockchain',
          icon: 'verified',
          color: '#1976d2',
          earnedAt: new Date('2023-01-15'),
          category: 'verification',
        },
        {
          id: 'top-seller',
          name: 'Top Seller',
          description: 'Más de 100 proyectos completados',
          icon: 'star',
          color: '#f57c00',
          earnedAt: new Date('2023-06-20'),
          category: 'achievement',
        },
      ],
      rating: 4.9,
      reviewCount: 87,
      responseTime: '2 horas',
      responseRate: 98,
      completionRate: 100,
      isOnline: true,
      lastSeen: new Date(),
      isActive: true,
      contactMethods: [
        {
          type: 'message',
          label: 'Mensaje directo',
          available: true,
          preferred: true,
        },
        {
          type: 'video',
          label: 'Videollamada',
          available: true,
        },
        {
          type: 'call',
          label: 'Llamada telefónica',
          available: false,
        },
      ],
      salesCount: 156,
      yearsActive: 3,
      languagesSpoken: ['Español', 'Inglés', 'Portugués'],
      allowMessages: true,
      memberSince: new Date('2021-03-10'),
      availability: {
        timezone: 'Europe/Madrid',
        schedule: {
          monday: { available: true, start: '09:00', end: '18:00' },
          tuesday: { available: true, start: '09:00', end: '18:00' },
          wednesday: { available: true, start: '09:00', end: '18:00' },
          thursday: { available: true, start: '09:00', end: '18:00' },
          friday: { available: true, start: '09:00', end: '17:00' },
          saturday: { available: false },
          sunday: { available: false },
        },
      },
    },

    features: [
      'Consultoría personalizada 1-a-1',
      'Análisis completo de viabilidad',
      'Documentación técnica detallada',
      'Prototipo funcional incluido',
      'Soporte post-implementación 30 días',
      'Revisiones ilimitadas',
    ],

    specifications: {
      Duración: '4-6 semanas',
      Metodología: 'Agile/Scrum',
      Entregables: 'Código + Documentación',
      Garantía: '30 días',
      Revisiones: 'Ilimitadas',
      Soporte: '24/7',
    },

    includes: [
      'Consulta inicial gratuita (1 hora)',
      'Análisis de necesidades',
      'Propuesta técnica detallada',
      'Desarrollo del prototipo',
      'Testing y auditoría',
      'Documentación completa',
      'Capacitación del equipo',
      'Soporte técnico 30 días',
    ],

    requirements: [
      'Reunión inicial para definir objetivos',
      'Acceso a documentación existente',
      'Disponibilidad para reuniones semanales',
      'Conocimientos básicos de blockchain (recomendado)',
    ],

    rating: 4.9,
    reviewCount: 87,
    reviews: [
      {
        id: 'review-001',
        productId: 'blockchain-consulting-001',
        reviewerId: 'user-001',
        reviewer: {
          name: 'Ana García',
          avatar:
            'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
          verified: true,
        },
        rating: 5,
        title: 'Excelente profesional',
        comment:
          'Carlos nos ayudó a implementar una solución blockchain para nuestro marketplace. Su conocimiento es excepcional y la comunicación fue perfecta durante todo el proyecto.',
        helpful: 15,
        notHelpful: 0,
        createdAt: new Date('2024-01-15'),
        verifiedPurchase: true,
        aspects: {
          communication: 5,
          quality: 5,
          delivery: 5,
          value: 4,
        },
        sellerResponse: {
          comment:
            'Gracias Ana! Fue un placer trabajar con tu equipo. El proyecto quedó excelente.',
          createdAt: new Date('2024-01-16'),
        },
      },
      {
        id: 'review-002',
        productId: 'blockchain-consulting-001',
        reviewerId: 'user-002',
        reviewer: {
          name: 'Miguel Rodríguez',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          verified: false,
        },
        rating: 5,
        title: 'Superó nuestras expectativas',
        comment:
          'Necesitábamos implementar smart contracts para nuestro token y Carlos nos guió en todo el proceso. Muy profesional y eficiente.',
        helpful: 12,
        notHelpful: 1,
        createdAt: new Date('2024-01-10'),
        verifiedPurchase: true,
        aspects: {
          communication: 5,
          quality: 5,
          delivery: 4,
          value: 5,
        },
      },
    ],

    location: 'Madrid, España',
    deliveryOptions: [
      {
        id: 'online',
        name: 'Consultoría Online',
        description: 'Sesiones por videollamada',
        price: 0,
        estimatedTime: 'Inmediato',
        type: 'digital',
        available: true,
      },
      {
        id: 'in-person',
        name: 'Consultoría Presencial',
        description: 'En Madrid y alrededores',
        price: 50,
        estimatedTime: '1-2 semanas',
        type: 'pickup',
        available: true,
      },
    ],

    status: 'active',
    featured: true,
    trending: true,
    urgent: false,
    is24Hours: true,
    hasVideo: false,

    viewCount: 1284,
    favoriteCount: 89,
    shareCount: 34,

    discount: 25,

    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2023-12-02'),

    type: 'service',
    serviceType: 'hybrid',

    availability: {
      available: true,
      nextAvailable: new Date('2024-01-25'),
    },
  },

  // Producto genérico para demostrar
  'default-product': {
    id: 'default-product',
    title: 'Servicio de Desarrollo Web',
    description:
      'Desarrollo de aplicaciones web modernas con React y Node.js. Incluye diseño responsive y SEO optimizado.',
    fullDescription: `
      Ofrecemos servicios completos de desarrollo web utilizando las últimas tecnologías y mejores prácticas de la industria.

      **Nuestros servicios incluyen:**
      - Desarrollo frontend con React/Vue.js
      - Backend con Node.js/Python
      - Bases de datos SQL y NoSQL
      - Integración de APIs REST
      - Diseño responsive
      - Optimización SEO

      **Proceso de trabajo:**
      1. Análisis de requisitos
      2. Diseño y prototipado
      3. Desarrollo iterativo
      4. Testing y QA
      5. Deployment
      6. Soporte y mantenimiento
    `,
    price: 450,
    originalPrice: 650,
    currency: 'ü',
    category: 'Tecnología',
    subcategory: 'Desarrollo Web',
    tags: ['React', 'Node.js', 'JavaScript', 'Web Development', 'SEO'],
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    ],
    mainImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',

    seller: {
      id: 'seller-002',
      name: 'Ana López',
      username: '@analopez',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
      coverImage:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
      bio: 'Full Stack Developer con experiencia en React, Node.js y tecnologías modernas. Apasionada por crear experiencias web excepcionales.',
      location: 'Barcelona, España',
      verified: true,
      badges: [
        {
          id: 'pro-dev',
          name: 'Desarrollador Pro',
          description: 'Desarrollador certificado',
          icon: 'code',
          color: '#10b981',
          earnedAt: new Date('2023-05-10'),
          category: 'verification',
        },
      ],
      rating: 4.8,
      reviewCount: 56,
      responseTime: '1 hora',
      responseRate: 100,
      completionRate: 95,
      isOnline: false,
      lastSeen: new Date(),
      isActive: true,
      contactMethods: [
        {
          type: 'message',
          label: 'Mensaje directo',
          available: true,
          preferred: true,
        },
        {
          type: 'video',
          label: 'Videollamada',
          available: true,
        },
      ],
      salesCount: 78,
      yearsActive: 2,
      languagesSpoken: ['Español', 'Inglés'],
      allowMessages: true,
      memberSince: new Date('2022-03-15'),
      availability: {
        timezone: 'Europe/Madrid',
        schedule: {
          monday: { available: true, start: '10:00', end: '19:00' },
          tuesday: { available: true, start: '10:00', end: '19:00' },
          wednesday: { available: true, start: '10:00', end: '19:00' },
          thursday: { available: true, start: '10:00', end: '19:00' },
          friday: { available: true, start: '10:00', end: '18:00' },
          saturday: { available: false },
          sunday: { available: false },
        },
      },
    },

    features: [
      'Desarrollo responsive',
      'Optimización SEO',
      'Integración de APIs',
      'Panel de administración',
      'Soporte técnico 60 días',
      'Código fuente incluido',
    ],

    specifications: {
      Duración: '2-4 semanas',
      Tecnologías: 'React, Node.js, MongoDB',
      Entregables: 'Aplicación + Documentación',
      Garantía: '60 días',
      Revisiones: '3 incluidas',
      Hosting: 'Configurable',
    },

    includes: [
      'Análisis de requisitos',
      'Diseño de interfaz',
      'Desarrollo completo',
      'Testing integral',
      'Documentación técnica',
      'Capacitación básica',
    ],

    requirements: [
      'Brief detallado del proyecto',
      'Contenido y recursos gráficos',
      'Acceso a hosting (si aplica)',
    ],

    rating: 4.8,
    reviewCount: 56,
    reviews: [
      {
        id: 'review-003',
        productId: 'default-product',
        reviewerId: 'user-003',
        reviewer: {
          name: 'Carlos Ruiz',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          verified: true,
        },
        rating: 5,
        title: 'Trabajo excepcional',
        comment:
          'Ana desarrolló nuestra aplicación web exactamente como la imaginamos. Muy profesional y cumplió con todos los plazos.',
        helpful: 8,
        notHelpful: 0,
        createdAt: new Date('2024-01-08'),
        verifiedPurchase: true,
        aspects: {
          communication: 5,
          quality: 5,
          delivery: 4,
          value: 5,
        },
      },
    ],

    location: 'Barcelona, España',
    deliveryOptions: [
      {
        id: 'remote',
        name: 'Desarrollo Remoto',
        description: 'Trabajo completamente online',
        price: 0,
        estimatedTime: '2-4 semanas',
        type: 'digital',
        available: true,
      },
    ],

    status: 'active',
    featured: false,
    trending: true,
    urgent: false,
    is24Hours: false,
    hasVideo: false,

    viewCount: 856,
    favoriteCount: 45,
    shareCount: 12,

    discount: 31,

    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-18'),
    publishedAt: new Date('2023-11-16'),

    type: 'service',
    serviceType: 'online',

    availability: {
      available: true,
      nextAvailable: new Date('2024-02-01'),
    },
  },
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Función para generar producto dinámico basado en ID
  const generateProductFromId = (productId: string): Product => {
    // Primero buscar en los datos mock nuevos del marketplace
    // Mock function disabled during Phase 2 elimination
    // const mockItem = getItemById(productId);
    const mockItem = null;
    if (mockItem) {
      // Convertir formato de mock a formato Product esperado por ProductDetailView
      return {
        id: mockItem.id,
        title: mockItem.title,
        description: mockItem.description,
        fullDescription: mockItem.fullDescription || mockItem.description,
        price: mockItem.price,
        originalPrice: mockItem.originalPrice,
        currency: mockItem.currency === 'LUKAS' ? 'ü' : mockItem.currency,
        category: mockItem.category,
        subcategory: mockItem.type,
        tags: mockItem.tags,
        images: mockItem.images,
        mainImage: mockItem.images[0],
        seller: {
          id: mockItem.seller.id,
          name: `${mockItem.seller.firstName} ${mockItem.seller.lastName}`,
          username: mockItem.seller.username,
          avatar: mockItem.seller.avatarUrl,
          coverImage:
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
          bio: mockItem.seller.bio || 'Emprendedor Confiable de CoomÜnity',
          location: mockItem.seller.location || mockItem.location,
          verified: mockItem.seller.verified || true,
          badges: [
            {
              id: 'coomunity-verified',
              name: 'Emprendedor Confiable',
              description: 'Verificado por la comunidad CoomÜnity',
              icon: 'verified',
              color: '#4CAF50',
              earnedAt: new Date('2023-01-15'),
              category: 'verification',
            },
          ],
          rating: mockItem.seller.rating || mockItem.rating,
          reviewCount: mockItem.seller.reviewCount || mockItem.reviewCount,
          responseTime: mockItem.seller.responseTime || '2 horas',
          responseRate: 98,
          completionRate: 100,
          isOnline: mockItem.seller.isOnline || false,
          lastSeen: new Date(),
          isActive: true,
          contactMethods: [
            {
              type: 'message',
              label: 'Mensaje directo',
              available: true,
              preferred: true,
            },
            {
              type: 'video',
              label: 'Videollamada',
              available: true,
            },
          ],
          salesCount: Math.floor(Math.random() * 200) + 50,
          yearsActive: 3,
          languagesSpoken: ['Español'],
          allowMessages: true,
          memberSince: new Date(mockItem.seller.memberSince || '2021-01-01'),
          availability: {
            timezone: 'America/Lima',
            schedule: {
              monday: { available: true, start: '09:00', end: '18:00' },
              tuesday: { available: true, start: '09:00', end: '18:00' },
              wednesday: { available: true, start: '09:00', end: '18:00' },
              thursday: { available: true, start: '09:00', end: '18:00' },
              friday: { available: true, start: '09:00', end: '17:00' },
              saturday: { available: false },
              sunday: { available: false },
            },
          },
        },
        features: [
          'Servicio personalizado',
          'Garantía de calidad',
          'Soporte post-entrega',
          'Metodología probada',
          'Enfoque en el bien común',
          'Impacto social medible',
        ],
        specifications: {
          Tipo: mockItem.type,
          Categoría: mockItem.category,
          'Nivel de Impacto': mockItem.impactLevel,
          'Score de Sostenibilidad': `${mockItem.sustainabilityScore}/100`,
          'Categoría Ayni': mockItem.ayniCategory,
        },
        includes: [
          'Consulta inicial',
          'Desarrollo del servicio/producto',
          'Documentación completa',
          'Soporte técnico',
          'Garantía de satisfacción',
        ],
        requirements: [
          'Reunión inicial para definir objetivos',
          'Comunicación fluida durante el proceso',
          'Feedback constructivo',
        ],
        rating: mockItem.rating,
        reviewCount: mockItem.reviewCount,
        reviews: [
          {
            id: 'review-mock-1',
            productId: mockItem.id,
            reviewerId: 'user-mock-1',
            reviewer: {
              name: 'Usuario Satisfecho',
              avatar:
                'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
              verified: true,
            },
            rating: 5,
            title: 'Excelente servicio',
            comment:
              'Muy profesional y con gran impacto social. Lo recomiendo totalmente.',
            helpful: 12,
            notHelpful: 0,
            createdAt: new Date('2024-01-10'),
            verifiedPurchase: true,
            aspects: {
              communication: 5,
              quality: 5,
              delivery: 5,
              value: 5,
            },
          },
        ],
        location: mockItem.location,
        deliveryOptions: [
          {
            id: 'standard',
            name: 'Entrega Estándar',
            description: 'Modalidad de entrega estándar',
            price: 0,
            estimatedTime: '2-4 semanas',
            type: 'standard',
            available: true,
          },
        ],
        status: 'active',
        featured: mockItem.featured,
        trending: mockItem.trending,
        urgent: false,
        is24Hours: false,
        hasVideo: false,
        viewCount: mockItem.viewCount,
        favoriteCount: mockItem.favoriteCount,
        shareCount: 0,
        discount: mockItem.originalPrice
          ? Math.round(
              ((mockItem.originalPrice - mockItem.price) /
                mockItem.originalPrice) *
                100
            )
          : undefined,
        createdAt: new Date(mockItem.createdAt),
        updatedAt: new Date(),
        publishedAt: new Date(mockItem.createdAt),
        type: mockItem.type.toLowerCase() as 'product' | 'service',
        serviceType: 'hybrid',
        availability: {
          available: true,
          nextAvailable: new Date('2024-02-01'),
        },
      };
    }

    // Si existe en la base de datos mock legacy, usar eso
    if (mockProducts[productId]) {
      return mockProducts[productId];
    }

    // Generar producto dinámico basado en el ID usando datos del array
    // Mock data disabled during Phase 2 elimination
    // if (marketplaceMockData.length > 0) {
    //   const baseItem = marketplaceMockData[0];
    //   return generateProductFromId(baseItem.id);
    // }

    // Producto genérico por defecto como último recurso
    return {
      ...mockProducts['default-product'],
      id: productId,
    };
  };

  // En una aplicación real, esto haría una llamada a la API
  const {
    data: product,
    isLoading,
    error,
  } = useSmartQuery(
    ['product', id],
    async () => {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!id) {
        throw new Error('ID de producto requerido');
      }

      // Generar producto basado en el ID
      return generateProductFromId(id);
    },
    'standard', // Tipo de query para productos del marketplace
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );

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
  if (isLoading) {
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
