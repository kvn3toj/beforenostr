import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Stack,
  Chip,
  Box,
  Typography,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { Search, TuneOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';

interface Category {
  id: string;
  name: string;
}

interface MarketplaceFilterBarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSearch: (query: string) => void;
  onOpenAdvancedFilters: () => void;
}

const MarketplaceFilterBar: React.FC<MarketplaceFilterBarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  onSearch,
  onOpenAdvancedFilters,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 300);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    debouncedSearch(event.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 4,
          borderRadius: '16px',
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          borderColor: theme.palette.divider,
        }}
      >
        <Stack spacing={2.5}>
          {/* Search and Advanced Filters */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              elevation={0}
              sx={{
                p: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: 'transparent',
              }}
            >
              <Search
                sx={{ color: 'text.secondary', mr: 1, fontSize: '1.25rem' }}
              />
              <InputBase
                name="search-query"
                sx={{ ml: 1, flex: 1, fontWeight: 500 }}
                placeholder="Busca en CoomÜnity..."
                inputProps={{ 'aria-label': 'buscar en coomünity' }}
                value={query}
                onChange={handleQueryChange}
              />
            </Paper>
            <Tooltip title="Filtros Avanzados">
              <IconButton
                onClick={onOpenAdvancedFilters}
                aria-label="filtros avanzados"
                sx={{
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: '12px',
                  p: '12px',
                }}
              >
                <TuneOutlined />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Category Filters */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}
            >
              Categorías Populares
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              <Chip
                label="Todo"
                variant="outlined"
                clickable
                onClick={() => onCategoryChange('')}
                sx={{
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 1.5,
                  py: 2, // Aumenta el padding vertical
                  height: 'auto', // Permite que el padding defina la altura
                  borderColor:
                    activeCategory === ''
                      ? 'primary.main'
                      : theme.palette.divider,
                  backgroundColor:
                    activeCategory === ''
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                }}
              />
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  variant="outlined"
                  clickable
                  onClick={() => onCategoryChange(category.id)}
                  sx={{
                    fontWeight: 600,
                    borderRadius: '8px',
                    px: 1.5,
                    py: 2, // Aumenta el padding vertical
                    height: 'auto', // Permite que el padding defina la altura
                    borderColor:
                      activeCategory === category.id
                        ? 'primary.main'
                        : theme.palette.divider,
                    backgroundColor:
                      activeCategory === category.id
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};

export default MarketplaceFilterBar;
