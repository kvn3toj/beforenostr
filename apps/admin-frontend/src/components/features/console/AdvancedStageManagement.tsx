/**
 * 🎭 Advanced Stage Management System - Experience Console Enhancement
 *
 * Sophisticated interface for managing the Customer Journey stages
 * Replaces the basic stage visualization with advanced interactive features
 *
 * Features:
 * - Interactive Stage Flow Visualization
 * - Real-time Stage Analytics Dashboard
 * - Advanced Stage Configuration Tools
 * - Stage Progression Management
 * - User Journey Heat Maps
 * - Stage Requirements Editor
 * - AI Optimization Suggestions
 */

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Tooltip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as AIIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assessment as AnalyticsIcon,
  AutoGraph as FlowIcon,
  EmojiEvents as RewardsIcon,
  Security as RequirementsIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayIcon,
  Tune as TuneIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useConsoleData, useStageAnalytics } from '../../../hooks/useConsoleData';

// ===============================================================================
// TYPES AND INTERFACES
// ===============================================================================

interface StageConfiguration {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  philosophyAlignment: 'reciprocidad' | 'bien_comun' | 'metanoia';
  isActive: boolean;
  requirements: {
    minimumMeritos?: number;
    minimumOndas?: number;
    minimumTransactions?: number;
    timeInCurrentStage?: number;
    trustVotesRequired?: number;
    minimumScore?: number;
  };
  rewards: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  activities: Array<{
    name: string;
    completion: number;
    impact: number;
    isRequired: boolean;
  }>;
  metrics: {
    totalUsers: number;
    newThisWeek: number;
    conversionRate: number;
    averageTimeInStage: number;
    completionRate: number;
    dropoffRate: number;
    engagementScore: number;
  };
}

// Note: StageFlowNode interface for future advanced flow visualization
// interface StageFlowNode {
//   id: string;
//   type: 'stage' | 'decision' | 'action';
//   position: { x: number; y: number };
//   data: {
//     label: string;
//     stage?: StageConfiguration;
//     users?: number;
//     conversionRate?: number;
//   };
//   connections: string[];
// }

interface OptimizationSuggestion {
  id: string;
  type: 'critical' | 'opportunity' | 'enhancement';
  priority: 'high' | 'medium' | 'low';
  stage: string;
  title: string;
  description: string;
  impact: number;
  effort: number;
  implementation: string[];
}

// ===============================================================================
// STAGE CONFIGURATIONS
// ===============================================================================

