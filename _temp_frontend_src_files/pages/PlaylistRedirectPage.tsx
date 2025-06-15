import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress } from '@mui/material';

export const PlaylistRedirectPage: React.FC = () => {
  useEffect(() => {
    // Log para debug
    console.log('PlaylistRedirectPage: Redirigiendo de /playlist a /playlists');
  }, []);

  return (
    <Container>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Redirigiendo a playlists...
        </Typography>
      </Box>
      <Navigate to="/playlists" replace />
    </Container>
  );
}; 