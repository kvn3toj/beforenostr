import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Alert,
  Container,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  EmojiEvents,
  Group,
  Schedule,
  Star,
  CheckCircle,
  PlayArrow,
  ExitToApp,
  Share,
  Bookmark,
  Info,
  Assignment,
  TrendingUp,
} from '@mui/icons-material';
import { toast } from 'sonner';

// Hooks y tipos
import { 
  useChallenge, 
  useJoinChallenge, 
  useLeaveChallenge,
  useUpdateChallengeProgress 
} from '../hooks/useRealBackendData';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChallengeDifficulty, 
  ChallengeCategory,
  ChallengeTask 
} from '../types/challenges';

// Helper functions for styling
const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'success';
    case 'INTERMEDIATE':
      return 'warning';
    case 'ADVANCED':
      return 'error';
    case 'EXPERT':
      return 'secondary';
    default:
      return 'default';
  }
};

const getCategoryColor = (category: ChallengeCategory) => {
  switch (category) {
    case 'LEARNING':
      return '#2196F3';
    case 'SOCIAL':
      return '#FF9800';
    case 'WELLNESS':
      return '#4CAF50';
    case 'CREATIVITY':
      return '#9C27B0';
    case 'COMMUNITY':
      return '#FF5722';
    case 'SUSTAINABILITY':
      return '#8BC34A';
    case 'INNOVATION':
      return '#607D8B';
    default:
      return '#757575';
  }
};

const formatDuration = (duration?: number) => {
  if (!duration) return 'Sin límite';
  if (duration === 1) return '1 día';
  if (duration < 7) return `${duration} días`;
  if (duration < 30) return `${Math.round(duration / 7)} semanas`;
  return `${Math.round(duration / 30)} meses`;
};

