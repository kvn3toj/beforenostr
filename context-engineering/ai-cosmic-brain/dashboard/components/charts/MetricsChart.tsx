import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  FullscreenOutlined as FullscreenIcon,
  DownloadOutlined as DownloadIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint, ChartType, MetricsChartProps } from '../../types';
import {
  getHealthScoreColor,
  formatScoreAsPercentage,
} from '../../utils/dashboardHelpers';

/**
 * 📊 MetricsChart - Componente de Gráficos Interactivos
 *
 * Componente versátil para visualizar métricas del AI Cosmic Brain
 * con diferentes tipos de gráficos. Implementa principios de código
 * mantenible y "Naming as a Process" para máxima claridad.
 *
 * Características principales:
 * - Múltiples tipos de gráficos (línea, área, barra, pie, radar)
 * - Interactividad y tooltips informativos
 * - Colores temáticos basados en filosofía CoomÜnity
 * - Responsive design para diferentes dispositivos
 * - Exportación de datos
 * - Modo pantalla completa
 *
 * Filosofía integrada:
 * - Bien Común: Visualización clara que beneficia a todo el equipo
 * - Neguentropía: Orden visual que facilita la comprensión
 * - Ayni: Balance entre información y simplicidad visual
 */

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  chartType: ChartType;
}

/**
 * 🎯 Componente Principal de Gráficos de Métricas
 */
