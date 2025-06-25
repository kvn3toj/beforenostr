import React from 'react';
import { Box } from '@mui/material';
import { MainModuleCards } from '../MainModuleCards';

export const MainModulesWidget: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <MainModuleCards />
    </Box>
  );
};
