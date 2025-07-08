/**
 * 🌌 MissionsTab Component
 * 
 * Tab de misiones del AI Cosmic Brain Dashboard.
 * Muestra misiones activas, progreso y gestión de tareas.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Visualización clara de misiones para el equipo
 * - Ayni: Balance entre información y acción
 * - Neguentropía: Organización estructurada de misiones
 * - Metanöia: Evolución continua de la gestión
 */

import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Alert,
  Skeleton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Assignment,
  PlayArrow,
  Pause,
  CheckCircle,
  Cancel,
  Person,
  Schedule,
  TrendingUp,
  Refresh,
  FilterList,
  Star,
  Warning
} from '@mui/icons-material';
import { useActiveMissions } from '../../hooks/useCosmicBrainData';
import { Mission } from '../../types/cosmic-brain.types';

const MissionsTab: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [limitFilter, setLimitFilter] = useState<number>(20);

  const { 
    data: missions, 
    isLoading, 
    error,
    refetch
  } = useActiveMissions({
    limit: limitFilter,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  // ============================================================================
  // 🎨 Render Functions
  // ============================================================================

  const getMissionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'paused': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getMissionStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayArrow />;
      case 'completed': return <CheckCircle />;
      case 'paused': return <Pause />;
      case 'cancelled': return <Cancel />;
      default: return <Assignment />;
    }
  };

  const getMissionTypeColor = (type: string) => {
    switch (type) {
      case 'philosophy': return '#9C27B0'; // Purple
      case 'technical': return '#2196F3'; // Blue
      case 'creative': return '#FF9800'; // Orange
      case 'social': return '#4CAF50'; // Green
      default: return '#757575'; // Grey
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const renderMissionCard = (mission: Mission) => (
    <Card key={mission.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: getMissionTypeColor(mission.type) }}>
              {getMissionStatusIcon(mission.status)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {mission.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mission.description}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Chip 
              label={mission.status} 
              color={getMissionStatusColor(mission.status)}
              size="small"
            />
            <Chip 
              label={mission.priority} 
              color={getPriorityColor(mission.priority)}
              size="small"
            />
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="bold">
              Progreso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mission.progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={mission.progress} 
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        {/* Mission Details */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Asignado a: {mission.assignedTo.length} personas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Inicio: {new Date(mission.startDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Tipo: {mission.type}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Tags */}
        {mission.tags.length > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {mission.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Rewards */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography variant="body2" fontWeight="bold">
            Recompensas:
          </Typography>
          <Chip 
            icon={<Star />}
            label={`${mission.rewards.merits} Méritos`}
            size="small"
            color="primary"
          />
          <Chip 
            label={`${mission.rewards.experience} XP`}
            size="small"
            color="secondary"
          />
        </Box>

        {/* Blockers */}
        {mission.blockers.length > 0 && (
          <Box>
            <Typography variant="body2" fontWeight="bold" color="error" mb={1}>
              ⚠️ Bloqueadores:
            </Typography>
            <List dense>
              {mission.blockers.map((blocker, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon>
                    <Warning color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={blocker}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderFilters = () => (
    <Box display="flex" gap={2} mb={3} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Estado</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Estado"
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="active">Activo</MenuItem>
          <MenuItem value="completed">Completado</MenuItem>
          <MenuItem value="paused">Pausado</MenuItem>
          <MenuItem value="cancelled">Cancelado</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Límite</InputLabel>
        <Select
          value={limitFilter}
          onChange={(e) => setLimitFilter(Number(e.target.value))}
          label="Límite"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>

      <Tooltip title="Actualizar misiones">
        <IconButton onClick={() => refetch()} size="small">
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderMissionStats = () => {
    if (!missions) return null;

    const stats = {
      total: missions.length,
      active: missions.filter(m => m.status === 'active').length,
      completed: missions.filter(m => m.status === 'completed').length,
      paused: missions.filter(m => m.status === 'paused').length,
      cancelled: missions.filter(m => m.status === 'cancelled').length,
      avgProgress: missions.reduce((acc, m) => acc + m.progress, 0) / missions.length || 0
    };

    return (
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.paused}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pausadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.cancelled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Canceladas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {Math.round(stats.avgProgress)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Progreso Promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // ============================================================================
  // 🎯 Main Render
  // ============================================================================

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          🎯 Misiones del AI Cosmic Brain
        </Typography>
        {[...Array(3)].map((_, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="rectangular" height={60} />
              <Skeleton variant="text" height={20} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          🎯 Misiones del AI Cosmic Brain
        </Typography>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Reintentar
          </Button>
        }>
          Error cargando misiones: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!missions || missions.length === 0) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          🎯 Misiones del AI Cosmic Brain
        </Typography>
        {renderFilters()}
        <Alert severity="info">
          No hay misiones disponibles con los filtros seleccionados
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🎯 Misiones del AI Cosmic Brain
      </Typography>

      {renderFilters()}
      {renderMissionStats()}

      <Box>
        {missions.map(renderMissionCard)}
      </Box>
    </Box>
  );
};

export default MissionsTab;
