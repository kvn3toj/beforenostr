// @ts-nocheck
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
  Fab,
  Fade,
} from '@mui/material';
import {
  Groups,
  LiveTv,
  Schedule,
  ArrowForward,
  Add as AddIcon,
} from '@mui/icons-material';

type RoomStatus = 'live' | 'upcoming' | 'full';

interface StudyRoom {
  id: string;
  title: string;
  author: string;
  status: RoomStatus;
  participants: number;
  maxParticipants: number;
  category: string;
}

const mockStudyRooms: StudyRoom[] = [
  { id: '1', title: 'Repaso Final de React Hooks', author: 'Ana', status: 'live', participants: 12, maxParticipants: 20, category: 'React' },
  { id: '2', title: 'Debate sobre Arquitectura NestJS', author: 'Carlos', status: 'live', participants: 8, maxParticipants: 15, category: 'NestJS' },
  { id: '3', title: 'Taller de TypeScript Avanzado', author: 'Elena', status: 'upcoming', participants: 5, maxParticipants: 25, category: 'TypeScript' },
  { id: '4', title: 'Sesión de Dudas: Prisma ORM', author: 'David', status: 'full', participants: 10, maxParticipants: 10, category: 'Prisma' },
  { id: '5', title: 'Introducción a TailwindCSS', author: 'Sofia', status: 'upcoming', participants: 2, maxParticipants: 30, category: 'CSS' },
  { id: '6', title: 'Masterclass de Despliegue en Vercel', author: 'Laura', status: 'live', participants: 18, maxParticipants: 20, category: 'DevOps' },
  { id: '7', title: 'Q&A sobre React Server Components', author: 'Miguel', status: 'upcoming', participants: 15, maxParticipants: 50, category: 'React' },
];

const getCategoryStyle = (category: string, theme: any) => {
  const styles = {
    React: {
      gradient: `linear-gradient(45deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    },
    NestJS: {
      gradient: `linear-gradient(45deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
    },
    TypeScript: {
      gradient: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    Prisma: {
      gradient: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    CSS: {
      gradient: `linear-gradient(45deg, #264de4 0%, #06238b 100%)`,
    },
    DevOps: {
      gradient: `linear-gradient(45deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
    },
    default: {
      gradient: `linear-gradient(45deg, ${theme.palette.grey[700]} 0%, ${theme.palette.grey[900]} 100%)`,
    },
  };
  return styles[category] || styles.default;
};

const StudyRoomCard = ({ room }: { room: StudyRoom }) => {
  const theme = useTheme();
  const isFull = room.status === 'full';
  const categoryStyle = getCategoryStyle(room.category, theme);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        transition: 'all 0.3s ease',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <Box
        sx={{
          height: 80,
          background: categoryStyle.gradient,
          display: 'flex',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Chip
          label={room.category}
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.common.white, 0.2),
            color: theme.palette.common.white,
            fontWeight: 'bold',
          }}
        />
      </Box>
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {room.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Por {room.author}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AvatarGroup max={4}>
            {[...Array(room.participants)].map((_, i) => (
              <Avatar
                key={i}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  bgcolor: 'primary.light',
                }}
              >{`${i + 1}`}</Avatar>
            ))}
          </AvatarGroup>
          <Typography variant="body2" color="text.secondary">
            {room.participants} / {room.maxParticipants}
          </Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          p: 3,
          pt: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <StatusIndicator status={room.status} />
        <Button
          variant="contained"
          size="small"
          disabled={isFull}
          endIcon={<ArrowForward />}
        >
          {isFull ? 'Llena' : 'Unirse'}
        </Button>
      </CardActions>
    </Card>
  );
};

const StatusIndicator = ({ status }: { status: RoomStatus }) => {
  const styles = {
    live: { label: 'En Vivo', color: 'success.main', icon: <LiveTv fontSize="small" /> },
    upcoming: { label: 'Próxima', color: 'info.main', icon: <Schedule fontSize="small" /> },
    full: { label: 'Llena', color: 'text.disabled', icon: <Groups fontSize="small" /> },
  };
  const current = styles[status];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: current.color }}>
      {current.icon}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{current.label}</Typography>
    </Box>
  );
};

export const UPlayStudyRooms: React.FC = () => {
  const [filter, setFilter] = useState<RoomStatus | 'all'>('all');

  const filteredRooms = mockStudyRooms.filter(room =>
    filter === 'all' || room.status === filter
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, position: 'relative' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            letterSpacing: '-1px',
          }}
        >
          Salas de Estudio Colaborativo
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: '1.1rem' }}>
          Conecta, aprende y co-crea con la comunidad en tiempo real.
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 1, justifyContent: 'center' }}>
        {(['all', 'live', 'upcoming', 'full'] as const).map(f => (
          <Chip
            key={f}
            label={
              f === 'all'
                ? 'Todas'
                : f.charAt(0).toUpperCase() + f.slice(1)
            }
            onClick={() => setFilter(f)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
            sx={{ fontWeight: '500' }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredRooms.map((room, index) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Fade in timeout={300 * (index + 1)}>
              <div>
                <StudyRoomCard room={room} />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {filteredRooms.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>
            No hay salas disponibles en esta categoría.
          </Typography>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: { xs: 24, md: 40 },
          right: { xs: 24, md: 40 },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default UPlayStudyRooms;
