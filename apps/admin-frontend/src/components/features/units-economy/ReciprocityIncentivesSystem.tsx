/**
 * 🔄 Reciprocity Incentives System - CoomÜnity Economia Sagrada
 * 
 * 🎯 INTENT: Automatizar incentivos de reciprocidad y community bonus para fortalecer el ecosistema de templates
 * 🌟 VALUES: Ayni (reciprocidad), Bien Común (community bonus), Negentropía (ciclos virtuosos)
 * ⚡ CONSTRAINTS: NEWVISUAL patterns, automated triggers, transparent tracking
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Divider,
  Tab,
  Tabs,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Favorite as ReciprocityIcon,
  TrendingUp as BonusIcon,
  Group as CommunityIcon,
  MonetizationOn as UnitsIcon,
  EmojiEvents as RewardIcon,
  Timeline as CycleIcon,
  Share as ShareIcon,
  Sync as AutoIcon,
  Star as StarIcon,
  AccountBalance as VaultIcon,
  Analytics as AnalyticsIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  TrendingDown as DeclineIcon,
} from '@mui/icons-material';

// Types
interface ReciprocityEvent {
  id: string;
  type: 'template_used' | 'collaboration_started' | 'remix_created' | 'knowledge_shared' | 'community_help';
  templateId: string;
  templateTitle: string;
  originalCreatorId: string;
  originalCreatorName: string;
  beneficiaryId: string;
  beneficiaryName: string;
  unitsGenerated: number;
  collaborationMultiplier: number;
  timestamp: string;
  status: 'pending' | 'processed' | 'distributed';
  triggerDetails: {
    projectSize: number;
    collaboratorCount: number;
    impactLevel: 'low' | 'medium' | 'high';
    communityReach: number;
  };
}

interface CommunityBonus {
  id: string;
  templateId: string;
  templateTitle: string;
  creatorId: string;
  creatorName: string;
  bonusType: 'quality_milestone' | 'collaboration_boost' | 'knowledge_transfer' | 'community_choice';
  bonusAmount: number;
  criteria: {
    qualityScore: number;
    usageCount: number;
    collaborationIndex: number;
    helpfulness: number;
  };
  achievedAt: string;
  distributedAt?: string;
  status: 'earned' | 'distributed';
}

interface IncentiveMetrics {
  totalReciprocityGenerated: number;
  totalBonusDistributed: number;
  activeIncentiveCycles: number;
  reciprocityParticipants: number;
  averageMultiplier: number;
  topPerformingTemplate: string;
  communityGrowthRate: number;
  virtouseCycleIndex: number;
}

interface ReciprocityIncentivesSystemProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId?: string;
  templateId?: string;
}

const ReciprocityIncentivesSystem: React.FC<ReciprocityIncentivesSystemProps> = ({
  isOpen,
  onClose,
  creatorId,
  templateId
}) => {
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [reciprocityEvents, setReciprocityEvents] = useState<ReciprocityEvent[]>([]);
  const [communityBonuses, setCommunityBonuses] = useState<CommunityBonus[]>([]);
  const [metrics, setMetrics] = useState<IncentiveMetrics | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ReciprocityEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoIncentivesEnabled, setAutoIncentivesEnabled] = useState(true);

  // Mock data for demonstration
  const mockReciprocityEvents: ReciprocityEvent[] = [
    {
      id: 'rec-001',
      type: 'template_used',
      templateId: 'template-ayni-circle',
      templateTitle: 'Círculo de Ayni - Reciprocidad Comunitaria',
      originalCreatorId: 'creator-amaru',
      originalCreatorName: 'Amaru Condori',
      beneficiaryId: 'user-maria',
      beneficiaryName: 'María González',
      unitsGenerated: 25,
      collaborationMultiplier: 1.5,
      timestamp: '2024-01-25T16:30:00Z',
      status: 'distributed',
      triggerDetails: {
        projectSize: 8,
        collaboratorCount: 4,
        impactLevel: 'high',
        communityReach: 156
      }
    },
    {
      id: 'rec-002',
      type: 'collaboration_started',
      templateId: 'template-minga-learning',
      templateTitle: 'Minga Digital - Aprendizaje Colaborativo',
      originalCreatorId: 'creator-inti',
      originalCreatorName: 'Inti Raymi',
      beneficiaryId: 'team-coomunity',
      beneficiaryName: 'Equipo CoomÜnity Learning',
      unitsGenerated: 45,
      collaborationMultiplier: 2.0,
      timestamp: '2024-01-24T14:15:00Z',
      status: 'processed',
      triggerDetails: {
        projectSize: 12,
        collaboratorCount: 8,
        impactLevel: 'high',
        communityReach: 234
      }
    },
    {
      id: 'rec-003',
      type: 'remix_created',
      templateId: 'template-ayni-circle',
      templateTitle: 'Círculo de Ayni - Reciprocidad Comunitaria',
      originalCreatorId: 'creator-amaru',
      originalCreatorName: 'Amaru Condori',
      beneficiaryId: 'creator-kira',
      beneficiaryName: 'Kira Innovations',
      unitsGenerated: 18,
      collaborationMultiplier: 1.3,
      timestamp: '2024-01-23T11:45:00Z',
      status: 'distributed',
      triggerDetails: {
        projectSize: 5,
        collaboratorCount: 3,
        impactLevel: 'medium',
        communityReach: 89
      }
    }
  ];

  const mockCommunityBonuses: CommunityBonus[] = [
    {
      id: 'bonus-001',
      templateId: 'template-ayni-circle',
      templateTitle: 'Círculo de Ayni - Reciprocidad Comunitaria',
      creatorId: 'creator-amaru',
      creatorName: 'Amaru Condori',
      bonusType: 'quality_milestone',
      bonusAmount: 100,
      criteria: {
        qualityScore: 96,
        usageCount: 189,
        collaborationIndex: 94,
        helpfulness: 267
      },
      achievedAt: '2024-01-20T12:00:00Z',
      distributedAt: '2024-01-20T12:30:00Z',
      status: 'distributed'
    },
    {
      id: 'bonus-002',
      templateId: 'template-minga-learning',
      templateTitle: 'Minga Digital - Aprendizaje Colaborativo',
      creatorId: 'creator-inti',
      creatorName: 'Inti Raymi',
      bonusType: 'collaboration_boost',
      bonusAmount: 75,
      criteria: {
        qualityScore: 89,
        usageCount: 245,
        collaborationIndex: 93,
        helpfulness: 198
      },
      achievedAt: '2024-01-18T16:45:00Z',
      status: 'earned'
    }
  ];

  const mockMetrics: IncentiveMetrics = {
    totalReciprocityGenerated: 1847,
    totalBonusDistributed: 685,
    activeIncentiveCycles: 23,
    reciprocityParticipants: 156,
    averageMultiplier: 1.6,
    topPerformingTemplate: 'Círculo de Ayni',
    communityGrowthRate: 23.4,
    virtouseCycleIndex: 89
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      loadIncentiveData();
    }
  }, [isOpen, creatorId, templateId]);

  // Handlers
  const loadIncentiveData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredEvents = mockReciprocityEvents;
      let filteredBonuses = mockCommunityBonuses;
      
      if (creatorId) {
        filteredEvents = mockReciprocityEvents.filter(event => 
          event.originalCreatorId === creatorId || event.beneficiaryId === creatorId
        );
        filteredBonuses = mockCommunityBonuses.filter(bonus => bonus.creatorId === creatorId);
      }
      
      if (templateId) {
        filteredEvents = mockReciprocityEvents.filter(event => event.templateId === templateId);
        filteredBonuses = mockCommunityBonuses.filter(bonus => bonus.templateId === templateId);
      }
      
      setReciprocityEvents(filteredEvents);
      setCommunityBonuses(filteredBonuses);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading incentive data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeIcon = (type: ReciprocityEvent['type']) => {
    switch (type) {
      case 'template_used': return <ShareIcon sx={{ color: '#3E8638' }} />;
      case 'collaboration_started': return <CommunityIcon sx={{ color: '#5C2483' }} />;
      case 'remix_created': return <StarIcon sx={{ color: '#FBBA00' }} />;
      case 'knowledge_shared': return <AnalyticsIcon sx={{ color: '#005CA9' }} />;
      case 'community_help': return <ReciprocityIcon sx={{ color: '#E91E63' }} />;
      default: return <ReciprocityIcon />;
    }
  };

  const getEventTypeLabel = (type: ReciprocityEvent['type']) => {
    switch (type) {
      case 'template_used': return 'Template Usado';
      case 'collaboration_started': return 'Colaboración Iniciada';
      case 'remix_created': return 'Remix Creado';
      case 'knowledge_shared': return 'Conocimiento Compartido';
      case 'community_help': return 'Ayuda Comunitaria';
      default: return 'Evento';
    }
  };

  const getBonusTypeIcon = (type: CommunityBonus['bonusType']) => {
    switch (type) {
      case 'quality_milestone': return <StarIcon sx={{ color: '#FBBA00' }} />;
      case 'collaboration_boost': return <CommunityIcon sx={{ color: '#5C2483' }} />;
      case 'knowledge_transfer': return <AnalyticsIcon sx={{ color: '#005CA9' }} />;
      case 'community_choice': return <RewardIcon sx={{ color: '#E91E63' }} />;
      default: return <BonusIcon />;
    }
  };

  const getBonusTypeLabel = (type: CommunityBonus['bonusType']) => {
    switch (type) {
      case 'quality_milestone': return 'Hito de Calidad';
      case 'collaboration_boost': return 'Impulso Colaborativo';
      case 'knowledge_transfer': return 'Transferencia de Conocimiento';
      case 'community_choice': return 'Elección Comunitaria';
      default: return 'Bonus';
    }
  };

  const getImpactColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'low': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  const renderTabPanel = (value: number, index: number, children: React.ReactNode) => (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          borderRadius: 2,
          fontFamily: 'Inter, sans-serif'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #5C2483 0%, #3E8638 100%)',
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReciprocityIcon fontSize="large" />
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Sistema de Incentivos de Reciprocidad
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: 'Kollektif, sans-serif' }}>
              🔄 Ayni Digital • Ciclos virtuosos de valor compartido
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoIncentivesEnabled}
                  onChange={(e) => setAutoIncentivesEnabled(e.target.checked)}
                  sx={{ '& .MuiSwitch-track': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Auto-Incentivos
                </Typography>
              }
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Metrics Overview */}
        {metrics && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#F0F8F5' }}>
                <ReciprocityIcon sx={{ fontSize: 40, color: '#3E8638', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3E8638' }}>
                  Ü {metrics.totalReciprocityGenerated.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reciprocidad Generada
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#F5F0FF' }}>
                <BonusIcon sx={{ fontSize: 40, color: '#5C2483', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#5C2483' }}>
                  Ü {metrics.totalBonusDistributed.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bonus Comunitarios
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#F0F5FF' }}>
                <CycleIcon sx={{ fontSize: 40, color: '#005CA9', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#005CA9' }}>
                  {metrics.activeIncentiveCycles}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ciclos Activos
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#FFF8E7' }}>
                <RewardIcon sx={{ fontSize: 40, color: '#FBBA00', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FBBA00' }}>
                  {metrics.virtouseCycleIndex}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Índice de Ciclo Virtuoso
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab icon={<CycleIcon />} label="Eventos de Reciprocidad" />
          <Tab icon={<RewardIcon />} label="Bonus Comunitarios" />
          <Tab icon={<AnalyticsIcon />} label="Análisis de Ciclos" />
          <Tab icon={<AutoIcon />} label="Configuración" />
        </Tabs>

        {/* Reciprocity Events Tab */}
        {renderTabPanel(activeTab, 0, (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Evento</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Template</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Creador Original</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Beneficiario</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ünits Generados</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Multiplicador</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Impacto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reciprocityEvents.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getEventTypeIcon(event.type)}
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {getEventTypeLabel(event.type)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {event.templateTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {event.templateId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">
                          {event.originalCreatorName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">
                          {event.beneficiaryName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UnitsIcon sx={{ color: '#5C2483', fontSize: 16 }} />
                        <Typography variant="body2" fontWeight="medium" sx={{ color: '#3E8638' }}>
                          +{event.unitsGenerated}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={`x${event.collaborationMultiplier}`} 
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={event.triggerDetails.impactLevel} 
                        sx={{ 
                          backgroundColor: getImpactColor(event.triggerDetails.impactLevel),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={event.status === 'distributed' ? 'Distribuido' : event.status === 'processed' ? 'Procesado' : 'Pendiente'} 
                        color={event.status === 'distributed' ? 'success' : event.status === 'processed' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => setSelectedEvent(event)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}

        {/* Community Bonuses Tab */}
        {renderTabPanel(activeTab, 1, (
          <Grid container spacing={3}>
            {communityBonuses.map((bonus) => (
              <Grid item xs={12} md={6} key={bonus.id}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getBonusTypeIcon(bonus.bonusType)}
                        <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                          {getBonusTypeLabel(bonus.bonusType)}
                        </Typography>
                      </Box>
                      <Chip 
                        size="small" 
                        label={bonus.status === 'distributed' ? 'Distribuido' : 'Ganado'} 
                        color={bonus.status === 'distributed' ? 'success' : 'warning'}
                      />
                    </Box>

                    <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                      {bonus.templateTitle}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2" color="text.secondary">
                        {bonus.creatorName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <UnitsIcon sx={{ color: '#5C2483', fontSize: 20 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3E8638' }}>
                        +{bonus.bonusAmount} Ünits
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>Criterios Cumplidos:</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Calidad</Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={bonus.criteria.qualityScore} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">{bonus.criteria.qualityScore}%</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Colaboración</Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={bonus.criteria.collaborationIndex} 
                          sx={{ height: 6, borderRadius: 3 }}
                          color="success"
                        />
                        <Typography variant="caption">{bonus.criteria.collaborationIndex}%</Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        <TimeIcon sx={{ fontSize: 12, mr: 0.5 }} />
                        {new Date(bonus.achievedAt).toLocaleDateString()}
                      </Typography>
                      {bonus.status === 'distributed' && bonus.distributedAt && (
                        <Typography variant="caption" color="success.main">
                          <CheckIcon sx={{ fontSize: 12, mr: 0.5 }} />
                          Distribuido {new Date(bonus.distributedAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}

        {/* Cycle Analysis Tab */}
        {renderTabPanel(activeTab, 2, (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                  🔄 Análisis de Ciclos Virtuosos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">Participantes activos en reciprocidad</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3E8638' }}>
                    {metrics?.reciprocityParticipants}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">Multiplicador promedio</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#5C2483' }}>
                    x{metrics?.averageMultiplier}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Crecimiento comunitario</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#005CA9' }}>
                    +{metrics?.communityGrowthRate}%
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                  🌟 Template Más Generativo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <RewardIcon sx={{ fontSize: 60, color: '#FBBA00', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {metrics?.topPerformingTemplate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Genera más ciclos de reciprocidad y colaboración
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        ))}

        {/* Configuration Tab */}
        {renderTabPanel(activeTab, 3, (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="medium">
                  ⚙️ Configuración de Incentivos Automáticos
                </Typography>
                <Typography variant="body2">
                  Los incentivos se activan automáticamente cuando se detectan eventos de colaboración,
                  siguiendo los principios de Ayni y Economia Sagrada CoomÜnity.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#F0F8F5' }}>
                <AutoIcon sx={{ fontSize: 48, color: '#3E8638', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, mb: 1 }}>
                  Detección Automática
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El sistema detecta automáticamente cuando un template se usa en 
                  proyectos colaborativos y activa los incentivos correspondientes.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#F5F0FF' }}>
                <CycleIcon sx={{ fontSize: 48, color: '#5C2483', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, mb: 1 }}>
                  Multiplicadores Dinámicos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Los multiplicadores se ajustan según el tamaño del equipo, 
                  impacto del proyecto y nivel de colaboración alcanzado.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#F0F5FF' }}>
                <VaultIcon sx={{ fontSize: 48, color: '#005CA9', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, mb: 1 }}>
                  Distribución Transparente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Todas las distribuciones son transparentes y auditables,
                  manteniendo la confianza en el sistema de incentivos.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        ))}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="outlined" startIcon={<AnalyticsIcon />}>
          Exportar Análisis
        </Button>
      </DialogActions>

      {/* Event Detail Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles del Evento de Reciprocidad</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {getEventTypeLabel(selectedEvent.type)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Evento ID: {selectedEvent.id}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Template</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedEvent.templateTitle}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Ünits Generados</Typography>
                  <Typography variant="h5" sx={{ color: '#3E8638', fontWeight: 'bold' }}>
                    +{selectedEvent.unitsGenerated}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Multiplicador</Typography>
                  <Typography variant="body1">
                    x{selectedEvent.collaborationMultiplier}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Colaboradores</Typography>
                  <Typography variant="body1">
                    {selectedEvent.triggerDetails.collaboratorCount} personas
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Alcance Comunitario</Typography>
                  <Typography variant="body1">
                    {selectedEvent.triggerDetails.communityReach} miembros impactados
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ReciprocityIncentivesSystem;