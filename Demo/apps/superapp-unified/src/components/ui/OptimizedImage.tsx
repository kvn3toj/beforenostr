import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';
import { getOptimizedImageSrc, getImageFormatSupport } from '../../utils/resourceOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  className?: string;
  placeholder?: string;
  fallback?: string;
  sx?: object;
  sizes?: string; // Para responsive images
  srcSet?: string; // Para diferentes densidades de pantalla
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 85,
  lazy = true,
  className = '',
  placeholder,
  fallback = '/images/default-placeholder.svg',
  sx,
  sizes,
  srcSet,
}) => {
  const [isLoading, setIsLoading] = useState(lazy);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const [formatSupport] = useState(() => getImageFormatSupport());

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Cargar 50px antes de que sea visible
        threshold: 0.1,
      }
    );

    const imgElement = imgRef.current;
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [lazy, isInView]);

  // Determinar el mejor formato de imagen soportado
  const getOptimalSrc = (originalSrc: string): string => {
    if (!width) return originalSrc;

    // Priorizar formatos modernos si están soportados
    if (formatSupport.avif) {
      return getOptimizedImageSrc(originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif'), width, quality);
    } else if (formatSupport.webp) {
      return getOptimizedImageSrc(originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp'), width, quality);
    } else {
      return getOptimizedImageSrc(originalSrc, width, quality);
    }
  };

  // Generar srcSet para diferentes densidades de pantalla
  const generateSrcSet = (baseSrc: string): string => {
    if (srcSet) return srcSet;
    if (!width) return '';

    const densities = [1, 1.5, 2, 3];
    return densities
      .map(density => {
        const scaledWidth = Math.round(width * density);
        const optimizedSrc = getOptimalSrc(baseSrc);
        return `${optimizedSrc.replace(/w=\d+/, `w=${scaledWidth}`)} ${density}x`;
      })
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Mostrar skeleton mientras carga o no está en vista
  if (isLoading || !isInView) {
    return (
      <Box
        ref={imgRef}
        className={`optimized-image-container ${className}`}
        sx={{
          width: width || '100%',
          height: height || 'auto',
          ...sx,
        }}
      >
        {placeholder ? (
          <img
            src={placeholder}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width={width || '100%'}
            height={height || 200}
            sx={{
              borderRadius: 1,
              bgcolor: 'grey.200',
            }}
          />
        )}
      </Box>
    );
  }

  // Mostrar imagen de fallback en caso de error
  if (hasError) {
    return (
      <Box
        className={`optimized-image-container error ${className}`}
        sx={{
          width: width || '100%',
          height: height || 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 1,
          ...sx,
        }}
      >
        <img
          src={fallback}
          alt={`Error loading ${alt}`}
          style={{
            maxWidth: '50%',
            opacity: 0.5,
          }}
        />
      </Box>
    );
  }

  // Renderizar imagen optimizada
  return (
    <Box
      className={`optimized-image-container loaded ${className}`}
      sx={{
        width: width || '100%',
        height: height || 'auto',
        ...sx,
      }}
    >
      <img
        ref={imgRef}
        src={getOptimalSrc(src)}
        srcSet={generateSrcSet(src)}
        sizes={sizes || (width ? `${width}px` : '100vw')}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
        }}
        // Atributos para mejor performance
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        // Cache hint para el navegador
        crossOrigin="anonymous"
      />
    </Box>
  );
};

// Variante especializada para avatares
export const OptimizedAvatar: React.FC<Omit<OptimizedImageProps, 'width' | 'height'> & {
  size?: number;
}> = ({ size = 40, ...props }) => {
  return (
    <OptimizedImage
      {...props}
      width={size}
      height={size}
      sx={{
        borderRadius: '50%',
        overflow: 'hidden',
        ...props.sx,
      }}
      fallback="/images/default-avatar.png"
    />
  );
};

// Variante para imágenes de hero/banner
export const OptimizedHeroImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      {...props}
      lazy={false} // Hero images should load immediately
      quality={90} // Higher quality for hero images
      sizes="100vw" // Full viewport width
    />
  );
};

// Variante para thumbnails
export const OptimizedThumbnail: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      {...props}
      quality={75} // Lower quality for thumbnails to save bandwidth
      lazy={true} // Thumbnails can be lazy loaded
    />
  );
}; 