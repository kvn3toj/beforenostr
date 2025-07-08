/**
 * 🎯 Dashboard Type Definitions
 *
 * Definiciones de tipos TypeScript para el AI Cosmic Brain Dashboard.
 * Implementa principios de tipado estricto y nombres descriptivos
 * para máxima mantenibilidad y claridad del código.
 *
 * Filosofía aplicada:
 * - Bien Común: Tipos reutilizables que benefician todo el equipo
 * - Neguentropía: Estructura clara y organizada de tipos
 * - TypeScript estricto: Prevención de errores en tiempo de compilación
 */

// Import base types from the main types file
export type GuardianType = 'philosophy' | 'architecture' | 'performance' | 'ux';

export interface AnalysisReport {
  id: string;
  guardianType: GuardianType;
  timestamp: Date;
  score: number;
  recommendations: string[];
  issues: string[];
  metadata: Record<string, any>;
  philosophyAlignment?: PhilosophyAlignment;
  isActive?: boolean;
  criticalIssues?: number;
}

export interface PhilosophyAlignment {
  overallScore: number;
  principles: Record<string, number>;
  recommendations: string[];
}

// ============================================================================
// 🎛️ Dashboard Core Types
// ============================================================================

/**
 * Configuración principal del dashboard
 */
export interface DashboardConfig {
  /** Intervalo de actualización automática en milisegundos */
  refreshIntervalMs: number;
  /** Configuración visual del tema */
  theme: DashboardTheme;
  /** Configuración de alertas */
  alerts: AlertConfiguration;
  /** Configuración de métricas visibles */
  visibleMetrics: VisibleMetricsConfig;
  /** Configuración de guardians activos */
  enabledGuardians: GuardianType[];
}

/**
 * Configuración visual del dashboard
 */
export interface DashboardTheme {
  /** Color primario del tema */
  primaryColor: string;
  /** Color de acento */
  accentColor: string;
  /** Modo oscuro activado */
  darkMode: boolean;
  /** Configuración de colores para estados */
  statusColors: StatusColorConfiguration;
  /** Configuración de tipografía */
  typography: TypographyConfiguration;
}

/**
 * Configuración de colores para diferentes estados
 */
export interface StatusColorConfiguration {
  excellent: string;
  good: string;
  warning: string;
  critical: string;
  neutral: string;
}

/**
 * Configuración de tipografía
 */
export interface TypographyConfiguration {
  fontFamily: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    bold: number;
  };
}

// ============================================================================
// 🔔 Alert and Notification Types
// ============================================================================

/**
 * Configuración de alertas del sistema
 */
export interface AlertConfiguration {
  /** Habilitar alertas críticas */
  enableCriticalAlerts: boolean;
  /** Habilitar alertas de advertencia */
  enableWarningAlerts: boolean;
  /** Umbral para alertas de score bajo */
  lowScoreThreshold: number;
  /** Umbral para alertas de problemas críticos */
  criticalIssuesThreshold: number;
  /** Configuración de sonidos */
  soundSettings: AlertSoundSettings;
}

/**
 * Configuración de sonidos de alerta
 */
export interface AlertSoundSettings {
  enableSounds: boolean;
  criticalAlertSound: string;
  warningAlertSound: string;
  volume: number; // 0-1
}

/**
 * Alerta crítica del sistema
 */
export interface CriticalAlert {
  /** ID único de la alerta */
  id: string;
  /** Tipo de guardian que generó la alerta */
  guardianType: GuardianType;
  /** Nivel de severidad */
  severity: AlertSeverity;
  /** Mensaje descriptivo */
  message: string;
  /** Timestamp de cuando ocurrió */
  timestamp: Date;
  /** Contexto adicional */
  context?: AlertContext;
  /** Si la alerta ha sido reconocida */
  acknowledged: boolean;
  /** Usuario que reconoció la alerta */
  acknowledgedBy?: string;
  /** Timestamp del reconocimiento */
  acknowledgedAt?: Date;
}

/**
 * Niveles de severidad de alertas
 */
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * Contexto adicional para alertas
 */
