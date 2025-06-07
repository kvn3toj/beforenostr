import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Notifications as NotificationsIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

interface SearchStat {
  term: string;
  category: string;
  requests: number;
  success: number;
  avgTime: number;
}

interface ResourceMetric {
  type: string;
  count: number;
  percentage: number;
  growth: number;
}

interface PerformanceData {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const UStatsMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Datos basados en el análisis extraído
  const searchStats: SearchStat[] = [
    {
      term: 'coaching',
      category: 'trasciende',
      requests: 21,
      success: 19,
      avgTime: 2.4
    },
    {
      term: 'desarrollo personal',
      category: 'evoluciona',
      requests: 18,
      success: 17,
      avgTime: 1.8
    },
    {
      term: 'emprendimiento',
      category: 'crea',
      requests: 15,
      success: 14,
      avgTime: 2.1
    },
    {
      term: 'bienestar',
      category: 'vive',
      requests: 12,
      success: 12,
      avgTime: 1.5
    }
  ];

  // Análisis de recursos basado en el request_analysis.json
  const resourceMetrics: ResourceMetric[] = [
    { type: 'document', count: 2, percentage: 9.5, growth: 5.2 },
    { type: 'stylesheet', count: 7, percentage: 33.3, growth: -2.1 },
    { type: 'script', count: 6, percentage: 28.6, growth: 8.7 },
    { type: 'image', count: 4, percentage: 19.0, growth: 12.3 },
    { type: 'font', count: 1, percentage: 4.8, growth: 0 },
    { type: 'other', count: 1, percentage: 4.8, growth: 15.5 }
  ];

  const performanceData: PerformanceData[] = [
    { metric: 'Tiempo de Carga', value: 2.1, unit: 's', trend: 'down', change: -15.3 },
    { metric: 'Requests Totales', value: 21, unit: '', trend: 'up', change: 8.5 },
    { metric: 'Éxito de Búsquedas', value: 94.2, unit: '%', trend: 'up', change: 2.1 },
    { metric: 'Usuarios Activos', value: 1247, unit: '', trend: 'up', change: 23.7 },
    { metric: 'Conversiones', value: 18.5, unit: '%', trend: 'up', change: 5.8 },
    { metric: 'Bounce Rate', value: 32.1, unit: '%', trend: 'down', change: -7.2 }
  ];

  const categoryStats = [
    { name: 'Trasciende', searches: 156, growth: 24.3, icon: <PsychologyIcon /> },
    { name: 'Evoluciona', searches: 132, growth: 18.7, icon: <PersonIcon /> },
    { name: 'Crea', searches: 98, growth: 31.2, icon: <BusinessIcon /> },
    { name: 'Vive', searches: 87, growth: 12.5, icon: <SchoolIcon /> }
  ];

