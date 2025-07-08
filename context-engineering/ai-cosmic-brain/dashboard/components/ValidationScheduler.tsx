import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
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
  Alert,
  Divider,
  Paper,
  Tooltip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Timer as TimerIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  Psychology as PsychologyIcon,
  Architecture as ArchitectureIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

import type { GuardianType } from '../types';

// Interfaces para el programador de validaciones
interface ScheduledValidation {
  id: string;
  name: string;
  description: string;
  ruleIds: string[];
  schedule: ValidationScheduleConfig;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface ValidationScheduleConfig {
  type: 'interval' | 'cron' | 'daily' | 'weekly' | 'monthly' | 'trigger';
  value: string | number;
  timezone?: string;
  conditions?: ScheduleCondition[];
  retryPolicy?: RetryPolicy;
}

interface ScheduleCondition {
  type:
    | 'time_range'
    | 'day_of_week'
    | 'file_change'
    | 'git_commit'
    | 'system_load';
  value: any;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
}

interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoffTime: number;
}

interface ValidationSchedulerProps {
  schedules: ScheduledValidation[];
  availableRules: Array<{
    id: string;
    name: string;
    guardianType: GuardianType;
  }>;
  onScheduleCreate?: (schedule: ScheduledValidation) => void;
  onScheduleUpdate?: (schedule: ScheduledValidation) => void;
  onScheduleDelete?: (scheduleId: string) => void;
  onScheduleToggle?: (scheduleId: string, enabled: boolean) => void;
  onScheduleExecute?: (scheduleId: string) => void;
}

