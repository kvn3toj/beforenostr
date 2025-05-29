import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { CreatePlaylistForm } from '../components/playlists/CreatePlaylistForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { AddVideoModal } from '../components/features/video/AddVideoModal';
import { usePlaylistsQuery } from '../hooks/usePlaylistsQuery';
import { useUpdatePlaylistStatusMutation } from '../hooks/features/playlists/useUpdatePlaylistStatusMutation';
import { useAuth } from '../hooks/useAuth';
import { useHasRole } from '../hooks/useHasRole';
import { useCreatePlaylistMutation } from '../hooks/features/playlists/useCreatePlaylistMutation';
import { useDeletePlaylistMutation } from '../hooks/features/playlists/useDeletePlaylistMutation';
import { useUpdatePlaylistMutation } from '../hooks/features/playlists/useUpdatePlaylistMutation';
import { toast } from 'sonner';
import { currentMundoId } from '../constants';
import type { Playlist, CreatePlaylistData } from '../types/playlist.types';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../utils/errorUtils';

export const GamifiedPlaylistsPage = () => {
  const { t } = useTranslation();
  // Verificar permisos
  const isSuperAdmin = useHasRole('Super Admin');
  const isContentAdmin = useHasRole('Content Admin');
  const canManagePlaylists = isSuperAdmin || isContentAdmin;

  // Estados para diálogos
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
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

  // Debug logging
  console.log('[GamifiedPlaylistsPage] playlistsData:', playlistsData);
  console.log('[GamifiedPlaylistsPage] playlists array:', playlists);
  console.log('[GamifiedPlaylistsPage] totalCount:', totalCount);
  console.log('[GamifiedPlaylistsPage] isLoading:', isLoading);
  console.log('[GamifiedPlaylistsPage] error:', error);

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
  const { mutate: createPlaylistMutate, isPending: isCreatingPlaylist } = useCreatePlaylistMutation();
  const { mutate: deletePlaylistMutate, isPending: isDeletingPlaylist } = useDeletePlaylistMutation();
  const { mutate: updatePlaylistMutate, isPending: isUpdatingPlaylist } = useUpdatePlaylistMutation();

  const { mutate: updatePlaylistStatusMutate } = useUpdatePlaylistStatusMutation();

  // Handlers
  const handleOpenCreatePlaylistDialog = () => setIsCreatePlaylistDialogOpen(true);
  const handleCloseCreatePlaylistDialog = () => setIsCreatePlaylistDialogOpen(false);
  
  const handleCreatePlaylistSubmit = (data: CreatePlaylistData) => {
    if (!user?.id) {
      toast.error('Usuario no autenticado');
      return;
    }
    
    console.log('[GamifiedPlaylistsPage] Creating playlist with data:', data);
    
    createPlaylistMutate(data, {
      onSuccess: () => {
        setIsCreatePlaylistDialogOpen(false);
        toast.success('Playlist creada exitosamente');
      },
      onError: (error) => {
        console.error('[GamifiedPlaylistsPage] Error creating playlist:', error);
        toast.error('Error al crear la playlist: ' + extractErrorMessage(error, t));
      },
    });
  };

  const handleEditClick = (playlist: Playlist) => {
    setPlaylistToEdit(playlist);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (data: CreatePlaylistData) => {
    if (playlistToEdit) {
      updatePlaylistMutate({ id: playlistToEdit.id, data }, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setPlaylistToEdit(null);
          toast.success('Playlist actualizada exitosamente');
        },
        onError: (error) => {
          console.error('[GamifiedPlaylistsPage] Error updating playlist:', error);
          toast.error('Error al actualizar la playlist: ' + extractErrorMessage(error, t));
        },
      });
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
      deletePlaylistMutate(playlistToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setPlaylistToDelete(null);
        },
        onError: () => {
          // El toast ya lo maneja el hook
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setPlaylistToDelete(null);
  };

  // Handlers para el modal de video
  const handleOpenAddVideoModal = () => setIsAddVideoModalOpen(true);
  const handleCloseAddVideoModal = () => setIsAddVideoModalOpen(false);
  
  const handleAddVideo = (iframeCode: string) => {
    // Por ahora, solo log del iframe
    console.log('Adding video with iframe:', iframeCode);
    toast.success('Video cargado exitosamente (funcionalidad de backend pendiente)');
    handleCloseAddVideoModal();
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
            {t('gamified_playlists_title')}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title={canManagePlaylists ? "Añadir nuevo video a una playlist" : t('tooltip_no_permission_create_playlists')}>
              <span>
                <Button
                  variant="contained"
                  startIcon={<VideoLibraryIcon />}
                  onClick={handleOpenAddVideoModal}
                  disabled={!canManagePlaylists}
                  data-testid="add-video-button"
                  sx={{
                    backgroundColor: '#FF6B35', // Color naranjo prominente como en el wireframe
                    '&:hover': {
                      backgroundColor: '#E55A2B',
                    },
                    fontWeight: 'bold',
                  }}
                >
                  + Añadir nuevo video
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={canManagePlaylists ? t('create_new_playlist_button_tooltip') : t('tooltip_no_permission_create_playlists')}>
              <span>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreatePlaylistDialog}
                  disabled={!canManagePlaylists}
                >
                  {t('create_new_playlist_button')}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label={t('search_by_name_placeholder')}
            variant="outlined"
            size="small"
            value={filters.name}
            onChange={handleFilterChange}
            sx={{ minWidth: 300 }}
          />
        </Stack>

        <DataTable
          data={playlists}
          columns={getPlaylistColumns(t, canManagePlaylists, handleEditClick, handleDeleteClick)}
          isLoading={isLoading}
          isError={!!error}
          errorMessage={error ? extractErrorMessage(error, t) : undefined}
          onRowClick={handleRowClick}
          emptyMessage={t('empty_playlists_table_message')}
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
          {t('dialog_title_create_playlist')}
          <IconButton
            aria-label={t('close_dialog_aria_label')}
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
          {t('dialog_title_edit_playlist')}
          <IconButton
            aria-label={t('close_dialog_aria_label')}
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
                description: playlistToEdit.description || '',
                mundo_id: playlistToEdit.mundo_id,
                is_active: playlistToEdit.is_active,
                published_at: playlistToEdit.published_at,
                unpublished_at: playlistToEdit.unpublished_at,
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
        title={t('dialog_title_delete_playlist')}
        message={t('dialog_confirm_delete_playlist_message', { name: playlistToDelete?.name })}
        isLoading={isDeletingPlaylist}
      />

      {/* Add Video Modal */}
      <AddVideoModal
        open={isAddVideoModalOpen}
        onClose={handleCloseAddVideoModal}
        onAddVideo={handleAddVideo}
      />
    </Container>
  );
};