// 🔧 SOLUCIÓN: Función segura para formatear fechas
const formatSafeDate = (dateString?: string): string => {
  if (!dateString) return 'No especificada';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Fecha inválida detectada: ${dateString}`);
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error(`❌ Error al formatear fecha: ${dateString}`, error);
    return 'Error en fecha';
  }
};

export const ChallengeDetailPage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  // Hooks para datos
  const { 
    data: challenge, 
    isLoading, 
    error 
  } = useChallenge(challengeId || '');

  const joinChallengeMutation = useJoinChallenge();
  const leaveChallengeMutation = useLeaveChallenge();
  const updateProgressMutation = useUpdateChallengeProgress();

  // Handlers
  const handleJoinChallenge = async () => {
    if (!challengeId) return;
    
    try {
      await joinChallengeMutation.mutateAsync(challengeId);
      toast.success('¡Te has unido al desafío exitosamente!');
    } catch (error) {
      toast.error('Error al unirse al desafío. Inténtalo de nuevo.');
      console.error('Error joining challenge:', error);
    }
  };

  const handleLeaveChallenge = async () => {
    if (!challengeId) return;
    
    try {
      await leaveChallengeMutation.mutateAsync(challengeId);
      toast.success('Has salido del desafío');
      setShowLeaveDialog(false);
    } catch (error) {
      toast.error('Error al salir del desafío. Inténtalo de nuevo.');
      console.error('Error leaving challenge:', error);
    }
  };

  const handleUpdateProgress = async (newProgress: number, currentStep?: string) => {
    if (!challengeId) return;
    
    try {
      await updateProgressMutation.mutateAsync({
        challengeId,
        progress: newProgress,
        currentStep
      });
      toast.success('Progreso actualizado');
    } catch (error) {
      toast.error('Error al actualizar progreso');
      console.error('Error updating progress:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: challenge?.title,
        text: challenge?.shortDescription || challenge?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  if (!challengeId) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">ID de desafío no válido</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar el desafío: {error instanceof Error ? error.message : 'Error desconocido'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/challenges')}>
          Volver a Desafíos
        </Button>
      </Container>
    );
  }

  if (isLoading || !challenge) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Cargando desafío...</Typography>
        </Box>
      </Container>
    );
  }

  const isActive = challenge.status === 'ACTIVE';
  const isParticipating = challenge.isParticipating;
  const isCompleted = challenge.isCompleted;
  const completionRate = challenge._count?.participants 
    ? (challenge._count.completions / challenge._count.participants) * 100 
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header con navegación */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/challenges')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {challenge.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
          <IconButton onClick={() => toast.info('Función de guardado próximamente')}>
            <Bookmark />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Columna principal */}
        <Grid item xs={12} md={8}>
          {/* Imagen/Header del desafío */}
          <Card sx={{ mb: 3 }}>
            <Box
              sx={{
                height: 200,
                background: `linear-gradient(135deg, ${getCategoryColor(challenge.category)}22, ${getCategoryColor(challenge.category)}44)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {challenge.imageUrl ? (
                <img
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: getCategoryColor(challenge.category),
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 48 }} />
                </Avatar>
              )}

              {/* Status indicators */}
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                {isCompleted && (
                  <Tooltip title="Completado">
                    <CheckCircle color="success" sx={{ fontSize: 32 }} />
                  </Tooltip>
                )}
                {isParticipating && !isCompleted && (
                  <Tooltip title="Participando">
                    <PlayArrow color="primary" sx={{ fontSize: 32 }} />
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Card>

          {/* Descripción */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📝 Descripción
              </Typography>
              <Typography variant="body1" paragraph>
                {challenge.description}
              </Typography>

              {/* Tags */}
              {challenge.tags && challenge.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {challenge.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Progreso (solo si está participando) */}
          {isParticipating && challenge.userProgress && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Tu Progreso
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Progreso General
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {challenge.userProgress.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={challenge.userProgress.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {challenge.userProgress.currentStep && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Paso actual:</strong> {challenge.userProgress.currentStep}
                  </Alert>
                )}

                {challenge.userProgress.tasksCompleted !== undefined && challenge.userProgress.totalTasks && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Tareas completadas: {challenge.userProgress.tasksCompleted} de {challenge.userProgress.totalTasks}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tareas del desafío */}
          {(challenge as any).tasks && (challenge as any).tasks.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ✅ Tareas del Desafío
                </Typography>
                <List>
                  {(challenge as any).tasks.map((task: ChallengeTask, index: number) => (
                    <React.Fragment key={task.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment color={task.isRequired ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {task.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip 
                                  label={`${task.points} pts`} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined" 
                                />
                                {task.isRequired && (
                                  <Chip 
                                    label="Obligatorio" 
                                    size="small" 
                                    color="error" 
                                    variant="outlined" 
                                  />
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < (challenge as any).tasks.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Requisitos */}
          {challenge.requirements && challenge.requirements.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Requisitos
                </Typography>
                <List dense>
                  {challenge.requirements.map((requirement, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Info color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={requirement} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Recompensas */}
          {challenge.rewards && challenge.rewards.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎁 Recompensas
                </Typography>
                <List>
                  {challenge.rewards.map((reward, index) => (
                    <ListItem key={reward.id}>
                      <ListItemIcon>
                        <Star color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">
                              {reward.description}
                            </Typography>
                            {reward.amount && (
                              <Chip 
                                label={`${reward.amount} ${reward.type}`} 
                                size="small" 
                                color="warning" 
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Información del desafío */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ℹ️ Información
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={challenge.category}
                  sx={{
                    bgcolor: `${getCategoryColor(challenge.category)}22`,
                    color: getCategoryColor(challenge.category),
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={challenge.difficulty}
                  color={getDifficultyColor(challenge.difficulty) as any}
                  variant="outlined"
                />
              </Box>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Star />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Puntos" 
                    secondary={`${challenge.points} pts`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Duración" 
                    secondary={formatDuration(challenge.duration)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Group />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Participantes" 
                    secondary={`${challenge._count?.participants || 0}${challenge.maxParticipants ? ` / ${challenge.maxParticipants}` : ''}`} 
                  />
                </ListItem>
                {challenge.endDate && (
                  <ListItem>
                    <ListItemIcon>
                      <Schedule />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Fecha límite" 
                      secondary={formatSafeDate(challenge.endDate)} 
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Estadísticas
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tasa de completitud
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  color="success"
                />
                <Typography variant="caption" color="text.secondary">
                  {completionRate.toFixed(1)}% ({challenge._count?.completions || 0} completados)
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Acciones
              </Typography>
              
              {!isParticipating && !isCompleted && isActive && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleJoinChallenge}
                  disabled={joinChallengeMutation.isPending}
                  sx={{ mb: 2 }}
                >
                  {joinChallengeMutation.isPending ? 'Uniéndose...' : 'Unirse al Desafío'}
                </Button>
              )}
              
              {isParticipating && !isCompleted && (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={() => handleUpdateProgress(
                      Math.min((challenge.userProgress?.progress || 0) + 10, 100),
                      'Progreso manual actualizado'
                    )}
                    disabled={updateProgressMutation.isPending}
                    sx={{ mb: 2 }}
                  >
                    {updateProgressMutation.isPending ? 'Actualizando...' : 'Actualizar Progreso'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<ExitToApp />}
                    onClick={() => setShowLeaveDialog(true)}
                    disabled={leaveChallengeMutation.isPending}
                  >
                    Salir del Desafío
                  </Button>
                </>
              )}
              
              {isCompleted && (
                <Alert severity="success">
                  <Typography variant="body2">
                    ¡Felicitaciones! Has completado este desafío.
                  </Typography>
                </Alert>
              )}

              {!isActive && (
                <Alert severity="warning">
                  <Typography variant="body2">
                    Este desafío no está activo actualmente.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para confirmar salida */}
      <Dialog open={showLeaveDialog} onClose={() => setShowLeaveDialog(false)}>
        <DialogTitle>¿Salir del desafío?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres salir de este desafío? Perderás todo el progreso actual.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaveDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleLeaveChallenge} 
            color="error"
            disabled={leaveChallengeMutation.isPending}
          >
            {leaveChallengeMutation.isPending ? 'Saliendo...' : 'Salir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 