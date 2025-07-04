import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Stack,
  Container,
  Button,
  Grid,
} from '@mui/material';
import {
  Subtitles as SubtitlesIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  SmartDisplay as VideoIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSubtitlesQuery } from '../../../hooks/features/subtitles/useSubtitlesQuery';
import { useDeleteSubtitleMutation } from '../../../hooks/features/subtitles/useDeleteSubtitleMutation';
import { useUpdateSubtitleMutation } from '../../../hooks/features/subtitles/useUpdateSubtitleMutation';
import { SubtitleUploadForm } from './SubtitleUploadForm';
import { SubtitleCard } from './SubtitleCard';
import { Subtitle } from '@prisma/client';

interface SubtitleManagerProps {
  videoItemId: number;
}

export const SubtitleManager: React.FC<SubtitleManagerProps> = ({ videoItemId }) => {
  const { t } = useTranslation();
  
  // Queries
  const {
    data: subtitles,
    isLoading,
    error,
    refetch
  } = useSubtitlesQuery({ videoItemId });

  // Mutations
  const { mutate: deleteSubtitle, isPending: isDeleting } = useDeleteSubtitleMutation();
  const { mutate: updateSubtitle, isPending: isUpdating } = useUpdateSubtitleMutation();

  // Handlers
  const handleUploadSuccess = () => {
    refetch();
  };

  const handleToggleActive = (id: number, isActive: boolean) => {
    updateSubtitle({
      id,
      data: { isActive }
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este subtítulo? Esta acción no se puede deshacer.')) {
      deleteSubtitle(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={56} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            Cargando subtítulos...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 4, 
          mx: 3,
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '2rem'
          }
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Error al cargar los subtítulos
        </Typography>
        <Typography variant="body2">
          {(error as Error)?.message || 'Error desconocido'}
        </Typography>
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Cabecera principal mejorada */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <SubtitlesIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Administrador de Subtítulos
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Gestiona subtítulos en múltiples idiomas
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <VideoIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Video ID: {videoItemId} • {subtitles?.length || 0} subtítulos disponibles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row', md: 'column' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CloudUploadIcon />}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Subir Subtítulos
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<LanguageIcon />}
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Gestionar Idiomas
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Formulario de Upload mejorado */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'success.light', 
              borderRadius: 2,
              color: 'success.contrastText'
            }}>
              <UploadIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                Subir Nuevo Subtítulo
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sube archivos de subtítulos en formato SRT, VTT o ASS
              </Typography>
            </Box>
          </Box>
          <SubtitleUploadForm 
            videoItemId={videoItemId} 
            onUploadSuccess={handleUploadSuccess}
          />
        </Paper>

        {/* Lista de subtítulos mejorada */}
        {!subtitles || subtitles.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              py: 8,
              bgcolor: 'grey.50',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'grey.300'
            }}
          >
            <Stack spacing={3} alignItems="center">
              <Box sx={{ 
                p: 3, 
                bgcolor: 'success.light', 
                borderRadius: '50%',
                color: 'success.contrastText'
              }}>
                <SubtitlesIcon sx={{ fontSize: 48 }} />
              </Box>
              <Box>
                <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                  No hay subtítulos disponibles
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                  Comienza subiendo archivos de subtítulos para hacer tu contenido accesible en múltiples idiomas
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ 
                bgcolor: 'info.light', 
                color: 'info.contrastText',
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 500
              }}>
                💡 Tip: Usa el formulario de arriba para subir tu primer archivo de subtítulos
              </Typography>
            </Stack>
          </Paper>
        ) : (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SubtitlesIcon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Subtítulos Disponibles ({subtitles.length})
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {subtitles.filter(s => s.isActive).length > 0 && (
                  <Typography variant="body2" color="success.main" sx={{ 
                    bgcolor: 'success.light',
                    color: 'success.contrastText',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 600
                  }}>
                    {subtitles.filter(s => s.isActive).length} activos
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ 
                  bgcolor: 'grey.100',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 500
                }}>
                  {new Set(subtitles.map(s => s.languageCode)).size} idiomas
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              {subtitles.map((subtitle: Subtitle) => (
                <Grid item xs={12} lg={6} key={subtitle.id}>
                  <SubtitleCard
                    subtitle={subtitle}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDelete}
                    disabled={isDeleting || isUpdating}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Stack>
    </Container>
  );
}; 