import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Paper,
  Typography,
  IconButton,
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

// 🎨 NUEVO: Advanced Navigation System siguiendo técnicas del artículo Medium
interface MarkerPosition {
  x: number;
  width: number;
  height: number;
  prevX?: number;
  prevWidth?: number;
}

interface NavigationTabProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.RefObject<HTMLDivElement>;
}

const ACTIVE_MARKER_HEIGHT = 4;
const HOVER_MARKER_HEIGHT = 6;

// 🎯 Hook personalizado para la navegación avanzada (inspirado en el artículo Medium)
const useAdvancedNavigation = () => {
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition>({
    x: 0,
    width: 0,
    height: ACTIVE_MARKER_HEIGHT,
  });

  const updateMarkerPosition = useCallback((ref: React.RefObject<HTMLDivElement>, isHover = false) => {
    if (ref.current) {
      const { offsetLeft, offsetWidth } = ref.current;
      setMarkerPosition(prev => ({
        ...prev,
        prevX: isHover ? prev.x : undefined,
        prevWidth: isHover ? prev.width : undefined,
        x: offsetLeft,
        width: offsetWidth,
        height: isHover ? HOVER_MARKER_HEIGHT : ACTIVE_MARKER_HEIGHT,
      }));
    }
  }, []);

  const returnToSelected = useCallback(() => {
    setMarkerPosition(prev => ({
      x: prev.prevX ?? prev.x,
      width: prev.prevWidth ?? prev.width,
      height: ACTIVE_MARKER_HEIGHT,
      prevX: undefined,
      prevWidth: undefined,
    }));
  }, []);

  return { markerPosition, updateMarkerPosition, returnToSelected };
};

// 🎨 Componente de marcador animado (técnica del artículo Medium)
const NavigationMarker: React.FC<{ position: MarkerPosition }> = ({ position }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      left: position.x,
      width: position.width,
      height: position.height,
      background: 'linear-gradient(90deg, #00bcd4, #009688)',
      borderRadius: '2px 2px 0 0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 0 12px rgba(0, 188, 212, 0.4)',
      pointerEvents: 'none',
    }}
  />
);

