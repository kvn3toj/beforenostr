import React, { useState, useEffect } from 'react';
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
  StepIcon,
  Button,
  Chip,
  Avatar,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ShoppingCart as BuyerIcon,
  Search as SeekerIcon,
  Bolt as SolverIcon,
  Star as PromoterIcon,
  CheckCircle,
  TrendingUp,
  EmojiEvents,
  AccessTime,
  ArrowForward,
  Lightbulb,
  Group,
  Diamond,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';

// Importar apiService para conectar con backend
import { apiService } from '../../../services/api.service';

// 🎭 Types del Sistema de Stages
type CustomerJourneyStage = 'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER';

interface StageData {
  id: CustomerJourneyStage;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  requirements: {
    minimumMeritos?: number;
    minimumOndas?: number;
    minimumTransactions?: number;
    timeInCurrentStage?: number;
  };
  nextStage: CustomerJourneyStage | null;
  activities: string[];
  rewards: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  progress: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
}

interface UserStageProgression {
  currentStage: CustomerJourneyStage;
  currentStageProgress: number;
  timeInCurrentStage: number;
  totalMeritos: number;
  totalOndas: number;
  totalTransactions: number;
  canAdvance: boolean;
  nextStageRequirements: {
    meritos: number;
    ondas: number;
    transactions: number;
    timeRequired: number;
  };
}

interface CustomerJourneyVisualizationProps {
  compact?: boolean;
  showDetails?: boolean;
  onStageSelect?: (stage: CustomerJourneyStage) => void;
}

// 🎨 Configuración de Stages
const STAGE_CONFIG: Record<CustomerJourneyStage, Omit<StageData, 'progress' | 'isUnlocked' | 'isCurrent' | 'isCompleted'>> = {
  BUYER: {
    id: 'BUYER',
    name: 'Buyer',
    description: 'Explorando el ecosistema',
    icon: BuyerIcon,
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    requirements: {
      minimumMeritos: 0,
      minimumOndas: 0,
      minimumTransactions: 0,
      timeInCurrentStage: 0,
    },
    nextStage: 'SEEKER',
    activities: [
      'Explorar marketplace',
      'Realizar primera compra',
      'Calificar transacciones',
      'Completar perfil'
    ],
    rewards: [
      { type: 'UNITS', amount: 100, description: 'Bono de bienvenida' },
      { type: 'ONDAS', amount: 50, description: 'Energía inicial' }
    ]
  },
  SEEKER: {
    id: 'SEEKER',
    name: 'Seeker',
    description: 'Buscando conocimiento y conexiones',
    icon: SeekerIcon,
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    requirements: {
      minimumMeritos: 100,
      minimumOndas: 200,
      minimumTransactions: 3,
      timeInCurrentStage: 7, // días
    },
    nextStage: 'SOLVER',
    activities: [
      'Participar en ÜPlay',
      'Conectar con comunidad',
      'Asistir a eventos',
      'Participar en trust voting'
    ],
    rewards: [
      { type: 'MERITOS', amount: 150, description: 'Reconocimiento comunitario' },
      { type: 'ONDAS', amount: 100, description: 'Energía de conexión' }
    ]
  },
  SOLVER: {
    id: 'SOLVER',
    name: 'Solver',
    description: 'Solucionando y contribuyendo',
    icon: SolverIcon,
    color: '#45B7D1',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)',
    requirements: {
      minimumMeritos: 300,
      minimumOndas: 500,
      minimumTransactions: 10,
      timeInCurrentStage: 14, // días
    },
    nextStage: 'PROMOTER',
    activities: [
      'Crear ofertas en marketplace',
      'Realizar primera venta',
      'Mentorear a Seekers',
      'Liderar iniciativas'
    ],
    rewards: [
      { type: 'MERITOS', amount: 250, description: 'Méritos de solución' },
      { type: 'UNITS', amount: 500, description: 'Recompensa económica' }
    ]
  },
  PROMOTER: {
    id: 'PROMOTER',
    name: 'Promoter',
    description: 'Liderando la transformación',
    icon: PromoterIcon,
    color: '#96CEB4',
    gradient: 'linear-gradient(135deg, #96CEB4 0%, #FFECD2 100%)',
    requirements: {
      minimumMeritos: 750,
      minimumOndas: 1000,
      minimumTransactions: 25,
      timeInCurrentStage: 30, // días
    },
    nextStage: null,
    activities: [
      'Organizar eventos comunitarios',
      'Invitar nuevos miembros',
      'Validar emprendedores',
      'Expandir ecosistema'
    ],
    rewards: [
      { type: 'MERITOS', amount: 500, description: 'Méritos de liderazgo' },
      { type: 'ONDAS', amount: 300, description: 'Energía de transformación' }
    ]
  }
};

