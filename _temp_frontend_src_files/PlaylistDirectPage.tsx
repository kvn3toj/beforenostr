import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

interface PlaylistData {
  id: string;
  name: string;
  description?: string;
  mundo?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  videoItems?: any[];
}

export const PlaylistDirectPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching playlists from /playlists-direct...');
        
        const response = await fetch('http://localhost:3002/playlists-direct', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data: PlaylistData[] = await response.json();
        console.log('📦 Raw API response:', data);
        console.log('📊 Data type:', typeof data, 'Is array:', Array.isArray(data));
        console.log('📈 Data length:', data?.length);
        
        // The API returns an array directly, not wrapped in an object
        const playlistsArray = Array.isArray(data) ? data : [];
        console.log('✅ Setting playlists:', playlistsArray.length, 'items');
        setPlaylists(playlistsArray);
        setError(null);
        
        // Show success alert for debugging
        if (playlistsArray.length > 0) {
          console.log('🎉 Successfully loaded', playlistsArray.length, 'playlists');
        } else {
          console.warn('⚠️ API returned empty array');
        }
        
      } catch (err) {
        console.error('❌ Error fetching playlists:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        
        // Show alert for debugging
        alert(`Error loading playlists: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    console.log('🔄 Loading state: true');
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    console.log('❌ Error state:', error);
    return (
      <Container>
        <Box py={3}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Error al cargar las playlists: {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </Box>
      </Container>
    );
  }

  console.log('🎯 Rendering with playlists:', playlists.length, 'items');
  console.log('📋 Playlists data:', playlists);

  return (
    <Container maxWidth="lg">
      <Box py={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Playlists (Acceso Directo)
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/playlists')}
          >
            Ir a Playlists Gamificadas
          </Button>
        </Box>

        {/* Content */}
        {playlists.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay playlists disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Las playlists aparecerán aquí cuando estén disponibles.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {playlists.map((playlist) => (
              <Grid item xs={12} sm={6} md={4} key={playlist.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(`/playlists/${playlist.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {playlist.name}
                    </Typography>
                    
                    {playlist.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {playlist.description}
                      </Typography>
                    )}
                    
                    {playlist.mundo && (
                      <Typography variant="caption" color="primary">
                        Mundo: {playlist.mundo.name}
                      </Typography>
                    )}
                    
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        Videos: {playlist.videoItems?.length || 0}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Estado: {playlist.isActive ? 'Activa' : 'Inactiva'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Debug Info */}
        <Box mt={4} p={2} bgcolor="grey.100" borderRadius={1}>
          <Typography variant="caption" color="text.secondary">
            Debug: Mostrando {playlists.length} playlists desde /playlists-direct
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}; 