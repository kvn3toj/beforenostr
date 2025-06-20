// 🏫 Componente: Panel de Funcionalidades Sociales para ÜPlay
// Integra salas de estudio, chat colaborativo y funciones sociales
// Se integra como un panel/tab en la interfaz principal de ÜPlay

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Stack,
  Button,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
  Chip,
  IconButton,
  Badge,
  Fab,
  Zoom,
  Slide,
  Collapse,
  useTheme,
  alpha,
  Tooltip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  VideoCall as VideoCallIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Psychology as PhilosofiaIcon,
  SportsEsports as GamificacionIcon,
  Handshake as ColaboracionIcon,
  Favorite as AyniIcon,
  Public as BienComunIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  EmojiEvents as RewardsIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as InsightIcon,
  AutoAwesome as MagicIcon,
} from '@mui/icons-material';

// Imports de componentes y hooks
import { StudyRoomCreator } from './StudyRoomCreator';
import { StudyRoomList } from './StudyRoomList';
import { useStudyRooms } from '../../../../hooks/uplay/useStudyRooms';
import { StudyRoom, StudyRoomFilters } from '../../../../types/study-rooms';

interface SocialFeaturesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideoId?: string;
  userId?: string;
  enableBackdrop?: boolean;
}

// Configuración de íconos para diferentes focos de estudio
const STUDY_FOCUS_ICONS = {
  filosofia: PhilosofiaIcon,
  gamificacion: GamificacionIcon,
  colaboracion: ColaboracionIcon,
  ayni: AyniIcon,
  'bien-común': BienComunIcon,
} as const;

const STUDY_FOCUS_COLORS = {
  filosofia: '#8b5cf6',
  gamificacion: '#10b981',
  colaboracion: '#f59e0b',
  ayni: '#ef4444',
  'bien-común': '#3b82f6',
} as const;

