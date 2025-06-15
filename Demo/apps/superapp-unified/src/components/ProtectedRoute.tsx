import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppLayoutSkeleton } from './ui/SkeletonLoaders';
import { AppLayout } from './layout/AppLayout';

/**
 * ProtectedRoute Component
 * 
 * Protege las rutas que requieren autenticación.
 * - Si el usuario está cargando, muestra un skeleton loader
 * - Si el usuario no está autenticado, redirige a login
 * - Si el usuario está autenticado, renderiza AppLayout con las rutas hijas
 */
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar skeleton mientras se verifica la autenticación
  if (loading) {
    return <AppLayoutSkeleton />;
  }

  // Si no está autenticado, redirigir a login con la URL de retorno
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔧 SOLUCIÓN CRÍTICA: Usar AppLayout para proporcionar Sidebar con enlaces ÜPlay
  // Si está autenticado, renderizar AppLayout que incluye Sidebar y BottomNavigation
  return <AppLayout />;
}; 