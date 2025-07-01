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

// 🌌 IMPORT DEL SISTEMA DE COLORES CÓSMICO
import { UNIFIED_COLORS } from '../../../theme/colors';

import { useAuth } from '../../../contexts/AuthContext';
import {
  useSocialMatches,
  useSocialNotifications,
  useBackendAvailability,
} from '../../../hooks/useRealBackendData';
import {
  SocialWelcomeHeader,
  ReciprocidadSocialMetrics,
  CommunityFeed,
  ConnectionsManager,
  SocialChatArea,
  CollaborationHub,
} from './components/enhanced';
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
      content: 'Reflexionando sobre la interconexión universal y el principio de Reciprocidad. Cada acción es un eco en el cosmos. ✨ #BienComún',
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
    reciprocidadExchanges: 45,
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
  };

  const communityFeedPosts = mockPosts; // Usar mocks mientras se conecta el backend del feed

  return (
    <Box sx={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      py: 4
    }}>
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
            background: '#ffffff',
            borderColor: theme.palette.divider,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
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
                backgroundColor: UNIFIED_COLORS.modules.social,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                color: UNIFIED_COLORS.themes.minimalist.text.secondary
              },
              '& .Mui-selected': {
                color: UNIFIED_COLORS.modules.social
              }
                }}
              >
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Círculo Sagrado" />
            <Tab icon={<ChatIcon />} iconPosition="start" label="Conexiones Conscientes" />
            <Tab icon={<GroupsIcon />} iconPosition="start" label="Colaboración Creativa" />
            <Tab icon={<TrendingIcon />} iconPosition="start" label="Métricas Reciprocidad" />
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
                    <ReciprocidadSocialMetrics
                  userStats={mockUserStats}
                  communityMetrics={mockCommunityMetrics}
                />
              </Grid>
            </Grid>
              )}

              {activeTab === 1 && (
                <ConnectionsManager />
              )}

              {activeTab === 2 && (
                <CollaborationHub />
              )}

              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" sx={{
                    mb: 3,
                    color: UNIFIED_COLORS.themes.minimalist.text.primary,
                    fontWeight: 'bold'
                  }}>
                    📊 Análisis Profundo de Reciprocidad Social
                  </Typography>
                  <ReciprocidadSocialMetrics
                    userStats={mockUserStats}
                    communityMetrics={mockCommunityMetrics}
                    detailed={true}
                  />
                </Box>
              )}
            </Box>
      </Container>
    </Box>
  );
};

export default SocialMain;
