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
  useSocialNotifications,
  useBackendAvailability,
} from '../../../hooks/useRealBackendData';
import {
  SocialWelcomeHeader,
  AyniSocialMetrics,
  CommunityFeed,
  ConnectionsManager,
  SocialChatArea,
  CollaborationHub,
} from './components/enhanced';
import {
  ConsciousSocialFeedback,
  useConsciousSocialFeedback
} from './components/ConsciousSocialFeedback';
import ElegantPostCard from './components/ElegantPostCard';


// ===========================================================================
// DATOS (MOCK TEMPORAL HASTA CONECTAR COMPONENTES)
// ===========================================================================

const mockPosts = [
    {
      id: '1',
      author: {
        name: 'Elena Cósmica',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        merit: 'Guía Estelar',
      },
      timestamp: 'Hace 2 horas',
      content: 'Reflexionando sobre la interconexión universal y el principio de Ayni. Cada acción es un eco en el cosmos. ✨ #BienComún',
      likes: 125,
      comments: 18,
    },
    {
      id: '2',
      author: {
        name: 'David Fractal',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        merit: 'Arquitecto de Sueños',
      },
      timestamp: 'Hace 5 horas',
      content: '¡Nuevo proyecto de colaboración abierto! Buscamos visionarios para co-crear una herramienta de visualización de datos que inspire la acción por el Bien Común. ¿Interesado? Manda un mensaje.',
      likes: 88,
      comments: 27,
    },
];

const mockUserStats = {
    reciprocidadBalance: 0.85,
    socialLevel: 'Colaborador Equilibrado',
    connectionsCount: 42,
    collaborationsCount: 8,
    socialMeritos: 1250,
    ayniBalance: 0.85,
    trustScore: 4.5,
    dailyInteractions: 12,
    activeCircles: 3,
    nextLevel: 'Guía Estelar',
    socialProgress: 60,
    bienComunContributions: 15,
    elementos: {
        comunicacion: 80,
        empatia: 90,
        confianza: 70,
        inspiracion: 85,
    }
};

const mockCommunityMetrics = {
    activeConnections: 150,
    onlineMembers: 24,
    dailyInteractions: 120,
    ayniExchanges: 45,
    activeCircles: 5,
    weeklyGrowth: 10,
};

// ===========================================================================
// COMPONENTE PRINCIPAL (RESTAURADO Y REDISEÑADO)
// ===========================================================================

const SocialMain: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // 🌱 Sistema de Feedback Consciente para Interacciones Sociales
  const {
    feedbacks,
    dismissFeedback,
    showAyniConnection,
    showBienComunCollaboration,
    showCommunityBuilding,
    showEmpathyResonance,
    showWisdomSharing,
    showTrustDeepening,
    showSystemHarmony,
    showConsciousnessExpansion,
  } = useConsciousSocialFeedback();

  const {
    data: matchesData,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useSocialMatches();

  const { data: notificationsData, isLoading: notificationsLoading } =
    useSocialNotifications(user?.id || '');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // 🌱 Feedback consciente por navegación de tabs
    switch (newValue) {
      case 0:
        showCommunityBuilding('Explorando el feed de la comunidad. ¡Conecta con consciencia!');
        break;
      case 1:
        showAyniConnection('Profundizando conexiones basadas en reciprocidad.');
        break;
      case 2:
        showBienComunCollaboration('Iniciando colaboraciones para el Bien Común.');
        break;
      case 3:
        showConsciousnessExpansion('Observando el crecimiento de tu consciencia social.');
        break;
    }
  };

  // 🎯 Handlers para interacciones sociales conscientes
  const handleLikePost = (postId: string) => {
    showEmpathyResonance('Tu resonancia empática fortalece la comunidad.');
  };

  const handleCommentPost = (postId: string) => {
    showWisdomSharing('Compartiendo perspectivas que enriquecen el diálogo.');
  };

  const handleStartConversation = (userId: string) => {
    showAyniConnection('Iniciando una conexión basada en reciprocidad.', 'growing');
  };

  const handleJoinCircle = (circleId: string) => {
    showBienComunCollaboration('Te has unido a un círculo de colaboración consciente.');
  };

  const communityFeedPosts = mockPosts; // Usar mocks mientras se conecta el backend del feed

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
            <Box sx={{ mb: 4 }}>
              <SocialWelcomeHeader
                userName={(user?.fullName || '').split(' ')[0] || 'Coompanero'}
                userLevel={mockUserStats.socialLevel}
                isBackendConnected={true}
                notificationCount={notificationsData?.data?.length || 0}
                onNotificationClick={() => console.log('notif click')}
                onSettingsClick={() => console.log('settings click')}
              />
            </Box>

        {/* Navegación por Pestañas */}
            <Paper
          variant="outlined"
              sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
                mb: 4,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: '#e2e8f0',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
                sx={{
              '& .MuiTabs-indicator': {
                height: '4px',
                borderRadius: '2px',
                backgroundColor: '#6366f1',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                color: '#475569'
              },
              '& .Mui-selected': {
                color: '#6366f1'
              }
                }}
              >
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Comunidad" />
            <Tab icon={<ChatIcon />} iconPosition="start" label="Conexiones" />
            <Tab icon={<GroupsIcon />} iconPosition="start" label="Colaboración" />
            <Tab icon={<TrendingIcon />} iconPosition="start" label="Métricas" />
          </Tabs>
            </Paper>

        {/* Contenido de las Pestañas */}
            <Box>
              {activeTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                {/* Feed de la Comunidad */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {communityFeedPosts.map(post => (
                    <ElegantPostCard key={post.id} post={post} />
                  ))}
                </Box>
                  </Grid>
              <Grid item xs={12} md={4}>
                {/* Widgets de la derecha */}
                    <AyniSocialMetrics
                  userStats={mockUserStats}
                  communityMetrics={mockCommunityMetrics}
                  notifications={notificationsData?.data || []}
                      isLoading={notificationsLoading}
                  isConnected={true}
                    />
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
             <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <ConnectionsManager
                        connections={matchesData?.data || []}
                      isLoading={matchesLoading}
                      isError={matchesError}
                      onRefresh={refetchMatches}
                        userStats={mockUserStats}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <SocialChatArea
                        connections={matchesData?.data || []}
                      isLoading={matchesLoading}
                        isConnected={true}
                    />
                  </Grid>
                </Grid>
              )}

              {activeTab === 2 && (
                <CollaborationHub
                userStats={mockUserStats}
                isConnected={true}
                onCreateCircle={() => {
                  console.log('Creando círculo');
                  showBienComunCollaboration('Creando un nuevo círculo de colaboración consciente.');
                }}
                onJoinCircle={(id) => {
                  console.log(`Uniéndose a ${id}`);
                  handleJoinCircle(id);
                }}
                />
              )}

              {activeTab === 3 && (
                    <AyniSocialMetrics
                userStats={mockUserStats}
                communityMetrics={mockCommunityMetrics}
                notifications={notificationsData?.data || []}
                      isLoading={notificationsLoading}
                isConnected={true}
                      showDetailedView={true}
                    />
          )}

        </Box>

        {/* 🌱 Sistema de Feedback Social Consciente */}
        <ConsciousSocialFeedback
          feedbacks={feedbacks}
          onDismiss={dismissFeedback}
        />
      </Container>
      </Box>
  );
};

export default SocialMain;
