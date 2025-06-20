import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppLayoutSkeleton } from './ui/SkeletonLoaders';
import { AppLayout } from './layout/AppLayout';

/**
 * Componente para proteger rutas que requieren autenticación.
 * - Muestra un esqueleto de carga mientras se verifica el estado de autenticación.
 * - Si el usuario no está autenticado, redirige a la página de login.
 * - Si el usuario está autenticado, renderiza el AppLayout principal, que a su vez
 *   manejará el renderizado de las rutas hijas a través de su propio Outlet.
 */
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AppLayoutSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 롤백: La lógica correcta es simplemente renderizar AppLayout.
  // AppLayout contiene su propio <Outlet /> para manejar las rutas anidadas.
  return <AppLayout />;
};