export interface AlertContext {
  /** Componente específico afectado */
  component?: string;
  /** Archivo o módulo relacionado */
  file?: string;
  /** Línea de código si aplica */
  line?: number;
  /** Métricas relacionadas */
  relatedMetrics?: Record<string, number>;
  /** Recomendaciones específicas */
  recommendations?: string[];
}

// ============================================================================
// 📊 Metrics and Data Types
// ============================================================================

/**
 * Configuración de métricas visibles en el dashboard
 */
export interface VisibleMetricsConfig {
  /** Mostrar métricas de salud general */
  showOverallHealth: boolean;
  /** Mostrar alineación filosófica */
  showPhilosophyAlignment: boolean;
  /** Mostrar métricas de performance */
  showPerformanceMetrics: boolean;
  /** Mostrar métricas de UX */
  showUXMetrics: boolean;
  /** Mostrar métricas de arquitectura */
  showArchitectureMetrics: boolean;
  /** Mostrar tendencias históricas */
  showTrends: boolean;
  /** Mostrar recomendaciones */
  showRecommendations: boolean;
}

/**
 * Métricas de salud del sistema completo
 */
export interface SystemHealthMetrics {
  /** Score general del sistema (0-1) */
  overallScore: number;
  /** Número de guardians activos */
  guardiansActive: number;
  /** Total de recomendaciones pendientes */
  totalRecommendations: number;
  /** Número de problemas críticos */
  criticalIssues: number;
  /** Última evolución del sistema */
  lastEvolution: Date | null;
  /** Nivel de alineación filosófica */
  philosophyAlignment: number;
  /** Tendencia de salud (comparado con periodo anterior) */
  healthTrend: TrendData;
  /** Tiempo de actividad del sistema */
  uptime: number; // en milisegundos
}

/**
 * Datos de tendencia para métricas
 */
export interface TrendData {
  /** Dirección de la tendencia */
  direction: 'up' | 'down' | 'stable';
  /** Porcentaje de cambio */
  percentage: number;
  /** Si el cambio es significativo */
  isSignificant: boolean;
  /** Periodo de comparación */
  comparisonPeriod: string;
}

/**
 * Colección de reportes de todos los guardians
 */
export interface GuardianReportsCollection {
  philosophy?: AnalysisReport;
  architecture?: AnalysisReport;
  ux?: AnalysisReport;
  performance?: AnalysisReport;
}

// ============================================================================
// 🛡️ Guardian Status Types
// ============================================================================

/**
 * Estado detallado de un guardian específico
 */
export interface GuardianStatusData {
  /** Tipo de guardian */
  type: GuardianType;
  /** Nombre legible del guardian */
  name: string;
  /** Score actual (0-1) */
  score: number;
  /** Estado de salud general */
  status: GuardianHealthStatus;
  /** Última vez que se ejecutó análisis */
  lastAnalysis: Date | null;
  /** Número de problemas críticos detectados */
  criticalIssues: number;
  /** Número de advertencias */
  warnings: number;
  /** Si el guardian está activo */
  isActive: boolean;
  /** Tiempo promedio de análisis */
  averageAnalysisTime: number; // en milisegundos
  /** Tendencia del score */
  scoreTrend: TrendData;
  /** Configuración específica del guardian */
  configuration: GuardianConfiguration;
}

/**
 * Estados de salud de un guardian
 */
export type GuardianHealthStatus = 'excellent' | 'good' | 'warning' | 'critical' | 'inactive';

/**
 * Configuración específica de un guardian
 */
export interface GuardianConfiguration {
  /** Intervalo de análisis en milisegundos */
  analysisInterval: number;
  /** Umbrales personalizados */
  thresholds: GuardianThresholds;
  /** Configuración específica del tipo de guardian */
  specificConfig: Record<string, any>;
  /** Si está habilitado para análisis automático */
  autoAnalysisEnabled: boolean;
}

/**
 * Umbrales configurables para guardians
 */
export interface GuardianThresholds {
  /** Umbral para estado excelente */
  excellentThreshold: number;
  /** Umbral para estado bueno */
  goodThreshold: number;
  /** Umbral para estado de advertencia */
  warningThreshold: number;
  /** Umbral para estado crítico */
  criticalThreshold: number;
}

