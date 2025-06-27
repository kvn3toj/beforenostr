import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const DiscoveryTutorialsPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tutoriales de Descubrimiento
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Bienvenido a la sección de tutoriales. Aquí encontrarás guías interactivas para explorar y aprender a usar todas las funcionalidades de CoomÜnity.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DiscoveryTutorialsPage;
