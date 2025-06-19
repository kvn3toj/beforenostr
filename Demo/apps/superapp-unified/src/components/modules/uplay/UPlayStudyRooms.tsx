import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
  IconButton,
  Fab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  alpha,
  keyframes,
  Badge,
} from '@mui/material';
import {
  Group,
  Add,
  VideoCall,
  Chat,
  School,
  PlayArrow,
  People,
  Schedule,
  Star,
  Lock,
  Public,
  Person,
  Close,
  Send,
  VolumeUp,
  VolumeOff,
  Videocam,
  VideocamOff,
} from '@mui/icons-material';

// Animaciones
const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

interface StudyRoom {
  id: string;
  name: string;
  description: string;
  host: {
    id: string;
    name: string;
    avatar: string;
  };
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }>;
  currentVideo?: {
    id: string;
    title: string;
    thumbnail: string;
    currentTime: number;
    duration: number;
  };
  maxParticipants: number;
  isPublic: boolean;
  category: string;
  createdAt: Date;
  isActive: boolean;
}

const UPlayStudyRooms: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([
    {
      id: '1',
      name: 'Gamificación Avanzada',
      description: 'Explorando técnicas avanzadas de gamificación en educación',
      host: {
        id: 'host1',
        name: 'María González',
        avatar: '👩‍🏫',
      },
      participants: [
        { id: '1', name: 'Juan Pérez', avatar: '👨‍💻', isOnline: true },
        { id: '2', name: 'Ana López', avatar: '👩‍🎓', isOnline: true },
        { id: '3', name: 'Carlos Ruiz', avatar: '👨‍🎓', isOnline: false },
      ],
      currentVideo: {
        id: 'v1',
        title: 'Introducción a la Gamificación',
        thumbnail: '🎮',
        currentTime: 180,
        duration: 600,
      },
      maxParticipants: 8,
      isPublic: true,
      category: 'Gamificación',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      isActive: true,
    },
    {
      id: '2',
      name: 'Narrativa Digital',
      description: 'Creando historias inmersivas para contenido educativo',
      host: {
        id: 'host2',
        name: 'Roberto Silva',
        avatar: '👨‍💼',
      },
      participants: [
        { id: '4', name: 'Sofia Chen', avatar: '👩‍💻', isOnline: true },
        { id: '5', name: 'Diego Morales', avatar: '👨‍🎨', isOnline: true },
      ],
      maxParticipants: 6,
      isPublic: true,
      category: 'Narrativa',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      isActive: true,
    },
    {
      id: '3',
      name: 'Estudio Privado',
      description: 'Sesión privada de repaso para exámenes',
      host: {
        id: 'host3',
        name: 'Elena Torres',
        avatar: '👩‍🔬',
      },
      participants: [
        { id: '6', name: 'Miguel Hernández', avatar: '👨‍💼', isOnline: true },
      ],
      maxParticipants: 4,
      isPublic: false,
      category: 'Estudio',
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      isActive: false,
    },
  ]);

  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);

  // Componente de tarjeta de sala de estudio
  const StudyRoomCard: React.FC<{ room: StudyRoom }> = ({ room }) => {
    const onlineParticipants = room.participants.filter(p => p.isOnline).length;
    const totalParticipants = room.participants.length;
    const occupancyPercentage = (totalParticipants / room.maxParticipants) * 100;

    const getCategoryColor = (category: string) => {
      switch (category.toLowerCase()) {
        case 'gamificación': return '#9c27b0';
        case 'narrativa': return '#2196f3';
        case 'estudio': return '#4caf50';
        default: return '#757575';
      }
    };

    return (
      <Card
        sx={{
          height: '100%',
          background: alpha('#ffffff', 0.05),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 4,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: room.isActive ? `${pulseAnimation} 3s ease-in-out infinite` : 'none',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 16px 48px ${alpha(getCategoryColor(room.category), 0.3)}`,
            border: `1px solid ${alpha(getCategoryColor(room.category), 0.3)}`,
          },
        }}
        onClick={() => {
          setSelectedRoom(room);
          setJoinRoomOpen(true);
        }}
      >
        {/* Indicador de estado */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
          }}
        >
          <Chip
            label={room.isActive ? 'Activa' : 'Inactiva'}
            size="small"
            sx={{
              bgcolor: room.isActive ? '#4caf50' : '#757575',
              color: 'white',
              fontWeight: 'bold',
              animation: room.isActive ? `${floatAnimation} 2s ease-in-out infinite` : 'none',
            }}
          />
        </Box>

        {/* Indicador de privacidad */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(room.isPublic ? '#4caf50' : '#ff9800', 0.8),
              color: 'white',
              width: 32,
              height: 32,
            }}
          >
            {room.isPublic ? <Public sx={{ fontSize: 16 }} /> : <Lock sx={{ fontSize: 16 }} />}
          </Avatar>
        </Box>

        <CardContent sx={{ p: 3, pt: 5 }}>
          {/* Información del host */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ width: 48, height: 48, fontSize: '1.5rem' }}>
              {room.host.avatar}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {room.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Anfitrión: {room.host.name}
              </Typography>
            </Box>
          </Box>

          {/* Descripción */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40,
            }}
          >
            {room.description}
          </Typography>

          {/* Video actual */}
          {room.currentVideo && (
            <Card
              sx={{
                background: alpha(getCategoryColor(room.category), 0.1),
                border: `1px solid ${alpha(getCategoryColor(room.category), 0.2)}`,
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                  {room.currentVideo.thumbnail}
                </Typography>
                <Box flex={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {room.currentVideo.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Box
                      sx={{
                        width: 80,
                        height: 4,
                        bgcolor: alpha('#000', 0.2),
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(room.currentVideo.currentTime / room.currentVideo.duration) * 100}%`,
                          height: '100%',
                          bgcolor: getCategoryColor(room.category),
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {Math.floor(room.currentVideo.currentTime / 60)}:{(room.currentVideo.currentTime % 60).toString().padStart(2, '0')} /
                      {Math.floor(room.currentVideo.duration / 60)}:{(room.currentVideo.duration % 60).toString().padStart(2, '0')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          )}

          {/* Participantes */}
          <Box mb={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Participantes
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: getCategoryColor(room.category) }}>
                {totalParticipants}/{room.maxParticipants}
              </Typography>
            </Box>

            {/* Avatares de participantes */}
            <Box display="flex" gap={0.5} mb={1}>
              {room.participants.slice(0, 6).map((participant) => (
                <Badge
                  key={participant.id}
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: participant.isOnline ? '#4caf50' : '#757575',
                      boxShadow: '0 0 0 2px #fff',
                    }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                    {participant.avatar}
                  </Avatar>
                </Badge>
              ))}
              {room.participants.length > 6 && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#000', 0.5), fontSize: '0.75rem' }}>
                  +{room.participants.length - 6}
                </Avatar>
              )}
            </Box>

            {/* Barra de ocupación */}
            <Box
              sx={{
                width: '100%',
                height: 6,
                bgcolor: alpha('#000', 0.1),
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${occupancyPercentage}%`,
                  height: '100%',
                  bgcolor: occupancyPercentage > 80 ? '#f44336' : occupancyPercentage > 60 ? '#ff9800' : '#4caf50',
                  borderRadius: 3,
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>

          {/* Metadatos */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={room.category}
              size="small"
              sx={{
                bgcolor: alpha(getCategoryColor(room.category), 0.2),
                color: getCategoryColor(room.category),
                border: `1px solid ${alpha(getCategoryColor(room.category), 0.3)}`,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {onlineParticipants} en línea
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Diálogo para unirse a sala
  const JoinRoomDialog = () => (
    <Dialog
      open={joinRoomOpen}
      onClose={() => setJoinRoomOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: alpha('#000', 0.9),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
        }
      }}
    >
      {selectedRoom && (
        <>
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Unirse a {selectedRoom.name}
              </Typography>
              <IconButton onClick={() => setJoinRoomOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            <Box textAlign="center" mb={3}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  mx: 'auto',
                  mb: 2,
                  bgcolor: alpha('#1976d2', 0.2),
                  border: `2px solid ${alpha('#1976d2', 0.3)}`,
                }}
              >
                <Group sx={{ fontSize: '2rem' }} />
              </Avatar>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {selectedRoom.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedRoom.description}
              </Typography>

              <Box display="flex" justifyContent="center" gap={2} mb={3}>
                <Chip
                  icon={<People />}
                  label={`${selectedRoom.participants.length}/${selectedRoom.maxParticipants} participantes`}
                  variant="outlined"
                />
                <Chip
                  icon={selectedRoom.isPublic ? <Public /> : <Lock />}
                  label={selectedRoom.isPublic ? 'Pública' : 'Privada'}
                  variant="outlined"
                />
              </Box>

              {selectedRoom.currentVideo && (
                <Card
                  sx={{
                    background: alpha('#1976d2', 0.1),
                    border: `1px solid ${alpha('#1976d2', 0.2)}`,
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Video Actual:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5">{selectedRoom.currentVideo.thumbnail}</Typography>
                    <Typography variant="body2">{selectedRoom.currentVideo.title}</Typography>
                  </Box>
                </Card>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              variant="outlined"
              onClick={() => setJoinRoomOpen(false)}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<Group />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                fontWeight: 'bold',
              }}
            >
              Unirse a la Sala
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  // Diálogo para crear sala
  const CreateRoomDialog = () => {
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    return (
      <Dialog
        open={createRoomOpen}
        onClose={() => setCreateRoomOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: alpha('#000', 0.9),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Crear Nueva Sala de Estudio
          </Typography>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la sala"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box display="flex" gap={1}>
            <Chip
              icon={<Public />}
              label="Pública"
              variant={isPublic ? 'filled' : 'outlined'}
              onClick={() => setIsPublic(true)}
              color={isPublic ? 'primary' : 'default'}
            />
            <Chip
              icon={<Lock />}
              label="Privada"
              variant={!isPublic ? 'filled' : 'outlined'}
              onClick={() => setIsPublic(false)}
              color={!isPublic ? 'secondary' : 'default'}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={() => setCreateRoomOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            disabled={!roomName.trim()}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              fontWeight: 'bold',
            }}
          >
            Crear Sala
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          background: alpha('#ffffff', 0.05),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 4,
          p: 3,
          mb: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            👥 Salas de Estudio Colaborativas
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateRoomOpen(true)}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              fontWeight: 'bold',
            }}
          >
            Crear Sala
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Únete a salas de estudio colaborativas donde puedes aprender junto a otros jugadores, 
          ver videos sincronizados y participar en discusiones en tiempo real.
        </Typography>
      </Card>

      {/* Grid de salas */}
      <Grid container spacing={3}>
        {studyRooms.map((room) => (
          <Grid item xs={12} sm={6} lg={4} key={room.id}>
            <StudyRoomCard room={room} />
          </Grid>
        ))}
      </Grid>

      {/* Estado vacío si no hay salas */}
      {studyRooms.length === 0 && (
        <Card
          sx={{
            background: alpha('#ffffff', 0.05),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
          }}
        >
          <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            No hay salas activas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            ¡Sé el primero en crear una sala de estudio y invita a otros jugadores a aprender juntos!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateRoomOpen(true)}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              fontWeight: 'bold',
            }}
          >
            Crear Primera Sala
          </Button>
        </Card>
      )}

      {/* Diálogos */}
      <JoinRoomDialog />
      <CreateRoomDialog />
    </Box>
  );
};

export default UPlayStudyRooms; 