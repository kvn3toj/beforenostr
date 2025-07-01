import React, { useState, useEffect } from 'react';
import {
  Box,
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

// 🌌 ARIA (Frontend Artist) - Cosmic Design System
import { CosmicCard } from '../../../design-system';
import { UNIFIED_COLORS } from '../../../theme/colors';

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
  { value: 'BEGINNER', label: '🌱 Iniciante', color: UNIFIED_COLORS.elements.tierra.primary },
  { value: 'INTERMEDIATE', label: '⚡ Intermedio', color: UNIFIED_COLORS.elements.fuego.primary },
  { value: 'ADVANCED', label: '🔥 Avanzado', color: UNIFIED_COLORS.elements.aire.primary },
  { value: 'EXPERT', label: '🌟 Experto', color: UNIFIED_COLORS.elements.eter.primary },
];

const CATEGORY_OPTIONS = [
  {
    value: 'PERSONAL_DEVELOPMENT',
    label: 'Desarrollo Personal',
    icon: '🧠',
    color: UNIFIED_COLORS.elements.eter.primary,
    description: 'Expande tu conciencia',
  },
  {
    value: 'FITNESS',
    label: 'Fitness',
    icon: '💪',
    color: UNIFIED_COLORS.elements.tierra.primary,
    description: 'Fortalece tu cuerpo',
  },
  {
    value: 'CREATIVITY',
    label: 'Creatividad',
    icon: '🎨',
    color: UNIFIED_COLORS.elements.fuego.primary,
    description: 'Expresa tu arte',
  },
  {
    value: 'SOCIAL',
    label: 'Social',
    icon: '👥',
    color: UNIFIED_COLORS.elements.agua.primary,
    description: 'Conecta con otros',
  },
  {
    value: 'LEARNING',
    label: 'Aprendizaje',
    icon: '📚',
    color: UNIFIED_COLORS.elements.aire.primary,
    description: 'Expande tu conocimiento',
  },
  {
    value: 'HEALTH',
    label: 'Salud',
    icon: '🌿',
    color: UNIFIED_COLORS.elements.tierra.primary,
    description: 'Cuida tu bienestar',
  },
  {
    value: 'MINDFULNESS',
    label: 'Mindfulness',
    icon: '🧘',
    color: UNIFIED_COLORS.elements.eter.primary,
    description: 'Cultiva la consciencia',
  },
  {
    value: 'COMMUNITY',
    label: 'Comunidad',
    icon: '🌍',
    color: UNIFIED_COLORS.elements.agua.primary,
    description: 'Bien Común',
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
  { value: 'ACTIVE', label: 'Activo', color: UNIFIED_COLORS.elements.tierra.primary },
  { value: 'INACTIVE', label: 'Inactivo', color: UNIFIED_COLORS.elements.aire.primary },
  { value: 'COMPLETED', label: 'Completado', color: UNIFIED_COLORS.elements.agua.primary },
  { value: 'EXPIRED', label: 'Expirado', color: UNIFIED_COLORS.elements.fuego.primary },
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
    <CosmicCard
      variant="elevated"
      element="aire" // Aire para filtros (ideas, organización)
      enableGlow={true}
      enableAnimations={true}
      cosmicIntensity="subtle"
      sx={{ mb: 3 }}
    >
      <CardContent sx={{ pb: 2 }}>
        {/* Header con estadísticas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tune sx={{ color: UNIFIED_COLORS.elements.aire.primary }} />
            <Typography variant="h6" fontWeight="bold">
              🌊 Filtros Cósmicos
            </Typography>
            {hasActiveFilters() && (
              <Chip
                label={`${getFilterCount()} filtros activos`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {totalResults !== undefined && (
              <Typography variant="body2" color="text.secondary">
                {totalResults.toLocaleString()} resultados
              </Typography>
            )}
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ExpandMore />
            </IconButton>
          </Box>
        </Box>

        {/* Quick Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="🔍 Buscar desafíos por título, descripción o etiquetas..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: UNIFIED_COLORS.elements.aire.primary }} />
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
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 0 20px ${UNIFIED_COLORS.elements.aire.primary}20`,
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 25px ${UNIFIED_COLORS.elements.aire.primary}30`,
                },
              },
            }}
          />
        </Box>

        {/* Quick Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            ⚡ Filtros Rápidos
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<Group />}
              label="Mis Challenges"
              clickable
              color={quickFilters.myParticipating ? 'primary' : 'default'}
              variant={quickFilters.myParticipating ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('myParticipating', !quickFilters.myParticipating)}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Chip
              icon={<TrendingUp />}
              label="Trending"
              clickable
              color={quickFilters.trending ? 'primary' : 'default'}
              variant={quickFilters.trending ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('trending', !quickFilters.trending)}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Chip
              icon={<Schedule />}
              label="Nuevos"
              clickable
              color={quickFilters.newThisWeek ? 'primary' : 'default'}
              variant={quickFilters.newThisWeek ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('newThisWeek', !quickFilters.newThisWeek)}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Chip
              icon={<Star />}
              label="Alto Reward"
              clickable
              color={quickFilters.highReward ? 'primary' : 'default'}
              variant={quickFilters.highReward ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('highReward', !quickFilters.highReward)}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Box>
        </Box>

        {/* Toggle para filtros avanzados */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setExpanded(!expanded)}
            startIcon={<FilterList />}
            endIcon={<ExpandMore sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />}
            sx={{
              borderColor: UNIFIED_COLORS.elements.aire.primary,
              color: UNIFIED_COLORS.elements.aire.primary,
              '&:hover': {
                bgcolor: `${UNIFIED_COLORS.elements.aire.primary}15`,
                borderColor: UNIFIED_COLORS.elements.aire.primary,
              },
            }}
          >
            Filtros Avanzados
          </Button>

          {hasActiveFilters() && (
            <Button
              variant="text"
              onClick={clearAllFilters}
              startIcon={<Clear />}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                },
              }}
            >
              Limpiar Todo
            </Button>
          )}
        </Box>

        {/* Filtros avanzados expandibles */}
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          elevation={0}
          sx={{
            bgcolor: 'transparent',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary sx={{ display: 'none' }} />
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <Grid container spacing={3}>
              {/* Status Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  🔄 Estado
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
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: option.color,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: option.color,
                            },
                          }}
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
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  💪 Dificultad
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
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: option.color,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: option.color,
                            },
                          }}
                        />
                      }
                      label={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography>{option.label}</Typography>
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  🎯 Categoría
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 200, overflowY: 'auto' }}>
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
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: option.color,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: option.color,
                            },
                          }}
                        />
                      }
                      label={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography>{option.icon}</Typography>
                          <Box>
                            <Typography variant="body2">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </Grid>

              {/* Type Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  ⏰ Tipo
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
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  📊 Ordenar por
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
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    💾 Presets Guardados
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {savedPresets.map((preset, index) => (
                      <Chip
                        key={index}
                        label={preset.name}
                        clickable
                        onClick={() => onLoadPreset?.(preset.filters)}
                        icon={<Bookmark />}
                        sx={{
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: `0 0 15px ${UNIFIED_COLORS.elements.aire.primary}30`,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Save New Preset */}
              {onSavePreset && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Nombre del preset..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={savePreset}
                      disabled={!presetName.trim()}
                      startIcon={<BookmarkBorder />}
                      sx={{
                        borderColor: UNIFIED_COLORS.elements.aire.primary,
                        color: UNIFIED_COLORS.elements.aire.primary,
                        '&:hover': {
                          bgcolor: `${UNIFIED_COLORS.elements.aire.primary}15`,
                        },
                      }}
                    >
                      Guardar Preset
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Active Filters Summary */}
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
              🌊 Filtros aplicados:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {filters.search && (
                <Chip
                  label={`Búsqueda: "${filters.search}"`}
                  size="small"
                  onDelete={() => handleFilterChange('search', '')}
                  color="primary"
                  variant="outlined"
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
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
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
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
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
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
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </CosmicCard>
  );
};
