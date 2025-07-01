import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  TuneOutlined as FilterIcon,
  LocalOffer as TagIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Sort as SortIcon,
  FilterList,
  Clear,
  TuneOutlined,
} from '@mui/icons-material';
import { useGuardianColors } from '../../../../components/theme/GuardianColorProvider';
import { MODULE_COLORS } from '../../../../theme/colors';

interface Category {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface MarketplaceFilterBarProps {
  onSearch: (filters: any) => void;
  onOpenAdvancedFilters: () => void;
  categories: Category[];
}

const MarketplaceFilterBar: React.FC<MarketplaceFilterBarProps> = ({
  onSearch,
  onOpenAdvancedFilters,
  categories,
}) => {
  const { palette, getElementColor } = useGuardianColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch({ query: searchQuery, category: selectedCategory });
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    onSearch({ category: newCategory, query: searchQuery });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch({ query: '', category: selectedCategory });
  };

  const handleFilterToggle = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];

    setActiveFilters(newFilters);
    onSearch({
      activeFilters: newFilters,
      query: searchQuery,
      category: selectedCategory
    });
  };

  // Definir los filtros rápidos
  const quickFilters = [
    { id: 'verified', label: 'Verificados' },
    { id: 'popular', label: 'Populares' },
    { id: 'local', label: 'Locales' },
    { id: 'discounted', label: 'Ofertas' },
  ];

  // Renderizar el icono según el ID del filtro
  const renderFilterIcon = (filterId: string) => {
    switch (filterId) {
      case 'verified':
        return <VerifiedIcon fontSize="small" />;
      case 'popular':
        return <StarIcon fontSize="small" />;
      case 'local':
        return <LocationIcon fontSize="small" />;
      case 'discounted':
        return <MoneyIcon fontSize="small" />;
      default:
        return <FilterIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barra de búsqueda */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar productos y servicios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClearSearch}>
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            backgroundColor: alpha(palette.background, 0.8),
            '&:hover': {
              backgroundColor: palette.background,
            },
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }
        }}
        sx={{ mb: 3 }}
      />

      {/* Categorías */}
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          color: palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        <TagIcon fontSize="small" sx={{ color: MODULE_COLORS.marketplace }} />
        Categorías
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 3
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category.name}
            label={category.name}
            onClick={() => handleCategorySelect(category.name)}
            sx={{
              backgroundColor: selectedCategory === category.name
                ? alpha(category.color, 0.15)
                : alpha(palette.divider, 0.5),
              color: selectedCategory === category.name
                ? category.color
                : palette.text.secondary,
              borderRadius: 2,
              fontWeight: selectedCategory === category.name ? 600 : 400,
              '&:hover': {
                backgroundColor: selectedCategory === category.name
                  ? alpha(category.color, 0.25)
                  : alpha(palette.divider, 0.7),
              },
              border: selectedCategory === category.name
                ? `1px solid ${alpha(category.color, 0.3)}`
                : `1px solid ${alpha(palette.divider, 0.1)}`,
            }}
          />
        ))}
      </Box>

      {/* Filtros rápidos */}
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          color: palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        <FilterIcon fontSize="small" sx={{ color: MODULE_COLORS.marketplace }} />
        Filtros rápidos
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 3
        }}
      >
        {quickFilters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            deleteIcon={renderFilterIcon(filter.id)}
            onDelete={() => {}}
            onClick={() => handleFilterToggle(filter.id)}
            sx={{
              backgroundColor: activeFilters.includes(filter.id)
                ? alpha(MODULE_COLORS.marketplace, 0.15)
                : alpha(palette.divider, 0.5),
              color: activeFilters.includes(filter.id)
                ? MODULE_COLORS.marketplace
                : palette.text.secondary,
              borderRadius: 2,
              fontWeight: activeFilters.includes(filter.id) ? 600 : 400,
              '&:hover': {
                backgroundColor: activeFilters.includes(filter.id)
                  ? alpha(MODULE_COLORS.marketplace, 0.25)
                  : alpha(palette.divider, 0.7),
              },
              border: activeFilters.includes(filter.id)
                ? `1px solid ${alpha(MODULE_COLORS.marketplace, 0.3)}`
                : `1px solid ${alpha(palette.divider, 0.1)}`,
              '& .MuiChip-deleteIcon': {
                color: activeFilters.includes(filter.id)
                  ? MODULE_COLORS.marketplace
                  : palette.text.secondary,
                margin: '0 5px 0 -6px',
                order: -1
              }
            }}
          />
        ))}
      </Box>

      {/* Botón de filtros avanzados */}
      <Button
        variant="outlined"
        startIcon={<TuneOutlined />}
        fullWidth
        onClick={onOpenAdvancedFilters}
        sx={{
          mt: 1,
          textTransform: 'none',
          borderRadius: 2,
          borderColor: alpha(MODULE_COLORS.marketplace, 0.5),
          color: MODULE_COLORS.marketplace,
          '&:hover': {
            backgroundColor: alpha(MODULE_COLORS.marketplace, 0.05),
            borderColor: MODULE_COLORS.marketplace,
          },
        }}
      >
        Filtros avanzados
      </Button>
    </Box>
  );
};

export default MarketplaceFilterBar;
