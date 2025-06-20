import React, { useState, useRef, useEffect, memo } from 'react';
import { Box, Skeleton, Fade } from '@mui/material';

interface LazyImageLoaderProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean; // Skip lazy loading for above-the-fold images
  quality?: number; // Image quality for optimization
}

const LazyImageLoader: React.FC<LazyImageLoaderProps> = memo(({
  src,
  alt,
  width = '100%',
  height = 'auto',
  className,
  placeholder,
  blurDataURL,
  onLoad,
  onError,
  priority = false,
  quality = 85
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🎯 INTERSECTION OBSERVER PARA LAZY LOADING
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once in view
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before image enters viewport
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // 🎨 HANDLE IMAGE LOAD
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // ❌ HANDLE IMAGE ERROR
  const handleImageError = () => {
    setHasError(true);
    onError?.();
  };

  // 🔧 OPTIMIZE IMAGE URL (if using a CDN with query parameters)
  const optimizedSrc = React.useMemo(() => {
    if (!src) return '';
    
    // Add quality parameter if the URL supports it
    const url = new URL(src, window.location.origin);
    if (quality < 100) {
      url.searchParams.set('q', quality.toString());
    }
    return url.toString();
  }, [src, quality]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        backgroundColor: 'grey.100',
        borderRadius: 1,
      }}
      className={className}
    >
      {/* 🎭 PLACEHOLDER/SKELETON */}
      {!isLoaded && !hasError && (
        <>
          {blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(10px)',
                transform: 'scale(1.1)', // Prevent blur edges
                zIndex: 1
              }}
            />
          ) : placeholder ? (
            <img
              src={placeholder}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.6,
                zIndex: 1
              }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{ position: 'absolute', inset: 0, zIndex: 1 }}
            />
          )}
        </>
      )}

      {/* 🖼️ ACTUAL IMAGE */}
      {isInView && !hasError && (
        <Fade in={isLoaded} timeout={600}>
          <img
            ref={imgRef}
            src={optimizedSrc}
            alt={alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.6s ease',
              zIndex: 2
            }}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Fade>
      )}

      {/* ❌ ERROR FALLBACK */}
      {hasError && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.200',
            color: 'text.secondary',
            zIndex: 3
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: '2rem', mb: 1 }}>🖼️</Box>
            <Box sx={{ fontSize: '0.75rem' }}>Error al cargar imagen</Box>
          </Box>
        </Box>
      )}
    </Box>
  );
});

LazyImageLoader.displayName = 'LazyImageLoader';

export default LazyImageLoader; 