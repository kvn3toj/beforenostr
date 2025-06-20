import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { useHasRole } from '../hooks/useHasRole';
import { useAvailablePermissionsQuery } from '../hooks/features/roles/useAvailablePermissionsQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api.service';
import { useCanPerformAction } from '../hooks/useCanPerformAction';

// Types for permissions
interface Permission {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

interface CreatePermissionData {
  name: string;
  description?: string;
}

// API functions for permissions
const createPermission = async (data: CreatePermissionData): Promise<Permission> => {
  try {
    const result = await apiService.post<Permission>('/permissions', data);
    return result;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

const updatePermission = async (id: string, data: CreatePermissionData): Promise<Permission> => {
  try {
    const result = await apiService.put<Permission>(`/permissions/${id}`, data);
    return result;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};

const deletePermission = async (id: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/permissions/${id}`);
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

// Permission Form Component
interface PermissionFormProps {
  onSubmit: (data: CreatePermissionData) => void;
  isLoading: boolean;
  onClose: () => void;
  defaultValues?: CreatePermissionData;
}

const PermissionForm: React.FC<PermissionFormProps> = ({
  onSubmit,
  isLoading,
  onClose,
  defaultValues
}) => {
  const [name, setName] = useState(defaultValues?.name || '');
  const [description, setDescription] = useState(defaultValues?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre del permiso es requerido');
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            label="Nombre del Permiso"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            placeholder="ej: users:read, content:write"
            helperText="Usa el formato 'recurso:acción' (ej: users:read, roles:write)"
          />
          <TextField
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Descripción opcional del permiso"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </form>
  );
};

export const PermissionsPage: React.FC = () => {
  console.log('>>> PermissionsPage: Component rendering');
  
  // Verificar permisos usando el nuevo hook
  const canManagePermissions = useCanPerformAction('create_permission');
  console.log('>>> PermissionsPage: canManagePermissions:', canManagePermissions);

  // States for dialogs
  const [isCreatePermissionDialogOpen, setIsCreatePermissionDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState<Permission | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  // Query for permissions
  const { 
    data: availablePermissions,
    isLoading,
    error,
    refetch
  } = useAvailablePermissionsQuery();

  console.log('>>> PermissionsPage: useAvailablePermissionsQuery status:', { 
    isLoading, 
    error, 
    availablePermissions,
    permissionsCount: availablePermissions?.length 
  });

  // Convert permissions to the format expected by DataTable
  const permissions: Permission[] = React.useMemo(() => {
    if (!availablePermissions) return [];
    
    // If availablePermissions is an array of strings, convert to Permission objects
    if (typeof availablePermissions[0] === 'string') {
      return (availablePermissions as string[]).map((name, index) => ({
        id: `perm-${index}`,
        name,
        description: `Permiso: ${name}`,
        createdAt: new Date().toISOString()
      }));
    }
    
    // If it's already an array of Permission objects, use as is
    return availablePermissions as Permission[];
  }, [availablePermissions]);

  console.log('>>> PermissionsPage: Processed permissions:', { 
    permissionsCount: permissions.length,
    firstPermission: permissions[0]
  });

  const queryClient = useQueryClient();

  // Create mutation
  const { mutate: createPermissionMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreatePermissionData) => createPermission(data),
    onSuccess: () => {
      toast.success('Permiso creado exitosamente');
      setIsCreatePermissionDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['roles', 'availablePermissions'] });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el permiso: ${error.message}`);
    },
  });

