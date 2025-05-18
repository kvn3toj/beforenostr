import React, { useState } from 'react';
import { Typography, Container, Box, IconButton, Chip, Button, Dialog, DialogTitle, Tooltip, TextField, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMundosQuery } from '../hooks/useMundosQuery';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { Mundo, CreateMundoData, UpdateMundoData } from '../types/mundo.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMundo, updateMundo, deleteMundo, FetchMundosParams } from '../services/mundo.service';
import { MundoForm } from '../components/features/mundos/components/MundoForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useHasRole } from '../hooks/useHasRole';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Type for update mutation data
type UpdateMundoMutationData = {
  id: string;
  data: UpdateMundoData;
};

export const MundosPage: React.FC = () => {
  // Verificar permisos
  const isSuperAdmin = useHasRole('Super Admin');
  const isContentAdmin = useHasRole('Content Admin');
  const canManageMundos = isSuperAdmin || isContentAdmin;

  // States for dialogs
  const [isCreateMundoDialogOpen, setIsCreateMundoDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mundoToEdit, setMundoToEdit] = useState<Mundo | null>(null);
  const [mundoToDelete, setMundoToDelete] = useState<Mundo | null>(null);

  // Estados para paginación, ordenamiento y filtrado
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    is_active: undefined as boolean | undefined,
  });

  // Queries and mutations
  const { data: mundosData, isLoading, error } = useMundosQuery({
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
  });

  const mundos = mundosData?.data || [];
  const totalCount = mundosData?.count || 0;

  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Handlers para paginación, ordenamiento y filtrado
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Reset a la primera página al cambiar tamaño
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
    setPage(0); // Reset a la primera página al cambiar filtro
  };

  // Handlers
  const handleEditClick = (mundo: Mundo) => {
    setMundoToEdit(mundo);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (mundo: Mundo) => {
    setMundoToDelete(mundo);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setMundoToEdit(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setMundoToDelete(null);
  };

  // Define column configuration for the mundos table
  const mundoColumns: ColumnDefinition<Mundo>[] = [
    {
      header: 'Nombre',
      field: 'name',
      width: '20%',
      sortField: 'name',
    },
    {
      header: 'Descripción',
      field: 'description',
      width: '20%',
      render: (mundo) => (
        <Typography noWrap>
          {mundo.description || '-'}
        </Typography>
      ),
    },
    {
      header: 'Estado',
      field: 'is_active',
      width: '10%',
      align: 'center',
      sortField: 'is_active',
      render: (mundo) => (
        <Chip
          label={mundo.is_active ? 'Activo' : 'Inactivo'}
          color={mundo.is_active ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      header: 'Publicación',
      width: '15%',
      sortField: 'published_at',
      render: (mundo) => (
        <Typography variant="body2">
          {mundo.published_at 
            ? format(new Date(mundo.published_at), 'PPp', { locale: es })
            : 'No programada'}
        </Typography>
      ),
    },
    {
      header: 'Despublicación',
      width: '15%',
      sortField: 'unpublished_at',
      render: (mundo) => (
        <Typography variant="body2">
          {mundo.unpublished_at 
            ? format(new Date(mundo.unpublished_at), 'PPp', { locale: es })
            : 'No programada'}
        </Typography>
      ),
    },
    {
      header: 'Creado',
      field: 'created_at',
      width: '10%',
      sortField: 'created_at',
      render: (mundo) => (
        <Typography variant="body2">
          {format(new Date(mundo.created_at), 'PPp', { locale: es })}
        </Typography>
      ),
    },
    {
      header: 'Acciones',
      width: '10%',
      align: 'center',
      render: (mundo) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title={canManageMundos ? "Editar mundo" : "No tienes permisos para editar mundos"}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(mundo);
                }}
                disabled={!canManageMundos}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={canManageMundos ? "Eliminar mundo" : "No tienes permisos para eliminar mundos"}>
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(mundo);
                }}
                disabled={!canManageMundos}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Create mutation
  const { mutate: createMundoMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateMundoData) => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }
      return createMundo(data, user.id);
    },
    onSuccess: () => {
      toast.success('Mundo creado exitosamente');
      setIsCreateMundoDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['mundos'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el mundo: ${error.message}`);
    },
  });

  // Update mutation
  const { mutate: updateMundoMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: UpdateMundoMutationData) => updateMundo(id, data),
    onSuccess: () => {
      toast.success('Mundo actualizado exitosamente');
      handleCloseEditDialog();
      queryClient.invalidateQueries({ queryKey: ['mundos'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el mundo: ${error.message}`);
    },
  });

  // Delete mutation
  const { mutate: deleteMundoMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteMundo(id),
    onSuccess: () => {
      toast.success('Mundo eliminado exitosamente');
      handleCloseDeleteDialog();
      queryClient.invalidateQueries({ queryKey: ['mundos'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el mundo: ${error.message}`);
    },
  });

  const handleRowClick = (mundo: Mundo) => {
    console.log('Row clicked:', mundo);
    // TODO: Implement navigation to mundo details
  };

  const handleCreateMundo = (data: CreateMundoData) => {
    createMundoMutation(data);
  };

  const handleUpdateMundo = (data: UpdateMundoData) => {
    if (!mundoToEdit) {
      toast.error('Error: No hay mundo seleccionado para editar');
      return;
    }
    updateMundoMutation({ id: mundoToEdit.id, data });
  };

  const handleConfirmDelete = () => {
    if (!mundoToDelete) {
      toast.error('Error: No hay mundo seleccionado para eliminar');
      return;
    }
    deleteMundoMutation(mundoToDelete.id);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestión de Mundos
          </Typography>
          <Tooltip title={canManageMundos ? "Crear nuevo mundo" : "No tienes permisos para crear mundos"}>
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCreateMundoDialogOpen(true)}
                disabled={!canManageMundos}
              >
                Crear Nuevo Mundo
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
          data={mundos}
          columns={mundoColumns}
          isLoading={isLoading}
          isError={!!error}
          errorMessage={error?.message}
          onRowClick={handleRowClick}
          emptyMessage="No hay mundos disponibles. ¡Crea tu primer mundo!"
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

        {/* Create Mundo Dialog */}
        <Dialog
          open={isCreateMundoDialogOpen}
          onClose={() => setIsCreateMundoDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Crear Nuevo Mundo</DialogTitle>
          <MundoForm
            onSubmit={handleCreateMundo}
            isLoading={isCreating}
            onClose={() => setIsCreateMundoDialogOpen(false)}
          />
        </Dialog>

        {/* Edit Mundo Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Editar Mundo</DialogTitle>
          {mundoToEdit && (
            <MundoForm
              onSubmit={handleUpdateMundo}
              isLoading={isUpdating}
              onClose={handleCloseEditDialog}
              defaultValues={{
                name: mundoToEdit.name,
                description: mundoToEdit.description || undefined,
                thumbnail_url: mundoToEdit.thumbnail_url || undefined,
                is_active: mundoToEdit.is_active,
                published_at: mundoToEdit.published_at,
                unpublished_at: mundoToEdit.unpublished_at,
              }}
            />
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message={
            mundoToDelete
              ? `¿Estás seguro de que deseas eliminar el mundo "${mundoToDelete.name}"? Esta acción no se puede deshacer.`
              : 'Error: Mundo no encontrado'
          }
          isLoading={isDeleting}
        />
      </Box>
    </Container>
  );
}; 