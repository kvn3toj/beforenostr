// 🏫 Componente: Lista de Salas de Estudio Colaborativas
// Muestra salas disponibles, permite filtrar y unirse a ellas
// Integra con StudyRoomCreator para crear nuevas salas

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Skeleton,
  Fade,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Psychology as PhilosofiaIcon,
  SportsEsports as GamificacionIcon,
  Handshake as ColaboracionIcon,
  Favorite as AyniIcon,
  Public as BienComunIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { StudyRoom, StudyRoomFilters } from '../../../../types/study-rooms';
import { StudyRoomCreator } from './StudyRoomCreator';

interface StudyRoomListProps {
  onJoinRoom?: (roomId: string) => Promise<void>;
  onCreateRoom?: (roomData: Partial<StudyRoom>) => Promise<void>;
  userId?: string;
  currentVideoId?: string;
}

export const StudyRoomList: React.FC<StudyRoomListProps> = ({
  onJoinRoom,
  onCreateRoom,
  userId = 'current-user',
  currentVideoId,
}) => {
  const theme = useTheme();

  // Estado básico para desarrollo
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateRoom = useCallback(async (roomData: Partial<StudyRoom>) => {
    if (!onCreateRoom) return;

    setIsCreating(true);
    try {
      await onCreateRoom(roomData);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  }, [onCreateRoom]);

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700} flex={1}>
          Salas de Estudio Colaborativas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #6c5ce7 100%)',
            color: '#fff',
            minHeight: 48,
            minWidth: 48,
            borderRadius: 3,
            fontWeight: 700,
            boxShadow: '0 2px 8px 0 rgba(108,92,231,0.12)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e40af 0%, #7e22ce 100%)',
              boxShadow: '0 4px 16px 0 rgba(108,92,231,0.18)',
            },
          }}
        >
          Crear Sala
        </Button>
      </Stack>

      {/* Búsqueda */}
      <TextField
        placeholder="Buscar salas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        fullWidth
      />

      {/* Placeholder para salas */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        textAlign="center"
      >
        <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" mb={1}>
          No hay salas disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Crea la primera sala de estudio colaborativa
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #6c5ce7 100%)',
            color: '#fff',
            minHeight: 48,
            minWidth: 48,
            borderRadius: 3,
            fontWeight: 700,
            boxShadow: '0 2px 8px 0 rgba(108,92,231,0.12)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e40af 0%, #7e22ce 100%)',
              boxShadow: '0 4px 16px 0 rgba(108,92,231,0.18)',
            },
          }}
        >
          Crear Primera Sala
        </Button>
      </Box>

      {/* Dialog para crear sala */}
      <StudyRoomCreator
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateRoom={handleCreateRoom}
        isCreating={isCreating}
      />
    </Box>
  );
};