  const UStatsHeader = () => (
    <AppBar position="sticky" sx={{ bgcolor: '#2E7D32', boxShadow: 'none' }}>
      <Toolbar>
        <AssessmentIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          ÜStats - Analytics CoomÜnity
        </Typography>
        <IconButton color="inherit">
          <DownloadIcon />
        </IconButton>
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  const OverviewTab = () => (
    <Grid container spacing={3}>
      {/* Métricas Principales */}
      <Grid item xs={12}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />
          Métricas de Rendimiento
        </Typography>
      </Grid>
      
      {performanceData.map((metric) => (
        <Grid item xs={12} sm={6} md={4} key={metric.metric}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" component="div" color="primary.main">
                  {metric.value}{metric.unit}
                </Typography>
                <Chip
                  label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                  color={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'default'}
                  size="small"
                />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                {metric.metric}
              </Typography>
              <Box mt={1}>
                <Typography variant="caption" color="text.secondary">
                  Tendencia: {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '➡️'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Análisis de Recursos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              📊 Distribución de Recursos
            </Typography>
            {resourceMetrics.map((resource) => (
              <Box key={resource.type} mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {resource.type}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {resource.count} ({resource.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={resource.percentage}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: resource.percentage > 80 ? 'success.main' : 
                                    resource.percentage > 50 ? 'warning.main' : 'error.main',
                      transition: 'background-color 0.3s ease-in-out, transform 0.5s ease-out'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Crecimiento: {resource.growth > 0 ? '+' : ''}{resource.growth}%
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Categorías Populares */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              🎯 Categorías Más Buscadas
            </Typography>
            <List>
              {categoryStats.map((category) => (
                <ListItem key={category.name}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {category.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2">{category.name}</Typography>
                        <Chip 
                          label={`+${category.growth}%`} 
                          color="success" 
                          size="small" 
                        />
                      </Box>
                    }
                    secondary={`${category.searches} búsquedas`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SearchAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
          Análisis de Búsquedas y Parámetros
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Término de Búsqueda</strong></TableCell>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell align="right"><strong>Requests</strong></TableCell>
                <TableCell align="right"><strong>Éxito</strong></TableCell>
                <TableCell align="right"><strong>Tiempo Avg</strong></TableCell>
                <TableCell align="right"><strong>Tasa de Éxito</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchStats.map((stat) => (
                <TableRow key={stat.term}>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2">{stat.term}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={stat.category} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">{stat.requests}</TableCell>
                  <TableCell align="right">{stat.success}</TableCell>
                  <TableCell align="right">{stat.avgTime}s</TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {((stat.success / stat.requests) * 100).toFixed(1)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(stat.success / stat.requests) * 100}
                        sx={{ 
                          width: 50, 
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: (stat.success / stat.requests) > 0.8 ? 'success.main' : 
                                           (stat.success / stat.requests) > 0.6 ? 'warning.main' : 'error.main',
                            transition: 'background-color 0.3s ease-in-out, transform 0.5s ease-out'
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Insights de Parámetros */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              🔍 Insights de Parámetros
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Parámetros Más Usados"
                  secondary="param=coaching (65%), category=trasciende (45%)"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Impacto en Performance"
                  secondary="Los parámetros específicos no afectan las acciones de formulario"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Comportamiento de Red"
                  secondary="Parámetros generan 1 request específico adicional"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Análisis de Formularios */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              📝 Análisis de Formularios
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Formularios Detectados: <strong>1</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Método: <strong>POST</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Campos de Entrada: <strong>2</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Incluye Teléfono: <strong>Sí</strong>
              </Typography>
            </Box>
            <Chip label="Token Authentication" color="success" size="small" />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const PerformanceTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
          Análisis de Performance Detallado
        </Typography>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              📈 Tendencias de Uso
            </Typography>
            <Box textAlign="center" py={4}>
              <TrendingUpIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" component="div" color="success.main" gutterBottom>
                +23.7%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Crecimiento en búsquedas este mes
              </Typography>
            </Box>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h5" component="div" color="primary.main">94.2%</Typography>
                  <Typography variant="caption">Tasa de Éxito</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h5" component="div" color="primary.main">2.1s</Typography>
                  <Typography variant="caption">Tiempo Promedio</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              �� Objetivos del Mes
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Reducir Tiempo de Carga"
                  secondary="Meta: < 2.0s"
                />
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ width: 40, ml: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Aumentar Conversiones"
                  secondary="Meta: 25%"
                />
                <LinearProgress
                  variant="determinate"
                  value={60}
                  sx={{ width: 40, ml: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Mejorar UX Score"
                  secondary="Meta: 90+"
                />
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{ width: 40, ml: 1 }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 0:
        return <OverviewTab />;
      case 1:
        return <SearchAnalyticsTab />;
      case 2:
        return <PerformanceTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <Box>
      <UStatsHeader />
      
      <Box sx={{ bgcolor: '#E8F5E8', py: 3 }}>
        <Container>
          <Typography 
            variant="h4" 
            component="h2"
            align="center" 
            sx={{ color: '#2E7D32', fontWeight: 'bold', mb: 2 }}
          >
            📊 ÜStats - Analytics
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ color: 'text.secondary' }}
          >
            Dashboard completo de análisis y métricas de CoomÜnity
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Vista General" />
          <Tab label="Análisis de Búsquedas" />
          <Tab label="Performance" />
        </Tabs>

        <TabContent />
      </Container>
    </Box>
  );
};

export default UStatsMain; 