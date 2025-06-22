import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
          ¡Oops! Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          La página que buscas podría haber sido eliminada, cambiado de nombre o no existe.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
