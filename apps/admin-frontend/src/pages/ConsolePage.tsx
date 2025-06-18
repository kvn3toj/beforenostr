/**
 * 🎮 Console Page - Gamifier Admin
 * 
 * Página principal de la Consola de Experiencias CoomÜnity
 * Permite al Gamifier diseñar, configurar y desplegar experiencias gamificadas hacia la SuperApp
 */

import React from 'react';
import { Box } from '@mui/material';
import ExperienceConsole from '../components/features/console/ExperienceConsole';

const ConsolePage: React.FC = () => {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100vh',
      overflow: 'auto',
      bgcolor: 'background.default' 
    }}>
      <ExperienceConsole />
    </Box>
  );
};

export default ConsolePage;