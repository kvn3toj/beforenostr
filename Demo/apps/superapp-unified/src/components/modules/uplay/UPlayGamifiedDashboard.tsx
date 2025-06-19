import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  Alert,
  Skeleton,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  PlayArrow,
  Schedule,
  Quiz,
  Diamond,
  Bolt,
  CheckCircle,
  TrendingUp,
  VideoLibrary,
  Playlist,
  Warning,
  Refresh,
  Info,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 🔥 HOOKS REALES DEL BACKEND - 100% DATA-DRIVEN
import { useVideos, useVideoPlaylists, useVideoCategories } from '../../../hooks/useRealBackendData';
import { useVideoQuestions } from '../../../hooks/uplay/useVideoQuestions';

// 🌌 COSMIC DESIGN SYSTEM
import { CosmicCard } from '../../../design-system/components/cosmic/CosmicCard';

// ============================================================================
// 🎯 INTERFACES REALES PARA BACKEND DATA
// ============================================================================

interface BackendVideo {
  id: number;
  title: string;
  description?: string;
  url: string;
  platform: string;
  externalId: string;
  duration: number;
  categories: string; // JSON string
  tags: string; // JSON string
  thumbnailUrl?: string;
  isActive: boolean;
  playlist?: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BackendPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  videos: BackendVideo[];
  videoCount: number;
  totalDuration: number;
}

interface ProcessedPlaylistData {
  playlistName: string;
  videos: BackendVideo[];
  totalDuration: number;
  totalVideos: number;
  completedVideos: number;
  playlistId?: string;
  description?: string;
}

// ============================================================================
// 🎨 VIDEO CARD COMPONENT - REAL BACKEND DATA
// ============================================================================

interface RealVideoCardProps {
  video: BackendVideo;
  onPlay: (video: BackendVideo) => void;
  playlistName?: string;
}

