import React from 'react';
import Box from '@mui/material/Box';
import { HomeWelcomeHeader } from '../HomeWelcomeHeader';

export const WelcomeWidget: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <HomeWelcomeHeader />
    </Box>
  );
};
