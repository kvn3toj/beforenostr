import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  Stack,
  Divider,
  IconButton,
  Collapse,
  Grid,
  Rating,
  Autocomplete,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  LocationOn,
  Star,
  AttachMoney,
  Category,
  TuneOutlined,
  Verified,
  LocalOffer,
  Schedule,
} from '@mui/icons-material';

interface MarketplaceFiltersProps {
  onFiltersChange: (filters: MarketplaceFilters) => void;
  initialFilters?: Partial<MarketplaceFilters>;
  categories: Array<{ id: string; name: string; icon?: string }>;
  loading?: boolean;
}

interface MarketplaceFilters {
  search: string;
  category: string;
  priceRange: [number, number];
  location: string;
  rating: number;
  verified: boolean;
  currency: 'all' | 'lukas' | 'usd' | 'eur';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  type: 'all' | 'product' | 'service' | 'experience';
  availability: 'all' | 'immediate' | 'scheduled';
  tags: string[];
  hasDiscount: boolean;
  deliveryType: 'all' | 'digital' | 'physical' | 'hybrid';
}

const PRICE_RANGES = [
  { label: 'Cualquier precio', value: [0, 10000] },
  { label: 'Hasta 50 Lükas', value: [0, 50] },
  { label: '50 - 200 Lükas', value: [50, 200] },
  { label: '200 - 500 Lükas', value: [200, 500] },
  { label: '500+ Lükas', value: [500, 10000] },
];

