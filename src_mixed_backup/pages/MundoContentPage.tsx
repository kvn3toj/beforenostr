// MundoContentPage.tsx

import React, { useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { PlaylistCard } from '../components/playlists/PlaylistCard';
import { CreatePlaylistCard } from '../components/playlists/CreatePlaylistCard';
import { CreatePlaylistDialog } from '../components/playlists/CreatePlaylistDialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { FolderCard } from '../components/folders/FolderCard';
import { CreateFolderCard } from '../components/folders/CreateFolderCard';
import { CreateFolderDialog } from '../components/folders/CreateFolderDialog';
import { EditFolderNameDialog } from '../components/folders/EditFolderNameDialog';
import { usePlaylistsQuery } from '../hooks/usePlaylistsQuery';
import { useFoldersQuery } from '../hooks/useFoldersQuery';
import { useCreatePlaylistMutation } from '../hooks/features/playlists/useCreatePlaylistMutation';
import { useUpdatePlaylistStatusMutation } from '../hooks/features/playlists/useUpdatePlaylistStatusMutation';
import { useDeletePlaylistMutation } from '../hooks/features/playlists/useDeletePlaylistMutation';
import { useCreateFolderMutation } from '../hooks/features/mundos/useCreateFolderMutation';
import { useUpdateFolderPinMutation } from '../hooks/useUpdateFolderPinMutation';
import { useDeleteFolderMutation } from '../hooks/useDeleteFolderMutation';
import { useUpdateFolderNameMutation } from '../hooks/useUpdateFolderNameMutation';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import type { PlaylistFolder } from '../types/folder.types';
import type { Playlist } from '../types/playlist.types';
import type { FetchPlaylistsParams } from '../services/playlist.service';
import { useParams, Navigate } from 'react-router-dom';

export const MundoContentPage: React.FC = () => {
  // Obtener el mundoId de los parámetros de la URL
  const { mundoId } = useParams<{ mundoId: string }>();
  
  // Verificar que existe el mundoId
  if (!mundoId) {
    return <Navigate to="/select-mundo" replace />;
  }
  
  // Estados para diálogos
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [deletingPlaylistId, setDeletingPlaylistId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<PlaylistFolder | null>(null);
  
  // User info
  const { user } = useAuth();
  
  // Query hooks
  const playlistQueryParams: FetchPlaylistsParams = {
    page: 0,
    pageSize: 100,
    sortBy: null,
    sortDirection: null,
    filters: {
      mundo_id: mundoId,
      is_active: true,
    },
  };
  const { data: playlistsData, isLoading: isLoadingPlaylists, error: errorPlaylists } = usePlaylistsQuery(playlistQueryParams);
  const { data: foldersData, isLoading: isLoadingFolders, error: errorFolders } = useFoldersQuery(mundoId);

  // Access data safely, default to empty array if data is null/undefined or missing .data
  const playlists = playlistsData?.data || [];
  const folders = foldersData || [];

  // Debug logs
  console.log('[MundoContentPage] Renderizando. Estado:', {
    mundoId,
    isLoadingFolders,
    isLoadingPlaylists,
    foldersCount: folders?.length,
    playlistsCount: playlists?.length,
    errorFolders: errorFolders?.message,
    errorPlaylists: errorPlaylists?.message
  });

  // Mutaciones Playlists
  const { mutate: createPlaylistMutate, isPending: isCreatingPlaylist } = useCreatePlaylistMutation();
  const { mutate: updatePlaylistStatusMutate } = useUpdatePlaylistStatusMutation();
  const { mutate: deletePlaylistMutate, isPending: isDeletingPlaylist } = useDeletePlaylistMutation();

  // Mutaciones Carpetas
  const { mutate: createFolderMutate, isPending: isCreatingFolder } = useCreateFolderMutation();
  const { mutate: updatePinMutate } = useUpdateFolderPinMutation(mundoId);
  const { mutate: deleteFolderMutate, isPending: isDeletingFolder } = useDeleteFolderMutation(mundoId);
  const { mutate: updateFolderNameMutate, isPending: isUpdatingName } = useUpdateFolderNameMutation(mundoId);

  // Manejadores Creación Playlist
  const handleOpenCreatePlaylistDialog = () => setIsCreatePlaylistDialogOpen(true);
  const handleCloseCreatePlaylistDialog = () => setIsCreatePlaylistDialogOpen(false);
  const handleCreatePlaylistSubmit = (name: string) => {
    const userId = user?.id;
    if (!userId) {
      toast.error("Error: ID de usuario no encontrado.");
      return;
    }
    
    const playlistData = {
      name,
      mundo_id: mundoId,
      published_at: null,
      unpublished_at: null,
    };
    
    // El hook maneja onSuccess y onError internamente
    createPlaylistMutate(playlistData, {
      onSuccess: () => {
        handleCloseCreatePlaylistDialog();
      }
    });
  };

  // Manejadores Creación Carpeta
  const handleOpenCreateFolderDialog = () => setIsCreateFolderDialogOpen(true);
  const handleCloseCreateFolderDialog = () => setIsCreateFolderDialogOpen(false);
  const handleCreateFolderSubmit = (name: string) => {
    const userId = user?.id;
    if (!userId) {
      toast.error("Error: ID de usuario no encontrado.");
      return;
    }
    
    const folderData = { name, mundo_id: mundoId };
    
    // El hook maneja onSuccess y onError internamente
    createFolderMutate({ data: folderData, userId }, {
      onSuccess: () => {
        handleCloseCreateFolderDialog();
      }
    });
  };

  // Manejadores Eliminación Playlist
  const handleDeletePlaylistClick = (playlistId: string) => setDeletingPlaylistId(playlistId);
  const handleDeletePlaylistDialogClose = () => setDeletingPlaylistId(null);
  const handleDeletePlaylistConfirm = () => {
    if (!deletingPlaylistId) return;
    
    // El hook maneja onSuccess y onError internamente
    deletePlaylistMutate(deletingPlaylistId, {
      onSuccess: () => {
        handleDeletePlaylistDialogClose();
      }
    });
  };

  // Manejadores Eliminación Carpeta
  const handleDeleteFolderClick = (folderId: string) => setDeletingFolderId(folderId);
  const handleDeleteFolderDialogClose = () => setDeletingFolderId(null);
  const handleDeleteFolderConfirm = () => {
    if (!deletingFolderId) return;
    
    // El hook maneja onSuccess y onError internamente
    deleteFolderMutate(deletingFolderId, {
      onSuccess: () => {
        handleDeleteFolderDialogClose();
      }
    });
  };

  // Manejadores Toggle Estado Playlist
  const handleTogglePlaylistActive = (id: string, isActive: boolean) => {
    // El hook maneja onSuccess y onError internamente
    updatePlaylistStatusMutate({ id, isActive });
  };

  // Manejadores Toggle Pin Carpeta
  const handleToggleFolderPin = (id: string, isPinned: boolean) => {
    // El hook maneja onSuccess y onError internamente
    updatePinMutate({ folderId: id, isPinned });
  };

  // Manejador Edición Carpeta
  const handleEditFolderClick = (folder: PlaylistFolder) => {
    setEditingFolder(folder);
  };

  const handleCloseEditFolderDialog = () => setEditingFolder(null);
  
  const handleEditFolderSubmit = (newName: string) => {
    if (!editingFolder) return;
    
    // El hook maneja onSuccess y onError internamente
    updateFolderNameMutate(
      { id: editingFolder.id, name: newName },
      {
        onSuccess: () => {
          handleCloseEditFolderDialog();
        }
      }
    );
  };

  // Implement playlist edit handler (placeholder)
  const handleEditPlaylistClick = (playlist: Playlist) => {
    console.log("Editar playlist:", playlist.id);
    // TODO: Implement actual playlist editing logic, e.g., open a dialog
  };

  // --- Memoized Data and Render Variables ---
  // Use useMemo to prevent re-filtering on every render if data hasn't changed
  const folderToDelete = useMemo(() => {
    return folders.find((f: PlaylistFolder) => f.id === deletingFolderId);
  }, [folders, deletingFolderId]);

  const playlistToDelete = useMemo(() => {
    return playlists.find((p: Playlist) => p.id === deletingPlaylistId);
  }, [playlists, deletingPlaylistId]);

  // --- Renderizado ---
  const isLoading = isLoadingPlaylists || isLoadingFolders;
  const error = errorPlaylists || errorFolders;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error al cargar datos: { error?.message ?? 'Error desconocido'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contenido del Mundo
        </Typography>

        {/* Sección de Carpetas */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Carpetas
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CreateFolderCard onClick={handleOpenCreateFolderDialog} />
          </Grid>
          {folders.map((folder: PlaylistFolder) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
              <FolderCard
                folder={folder}
                onPinToggle={handleToggleFolderPin}
                onDelete={handleDeleteFolderClick}
                onEdit={handleEditFolderClick}
              />
            </Grid>
          ))}
        </Grid>

        {/* Sección de Playlists */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Playlists
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CreatePlaylistCard onClick={handleOpenCreatePlaylistDialog} />
          </Grid>
          {playlists.map((playlist: Playlist) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={playlist.id}>
              <PlaylistCard
                playlist={playlist}
                onToggleActive={handleTogglePlaylistActive}
                onDelete={handleDeletePlaylistClick}
                onEdit={() => handleEditPlaylistClick(playlist)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialogs */}
      <CreatePlaylistDialog
        open={isCreatePlaylistDialogOpen}
        onClose={handleCloseCreatePlaylistDialog}
        onSubmit={handleCreatePlaylistSubmit}
        isLoading={isCreatingPlaylist}
      />

      <CreateFolderDialog
        open={isCreateFolderDialogOpen}
        onClose={handleCloseCreateFolderDialog}
        onSubmit={handleCreateFolderSubmit}
        isLoading={isCreatingFolder}
      />

      <EditFolderNameDialog
        open={Boolean(editingFolder)}
        onClose={handleCloseEditFolderDialog}
        onSubmit={handleEditFolderSubmit}
        isLoading={isUpdatingName}
        initialName={editingFolder?.name ?? ''}
      />

      <ConfirmDialog
        open={!!deletingPlaylistId}
        title="Eliminar Playlist"
        message={`¿Estás seguro de que deseas eliminar la playlist "${playlistToDelete?.name ?? ''}"?`}
        onConfirm={handleDeletePlaylistConfirm}
        onClose={handleDeletePlaylistDialogClose}
        isLoading={isDeletingPlaylist}
      />

      <ConfirmDialog
        open={!!deletingFolderId}
        title="Eliminar Carpeta"
        message={`¿Estás seguro de que deseas eliminar la carpeta "${folderToDelete?.name ?? ''}"? Se moverá a la papelera y se eliminará definitivamente en 30 días.`}
        onConfirm={handleDeleteFolderConfirm}
        onClose={handleDeleteFolderDialogClose}
        isLoading={isDeletingFolder}
      />
    </Container>
  );
};
