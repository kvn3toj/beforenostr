import React from 'react';
import { Box, Typography, IconButton, Stack, Avatar } from '@mui/material';
import { Add, ArrowForwardIos } from '@mui/icons-material';

interface Category {
  id: string;
  name: string;
  icon: string; // Puede ser una URL o un nombre de ícono de MUI
}

interface CategoryCarouselProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onViewAll?: () => void; // onViewAll es opcional
  selectedCategory?: string;
}

const CategoryItem: React.FC<{
  item: Category;
  onClick: () => void;
  isSelected: boolean;
}> = ({ item, onClick, isSelected }) => (
  <Stack
    alignItems="center"
    spacing={1}
    onClick={onClick}
    sx={{ cursor: 'pointer', textAlign: 'center', minWidth: 80 }}
  >
    <Avatar
      src={item.icon}
      sx={{
        width: 64,
        height: 64,
        bgcolor: isSelected ? 'primary.main' : 'action.hover',
        color: isSelected ? 'primary.contrastText' : 'text.secondary',
        border: isSelected ? '2px solid' : 'none',
        borderColor: 'primary.dark',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 3,
        },
      }}
    >
      {/* Fallback si el ícono no es una imagen */}
      {!item.icon.includes('/') && item.name.charAt(0)}
    </Avatar>
    <Typography
      variant="caption"
      fontWeight={isSelected ? 'bold' : 'regular'}
      color={isSelected ? 'primary' : 'text.secondary'}
      sx={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: '2.5em' // Reserva espacio para dos líneas
      }}
    >
      {item.name}
    </Typography>
  </Stack>
);

const ViewAllItem: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Stack
    alignItems="center"
    spacing={1}
    onClick={onClick}
    sx={{ cursor: 'pointer', textAlign: 'center', minWidth: 80 }}
  >
    <Avatar
      sx={{
        width: 64,
        height: 64,
        bgcolor: 'action.hover',
        border: '2px dashed',
        borderColor: 'grey.400',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 3,
          borderColor: 'primary.main',
        },
      }}
    >
      <Add />
    </Avatar>
    <Typography variant="caption" color="text.secondary">
      Ver todo
    </Typography>
  </Stack>
);

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  onSelectCategory,
  onViewAll,
  selectedCategory,
}) => {
  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        overflowX: 'auto',
        py: 1,
        px: 2,
        // Ocultar la barra de scroll
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '-ms-overflow-style': 'none', // IE and Edge
        'scrollbar-width': 'none', // Firefox
      }}
    >
      {onViewAll && <ViewAllItem onClick={onViewAll} />}
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          item={category}
          onClick={() => onSelectCategory(category.id)}
          isSelected={selectedCategory === category.id}
        />
      ))}
    </Stack>
  );
};