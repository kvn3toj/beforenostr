/**
 * 📊 AnalyticsDashboard Component - Gamifier Admin
 * 
 * Dashboard de métricas comprehensivo para SuperApp CoomÜnity
 * Monitorea engagement, usuarios activos, Ayni metrics y contenido
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  VideoLibrary as VideoLibraryIcon,
  Store as StoreIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  AccountBalance as BalanceIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Timeline as TimelineIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';

// Types
interface DashboardMetrics {
  timestamp: string;
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  breakdown: {
    playlists: number;
    mundos: number;
    contentItems: number;
  };
  engagement: {
    totalEvents: number;
    recentEvents: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    user: string;
    action: string;
    timestamp: string;
    module: string;
  }>;
  ayniMetrics: {
    totalLukas: number;
    totalOndas: number;
    ayniBalance: {
      given: number;
      received: number;
    };
    trustLevel: number;
  };
  summary: {
    userGrowth: number;
    engagementRate: number;
    contentUtilization: number;
  };
}

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AnalyticsDashboard: React.FC = () => {
  // State
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Mock data para desarrollo
  const mockMetrics: DashboardMetrics = {
    timestamp: new Date().toISOString(),
    totalUsers: 1247,
    activeUsers: 892,
    totalContent: 156,
    breakdown: {
      playlists: 12,
      mundos: 8,
      contentItems: 136
    },
    engagement: {
      totalEvents: 15420,
      recentEvents: 234
    },
    recentActivity: [
      {
        id: '1',
        type: 'video_completion',
        user: 'María González',
        action: 'Completó "Fundamentos del Ayni"',
        timestamp: '2024-01-20T14:30:00Z',
        module: 'ÜPlay'
      },
      {
        id: '2',
        type: 'marketplace_listing',
        user: 'Carlos Mamani',
        action: 'Publicó "Quinoa Orgánica Premium"',
        timestamp: '2024-01-20T14:15:00Z',
        module: 'Marketplace'
      },
      {
        id: '3',
        type: 'study_room_join',
        user: 'Ana López',
        action: 'Se unió a sala "Filosofía Colaborativa"',
        timestamp: '2024-01-20T14:00:00Z',
        module: 'Study Rooms'
      }
    ],
    ayniMetrics: {
      totalLukas: 24580,
      totalOndas: 18750,
      ayniBalance: {
        given: 12300,
        received: 11950
      },
      trustLevel: 87.5
    },
    summary: {
      userGrowth: 12.5,
      engagementRate: 78.2,
      contentUtilization: 85.4
    }
  };

  // Effects
  useEffect(() => {
    loadMetrics();
  }, []);

  // Handlers
  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(mockMetrics);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Error cargando métricas del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video_completion': return <VideoLibraryIcon />;
      case 'marketplace_listing': return <StoreIcon />;
      case 'study_room_join': return <SchoolIcon />;
      default: return <TimelineIcon />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'ÜPlay': return 'primary';
      case 'Marketplace': return 'success';
      case 'Study Rooms': return 'info';
      default: return 'default';
    }
  };

  if (!metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AnalyticsIcon fontSize="large" />
            Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Métricas en tiempo real del SuperApp CoomÜnity
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadMetrics}
            disabled={isLoading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" color="primary">
                    Usuarios Totales
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(metrics.totalUsers)}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +{formatPercentage(metrics.summary.userGrowth)} este mes
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" color="success.main">
                    Usuarios Activos
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(metrics.activeUsers)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage((metrics.activeUsers / metrics.totalUsers) * 100)} del total
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" color="info.main">
                    Engagement Rate
                  </Typography>
                  <Typography variant="h4">
                    {formatPercentage(metrics.summary.engagementRate)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.summary.engagementRate} 
                    sx={{ mt: 1, width: '100%' }}
                  />
                </Box>
                <GroupsIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" color="warning.main">
                    Ayni Balance
                  </Typography>
                  <Typography variant="h4">
                    {formatPercentage(metrics.ayniMetrics.trustLevel)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nivel de confianza global
                  </Typography>
                </Box>
                <FavoriteIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Resumen" icon={<AnalyticsIcon />} />
          <Tab label="Actividad Reciente" icon={<TimelineIcon />} />
          <Tab label="Ayni Metrics" icon={<FavoriteIcon />} />
        </Tabs>
      </Box>

      {/* Resumen Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribución de Contenido
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Playlists</Typography>
                    <Typography variant="body2">{metrics.breakdown.playlists}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(metrics.breakdown.playlists / metrics.totalContent) * 100} 
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Items de Contenido</Typography>
                    <Typography variant="body2">{metrics.breakdown.contentItems}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(metrics.breakdown.contentItems / metrics.totalContent) * 100} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Métricas de Engagement
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Eventos Totales: {formatNumber(metrics.engagement.totalEvents)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Eventos Recientes: {formatNumber(metrics.engagement.recentEvents)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Utilización de Contenido: {formatPercentage(metrics.summary.contentUtilization)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.summary.contentUtilization} 
                    sx={{ mt: 2 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Actividad Reciente Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente en Tiempo Real
            </Typography>
            <List>
              {metrics.recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getModuleColor(activity.module)}.main` }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {activity.user}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={activity.module} 
                            color={getModuleColor(activity.module) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(activity.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < metrics.recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Ayni Metrics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monedas Ayni en Circulación
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h4" color="primary">
                      {formatNumber(metrics.ayniMetrics.totalLukas)}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      Lukas
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" color="secondary">
                      {formatNumber(metrics.ayniMetrics.totalOndas)}
                    </Typography>
                    <Typography variant="h6" color="secondary">
                      Ondas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Balance de Reciprocidad
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Ayni Dado</Typography>
                    <Typography variant="body2">{formatNumber(metrics.ayniMetrics.ayniBalance.given)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={50} 
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Ayni Recibido</Typography>
                    <Typography variant="body2">{formatNumber(metrics.ayniMetrics.ayniBalance.received)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={48} 
                    color="secondary"
                  />
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="h4" color="warning.main">
                    {formatPercentage(metrics.ayniMetrics.trustLevel)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nivel de Confianza Comunitario
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default AnalyticsDashboard; 