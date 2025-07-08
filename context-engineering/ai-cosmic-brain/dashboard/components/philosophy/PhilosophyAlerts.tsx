import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Chip,
  Button,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Lightbulb as RecommendationIcon,
  Psychology as PhilosophyIcon,
  Favorite as BienComunIcon,
  Balance as AyniIcon,
  Group as CooperacionIcon,
  Diamond as EconomiaSagradaIcon,
  Transform as MetanoiaIcon,
  AutoAwesome as NeguentropiaIcon,
  Star as VocacionIcon,
} from '@mui/icons-material';
import { useCosmicEvent } from '../providers/CosmicWebSocketProvider';
import { CoomUnityPhilosophyMetrics, AlertSeverity } from '../types';
import { formatRelativeTime } from '../utils/dashboardHelpers';

/**
 * 🚨 PhilosophyAlerts - Alertas de Alineación Filosófica
 *
 * Componente especializado para mostrar alertas y notificaciones
 * relacionadas con la alineación filosófica CoomÜnity.
 *
 * Tipos de alertas:
 * - Desalineación crítica de principios
 * - Degradación de alineación temporal
 * - Detección de antipatrones
 * - Oportunidades de mejora
 * - Logros de alineación
 *
 * Características:
 * - Alertas en tiempo real vía WebSocket
 * - Priorización por severidad e impacto
 * - Acciones recomendadas específicas
 * - Tracking de resolución
 * - Integración con Philosophy Guardian
 *
 * Filosofía aplicada:
 * - Transparencia: Visibilidad clara de problemas filosóficos
 * - Metanöia: Facilita la transformación consciente
 * - Bien Común: Herramienta que beneficia la coherencia del proyecto
 */

interface PhilosophyAlertsProps {
  /** Métricas actuales de filosofía */
  currentMetrics?: CoomUnityPhilosophyMetrics;
  /** Máximo número de alertas a mostrar */
  maxAlerts?: number;
  /** Callback para acción en alerta */
  onAlertAction?: (alertId: string, action: string) => void;
  /** Callback para cerrar alerta */
  onDismissAlert?: (alertId: string) => void;
  /** Mostrar solo alertas críticas */
  criticalOnly?: boolean;
}

// ============================================================================
// 🎯 Types and Interfaces
// ============================================================================

interface PhilosophyAlert {
  id: string;
  type: PhilosophyAlertType;
  severity: AlertSeverity;
  principle: string;
  title: string;
  message: string;
  details?: string;
  recommendations: string[];
  actions: PhilosophyAlertAction[];
  timestamp: Date;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  metadata?: {
    currentScore?: number;
    previousScore?: number;
    threshold?: number;
    impact?: 'high' | 'medium' | 'low';
    urgency?: 'immediate' | 'soon' | 'when_possible';
  };
}

type PhilosophyAlertType =
  | 'critical_misalignment'
  | 'degradation_detected'
  | 'antipattern_found'
  | 'improvement_opportunity'
  | 'alignment_achievement'
  | 'threshold_crossed'
  | 'consistency_issue';

interface PhilosophyAlertAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'info';
  icon?: React.ReactNode;
  description?: string;
}

// ============================================================================
// 🎨 Configuration
// ============================================================================

const PRINCIPLE_ICONS = {
  bienComun: <BienComunIcon />,
  ayni: <AyniIcon />,
  cooperacion: <CooperacionIcon />,
  economiaSagrada: <EconomiaSagradaIcon />,
  metanoia: <MetanoiaIcon />,
  neguentropia: <NeguentropiaIcon />,
  vocacion: <VocacionIcon />,
  general: <PhilosophyIcon />,
};

const PRINCIPLE_NAMES = {
  bienComun: 'Bien Común',
  ayni: 'Ayni',
  cooperacion: 'Cooperación',
  economiaSagrada: 'Economía Sagrada',
  metanoia: 'Metanöia',
  neguentropia: 'Neguentropía',
  vocacion: 'Vocación',
  general: 'General',
};

const ALERT_TYPE_CONFIG = {
  critical_misalignment: {
    icon: <ErrorIcon />,
    color: '#f44336',
    label: 'Desalineación Crítica',
  },
  degradation_detected: {
    icon: <WarningIcon />,
    color: '#ff9800',
    label: 'Degradación Detectada',
  },
  antipattern_found: {
    icon: <WarningIcon />,
    color: '#ff5722',
    label: 'Antipatrón Encontrado',
  },
  improvement_opportunity: {
    icon: <InfoIcon />,
    color: '#2196f3',
    label: 'Oportunidad de Mejora',
  },
  alignment_achievement: {
    icon: <CheckIcon />,
    color: '#4caf50',
    label: 'Logro de Alineación',
  },
  threshold_crossed: {
    icon: <WarningIcon />,
    color: '#ff9800',
    label: 'Umbral Cruzado',
  },
  consistency_issue: {
    icon: <InfoIcon />,
    color: '#9c27b0',
    label: 'Problema de Consistencia',
  },
};

// ============================================================================
// 🌟 Main Component
// ============================================================================

