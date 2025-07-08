import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
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
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  Tooltip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Architecture as ArchitectureIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

import type { GuardianType } from '../types';

// Interfaces para el gestor de reglas
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
  createdAt: Date;
  updatedAt: Date;
  author: string;
  version: string;
}

interface ValidationSchedule {
  type: 'interval' | 'cron' | 'trigger';
  value: string | number;
  enabled: boolean;
}

interface ValidationRuleManagerProps {
  rules: ValidationRule[];
  onRuleCreate?: (rule: ValidationRule) => void;
  onRuleUpdate?: (rule: ValidationRule) => void;
  onRuleDelete?: (ruleId: string) => void;
  onRuleTest?: (rule: ValidationRule) => void;
}

export const ValidationRuleManager: React.FC<ValidationRuleManagerProps> = ({
  rules,
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete,
  onRuleTest,
}) => {
  // Estado del componente
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ValidationRule | null>(null);
  const [selectedGuardian, setSelectedGuardian] = useState<
    GuardianType | 'all'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<ValidationRule>>({
    name: '',
    description: '',
    guardianType: 'philosophy',
    priority: 'medium',
    enabled: true,
    autoFix: false,
    parameters: {},
    schedule: {
      type: 'interval',
      value: 300000, // 5 minutos por defecto
      enabled: true,
    },
  });

  // Configuraciones de parámetros por tipo de guardian
  const guardianParameterConfigs = {
    philosophy: [
      {
        key: 'minAlignmentScore',
        label: 'Puntuación Mínima de Alineación',
        type: 'slider',
        min: 0,
        max: 1,
        step: 0.1,
        default: 0.8,
      },
      {
        key: 'checkPrinciples',
        label: 'Principios a Verificar',
        type: 'multiselect',
        options: [
          'bienComun',
          'ayni',
          'cooperacion',
          'economiaSagrada',
          'metanoia',
          'neguentropia',
          'vocacion',
        ],
        default: ['bienComun', 'ayni'],
      },
      {
        key: 'validateImplementation',
        label: 'Validar Implementación',
        type: 'boolean',
        default: true,
      },
      {
        key: 'checkAntipatterns',
        label: 'Detectar Antipatrones',
        type: 'boolean',
        default: true,
      },
    ],
    architecture: [
      {
        key: 'checkDependencies',
        label: 'Verificar Dependencias',
        type: 'boolean',
        default: true,
      },
      {
        key: 'validateStructure',
        label: 'Validar Estructura',
        type: 'boolean',
        default: true,
      },
      {
        key: 'enforcePatterns',
        label: 'Patrones a Enforcar',
        type: 'multiselect',
        options: ['module', 'service', 'repository', 'factory', 'singleton'],
        default: ['module', 'service'],
      },
      {
        key: 'maxComplexity',
        label: 'Complejidad Máxima',
        type: 'number',
        min: 1,
        max: 20,
        default: 10,
      },
      {
        key: 'checkCircularDeps',
        label: 'Detectar Dependencias Circulares',
        type: 'boolean',
        default: true,
      },
    ],
    ux: [
      {
        key: 'wcagLevel',
        label: 'Nivel WCAG',
        type: 'select',
        options: ['A', 'AA', 'AAA'],
        default: 'AA',
      },
      {
        key: 'checkContrast',
        label: 'Verificar Contraste',
        type: 'boolean',
        default: true,
      },
      {
        key: 'validateAria',
        label: 'Validar ARIA',
        type: 'boolean',
        default: true,
      },
      {
        key: 'testKeyboardNav',
        label: 'Probar Navegación por Teclado',
        type: 'boolean',
        default: true,
      },
      {
        key: 'minContrastRatio',
        label: 'Ratio Mínimo de Contraste',
        type: 'slider',
        min: 1,
        max: 21,
        step: 0.1,
        default: 4.5,
      },
    ],
    performance: [
      {
        key: 'maxLCP',
        label: 'LCP Máximo (segundos)',
        type: 'slider',
        min: 0.5,
        max: 10,
        step: 0.1,
        default: 2.5,
      },
      {
        key: 'maxFID',
        label: 'FID Máximo (ms)',
        type: 'number',
        min: 10,
        max: 1000,
        default: 100,
      },
      {
        key: 'maxCLS',
        label: 'CLS Máximo',
        type: 'slider',
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.1,
      },
      {
        key: 'checkBundleSize',
        label: 'Verificar Tamaño del Bundle',
        type: 'boolean',
        default: true,
      },
      {
        key: 'maxBundleSize',
        label: 'Tamaño Máximo del Bundle (MB)',
        type: 'number',
        min: 1,
        max: 50,
        default: 5,
      },
    ],
  };

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

  // Filtrar reglas
  const filteredRules = rules.filter((rule) => {
    const matchesGuardian =
      selectedGuardian === 'all' || rule.guardianType === selectedGuardian;
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGuardian && matchesSearch;
  });

  // Abrir diálogo para crear nueva regla
  const handleCreateRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      guardianType: 'philosophy',
      priority: 'medium',
      enabled: true,
      autoFix: false,
      parameters: {},
      schedule: {
        type: 'interval',
        value: 300000,
        enabled: true,
      },
    });
    setIsDialogOpen(true);
  };

  // Abrir diálogo para editar regla
  const handleEditRule = (rule: ValidationRule) => {
    setEditingRule(rule);
    setFormData({ ...rule });
    setIsDialogOpen(true);
  };

  // Guardar regla
  const handleSaveRule = () => {
    if (!formData.name || !formData.description) return;

    const ruleToSave: ValidationRule = {
      id: editingRule?.id || `rule-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      guardianType: formData.guardianType!,
      priority: formData.priority!,
      enabled: formData.enabled!,
      autoFix: formData.autoFix!,
      schedule: formData.schedule,
      parameters: formData.parameters!,
      createdAt: editingRule?.createdAt || new Date(),
      updatedAt: new Date(),
      author: 'Sistema',
      version: editingRule ? `${parseFloat(editingRule.version) + 0.1}` : '1.0',
    };

    if (editingRule) {
      onRuleUpdate?.(ruleToSave);
    } else {
      onRuleCreate?.(ruleToSave);
    }

    setIsDialogOpen(false);
    setEditingRule(null);
  };

  // Renderizar campo de parámetro
  const renderParameterField = (config: any) => {
    const value = formData.parameters?.[config.key] ?? config.default;

    switch (config.type) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parameters: {
                      ...prev.parameters,
                      [config.key]: e.target.checked,
                    },
                  }))
                }
              />
            }
            label={config.label}
          />
        );

      case 'slider':
        return (
          <Box>
            <Typography variant="body2" gutterBottom>
              {config.label}
            </Typography>
            <Slider
              value={value}
              min={config.min}
              max={config.max}
              step={config.step}
              onChange={(_, newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  parameters: { ...prev.parameters, [config.key]: newValue },
                }))
              }
              valueLabelDisplay="auto"
              marks={[
                { value: config.min, label: config.min },
                { value: config.max, label: config.max },
              ]}
            />
          </Box>
        );

      case 'number':
        return (
          <TextField
            label={config.label}
            type="number"
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                parameters: {
                  ...prev.parameters,
                  [config.key]: parseFloat(e.target.value),
                },
              }))
            }
            inputProps={{ min: config.min, max: config.max }}
            fullWidth
          />
        );

      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{config.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parameters: {
                    ...prev.parameters,
                    [config.key]: e.target.value,
                  },
                }))
              }
              label={config.label}
            >
              {config.options.map((option: string) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl component="fieldset">
            <Typography variant="body2" gutterBottom>
              {config.label}
            </Typography>
            <FormGroup>
              {config.options.map((option: string) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(value || []).includes(option)}
                      onChange={(e) => {
                        const currentValues = value || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((v: string) => v !== option);
                        setFormData((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            [config.key]: newValues,
                          },
                        }));
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
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
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Gestor de Reglas de Validación
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateRule}
            >
              Nueva Regla
            </Button>
          </Box>

          {/* Filtros */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Buscar reglas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth size="small">
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
                  <MenuItem value="architecture">
                    Architecture Guardian
                  </MenuItem>
                  <MenuItem value="ux">UX Guardian</MenuItem>
                  <MenuItem value="performance">Performance Guardian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de Reglas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reglas Configuradas ({filteredRules.length})
          </Typography>

          {filteredRules.length === 0 ? (
            <Alert severity="info">
              No se encontraron reglas que coincidan con los filtros aplicados.
            </Alert>
          ) : (
            <List>
              {filteredRules.map((rule, index) => {
                const GuardianIcon = getGuardianIcon(rule.guardianType);
                const isExpanded = expandedRule === rule.id;

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
                            width: 40,
                            height: 40,
                          }}
                        >
                          <GuardianIcon />
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
                            <Chip
                              label={`v${rule.version}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {rule.description}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Actualizada: {rule.updatedAt.toLocaleDateString()}{' '}
                              • Por: {rule.author}
                            </Typography>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Switch
                            checked={rule.enabled}
                            onChange={(e) => {
                              const updatedRule = {
                                ...rule,
                                enabled: e.target.checked,
                                updatedAt: new Date(),
                              };
                              onRuleUpdate?.(updatedRule);
                            }}
                            size="small"
                          />

                          <Tooltip title="Probar regla">
                            <IconButton
                              size="small"
                              onClick={() => onRuleTest?.(rule)}
                              disabled={!rule.enabled}
                            >
                              <PlayIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Editar regla">
                            <IconButton
                              size="small"
                              onClick={() => handleEditRule(rule)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar regla">
                            <IconButton
                              size="small"
                              onClick={() => onRuleDelete?.(rule.id)}
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
                                setExpandedRule(isExpanded ? null : rule.id)
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
                                  Tipo: {rule.schedule?.type || 'No programada'}
                                </Typography>
                                <Typography variant="body2">
                                  Intervalo:{' '}
                                  {rule.schedule?.type === 'interval'
                                    ? `${(rule.schedule.value as number) / 60000} minutos`
                                    : rule.schedule?.value || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  Estado:{' '}
                                  {rule.schedule?.enabled
                                    ? 'Activa'
                                    : 'Inactiva'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Parámetros
                              </Typography>
                              <Box sx={{ ml: 2 }}>
                                {Object.entries(rule.parameters).map(
                                  ([key, value]) => (
                                    <Typography key={key} variant="body2">
                                      {key}:{' '}
                                      {Array.isArray(value)
                                        ? value.join(', ')
                                        : String(value)}
                                    </Typography>
                                  )
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Box>
                    )}

                    {index < filteredRules.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
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
          {editingRule
            ? 'Editar Regla de Validación'
            : 'Nueva Regla de Validación'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Información Básica */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Información Básica
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre de la Regla"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Guardian</InputLabel>
                <Select
                  value={formData.guardianType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      guardianType: e.target.value as GuardianType,
                    }))
                  }
                  label="Guardian"
                >
                  <MenuItem value="philosophy">Philosophy Guardian</MenuItem>
                  <MenuItem value="architecture">
                    Architecture Guardian
                  </MenuItem>
                  <MenuItem value="ux">UX Guardian</MenuItem>
                  <MenuItem value="performance">Performance Guardian</MenuItem>
                </Select>
              </FormControl>
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
                rows={2}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value as any,
                    }))
                  }
                  label="Prioridad"
                >
                  <MenuItem value="low">Baja</MenuItem>
                  <MenuItem value="medium">Media</MenuItem>
                  <MenuItem value="high">Alta</MenuItem>
                  <MenuItem value="critical">Crítica</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
                label="Regla Habilitada"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoFix}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        autoFix: e.target.checked,
                      }))
                    }
                  />
                }
                label="Auto-corrección"
              />
            </Grid>

            {/* Parámetros específicos del Guardian */}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Parámetros de {formData.guardianType?.charAt(0).toUpperCase()}
                {formData.guardianType?.slice(1)} Guardian
              </Typography>
            </Grid>

            {formData.guardianType &&
              guardianParameterConfigs[formData.guardianType].map(
                (config, index) => (
                  <Grid key={config.key} size={{ xs: 12, md: 6 }}>
                    {renderParameterField(config)}
                  </Grid>
                )
              )}

            {/* Programación */}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Programación de Ejecución
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Programación</InputLabel>
                <Select
                  value={formData.schedule?.type || 'interval'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        type: e.target.value as any,
                      },
                    }))
                  }
                  label="Tipo de Programación"
                >
                  <MenuItem value="interval">Intervalo</MenuItem>
                  <MenuItem value="cron">Cron</MenuItem>
                  <MenuItem value="trigger">Trigger</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {formData.schedule?.type === 'interval' ? (
                <TextField
                  label="Intervalo (minutos)"
                  type="number"
                  value={(formData.schedule.value as number) / 60000}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        value: parseInt(e.target.value) * 60000,
                      },
                    }))
                  }
                  fullWidth
                  inputProps={{ min: 1 }}
                />
              ) : (
                <TextField
                  label="Valor de Programación"
                  value={formData.schedule?.value || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule, value: e.target.value },
                    }))
                  }
                  fullWidth
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.schedule?.enabled ?? true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                  />
                }
                label="Programación Habilitada"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleSaveRule}
            variant="contained"
            disabled={!formData.name || !formData.description}
          >
            {editingRule ? 'Actualizar' : 'Crear'} Regla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
