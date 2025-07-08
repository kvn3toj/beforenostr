import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Grid,
  Divider,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  AutoFixHigh as AutoFixIcon,
  Visibility as VisibilityIcon,
  Psychology as PsychologyIcon,
  Architecture as ArchitectureIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import type {
  GuardianType,
  SystemHealthMetrics,
  ValidationResult,
} from '../types';
import { useCosmicWebSocket } from '../providers/CosmicWebSocketProvider';

// Tipos específicos para el motor de validación
interface ValidationRule {
  id: string;
  name: string;
  description: string;
  guardianType: GuardianType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  autoFix: boolean;
  schedule?: ValidationSchedule;
  parameters: Record<string, any>;
}

interface ValidationSchedule {
  type: 'interval' | 'cron' | 'trigger';
  value: string | number;
  enabled: boolean;
}

interface ValidationExecution {
  id: string;
  ruleId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result?: ValidationResult;
  progress: number;
  logs: string[];
}

interface AutomatedValidationEngineProps {
  systemHealth: SystemHealthMetrics;
  onValidationComplete?: (execution: ValidationExecution) => void;
  onRuleUpdate?: (rule: ValidationRule) => void;
  compact?: boolean;
}

export const AutomatedValidationEngine: React.FC<
  AutomatedValidationEngineProps
