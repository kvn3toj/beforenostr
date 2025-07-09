import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Psychology } from '@mui/icons-material';
import CosmicBrainDashboard from './CosmicBrainDashboard';

// Lazy load additional pages for better performance
const CosmicBrainMetrics = React.lazy(() => import('./CosmicBrainMetrics'));
const CosmicBrainHarmony = React.lazy(() => import('./CosmicBrainHarmony'));

// Loading component
const LoadingComponent: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: 2
    }}
  >
    <Psychology sx={{ fontSize: 48, color: 'primary.main', animation: 'pulse 2s infinite' }} />
    <CircularProgress size={40} />
    <Typography variant="body1" color="text.secondary">
      Cargando Portal Cosmic Brain...
    </Typography>
  </Box>
);

const CosmicBrainRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {/* Main Dashboard */}
        <Route path="/" element={<CosmicBrainDashboard />} />
        <Route path="/dashboard" element={<CosmicBrainDashboard />} />
        
        {/* Metrics Page */}
        <Route path="/metrics" element={<CosmicBrainMetrics />} />
        
        {/* Harmony Page */}
        <Route path="/harmony" element={<CosmicBrainHarmony />} />
        
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/admin/cosmic-brain/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default CosmicBrainRouter;