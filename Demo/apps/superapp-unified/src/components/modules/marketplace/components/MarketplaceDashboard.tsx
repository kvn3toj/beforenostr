import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  LinearProgress,
  Stack,
  Badge,
  Tooltip,
  Tab,
  Tabs,
  Alert,
  AlertTitle,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Store,
  Favorite,
  Star,
  LocalOffer,
  Assessment,
  Visibility,
  ShoppingCart,
  AccountBalance,
  EmojiEvents,
  WaterDrop,
  Balance,
  Psychology,
  AutoAwesome,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Analytics,
  NotificationsOutlined,
  MessageOutlined,
  AttachMoney,
  DiamondOutlined,
  BoltOutlined,
  SelfImprovement,
  NaturePeople,
  SpaOutlined,
  FlashOn,
  WavesOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../contexts/AuthContext';
import { useGuardianColors } from '../../../theme/GuardianColorProvider';
import { MODULE_COLORS } from '../../../../theme/colors';

// Mocks temporales para desarrollo (serán reemplazados por hooks del backend)
const mockDashboardData = {
  seller: {
    id: 'seller-123',
    name: 'Emprendedor Consciente',
    avatar: 'https://via.placeholder.com/100',
    level: 'FLOURISHING',
    reciprocidadScore: 85,
    meritos: 2450,
    ondas: 156,
    isEmprendedorConfiable: true,
    ranking: 15,
    joinedDate: '2023-06-15',
  },
  metrics: {
    totalProducts: 12,
    activeProducts: 8,
    totalViews: 3420,
    totalSales: 47,
    totalRevenue: 8950,
    averageRating: 4.7,
    responseRate: 98,
    completionRate: 95,
    favoriteCount: 143,
    repeatCustomers: 23,
  },
  recentActivity: [
    { id: 1, type: 'sale', description: 'Venta de "Taller de Permacultura"', amount: 150, timestamp: '2024-01-15T10:30:00Z' },
    { id: 2, type: 'review', description: 'Nueva reseña (5 estrellas)', rating: 5, timestamp: '2024-01-14T16:45:00Z' },
    { id: 3, type: 'view', description: 'Tu servicio "Consultoría Holística" recibió 15 vistas', views: 15, timestamp: '2024-01-14T14:20:00Z' },
    { id: 4, type: 'message', description: 'Nuevo mensaje de cliente potencial', timestamp: '2024-01-14T09:15:00Z' },
  ],
  topProducts: [
    { id: 1, title: 'Taller de Permacultura Urbana', views: 234, sales: 8, revenue: 1200, rating: 4.9 },
    { id: 2, title: 'Consultoría en Sustentabilidad', views: 189, sales: 5, revenue: 750, rating: 4.8 },
    { id: 3, title: 'Curso de Economía Circular', views: 156, sales: 12, revenue: 1800, rating: 4.6 },
  ],
  notifications: [
    { id: 1, type: 'info', message: 'Tu producto "Taller de Mindfulness" está cerca de agotarse', priority: 'high' },
    { id: 2, type: 'success', message: 'Has alcanzado un nuevo nivel de Consciencia: FLOURISHING', priority: 'medium' },
    { id: 3, type: 'warning', message: 'Actualiza la descripción de 2 productos para mejor posicionamiento', priority: 'low' },
  ],
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketplace-dashboard-tabpanel-${index}`}
      aria-labelledby={`marketplace-dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MarketplaceDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { palette, getElementColor } = useGuardianColors();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulación de carga de datos del backend
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Cálculo de métricas derivadas
  const conversionRate = useMemo(() => {
    const { totalViews, totalSales } = mockDashboardData.metrics;
    return totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0.0';
  }, []);

  const reciprocidadLevel = useMemo(() => {
    const score = mockDashboardData.seller.reciprocidadScore;
    if (score >= 90) return { label: 'Extraordinario', color: '#10b981', icon: '🌟' };
    if (score >= 75) return { label: 'Excelente', color: '#6366f1', icon: '💎' };
    if (score >= 60) return { label: 'Bueno', color: '#f59e0b', icon: '⚡' };
    return { label: 'En Crecimiento', color: '#ef4444', icon: '🌱' };
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={mockDashboardData.seller.avatar}
              sx={{
                width: 64,
                height: 64,
                border: `3px solid ${reciprocidadLevel.color}`,
                boxShadow: `0 0 20px ${alpha(reciprocidadLevel.color, 0.3)}`,
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                🏪 Tu Dashboard de Marketplace
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                  icon={<Psychology />}
                  label={`Nivel ${mockDashboardData.seller.level}`}
                  color="primary"
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  icon={<Balance />}
                  label={`Reciprocidad: ${mockDashboardData.seller.reciprocidadScore}%`}
                  sx={{
                    bgcolor: alpha(reciprocidadLevel.color, 0.1),
                    color: reciprocidadLevel.color,
                    fontWeight: 600,
                  }}
                />
                {mockDashboardData.seller.isEmprendedorConfiable && (
                  <Chip
                    icon={<EmojiEvents />}
                    label="Emprendedor Confiable"
                    color="success"
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ borderRadius: 3 }}
          >
            Actualizar
          </Button>
        </Box>

        {/* Progress hacia el siguiente nivel */}
        <Card sx={{ p: 2, background: `linear-gradient(135deg, ${alpha(reciprocidadLevel.color, 0.1)} 0%, ${alpha(reciprocidadLevel.color, 0.05)} 100%)` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Progreso hacia TRANSCENDENT
            </Typography>
            <Typography variant="body2" color={reciprocidadLevel.color} fontWeight={600}>
              {mockDashboardData.seller.reciprocidadScore}/100
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={mockDashboardData.seller.reciprocidadScore}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(reciprocidadLevel.color, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: reciprocidadLevel.color,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Continúa creando valor consciente para tu comunidad
          </Typography>
        </Card>
      </Box>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {mockDashboardData.metrics.totalProducts}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Productos Totales
                    </Typography>
                  </Box>
                  <Store sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                  {mockDashboardData.metrics.activeProducts} activos
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {mockDashboardData.metrics.totalSales}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Ventas Totales
                    </Typography>
                  </Box>
                  <ShoppingCart sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                  {conversionRate}% conversión
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      ${mockDashboardData.metrics.totalRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Ingresos Totales
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                  En tu cartera CoomÜnity
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {mockDashboardData.metrics.averageRating}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Rating Promedio
                    </Typography>
                  </Box>
                  <Star sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                  Basado en {mockDashboardData.metrics.totalSales} ventas
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Economía CoomÜnity */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <DiamondOutlined sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
              <Typography variant="h3" fontWeight={700} color="#f59e0b">
                {mockDashboardData.seller.meritos.toLocaleString()}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Mëritos Acumulados
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Reconocimiento por tu contribución al Bien Común
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <WavesOutlined sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
              <Typography variant="h3" fontWeight={700} color="#10b981">
                {mockDashboardData.seller.ondas}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Öndas Generadas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Energía vibracional positiva en el ecosistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EmojiEvents sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
              <Typography variant="h3" fontWeight={700} color="#8b5cf6">
                #{mockDashboardData.seller.ranking}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Ranking Comunitario
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Entre emprendedores conscientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pestañas de Contenido */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            },
          }}
        >
          <Tab icon={<Analytics />} label="Analytics" />
          <Tab icon={<TrendingUp />} label="Productos Top" />
          <Tab icon={<NotificationsOutlined />} label="Actividad Reciente" />
          <Tab icon={<MessageOutlined />} label="Mensajes" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {/* Analytics Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="📊 Métricas de Engagement" />
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Vistas Totales</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {mockDashboardData.metrics.totalViews.toLocaleString()}
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Favoritos</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {mockDashboardData.metrics.favoriteCount}
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={70} sx={{ height: 8, borderRadius: 4 }} color="secondary" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Tasa de Respuesta</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {mockDashboardData.metrics.responseRate}%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={mockDashboardData.metrics.responseRate} sx={{ height: 8, borderRadius: 4 }} color="success" />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="🎯 Métricas de Conversión" />
                <CardContent>
                  <Stack spacing={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" fontWeight={700} color="primary.main">
                        {conversionRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasa de Conversión
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Clientes Recurrentes
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={(mockDashboardData.metrics.repeatCustomers / mockDashboardData.metrics.totalSales) * 100}
                          size={60}
                          thickness={6}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {mockDashboardData.metrics.repeatCustomers}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            de {mockDashboardData.metrics.totalSales} clientes
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Top Products Tab */}
          <Grid container spacing={3}>
            {mockDashboardData.topProducts.map((product, index) => (
              <Grid item xs={12} md={4} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                          {product.title}
                        </Typography>
                        <Chip
                          label={`#${index + 1}`}
                          color={index === 0 ? 'warning' : index === 1 ? 'info' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Vistas
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {product.views}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Ventas
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {product.sales}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Ingresos
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            ${product.revenue}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Rating
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ color: '#fbbf24', fontSize: 16 }} />
                            <Typography variant="body2" fontWeight={600}>
                              {product.rating}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* Recent Activity Tab */}
          <Card>
            <CardHeader title="📈 Actividad Reciente" />
            <CardContent sx={{ p: 0 }}>
              <List>
                {mockDashboardData.recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{
                          bgcolor: activity.type === 'sale' ? 'success.main' :
                                  activity.type === 'review' ? 'warning.main' :
                                  activity.type === 'view' ? 'info.main' : 'primary.main'
                        }}>
                          {activity.type === 'sale' && <AttachMoney />}
                          {activity.type === 'review' && <Star />}
                          {activity.type === 'view' && <Visibility />}
                          {activity.type === 'message' && <MessageOutlined />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.description}
                        secondary={new Date(activity.timestamp).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      />
                      <ListItemSecondaryAction>
                        {activity.amount && (
                          <Chip
                            label={`$${activity.amount}`}
                            color="success"
                            size="small"
                          />
                        )}
                        {activity.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ color: '#fbbf24', fontSize: 16 }} />
                            <Typography variant="caption">
                              {activity.rating}
                            </Typography>
                          </Box>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < mockDashboardData.recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Messages Tab */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Centro de Mensajes</AlertTitle>
            Aquí podrás gestionar todas las conversaciones con tus clientes potenciales y actuales.
          </Alert>

          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <MessageOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes mensajes nuevos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Los mensajes de clientes aparecerán aquí cuando los recibas
              </Typography>
              <Button variant="contained" startIcon={<RefreshIcon />}>
                Actualizar Mensajes
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Notificaciones */}
      {mockDashboardData.notifications.length > 0 && (
        <Card>
          <CardHeader title="🔔 Notificaciones Importantes" />
          <CardContent sx={{ p: 0 }}>
            <List>
              {mockDashboardData.notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemText
                      primary={notification.message}
                      secondary={
                        <Chip
                          label={notification.priority}
                          size="small"
                          color={
                            notification.priority === 'high' ? 'error' :
                            notification.priority === 'medium' ? 'warning' : 'default'
                          }
                          sx={{ mt: 1 }}
                        />
                      }
                    />
                  </ListItem>
                  {index < mockDashboardData.notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default MarketplaceDashboard;
