import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Alert,
  Badge,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  Flag,
  ExpandMore,
  CheckCircle,
  RadioButtonUnchecked,
  Schedule,
  Group,
  Star,
  WorkspacePremium,
  MonetizationOn,
  Psychology,
  EmojiEvents,
  Timeline,
  Info,
  QuestionAnswer,
  Leaderboard,
  Forum,
  TrendingUp,
  CalendarToday,
  PlayArrow,
  Pause,
  CheckBox,
  Person,
  School,
  Nature,
  Lightbulb,
  Public,
  Recycling,
  EmojiObjects,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  Challenge,
  ChallengeTask,
  UserChallengeProgress,
} from '../../../types/challenges';

interface ChallengeDetailProps {
  challenge: Challenge;
  userProgress?: UserChallengeProgress;
  onJoin?: (challengeId: string) => void;
  onLeave?: (challengeId: string) => void;
  onUpdateProgress?: (progress: Partial<UserChallengeProgress>) => void;
  onLike?: (challengeId: string) => void;
  onShare?: (challengeId: string) => void;
  isLoading?: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'LEARNING':
      return School;
    case 'SOCIAL':
      return Group;
    case 'WELLNESS':
      return Favorite;
    case 'CREATIVITY':
      return Lightbulb;
    case 'COMMUNITY':
      return Public;
    case 'SUSTAINABILITY':
      return Nature;
    case 'INNOVATION':
      return EmojiObjects;
    default:
      return EmojiEvents;
  }
};

