import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  Autocomplete,
  Paper,
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  Clear,
  Search,
  Tune,
  Schedule,
  Star,
  Group,
  TrendingUp,
  Refresh,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import {
  ChallengeStatus,
  ChallengeType,
  ChallengeDifficulty,
  ChallengeCategory,
  ChallengeFilters as IFilters,
} from '../../../types/challenges';

interface ChallengeFiltersProps {
  filters: IFilters;
  onFiltersChange: (filters: IFilters) => void;
  onReset: () => void;
  onSavePreset?: (name: string, filters: IFilters) => void;
  savedPresets?: Array<{ name: string; filters: IFilters }>;
  onLoadPreset?: (filters: IFilters) => void;
  totalResults?: number;
  isLoading?: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: 'BEGINNER', label: 'Principiante', icon: '🌱', color: '#4CAF50' },
  { value: 'INTERMEDIATE', label: 'Intermedio', icon: '⚡', color: '#FF9800' },
  { value: 'ADVANCED', label: 'Avanzado', icon: '🔥', color: '#F44336' },
  { value: 'EXPERT', label: 'Experto', icon: '💎', color: '#9C27B0' },
];

const CATEGORY_OPTIONS = [
  {
    value: 'LEARNING',
    label: 'Aprendizaje',
    icon: '📚',
    color: '#2196F3',
    description: 'Expande tu conocimiento',
  },
  {
    value: 'SOCIAL',
    label: 'Social',
    icon: '👥',
    color: '#FF9800',
    description: 'Conecta con la comunidad',
  },
  {
    value: 'WELLNESS',
    label: 'Bienestar',
    icon: '💚',
    color: '#4CAF50',
    description: 'Cuida tu bienestar',
  },
  {
    value: 'CREATIVITY',
    label: 'Creatividad',
    icon: '🎨',
    color: '#9C27B0',
    description: 'Expresa tu creatividad',
  },
  {
    value: 'COMMUNITY',
    label: 'Comunidad',
    icon: '🌍',
    color: '#FF5722',
    description: 'Bien Común',
  },
  {
    value: 'SUSTAINABILITY',
    label: 'Sostenibilidad',
    icon: '🌱',
    color: '#8BC34A',
    description: 'Protege el planeta',
  },
  {
    value: 'INNOVATION',
    label: 'Innovación',
    icon: '💡',
    color: '#607D8B',
    description: 'Innova y transforma',
  },
];