// Define the columns configuration for the playlists table outside the component
// to avoid re-creation on every render and allow access to t() via a function.
const getPlaylistColumns = (t: (key: string, options?: object) => string, canManagePlaylists: boolean, handleEditClick: (playlist: Playlist) => void, handleDeleteClick: (playlist: Playlist) => void): ColumnDefinition<Playlist>[] => [
  {
    header: t('table_header_name'),
    field: 'name',
    width: '20%',
    sortField: 'name',
  },
  {
    header: t('table_header_status'),
    width: '10%',
    align: 'center',
    sortField: 'is_active',
    render: (playlist) => (
      <Chip
        label={playlist.is_active ? t('playlist_status_active') : t('playlist_status_inactive')}
        color={playlist.is_active ? 'success' : 'default'}
        size="small"
      />
    ),
  },
  {
    header: t('table_header_published_at'),
    width: '15%',
    sortField: 'published_at',
    render: (playlist) => {
      try {
        return (
          <Typography variant="body2">
            {playlist.published_at && playlist.published_at !== 'null'
              ? format(new Date(playlist.published_at), 'PPp', { locale: es })
              : t('playlist_date_not_scheduled')}
          </Typography>
        );
      } catch (error) {
        return (
          <Typography variant="body2">
            {t('playlist_date_not_scheduled')}
          </Typography>
        );
      }
    },
  },
  {
    header: t('table_header_unpublished_at'),
    width: '15%',
    sortField: 'unpublished_at',
    render: (playlist) => {
      try {
        return (
          <Typography variant="body2">
            {playlist.unpublished_at && playlist.unpublished_at !== 'null'
              ? format(new Date(playlist.unpublished_at), 'PPp', { locale: es })
              : t('playlist_date_not_scheduled')}
          </Typography>
        );
      } catch (error) {
        return (
          <Typography variant="body2">
            {t('playlist_date_not_scheduled')}
          </Typography>
        );
      }
    },
  },
  {
    header: t('table_header_created_at'),
    field: 'created_at',
    width: '15%',
    sortField: 'created_at',
    render: (playlist) => {
      try {
        return (
          <Typography variant="body2">
            {playlist.created_at && playlist.created_at !== 'null'
              ? format(new Date(playlist.created_at), 'PPp', { locale: es })
              : '-'}
          </Typography>
        );
      } catch (error) {
        return (
          <Typography variant="body2">
            -
          </Typography>
        );
      }
    },
  },
  {
    header: t('table_header_actions'),
    width: '15%',
    align: 'center',
    render: (playlist) => (
      <Box display="flex" gap={1} justifyContent="center">
        <Tooltip title={canManagePlaylists ? t('tooltip_edit_playlist') : t('tooltip_no_permission_edit_playlists')}>
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
        <Tooltip title={canManagePlaylists ? t('tooltip_delete_playlist') : t('tooltip_no_permission_delete_playlists')}>
          <span>
            <IconButton
              size="small"
              color="error"
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