import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Grid,
  Button,
  Autocomplete,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
// Comentado temporalmente debido a incompatibilidades de versión con React 19
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'autocomplete';
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  multiple?: boolean;
}

export interface FilterValues {
  [key: string]: any;
}

export interface FilterPanelProps {
  filters: FilterOption[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  showActiveFiltersCount?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onChange,
  onClear,
  isCollapsible = true,
  defaultExpanded = false,
  showActiveFiltersCount = true,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const activeFiltersCount = Object.values(values).filter(value => 
    value !== null && value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const handleFilterChange = (key: string, value: any) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  const handleClearFilter = (key: string) => {
    const newValues = { ...values };
    delete newValues[key];
    onChange(newValues);
  };

  const renderFilterInput = (filter: FilterOption) => {
    const value = values[filter.key] || '';

    switch (filter.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            label={filter.label}
            placeholder={filter.placeholder}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              endAdornment: value && (
                <IconButton
                  size="small"
                  onClick={() => handleClearFilter(filter.key)}
                  sx={{ p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={value}
              label={filter.label}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              label={filter.label}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((val) => {
                    const option = filter.options?.find(opt => opt.value === val);
                    return (
                      <Chip
                        key={val}
                        label={option?.label || val}
                        size="small"
                        onDelete={() => {
                          const newValue = (value as string[]).filter(v => v !== val);
                          handleFilterChange(filter.key, newValue);
                        }}
                        deleteIcon={<ClearIcon />}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Autocomplete
            size="small"
            options={filter.options || []}
            getOptionLabel={(option) => option.label}
            value={filter.options?.find(opt => opt.value === value) || null}
            onChange={(_, newValue) => handleFilterChange(filter.key, newValue?.value || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label={filter.label}
                placeholder={filter.placeholder}
              />
            )}
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            size="small"
            label={filter.label}
            type="date"
            value={value ? value.split('T')[0] : ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value ? new Date(e.target.value).toISOString() : '')}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              placeholder: filter.placeholder,
            }}
          />
        );

      case 'daterange':
        return (
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <TextField
              fullWidth
              size="small"
              label={`${filter.label} - Desde`}
              type="date"
              value={value?.from ? value.from.split('T')[0] : ''}
              onChange={(e) => handleFilterChange(filter.key, {
                ...value,
                from: e.target.value ? new Date(e.target.value).toISOString() : ''
              })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              size="small"
              label={`${filter.label} - Hasta`}
              type="date"
              value={value?.to ? value.to.split('T')[0] : ''}
              onChange={(e) => handleFilterChange(filter.key, {
                ...value,
                to: e.target.value ? new Date(e.target.value).toISOString() : ''
              })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const filterContent = (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {filters.map((filter) => (
          <Grid size={{xs:12,sm:6,md:4}} key={filter.key}>
            {renderFilterInput(filter)}
          </Grid>
        ))}
      </Grid>

      {activeFiltersCount > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(values).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                
                const filter = filters.find(f => f.key === key);
                if (!filter) return null;

                const displayValue = Array.isArray(value) 
                  ? value.map(v => filter.options?.find(opt => opt.value === v)?.label || v).join(', ')
                  : filter.options?.find(opt => opt.value === value)?.label || value;

                return (
                  <Chip
                    key={key}
                    label={`${filter.label}: ${displayValue}`}
                    onDelete={() => handleClearFilter(key)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                );
              })}
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={onClear}
              startIcon={<ClearIcon />}
            >
              Limpiar todo
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  if (!isCollapsible) {
    return (
      <Paper elevation={1} sx={{ mb: 2 }}>
        {filterContent}
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" component="h2">
            Filtros
          </Typography>
          {showActiveFiltersCount && activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      <Collapse in={expanded}>
        <Divider />
        {filterContent}
      </Collapse>
    </Paper>
  );
}; 