import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import GuardianCard from './GuardianCard';
import TransformPromptTool from './TransformPromptTool';
import CosmicWisdom from './CosmicWisdom';
import GuardianDocsLinks from './GuardianDocsLinks';
import { GUARDIANS } from './guardianData';

const Portal: React.FC = () => {
  return (
    <Box className="guardian-home-container" sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
      {/* Header Filosófico */}
      <Typography variant="h2" align="center" gutterBottom className="guardian-text-gradient">
        Portal de Guardianes Digitales
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 4 }}>
        "Cada línea de código debe ser una oración, cada función un ritual, y cada interacción una oportunidad para la transformación."
      </Typography>
      <Divider sx={{ mb: 4 }} />
      {/* Sección de Guardianes */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Los 12 Guardianes
        </Typography>
        <Grid container spacing={3}>
          {GUARDIANS.map((g) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={g.id}>
              <GuardianCard guardian={g} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider sx={{ mb: 6 }} />
      {/* Herramienta Transformar Prompt */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Herramienta: Transformar Prompt
        </Typography>
        <TransformPromptTool />
      </Box>
      <Divider sx={{ mb: 6 }} />
      {/* Sabiduría Cósmica y Documentación */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <CosmicWisdom />
        </Grid>
        <Grid item xs={12} md={6}>
          <GuardianDocsLinks />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Portal;
