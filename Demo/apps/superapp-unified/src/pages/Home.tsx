import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Alert,
  Button,
  Fade,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  useDashboardData,
  useBackendAvailability,
} from '../hooks/useRealBackendData';

// 🎯 Componentes modulares del Home
import {
  WelcomeHeader,
  AyniMetricsCard,
  WalletOverview,
  QuickActionsGrid,
  ModuleCards,
  NotificationCenter,
} from '../components/home';

// 🎭 Datos mock con terminología CoomÜnity actualizada
const mockDashboardData = {
  gamification: {
    ondas: 1250, // Öndas (energía vibracional)
    meritos: 485, // Mëritos (logros por Bien Común)
    ayniLevel: 'Colaborador Equilibrado',
    nextLevel: 'Guardián del Bien Común',
    ayniProgress: 78,
    bienComunContributions: 23,
    balanceAyni: 0.85, // Proporción de dar/recibir
    streak: 12,
    elementos: {
      fuego: 85, // Pasión y acción
      agua: 92, // Fluir y adaptabilidad
      tierra: 78, // Estabilidad y confianza
      aire: 88, // Comunicación e ideas
    },
  },
  wallet: {
    lukas: 125075, // Lükas (moneda interna)
    ayniCredits: 480, // Créditos de reciprocidad
    monthlyChange: 15.2,
    pendingTransactions: 3,
    ayniBalance: 0.85, // Balance de dar/recibir
  },
  notifications: [
    {
      id: '1',
      type: 'ayni' as const,
      title: 'Ayni completado',
      message:
        'Has completado un intercambio equilibrado con María. Tu balance Ayni ha mejorado.',
      time: '2h',
      icon: '✨',
      color: 'success' as const,
      priority: 'high' as const,
    },
    {
      id: '2',
      type: 'meritos' as const,
      title: 'Nuevos Mëritos ganados',
      message:
        'Has ganado 50 Mëritos por tu contribución al proyecto "Huerta Comunitaria"',
      time: '4h',
      icon: '🏆',
      color: 'warning' as const,
      priority: 'high' as const,
    },
    {
      id: '3',
      type: 'social' as const,
      title: 'Invitación a Comunidad',
      message:
        'Te han invitado a unirte al círculo "Emprendedores Confiables de Medellín"',
      time: '1d',
      icon: '👥',
      color: 'primary' as const,
      priority: 'medium' as const,
    },
  ],
};

