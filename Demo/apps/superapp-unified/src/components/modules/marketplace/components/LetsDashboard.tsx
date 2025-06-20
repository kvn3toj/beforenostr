import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  AccountBalance,
  Group,
  LocalOffer,
  EmojiNature,
  Info,
  Refresh,
} from '@mui/icons-material';
import { useLetsAnalytics } from '../../../../hooks/useLetsIntegration';

interface LetsDashboardProps {
  userId?: string;
}

const LetsDashboard: React.FC<LetsDashboardProps> = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: rawAnalytics,
    isLoading,
    error,
    refetch,
  } = useLetsAnalytics();

  // Adaptar analytics para compatibilidad con la estructura anterior
  const analytics = rawAnalytics ? {
    totalUnitsCirculating: rawAnalytics.totalUnitsInCirculation,
    dailyTransactions: rawAnalytics.totalTransactions,
    activeUsers: rawAnalytics.userEngagement.activeUsers,
    ayniIndex: rawAnalytics.ayniBalance.balanceRatio,
    topCategories: rawAnalytics.topCategories.map(cat => ({
      name: cat.category,
      count: cat.transactionCount
    })),
    userGrowth: rawAnalytics.userEngagement
  } : null;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid size={{xs:12,sm:6,md:3}} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={32} />
                  <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error cargando estadísticas LETS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error.message}
        </Typography>
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getAyniColor = (index: number) => {
    if (index >= 0.8) return '#4CAF50'; // Verde - Excelente
    if (index >= 0.6) return '#FF9800'; // Naranja - Bueno
    return '#F44336'; // Rojo - Necesita mejora
  };

  const getAyniLabel = (index: number) => {
    if (index >= 0.8) return 'Excelente';
    if (index >= 0.6) return 'Bueno';
    return 'Mejorable';
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: 2 }}>
        {/* Header con título y refresh */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              📊 Dashboard LETS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de Intercambio Local - Métricas en tiempo real
            </Typography>
          </Box>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Ünits Circulando */}
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalance sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Ünits Totales
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(analytics.totalUnitsCirculating)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  En circulación activa
                </Typography>
                {/* Decorative element */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Transacciones Diarias */}
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SwapHoriz sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Transacciones
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {analytics.dailyTransactions}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  Hoy
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Usuarios Activos */}
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Group sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Usuarios Activos
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {analytics.activeUsers}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  Este mes
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Índice Ayni */}
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${getAyniColor(analytics.ayniIndex)} 0%, ${getAyniColor(analytics.ayniIndex)}CC 100%)`,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiNature sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Índice Ayni
                  </Typography>
                  <Tooltip title="Mide el equilibrio de reciprocidad en la comunidad">
                    <Info sx={{ ml: 1, fontSize: 16, opacity: 0.8 }} />
                  </Tooltip>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {Math.round(analytics.ayniIndex * 100)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  {getAyniLabel(analytics.ayniIndex)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analytics.ayniIndex * 100}
                  sx={{
                    mt: 2,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Categorías más populares */}
        <Grid container spacing={3}>
          <Grid size={{xs:12,md:6}}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  🏷️ Categorías Más Populares
                </Typography>
                <Stack spacing={2}>
                  {analytics.topCategories.map((category, index) => (
                    <Box
                      key={category.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: index === 0 ? '#E3F2FD' : '#F5F5F5',
                        border: index === 0 ? '2px solid #2196F3' : '1px solid #E0E0E0',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: index === 0 ? '#2196F3' : '#757575',
                            fontSize: 14,
                            fontWeight: 'bold',
                            mr: 2,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Typography variant="body1" fontWeight={index === 0 ? 'bold' : 'medium'}>
                          {category.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${category.count} intercambios`}
                        size="small"
                        color={index === 0 ? 'primary' : 'default'}
                        variant={index === 0 ? 'filled' : 'outlined'}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Crecimiento de usuarios */}
          <Grid size={{xs:12,md:6}}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  📈 Crecimiento de la Comunidad
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs:12}}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#E8F5E8',
                        border: '1px solid #4CAF50',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Nuevos Usuarios
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="#4CAF50">
                          +{analytics.userGrowth.newUsers}
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ fontSize: 32, color: '#4CAF50' }} />
                    </Box>
                  </Grid>
                  <Grid size={{xs:12}}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#FFF3E0',
                        border: '1px solid #FF9800',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Tasa de Retención
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="#FF9800">
                          {Math.round(analytics.userGrowth.retentionRate * 100)}%
                        </Typography>
                      </Box>
                      <LocalOffer sx={{ fontSize: 32, color: '#FF9800' }} />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Información sobre Ayni */}
        <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              🌱 ¿Qué es el Índice Ayni?
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              El Índice Ayni mide el equilibrio de reciprocidad en nuestra comunidad LETS. 
              Un índice alto indica que los intercambios son justos y equilibrados, 
              reflejando el principio andino de Ayni (reciprocidad). 
              Cuando damos y recibimos en equilibrio, fortalecemos el Bien Común.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default LetsDashboard; 