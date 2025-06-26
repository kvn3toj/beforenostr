import React from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Stack,
  Chip,
  Box,
  Typography,
  useTheme,
  alpha,
  Tooltip,
  SelectChangeEvent,
  useMediaQuery,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Search, TuneOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFilterControls, SearchFilters } from '../../../../hooks/modules/marketplace/useFilterControls';

interface Category {
  id: string;
  name: string;
}

interface MarketplaceFilterBarProps {
  categories: Category[];
  onSearch: (filters: Partial<SearchFilters>) => void;
  onOpenAdvancedFilters: () => void;
}

const CategoryChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  padding: theme.spacing(2, 1.5),
  height: 'auto',
  cursor: 'pointer',
  '&.Mui-active': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '&:not(.Mui-active)': {
    borderColor: theme.palette.divider,
    backgroundColor: 'transparent',
  },
}));

const MarketplaceFilterBar: React.FC<MarketplaceFilterBarProps> = ({
  categories,
  onSearch,
  onOpenAdvancedFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { filters, handlers } = useFilterControls(onSearch);

  const renderCategoryChips = () => (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <CategoryChip
        label="Todo"
        variant="outlined"
        onClick={() => handlers.handleCategoryChange('')}
        className={filters.activeCategory === '' ? 'Mui-active' : ''}
      />
      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          label={category.name}
          variant="outlined"
          onClick={() => handlers.handleCategoryChange(category.id)}
          className={filters.activeCategory === category.id ? 'Mui-active' : ''}
        />
      ))}
    </Stack>
  );

  const renderSortingControls = () => (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
       <FormControl size="small" sx={{ minWidth: 150, m: 1 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={filters.sortBy}
          label="Ordenar por"
          onChange={handlers.handleSortChange as (event: SelectChangeEvent<any>) => void}
        >
          <MenuItem value="relevance">Relevancia</MenuItem>
          <MenuItem value="newest">Más Recientes</MenuItem>
          <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
          <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
          <MenuItem value="rating">Mejor Valorados</MenuItem>
          <MenuItem value="ayni_score">Mayor Ayni Score</MenuItem>
          <MenuItem value="consciousness">Nivel de Consciencia</MenuItem>
        </Select>
      </FormControl>
      <Tooltip title="Mostrar solo Emprendedores Confiables">
        <FormControlLabel
          control={<Switch checked={filters.verifiedOnly} onChange={handlers.handleVerifiedChange} />}
          label="Verificados"
          sx={{ mr: 1, m: 0.5 }}
        />
      </Tooltip>
    </Stack>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 4,
          borderRadius: '16px',
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          borderColor: theme.palette.divider,
        }}
      >
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            {/* Search and Advanced Filters */}
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              elevation={0}
              sx={{
                p: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                width: { xs: '100%', sm: 'auto'},
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: 'transparent',
              }}
            >
              <Search
                sx={{ color: 'text.secondary', mr: 1, fontSize: '1.25rem' }}
              />
              <InputBase
                name="search-query"
                sx={{ ml: 1, flex: 1, fontWeight: 500 }}
                placeholder="Busca en CoomÜnity..."
                inputProps={{ 'aria-label': 'buscar en coomünity' }}
                value={filters.query}
                onChange={handlers.handleQueryChange}
              />
            </Paper>
            <Stack direction="row" spacing={1} alignItems="center" width={{ xs: '100%', sm: 'auto' }}>
              <Tooltip title="Filtros Avanzados">
                <IconButton
                  onClick={onOpenAdvancedFilters}
                  aria-label="filtros avanzados"
                  sx={{
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    borderRadius: '12px',
                    p: '12px',
                    flexGrow: { xs: 1, sm: 0 }
                  }}
                >
                  <TuneOutlined />
                </IconButton>
              </Tooltip>
              {!isMobile && renderSortingControls()}
            </Stack>
          </Stack>

          {/* Category Filters */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}
            >
              Categorías Populares
            </Typography>
            {renderCategoryChips()}
          </Box>

          {isMobile && renderSortingControls()}
        </Stack>
      </Paper>
    </motion.div>
  );
};

export default MarketplaceFilterBar;
