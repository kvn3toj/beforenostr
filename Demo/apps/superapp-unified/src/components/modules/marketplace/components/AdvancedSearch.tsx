/**
 * 🔍 AdvancedSearch Component - Búsqueda Inteligente para Marketplace
 * 
 * Componente de búsqueda avanzada con filtros inteligentes, búsqueda semántica,
 * y integración completa con el Backend NestJS para el Marketplace CoomÜnity.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Typography,
  Drawer,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Divider,
  Collapse,
  Alert,
  Autocomplete,
  Badge,
  Tooltip,
  Paper,
  Grid,
  Switch,
  LinearProgress,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  TuneOutlined as TuneIcon,
  Sort as SortIcon,
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as PriceIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';
import { debounce } from 'lodash';

// Hooks personalizados
import { useProducts, useBackendAvailability } from '../../../../hooks/useRealBackendData';

// 🏷️ Tipos para filtros avanzados
interface SearchFilters {
  query: string;
  category: string;
  subcategory: string;
  priceRange: [number, number];
  deliveryTypes: string[];
  rating: number;
  location: string;
  availability: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  tags: string[];
  verified: boolean;
  featured: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'category' | 'tag' | 'product' | 'service';
  count?: number;
}

interface AdvancedSearchProps {
  onSearchResults: (results: any[]) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

// 📊 Configuración de categorías y opciones
const CATEGORIES = [
  { value: 'all', label: 'Todas las categorías', icon: '🏪' },
  { value: 'tecnologia', label: 'Tecnología', icon: '💻' },
  { value: 'diseno', label: 'Diseño', icon: '🎨' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'educacion', label: 'Educación', icon: '📚' },
  { value: 'salud', label: 'Salud y Bienestar', icon: '🏥' },
  { value: 'arte', label: 'Arte y Creatividad', icon: '🎭' },
  { value: 'consultoria', label: 'Consultoría', icon: '💼' },
  { value: 'servicios', label: 'Servicios Generales', icon: '🔧' },
];

const DELIVERY_TYPES = [
  { value: 'virtual', label: 'Virtual/Online', icon: '🌐' },
  { value: 'presencial', label: 'Presencial', icon: '🏢' },
  { value: 'hibrido', label: 'Híbrido', icon: '🔄' },
  { value: 'entrega', label: 'Con entrega', icon: '📦' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  { value: 'rating', label: 'Mejor Calificación' },
  { value: 'newest', label: 'Más Recientes' },
  { value: 'popular', label: 'Más Populares' },
  { value: 'ayni_score', label: 'Puntuación Ayni' },
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearchResults,
  onFiltersChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    subcategory: '',
    priceRange: [0, 1000],
    deliveryTypes: [],
    rating: 0,
    location: '',
    availability: 'all',
    sortBy: 'relevance',
    sortOrder: 'desc',
    tags: [],
    verified: false,
    featured: false,
    ...initialFilters
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Fetch categories from backend
  const { data: categories = [] } = useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: () => apiService.get('/marketplace/categories'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch popular tags from backend
  const { data: popularTags = [] } = useQuery({
    queryKey: ['marketplace-tags'],
    queryFn: () => apiService.get('/marketplace/tags/popular'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchFilters) => {
      try {
        const searchParams = new URLSearchParams();
        
        if (searchFilters.query) searchParams.append('q', searchFilters.query);
        if (searchFilters.category) searchParams.append('category', searchFilters.category);
        if (searchFilters.location) searchParams.append('location', searchFilters.location);
        if (searchFilters.rating > 0) searchParams.append('minRating', searchFilters.rating.toString());
        if (searchFilters.verified) searchParams.append('verified', 'true');
        if (searchFilters.priceRange[0] > 0) searchParams.append('minPrice', searchFilters.priceRange[0].toString());
        if (searchFilters.priceRange[1] < 1000) searchParams.append('maxPrice', searchFilters.priceRange[1].toString());
        if (searchFilters.tags.length > 0) searchParams.append('tags', searchFilters.tags.join(','));
        searchParams.append('sortBy', searchFilters.sortBy);

        const results = await apiService.get(`/marketplace/search?${searchParams.toString()}`);
        onSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        onSearchResults([]);
      }
    }, 300),
    [onSearchResults]
  );

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    debouncedSearch(newFilters);
  }, [filters, onFiltersChange, debouncedSearch]);

  // Get search suggestions
  const getSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchSuggestions([]);
        return;
      }
      
      try {
        const suggestions = await apiService.get(`/marketplace/suggestions?q=${encodeURIComponent(query)}`);
        setSearchSuggestions(suggestions.slice(0, 5));
      } catch (error) {
        console.error('Suggestions error:', error);
        setSearchSuggestions([]);
      }
    }, 200),
    []
  );

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: 'all',
      subcategory: '',
      priceRange: [0, 1000],
      deliveryTypes: [],
      rating: 0,
      location: '',
      availability: 'all',
      sortBy: 'relevance',
      sortOrder: 'desc',
      tags: [],
      verified: false,
      featured: false,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    debouncedSearch(clearedFilters);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.rating > 0) count++;
    if (filters.verified) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.tags.length > 0) count++;
    return count;
  }, [filters]);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      {/* Main Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Autocomplete
          freeSolo
          fullWidth
          options={searchSuggestions}
          value={filters.query}
          onInputChange={(_, value) => {
            handleFilterChange('query', value);
            getSuggestions(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar productos, servicios, emprendedores..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        
        <Tooltip title={`Filtros avanzados ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`}>
          <IconButton
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            color={showAdvancedFilters || activeFiltersCount > 0 ? 'primary' : 'default'}
            sx={{ 
              border: 1, 
              borderColor: showAdvancedFilters || activeFiltersCount > 0 ? 'primary.main' : 'grey.300',
              position: 'relative'
            }}
          >
            <TuneIcon />
            {activeFiltersCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                {activeFiltersCount}
              </Box>
            )}
          </IconButton>
        </Tooltip>

        {activeFiltersCount > 0 && (
          <Tooltip title="Limpiar filtros">
            <IconButton onClick={clearFilters} color="error">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Advanced Filters */}
      <Collapse in={showAdvancedFilters}>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filters.category}
                  label="Categoría"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="">Todas las categorías</MenuItem>
                  {categories.map((category: any) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Ubicación"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Ciudad, región..."
              />
            </Grid>

            {/* Sort By */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Ordenar por"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <MenuItem value="relevance">Relevancia</MenuItem>
                  <MenuItem value="newest">Más recientes</MenuItem>
                  <MenuItem value="price_asc">Precio: menor a mayor</MenuItem>
                  <MenuItem value="price_desc">Precio: mayor a menor</MenuItem>
                  <MenuItem value="rating">Mejor valorados</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Verified Only */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VerifiedIcon color="primary" fontSize="small" />
                    Solo verificados
                  </Box>
                }
              />
            </Grid>

            {/* Price Range */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ px: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <PriceIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Rango de precio: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, value) => handleFilterChange('priceRange', value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 250, label: '$250' },
                    { value: 500, label: '$500' },
                    { value: 750, label: '$750' },
                    { value: 1000, label: '$1000+' }
                  ]}
                />
              </Box>
            </Grid>

            {/* Rating Filter */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ px: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <StarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Calificación mínima
                </Typography>
                <Rating
                  value={filters.rating}
                  onChange={(_, value) => handleFilterChange('rating', value || 0)}
                  precision={0.5}
                  size="large"
                />
              </Box>
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Etiquetas populares:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {popularTags.map((tag: any) => (
                  <Chip
                    key={tag.name}
                    label={tag.name}
                    variant={filters.tags.includes(tag.name) ? 'filled' : 'outlined'}
                    color={filters.tags.includes(tag.name) ? 'primary' : 'default'}
                    size="small"
                    onClick={() => {
                      const newTags = filters.tags.includes(tag.name)
                        ? filters.tags.filter(t => t !== tag.name)
                        : [...filters.tags, tag.name];
                      handleFilterChange('tags', newTags);
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Filtros activos:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.query && (
                  <Chip
                    label={`Búsqueda: "${filters.query}"`}
                    onDelete={() => handleFilterChange('query', '')}
                    size="small"
                    color="primary"
                  />
                )}
                {filters.category && (
                  <Chip
                    label={`Categoría: ${categories.find((c: any) => c.id === filters.category)?.name || filters.category}`}
                    onDelete={() => handleFilterChange('category', '')}
                    size="small"
                    color="primary"
                  />
                )}
                {filters.location && (
                  <Chip
                    label={`Ubicación: ${filters.location}`}
                    onDelete={() => handleFilterChange('location', '')}
                    size="small"
                    color="primary"
                  />
                )}
                {filters.rating > 0 && (
                  <Chip
                    label={`Rating: ${filters.rating}+ estrellas`}
                    onDelete={() => handleFilterChange('rating', 0)}
                    size="small"
                    color="primary"
                  />
                )}
                {filters.verified && (
                  <Chip
                    label="Solo verificados"
                    onDelete={() => handleFilterChange('verified', false)}
                    size="small"
                    color="primary"
                  />
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                  <Chip
                    label={`Precio: $${filters.priceRange[0]} - $${filters.priceRange[1]}`}
                    onDelete={() => handleFilterChange('priceRange', [0, 1000])}
                    size="small"
                    color="primary"
                  />
                )}
                {filters.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleFilterChange('tags', filters.tags.filter(t => t !== tag))}
                    size="small"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AdvancedSearch; 