import React, { useState, useMemo, useCallback } from 'react';
import {
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Tooltip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Divider,
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
  ExpandMore,
  ExpandLess,
  Balance,
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

// Memoized component for better performance
const EnhancedElementIcon: React.FC<{
  element: keyof typeof elementConfig;
  value: number;
  isHovered: boolean;
  onHover: (element: keyof typeof elementConfig | null) => void;
}> = React.memo(({ element, value, isHovered, onHover }) => {
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
          size="sm"
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
});

EnhancedElementIcon.displayName = 'EnhancedElementIcon';

// Main balance display component
const MainBalanceDisplay: React.FC<{
  balanceAyni: number;
  ayniLevel: string;
  nextLevel: string;
  ayniProgress: number;
}> = React.memo(({ balanceAyni, ayniLevel, nextLevel, ayniProgress }) => {
  const getBalanceColor = useMemo(() => {
    if (balanceAyni >= 80) return 'text-green-600';
    if (balanceAyni >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }, [balanceAyni]);

  const getBalanceMessage = useMemo(() => {
    if (balanceAyni >= 90) return 'Excelente equilibrio Ayni';
    if (balanceAyni >= 80) return 'Muy buen balance';
    if (balanceAyni >= 60) return 'Balance moderado';
    if (balanceAyni >= 40) return 'Necesita atención';
    return 'Requiere enfoque urgente';
  }, [balanceAyni]);

  const getBalanceGradient = useMemo(() => {
    if (balanceAyni >= 80) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (balanceAyni >= 60) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  }, [balanceAyni]);

  return (
    <Card 
      className="relative overflow-hidden"
      sx={{
        background: getBalanceGradient,
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <CardContent className="relative z-10">
        <Stack spacing={3}>
          {/* Main balance number */}
          <Box className="text-center">
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Balance sx={{ fontSize: 40, opacity: 0.9 }} />
              <Typography
                variant="h1"
                className="font-bold"
                sx={{ fontSize: { xs: '3rem', sm: '4rem' } }}
              >
                {safeToLocaleString(balanceAyni)}%
              </Typography>
            </Stack>
            <Typography 
              variant="h6" 
              className="font-medium opacity-90"
            >
              Balance Ayni Principal
            </Typography>
            <Typography 
              variant="body2" 
              className="opacity-80 mt-1"
            >
              {getBalanceMessage}
            </Typography>
          </Box>

          {/* Level progress */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-2">
              <Typography variant="body1" className="font-bold">
                {ayniLevel}
              </Typography>
              <Chip
                label={`→ ${nextLevel}`}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
                icon={<TrendingUp sx={{ color: 'white !important' }} />}
              />
            </Stack>
            <Box className="relative">
              <LinearProgress
                variant="determinate"
                value={ayniProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                    borderRadius: 4,
                  },
                }}
              />
              <Typography
                variant="caption"
                className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-xs"
                sx={{ color: 'rgba(0, 0, 0, 0.7)' }}
              >
                {safeToLocaleString(ayniProgress)}%
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
});

MainBalanceDisplay.displayName = 'MainBalanceDisplay';

// Compact metrics display
const CompactMetrics: React.FC<{
  ondas: number;
  meritos: number;
  bienComunContributions: number;
}> = React.memo(({ ondas, meritos, bienComunContributions }) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 4 }}>
      <Box className="text-center p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-md transition-all">
        <AutoAwesome sx={{ fontSize: 24, color: '#6366f1', mb: 1 }} />
        <Typography variant="h6" className="font-bold text-coomunity-800">
          {safeToLocaleString(ondas)}
        </Typography>
        <Typography variant="caption" className="text-coomunity-600 font-medium">
          Öndas
        </Typography>
      </Box>
    </Grid>
    <Grid size={{ xs: 4 }}>
      <Box className="text-center p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md transition-all">
        <EmojiEvents sx={{ fontSize: 24, color: '#f59e0b', mb: 1 }} />
        <Typography variant="h6" className="font-bold text-coomunity-800">
          {safeToLocaleString(meritos)}
        </Typography>
        <Typography variant="caption" className="text-coomunity-600 font-medium">
          Mëritos
        </Typography>
      </Box>
    </Grid>
    <Grid size={{ xs: 4 }}>
      <Box className="text-center p-3 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-md transition-all">
        <Favorite sx={{ fontSize: 24, color: '#ef4444', mb: 1 }} />
        <Typography variant="h6" className="font-bold text-coomunity-800">
          {safeToLocaleString(bienComunContributions)}
        </Typography>
        <Typography variant="caption" className="text-coomunity-600 font-medium">
          Bien Común
        </Typography>
      </Box>
    </Grid>
  </Grid>
));

CompactMetrics.displayName = 'CompactMetrics';

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
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Memoized elemental data conversion
  const elementalData = useMemo(() => ({
    tierra: elementos.tierra,
    agua: elementos.agua,
    fuego: elementos.fuego,
    aire: elementos.aire,
  }), [elementos]);

  const elementalBalance = useElementalBalance(elementalData, ondas, meritos);

  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [onRefresh, isRefreshing]);

  const toggleDetailedView = useCallback(() => {
    setShowDetailedView(prev => !prev);
  }, []);

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
      {/* Optimized header */}
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
          
          <Tooltip title="Ver detalles">
            <IconButton
              onClick={toggleDetailedView}
              size="small"
              className="transition-all duration-300"
            >
              {showDetailedView ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
          
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

      {/* Main balance display - Always visible */}
      <MainBalanceDisplay
        balanceAyni={balanceAyni}
        ayniLevel={ayniLevel}
        nextLevel={nextLevel}
        ayniProgress={ayniProgress}
      />

      {/* Compact metrics - Always visible */}
      <CompactMetrics
        ondas={ondas}
        meritos={meritos}
        bienComunContributions={bienComunContributions}
      />

      {/* Detailed view - Collapsible */}
      <Collapse in={showDetailedView}>
        <Box className="space-y-6 pt-4">
          <Divider />
          
          {/* Enhanced elemental balance section */}
          <Box className="space-y-4">
            <Typography 
              variant="h6" 
              className="coomunity-h6 font-bold text-coomunity-800 text-center"
            >
              Balance Elemental Detallado
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
          <MetricsRelationships
            ondas={ondas}
            meritos={meritos}
            ayniBalance={balanceAyni / 100}
            className="hover-lift"
          />

          {/* Enhanced balance insights */}
          {elementalBalance.recommendations && elementalBalance.recommendations.length > 0 && (
            <Box 
              className={cn(
                "p-4 rounded-xl border-l-4",
                "bg-gradient-subtle hover-lift smooth-transition"
              )}
              style={{ 
                borderLeftColor: elementConfig[elementalBalance.dominantElement].color,
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
      </Collapse>
    </AyniCard>
  );
};
