import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Autocomplete,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { CreateStudyRoomData } from '../../hooks/useStudyRooms';

interface Video {
  id: string;
  title: string;
  duration?: number;
  thumbnailUrl?: string;
}

interface CreateStudyRoomDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateRoom: (data: CreateStudyRoomData) => Promise<void>;
  videos: Video[];
  isCreating?: boolean;
}

export const CreateStudyRoomDialog: React.FC<CreateStudyRoomDialogProps> = ({
  open,
  onClose,
  onCreateRoom,
  videos,
  isCreating = false,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    selectedVideo: Video | null;
    maxParticipants: number;
    isPublic: boolean;
  }>({
    name: '',
    description: '',
    selectedVideo: null,
    maxParticipants: 10,
    isPublic: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    if (!isCreating) {
      setFormData({
        name: '',
        description: '',
        selectedVideo: null,
        maxParticipants: 10,
        isPublic: true,
      });
      setErrors({});
      onClose();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la sala es obligatorio';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.selectedVideo) {
      newErrors.selectedVideo = 'Debes seleccionar un video';
    }

    if (formData.maxParticipants < 2) {
      newErrors.maxParticipants = 'Debe haber al menos 2 participantes';
    } else if (formData.maxParticipants > 50) {
      newErrors.maxParticipants = 'Máximo 50 participantes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const roomData: CreateStudyRoomData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        videoId: formData.selectedVideo!.id,
        maxParticipants: formData.maxParticipants,
      };

      await onCreateRoom(roomData);
      handleClose();
    } catch (error) {
      console.error('Error creating room:', error);
      setErrors({ general: 'Error al crear la sala. Inténtalo de nuevo.' });
    }
  };

  const handleVideoSelect = (video: Video | null) => {
    setFormData(prev => ({ ...prev, selectedVideo: video }));
    if (errors.selectedVideo) {
      setErrors(prev => ({ ...prev, selectedVideo: '' }));
    }

    // Auto-fill room name if empty
    if (video && !formData.name.trim()) {
      setFormData(prev => ({
        ...prev,
        name: `Sala: ${video.title.substring(0, 30)}${video.title.length > 30 ? '...' : ''}`
      }));
    }
  };

  const formatVideoDuration = (duration?: number) => {
    if (!duration) return '';
    const minutes = Math.round(duration / 60);
    return `${minutes}min`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon color="primary" />
          <Typography variant="h6" component="span">
            Crear Sala de Estudio
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Invita a otros jugadores a ver un video juntos
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* General Error */}
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          {/* Video Selection */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <VideoIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2">
                Seleccionar Video *
              </Typography>
            </Box>
            <Autocomplete
              value={formData.selectedVideo}
              onChange={(_, value) => handleVideoSelect(value)}
              options={videos}
              getOptionLabel={(option) => option.title}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {option.thumbnailUrl && (
                      <Box
                        component="img"
                        src={option.thumbnailUrl}
                        alt={option.title}
                        sx={{
                          width: 60,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 1,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="body2" noWrap>
                        {option.title}
                      </Typography>
                      {option.duration && (
                        <Typography variant="caption" color="text.secondary">
                          {formatVideoDuration(option.duration)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar video..."
                  error={!!errors.selectedVideo}
                  helperText={errors.selectedVideo}
                  fullWidth
                />
              )}
              noOptionsText="No se encontraron videos"
            />
          </Box>

          {/* Room Name */}
          <Box>
            <TextField
              label="Nombre de la Sala"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!errors.name}
              helperText={errors.name || 'Nombre descriptivo para tu sala'}
              fullWidth
              required
              inputProps={{ maxLength: 100 }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DescriptionIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2">
                Descripción (Opcional)
              </Typography>
            </Box>
            <TextField
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe de qué trata esta sesión de estudio..."
              multiline
              rows={3}
              fullWidth
              inputProps={{ maxLength: 500 }}
              helperText={`${formData.description.length}/500 caracteres`}
            />
          </Box>

          {/* Max Participants */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Máximo de Participantes: {formData.maxParticipants}
            </Typography>
            <Slider
              value={formData.maxParticipants}
              onChange={(_, value) => setFormData(prev => ({ ...prev, maxParticipants: value as number }))}
              min={2}
              max={50}
              step={1}
              marks={[
                { value: 2, label: '2' },
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              sx={{ mt: 2 }}
            />
            {errors.maxParticipants && (
              <Typography variant="caption" color="error">
                {errors.maxParticipants}
              </Typography>
            )}
          </Box>

          {/* Public/Private Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2">
                  {formData.isPublic ? 'Sala Pública' : 'Sala Privada'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formData.isPublic 
                    ? 'Cualquier jugador puede unirse' 
                    : 'Solo usuarios invitados pueden unirse'
                  }
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={isCreating}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating || !formData.selectedVideo || !formData.name.trim()}
          startIcon={isCreating ? <CircularProgress size={16} /> : <PeopleIcon />}
        >
          {isCreating ? 'Creando...' : 'Crear Sala'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};