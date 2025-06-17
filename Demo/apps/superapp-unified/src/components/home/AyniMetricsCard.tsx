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

// Import our enhanced design system components
import { AyniCard } from '../ui';
import { 
  MetricsRelationships, 
  AdvancedElementalProgress,
  EnhancedLoadingState 
} from '../ui/enhanced';
import { useElementalBalance } from '../../hooks/home';
import { cn, elementColors } from '../../utils/styles';
import { safeToLocaleString } from '../../utils/numberUtils';

interface ElementStats {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface AyniMetricsProps {
  ondas: number;
  meritos: number;
  ayniLevel: string;
  nextLevel: string;
  ayniProgress: number;
  bienComunContributions: number;
  balanceAyni: number;
  elementos: ElementStats;
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

export const AyniMetricsCard: React.FC<AyniMetricsProps> = ({
  ondas,
  meritos,
  ayniLevel,
  nextLevel,
  ayniProgress,
  bienComunContributions,
  balanceAyni,
  elementos,
  isLoading = false,
  isConnected = true,
  onRefresh,
}) => {
  const [hoveredElement, setHoveredElement] = useState<keyof typeof elementConfig | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Convert elementos to the format expected by useElementalBalance
  const elementalData = {
    tierra: elementos.tierra,
    agua: elementos.agua,
    fuego: elementos.fuego,
    aire: elementos.aire,
  };

  const elementalBalance = useElementalBalance(elementalData, ondas, meritos);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  if (isLoading) {
    return (
      <AyniCard className="p-6">
        <EnhancedLoadingState 
          message="Calculando tu balance Ayni..." 
          showMessage={true}
        />
      </AyniCard>
    );
  }

  return (
    <AyniCard className="p-6 space-y-6 relative overflow-hidden">
      {/* Enhanced header with connection status */}
      <Box className="flex items-center justify-between">
        <Typography 
          variant="h5" 
          className="coomunity-h5 font-bold text-coomunity-800 flex items-center gap-2"
        >
          <AutoAwesome className="text-coomunity-600" />
          Tu Balance Ayni
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
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold text-gradient-coomunity",
                  "flex items-center justify-center hover-lift"
                )}
              >
                {safeToLocaleString(ondas)}
                <Box className="ml-2">
                  <AutoAwesome sx={{ fontSize: 28, color: '#6366f1' }} />
                </Box>
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-600 font-bold uppercase tracking-wider"
              >
                Öndas
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold text-gradient-coomunity",
                  "flex items-center justify-center hover-lift"
                )}
              >
                {safeToLocaleString(meritos)}
                <Box className="ml-2">
                  <EmojiEvents sx={{ fontSize: 28, color: '#f59e0b' }} />
                </Box>
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-600 font-bold uppercase tracking-wider"
              >
                Mëritos
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold text-gradient-coomunity",
                  "flex items-center justify-center hover-lift"
                )}
              >
                {safeToLocaleString(bienComunContributions)}
                <Box className="ml-2">
                  <Favorite sx={{ fontSize: 28, color: '#ef4444' }} />
                </Box>
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-600 font-bold uppercase tracking-wider"
              >
                Bien Común
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold",
                  balanceAyni >= 80 ? "text-green-600" : 
                  balanceAyni >= 60 ? "text-yellow-600" : "text-red-600",
                  "flex items-center justify-center hover-lift"
                )}
              >
                {safeToLocaleString(balanceAyni)}%
                <Box className="ml-2">
                  <Psychology sx={{ fontSize: 28 }} />
                </Box>
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-600 font-bold uppercase tracking-wider"
              >
                Balance Ayni
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Enhanced Ayni level progress */}
        <Box className="space-y-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="body1" 
              className="coomunity-body1 font-bold text-coomunity-800"
            >
              Nivel Ayni: {ayniLevel}
            </Typography>
            <Chip
              label={`Próximo: ${nextLevel}`}
              size="small"
              variant="outlined"
              className="font-medium hover-lift"
              icon={<TrendingUp />}
            />
          </Stack>
          <Box className="relative">
            <LinearProgress
              variant="determinate"
              value={ayniProgress}
              className={cn(
                "h-3 rounded-full bg-coomunity-100",
                "smooth-transition hover-lift"
              )}
              sx={{
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                  borderRadius: '9999px',
                },
              }}
            />
            <Typography
              variant="caption"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-xs"
            >
              {safeToLocaleString(ayniProgress)}%
            </Typography>
          </Box>
        </Box>

        {/* Enhanced elemental balance section */}
        <Box className="space-y-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Typography 
            variant="h6" 
            className="coomunity-h6 font-bold text-coomunity-800 text-center"
          >
            Balance Elemental
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            {(Object.keys(elementConfig) as Array<keyof typeof elementConfig>).map((element) => (
              <Grid size={{ xs: 3 }} key={element}>
                <EnhancedElementIcon
                  element={element}
                  value={elementos[element]}
                  isHovered={hoveredElement === element}
                  onHover={setHoveredElement}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Enhanced metrics relationships */}
        <Box className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <MetricsRelationships
            ondas={ondas}
            meritos={meritos}
            ayniBalance={balanceAyni / 100}
            className="hover-lift"
          />
        </Box>

        {/* Enhanced balance insights */}
        {elementalBalance.recommendations && elementalBalance.recommendations.length > 0 && (
          <Box 
            className={cn(
              "p-4 rounded-xl border-l-4 animate-fade-in",
              "bg-gradient-subtle hover-lift smooth-transition"
            )}
            style={{ 
              borderLeftColor: elementConfig[elementalBalance.dominantElement].color,
              animationDelay: '0.8s'
            }}
          >
            <Typography 
              variant="body2" 
              className="coomunity-body-sm font-medium text-coomunity-700 mb-2"
            >
              💡 Insight Elemental
            </Typography>
            <Typography 
              variant="body2" 
              className="coomunity-body-sm text-coomunity-600"
            >
              {elementalBalance.recommendations[0]}
            </Typography>
          </Box>
        )}
      </Box>
    </AyniCard>
  );
};