// ============================================================================
// 🎨 UI Component Types
// ============================================================================

/**
 * Props para el componente principal del dashboard
 */
export interface CosmicDashboardProps {
  /** Configuración del dashboard */
  config: DashboardConfig;
  /** Callback para cambios de configuración */
  onConfigChange?: (config: DashboardConfig) => void;
  /** Callback para alertas críticas */
  onCriticalAlert?: (alert: CriticalAlert) => void;
  /** Callback para navegación a vista detallada */
  onNavigateToDetail?: (guardianType: GuardianType) => void;
  /** Datos iniciales (opcional) */
  initialData?: DashboardInitialData;
  /** Modo de solo lectura */
  readOnly?: boolean;
}

/**
 * Datos iniciales para el dashboard
 */
export interface DashboardInitialData {
  guardianReports?: GuardianReportsCollection;
  systemHealth?: SystemHealthMetrics;
  philosophyAlignment?: PhilosophyAlignment;
  alerts?: CriticalAlert[];
}

/**
 * Props para tarjetas de guardian
 */
export interface GuardianCardProps {
  /** Datos del guardian */
  guardianData: GuardianStatusData;
  /** Configuración de tema */
  theme: DashboardTheme;
  /** Callback para click en la tarjeta */
  onClick?: (guardianType: GuardianType) => void;
  /** Si mostrar detalles expandidos */
  expanded?: boolean;
  /** Configuración de métricas visibles */
  visibleMetrics: VisibleMetricsConfig;
}

/**
 * Props para gráficos de métricas
 */
export interface MetricsChartProps {
  /** Datos para el gráfico */
  data: ChartDataPoint[];
  /** Tipo de gráfico */
  chartType: ChartType;
  /** Configuración de colores */
  colors: string[];
  /** Título del gráfico */
  title: string;
  /** Descripción opcional */
  description?: string;
  /** Altura del gráfico */
  height?: number;
  /** Si mostrar leyenda */
  showLegend?: boolean;
}

/**
 * Tipos de gráficos disponibles
 */
export type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'radar';

/**
 * Punto de datos para gráficos
 */
export interface ChartDataPoint {
  /** Etiqueta del punto */
  label: string;
  /** Valor numérico */
  value: number;
  /** Color específico (opcional) */
  color?: string;
  /** Metadatos adicionales */
  metadata?: Record<string, any>;
}

// ============================================================================
// 🔄 State Management Types
// ============================================================================

/**
 * Estado global del dashboard
 */
export interface DashboardState {
  /** Configuración actual */
  config: DashboardConfig;
  /** Datos de guardians */
  guardianData: Record<GuardianType, GuardianStatusData>;
  /** Métricas del sistema */
  systemMetrics: SystemHealthMetrics;
  /** Alertas activas */
  activeAlerts: CriticalAlert[];
  /** Estado de carga */
  loading: DashboardLoadingState;
  /** Errores actuales */
  errors: DashboardError[];
  /** Última actualización */
  lastUpdate: Date | null;
  /** Configuración de auto-refresh */
  autoRefresh: AutoRefreshState;
}

/**
 * Estados de carga del dashboard
 */
export interface DashboardLoadingState {
  /** Carga inicial */
  initialLoad: boolean;
  /** Carga de datos de guardians */
  guardianData: boolean;
  /** Carga de métricas del sistema */
  systemMetrics: boolean;
  /** Carga de configuración */
  configuration: boolean;
}

/**
 * Error del dashboard
 */
export interface DashboardError {
  /** ID único del error */
  id: string;
  /** Tipo de error */
  type: DashboardErrorType;
  /** Mensaje del error */
  message: string;
  /** Timestamp del error */
  timestamp: Date;
  /** Contexto del error */
  context?: Record<string, any>;
  /** Si el error ha sido reconocido */
  acknowledged: boolean;
}

/**
 * Tipos de errores del dashboard
 */
export type DashboardErrorType =
  | 'data_fetch_error'
  | 'configuration_error'
  | 'guardian_error'
  | 'network_error'
  | 'validation_error'
  | 'unknown_error';

/**
 * Estado del auto-refresh
 */
