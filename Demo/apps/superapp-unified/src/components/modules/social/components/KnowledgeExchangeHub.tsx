/**
 * 🎓 Hub de Intercambio de Conocimiento LETS para Grupos/CoPs
 * 
 * Integra el sistema LETS (Local Exchange Trading System) con las Comunidades de Práctica,
 * permitiendo intercambios de conocimiento usando Ünits y sistema de jerarquía.
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  
  
  
  
  
  
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import {
  School,
  Group,
  Star,
  AccessTime,
  Add,
  Person,
  Psychology,
  EmojiEvents,
  TrendingUp,
  Handshake,
  AutoAwesome,
  Schedule,
  LocationOn,
  Language,
  VideoCall,
  People,
  Close,
} from '@mui/icons-material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

// Hooks LETS
import { useUnitsWallet } from '../../../../hooks/useLetsIntegration';
import { useKnowledgeExchanges, useCopHierarchy } from '../../../../hooks/useCopsLets';

// Tipos LETS
import { 
  KnowledgeExchange, 
  CopHierarchyLevel, 
  LETS_CATEGORIES,
  COP_HIERARCHY_LEVELS 
} from '../../../../types/lets';

interface KnowledgeExchangeHubProps {
  copId: string;
  userId: string;
  groupName: string;
}

interface CreateSessionFormData {
  title: string;
  description: string;
  sessionType: 'one_to_one' | 'workshop' | 'mentoring' | 'group_session';
  knowledgeAreas: string[];
  unitsCost: number;
  durationHours: number;
  maxParticipants: number;
  format: 'virtual' | 'presencial' | 'hybrid';
  scheduledAt: string;
  materials: string;
}

const levelNames = {
  1: 'Aprendiz', 2: 'Iniciado', 3: 'Practicante',
  4: 'Competente', 5: 'Especialista', 6: 'Experto', 7: 'Maestro'
};

const knowledgeAreaOptions = [
  'Tecnología', 'Diseño', 'Marketing', 'Finanzas', 'Liderazgo',
  'Comunicación', 'Emprendimiento', 'Sostenibilidad', 'Arte',
  'Educación', 'Salud', 'Agricultura', 'Construcción', 'Música'
];

export const KnowledgeExchangeHub: React.FC<KnowledgeExchangeHubProps> = ({
  copId,
  userId,
  groupName
}) => {
  const theme = useTheme();
  
  // Estados
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<KnowledgeExchange | null>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<CreateSessionFormData>({
    title: '',
    description: '',
    sessionType: 'workshop',
    knowledgeAreas: [],
    unitsCost: 5,
    durationHours: 1,
    maxParticipants: 10,
    format: 'virtual',
    scheduledAt: '',
    materials: ''
  });

  // Hooks LETS
  const { wallet } = useUnitsWallet(userId);
  const { exchanges, isLoading, createExchange, joinExchange } = useKnowledgeExchanges(copId);
  const { userLevel, levelProgress } = useCopHierarchy(userId, copId);

  const handleCreateSession = async () => {
    try {
      await createExchange.mutateAsync({
        ...formData,
        copId,
        teacherId: userId
      });
      setCreateSessionOpen(false);
      setFormData({
        title: '',
        description: '',
        sessionType: 'workshop',
        knowledgeAreas: [],
        unitsCost: 5,
        durationHours: 1,
        maxParticipants: 10,
        format: 'virtual',
        scheduledAt: '',
        materials: ''
      });
    } catch (error) {
      console.error('Error creando sesión:', error);
    }
  };

  const handleJoinExchange = async (exchangeId: string) => {
    try {
      await joinExchange.mutateAsync({
        exchangeId,
        participantId: userId,
        role: 'learner'
      });
      setJoinDialogOpen(false);
      setSelectedExchange(null);
    } catch (error) {
      console.error('Error uniéndose al intercambio:', error);
    }
  };

  const canTeach = userLevel?.level >= 3; // Nivel Practicante o superior

  return (
    <Box>
      {/* Header con información del usuario */}
      <Card sx={{ 
        p: 3, 
        mb: 3, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white'
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{xs:12,md:8}}>
            <Typography variant="h4" fontWeight="bold" mb={1}>
              🎓 Hub de Intercambio de Conocimiento
            </Typography>
            <Typography variant="h6" mb={2}>
              {groupName}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Comparte tu sabiduría y aprende de la comunidad usando el sistema LETS
            </Typography>
          </Grid>
          
          <Grid size={{xs:12,md:4}}>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.common.white, 0.1) }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="inherit">
                  Tu Nivel Actual
                </Typography>
                <Chip
                  label={`${levelNames[userLevel?.level || 1]} - Nivel ${userLevel?.level || 1}`}
                  size="small"
                  sx={{ bgcolor: alpha(theme.palette.common.white, 0.2), color: 'inherit' }}
                />
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={levelProgress || 0}
                sx={{
                  mb: 1,
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.warning.main
                  }
                }}
              />
              
              <Typography variant="caption" color="inherit">
                Progreso al siguiente nivel: {levelProgress || 0}%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Card>

      {/* Wallet de Ünits */}
      {wallet && (
        <Card sx={{ p: 2, mb: 3, border: `2px solid ${theme.palette.primary.main}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" color="primary" fontWeight="bold">
                💫 {wallet.balance.toFixed(2)} Ünits
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Disponibles para intercambios
              </Typography>
            </Box>
            
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Confianza: {(wallet.trustScore * 100).toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Límite de crédito: {wallet.creditLimit.toFixed(2)} Ünits
              </Typography>
            </Box>
          </Box>
        </Card>
      )}

      {/* Acciones principales */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{xs:12,md:4}}>
          <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <School sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" mb={1}>Crear Sesión</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Comparte tu conocimiento y gana Mëritos
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setCreateSessionOpen(true)}
              disabled={!canTeach}
              startIcon={<Add />}
            >
              {canTeach ? 'Crear Sesión' : 'Nivel 3+ requerido'}
            </Button>
          </Card>
        </Grid>

        <Grid size={{xs:12,md:4}}>
          <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Group sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h6" mb={1}>Unirse a Taller</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Participa en sesiones de aprendizaje grupal
            </Typography>
            <Button variant="outlined" fullWidth startIcon={<People />}>
              Ver Talleres Disponibles
            </Button>
          </Card>
        </Grid>

        <Grid size={{xs:12,md:4}}>
          <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Star sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6" mb={1}>Mentoría 1:1</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Sesiones personalizadas de aprendizaje
            </Typography>
            <Button variant="outlined" fullWidth startIcon={<Person />}>
              Buscar Mentor
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de intercambios disponibles */}
      <Card sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            📅 Próximos Intercambios de Conocimiento
          </Typography>
          <Chip 
            label={`${exchanges?.length || 0} disponibles`}
            color="primary"
            variant="outlined"
          />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Cargando intercambios...</Typography>
          </Box>
        ) : exchanges?.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Psychology sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              No hay intercambios programados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ¡Sé el primero en crear una sesión de intercambio de conocimiento!
            </Typography>
          </Box>
        ) : (
          <Timeline>
            {exchanges?.slice(0, 5).map((exchange, index) => (
              <TimelineItem key={exchange.id}>
                <TimelineSeparator>
                  <TimelineDot
                    color={exchange.status === 'scheduled' ? 'primary' : 'success'}
                    sx={{ width: 16, height: 16 }}
                  >
                    <School sx={{ fontSize: 10 }} />
                  </TimelineDot>
                  {index < exchanges.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent>
                  <KnowledgeExchangeCard
                    exchange={exchange}
                    onJoin={() => {
                      setSelectedExchange(exchange);
                      setJoinDialogOpen(true);
                    }}
                    userCanJoin={wallet?.balance >= exchange.unitsCost}
                  />
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Card>

      {/* Modal de creación de sesión */}
      <Dialog
        open={createSessionOpen}
        onClose={() => setCreateSessionOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <School sx={{ mr: 2 }} />
              Crear Sesión de Intercambio
            </Box>
            <IconButton onClick={() => setCreateSessionOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Título de la Sesión"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              required
            />
            
            <Grid container spacing={2}>
              <Grid size={{xs:12,sm:6}}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Sesión</InputLabel>
                  <Select
                    value={formData.sessionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value as any }))}
                  >
                    <MenuItem value="workshop">Taller Grupal</MenuItem>
                    <MenuItem value="mentoring">Mentoría</MenuItem>
                    <MenuItem value="one_to_one">Sesión 1:1</MenuItem>
                    <MenuItem value="group_session">Sesión Grupal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{xs:12,sm:6}}>
                <FormControl fullWidth>
                  <InputLabel>Formato</InputLabel>
                  <Select
                    value={formData.format}
                    onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as any }))}
                  >
                    <MenuItem value="virtual">Virtual</MenuItem>
                    <MenuItem value="presencial">Presencial</MenuItem>
                    <MenuItem value="hybrid">Híbrido</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid size={{xs:12,sm:4}}>
                <TextField
                  label="Costo en Ünits"
                  type="number"
                  value={formData.unitsCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitsCost: Number(e.target.value) }))}
                  fullWidth
                  inputProps={{ min: 0, max: 50 }}
                />
              </Grid>
              
              <Grid size={{xs:12,sm:4}}>
                <TextField
                  label="Duración (horas)"
                  type="number"
                  value={formData.durationHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationHours: Number(e.target.value) }))}
                  fullWidth
                  inputProps={{ min: 0.5, max: 8, step: 0.5 }}
                />
              </Grid>
              
              <Grid size={{xs:12,sm:4}}>
                <TextField
                  label="Máx. Participantes"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
                  fullWidth
                  inputProps={{ min: 1, max: 50 }}
                />
              </Grid>
            </Grid>
            
            <TextField
              label="Fecha y Hora"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setCreateSessionOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateSession}
            variant="contained"
            disabled={!formData.title || !formData.description || createExchange.isPending}
          >
            {createExchange.isPending ? 'Creando...' : 'Crear Sesión'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de unirse a intercambio */}
      <Dialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Unirse al Intercambio</DialogTitle>
        <DialogContent>
          {selectedExchange && (
            <Box>
              <Typography variant="h6" mb={2}>
                {selectedExchange.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {selectedExchange.description}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2">
                  <strong>Costo:</strong> {selectedExchange.unitsCost} Ünits
                </Typography>
                <Typography variant="body2">
                  <strong>Duración:</strong> {selectedExchange.durationHours}h
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Tu balance actual: {wallet?.balance.toFixed(2)} Ünits
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => selectedExchange && handleJoinExchange(selectedExchange.id)}
            variant="contained"
            disabled={
              !selectedExchange || 
              !wallet || 
              wallet.balance < selectedExchange.unitsCost ||
              joinExchange.isPending
            }
          >
            {joinExchange.isPending ? 'Uniéndose...' : 'Unirse'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Componente de tarjeta de intercambio
interface KnowledgeExchangeCardProps {
  exchange: KnowledgeExchange;
  onJoin: () => void;
  userCanJoin: boolean;
}

const KnowledgeExchangeCard: React.FC<KnowledgeExchangeCardProps> = ({
  exchange,
  onJoin,
  userCanJoin
}) => {
  const theme = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return theme.palette.primary.main;
      case 'in_progress': return theme.palette.warning.main;
      case 'completed': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programado';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  return (
    <Card sx={{ mb: 2, border: `1px solid ${getStatusColor(exchange.status)}` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              {exchange.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {exchange.description}
            </Typography>
          </Box>

          <Chip
            label={getStatusLabel(exchange.status)}
            size="small"
            sx={{ 
              bgcolor: alpha(getStatusColor(exchange.status), 0.1),
              color: getStatusColor(exchange.status),
              fontWeight: 'bold'
            }}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={exchange.teacher?.avatar}
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Typography variant="subtitle2">
              {exchange.teacher?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Nivel {exchange.teacher?.level} - {levelNames[exchange.teacher?.level || 1]}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid size={{xs:6}}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">
                {exchange.durationHours}h
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{xs:6}}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AutoAwesome sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="body2" color="primary" fontWeight="bold">
                {exchange.unitsCost} Ünits
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{xs:6}}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <People sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">
                {exchange.currentParticipants}/{exchange.maxParticipants}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{xs:6}}>
            <Box display="flex" alignItems="center" gap={0.5}>
              {exchange.format === 'virtual' ? (
                <VideoCall sx={{ fontSize: 16, color: 'text.secondary' }} />
              ) : (
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              )}
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {exchange.format}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {exchange.knowledgeAreas && exchange.knowledgeAreas.length > 0 && (
          <Box mb={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {exchange.knowledgeAreas.slice(0, 3).map((area, index) => (
                <Chip
                  key={index}
                  label={area}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {exchange.knowledgeAreas.length > 3 && (
                <Chip
                  label={`+${exchange.knowledgeAreas.length - 3} más`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Stack>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {exchange.scheduledAt && new Date(exchange.scheduledAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={onJoin}
            disabled={
              !userCanJoin || 
              exchange.currentParticipants >= exchange.maxParticipants ||
              exchange.status !== 'scheduled'
            }
            sx={{
              background: userCanJoin 
                ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                : undefined
            }}
          >
            {!userCanJoin ? 'Ünits insuficientes' : 
             exchange.currentParticipants >= exchange.maxParticipants ? 'Lleno' :
             'Unirse'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KnowledgeExchangeHub; 