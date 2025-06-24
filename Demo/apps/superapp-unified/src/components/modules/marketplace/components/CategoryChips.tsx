import React from 'react';
import { Box, Chip } from '@mui/material';

interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface CategoryChipsProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
  selectedCategory?: string;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  onCategoryClick,
  selectedCategory,
}) => {
  // Detectar tema (claro/oscuro)
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const getChipStyles = (active: boolean) => ({
    borderRadius: '7px',
    background: active
      ? isDark
        ? 'linear-gradient(90deg, #004134 60%, #3E8638 100%)'
        : 'linear-gradient(90deg, #3E8638 60%, #004134 100%)'
      : isDark
        ? '#222'
        : '#EDEDED',
    color: active ? '#fff' : (isDark ? '#B2DFDB' : '#004134'),
    fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center',
    letterSpacing: '0.08px',
    lineHeight: 1.18,
    minHeight: 48,
    minWidth: 48,
    px: 2.5,
    py: 1.5,
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
    outline: active ? '2px solid #3E8638' : 'none',
    boxShadow: active ? '0 2px 12px 2px #3E863855' : 'none',
    transform: active ? 'scale(1.08)' : 'none',
    '&:hover': {
      background: active
        ? (isDark
            ? 'linear-gradient(90deg, #004134 80%, #3E8638 100%)'
            : 'linear-gradient(90deg, #3E8638 80%, #004134 100%)')
        : (isDark ? '#333' : '#E0E0E0'),
      transform: 'scale(1.04)',
      boxShadow: '0 4px 16px 0 #3E863822',
    },
    '&:focus-visible': {
      outline: '2px solid #3E8638',
      boxShadow: '0 0 0 2px #3E863844',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    '& .MuiChip-label': {
      padding: 0,
    },
  });
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%' }}>
      {categories.map((cat) => {
        const active = selectedCategory === cat.id;
        return (
          <Chip
            key={cat.id}
            label={cat.icon ? `${cat.icon} ${cat.name}` : cat.name}
            onClick={() => onCategoryClick(cat.id)}
            sx={getChipStyles(active)}
            aria-label={`Categoría: ${cat.name}`}
            aria-pressed={active}
            tabIndex={0}
          />
        );
      })}
    </Box>
  );
};
