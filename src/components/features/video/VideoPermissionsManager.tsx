import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  ButtonGroup,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VideoLibrary as VideoLibraryIcon,
  Comment as CommentIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  VideoPermissions,
  VideoPermissionsManagerProps,
  PlaylistOption,
  DEFAULT_VIDEO_PERMISSIONS,
  PLAYLIST_POSITION_OPTIONS,
} from '../../../types/videoPermissions.types';
import { useVideoPermissions } from '../../../hooks/features/video/useVideoPermissions';
import { useVideoPermissionsMutation } from '../../../hooks/features/video/useVideoPermissionsMutation';

export const VideoPermissionsManager: React.FC<VideoPermissionsManagerProps> = ({
  videoItemId,
  onSave,
  isLoading: externalLoading = false,
}) => {
  const { t } = useTranslation();
  
  // Hooks para datos del backend
  const { data: existingPermissions, isLoading: isLoadingPermissions, error } = useVideoPermissions(videoItemId);
  const { upsert, publish, isLoading: isSaving } = useVideoPermissionsMutation();

  // Estado local para los permisos
  const [permissions, setPermissions] = useState<Omit<VideoPermissions, 'id' | 'videoItemId' | 'createdAt' | 'updatedAt' | 'videoItem' | 'createdBy'>>(DEFAULT_VIDEO_PERMISSIONS);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  // Cargar permisos existentes cuando se obtienen del backend
  useEffect(() => {
    if (existingPermissions) {
      setPermissions({
        showWaveCount: existingPermissions.showWaveCount,
        showVideos: existingPermissions.showVideos,
        showVideoSubtitles: existingPermissions.showVideoSubtitles,
        showComments: existingPermissions.showComments,
        showPublishDate: existingPermissions.showPublishDate,
        showVideoDuration: existingPermissions.showVideoDuration,
        showLikeButton: existingPermissions.showLikeButton,
        allowRewindForward: existingPermissions.allowRewindForward,
        allowViewComments: existingPermissions.allowViewComments,
        allowMakeComments: existingPermissions.allowMakeComments,
        showLikeComments: existingPermissions.showLikeComments,
        sortCommentsByAffinity: existingPermissions.sortCommentsByAffinity,
        showCommenterName: existingPermissions.showCommenterName,
        playlistPosition: existingPermissions.playlistPosition,
        isDraft: existingPermissions.isDraft,
        createdById: existingPermissions.createdById,
      });
    }
  }, [existingPermissions]);

  const isLoading = externalLoading || isLoadingPermissions || isSaving;

  const handlePermissionChange = (key: keyof typeof permissions, value: boolean | string) => {
    setPermissions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveDraft = () => {
    upsert({
      videoItemId,
      permissions: {
        ...permissions,
        isDraft: true,
      },
    });
    onSave?.(existingPermissions!);
  };

  const handlePublish = () => {
    if (existingPermissions?.isDraft) {
      // Si ya existe como borrador, publicar directamente
      publish(videoItemId);
    } else {
      // Si no existe o no es borrador, guardar primero y luego publicar
      upsert({
        videoItemId,
        permissions: {
          ...permissions,
          isDraft: false,
        },
      });
    }
    setShowPublishDialog(false);
    onSave?.(existingPermissions!);
  };

  const handlePublishClick = () => {
    setShowPublishDialog(true);
  };

  if (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error desconocido al cargar los permisos del video';
    
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error al cargar los permisos del video: {errorMessage}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('Configuración de Permisos')}
      </Typography>

      {isLoading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {/* Estado del video */}
      {existingPermissions && (
        <Box sx={{ mb: 3 }}>
          <Chip
            label={existingPermissions.isDraft ? 'Borrador' : 'Publicado'}
            color={existingPermissions.isDraft ? 'warning' : 'success'}
            variant="outlined"
          />
        </Box>
      )}

      {/* Derechos de visualización del jugador */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <VisibilityIcon />
            <Typography variant="h6">
              {t('Derechos de Visualización del Jugador')}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showWaveCount}
                  onChange={(e) => handlePermissionChange('showWaveCount', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar contador de ondas')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showVideos}
                  onChange={(e) => handlePermissionChange('showVideos', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar videos')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showVideoSubtitles}
                  onChange={(e) => handlePermissionChange('showVideoSubtitles', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar subtítulos de video')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showComments}
                  onChange={(e) => handlePermissionChange('showComments', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar comentarios')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showPublishDate}
                  onChange={(e) => handlePermissionChange('showPublishDate', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar fecha de publicación')}
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Configuraciones de video */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <VideoLibraryIcon />
            <Typography variant="h6">
              {t('Configuraciones de Video')}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showVideoDuration}
                  onChange={(e) => handlePermissionChange('showVideoDuration', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar duración del video')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showLikeButton}
                  onChange={(e) => handlePermissionChange('showLikeButton', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar botón de like')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.allowRewindForward}
                  onChange={(e) => handlePermissionChange('allowRewindForward', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Permitir rebobinar/avanzar')}
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Configuraciones de comentarios */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <CommentIcon />
            <Typography variant="h6">
              {t('Configuraciones de Comentarios')}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.allowViewComments}
                  onChange={(e) => handlePermissionChange('allowViewComments', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Permitir ver comentarios')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.allowMakeComments}
                  onChange={(e) => handlePermissionChange('allowMakeComments', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Permitir hacer comentarios')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showLikeComments}
                  onChange={(e) => handlePermissionChange('showLikeComments', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar likes en comentarios')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.sortCommentsByAffinity}
                  onChange={(e) => handlePermissionChange('sortCommentsByAffinity', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Ordenar comentarios por afinidad')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.showCommenterName}
                  onChange={(e) => handlePermissionChange('showCommenterName', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={t('Mostrar nombre del comentarista')}
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Posición en playlist */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon />
            <Typography variant="h6">
              {t('Posición en Playlist')}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            value={PLAYLIST_POSITION_OPTIONS.find(option => option.value === permissions.playlistPosition) || null}
            onChange={(_, newValue) => {
              if (newValue) {
                handlePermissionChange('playlistPosition', newValue.value);
              }
            }}
            options={PLAYLIST_POSITION_OPTIONS}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('Seleccionar posición')}
                variant="outlined"
                fullWidth
              />
            )}
            disabled={isLoading}
          />
        </AccordionDetails>
      </Accordion>

      {/* Botones de acción */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={handleSaveDraft}
          disabled={isLoading}
        >
          {t('Guardar Borrador')}
        </Button>
        <Button
          variant="contained"
          startIcon={<PublishIcon />}
          onClick={handlePublishClick}
          disabled={isLoading}
        >
          {t('Publicar Video')}
        </Button>
      </Box>

      {/* Dialog de confirmación de publicación */}
      <Dialog open={showPublishDialog} onClose={() => setShowPublishDialog(false)}>
        <DialogTitle>{t('Confirmar Publicación')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('¿Estás seguro de que quieres publicar este video con la configuración actual de permisos?')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPublishDialog(false)}>
            {t('Cancelar')}
          </Button>
          <Button onClick={handlePublish} variant="contained" autoFocus>
            {t('Publicar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 