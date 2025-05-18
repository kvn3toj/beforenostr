import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  Tooltip,
  TextField,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUsersQuery } from '../hooks/useUsersQuery';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { User, CreateUserData, UpdateUserData } from '../types/user.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, deleteUser } from '../services/user.service';
import { UserForm } from '../components/features/users/components/UserForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { useHasRole } from '../hooks/useHasRole';

// Type for update mutation data
type UpdateUserMutationData = {
  id: string;
  data: UpdateUserData;
};

export const UsersPage: React.FC = () => {
  // Verificar permisos
  const canCreateUsers = useHasRole('Super Admin');
  const canEditUsers = useHasRole('Super Admin');
  const canDeleteUsers = useHasRole('Super Admin');

  // States for dialogs
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // States for pagination, sorting, and filtering
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState({
    email: '',
    role_id: '',
    is_active: undefined as boolean | undefined,
  });

  // Queries and mutations
  const { data: usersData, isLoading, error } = useUsersQuery({
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
  });

  const users = usersData?.data || [];
  const totalCount = usersData?.count || 0;

  const queryClient = useQueryClient();

  // Create mutation
  const { mutate: createUserMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      setIsCreateUserDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el usuario: ${error.message}`);
    },
  });

  // Update mutation
  const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: UpdateUserMutationData) => updateUser(id, data),
    onSuccess: () => {
      toast.success('Usuario actualizado exitosamente');
      setIsEditDialogOpen(false);
      setUserToEdit(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el usuario: ${error.message}`);
    },
  });

  // Delete mutation
  const { mutate: deleteUserMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success('Usuario eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el usuario: ${error.message}`);
    },
  });

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
    setFilters({ ...filters, email: event.target.value });
    setPage(0); // Reset to first page when changing filters
  };

  // Define column configuration for the users table
  const userColumns: ColumnDefinition<User>[] = [
    {
      header: 'Email',
      field: 'email',
      width: '25%',
      sortField: 'email',
    },
    {
      header: 'Rol',
      field: 'role.name',
      width: '15%',
      sortField: 'role_id',
      render: (user) => (
        <Chip
          label={user.role.name}
          color="primary"
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      header: 'Estado',
      field: 'is_active',
      width: '15%',
      align: 'center',
      sortField: 'is_active',
      render: (user) => (
        <Chip
          label={user.is_active ? 'Activo' : 'Inactivo'}
          color={user.is_active ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      header: 'Último Login',
      field: 'last_login',
      width: '20%',
      sortField: 'last_login',
      render: (user) => (
        <Typography noWrap>
          {user.last_login
            ? format(new Date(user.last_login), 'PPpp', { locale: es })
            : 'Nunca'}
        </Typography>
      ),
    },
    {
      header: 'Creado',
      field: 'created_at',
      width: '15%',
      sortField: 'created_at',
      render: (user) => (
        <Typography noWrap>
          {format(new Date(user.created_at), 'PP', { locale: es })}
        </Typography>
      ),
    },
    {
      header: 'Acciones',
      width: '10%',
      align: 'center',
      render: (user) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title={canEditUsers ? "Editar usuario" : "No tienes permiso para editar usuarios"}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserToEdit(user);
                  setIsEditDialogOpen(true);
                }}
                disabled={!canEditUsers}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={canDeleteUsers ? "Eliminar usuario" : "No tienes permiso para eliminar usuarios"}>
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserToDelete(user);
                  setIsDeleteDialogOpen(true);
                }}
                disabled={!canDeleteUsers}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleRowClick = (user: User) => {
    console.log('Row clicked:', user);
    // TODO: Implement navigation to user details
  };

  const handleCreateUser = (data: CreateUserData) => {
    createUserMutation(data);
  };

  const handleUpdateUser = (data: UpdateUserData) => {
    if (!userToEdit) {
      toast.error('Error: No hay usuario seleccionado para editar');
      return;
    }
    updateUserMutation({ id: userToEdit.id, data });
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setUserToEdit(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) {
      toast.error('Error: No hay usuario seleccionado para eliminar');
      return;
    }
    deleteUserMutation(userToDelete.id);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestión de Usuarios
          </Typography>
          <Tooltip title={canCreateUsers ? "Crear nuevo usuario" : "No tienes permiso para crear usuarios"}>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCreateUserDialogOpen(true)}
                disabled={!canCreateUsers}
              >
                Crear Nuevo Usuario
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Buscar por email"
            variant="outlined"
            size="small"
            value={filters.email}
            onChange={handleFilterChange}
            sx={{ minWidth: 300 }}
          />
        </Stack>

        <DataTable
          data={users}
          columns={userColumns}
          isLoading={isLoading}
          isError={!!error}
          errorMessage={error?.message}
          onRowClick={handleRowClick}
          emptyMessage="No hay usuarios disponibles"
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

        {/* Create User Dialog */}
        <Dialog
          open={isCreateUserDialogOpen}
          onClose={() => setIsCreateUserDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setIsCreateUserDialogOpen(false)}
            isSubmitting={isCreating}
          />
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Editar Usuario</DialogTitle>
          {userToEdit && (
            <UserForm
              initialData={userToEdit}
              onSubmit={handleUpdateUser}
              onCancel={handleCloseEditDialog}
              isSubmitting={isUpdating}
            />
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          title="Eliminar Usuario"
          message={`¿Estás seguro de que deseas eliminar el usuario ${userToDelete?.email}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteDialog}
          isSubmitting={isDeleting}
        />
      </Box>
    </Container>
  );
}; 