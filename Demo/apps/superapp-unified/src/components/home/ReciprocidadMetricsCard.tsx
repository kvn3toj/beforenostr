import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  AutoAwesome,
  EmojiEvents,
  Favorite,
  Psychology,
  LocalFireDepartment,
  Waves,
  Park,
  Air,
  Refresh,
  TrendingUp,
  WifiOff,
} from '@mui/icons-material';

import { ReciprocidadCard } from '../ui';
import {
  MetricsRelationships,
  AdvancedElementalProgress,
  EnhancedLoadingState
} from '../ui/enhanced';
import { useElementalBalance } from '../../hooks/home';
import { cn, elementColors } from '../../utils/styles';
import { safeToLocaleString } from '../../utils/numberUtils';
import { ReciprocidadMetricsUI } from '../../hooks/home/useReciprocidadMetrics';

interface ReciprocidadMetricsCardProps {
  metrics: ReciprocidadMetricsUI;
  isLoading?: boolean;
  isConnected?: boolean;
  onRefresh?: () => void;
}

// Enhanced element configuration with CoomÜnity philosophy
const elementConfig = {
  fuego: {
    name: 'Fuego',
    icon: <LocalFireDepartment />,
    color: elementColors.fuego.primary,
    description: 'Pasión y acción transformadora',
    keywords: ['Creatividad', 'Liderazgo', 'Innovación'],
  },
  agua: {
    name: 'Agua',
    icon: <Waves />,
    color: elementColors.agua.primary,
    description: 'Fluir y adaptabilidad consciente',
    keywords: ['Empatía', 'Colaboración', 'Flexibilidad'],
  },
  tierra: {
    name: 'Tierra',
    icon: <Park />,
    color: elementColors.tierra.primary,
    description: 'Estabilidad y confianza sólida',
    keywords: ['Responsabilidad', 'Perseverancia', 'Fundamentos'],
  },
  aire: {
    name: 'Aire',
    icon: <Air />,
    color: elementColors.aire.primary,
    description: 'Comunicación e ideas elevadas',
    keywords: ['Visión', 'Comunicación', 'Inspiración'],
  },
};