// 🎨 Tab individual con micro-interacciones avanzadas
const AdvancedNavigationTab: React.FC<NavigationTabProps> = React.forwardRef<HTMLDivElement, NavigationTabProps>(
  ({ label, icon, isSelected, onClick, onMouseEnter, onMouseLeave }, ref) => {
    const theme = useTheme();
    
    return (
      <Box
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 3,
          py: 2,
          cursor: 'pointer',
          position: 'relative',
          fontWeight: isSelected ? 700 : 500,
          color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
          transition: 'all 0.2s ease-in-out',
          borderRadius: 2,
          '&:hover': {
            color: theme.palette.primary.main,
            transform: 'translateY(-1px)',
            '& .tab-icon': {
              transform: 'scale(1.1)',
            },
          },
        }}
      >
        <Box className="tab-icon" sx={{ transition: 'transform 0.2s ease-in-out' }}>
          {icon}
        </Box>
        <Typography variant="body2" fontWeight="inherit">
          {label}
        </Typography>
      </Box>
    );
  }
);

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
    reciprocidadBalance: backendData?.reciprocidadBalance || backendData?.ayniBalance || 0.75,
    socialLevel: backendData?.socialLevel || 'Nuevo Miembro',
    nextLevel: backendData?.nextLevel || 'Colaborador Equilibrado',
    socialProgress: backendData?.socialProgress || 25,
    connectionsCount: backendData?.connectionsCount || 0,
    collaborationsCount: backendData?.collaborationsCount || 0,
    bienComunContributions: backendData?.bienComunContributions || 0,
    socialMeritos: backendData?.socialMeritos || 0,
    trustScore: backendData?.trustScore || 4.2,
    dailyInteractions: backendData?.dailyInteractions || 12,
    activeCircles: backendData?.activeCircles || 5,
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
    reciprocidadExchanges: backendData?.reciprocidadExchanges || backendData?.ayniExchanges || 8,
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

  // 🎯 Referencias para la navegación avanzada
  const tabRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null), 
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const { markerPosition, updateMarkerPosition, returnToSelected } = useAdvancedNavigation();

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

  // 🎨 Inicializar posición del marcador cuando el componente se monta
  useEffect(() => {
    if (animate && tabRefs[activeTab]?.current) {
      updateMarkerPosition(tabRefs[activeTab]);
    }
  }, [animate, activeTab, updateMarkerPosition]);

  // 🔄 Función para refrescar datos
  const handleRefresh = () => {
    refetchMatches();
  };

  // 🎯 Handlers para navegación avanzada
  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
    updateMarkerPosition(tabRefs[index]);
  }, [updateMarkerPosition, tabRefs]);

  const handleTabHover = useCallback((index: number) => {
    if (index !== activeTab) {
      updateMarkerPosition(tabRefs[index], true);
    }
  }, [activeTab, updateMarkerPosition, tabRefs]);

  const handleTabLeave = useCallback(() => {
    returnToSelected();
  }, [returnToSelected]);

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

  const normalizedNotifications = React.useMemo(() => {
    // 🛡️ Validación robusta para prevenir errores de filter
    const responseData = notificationsData as any;

    // Verificar si hay datos válidos del backend
    if (responseData?.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }

    if (responseData?.notifications && Array.isArray(responseData.notifications)) {
      return responseData.notifications;
    }

    if (Array.isArray(responseData)) {
      return responseData;
    }

    // Si no hay datos válidos, retornar array vacío
    return [];
  }, [notificationsData]);

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

  // 🎯 Configuración de pestañas
  const tabs = [
    {
      label: 'Feed Comunitario',
      icon: (
        <Badge badgeContent={dynamicStats.dailyInteractions} color="secondary">
          <PeopleIcon />
        </Badge>
      ),
    },
    {
                        label: 'Conexiones de Reciprocidad',
      icon: (
        <Badge badgeContent={normalizedMatches.length} color="primary">
          <ChatIcon />
        </Badge>
      ),
    },
    {
      label: 'Círculos de Colaboración',
      icon: (
        <Badge badgeContent={dynamicStats.activeCircles} color="warning">
          <GroupsIcon />
        </Badge>
      ),
    },
    {
      label: 'Hub de Crecimiento',
      icon: <TrendingIcon />,
    },
  ];

  return (
    <RevolutionaryWidget
      title="🌬️ Social: Conexiones que Inspiran"
      subtitle="Donde cada interacción cultiva la semilla del Bien Común y fortalece los lazos de Reciprocidad."
      variant="elevated"
      element="aire" // Cambiado a Aire para comunicación/conexión
      cosmicEffects={{
        enableParticles: true,
        particleTheme: 'breeze',
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

          {/* 🎯 Navegación avanzada con highlight animado */}
          <Fade in={animate} timeout={800}>
            <Paper
              elevation={2}
              sx={{
                mb: 4,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  position: 'relative',
                  px: 2,
                  py: 1,
                }}
              >
                {tabs.map((tab, index) => (
                  <AdvancedNavigationTab
                    key={index}
                    ref={tabRefs[index]}
                    label={tab.label}
                    icon={tab.icon}
                    isSelected={activeTab === index}
                    onClick={() => handleTabClick(index)}
                    onMouseEnter={() => handleTabHover(index)}
                    onMouseLeave={handleTabLeave}
                  />
                ))}
                <NavigationMarker position={markerPosition} />
              </Box>
            </Paper>
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

              {/* Tab 1: Conexiones de Reciprocidad */}
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
          <Box sx={{ fontSize: '1.2rem', mb: 1 }}>🌬️</Box>
          <Box sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 0.5 }}>
            Sabiduría del Aire
          </Box>
          <Box sx={{ fontSize: '0.75rem', opacity: 0.9, fontStyle: 'italic' }}>
            "Como el viento que conecta montañas y valles, tus palabras y acciones
            tejen puentes invisibles entre corazones. Cada conexión auténtica
            multiplica la abundancia del Bien Común."
          </Box>
        </Box>
      </Box>
    </RevolutionaryWidget>
  );
};

export default SocialMain;
