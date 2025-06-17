import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Paper,
  LinearProgress,
  Divider,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Download as DownloadIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Insights as InsightsIcon,
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Map as MapIcon,
  Thermostat as ThermostatIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// 🌌 IMPORTS DEL DESIGN SYSTEM REVOLUCIONARIO
import { RevolutionaryWidget } from '../../../design-system';

// Import new chart components
import MinimalMetricCard from './components/MinimalMetricCard';
import RealTimeStatus from './components/RealTimeStatus';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import HeatMap from './components/HeatMap';
import UserLocationMap from './components/UserLocationMap';

interface SearchStat {
  term: string;
  category: string;
  requests: number;
  success: number;
  avgTime: number;
}

interface PerformanceData {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
}

interface ActivityData {
  time: string;
  searches: number;
  conversions: number;
  users: number;
}

interface CategoryData {
  name: string;
  value: number;
  icon: React.ReactNode;
  searches: number;
  growth: number;
}

const UStatsMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  // Datos en tiempo real con actualización muy sutil
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    searchesPerMinute: 23,
    conversionRate: 18.5,
    serverLoad: 67,
  });

  // Datos para gráficos de barras
  const barChartData = [
    {
      name: 'Trasciende',
      value: 156,
      color: theme.palette.primary.main,
    },
    {
      name: 'Evoluciona',
      value: 132,
      color: theme.palette.secondary.main,
    },
    {
      name: 'Crea',
      value: 98,
      color: theme.palette.success.main,
    },
    {
      name: 'Vive',
      value: 87,
      color: theme.palette.warning.main,
    },
    {
      name: 'Conecta',
      value: 74,
      color: theme.palette.info.main,
    },
  ];

  // Datos para gráfico de torta
  const pieChartData = [
    {
      name: 'Usuarios Activos',
      value: 847,
      color: theme.palette.primary.main,
    },
    {
      name: 'Usuarios Inactivos',
      value: 234,
      color: theme.palette.grey[400],
    },
    {
      name: 'Nuevos Usuarios',
      value: 166,
      color: theme.palette.success.main,
    },
  ];

  // Datos para mapa de calor
  const heatMapData = [
    // Lunes
    { day: 'Lun', hour: 6, value: 5 },
    { day: 'Lun', hour: 7, value: 12 },
    { day: 'Lun', hour: 8, value: 25 },
    { day: 'Lun', hour: 9, value: 45 },
    { day: 'Lun', hour: 10, value: 38 },
    { day: 'Lun', hour: 11, value: 42 },
    { day: 'Lun', hour: 12, value: 55 },
    { day: 'Lun', hour: 13, value: 35 },
    { day: 'Lun', hour: 14, value: 48 },
    { day: 'Lun', hour: 15, value: 52 },
    { day: 'Lun', hour: 16, value: 47 },
    { day: 'Lun', hour: 17, value: 38 },
    { day: 'Lun', hour: 18, value: 28 },
    { day: 'Lun', hour: 19, value: 32 },
    { day: 'Lun', hour: 20, value: 25 },
    { day: 'Lun', hour: 21, value: 18 },
    { day: 'Lun', hour: 22, value: 8 },
    { day: 'Lun', hour: 23, value: 3 },
    // Martes
    { day: 'Mar', hour: 6, value: 7 },
    { day: 'Mar', hour: 7, value: 15 },
    { day: 'Mar', hour: 8, value: 28 },
    { day: 'Mar', hour: 9, value: 48 },
    { day: 'Mar', hour: 10, value: 41 },
    { day: 'Mar', hour: 11, value: 45 },
    { day: 'Mar', hour: 12, value: 58 },
    { day: 'Mar', hour: 13, value: 38 },
    { day: 'Mar', hour: 14, value: 51 },
    { day: 'Mar', hour: 15, value: 55 },
    { day: 'Mar', hour: 16, value: 49 },
    { day: 'Mar', hour: 17, value: 41 },
    { day: 'Mar', hour: 18, value: 31 },
    { day: 'Mar', hour: 19, value: 35 },
    { day: 'Mar', hour: 20, value: 28 },
    { day: 'Mar', hour: 21, value: 21 },
    { day: 'Mar', hour: 22, value: 11 },
    { day: 'Mar', hour: 23, value: 5 },
    // Miércoles
    { day: 'Mié', hour: 8, value: 30 },
    { day: 'Mié', hour: 9, value: 50 },
    { day: 'Mié', hour: 10, value: 43 },
    { day: 'Mié', hour: 11, value: 47 },
    { day: 'Mié', hour: 12, value: 60 },
    { day: 'Mié', hour: 13, value: 40 },
    { day: 'Mié', hour: 14, value: 53 },
    { day: 'Mié', hour: 15, value: 57 },
    { day: 'Mié', hour: 16, value: 51 },
    { day: 'Mié', hour: 17, value: 43 },
    { day: 'Mié', hour: 18, value: 33 },
    { day: 'Mié', hour: 19, value: 37 },
    { day: 'Mié', hour: 20, value: 30 },
    { day: 'Mié', hour: 21, value: 23 },
    // Jueves
    { day: 'Jue', hour: 8, value: 32 },
    { day: 'Jue', hour: 9, value: 52 },
    { day: 'Jue', hour: 10, value: 45 },
    { day: 'Jue', hour: 11, value: 49 },
    { day: 'Jue', hour: 12, value: 62 },
    { day: 'Jue', hour: 13, value: 42 },
    { day: 'Jue', hour: 14, value: 55 },
    { day: 'Jue', hour: 15, value: 59 },
    { day: 'Jue', hour: 16, value: 53 },
    { day: 'Jue', hour: 17, value: 45 },
    { day: 'Jue', hour: 18, value: 35 },
    { day: 'Jue', hour: 19, value: 39 },
    { day: 'Jue', hour: 20, value: 32 },
    { day: 'Jue', hour: 21, value: 25 },
    // Viernes
    { day: 'Vie', hour: 8, value: 35 },
    { day: 'Vie', hour: 9, value: 55 },
    { day: 'Vie', hour: 10, value: 48 },
    { day: 'Vie', hour: 11, value: 52 },
    { day: 'Vie', hour: 12, value: 65 },
    { day: 'Vie', hour: 13, value: 45 },
    { day: 'Vie', hour: 14, value: 58 },
    { day: 'Vie', hour: 15, value: 62 },
    { day: 'Vie', hour: 16, value: 56 },
    { day: 'Vie', hour: 17, value: 48 },
    { day: 'Vie', hour: 18, value: 38 },
    { day: 'Vie', hour: 19, value: 42 },
    { day: 'Vie', hour: 20, value: 45 },
    { day: 'Vie', hour: 21, value: 38 },
    { day: 'Vie', hour: 22, value: 28 },
    { day: 'Vie', hour: 23, value: 15 },
    // Sábado
    { day: 'Sáb', hour: 9, value: 25 },
    { day: 'Sáb', hour: 10, value: 35 },
    { day: 'Sáb', hour: 11, value: 45 },
    { day: 'Sáb', hour: 12, value: 50 },
    { day: 'Sáb', hour: 13, value: 55 },
    { day: 'Sáb', hour: 14, value: 48 },
    { day: 'Sáb', hour: 15, value: 52 },
    { day: 'Sáb', hour: 16, value: 58 },
    { day: 'Sáb', hour: 17, value: 60 },
    { day: 'Sáb', hour: 18, value: 55 },
    { day: 'Sáb', hour: 19, value: 52 },
    { day: 'Sáb', hour: 20, value: 48 },
    { day: 'Sáb', hour: 21, value: 43 },
    { day: 'Sáb', hour: 22, value: 35 },
    { day: 'Sáb', hour: 23, value: 22 },
    // Domingo
    { day: 'Dom', hour: 10, value: 20 },
    { day: 'Dom', hour: 11, value: 30 },
    { day: 'Dom', hour: 12, value: 40 },
    { day: 'Dom', hour: 13, value: 45 },
    { day: 'Dom', hour: 14, value: 38 },
    { day: 'Dom', hour: 15, value: 42 },
    { day: 'Dom', hour: 16, value: 48 },
    { day: 'Dom', hour: 17, value: 50 },
    { day: 'Dom', hour: 18, value: 45 },
    { day: 'Dom', hour: 19, value: 42 },
    { day: 'Dom', hour: 20, value: 38 },
    { day: 'Dom', hour: 21, value: 33 },
    { day: 'Dom', hour: 22, value: 25 },
  ];

  // Datos de ubicación de usuarios
  const userLocationData = [
    {
      country: 'México',
      city: 'Ciudad de México',
      users: 245,
      lat: 19.4326,
      lng: -99.1332,
      color: theme.palette.primary.main,
    },
    {
      country: 'Colombia',
      city: 'Bogotá',
      users: 189,
      lat: 4.711,
      lng: -74.0721,
      color: theme.palette.secondary.main,
    },
    {
      country: 'Argentina',
      city: 'Buenos Aires',
      users: 167,
      lat: -34.6037,
      lng: -58.3816,
      color: theme.palette.success.main,
    },
    {
      country: 'Perú',
      city: 'Lima',
      users: 134,
      lat: -12.0464,
      lng: -77.0428,
      color: theme.palette.warning.main,
    },
    {
      country: 'Chile',
      city: 'Santiago',
      users: 98,
      lat: -33.4489,
      lng: -70.6693,
      color: theme.palette.info.main,
    },
    {
      country: 'Brasil',
      city: 'São Paulo',
      users: 156,
      lat: -23.5505,
      lng: -46.6333,
      color: theme.palette.error.main,
    },
    {
      country: 'Venezuela',
      city: 'Caracas',
      users: 87,
      lat: 10.4806,
      lng: -66.9036,
      color: '#9c27b0',
    },
    {
      country: 'Ecuador',
      city: 'Quito',
      users: 73,
      lat: -0.1807,
      lng: -78.4678,
      color: '#795548',
    },
    {
      country: 'Uruguay',
      city: 'Montevideo',
      users: 45,
      lat: -34.9011,
      lng: -56.1645,
      color: '#607d8b',
    },
    {
      country: 'Paraguay',
      city: 'Asunción',
      users: 32,
      lat: -25.2637,
      lng: -57.5759,
      color: '#ff5722',
    },
  ];

  // Activity data
  const activityData: ActivityData[] = [
    { time: '00:00', searches: 45, conversions: 8, users: 120 },
    { time: '04:00', searches: 28, conversions: 5, users: 89 },
    { time: '08:00', searches: 89, conversions: 16, users: 234 },
    { time: '12:00', searches: 156, conversions: 29, users: 421 },
    { time: '16:00', searches: 134, conversions: 25, users: 367 },
    { time: '20:00', searches: 112, conversions: 21, users: 298 },
  ];

  // Category data
  const categoryData: CategoryData[] = [
    {
      name: 'Trasciende',
      value: 35,
      searches: 156,
      growth: 24.3,
      icon: <PsychologyIcon />,
    },
    {
      name: 'Evoluciona',
      value: 28,
      searches: 132,
      growth: 18.7,
      icon: <PersonIcon />,
    },
    {
      name: 'Crea',
      value: 22,
      searches: 98,
      growth: 31.2,
      icon: <BusinessIcon />,
    },
    {
      name: 'Vive',
      value: 15,
      searches: 87,
      growth: 12.5,
      icon: <SchoolIcon />,
    },
  ];

  // Performance metrics
  const performanceData: PerformanceData[] = [
    {
      metric: 'Usuarios Activos',
      value: 1247,
      unit: '',
      trend: 'up',
      change: 23.7,
      description: 'Total de usuarios conectados',
    },
    {
      metric: 'Tasa de Éxito',
      value: 94.2,
      unit: '%',
      trend: 'up',
      change: 2.1,
      description: 'Búsquedas exitosas',
    },
    {
      metric: 'Tiempo de Carga',
      value: 2.1,
      unit: 's',
      trend: 'down',
      change: -15.3,
      description: 'Promedio de respuesta',
    },
    {
      metric: 'Conversiones',
      value: 18.5,
      unit: '%',
      trend: 'up',
      change: 5.8,
      description: 'Tasa de conversión',
    },
  ];

  // Search analytics
  const searchStats: SearchStat[] = [
    {
      term: 'coaching',
      category: 'trasciende',
      requests: 21,
      success: 19,
      avgTime: 2.4,
    },
    {
      term: 'desarrollo personal',
      category: 'evoluciona',
      requests: 18,
      success: 17,
      avgTime: 1.8,
    },
    {
      term: 'emprendimiento',
      category: 'crea',
      requests: 15,
      success: 14,
      avgTime: 2.1,
    },
    {
      term: 'bienestar',
      category: 'vive',
      requests: 12,
      success: 12,
      avgTime: 1.5,
    },
  ];

  // Actualización muy sutil cada 2 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 4 - 2),
        searchesPerMinute: Math.max(
          15,
          prev.searchesPerMinute + Math.floor(Math.random() * 3 - 1)
        ),
        conversionRate: Math.max(
          15,
          Math.min(25, prev.conversionRate + (Math.random() - 0.5) * 0.2)
        ),
        serverLoad: Math.max(
          50,
          Math.min(80, prev.serverLoad + Math.floor(Math.random() * 4 - 2))
        ),
      }));
    }, 120000); // 2 minutos para actualizaciones muy sutiles

    return () => clearInterval(interval);
  }, []);

  const AppHeader = () => (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <AnalyticsIcon sx={{ mr: 2, color: 'white' }} />
        <Typography
          variant="h6"
          component="h2"
          sx={{
            flexGrow: 1,
            color: 'white',
            fontWeight: 500,
          }}
        >
          ÜStats Analytics Dashboard
        </Typography>
        <IconButton sx={{ color: 'white' }}>
          <DownloadIcon />
        </IconButton>
        <IconButton sx={{ color: 'white' }}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  const OverviewTab = () => (
    <Box sx={{ mb: 4 }}>
      {/* Estado en tiempo real */}
      <Box sx={{ mb: 4 }}>
        <RealTimeStatus {...realTimeData} />
      </Box>

      {/* Métricas principales */}
      <Typography
        variant="h5"
        component="h3"
        sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}
      >
        Métricas Principales
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {performanceData.map((metric, index) => (
          <Grid size={{xs:12,sm:6,md:3}} key={metric.metric}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <MinimalMetricCard {...metric} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos diversos */}
      <Grid container spacing={4}>
        {/* Gráfico de barras */}
        <Grid size={{xs:12,lg:6}}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BarChart
              data={barChartData}
              title="📊 Búsquedas por Categoría"
              height={300}
            />
          </motion.div>
        </Grid>

        {/* Gráfico de torta */}
        <Grid size={{xs:12,lg:6}}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PieChart
              data={pieChartData}
              title="🔄 Distribución de Usuarios"
              size={220}
            />
          </motion.div>
        </Grid>

        {/* Mapa de calor */}
        <Grid size={{xs:12}}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <HeatMap
              data={heatMapData}
              title="🔥 Mapa de Calor - Actividad por Hora"
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );

  const SearchAnalyticsTab = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h3"
        sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}
      >
        Análisis de Búsquedas
      </Typography>

      <Grid container spacing={4}>
        {/* Búsquedas por término */}
        <Grid size={{xs:12,lg:8}}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <SearchIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h6" component="h3" fontWeight={600}>
                  Rendimiento por Término
                </Typography>
              </Box>

              <Stack spacing={3}>
                {searchStats.map((stat) => (
                  <Paper
                    key={stat.term}
                    sx={{
                      p: 3,
                      backgroundColor: alpha(theme.palette.grey[50], 0.8),
                      border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.grey[100], 0.6),
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          {stat.term}
                        </Typography>
                        <Chip
                          label={stat.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            color: 'primary.main',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                      <Box textAlign="right">
                        <Typography
                          variant="h4"
                          color="primary.main"
                          fontWeight={600}
                          sx={{ mb: 0.5 }}
                        >
                          {((stat.success / stat.requests) * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tasa de éxito
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid size={{xs:12,sm:4}}>
                        <Typography variant="body2" color="text.secondary">
                          Solicitudes
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {stat.requests}
                        </Typography>
                      </Grid>
                      <Grid size={{xs:12,sm:4}}>
                        <Typography variant="body2" color="text.secondary">
                          Exitosas
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="success.main"
                        >
                          {stat.success}
                        </Typography>
                      </Grid>
                      <Grid size={{xs:12,sm:4}}>
                        <Typography variant="body2" color="text.secondary">
                          Tiempo promedio
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {stat.avgTime}s
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,lg:4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 3, fontWeight: 600 }}
              >
                Insights y Tendencias
              </Typography>

              <Stack spacing={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    Parámetros Más Usados
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    • param=coaching (65%)
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    • category=trasciende (45%)
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    backgroundColor: alpha(theme.palette.success.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    Rendimiento
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    Los parámetros específicos mantienen la velocidad del
                    sistema sin impacto negativo
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    Comportamiento de Red
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    Cada parámetro genera 1 request adicional optimizado
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const GeographicTab = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h3"
        sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}
      >
        Distribución Geográfica
      </Typography>

      <Grid container spacing={4}>
        {/* Mapa de ubicación */}
        <Grid size={{xs:12}}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UserLocationMap
              data={userLocationData}
              title="🌎 Ubicación de Usuarios por País"
            />
          </motion.div>
        </Grid>

        {/* Estadísticas por país */}
        <Grid size={{xs:12,md:6}}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BarChart
              data={userLocationData.slice(0, 6).map((location) => ({
                name: location.city,
                value: location.users,
                color: location.color,
              }))}
              title="🏙️ Top Ciudades por Usuarios"
              height={300}
            />
          </motion.div>
        </Grid>

        {/* Distribución regional */}
        <Grid size={{xs:12,md:6}}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PieChart
              data={[
                {
                  name: 'México',
                  value: 245,
                  color: theme.palette.primary.main,
                },
                {
                  name: 'Colombia',
                  value: 189,
                  color: theme.palette.secondary.main,
                },
                {
                  name: 'Argentina',
                  value: 167,
                  color: theme.palette.success.main,
                },
                {
                  name: 'Brasil',
                  value: 156,
                  color: theme.palette.error.main,
                },
                {
                  name: 'Otros',
                  value: 490,
                  color: theme.palette.grey[400],
                },
              ]}
              title="🌍 Distribución Regional"
              size={240}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );

  const PerformanceTab = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h3"
        sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}
      >
        Rendimiento del Sistema
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{xs:12,lg:8}}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={4}>
                <SpeedIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h6" component="h3" fontWeight={600}>
                  Métricas Detalladas
                </Typography>
              </Box>

              <Stack spacing={4}>
                {performanceData.map((metric) => (
                  <Box key={metric.metric}>
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {metric.metric}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography
                          variant="h5"
                          color="primary.main"
                          fontWeight={600}
                        >
                          {metric.value}
                          {metric.unit}
                        </Typography>
                        <Chip
                          label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              metric.trend === 'up'
                                ? theme.palette.success.main
                                : metric.trend === 'down'
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                              0.1
                            ),
                            color:
                              metric.trend === 'up'
                                ? 'success.main'
                                : metric.trend === 'down'
                                  ? 'error.main'
                                  : 'warning.main',
                            border: `1px solid ${alpha(
                              metric.trend === 'up'
                                ? theme.palette.success.main
                                : metric.trend === 'down'
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                              0.2
                            )}`,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        metric.metric === 'Tiempo de Carga'
                          ? Math.max(0, 100 - (metric.value / 5) * 100)
                          : metric.value > 100
                            ? 100
                            : metric.value
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: alpha(theme.palette.grey[300], 0.3),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          backgroundColor:
                            metric.trend === 'up'
                              ? theme.palette.success.main
                              : metric.trend === 'down'
                                ? theme.palette.error.main
                                : theme.palette.warning.main,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, lineHeight: 1.4 }}
                    >
                      {metric.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,lg:4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 4, fontWeight: 600 }}
              >
                Estado del Sistema
              </Typography>

              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    border: `2px solid ${theme.palette.success.main}`,
                  }}
                >
                  <Typography
                    variant="h3"
                    color="success.main"
                    fontWeight={600}
                  >
                    ✓
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Sistema Operativo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Todos los servicios funcionan correctamente
                </Typography>
              </Box>

              <Stack spacing={3}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.grey[50], 0.8),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Carga del Servidor
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {realTimeData.serverLoad}%
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.grey[50], 0.8),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Usuarios Activos
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {realTimeData.activeUsers.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.grey[50], 0.8),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Búsquedas por Minuto
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {realTimeData.searchesPerMinute}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 0:
        return <OverviewTab />;
      case 1:
        return <SearchAnalyticsTab />;
      case 2:
        return <GeographicTab />;
      case 3:
        return <PerformanceTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <AppHeader />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <RevolutionaryWidget
          title="🔥 Tus Estadísticas de Progreso"
          subtitle="Métricas revolucionarias de tu evolución en CoomÜnity"
          variant="elevated"
          element="fuego" // Paleta de colores asociada al fuego, la energía y la acción
          cosmicEffects={{ 
            enableGlow: true, 
            particleTheme: 'embers',
            enableAnimations: true,
            glowIntensity: 1.2
          }}
          cosmicIntensity="medium"
          interactionMode="hover"
        >
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minWidth: 140,
                  py: 2,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                  '&:hover': {
                    color: 'primary.main',
                    opacity: 0.8,
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: 'primary.main',
                },
              }}
            >
              <Tab
                label="Vista General"
                icon={<BarChartIcon />}
                iconPosition="start"
              />
              <Tab label="Búsquedas" icon={<SearchIcon />} iconPosition="start" />
              <Tab label="Geografía" icon={<MapIcon />} iconPosition="start" />
              <Tab
                label="Rendimiento"
                icon={<SpeedIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <Box sx={{ mt: 4 }}>
            <TabContent />
          </Box>
        </RevolutionaryWidget>
      </Container>
    </Box>
  );
};

export default UStatsMain;