const CURRENCY_OPTIONS = [
  { value: 'all', label: 'Todas las monedas', icon: '💰' },
  { value: 'lukas', label: 'Lükas (ü)', icon: 'ü' },
  { value: 'usd', label: 'Dólares USD', icon: '$' },
  { value: 'eur', label: 'Euros EUR', icon: '€' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes', icon: '🆕' },
  { value: 'rating', label: 'Mejor calificados', icon: '⭐' },
  { value: 'price_asc', label: 'Menor precio', icon: '💰' },
  { value: 'price_desc', label: 'Mayor precio', icon: '💎' },
  { value: 'popular', label: 'Más populares', icon: '🔥' },
];

const POPULAR_TAGS = [
  'ayni', 'sostenible', 'colaborativo', 'educación', 'tecnología',
  'salud', 'bienestar', 'arte', 'música', 'deporte', 'cocina',
  'idiomas', 'programación', 'diseño', 'consultoría', 'mindfulness'
];

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  categories = [],
  loading = false,
}) => {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: '',
    category: '',
    priceRange: [0, 1000],
    location: '',
    rating: 0,
    verified: false,
    currency: 'all',
    sortBy: 'newest',
    type: 'all',
    availability: 'all',
    tags: [],
    hasDiscount: false,
    deliveryType: 'all',
    ...initialFilters,
  });

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customPriceRange, setCustomPriceRange] = useState(false);

  const handleFilterChange = useCallback((key: keyof MarketplaceFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    const defaultFilters: MarketplaceFilters = {
      search: '',
      category: '',
      priceRange: [0, 1000],
      location: '',
      rating: 0,
      verified: false,
      currency: 'all',
      sortBy: 'newest',
      type: 'all',
      availability: 'all',
      tags: [],
      hasDiscount: false,
      deliveryType: 'all',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  }, [onFiltersChange]);

  const handleTagToggle = useCallback((tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  }, [filters.tags, handleFilterChange]);

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search' && value) return count + 1;
    if (key === 'category' && value) return count + 1;
    if (key === 'location' && value) return count + 1;
    if (key === 'rating' && value > 0) return count + 1;
    if (key === 'verified' && value) return count + 1;
    if (key === 'currency' && value !== 'all') return count + 1;
    if (key === 'type' && value !== 'all') return count + 1;
    if (key === 'availability' && value !== 'all') return count + 1;
    if (key === 'tags' && Array.isArray(value) && value.length > 0) return count + value.length;
    if (key === 'hasDiscount' && value) return count + 1;
    if (key === 'deliveryType' && value !== 'all') return count + 1;
    return count;
  }, 0);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TuneOutlined color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Filtros de Búsqueda
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} activos`}
              size="small"
              color="primary"
              variant="filled"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            disabled={activeFiltersCount === 0}
          >
            Limpiar
          </Button>
          <IconButton
            onClick={() => setAdvancedOpen(!advancedOpen)}
            size="small"
            sx={{
              transform: advancedOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>
      </Box>

      {/* Búsqueda principal */}
      <TextField
        fullWidth
        label="Buscar productos y servicios"
        placeholder="Ej: permacultura, desarrollo web, yoga..."
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        InputProps={{
          startAdornment: <Search color="action" sx={{ mr: 1 }} />,
        }}
        sx={{ mb: 3 }}
        disabled={loading}
      />

      {/* Filtros básicos */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filters.category}
              label="Categoría"
              onChange={(e) => handleFilterChange('category', e.target.value)}
              startAdornment={<Category color="action" sx={{ mr: 1 }} />}
              disabled={loading}
            >
              <MenuItem value="">Todas las categorías</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.icon && <span style={{ marginRight: 8 }}>{category.icon}</span>}
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filters.type}
              label="Tipo"
              onChange={(e) => handleFilterChange('type', e.target.value)}
              disabled={loading}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="product">🛍️ Productos</MenuItem>
              <MenuItem value="service">🔧 Servicios</MenuItem>
              <MenuItem value="experience">✨ Experiencias</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Moneda</InputLabel>
            <Select
              value={filters.currency}
              label="Moneda"
              onChange={(e) => handleFilterChange('currency', e.target.value)}
              startAdornment={<AttachMoney color="action" sx={{ mr: 1 }} />}
              disabled={loading}
            >
              {CURRENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <span style={{ marginRight: 8 }}>{option.icon}</span>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={filters.sortBy}
              label="Ordenar por"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              disabled={loading}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <span style={{ marginRight: 8 }}>{option.icon}</span>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Filtros avanzados */}
      <Collapse in={advancedOpen}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Filtros Avanzados
        </Typography>

        <Grid container spacing={3}>
          {/* Rango de precio */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              Rango de precio
            </Typography>
            {!customPriceRange ? (
              <Box>
                {PRICE_RANGES.map((range) => (
                  <Chip
                    key={range.label}
                    label={range.label}
                    variant={
                      filters.priceRange[0] === range.value[0] && 
                      filters.priceRange[1] === range.value[1]
                        ? 'filled' 
                        : 'outlined'
                    }
                    color="primary"
                    onClick={() => handleFilterChange('priceRange', range.value)}
                    sx={{ mr: 1, mb: 1 }}
                    size="small"
                  />
                ))}
                <Button
                  size="small"
                  onClick={() => setCustomPriceRange(true)}
                  sx={{ ml: 1 }}
                >
                  Personalizar
                </Button>
              </Box>
            ) : (
              <Box>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, value) => handleFilterChange('priceRange', value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={2000}
                  step={10}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 500, label: '500' },
                    { value: 1000, label: '1000' },
                    { value: 2000, label: '2000+' },
                  ]}
                />
                <Button
                  size="small"
                  onClick={() => setCustomPriceRange(false)}
                  sx={{ mt: 1 }}
                >
                  Preestablecidos
                </Button>
              </Box>
            )}
          </Grid>

          {/* Calificación mínima */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              Calificación mínima
            </Typography>
            <Rating
              value={filters.rating}
              onChange={(_, value) => handleFilterChange('rating', value || 0)}
              precision={0.5}
              sx={{ mb: 1 }}
            />
          </Grid>

          {/* Ubicación */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ubicación"
              placeholder="Ciudad, región o país"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>

          {/* Opciones adicionales */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Verified color="primary" fontSize="small" />
                    Solo proveedores verificados
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.hasDiscount}
                    onChange={(e) => handleFilterChange('hasDiscount', e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalOffer color="secondary" fontSize="small" />
                    Solo con descuentos
                  </Box>
                }
              />
            </Stack>
          </Grid>

          {/* Disponibilidad */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Disponibilidad</InputLabel>
              <Select
                value={filters.availability}
                label="Disponibilidad"
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                startAdornment={<Schedule color="action" sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">Cualquier disponibilidad</MenuItem>
                <MenuItem value="immediate">🚀 Disponible inmediatamente</MenuItem>
                <MenuItem value="scheduled">📅 Programable</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Tipo de entrega */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de entrega</InputLabel>
              <Select
                value={filters.deliveryType}
                label="Tipo de entrega"
                onChange={(e) => handleFilterChange('deliveryType', e.target.value)}
              >
                <MenuItem value="all">Todos los tipos</MenuItem>
                <MenuItem value="digital">💻 Digital</MenuItem>
                <MenuItem value="physical">📦 Físico</MenuItem>
                <MenuItem value="hybrid">🔄 Híbrido</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Tags populares */}
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Tags populares
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {POPULAR_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant={filters.tags.includes(tag) ? 'filled' : 'outlined'}
                  color="primary"
                  size="small"
                  onClick={() => handleTagToggle(tag)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Collapse>

      {/* Resumen de filtros activos */}
      {activeFiltersCount > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Filtros activos ({activeFiltersCount}):
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {filters.search && (
              <Chip
                label={`Búsqueda: "${filters.search}"`}
                size="small"
                onDelete={() => handleFilterChange('search', '')}
              />
            )}
            {filters.category && (
              <Chip
                label={`Categoría: ${categories.find(c => c.id === filters.category)?.name || filters.category}`}
                size="small"
                onDelete={() => handleFilterChange('category', '')}
              />
            )}
            {filters.type !== 'all' && (
              <Chip
                label={`Tipo: ${filters.type}`}
                size="small"
                onDelete={() => handleFilterChange('type', 'all')}
              />
            )}
            {filters.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                color="primary"
                onDelete={() => handleTagToggle(tag)}
              />
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default MarketplaceFilters; 