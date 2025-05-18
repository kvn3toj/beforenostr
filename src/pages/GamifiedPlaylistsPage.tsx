import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { CreatePlaylistForm } from '../components/playlists/CreatePlaylistForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { usePlaylistsQuery } from '../hooks/usePlaylistsQuery';
import { useUpdatePlaylistStatusMutation } from '../hooks/useUpdatePlaylistStatusMutation';
import { useAuth } from '../hooks/useAuth';
import { useHasRole } from '../hooks/useHasRole';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlaylist, deletePlaylist, updatePlaylist, FetchPlaylistsParams } from '../services/playlist.service';
import { toast } from 'sonner';
import { currentMundoId } from '../constants';
import type { Playlist } from '../types/playlist.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Define the columns configuration for the playlists table
const playlistColumns: ColumnDefinition<Playlist>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '20%',
    sortField: 'name',
  },
  {
    header: 'Estado',
    width: '10%',
    align: 'center',
    sortField: 'is_active',
    render: (playlist) => (
      <Chip
        label={playlist.is_active ? 'Activa' : 'Inactiva'}
        color={playlist.is_active ? 'success' : 'default'}
        size="small"
      />
    ),
  },
  {
    header: 'Publicación',
    width: '20%',
    sortField: 'published_at',
    render: (playlist) => (
      <Typography variant="body2">
        {playlist.published_at 
          ? format(new Date(playlist.published_at), 'PPp', { locale: es })
          : 'No programada'}
      </Typography>
    ),
  },
  {
    header: 'Despublicación',
    width: '20%',
    sortField: 'unpublished_at',
    render: (playlist) => (
      <Typography variant="body2">
        {playlist.unpublished_at 
          ? format(new Date(playlist.unpublished_at), 'PPp', { locale: es })
          : 'No programada'}
      </Typography>
    ),
  },
  {
    header: 'Creado',
    field: 'created_at',
    width: '15%',
    sortField: 'created_at',
    render: (playlist) => (
      <Typography variant="body2">
        {format(new Date(playlist.created_at), 'PPp', { locale: es })}
      </Typography>
    ),
  },
  {
    header: 'Acciones',
    width: '15%',
    align: 'center',
    render: (playlist) => (
      <Box display="flex" gap={1} justifyContent="center">
        <Tooltip title={canManagePlaylists ? "Editar playlist" : "No tienes permisos para editar playlists"}>
          <span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(playlist);
              }}
              disabled={!canManagePlaylists}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={canManagePlaylists ? "Eliminar playlist" : "No tienes permisos para eliminar playlists"}>
          <span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(playlist);
              }}
              disabled={!canManagePlaylists}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    ),
  },
];

export const GamifiedPlaylistsPage = () => {
  // Verificar permisos
  const isSuperAdmin = useHasRole('Super Admin');
  const isContentAdmin = useHasRole('Content Admin');
  const canManagePlaylists = isSuperAdmin || isContentAdmin;

  // Estados para diálogos
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

  // Estados para paginación, ordenamiento y filtrado
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    mundo_id: currentMundoId,
    is_active: undefined as boolean | undefined,
  });

  // User info
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: playlistsData,
    isLoading,
    error,
  } = usePlaylistsQuery({
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
  });

  const playlists = playlistsData?.data || [];
  const totalCount = playlistsData?.count || 0;

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

  // Mutations
  const { mutate: createPlaylistMutate, isPending: isCreatingPlaylist } = useMutation({
    mutationFn: async (data: { name: string; mundo_id: string }) => {
      const userId = user?.id;
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      return createPlaylist(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setIsCreatePlaylistDialogOpen(false);
      toast.success('Playlist creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la playlist: ${error.message}`);
    },
  });

  const { mutate: updatePlaylistMutate, isPending: isUpdatingPlaylist } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; mundo_id: string } }) => {
      return updatePlaylist(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setIsEditDialogOpen(false);
      setPlaylistToEdit(null);
      toast.success('Playlist actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la playlist: ${error.message}`);
    },
  });

  const { mutate: deletePlaylistMutate, isPending: isDeletingPlaylist } = useMutation({
    mutationFn: async (id: string) => {
      return deletePlaylist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setIsDeleteDialogOpen(false);
      setPlaylistToDelete(null);
      toast.success('Playlist eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la playlist: ${error.message}`);
    },
  });

  const { mutate: updatePlaylistStatusMutate } = useUpdatePlaylistStatusMutation();

  // Handlers
  const handleOpenCreatePlaylistDialog = () => setIsCreatePlaylistDialogOpen(true);
  const handleCloseCreatePlaylistDialog = () => setIsCreatePlaylistDialogOpen(false);
  
  const handleCreatePlaylistSubmit = (data: { name: string; mundo_id: string }) => {
    createPlaylistMutate(data);
  };

  const handleEditClick = (playlist: Playlist) => {
    setPlaylistToEdit(playlist);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (data: { name: string; mundo_id: string }) => {
    if (playlistToEdit) {
      updatePlaylistMutate({ id: playlistToEdit.id, data });
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setPlaylistToEdit(null);
  };

  const handleToggleActive = (playlistId: string, isActive: boolean) => {
    updatePlaylistStatusMutate(
      { id: playlistId, isActive },
      {
        onSuccess: () => {
          toast.success(`Playlist ${isActive ? 'activada' : 'desactivada'} exitosamente`);
        },
        onError: (error) => {
          toast.error('Error al actualizar el estado: ' + error.message);
        },
      }
    );
  };

  const handleDeleteClick = (playlist: Playlist) => {
    setPlaylistToDelete(playlist);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (playlistToDelete) {
      deletePlaylistMutate(playlistToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setPlaylistToDelete(null);
  };

  const handleRowClick = (playlist: Playlist) => {
    // TODO: Implement row click navigation or action
    console.log('Clicked playlist:', playlist);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Gamified Playlists
          </Typography>
          <Tooltip title={canManagePlaylists ? "Crear nueva playlist" : "No tienes permisos para crear playlists"}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreatePlaylistDialog}
                disabled={!canManagePlaylists}
              >
                Crear Playlist
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
          data={playlists}
          columns={playlistColumns}
          isLoading={isLoading}
          isError={!!error}
          errorMessage={error?.message}
          onRowClick={handleRowClick}
          emptyMessage="No hay playlists disponibles"
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
      </Box>

      {/* Create Playlist Dialog */}
      <Dialog 
        open={isCreatePlaylistDialogOpen} 
        onClose={handleCloseCreatePlaylistDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Crear Nueva Playlist
          <IconButton
            aria-label="close"
            onClick={handleCloseCreatePlaylistDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <CreatePlaylistForm
              onSubmit={handleCreatePlaylistSubmit}
              isLoading={isCreatingPlaylist}
              defaultValues={{
                mundo_id: currentMundoId,
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Playlist Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Editar Playlist
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <CreatePlaylistForm
              onSubmit={handleEditSubmit}
              isLoading={isUpdatingPlaylist}
              defaultValues={playlistToEdit ? {
                name: playlistToEdit.name,
                mundo_id: playlistToEdit.mundo_id,
              } : undefined}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Playlist"
        message={`¿Estás seguro de que deseas eliminar la playlist "${playlistToDelete?.name}"? Esta acción no se puede deshacer.`}
        isLoading={isDeletingPlaylist}
      />
    </Container>
  );
}; 