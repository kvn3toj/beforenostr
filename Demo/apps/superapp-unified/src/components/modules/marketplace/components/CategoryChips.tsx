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
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        width: '100%',
      }}
    >
      {/* First Row */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'stretch',
          gap: '15px',
        }}
      >
        <Chip
          label="Alimentos orgánicos"
          onClick={() => onCategoryClick('organic-food')}
          sx={{
            borderRadius: '7px',
            backgroundColor: '#EDEDED',
            color: '#55414B',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '0.08px',
            lineHeight: 1.18,
            minHeight: '26px',
            paddingLeft: '13px',
            paddingRight: '13px',
            paddingTop: '5px',
            paddingBottom: '5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#E0E0E0',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            '& .MuiChip-label': {
              padding: 0,
            },
          }}
        />
        <Chip
          label="Clases de baile"
          onClick={() => onCategoryClick('dance-classes')}
          sx={{
            borderRadius: '7px',
            backgroundColor: '#EDEDED',
            color: '#55414B',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '0.08px',
            lineHeight: 1.18,
            minHeight: '26px',
            paddingLeft: '13px',
            paddingRight: '13px',
            paddingTop: '5px',
            paddingBottom: '5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#E0E0E0',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            '& .MuiChip-label': {
              padding: 0,
            },
          }}
        />
      </Box>

      {/* Second Row */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'stretch',
          gap: '14px',
        }}
      >
        <Chip
          label="Alimentación saludable"
          onClick={() => onCategoryClick('healthy-eating')}
          sx={{
            borderRadius: '7px',
            backgroundColor: '#EDEDED',
            color: '#55414B',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '0.08px',
            lineHeight: 1.18,
            minHeight: '26px',
            paddingLeft: '13px',
            paddingRight: '13px',
            paddingTop: '5px',
            paddingBottom: '5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#E0E0E0',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            '& .MuiChip-label': {
              padding: 0,
            },
          }}
        />
        <Chip
          label="Categoría"
          onClick={() => onCategoryClick('general')}
          sx={{
            borderRadius: '7px',
            backgroundColor: '#EDEDED',
            color: '#55414B',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '0.08px',
            lineHeight: 1.18,
            minHeight: '26px',
            paddingLeft: '13px',
            paddingRight: '13px',
            paddingTop: '5px',
            paddingBottom: '5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: '#E0E0E0',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            '& .MuiChip-label': {
              padding: 0,
            },
          }}
        />
      </Box>
    </Box>
  );
};