const getCategoryColor = (category: string) => {
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

// Helper function to get challenge image based on category
const getChallengeImage = (challenge: Challenge) => {
  // If challenge already has an image, use it
  if (challenge.imageUrl) {
    return challenge.imageUrl;
  }

  // Default images by category
  const categoryImages = {
    LEARNING: '/assets/images/challenges/learning-challenge.jpg',
    SOCIAL: '/assets/images/challenges/social-challenge.jpg',
    WELLNESS: '/assets/images/challenges/wellness-challenge.jpg',
    CREATIVITY: '/assets/images/challenges/creativity-challenge.jpg',
    COMMUNITY: '/assets/images/challenges/reciprocidad-daily.jpg', // Use the Reciprocidad image for community
    SUSTAINABILITY: '/assets/images/challenges/sustainability-challenge.jpg',
    INNOVATION: '/assets/images/challenges/innovation-challenge.jpg',
  };

  return (
    categoryImages[challenge.category] ||
    '/assets/images/challenges/community-challenge.jpg'
  );
};

const TaskItem: React.FC<{
  task: ChallengeTask;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}> = ({ task, isCompleted, onToggle }) => {
  return (
    <ListItem
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        mb: 1,
        border: '1px solid',
        borderColor: isCompleted ? 'success.main' : 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <ListItemIcon>
        <IconButton
          onClick={() => onToggle(task.id)}
          color={isCompleted ? 'success' : 'default'}
        >
          {isCompleted ? <CheckCircle /> : <RadioButtonUnchecked />}
        </IconButton>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="body1"
            sx={{
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'text.secondary' : 'text.primary',
              fontWeight: 500,
            }}
          >
            {task.title}
          </Typography>
        }
        secondary={
          <Box component="div">
            <Typography variant="body2" component="span" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {task.description}
            </Typography>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                component="span"
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.25,
                  bgcolor: task.isRequired ? 'error.main' : 'grey.300',
                  color: task.isRequired ? 'error.contrastText' : 'text.primary',
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}
              >
                {task.type}
              </Typography>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="caption">{task.points} pts</Typography>
              </Box>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

export const ChallengeDetail: React.FC<ChallengeDetailProps> = ({
  challenge,
  userProgress,
  onJoin,
  onLeave,
  onUpdateProgress,
  onLike,
  onShare,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const categoryColor = getCategoryColor(challenge.category);
  const CategoryIcon = getCategoryIcon(challenge.category);

  const isParticipating = challenge.isParticipating;
  const isCompleted = challenge.isCompleted;
  const canJoin =
    challenge.status === 'ACTIVE' && !isParticipating && !isCompleted;

  // Mock tasks data - TODO: Obtener del challenge real
  const mockTasks: ChallengeTask[] = [
    {
      id: 'task-1',
      challengeId: challenge.id,
      title: 'Completar lectura introductoria',
      description:
        'Lee la introducción sobre los principios de Reciprocidad y reciprocidad',
      order: 1,
      type: 'ACTION',
      isRequired: true,
      points: 50,
    },
    {
      id: 'task-2',
      challengeId: challenge.id,
      title: 'Realizar una acción de bien común',
      description: 'Ejecuta una acción que beneficie a tu comunidad local',
      order: 2,
      type: 'VERIFICATION',
      isRequired: true,
      points: 100,
    },
    {
      id: 'task-3',
      challengeId: challenge.id,
      title: 'Compartir experiencia',
      description: 'Comparte tu experiencia con otros miembros de la comunidad',
      order: 3,
      type: 'SOCIAL',
      isRequired: false,
      points: 75,
    },
  ];

  const handleTaskToggle = (taskId: string) => {
    const newCompletedTasks = new Set(completedTasks);
    if (completedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
    }
    setCompletedTasks(newCompletedTasks);

    // Calcular nuevo progreso
    const newProgress = (newCompletedTasks.size / mockTasks.length) * 100;

    if (onUpdateProgress) {
      onUpdateProgress({
        progress: newProgress,
        tasksCompleted: newCompletedTasks.size,
        totalTasks: mockTasks.length,
      });
    }
  };

  const handleJoin = () => {
    if (onJoin) {
      onJoin(challenge.id);
    }
  };

  const handleLeave = () => {
    setShowLeaveDialog(false);
    if (onLeave) {
      onLeave(challenge.id);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(challenge.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(challenge.id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} size="large">
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          sx={{ flexGrow: 1, fontWeight: 700 }}
        >
          Detalle del Desafío
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Información principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3, overflow: 'hidden' }}>
            {/* Imagen destacada */}
            <CardMedia
              component="img"
              height="300"
              image={getChallengeImage(challenge)}
              alt={challenge.title}
            />

            <CardContent sx={{ p: 4 }}>
              {/* Título y categoría */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: categoryColor,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      component="h2"
                      gutterBottom
                      sx={{ fontWeight: 700 }}
                    >
                      {challenge.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={challenge.category}
                        sx={{
                          bgcolor: `${categoryColor}15`,
                          color: categoryColor,
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={challenge.difficulty}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={challenge.status}
                        color={
                          challenge.status === 'ACTIVE' ? 'success' : 'default'
                        }
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Estado de participación */}
                {isParticipating && (
                  <Alert
                    severity="info"
                    sx={{ mb: 2 }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => setShowLeaveDialog(true)}
                      >
                        Abandonar
                      </Button>
                    }
                  >
                    Estás participando en este desafío
                  </Alert>
                )}

                {isCompleted && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    ¡Felicitaciones! Has completado este desafío
                  </Alert>
                )}
              </Box>

              {/* Descripción */}
              <Typography
                variant="body1"
                paragraph
                sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}
              >
                {challenge.description}
              </Typography>

              {/* Progreso del usuario */}
              {userProgress && (
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Tu Progreso
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {userProgress.tasksCompleted || 0} de{' '}
                      {userProgress.totalTasks || 0} tareas completadas
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {userProgress.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={userProgress.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: 'white',
                      },
                    }}
                  />
                  {userProgress.currentStep && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      📍 Paso actual: {userProgress.currentStep}
                    </Typography>
                  )}
                </Paper>
              )}
            </CardContent>
          </Card>

          {/* Tabs de contenido */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
              >
                <Tab label="Tareas" icon={<CheckBox />} />
                <Tab label="Información" icon={<Info />} />
                <Tab label="Discusión" icon={<Forum />} />
                <Tab label="Ranking" icon={<Leaderboard />} />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Tab: Tareas */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Tareas del Desafío
                  </Typography>
                  <List
                    sx={{
                      bgcolor: 'background.default',
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    {mockTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        isCompleted={completedTasks.has(task.id)}
                        onToggle={handleTaskToggle}
                      />
                    ))}
                  </List>
                </Box>
              )}

              {/* Tab: Información */}
              {activeTab === 1 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Detalles del Desafío
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarToday />
                          </ListItemIcon>
                          <ListItemText
                            primary="Fecha de inicio"
                            secondary={formatDate(challenge.startDate)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Schedule />
                          </ListItemIcon>
                          <ListItemText
                            primary="Duración"
                            secondary={
                              challenge.duration
                                ? `${challenge.duration} días`
                                : 'Sin límite'
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Group />
                          </ListItemIcon>
                          <ListItemText
                            primary="Participantes"
                            secondary={`${challenge._count?.participants || 0} personas`}
                          />
                        </ListItem>
                      </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Requisitos
                      </Typography>
                      {challenge.requirements &&
                      challenge.requirements.length > 0 ? (
                        <List>
                          {challenge.requirements.map((req, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckBox color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={req} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography color="text.secondary">
                          No hay requisitos específicos
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Tab: Discusión */}
              {activeTab === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Forum
                    sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Funcionalidad próximamente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aquí podrás interactuar con otros participantes del desafío
                  </Typography>
                </Box>
              )}

              {/* Tab: Ranking */}
              {activeTab === 3 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Leaderboard
                    sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Ranking próximamente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ve tu posición y la de otros participantes
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Acciones principales */}
          <Card sx={{ mb: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones
            </Typography>

            {canJoin && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Flag />}
                onClick={handleJoin}
                disabled={isLoading}
                sx={{
                  mb: 2,
                  background: `linear-gradient(45deg, ${categoryColor}, ${categoryColor}CC)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${categoryColor}DD, ${categoryColor}BB)`,
                  },
                }}
              >
                Unirse al Desafío
              </Button>
            )}

            {isParticipating && !isCompleted && (
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<PlayArrow />}
                sx={{ mb: 2 }}
              >
                Continuar Desafío
              </Button>
            )}

            {isCompleted && (
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<CheckCircle />}
                color="success"
                sx={{ mb: 2 }}
              >
                Ver Certificado
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<Share />}
              onClick={handleShare}
            >
              Compartir Desafío
            </Button>
          </Card>

          {/* Recompensas */}
          {challenge.rewards && challenge.rewards.length > 0 && (
            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom>
                🎁 Recompensas
              </Typography>
              <List>
                {challenge.rewards.map((reward, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {reward.type === 'MERITS' && (
                        <WorkspacePremium color="warning" />
                      )}
                      {reward.type === 'LUKAS' && (
                        <MonetizationOn color="success" />
                      )}
                      {reward.type === 'ONDAS' && <Psychology color="info" />}
                      {reward.type === 'BADGE' && (
                        <EmojiEvents color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={reward.description}
                      secondary={
                        reward.amount
                          ? `${reward.amount} ${reward.type}`
                          : undefined
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}

          {/* Estadísticas del desafío */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 Estadísticas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {challenge._count?.participants || 0}
                  </Typography>
                  <Typography variant="caption">Participantes</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {challenge._count?.completions || 0}
                  </Typography>
                  <Typography variant="caption">Completados</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {challenge.points}
                  </Typography>
                  <Typography variant="caption">Mëritos</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {challenge._count?.participants
                      ? Math.round(
                          (challenge._count.completions /
                            challenge._count.participants) *
                            100
                        )
                      : 0}
                    %
                  </Typography>
                  <Typography variant="caption">Éxito</Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de confirmación para abandonar */}
      <Dialog open={showLeaveDialog} onClose={() => setShowLeaveDialog(false)}>
        <DialogTitle>¿Abandonar desafío?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres abandonar este desafío? Perderás todo
            el progreso actual.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaveDialog(false)}>Cancelar</Button>
          <Button onClick={handleLeave} color="error" variant="contained">
            Abandonar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
