import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Paper,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { usePlaylistQuery } from '../hooks/usePlaylistQuery';
import { usePlaylistItemsQuery } from '../hooks/usePlaylistItemsQuery';
import { useCreatePlaylistItemMutation } from '../hooks/useCreatePlaylistItemMutation';
import { useDeletePlaylistItemMutation } from '../hooks/useDeletePlaylistItemMutation';
import { PlaylistItemCard } from '../components/playlists/PlaylistItemCard';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { usePlaylistVersionsQuery } from '../hooks/features/playlists/usePlaylistVersionsQuery';
import { useRestorePlaylistVersionMutation } from '../hooks/features/playlists/useRestorePlaylistVersionMutation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlaylistVersion } from '../types/playlist.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`video-tabpanel-${index}`}
      aria-labelledby={`video-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const PlaylistDetailPage = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  
  // Estados
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tabValue, setTabValue] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [isDefaultVideo1, setIsDefaultVideo1] = useState(false);
  const [isDefaultVideo2, setIsDefaultVideo2] = useState(false);
  const [isDefaultVideo3, setIsDefaultVideo3] = useState(false);
  const [isFinalVideo, setIsFinalVideo] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [versionToRestore, setVersionToRestore] = useState<PlaylistVersion | null>(null);
  const [isRestoreConfirmDialogOpen, setIsRestoreConfirmDialogOpen] = useState(false);

  // Queries
  const {
    data: playlist,
    isLoading: isLoadingPlaylist,
    error: playlistError,
  } = usePlaylistQuery(playlistId || '');

  const {
    data: items = [],
    isLoading: isLoadingItems,
    error: itemsError,
  } = usePlaylistItemsQuery(playlistId || '');

  const { data: versions, isLoading: isLoadingVersions, isError: isErrorVersions, error: versionsError } = usePlaylistVersionsQuery(playlistId);

  // Debug logs
  console.log('[PlaylistDetailPage] Renderizando. Estado:', {
    playlistId,
    isLoadingPlaylist,
    isLoadingItems,
    playlist: playlist?.name,
    itemsCount: items?.length,
    errorPlaylist: playlistError?.message,
    errorItems: itemsError?.message
  });

  // Mutations
  const { mutate: createItemMutate, isPending: isCreatingItem } = useCreatePlaylistItemMutation();
  const { mutate: deleteItemMutate, isPending: isDeletingItem } = useDeletePlaylistItemMutation();
  const { mutate: restoreVersion, isPending: isRestoring } = useRestorePlaylistVersionMutation();

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddVideo = () => {
    if (!playlistId || !videoUrl) return;

    // Aquí deberías procesar la URL para obtener el código de iframe
    // Por ahora es un placeholder
    const iframeCode = `<iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    createItemMutate(
      {
        playlist_id: playlistId,
        content: iframeCode,
        is_default_1: isDefaultVideo1,
        is_default_2: isDefaultVideo2,
        is_default_3: isDefaultVideo3,
        is_final: isFinalVideo,
      },
      {
        onSuccess: () => {
          setVideoUrl('');
          setIsDefaultVideo1(false);
          setIsDefaultVideo2(false);
          setIsDefaultVideo3(false);
          setIsFinalVideo(false);
          toast.success('Video añadido exitosamente');
        },
        onError: (error) => {
          toast.error('Error al añadir el video: ' + error.message);
        },
      }
    );
  };

  const handleDeleteClick = (itemId: string) => {
    setDeletingItemId(itemId);
  };

  const handleDeleteConfirm = () => {
    if (deletingItemId) {
      deleteItemMutate(deletingItemId, {
        onSuccess: () => {
          setDeletingItemId(null);
          toast.success('Video eliminado exitosamente');
        },
        onError: (error) => {
          toast.error('Error al eliminar el video: ' + error.message);
        },
      });
    }
  };

  const handleRestoreClick = (version: PlaylistVersion) => {
    setVersionToRestore(version);
    setIsRestoreConfirmDialogOpen(true);
  };

  const handleRestoreConfirm = () => {
    if (versionToRestore && playlistId) {
      restoreVersion(
        { playlistId, versionId: versionToRestore.id },
        {
          onSuccess: () => {
            setIsRestoreConfirmDialogOpen(false);
            setVersionToRestore(null);
          },
        }
      );
    }
  };

  const handleRestoreCancel = () => {
    setIsRestoreConfirmDialogOpen(false);
    setVersionToRestore(null);
  };

  if (isLoadingPlaylist || isLoadingItems || isLoadingVersions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (playlistError || itemsError || isErrorVersions) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error: {playlistError?.message || itemsError?.message || (versionsError instanceof Error ? versionsError.message : 'Error desconocido')}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={3}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton 
            onClick={() => navigate('/playlists')}
            sx={{ mr: 2 }}
            aria-label="volver"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {playlist?.name}
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="video tabs">
            <Tab label="Añadir video" />
            <Tab label="Lista de videos" />
            <Tab label="Historial de versiones" />
          </Tabs>

          {/* Add Video Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="URL del video"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                margin="normal"
                required
              />

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                Configuración del video
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDefaultVideo1}
                        onChange={(e) => setIsDefaultVideo1(e.target.checked)}
                      />
                    }
                    label="Video predeterminado 1"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDefaultVideo2}
                        onChange={(e) => setIsDefaultVideo2(e.target.checked)}
                      />
                    }
                    label="Video predeterminado 2"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDefaultVideo3}
                        onChange={(e) => setIsDefaultVideo3(e.target.checked)}
                      />
                    }
                    label="Video predeterminado 3"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isFinalVideo}
                        onChange={(e) => setIsFinalVideo(e.target.checked)}
                      />
                    }
                    label="Video final"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleAddVideo}
                  disabled={!videoUrl || isCreatingItem}
                  startIcon={<AddIcon />}
                >
                  Añadir video
                </Button>
              </Box>
            </Box>
          </TabPanel>

          {/* Videos List Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton 
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewListIcon />
              </IconButton>
              <IconButton 
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModuleIcon />
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={viewMode === 'grid' ? 6 : 12} 
                  md={viewMode === 'grid' ? 4 : 12} 
                  key={item.id}
                >
                  <PlaylistItemCard
                    item={item}
                    onNavigate={(itemId) => navigate(`/items/${itemId}/config`)}
                    onDelete={handleDeleteClick}
                  />
                </Grid>
              ))}
              {items.length === 0 && (
                <Grid item xs={12}>
                  <Typography color="text.secondary" align="center">
                    No hay videos en esta playlist. Añade uno en la pestaña "Añadir video".
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Versions Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" component="h2" gutterBottom>
              Historial de versiones
            </Typography>

            {isLoadingVersions && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            )}

            {isErrorVersions && (
              <Alert severity="error" sx={{ my: 2 }}>
                Error al cargar el historial de versiones: {versionsError instanceof Error ? versionsError.message : 'Error desconocido'}
              </Alert>
            )}

            {!isLoadingVersions && !isErrorVersions && versions && versions.length === 0 && (
              <Alert severity="info" sx={{ my: 2 }}>
                No hay versiones anteriores disponibles
              </Alert>
            )}

            {versions && versions.length > 0 && (
              <Paper sx={{ mt: 2 }}>
                <List>
                  {versions.map((version, index) => (
                    <Box key={version.id}>
                      <ListItem
                        secondaryAction={
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RestoreIcon />}
                            onClick={() => handleRestoreClick(version)}
                          >
                            Restaurar
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              Versión {version.version}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {version.name}
                              </Typography>
                              {' — '}
                              {format(new Date(version.timestamp), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                            </>
                          }
                        />
                      </ListItem>
                      {index < versions.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </Paper>
            )}
          </TabPanel>
        </Paper>
      </Box>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(deletingItemId)}
        onClose={() => setDeletingItemId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Video"
        content="¿Estás seguro de que deseas eliminar este video? Esta acción no se puede deshacer."
        isLoading={isDeletingItem}
      />

      {/* Restore Version Confirmation Dialog */}
      <ConfirmDialog
        open={isRestoreConfirmDialogOpen}
        onClose={handleRestoreCancel}
        onConfirm={handleRestoreConfirm}
        title="Confirmar Restauración"
        content={`¿Estás seguro de que deseas restaurar la versión ${versionToRestore?.version}? Esta acción creará una nueva versión con los datos de la versión seleccionada.`}
        isLoading={isRestoring}
      />
    </Container>
  );
}; 