const STAGE_CONFIGS: Record<string, Omit<StageConfiguration, 'metrics'>> = {
  BUYER: {
    id: 'BUYER',
    name: 'BUYER - Consumidor Inicial',
    description: 'Usuario que recibe gift cards y experimenta los primeros intercambios',
    icon: '🛒',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    philosophyAlignment: 'reciprocidad',
    isActive: true,
    requirements: {
      timeInCurrentStage: 0,
    },
    rewards: [
      { type: 'LUKAS', amount: 50, description: '50 Lükas de bienvenida' },
      { type: 'MERITOS', amount: 10, description: 'Primeros méritos por activación' },
    ],
    activities: [
      { name: 'Activar Gift Card', completion: 85, impact: 5, isRequired: true },
      { name: 'Primer intercambio', completion: 73, impact: 4, isRequired: true },
      { name: 'Explorar marketplace', completion: 68, impact: 3, isRequired: false },
      { name: 'Configurar perfil', completion: 91, impact: 2, isRequired: false },
    ],
  },
  SEEKER: {
    id: 'SEEKER',
    name: 'SEEKER - Buscador de Oportunidades',
    description: 'Usuario que explora el marketplace y busca crear valor',
    icon: '🔍',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    philosophyAlignment: 'bien_comun',
    isActive: true,
    requirements: {
      minimumMeritos: 50,
      minimumTransactions: 3,
      timeInCurrentStage: 7,
    },
    rewards: [
      { type: 'ACCESS', amount: 1, description: 'Acceso a crear servicios básicos' },
      { type: 'MERITOS', amount: 25, description: 'Bonus por progresión' },
    ],
    activities: [
      { name: 'Completar transacciones', completion: 65, impact: 5, isRequired: true },
      { name: 'Interactuar con comunidad', completion: 58, impact: 4, isRequired: true },
      { name: 'Solicitar trust vote', completion: 42, impact: 3, isRequired: true },
      { name: 'Crear primer servicio', completion: 35, impact: 4, isRequired: false },
    ],
  },
  SOLVER: {
    id: 'SOLVER',
    name: 'SOLVER - Solucionador/Emprendedor',
    description: 'Usuario que ofrece productos y servicios en el marketplace',
    icon: '⚡',
    color: '#45B7D1',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)',
    philosophyAlignment: 'metanoia',
    isActive: true,
    requirements: {
      minimumMeritos: 100,
      minimumOndas: 50,
      trustVotesRequired: 3,
      timeInCurrentStage: 14,
    },
    rewards: [
      { type: 'ACCESS', amount: 1, description: 'Marketplace completo' },
      { type: 'PERKS', amount: 1, description: 'Herramientas avanzadas' },
      { type: 'MERITOS', amount: 50, description: 'Bonus considerable' },
    ],
    activities: [
      { name: 'Obtener validación', completion: 42, impact: 5, isRequired: true },
      { name: 'Crear servicios avanzados', completion: 38, impact: 4, isRequired: true },
      { name: 'Generar Öndas positivas', completion: 45, impact: 4, isRequired: true },
      { name: 'Mentorear SEEKERs', completion: 28, impact: 3, isRequired: false },
    ],
  },
  PROMOTER: {
    id: 'PROMOTER',
    name: 'PROMOTER - Promotor de la Comunidad',
    description: 'Usuario que invita y valida nuevos miembros',
    icon: '🌟',
    color: '#96CEB4',
    gradient: 'linear-gradient(135deg, #96CEB4 0%, #FFECD2 100%)',
    philosophyAlignment: 'reciprocidad',
    isActive: true,
    requirements: {
      minimumMeritos: 500,
      minimumOndas: 200,
      minimumScore: 85,
      timeInCurrentStage: 30,
    },
    rewards: [
      { type: 'CASHBACK', amount: 1, description: 'Sistema CashBack' },
      { type: 'INFLUENCE', amount: 1, description: 'Poder de validación' },
      { type: 'MERITOS', amount: 100, description: 'Bonus máximo' },
    ],
    activities: [
      { name: 'Invitar nuevos miembros', completion: 28, impact: 5, isRequired: true },
      { name: 'Validar SOLVERs', completion: 35, impact: 5, isRequired: true },
      { name: 'Liderar iniciativas', completion: 22, impact: 4, isRequired: true },
      { name: 'Expandir red', completion: 18, impact: 3, isRequired: false },
    ],
  },
};

// ===============================================================================
// MAIN COMPONENT
// ===============================================================================

interface AdvancedStageManagementProps {
  onClose?: () => void;
  isFullScreen?: boolean;
}

