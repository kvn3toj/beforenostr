import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Psychology as PhilosophyIcon,
  Architecture as ArchitectureIcon,
  Speed as PerformanceIcon,
  Accessibility as UXIcon,
  AutoAwesome as CosmicIcon,
} from '@mui/icons-material';
import { CosmicBrain } from '../../../CosmicBrain';
import { AnalysisReport, GuardianType } from '../../../types';
import { useCosmicBrainData } from '../hooks/useCosmicBrainData';
import {
  formatPhilosophyScore,
  calculateOverallHealthStatus,
} from '../utils/dashboardHelpers';

/**
 * 🌌 Cosmic Dashboard - Centro de Control del AI Cosmic Brain
 *
 * Componente principal que proporciona una vista unificada del estado
 * y métricas del sistema AI Cosmic Brain. Diseñado siguiendo principios
 * de código mantenible y "Naming as a Process" para máxima claridad.
 *
 * Características principales:
 * - Monitoreo en tiempo real de todos los guardians
 * - Visualización de métricas filosóficas CoomÜnity
 * - Estado de salud general del sistema
 * - Alertas y recomendaciones prioritarias
 * - Diseño responsive y accesible
 *
 * Filosofía integrada:
 * - Bien Común: Dashboard accesible para todo el equipo
 * - Ayni: Balance entre información y simplicidad
 * - Neguentropía: Orden visual que facilita la comprensión
 */

interface CosmicDashboardProps {
  /** Instancia del Cosmic Brain para obtener datos */
  cosmicBrain: CosmicBrain;
  /** Intervalo de actualización en milisegundos */
  refreshIntervalMs?: number;
  /** Callback cuando se detecta una alerta crítica */
  onCriticalAlert?: (alert: CriticalAlert) => void;
  /** Configuración de tema visual */
  themeConfig?: DashboardThemeConfig;
}

interface CriticalAlert {
  id: string;
  guardianType: GuardianType;
  severity: 'critical' | 'high';
  message: string;
  timestamp: Date;
}

interface DashboardThemeConfig {
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
}

interface GuardianStatusCardData {
  type: GuardianType;
  name: string;
  icon: React.ComponentType;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastAnalysis: Date | null;
  criticalIssues: number;
}

/**
 * 🎯 Componente Principal del Dashboard
 */
