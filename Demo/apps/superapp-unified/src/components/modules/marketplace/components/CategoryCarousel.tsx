import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Card,
  Tooltip,
  Badge,
  Slide,
  Zoom,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  ArrowBackIos,
  ArrowForwardIos,
  Category as CategoryIcon,
  TrendingUp,
  StarBorder as Star,
  LocalOffer,
  AutoAwesome,
  Explore,
} from '@mui/icons-material';
import consciousDesignSystem from '../../../../theme/consciousDesignSystem';

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  count?: number;
  trending?: boolean;
  featured?: boolean;
  description?: string;
  gradient?: string;
}

interface CategoryCarouselProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
  onViewAll: () => void;
  selectedCategory?: string;
  showCount?: boolean;
  showNavigation?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  autoScroll?: boolean;
  enableGestures?: boolean;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  onCategoryClick,
  onViewAll,
  selectedCategory,
  showCount = true,
  showNavigation = true,
  variant = 'default',
  autoScroll = false,
  enableGestures = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Configuraciones por variante
  const variantConfig = {
    default: {
      itemWidth: 120,
      itemHeight: 100,
      padding: 16,
      gap: 24,
      showDescription: false,
    },
    compact: {
      itemWidth: 80,
      itemHeight: 80,
      padding: 8,
      gap: 8,
      showDescription: false,
    },
    featured: {
      itemWidth: 140,
      itemHeight: 120,
      padding: 20,
      gap: 24,
      showDescription: true,
    },
  };

  const config = variantConfig[variant];

  // Verificar capacidad de scroll
  const checkScrollCapability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll suave hacia la izquierda/derecha
  const scrollTo = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = config.itemWidth + config.gap;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === 'left'
          ? currentScroll - scrollAmount * 2
          : currentScroll + scrollAmount * 2;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  // Gestos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableGestures) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableGestures) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!enableGestures || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canScrollRight) {
      scrollTo('right');
    }
    if (isRightSwipe && canScrollLeft) {
      scrollTo('left');
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      if (canScrollRight) {
        scrollTo('right');
      } else if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll, canScrollRight]);

  // Listener de scroll para actualizar botones de navegación
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollCapability);
      checkScrollCapability(); // Check inicial

      return () => {
        container.removeEventListener('scroll', checkScrollCapability);
      };
    }
  }, []);

  // Función para obtener el gradiente de una categoría
  const getCategoryGradient = (category: Category) => {
    if (category.gradient) return category.gradient;
    if (category.color) {
      return `linear-gradient(135deg, ${category.color}20, ${category.color}40)`;
    }
    return 'linear-gradient(135deg, #f0f0f0, #e0e0e0)';
  };

  // Función para formatear el número de items
  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      {/* Header opcional */}
      {variant === 'featured' && (
        <Box sx={{ px: config.padding / 8, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
            Explora por Categorías
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Encuentra exactamente lo que necesitas
          </Typography>
        </Box>
      )}

      <Box sx={{ position: 'relative' }}>
        {/* Botón de navegación izquierdo */}
        {showNavigation && !isMobile && canScrollLeft && (
          <Fade in={canScrollLeft}>
            <IconButton
              onClick={() => scrollTo('left')}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
              }}
              className="icon-micro-interactive"
            >
              <ArrowBackIos />
            </IconButton>
          </Fade>
        )}

        {/* Botón de navegación derecho */}
        {showNavigation && !isMobile && canScrollRight && (
          <Fade in={canScrollRight}>
            <IconButton
              onClick={() => scrollTo('right')}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
              }}
              className="icon-micro-interactive"
            >
              <ArrowForwardIos />
            </IconButton>
          </Fade>
        )}

        {/* Container principal del carrusel */}
        <Box
          ref={scrollContainerRef}
          onScroll={checkScrollCapability}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          sx={{
            display: 'flex',
            gap: `${config.gap}px`,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            px: config.padding / 8,
            py: 1,
            // Ocultar scrollbar pero mantener funcionalidad
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            // Snap scrolling en navegadores compatibles
            scrollSnapType: 'x mandatory',
          }}
        >
          {/* Categorías */}
          {categories.map((category, index) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => onCategoryClick(category.id)}
              config={config}
              showCount={showCount}
              index={index}
            />
          ))}

          {/* Botón "Ver todo" */}
          <ViewAllButton
            onClick={onViewAll}
            config={config}
            index={categories.length}
          />
        </Box>

        {/* Indicadores de scroll (solo en móvil) */}
        {isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 0.5,
              mt: 1,
            }}
          >
            {Array.from({ length: Math.ceil(categories.length / 3) }).map(
              (_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? 'primary.main' : 'grey.300',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              )
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

// 🏷️ Componente individual de categoría
interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  config: any;
  showCount: boolean;
  index: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onClick,
  config,
  showCount,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Zoom in timeout={300 + index * 100}>
      <Card
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Seleccionar categoría ${category.name}`}
        sx={{
          width: { xs: 120, md: 160 },
          height: { xs: 100, md: 120 },
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s',
          transform: isHovered
            ? 'scale(1.02)'
            : 'scale(1)',
          boxShadow: isSelected
            ? consciousDesignSystem.components.card.shadow.consciousness
            : isHovered
              ? consciousDesignSystem.components.card.shadow.soft
              : consciousDesignSystem.components.card.shadow.subtle,
          background: isSelected
            ? `linear-gradient(135deg, ${consciousDesignSystem.colors.primary.main}20, ${consciousDesignSystem.colors.primary.main}35)`
            : `linear-gradient(135deg, ${consciousDesignSystem.colors.grey[50]}, ${consciousDesignSystem.colors.grey[100]})`,
          border: isSelected
            ? `2px solid ${consciousDesignSystem.colors.primary.main}`
            : `1px solid ${consciousDesignSystem.colors.grey[200]}`,
          borderRadius: consciousDesignSystem.components.card.borderRadius,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          scrollSnapAlign: 'start',
          '&:hover': {
            borderColor: consciousDesignSystem.colors.primary.light,
            background: `linear-gradient(135deg, ${consciousDesignSystem.colors.primary.main}10, ${consciousDesignSystem.colors.primary.main}20)`,
          },
          minHeight: 44, // Touch target mínimo
        }}
        className="card-micro-interactive"
      >
        {/* Badges de estado con animación pulse */}
        {(category.trending || category.featured) && (
          <Box sx={{ position: 'absolute', top: consciousDesignSystem.spacing[2], right: consciousDesignSystem.spacing[2] }}>
            {category.featured && (
              <Chip
                icon={<AutoAwesome />}
                label="⭐"
                size="small"
                sx={{
                  minWidth: 'auto',
                  height: 24,
                  backgroundColor: consciousDesignSystem.colors.accent.main,
                  color: consciousDesignSystem.colors.accent.contrastText,
                  fontFamily: consciousDesignSystem.typography.fontFamily.primary,
                  fontSize: consciousDesignSystem.typography.fontSize.xs,
                  fontWeight: consciousDesignSystem.typography.fontWeight.bold,
                  boxShadow: consciousDesignSystem.components.card.shadow.soft,
                  animation: 'pulse 1.2s infinite alternate',
                  '@keyframes pulse': {
                    from: { opacity: 0.8 },
                    to: { opacity: 1 },
                  },
                  '& .MuiChip-icon': {
                    color: consciousDesignSystem.colors.accent.contrastText,
                    fontSize: 14
                  },
                  mb: category.trending ? consciousDesignSystem.spacing[1] : 0,
                }}
              />
            )}
            {category.trending && (
              <Chip
                icon={<TrendingUp />}
                label="🔥"
                size="small"
                sx={{
                  minWidth: 'auto',
                  height: 24,
                  backgroundColor: consciousDesignSystem.colors.secondary.main,
                  color: consciousDesignSystem.colors.secondary.contrastText,
                  fontFamily: consciousDesignSystem.typography.fontFamily.primary,
                  fontSize: consciousDesignSystem.typography.fontSize.xs,
                  fontWeight: consciousDesignSystem.typography.fontWeight.bold,
                  boxShadow: consciousDesignSystem.components.card.shadow.soft,
                  animation: 'pulse 1.2s infinite alternate',
                  '@keyframes pulse': {
                    from: { opacity: 0.8 },
                    to: { opacity: 1 },
                  },
                  '& .MuiChip-icon': {
                    color: consciousDesignSystem.colors.secondary.contrastText,
                    fontSize: 14
                  },
                }}
              />
            )}
          </Box>
        )}

        {/* Contador de productos mejorado */}
        {showCount && category.count && (
          <Box sx={{ position: 'absolute', top: consciousDesignSystem.spacing[2], left: consciousDesignSystem.spacing[2] }}>
            <Chip
              label={formatCount(category.count)}
              size="small"
              sx={{
                height: 24,
                fontSize: consciousDesignSystem.typography.fontSize.xs,
                fontFamily: consciousDesignSystem.typography.fontFamily.primary,
                fontWeight: consciousDesignSystem.typography.fontWeight.bold,
                backgroundColor: `${consciousDesignSystem.colors.grey[50]}F0`,
                color: consciousDesignSystem.colors.grey[800],
                backdropFilter: 'blur(8px)',
                border: `1px solid ${consciousDesignSystem.colors.grey[200]}`,
                boxShadow: consciousDesignSystem.components.card.shadow.subtle,
              }}
            />
          </Box>
        )}

        {/* Icono principal más grande y animado */}
        <Box
          sx={{
            fontSize: { xs: '32px', md: '40px' },
            mb: consciousDesignSystem.spacing[3],
            transition: 'transform 0.2s',
            transform: isHovered
              ? 'scale(1.1)'
              : 'scale(1)',
            filter: isSelected
              ? `drop-shadow(0 4px 8px ${consciousDesignSystem.colors.primary.main}40)`
              : 'none',
            lineHeight: 1,
            minHeight: 44,
            minWidth: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Si es emoji, mostrarlo directamente */}
          {category.icon.match(/\p{Emoji}/u) ? (
            <span style={{
              textShadow: isHovered ? `0 2px 8px ${consciousDesignSystem.colors.primary.main}30` : 'none',
              display: 'inline-block',
              transition: 'text-shadow 0.2s',
            }}>
              {category.icon}
            </span>
          ) : (
            /* Si es una imagen/icono */
            <Box
              component="img"
              src={category.icon}
              alt={category.name}
              sx={{
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                objectFit: 'contain',
                filter: isSelected
                  ? `drop-shadow(0 2px 4px ${consciousDesignSystem.colors.primary.main}40)`
                  : 'none',
                transition: 'filter 0.2s',
              }}
              onError={(e) => {
                // Fallback a un icono genérico si la imagen falla
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '🏷️';
              }}
            />
          )}
        </Box>

        {/* Nombre de la categoría más destacado */}
        <Typography
          variant={Math.max(config.itemWidth, 140) > 100 ? 'body1' : 'body2'}
          sx={{
            textAlign: 'center',
            color: isSelected
              ? consciousDesignSystem.colors.primary.main
              : consciousDesignSystem.colors.grey[800],
            transition: 'color 0.2s',
            lineHeight: 1.3,
            px: consciousDesignSystem.spacing[2],
            fontFamily: consciousDesignSystem.typography.fontFamily.primary,
            fontSize: Math.max(config.itemWidth, 140) > 100 ? '1.1rem' : consciousDesignSystem.typography.fontSize.sm,
            fontWeight: isSelected
              ? consciousDesignSystem.typography.fontWeight.bold
              : consciousDesignSystem.typography.fontWeight.semibold,
            letterSpacing: '0.25px',
          }}
        >
          {category.name}
        </Typography>

        {/* Descripción (solo en variante featured) */}
        {config.showDescription && category.description && (
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              color: consciousDesignSystem.colors.grey[700],
              fontFamily: consciousDesignSystem.typography.fontFamily.primary,
              fontSize: consciousDesignSystem.typography.fontSize.xs,
              textAlign: 'center',
              px: 2,
            }}
          >
            {category.description}
          </Typography>
        )}
      </Card>
    </Zoom>
  );
};

// 👀 Botón "Ver todo"
interface ViewAllButtonProps {
  onClick: () => void;
  config: any;
  index: number;
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  onClick,
  config,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Zoom in timeout={300 + index * 100}>
      <Card
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          minWidth: config.itemWidth,
          width: config.itemWidth,
          height: config.itemHeight,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered
            ? 'translateY(-4px) scale(1.02)'
            : 'translateY(0) scale(1)',
          boxShadow: isHovered
            ? '0 8px 25px rgba(0,0,0,0.15)'
            : '0 2px 8px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          border: '2px dashed #79747E',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          scrollSnapAlign: 'start',
        }}
        className="card-micro-interactive"
      >
        {/* Icono animado */}
        <Box
          sx={{
            transition: 'transform 0.3s ease',
            transform: isHovered
              ? 'scale(1.2) rotate(90deg)'
              : 'scale(1) rotate(0deg)',
            mb: 1,
          }}
        >
          <Add
            sx={{
              fontSize: config.itemWidth > 100 ? 32 : 24,
              color: '#79747E',
            }}
          />
        </Box>

        {/* Texto */}
        <Typography
          variant={config.itemWidth > 100 ? 'body2' : 'caption'}
          fontWeight="bold"
          sx={{
            textAlign: 'center',
            color: '#79747E',
            transition: 'color 0.3s ease',
          }}
        >
          Ver todo
        </Typography>

        {/* Icono adicional */}
        <Fade in={isHovered}>
          <Explore
            sx={{
              fontSize: 16,
              color: '#79747E',
              mt: 0.5,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        </Fade>

        {/* Efecto de hover */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(121, 116, 126, 0.1), transparent)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />
      </Card>
    </Zoom>
  );
};

// Función helper para obtener gradiente de categoría
const getCategoryGradient = (category: Category) => {
  if (category.gradient) return category.gradient;
  if (category.color) {
    return `linear-gradient(135deg, ${category.color}15, ${category.color}25)`;
  }
  return 'linear-gradient(135deg, #f0f0f0, #e0e0e0)';
};

// Función helper para formatear contador
const formatCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};
