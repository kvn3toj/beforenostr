/**
 * 🎮 Console Page - Enhanced Experience Management
 * 
 * Página principal de la Consola de Experiencias mejorada
 */

import React from 'react';
import { Box } from '@mui/material';
import ExperienceConsoleEnhanced from '../components/features/console/ExperienceConsoleEnhanced';

const ConsolePage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'auto' }}>
      <ExperienceConsoleEnhanced />
    </Box>
  );
};

export default ConsolePage;