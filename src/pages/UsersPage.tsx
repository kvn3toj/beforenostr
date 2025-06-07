import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import { EditIcon, DeleteIcon } from '../components/common/Icons';
import { useUsersQuery } from '../hooks/useUsersQuery';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { User, CreateUserData, UpdateUserData } from '../types/user.types';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { UserForm } from '../components/features/users/components/UserForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { useHasRole } from '../hooks/useHasRole';
import { useTranslation } from 'react-i18next';
import { useCreateUserMutation } from '../hooks/features/users/useCreateUserMutation';
import { useUpdateUserMutation } from '../hooks/features/users/useUpdateUserMutation';
import { useDeleteUserMutation } from '../hooks/features/users/useDeleteUserMutation';
import { USER_ROLES } from '../constants/roles';
import { QUERY_KEYS } from '../constants/queryKeys';

// Importar componentes del Design System
import { Button, TextField } from '../components/design-system';
import { colors, spacing, textStyles } from '../components/design-system';

// Importar Live Regions para anuncios dinámicos
import { useAnnouncement, StatusRegion } from '../components/common/LiveRegion/LiveRegion';

export const UsersPage: React.FC = () => {
  console.log('>>> UsersPage: Component rendering');
  const { t } = useTranslation();
  
  // Hook para anuncios dinámicos
  const { announce, AnnouncementRegion } = useAnnouncement();
  
  // Estados para mensajes de feedback
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Verificar permisos
  const canCreateUsers = useHasRole(USER_ROLES.SUPER_ADMIN);
  const canEditUsers = useHasRole(USER_ROLES.SUPER_ADMIN);
  const canDeleteUsers = useHasRole(USER_ROLES.SUPER_ADMIN);

  console.log('>>> UsersPage: Permissions:', { canCreateUsers, canEditUsers, canDeleteUsers });

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

  console.log('>>> UsersPage: Query params:', { page, pageSize, sortBy, sortDirection, filters });

  // Queries and mutations
  const { data: usersData, isLoading, error } = useUsersQuery({
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
  });

  console.log('>>> UsersPage: useUsersQuery status:', { 
    isLoading, 
    error: error?.message || error, 
    usersData,
    hasData: !!usersData,
    dataLength: usersData?.data?.length 
  });

  const users = usersData?.data || [];
  const totalCount = usersData?.count || 0;

  console.log('>>> UsersPage: Processed data:', { 
    usersCount: users.length, 
    totalCount,
    firstUser: users[0] ? { id: users[0].id, email: users[0].email } : null
  });

  const queryClient = useQueryClient();

  // Create mutation
  const { mutate: createUserMutation, isPending: isCreating } = useCreateUserMutation({
    onSuccess: () => {
      announce('Usuario creado exitosamente');
      setSuccessMessage('Usuario creado exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (error) => {
      announce('Error al crear usuario');
      setErrorMessage('Error al crear usuario: ' + error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  });

  // Update mutation
  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUserMutation({
    onSuccess: () => {
      announce('Usuario actualizado exitosamente');
      setSuccessMessage('Usuario actualizado exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (error) => {
      announce('Error al actualizar usuario');
      setErrorMessage('Error al actualizar usuario: ' + error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  });

  // Delete mutation
  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUserMutation({
    onSuccess: () => {
      announce('Usuario eliminado exitosamente');
      setSuccessMessage('Usuario eliminado exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (error) => {
      announce('Error al eliminar usuario');
      setErrorMessage('Error al eliminar usuario: ' + error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
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

  // Define column configuration for the users table with improved accessibility
  const userColumns: ColumnDefinition<User>[] = [
    {
      header: t('table_header_email'),
      field: 'email',
      width: '25%',
      sortField: 'email',
    },
    {
      header: t('table_header_role'),
      field: 'primaryRole.name',
      width: '15%',
      sortField: 'role_id',
      render: (user) => (
        <Chip
          label={user.primaryRole?.name || 'Sin rol'}
          color="primary"
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      header: t('table_header_status'),
      field: 'isActive',
      width: '15%',
      align: 'center',
      sortField: 'isActive',
      render: (user) => (
        <Chip
          label={user.isActive ? t('user_status_active') : t('user_status_inactive')}
          color={user.isActive ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      header: t('table_header_last_login'),
      field: 'lastLogin',
      width: '20%',
      sortField: 'lastLogin',
      render: (user) => (
        <Typography noWrap>
          {user.lastLogin && user.lastLogin !== null
            ? format(new Date(user.lastLogin), 'PPpp', { locale: es })
            : t('user_last_login_never')}
        </Typography>
      ),
    },
    {
      header: t('table_header_created_at'),
      field: 'createdAt',
      width: '15%',
      sortField: 'createdAt',
      render: (user) => (
        <Typography noWrap>
          {user.createdAt 
            ? format(new Date(user.createdAt), 'PP', { locale: es })
            : 'N/A'}
        </Typography>
      ),
    },
    {
      header: t('table_header_actions'),
      width: '10%',
      align: 'center',
      render: (user) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title={canEditUsers ? t('tooltip_edit_user') : t('tooltip_no_permission_edit_users')}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserToEdit(user);
                  setIsEditDialogOpen(true);
                }}
                disabled={!canEditUsers}
                aria-label={`Editar usuario ${user.email}`}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={canDeleteUsers ? t('tooltip_delete_user') : t('tooltip_no_permission_delete_users')}>
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
                aria-label={`Eliminar usuario ${user.email}`}
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
    setIsCreateUserDialogOpen(false);
  };

  const handleUpdateUser = (data: UpdateUserData) => {
    if (userToEdit) {
      updateUserMutation({ id: userToEdit.id, data });
      setIsEditDialogOpen(false);
      setUserToEdit(null);
    }
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
    if (userToDelete) {
      deleteUserMutation(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleClearFilters = () => {
    setFilters({ email: '', role_id: '', is_active: undefined });
    setPage(0);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleIsActiveFilterChange = (value: string) => {
    setFilters({ ...filters, is_active: value === '' ? undefined : value === 'true' });
    setPage(0);
  };

  const handleRoleFilterChange = (value: string) => {
    setFilters({ ...filters, role_id: value });
    setPage(0);
  };

  if (isLoading) {
    console.log('>>> UsersPage: Loading state - showing loading message');
    return <Typography>{t('loading_users')}</Typography>;
  }

  if (error) {
    console.error('>>> UsersPage: Error loading users:', error);
    console.error('>>> UsersPage: Error details:', { 
      message: error.message, 
      stack: error.stack,
      name: error.name 
    });
    return <Typography color="error">{t('error_loading_users', { message: error.message })}</Typography>;
  }

  console.log('>>> UsersPage: Rendering main content with users:', users.length);

  return (
    <Container maxWidth="xl">
      {/* Live Regions para anuncios dinámicos */}
      <AnnouncementRegion />
      <StatusRegion message={successMessage} type="success" visible={!!successMessage} />
      <StatusRegion message={errorMessage} type="error" visible={!!errorMessage} />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: spacing.lg,
        p: `${spacing.lg}px ${spacing.md}px`,
        backgroundColor: colors.background.paper,
        borderRadius: `${spacing.md}px`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            color: colors.text.primary,
            fontWeight: 600 
          }}
        >
          {t('users_page_title')}
        </Typography>
        {canCreateUsers && (
          <Button 
            variant="primary" 
            size="medium"
            onClick={() => setIsCreateUserDialogOpen(true)}
            aria-label="Abrir formulario para crear nuevo usuario"
          >
            {t('button_create_user')}
          </Button>
        )}
      </Box>
      
      <Box sx={{ 
        mb: spacing.lg,
        p: spacing.lg,
        backgroundColor: colors.background.paper,
        borderRadius: `${spacing.md}px`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <Stack direction="row" spacing={spacing.md} alignItems="center">
          <TextField
            label={t('filter_by_email')}
            variant="outlined"
            size="medium"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Buscar por email..."
            sx={{ minWidth: '250px' }}
            aria-describedby="email-filter-help"
          />
          <Typography id="email-filter-help" variant="body2" sx={{ display: 'none' }}>
            Filtrar usuarios por dirección de correo electrónico
          </Typography>
          <Button 
            variant="outline" 
            size="medium" 
            onClick={handleClearFilters}
            aria-label="Limpiar todos los filtros aplicados"
          >
            {t('button_clear_filters')}
          </Button>
        </Stack>
      </Box>
      
      <DataTable
        data={users}
        columns={userColumns}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        caption="Lista de usuarios del sistema con información de perfil y acciones disponibles"
        aria-label="Tabla de usuarios"
        aria-describedby="users-table-description"
      />
      
      <Typography id="users-table-description" variant="body2" sx={{ display: 'none' }}>
        Tabla que muestra todos los usuarios registrados en el sistema. Incluye información como email, rol, estado y fecha de creación. Permite editar y eliminar usuarios según los permisos.
      </Typography>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserDialogOpen} onClose={() => setIsCreateUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          fontWeight: 600, 
          color: colors.primary.main,
          fontSize: textStyles.h5.fontSize,
          padding: `${spacing.lg}px ${spacing.lg}px ${spacing.md}px`
        }}>
          ✨ Crear Nuevo Usuario
        </DialogTitle>
        <UserForm 
          onSubmit={handleCreateUser} 
          isLoading={isCreating} 
          onClose={() => setIsCreateUserDialogOpen(false)}
          isEdit={false}
        />
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          fontWeight: 600, 
          color: colors.primary.main,
          fontSize: textStyles.h5.fontSize,
          padding: `${spacing.lg}px ${spacing.lg}px ${spacing.md}px`
        }}>
          ✏️ Editar Usuario: {userToEdit?.email}
        </DialogTitle>
        {userToEdit && (
          <UserForm 
            onSubmit={handleUpdateUser} 
            defaultValues={userToEdit} 
            isLoading={isUpdating}
            onClose={handleCloseEditDialog}
            isEdit={true}
          />
        )}
      </Dialog>

      {/* Delete User Confirm Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="⚠️ Confirmar Eliminación de Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.email}"? Esta acción no se puede deshacer.`}
        isConfirming={isDeleting}
      />
    </Container>
  );
}; 