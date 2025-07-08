import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Collapse,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Psychology as PsychologyIcon,
  Architecture as ArchitectureIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AutoFixHigh as AutoFixIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

import type { GuardianType, ValidationResult } from '../types';

// Interfaces para resultados de validación
interface ValidationExecution {
  id: string;
  ruleId: string;
  ruleName: string;
  guardianType: GuardianType;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result?: ValidationResult;
  progress: number;
  logs: string[];
  autoFixApplied?: boolean;
  metrics?: ValidationMetrics;
}

interface ValidationMetrics {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  coveragePercentage: number;
  performanceImpact: number;
  qualityScore: number;
}

interface ValidationResultsProps {
  executions: ValidationExecution[];
  onRetryValidation?: (execution: ValidationExecution) => void;
  onApplyAutoFix?: (execution: ValidationExecution) => void;
  onExportResults?: (executions: ValidationExecution[]) => void;
  compact?: boolean;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  executions,
  onRetryValidation,
  onApplyAutoFix,
  onExportResults,
  compact = false,
}) => {
  // Estado del componente
  const [expandedExecution, setExpandedExecution] = useState<string | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGuardian, setFilterGuardian] = useState<GuardianType | 'all'>(
    'all'
  );
  const [selectedExecution, setSelectedExecution] =
    useState<ValidationExecution | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

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

  // Obtener icono de estado
  const getStatusIcon = (execution: ValidationExecution) => {
    if (execution.status === 'running') {
      return <TimelineIcon sx={{ color: '#2196F3' }} />;
    }

    if (execution.status === 'failed' || execution.status === 'cancelled') {
      return <ErrorIcon sx={{ color: '#F44336' }} />;
    }

    if (execution.result) {
      if (execution.result.errors.length > 0) {
        return <ErrorIcon sx={{ color: '#F44336' }} />;
      }
      if (execution.result.warnings.length > 0) {
        return <WarningIcon sx={{ color: '#FF9800' }} />;
      }
      return <CheckIcon sx={{ color: '#4CAF50' }} />;
    }

    return <InfoIcon sx={{ color: '#757575' }} />;
  };

  // Obtener color de estado
  const getStatusColor = (execution: ValidationExecution) => {
    if (execution.status === 'running') return '#2196F3';
    if (execution.status === 'failed' || execution.status === 'cancelled')
      return '#F44336';

    if (execution.result) {
      if (execution.result.errors.length > 0) return '#F44336';
      if (execution.result.warnings.length > 0) return '#FF9800';
      return '#4CAF50';
    }

    return '#757575';
  };

  // Filtrar ejecuciones
  const filteredExecutions = useMemo(() => {
    return executions.filter((execution) => {
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'success' && execution.result?.isValid) ||
        (filterStatus === 'error' &&
          (execution.result?.errors.length ?? 0) > 0) ||
        (filterStatus === 'warning' &&
          (execution.result?.warnings.length ?? 0) > 0) ||
        (filterStatus === 'running' && execution.status === 'running');

      const matchesGuardian =
        filterGuardian === 'all' || execution.guardianType === filterGuardian;

      return matchesStatus && matchesGuardian;
    });
  }, [executions, filterStatus, filterGuardian]);

  // Calcular métricas generales
  const overallMetrics = useMemo(() => {
    const completed = executions.filter((e) => e.status === 'completed');
    const successful = completed.filter((e) => e.result?.isValid);
    const withErrors = completed.filter(
      (e) => (e.result?.errors.length ?? 0) > 0
    );
    const withWarnings = completed.filter(
      (e) => (e.result?.warnings.length ?? 0) > 0
    );

    return {
      total: executions.length,
      completed: completed.length,
      successful: successful.length,
      withErrors: withErrors.length,
      withWarnings: withWarnings.length,
      successRate:
        completed.length > 0 ? (successful.length / completed.length) * 100 : 0,
      avgDuration:
        completed.length > 0
          ? completed.reduce((sum, e) => sum + (e.duration || 0), 0) /
            completed.length
          : 0,
    };
  }, [executions]);

  // Toggle expansión de ejecución
  const toggleExpanded = (executionId: string) => {
    setExpandedExecution(
      expandedExecution === executionId ? null : executionId
    );
  };

  // Abrir diálogo de detalles
  const openDetailDialog = (execution: ValidationExecution) => {
    setSelectedExecution(execution);
    setDetailDialogOpen(true);
  };

  // Formatear duración
  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  return (
    <Box>
      {/* Métricas Generales */}
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
              Resultados de Validación
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => onExportResults?.(filteredExecutions)}
                disabled={filteredExecutions.length === 0}
              >
                Exportar
              </Button>
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
              >
                Actualizar
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {overallMetrics.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {overallMetrics.successful}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Exitosas
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">
                  {overallMetrics.withErrors}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Con Errores
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {overallMetrics.withWarnings}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Con Advertencias
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {overallMetrics.successRate.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tasa de Éxito
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="text.primary">
                  {formatDuration(overallMetrics.avgDuration)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Duración Promedio
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="all">Todos los Estados</MenuItem>
                  <MenuItem value="success">Exitosas</MenuItem>
                  <MenuItem value="error">Con Errores</MenuItem>
                  <MenuItem value="warning">Con Advertencias</MenuItem>
                  <MenuItem value="running">En Ejecución</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Guardian</InputLabel>
                <Select
                  value={filterGuardian}
                  onChange={(e) =>
                    setFilterGuardian(e.target.value as GuardianType | 'all')
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
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {filteredExecutions.length} de {executions.length}{' '}
                resultados
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de Resultados */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historial de Validaciones
          </Typography>

          {filteredExecutions.length === 0 ? (
            <Alert severity="info">
              No se encontraron resultados que coincidan con los filtros
              aplicados.
            </Alert>
          ) : (
            <List>
              {filteredExecutions.map((execution, index) => {
                const GuardianIcon = getGuardianIcon(execution.guardianType);
                const isExpanded = expandedExecution === execution.id;
                const statusIcon = getStatusIcon(execution);

                return (
                  <React.Fragment key={execution.id}>
                    <ListItem
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 1,
                        borderLeft: `4px solid ${getStatusColor(execution)}`,
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: getGuardianColor(execution.guardianType),
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
                              {execution.ruleName}
                            </Typography>
                            {statusIcon}
                            <Chip
                              label={execution.status.toUpperCase()}
                              size="small"
                              color={
                                execution.status === 'completed'
                                  ? 'success'
                                  : execution.status === 'running'
                                    ? 'info'
                                    : execution.status === 'failed'
                                      ? 'error'
                                      : 'default'
                              }
                              variant="outlined"
                            />
                            {execution.autoFixApplied && (
                              <Chip
                                label="AUTO-FIX APLICADO"
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Iniciada: {execution.startTime.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Duración: {formatDuration(execution.duration)} •
                              Guardian: {execution.guardianType}
                            </Typography>
                            {execution.result && (
                              <Box sx={{ mt: 1 }}>
                                {execution.result.errors.length > 0 && (
                                  <Chip
                                    label={`${execution.result.errors.length} errores`}
                                    size="small"
                                    color="error"
                                    sx={{ mr: 0.5 }}
                                  />
                                )}
                                {execution.result.warnings.length > 0 && (
                                  <Chip
                                    label={`${execution.result.warnings.length} advertencias`}
                                    size="small"
                                    color="warning"
                                    sx={{ mr: 0.5 }}
                                  />
                                )}
                                {execution.result.isValid && (
                                  <Chip
                                    label="Validación exitosa"
                                    size="small"
                                    color="success"
                                  />
                                )}
                              </Box>
                            )}
                            {execution.status === 'running' && (
                              <Box sx={{ mt: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={execution.progress}
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {execution.progress}% completado
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        {execution.status === 'completed' &&
                          execution.result &&
                          !execution.result.isValid && (
                            <Tooltip title="Reintentar validación">
                              <IconButton
                                size="small"
                                onClick={() => onRetryValidation?.(execution)}
                              >
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          )}

                        {execution.status === 'completed' &&
                          execution.result &&
                          !execution.result.isValid &&
                          !execution.autoFixApplied && (
                            <Tooltip title="Aplicar auto-corrección">
                              <IconButton
                                size="small"
                                onClick={() => onApplyAutoFix?.(execution)}
                                color="secondary"
                              >
                                <AutoFixIcon />
                              </IconButton>
                            </Tooltip>
                          )}

                        <Tooltip title="Ver detalles completos">
                          <IconButton
                            size="small"
                            onClick={() => openDetailDialog(execution)}
                          >
                            <AssessmentIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            isExpanded ? 'Ocultar detalles' : 'Ver detalles'
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleExpanded(execution.id)}
                          >
                            {isExpanded ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItem>

                    {/* Detalles expandidos */}
                    <Collapse in={isExpanded}>
                      <Box sx={{ pl: 8, pr: 2, pb: 2 }}>
                        <Paper sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            {/* Errores */}
                            {execution.result?.errors.length > 0 && (
                              <Grid size={{ xs: 12 }}>
                                <Alert severity="error">
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                  >
                                    Errores Detectados:
                                  </Typography>
                                  {execution.result.errors.map((error, idx) => (
                                    <Typography key={idx} variant="body2">
                                      • {error}
                                    </Typography>
                                  ))}
                                </Alert>
                              </Grid>
                            )}

                            {/* Advertencias */}
                            {execution.result?.warnings.length > 0 && (
                              <Grid size={{ xs: 12 }}>
                                <Alert severity="warning">
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                  >
                                    Advertencias:
                                  </Typography>
                                  {execution.result.warnings.map(
                                    (warning, idx) => (
                                      <Typography key={idx} variant="body2">
                                        • {warning}
                                      </Typography>
                                    )
                                  )}
                                </Alert>
                              </Grid>
                            )}

                            {/* Logs de ejecución */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Logs de Ejecución
                              </Typography>
                              <Box
                                sx={{
                                  maxHeight: 200,
                                  overflow: 'auto',
                                  bgcolor: '#f5f5f5',
                                  p: 1,
                                  borderRadius: 1,
                                  fontFamily: 'monospace',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {execution.logs.map((log, idx) => (
                                  <Typography
                                    key={idx}
                                    variant="caption"
                                    display="block"
                                  >
                                    {log}
                                  </Typography>
                                ))}
                              </Box>
                            </Grid>

                            {/* Métricas */}
                            {execution.metrics && (
                              <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Métricas de Validación
                                </Typography>
                                <TableContainer
                                  component={Paper}
                                  variant="outlined"
                                >
                                  <Table size="small">
                                    <TableBody>
                                      <TableRow>
                                        <TableCell>
                                          Verificaciones Totales
                                        </TableCell>
                                        <TableCell align="right">
                                          {execution.metrics.totalChecks}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>
                                          Verificaciones Exitosas
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          sx={{ color: '#4CAF50' }}
                                        >
                                          {execution.metrics.passedChecks}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>
                                          Verificaciones Fallidas
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          sx={{ color: '#F44336' }}
                                        >
                                          {execution.metrics.failedChecks}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>Cobertura</TableCell>
                                        <TableCell align="right">
                                          {execution.metrics.coveragePercentage.toFixed(
                                            1
                                          )}
                                          %
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>
                                          Puntuación de Calidad
                                        </TableCell>
                                        <TableCell align="right">
                                          {execution.metrics.qualityScore.toFixed(
                                            1
                                          )}
                                          /10
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      </Box>
                    </Collapse>

                    {index < filteredExecutions.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Detalles */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Detalles de Validación: {selectedExecution?.ruleName}
        </DialogTitle>
        <DialogContent>
          {selectedExecution && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Información General
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Regla ID</TableCell>
                        <TableCell>{selectedExecution.ruleId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Guardian</TableCell>
                        <TableCell>{selectedExecution.guardianType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Estado</TableCell>
                        <TableCell>{selectedExecution.status}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Inicio</TableCell>
                        <TableCell>
                          {selectedExecution.startTime.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fin</TableCell>
                        <TableCell>
                          {selectedExecution.endTime?.toLocaleString() || 'N/A'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Duración</TableCell>
                        <TableCell>
                          {formatDuration(selectedExecution.duration)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Resultado de Validación
                  </Typography>
                  {selectedExecution.result ? (
                    <Box>
                      <Alert
                        severity={
                          selectedExecution.result.isValid ? 'success' : 'error'
                        }
                        sx={{ mb: 2 }}
                      >
                        {selectedExecution.result.isValid
                          ? 'Validación completada exitosamente'
                          : 'Validación completada con problemas'}
                      </Alert>

                      {selectedExecution.result.errors.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            color="error"
                            gutterBottom
                          >
                            Errores:
                          </Typography>
                          {selectedExecution.result.errors.map((error, idx) => (
                            <Typography
                              key={idx}
                              variant="body2"
                              sx={{ ml: 2 }}
                            >
                              • {error}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {selectedExecution.result.warnings.length > 0 && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="warning.main"
                            gutterBottom
                          >
                            Advertencias:
                          </Typography>
                          {selectedExecution.result.warnings.map(
                            (warning, idx) => (
                              <Typography
                                key={idx}
                                variant="body2"
                                sx={{ ml: 2 }}
                              >
                                • {warning}
                              </Typography>
                            )
                          )}
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Alert severity="info">
                      No hay resultados disponibles para esta ejecución.
                    </Alert>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Logs Completos
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      maxHeight: 300,
                      overflow: 'auto',
                    }}
                  >
                    {selectedExecution.logs.map((log, idx) => (
                      <Typography key={idx} variant="body2" display="block">
                        [{idx + 1}] {log}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Cerrar</Button>
          {selectedExecution?.status === 'completed' &&
            selectedExecution?.result &&
            !selectedExecution.result.isValid && (
              <Button
                onClick={() => {
                  onRetryValidation?.(selectedExecution);
                  setDetailDialogOpen(false);
                }}
                variant="contained"
              >
                Reintentar Validación
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