export const CosmicDashboard: React.FC<CosmicDashboardProps> = ({
  cosmicBrain,
  refreshIntervalMs = 30000, // 30 segundos por defecto
  onCriticalAlert,
  themeConfig = {
    primaryColor: '#1976d2',
    accentColor: '#ff6b35',
    darkMode: false,
  },
}) => {
  // ============================================================================
  // 🔄 State Management con nombres descriptivos
  // ============================================================================

  const [isDashboardLoading, setIsDashboardLoading] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] = useState<Date | null>(
    null
  );

  // Hook personalizado para datos del Cosmic Brain
  const {
    guardianReports,
    philosophyAlignment,
    systemHealthMetrics,
    isDataLoading,
    dataError,
    refreshData,
  } = useCosmicBrainData(cosmicBrain, refreshIntervalMs);

  // ============================================================================
  // 📊 Computed Values con nombres que explican su propósito
  // ============================================================================

  const guardianStatusCards = useMemo<GuardianStatusCardData[]>(() => {
    return [
      {
        type: 'philosophy',
        name: 'Philosophy Guardian',
        icon: PhilosophyIcon,
        score: philosophyAlignment?.overallScore || 0,
        status: calculateGuardianStatus(philosophyAlignment?.overallScore || 0),
        lastAnalysis: guardianReports.philosophy?.timestamp || null,
        criticalIssues: countCriticalIssues(guardianReports.philosophy),
      },
      {
        type: 'architecture',
        name: 'Architecture Guardian',
        icon: ArchitectureIcon,
        score: extractScoreFromReport(
          guardianReports.architecture,
          'structuralHealth'
        ),
        status: calculateGuardianStatus(
          extractScoreFromReport(
            guardianReports.architecture,
            'structuralHealth'
          )
        ),
        lastAnalysis: guardianReports.architecture?.timestamp || null,
        criticalIssues: countCriticalIssues(guardianReports.architecture),
      },
      {
        type: 'ux',
        name: 'UX Guardian',
        icon: UXIcon,
        score: extractScoreFromReport(guardianReports.ux, 'overallUXScore'),
        status: calculateGuardianStatus(
          extractScoreFromReport(guardianReports.ux, 'overallUXScore')
        ),
        lastAnalysis: guardianReports.ux?.timestamp || null,
        criticalIssues: countCriticalIssues(guardianReports.ux),
      },
      {
        type: 'performance',
        name: 'Performance Guardian',
        icon: PerformanceIcon,
        score: extractScoreFromReport(
          guardianReports.performance,
          'overallPerformance'
        ),
        status: calculateGuardianStatus(
          extractScoreFromReport(
            guardianReports.performance,
            'overallPerformance'
          )
        ),
        lastAnalysis: guardianReports.performance?.timestamp || null,
        criticalIssues: countCriticalIssues(guardianReports.performance),
      },
    ];
  }, [guardianReports, philosophyAlignment]);

  const overallSystemHealth = useMemo(() => {
    return calculateOverallHealthStatus(guardianStatusCards);
  }, [guardianStatusCards]);

  const totalCriticalIssues = useMemo(() => {
    return guardianStatusCards.reduce(
      (total, guardian) => total + guardian.criticalIssues,
      0
    );
  }, [guardianStatusCards]);

  // ============================================================================
  // 🔔 Effect Hooks con propósitos específicos
  // ============================================================================

  // Manejo de actualizaciones de datos
  useEffect(() => {
    if (!isDataLoading && !dataError) {
      setIsDashboardLoading(false);
      setLastSuccessfulUpdate(new Date());
      setDashboardError(null);
    } else if (dataError) {
      setDashboardError(dataError);
      setIsDashboardLoading(false);
    }
  }, [isDataLoading, dataError]);

  // Detección y notificación de alertas críticas
  useEffect(() => {
    if (totalCriticalIssues > 0 && onCriticalAlert) {
      const criticalAlerts = generateCriticalAlerts(guardianStatusCards);
      criticalAlerts.forEach((alert) => onCriticalAlert(alert));
    }
  }, [totalCriticalIssues, guardianStatusCards, onCriticalAlert]);

  // ============================================================================
  // 🎯 Event Handlers con nombres que describen la acción
  // ============================================================================

  const handleManualRefresh = useCallback(async () => {
    try {
      setIsDashboardLoading(true);
      await refreshData();
    } catch (error) {
      setDashboardError(`Error al actualizar: ${error}`);
    }
  }, [refreshData]);

  const handleGuardianCardClick = useCallback((guardianType: GuardianType) => {
    // Navegación a vista detallada del guardian
    console.log(`Navegando a vista detallada de ${guardianType}`);
    // TODO: Implementar navegación
  }, []);

  // ============================================================================
  // 🎨 Render Methods para componentes complejos
  // ============================================================================

  const renderSystemHealthOverview = () => (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <CosmicIcon sx={{ mr: 1, color: themeConfig.primaryColor }} />
          <Typography variant="h5" component="h2">
            Estado General del Sistema
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              color={getHealthStatusColor(overallSystemHealth.status)}
            >
              {(overallSystemHealth.score * 100).toFixed(1)}%
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Salud General del AI Cosmic Brain
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Alineación Filosófica CoomÜnity
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(philosophyAlignment?.overallScore || 0) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="textSecondary">
                {formatPhilosophyScore(philosophyAlignment?.overallScore || 0)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {totalCriticalIssues > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {totalCriticalIssues} problema(s) crítico(s) detectado(s) que
            requieren atención inmediata.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderGuardianStatusGrid = () => (
    <Grid container spacing={3}>
      {guardianStatusCards.map((guardian) => (
        <Grid item xs={12} sm={6} md={3} key={guardian.type}>
          <Card
            elevation={1}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-2px)',
              },
            }}
            onClick={() => handleGuardianCardClick(guardian.type)}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <guardian.icon
                  sx={{ mr: 1, color: getStatusColor(guardian.status) }}
                />
                <Typography variant="h6" component="h3" noWrap>
                  {guardian.name}
                </Typography>
              </Box>

              <Typography
                variant="h4"
                color={getStatusColor(guardian.status)}
                gutterBottom
              >
                {(guardian.score * 100).toFixed(0)}%
              </Typography>

              <Chip
                label={getStatusLabel(guardian.status)}
                color={getStatusChipColor(guardian.status)}
                size="small"
                sx={{ mb: 1 }}
              />

              {guardian.criticalIssues > 0 && (
                <Typography variant="body2" color="error">
                  {guardian.criticalIssues} problema(s) crítico(s)
                </Typography>
              )}

              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
              >
                Última análisis: {formatLastAnalysisTime(guardian.lastAnalysis)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDashboardHeader = () => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          🌌 AI Cosmic Brain Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Centro de Control para el Sistema de Context Engineering CoomÜnity
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        {lastSuccessfulUpdate && (
          <Typography variant="caption" color="textSecondary">
            Última actualización: {lastSuccessfulUpdate.toLocaleTimeString()}
          </Typography>
        )}

        <Chip
          label={isDashboardLoading ? 'Actualizando...' : 'En línea'}
          color={isDashboardLoading ? 'default' : 'success'}
          variant="outlined"
        />
      </Box>
    </Box>
  );

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  if (dashboardError) {
    return (
      <Box p={3}>
        <Alert severity="error">Error en el dashboard: {dashboardError}</Alert>
      </Box>
    );
  }

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: themeConfig.darkMode ? '#121212' : '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      {renderDashboardHeader()}
      {renderSystemHealthOverview()}
      {renderGuardianStatusGrid()}

      {isDashboardLoading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
        </Box>
      )}
    </Box>
  );
};

