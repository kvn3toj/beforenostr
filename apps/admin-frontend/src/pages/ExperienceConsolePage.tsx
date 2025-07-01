import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fab,
  Stack,
  LinearProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  Assignment as ChallengeIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { useConsoleData } from '../hooks/useConsoleData';
import { ChallengeEditor } from '../components/ChallengeEditor';

// =====================================================================
// TIPOS Y INTERFACES
// =====================================================================

interface ConsoleMetric {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

// =====================================================================
// COMPONENTE PRINCIPAL - CONSOLA DE EXPERIENCIAS
// =====================================================================

export const ExperienceConsolePage: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [view, setView] = useState<'overview' | 'challenges' | 'analytics'>('overview');

  const {
    challenges,
    metrics,
    consoleStats,
    isLoading,
    isWorking,
    error,
    refreshConsole,
    deleteChallenge,
  } = useConsoleData();

  // =====================================================================
  // HANDLERS
  // =====================================================================

  const handleCreateChallenge = () => {
    setSelectedChallenge(null);
    setIsEditorOpen(true);
  };

  const handleEditChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setIsEditorOpen(true);
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este desafío?')) {
      try {
        await deleteChallenge(challengeId);
        toast.success('Desafío eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar el desafío');
      }
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedChallenge(null);
  };

  const handleEditorSuccess = () => {
    setIsEditorOpen(false);
    setSelectedChallenge(null);
    refreshConsole();
  };

  // =====================================================================
  // MÉTRICAS CALCULADAS
  // =====================================================================

  const consoleMetrics: ConsoleMetric[] = [
    {
      label: 'Desafíos Activos',
      value: consoleStats?.activeChallenges || 0,
      change: '+12%',
      changeType: 'positive',
      icon: <ChallengeIcon />,
      color: '#4CAF50',
    },
    {
      label: 'Total Participantes',
      value: metrics?.totalParticipants || 0,
      change: '+8%',
      changeType: 'positive',
      icon: <PeopleIcon />,
      color: '#2196F3',
    },
    {
      label: 'IER (Reciprocidad)',
      value: `${Math.round((metrics?.reciprocityIndex || 0) * 100)}%`,
      change: '+3%',
      changeType: 'positive',
      icon: <TrendingUpIcon />,
      color: '#FF9800',
    },
    {
      label: 'Engagement',
      value: `${Math.round((consoleStats?.engagementRate || 0) * 100)}%`,
      change: '+15%',
      changeType: 'positive',
      icon: <TrophyIcon />,
      color: '#9C27B0',
    },
  ];

  // =====================================================================
  // COMPONENTES UI
  // =====================================================================

  const MetricCard: React.FC<{ metric: ConsoleMetric }> = ({ metric }) => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: metric.color, width: 56, height: 56 }}>
            {metric.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color={metric.color}>
              {metric.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {metric.label}
            </Typography>
            {metric.change && (
              <Chip
                label={metric.change}
                size="small"
                color={metric.changeType === 'positive' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ChallengeCard: React.FC<{ challenge: any }> = ({ challenge }) => (
    <Card sx={{ borderRadius: 2, mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {challenge.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {challenge.description}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={challenge.type} size="small" color="primary" />
              <Chip
                label={challenge.status}
                size="small"
                color={challenge.status === 'ACTIVE' ? 'success' : 'default'}
              />
            </Stack>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => handleEditChallenge(challenge)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => handleDeleteChallenge(challenge.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Configuración
            </Typography>
            <Typography variant="body2">
              Objetivo: {challenge.config?.targetValue || 'N/A'}
            </Typography>
          </Box>
          {challenge.rewards && challenge.rewards.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Recompensas
              </Typography>
              <Typography variant="body2">
                {challenge.rewards.length} configuradas
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  // =====================================================================
  // RENDERS CONDICIONALES
  // =====================================================================

  if (isLoading) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando Consola de Experiencias...
        </Typography>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6">Error cargando la Consola</Typography>
          <Typography>
            No se pudieron cargar las métricas. Por favor, intenta nuevamente.
          </Typography>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshConsole} sx={{ mt: 2 }}>
            Reintentar
          </Button>
        </Alert>
      </Box>
    );
  }

  // =====================================================================
  // RENDER PRINCIPAL
  // =====================================================================

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom color="primary">
          🎮 Consola de Experiencias
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Cerebro Operativo de CoomÜnity - Panel de Control para HumanWäre
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Crea, gestiona y optimiza desafíos gamificados que fomenten la Reciprocidad y nutran el Bien Común.
        </Typography>

        {/* Action Bar */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateChallenge}
            size="large"
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
            }}
          >
            Crear Desafío
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshConsole}
            disabled={isWorking}
            sx={{ borderRadius: 2 }}
          >
            Actualizar
          </Button>

          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            sx={{ borderRadius: 2 }}
          >
            Configuración
          </Button>
        </Box>
      </Box>

      {/* Working Indicator */}
      {isWorking && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Procesando operación...
          </Typography>
        </Box>
      )}

      {/* Métricas Dashboard */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {consoleMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard metric={metric} />
          </Grid>
        ))}
      </Grid>

      {/* IER Alert */}
      {metrics?.reciprocityIndex && metrics.reciprocityIndex < 0.5 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Oportunidad de Mejora Detectada
          </Typography>
          <Typography variant="body2">
            El Índice de Equilibrio de Reciprocidad (IER) está por debajo del objetivo.
            Considera crear desafíos que fomenten más intercambios bidireccionales.
          </Typography>
        </Alert>
      )}

      {/* Challenges Section */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary">
            Desafíos Activos ({challenges.length})
          </Typography>
          <Chip
            label={`${consoleStats?.activeChallenges || 0} activos`}
            color="success"
            variant="outlined"
          />
        </Box>

        {challenges.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <ChallengeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay desafíos creados
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Crea tu primer desafío para comenzar a nutrir la comunidad con experiencias de alto valor.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateChallenge}
              sx={{ borderRadius: 2 }}
            >
              Crear Primer Desafío
            </Button>
          </Box>
        ) : (
          <Box>
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </Box>
        )}
      </Paper>

      {/* Challenge Editor Dialog */}
      <Dialog
        open={isEditorOpen}
        onClose={handleCloseEditor}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedChallenge ? 'Editar Desafío' : 'Crear Nuevo Desafío'}
          </Typography>
          <IconButton onClick={handleCloseEditor}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <ChallengeEditor
            challenge={selectedChallenge}
            onClose={handleCloseEditor}
            onSuccess={handleEditorSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Floating Action Button para crear desafíos rápidamente */}
      <Fab
        color="primary"
        aria-label="crear desafío"
        onClick={handleCreateChallenge}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
