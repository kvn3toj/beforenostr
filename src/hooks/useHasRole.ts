import { useAuth } from './useAuth';

/**
 * Hook personalizado para verificar si el usuario actual tiene un rol específico
 * @param requiredRoleName - El nombre del rol requerido
 * @returns boolean - true si el usuario tiene el rol requerido, false en caso contrario
 */
export const useHasRole = (requiredRoleName: string): boolean => {
  const { user, isLoading } = useAuth();

  // Si está cargando o no hay usuario, retornar false
  if (isLoading || !user) {
    return false;
  }

  // Verificar si el usuario tiene un rol asignado
  if (!user.role) {
    return false;
  }

  // Comparar el nombre del rol del usuario con el rol requerido
  return user.role.name === requiredRoleName;
}; 