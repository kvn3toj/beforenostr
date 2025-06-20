import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  Avatar,
  Paper,
  Grid,
  Stack,
  Collapse,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  CheckCircle,
  RadioButtonUnchecked,
  Star,
  Schedule,
  TrendingUp,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause,
  RestartAlt,
  Flag,
  Timeline as TimelineIcon,
  EmojiEvents,
  WorkspacePremium,
  MonetizationOn,
  Psychology,
} from '@mui/icons-material';
import {
  UserChallengeProgress,
  ChallengeTask,
} from '../../../types/challenges';

interface ChallengeProgressTrackerProps {
  progress: UserChallengeProgress;
  tasks?: ChallengeTask[];
  onTaskToggle?: (taskId: string) => void;
  onResetProgress?: () => void;
  onContinue?: () => void;
  rewards?: Array<{
    type: string;
    amount?: number;
    description: string;
  }>;
  showTimeline?: boolean;
  compact?: boolean;
}

const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}> = ({ progress, size = 120, strokeWidth = 8, color = '#2196F3' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" component="div" color={color} fontWeight={700}>
          {Math.round(progress)}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Completado
        </Typography>
      </Box>
    </Box>
  );
};

const TaskStepper: React.FC<{
  tasks: ChallengeTask[];
  completedTasks: Set<string>;
  onTaskToggle?: (taskId: string) => void;
}> = ({ tasks, completedTasks, onTaskToggle }) => {
  const [activeStep, setActiveStep] = useState(0);

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {sortedTasks.map((task, index) => {
        const isCompleted = completedTasks.has(task.id);
        const isActive = index === activeStep;

        return (
          <Step key={task.id} completed={isCompleted}>
            <StepLabel
              StepIconComponent={({ active, completed }) => (
                <Avatar
                  sx={{
                    bgcolor: completed
                      ? 'success.main'
                      : active
                        ? 'primary.main'
                        : 'grey.300',
                    width: 32,
                    height: 32,
                    cursor: onTaskToggle ? 'pointer' : 'default',
                  }}
                  onClick={() => onTaskToggle?.(task.id)}
                >
                  {completed ? (
                    <CheckCircle sx={{ fontSize: 20 }} />
                  ) : (
                    <Typography variant="caption" fontWeight={600}>
                      {index + 1}
                    </Typography>
                  )}
                </Avatar>
              )}
            >
              <Box sx={{ ml: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: isCompleted ? 400 : 600,
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    color: isCompleted ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {task.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={task.type}
                    color={task.isRequired ? 'error' : 'default'}
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                    <Typography variant="caption">{task.points}</Typography>
                  </Box>
                </Box>
              </Box>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {task.description}
              </Typography>
              {onTaskToggle && (
                <Button
                  variant={isCompleted ? 'outlined' : 'contained'}
                  size="small"
                  onClick={() => onTaskToggle(task.id)}
                  startIcon={
                    isCompleted ? <RadioButtonUnchecked /> : <CheckCircle />
                  }
                >
                  {isCompleted
                    ? 'Marcar como pendiente'
                    : 'Marcar como completada'}
                </Button>
              )}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};

const ProgressTimeline: React.FC<{
  progress: UserChallengeProgress;
}> = ({ progress }) => {
  const timelineEvents = [
    {
      time: progress.startedAt,
      title: 'Desafío iniciado',
      description: 'Te uniste a este desafío',
      icon: <Flag color="primary" />,
      color: 'primary',
    },
    ...(progress.metadata?.milestones || []).map((milestone: any) => ({
      time: milestone.timestamp,
      title: milestone.title,
      description: milestone.description,
      icon: <Star color="warning" />,
      color: 'warning',
    })),
    ...(progress.completedAt
      ? [
          {
            time: progress.completedAt,
            title: 'Desafío completado',
            description: '¡Felicitaciones por completar el desafío!',
            icon: <EmojiEvents color="success" />,
            color: 'success',
          },
        ]
      : []),
  ];

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Timeline>
      {timelineEvents.map((event, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot color={event.color as any}>{event.icon}</TimelineDot>
            {index < timelineEvents.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="subtitle2" component="h6">
              {event.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(event.time)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export const ChallengeProgressTracker: React.FC<
  ChallengeProgressTrackerProps
> = ({
  progress,
  tasks = [],
  onTaskToggle,
  onResetProgress,
  onContinue,
  rewards = [],
  showTimeline = false,
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(!compact);
  const [showTasks, setShowTasks] = useState(false);

  // Calcular tareas completadas
  const completedTaskIds =
    progress.metadata?.completedTasks?.map((task: any) => task.taskId) || [];
  const completedTasks = new Set(completedTaskIds);

  const isCompleted = progress.status === 'COMPLETED';
  const isActive = progress.status === 'ACTIVE';

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `${diffDays} día${diffDays > 1 ? 's' : ''} ${diffHours}h`;
    }
    return `${diffHours}h`;
  };

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        {/* Header con progreso principal */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {compact ? 'Progreso' : 'Tu Progreso en el Desafío'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress.progress}
                sx={{
                  flexGrow: 1,
                  height: compact ? 6 : 8,
                  borderRadius: 4,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: isCompleted
                      ? 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                      : 'linear-gradient(90deg, #2196F3, #03DAC6)',
                  },
                }}
              />
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {progress.progress}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {progress.tasksCompleted || 0} de {progress.totalTasks || 0}{' '}
              tareas completadas
            </Typography>
          </Box>

          {!compact && (
            <ProgressRing
              progress={progress.progress}
              size={100}
              color={isCompleted ? '#4CAF50' : '#2196F3'}
            />
          )}
        </Box>

        {/* Estado actual */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={progress.status}
              color={isCompleted ? 'success' : isActive ? 'primary' : 'default'}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {formatDuration(progress.startedAt, progress.completedAt)}
            </Typography>
          </Box>
          {progress.currentStep && (
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              📍 {progress.currentStep}
            </Typography>
          )}
        </Box>

        {/* Botones de acción */}
        <Stack direction="row" spacing={1} sx={{ mb: showDetails ? 3 : 0 }}>
          {isActive && onContinue && (
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={onContinue}
              size={compact ? 'small' : 'medium'}
            >
              Continuar
            </Button>
          )}
          {isCompleted && (
            <Button
              variant="outlined"
              startIcon={<EmojiEvents />}
              color="success"
              size={compact ? 'small' : 'medium'}
            >
              Ver Certificado
            </Button>
          )}
          {!compact && (
            <IconButton
              onClick={() => setShowDetails(!showDetails)}
              size="small"
            >
              {showDetails ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Stack>

        {/* Detalles expandibles */}
        <Collapse in={showDetails}>
          <Grid container spacing={3}>
            {/* Estadísticas */}
            <Grid size={{xs:12,sm:6}}>
              <Typography variant="subtitle2" gutterBottom>
                📊 Estadísticas
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Grid container spacing={2}>
                  <Grid size={{xs:6}}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="success.main">
                        {progress.tasksCompleted || 0}
                      </Typography>
                      <Typography variant="caption">Completadas</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{xs:6}}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="warning.main">
                        {(progress.totalTasks || 0) -
                          (progress.tasksCompleted || 0)}
                      </Typography>
                      <Typography variant="caption">Pendientes</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Recompensas disponibles */}
            {rewards.length > 0 && (
              <Grid size={{xs:12,sm:6}}>
                <Typography variant="subtitle2" gutterBottom>
                  🎁 Recompensas
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Stack spacing={1}>
                    {rewards.slice(0, 3).map((reward, index) => (
                      <Box
                        key={index}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        {reward.type === 'MERITS' && (
                          <WorkspacePremium
                            sx={{ fontSize: 16, color: 'warning.main' }}
                          />
                        )}
                        {reward.type === 'LUKAS' && (
                          <MonetizationOn
                            sx={{ fontSize: 16, color: 'success.main' }}
                          />
                        )}
                        {reward.type === 'ONDAS' && (
                          <Psychology
                            sx={{ fontSize: 16, color: 'info.main' }}
                          />
                        )}
                        <Typography variant="body2">
                          {reward.amount} {reward.type}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Tareas */}
            {tasks.length > 0 && (
              <Grid size={{xs:12}}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle2">
                    📋 Tareas del Desafío
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setShowTasks(!showTasks)}
                    endIcon={showTasks ? <ExpandLess /> : <ExpandMore />}
                  >
                    {showTasks ? 'Ocultar' : 'Mostrar'}
                  </Button>
                </Box>
                <Collapse in={showTasks}>
                  <TaskStepper
                    tasks={tasks}
                    completedTasks={completedTasks}
                    onTaskToggle={onTaskToggle}
                  />
                </Collapse>
              </Grid>
            )}

            {/* Timeline */}
            {showTimeline && (
              <Grid size={{xs:12}}>
                <Typography variant="subtitle2" gutterBottom>
                  📅 Cronología
                </Typography>
                <ProgressTimeline progress={progress} />
              </Grid>
            )}

            {/* Acciones adicionales */}
            <Grid size={{xs:12}}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                {onResetProgress && (
                  <Button
                    size="small"
                    startIcon={<RestartAlt />}
                    onClick={onResetProgress}
                    color="warning"
                  >
                    Reiniciar
                  </Button>
                )}
                <Button
                  size="small"
                  startIcon={<TimelineIcon />}
                  onClick={() => setShowDetails(false)}
                >
                  Contraer
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};
