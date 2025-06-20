/**
 * 🎮 Console Page - Enhanced Experience Management with Backend Integration
 * 
 * Página principal de la Consola de Experiencias conectada con Backend NestJS
 */

import React from 'react';
import { Box } from '@mui/material';
import ExperienceConsoleConnected from '../components/features/console/ExperienceConsoleConnected';

const ConsolePage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'auto' }}>
      <ExperienceConsoleConnected />
    </Box>
  );
};

export default ConsolePage;