export const ValidationScheduler: React.FC<ValidationSchedulerProps> = ({
  schedules,
  availableRules,
  onScheduleCreate,
  onScheduleUpdate,
  onScheduleDelete,
  onScheduleToggle,
  onScheduleExecute,
}) => {
  // Estado del componente
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<ScheduledValidation | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<ScheduledValidation>>({
    name: '',
    description: '',
    ruleIds: [],
    enabled: true,
    schedule: {
      type: 'interval',
      value: 3600000, // 1 hora por defecto
      timezone: 'America/Mexico_City',
      conditions: [],
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        maxBackoffTime: 300000, // 5 minutos
      },
    },
  });

  // Obtener icono del guardian
  const getGuardianIcon = (type: GuardianType) => {
    const icons = {
      philosophy: PsychologyIcon,
      architecture: ArchitectureIcon,
      ux: VisibilityIcon,
      performance: SpeedIcon,
    };
    return icons[type];
  };

  // Obtener color del guardian
  const getGuardianColor = (type: GuardianType) => {
    const colors = {
      philosophy: '#9C27B0',
      architecture: '#2196F3',
      ux: '#FF9800',
      performance: '#4CAF50',
    };
    return colors[type];
  };

  // Obtener estado de la programación
  const getScheduleStatus = (schedule: ScheduledValidation) => {
    if (!schedule.enabled)
      return { status: 'disabled', color: '#757575', icon: PauseIcon };

    const now = new Date();
    const nextRun = schedule.nextRun;

    if (!nextRun)
      return { status: 'pending', color: '#FF9800', icon: TimerIcon };

    const timeDiff = nextRun.getTime() - now.getTime();

    if (timeDiff < 0)
      return { status: 'overdue', color: '#F44336', icon: ErrorIcon };
    if (timeDiff < 300000)
      return { status: 'running_soon', color: '#2196F3', icon: PlayIcon }; // 5 minutos

    return { status: 'scheduled', color: '#4CAF50', icon: ScheduleIcon };
  };

  // Formatear próxima ejecución
  const formatNextRun = (nextRun?: Date) => {
    if (!nextRun) return 'No programada';

    const now = new Date();
    const diff = nextRun.getTime() - now.getTime();

    if (diff < 0) return 'Atrasada';

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `En ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `En ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `En ${minutes} minuto${minutes > 1 ? 's' : ''}`;

    return 'Muy pronto';
  };

  // Formatear duración
  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  };

  // Calcular tasa de éxito
  const getSuccessRate = (schedule: ScheduledValidation) => {
    if (schedule.totalRuns === 0) return 0;
    return (schedule.successfulRuns / schedule.totalRuns) * 100;
  };

  // Abrir diálogo para crear nueva programación
  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setFormData({
      name: '',
      description: '',
      ruleIds: [],
      enabled: true,
      schedule: {
        type: 'interval',
        value: 3600000,
        timezone: 'America/Mexico_City',
        conditions: [],
        retryPolicy: {
          maxRetries: 3,
          backoffMultiplier: 2,
          maxBackoffTime: 300000,
        },
      },
    });
    setActiveStep(0);
    setIsDialogOpen(true);
  };

  // Abrir diálogo para editar programación
  const handleEditSchedule = (schedule: ScheduledValidation) => {
    setEditingSchedule(schedule);
    setFormData({ ...schedule });
    setActiveStep(0);
    setIsDialogOpen(true);
  };

  // Guardar programación
  const handleSaveSchedule = () => {
    if (!formData.name || !formData.description || !formData.ruleIds?.length)
      return;

    const scheduleToSave: ScheduledValidation = {
      id: editingSchedule?.id || `schedule-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      ruleIds: formData.ruleIds!,
      schedule: formData.schedule!,
      enabled: formData.enabled!,
      lastRun: editingSchedule?.lastRun,
      nextRun: calculateNextRun(formData.schedule!),
      totalRuns: editingSchedule?.totalRuns || 0,
      successfulRuns: editingSchedule?.successfulRuns || 0,
      failedRuns: editingSchedule?.failedRuns || 0,
      averageDuration: editingSchedule?.averageDuration || 0,
      createdAt: editingSchedule?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema',
    };

    if (editingSchedule) {
      onScheduleUpdate?.(scheduleToSave);
    } else {
      onScheduleCreate?.(scheduleToSave);
    }

    setIsDialogOpen(false);
    setEditingSchedule(null);
  };

  // Calcular próxima ejecución
  const calculateNextRun = (schedule: ValidationScheduleConfig): Date => {
    const now = new Date();

    switch (schedule.type) {
      case 'interval':
        return new Date(now.getTime() + (schedule.value as number));

      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(parseInt(schedule.value as string), 0, 0, 0);
        return tomorrow;

      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;

      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;

      default:
        return new Date(now.getTime() + 3600000); // 1 hora por defecto
    }
  };

  // Pasos del wizard
  const steps = [
    'Información Básica',
    'Selección de Reglas',
    'Configuración de Programación',
    'Condiciones y Políticas',
  ];

  // Renderizar contenido del paso
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Nombre de la Programación"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Descripción"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                  />
                }
                label="Programación Habilitada"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selecciona las reglas de validación que se ejecutarán en esta
              programación:
            </Typography>
            <List>
              {availableRules.map((rule) => {
                const GuardianIcon = getGuardianIcon(rule.guardianType);
                const isSelected = formData.ruleIds?.includes(rule.id);

                return (
                  <ListItem
                    key={rule.id}
                    button
                    onClick={() => {
                      const currentRules = formData.ruleIds || [];
                      const newRules = isSelected
                        ? currentRules.filter((id) => id !== rule.id)
                        : [...currentRules, rule.id];
                      setFormData((prev) => ({ ...prev, ruleIds: newRules }));
                    }}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: isSelected
                        ? 'action.selected'
                        : 'background.paper',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: getGuardianColor(rule.guardianType),
                          width: 32,
                          height: 32,
                        }}
                      >
                        <GuardianIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={rule.name}
                      secondary={`${rule.guardianType} Guardian`}
                    />
                    {isSelected && <CheckIcon sx={{ color: '#4CAF50' }} />}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Programación</InputLabel>
                <Select
                  value={formData.schedule?.type || 'interval'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        type: e.target.value as any,
                      },
                    }))
                  }
                  label="Tipo de Programación"
                >
                  <MenuItem value="interval">Intervalo</MenuItem>
                  <MenuItem value="daily">Diario</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                  <MenuItem value="monthly">Mensual</MenuItem>
                  <MenuItem value="cron">Cron Expression</MenuItem>
                  <MenuItem value="trigger">Trigger Event</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {formData.schedule?.type === 'interval' && (
                <TextField
                  label="Intervalo (minutos)"
                  type="number"
                  value={(formData.schedule.value as number) / 60000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        value: parseInt(e.target.value) * 60000,
                      },
                    }))
                  }
                  fullWidth
                  inputProps={{ min: 1 }}
                />
              )}

              {formData.schedule?.type === 'daily' && (
                <TextField
                  label="Hora (HH:MM)"
                  type="time"
                  value={formData.schedule.value || '09:00'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule!, value: e.target.value },
                    }))
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}

              {(formData.schedule?.type === 'cron' ||
                formData.schedule?.type === 'trigger') && (
                <TextField
                  label={
                    formData.schedule.type === 'cron'
                      ? 'Cron Expression'
                      : 'Trigger Event'
                  }
                  value={formData.schedule.value || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule!, value: e.target.value },
                    }))
                  }
                  fullWidth
                  placeholder={
                    formData.schedule.type === 'cron'
                      ? '0 0 9 * * *'
                      : 'git:push'
                  }
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Zona Horaria</InputLabel>
                <Select
                  value={formData.schedule?.timezone || 'America/Mexico_City'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule!, timezone: e.target.value },
                    }))
                  }
                  label="Zona Horaria"
                >
                  <MenuItem value="America/Mexico_City">
                    Mexico City (GMT-6)
                  </MenuItem>
                  <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                  <MenuItem value="America/Los_Angeles">
                    Los Angeles (GMT-8)
                  </MenuItem>
                  <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                  <MenuItem value="UTC">UTC (GMT+0)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Política de Reintentos
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Máximo de Reintentos"
                type="number"
                value={formData.schedule?.retryPolicy?.maxRetries || 3}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule!,
                      retryPolicy: {
                        ...prev.schedule!.retryPolicy!,
                        maxRetries: parseInt(e.target.value),
                      },
                    },
                  }))
                }
                fullWidth
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Multiplicador de Backoff"
                type="number"
                value={formData.schedule?.retryPolicy?.backoffMultiplier || 2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule!,
                      retryPolicy: {
                        ...prev.schedule!.retryPolicy!,
                        backoffMultiplier: parseFloat(e.target.value),
                      },
                    },
                  }))
                }
                fullWidth
                inputProps={{ min: 1, max: 5, step: 0.1 }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Tiempo Máximo de Backoff (min)"
                type="number"
                value={
                  (formData.schedule?.retryPolicy?.maxBackoffTime || 300000) /
                  60000
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule!,
                      retryPolicy: {
                        ...prev.schedule!.retryPolicy!,
                        maxBackoffTime: parseInt(e.target.value) * 60000,
                      },
                    },
                  }))
                }
                fullWidth
                inputProps={{ min: 1, max: 60 }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Programador de Validaciones
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSchedule}
            >
              Nueva Programación
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de Programaciones */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Programaciones Activas ({schedules.length})
          </Typography>

          {schedules.length === 0 ? (
            <Alert severity="info">
              No hay programaciones configuradas. Crea una nueva programación
              para comenzar.
            </Alert>
          ) : (
            <List>
              {schedules.map((schedule, index) => {
                const status = getScheduleStatus(schedule);
                const StatusIcon = status.icon;
                const successRate = getSuccessRate(schedule);
                const isExpanded = expandedSchedule === schedule.id;

                return (
                  <React.Fragment key={schedule.id}>
                    <ListItem
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 1,
                        borderLeft: `4px solid ${status.color}`,
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{ bgcolor: status.color, width: 40, height: 40 }}
                        >
                          <StatusIcon />
                        </Avatar>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="body1" fontWeight="medium">
                              {schedule.name}
                            </Typography>
                            <Chip
                              label={status.status
                                .replace('_', ' ')
                                .toUpperCase()}
                              size="small"
                              sx={{ bgcolor: status.color, color: 'white' }}
                            />
                            <Chip
                              label={`${schedule.ruleIds.length} reglas`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {schedule.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Próxima ejecución:{' '}
                              {formatNextRun(schedule.nextRun)} • Tasa de éxito:{' '}
                              {successRate.toFixed(1)}% • Ejecuciones:{' '}
                              {schedule.totalRuns}
                            </Typography>
                            {schedule.lastRun && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Última ejecución:{' '}
                                {schedule.lastRun.toLocaleString()} • Duración
                                promedio:{' '}
                                {formatDuration(schedule.averageDuration)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Switch
                            checked={schedule.enabled}
                            onChange={(e) =>
                              onScheduleToggle?.(schedule.id, e.target.checked)
                            }
                            size="small"
                          />

                          <Tooltip title="Ejecutar ahora">
                            <IconButton
                              size="small"
                              onClick={() => onScheduleExecute?.(schedule.id)}
                              disabled={!schedule.enabled}
                            >
                              <PlayIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Editar programación">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSchedule(schedule)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar programación">
                            <IconButton
                              size="small"
                              onClick={() => onScheduleDelete?.(schedule.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              isExpanded ? 'Ocultar detalles' : 'Ver detalles'
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                setExpandedSchedule(
                                  isExpanded ? null : schedule.id
                                )
                              }
                            >
                              <ExpandMoreIcon
                                sx={{
                                  transform: isExpanded
                                    ? 'rotate(180deg)'
                                    : 'none',
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>

                    {/* Detalles expandidos */}
                    {isExpanded && (
                      <Box sx={{ pl: 8, pr: 2, pb: 2 }}>
                        <Paper sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Configuración de Programación
                              </Typography>
                              <Box sx={{ ml: 2 }}>
                                <Typography variant="body2">
                                  Tipo: {schedule.schedule.type}
                                </Typography>
                                <Typography variant="body2">
                                  Valor: {schedule.schedule.value}
                                </Typography>
                                <Typography variant="body2">
                                  Zona Horaria: {schedule.schedule.timezone}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Estadísticas
                              </Typography>
                              <Box sx={{ ml: 2 }}>
                                <Typography variant="body2">
                                  Total de ejecuciones: {schedule.totalRuns}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: '#4CAF50' }}
                                >
                                  Exitosas: {schedule.successfulRuns}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: '#F44336' }}
                                >
                                  Fallidas: {schedule.failedRuns}
                                </Typography>
                                <Typography variant="body2">
                                  Duración promedio:{' '}
                                  {formatDuration(schedule.averageDuration)}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Reglas Incluidas ({schedule.ruleIds.length})
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                  ml: 2,
                                }}
                              >
                                {schedule.ruleIds.map((ruleId) => {
                                  const rule = availableRules.find(
                                    (r) => r.id === ruleId
                                  );
                                  return rule ? (
                                    <Chip
                                      key={ruleId}
                                      label={rule.name}
                                      size="small"
                                      sx={{
                                        bgcolor: getGuardianColor(
                                          rule.guardianType
                                        ),
                                        color: 'white',
                                      }}
                                    />
                                  ) : null;
                                })}
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Box>
                    )}

                    {index < schedules.length - 1 && <Divider sx={{ my: 1 }} />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Creación/Edición */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingSchedule
            ? 'Editar Programación'
            : 'Nueva Programación de Validación'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {renderStepContent(index)}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(activeStep - 1)}
                        sx={{ mr: 1 }}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (activeStep === steps.length - 1) {
                            handleSaveSchedule();
                          } else {
                            setActiveStep(activeStep + 1);
                          }
                        }}
                        disabled={
                          (activeStep === 0 &&
                            (!formData.name || !formData.description)) ||
                          (activeStep === 1 &&
                            (!formData.ruleIds ||
                              formData.ruleIds.length === 0))
                        }
                      >
                        {activeStep === steps.length - 1
                          ? editingSchedule
                            ? 'Actualizar'
                            : 'Crear'
                          : 'Siguiente'}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
