import React, { useState } from 'react';
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
      elevation={3}
      sx={{
        p: 3,
        maxHeight: '80vh',
        overflow: 'auto',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterList sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
          Filtros Avanzados
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Clear />}
          onClick={handleClearFilters}
          sx={{ mr: 1 }}
        >
          Limpiar
        </Button>
        {onClose && (
          <Button variant="contained" size="small" onClick={onClose}>
            Aplicar
          </Button>
        )}
      </Box>

      {/* Rango de Precio */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOffer sx={{ mr: 1, color: 'primary.main' }} />
            <Typography fontWeight="medium">Precio</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Typography gutterBottom>
              ü {filters.priceRange[0]} - ü {filters.priceRange[1]}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) =>
                handleFilterChange('priceRange', newValue)
              }
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
              sx={{
                '& .MuiSlider-thumb': {
                  background: 'linear-gradient(45deg, #740056, #a64d79)',
                },
                '& .MuiSlider-track': {
                  background: 'linear-gradient(45deg, #740056, #a64d79)',
                },
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Categoría */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Categoría</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Seleccionar categoría</InputLabel>
            <Select
              value={filters.category}
              label="Seleccionar categoría"
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

      {/* Ubicación */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
            <Typography fontWeight="medium">Ubicación</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            options={locations}
            value={filters.location}
            onChange={(_, newValue) =>
              handleFilterChange('location', newValue || '')
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar ubicación"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </AccordionDetails>
      </Accordion>

      {/* Rating */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Star sx={{ mr: 1, color: 'primary.main' }} />
            <Typography fontWeight="medium">Valoración mínima</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={filters.rating}
              onChange={(_, newValue) =>
                handleFilterChange('rating', newValue || 0)
              }
              precision={0.5}
            />
            <Typography variant="body2" color="text.secondary">
              {filters.rating > 0
                ? `${filters.rating}+ estrellas`
                : 'Cualquiera'}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Tiempo de Entrega */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Schedule sx={{ mr: 1, color: 'primary.main' }} />
            <Typography fontWeight="medium">Tiempo de entrega</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Tiempo máximo</InputLabel>
            <Select
              value={filters.deliveryTime}
              label="Tiempo máximo"
              onChange={(e) =>
                handleFilterChange('deliveryTime', e.target.value)
              }
            >
              <MenuItem value="">Sin preferencia</MenuItem>
              {deliveryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Características Especiales */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">
            Características especiales
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isVerifiedSeller}
                  onChange={(e) =>
                    handleFilterChange('isVerifiedSeller', e.target.checked)
                  }
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Verified
                    sx={{ mr: 0.5, fontSize: 16, color: 'primary.main' }}
                  />
                  Vendedores verificados
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isFeatured}
                  onChange={(e) =>
                    handleFilterChange('isFeatured', e.target.checked)
                  }
                />
              }
              label="Productos destacados"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isTrending}
                  onChange={(e) =>
                    handleFilterChange('isTrending', e.target.checked)
                  }
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 0.5, fontSize: 16, color: 'orange' }} />
                  En tendencia
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.hasDiscount}
                  onChange={(e) =>
                    handleFilterChange('hasDiscount', e.target.checked)
                  }
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalOffer sx={{ mr: 0.5, fontSize: 16, color: 'red' }} />
                  Con descuento
                </Box>
              }
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Tags */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Etiquetas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selecciona las etiquetas que te interesen:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter((t) => t !== tag)
                    : [...filters.tags, tag];
                  handleFilterChange('tags', newTags);
                }}
                variant={filters.tags.includes(tag) ? 'filled' : 'outlined'}
                color={filters.tags.includes(tag) ? 'primary' : 'default'}
                size="small"
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Ordenar por */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={filters.sortBy}
          label="Ordenar por"
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Resumen de filtros activos */}
      {(filters.category ||
        filters.location ||
        filters.rating > 0 ||
        filters.tags.length > 0 ||
        filters.isVerifiedSeller ||
        filters.isFeatured ||
        filters.isTrending ||
        filters.hasDiscount) && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: 'rgba(116, 0, 86, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(116, 0, 86, 0.1)',
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Filtros activos:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {filters.category && (
              <Chip label={filters.category} size="small" color="primary" />
            )}
            {filters.location && (
              <Chip label={filters.location} size="small" color="primary" />
            )}
            {filters.rating > 0 && (
              <Chip
                label={`${filters.rating}+ ⭐`}
                size="small"
                color="primary"
              />
            )}
            {filters.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" color="primary" />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default AdvancedFilters;