export interface AutoRefreshState {
  /** Si está habilitado */
  enabled: boolean;
  /** Intervalo en milisegundos */
  interval: number;
  /** Tiempo restante hasta próxima actualización */
  nextUpdateIn: number;
  /** Si está pausado temporalmente */
  paused: boolean;
}

// ============================================================================
// 📡 API and Data Fetching Types
// ============================================================================

/**
 * Respuesta de la API para datos del dashboard
 */
export interface DashboardAPIResponse {
  /** Datos de guardians */
  guardians: GuardianReportsCollection;
  /** Métricas del sistema */
  systemHealth: SystemHealthMetrics;
  /** Alineación filosófica */
  philosophyAlignment: PhilosophyAlignment;
  /** Alertas activas */
  alerts: CriticalAlert[];
  /** Timestamp de la respuesta */
  timestamp: Date;
  /** Versión de la API */
  apiVersion: string;
}

/**
 * Parámetros para obtener datos del dashboard
 */
export interface DashboardDataParams {
  /** Guardians específicos a incluir */
  includeGuardians?: GuardianType[];
  /** Si incluir datos históricos */
  includeHistory?: boolean;
  /** Rango de tiempo para datos históricos */
  timeRange?: TimeRange;
  /** Nivel de detalle */
  detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}

/**
 * Rango de tiempo para consultas
 */
