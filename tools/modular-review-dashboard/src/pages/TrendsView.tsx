import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useHistoricalTrends } from '../hooks/useReportData';

type TimeRange = '7d' | '30d' | '90d';

const TrendsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { data: trendsData, isLoading, error } = useHistoricalTrends();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando datos de tendencias...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error cargando tendencias: {error.message}
      </Alert>
    );
  }

  if (!trendsData) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        No hay datos de tendencias disponibles
      </Alert>
    );
  }

  // Transform trend data for charts
  const historicalData = trendsData.overall.map((item) => ({
    date: item.date,
    totalIssues: item.totalIssues,
    errors: item.severity.Error,
    warnings: item.severity.Warning,
    suggestions: item.severity.Suggestion,
    info: item.severity.Info,
  }));

  // Mock historical data fallback - will be replaced by real data above
  const mockHistoricalData = [
    {
      date: '2025-06-04',
      totalIssues: 45,
      errors: 8,
      warnings: 22,
      suggestions: 12,
      info: 3,
    },
    {
      date: '2025-06-05',
      totalIssues: 42,
      errors: 6,
      warnings: 24,
      suggestions: 9,
      info: 3,
    },
    {
      date: '2025-06-06',
      totalIssues: 38,
      errors: 5,
      warnings: 20,
      suggestions: 10,
      info: 3,
    },
    {
      date: '2025-06-07',
      totalIssues: 44,
      errors: 7,
      warnings: 23,
      suggestions: 11,
      info: 3,
    },
    {
      date: '2025-06-08',
      totalIssues: 36,
      errors: 4,
      warnings: 19,
      suggestions: 10,
      info: 3,
    },
    {
      date: '2025-06-09',
      totalIssues: 40,
      errors: 6,
      warnings: 21,
      suggestions: 10,
      info: 3,
    },
    {
      date: '2025-06-10',
      totalIssues: 35,
      errors: 3,
      warnings: 18,
      suggestions: 11,
      info: 3,
    },
    {
      date: '2025-07-01',
      totalIssues: 32,
      errors: 3,
      warnings: 16,
      suggestions: 10,
      info: 3,
    },
    {
      date: '2025-07-02',
      totalIssues: 29,
      errors: 2,
      warnings: 15,
      suggestions: 9,
      info: 3,
    },
    {
      date: '2025-07-03',
      totalIssues: 31,
      errors: 3,
      warnings: 16,
      suggestions: 9,
      info: 3,
    },
    {
      date: '2025-07-04',
      totalIssues: 28,
      errors: 2,
      warnings: 14,
      suggestions: 9,
      info: 3,
    },
  ];

  // Generate module breakdown from latest trend data
  const moduleBreakdownData = Object.keys(trendsData.byModule).map(
    (moduleName, index) => {
      const moduleData = trendsData.byModule[moduleName];
      const latestData = moduleData[moduleData.length - 1];
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

      return {
        name: moduleName,
        value: latestData ? latestData.totalIssues : 0,
        color: colors[index % colors.length],
      };
    }
  );

  const categoryTrendsData = [
    { category: 'Performance', thisWeek: 12, lastWeek: 15, change: -20 },
    { category: 'Security', thisWeek: 6, lastWeek: 8, change: -25 },
    { category: 'Accessibility', thisWeek: 11, lastWeek: 9, change: 22 },
    { category: 'Code Quality', thisWeek: 22, lastWeek: 25, change: -12 },
    { category: 'Architecture', thisWeek: 7, lastWeek: 10, change: -30 },
    { category: 'Philosophy', thisWeek: 6, lastWeek: 4, change: 50 },
    { category: 'Best Practices', thisWeek: 15, lastWeek: 18, change: -17 },
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUpIcon color="error" fontSize="small" />;
    } else if (change < 0) {
      return <TrendingDownIcon color="success" fontSize="small" />;
    }
    return <TimelineIcon color="action" fontSize="small" />;
  };

  const getTrendColor = (change: number): 'success' | 'error' | 'default' => {
    if (change > 0) return 'error'; // Más issues = malo
    if (change < 0) return 'success'; // Menos issues = bueno
    return 'default';
  };

  const getFilteredData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return historicalData.slice(-days);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Análisis de Tendencias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Evolución histórica de la calidad del código
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="time-range-label">Período</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            label="Período"
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <MenuItem value="7d">7 días</MenuItem>
            <MenuItem value="30d">30 días</MenuItem>
            <MenuItem value="90d">90 días</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              28
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Issues Actuales
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingDownIcon color="success" fontSize="small" />
              <Typography
                variant="caption"
                color="success.main"
                sx={{ ml: 0.5 }}
              >
                -12% vs semana anterior
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              2
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Errores Críticos
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingDownIcon color="success" fontSize="small" />
              <Typography
                variant="caption"
                color="success.main"
                sx={{ ml: 0.5 }}
              >
                -33% vs semana anterior
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              14
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Promedio Diario
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingDownIcon color="success" fontSize="small" />
              <Typography
                variant="caption"
                color="success.main"
                sx={{ ml: 0.5 }}
              >
                -8% vs mes anterior
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Charts */}
      <Stack spacing={3}>
        {/* Issues Over Time */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Evolución de Issues por Severidad
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={getFilteredData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('es-ES')
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stackId="1"
                  stroke="#f44336"
                  fill="#f44336"
                  fillOpacity={0.8}
                  name="Errores"
                />
                <Area
                  type="monotone"
                  dataKey="warnings"
                  stackId="1"
                  stroke="#ff9800"
                  fill="#ff9800"
                  fillOpacity={0.8}
                  name="Advertencias"
                />
                <Area
                  type="monotone"
                  dataKey="suggestions"
                  stackId="1"
                  stroke="#4caf50"
                  fill="#4caf50"
                  fillOpacity={0.8}
                  name="Sugerencias"
                />
                <Area
                  type="monotone"
                  dataKey="info"
                  stackId="1"
                  stroke="#2196f3"
                  fill="#2196f3"
                  fillOpacity={0.8}
                  name="Información"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Distribution and Category Trends */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Module Distribution */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución por Módulos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moduleBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moduleBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Trends */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencias por Categoría
              </Typography>
              <Stack spacing={2}>
                {categoryTrendsData.map((category) => (
                  <Box key={category.category}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {category.category}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography variant="body2">
                          {category.thisWeek}
                        </Typography>
                        {getTrendIcon(category.change)}
                        <Chip
                          label={`${category.change > 0 ? '+' : ''}${category.change}%`}
                          size="small"
                          color={getTrendColor(category.change)}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          flex: 1,
                          height: 6,
                          backgroundColor: 'grey.200',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min((category.thisWeek / 30) * 100, 100)}%`,
                            height: '100%',
                            backgroundColor:
                              category.change > 0
                                ? 'error.main'
                                : category.change < 0
                                  ? 'success.main'
                                  : 'grey.400',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 60 }}
                      >
                        vs {category.lastWeek} anterior
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Total Issues Trend */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de Issues - Tendencia General
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getFilteredData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('es-ES')
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalIssues"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Total Issues"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default TrendsView;
