import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

export const AdminLayout: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ⚙️ Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Panel de administración en desarrollo
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
}; 