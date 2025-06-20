/**
 * 📊 LETS Analytics Dashboard - Sistema de Métricas Avanzadas
 * 
 * Dashboard completo para monitorear el sistema LETS con métricas
 * de Ayni, confianza, circulación de Ünits y salud del ecosistema
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  LinearProgress,
  Paper,
  Divider,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as WalletIcon,
  SwapHoriz as ExchangeIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Eco as EcoIcon,
  Balance as BalanceIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';

import { 
  useLetsAnalytics, 
  useLetsSystemHealth 
} from '../../../../hooks/useLetsMarketplace';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LetsAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [tabValue, setTabValue] = useState(0);

  const { data: analytics, isLoading: analyticsLoading } = useLetsAnalytics(timeRange);
  const { data: systemHealth, isLoading: healthLoading } = useLetsSystemHealth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  // Componente para métricas principales
  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color, 
    trend 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'primary' | 'success' | 'warning' | 'error' | 'info';
    trend?: number;
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}.light`,
              color: `${color}.contrastText`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main` }}>
              {value}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <TrendingUpIcon 
                  sx={{ 
                    fontSize: 16, 
                    color: trend >= 0 ? 'success.main' : 'error.main' 
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 600 
                  }}
                >
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% vs período anterior
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  // Componente para el índice de Ayni
  const AyniIndexCard = () => {
    const ayniPercentage = (analytics?.ayniIndex || 0) * 100;
    const getAyniColor = (index: number) => {
      if (index >= 80) return 'success';
      if (index >= 60) return 'warning';
      return 'error';
    };

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <BalanceIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Índice de Ayni (Reciprocidad)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Balance de dar y recibir en la comunidad
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700, 
                  color: `${getAyniColor(ayniPercentage)}.main` 
                }}
              >
                {ayniPercentage.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={ayniPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mt: 2,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: `${getAyniColor(ayniPercentage)}.main`,
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Desequilibrio
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Equilibrio Perfecto
              </Typography>
            </Stack>

            <Alert 
              severity={getAyniColor(ayniPercentage)} 
              sx={{ mt: 2 }}
            >
              {ayniPercentage >= 80 && "¡Excelente! La comunidad mantiene un equilibrio saludable de reciprocidad."}
              {ayniPercentage >= 60 && ayniPercentage < 80 && "Buen nivel de reciprocidad, pero hay espacio para mejorar."}
              {ayniPercentage < 60 && "La comunidad necesita más equilibrio entre dar y recibir."}
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  if (analyticsLoading || healthLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Cargando Analytics LETS...
        </Typography>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              📊 Analytics LETS
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Métricas avanzadas del Sistema de Intercambio Local
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Período"
            >
              <MenuItem value="7d">7 días</MenuItem>
              <MenuItem value="30d">30 días</MenuItem>
              <MenuItem value="90d">90 días</MenuItem>
              <MenuItem value="1y">1 año</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Ünits Circulando"
            value={analytics?.totalUnitsCirculating || 0}
            subtitle="Total en el ecosistema"
            icon={<WalletIcon />}
            color="primary"
            trend={12.5}
          />
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Transacciones Hoy"
            value={analytics?.dailyTransactions || 0}
            subtitle="Intercambios realizados"
            icon={<ExchangeIcon />}
            color="success"
            trend={8.3}
          />
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Usuarios Activos"
            value={analytics?.activeUsers || 0}
            subtitle="Últimos 30 días"
            icon={<PeopleIcon />}
            color="info"
            trend={15.7}
          />
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}}>
          <MetricCard
            title="Promedio Confianza"
            value="4.2/5.0"
            subtitle="Rating de la comunidad"
            icon={<StarIcon />}
            color="warning"
            trend={2.1}
          />
        </Grid>
      </Grid>

      {/* Tabs para diferentes vistas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Resumen General" />
          <Tab label="Ayni & Confianza" />
          <Tab label="Tendencias" />
          <Tab label="Salud del Sistema" />
        </Tabs>
      </Box>

      {/* Contenido de tabs */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid size={{xs:12}}>
            <AyniIndexCard />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid size={{xs:12}}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  🤝 Métricas de Ayni y Confianza
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  El sistema Ayni mide el equilibrio entre dar y recibir en la comunidad. 
                  Un índice alto indica una economía colaborativa saludable.
                </Alert>

                <AyniIndexCard />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid size={{xs:12}}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  📈 Tendencias y Crecimiento
                </Typography>
                
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stack alignItems="center" spacing={2}>
                    <TimelineIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Gráficos de Tendencias
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Aquí se mostrarían gráficos de líneas con las tendencias de:
                      <br />• Volumen de transacciones por día
                      <br />• Crecimiento de usuarios activos
                      <br />• Evolución del índice Ayni
                      <br />• Distribución de categorías en el tiempo
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid size={{xs:12}}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ⚡ Métricas de Performance
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Tiempo de Respuesta API
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {systemHealth?.averageResponseTime || 0}ms (Objetivo: &lt;200ms)
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Disponibilidad del Sistema
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={99.5} 
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      99.5% (Objetivo: &gt;99%)
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Tasa de Éxito de Transacciones
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={98.2} 
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      98.2% (Objetivo: &gt;95%)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default LetsAnalyticsDashboard; 