  // Update mutation
  const { mutate: updatePermissionMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePermissionData }) => updatePermission(id, data),
    onSuccess: () => {
      toast.success('Permiso actualizado exitosamente');
      setIsEditDialogOpen(false);
      setPermissionToEdit(null);
      queryClient.invalidateQueries({ queryKey: ['roles', 'availablePermissions'] });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el permiso: ${error.message}`);
    },
  });

  // Delete mutation
  const { mutate: deletePermissionMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePermission(id),
    onSuccess: () => {
      toast.success('Permiso eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setPermissionToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['roles', 'availablePermissions'] });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el permiso: ${error.message}`);
    },
  });

  // Define column configuration for the permissions table
  const permissionColumns: ColumnDefinition<Permission>[] = [
    {
      header: 'Nombre',
      field: 'name',
      width: '30%',
      sortField: 'name',
    },
    {
      header: 'Descripción',
      field: 'description',
      width: '50%',
      render: (permission) => (
        <Typography variant="body2" color="text.secondary">
          {permission.description || 'Sin descripción'}
        </Typography>
      ),
    },
    {
      header: 'Acciones',
      width: '20%',
      align: 'center',
      render: (permission) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title={canManagePermissions ? "Editar permiso" : "No tienes permiso para editar permisos"}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setPermissionToEdit(permission);
                  setIsEditDialogOpen(true);
                }}
                disabled={!canManagePermissions}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={canManagePermissions ? "Eliminar permiso" : "No tienes permiso para eliminar permisos"}>
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setPermissionToDelete(permission);
                  setIsDeleteDialogOpen(true);
                }}
                disabled={!canManagePermissions}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Handlers
  const handleCreatePermission = (data: CreatePermissionData) => {
    createPermissionMutation(data);
  };

  const handleUpdatePermission = (data: CreatePermissionData) => {
    if (!permissionToEdit) {
      toast.error('Error: No hay permiso seleccionado para editar');
      return;
    }
    updatePermissionMutation({ id: permissionToEdit.id, data });
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setPermissionToEdit(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setPermissionToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!permissionToDelete) {
      toast.error('Error: No hay permiso seleccionado para eliminar');
      return;
    }
    deletePermissionMutation(permissionToDelete.id);
  };

  // Early returns AFTER all hooks have been declared
  if (isLoading) {
    console.log('>>> PermissionsPage: Loading state');
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading permissions...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    console.error('>>> PermissionsPage: Error loading permissions:', error);
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Error loading permissions: {error?.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  console.log('>>> PermissionsPage: About to render main content with permissions:', permissions.length);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestión de Permisos
          </Typography>
          <Tooltip title={canManagePermissions ? "Crear nuevo permiso" : "No tienes permiso para crear permisos"}>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCreatePermissionDialogOpen(true)}
                disabled={!canManagePermissions}
              >
                Crear Nuevo Permiso
              </Button>
            </span>
          </Tooltip>
        </Box>

        <DataTable
          data={permissions}
          columns={permissionColumns}
          isLoading={isLoading}
          isError={!!error}
          errorMessage={error?.message}
          emptyMessage="No hay permisos disponibles. ¡Crea el primer permiso!"
          // Basic props without pagination for now
          page={0}
          pageSize={permissions.length}
          totalCount={permissions.length}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />

        {/* Create Permission Dialog */}
        <Dialog
          open={isCreatePermissionDialogOpen}
          onClose={() => setIsCreatePermissionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Crear Nuevo Permiso</DialogTitle>
          <PermissionForm
            onSubmit={handleCreatePermission}
            isLoading={isCreating}
            onClose={() => setIsCreatePermissionDialogOpen(false)}
          />
        </Dialog>

        {/* Edit Permission Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Editar Permiso</DialogTitle>
          {permissionToEdit && (
            <PermissionForm
              onSubmit={handleUpdatePermission}
              isLoading={isUpdating}
              onClose={handleCloseEditDialog}
              defaultValues={{
                name: permissionToEdit.name,
                description: permissionToEdit.description,
              }}
            />
          )}
        </Dialog>

        {/* Delete Permission Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación de Permiso"
          message={`¿Estás seguro de que deseas eliminar el permiso "${permissionToDelete?.name}"? Esta acción no se puede deshacer.`}
          isLoading={isDeleting}
        />
      </Box>
    </Container>
  );
}; 