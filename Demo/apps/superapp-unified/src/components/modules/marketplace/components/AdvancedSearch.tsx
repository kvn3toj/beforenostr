import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Autocomplete,
  Paper,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  Button,
  Collapse,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Badge,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Zoom,
  ClickAwayListener,
  Popper,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  TuneOutlined,
  LocationOn,
  StarBorder as Star,
  Category,
  PriceChange,
  VerifiedUser,
  Schedule,
  LocalOffer,
  TrendingUp,
  Favorite,
  KeyboardVoiceOutlined,
  HistoryOutlined,
  BookmarkBorderOutlined,
  RefreshOutlined,
  SwapVertOutlined,
  ExpandMore,
  ExpandLess,
  SearchOutlined,
  FilterAltOutlined,
  ClearAllOutlined,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';

interface SearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  location: string;
  rating: number;
  verified: boolean;
  sortBy: string;
  tags: string[];
  hasDiscount: boolean;
  deliveryType: string;
  availability: string;
  dateRange: string;
  businessType: string;
}

interface AdvancedSearchProps {
  onSearchResults: (results: any[]) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters: SearchFilters;
  placeholder?: string;
  showQuickFilters?: boolean;
  enableVoiceSearch?: boolean;
  enableSearchHistory?: boolean;
  compact?: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'category' | 'product' | 'location' | 'tag' | 'suggestion' | 'seller';
  count?: number;
  icon?: string;
  title?: string;
  subtitle?: string;
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  results: number;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearchResults,
  onFiltersChange,
  initialFilters,
  placeholder = 'Buscar productos y servicios...',
  showQuickFilters = true,
  enableVoiceSearch = true,
  enableSearchHistory = true,
  compact = false,
}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialFilters.query);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceSearching, setVoiceSearching] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Datos de ejemplo para filtros
  const categories = [
    { value: 'tecnologia', label: 'Tecnología', icon: '💻', count: 45 },
    { value: 'diseno', label: 'Diseño', icon: '🎨', count: 32 },
    { value: 'marketing', label: 'Marketing', icon: '📢', count: 28 },
    { value: 'educacion', label: 'Educación', icon: '📚', count: 38 },
    { value: 'consultoria', label: 'Consultoría', icon: '💼', count: 22 },
    { value: 'salud', label: 'Salud y Bienestar', icon: '🏥', count: 19 },
    { value: 'arte', label: 'Arte y Creatividad', icon: '🎭', count: 15 },
    { value: 'servicios', label: 'Servicios Generales', icon: '🔧', count: 41 },
  ];

  const locations = [
    'Bogotá, Cundinamarca',
    'Medellín, Antioquia',
    'Cali, Valle del Cauca',
    'Barranquilla, Atlántico',
    'Cartagena, Bolívar',
    'Bucaramanga, Santander',
    'Pereira, Risaralda',
    'Manizales, Caldas',
  ];

  const popularTags = [
    'Digital',
    'Presencial',
    'Remoto',
    'Urgente',
    'Personalizado',
    'Emprendimiento',
    'Sostenible',
    'Innovador',
    'Colaborativo',
    'Premium',
    'Express',
    'Certificado',
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Más Relevantes', icon: '🎯' },
    { value: 'rating', label: 'Mejor Calificados', icon: '⭐' },
    { value: 'price_asc', label: 'Menor Precio', icon: '💰' },
    { value: 'price_desc', label: 'Mayor Precio', icon: '💎' },
    { value: 'newest', label: 'Más Recientes', icon: '🆕' },
    { value: 'trending', label: 'Tendencia', icon: '🔥' },
    { value: 'popular', label: 'Más Populares', icon: '👥' },
    { value: 'nearby', label: 'Más Cercanos', icon: '📍' },
  ];

  const quickFilters = [
    { id: 'featured', label: 'Destacados', icon: '⭐' },
    { id: 'discounts', label: 'Ofertas', icon: '🏷️' },
    { id: 'verified', label: 'Verificados', icon: '✅' },
    { id: 'new', label: 'Nuevos', icon: '🆕' },
    { id: 'trending', label: 'Tendencia', icon: '🔥' },
    { id: 'premium', label: 'Premium', icon: '👑' },
  ];

  // 🌟 GUARDIANES ATLAS + NIRA: Búsquedas Inteligentes Conscientes
  const useSearchSuggestions = (searchQuery: string) => {
    return useQuery({
      queryKey: ['marketplace', 'search-suggestions', searchQuery],
      queryFn: async () => {
        if (!searchQuery || searchQuery.length < 2) return [];

        try {
          // 🎯 ATLAS: Llamada real al backend para sugerencias inteligentes
          const response = await apiService.get(`/marketplace/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
          return response.data?.suggestions || [];
        } catch (error) {
          // 🔮 PAX: Manejo consciente de errores - generar sugerencias basadas en patrones
          return generateConsciousSuggestions(searchQuery);
        }
      },
      enabled: searchQuery.length >= 2,
      staleTime: 30000, // 30 segundos cache para UX fluida
    });
  };

  // 🌸 ZENO: Sugerencias conscientes que fomentan el intercambio justo
  const generateConsciousSuggestions = (query: string): SearchSuggestion[] => {
    const consciousKeywords = {
      'sustentable': ['productos ecológicos', 'servicios sostenibles', 'economía circular'],
      'local': ['emprendedores locales', 'productos de km 0', 'servicios comunitarios'],
      'artesanal': ['productos artesanales', 'creaciones únicas', 'arte consciente'],
      'bienestar': ['servicios de bienestar', 'terapias holísticas', 'medicina natural'],
      'educación': ['cursos conscientes', 'talleres transformadores', 'mentorías'],
    };

    const baseSuggestions: SearchSuggestion[] = [
      {
        type: 'category',
        title: `${query} - Productos Conscientes`,
        subtitle: 'Encuentra opciones que apoyan el Bien Común',
        count: Math.floor(Math.random() * 50) + 10,
        icon: '🌱',
      },
      {
        type: 'location',
        title: `${query} cerca de ti`,
        subtitle: 'Apoya emprendedores de tu comunidad',
        count: Math.floor(Math.random() * 20) + 5,
        icon: '📍',
      },
      {
        type: 'seller',
        title: `Emprendedores Confiables - ${query}`,
        subtitle: 'Verificados por la comunidad CoomÜnity',
        count: Math.floor(Math.random() * 15) + 3,
        icon: '⭐',
      },
    ];

    // 🔍 NIRA: Añadir sugerencias específicas basadas en palabras clave conscientes
    Object.entries(consciousKeywords).forEach(([keyword, suggestions]) => {
      if (query.toLowerCase().includes(keyword)) {
        suggestions.forEach((suggestion, index) => {
          baseSuggestions.push({
            type: 'suggestion',
            title: suggestion,
            subtitle: 'Opción consciente recomendada',
            count: Math.floor(Math.random() * 30) + 5,
            icon: ['🌿', '💚', '✨'][index % 3],
          });
        });
      }
    });

    return baseSuggestions.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
  };

  // Búsqueda con debounce
  const { data: searchResults, refetch: performSearch } = useQuery({
    queryKey: ['marketplace-search', searchQuery, filters],
    queryFn: async () => {
      if (!searchQuery.trim() && !hasActiveFilters()) {
        return [];
      }

      setLoading(true);
      try {
        const response = await apiService.get('/marketplace/search', {
          params: {
            q: searchQuery,
            ...filters,
            // Convertir arrays a strings para la URL
            tags: filters.tags.join(','),
            priceMin: filters.priceRange[0],
            priceMax: filters.priceRange[1],
          },
        });

        // Guardar en historial
        if (searchQuery.trim()) {
          saveToHistory(searchQuery, response.length);
        }

        return response;
      } catch (error) {
        console.error('Error en búsqueda:', error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    enabled: false,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Reemplazar la llamada mock en el componente principal
  const { data: suggestions = [], isLoading: suggestionsLoading } = useSearchSuggestions(searchQuery);

  // Calcular filtros activos
  const hasActiveFilters = useCallback(() => {
    return (
      filters.category !== '' ||
      filters.location !== '' ||
      filters.rating > 0 ||
      filters.verified ||
      filters.hasDiscount ||
      filters.tags.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000 ||
      filters.deliveryType !== '' ||
      filters.availability !== ''
    );
  }, [filters]);

  // Contar filtros activos
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.rating > 0) count++;
    if (filters.verified) count++;
    if (filters.hasDiscount) count++;
    if (filters.tags.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.deliveryType) count++;
    if (filters.availability) count++;

    setFilterCount(count);
  }, [filters]);

  // Manejar búsqueda
  const handleSearch = useCallback(
    (query?: string) => {
      const searchTerm = query !== undefined ? query : searchQuery;
      setFilters((prev) => ({ ...prev, query: searchTerm }));
      performSearch();
    },
    [searchQuery, performSearch]
  );

  // Manejar cambio de filtros
  const handleFilterChange = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFiltersChange(updatedFilters);
    },
    [filters, onFiltersChange]
  );

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: '',
      priceRange: [0, 1000],
      location: '',
      rating: 0,
      verified: false,
      sortBy: 'relevance',
      tags: [],
      hasDiscount: false,
      deliveryType: '',
      availability: '',
      dateRange: '',
      businessType: '',
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  // Búsqueda por voz
  const handleVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta búsqueda por voz');
      return;
    }

    setVoiceSearching(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch(transcript);
      setVoiceSearching(false);
    };

    recognition.onerror = () => {
      setVoiceSearching(false);
    };

    recognition.onend = () => {
      setVoiceSearching(false);
    };

    recognition.start();
  }, [handleSearch]);

  // Guardar en historial
  const saveToHistory = useCallback(
    (query: string, resultsCount: number) => {
      if (!enableSearchHistory) return;

      const newEntry: SearchHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        results: resultsCount,
      };

      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.query !== query);
        return [newEntry, ...filtered].slice(0, 10); // Mantener solo 10 entradas
      });
    },
    [enableSearchHistory]
  );

  // Manejar clic en sugerencia
  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      setSearchQuery(suggestion.text);
      setShowSuggestions(false);
      handleSearch(suggestion.text);
    },
    [handleSearch]
  );

  // Efectos
  useEffect(() => {
    if (suggestions) {
      setSearchSuggestions(suggestions);
    }
  }, [suggestions]);

  useEffect(() => {
    if (searchResults) {
      onSearchResults(searchResults);
    }
  }, [searchResults, onSearchResults]);

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {/* Barra de búsqueda principal */}
      <Paper
        elevation={2}
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          transition: 'all 0.3s ease',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
          },
        }}
        ref={searchRef}
      >
        <SearchOutlined sx={{ color: 'text.secondary' }} />

        <TextField
          ref={inputRef}
          fullWidth
          variant="standard"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
              setShowSuggestions(false);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={0.5}>
                  {loading && <CircularProgress size={20} />}

                  {enableVoiceSearch && (
                    <Tooltip title="Búsqueda por voz">
                      <IconButton
                        size="small"
                        onClick={handleVoiceSearch}
                        disabled={voiceSearching}
                        sx={{
                          color: voiceSearching
                            ? 'primary.main'
                            : 'text.secondary',
                        }}
                      >
                        <KeyboardVoiceOutlined />
                      </IconButton>
                    </Tooltip>
                  )}

                  {searchQuery && (
                    <Tooltip title="Limpiar búsqueda">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSuggestions(false);
                        }}
                      >
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </InputAdornment>
            ),
          }}
        />

        <Tooltip
          title={`Filtros avanzados ${filterCount > 0 ? `(${filterCount})` : ''}`}
        >
          <Badge badgeContent={filterCount} color="primary">
            <IconButton
              onClick={() => setShowAdvanced(!showAdvanced)}
              color={showAdvanced ? 'primary' : 'default'}
            >
              <TuneOutlined />
            </IconButton>
          </Badge>
        </Tooltip>

        <Button
          variant="contained"
          onClick={() => handleSearch()}
          sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
          disabled={loading}
        >
          <Search />
        </Button>
      </Paper>

      {/* Sugerencias y historial */}
      <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
        <Box sx={{ position: 'relative' }}>
          <Popper
            open={
              showSuggestions &&
              (searchSuggestions.length > 0 || searchHistory.length > 0)
            }
            anchorEl={searchRef.current}
            placement="bottom-start"
            style={{ width: searchRef.current?.offsetWidth, zIndex: 1300 }}
          >
            <Paper
              elevation={8}
              sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}
            >
              {/* Sugerencias */}
              {searchSuggestions.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ p: 1, fontWeight: 'bold' }}
                  >
                    Sugerencias
                  </Typography>
                  <List dense>
                    {searchSuggestions.map((suggestion) => (
                      <ListItem
                        key={suggestion.id}
                        button
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <span>{suggestion.icon}</span>
                        </ListItemIcon>
                        <ListItemText
                          primary={suggestion.text}
                          secondary={
                            suggestion.count && `${suggestion.count} resultados`
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Historial */}
              {enableSearchHistory &&
                searchHistory.length > 0 &&
                searchSuggestions.length === 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ p: 1, fontWeight: 'bold' }}
                    >
                      Búsquedas recientes
                    </Typography>
                    <List dense>
                      {searchHistory.slice(0, 5).map((item) => (
                        <ListItem
                          key={item.id}
                          button
                          onClick={() => {
                            setSearchQuery(item.query);
                            handleSearch(item.query);
                            setShowSuggestions(false);
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <HistoryOutlined />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.query}
                            secondary={`${item.results} resultados`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>

      {/* Filtros rápidos */}
      {showQuickFilters && (
        <Fade in timeout={300}>
          <Box sx={{ mt: 2 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ overflowX: 'auto', pb: 1 }}
            >
              {quickFilters.map((filter) => (
                <Chip
                  key={filter.id}
                  label={`${filter.icon} ${filter.label}`}
                  variant="outlined"
                  clickable
                  onClick={() => {
                    // Implementar lógica de filtros rápidos
                    console.log('Filtro rápido:', filter.id);
                  }}
                  sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                />
              ))}
            </Stack>
          </Box>
        </Fade>
      )}

      {/* Panel de filtros avanzados */}
      <Collapse in={showAdvanced}>
        <Card sx={{ mt: 2 }} elevation={1}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Filtros Avanzados
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={clearFilters}
                  startIcon={<ClearAllOutlined />}
                  disabled={!hasActiveFilters()}
                >
                  Limpiar
                </Button>
                <Button
                  size="small"
                  onClick={() => setShowAdvanced(false)}
                  startIcon={<ExpandLess />}
                >
                  Ocultar
                </Button>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              {/* Categoría */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={
                    filters.category
                      ? categories.find((c) => c.value === filters.category)
                      : null
                  }
                  onChange={(_, value) =>
                    handleFilterChange({ category: value?.value || '' })
                  }
                  options={categories}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ mr: 1 }}>{option.icon}</Box>
                      <Box sx={{ flexGrow: 1 }}>
                        {option.label}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({option.count})
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categoría"
                      placeholder="Selecciona una categoría"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <Category sx={{ mr: 1, color: 'text.secondary' }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Ubicación */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={filters.location}
                  onChange={(_, value) =>
                    handleFilterChange({ location: value || '' })
                  }
                  options={locations}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ubicación"
                      placeholder="Ciudad, región..."
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Rango de precios */}
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Rango de precios (ü)</Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, value) =>
                    handleFilterChange({
                      priceRange: value as [number, number],
                    })
                  }
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  marks={[
                    { value: 0, label: 'ü0' },
                    { value: 250, label: 'ü250' },
                    { value: 500, label: 'ü500' },
                    { value: 750, label: 'ü750' },
                    { value: 1000, label: 'ü1000+' },
                  ]}
                />
              </Grid>

              {/* Calificación mínima */}
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Calificación mínima</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <IconButton
                      key={rating}
                      onClick={() => handleFilterChange({ rating })}
                      color={filters.rating >= rating ? 'primary' : 'default'}
                    >
                      <Star />
                    </IconButton>
                  ))}
                  {filters.rating > 0 && (
                    <Chip
                      label={`${filters.rating}+ estrellas`}
                      size="small"
                      onDelete={() => handleFilterChange({ rating: 0 })}
                    />
                  )}
                </Box>
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  value={filters.tags}
                  onChange={(_, value) => handleFilterChange({ tags: value })}
                  options={popularTags}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Etiquetas"
                      placeholder="Añadir etiquetas..."
                    />
                  )}
                />
              </Grid>

              {/* Switches */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.verified}
                        onChange={(e) =>
                          handleFilterChange({ verified: e.target.checked })
                        }
                      />
                    }
                    label="Solo proveedores verificados"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.hasDiscount}
                        onChange={(e) =>
                          handleFilterChange({ hasDiscount: e.target.checked })
                        }
                      />
                    }
                    label="Solo ofertas con descuento"
                  />
                </Stack>
              </Grid>

              {/* Ordenar por */}
              <Grid item xs={12}>
                <Typography gutterBottom fontWeight="bold">
                  Ordenar por
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {sortOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={`${option.icon} ${option.label}`}
                      variant={
                        filters.sortBy === option.value ? 'filled' : 'outlined'
                      }
                      onClick={() =>
                        handleFilterChange({ sortBy: option.value })
                      }
                      clickable
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>

      {/* Resultados y estado */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {voiceSearching && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="primary">
            🎤 Escuchando... Habla ahora
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdvancedSearch;