export const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  chartType,
  colors,
  title,
  description,
  height = 300,
  showLegend = true,
}) => {
  // ============================================================================
  // 🎨 Computed Values para configuración de gráficos
  // ============================================================================

  const chartColors = useMemo(() => {
    if (colors && colors.length > 0) return colors;

    // Colores por defecto basados en filosofía CoomÜnity
    return [
      '#9c27b0', // Púrpura - Philosophy
      '#2196f3', // Azul - Architecture
      '#ff5722', // Naranja rojizo - UX
      '#4caf50', // Verde - Performance
      '#ff9800', // Naranja - Warning
      '#f44336', // Rojo - Critical
      '#795548', // Marrón - Neutral
      '#607d8b', // Azul gris - Secondary
    ];
  }, [colors]);

  const processedChartData = useMemo(() => {
    return data.map((point, index) => ({
      ...point,
      // Asegurar que tenemos un color para cada punto
      color: point.color || chartColors[index % chartColors.length],
      // Formatear valor para display
      displayValue:
        typeof point.value === 'number'
          ? formatScoreAsPercentage(point.value, 1)
          : point.value,
      // Agregar índice para referencia
      index,
    }));
  }, [data, chartColors]);

  const maxValue = useMemo(() => {
    return Math.max(...data.map((point) => point.value));
  }, [data]);

  const averageValue = useMemo(() => {
    const sum = data.reduce((acc, point) => acc + point.value, 0);
    return data.length > 0 ? sum / data.length : 0;
  }, [data]);

  // ============================================================================
  // 🎯 Event Handlers con nombres que describen la acción
  // ============================================================================

  const handleFullscreenToggle = useCallback(() => {
    // TODO: Implementar modo pantalla completa
    console.log('Toggling fullscreen for chart:', title);
  }, [title]);

  const handleExportChart = useCallback(() => {
    // TODO: Implementar exportación de gráfico
    console.log('Exporting chart data:', title, data);
  }, [title, data]);

  const handleShowInfo = useCallback(() => {
    // TODO: Mostrar información detallada del gráfico
    console.log('Showing chart info:', title, description);
  }, [title, description]);

  // ============================================================================
  // 🎨 Custom Components para mejor UX
  // ============================================================================

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
    chartType,
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0];

    return (
      <Card elevation={3} sx={{ p: 1, maxWidth: 250 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {label || data.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Valor: {formatScoreAsPercentage(data.value)}
        </Typography>
        {chartType === 'radar' && (
          <Typography variant="caption" color="textSecondary">
            Métrica de guardian especializado
          </Typography>
        )}
      </Card>
    );
  };

  const renderChartHeader = () => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      mb={2}
    >
      <Box>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {description}
          </Typography>
        )}
        <Box display="flex" gap={2}>
          <Typography variant="caption" color="textSecondary">
            Promedio: {formatScoreAsPercentage(averageValue)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Máximo: {formatScoreAsPercentage(maxValue)}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" gap={1}>
        <Tooltip title="Información del gráfico">
          <IconButton size="small" onClick={handleShowInfo}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Exportar datos">
          <IconButton size="small" onClick={handleExportChart}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Pantalla completa">
          <IconButton size="small" onClick={handleFullscreenToggle}>
            <FullscreenIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  // ============================================================================
  // 📊 Chart Rendering Functions por tipo
  // ============================================================================

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={processedChartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={[0, 1]}
          tickFormatter={(value) => formatScoreAsPercentage(value)}
        />
        <RechartsTooltip content={<CustomTooltip chartType="line" />} />
        {showLegend && <Legend />}
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartColors[0]}
          strokeWidth={3}
          dot={{ fill: chartColors[0], strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: chartColors[0], strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={processedChartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={[0, 1]}
          tickFormatter={(value) => formatScoreAsPercentage(value)}
        />
        <RechartsTooltip content={<CustomTooltip chartType="area" />} />
        {showLegend && <Legend />}
        <Area
          type="monotone"
          dataKey="value"
          stroke={chartColors[0]}
          strokeWidth={2}
          fill={chartColors[0]}
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={processedChartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={[0, 1]}
          tickFormatter={(value) => formatScoreAsPercentage(value)}
        />
        <RechartsTooltip content={<CustomTooltip chartType="bar" />} />
        {showLegend && <Legend />}
        <Bar dataKey="value" fill={chartColors[0]} radius={[4, 4, 0, 0]}>
          {processedChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || chartColors[index % chartColors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={processedChartData}
          cx="50%"
          cy="50%"
          outerRadius={Math.min(height * 0.35, 120)}
          fill="#8884d8"
          dataKey="value"
          label={({ label, value }) =>
            `${label}: ${formatScoreAsPercentage(value)}`
          }
          labelLine={false}
        >
          {processedChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
        <RechartsTooltip content={<CustomTooltip chartType="pie" />} />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );

  const renderDonutChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={processedChartData}
          cx="50%"
          cy="50%"
          innerRadius={Math.min(height * 0.2, 60)}
          outerRadius={Math.min(height * 0.35, 120)}
          fill="#8884d8"
          dataKey="value"
          label={({ label, value }) =>
            `${label}: ${formatScoreAsPercentage(value)}`
          }
        >
          {processedChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
        <RechartsTooltip content={<CustomTooltip chartType="donut" />} />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart
        data={processedChartData}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 1]}
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => formatScoreAsPercentage(value)}
        />
        <Radar
          name="Métricas"
          dataKey="value"
          stroke={chartColors[0]}
          fill={chartColors[0]}
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <RechartsTooltip content={<CustomTooltip chartType="radar" />} />
        {showLegend && <Legend />}
      </RadarChart>
    </ResponsiveContainer>
  );

  // ============================================================================
  // 🎯 Chart Type Selector Function
  // ============================================================================

  const renderChartByType = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      case 'donut':
        return renderDonutChart();
      case 'radar':
        return renderRadarChart();
      default:
        console.warn(
          `Chart type "${chartType}" not supported, falling back to bar chart`
        );
        return renderBarChart();
    }
  };

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  if (!data || data.length === 0) {
    return (
      <Card elevation={1}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={height}
            bgcolor="grey.50"
            borderRadius={1}
          >
            <Typography variant="body2" color="textSecondary">
              No hay datos disponibles para mostrar
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={1} sx={{ height: 'fit-content' }}>
      <CardContent>
        {renderChartHeader()}
        <Box sx={{ mt: 2 }}>{renderChartByType()}</Box>
      </CardContent>
    </Card>
  );
};

export default MetricsChart;