> = ({ systemHealth, onValidationComplete, onRuleUpdate, compact = false }) => {
  // Estado del motor de validación
  const [isRunning, setIsRunning] = useState(false);
  const [currentExecution, setCurrentExecution] =
    useState<ValidationExecution | null>(null);
  const [executionHistory, setExecutionHistory] = useState<
    ValidationExecution[]
  >([]);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [selectedGuardian, setSelectedGuardian] = useState<
    GuardianType | 'all'
  >('all');
  const [autoMode, setAutoMode] = useState(true);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(
    new Set()
  );
  const [activeStep, setActiveStep] = useState(0);

  // WebSocket para comunicación en tiempo real
  const { connectionState, sendMessage } = useCosmicWebSocket();

  // Inicializar reglas de validación por defecto
  useEffect(() => {
    const defaultRules: ValidationRule[] = [
      {
        id: 'philosophy-alignment-check',
        name: 'Philosophy Alignment Validation',
        description:
          'Validates CoomÜnity philosophy alignment across the system',
        guardianType: 'philosophy',
        priority: 'high',
        enabled: true,
        autoFix: false,
        schedule: { type: 'interval', value: 300000, enabled: true }, // 5 minutos
        parameters: {
          minAlignmentScore: 0.8,
          checkPrinciples: ['bienComun', 'ayni', 'cooperacion'],
          validateImplementation: true,
        },
      },
      {
        id: 'architecture-patterns-check',
        name: 'Architecture Patterns Validation',
        description: 'Validates architectural patterns and design consistency',
        guardianType: 'architecture',
        priority: 'high',
        enabled: true,
        autoFix: true,
        schedule: { type: 'interval', value: 600000, enabled: true }, // 10 minutos
        parameters: {
          checkDependencies: true,
          validateStructure: true,
          enforcePatterns: ['module', 'service', 'repository'],
        },
      },
      {
        id: 'ux-accessibility-check',
        name: 'UX Accessibility Validation',
        description: 'Validates WCAG compliance and usability standards',
        guardianType: 'ux',
        priority: 'medium',
        enabled: true,
        autoFix: true,
        schedule: { type: 'interval', value: 900000, enabled: true }, // 15 minutos
        parameters: {
          wcagLevel: 'AA',
          checkContrast: true,
          validateAria: true,
          testKeyboardNav: true,
        },
      },
      {
        id: 'performance-metrics-check',
        name: 'Performance Metrics Validation',
        description: 'Validates Core Web Vitals and performance benchmarks',
        guardianType: 'performance',
        priority: 'critical',
        enabled: true,
        autoFix: false,
        schedule: { type: 'interval', value: 180000, enabled: true }, // 3 minutos
        parameters: {
          maxLCP: 2.5,
          maxFID: 100,
          maxCLS: 0.1,
          checkBundleSize: true,
          validateCaching: true,
        },
      },
    ];

    setValidationRules(defaultRules);
  }, []);

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

  // Obtener icono de prioridad
  const getPriorityIcon = (priority: ValidationRule['priority']) => {
    switch (priority) {
      case 'critical':
        return <ErrorIcon sx={{ color: '#F44336' }} />;
      case 'high':
        return <WarningIcon sx={{ color: '#FF9800' }} />;
      case 'medium':
        return <InfoIcon sx={{ color: '#2196F3' }} />;
      case 'low':
        return <CheckIcon sx={{ color: '#4CAF50' }} />;
    }
  };

  // Filtrar reglas por guardian seleccionado
  const filteredRules = useMemo(() => {
    if (selectedGuardian === 'all') return validationRules;
    return validationRules.filter(
      (rule) => rule.guardianType === selectedGuardian
    );
  }, [validationRules, selectedGuardian]);

  // Ejecutar validación individual
  const executeValidation = async (rule: ValidationRule) => {
    const execution: ValidationExecution = {
      id: `exec-${Date.now()}`,
      ruleId: rule.id,
      status: 'running',
      startTime: new Date(),
      progress: 0,
      logs: [`Iniciando validación: ${rule.name}`],
    };

    setCurrentExecution(execution);
    setIsRunning(true);

    // Simular progreso de validación
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const updatedExecution = {
        ...execution,
        progress,
        logs: [
          ...execution.logs,
          `Progreso: ${progress}% - Ejecutando validación ${rule.guardianType}`,
        ],
      };

      setCurrentExecution(updatedExecution);
    }

    // Simular resultado
    const mockResult: ValidationResult = {
      isValid: Math.random() > 0.3,
      errors: Math.random() > 0.7 ? [`Error en ${rule.name}`] : [],
      warnings: Math.random() > 0.5 ? [`Advertencia en ${rule.name}`] : [],
      context: {
        guardianType: rule.guardianType,
        ruleId: rule.id,
        timestamp: new Date().toISOString(),
      },
    };

    const completedExecution: ValidationExecution = {
      ...execution,
      status: 'completed',
      endTime: new Date(),
      duration: Date.now() - execution.startTime.getTime(),
      result: mockResult,
      progress: 100,
      logs: [
        ...execution.logs,
        `Validación completada: ${mockResult.isValid ? 'ÉXITO' : 'FALLÓ'}`,
      ],
    };

    setCurrentExecution(null);
    setIsRunning(false);
    setExecutionHistory((prev) => [completedExecution, ...prev.slice(0, 9)]);

    if (onValidationComplete) {
      onValidationComplete(completedExecution);
    }

    // Enviar evento via WebSocket
    if (connectionState.isConnected) {
      sendMessage({
        type: 'validation_completed',
        data: completedExecution,
      });
    }
  };

  // Ejecutar todas las validaciones
  const executeAllValidations = async () => {
    const enabledRules = filteredRules.filter((rule) => rule.enabled);

    for (const rule of enabledRules) {
      await executeValidation(rule);
      // Pequeña pausa entre validaciones
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  // Toggle expanded results
  const toggleExpanded = (executionId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(executionId)) {
      newExpanded.delete(executionId);
    } else {
      newExpanded.add(executionId);
    }
    setExpandedResults(newExpanded);
  };

  // Pasos del proceso de validación
  const validationSteps = [
    'Preparación de reglas',
    'Ejecución de validaciones',
    'Análisis de resultados',
    'Aplicación de correcciones automáticas',
  ];

  return (
    <Box>
      {/* Header del Motor */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#1976D2' }}>
                <AutoFixIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Automated Validation Engine
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Motor de validación automática para guardians del AI Cosmic
                  Brain
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoMode}
                    onChange={(e) => setAutoMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto Mode"
              />

              <Tooltip
                title={
                  isRunning
                    ? 'Detener validación'
                    : 'Ejecutar todas las validaciones'
                }
              >
                <IconButton
                  onClick={
                    isRunning
                      ? () => setIsRunning(false)
                      : executeAllValidations
                  }
                  disabled={filteredRules.filter((r) => r.enabled).length === 0}
                  color="primary"
                >
                  {isRunning ? <StopIcon /> : <PlayIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Configuración del motor">
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Estado actual y progreso */}
          {currentExecution && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Ejecutando:{' '}
                  {
                    validationRules.find(
                      (r) => r.id === currentExecution.ruleId
                    )?.name
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentExecution.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={currentExecution.progress}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          {/* Métricas rápidas */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {filteredRules.filter((r) => r.enabled).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Reglas Activas
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {executionHistory.filter((e) => e.result?.isValid).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Validaciones Exitosas
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">
                  {executionHistory.filter((e) => !e.result?.isValid).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Validaciones Fallidas
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {executionHistory.length > 0
                    ? Math.round(
                        executionHistory.reduce(
                          (sum, e) => sum + (e.duration || 0),
                          0
                        ) / executionHistory.length
                      )
                    : 0}
                  ms
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tiempo Promedio
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Controles y Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">
              Reglas de Validación ({filteredRules.length})
            </Typography>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Guardian</InputLabel>
              <Select
                value={selectedGuardian}
                onChange={(e) =>
                  setSelectedGuardian(e.target.value as GuardianType | 'all')
                }
                label="Guardian"
              >
                <MenuItem value="all">Todos los Guardians</MenuItem>
                <MenuItem value="philosophy">Philosophy Guardian</MenuItem>
                <MenuItem value="architecture">Architecture Guardian</MenuItem>
                <MenuItem value="ux">UX Guardian</MenuItem>
                <MenuItem value="performance">Performance Guardian</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de Reglas de Validación */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reglas Configuradas
              </Typography>

              <List>
                {filteredRules.map((rule, index) => {
                  const GuardianIcon = getGuardianIcon(rule.guardianType);

                  return (
                    <React.Fragment key={rule.id}>
                      <ListItem
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: rule.enabled
                            ? 'background.paper'
                            : 'action.hover',
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
                            <GuardianIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </ListItemIcon>

                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <Typography variant="body1" fontWeight="medium">
                                {rule.name}
                              </Typography>
                              {getPriorityIcon(rule.priority)}
                              <Chip
                                label={rule.priority.toUpperCase()}
                                size="small"
                                color={
                                  rule.priority === 'critical'
                                    ? 'error'
                                    : rule.priority === 'high'
                                      ? 'warning'
                                      : rule.priority === 'medium'
                                        ? 'info'
                                        : 'success'
                                }
                                variant="outlined"
                              />
                              {rule.autoFix && (
                                <Chip
                                  label="AUTO-FIX"
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                          secondary={rule.description}
                        />

                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Switch
                            checked={rule.enabled}
                            onChange={(e) => {
                              const updatedRule = {
                                ...rule,
                                enabled: e.target.checked,
                              };
                              setValidationRules((prev) =>
                                prev.map((r) =>
                                  r.id === rule.id ? updatedRule : r
                                )
                              );
                              if (onRuleUpdate) onRuleUpdate(updatedRule);
                            }}
                            size="small"
                          />

                          <Tooltip title="Ejecutar validación">
                            <IconButton
                              size="small"
                              onClick={() => executeValidation(rule)}
                              disabled={!rule.enabled || isRunning}
                            >
                              <PlayIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>

                      {index < filteredRules.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Historial de Ejecuciones */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <TimelineIcon />
                <Typography variant="h6">Historial de Ejecuciones</Typography>
              </Box>

              {executionHistory.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No hay ejecuciones recientes
                </Typography>
              ) : (
                <List dense>
                  {executionHistory.map((execution) => {
                    const rule = validationRules.find(
                      (r) => r.id === execution.ruleId
                    );
                    const isExpanded = expandedResults.has(execution.id);

                    return (
                      <React.Fragment key={execution.id}>
                        <ListItem
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            mb: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => toggleExpanded(execution.id)}
                        >
                          <ListItemIcon>
                            {execution.result?.isValid ? (
                              <CheckIcon sx={{ color: '#4CAF50' }} />
                            ) : (
                              <ErrorIcon sx={{ color: '#F44336' }} />
                            )}
                          </ListItemIcon>

                          <ListItemText
                            primary={rule?.name || 'Regla desconocida'}
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block">
                                  {execution.startTime.toLocaleTimeString()}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {execution.duration}ms
                                </Typography>
                              </Box>
                            }
                          />

                          <IconButton size="small">
                            {isExpanded ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </ListItem>

                        <Collapse in={isExpanded}>
                          <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                            {execution.result && (
                              <Box>
                                {execution.result.errors.length > 0 && (
                                  <Alert severity="error" sx={{ mb: 1 }}>
                                    <Typography
                                      variant="caption"
                                      fontWeight="bold"
                                    >
                                      Errores:
                                    </Typography>
                                    {execution.result.errors.map(
                                      (error, idx) => (
                                        <Typography
                                          key={idx}
                                          variant="caption"
                                          display="block"
                                        >
                                          • {error}
                                        </Typography>
                                      )
                                    )}
                                  </Alert>
                                )}

                                {execution.result.warnings.length > 0 && (
                                  <Alert severity="warning" sx={{ mb: 1 }}>
                                    <Typography
                                      variant="caption"
                                      fontWeight="bold"
                                    >
                                      Advertencias:
                                    </Typography>
                                    {execution.result.warnings.map(
                                      (warning, idx) => (
                                        <Typography
                                          key={idx}
                                          variant="caption"
                                          display="block"
                                        >
                                          • {warning}
                                        </Typography>
                                      )
                                    )}
                                  </Alert>
                                )}
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Proceso de Validación Actual */}
      {currentExecution && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Proceso de Validación en Curso
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              {validationSteps.map((step, index) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {currentExecution.logs[currentExecution.logs.length - 1]}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
