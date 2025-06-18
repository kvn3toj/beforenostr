/**
 * 🎮 Experience Console - CoomÜnity Gamification Management
 * 
 * Consola principal para diseñar, configurar y gestionar experiencias gamificadas
 * Basada en el Customer Journey Map del tablero de Miro
 * 
 * Características:
 * - Gestión de 4 STAGES (BUYER → SEEKER → SOLVER → PROMOTER)
 * - Sistema de concursos semanales (Mëritos y Öndas)
 * - Framework Octalysis integrado
 * - Trust voting y "Coompetencia" management
 * - GPL (ÜPlay) content management
 * - Temporizadores y deadlines configurables
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Badge,
  Tooltip,
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
} from '@mui/icons-material';

// Types from Miro board analysis
interface UserStage {
  id: 'buyer' | 'seeker' | 'solver' | 'promoter';
  name: string;
  description: string;
  actions: StageAction[];
  requirements: StageRequirement[];
  rewards: StageReward[];
  timeframe: string;
  isActive: boolean;
  completionRate: number;
}

interface StageAction {
  id: string;
  name: string;
  description: string;
  type: 'onboarding' | 'scaffolding' | 'endgame' | 'discovery';
  isRequired: boolean;
  isCompleted: boolean;
  octalysisElements: OctalysisElement[];
  mentalTriggers: MentalTrigger[];
}

interface StageRequirement {
  id: string;
  type: 'meritos' | 'ondas' | 'trust_votes' | 'purchases' | 'time';
  value: number;
  description: string;
  isCompleted: boolean;
}

interface StageReward {
  id: string;
  type: 'lukas' | 'meritos' | 'ondas' | 'access' | 'perks';
  value: number;
  description: string;
}

interface OctalysisElement {
  id: string;
  type: 'epic' | 'accomplishment' | 'empowerment' | 'ownership' | 'social' | 'scarcity' | 'unpredictability' | 'avoidance';
  name: string;
  description: string;
  intensity: number; // 1-10
  isActive: boolean;
}

interface MentalTrigger {
  id: string;
  type: 'reciprocity' | 'scarcity' | 'authority' | 'social_proof' | 'anticipation' | 'surprise';
  name: string;
  description: string;
  isActive: boolean;
}

interface MeritContest {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: 'weekly' | 'monthly' | 'special';
  isActive: boolean;
  participants: number;
  totalPrize: number;
  rules: ContestRule[];
  leaderboard: LeaderboardEntry[];
}

interface ContestRule {
  id: string;
  description: string;
  meritMultiplier: number;
  isActive: boolean;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  position: number;
  meritos: number;
  ondas: number;
  isEligible: boolean;
}

interface TrustVotingSystem {
  id: string;
  isActive: boolean;
  coompetenciaFormula: CoompetenciaFormula;
  votingRules: VotingRule[];
  validationWorkflows: ValidationWorkflow[];
}

interface CoompetenciaFormula {
  ondasFactor: number; // 0.1
  purchasesFactor: number; // 0.3
  salesFactor: number; // 0.4
  meritosFactor: number; // 0.2
  childrenPurchasesFactor: number; // 0.15
}

interface VotingRule {
  id: string;
  fromStage: string;
  toStage: string;
  requiredCoompetencia: number;
  maxVotesPerWeek: number;
  voteWeight: number;
}

interface ValidationWorkflow {
  id: string;
  stageName: string;
  requiresPromoterApproval: boolean;
  minimumTrustVotes: number;
  timeoutDays: number;
}

interface GPLContentConfig {
  id: string;
  name: string;
  type: 'buyer' | 'seeker' | 'solver' | 'promoter' | 'frontier' | 'resonance';
  videos: GPLVideo[];
  questions: GPLQuestion[];
  unlockMechanism: UnlockMechanism;
  isActive: boolean;
}

interface GPLVideo {
  id: string;
  title: string;
  duration: number;
  category: string;
  philosophyAlignment: 'ayni' | 'bien_comun' | 'metanoia';
  activationTime?: Date;
  isEpicContent: boolean;
}

interface GPLQuestion {
  id: string;
  videoId: string;
  timestamp: number;
  type: 'attention' | 'profiling' | 'summary';
  question: string;
  options: string[];
  correctAnswer: string;
  reward: {
    meritos: number;
    ondas: number;
  };
  socialValidation: {
    totalAnswers: number;
    popularChoice: string;
    consensusPercentage: number;
  };
}

interface UnlockMechanism {
  id: string;
  type: 'rope' | 'meritos' | 'ondas' | 'time' | 'achievement';
  description: string;
  requiredValue: number;
  availableMinutes?: number;
}

const ExperienceConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStage, setSelectedStage] = useState<UserStage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentContest, setCurrentContest] = useState<MeritContest | null>(null);

  // Mock data based on Miro board
  const [stages, setStages] = useState<UserStage[]>([
    {
      id: 'buyer',
      name: 'BUYER - Consumidor Inicial',
      description: 'Usuario que recibe gift cards y experimenta los primeros intercambios',
      actions: [
        {
          id: 'invitation',
          name: 'Recibe mensaje de invitación',
          description: 'Primera interacción con CoomÜnity',
          type: 'discovery',
          isRequired: true,
          isCompleted: false,
          octalysisElements: [
            {
              id: 'epic1',
              type: 'epic',
              name: 'Llamado al viaje',
              description: 'Percibe como privilegio acceder a una alternativa',
              intensity: 8,
              isActive: true
            }
          ],
          mentalTriggers: [
            {
              id: 'curiosity1',
              type: 'anticipation',
              name: 'Curiosidad por descubrir',
              description: 'Querer saber qué viene después',
              isActive: true
            }
          ]
        },
        {
          id: 'app_install',
          name: 'Descarga e instalación del APP',
          description: 'Primer contacto directo con la plataforma',
          type: 'onboarding',
          isRequired: true,
          isCompleted: false,
          octalysisElements: [],
          mentalTriggers: []
        },
        {
          id: 'gift_activation',
          name: 'Activar Gift Card',
          description: 'Primera interacción con el sistema de Lükas',
          type: 'onboarding',
          isRequired: true,
          isCompleted: false,
          octalysisElements: [
            {
              id: 'ownership1',
              type: 'ownership',
              name: 'Primeras Lükas',
              description: 'Siente poseer algo valioso',
              intensity: 6,
              isActive: true
            }
          ],
          mentalTriggers: [
            {
              id: 'reciprocity1',
              type: 'reciprocity',
              name: 'Regalo recibido',
              description: 'Principio de reciprocidad activado',
              isActive: true
            }
          ]
        }
      ],
      requirements: [
        {
          id: 'complete_giftcard',
          type: 'time',
          value: 7,
          description: 'Completar experiencia en 7 días',
          isCompleted: false
        }
      ],
      rewards: [
        {
          id: 'first_lukas',
          type: 'lukas',
          value: 50,
          description: '50 Lükas de bienvenida'
        }
      ],
      timeframe: 'Lunes 12M - Jueves 11:59PM',
      isActive: true,
      completionRate: 73
    },
    {
      id: 'seeker',
      name: 'SEEKER - Buscador de Oportunidades',
      description: 'Usuario que explora el marketplace y busca crear valor',
      actions: [],
      requirements: [
        {
          id: 'trust_vote_request',
          type: 'trust_votes',
          value: 1,
          description: 'Pedir voto de confianza al Promoter',
          isCompleted: false
        }
      ],
      rewards: [],
      timeframe: 'Proceso continuo hasta validación',
      isActive: true,
      completionRate: 45
    },
    {
      id: 'solver',
      name: 'SOLVER - Solucionador/Emprendedor',
      description: 'Usuario que ofrece productos y servicios en el marketplace',
      actions: [],
      requirements: [
        {
          id: 'promoter_validation',
          type: 'trust_votes',
          value: 3,
          description: 'Validación por parte de Promoter',
          isCompleted: false
        }
      ],
      rewards: [
        {
          id: 'marketplace_access',
          type: 'access',
          value: 1,
          description: 'Acceso completo al marketplace'
        }
      ],
      timeframe: 'Semanal con deadlines específicos',
      isActive: true,
      completionRate: 62
    },
    {
      id: 'promoter',
      name: 'PROMOTER - Promotor de la Comunidad',
      description: 'Usuario que invita y valida nuevos miembros',
      actions: [],
      requirements: [
        {
          id: 'top_performance',
          type: 'meritos',
          value: 1000,
          description: 'Estar en TOP 20% semanal',
          isCompleted: false
        }
      ],
      rewards: [
        {
          id: 'cashback',
          type: 'perks',
          value: 1,
          description: 'Acceso a sistema CashBack'
        }
      ],
      timeframe: 'Continuo con beneficios acumulativos',
      isActive: true,
      completionRate: 28
    }
  ]);

  const [meritContests, setMeritContests] = useState<MeritContest[]>([
    {
      id: 'weekly_meritos_1',
      name: 'Concurso Semanal de Mëritos #47',
      startDate: new Date('2025-06-16'),
      endDate: new Date('2025-06-22T23:59:59'),
      type: 'weekly',
      isActive: true,
      participants: 247,
      totalPrize: 500,
      rules: [
        {
          id: 'resonance_focus',
          description: 'Enfoque en resonancia del producto/servicio',
          meritMultiplier: 1.5,
          isActive: true
        },
        {
          id: 'collaboration_bonus',
          description: 'Bonus por colaboraciones en duplas',
          meritMultiplier: 1.2,
          isActive: true
        }
      ],
      leaderboard: [
        {
          userId: '1',
          userName: 'Ana Valdez',
          position: 1,
          meritos: 245,
          ondas: 89,
          isEligible: true
        },
        {
          userId: '2',
          userName: 'Carlos Mendoza',
          position: 2,
          meritos: 232,
          ondas: 76,
          isEligible: true
        },
        {
          userId: '3',
          userName: 'María Torres',
          position: 3,
          meritos: 198,
          ondas: 92,
          isEligible: true
        }
      ]
    }
  ]);

  const [trustVoting, setTrustVoting] = useState<TrustVotingSystem>({
    id: 'main_trust_system',
    isActive: true,
    coompetenciaFormula: {
      ondasFactor: 0.1,
      purchasesFactor: 0.3,
      salesFactor: 0.4,
      meritosFactor: 0.2,
      childrenPurchasesFactor: 0.15
    },
    votingRules: [
      {
        id: 'seeker_to_solver',
        fromStage: 'promoter',
        toStage: 'solver',
        requiredCoompetencia: 100,
        maxVotesPerWeek: 5,
        voteWeight: 1.0
      }
    ],
    validationWorkflows: [
      {
        id: 'solver_validation',
        stageName: 'SOLVER',
        requiresPromoterApproval: true,
        minimumTrustVotes: 3,
        timeoutDays: 7
      }
    ]
  });

  const [gplContent, setGplContent] = useState<GPLContentConfig[]>([
    {
      id: 'gpl_buyer',
      name: 'GPL BUYER - Consumo Consciente',
      type: 'buyer',
      videos: [
        {
          id: 'intro_coomunity',
          title: 'Introducción a CoomÜnity',
          duration: 240,
          category: 'Fundamentos',
          philosophyAlignment: 'ayni',
          isEpicContent: false
        },
        {
          id: 'ayni_reciprocity',
          title: 'Ayni: El Arte de la Reciprocidad',
          duration: 320,
          category: 'Filosofía',
          philosophyAlignment: 'ayni',
          isEpicContent: true
        }
      ],
      questions: [
        {
          id: 'q1_buyer',
          videoId: 'intro_coomunity',
          timestamp: 60,
          type: 'attention',
          question: '¿El Ayni representa reciprocidad equilibrada?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 'Verdadero',
          reward: { meritos: 15, ondas: 7 },
          socialValidation: {
            totalAnswers: 1247,
            popularChoice: 'Verdadero',
            consensusPercentage: 89
          }
        }
      ],
      unlockMechanism: {
        id: 'gift_card_mechanism',
        type: 'achievement',
        description: 'Activar Gift Card',
        requiredValue: 1
      },
      isActive: true
    },
    {
      id: 'gpl_frontier',
      name: 'GPL 2 - La Frontera de lo Establecido',
      type: 'frontier',
      videos: [
        {
          id: 'empire_evil',
          title: 'Imperio del Mal - Contenido Épico',
          duration: 1800,
          category: 'Crítica Social',
          philosophyAlignment: 'metanoia',
          activationTime: new Date('2025-06-20T19:00:00'),
          isEpicContent: true
        }
      ],
      questions: [],
      unlockMechanism: {
        id: 'timed_activation',
        type: 'time',
        description: 'Se activa en tiempos específicos',
        requiredValue: 1
      },
      isActive: false
    }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStageSelect = (stage: UserStage) => {
    setSelectedStage(stage);
    setDialogOpen(true);
  };

  const handleContestAction = (contestId: string, action: 'start' | 'pause' | 'end') => {
    setMeritContests(prev => 
      prev.map(contest => 
        contest.id === contestId 
          ? { ...contest, isActive: action === 'start' }
          : contest
      )
    );
  };

  const renderStageOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          🎭 Customer Journey - Stages Overview
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Gestiona los 4 stages del customer journey basado en el framework del tablero de Miro
        </Typography>
      </Grid>
      
      {stages.map((stage) => (
        <Grid item xs={12} md={6} lg={3} key={stage.id}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleStageSelect(stage)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: stage.isActive ? 'primary.main' : 'grey.400',
                  mr: 2 
                }}>
                  {stage.id === 'buyer' && <GroupIcon />}
                  {stage.id === 'seeker' && <TrendingUpIcon />}
                  {stage.id === 'solver' && <StarIcon />}
                  {stage.id === 'promoter' && <TrophyIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6">{stage.name}</Typography>
                  <Chip 
                    label={stage.isActive ? 'Activo' : 'Inactivo'} 
                    color={stage.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Typography variant="body2" color="textSecondary" paragraph>
                {stage.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Completación: {stage.completionRate}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stage.completionRate} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  {stage.timeframe}
                </Typography>
                <Button size="small" startIcon={<EditIcon />}>
                  Configurar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderMeritContests = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            🏆 Concursos de Mëritos y Öndas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Crear Concurso
          </Button>
        </Box>
      </Grid>

      {meritContests.map((contest) => (
        <Grid item xs={12} key={contest.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6">{contest.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {contest.startDate.toLocaleDateString()} - {contest.endDate.toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={contest.isActive ? 'Activo' : 'Pausado'}
                    color={contest.isActive ? 'success' : 'warning'}
                  />
                  <Badge badgeContent={contest.participants} color="primary">
                    <GroupIcon />
                  </Badge>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Premio Total</Typography>
                  <Typography variant="h4" color="primary.main">
                    {contest.totalPrize} Lükas
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Participantes</Typography>
                  <Typography variant="h4">
                    {contest.participants}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Tiempo Restante</Typography>
                  <Typography variant="h4" color="error.main">
                    {Math.ceil((contest.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
                  </Typography>
                </Grid>
              </Grid>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">🥇 Leaderboard (TOP 3)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {contest.leaderboard.slice(0, 3).map((entry) => (
                      <ListItem key={entry.userId}>
                        <ListItemIcon>
                          <Avatar sx={{ 
                            bgcolor: entry.position === 1 ? 'gold' : 
                                   entry.position === 2 ? 'silver' : 
                                   entry.position === 3 ? '#CD7F32' : 'grey.400'
                          }}>
                            {entry.position}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={entry.userName}
                          secondary={`${entry.meritos} Mëritos • ${entry.ondas} Öndas`}
                        />
                        <ListItemSecondaryAction>
                          {entry.isEligible && <CheckIcon color="success" />}
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant={contest.isActive ? "outlined" : "contained"}
                  color={contest.isActive ? "error" : "success"}
                  startIcon={contest.isActive ? <PauseIcon /> : <PlayIcon />}
                  onClick={() => handleContestAction(contest.id, contest.isActive ? 'pause' : 'start')}
                >
                  {contest.isActive ? 'Pausar' : 'Activar'}
                </Button>
                <Button variant="outlined" startIcon={<ViewIcon />}>
                  Ver Detalles
                </Button>
                <Button variant="outlined" startIcon={<AssessmentIcon />}>
                  Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTrustVoting = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          🤝 Sistema de Votos de Confianza
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Gestiona el sistema de "Coompetencia" y validación entre stages
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Fórmula de Coompetencia
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Coompetencia = (Öndas × 0.1) + (Compras × 0.3) + (Ventas × 0.4) + (Mëritos × 0.2) + (Compras hijos × 0.15)
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Factor Öndas"
                  secondary={`${trustVoting.coompetenciaFormula.ondasFactor} - Energía vibracional`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Factor Compras Propias"
                  secondary={`${trustVoting.coompetenciaFormula.purchasesFactor} - Consumo responsable`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Factor Ventas"
                  secondary={`${trustVoting.coompetenciaFormula.salesFactor} - Generación de valor`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Factor Mëritos"
                  secondary={`${trustVoting.coompetenciaFormula.meritosFactor} - Contribución al Bien Común`}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚖️ Reglas de Votación
            </Typography>
            
            {trustVoting.votingRules.map((rule) => (
              <Box key={rule.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  {rule.fromStage.toUpperCase()} → {rule.toStage.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Coompetencia mínima: {rule.requiredCoompetencia}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Máximo {rule.maxVotesPerWeek} votos/semana
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Peso del voto: {rule.voteWeight}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔄 Workflows de Validación
            </Typography>
            
            {trustVoting.validationWorkflows.map((workflow) => (
              <Accordion key={workflow.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    Validación para {workflow.stageName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={workflow.requiresPromoterApproval}
                            disabled
                          />
                        }
                        label="Requiere aprobación de Promoter"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        Votos de confianza mínimos: <strong>{workflow.minimumTrustVotes}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        Timeout: <strong>{workflow.timeoutDays} días</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderGPLManagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          🎬 GPL (Gamified Play List) Management
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Administra el contenido dinámico de ÜPlay y los mecanismos de desbloqueo
        </Typography>
      </Grid>

      {gplContent.map((content) => (
        <Grid item xs={12} key={content.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6">{content.name}</Typography>
                  <Chip 
                    label={content.type.toUpperCase()}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={content.isActive ? 'Activo' : 'Inactivo'}
                    color={content.isActive ? 'success' : 'default'}
                  />
                </Box>
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    📹 Videos ({content.videos.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {content.videos.map((video) => (
                      <ListItem key={video.id}>
                        <ListItemText
                          primary={video.title}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                Duración: {Math.floor(video.duration / 60)}m {video.duration % 60}s
                              </Typography>
                              <Typography variant="caption" display="block">
                                Filosofía: {video.philosophyAlignment}
                              </Typography>
                              {video.isEpicContent && (
                                <Chip label="Contenido Épico" size="small" color="secondary" />
                              )}
                              {video.activationTime && (
                                <Chip 
                                  label={`Activo: ${video.activationTime.toLocaleString()}`}
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
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    ❓ Preguntas Gamificadas ({content.questions.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {content.questions.map((question) => (
                    <Box key={question.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {question.question}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Tipo: {question.type} • Timestamp: {question.timestamp}s
                      </Typography>
                      <Typography variant="body2" color="primary.main">
                        Reward: {question.reward.meritos} Mëritos + {question.reward.ondas} Öndas
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Consenso comunitario: {question.socialValidation.consensusPercentage}% 
                        ({question.socialValidation.totalAnswers} respuestas)
                      </Typography>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🔓 Mecanismo de Desbloqueo
                </Typography>
                <Typography variant="body2">
                  <strong>{content.unlockMechanism.type}:</strong> {content.unlockMechanism.description}
                </Typography>
                {content.unlockMechanism.availableMinutes && (
                  <Typography variant="body2" color="warning.main">
                    Minutos disponibles: {content.unlockMechanism.availableMinutes}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderOctalysisConfig = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          🎯 Framework Octalysis Configuration
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Configura los 8 elementos del framework Octalysis aplicados al customer journey
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            El framework Octalysis está implementado al <strong>95%</strong> según el análisis del tablero de Miro.
            Los elementos faltantes son principalmente mecánicas de END GAME para retención de veteranos.
          </Typography>
        </Alert>
      </Grid>

      {/* Octalysis elements implementation would go here */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🚧 Implementación en Progreso
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Los elementos específicos del framework Octalysis se configurarán en la siguiente iteración,
              integrando con las mecánicas existentes de Mëritos, Öndas, y sistema de stages.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          📊 Analytics & Performance
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Métricas en tiempo real del sistema de gamificación
        </Typography>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Usuarios Activos (Semanal)
            </Typography>
            <Typography variant="h4" component="div">
              1,247
            </Typography>
            <Typography variant="body2" color="success.main">
              +12% vs semana anterior
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Progresión SEEKER → SOLVER
            </Typography>
            <Typography variant="h4" component="div">
              68%
            </Typography>
            <Typography variant="body2" color="warning.main">
              Meta: 75%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Engagement GPL (ÜPlay)
            </Typography>
            <Typography variant="h4" component="div">
              84%
            </Typography>
            <Typography variant="body2" color="success.main">
              Superando expectativas
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Trust Votes (Esta Semana)
            </Typography>
            <Typography variant="h4" component="div">
              89
            </Typography>
            <Typography variant="body2" color="info.main">
              Promedio: 12.7/día
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', px: 3, py: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🎮 Consola de Experiencias CoomÜnity
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Centro de control para el diseño y gestión de experiencias gamificadas
        </Typography>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 2 }}>
          <Tab icon={<TimelineIcon />} label="Customer Journey" />
          <Tab icon={<TrophyIcon />} label="Concursos" />
          <Tab icon={<VoteIcon />} label="Trust Voting" />
          <Tab icon={<PlayIcon />} label="GPL Management" />
          <Tab icon={<StarIcon />} label="Octalysis" />
          <Tab icon={<AssessmentIcon />} label="Analytics" />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {activeTab === 0 && renderStageOverview()}
        {activeTab === 1 && renderMeritContests()}
        {activeTab === 2 && renderTrustVoting()}
        {activeTab === 3 && renderGPLManagement()}
        {activeTab === 4 && renderOctalysisConfig()}
        {activeTab === 5 && renderAnalytics()}
      </Box>

      {/* Stage Configuration Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configurar Stage: {selectedStage?.name}
        </DialogTitle>
        <DialogContent>
          {selectedStage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" paragraph>
                {selectedStage.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Acciones del Stage
              </Typography>
              <List>
                {selectedStage.actions.map((action) => (
                  <ListItem key={action.id}>
                    <ListItemIcon>
                      {action.isCompleted ? <CheckIcon color="success" /> : <InfoIcon color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={action.name}
                      secondary={action.description}
                    />
                    <Chip
                      label={action.type}
                      variant="outlined"
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Editar Configuración
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExperienceConsole;