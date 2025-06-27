import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  CardMedia,
  Skeleton,
  Avatar,
  Badge,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  keyframes,
  Typography,
  Stack,
} from '@mui/material';
import {
  Spa as Eco, // Nature/sustainability icon alternative
  Star,
  Verified,
  PhotoCamera,
  BrokenImage,
  AutoAwesome,
  LocalOffer,
  TrendingUp,
  Refresh,
  ZoomIn,
  Favorite,
  Share,
} from '@mui/icons-material';

// 🌟 Enhanced Service-Specific Image Categories
export const CONSCIOUS_IMAGE_CATEGORIES = {
  wellness: {
    keywords: ['yoga', 'meditación', 'wellness', 'bienestar', 'mindfulness', 'paz', 'relajación'],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', // yoga sunset
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // meditation
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // wellness
      'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&q=80', // zen garden
    ],
    color: '#4caf50',
    icon: '🧘‍♀️'
  },
  technology: {
    keywords: ['desarrollo', 'web', 'programación', 'software', 'app', 'tecnología', 'código', 'digital'],
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80', // coding
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80', // tech workspace
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80', // modern tech
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80', // development
    ],
    color: '#2196f3',
    icon: '💻'
  },
  sustainability: {
    keywords: ['huerto', 'orgánico', 'jardín', 'plantas', 'ecológico', 'sostenible', 'verde', 'natural'],
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', // organic garden
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80', // sustainable living
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80', // green plants
      'https://images.unsplash.com/photo-1463620910506-d0458143b207?w=800&q=80', // eco garden
    ],
    color: '#4caf50',
    icon: '🌱'
  },
  spiritual: {
    keywords: ['sahumeiro', 'limpieza', 'energía', 'spiritual', 'sanación', 'cristales', 'aura', 'chakras'],
    images: [
      'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&q=80', // sage crystals
      'https://images.unsplash.com/photo-1582139329536-e7284fafe1ef?w=800&q=80', // spiritual stones
      'https://images.unsplash.com/photo-1616103240283-73d0e061f42e?w=800&q=80', // energy cleansing
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', // candles
    ],
    color: '#9c27b0',
    icon: '✨'
  },
  music: {
    keywords: ['guitarra', 'música', 'instrumento', 'clases', 'musical', 'sonido', 'melodía'],
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', // acoustic guitar
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', // music studio
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80', // guitar close-up
      'https://images.unsplash.com/photo-1460036521480-ff49c08c2781?w=800&q=80', // music instruments
    ],
    color: '#ff9800',
    icon: '🎸'
  },
  education: {
    keywords: ['intercambio', 'clases', 'enseñanza', 'educación', 'aprendizaje', 'estudio', 'conocimiento'],
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80', // education learning
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', // books study
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', // classroom
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', // collaborative learning
    ],
    color: '#3f51b5',
    icon: '📚'
  },
  design: {
    keywords: ['diseño', 'gráfico', 'creativo', 'arte', 'visual', 'logo', 'branding'],
    images: [
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80', // design workspace
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', // creative design
      'https://images.unsplash.com/photo-1609990267687-4bedef3e7d85?w=800&q=80', // graphic design
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', // design tools
    ],
    color: '#e91e63',
    icon: '🎨'
  },
  community: {
    keywords: ['comunidad', 'social', 'grupo', 'colaboración', 'cooperativa', 'colectivo'],
    images: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', // community garden
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80', // community meeting
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80', // collaboration
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80', // team work
    ],
    color: '#00bcd4',
    icon: '🤝'
  },
  holistic: {
    keywords: ['holístico', 'integral', 'alternativo', 'natural', 'terapia', 'equilibrio'],
    images: [
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80', // holistic circle
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // holistic wellness
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // natural therapy
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', // balance
    ],
    color: '#673ab7',
    icon: '🌿'
  }
};

// 🌟 Animations for conscious loading
const consciousShimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const consciousGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
  }
`;

// 🎯 Smart image categorization function
export const categorizeService = (title: string, description: string, category: string) => {
  const fullText = `${title} ${description} ${category}`.toLowerCase();

  for (const [categoryKey, categoryData] of Object.entries(CONSCIOUS_IMAGE_CATEGORIES)) {
    for (const keyword of categoryData.keywords) {
      if (fullText.includes(keyword)) {
        return categoryKey;
      }
    }
  }

  return 'community'; // Default fallback
};

// 🌟 Get appropriate image for service
export const getConsciousServiceImage = (title: string, description: string, category: string, imageIndex: number = 0) => {
  const serviceCategory = categorizeService(title, description, category);
  const categoryData = CONSCIOUS_IMAGE_CATEGORIES[serviceCategory as keyof typeof CONSCIOUS_IMAGE_CATEGORIES];

  if (categoryData && categoryData.images.length > 0) {
    return categoryData.images[imageIndex % categoryData.images.length];
  }

  return CONSCIOUS_IMAGE_CATEGORIES.community.images[0]; // Safe fallback
};

// 🎯 Check if image needs replacement
export const needsImageReplacement = (url: string) => {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('loremflickr') ||
    lower.includes('cat') ||
    lower.includes('statue') ||
    lower.includes('placeholder') ||
    lower.includes('via.placeholder') ||
    lower.includes('lorem') ||
    lower.includes('picsum') ||
    lower.includes('httpstat.us') ||
    url.trim() === ''
  );
};

// 🌟 Enhanced image sanitization
export const sanitizeProductImages = (
  images: string[] | undefined,
  title: string = '',
  description: string = '',
  category: string = ''
): string[] => {
  if (!images || images.length === 0) {
    return [getConsciousServiceImage(title, description, category, 0)];
  }

  const sanitized = images.map((url, index) => {
    if (needsImageReplacement(url)) {
      return getConsciousServiceImage(title, description, category, index);
    }
    return url;
  });

  // Remove duplicates while preserving order
  const uniqueImages = sanitized.filter((url, index, self) =>
    self.findIndex(img => img === url) === index
  );

  return uniqueImages.length > 0 ? uniqueImages : [getConsciousServiceImage(title, description, category, 0)];
};

// 🎯 Props interfaces
interface ConsciousProductImageProps {
  images: string[];
  title: string;
  description?: string;
  category?: string;
  width?: number | string;
  height?: number | string;
  showBadges?: boolean;
  showHoverEffects?: boolean;
  isPopular?: boolean;
  isSustainable?: boolean;
  rating?: number;
  onImageClick?: () => void;
  onImageLoad?: () => void;
  borderRadius?: number;
  fallbackIcon?: React.ReactNode;
}

// 🛡️ Main Conscious Product Image Component
export const ConsciousProductImage: React.FC<ConsciousProductImageProps> = ({
  images,
  title,
  description = '',
  category = '',
  width = '100%',
  height = 200,
  showBadges = true,
  showHoverEffects = true,
  isPopular = false,
  isSustainable = false,
  rating = 0,
  onImageClick,
  onImageLoad,
  borderRadius = 2,
  fallbackIcon,
}) => {
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Get service category for styling
  const serviceCategory = categorizeService(title, description, category);
  const categoryData = CONSCIOUS_IMAGE_CATEGORIES[serviceCategory as keyof typeof CONSCIOUS_IMAGE_CATEGORIES] || CONSCIOUS_IMAGE_CATEGORIES.community;

  // Sanitize images on mount
  const [consciousImages, setConsciousImages] = useState<string[]>(() =>
    sanitizeProductImages(images, title, description, category)
  );

  useEffect(() => {
    setConsciousImages(sanitizeProductImages(images, title, description, category));
  }, [images, title, description, category]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onImageLoad?.();
  }, [onImageLoad]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);

    // Try next image if available
    if (currentImageIndex < consciousImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      // Use category fallback
      const fallbackImage = getConsciousServiceImage(title, description, category, 0);
      setConsciousImages([fallbackImage]);
      setCurrentImageIndex(0);
      setIsLoading(true);
      setHasError(false);
    }
  }, [currentImageIndex, consciousImages.length, title, description, category]);

  const currentImage = consciousImages[currentImageIndex] || getConsciousServiceImage(title, description, category, 0);

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        borderRadius,
        overflow: 'hidden',
        cursor: onImageClick ? 'pointer' : 'default',
        backgroundColor: alpha(categoryData.color, 0.1),
        '&:hover': showHoverEffects ? {
          '& .image-overlay': {
            opacity: 1,
          },
          '& .main-image': {
            transform: 'scale(1.05)',
          },
        } : {},
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onImageClick}
    >
      {/* Loading skeleton with conscious animation */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(
              90deg,
              ${alpha(categoryData.color, 0.1)} 25%,
              ${alpha(categoryData.color, 0.2)} 50%,
              ${alpha(categoryData.color, 0.1)} 75%
            )`,
            backgroundSize: '200% 100%',
            animation: `${consciousShimmer} 1.5s infinite linear`,
            zIndex: 1,
          }}
        />
      )}

      {/* Main product image */}
      <CardMedia
        ref={imageRef}
        component="img"
        className="main-image"
        image={currentImage}
        alt={`${title} - Imagen del producto`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          opacity: isLoading ? 0 : 1,
        }}
      />

      {/* Error fallback with category icon */}
      {hasError && !isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(categoryData.color, 0.1),
            color: categoryData.color,
            zIndex: 2,
          }}
        >
          {fallbackIcon || <PhotoCamera sx={{ fontSize: 48, mb: 1, opacity: 0.7 }} />}
          <Typography variant="caption" sx={{ textAlign: 'center', px: 1 }}>
            {categoryData.icon} {title}
          </Typography>
        </Box>
      )}

      {/* Hover overlay with actions */}
      {showHoverEffects && (
        <Box
          className="image-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          <IconButton
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
                animation: `${consciousGlow} 2s infinite`,
              },
            }}
          >
            <ZoomIn />
          </IconButton>
        </Box>
      )}

      {/* Quality badges */}
      {showBadges && (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 4,
          }}
        >
          {isPopular && (
            <Chip
              icon={<TrendingUp />}
              label="Popular"
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.warning.main, 0.9),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}

          {isSustainable && (
            <Chip
              icon={<Eco />}
              label="Sostenible"
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.9),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}

          {rating > 4.5 && (
            <Chip
              icon={<Star />}
              label="⭐"
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.warning.main, 0.9),
                color: 'white',
                fontWeight: 600,
                minWidth: 'auto',
                width: 32,
                height: 24,
              }}
            />
          )}
        </Stack>
      )}

      {/* Category indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          zIndex: 4,
        }}
      >
        <Tooltip title={`Categoría: ${serviceCategory}`}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: alpha(categoryData.color, 0.9),
              color: 'white',
              fontSize: '1rem',
            }}
          >
            {categoryData.icon}
          </Avatar>
        </Tooltip>
      </Box>

      {/* Image counter for multiple images */}
      {consciousImages.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            zIndex: 4,
          }}
        >
          <Chip
            label={`${currentImageIndex + 1}/${consciousImages.length}`}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              fontSize: '0.7rem',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

// 🎨 Product Image Gallery Component
interface ConsciousProductGalleryProps {
  images: string[];
  title: string;
  description?: string;
  category?: string;
  maxImages?: number;
  onImageSelect?: (index: number) => void;
  selectedIndex?: number;
}

export const ConsciousProductGallery: React.FC<ConsciousProductGalleryProps> = ({
  images,
  title,
  description = '',
  category = '',
  maxImages = 4,
  onImageSelect,
  selectedIndex = 0,
}) => {
  const consciousImages = sanitizeProductImages(images, title, description, category);
  const displayImages = consciousImages.slice(0, maxImages);

  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
      {displayImages.map((image, index) => (
        <Box
          key={index}
          onClick={() => onImageSelect?.(index)}
          sx={{
            width: 60,
            height: 60,
            borderRadius: 1,
            overflow: 'hidden',
            cursor: 'pointer',
            border: selectedIndex === index ? '2px solid' : '1px solid',
            borderColor: selectedIndex === index ? 'primary.main' : 'divider',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'scale(1.05)',
            },
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={`${title} - Vista ${index + 1}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      ))}
      {consciousImages.length > maxImages && (
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'action.hover',
            cursor: 'pointer',
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            +{consciousImages.length - maxImages}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default ConsciousProductImage;
