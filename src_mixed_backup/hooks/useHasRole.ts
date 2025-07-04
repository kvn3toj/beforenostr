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

  // Manejar tanto la estructura actual como la legacy
  // user.role (singular, legacy) o user.roles (array, actual)
  let userRoles: string[] = [];

  // Si existe user.roles (array), usarlo
  if (user.roles && Array.isArray(user.roles)) {
    userRoles = user.roles;
  }
  // Si existe user.role.name (objeto legacy), convertir a array
  else if (user.role && typeof user.role === 'object' && 'name' in user.role) {
    userRoles = [user.role.name];
  }
  // Si user.role es string directo
  else if (typeof user.role === 'string') {
    userRoles = [user.role];
  }

  console.log('>>> useHasRole: User roles:', userRoles, 'Required role:', requiredRoleName);

  // Mapeo de roles para compatibilidad
  const roleMapping: Record<string, string[]> = {
    'Super Admin': ['admin', 'Super Admin'],
    'admin': ['admin', 'Super Admin'],
    'moderator': ['moderator', 'admin', 'Super Admin'],
    'user': ['user', 'moderator', 'admin', 'Super Admin']
  };

  // Obtener los roles equivalentes al requerido
  const equivalentRoles = roleMapping[requiredRoleName] || [requiredRoleName];

  // Verificar si el usuario tiene alguno de los roles equivalentes
  return userRoles.some(role => equivalentRoles.includes(role));
};

/**
 * Hook personalizado para verificar si el usuario actual tiene un permiso específico
 * @param requiredPermission - El nombre del permiso requerido (ej: 'users:write', 'content:read')
 * @returns boolean - true si el usuario tiene el permiso requerido, false en caso contrario
 */
export const useHasPermission = (requiredPermission: string): boolean => {
  const { user, isLoading } = useAuth();

  // Si está cargando o no hay usuario, retornar false
  if (isLoading || !user) {
    return false;
  }

  // Si no hay permisos, retornar false
  if (!user.permissions || !Array.isArray(user.permissions)) {
    return false;
  }

  console.log('>>> useHasPermission: User permissions:', user.permissions, 'Required permission:', requiredPermission);

  // Verificar permiso específico
  if (user.permissions.includes(requiredPermission)) {
    return true;
  }

  // Verificar permisos administrativos globales
  const adminPermissions = ['admin:view_all', 'admin:all', '*'];
  if (adminPermissions.some(perm => user.permissions.includes(perm))) {
    return true;
  }

  return false;
}; 