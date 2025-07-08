import React from 'react';
import { Box, Typography } from '@mui/material';

const CosmicDashboardHeader: React.FC = () => (
  <Box mb={3} display="flex" alignItems="center" gap={2}>
    <img src="/logo-cosmic-brain.png" alt="Cosmic Brain" style={{ height: 48 }} />
    <Box>
      <Typography variant="h4" fontWeight="bold" color="primary">
        Cosmic Brain Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Observa, armoniza y evoluciona la inteligencia colectiva de CoomÜnity
      </Typography>
    </Box>
  </Box>
);

export default CosmicDashboardHeader;
