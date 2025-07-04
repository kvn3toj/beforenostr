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
  Zoom,
  Grow,
  Slide,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Insights,
  AutoAwesome,
  FilterList,
  Refresh,
  Download,
  FullscreenExit,
  Fullscreen,
  PieChart,
  ShowChart,
  BarChart,
  ScatterPlot,
  Radar,
  Hexagon,
  Psychology,
  Groups,
  EmojiEvents,
  Favorite,
  Star,
  WbSunny,
  Water,
  Terrain,
  Air,
  FlightTakeoff,
} from '@mui/icons-material';

import { COSMIC_ELEMENTS, CosmicElement } from '../ui/CosmicThemeSwitcher';
import { useAyniIntelligence } from '../../hooks/useAyniIntelligence';

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
  totalAyni: number;
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

  // Hook de inteligencia Ayni
  const { data: ayniData, recordAction } = useAyniIntelligence(userId);

  // Mock data para analytics cósmicos
  const cosmicMetrics = useMemo((): CosmicMetric[] => [
    {
      id: 'ayni_balance',
      name: 'Balance Ayni',
      element: 'ether',
      value: ayniData?.ayniBalance?.overall || 85,
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
  ], [ayniData]);

  // Balance elemental
  const elementalBalance = useMemo((): ElementalBalance[] => {
    if (!ayniData) {
      return Object.keys(COSMIC_ELEMENTS).map(element => ({
        element: element as CosmicElement,
        current: Math.floor(Math.random() * 100),
        optimal: 80,
        growth: Math.floor(Math.random() * 20) - 10,
        interactions: Math.floor(Math.random() * 50)
      }));
    }

    return Object.entries(ayniData.ayniBalance.elements).map(([element, value]) => ({
      element: element as CosmicElement,
      current: value,
      optimal: 80,
      growth: Math.floor(Math.random() * 20) - 10,
      interactions: Math.floor(Math.random() * 50)
    }));
  }, [ayniData]);

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
        totalAyni: 70 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
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

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              📊 Analytics Cósmicos
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Visualiza tu evolución multidimensional en tiempo real
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Selector de rango temporal */}
            <ToggleButtonGroup
              size="small"
              value={selectedTimeRange}
              exclusive
              onChange={(_, value) => value && setSelectedTimeRange(value)}
            >
              <ToggleButton value="7d">7D</ToggleButton>
              <ToggleButton value="30d">30D</ToggleButton>
              <ToggleButton value="90d">90D</ToggleButton>
              <ToggleButton value="1y">1A</ToggleButton>
            </ToggleButtonGroup>
            
            {/* Controles */}
            <Tooltip title="Actualizar datos">
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{ 
                  background: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                {refreshing ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isFullscreen ? "Salir pantalla completa" : "Pantalla completa"}>
              <IconButton 
                onClick={() => setIsFullscreen(!isFullscreen)}
                sx={{ 
                  background: alpha(theme.palette.secondary.main, 0.1),
                  '&:hover': { background: alpha(theme.palette.secondary.main, 0.2) }
                }}
              >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Métricas principales */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              🌌 Métricas Cósmicas Principales
            </Typography>
            <Grid container spacing={3}>
              {cosmicMetrics.map((metric) => {
                const elementConfig = COSMIC_ELEMENTS[metric.element];
                const IconComponent = elementConfig.icon;
                
                return (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={metric.id}>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: elementConfig.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1
                        }}
                      >
                        <IconComponent />
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {metric.value}
                        <Typography component="span" variant="caption" ml={0.5}>
                          {metric.unit}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {metric.name}
                      </Typography>
                      <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} mt={0.5}>
                        <TrendingUp 
                          sx={{ 
                            fontSize: 16, 
                            color: metric.trend === 'ascending' ? '#4CAF50' : 
                                   metric.trend === 'stable' ? '#FF9800' : '#F44336' 
                          }} 
                        />
                        <Chip
                          label={metric.impact}
                          size="small"
                          sx={{
                            fontSize: '0.6rem',
                            height: 20,
                            background: alpha('white', 0.2),
                            color: 'white'
                          }}
                        />
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        </Grid>

        {/* Gráfico de radar - Balance elemental */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Radar color="primary" />
              Balance Elemental Actual
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <svg ref={radarChartRef} />
            </Box>
          </Card>
        </Grid>

        {/* Insights cósmicos */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Psychology color="primary" />
              Insights Cósmicos Recientes
            </Typography>
            <Box sx={{ maxHeight: 320, overflowY: 'auto', pr: 1 }}>
              <Stack spacing={2}>
                {cosmicInsights.map((insight) => {
                  const priorityColor = insight.priority === 'cosmic' ? '#E1BEE7' :
                                       insight.priority === 'high' ? '#F44336' :
                                       insight.priority === 'medium' ? '#FF9800' : '#4CAF50';
                  const typeIcon = insight.type === 'achievement' ? '🏆' :
                                  insight.type === 'opportunity' ? '💫' :
                                  insight.type === 'warning' ? '⚠️' : '🔮';

                  return (
                    <Fade key={insight.id} in={true}>
                      <Card
                        sx={{
                          p: 2,
                          background: alpha(priorityColor, 0.05),
                          border: `1px solid ${alpha(priorityColor, 0.2)}`,
                          position: 'relative'
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: alpha(priorityColor, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem'
                            }}
                          >
                            {typeIcon}
                          </Box>
                          <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              {insight.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {insight.description}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                              {insight.elements.map(element => (
                                <Chip
                                  key={element}
                                  label={COSMIC_ELEMENTS[element].name}
                                  size="small"
                                  sx={{
                                    background: alpha(COSMIC_ELEMENTS[element].color, 0.1),
                                    color: COSMIC_ELEMENTS[element].color,
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                              <Typography variant="caption" color="text.secondary">
                                {insight.timestamp.toLocaleTimeString()}
                              </Typography>
                            </Stack>
                            {insight.actionable && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleInsightAction(insight, 'explore')}
                                sx={{ mt: 1, borderColor: priorityColor, color: priorityColor }}
                              >
                                🚀 Explorar
                              </Button>
                            )}
                          </Box>
                        </Stack>
                      </Card>
                    </Fade>
                  );
                })}
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Flujo de energía entre elementos */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <ShowChart color="primary" />
              Flujo de Energía Interdimensional
            </Typography>
            <Box sx={{ height: 300, background: alpha(theme.palette.primary.main, 0.02), borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg ref={flowChartRef} width="100%" height="280" />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Visualización D3.js del flujo energético entre elementos cósmicos
                <br />
                <em>Implementación avanzada en desarrollo...</em>
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Timeline de evolución */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Timeline color="primary" />
              Evolución Temporal de Balance Ayni
            </Typography>
            <Box sx={{ height: 200 }}>
              {timeSeriesData.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Últimos {selectedTimeRange} - Tendencia general: 
                    <Chip 
                      label="Crecimiento Exponencial" 
                      size="small" 
                      color="success" 
                      sx={{ ml: 1 }} 
                    />
                  </Typography>
                  {Object.entries(COSMIC_ELEMENTS).map(([key, element]) => {
                    const elementKey = key as CosmicElement;
                    const latestValue = timeSeriesData[timeSeriesData.length - 1]?.values[elementKey] || 0;
                    
                    return (
                      <Box key={elementKey} mb={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {element.name}
                          </Typography>
                          <Typography variant="caption" fontWeight="bold" sx={{ color: element.color }}>
                            {Math.round(latestValue)}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={latestValue}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              background: element.gradient
                            }
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CosmicAnalyticsDashboard;