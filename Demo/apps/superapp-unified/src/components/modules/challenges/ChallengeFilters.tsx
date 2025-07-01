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
  useTheme,
  alpha,
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
  onResetFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onSavePreset?: (name: string, filters: IFilters) => void;
  savedPresets?: Array<{ name: string; filters: IFilters }>;
  onLoadPreset?: (filters: IFilters) => void;
  totalResults?: number;
  isLoading?: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: 'BEGINNER', label: '🌱 Iniciante', color: '#4CAF50' },
  { value: 'INTERMEDIATE', label: '⚡ Intermedio', color: '#FF9800' },
  { value: 'ADVANCED', label: '🔥 Avanzado', color: '#F44336' },
  { value: 'EXPERT', label: '🌟 Experto', color: '#9C27B0' },
];

const CATEGORY_OPTIONS = [
  {
    value: 'PERSONAL_DEVELOPMENT',
    label: 'Desarrollo Personal',
    icon: '🧠',
    color: '#9C27B0',
    description: 'Expande tu conciencia',
  },
  {
    value: 'FITNESS',
    label: 'Fitness',
    icon: '💪',
    color: '#4CAF50',
    description: 'Fortalece tu cuerpo',
  },
  {
    value: 'CREATIVITY',
    label: 'Creatividad',
    icon: '🎨',
    color: '#FF5722',
    description: 'Expresa tu arte',
  },
  {
    value: 'SOCIAL',
    label: 'Social',
    icon: '👥',
    color: '#2196F3',
    description: 'Conecta con otros',
  },
  {
    value: 'LEARNING',
    label: 'Aprendizaje',
    icon: '📚',
    color: '#3F51B5',
    description: 'Expande tu conocimiento',
  },
  {
    value: 'HEALTH',
    label: 'Salud',
    icon: '🌿',
    color: '#4CAF50',
    description: 'Cuida tu bienestar',
  },
  {
    value: 'MINDFULNESS',
    label: 'Mindfulness',
    icon: '🧘',
    color: '#673AB7',
    description: 'Cultiva la consciencia',
  },
  {
    value: 'COMMUNITY',
    label: 'Comunidad',
    icon: '🌍',
    color: '#009688',
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
  { value: 'ACTIVE', label: 'Activo', color: '#4CAF50' },
  { value: 'INACTIVE', label: 'Inactivo', color: '#9E9E9E' },
  { value: 'COMPLETED', label: 'Completado', color: '#2196F3' },
  { value: 'EXPIRED', label: 'Expirado', color: '#F44336' },
];

export const ChallengeFilters: React.FC<ChallengeFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  showFilters,
  onToggleFilters,
  onSavePreset,
  savedPresets,
  onLoadPreset,
  totalResults,
  isLoading,
}) => {
  const theme = useTheme();
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
    const currentValues = (filters[field] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFiltersChange({
      ...filters,
      [field]: newValues,
    });
  };

  const clearAllFilters = () => {
    setQuickFilters({
      myParticipating: false,
      trending: false,
      newThisWeek: false,
      highReward: false,
    });
    onResetFilters();
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
      (filters.search && filters.search.length > 0) ||
      (filters.status && filters.status.length > 0) ||
      (filters.type && filters.type.length > 0) ||
      (filters.difficulty && filters.difficulty.length > 0) ||
      (filters.category && filters.category.length > 0) ||
      Object.values(quickFilters).some(Boolean)
    );
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.search && filters.search.length > 0) count++;
    if (filters.status?.length) count += filters.status.length;
    if (filters.type?.length) count += filters.type.length;
    if (filters.difficulty?.length) count += filters.difficulty.length;
    if (filters.category?.length) count += filters.category.length;
    count += Object.values(quickFilters).filter(Boolean).length;
    return count;
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 3,
        backgroundColor: theme.palette.background.paper, // SIEMPRE BLANCO
        borderColor: theme.palette.divider,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header con estadísticas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tune sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
              🌊 Filtros Cósmicos
            </Typography>
            {hasActiveFilters() && (
              <Chip
                label={`${getFilterCount()} filtros activos`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {totalResults !== undefined && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {totalResults.toLocaleString()} resultados
              </Typography>
            )}
            <IconButton
              size="small"
              onClick={onToggleFilters}
              sx={{
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: theme.palette.text.secondary,
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
                  <Search sx={{ color: theme.palette.text.secondary }} />
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
                backgroundColor: theme.palette.background.paper, // Fondo blanco
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
                '&.Mui-focused': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>

        {/* Quick Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            ⚡ Filtros Rápidos
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<Group />}
              label="Mis Challenges"
              clickable
              variant={quickFilters.myParticipating ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('myParticipating', !quickFilters.myParticipating)}
              sx={{
                backgroundColor: quickFilters.myParticipating ? theme.palette.primary.main : theme.palette.background.paper,
                color: quickFilters.myParticipating ? theme.palette.primary.contrastText : theme.palette.text.primary,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  borderColor: theme.palette.primary.main,
                },
              }}
            />
            <Chip
              icon={<TrendingUp />}
              label="Trending"
              clickable
              variant={quickFilters.trending ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('trending', !quickFilters.trending)}
              sx={{
                backgroundColor: quickFilters.trending ? theme.palette.secondary.main : theme.palette.background.paper,
                color: quickFilters.trending ? theme.palette.secondary.contrastText : theme.palette.text.primary,
                borderColor: alpha(theme.palette.secondary.main, 0.3),
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  borderColor: theme.palette.secondary.main,
                },
              }}
            />
            <Chip
              icon={<Schedule />}
              label="Nuevos"
              clickable
              variant={quickFilters.newThisWeek ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('newThisWeek', !quickFilters.newThisWeek)}
              sx={{
                backgroundColor: quickFilters.newThisWeek ? theme.palette.info.main : theme.palette.background.paper,
                color: quickFilters.newThisWeek ? theme.palette.info.contrastText : theme.palette.text.primary,
                borderColor: alpha(theme.palette.info.main, 0.3),
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  borderColor: theme.palette.info.main,
                },
              }}
            />
            <Chip
              icon={<Star />}
              label="Alto Reward"
              clickable
              variant={quickFilters.highReward ? 'filled' : 'outlined'}
              onClick={() => handleQuickFilterChange('highReward', !quickFilters.highReward)}
              sx={{
                backgroundColor: quickFilters.highReward ? theme.palette.warning.main : theme.palette.background.paper,
                color: quickFilters.highReward ? theme.palette.warning.contrastText : theme.palette.text.primary,
                borderColor: alpha(theme.palette.warning.main, 0.3),
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  borderColor: theme.palette.warning.main,
                },
              }}
            />
          </Box>
        </Box>

        {/* Toggle para filtros avanzados */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={onToggleFilters}
            startIcon={<FilterList />}
            endIcon={<ExpandMore sx={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />}
            sx={{
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.background.paper, // Fondo blanco
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderColor: theme.palette.primary.main,
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
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.paper, // Fondo blanco
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.05),
                },
              }}
            >
              Limpiar Todo
            </Button>
          )}
        </Box>

        {/* Filtros avanzados expandibles */}
        {showFilters && (
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper, // Fondo blanco
              borderRadius: 1,
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              🎯 Filtros Avanzados
            </Typography>

            {/* Aquí irían los filtros avanzados con el mismo estilo minimalista */}
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Filtros avanzados próximamente...
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
