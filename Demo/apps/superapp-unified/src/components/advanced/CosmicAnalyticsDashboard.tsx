import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  IconButton,
  Button,
  Chip,
  Stack,
  Tooltip,
  alpha,
  useTheme,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Refresh,
  Download,
  FullscreenExit,
  Fullscreen,
  ShowChart,
  Radar,
  Psychology,
  Star,
} from '@mui/icons-material';

import { COSMIC_ELEMENTS, CosmicElement } from '../ui/CosmicThemeSwitcher';
import { useReciprocidadIntelligence } from '../../hooks/useReciprocidadIntelligence';

// Tipos para Analytics Cósmicos
interface CosmicMetric {
  id: string;
  name: string;
  element: CosmicElement;
  value: number;
  trend: 'ascending' | 'stable' | 'descending';
  impact: 'local' | 'regional' | 'global' | 'cosmic';
  lastUpdated: Date;
  unit: string;
  description: string;
}

interface ElementalBalance {
  element: CosmicElement;
  current: number;
  optimal: number;
  growth: number;
  interactions: number;
}

interface CosmicInsight {
  id: string;
  type: 'achievement' | 'opportunity' | 'warning' | 'revelation';
  title: string;
  description: string;
  elements: CosmicElement[];
  priority: 'low' | 'medium' | 'high' | 'cosmic';
  actionable: boolean;
  timestamp: Date;
}

interface TimeSeriesData {
  timestamp: Date;
  values: Record<CosmicElement, number>;
  totalReciprocidad: number;
  bienComun: number;
}

interface CosmicAnalyticsDashboardProps {
  userId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  viewMode?: 'overview' | 'detailed' | 'realtime';
  onInsightAction?: (insightId: string, action: string) => void;
}

export const CosmicAnalyticsDashboard: React.FC<CosmicAnalyticsDashboardProps> = ({
  userId,
  timeRange = '30d',
  viewMode = 'overview',
  onInsightAction
}) => {
  const theme = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedView, setSelectedView] = useState(viewMode);
  const [selectedElement, setSelectedElement] = useState<CosmicElement | 'all'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refs para gráficos D3
  const radarChartRef = useRef<SVGSVGElement>(null);
  const flowChartRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<SVGSVGElement>(null);
  const networkRef = useRef<SVGSVGElement>(null);

  // Hook de inteligencia Reciprocidad
  const { data: reciprocidadData, recordAction } = useReciprocidadIntelligence(userId);

  // Mock data para analytics cósmicos
  const cosmicMetrics = useMemo((): CosmicMetric[] => [
    {
      id: 'reciprocidad_balance',
      name: 'Balance Reciprocidad',
      element: 'ether',
      value: reciprocidadData?.reciprocidadBalance?.overall || 85,
      trend: 'ascending',
      impact: 'cosmic',
      lastUpdated: new Date(),
      unit: '%',
      description: 'Equilibrio entre dar y recibir en todas las dimensiones'
    },
    {
      id: 'bien_comun_impact',
      name: 'Impacto Bien Común',
      element: 'tierra',
      value: 92,
      trend: 'ascending',
      impact: 'global',
      lastUpdated: new Date(),
      unit: 'puntos',
      description: 'Contribución al bienestar colectivo y planetario'
    },
    {
      id: 'wisdom_flow',
      name: 'Flujo de Sabiduría',
      element: 'aire',
      value: 78,
      trend: 'stable',
      impact: 'regional',
      lastUpdated: new Date(),
      unit: 'intercambios',
      description: 'Velocidad de transmisión de conocimiento en la red'
    },
    {
      id: 'creative_fire',
      name: 'Fuego Creativo',
      element: 'fuego',
      value: 88,
      trend: 'ascending',
      impact: 'local',
      lastUpdated: new Date(),
      unit: 'proyectos',
      description: 'Intensidad de la manifestación creativa'
    },
    {
      id: 'emotional_harmony',
      name: 'Armonía Emocional',
      element: 'agua',
      value: 73,
      trend: 'ascending',
      impact: 'regional',
      lastUpdated: new Date(),
      unit: 'conexiones',
      description: 'Calidad de las conexiones emocionales'
    }
  ], [reciprocidadData]);

  // Balance elemental
  const elementalBalance = useMemo((): ElementalBalance[] => {
    if (!reciprocidadData) {
      return Object.keys(COSMIC_ELEMENTS).map(element => ({
        element: element as CosmicElement,
        current: Math.floor(Math.random() * 100),
        optimal: 80,
        growth: Math.floor(Math.random() * 20) - 10,
        interactions: Math.floor(Math.random() * 50)
      }));
    }

    return Object.entries(reciprocidadData.reciprocidadBalance.elements).map(([element, value]) => ({
      element: element as CosmicElement,
      current: value,
      optimal: 80,
      growth: Math.floor(Math.random() * 20) - 10,
      interactions: Math.floor(Math.random() * 50)
    }));
  }, [reciprocidadData]);

  // Insights cósmicos
  const cosmicInsights = useMemo((): CosmicInsight[] => [
    {
      id: 'insight_1',
      type: 'achievement',
      title: '🌟 Maestría en Elemento Fuego',
      description: 'Has alcanzado el 88% de armonía con el elemento Fuego. Tu capacidad de manifestación está en su pico.',
      elements: ['fuego'],
      priority: 'high',
      actionable: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'insight_2',
      type: 'opportunity',
      title: '💫 Oportunidad de Balance Agua',
      description: 'Tu elemento Agua podría beneficiarse de más actividades de colaboración emocional.',
      elements: ['agua'],
      priority: 'medium',
      actionable: true,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 'insight_3',
      type: 'revelation',
      title: '🔮 Sincronía Cósmica Detectada',
      description: 'Tus ciclos de energía están perfectamente alineados con el ritmo lunar. Es momento de proyectos trascendentales.',
      elements: ['ether', 'tierra'],
      priority: 'cosmic',
      actionable: false,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ], []);

  // Time series data simulada
  const timeSeriesData = useMemo((): TimeSeriesData[] => {
    const days = selectedTimeRange === '7d' ? 7 :
                 selectedTimeRange === '30d' ? 30 :
                 selectedTimeRange === '90d' ? 90 : 365;

    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));

      return {
        timestamp: date,
        values: {
          fuego: 70 + Math.sin(i * 0.1) * 15 + Math.random() * 10,
          agua: 60 + Math.cos(i * 0.15) * 20 + Math.random() * 10,
          tierra: 80 + Math.sin(i * 0.08) * 10 + Math.random() * 10,
          aire: 75 + Math.cos(i * 0.12) * 18 + Math.random() * 10,
          ether: 85 + Math.sin(i * 0.05) * 12 + Math.random() * 10
        },
        totalReciprocidad: 70 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
        bienComun: 80 + Math.cos(i * 0.08) * 15 + Math.random() * 10
      };
    });
  }, [selectedTimeRange]);

  // Crear gráfico de radar para balance elemental
  useEffect(() => {
    if (radarChartRef.current && elementalBalance.length > 0) {
      const svg = radarChartRef.current;
      svg.innerHTML = ''; // Limpiar contenido anterior

      const width = 300;
      const height = 300;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 40;

      // Configurar SVG
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

      // Crear círculos concéntricos
      for (let i = 1; i <= 5; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', centerX.toString());
        circle.setAttribute('cy', centerY.toString());
        circle.setAttribute('r', (radius * i / 5).toString());
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', alpha(theme.palette.primary.main, 0.1));
        circle.setAttribute('stroke-width', '1');
        svg.appendChild(circle);
      }

      // Crear líneas radiales y polígono de datos
      const angleStep = (2 * Math.PI) / elementalBalance.length;
      const points: string[] = [];

      elementalBalance.forEach((balance, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const elementConfig = COSMIC_ELEMENTS[balance.element];

        // Línea radial
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX.toString());
        line.setAttribute('y1', centerY.toString());
        line.setAttribute('x2', (centerX + Math.cos(angle) * radius).toString());
        line.setAttribute('y2', (centerY + Math.sin(angle) * radius).toString());
        line.setAttribute('stroke', alpha(theme.palette.primary.main, 0.1));
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);

        // Punto de datos
        const value = balance.current / 100;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        points.push(`${x},${y}`);

        // Círculo del elemento
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', '8');
        circle.setAttribute('fill', elementConfig.color);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Label del elemento
        const labelX = centerX + Math.cos(angle) * (radius + 20);
        const labelY = centerY + Math.sin(angle) * (radius + 20);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX.toString());
        text.setAttribute('y', labelY.toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', elementConfig.color);
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = elementConfig.name;
        svg.appendChild(text);
      });

      // Polígono de datos
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', points.join(' '));
      polygon.setAttribute('fill', alpha(theme.palette.primary.main, 0.2));
      polygon.setAttribute('stroke', theme.palette.primary.main);
      polygon.setAttribute('stroke-width', '2');
      svg.appendChild(polygon);
    }
  }, [elementalBalance, theme]);

  // Manejar refresh de datos
  const handleRefresh = async () => {
    setRefreshing(true);
    recordAction({
      type: 'learning',
      module: 'uplay',
      value: 5,
      metadata: {
        resourceType: 'cosmic_analytics',
        skillCategory: 'data_analysis'
      }
    });

    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  // Manejar acción de insight
  const handleInsightAction = (insight: CosmicInsight, action: string) => {
    onInsightAction?.(insight.id, action);
    recordAction({
      type: 'learning',
      module: 'profile',
      value: 10,
      metadata: {
        resourceType: insight.type,
        skillCategory: insight.elements[0] || 'general'
      }
    });
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header con título y controles */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h2" sx={{
            color: theme.palette.primary.main,
            fontWeight: 700
          }}>
            Tu Cosmos de Transformación Consciente
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Métricas que nutren el alma: Balance Reciprocidad, Impacto al Bien Común, y la danza armónica de tus elementos internos
          </Typography>
        </Box>
        <Box>
          <IconButton
            onClick={handleFullscreenToggle}
            size="small"
            sx={{ mr: 1 }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton
            onClick={handleRefresh}
            size="small"
            disabled={refreshing}
            sx={{ mr: 1 }}
          >
            {refreshing ? <CircularProgress size={24} /> : <Refresh />}
          </IconButton>
          <IconButton size="small">
            <Download />
          </IconButton>
        </Box>
      </Box>

      {/* Tarjetas métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Índice de Equilibrio Reciprocidad */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              borderColor: alpha(theme.palette.primary.main, 0.2),
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mr: 2
                    }}
                  >
                    <Psychology />
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    🔵 Índice de Equilibrio Reciprocidad (IER)
                  </Typography>
                </Box>
                <Chip
                  label="100% - Reciprocidad en armonía perfecta"
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    fontWeight: 'bold'
                  }}
                />
              </Box>

              <Box sx={{ mt: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Índice Equilibrio Reciprocidad
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    100%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.primary.main
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Armonía Cósmica
                  </Typography>
                  <Chip
                    label="Activada"
                    size="small"
                    sx={{
                      mt: 0.5,
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="error.main" fontWeight="bold">
                    11.2184249628528%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Eficiencia Energética
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    +5.08%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Crecimiento Semanal
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Nivel de Consciencia */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              borderColor: alpha(theme.palette.warning.main, 0.2),
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    mr: 2
                  }}
                >
                  <Psychology />
                </Box>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  🔶 Nivel de Consciencia
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Evolución del Bien Común
              </Typography>

              {/* Aquí iría el componente visual de nivel de consciencia */}
              <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color={theme.palette.warning.main}>
                  Nivel 7
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Vector Bien Común */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              borderColor: alpha(theme.palette.secondary.main, 0.2),
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    mr: 2
                  }}
                >
                  <TrendingUp />
                </Box>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  🔮 Vector Bien Común (VBC)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                112 Puntos de Impacto
              </Typography>

              {/* Aquí iría el componente visual del vector */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    302 Méritos
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="secondary.main" fontWeight="bold">
                    99.7% Resonancia
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Galaxia Elemental */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              borderColor: alpha(theme.palette.info.main, 0.2),
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    mr: 2
                  }}
                >
                  <Radar />
                </Box>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  ⬛ Galaxia Elemental de tu Ser
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Equilibrio entre Fuego, Agua, Tierra y Aire
              </Typography>

              {/* Aquí iría el componente visual de la galaxia elemental */}
              <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight="bold" color={theme.palette.info.main}>
                  ⬛ Galaxia Elemental de tu Ser
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                  13.10083291369724%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Balance Cósmico
                </Typography>
                <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                  Armonía
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Recomendaciones de Equilibrio */}
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              borderColor: theme.palette.divider,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.warning.light, 0.2),
                    color: theme.palette.warning.main,
                    mr: 2
                  }}
                >
                  <Star />
                </Box>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  ⭐ Recomendaciones de Equilibrio
                </Typography>
              </Box>

              {/* Lista de recomendaciones */}
              <Box sx={{ mt: 2 }}>
                {/* Aquí irían las recomendaciones */}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Radar de Armonía */}
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              borderColor: theme.palette.divider,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.light, 0.2),
                    color: theme.palette.primary.main,
                    mr: 2
                  }}
                >
                  <Radar />
                </Box>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  🔷 Radar de Armonía Consciente
                </Typography>
              </Box>

              {/* Aquí iría el radar */}
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Visualización del radar de armonía
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CosmicAnalyticsDashboard;