const RealVideoCard: React.FC<RealVideoCardProps> = ({ video, onPlay, playlistName }) => {
  // 📊 Obtener preguntas reales del backend para este video
  const { data: questions = [], isLoading: isQuestionsLoading } = useVideoQuestions(video.id.toString());
  
  // 🏷️ Procesar categorías desde JSON string
  const categories = useMemo(() => {
    try {
      return video.categories ? JSON.parse(video.categories) : [];
    } catch {
      return [];
    }
  }, [video.categories]);

  // ⏱️ Formato de duración legible
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 🎨 Color base según playlist
  const getPlaylistColor = (playlistName?: string): string => {
    if (!playlistName) return '#1976d2';
    
    const colors = {
      'Filosofía CoomÜnity': '#9c27b0',
      'Sistema de Gamificación': '#ff9800', 
      'Colaboración y Comunidad': '#4caf50',
      'Tecnología': '#2196f3',
      'Negocios': '#f44336',
    };
    
    return colors[playlistName as keyof typeof colors] || '#1976d2';
  };

  const accentColor = getPlaylistColor(playlistName);

  return (
    <CosmicCard
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: `2px solid transparent`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 32px ${accentColor}30`,
          border: `2px solid ${accentColor}`,
        },
      }}
      onClick={() => onPlay(video)}
    >
      {/* 🖼️ Video Thumbnail/Header */}
      <Box
        sx={{
          height: 180,
          background: video.thumbnailUrl 
            ? `url(${video.thumbnailUrl})` 
            : `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px 12px 0 0',
        }}
      >
        {/* 🎬 Play Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiCard-root:hover &': {
              opacity: 1,
            },
          }}
        >
          <IconButton
            sx={{
              bgcolor: 'rgba(255,255,255,0.95)',
              color: accentColor,
              fontSize: '3rem',
              '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' },
            }}
            size="large"
          >
            <PlayArrow fontSize="inherit" />
          </IconButton>
        </Box>

        {/* 🏷️ Platform Badge */}
        <Chip
          label={video.platform.toUpperCase()}
          size="small"
          sx={{ 
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: accentColor,
            color: 'white',
            fontWeight: 'bold',
          }}
        />

        {/* ⏱️ Duration Badge */}
        <Chip
          icon={<Schedule />}
          label={formatDuration(video.duration)}
          size="small"
          sx={{ 
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(0,0,0,0.8)',
            color: 'white',
          }}
        />
      </Box>
      
      <CardContent sx={{ p: 3 }}>
        {/* 📝 Video Title */}
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            lineHeight: 1.3,
            minHeight: '3.2em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </Typography>
        
        {/* 📄 Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            minHeight: '2.5em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.description || 'Experiencia de aprendizaje interactiva en CoomÜnity'}
        </Typography>
        
        {/* 🏷️ Categories */}
        {categories.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            {categories.slice(0, 2).map((category: string, index: number) => (
              <Chip
                key={index}
                label={category}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: accentColor,
                  color: accentColor,
                  fontSize: '0.75rem',
                }}
              />
            ))}
            {categories.length > 2 && (
              <Chip
                label={`+${categories.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'grey.400', color: 'grey.600' }}
              />
            )}
          </Stack>
        )}

        {/* 🎯 Questions & Rewards Info */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Quiz sx={{ fontSize: 18, color: accentColor }} />
            <Typography variant="caption" color="text.secondary">
              {isQuestionsLoading ? (
                <Skeleton width={60} />
              ) : (
                `${questions.length} preguntas`
              )}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<Diamond sx={{ fontSize: '14px !important' }} />}
              label="50"
              size="small"
              sx={{ 
                color: '#9c27b0',
                borderColor: '#9c27b0',
                backgroundColor: '#9c27b010',
              }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '14px !important' }} />}
              label="25"
              size="small"
              sx={{ 
                color: '#ff9800',
                borderColor: '#ff9800',
                backgroundColor: '#ff980010',
              }}
            />
          </Stack>
        </Box>

        {/* 📊 Progress Placeholder */}
        <LinearProgress
          variant="determinate"
          value={0} // TODO: Conectar con progreso real del usuario
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              bgcolor: accentColor,
            },
          }}
        />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="caption" color="text.secondary">
            Progreso
          </Typography>
          <Typography variant="caption" color="text.secondary">
            0% {/* TODO: Conectar con progreso real */}
          </Typography>
        </Box>
      </CardContent>
    </CosmicCard>
  );
};

// ============================================================================
// 🎯 PLAYLIST SECTION COMPONENT
// ============================================================================

interface PlaylistSectionProps {
  playlistData: ProcessedPlaylistData;
  onVideoPlay: (video: BackendVideo) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({ 
  playlistData, 
  onVideoPlay, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const { playlistName, videos, totalDuration, totalVideos, completedVideos, description } = playlistData;
  
  // 🎨 Color según playlist
  const getPlaylistColor = (name: string): string => {
    const colors = {
      'Filosofía CoomÜnity': '#9c27b0',
      'Sistema de Gamificación': '#ff9800', 
      'Colaboración y Comunidad': '#4caf50',
      'Tecnología': '#2196f3',
      'Negocios': '#f44336',
      'Sin Playlist': '#757575',
    };
    
    return colors[name as keyof typeof colors] || '#1976d2';
  };

  const accentColor = getPlaylistColor(playlistName);
  const completionRate = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  // ⏱️ Formato de duración total
  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Box mb={4}>
      {/* 📋 Playlist Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
          border: `1px solid ${accentColor}30`,
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
            <Avatar 
              sx={{ 
                bgcolor: accentColor, 
                width: 56, 
                height: 56,
                fontSize: '1.5rem',
              }}
            >
              <Playlist />
            </Avatar>
            
            <Box flexGrow={1}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: accentColor }}>
                🎓 {playlistName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {description || `Ruta de aprendizaje especializada de ${playlistName.toLowerCase()}`}
              </Typography>
              
              {/* 📊 Métricas de playlist */}
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Chip
                  icon={<VideoLibrary />}
                  label={`${totalVideos} videos`}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: accentColor, color: accentColor }}
                />
                <Chip
                  icon={<Schedule />}
                  label={formatTotalDuration(totalDuration)}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: accentColor, color: accentColor }}
                />
                <Chip
                  icon={<TrendingUp />}
                  label={`${Math.round(completionRate)}% completado`}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: accentColor, color: accentColor }}
                />
              </Stack>
            </Box>
          </Box>
          
          {/* 🔄 Toggle Button */}
          <Button
            variant="outlined"
            onClick={onToggleExpanded}
            sx={{ 
              borderColor: accentColor, 
              color: accentColor,
              '&:hover': { 
                borderColor: accentColor, 
                backgroundColor: `${accentColor}10` 
              }
            }}
          >
            {isExpanded ? 'Contraer' : `Ver ${totalVideos} videos`}
          </Button>
        </Box>
        
        {/* 📊 Progress Bar */}
        <Box mt={2}>
          <LinearProgress
            variant="determinate"
            value={completionRate}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: `${accentColor}20`,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: accentColor,
              },
            }}
          />
        </Box>
      </Paper>

      {/* 🎬 Videos Grid */}
      {isExpanded && videos.length > 0 && (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <RealVideoCard
                video={video}
                onPlay={onVideoPlay}
                playlistName={playlistName}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

// ============================================================================
// 🎯 MAIN DASHBOARD COMPONENT - 100% BACKEND DRIVEN
// ============================================================================

export const UPlayGamifiedDashboard: React.FC = () => {
  const navigate = useNavigate();

  // 🔄 Estados locales
  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set(['Sin Playlist']));
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // 🔥 HOOKS REALES DEL BACKEND - TODO ES DATA-DRIVEN
  const { 
    data: backendVideos = [], 
    isLoading: isVideosLoading, 
    isError: isVideosError,
    error: videosError,
    refetch: refetchVideos
  } = useVideos();

  const { 
    data: backendPlaylists = [], 
    isLoading: isPlaylistsLoading, 
    isError: isPlaylistsError,
    error: playlistsError,
  } = useVideoPlaylists();

  const { 
    data: backendCategories = [], 
    isLoading: isCategoriesLoading 
  } = useVideoCategories();

  // 📊 DEBUG LOGGING - AUDITABLE
  useEffect(() => {
    console.log('\n🔥 ===== ÜPLAY DASHBOARD DEBUG START =====');
    console.log('📊 BACKEND VIDEOS DATA:');
    console.log('  - Total videos:', backendVideos?.length || 0);
    console.log('  - Is loading:', isVideosLoading);
    console.log('  - Has error:', isVideosError);
    console.log('  - Videos sample:', backendVideos?.slice(0, 2));
    
    console.log('\n📋 BACKEND PLAYLISTS DATA:');
    console.log('  - Total playlists:', backendPlaylists?.length || 0);
    console.log('  - Is loading:', isPlaylistsLoading);
    console.log('  - Has error:', isPlaylistsError);
    console.log('  - Playlists sample:', backendPlaylists?.slice(0, 2));
    
    console.log('\n🏷️ BACKEND CATEGORIES DATA:');
    console.log('  - Total categories:', backendCategories?.length || 0);
    console.log('  - Is loading:', isCategoriesLoading);
    console.log('  - Categories:', backendCategories);
    
    console.log('🔥 ===== ÜPLAY DASHBOARD DEBUG END =====\n');
  }, [
    backendVideos, 
    isVideosLoading, 
    isVideosError,
    backendPlaylists, 
    isPlaylistsLoading, 
    isPlaylistsError,
    backendCategories, 
    isCategoriesLoading
  ]);

  // 🎯 PROCESAMIENTO DE DATOS REAL
  const processedPlaylistData = useMemo((): ProcessedPlaylistData[] => {
    console.log('\n🔄 ===== PROCESSING PLAYLIST DATA =====');
    
    if (!backendVideos || !Array.isArray(backendVideos)) {
      console.log('❌ No backend videos available');
      return [];
    }

    // 🎯 Agrupar videos por playlist
    const groupedVideos: Record<string, BackendVideo[]> = {};
    
    backendVideos.forEach((video: any) => {
      if (!video.isActive) {
        console.log(`⏸️ Skipping inactive video: ${video.title}`);
        return;
      }

      const playlistName = video.playlist?.name || 'Sin Playlist';
      
      if (!groupedVideos[playlistName]) {
        groupedVideos[playlistName] = [];
      }
      
      groupedVideos[playlistName].push(video);
      console.log(`✅ Added video "${video.title}" to playlist "${playlistName}"`);
    });

    // 🎯 Convertir a ProcessedPlaylistData
    const processed = Object.entries(groupedVideos).map(([playlistName, videos]) => {
      const totalDuration = videos.reduce((sum, video) => sum + (video.duration || 0), 0);
      const totalVideos = videos.length;
      const completedVideos = 0; // TODO: Conectar con progreso real del usuario
      
      console.log(`📊 Playlist "${playlistName}": ${totalVideos} videos, ${totalDuration}s total`);
      
      return {
        playlistName,
        videos,
        totalDuration,
        totalVideos,
        completedVideos,
        playlistId: videos[0]?.playlist?.id,
        description: videos[0]?.playlist?.description,
      };
    });

    // 🎯 Ordenar: playlists con contenido primero, "Sin Playlist" al final
    processed.sort((a, b) => {
      if (a.playlistName === 'Sin Playlist') return 1;
      if (b.playlistName === 'Sin Playlist') return -1;
      return b.totalVideos - a.totalVideos; // Por cantidad de videos desc
    });

    console.log(`✅ Processed ${processed.length} playlists`);
    console.log('🔄 ===== PROCESSING COMPLETE =====\n');
    
    return processed;
  }, [backendVideos]);

  // 📊 MÉTRICAS GENERALES
  const dashboardMetrics = useMemo(() => {
    const totalVideos = processedPlaylistData.reduce((sum, playlist) => sum + playlist.totalVideos, 0);
    const totalDuration = processedPlaylistData.reduce((sum, playlist) => sum + playlist.totalDuration, 0);
    const totalPlaylists = processedPlaylistData.length;
    const totalCategories = backendCategories?.length || 0;
    
    return {
      totalVideos,
      totalDuration,
      totalPlaylists,
      totalCategories,
      hasData: totalVideos > 0,
      hasPlaylists: totalPlaylists > 0,
    };
  }, [processedPlaylistData, backendCategories]);

  // 🎬 HANDLERS
  const handleVideoPlay = useCallback((video: BackendVideo) => {
    console.log('🎬 Playing backend video:', video.title);
    console.log('🎬 Video URL:', video.url);
    console.log('🎬 External ID:', video.externalId);
    
    const videoId = video.externalId || video.id.toString();
    navigate(`/uplay/video/${videoId}`, {
      state: { 
        from: '/uplay',
        videoData: video,
        playlistName: video.playlist?.name 
      },
    });
  }, [navigate]);

  const handleTogglePlaylist = useCallback((playlistName: string) => {
    setExpandedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playlistName)) {
        newSet.delete(playlistName);
      } else {
        newSet.add(playlistName);
      }
      return newSet;
    });
  }, []);

  const handleRefreshData = useCallback(() => {
    console.log('🔄 Refreshing all data...');
    refetchVideos();
  }, [refetchVideos]);

  // 🎨 RENDER HELPERS
  const renderLoadingState = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <CircularProgress size={60} sx={{ color: '#9c27b0' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          🔄 Cargando experiencia ÜPlay desde backend...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Conectando con backend NestJS para obtener videos y playlists reales
        </Typography>
      </Box>
      
      {/* Loading Skeletons */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Card>
              <Skeleton variant="rectangular" height={180} />
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} width="60%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const renderErrorState = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Alert 
        severity="error" 
        sx={{ mb: 4 }}
        action={
          <Button color="inherit" size="small" onClick={handleRefreshData}>
            <Refresh /> Reintentar
          </Button>
        }
      >
        <Typography variant="h6" gutterBottom>
          ❌ Error conectando con backend
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          No se pudieron cargar los videos desde el backend NestJS. Verifica que:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>El backend esté ejecutándose en puerto 3002</li>
          <li>El endpoint /video-items esté disponible</li>
          <li>La autenticación JWT sea válida</li>
        </ul>
        
        {showDebugInfo && (
          <Box mt={2} p={2} sx={{ bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="pre">
              Videos Error: {JSON.stringify(videosError, null, 2)}
              {'\n'}
              Playlists Error: {JSON.stringify(playlistsError, null, 2)}
            </Typography>
          </Box>
        )}
      </Alert>
      
      <Button 
        variant="outlined" 
        size="small" 
        onClick={() => setShowDebugInfo(!showDebugInfo)}
        startIcon={<Info />}
      >
        {showDebugInfo ? 'Ocultar' : 'Mostrar'} información de debug
      </Button>
    </Container>
  );

  const renderEmptyState = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box textAlign="center" py={8}>
        <VideoLibrary sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="text.secondary">
          📭 No hay videos disponibles
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          El backend está conectado pero no retornó videos activos.
          Verifica que haya contenido disponible en la base de datos.
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={handleRefreshData}
          startIcon={<Refresh />}
          sx={{ mr: 2 }}
        >
          Actualizar datos
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          startIcon={<Info />}
        >
          Ver información técnica
        </Button>
        
        {showDebugInfo && (
          <Box mt={4} p={3} sx={{ bgcolor: 'grey.50', borderRadius: 2, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              🔍 Información de Debug
            </Typography>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.85rem' }}>
              {`Videos Loading: ${isVideosLoading}
Videos Error: ${isVideosError}
Playlists Loading: ${isPlaylistsLoading}  
Playlists Error: ${isPlaylistsError}
Total Videos: ${backendVideos?.length || 0}
Videos Active: ${backendVideos?.filter((v: any) => v.isActive)?.length || 0}
Processed Playlists: ${processedPlaylistData.length}`}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );

  const renderSuccessState = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 📊 Dashboard Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          🎓 ÜPlay - Rutas de Aprendizaje
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Experiencia gamificada de aprendizaje colaborativo
        </Typography>
        
        {/* 📊 Métricas del Dashboard */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {dashboardMetrics.totalVideos}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Videos disponibles
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                {dashboardMetrics.totalPlaylists}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rutas de aprendizaje
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {Math.floor(dashboardMetrics.totalDuration / 3600)}h
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Contenido total
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {dashboardMetrics.totalCategories}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Categorías
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 🔄 Refresh Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            ✅ Datos cargados desde backend NestJS • Última actualización: {new Date().toLocaleTimeString()}
          </Typography>
          
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleRefreshData}
            startIcon={<Refresh />}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* 🎓 Playlists/Rutas de Aprendizaje */}
      {processedPlaylistData.map((playlistData) => (
        <PlaylistSection
          key={playlistData.playlistName}
          playlistData={playlistData}
          onVideoPlay={handleVideoPlay}
          isExpanded={expandedPlaylists.has(playlistData.playlistName)}
          onToggleExpanded={() => handleTogglePlaylist(playlistData.playlistName)}
        />
      ))}

      {/* 🔍 Debug Info Toggle */}
      <Box mt={4} textAlign="center">
        <Button 
          variant="text" 
          size="small"
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          startIcon={<Info />}
        >
          {showDebugInfo ? 'Ocultar' : 'Mostrar'} información de desarrollo
        </Button>
        
        {showDebugInfo && (
          <Paper sx={{ mt: 2, p: 3, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              🛠️ Información de Desarrollo
            </Typography>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({
                backendStatus: {
                  videosLoading: isVideosLoading,
                  videosError: isVideosError,
                  playlistsLoading: isPlaylistsLoading,
                  playlistsError: isPlaylistsError,
                },
                dataMetrics: dashboardMetrics,
                expandedPlaylists: Array.from(expandedPlaylists),
                sampleVideo: backendVideos?.[0],
              }, null, 2)}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );

  // 🎯 RENDER PRINCIPAL - CONDITIONAL RENDERING
  if (isVideosLoading || isPlaylistsLoading) {
    return renderLoadingState();
  }

  if (isVideosError || isPlaylistsError) {
    return renderErrorState();
  }

  if (!dashboardMetrics.hasData) {
    return renderEmptyState();
  }

  return renderSuccessState();
};

export default UPlayGamifiedDashboard; 