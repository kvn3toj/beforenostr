import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  Button,
  LinearProgress,
  Paper,
  Fade,
} from '@mui/material';
import {
  FilterList,
  Clear,
  TrendingDown,
  Lightbulb,
  CheckCircle,
} from '@mui/icons-material';
import { UseMarketplaceFiltersReturn } from '../../../../hooks/useMarketplaceFilters';

interface FilterStatsProps {
  filtersData: UseMarketplaceFiltersReturn;
  isLoading?: boolean;
}

const FilterStats: React.FC<FilterStatsProps> = ({
  filtersData,
  isLoading = false,
}) => {
  const {
    filterStats,
    hasActiveFilters,
    clearFilters,
    getFilterSuggestions,
    activeFilters,
  } = filtersData;

  const suggestions = getFilterSuggestions();

  if (isLoading) {
    return (
      <Box sx={{ mb: 2 }}>
        <LinearProgress sx={{ borderRadius: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Aplicando filtros...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={300}>
      <Box sx={{ mb: 3 }}>
        {/* Estadísticas principales */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            background: hasActiveFilters
              ? 'linear-gradient(135deg, rgba(116, 0, 86, 0.05) 0%, rgba(166, 77, 121, 0.03) 100%)'
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: hasActiveFilters
              ? '1px solid rgba(116, 0, 86, 0.1)'
              : '1px solid #e0e0e0',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList
                sx={{
                  color: hasActiveFilters ? 'primary.main' : 'text.secondary',
                  fontSize: 20,
                }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                Resultados de búsqueda
              </Typography>
            </Box>

            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<Clear />}
                onClick={clearFilters}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(116, 0, 86, 0.1)',
                  },
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {filterStats.filtered.toLocaleString()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filterStats.filtered === 1
                ? 'producto encontrado'
                : 'productos encontrados'}
            </Typography>
          </Box>

          {hasActiveFilters && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={filterStats.percentage}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #740056, #a64d79)',
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ ml: 1, minWidth: 40 }}>
                  {filterStats.percentage}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Mostrando {filterStats.filtered} de {filterStats.total}{' '}
                productos disponibles
                {filterStats.hidden > 0 && (
                  <> • {filterStats.hidden} productos ocultos por filtros</>
                )}
              </Typography>
            </Box>
          )}

          {/* Filtros activos */}
          {hasActiveFilters && (
            <Box>
              <Typography
                variant="caption"
                fontWeight="medium"
                sx={{ mb: 1, display: 'block' }}
              >
                Filtros activos:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {activeFilters.category && (
                  <Chip
                    label={`Categoría: ${activeFilters.category}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {activeFilters.location && (
                  <Chip
                    label={`📍 ${activeFilters.location}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {activeFilters.rating > 0 && (
                  <Chip
                    label={`⭐ ${activeFilters.rating}+ estrellas`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {activeFilters.priceRange[0] > 0 ||
                  (activeFilters.priceRange[1] < 1000 && (
                    <Chip
                      label={`💰 ü${activeFilters.priceRange[0]} - ü${activeFilters.priceRange[1]}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                {activeFilters.isVerifiedSeller && (
                  <Chip
                    label="✓ Vendedores verificados"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {activeFilters.isFeatured && (
                  <Chip
                    label="⭐ Destacados"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {activeFilters.isTrending && (
                  <Chip
                    label="📈 En tendencia"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {activeFilters.hasDiscount && (
                  <Chip
                    label="🏷️ Con descuento"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {activeFilters.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Sin resultados */}
        {filterStats.filtered === 0 && (
          <Alert
            severity="info"
            icon={<TrendingDown />}
            sx={{
              mb: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: 'info.main',
              },
            }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>
              No se encontraron productos
            </AlertTitle>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Tu búsqueda no arrojó resultados. Intenta ajustar los filtros para
              encontrar lo que buscas.
            </Typography>

            {suggestions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Lightbulb
                    sx={{ fontSize: 16, mr: 0.5, color: 'info.main' }}
                  />
                  <Typography variant="caption" fontWeight="medium">
                    Sugerencias:
                  </Typography>
                </Box>
                <Box sx={{ pl: 2 }}>
                  {suggestions.map((suggestion, index) => (
                    <Typography
                      key={index}
                      variant="caption"
                      sx={{ display: 'block' }}
                    >
                      • {suggestion}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Alert>
        )}

        {/* Pocos resultados */}
        {filterStats.filtered > 0 &&
          filterStats.filtered < 5 &&
          hasActiveFilters && (
            <Alert
              severity="warning"
              icon={<Lightbulb />}
              sx={{
                mb: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.2)',
              }}
            >
              <AlertTitle sx={{ fontWeight: 'bold' }}>
                Pocos resultados encontrados
              </AlertTitle>
              <Typography variant="body2">
                Solo {filterStats.filtered} productos coinciden con tus filtros.
                Considera ampliar los criterios de búsqueda para ver más
                opciones.
              </Typography>
            </Alert>
          )}

        {/* Muchos resultados */}
        {filterStats.filtered > 50 && !hasActiveFilters && (
          <Alert
            severity="success"
            icon={<CheckCircle />}
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>
              ¡Muchas opciones disponibles!
            </AlertTitle>
            <Typography variant="body2">
              Encontramos {filterStats.filtered} productos para ti. Usa los
              filtros para refinar tu búsqueda y encontrar exactamente lo que
              necesitas.
            </Typography>
          </Alert>
        )}
      </Box>
    </Fade>
  );
};

export default FilterStats;
