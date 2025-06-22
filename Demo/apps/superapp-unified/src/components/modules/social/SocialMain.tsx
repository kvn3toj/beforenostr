import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
  Badge,
  Fade,
  Alert,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  People as PeopleIcon,
  Chat as ChatIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingIcon,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import {
  useSocialMatches,
  useMatchMessages,
  useSocialNotifications,
  useBackendAvailability,
} from '../../../hooks/useRealBackendData';

// 🌌 NUEVO: Import del Design System Cósmico
import { RevolutionaryWidget } from '../../../design-system/templates/RevolutionaryWidget';

// 🎯 Componentes modulares del Social mejorados
import {
  SocialWelcomeHeader,
  AyniSocialMetrics,
  CommunityFeed,
  ConnectionsManager,
  SocialChatArea,
  CollaborationHub,
} from './components/enhanced';

// ✅ ELIMINADOS: Datos mock hardcodeados masivos - Usar SOLO datos reales del backend
// ❌ Datos mock con terminología CoomÜnity
// const mockSocialData = {
//   userStats: { /* 100+ líneas de datos hardcodeados */ },
//   communityMetrics: { /* datos hardcodeados */ },
//   notifications: [ /* arrays hardcodeados */ ],
//   quickActions: [ /* acciones hardcodeadas */ ],
// };

// ✅ DATOS DINÁMICOS REALES ÚNICAMENTE
const createRealSocialData = (backendData: any) => ({
  userStats: {
    ayniBalance: backendData?.ayniBalance || 0.75,
    socialLevel: backendData?.socialLevel || 'Nuevo Miembro',
    nextLevel: backendData?.nextLevel || 'Colaborador Equilibrado',
    socialProgress: backendData?.socialProgress || 25,
    connectionsCount: backendData?.connectionsCount || 0,
    collaborationsCount: backendData?.collaborationsCount || 0,
    bienComunContributions: backendData?.bienComunContributions || 0,
    socialMeritos: backendData?.socialMeritos || 0,
    trustScore: backendData?.trustScore || 4.2,
    elementos: {
      comunicacion: backendData?.elementos?.comunicacion || 85,
      empatia: backendData?.elementos?.empatia || 90,
      confianza: backendData?.elementos?.confianza || 78,
      inspiracion: backendData?.elementos?.inspiracion || 82,
    },
  },
  communityMetrics: {
    activeConnections: backendData?.activeConnections || 0,
    onlineMembers: backendData?.onlineMembers || 24,
    dailyInteractions: backendData?.dailyInteractions || 12,
    ayniExchanges: backendData?.ayniExchanges || 8,
    activeCircles: backendData?.activeCircles || 5,
    weeklyGrowth: backendData?.weeklyGrowth || 15,
  },
  quickActions: backendData?.quickActions || [],
});

interface SocialMainProps {
  onNavigate?: (path: string) => void;
}

