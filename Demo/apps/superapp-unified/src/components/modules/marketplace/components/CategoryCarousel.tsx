import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface CategoryCarouselProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
  onViewAll: () => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  onCategoryClick,
  onViewAll,
}) => {
  // Mostrar máximo 4 categorías + botón "Ver todo"
  const displayCategories = categories.slice(0, 4);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '13px',
        px: 1,
        mb: 1,
      }}
    >
      {/* Categories */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          flexGrow: 1,
          gap: 0,
        }}
      >
        {displayCategories.map((category, index) => (
          <Box
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            {/* Category Icon */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '28px',
                backgroundColor: '#E5E5E5',
                backgroundImage: `url(${category.icon})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                mb: '-11px',
                zIndex: 10,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: '#D0D0D0',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {/* Fallback icon content if no image */}
              {!category.icon && (
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#999',
                    borderRadius: '4px',
                  }}
                />
              )}
            </Box>

            {/* Category Label */}
            <Typography
              sx={{
                color: '#222222',
                fontSize: '11px',
                fontFamily:
                  'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'center',
                mt: 0,
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Ver Todo Button */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: '9px',
        }}
      >
        <IconButton
          onClick={onViewAll}
          sx={{
            width: '30px',
            height: '30px',
            border: '0.759px solid #79747E',
            borderRadius: '75.936px',
            padding: '6px',
            mb: '4px',
            '&:hover': {
              backgroundColor: 'rgba(121, 116, 126, 0.1)',
            },
          }}
        >
          <Add
            sx={{
              width: '18px',
              height: '18px',
              color: '#79747E',
            }}
          />
        </IconButton>

        <Typography
          sx={{
            color: '#222222',
            fontSize: '11px',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '0.25px',
            textAlign: 'center',
          }}
        >
          Ver todo
        </Typography>
      </Box>
    </Box>
  );
};