// Hook para obtener progresión del usuario (mock - conectar con backend)
const useStageProgression = (): { data: UserStageProgression | null; loading: boolean; error: string | null } => {
  const { user } = useAuth();
  const [data, setData] = useState<UserStageProgression | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStageProgression = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.id) {
          throw new Error('Usuario no autenticado');
        }

        // 🔗 Conexión real con backend - Endpoint de stages para usuarios
        const response = await apiService.get<any>(`/console/stages/me/progression`);

        // Mapear respuesta del backend a nuestro tipo local
        const progression: UserStageProgression = {
          currentStage: response.currentStage || 'BUYER',
          currentStageProgress: response.currentProgress?.percentage || 0,
          timeInCurrentStage: response.timeInCurrentStage || 0,
          totalMeritos: response.currentProgress?.meritos || 0,
          totalOndas: response.currentProgress?.ondas || 0,
          totalTransactions: response.currentProgress?.transactions || 0,
          canAdvance: response.canProgress || false,
          nextStageRequirements: {
            meritos: response.nextStageRequirements?.minimumMeritos || 100,
            ondas: response.nextStageRequirements?.minimumOndas || 200,
            transactions: response.nextStageRequirements?.minimumTransactions || 3,
            timeRequired: response.nextStageRequirements?.timeInCurrentStage || 7
          }
        };

        setData(progression);
      } catch (err: any) {
        console.warn('🔄 Backend no disponible para stages, usando datos mock:', err.message);

        // Fallback a datos mock si el backend no está disponible
        const mockData: UserStageProgression = {
          currentStage: 'BUYER',
          currentStageProgress: 45,
          timeInCurrentStage: 3,
          totalMeritos: 50,
          totalOndas: 120,
          totalTransactions: 1,
          canAdvance: false,
          nextStageRequirements: {
            meritos: 100,
            ondas: 200,
            transactions: 3,
            timeRequired: 7
          }
        };

        setData(mockData);
        setError(null); // No mostrar error al usuario en modo fallback
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStageProgression();
    } else {
      setLoading(false);
    }
  }, [user]);

  return { data, loading, error };
};

// Componente de Step Icon personalizado
const CustomStepIcon: React.FC<{ stage: StageData; active: boolean; completed: boolean }> = ({
  stage,
  active,
  completed
}) => {
  const IconComponent = stage.icon;

  return (
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: completed
          ? stage.gradient
          : active
            ? alpha(stage.color, 0.2)
            : alpha('#000', 0.1),
        border: active ? `3px solid ${stage.color}` : '2px solid transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: `0 4px 20px ${alpha(stage.color, 0.3)}`
        }
      }}
    >
      <IconComponent
        sx={{
          fontSize: 24,
          color: completed || active ? '#fff' : alpha('#000', 0.4)
        }}
      />
    </Box>
  );
};

// Componente de Card de Stage
const StageCard: React.FC<{
  stage: StageData;
  userProgression: UserStageProgression;
  onSelect?: () => void;
}> = ({ stage, userProgression, onSelect }) => {
  const theme = useTheme();
  const isCurrentStage = userProgression.currentStage === stage.id;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <Card
        sx={{
          height: '100%',
          background: isCurrentStage ? stage.gradient : '#fff',
          color: isCurrentStage ? '#fff' : 'inherit',
          border: isCurrentStage ? `2px solid ${stage.color}` : '1px solid #e0e0e0',
          cursor: onSelect ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 8px 32px ${alpha(stage.color, 0.3)}`
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CustomStepIcon
              stage={stage}
              active={isCurrentStage}
              completed={stage.isCompleted}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {stage.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {stage.description}
              </Typography>
            </Box>
          </Box>

          {isCurrentStage && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                Progreso: {userProgression.currentStageProgress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={userProgression.currentStageProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#fff', 0.3),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#fff',
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Actividades Principales:
          </Typography>
          <List dense>
            {stage.activities.slice(0, 3).map((activity, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <CheckCircle sx={{ fontSize: 16, opacity: 0.7 }} />
                </ListItemIcon>
                <ListItemText
                  primary={activity}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { opacity: 0.9 }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const CustomerJourneyVisualization: React.FC<CustomerJourneyVisualizationProps> = ({
  compact = false,
  showDetails = true,
  onStageSelect
}) => {
  const theme = useTheme();
  const { data: userProgression, loading, error } = useStageProgression();
  const [selectedStage, setSelectedStage] = useState<CustomerJourneyStage | null>(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error cargando progresión: {error}
      </Alert>
    );
  }

  if (!userProgression) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No se encontró información de progresión
      </Alert>
    );
  }

  // Preparar datos de stages con estado del usuario
  const stagesWithProgress: StageData[] = Object.values(STAGE_CONFIG).map(stage => ({
    ...stage,
    progress: stage.id === userProgression.currentStage ? userProgression.currentStageProgress : 0,
    isUnlocked: true, // Determinar lógica real
    isCurrent: stage.id === userProgression.currentStage,
    isCompleted: false // Determinar lógica real
  }));

  const currentStageIndex = stagesWithProgress.findIndex(s => s.isCurrent);

  const handleStageSelect = (stage: CustomerJourneyStage) => {
    setSelectedStage(stage);
    onStageSelect?.(stage);
  };

  if (compact) {
    // Vista compacta para widgets
    return (
      <Paper sx={{ p: 2, background: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>
          🎯 Tu Viaje en CoomÜnity
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {stagesWithProgress.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <Tooltip title={`${stage.name}: ${stage.description}`}>
                <Box sx={{ position: 'relative' }}>
                  <CustomStepIcon
                    stage={stage}
                    active={stage.isCurrent}
                    completed={stage.isCompleted}
                  />
                  {stage.isCurrent && (
                    <Chip
                      label={`${userProgression.currentStageProgress}%`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: -8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: stage.gradient,
                        color: '#fff',
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
              {index < stagesWithProgress.length - 1 && (
                <ArrowForward sx={{ mx: 1, color: stage.color, opacity: 0.6 }} />
              )}
            </React.Fragment>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Progreso actual: <strong>{userProgression.currentStage}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userProgression.timeInCurrentStage} días en esta etapa
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Vista completa
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🌟 Tu Viaje de Transformación en CoomÜnity
      </Typography>

      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Progresa a través de los stages del customer journey y desbloquea nuevas capacidades
      </Typography>

      {/* Stepper Principal */}
      <Box sx={{ mb: 4 }}>
        <Stepper
          activeStep={currentStageIndex}
          orientation="horizontal"
          sx={{ mb: 3 }}
        >
          {stagesWithProgress.map((stage, index) => (
            <Step key={stage.id}>
              <StepLabel
                icon={
                  <CustomStepIcon
                    stage={stage}
                    active={stage.isCurrent}
                    completed={stage.isCompleted}
                  />
                }
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {stage.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stage.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Grid de Cards de Stages */}
      {showDetails && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stagesWithProgress.map((stage) => (
            <Grid item xs={12} sm={6} md={3} key={stage.id}>
              <StageCard
                stage={stage}
                userProgression={userProgression}
                onSelect={() => handleStageSelect(stage.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Panel de Progreso Actual */}
      <Paper sx={{ p: 3, background: STAGE_CONFIG[userProgression.currentStage].gradient, color: '#fff' }}>
        <Typography variant="h6" gutterBottom>
          📍 Stage Actual: {STAGE_CONFIG[userProgression.currentStage].name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Progreso en este Stage:
            </Typography>
            <LinearProgress
              variant="determinate"
              value={userProgression.currentStageProgress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: alpha('#fff', 0.3),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#fff',
                  borderRadius: 6
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              {userProgression.currentStageProgress}% completado
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tiempo en Stage: {userProgression.timeInCurrentStage} días
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Méritos: {userProgression.totalMeritos} | Öndas: {userProgression.totalOndas}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Transacciones: {userProgression.totalTransactions}
            </Typography>
          </Grid>
        </Grid>

        {!userProgression.canAdvance && userProgression.nextStageRequirements && (
          <Box sx={{ mt: 3, p: 2, background: alpha('#fff', 0.1), borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Requisitos para avanzar al siguiente stage:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${userProgression.nextStageRequirements.meritos} Méritos`}
                size="small"
                sx={{ background: alpha('#fff', 0.2), color: '#fff' }}
              />
              <Chip
                label={`${userProgression.nextStageRequirements.ondas} Öndas`}
                size="small"
                sx={{ background: alpha('#fff', 0.2), color: '#fff' }}
              />
              <Chip
                label={`${userProgression.nextStageRequirements.transactions} Transacciones`}
                size="small"
                sx={{ background: alpha('#fff', 0.2), color: '#fff' }}
              />
              <Chip
                label={`${userProgression.nextStageRequirements.timeRequired} días`}
                size="small"
                sx={{ background: alpha('#fff', 0.2), color: '#fff' }}
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CustomerJourneyVisualization;
