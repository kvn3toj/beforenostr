import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Analytics as AnalyticsIcon,
  LocalFireDepartment as FireIcon,
  Search as SearchIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useConsoleApi } from '../hooks/useConsoleApi';

// 🎭 Types del Sistema de Stages
type CustomerJourneyStage = 'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER';

interface StageData {
  id: CustomerJourneyStage;
  name: string;
  description: string;
  icon: string;
  color: string;
  metrics: {
    totalUsers: number;
    newThisWeek: number;
    conversionRate: number;
    averageTimeInStage: number;
    topActivities: string[];
  };
  requirements: {
    minimumMeritos?: number;
    minimumOndas?: number;
    minimumTransactions?: number;
    timeInCurrentStage?: number;
  };
  nextStage: CustomerJourneyStage | null;
  activities: Array<{
    name: string;
    completion: number;
    impact: number;
  }>;
  rewards: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
}

interface StagesOverview {
  stages: StageData[];
  totalUsers: number;
  conversionFunnel: Record<CustomerJourneyStage, number>;
}

// 🎨 Stage Colors and Icons
const STAGE_CONFIG = {
  BUYER: { icon: '🛒', color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)' },
  SEEKER: { icon: '🔍', color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)' },
  SOLVER: { icon: '⚡', color: '#45B7D1', gradient: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)' },
  PROMOTER: { icon: '🌟', color: '#96CEB4', gradient: 'linear-gradient(135deg, #96CEB4 0%, #FFECD2 100%)' },
};

const StagesManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStage, setSelectedStage] = useState<CustomerJourneyStage | null>(null);
  const [stagesData, setStagesData] = useState<StagesOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { apiClient } = useConsoleApi();

  useEffect(() => {
    loadStagesData();
  }, []);

  const loadStagesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/console/stages');
      setStagesData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cargando datos de stages');
      console.error('Error loading stages data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUser = async (userId: string) => {
    try {
      await apiClient.post(`/console/stages/user/${userId}/progress`);
      await loadStagesData(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error progresando usuario');
    }
  };

  const renderOverviewTab = () => {
    if (!stagesData) return null;

    return (
      <Box>
        {/* 📊 Métricas Generales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stagesData.totalUsers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Jugadores Totales
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#8B4513' }}>
                      {stagesData.stages.reduce((sum, stage) => sum + stage.metrics.newThisWeek, 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8B4513', opacity: 0.8 }}>
                      Nuevos Esta Semana
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#8B4513', opacity: 0.6 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#2E8B57' }}>
                      {Math.round(stagesData.stages.reduce((sum, stage) => sum + stage.metrics.conversionRate, 0) / stagesData.stages.length)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2E8B57', opacity: 0.8 }}>
                      Conversión Promedio
                    </Typography>
                  </Box>
                  <TimelineIcon sx={{ fontSize: 40, color: '#2E8B57', opacity: 0.6 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stagesData.stages.filter(s => s.id === 'PROMOTER')[0]?.metrics.totalUsers || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Promoters Activos
                    </Typography>
                  </Box>
                  <StarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 🏛️ Vista de Stages */}
        <Grid container spacing={3}>
          {stagesData.stages.map((stage, index) => (
            <Grid item xs={12} sm={6} md={3} key={stage.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  background: STAGE_CONFIG[stage.id].gradient,
                  color: stage.id === 'BUYER' || stage.id === 'PROMOTER' ? 'white' : '#2C3E50'
                }}
                onClick={() => setSelectedStage(stage.id)}
              >
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h2" sx={{ mb: 1 }}>
                      {STAGE_CONFIG[stage.id].icon}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stage.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                      {stage.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Usuarios Activos
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {stage.metrics.totalUsers}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stage.metrics.totalUsers / stagesData.totalUsers) * 100} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stage.id === 'BUYER' || stage.id === 'PROMOTER' ? 'white' : '#2C3E50'
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={`${stage.metrics.conversionRate}% conversión`}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'inherit',
                        fontWeight: 'medium'
                      }}
                    />
                    <Chip 
                      label={`+${stage.metrics.newThisWeek} nuevos`}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'inherit',
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button 
                    size="small" 
                    sx={{ 
                      color: 'inherit', 
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                    endIcon={<VisibilityIcon />}
                  >
                    Ver Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 📈 Funnel de Conversión */}
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TimelineIcon sx={{ mr: 2, color: 'primary.main' }} />
            Embudo de Conversión - Customer Journey
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {stagesData.stages.map((stage, index) => (
              <Box key={stage.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      backgroundColor: STAGE_CONFIG[stage.id].color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      fontSize: '24px'
                    }}
                  >
                    {STAGE_CONFIG[stage.id].icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stage.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: STAGE_CONFIG[stage.id].color, fontWeight: 'bold' }}>
                    {stage.metrics.totalUsers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round((stage.metrics.totalUsers / stagesData.totalUsers) * 100)}%
                  </Typography>
                </Box>
                
                {index < stagesData.stages.length - 1 && (
                  <ArrowForwardIcon sx={{ mx: 2, color: 'text.secondary' }} />
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderStageDetailTab = () => {
    if (!selectedStage || !stagesData) return null;

    const stageData = stagesData.stages.find(s => s.id === selectedStage);
    if (!stageData) return null;

    return (
      <Box>
        {/* 🎯 Header del Stage */}
        <Paper sx={{ p: 3, mb: 3, background: STAGE_CONFIG[selectedStage].gradient, color: selectedStage === 'BUYER' || selectedStage === 'PROMOTER' ? 'white' : '#2C3E50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h2" sx={{ mr: 2 }}>
                {STAGE_CONFIG[selectedStage].icon}
              </Typography>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stageData.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {stageData.description}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stageData.metrics.totalUsers}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                usuarios activos
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* 📊 Métricas del Stage */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Métricas de Rendimiento</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {stageData.metrics.newThisWeek}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nuevos Esta Semana
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {stageData.metrics.conversionRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa Conversión
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      {stageData.metrics.averageTimeInStage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Días Promedio
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                      {stageData.activities.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actividades
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* 🎯 Actividades Principales */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Actividades Principales</Typography>
              
              <List>
                {stageData.activities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: STAGE_CONFIG[selectedStage].color }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={activity.name}
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
                              sx={{ height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < stageData.activities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* 📋 Requisitos y Recompensas */}
          <Grid item xs={12} md={4}>
            {/* Requisitos */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <TrophyIcon sx={{ mr: 1, color: 'primary.main' }} />
                Requisitos para Avanzar
              </Typography>
              
              {Object.keys(stageData.requirements).length > 0 ? (
                <List dense>
                  {stageData.requirements.minimumMeritos && (
                    <ListItem>
                      <ListItemText 
                        primary="Mëritos Mínimos"
                        secondary={`${stageData.requirements.minimumMeritos} mëritos`}
                      />
                    </ListItem>
                  )}
                  {stageData.requirements.minimumOndas && (
                    <ListItem>
                      <ListItemText 
                        primary="Öndas Mínimas"
                        secondary={`${stageData.requirements.minimumOndas} öndas`}
                      />
                    </ListItem>
                  )}
                  {stageData.requirements.minimumTransactions && (
                    <ListItem>
                      <ListItemText 
                        primary="Transacciones"
                        secondary={`${stageData.requirements.minimumTransactions} completadas`}
                      />
                    </ListItem>
                  )}
                  {stageData.requirements.timeInCurrentStage && (
                    <ListItem>
                      <ListItemText 
                        primary="Tiempo Mínimo"
                        secondary={`${stageData.requirements.timeInCurrentStage} días`}
                      />
                    </ListItem>
                  )}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Stage inicial - Sin requisitos previos
                </Typography>
              )}
            </Paper>

            {/* Recompensas */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <TrophyIcon sx={{ mr: 1, color: 'warning.main' }} />
                Recompensas al Avanzar
              </Typography>
              
              {stageData.rewards.length > 0 ? (
                <List dense>
                  {stageData.rewards.map((reward, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText', width: 32, height: 32 }}>
                          {reward.type === 'UNITS' ? 'ü' : 
                           reward.type === 'MERITOS' ? '🏆' : 
                           reward.type === 'ONDAS' ? '🌊' : '💎'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`${reward.amount} ${reward.type}`}
                        secondary={reward.description}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Sin recompensas específicas
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadStagesData}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 🏛️ Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
          <TimelineIcon sx={{ mr: 2, color: 'primary.main' }} />
          Gestión de Stages - Customer Journey
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra la progresión BUYER → SEEKER → SOLVER → PROMOTER de tu comunidad CoomÜnity
        </Typography>
      </Box>

      {/* 📑 Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Vista General" />
          <Tab label="Detalle Stage" disabled={!selectedStage} />
          <Tab label="Configuración" />
        </Tabs>
      </Box>

      {/* 📋 Content */}
      {activeTab === 0 && renderOverviewTab()}
      {activeTab === 1 && renderStageDetailTab()}
      {activeTab === 2 && (
        <Alert severity="info">
          Configuración de stages - En desarrollo
        </Alert>
      )}
    </Box>
  );
};

export default StagesManagementPage;