// ============================================================================
// 🛠️ Helper Functions con nombres descriptivos
// ============================================================================

/**
 * Calcula el estado de un guardian basado en su score
 */
function calculateGuardianStatus(
  score: number
): 'excellent' | 'good' | 'warning' | 'critical' {
  if (score >= 0.9) return 'excellent';
  if (score >= 0.7) return 'good';
  if (score >= 0.5) return 'warning';
  return 'critical';
}

/**
 * Extrae un score específico de un reporte de guardian
 */
function extractScoreFromReport(
  report: AnalysisReport | undefined,
  metricKey: string
): number {
  if (!report || !report.metrics) return 0;
  return report.metrics[metricKey] || 0;
}

/**
 * Cuenta problemas críticos en un reporte
 */
function countCriticalIssues(report: AnalysisReport | undefined): number {
  if (!report || !report.recommendations) return 0;
  return report.recommendations.filter((rec) => rec.severity === 'critical')
    .length;
}

/**
 * Genera alertas críticas basadas en el estado de los guardians
 */
function generateCriticalAlerts(
  guardians: GuardianStatusCardData[]
): CriticalAlert[] {
  return guardians
    .filter((guardian) => guardian.criticalIssues > 0)
    .map((guardian) => ({
      id: `critical-${guardian.type}-${Date.now()}`,
      guardianType: guardian.type,
      severity: 'critical' as const,
      message: `${guardian.name} detectó ${guardian.criticalIssues} problema(s) crítico(s)`,
      timestamp: new Date(),
    }));
}

/**
 * Obtiene el color apropiado para un estado de salud
 */
function getHealthStatusColor(status: string): string {
  switch (status) {
    case 'excellent':
      return '#4caf50';
    case 'good':
      return '#8bc34a';
    case 'warning':
      return '#ff9800';
    case 'critical':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
}

/**
 * Obtiene el color apropiado para un estado de guardian
 */
function getStatusColor(status: string): string {
  return getHealthStatusColor(status);
}

/**
 * Obtiene la etiqueta de texto para un estado
 */
function getStatusLabel(status: string): string {
  switch (status) {
    case 'excellent':
      return 'Excelente';
    case 'good':
      return 'Bueno';
    case 'warning':
      return 'Atención';
    case 'critical':
      return 'Crítico';
    default:
      return 'Desconocido';
  }
}

/**
 * Obtiene el color del chip para un estado
 */
function getStatusChipColor(
  status: string
): 'success' | 'warning' | 'error' | 'default' {
  switch (status) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Formatea el tiempo de la última análisis de manera legible
 */
function formatLastAnalysisTime(lastAnalysis: Date | null): string {
  if (!lastAnalysis) return 'Nunca';

  const now = new Date();
  const diffMs = now.getTime() - lastAnalysis.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Hace menos de 1 minuto';
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto(s)`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora(s)`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} día(s)`;
}

export default CosmicDashboard;