const EnhancedElementIcon: React.FC<{
  element: keyof typeof elementConfig;
  value: number;
  isHovered: boolean;
  onHover: (element: keyof typeof elementConfig | null) => void;
}> = ({ element, value, isHovered, onHover }) => { // eslint-disable-line no-unused-vars
  const elementData = elementConfig[element];

  return (
    <Tooltip
      title={
        <Box className="p-2">
          <Typography variant="subtitle2" className="font-bold mb-1">
            {elementData.name} - {value}%
          </Typography>
          <Typography variant="caption" className="block mb-2">
            {elementData.description}
          </Typography>
          <Box className="flex flex-wrap gap-1">
            {elementData.keywords.map((keyword) => (
              <Chip
                key={keyword}
                label={keyword}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
          </Box>
        </Box>
      }
      arrow
      placement="top"
    >
      <Box
        className="text-center relative cursor-pointer"
        onMouseEnter={() => onHover(element)}
        onMouseLeave={() => onHover(null)}
      >
        <AdvancedElementalProgress
          element={element}
          progress={value}
          size="md"
          animated={true}
          glowEffect={isHovered}
          showLabel={false}
          className={cn(
            "transition-all duration-300",
            isHovered && "scale-110"
          )}
        />
        <Typography
          variant="caption"
          className={cn(
            "coomunity-caption font-bold capitalize block mb-1 transition-colors",
            isHovered ? "text-coomunity-700" : "text-coomunity-600"
          )}
        >
          {elementData.name}
        </Typography>
        <Typography
          variant="caption"
          className={cn(
            "coomunity-caption transition-colors",
            isHovered ? "text-coomunity-600" : "text-coomunity-500"
          )}
        >
          {value}%
        </Typography>
      </Box>
    </Tooltip>
  );
};

export const ReciprocidadMetricsCard: React.FC<ReciprocidadMetricsCardProps> = ({
  metrics,
  isLoading = false,
  isConnected = true,
  onRefresh,
}) => {
  const [hoveredElement, setHoveredElement] = useState<keyof typeof elementConfig | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Convert elementos to the format expected by useElementalBalance
  const elementalBalance = useElementalBalance(metrics.elementos, metrics.metricas.ondas, metrics.metricas.meritos);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  if (isLoading) {
    return (
      <ReciprocidadCard className="p-6">
        <EnhancedLoadingState
          message="Calculando tu balance de Reciprocidad..."
          showMessage={true}
        />
      </ReciprocidadCard>
    );
  }

  return (
    <ReciprocidadCard className="p-6 space-y-6 relative overflow-hidden">
      {/* Enhanced header with connection status */}
      <Box className="flex items-center justify-between">
        <Typography
          variant="h5"
          className="coomunity-h5 font-bold text-coomunity-800 flex items-center gap-2"
        >
          <AutoAwesome className="text-coomunity-600" />
          Tu Balance de Reciprocidad
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {!isConnected && (
            <Tooltip title="Sin conexión - Datos locales">
              <WifiOff className="text-orange-500" fontSize="small" />
            </Tooltip>
          )}

          <Tooltip title="Actualizar métricas">
            <IconButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="small"
              className={cn(
                "transition-all duration-300",
                isRefreshing && "animate-spin"
              )}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Enhanced metrics grid */}
      <Box className="space-y-6">
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Typography
                variant="h3"
                className="font-bold"
                sx={{ color: elementColors.fuego.primary }}
              >
                {safeToLocaleString(metrics.metricas.ondas)}
              </Typography>
              <Typography variant="body2" className="text-coomunity-600">
                Öndas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Typography
                variant="h3"
                className="font-bold"
                sx={{ color: elementColors.tierra.primary }}
              >
                {safeToLocaleString(metrics.metricas.meritos)}
              </Typography>
              <Typography variant="body2" className="text-coomunity-600">
                Mëritos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Typography
                variant="h3"
                className="font-bold"
                sx={{ color: elementColors.agua.primary }}
              >
                {safeToLocaleString(metrics.metricas.contribucionesBienComun)}
              </Typography>
              <Typography variant="body2" className="text-coomunity-600">
                Al Bien Común
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Typography
                variant="h3"
                className="font-bold"
                sx={{ color: elementColors.aire.primary }}
              >
                {Math.round(metrics.metricas.balance * 100)}%
              </Typography>
              <Typography variant="body2" className="text-coomunity-600">
                Balance Dar/Recibir
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Level and Progress */}
        <Box className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="body2" className="font-bold text-coomunity-700">
              Nivel: {metrics.nivel.actual}
            </Typography>
            <Typography variant="body2" className="text-coomunity-600">
              Siguiente: {metrics.nivel.siguiente}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={metrics.nivel.progreso}
            sx={{
              height: 10,
              borderRadius: 5,
              [`& .MuiLinearProgress-bar`]: {
                background: `linear-gradient(90deg, ${elementColors.fuego.primary} 0%, ${elementColors.agua.primary} 100%)`,
              },
            }}
          />
        </Box>

        {/* Elemental Balance */}
        <Box className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Typography
            variant="h6"
            className="coomunity-h6 font-bold text-coomunity-700 text-center mb-4"
          >
            Balance Elemental
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {Object.keys(metrics.elementos).map((el) => {
              const elementKey = el as keyof typeof elementConfig;
              return (
                <Grid item key={elementKey} xs={6} sm={3}>
                  <EnhancedElementIcon
                    element={elementKey}
                    value={metrics.elementos[elementKey]}
                    isHovered={hoveredElement === elementKey}
                    onHover={setHoveredElement}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Relaciones de Métricas */}
        <MetricsRelationships
          reciprocidadBalance={metrics.metricas.balance}
          bienComun={metrics.metricas.contribucionesBienComun}
          ondas={metrics.metricas.ondas}
          meritos={metrics.metricas.meritos}
          elementalPicture={elementalBalance.picture}
          className="animate-fade-in"
          style={{ animationDelay: '0.7s' }}
        />
      </Box>
    </ReciprocidadCard>
  );
};
