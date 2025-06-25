// @ts-nocheck
import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Button, Avatar, AvatarGroup } from '@mui/material';
import { Groups, LiveTv, Schedule, ArrowForward } from '@mui/icons-material';

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
];

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

const MinimalistStudyRoomRow = ({ room }: { room: StudyRoom }) => {
  const isFull = room.status === 'full';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <Box sx={{ flex: 1, pr: 2 }}>
        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{room.title}</Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Creada por {room.author} | <Chip label={room.category} size="small" />
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 14 } }}>
                {[...Array(room.participants)].map((_, i) => <Avatar key={i}>{i+1}</Avatar>)}
            </AvatarGroup>
            <Typography variant="caption">{`${room.participants}/${room.maxParticipants}`}</Typography>
        </Box>
        <StatusIndicator status={room.status} />
        <Button
          variant="contained"
          size="small"
          disabled={isFull}
          endIcon={<ArrowForward />}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          Unirse
        </Button>
      </Box>
    </Box>
  );
};

export const UPlayStudyRooms: React.FC = () => {
  const [filter, setFilter] = useState<RoomStatus | 'all'>('all');

  const filteredRooms = mockStudyRooms.filter(room =>
    filter === 'all' || room.status === filter
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f8fafc', minHeight: '100vh', borderRadius: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Salas de Estudio
        </Typography>
        <Typography sx={{ color: '#475569', mt: 1, fontSize: '1.1rem' }}>
          Conecta, aprende y colabora con la comunidad en tiempo real.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        {(['all', 'live', 'upcoming'] as const).map(f => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            onClick={() => setFilter(f)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
          />
        ))}
      </Box>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: '16px',
          background: '#ffffff',
          borderColor: '#e2e8f0',
          overflow: 'hidden',
        }}
      >
        {filteredRooms.map((room, index) => (
          <React.Fragment key={room.id}>
            <MinimalistStudyRoomRow room={room} />
            {index < filteredRooms.length - 1 && <hr style={{ border: 'none', height: '1px', backgroundColor: '#f1f5f9' }} />}
          </React.Fragment>
        ))}
        {filteredRooms.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#64748b' }}>
              No hay salas disponibles en esta categoría.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UPlayStudyRooms;