export interface TimeRange {
  /** Fecha de inicio */
  start: Date;
  /** Fecha de fin */
  end: Date;
  /** Granularidad de los datos */
  granularity?: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

// ============================================================================
// 🎯 Philosophy-Specific Types
// ============================================================================

/**
 * Métricas específicas de alineación filosófica CoomÜnity
 */
export interface CoomUnityPhilosophyMetrics {
  /** Bien Común - Priorización del bien común sobre el particular */
  bienComun: PhilosophyPrincipleMetric;
  /** Ayni - Reciprocidad y equilibrio */
  ayni: PhilosophyPrincipleMetric;
  /** Cooperación sobre Competición */
  cooperacion: PhilosophyPrincipleMetric;
  /** Economía Sagrada */
  economiaSagrada: PhilosophyPrincipleMetric;
  /** Metanöia - Transformación consciente */
  metanoia: PhilosophyPrincipleMetric;
  /** Neguentropía - Orden consciente */
  neguentropia: PhilosophyPrincipleMetric;
  /** Vocación - Propósito auténtico */
  vocacion: PhilosophyPrincipleMetric;
}

/**
 * Métrica de un principio filosófico específico
 */
export interface PhilosophyPrincipleMetric {
  /** Score del principio (0-1) */
  score: number;
  /** Peso del principio en el cálculo general */
  weight: number;
  /** Nivel de implementación */
  implementationLevel: ImplementationLevel;
  /** Recomendaciones específicas */
  recommendations: string[];
  /** Ejemplos de buenas prácticas encontradas */
  goodPractices: string[];
  /** Antipatrones detectados */
  antiPatterns: string[];
}

/**
 * Niveles de implementación de principios
 */
export type ImplementationLevel =
  | 'not_implemented'
  | 'basic_implementation'
  | 'good_implementation'
  | 'excellent_implementation'
  | 'exemplary_implementation';

// ============================================================================
// 🔧 Utility and Helper Types
// ============================================================================

/**
 * Resultado de validación
 */
export interface ValidationResult {
  /** Si la validación fue exitosa */
  isValid: boolean;
  /** Lista de errores encontrados */
  errors: string[];
  /** Lista de advertencias */
  warnings: string[];
  /** Contexto adicional */
  context?: Record<string, any>;
}

/**
 * Configuración de exportación de datos
 */
export interface ExportConfiguration {
  /** Formato de exportación */
  format: ExportFormat;
  /** Datos a incluir */
  includeData: ExportDataSelection;
  /** Configuración de filtros */
  filters: ExportFilters;
  /** Configuración de formato */
  formatOptions: ExportFormatOptions;
}

/**
 * Formatos de exportación disponibles
 */
export type ExportFormat = 'json' | 'csv' | 'xlsx' | 'pdf' | 'xml';

/**
 * Selección de datos para exportar
 */
export interface ExportDataSelection {
  guardianReports: boolean;
  systemMetrics: boolean;
  alerts: boolean;
  configuration: boolean;
  historicalData: boolean;
}

/**
 * Filtros para exportación
 */
export interface ExportFilters {
  timeRange?: TimeRange;
  guardianTypes?: GuardianType[];
  severityLevels?: AlertSeverity[];
  includeAcknowledged?: boolean;
}

/**
 * Opciones de formato para exportación
 */
export interface ExportFormatOptions {
  includeHeaders?: boolean;
  dateFormat?: string;
  numberFormat?: string;
  encoding?: string;
  compression?: boolean;
}

// ============================================================================
// 🔍 Automated Validation Engine Types
// ============================================================================

/**
 * Regla de validación configurable
 */
export interface ValidationRule {
  /** ID único de la regla */
  id: string;
  /** Nombre descriptivo */
  name: string;
  /** Descripción detallada */
  description: string;
  /** Tipo de guardian al que aplica */
  guardianType: GuardianType;
  /** Prioridad de la regla */
  priority: ValidationPriority;
  /** Si la regla está habilitada */
  enabled: boolean;
  /** Si permite auto-corrección */
  autoFix: boolean;
  /** Configuración de programación */
  schedule?: ValidationScheduleConfig;
  /** Parámetros específicos */
  parameters: Record<string, any>;
  /** Metadatos de la regla */
  metadata: ValidationRuleMetadata;
}

/**
 * Prioridades de validación
 */
export type ValidationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Configuración de programación para validaciones
 */
export interface ValidationScheduleConfig {
  /** Tipo de programación */
  type: ScheduleType;
  /** Valor de la programación */
  value: string | number;
  /** Zona horaria */
  timezone?: string;
  /** Condiciones adicionales */
  conditions?: ScheduleCondition[];
  /** Política de reintentos */
  retryPolicy?: RetryPolicy;
}

/**
 * Tipos de programación disponibles
 */
export type ScheduleType = 'interval' | 'cron' | 'daily' | 'weekly' | 'monthly' | 'trigger';

/**
 * Condición para programación
 */
export interface ScheduleCondition {
  /** Tipo de condición */
  type: ConditionType;
  /** Valor de la condición */
  value: any;
  /** Operador de comparación */
  operator: ConditionOperator;
}

/**
 * Tipos de condiciones
 */
export type ConditionType = 'time_range' | 'day_of_week' | 'file_change' | 'git_commit' | 'system_load';

/**
 * Operadores de condición
 */
export type ConditionOperator = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';

/**
 * Política de reintentos
 */
export interface RetryPolicy {
  /** Máximo número de reintentos */
  maxRetries: number;
  /** Multiplicador de backoff */
  backoffMultiplier: number;
  /** Tiempo máximo de backoff */
  maxBackoffTime: number;
}

/**
 * Metadatos de regla de validación
 */
export interface ValidationRuleMetadata {
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
  /** Autor de la regla */
  author: string;
  /** Versión de la regla */
  version: string;
  /** Tags descriptivos */
  tags?: string[];
  /** Documentación adicional */
  documentation?: string;
}

/**
 * Ejecución de validación
 */
export interface ValidationExecution {
  /** ID único de la ejecución */
  id: string;
  /** ID de la regla ejecutada */
  ruleId: string;
  /** Nombre de la regla */
  ruleName: string;
  /** Tipo de guardian */
  guardianType: GuardianType;
  /** Estado de la ejecución */
  status: ValidationExecutionStatus;
  /** Tiempo de inicio */
  startTime: Date;
  /** Tiempo de fin */
  endTime?: Date;
  /** Duración en milisegundos */
  duration?: number;
  /** Resultado de la validación */
  result?: ValidationResult;
  /** Progreso (0-100) */
  progress: number;
  /** Logs de la ejecución */
  logs: string[];
  /** Si se aplicó auto-corrección */
  autoFixApplied?: boolean;
  /** Métricas de la validación */
  metrics?: ValidationExecutionMetrics;
}

/**
 * Estados de ejecución de validación
 */
export type ValidationExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Métricas de ejecución de validación
 */
export interface ValidationExecutionMetrics {
  /** Total de verificaciones realizadas */
  totalChecks: number;
  /** Verificaciones exitosas */
  passedChecks: number;
  /** Verificaciones fallidas */
  failedChecks: number;
  /** Verificaciones con advertencias */
  warningChecks: number;
  /** Porcentaje de cobertura */
  coveragePercentage: number;
  /** Impacto en performance */
  performanceImpact: number;
  /** Puntuación de calidad */
  qualityScore: number;
}

/**
 * Programación de validación
 */
export interface ScheduledValidation {
  /** ID único de la programación */
  id: string;
  /** Nombre descriptivo */
  name: string;
  /** Descripción */
  description: string;
  /** IDs de reglas incluidas */
  ruleIds: string[];
  /** Configuración de programación */
  schedule: ValidationScheduleConfig;
  /** Si está habilitada */
  enabled: boolean;
  /** Última ejecución */
  lastRun?: Date;
  /** Próxima ejecución */
  nextRun?: Date;
  /** Total de ejecuciones */
  totalRuns: number;
  /** Ejecuciones exitosas */
  successfulRuns: number;
  /** Ejecuciones fallidas */
  failedRuns: number;
  /** Duración promedio */
  averageDuration: number;
  /** Metadatos */
  metadata: ScheduledValidationMetadata;
}

/**
 * Metadatos de programación de validación
 */
export interface ScheduledValidationMetadata {
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
  /** Creador */
  createdBy: string;
  /** Última modificación por */
  lastModifiedBy?: string;
  /** Tags descriptivos */
  tags?: string[];
}

/**
 * Configuración del motor de validación
 */
export interface ValidationEngineConfig {
  /** Configuración de intervalos por defecto */
  defaultIntervals: Record<GuardianType, number>;
  /** Política de reintentos por defecto */
  defaultRetryPolicy: RetryPolicy;
  /** Configuración de notificaciones */
  notificationConfig: ValidationNotificationConfig;
  /** Límites del sistema */
  systemLimits: ValidationSystemLimits;
  /** Configuración de auto-corrección */
  autoFixConfig: AutoFixConfig;
}

/**
 * Configuración de notificaciones de validación
 */
export interface ValidationNotificationConfig {
  /** Notificar errores críticos */
  criticalErrors: boolean;
  /** Notificar advertencias */
  warnings: boolean;
  /** Notificar ejecuciones exitosas */
  successfulRuns: boolean;
  /** Notificar cambios de programación */
  scheduleChanges: boolean;
  /** Canales de notificación */
  channels: NotificationChannel[];
}

/**
 * Canales de notificación
 */
export type NotificationChannel = 'email' | 'slack' | 'webhook' | 'in_app';

/**
 * Límites del sistema de validación
 */
export interface ValidationSystemLimits {
  /** Máximo de validaciones concurrentes */
  maxConcurrentValidations: number;
  /** Duración máxima de validación */
  maxValidationDuration: number;
  /** Máximo de reglas por programación */
  maxRulesPerSchedule: number;
  /** Máximo de programaciones por usuario */
  maxSchedulesPerUser: number;
  /** Tamaño máximo de logs */
  maxLogSize: number;
}

/**
 * Configuración de auto-corrección
 */
export interface AutoFixConfig {
  /** Si está habilitada globalmente */
  enabled: boolean;
  /** Tipos de problemas que se pueden auto-corregir */
  allowedFixTypes: AutoFixType[];
  /** Requiere confirmación para auto-corrección */
  requireConfirmation: boolean;
  /** Crear backup antes de auto-corrección */
  createBackup: boolean;
}

/**
 * Tipos de auto-corrección
 */
export type AutoFixType = 'formatting' | 'imports' | 'linting' | 'dependencies' | 'security' | 'performance';

/**
 * Resultado de auto-corrección
 */
export interface AutoFixResult {
  /** Si la corrección fue exitosa */
  success: boolean;
  /** Cambios aplicados */
  changesApplied: string[];
  /** Archivos modificados */
  modifiedFiles: string[];
  /** Backup creado */
  backupPath?: string;
  /** Errores durante la corrección */
  errors?: string[];
}

// All types are already exported above as interfaces and types
