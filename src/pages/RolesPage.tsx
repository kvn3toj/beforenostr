import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  TextField,
  Stack,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  DialogActions,
  FormGroup,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { Role, AvailablePermission } from '../types/user.types';
import { useRolesQuery } from '../hooks/useRolesQuery';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole, updateRole, deleteRole, UpdateRoleData, FetchRolesParams } from '../services/role.service';
import { RoleForm, CreateRoleData } from '../components/features/roles/components/RoleForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { useHasRole } from '../hooks/useHasRole';
import { useAvailablePermissionsQuery } from '../hooks/features/roles/useAvailablePermissionsQuery';
import { useUpdateRolePermissionsMutation } from '../hooks/features/roles/useUpdateRolePermissionsMutation';

// Type for update mutation data
type UpdateRoleMutationData = {
  id: string;
  data: UpdateRoleData;
};

export const RolesPage: React.FC = () => {
  // Verificar permisos
  const canManageRoles = useHasRole('Super Admin');

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

  const roles = rolesData?.data || [];
  const totalCount = rolesData?.count || 0;

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

  // Handler for permission checkbox changes
  const handlePermissionChange = (permission: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
      return;
    }
    updatePermissionsMutation({
      roleId: roleToManagePermissions.id,
      permissions: selectedPermissions
    });
    setIsPermissionsDialogOpen(false);
    setRoleToManagePermissions(null);
  };

  // Handler for closing permissions dialog
  const handleClosePermissionsDialog = () => {
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

  // Define column configuration for the roles table
  const roleColumns: ColumnDefinition<Role>[] = [
    {
      header: 'Nombre',
      field: 'name',
      width: '25%',
      sortField: 'name',
    },
    {
      header: 'Permisos',
      field: 'permissions',
      width: '35%',
      render: (role) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {role.permissions.map((permission) => (
            <Chip
              key={permission}
              label={permission}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      ),
    },
    {
      header: 'Creado',
      field: 'created_at',
      width: '20%',
      sortField: 'created_at',
      render: (role) => (
        <Typography noWrap>
          {format(new Date(role.created_at), 'PP', { locale: es })}
        </Typography>
      ),
    },
    {
      header: 'Acciones',
      width: '20%',
      align: 'center',
      render: (role) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title={canManageRoles ? "Gestionar permisos" : "No tienes permiso para gestionar permisos"}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
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
      ),
    },
  ];

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
}; 