export const PhilosophyAlerts: React.FC<PhilosophyAlertsProps> = ({
  currentMetrics,
  maxAlerts = 10,
  onAlertAction,
  onDismissAlert,
  criticalOnly = false,
}) => {
  // ============================================================================
  // 🔄 State Management
  // ============================================================================

  const [alerts, setAlerts] = useState<PhilosophyAlert[]>([]);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  // ============================================================================
  // 📡 Real-time Updates
  // ============================================================================

  useCosmicEvent(
    'philosophy_alert',
    (event) => {
      if (event.data?.alert) {
        const newAlert: PhilosophyAlert = {
          ...event.data.alert,
          timestamp: new Date(event.timestamp),
        };

        setAlerts((prev) => {
          const updated = [
            newAlert,
            ...prev.filter((a) => a.id !== newAlert.id),
          ];
          return updated.slice(0, maxAlerts);
        });
      }
    },
    [maxAlerts]
  );

  useCosmicEvent(
    'philosophy_alignment_change',
    (event) => {
      if (event.data?.philosophyMetrics && currentMetrics) {
        // Generate alerts based on metric changes
        const generatedAlerts = generateAlertsFromMetrics(
          event.data.philosophyMetrics,
          currentMetrics
        );

        if (generatedAlerts.length > 0) {
          setAlerts((prev) => {
            const updated = [...generatedAlerts, ...prev];
            return updated.slice(0, maxAlerts);
          });
        }
      }
    },
    [currentMetrics, maxAlerts]
  );

  // ============================================================================
  // 📊 Data Processing
  // ============================================================================

  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    if (criticalOnly) {
      filtered = filtered.filter(
        (alert) => alert.severity === 'critical' || alert.severity === 'high'
      );
    }

    return filtered
      .filter((alert) => !alert.isAcknowledged)
      .sort((a, b) => {
        // Sort by severity first, then by timestamp
        const severityOrder = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
          info: 0,
        };
        const severityDiff =
          severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0) return severityDiff;

        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }, [alerts, criticalOnly]);

  const alertStats = useMemo(() => {
    const stats = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      total: filteredAlerts.length,
    };

    filteredAlerts.forEach((alert) => {
      stats[alert.severity]++;
    });

    return stats;
  }, [filteredAlerts]);

  // ============================================================================
  // 🎯 Event Handlers
  // ============================================================================

  const handleToggleExpand = (alertId: string) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  const handleAlertAction = (alertId: string, actionId: string) => {
    if (onAlertAction) {
      onAlertAction(alertId, actionId);
    }

    // Mark alert as acknowledged
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, isAcknowledged: true, acknowledgedAt: new Date() }
          : alert
      )
    );
  };

  const handleDismissAlert = (alertId: string) => {
    if (onDismissAlert) {
      onDismissAlert(alertId);
    }

    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  // ============================================================================
  // 🔧 Helper Functions
  // ============================================================================

  const generateAlertsFromMetrics = (
    newMetrics: CoomUnityPhilosophyMetrics,
    oldMetrics: CoomUnityPhilosophyMetrics
  ): PhilosophyAlert[] => {
    const alerts: PhilosophyAlert[] = [];

    Object.entries(newMetrics).forEach(([principle, newMetric]) => {
      const oldMetric =
        oldMetrics[principle as keyof CoomUnityPhilosophyMetrics];

      if (!oldMetric || !newMetric) return;

      // Check for significant degradation
      const scoreDrop = oldMetric.score - newMetric.score;
      if (scoreDrop > 0.1) {
        // 10% drop
        alerts.push({
          id: `degradation_${principle}_${Date.now()}`,
          type: 'degradation_detected',
          severity: scoreDrop > 0.2 ? 'critical' : 'high',
          principle,
          title: `Degradación en ${PRINCIPLE_NAMES[principle as keyof typeof PRINCIPLE_NAMES]}`,
          message: `El principio ha disminuido ${(scoreDrop * 100).toFixed(1)}% desde la última evaluación`,
          recommendations: newMetric.recommendations || [],
          actions: [
            {
              id: 'review_implementation',
              label: 'Revisar Implementación',
              type: 'primary',
              icon: <RecommendationIcon />,
            },
            {
              id: 'analyze_causes',
              label: 'Analizar Causas',
              type: 'secondary',
            },
          ],
          timestamp: new Date(),
          isAcknowledged: false,
          metadata: {
            currentScore: newMetric.score,
            previousScore: oldMetric.score,
            impact: scoreDrop > 0.2 ? 'high' : 'medium',
            urgency: scoreDrop > 0.15 ? 'immediate' : 'soon',
          },
        });
      }

      // Check for antipatterns
      if (newMetric.antiPatterns && newMetric.antiPatterns.length > 0) {
        newMetric.antiPatterns.forEach((antiPattern, index) => {
          alerts.push({
            id: `antipattern_${principle}_${index}_${Date.now()}`,
            type: 'antipattern_found',
            severity: 'high',
            principle,
            title: `Antipatrón Detectado en ${PRINCIPLE_NAMES[principle as keyof typeof PRINCIPLE_NAMES]}`,
            message: antiPattern,
            recommendations: [`Eliminar antipatrón: ${antiPattern}`],
            actions: [
              {
                id: 'fix_antipattern',
                label: 'Corregir Antipatrón',
                type: 'primary',
                icon: <ErrorIcon />,
              },
            ],
            timestamp: new Date(),
            isAcknowledged: false,
            metadata: {
              currentScore: newMetric.score,
              impact: 'high',
              urgency: 'immediate',
            },
          });
        });
      }

      // Check for improvement opportunities
      if (
        newMetric.score < 0.7 &&
        newMetric.recommendations &&
        newMetric.recommendations.length > 0
      ) {
        alerts.push({
          id: `opportunity_${principle}_${Date.now()}`,
          type: 'improvement_opportunity',
          severity: 'medium',
          principle,
          title: `Oportunidad de Mejora en ${PRINCIPLE_NAMES[principle as keyof typeof PRINCIPLE_NAMES]}`,
          message: `El principio está por debajo del umbral óptimo (70%). Hay ${newMetric.recommendations.length} recomendaciones disponibles.`,
          recommendations: newMetric.recommendations,
          actions: [
            {
              id: 'apply_recommendations',
              label: 'Aplicar Recomendaciones',
              type: 'primary',
              icon: <RecommendationIcon />,
            },
          ],
          timestamp: new Date(),
          isAcknowledged: false,
          metadata: {
            currentScore: newMetric.score,
            threshold: 0.7,
            impact: 'medium',
            urgency: 'when_possible',
          },
        });
      }
    });

    return alerts;
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  // ============================================================================
  // 🎨 Render Helpers
  // ============================================================================

  const renderAlertSummary = () => (
    <Card elevation={1} sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Alertas de Alineación Filosófica</Typography>
          <Box display="flex" gap={1}>
            {alertStats.critical > 0 && (
              <Badge badgeContent={alertStats.critical} color="error">
                <Chip label="Críticas" size="small" color="error" />
              </Badge>
            )}
            {alertStats.high > 0 && (
              <Badge badgeContent={alertStats.high} color="error">
                <Chip label="Altas" size="small" color="warning" />
              </Badge>
            )}
            {alertStats.medium > 0 && (
              <Badge badgeContent={alertStats.medium} color="warning">
                <Chip label="Medias" size="small" color="info" />
              </Badge>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAlert = (alert: PhilosophyAlert) => {
    const typeConfig = ALERT_TYPE_CONFIG[alert.type];
    const isExpanded = expandedAlert === alert.id;

    return (
      <Alert
        key={alert.id}
        severity={getSeverityColor(alert.severity)}
        sx={{ mb: 2 }}
        action={
          <IconButton size="small" onClick={() => handleDismissAlert(alert.id)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <AlertTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {PRINCIPLE_ICONS[alert.principle as keyof typeof PRINCIPLE_ICONS] ||
              PRINCIPLE_ICONS.general}
            {alert.title}
            <Chip
              label={typeConfig.label}
              size="small"
              sx={{
                bgcolor: typeConfig.color,
                color: 'white',
                fontSize: '0.7rem',
              }}
            />
          </Box>
        </AlertTitle>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {alert.message}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            {formatRelativeTime(alert.timestamp)}
          </Typography>

          <IconButton size="small" onClick={() => handleToggleExpand(alert.id)}>
            <ExpandMoreIcon
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Box mt={2}>
            {/* Details */}
            {alert.details && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {alert.details}
              </Typography>
            )}

            {/* Metadata */}
            {alert.metadata && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Información Adicional:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {alert.metadata.currentScore && (
                    <Chip
                      label={`Score: ${(alert.metadata.currentScore * 100).toFixed(1)}%`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {alert.metadata.impact && (
                    <Chip
                      label={`Impacto: ${alert.metadata.impact}`}
                      size="small"
                      variant="outlined"
                      color={
                        alert.metadata.impact === 'high'
                          ? 'error'
                          : alert.metadata.impact === 'medium'
                            ? 'warning'
                            : 'default'
                      }
                    />
                  )}
                  {alert.metadata.urgency && (
                    <Chip
                      label={`Urgencia: ${alert.metadata.urgency}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Recommendations */}
            {alert.recommendations.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Recomendaciones:
                </Typography>
                <List dense>
                  {alert.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <RecommendationIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Actions */}
            {alert.actions.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Acciones Disponibles:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {alert.actions.map((action) => (
                    <Button
                      key={action.id}
                      variant={
                        action.type === 'primary' ? 'contained' : 'outlined'
                      }
                      size="small"
                      startIcon={action.icon}
                      onClick={() => handleAlertAction(alert.id, action.id)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </Alert>
    );
  };

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  if (filteredAlerts.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" color="success.main">
            ¡Excelente Alineación Filosófica!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            No hay alertas de desalineación activas. El proyecto mantiene una
            buena coherencia con los principios CoomÜnity.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {renderAlertSummary()}

      <Box>{filteredAlerts.map(renderAlert)}</Box>

      {filteredAlerts.length >= maxAlerts && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Mostrando las {maxAlerts} alertas más recientes. Puede haber más
            alertas disponibles en el historial completo.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default PhilosophyAlerts;
