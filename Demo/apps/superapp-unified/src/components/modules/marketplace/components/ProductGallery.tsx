import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Close,
  ZoomIn,
  PlayArrow,
  Fullscreen,
} from '@mui/icons-material';

interface ProductGalleryProps {
  images: string[];
  title: string;
  hasVideo?: boolean;
  videoUrl?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  title,
  hasVideo = false,
  videoUrl,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleFullscreenOpen = () => {
    setIsFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setIsFullscreenOpen(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'Escape') {
      handleFullscreenClose();
    }
  };

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 400,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
        }}
      >
        Sin imágenes disponibles
      </Box>
    );
  }

  return (
    <Box>
      {/* Imagen principal */}
      <Box
        ref={mainImageRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, sm: 400, md: 500 },
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          cursor: 'zoom-in',
        }}
        onClick={handleFullscreenOpen}
      >
        {/* Imagen principal */}
        <Box
          component="img"
          src={images[selectedImageIndex]}
          alt={`${title} - Imagen ${selectedImageIndex + 1}`}
          onLoad={() => handleImageLoad(selectedImageIndex)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: loadedImages.has(selectedImageIndex) ? 1 : 0,
          }}
        />

        {/* Skeleton de carga */}
        {!loadedImages.has(selectedImageIndex) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}

        {/* Badge de video */}
        {hasVideo && selectedImageIndex === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              zIndex: 2,
            }}
          >
            <PlayArrow sx={{ fontSize: 18, color: 'white' }} />
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
              Video
            </span>
          </Box>
        )}

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <Fade in={isHovered || isMobile}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'white' },
                  zIndex: 3,
                }}
              >
                <ChevronLeft />
              </IconButton>
            </Fade>

            <Fade in={isHovered || isMobile}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'white' },
                  zIndex: 3,
                }}
              >
                <ChevronRight />
              </IconButton>
            </Fade>
          </>
        )}

        {/* Botón de pantalla completa */}
        <Fade in={isHovered}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleFullscreenOpen();
            }}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' },
              zIndex: 3,
            }}
          >
            <ZoomIn />
          </IconButton>
        </Fade>

        {/* Indicador de posición */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              zIndex: 2,
            }}
          >
            {selectedImageIndex + 1} / {images.length}
          </Box>
        )}
      </Box>

      {/* Miniaturas */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 2,
            overflowX: 'auto',
            pb: 1,
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
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                flexShrink: 0,
                width: { xs: 60, sm: 80, md: 100 },
                height: { xs: 60, sm: 80, md: 100 },
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border:
                  selectedImageIndex === index
                    ? '3px solid #1976d2'
                    : '2px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor:
                    selectedImageIndex === index ? '#1976d2' : '#ccc',
                },
              }}
            >
              {/* Badge de video en primera miniatura */}
              {hasVideo && index === 0 && (
                <Badge
                  badgeContent={<PlayArrow sx={{ fontSize: 12 }} />}
                  color="primary"
                  sx={{
                    width: '100%',
                    height: '100%',
                    '& .MuiBadge-badge': {
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Badge>
              )}

              {/* Miniatura normal */}
              {(!hasVideo || index !== 0) && (
                <Box
                  component="img"
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Modal de pantalla completa */}
      <Dialog
        open={isFullscreenOpen}
        onClose={handleFullscreenClose}
        maxWidth={false}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(0,0,0,0.95)',
          },
        }}
        onKeyDown={handleKeyPress}
      >
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Botón de cerrar */}
          <IconButton
            onClick={handleFullscreenClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
              zIndex: 10,
            }}
          >
            <Close />
          </IconButton>

          {/* Imagen en pantalla completa */}
          <Zoom in={isFullscreenOpen} timeout={300}>
            <Box
              component="img"
              src={images[selectedImageIndex]}
              alt={`${title} - Imagen ${selectedImageIndex + 1}`}
              sx={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          </Zoom>

          {/* Controles de navegación en pantalla completa */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  zIndex: 10,
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  zIndex: 10,
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>

              {/* Indicador de posición en pantalla completa */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: '16px',
                  fontWeight: 500,
                  zIndex: 10,
                }}
              >
                {selectedImageIndex + 1} / {images.length}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Animación CSS para el shimmer
const styles = `
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
`;

// Inyectar estilos si no existen
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('product-gallery-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'product-gallery-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}
