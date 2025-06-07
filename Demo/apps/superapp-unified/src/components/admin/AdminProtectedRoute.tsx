import React from 'react';
import { Outlet } from 'react-router-dom';

export const AdminProtectedRoute: React.FC = () => {
  // For now, just allow access - in production this would check admin role
  return <Outlet />;
}; 