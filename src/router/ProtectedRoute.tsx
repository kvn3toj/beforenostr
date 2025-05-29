import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando, mostrar un spinner
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar las rutas hijas
  return <Outlet />;
}; 