// 🎯 Componente principal del Home
export const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  // 🔗 Conectar al backend real con fallback a mock data
  const backendAvailability = useBackendAvailability();
  const dashboardData = useDashboardData(user?.id || 'mock-user-id');

  // 🎯 Decidir qué datos usar basado en disponibilidad del backend
  const gameData = dashboardData.gameData || mockDashboardData.gamification;
  const walletData = dashboardData.walletData || mockDashboardData.wallet;
  const userData = dashboardData.userProfile || user;

  // 🎨 Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Función para refrescar datos
  const handleRefresh = () => {
    if (dashboardData.refetch) {
      dashboardData.refetch();
    }
  };

  // 🎯 Handlers para las acciones
  const handleNotificationClick = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleSettingsClick = () => {
    navigate('/profile');
  };

  const handleModuleClick = (moduleId: string, path: string) => {
    // Analytics tracking aquí si es necesario
    navigate(path);
  };

  const handleQuickActionClick = (path: string) => {
    navigate(path);
  };

  // 🎨 Mapear datos del backend al formato esperado por la UI
  const normalizedGameData = {
    ondas: gameData.experience || gameData.ondas || 1250,
    meritos: (gameData.stats?.wisdom ?? 0) * 10 || gameData.meritos || 485,
    ayniLevel:
      gameData.title || gameData.ayniLevel || 'Colaborador Equilibrado',
    nextLevel: gameData.nextLevel || 'Guardián del Bien Común',
    ayniProgress:
      Math.floor(
        ((gameData.experience || 1250) / (gameData.nextLevelExp || 2000)) * 100
      ) || 78,
    bienComunContributions: gameData.bienComunContributions || 23,
    balanceAyni: gameData.balanceAyni || 0.85,
    streak: gameData.streak || 12,
    elementos: gameData.elementos || mockDashboardData.gamification.elementos,
  };

  const normalizedWalletData = {
    lukas: walletData.balance || walletData.lukas || 125075,
    ayniCredits: walletData.ucoins || walletData.ayniCredits || 480,
    monthlyChange: walletData.monthlyChange || 15.2,
    pendingTransactions: walletData.pendingTransactions || 3,
    ayniBalance: walletData.ayniBalance || 0.85,
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 🔗 Estado de conexión al backend */}
      {!backendAvailability.isAvailable && (
        <Fade in={true}>
          <Alert
            severity="warning"
            action={
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ color: 'inherit' }}
              >
                Reintentar
              </Button>
            }
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            🔌 Modo Offline - Experimentando con datos simulados de CoomÜnity
          </Alert>
        </Fade>
      )}

      {/* 🎯 Header principal con saludo personalizado */}
      <Fade in={animate} timeout={600}>
        <Box sx={{ mb: 4 }}>
          <WelcomeHeader
            userName={
              (userData?.full_name || '').split(' ')[0] ||
              (user?.full_name || '').split(' ')[0] ||
              'CoomÜnity'
            }
            isBackendConnected={backendAvailability.isAvailable}
            notificationCount={mockDashboardData.notifications.length}
            onNotificationClick={handleNotificationClick}
            onSettingsClick={handleSettingsClick}
          />
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* 🎯 Panel principal - Métricas Ayni */}
        <Grid item xs={12} lg={8}>
          <Fade in={animate} timeout={800}>
            <Box>
              <AyniMetricsCard
                ondas={normalizedGameData.ondas}
                meritos={normalizedGameData.meritos}
                ayniLevel={normalizedGameData.ayniLevel}
                nextLevel={normalizedGameData.nextLevel}
                ayniProgress={normalizedGameData.ayniProgress}
                bienComunContributions={
                  normalizedGameData.bienComunContributions
                }
                balanceAyni={normalizedGameData.balanceAyni}
                elementos={normalizedGameData.elementos}
                isLoading={dashboardData.isLoading}
                isConnected={backendAvailability.isAvailable}
              />
            </Box>
          </Fade>
        </Grid>

        {/* 🎯 Panel lateral - Wallet y acciones */}
        <Grid item xs={12} lg={4}>
          <Fade in={animate} timeout={1000}>
            <Grid container spacing={3}>
              {/* 💰 Wallet Overview */}
              <Grid item xs={12}>
                <WalletOverview
                  lukas={normalizedWalletData.lukas}
                  ayniCredits={normalizedWalletData.ayniCredits}
                  monthlyChange={normalizedWalletData.monthlyChange}
                  pendingTransactions={normalizedWalletData.pendingTransactions}
                  ayniBalance={normalizedWalletData.ayniBalance}
                  isLoading={dashboardData.isLoading}
                  isConnected={backendAvailability.isAvailable}
                />
              </Grid>

              {/* 🎯 Acciones Ayni */}
              <Grid item xs={12}>
                <QuickActionsGrid onActionClick={handleQuickActionClick} />
              </Grid>
            </Grid>
          </Fade>
        </Grid>

        {/* 🎯 Módulos principales */}
        <Grid item xs={12}>
          <Fade in={animate} timeout={1400}>
            <Box>
              <ModuleCards onModuleClick={handleModuleClick} />
            </Box>
          </Fade>
        </Grid>

        {/* 🔔 Centro de notificaciones */}
        {notificationsOpen && (
          <Grid item xs={12}>
            <NotificationCenter
              notifications={mockDashboardData.notifications}
              isOpen={notificationsOpen}
              onNotificationClick={(notification) => {
                console.log('Notification clicked:', notification);
                // Aquí puedes manejar la navegación específica para cada tipo de notificación
              }}
              onMarkAsRead={(notificationId) => {
                console.log('Mark as read:', notificationId);
                // Aquí puedes actualizar el estado de la notificación
              }}
              onClearAll={() => {
                console.log('Clear all notifications');
                setNotificationsOpen(false);
              }}
            />
          </Grid>
        )}
      </Grid>

      {/* 🌟 Mensaje inspiracional flotante */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          maxWidth: 300,
          p: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.9
          )} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
          color: 'white',
          boxShadow: theme.shadows[8],
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#fff', 0.2)}`,
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-in-out 2s',
          zIndex: 1000,
        }}
      >
        <Box sx={{ fontSize: '1.2rem', mb: 1 }}>🌟</Box>
        <Box sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 0.5 }}>
          Reflexión del día
        </Box>
        <Box sx={{ fontSize: '0.75rem', opacity: 0.9, fontStyle: 'italic' }}>
          "En cada acción de Ayni que realizas, no solo equilibras tu propio
          camino, sino que contribuyes al tejido sagrado del Bien Común"
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
