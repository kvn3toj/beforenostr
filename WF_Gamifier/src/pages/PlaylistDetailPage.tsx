import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { usePlaylist } from '../hooks/usePlaylist';

export const PlaylistDetailPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { data: playlist, isLoading, error } = usePlaylist(playlistId || '');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  if (!playlistId) {
    return (
      <Container>
        <Alert severity="error">No se encontró el ID de la playlist</Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !playlist) {
    return (
      <Container>
        <Alert severity="error">
          Error al cargar la playlist: {error?.message || 'Playlist no encontrada'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={3}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton 
            onClick={() => navigate('/playlists')}
            sx={{ mr: 2 }}
            aria-label="volver"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {playlist.name}
          </Typography>
        </Box>

        {/* Actions Bar */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            // onClick={handleAddVideo} // To be implemented
          >
            Añadir nuevo video
          </Button>

          <Box>
            <IconButton 
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              <ViewListIcon />
            </IconButton>
            <IconButton 
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              <ViewModuleIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box>
          {/* Placeholder for videos grid/list */}
          <Typography color="text.secondary" align="center">
            No hay videos en esta playlist. Haz clic en "Añadir nuevo video" para comenzar.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}; 