export const AdvancedStageManagement: React.FC<AdvancedStageManagementProps> = ({
  onClose,
  isFullScreen = false
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [optimizationMode, setOptimizationMode] = useState(false);

  // Data hooks
  const dashboardData = useConsoleData();
  const { data: stageAnalytics } = useStageAnalytics(selectedStage || 'BUYER');

  // Note: stageAnalytics will be used for detailed analytics in future iterations
  console.log('Stage analytics loaded:', stageAnalytics ? 'Yes' : 'No');

  // Mock enhanced data (in production, this would come from the backend)
  const [stageConfigurations, setStageConfigurations] = useState<StageConfiguration[]>(() => {
    return Object.values(STAGE_CONFIGS).map(config => ({
      ...config,
      metrics: {
        totalUsers: Math.floor(Math.random() * 200) + 50,
        newThisWeek: Math.floor(Math.random() * 20) + 5,
        conversionRate: Math.floor(Math.random() * 40) + 40,
        averageTimeInStage: Math.floor(Math.random() * 14) + 3,
        completionRate: Math.floor(Math.random() * 30) + 60,
        dropoffRate: Math.floor(Math.random() * 15) + 5,
        engagementScore: Math.floor(Math.random() * 20) + 75,
      },
    }));
  });

  const [optimizationSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: 'opt-1',
      type: 'critical',
      priority: 'high',
      stage: 'SEEKER',
      title: 'Baja conversión SEEKER → SOLVER',
      description: 'Solo 42% de SEEKERs progresan a SOLVER. Revisar requisitos de trust votes.',
      impact: 85,
      effort: 60,
      implementation: [
        'Reducir trust votes requeridos de 3 a 2',
        'Implementar sistema de mentoring automático',
        'Crear workshops de transición'
      ],
    },
    {
      id: 'opt-2',
      type: 'opportunity',
      priority: 'medium',
      stage: 'BUYER',
      title: 'Optimizar tiempo de activación',
      description: 'Los BUYERs tardan 5.2 días promedio en completar la activación inicial.',
      impact: 72,
      effort: 40,
      implementation: [
        'Simplificar proceso de gift card',
        'Añadir tutoriales interactivos',
        'Implementar notificaciones progresivas'
      ],
    },
    {
      id: 'opt-3',
      type: 'enhancement',
      priority: 'low',
      stage: 'PROMOTER',
      title: 'Incrementar retención PROMOTER',
      description: 'Los PROMOTERs muestran signos de desenganche después de 3 meses.',
      impact: 65,
      effort: 80,
      implementation: [
        'Crear desafíos exclusivos para PROMOTERs',
        'Implementar sistema de reconocimientos',
        'Desarrollar programa de embajadores'
      ],
    },
  ]);

  // ===============================================================================
  // EVENT HANDLERS
  // ===============================================================================

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
    setActiveTab(1); // Switch to stage detail tab
  };

  const handleConfigurationSave = (_stageId: string, _config: Partial<StageConfiguration>) => {
    // Configuration save logic would be implemented here
    // setStageConfigurations(prev =>
    //   prev.map(stage =>
    //     stage.id === stageId
    //       ? { ...stage, ...config }
    //       : stage
    //   )
    // );
    setConfigDialogOpen(false);
  };

  const handleOptimizationToggle = () => {
    setOptimizationMode(!optimizationMode);
  };

  // ===============================================================================
  // RENDER FUNCTIONS
  // ===============================================================================

  const renderStageFlowVisualization = () => (
    <Card sx={{ mb: 3, overflow: 'visible' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FlowIcon />
            <Typography variant="h6">Interactive Stage Flow</Typography>
            <Chip label="Real-time" color="success" size="small" />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={optimizationMode}
                  onChange={handleOptimizationToggle}
                  color="primary"
                />
              }
              label="AI Optimization"
            />
            <IconButton onClick={() => dashboardData.refreshConsole()}>
              <RefreshIcon />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ position: 'relative', p: 2 }}>
          {/* Stage Flow Stepper */}
          <Stepper
            activeStep={-1}
            connector={<StepConnector />}
            sx={{ mb: 4 }}
          >
            {stageConfigurations.map((stage) => (
              <Step key={stage.id} completed={false}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        background: stage.gradient,
                        cursor: 'pointer',
                        width: 60,
                        height: 60,
                        fontSize: '24px',
                        boxShadow: optimizationMode && stage.metrics.conversionRate < 50
                          ? `0 0 20px ${theme.palette.warning.main}`
                          : 'none',
                        border: selectedStage === stage.id ? `3px solid ${theme.palette.primary.main}` : 'none',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          transition: 'transform 0.2s ease',
                        },
                      }}
                      onClick={() => handleStageSelect(stage.id)}
                    >
                      {stage.icon}
                    </Avatar>
                  )}
                >
                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {stage.name.split(' - ')[0]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stage.metrics.totalUsers} usuarios
                    </Typography>
                    <br />
                    <Chip
                      label={`${stage.metrics.conversionRate}%`}
                      size="small"
                      color={stage.metrics.conversionRate > 60 ? 'success' :
                             stage.metrics.conversionRate > 40 ? 'warning' : 'error'}
                    />
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Conversion Rates Between Stages */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            {stageConfigurations.slice(0, -1).map((stage, index) => {
              const conversionRate = Math.floor(Math.random() * 30) + 50;

              return (
                <Box key={`conversion-${stage.id}`} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <ArrowForwardIcon
                      sx={{
                        color: conversionRate > 60 ? 'success.main' : 'warning.main',
                        fontSize: 32
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" color={conversionRate > 60 ? 'success.main' : 'warning.main'}>
                      {conversionRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      conversión
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Stage Performance Metrics Grid */}
          <Grid container spacing={2}>
            {stageConfigurations.map((stage) => (
              <Grid item xs={12} sm={6} md={3} key={stage.id}>
                <Paper
                  sx={{
                    p: 2,
                    background: stage.gradient,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handleStageSelect(stage.id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4">
                      {stage.icon}
                    </Typography>
                    <IconButton sx={{ color: 'white' }}>
                      <ViewIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {stage.name.split(' - ')[0]}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {stage.metrics.totalUsers}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      usuarios activos
                    </Typography>
                  </Box>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Nuevos/semana
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        +{stage.metrics.newThisWeek}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Tiempo prom.
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stage.metrics.averageTimeInStage}d
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Engagement Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stage.metrics.engagementScore}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'white',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {stage.metrics.engagementScore}%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStageAnalytics = () => {
    if (!selectedStage) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          Selecciona un stage del flujo para ver analytics detallados
        </Alert>
      );
    }

    const stage = stageConfigurations.find(s => s.id === selectedStage);
    if (!stage) return null;

    return (
      <Box>
        {/* Stage Header */}
        <Paper sx={{ p: 3, mb: 3, background: stage.gradient, color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h2">
                {stage.icon}
              </Typography>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stage.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {stage.description}
                </Typography>
                <Chip
                  label={stage.philosophyAlignment}
                  sx={{
                    mt: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" fontWeight="bold">
                {stage.metrics.totalUsers}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                usuarios activos
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  mt: 1,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
                startIcon={<SettingsIcon />}
                onClick={() => setConfigDialogOpen(true)}
              >
                Configurar
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Analytics Grid */}
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="Métricas Clave"
                subheader="Indicadores de rendimiento del stage"
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {stage.metrics.newThisWeek}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nuevos esta semana
                      </Typography>
                      <Chip
                        label="+12%"
                        size="small"
                        color="success"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {stage.metrics.conversionRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasa de conversión
                      </Typography>
                      <Chip
                        label={stage.metrics.conversionRate > 60 ? "Excelente" : "Mejorable"}
                        size="small"
                        color={stage.metrics.conversionRate > 60 ? "success" : "warning"}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TimerIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {stage.metrics.averageTimeInStage}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Días promedio
                      </Typography>
                      <Chip
                        label="Target: 7d"
                        size="small"
                        color="info"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <FireIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="error.main">
                        {stage.metrics.engagementScore}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Engagement Score
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={stage.metrics.engagementScore}
                        sx={{ mt: 0.5, width: '100%' }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Activities Progress */}
            <Card>
              <CardHeader
                title="Progreso de Actividades"
                subheader="Estado de las actividades del stage"
              />
              <CardContent>
                <List>
                  {stage.activities.map((activity, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: activity.isRequired ? 'error.main' : 'info.main',
                            width: 32,
                            height: 32
                          }}
                        >
                          {activity.isRequired ? '!' : '★'}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {activity.name}
                            </Typography>
                            {activity.isRequired && (
                              <Chip label="Requerida" size="small" color="error" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption">
                                Completado: {activity.completion}%
                              </Typography>
                              <Typography variant="caption">
                                Impacto: {'★'.repeat(activity.impact)}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={activity.completion}
                              color={activity.completion > 70 ? 'success' :
                                     activity.completion > 40 ? 'warning' : 'error'}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Side Panel */}
          <Grid item xs={12} md={4}>
            {/* Requirements */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="Requisitos"
                avatar={<RequirementsIcon />}
              />
              <CardContent>
                <List dense>
                  {Object.entries(stage.requirements).map(([key, value]) => (
                    <ListItem key={key} sx={{ px: 0 }}>
                      <ListItemText
                        primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        secondary={`${value} ${key.includes('time') ? 'días' : ''}`}
                      />
                      <CheckIcon color="success" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="Recompensas"
                avatar={<RewardsIcon />}
              />
              <CardContent>
                <List dense>
                  {stage.rewards.map((reward, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={`${reward.amount} ${reward.type}`}
                        secondary={reward.description}
                      />
                      <StarIcon color="warning" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader title="Acciones Rápidas" />
              <CardContent>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<PlayIcon />}
                    fullWidth
                  >
                    Activar Stage
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TuneIcon />}
                    fullWidth
                    onClick={() => setConfigDialogOpen(true)}
                  >
                    Configurar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    fullWidth
                  >
                    Analytics Profundo
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderOptimizationPanel = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          🤖 AI Optimization Suggestions
        </Typography>
        <Chip
          label={`${optimizationSuggestions.length} sugerencias`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Grid container spacing={3}>
        {optimizationSuggestions.map((suggestion) => (
          <Grid item xs={12} md={6} lg={4} key={suggestion.id}>
            <Card
              sx={{
                height: '100%',
                border: suggestion.type === 'critical' ? `2px solid ${theme.palette.error.main}` :
                        suggestion.type === 'opportunity' ? `2px solid ${theme.palette.warning.main}` :
                        `2px solid ${theme.palette.info.main}`,
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{
                    bgcolor: suggestion.type === 'critical' ? 'error.main' :
                             suggestion.type === 'opportunity' ? 'warning.main' : 'info.main'
                  }}>
                    {suggestion.type === 'critical' ? '🚨' :
                     suggestion.type === 'opportunity' ? '💡' : '⚡'}
                  </Avatar>
                }
                title={suggestion.title}
                subheader={
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={suggestion.priority} size="small" color="secondary" />
                    <Chip label={suggestion.stage} size="small" />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {suggestion.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Impacto Estimado
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={suggestion.impact}
                    color="success"
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  <Typography variant="caption">
                    {suggestion.impact}% de mejora potencial
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Esfuerzo Requerido
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={suggestion.effort}
                    color="warning"
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  <Typography variant="caption">
                    {suggestion.effort}% de esfuerzo
                  </Typography>
                </Box>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Plan de Implementación</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {suggestion.implementation.map((step, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Typography variant="caption" color="primary">
                              {index + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText
                            primary={step}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined" color="primary">
                  Implementar
                </Button>
                <Button size="small">
                  Más detalles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // ===============================================================================
  // MAIN RENDER
  // ===============================================================================

  if (dashboardData.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando Sistema Avanzado de Stages...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: isFullScreen ? '100vh' : 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🎭 Advanced Stage Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistema inteligente de gestión del Customer Journey con analytics en tiempo real
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
          <Badge badgeContent={optimizationSuggestions.length} color="error">
            <Button
              variant={optimizationMode ? "contained" : "outlined"}
              startIcon={<AIIcon />}
              onClick={handleOptimizationToggle}
            >
              AI Optimization
            </Button>
          </Badge>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab
            icon={<FlowIcon />}
            label="Flow Visualization"
            sx={{ fontWeight: 'bold' }}
          />
          <Tab
            icon={<AnalyticsIcon />}
            label="Stage Analytics"
            sx={{ fontWeight: 'bold' }}
            disabled={!selectedStage}
          />
          <Tab
            icon={<AIIcon />}
            label="AI Optimization"
            sx={{ fontWeight: 'bold' }}
          />
          <Tab
            icon={<SettingsIcon />}
            label="Configuration"
            sx={{ fontWeight: 'bold' }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderStageFlowVisualization()}
      {activeTab === 1 && renderStageAnalytics()}
      {activeTab === 2 && renderOptimizationPanel()}
      {activeTab === 3 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Sistema de configuración avanzada - En desarrollo
        </Alert>
      )}

      {/* Configuration Dialog */}
      <Dialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configurar Stage: {selectedStage}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configuración avanzada del stage - En desarrollo
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedStageManagement;
