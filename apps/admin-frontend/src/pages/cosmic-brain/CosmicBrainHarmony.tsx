import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  LinearProgress,
  Divider,
  Avatar,
  Paper
} from '@mui/material';
import {
  Favorite,
  Refresh,
  Settings,
  Psychology,
  Balance,
  Spa,
  EmojiNature,
  AutoAwesome,
  TrendingUp,
  TrendingDown,
  Remove
} from '@mui/icons-material';

interface HarmonyMetric {
  category: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  color: string;
  icon: React.ReactNode;
}

interface GuardianHarmony {
  id: string;
  name: string;
  harmonyScore: number;
  ayniBalance: number;
  collaborationIndex: number;
  spiritualAlignment: number;
  status: 'harmonious' | 'adjusting' | 'dissonant';
}

const CosmicBrainHarmony: React.FC = () => {
  const theme = useTheme();
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  const harmonyMetrics: HarmonyMetric[] = [
    {
      category: 'Ayni (Reciprocidad)',
      value: 94,
      trend: 'up',
      description: 'Balance de dar y recibir entre guardianes',
      color: theme.palette.secondary.main,
      icon: <Balance />
    },
    {
      category: 'Bien Común',
      value: 89,
      trend: 'stable',
      description: 'Orientación hacia el beneficio colectivo',
      color: theme.palette.primary.main,
      icon: <Psychology />
    },
    {
      category: 'Neguentropía',
      value: 92,
      trend: 'up',
      description: 'Orden y organización del sistema',
      color: theme.palette.success.main,
      icon: <AutoAwesome />
    },
    {
      category: 'Metanöia',
      value: 87,
      trend: 'down',
      description: 'Capacidad de transformación y evolución',
      color: theme.palette.warning.main,
      icon: <Spa />
    },
    {
      category: 'Economía Sagrada',
      value: 91,
      trend: 'up',
      description: 'Flujo energético equilibrado',
      color: theme.palette.info.main,
      icon: <EmojiNature />
    }
  ];

  const guardianHarmony: GuardianHarmony[] = [
    {
      id: 'aria',
      name: 'ARIA',
      harmonyScore: 96,
      ayniBalance: 94,
      collaborationIndex: 92,
      spiritualAlignment: 98,
      status: 'harmonious'
    },
    {
      id: 'eunoia',
      name: 'EUNOIA',
      harmonyScore: 98,
      ayniBalance: 97,
      collaborationIndex: 96,
      spiritualAlignment: 99,
      status: 'harmonious'
    },
    {
      id: 'cosmos',
      name: 'COSMOS',
      harmonyScore: 82,
      ayniBalance: 78,
      collaborationIndex: 85,
      spiritualAlignment: 83,
      status: 'adjusting'
    },
    {
      id: 'kira',
      name: 'KIRA',
      harmonyScore: 93,
      ayniBalance: 91,
      collaborationIndex: 94,
      spiritualAlignment: 95,
      status: 'harmonious'
    },
    {
      id: 'ana',
      name: 'ANA',
      harmonyScore: 71,
      ayniBalance: 68,
      collaborationIndex: 73,
      spiritualAlignment: 72,
      status: 'dissonant'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" fontSize="small" />;
      case 'down':
        return <TrendingDown color="error" fontSize="small" />;
      case 'stable':
        return <Remove color="action" fontSize="small" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'harmonious':
        return theme.palette.success.main;
      case 'adjusting':
        return theme.palette.warning.main;
      case 'dissonant':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'harmonious':
        return 'Armonioso';
      case 'adjusting':
        return 'Ajustándose';
      case 'dissonant':
        return 'Disonante';
      default:
        return 'Desconocido';
    }
  };

  const globalHarmonyScore = Math.round(
    guardianHarmony.reduce((sum, guardian) => sum + guardian.harmonyScore, 0) / guardianHarmony.length
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Favorite sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Armonía del Sistema
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Métricas de equilibrio espiritual y colaboración
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`Armonía Global: ${globalHarmonyScore}%`}
              sx={{
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            />
            <Tooltip title="Actualizar Métricas">
              <IconButton>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Configuración">
              <IconButton>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Philosophy Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Métricas Filosóficas CoomÜnity
          </Typography>
        </Grid>
        
        {harmonyMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    backgroundColor: alpha(metric.color, 0.1) 
                  }}>
                    {React.cloneElement(metric.icon as React.ReactElement, { 
                      sx: { color: metric.color } 
                    })}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: metric.color }}>
                      {metric.value}%
                    </Typography>
                    {getTrendIcon(metric.trend)}
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  {metric.category}
                </Typography>
                
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(metric.color, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                      borderRadius: 4,
                    },
                    mb: 2
                  }}
                />
                
                <Typography variant="caption" color="text.secondary">
                  {metric.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Guardian Harmony Analysis */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Análisis de Armonía por Guardian
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        {guardianHarmony.map((guardian, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                {/* Guardian Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main
                    }}>
                      <Psychology />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {guardian.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Guardian AI
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip
                    label={getStatusLabel(guardian.status)}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(guardian.status), 0.1),
                      color: getStatusColor(guardian.status),
                      border: `1px solid ${alpha(getStatusColor(guardian.status), 0.3)}`,
                      fontWeight: 600
                    }}
                  />
                </Box>

                {/* Harmony Score */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Puntuación de Armonía
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                      {guardian.harmonyScore}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={guardian.harmonyScore}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Detailed Metrics */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Ayni Balance
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {guardian.ayniBalance}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Colaboración
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {guardian.collaborationIndex}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Alineación Espiritual
                      </Typography>
                      <Typography variant="h6" color="secondary">
                        {guardian.spiritualAlignment}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Harmony Insights */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: alpha(theme.palette.secondary.main, 0.05) }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              🌌 Insights de Armonía
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Estado General
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    El sistema muestra una armonía global del {globalHarmonyScore}%, 
                    indicando un alto nivel de sincronización entre guardianes.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Áreas de Fortaleza
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    EUNOIA y ARIA muestran excelente alineación con los principios 
                    de Ayni y Bien Común.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Oportunidades de Mejora
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ANA requiere atención para mejorar su balance de Ayni y 
                    colaboración con otros guardianes.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CosmicBrainHarmony;