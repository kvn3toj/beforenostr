/**
 * 🎮 Enhanced Experience Console - Advanced Gamification Management
 *
 * Versión mejorada de la Consola con UX/UI optimizada y funcionalidades avanzadas
 * Incluye visualizaciones de datos, animaciones y mejor organización
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Badge,
  Tooltip,
  Paper,
  Stack,
  Rating,
  Slider,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  HowToVote as VoteIcon,
  SmartToy as AIIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Visibility as ViewIcon,
  Send as SendIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Notifications as NotificationsIcon,
  AutoGraph as GraphIcon,
  Psychology as PsychologyIcon,
  Gamepad as GamepadIcon,
  Rocket as RocketIcon,
  Diamond as DiamondIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Celebration as CelebrationIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  MoreVert as MoreIcon,
  Launch as LaunchIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Enhanced Types
interface DashboardMetrics {
  activeUsers: {
    current: number;
    growth: number;
    trend: number[];
  };
  stageProgression: {
    buyer: number;
    seeker: number;
    solver: number;
    promoter: number;
  };
  engagement: {
    gplViews: number;
    questionAnswers: number;
    trustVotes: number;
    marketplaceInteractions: number;
  };
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    satisfaction: number;
  };
}

interface ContestConfig {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'special';
  duration: number;
  participants: number;
  rewards: {
    first: number;
    second: number;
    third: number;
    participation: number;
  };
  rules: string[];
  isActive: boolean;
  progress: number;
}

interface StageVisualization {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  users: number;
  completionRate: number;
  avgTimeInStage: string;
  nextStageConversion: number;
  keyActions: string[];
  philosophyAlignment: 'ayni' | 'bien_comun' | 'metanoia';
}

const ExperienceConsoleEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<StageVisualization | null>(null);
  const [showCreateContest, setShowCreateContest] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Mock data generation with enhanced metrics
  useEffect(() => {
    const generateMockData = () => {
      setMetrics({
        activeUsers: {
          current: 1247,
          growth: 12.5,
          trend: [1100, 1150, 1180, 1200, 1220, 1247]
        },
        stageProgression: {
          buyer: 45,
          seeker: 28,
          solver: 22,
          promoter: 5
        },
        engagement: {
          gplViews: 3420,
          questionAnswers: 2156,
          trustVotes: 89,
          marketplaceInteractions: 456
        },
        systemHealth: {
          uptime: 99.8,
          responseTime: 245,
          errorRate: 0.02,
          satisfaction: 4.7
        }
      });
      setIsLoading(false);
    };

    generateMockData();

    // Simulate real-time updates
    if (realTimeUpdates) {
      const interval = setInterval(generateMockData, 30000);
      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const stageData: StageVisualization[] = [
    {
      id: 'buyer',
      name: 'BUYER',
      icon: <HomeIcon />,
      color: '#FF6B6B',
      users: 561,
      completionRate: 73,
      avgTimeInStage: '3.2 días',
      nextStageConversion: 68,
      keyActions: ['Activar Gift Card', 'Primera compra', 'Calificar servicio'],
      philosophyAlignment: 'ayni'
    },
    {
      id: 'seeker',
      name: 'SEEKER',
      icon: <SearchIcon />,
      color: '#4ECDC4',
      users: 349,
      completionRate: 45,
      avgTimeInStage: '8.1 días',
      nextStageConversion: 52,
      keyActions: ['Explorar marketplace', 'Solicitar votos', 'Crear perfil'],
      philosophyAlignment: 'bien_comun'
    },
    {
      id: 'solver',
      name: 'SOLVER',
      icon: <BusinessIcon />,
      color: '#45B7D1',
      users: 274,
      completionRate: 62,
      avgTimeInStage: '15.4 días',
      nextStageConversion: 35,
      keyActions: ['Crear servicios', 'Recibir validación', 'Generar ventas'],
      philosophyAlignment: 'metanoia'
    },
    {
      id: 'promoter',
      name: 'PROMOTER',
      icon: <RocketIcon />,
      color: '#96CEB4',
      users: 63,
      completionRate: 28,
      avgTimeInStage: '45+ días',
      nextStageConversion: 95,
      keyActions: ['Invitar usuarios', 'Validar seekers', 'Liderar comunidad'],
      philosophyAlignment: 'ayni'
    }
  ];

  const contestsData: ContestConfig[] = [
    {
      id: 'weekly_47',
      name: 'Concurso Semanal de Mëritos #47',
      type: 'weekly',
      duration: 7,
      participants: 247,
      rewards: {
        first: 500,
        second: 300,
        third: 150,
        participation: 25
      },
      rules: [
        'Enfoque en resonancia del producto/servicio',
        'Bonus por colaboraciones en duplas',
        'Multiplicador por feedback positivo'
      ],
      isActive: true,
      progress: 67
    },
    {
      id: 'monthly_12',
      name: 'Gran Desafío Öndas de Junio',
      type: 'monthly',
      duration: 30,
      participants: 892,
      rewards: {
        first: 2000,
        second: 1200,
        third: 800,
        participation: 100
      },
      rules: [
        'Acumulación de Öndas por GPL engagement',
        'Bonus por completar video series',
        'Multiplicador por preguntas de consenso'
      ],
      isActive: true,
      progress: 43
    }
  ];

  const octalysisData = [
    { name: 'Epic Meaning', value: 85, color: '#FF6B6B' },
    { name: 'Accomplishment', value: 78, color: '#4ECDC4' },
    { name: 'Empowerment', value: 72, color: '#45B7D1' },
    { name: 'Ownership', value: 68, color: '#96CEB4' },
    { name: 'Social Influence', value: 81, color: '#FECA57' },
    { name: 'Scarcity', value: 64, color: '#FF9FF3' },
    { name: 'Unpredictability', value: 59, color: '#54A0FF' },
    { name: 'Avoidance', value: 42, color: '#5F27CD' }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderDashboard = () => (
    <Grid container spacing={3}>
      {/* Real-time Controls */}
      <Grid xs={12}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DashboardIcon color="primary" />
              Dashboard en Tiempo Real
            </Typography>
            <Chip
              label={realTimeUpdates ? 'Live' : 'Paused'}
              color={realTimeUpdates ? 'success' : 'warning'}
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={realTimeUpdates}
                  onChange={(e) => setRealTimeUpdates(e.target.checked)}
                />
              }
              label="Updates en vivo"
            />
            <IconButton onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Paper>
      </Grid>

      {/* Key Metrics Cards */}
      <Grid xs={12} md={3}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon />
              Usuarios Activos
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {metrics?.activeUsers.current.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <TrendingUpIcon fontSize="small" />
              <Typography variant="body2">
                +{metrics?.activeUsers.growth}% esta semana
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={metrics?.activeUsers.growth || 0}
              sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.3)' }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={3}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon />
              GPL Engagement
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              84%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <StarIcon fontSize="small" />
              <Typography variant="body2">
                {metrics?.engagement.gplViews} views hoy
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={84}
              sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.3)' }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={3}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon />
              Trust Votes
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {metrics?.engagement.trustVotes}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <VoteIcon fontSize="small" />
              <Typography variant="body2">
                12.7 promedio/día
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={67}
              sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.3)' }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={3}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon />
              System Health
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {metrics?.systemHealth.uptime}%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CheckIcon fontSize="small" />
              <Typography variant="body2">
                {metrics?.systemHealth.responseTime}ms avg
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={metrics?.systemHealth.uptime || 0}
              sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.3)' }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Stage Flow Visualization */}
      <Grid xs={12} md={8}>
        <Card sx={{ height: 400 }}>
          <CardHeader
            title="Customer Journey Flow"
            subheader="Progresión de usuarios entre stages"
            action={
              <IconButton>
                <ViewIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              {stageData.map((stage, index) => (
                <Box key={stage.id} sx={{ textAlign: 'center', flex: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: stage.color,
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedStage(stage)}
                  >
                    {stage.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {stage.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stage.users} usuarios
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stage.completionRate}% completion
                  </Typography>
                  {index < stageData.length - 1 && (
                    <Box sx={{
                      position: 'absolute',
                      right: '-50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'primary.main',
                      fontSize: '24px'
                    }}>
                      →
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={[
                { name: 'BUYER', value: 561, conversion: 68 },
                { name: 'SEEKER', value: 349, conversion: 52 },
                { name: 'SOLVER', value: 274, conversion: 35 },
                { name: 'PROMOTER', value: 63, conversion: 95 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Octalysis Radar */}
      <Grid xs={12} md={4}>
        <Card sx={{ height: 400 }}>
          <CardHeader
            title="Framework Octalysis"
            subheader="Intensidad de elementos gamificados"
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={octalysisData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" fontSize={10} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                <Radar
                  name="Intensidad"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Real-time Activity Feed */}
      <Grid xs={12}>
        <Card>
          <CardHeader
            title="Actividad en Tiempo Real"
            subheader="Últimas acciones en el ecosistema CoomÜnity"
            action={
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            }
          />
          <CardContent>
            <List>
              {[
                { user: 'Ana Valdez', action: 'completó GPL "Ayni en la Práctica"', time: '2 min', type: 'gpl' },
                { user: 'Carlos Mendoza', action: 'recibió voto de confianza', time: '5 min', type: 'trust' },
                { user: 'María Torres', action: 'creó nuevo servicio en marketplace', time: '8 min', type: 'marketplace' },
                { user: 'Luis García', action: 'alcanzó 100 Mëritos', time: '12 min', type: 'achievement' }
              ].map((activity, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: activity.type === 'gpl' ? '#4ECDC4' :
                               activity.type === 'trust' ? '#45B7D1' :
                               activity.type === 'marketplace' ? '#FECA57' : '#96CEB4'
                    }}>
                      {activity.type === 'gpl' && <SchoolIcon />}
                      {activity.type === 'trust' && <SecurityIcon />}
                      {activity.type === 'marketplace' && <BusinessIcon />}
                      {activity.type === 'achievement' && <CelebrationIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<><strong>{activity.user}</strong> {activity.action}</>}
                    secondary={`hace ${activity.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderContests = () => (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrophyIcon color="primary" />
            Concursos Activos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateContest(true)}
            sx={{ borderRadius: 3 }}
          >
            Crear Concurso
          </Button>
        </Box>
      </Grid>

      {contestsData.map((contest) => (
        <Grid xs={12} md={6} key={contest.id}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <Box sx={{
              position: 'absolute',
              top: -10,
              right: 10,
              zIndex: 1
            }}>
              <Chip
                label={contest.type.toUpperCase()}
                color={contest.type === 'weekly' ? 'primary' : contest.type === 'monthly' ? 'secondary' : 'warning'}
                size="small"
              />
            </Box>

            <CardHeader
              title={contest.name}
              subheader={`${contest.participants} participantes • ${contest.duration} días`}
              avatar={
                <Avatar sx={{ bgcolor: contest.isActive ? 'success.main' : 'grey.500' }}>
                  <TrophyIcon />
                </Avatar>
              }
            />

            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Progreso del concurso
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={contest.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {contest.progress}% completado
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Premios (en Lükas)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip icon={<DiamondIcon />} label={`1° ${contest.rewards.first}`} color="warning" size="small" />
                  <Chip icon={<StarIcon />} label={`2° ${contest.rewards.second}`} color="default" size="small" />
                  <Chip icon={<DiamondIcon />} label={`3° ${contest.rewards.third}`} color="default" size="small" />
                </Stack>
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Reglas Especiales</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {contest.rules.map((rule, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rule} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </CardContent>

            <CardActions>
              <Button size="small" startIcon={<ViewIcon />}>
                Ver Leaderboard
              </Button>
              <Button size="small" startIcon={<AssessmentIcon />}>
                Analytics
              </Button>
              <Button
                size="small"
                color={contest.isActive ? 'error' : 'success'}
                startIcon={contest.isActive ? <PauseIcon /> : <PlayIcon />}
              >
                {contest.isActive ? 'Pausar' : 'Activar'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Speed Dial for quick actions
  const speedDialActions = [
    { icon: <AddIcon />, name: 'Crear Concurso', action: () => setShowCreateContest(true) },
    { icon: <DownloadIcon />, name: 'Exportar Datos' },
    { icon: <RefreshIcon />, name: 'Actualizar Dashboard' },
    { icon: <SettingsIcon />, name: 'Configuración' },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', minHeight: '100vh', position: 'relative' }}>
      {/* Header with enhanced styling */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        px: 3,
        py: 2
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🎮 Consola de Experiencias CoomÜnity
        </Typography>
        <Typography variant="subtitle1">
          Centro de control avanzado para experiencias gamificadas • Framework Octalysis aplicado
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mt: 2,
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
            '& .Mui-selected': { color: 'white !important' },
            '& .MuiTabs-indicator': { backgroundColor: 'white' }
          }}
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<TrophyIcon />} label="Concursos" />
          <Tab icon={<VoteIcon />} label="Trust System" />
          <Tab icon={<PlayIcon />} label="GPL Manager" />
          <Tab icon={<PsychologyIcon />} label="Octalysis" />
          <Tab icon={<AssessmentIcon />} label="Analytics" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {activeTab === 0 && renderDashboard()}
            {activeTab === 1 && renderContests()}
            {activeTab === 2 && (
              <Typography variant="h6">Trust System Management - En desarrollo</Typography>
            )}
            {activeTab === 3 && (
              <Typography variant="h6">GPL Content Manager - En desarrollo</Typography>
            )}
            {activeTab === 4 && (
              <Typography variant="h6">Octalysis Configuration - En desarrollo</Typography>
            )}
            {activeTab === 5 && (
              <Typography variant="h6">Advanced Analytics - En desarrollo</Typography>
            )}
          </>
        )}
      </Box>

      {/* Stage Detail Dialog */}
      <Dialog open={!!selectedStage} onClose={() => setSelectedStage(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedStage && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: selectedStage.color }}>
                {selectedStage.icon}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedStage.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Alineación filosófica: {selectedStage.philosophyAlignment}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedStage && (
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Typography variant="body2" gutterBottom>Usuarios activos</Typography>
                <Typography variant="h4">{selectedStage.users}</Typography>
              </Grid>
              <Grid xs={6}>
                <Typography variant="body2" gutterBottom>Completion Rate</Typography>
                <Typography variant="h4">{selectedStage.completionRate}%</Typography>
              </Grid>
              <Grid xs={6}>
                <Typography variant="body2" gutterBottom>Tiempo promedio</Typography>
                <Typography variant="h4">{selectedStage.avgTimeInStage}</Typography>
              </Grid>
              <Grid xs={6}>
                <Typography variant="body2" gutterBottom>Conversión</Typography>
                <Typography variant="h4">{selectedStage.nextStageConversion}%</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="h6" gutterBottom>Acciones Clave</Typography>
                <List>
                  {selectedStage.keyActions.map((action, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedStage(null)}>Cerrar</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Configurar Stage
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Contest Dialog */}
      <Dialog open={showCreateContest} onClose={() => setShowCreateContest(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Concurso</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre del Concurso" fullWidth />
            <TextField
              select
              label="Tipo"
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="special">Especial</option>
            </TextField>
            <TextField label="Duración (días)" type="number" fullWidth />
            <TextField label="Premio Total (Lükas)" type="number" fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateContest(false)}>Cancelar</Button>
          <Button variant="contained" startIcon={<SaveIcon />}>
            Crear Concurso
          </Button>
        </DialogActions>
      </Dialog>

      {/* Speed Dial for quick actions */}
      <SpeedDial
        ariaLabel="Acciones rápidas"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<GamepadIcon />} openIcon={<CloseIcon />} />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default ExperienceConsoleEnhanced;
