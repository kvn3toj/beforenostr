import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogActions from '@mui/material/DialogActions';
import FormGroup from '@mui/material/FormGroup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { Role, AvailablePermission } from '../types/user.types';
import { useRolesQuery } from '../hooks/useRolesQuery';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole, updateRole, deleteRole, UpdateRoleData, FetchRolesParams } from '../services/role.service';
import { RoleForm, CreateRoleData } from '../components/features/roles/components/RoleForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { useHasRole } from '../hooks/useHasRole';
import { useAvailablePermissionsQuery } from '../hooks/features/roles/useAvailablePermissionsQuery';
import { useUpdateRolePermissionsMutation } from '../hooks/features/roles/useUpdateRolePermissionsMutation';
import { useCanPerformAction } from '../hooks/useCanPerformAction';
import { formatDate } from '../utils/dateUtils';
import { useAnalytics } from '../hooks/useAnalytics';

// Type for update mutation data
type UpdateRoleMutationData = {
  id: string;
  data: UpdateRoleData;
};

export const RolesPage: React.FC = React.memo(() => {
  console.log('>>> RolesPage: Component rendering');
  
  // Verificar permisos
  const canManageRoles = useCanPerformAction('create_role');
  console.log('>>> RolesPage: canManageRoles:', canManageRoles);

  // Initialize analytics tracking
  const { trackPermissionsFunnel, trackPageVisit, trackInteraction, trackError } = useAnalytics();

  // Track page visit when component mounts
  React.useEffect(() => {
    trackPageVisit('roles_page', {
      userCanManageRoles: canManageRoles,
      timestamp: new Date().toISOString()
    });
    trackPermissionsFunnel('ROLES_PAGE_VISITED', {
      hasManagePermissions: canManageRoles
    });
  }, [canManageRoles, trackPageVisit, trackPermissionsFunnel]);

  // States for dialogs
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [roleToManagePermissions, setRoleToManagePermissions] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // States for pagination, sorting, and filtering
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState({
    name: '',
  });

  // Queries and mutations
  const { data: rolesData, isLoading, error } = useRolesQuery({
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
  });

  console.log('>>> RolesPage: useRolesQuery status:', { isLoading, error, rolesData });

  const roles = rolesData?.data || [];
  const totalCount = rolesData?.count || 0;

  console.log('>>> RolesPage: Data processed:', { roles, totalCount, rolesLength: roles.length });

  // Log detailed role data for debugging
  if (roles.length > 0) {
    console.log('>>> RolesPage: First role data:', roles[0]);
    roles.forEach((role, index) => {
      console.log(`>>> RolesPage: Role ${index}:`, {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        createdAt_type: typeof role.createdAt,
        permissions: role.permissions
      });
    });
  }

  const queryClient = useQueryClient();

  // Create mutation
  const { mutate: createRoleMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateRoleData) => createRole(data),
    onSuccess: () => {
      toast.success('Rol creado exitosamente');
      setIsCreateRoleDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el rol: ${error.message}`);
    },
  });

  // Update mutation
  const { mutate: updateRoleMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: UpdateRoleMutationData) => updateRole(id, data),
    onSuccess: () => {
      toast.success('Rol actualizado exitosamente');
      setIsEditDialogOpen(false);
      setRoleToEdit(null);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el rol: ${error.message}`);
    },
  });

  // Delete mutation
  const { mutate: deleteRoleMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      toast.success('Rol eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el rol: ${error.message}`);
    },
  });

  // Add permissions query
  const { 
    data: availablePermissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
    error: permissionsError
  } = useAvailablePermissionsQuery();

  // Add permissions mutation
  const { mutate: updatePermissionsMutation, isPending: isUpdatingPermissions } = useUpdateRolePermissionsMutation();

  // Effect to initialize selectedPermissions when roleToManagePermissions changes
  useEffect(() => {
    if (roleToManagePermissions) {
      setSelectedPermissions(roleToManagePermissions.permissions);
    }
  }, [roleToManagePermissions]);

  // Effect to track permissions dialog state and available permissions loading
  useEffect(() => {
    if (isPermissionsDialogOpen && roleToManagePermissions) {
      // Track when permissions dialog is opened
      trackPermissionsFunnel('PERMISSIONS_DIALOG_OPENED', {
        roleId: roleToManagePermissions.id,
        roleName: roleToManagePermissions.name,
        currentPermissionCount: roleToManagePermissions.permissions.length
      });

      // Track available permissions loading state
      if (isLoadingPermissions) {
        trackPermissionsFunnel('PERMISSIONS_LOADING_STARTED', {
          roleId: roleToManagePermissions.id,
          roleName: roleToManagePermissions.name
        });
      } else if (isErrorPermissions) {
        trackError('permissions_loading_error', permissionsError || new Error('Unknown permissions error'), {
          funnel: 'permissions_management',
          step: 'permissions_loading',
          roleId: roleToManagePermissions.id
        });
        trackPermissionsFunnel('PERMISSIONS_LOADING_FAILED', {
          roleId: roleToManagePermissions.id,
          roleName: roleToManagePermissions.name,
          error: permissionsError?.message || 'Unknown error'
        });
      } else if (availablePermissions) {
        trackPermissionsFunnel('PERMISSIONS_LOADING_SUCCESS', {
          roleId: roleToManagePermissions.id,
          roleName: roleToManagePermissions.name,
          availablePermissionCount: availablePermissions.length,
          currentPermissionCount: roleToManagePermissions.permissions.length
        });
      }
    }
  }, [isPermissionsDialogOpen, roleToManagePermissions, isLoadingPermissions, isErrorPermissions, availablePermissions, permissionsError, trackPermissionsFunnel, trackError]);

  // Handler for permission checkbox changes
  const handlePermissionChange = (permission: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // Track permission selection change
    trackPermissionsFunnel('PERMISSION_TOGGLED', {
      roleId: roleToManagePermissions?.id,
      roleName: roleToManagePermissions?.name,
      permission,
      checked: event.target.checked,
      currentPermissionCount: selectedPermissions.length
    });

    if (event.target.checked) {
      setSelectedPermissions([...selectedPermissions, permission]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    }
  };

  // Handler for saving permissions
  const handleSavePermissions = () => {
    if (!roleToManagePermissions) {
      toast.error('Error: No hay rol seleccionado para actualizar permisos');
      trackError('permissions_save_error', new Error('No role selected for permissions update'), {
        funnel: 'permissions_management',
        step: 'save_attempt'
      });
      return;
    }

    const originalPermissions = roleToManagePermissions.permissions;
    const addedPermissions = selectedPermissions.filter(p => !originalPermissions.includes(p));
    const removedPermissions = originalPermissions.filter(p => !selectedPermissions.includes(p));

    // Track save attempt with details
    trackPermissionsFunnel('PERMISSIONS_SAVE_ATTEMPTED', {
      roleId: roleToManagePermissions.id,
      roleName: roleToManagePermissions.name,
      originalPermissionCount: originalPermissions.length,
      newPermissionCount: selectedPermissions.length,
      addedPermissions,
      removedPermissions,
      totalChanges: addedPermissions.length + removedPermissions.length
    });

    updatePermissionsMutation({
      roleId: roleToManagePermissions.id,
      permissions: selectedPermissions
    });
    setIsPermissionsDialogOpen(false);
    setRoleToManagePermissions(null);
  };

  // Handler for closing permissions dialog
  const handleClosePermissionsDialog = () => {
    // Track abandonment if changes were made but not saved
    if (roleToManagePermissions) {
      const originalPermissions = roleToManagePermissions.permissions;
      const hasChanges = JSON.stringify(selectedPermissions.sort()) !== JSON.stringify(originalPermissions.sort());
      
      if (hasChanges) {
        trackPermissionsFunnel('PERMISSIONS_DIALOG_ABANDONED', {
          roleId: roleToManagePermissions.id,
          roleName: roleToManagePermissions.name,
          originalPermissionCount: originalPermissions.length,
          modifiedPermissionCount: selectedPermissions.length,
          hadUnsavedChanges: true
        });
      } else {
        trackPermissionsFunnel('PERMISSIONS_DIALOG_CLOSED', {
          roleId: roleToManagePermissions.id,
          roleName: roleToManagePermissions.name,
          hadUnsavedChanges: false
        });
      }
    }

    setIsPermissionsDialogOpen(false);
    setRoleToManagePermissions(null);
    setSelectedPermissions([]);
  };

  // Handlers for pagination, sorting, and filtering
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when changing page size
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      // Toggle direction
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortBy(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: event.target.value });
    setPage(0); // Reset to first page when changing filters
  };

  // Memoized render functions for columns
  const renderPermissions = useCallback((role: Role) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 300 }}>
      {role.permissions.map((permission, index) => (
        <Chip
          key={`${role.id}-permission-${index}`}
          label={permission}
          size="small"
          variant="outlined"
          color="primary"
        />
      ))}
    </Box>
  ), []);

  const renderDate = useCallback((role: Role) => (
    <Typography noWrap>
      {formatDate(role.createdAt)}
    </Typography>
  ), []);

  const renderActions = useCallback((role: Role) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      <Tooltip title={canManageRoles ? "Gestionar permisos" : "No tienes permiso para gestionar permisos"}>
        <span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              
              // Track role selection for permissions management
              trackPermissionsFunnel('ROLE_SELECTED_FOR_PERMISSIONS', {
                roleId: role.id,
                roleName: role.name,
                currentPermissionCount: role.permissions.length,
                userCanManageRoles: canManageRoles
              });
              trackInteraction('permissions_management_click', {
                roleId: role.id,
                roleName: role.name
              });

              setRoleToManagePermissions(role);
              setIsPermissionsDialogOpen(true);
            }}
            disabled={!canManageRoles}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={canManageRoles ? "Editar rol" : "No tienes permiso para editar roles"}>
        <span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              
              // Track role edit interaction
              trackInteraction('role_edit_click', {
                roleId: role.id,
                roleName: role.name
              });

              setRoleToEdit(role);
              setIsEditDialogOpen(true);
            }}
            disabled={!canManageRoles}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={canManageRoles ? "Eliminar rol" : "No tienes permiso para eliminar roles"}>
        <span>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              
              // Track role delete interaction
              trackInteraction('role_delete_click', {
                roleId: role.id,
                roleName: role.name
              });

              setRoleToDelete(role);
              setIsDeleteDialogOpen(true);
            }}
            disabled={!canManageRoles}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  ), [canManageRoles, trackPermissionsFunnel, trackInteraction]);

  // Memoized columns with stable render functions
  const roleColumns = useMemo(() => [
    {
      header: 'Nombre',
      field: 'name',
      width: '20%',
      sortField: 'name',
    },
    {
      header: 'Descripción',
      field: 'description',
      width: '30%',
      sortField: 'description',
    },
    {
      header: 'Permisos',
      width: '30%',
      render: renderPermissions,
    },
    {
      header: 'Creado',
      field: 'createdAt',
      width: '20%',
      sortField: 'createdAt',
      render: renderDate,
    },
    {
      header: 'Acciones',
      width: '20%',
      align: 'center',
      render: renderActions,
    },
  ], [canManageRoles, renderPermissions, renderDate, renderActions]);

  const handleRowClick = (role: Role) => {
    console.log('Row clicked:', role);
    // TODO: Implement navigation to role details or permission view
  };

  const handleCreateRole = (data: CreateRoleData) => {
    createRoleMutation(data);
  };

  const handleUpdateRole = (data: CreateRoleData) => {
    if (!roleToEdit) {
      toast.error('Error: No hay rol seleccionado para editar');
      return;
    }
    updateRoleMutation({ id: roleToEdit.id, data });
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setRoleToEdit(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!roleToDelete) {
      toast.error('Error: No hay rol seleccionado para eliminar');
      return;
    }
    deleteRoleMutation(roleToDelete.id);
  };

  // Early returns AFTER all hooks have been declared
  if (isLoading) {
    console.log('>>> RolesPage: Loading state');
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading roles...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    console.error('>>> RolesPage: Error loading roles:', error);
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Error loading roles: {error?.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  console.log('>>> RolesPage: About to render main content with roles:', roles.length);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestión de Roles
          </Typography>
          <Tooltip title={canManageRoles ? "Crear nuevo rol" : "No tienes permiso para crear roles"}>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCreateRoleDialogOpen(true)}
                disabled={!canManageRoles}
              >
                Crear Nuevo Rol
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            size="small"
            value={filters.name}
            onChange={handleFilterChange}
            sx={{ minWidth: 300 }}
          />
        </Stack>

        <DataTable
          data={roles}
          columns={roleColumns}
          isLoading={isLoading}
          isError={!!error}
          errorMessage={error?.message}
          onRowClick={handleRowClick}
          emptyMessage="No hay roles disponibles. ¡Crea el primer rol!"
          // Pagination props
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          // Sorting props
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          // Filter props
          filters={filters}
        />

        {/* Create Role Dialog */}
        <Dialog
          open={isCreateRoleDialogOpen}
          onClose={() => setIsCreateRoleDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Crear Nuevo Rol</DialogTitle>
          <RoleForm
            onSubmit={handleCreateRole}
            isLoading={isCreating}
            onClose={() => setIsCreateRoleDialogOpen(false)}
          />
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Editar Rol</DialogTitle>
          {roleToEdit && (
            <RoleForm
              onSubmit={handleUpdateRole}
              isLoading={isUpdating}
              onClose={handleCloseEditDialog}
              defaultValues={{
                name: roleToEdit.name,
              }}
            />
          )}
        </Dialog>

        {/* Delete Role Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación de Rol"
          message={`¿Estás seguro de que deseas eliminar el rol "${roleToDelete?.name}"? Esta acción no se puede deshacer.`}
          isLoading={isDeleting}
        />

        {/* Permissions Management Dialog */}
        <Dialog
          open={isPermissionsDialogOpen}
          onClose={handleClosePermissionsDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Gestionar Permisos para {roleToManagePermissions?.name}
          </DialogTitle>
          <DialogContent>
            {isLoadingPermissions ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : isErrorPermissions ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error al cargar los permisos: {permissionsError?.message}
              </Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Permisos Disponibles
                </Typography>
                <FormGroup>
                  {availablePermissions?.map((permission) => (
                    <FormControlLabel
                      key={permission}
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(permission)}
                          onChange={handlePermissionChange(permission)}
                        />
                      }
                      label={permission}
                    />
                  ))}
                </FormGroup>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePermissionsDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSavePermissions}
              variant="contained"
              color="primary"
              disabled={isUpdatingPermissions}
            >
              {isUpdatingPermissions ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}); 