const TYPE_OPTIONS = [
  { value: 'CUSTOM', label: 'Personalizado', icon: '⚙️' },
  { value: 'AUTOMATED', label: 'Automático', icon: '🤖' },
  { value: 'DAILY', label: 'Diario', icon: '📅' },
  { value: 'WEEKLY', label: 'Semanal', icon: '📆' },
  { value: 'MONTHLY', label: 'Mensual', icon: '🗓️' },
  { value: 'SEASONAL', label: 'Estacional', icon: '🍃' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Activo', color: '#4CAF50' },
  { value: 'INACTIVE', label: 'Inactivo', color: '#757575' },
  { value: 'COMPLETED', label: 'Completado', color: '#2196F3' },
  { value: 'EXPIRED', label: 'Expirado', color: '#F44336' },
];

export const ChallengeFilters: React.FC<ChallengeFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  onSavePreset,
  savedPresets,
  onLoadPreset,
  totalResults,
  isLoading,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [quickFilters, setQuickFilters] = useState({
    myParticipating: false,
    trending: false,
    newThisWeek: false,
    highReward: false,
  });

  // Quick filter toggles
  const handleQuickFilterChange = (filterName: string, checked: boolean) => {
    setQuickFilters((prev) => ({ ...prev, [filterName]: checked }));

    // Apply quick filter logic
    const newFilters = { ...filters };

    switch (filterName) {
      case 'myParticipating':
        // This would typically come from user context
        break;
      case 'trending':
        newFilters.sortBy = 'participants';
        newFilters.sortOrder = 'desc';
        break;
      case 'newThisWeek':
        // Filter by creation date (this week)
        break;
      case 'highReward':
        // Filter by high point values
        break;
    }

    onFiltersChange(newFilters);
  };

  const handleFilterChange = (field: keyof IFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleArrayFilterChange = (
    field: keyof IFilters,
    value: string,
    checked: boolean
  ) => {
    const currentArray = (filters[field] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);

    onFiltersChange({
      ...filters,
      [field]: newArray,
    });
  };

  const clearAllFilters = () => {
    onReset();
    setQuickFilters({
      myParticipating: false,
      trending: false,
      newThisWeek: false,
      highReward: false,
    });
  };

  const savePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim(), filters);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.status?.length ||
      filters.type?.length ||
      filters.difficulty?.length ||
      filters.category?.length ||
      Object.values(quickFilters).some(Boolean)
    );
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status?.length) count += filters.status.length;
    if (filters.type?.length) count += filters.type.length;
    if (filters.difficulty?.length) count += filters.difficulty.length;
    if (filters.category?.length) count += filters.category.length;
    count += Object.values(quickFilters).filter(Boolean).length;
    return count;
  };

  return (
    <Card
      sx={{
        mb: 3,
        background:
          'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(156, 39, 176, 0.05))',
        border: '1px solid rgba(33, 150, 243, 0.1)',
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        {/* Quick Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar desafíos por título, descripción o etiquetas..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleFilterChange('search', '')}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper',
              },
            }}
          />
        </Box>

        {/* Quick Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Filtros Rápidos
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={quickFilters.myParticipating}
                  onChange={(e) =>
                    handleQuickFilterChange('myParticipating', e.target.checked)
                  }
                />
              }
              label="Mis Desafíos"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={quickFilters.trending}
                  onChange={(e) =>
                    handleQuickFilterChange('trending', e.target.checked)
                  }
                />
              }
              label="Tendencia"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={quickFilters.newThisWeek}
                  onChange={(e) =>
                    handleQuickFilterChange('newThisWeek', e.target.checked)
                  }
                />
              }
              label="Nuevos"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={quickFilters.highReward}
                  onChange={(e) =>
                    handleQuickFilterChange('highReward', e.target.checked)
                  }
                />
              }
              label="Alta Recompensa"
            />
          </Stack>
        </Box>

        {/* Advanced Filters Toggle */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: expanded ? 2 : 0,
          }}
        >
          <Button
            startIcon={<Tune />}
            endIcon={
              <ExpandMore
                sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
              />
            }
            onClick={() => setExpanded(!expanded)}
            sx={{ transition: 'all 0.3s ease' }}
          >
            Filtros Avanzados {getFilterCount() > 0 && `(${getFilterCount()})`}
          </Button>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {totalResults !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {totalResults} resultados
              </Typography>
            )}
            {hasActiveFilters() && (
              <Button
                size="small"
                startIcon={<Clear />}
                onClick={clearAllFilters}
                color="error"
                variant="outlined"
              >
                Limpiar
              </Button>
            )}
          </Box>
        </Box>

        {/* Advanced Filters */}
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          elevation={0}
        >
          <AccordionSummary sx={{ display: 'none' }} />
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <Grid container spacing={3}>
              {/* Status Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Estado
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {STATUS_OPTIONS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Switch
                          size="small"
                          checked={
                            filters.status?.includes(
                              option.value as ChallengeStatus
                            ) || false
                          }
                          onChange={(e) =>
                            handleArrayFilterChange(
                              'status',
                              option.value,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: option.color,
                            }}
                          />
                          {option.label}
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </Grid>

              {/* Difficulty Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Dificultad
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Switch
                          size="small"
                          checked={
                            filters.difficulty?.includes(
                              option.value as ChallengeDifficulty
                            ) || false
                          }
                          onChange={(e) =>
                            handleArrayFilterChange(
                              'difficulty',
                              option.value,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography>{option.icon}</Typography>
                          {option.label}
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Categoría
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {CATEGORY_OPTIONS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Switch
                          size="small"
                          checked={
                            filters.category?.includes(
                              option.value as ChallengeCategory
                            ) || false
                          }
                          onChange={(e) =>
                            handleArrayFilterChange(
                              'category',
                              option.value,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={
                        <Tooltip title={option.description} arrow>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Typography>{option.icon}</Typography>
                            {option.label}
                          </Box>
                        </Tooltip>
                      }
                    />
                  ))}
                </Box>
              </Grid>

              {/* Type Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Tipo
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {TYPE_OPTIONS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Switch
                          size="small"
                          checked={
                            filters.type?.includes(
                              option.value as ChallengeType
                            ) || false
                          }
                          onChange={(e) =>
                            handleArrayFilterChange(
                              'type',
                              option.value,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography>{option.icon}</Typography>
                          {option.label}
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </Grid>

              {/* Sorting Options */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Ordenar por
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Campo</InputLabel>
                      <Select
                        value={filters.sortBy || 'title'}
                        onChange={(e) =>
                          handleFilterChange('sortBy', e.target.value)
                        }
                        label="Campo"
                      >
                        <MenuItem value="title">Título</MenuItem>
                        <MenuItem value="points">Mëritos</MenuItem>
                        <MenuItem value="startDate">Fecha de inicio</MenuItem>
                        <MenuItem value="endDate">Fecha de fin</MenuItem>
                        <MenuItem value="participants">Participantes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Orden</InputLabel>
                      <Select
                        value={filters.sortOrder || 'asc'}
                        onChange={(e) =>
                          handleFilterChange('sortOrder', e.target.value)
                        }
                        label="Orden"
                      >
                        <MenuItem value="asc">Ascendente</MenuItem>
                        <MenuItem value="desc">Descendente</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Saved Presets */}
              {savedPresets && savedPresets.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Filtros Guardados
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {savedPresets.map((preset, index) => (
                      <Chip
                        key={index}
                        label={preset.name}
                        icon={<Bookmark />}
                        onClick={() => onLoadPreset?.(preset.filters)}
                        variant="outlined"
                        clickable
                      />
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Save Current Filters */}
              {onSavePreset && hasActiveFilters() && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Nombre del preset"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      sx={{ minWidth: 200 }}
                    />
                    <Button
                      startIcon={<BookmarkBorder />}
                      onClick={savePreset}
                      disabled={!presetName.trim()}
                      variant="outlined"
                      size="small"
                    >
                      Guardar Filtros
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Applied Filters Summary */}
        {hasActiveFilters() && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Filtros aplicados:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {filters.search && (
                <Chip
                  label={`Búsqueda: "${filters.search}"`}
                  size="small"
                  onDelete={() => handleFilterChange('search', '')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.status?.map((status) => (
                <Chip
                  key={status}
                  label={
                    STATUS_OPTIONS.find((s) => s.value === status)?.label ||
                    status
                  }
                  size="small"
                  onDelete={() =>
                    handleArrayFilterChange('status', status, false)
                  }
                  color="default"
                  variant="outlined"
                />
              ))}
              {filters.difficulty?.map((difficulty) => (
                <Chip
                  key={difficulty}
                  label={
                    DIFFICULTY_OPTIONS.find((d) => d.value === difficulty)
                      ?.label || difficulty
                  }
                  size="small"
                  onDelete={() =>
                    handleArrayFilterChange('difficulty', difficulty, false)
                  }
                  color="default"
                  variant="outlined"
                />
              ))}
              {filters.category?.map((category) => (
                <Chip
                  key={category}
                  label={
                    CATEGORY_OPTIONS.find((c) => c.value === category)?.label ||
                    category
                  }
                  size="small"
                  onDelete={() =>
                    handleArrayFilterChange('category', category, false)
                  }
                  color="default"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
