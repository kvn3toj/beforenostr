import { useHasRole, useHasPermission } from './useHasRole';

/**
 * Hook personalizado para verificar si el usuario puede realizar una acción específica
 * Combina verificación de roles y permisos
 * @param action - La acción requerida (ej: 'create_user', 'manage_content')
 * @returns boolean - true si el usuario puede realizar la acción, false en caso contrario
 */
export const useCanPerformAction = (action: string): boolean => {
  // ⚠️ IMPORTANTE: Siempre llamar todos los hooks antes de cualquier lógica condicional
  const hasAdminRole = useHasRole('admin');
  const hasSuperAdminRole = useHasRole('Super Admin');
  
  // Pre-llamar todos los permisos que existen realmente en la base de datos
  const hasAdminViewAll = useHasPermission('admin:view_all');
  const hasAnalyticsRead = useHasPermission('analytics:read');
  const hasContentDelete = useHasPermission('content:delete');
  const hasContentRead = useHasPermission('content:read');
  const hasContentWrite = useHasPermission('content:write');
  const hasRolesRead = useHasPermission('roles:read');
  const hasRolesWrite = useHasPermission('roles:write');
  const hasUsersDelete = useHasPermission('users:delete');
  const hasUsersRead = useHasPermission('users:read');
  const hasUsersWrite = useHasPermission('users:write');

  // Si es admin o tiene permiso admin:view_all, permitir todas las acciones
  if (hasAdminRole || hasSuperAdminRole || hasAdminViewAll) {
    return true;
  }

  // Verificar permisos específicos para cada acción
  switch (action) {
    case 'create_user':
    case 'edit_user':
      return hasUsersWrite;
    
    case 'delete_user':
      return hasUsersDelete;
    
    case 'create_role':
    case 'edit_role':
      return hasRolesWrite;
    
    case 'delete_role':
      return hasRolesWrite; // Usar roles:write para eliminación también
    
    case 'create_permission':
    case 'edit_permission':
    case 'delete_permission':
      // Para permisos, usar admin:view_all ya que no hay permisos específicos
      return hasAdminViewAll;
    
    case 'create_content':
    case 'edit_content':
    case 'manage_world':
    case 'manage_playlist':
      return hasContentWrite;
    
    case 'delete_content':
      return hasContentDelete;
    
    default:
      return false;
  }
}; 