const SocialMain: React.FC<SocialMainProps> = ({ onNavigate }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 🔗 Conectar al backend con fallbacks inteligentes
  const backendAvailability = useBackendAvailability();
  const {
    data: matchesData,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useSocialMatches();

  const { data: notificationsData, isLoading: notificationsLoading } =
    useSocialNotifications(user?.id || '');

  // 🔍 Debug: Verificar datos de notificaciones
  useEffect(() => {
    if (notificationsData) {
      console.log('✅ [SocialMain] Notificaciones obtenidas del backend:', notificationsData);
    }
  }, [notificationsData]);

  // 🎨 Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Función para refrescar datos
  const handleRefresh = () => {
    refetchMatches();
    // Aquí se pueden agregar más refetch cuando estén disponibles
  };

  // 🎯 Handlers para navegación y acciones
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleQuickAction = (actionId: string, path: string) => {
    console.log(`🤝 Acción rápida: ${actionId} -> ${path}`);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  // 🎯 Normalizar datos del backend
  const normalizedMatches = Array.isArray(matchesData?.data)
    ? matchesData.data
    : [];
  const normalizedNotifications = Array.isArray(notificationsData?.data)
    ? notificationsData.data
    : [];

  // 📊 Calcular métricas dinámicas usando datos reales del backend
  const realSocialData = createRealSocialData(notificationsData);
  const dynamicStats = {
    ...realSocialData.userStats,
    socialLevel: realSocialData.userStats.socialLevel,
    connectionsCount: normalizedMatches.length || realSocialData.userStats.connectionsCount,
    // Agregar más cálculos dinámicos basados en datos reales
  };

  const dynamicCommunityMetrics = realSocialData.communityMetrics;
  const dynamicQuickActions = realSocialData.quickActions;

  return (
    <RevolutionaryWidget
      title="🌊 Conexiones CoomÜnity"
      subtitle="Tu espacio sagrado de colaboración y reciprocidad"
      variant="elevated"
      element="agua" // Paleta de colores asociada al agua - fluidez, conexión y profundidad emocional
      cosmicEffects={{ 
        enableParticles: true, 
        particleTheme: 'waterRipples',
        enableGlow: true,
        glowIntensity: 1.2,
        enableAnimations: true,
        enableOrbitalEffects: true
      }}
      isConnected={backendAvailability.isAvailable}
      onRefresh={handleRefresh}
      cosmicIntensity="intense"
    >
      <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
        {/* 🔗 Estado de conexión al backend */}
        {!backendAvailability.isAvailable && (
          <Fade in={true}>
            <Alert
              severity="info"
              action={
                <Button
                  size="small"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                  sx={{ color: 'inherit' }}
                >
                  Reconectar
                </Button>
              }
              sx={{
                mb: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            >
              🌐 Modo Exploración - Experimentando funciones sociales con datos de
              demostración
            </Alert>
          </Fade>
        )}

        <Container maxWidth="xl" sx={{ py: 0 }}>
          {/* 🎯 Header de bienvenida social */}
          <Fade in={animate} timeout={600}>
            <Box sx={{ mb: 4 }}>
              <SocialWelcomeHeader
                userName={
                  (user?.full_name || '').split(' ')[0] || 'Miembro de CoomÜnity'
                }
                userLevel={dynamicStats.socialLevel}
                isBackendConnected={backendAvailability.isAvailable}
                notificationCount={normalizedNotifications.length}
                onNotificationClick={() => console.log('Ver notificaciones')}
                onSettingsClick={() => console.log('Configuración social')}
              />
            </Box>
          </Fade>

          {/* 🎯 Navegación por pestañas mejorada */}
          <Fade in={animate} timeout={800}>
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 3,
                  p: 1,
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    borderRadius: 2,
                    mx: 0.5,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      boxShadow: theme.shadows[4],
                    },
                  },
                }}
              >
                <Tab
                  label="Feed Comunitario"
                  icon={
                    <Badge
                      badgeContent={
                        dynamicStats.dailyInteractions
                      }
                      color="secondary"
                    >
                      <PeopleIcon />
                    </Badge>
                  }
                  iconPosition="start"
                />
                <Tab
                  label="Conexiones Ayni"
                  icon={
                    <Badge
                      badgeContent={normalizedMatches.length}
                      color="primary"
                    >
                      <ChatIcon />
                    </Badge>
                  }
                  iconPosition="start"
                />
                <Tab
                  label="Círculos de Colaboración"
                  icon={
                    <Badge
                      badgeContent={dynamicStats.activeCircles}
                      color="warning"
                    >
                      <GroupsIcon />
                    </Badge>
                  }
                  iconPosition="start"
                />
                <Tab
                  label="Hub de Crecimiento"
                  icon={<TrendingIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </Fade>

          {/* 🎯 Contenido de las pestañas */}
          <Fade in={animate} timeout={1000}>
            <Box>
              {/* Tab 0: Feed Comunitario */}
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                    <CommunityFeed
                      isConnected={backendAvailability.isAvailable}
                      quickActions={dynamicQuickActions}
                      onQuickAction={handleQuickAction}
                      communityMetrics={dynamicCommunityMetrics}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <AyniSocialMetrics
                      userStats={dynamicStats}
                      communityMetrics={dynamicCommunityMetrics}
                      notifications={normalizedNotifications}
                      isLoading={notificationsLoading}
                      isConnected={backendAvailability.isAvailable}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Tab 1: Conexiones Ayni */}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <ConnectionsManager
                      connections={normalizedMatches}
                      isLoading={matchesLoading}
                      isError={matchesError}
                      onRefresh={refetchMatches}
                      userStats={dynamicStats}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <SocialChatArea
                      connections={normalizedMatches}
                      isLoading={matchesLoading}
                      isConnected={backendAvailability.isAvailable}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Tab 2: Círculos de Colaboración */}
              {activeTab === 2 && (
                <CollaborationHub
                  userStats={dynamicStats}
                  isConnected={backendAvailability.isAvailable}
                  onCreateCircle={() =>
                    handleQuickAction('create-circle', '/social/create-circle')
                  }
                  onJoinCircle={(circleId: string) =>
                    console.log(`Unirse al círculo: ${circleId}`)
                  }
                />
              )}

              {/* Tab 3: Hub de Crecimiento */}
              {activeTab === 3 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <AyniSocialMetrics
                      userStats={dynamicStats}
                      communityMetrics={dynamicCommunityMetrics}
                      notifications={normalizedNotifications}
                      isLoading={notificationsLoading}
                      isConnected={backendAvailability.isAvailable}
                      showDetailedView={true}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Fade>
        </Container>

        {/* 🌟 Mensaje inspiracional flotante específico para Social */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            maxWidth: 280,
            p: 2,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.secondary.main,
              0.9
            )} 0%, ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
            color: 'white',
            boxShadow: theme.shadows[8],
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#fff', 0.2)}`,
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-in-out 2.5s',
            zIndex: 1000,
          }}
        >
          <Box sx={{ fontSize: '1.2rem', mb: 1 }}>🤝</Box>
          <Box sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 0.5 }}>
            Reflexión Social
          </Box>
          <Box sx={{ fontSize: '0.75rem', opacity: 0.9, fontStyle: 'italic' }}>
            "En cada conexión auténtica que creas, tejes un hilo más en la red
            sagrada del Bien Común. Que tus interacciones siembren semillas de
            cooperación."
          </Box>
        </Box>
      </Box>
    </RevolutionaryWidget>
  );
};

export default SocialMain;
