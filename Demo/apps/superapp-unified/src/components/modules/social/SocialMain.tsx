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

// 🎯 Componentes modulares del Social mejorados
import {
  SocialWelcomeHeader,
  AyniSocialMetrics,
  CommunityFeed,
  ConnectionsManager,
  SocialChatArea,
  CollaborationHub,
} from './components/enhanced';

// 🎭 Datos mock con terminología CoomÜnity
const mockSocialData = {
  userStats: {
    ayniBalance: 0.82, // Balance de dar/recibir en interacciones sociales
    socialLevel: 'Tejedor de Redes',
    nextLevel: 'Guardián de Comunidad',
    socialProgress: 67,
    connectionsCount: 34,
    collaborationsCount: 12,
    bienComunContributions: 18,
    socialMeritos: 520,
    trustScore: 4.8,
    elementos: {
      comunicacion: 88, // Elemento aire - comunicación
      empatia: 94, // Elemento agua - empatía y fluidez
      confianza: 78, // Elemento tierra - estabilidad y confianza
      inspiracion: 85, // Elemento fuego - pasión e inspiración
    },
  },
  communityMetrics: {
    activeConnections: 127,
    onlineMembers: 45,
    dailyInteractions: 89,
    ayniExchanges: 23,
    activeCircles: 8,
    weeklyGrowth: 12.5,
  },
  notifications: [
    {
      id: '1',
      type: 'ayni_completed',
      title: 'Intercambio Ayni completado',
      message:
        'Tu intercambio de conocimiento con Ana María ha sido equilibrado',
      time: '30min',
      priority: 'high',
      category: 'ayni',
    },
    {
      id: '2',
      type: 'circle_invitation',
      title: 'Invitación a Círculo',
      message:
        'Te invitaron al círculo "Emprendedores Sostenibles de Medellín"',
      time: '2h',
      priority: 'medium',
      category: 'collaboration',
    },
    {
      id: '3',
      type: 'connection_request',
      title: 'Nueva conexión',
      message: 'Carlos Ramírez quiere conectar contigo por intereses comunes',
      time: '1d',
      priority: 'medium',
      category: 'network',
    },
  ],
  quickActions: [
    {
      id: 'offer-help',
      label: 'Ofrecer Ayuda',
      description: 'Comparte tu conocimiento o servicio',
      category: 'ayni',
      path: '/social/offer',
    },
    {
      id: 'request-help',
      label: 'Pedir Ayuda',
      description: 'Solicita apoyo de la comunidad',
      category: 'ayni',
      path: '/social/request',
    },
    {
      id: 'create-circle',
      label: 'Formar Círculo',
      description: 'Inicia un grupo de colaboración',
      category: 'collaboration',
      path: '/social/create-circle',
    },
    {
      id: 'share-wisdom',
      label: 'Compartir Sabiduría',
      description: 'Publica conocimiento para el Bien Común',
      category: 'knowledge',
      path: '/social/share',
    },
  ],
};

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
    : mockSocialData.notifications;

  // 📊 Calcular métricas dinámicas
  const dynamicStats = {
    ...mockSocialData.userStats,
    connectionsCount:
      normalizedMatches.length || mockSocialData.userStats.connectionsCount,
    // Agregar más cálculos dinámicos basados en datos reales
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
              m: 2,
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

      <Container maxWidth="xl" sx={{ py: 3 }}>
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
                      mockSocialData.communityMetrics.dailyInteractions
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
                    badgeContent={mockSocialData.communityMetrics.activeCircles}
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
                <Grid size={{xs:12,lg:8}}>
                  <CommunityFeed
                    isConnected={backendAvailability.isAvailable}
                    quickActions={mockSocialData.quickActions}
                    onQuickAction={handleQuickAction}
                    communityMetrics={mockSocialData.communityMetrics}
                  />
                </Grid>
                <Grid size={{xs:12,lg:4}}>
                  <AyniSocialMetrics
                    userStats={dynamicStats}
                    communityMetrics={mockSocialData.communityMetrics}
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
                <Grid size={{xs:12,md:4}}>
                  <ConnectionsManager
                    connections={normalizedMatches}
                    isLoading={matchesLoading}
                    isError={matchesError}
                    onRefresh={refetchMatches}
                    userStats={dynamicStats}
                  />
                </Grid>
                <Grid size={{xs:12,md:8}}>
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
                <Grid size={{xs:12}}>
                  <AyniSocialMetrics
                    userStats={dynamicStats}
                    communityMetrics={mockSocialData.communityMetrics}
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
  );
};

export default SocialMain;