// Componente para mostrar sala activa
const ActiveRoomDisplay: React.FC<{
  room: StudyRoom;
  onLeaveRoom: () => void;
}> = ({ room, onLeaveRoom }) => {
  const theme = useTheme();
  const focusIcon = STUDY_FOCUS_ICONS[room.studyFocus];
  const focusColor = STUDY_FOCUS_COLORS[room.studyFocus];

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(focusColor, 0.1)}, ${alpha(focusColor, 0.05)})`,
        border: `2px solid ${alpha(focusColor, 0.3)}`,
        borderRadius: 3,
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${focusColor}, ${alpha(focusColor, 0.8)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.createElement(focusIcon, { sx: { fontSize: 24, color: 'white' } })}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {room.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`${room.participants.length}/${room.maxParticipants}`}
                  size="small"
                  icon={<GroupsIcon />}
                  sx={{ backgroundColor: alpha(focusColor, 0.2), color: focusColor }}
                />
                <Chip
                  label={room.status === 'active' ? 'En vivo' : 'Esperando'}
                  size="small"
                  color={room.status === 'active' ? 'success' : 'warning'}
                />
              </Stack>
            </Box>
          </Stack>
          
          <Button
            variant="outlined"
            size="small"
            onClick={onLeaveRoom}
            color="error"
          >
            Salir
          </Button>
        </Stack>

        {/* Participantes */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Participantes:
          </Typography>
          <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
            {room.participants.map((participant) => (
              <Avatar
                key={participant.id}
                src={participant.avatarUrl}
                alt={participant.name}
                sx={{ width: 32, height: 32 }}
              >
                {participant.name.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        </Stack>

        {/* Stats de la sesión */}
        <Stack direction="row" spacing={3}>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700} color={focusColor}>
              {room.totalMeritosEarned}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mëritos
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700} color="#10b981">
              {room.totalOndasEarned}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Öndas
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700} color="#f59e0b">
              {room.questionsAnswered}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Preguntas
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700} color="#8b5cf6">
              {Math.round(room.averageAccuracy * 100)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Precisión
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Componente principal del panel social
export const SocialFeaturesPanel: React.FC<SocialFeaturesPanelProps> = ({
  isOpen,
  onClose,
  currentVideoId,
  userId = 'current-user',
  enableBackdrop = true,
}) => {
  const theme = useTheme();
  
  // Estado del panel
  const [activeTab, setActiveTab] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Hook de salas de estudio
  const {
    rooms,
    currentRoom,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    loadRooms,
    refreshRooms,
    clearError,
  } = useStudyRooms({
    userId,
    enableRealtime: true,
    autoRefresh: true,
    refreshInterval: 30000,
  });

  // Manejo de crear sala
  const handleCreateRoom = useCallback(async (roomData: Partial<StudyRoom>) => {
    try {
      await createRoom(roomData);
      setShowCreateDialog(false);
      setActiveTab(0); // Cambiar a la pestaña de salas
    } catch (error) {
      console.error('Error creating room:', error);
    }
  }, [createRoom]);

  // Manejo de unirse a sala
  const handleJoinRoom = useCallback(async (roomId: string) => {
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  }, [joinRoom]);

  // Manejo de salir de sala
  const handleLeaveRoom = useCallback(async () => {
    if (currentRoom) {
      try {
        await leaveRoom(currentRoom.id);
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }
  }, [currentRoom, leaveRoom]);

  // Manejo de cambio de pestaña
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  // Filtros de salas basados en la pestaña activa
  const getRoomFilters = useCallback((): StudyRoomFilters => {
    switch (activeTab) {
      case 1: // Salas activas
        return { status: 'active' };
      case 2: // Salas próximas
        return { status: 'waiting' };
      default: // Todas las salas
        return {};
    }
  }, [activeTab]);

  // Cargar salas cuando cambia el filtro
  useEffect(() => {
    if (isOpen) {
      loadRooms(getRoomFilters());
    }
  }, [activeTab, isOpen, loadRooms, getRoomFilters]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop opcional */}
      {enableBackdrop && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        />
      )}

      {/* Panel principal */}
      <Slide direction="up" in={isOpen} timeout={300}>
        <Paper
          elevation={16}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '85vh',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header del panel */}
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack direction="row" justifyContent="between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GroupsIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Aprendizaje Colaborativo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conecta, aprende y crece en CoomÜnity
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1}>
                <IconButton onClick={refreshRooms} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Stack>

            {/* Mostrar sala activa si existe */}
            {currentRoom && (
              <ActiveRoomDisplay
                room={currentRoom}
                onLeaveRoom={handleLeaveRoom}
              />
            )}

            {/* Error display */}
            {error && (
              <Alert 
                severity="error" 
                onClose={clearError}
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            )}
          </Box>

          {/* Tabs de navegación */}
          <Box sx={{ px: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 'auto',
                  px: 2,
                },
                '& .Mui-selected': {
                  color: '#8b5cf6',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#8b5cf6',
                },
              }}
            >
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <GroupsIcon fontSize="small" />
                    <Typography variant="body2">Todas las Salas</Typography>
                    <Chip label={rooms.length} size="small" />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlayIcon fontSize="small" />
                    <Typography variant="body2">En Vivo</Typography>
                    <Chip 
                      label={rooms.filter(r => r.status === 'active').length} 
                      size="small" 
                      color="success"
                    />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ScheduleIcon fontSize="small" />
                    <Typography variant="body2">Próximas</Typography>
                    <Chip 
                      label={rooms.filter(r => r.status === 'waiting').length} 
                      size="small" 
                      color="warning"
                    />
                  </Stack>
                }
              />
            </Tabs>
          </Box>

          {/* Contenido del panel */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 3, pt: 2 }}>
            {isLoading ? (
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Card key={i} sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Stack direction="row" spacing={2}>
                        <CircularProgress size={24} />
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Cargando salas de estudio...
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <StudyRoomList
                onJoinRoom={handleJoinRoom}
                onCreateRoom={handleCreateRoom}
                userId={userId}
                currentVideoId={currentVideoId}
              />
            )}
          </Box>

          {/* FAB para crear sala */}
          <Zoom in={isOpen && !currentRoom}>
            <Fab
              color="primary"
              onClick={() => setShowCreateDialog(true)}
              sx={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <AddIcon />
            </Fab>
          </Zoom>

          {/* Dialog para crear sala */}
          <StudyRoomCreator
            open={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onCreateRoom={handleCreateRoom}
          />
        </Paper>
      </Slide>
    </>
  );
}; 