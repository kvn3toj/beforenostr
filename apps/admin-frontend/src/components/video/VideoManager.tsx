/**
 * 🎬 VideoManager Component - Gamifier Admin
 * 
 * Gestión completa de videos para ÜPlay (GPL - Gamified Play List)
 * Permite CRUD de videos con preguntas interactivas, análisis y configuración
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon,
  VideoLibrary as VideoLibraryIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

// Types
interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
  isActive: boolean;
  questions: VideoQuestion[];
  analytics?: {
    totalViews: number;
    avgCompletionRate: number;
    avgAccuracy: number;
    totalMeritos: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface VideoQuestion {
  id: string;
  timestamp: number;
  endTimestamp: number;
  type: 'binary-choice' | 'multiple-choice' | 'true-false';
  question: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  options: Array<{
    id: string;
    label: string;
    text: string;
  }>;
  correctAnswer: string;
  reward: {
    meritos: number;
    ondas: number;
  };
  isActive: boolean;
}

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

const VideoManager: React.FC = () => {
  // State
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);

  // Mock data para desarrollo
  const mockVideos: VideoItem[] = [
    {
      id: '1',
      title: 'Fundamentos del Ayni - Filosofía de Reciprocidad',
      description: 'Exploración profunda del concepto andino de Ayni y su aplicación en la economía colaborativa moderna.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
      duration: 900, // 15 minutos
      isActive: true,
      questions: [
        {
          id: 'q1',
          timestamp: 120,
          endTimestamp: 150,
          type: 'binary-choice',
          question: '¿El Ayni representa el principio de reciprocidad equilibrada?',
          timeLimit: 30,
          difficulty: 'easy',
          options: [
            { id: 'a', label: 'A', text: 'Sí, es el fundamento de la reciprocidad justa' },
            { id: 'b', label: 'B', text: 'No, se refiere solo a intercambios comerciales' }
          ],
          correctAnswer: 'a',
          reward: { meritos: 15, ondas: 8 },
          isActive: true
        }
      ],
      analytics: {
        totalViews: 1250,
        avgCompletionRate: 78.5,
        avgAccuracy: 82.3,
        totalMeritos: 15625
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    }
  ];

  // Effects
  useEffect(() => {
    loadVideos();
  }, []);

  // Handlers
  const loadVideos = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 800));
      setVideos(mockVideos);
    } catch (err) {
      setError('Error cargando videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVideo = () => {
    setEditingVideo({
      title: '',
      description: '',
      url: '',
      duration: 0,
      isActive: true,
      questions: []
    });
    setIsVideoDialogOpen(true);
  };

  const handleEditVideo = (video: VideoItem) => {
    setEditingVideo({ ...video });
    setIsVideoDialogOpen(true);
  };

  const handleSaveVideo = async () => {
    if (!editingVideo) return;
    
    setIsLoading(true);
    try {
      // TODO: Llamada real al backend
      if (editingVideo.id) {
        // Actualizar
        setVideos(prev => prev.map(v => v.id === editingVideo.id ? { ...v, ...editingVideo } as VideoItem : v));
      } else {
        // Crear nuevo
        const newVideo: VideoItem = {
          ...editingVideo,
          id: `video-${Date.now()}`,
          questions: editingVideo.questions || [],
          analytics: {
            totalViews: 0,
            avgCompletionRate: 0,
            avgAccuracy: 0,
            totalMeritos: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as VideoItem;
        setVideos(prev => [newVideo, ...prev]);
      }
      setIsVideoDialogOpen(false);
      setEditingVideo(null);
    } catch (err) {
      setError('Error guardando video');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <VideoLibraryIcon fontSize="large" />
            VideoManager - ÜPlay
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestión completa de videos gamificados con preguntas interactivas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateVideo}
          sx={{ height: 'fit-content' }}
        >
          Crear Video
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Videos" icon={<VideoLibraryIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
        </Tabs>
      </Box>

      {/* Videos Tab */}
      <TabPanel value={tabValue} index={0}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} md={6} lg={4} key={video.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnailUrl || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'}
                    alt={video.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {video.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        size="small" 
                        label={formatDuration(video.duration)} 
                        icon={<ScheduleIcon />}
                      />
                      <Chip 
                        size="small" 
                        label={`${video.questions.length} preguntas`} 
                        icon={<QuizIcon />}
                      />
                      <Chip 
                        size="small" 
                        label={video.isActive ? 'Activo' : 'Inactivo'} 
                        color={video.isActive ? 'success' : 'default'}
                      />
                    </Box>

                    {video.analytics && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" display="block">
                          <PeopleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          {video.analytics.totalViews} visualizaciones
                        </Typography>
                        <Typography variant="caption" display="block">
                          <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          {video.analytics.avgCompletionRate.toFixed(1)}% completado
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Tooltip title="Ver video">
                      <IconButton size="small" color="primary">
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEditVideo(video)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gestionar preguntas">
                      <IconButton size="small" color="secondary">
                        <QuizIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Total Videos</Typography>
                <Typography variant="h4">{videos.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Total Visualizaciones</Typography>
                <Typography variant="h4">
                  {videos.reduce((sum, v) => sum + (v.analytics?.totalViews || 0), 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Preguntas Activas</Typography>
                <Typography variant="h4">
                  {videos.reduce((sum, v) => sum + v.questions.filter(q => q.isActive).length, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Mëritos Generados</Typography>
                <Typography variant="h4">
                  {videos.reduce((sum, v) => sum + (v.analytics?.totalMeritos || 0), 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Video Dialog */}
      <Dialog 
        open={isVideoDialogOpen} 
        onClose={() => setIsVideoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingVideo?.id ? 'Editar Video' : 'Crear Nuevo Video'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título del Video"
                value={editingVideo?.title || ''}
                onChange={(e) => setEditingVideo(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={editingVideo?.description || ''}
                onChange={(e) => setEditingVideo(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL del Video"
                value={editingVideo?.url || ''}
                onChange={(e) => setEditingVideo(prev => ({ ...prev, url: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Duración (segundos)"
                value={editingVideo?.duration || ''}
                onChange={(e) => setEditingVideo(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingVideo?.isActive || false}
                    onChange={(e) => setEditingVideo(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Video Activo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsVideoDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveVideo} 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el video "{selectedVideo?.title}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoManager; 