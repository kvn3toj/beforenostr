import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
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
  Backdrop,
  CircularProgress,
  Tab,
  Tabs,
  FormControlLabel,
  Switch,
  Badge,
  List,
  ListItem,
  ListItemText,
  Container,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AnalyticsIcon,
  Timeline as TimelineIcon,
  LocalFireDepartment as FireIcon,
  AutoAwesome as MagicIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { useConsoleData } from '../hooks/useConsoleData';
import { ChallengeEditor } from '../components/ChallengeEditor';
import { AdvancedStageManagement } from '../components/features/console/AdvancedStageManagement';
import { type Stage, type Challenge } from '../services/console-api.service';

// =====================================================================
// TIPOS Y INTERFACES EXPANDIDOS
// =====================================================================

interface ConsoleMetric {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  gradient: string;
}

// =====================================================================
// COMPONENTE PRINCIPAL - CONSOLA DE EXPERIENCIAS MEJORADA
// =====================================================================

export const ExperienceConsolePage: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [advancedStageDialogOpen, setAdvancedStageDialogOpen] = useState(false);

  const {
    challenges,
    metrics,
    consoleStats,
    stages,
    isLoading,
    isWorking,
    error,
    refreshConsole,
    deleteChallenge,
  } = useConsoleData(realTimeUpdates);

  // ✅ DEFENSIVE VALIDATION: Asegurar que challenges sea siempre un array
  const safeChallenges = Array.isArray(challenges) ? challenges : [];

  // =====================================================================
  // HANDLERS
  // =====================================================================

  const handleCreateChallenge = () => {
    setSelectedChallenge(null);
    setIsEditorOpen(true);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsEditorOpen(true);
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este desafío?')) {
      await deleteChallenge(challengeId);
      toast.success('Desafío eliminado');
    }
  };

  const handleCloseEditor = () => setIsEditorOpen(false);
  const handleEditorSuccess = () => {
    handleCloseEditor();
    refreshConsole();
  };
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

  // =====================================================================
  // DATOS CALCULADOS Y MÉTRICAS AVANZADAS
  // =====================================================================

  const consoleMetrics: ConsoleMetric[] = [
    {
      label: 'Usuarios Activos',
      value: metrics?.activeUsers.weekly || 0,
      change: `+${metrics?.activeUsers.growth || 0}%`,
      icon: <PeopleIcon />,
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
    },
    {
      label: 'Desafíos Activos',
      value: safeChallenges.filter(c => c.status === 'ACTIVE').length || 0,
      change: `+${consoleStats?.pendingValidations || 0} pend.`,
      icon: <ChallengeIcon />,
      gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
    },
    {
      label: 'Progreso a Solver',
      value: `${metrics?.stageProgression.seekerToSolver || 0}%`,
      change: `Target: ${metrics?.stageProgression.target || 0}%`,
      icon: <TrendingUpIcon />,
      gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
    },
    {
      label: 'Votos de Confianza',
      value: metrics?.trustVotes.thisWeek || 0,
      change: `Ø ${metrics?.trustVotes.dailyAverage || 0}/día`,
      icon: <TrophyIcon />,
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
    },
  ];

  // ✅ DEBUG INFO: Mostrar información de debugging cuando hay errores
  if (error) {
    console.error('Console Data Error:', error);
  }

  if (isLoading) {
    console.log('Console Data Loading...');
  }

  console.log('Console Data State:', {
    challenges: safeChallenges.length,
    metrics: !!metrics,
    consoleStats: !!consoleStats,
    stages: Array.isArray(stages) ? stages.length : 'not array',
    isLoading,
    error: !!error
  });

  // =====================================================================
  // COMPONENTES UI MEJORADOS
  // =====================================================================

  const MetricCard: React.FC<{ metric: ConsoleMetric }> = ({ metric }) => (
    <Card sx={{ borderRadius: 4, height: '100%', background: metric.gradient, color: 'white' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>{metric.icon}</Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">{metric.value}</Typography>
            <Typography sx={{ opacity: 0.9 }}>{metric.label}</Typography>
            {metric.change && <Chip label={metric.change} size="small" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const StageCard: React.FC<{ stage: Stage }> = ({ stage }) => {
    const stageVisuals = {
      BUYER: { icon: '🛍️', color: '#4CAF50' },
      SEEKER: { icon: '🔍', color: '#2196F3' },
      SOLVER: { icon: '💡', color: '#FF9800' },
      PROMOTER: { icon: '🚀', color: '#9C27B0' },
    }[stage.name] || { icon: '🌟', color: '#607D8B' };

    return (
      <Card sx={{ borderRadius: 3, mb: 2, border: `3px solid ${stageVisuals.color}`, cursor: 'pointer' }} onClick={() => setSelectedStage(stage)}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: stageVisuals.color, width: 56, height: 56, fontSize: '24px' }}>{stageVisuals.icon}</Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold" color={stageVisuals.color}>{stage.name}</Typography>
              <Typography variant="body2" color="text.secondary">{stage.description}</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5" fontWeight="bold" color={stageVisuals.color}>{`${stage.completionRate}%`}</Typography>
              <Typography variant="caption" color="text.secondary">Completado</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // =====================================================================
  // RENDERS CONDICIONALES
  // =====================================================================

  if (isLoading) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={80} color="inherit" />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Activando Cerebro Operativo de CoomÜnity...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Cargando métricas y experiencias gamificadas
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button onClick={refreshConsole} size="small">
              Reintentar
            </Button>
          }
        >
          Error al cargar datos de la consola: {error.message || 'Error desconocido'}
        </Alert>
      </Container>
    );
  }

  // =====================================================================
  // RENDER PRINCIPAL MEJORADO
  // =====================================================================

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto', minHeight: '100vh' }}>
      {/* Header Cósmico */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{
            width: 64,
            height: 64,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            fontSize: '32px'
          }}>
            🎮
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
              Consola de Experiencias CoomÜnity
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Cerebro Operativo para la Creación de Experiencias Transformadoras
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={realTimeUpdates}
                  onChange={(e) => setRealTimeUpdates(e.target.checked)}
                  color="primary"
                />
              }
              label="Tiempo Real"
            />
            <Badge badgeContent={stages?.length || 0} color="primary">
              <Chip
                icon={<TimelineIcon />}
                label="STAGES Activos"
                color="primary"
                variant="outlined"
              />
            </Badge>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Desde aquí, HumanWäre puede crear, gestionar y optimizar desafíos gamificados que nutran la Reciprocidad,
          fomenten el Bien Común y guíen a los usuarios a través de su Customer Journey transformador.
        </Typography>

        {/* Action Bar Mejorada */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateChallenge}
            size="large"
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, .4)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(102, 126, 234, .6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Crear Desafío Épico
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshConsole}
            disabled={isWorking}
            sx={{ borderRadius: 3 }}
          >
            Actualizar Métricas
          </Button>

          <Button
            variant="outlined"
            startIcon={<AnalyticsIcon />}
            sx={{ borderRadius: 3 }}
          >
            Analytics Avanzado
          </Button>

          <Button
            variant="contained"
            startIcon={<MagicIcon />}
            onClick={() => setAdvancedStageDialogOpen(true)}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(45deg, #ff6b6b 30%, #ffa726 90%)',
              boxShadow: '0 6px 20px rgba(255, 107, 107, .4)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(255, 107, 107, .6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🎭 Advanced Stage Management
          </Button>

          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            sx={{ borderRadius: 3 }}
          >
            Configuración
          </Button>
        </Box>
      </Box>

      {/* Working Indicator Mejorado */}
      {isWorking && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            sx={{
              borderRadius: 2,
              height: 6,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FireIcon fontSize="small" />
            Procesando operación cósmica...
          </Typography>
        </Box>
      )}

      {/* Métricas Dashboard Mejorado */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {consoleMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <MetricCard metric={metric} />
          </Grid>
        ))}
      </Grid>

      {/* Sistema de Tabs Mejorado */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            '& .MuiTab-root': { fontWeight: 'bold' }
          }}
        >
          <Tab icon={<ChallengeIcon />} label="Desafíos" />
          <Tab icon={<TimelineIcon />} label="Customer Journey" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 0: Desafíos */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  🎯 Desafíos Activos ({safeChallenges.length})
                </Typography>
              </Box>

              {!safeChallenges || safeChallenges.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, background: 'linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%)', borderRadius: 3 }}>
                  <ChallengeIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="bold">
                    No hay desafíos creados
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 400, mx: 'auto' }}>
                    Crea tu primer desafío épico para comenzar a nutrir la comunidad con experiencias transformadoras de alto valor.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateChallenge}
                    size="large"
                    sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      mt: 2
                    }}
                  >
                    Crear Primer Desafío Épico
                  </Button>
                </Box>
              ) : (
                <Box>
                  {safeChallenges.map((challenge) => (
                    <Card key={challenge.id} sx={{ my: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{challenge.name}</Typography>
                        <IconButton onClick={() => handleEditChallenge(challenge)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDeleteChallenge(challenge.id)}><DeleteIcon /></IconButton>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Tab 1: Customer Journey / Stages */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  🌟 Customer Journey - {stages?.length || 0} STAGES
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {stages?.map((stage) => (
                  <Grid item xs={12} md={6} key={stage.id}>
                    <StageCard stage={stage} />
                  </Grid>
                ))}
              </Grid>

              {stages?.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <TimelineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hay datos de stages disponibles
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Challenge Editor Dialog */}
      <Dialog
        open={isEditorOpen}
        onClose={handleCloseEditor}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">
            {selectedChallenge ? '✏️ Editar Desafío' : '✨ Crear Nuevo Desafío Épico'}
          </Typography>
          <IconButton onClick={handleCloseEditor} sx={{ color: 'white' }}>
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

      {/* Stage Detail Dialog */}
      <Dialog
        open={!!selectedStage}
        onClose={() => setSelectedStage(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        {selectedStage && (
          <>
            <DialogTitle sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${selectedStage.color}20 0%, ${selectedStage.color}40 100%)`,
              borderBottom: `3px solid ${selectedStage.color}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: selectedStage.color, fontSize: '24px' }}>
                  {selectedStage.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {selectedStage.name} - Detalles
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedStage(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                {selectedStage.description}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Métricas</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Total Usuarios"
                        secondary={selectedStage.metrics?.totalUsers || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Nuevos esta semana"
                        secondary={selectedStage.metrics?.newThisWeek || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tasa de Conversión"
                        secondary={`${selectedStage.metrics?.conversionRate || 0}%`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Actividades</Typography>
                  {selectedStage.activities?.map((activity, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2">{activity.name}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={activity.completion}
                        sx={{ mt: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {activity.completion}% completado
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>

              {selectedStage.rewards?.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>Recompensas</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {selectedStage.rewards.map((reward, index) => (
                      <Chip
                        key={index}
                        label={`${reward.amount} ${reward.type}`}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Advanced Stage Management Dialog */}
      <Dialog
        open={advancedStageDialogOpen}
        onClose={() => setAdvancedStageDialogOpen(false)}
        maxWidth="xl"
        fullWidth
        fullScreen
        PaperProps={{
          sx: { borderRadius: 0 }
        }}
      >
        <AdvancedStageManagement
          onClose={() => setAdvancedStageDialogOpen(false)}
          isFullScreen={true}
        />
      </Dialog>

      {/* Floating Action Button Cósmico */}
      <Fab
        color="primary"
        aria-label="crear desafío épico"
        onClick={handleCreateChallenge}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          width: 64,
          height: 64,
          boxShadow: '0 8px 30px rgba(102, 126, 234, .4)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, .6)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <MagicIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Box>
  );
};
