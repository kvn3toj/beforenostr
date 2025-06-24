import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Checkbox,
  FormGroup,
  TextField,
  Autocomplete,
  Stack,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  LocationOn,
  Schedule,
  Star,
  LocalOffer,
  TrendingUp,
  Verified,
} from '@mui/icons-material';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: MarketplaceFilters) => void;
  onClose?: () => void;
}

export interface MarketplaceFilters {
  priceRange: [number, number];
  category: string;
  location: string;
  rating: number;
  deliveryTime: string;
  isVerifiedSeller: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  hasDiscount: boolean;
  sortBy: string;
  tags: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onClose,
}) => {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    priceRange: [0, 1000],
    category: '',
    location: '',
    rating: 0,
    deliveryTime: '',
    isVerifiedSeller: false,
    isFeatured: false,
    isTrending: false,
    hasDiscount: false,
    sortBy: 'relevance',
    tags: [],
  });

  const handleFilterChange = (key: keyof MarketplaceFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: MarketplaceFilters = {
      priceRange: [0, 1000],
      category: '',
      location: '',
      rating: 0,
      deliveryTime: '',
      isVerifiedSeller: false,
      isFeatured: false,
      isTrending: false,
      hasDiscount: false,
      sortBy: 'relevance',
      tags: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) {
      active.push({ key: 'priceRange', label: `Precio: ü${filters.priceRange[0]} - ü${filters.priceRange[1]}` });
    }
    if (filters.category) {
      active.push({ key: 'category', label: `Categoría: ${filters.category}` });
    }
    if (filters.rating > 0) {
      active.push({ key: 'rating', label: `Valoración: ${filters.rating}+ estrellas` });
    }
    if (filters.location) {
      active.push({ key: 'location', label: `Ubicación: ${filters.location}` });
    }
    if (filters.deliveryTime) {
      active.push({ key: 'deliveryTime', label: `Entrega: ${deliveryOptions.find(o => o.value === filters.deliveryTime)?.label}` });
    }
    if (filters.tags.length > 0) {
      filters.tags.forEach(tag => active.push({ key: 'tags', label: `Tag: ${tag}` }));
    }
    if (filters.isVerifiedSeller) active.push({ key: 'isVerifiedSeller', label: 'Vendedor Verificado' });
    if (filters.isFeatured) active.push({ key: 'isFeatured', label: 'Destacado' });
    if (filters.isTrending) active.push({ key: 'isTrending', label: 'En Tendencia' });
    if (filters.hasDiscount) active.push({ key: 'hasDiscount', label: 'Con Descuento' });

    return active;
  }, [filters]);

  const handleRemoveFilter = (key: keyof MarketplaceFilters, value?: any) => {
    let resetValue: any;
    switch (key) {
      case 'priceRange':
        resetValue = [0, 1000];
        break;
      case 'rating':
        resetValue = 0;
        break;
      case 'tags':
        resetValue = filters.tags.filter(tag => tag !== value);
        break;
      case 'isVerifiedSeller':
      case 'isFeatured':
      case 'isTrending':
      case 'hasDiscount':
        resetValue = false;
        break;
      default:
        resetValue = '';
    }
    handleFilterChange(key, resetValue);
  };

  const categories = [
    'Sostenibilidad',
    'Tecnología Social',
    'Economía Circular',
    'Inclusión Social',
    'Alimentación Sostenible',
    'Educación',
    'Salud y Bienestar',
  ];

  const locations = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Bilbao',
    'Zaragoza',
    'Málaga',
    'Murcia',
    'Online',
  ];

  const deliveryOptions = [
    { value: '24h', label: '24 horas' },
    { value: '48h', label: '48 horas' },
    { value: '1week', label: '1 semana' },
    { value: '2weeks', label: '2 semanas' },
    { value: 'flexible', label: 'Flexible' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Más relevantes' },
    { value: 'price_low', label: 'Precio: menor a mayor' },
    { value: 'price_high', label: 'Precio: mayor a menor' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'newest', label: 'Más recientes' },
    { value: 'trending', label: 'En tendencia' },
  ];

  const popularTags = [
    'Eco-friendly',
    'Sostenible',
    'Artesanal',
    'Local',
    'Orgánico',
    'Reciclado',
    'Innovador',
    'Comunitario',
    'Solidario',
    'Educativo',
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        maxHeight: '85vh',
        overflowY: 'auto',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterList sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
          Filtros
        </Typography>
        <Button
          size="small"
          onClick={handleClearFilters}
          sx={{ mr: 1 }}
        >
          Limpiar Todo
        </Button>
        {onClose && (
          <Button variant="contained" size="small" onClick={onClose}>
            Hecho
          </Button>
        )}
      </Box>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, p: 1, backgroundColor: 'grey.100', borderRadius: 2 }}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              label={filter.label}
              onDelete={() => handleRemoveFilter(filter.key as keyof MarketplaceFilters, filter.label.startsWith('Tag: ') ? filter.label.replace('Tag: ', '') : undefined)}
              size="small"
            />
          ))}
        </Box>
      )}

      {/* Ordenar Por */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Ordenar Por</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <FormControl fullWidth size="small">
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Rango de Precio */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOffer sx={{ mr: 1, color: 'grey.600' }} />
            <Typography fontWeight="medium">Rango de Precios (en Ünits)</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1 }}>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => handleFilterChange('priceRange', newValue as number[])}
              valueLabelFormat={(value) => `ü${value}`}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
        </AccordionDetails>
      </Accordion>

      {/* Categoría */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Categoría</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <FormControl fullWidth size="small">
            <Select
              value={filters.category}
              label="Categoría"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">Todas las categorías</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Valoración Mínima */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Star sx={{ mr: 1, color: 'grey.600' }} />
            <Typography fontWeight="medium">Valoración Mínima</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Rating
              value={filters.rating}
              onChange={(_, newValue) => handleFilterChange('rating', newValue)}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Ubicación */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1, color: 'grey.600' }} />
            <Typography fontWeight="medium">Ubicación</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <FormControl fullWidth size="small">
            <Select
              value={filters.location}
              label="Ubicación"
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <MenuItem value="">Todas las ubicaciones</MenuItem>
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Tiempo de Entrega */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Schedule sx={{ mr: 1, color: 'grey.600' }} />
            <Typography fontWeight="medium">Tiempo de Entrega</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <FormControl fullWidth size="small">
            <Select
              value={filters.deliveryTime}
              label="Tiempo de Entrega"
              onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
            >
              <MenuItem value="">Cualquiera</MenuItem>
              {deliveryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Etiquetas */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Etiquetas Populares</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <Autocomplete
            multiple
            options={popularTags}
            value={filters.tags}
            onChange={(_, newValue) => handleFilterChange('tags', newValue)}
            renderInput={(params) => <TextField {...params} variant="standard" />}
            size="small"
          />
        </AccordionDetails>
      </Accordion>

      {/* Otras Opciones */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Otras Opciones</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={filters.isVerifiedSeller} onChange={(e) => handleFilterChange('isVerifiedSeller', e.target.checked)} />}
              label="Vendedores Verificados"
            />
            <FormControlLabel
              control={<Switch checked={filters.isFeatured} onChange={(e) => handleFilterChange('isFeatured', e.target.checked)} />}
              label="Solo Destacados"
            />
            <FormControlLabel
              control={<Switch checked={filters.isTrending} onChange={(e) => handleFilterChange('isTrending', e.target.checked)} />}
              label="En Tendencia"
            />
            <FormControlLabel
              control={<Switch checked={filters.hasDiscount} onChange={(e) => handleFilterChange('hasDiscount', e.target.checked)} />}
              label="Con Descuento"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default AdvancedFilters;
