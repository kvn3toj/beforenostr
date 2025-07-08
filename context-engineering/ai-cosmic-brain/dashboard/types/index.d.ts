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
export interface DashboardConfig {
    refreshIntervalMs: number;
    theme: DashboardTheme;
    alerts: AlertConfiguration;
    visibleMetrics: VisibleMetricsConfig;
    enabledGuardians: GuardianType[];
}
export interface DashboardTheme {
    primaryColor: string;
    accentColor: string;
    darkMode: boolean;
    statusColors: StatusColorConfiguration;
    typography: TypographyConfiguration;
}
export interface StatusColorConfiguration {
    excellent: string;
    good: string;
    warning: string;
    critical: string;
    neutral: string;
}
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
export interface AlertConfiguration {
    enableCriticalAlerts: boolean;
    enableWarningAlerts: boolean;
    lowScoreThreshold: number;
    criticalIssuesThreshold: number;
    soundSettings: AlertSoundSettings;
}
export interface AlertSoundSettings {
    enableSounds: boolean;
    criticalAlertSound: string;
    warningAlertSound: string;
    volume: number;
}
export interface CriticalAlert {
    id: string;
    guardianType: GuardianType;
    severity: AlertSeverity;
    message: string;
    timestamp: Date;
    context?: AlertContext;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
}
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export interface AlertContext {
    component?: string;
    file?: string;
    line?: number;
    relatedMetrics?: Record<string, number>;
    recommendations?: string[];
}
export interface VisibleMetricsConfig {
    showOverallHealth: boolean;
    showPhilosophyAlignment: boolean;
    showPerformanceMetrics: boolean;
    showUXMetrics: boolean;
    showArchitectureMetrics: boolean;
    showTrends: boolean;
    showRecommendations: boolean;
}
export interface SystemHealthMetrics {
    overallScore: number;
    guardiansActive: number;
    totalRecommendations: number;
    criticalIssues: number;
    lastEvolution: Date | null;
    philosophyAlignment: number;
    healthTrend: TrendData;
    uptime: number;
}
export interface TrendData {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    isSignificant: boolean;
    comparisonPeriod: string;
}
export interface GuardianReportsCollection {
    philosophy?: AnalysisReport;
    architecture?: AnalysisReport;
    ux?: AnalysisReport;
    performance?: AnalysisReport;
}
export interface GuardianStatusData {
    type: GuardianType;
    name: string;
    score: number;
    status: GuardianHealthStatus;
    lastAnalysis: Date | null;
    criticalIssues: number;
    warnings: number;
    isActive: boolean;
    averageAnalysisTime: number;
    scoreTrend: TrendData;
    configuration: GuardianConfiguration;
}
export type GuardianHealthStatus = 'excellent' | 'good' | 'warning' | 'critical' | 'inactive';
export interface GuardianConfiguration {
    analysisInterval: number;
    thresholds: GuardianThresholds;
    specificConfig: Record<string, any>;
    autoAnalysisEnabled: boolean;
}
export interface GuardianThresholds {
    excellentThreshold: number;
    goodThreshold: number;
    warningThreshold: number;
    criticalThreshold: number;
}
export interface CosmicDashboardProps {
    config: DashboardConfig;
    onConfigChange?: (config: DashboardConfig) => void;
    onCriticalAlert?: (alert: CriticalAlert) => void;
    onNavigateToDetail?: (guardianType: GuardianType) => void;
    initialData?: DashboardInitialData;
    readOnly?: boolean;
}
export interface DashboardInitialData {
    guardianReports?: GuardianReportsCollection;
    systemHealth?: SystemHealthMetrics;
    philosophyAlignment?: PhilosophyAlignment;
    alerts?: CriticalAlert[];
}
export interface GuardianCardProps {
    guardianData: GuardianStatusData;
    theme: DashboardTheme;
    onClick?: (guardianType: GuardianType) => void;
    expanded?: boolean;
    visibleMetrics: VisibleMetricsConfig;
}
export interface MetricsChartProps {
    data: ChartDataPoint[];
    chartType: ChartType;
    colors: string[];
    title: string;
    description?: string;
    height?: number;
    showLegend?: boolean;
}
export type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'radar';
export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
    metadata?: Record<string, any>;
}
export interface DashboardState {
    config: DashboardConfig;
    guardianData: Record<GuardianType, GuardianStatusData>;
    systemMetrics: SystemHealthMetrics;
    activeAlerts: CriticalAlert[];
    loading: DashboardLoadingState;
    errors: DashboardError[];
    lastUpdate: Date | null;
    autoRefresh: AutoRefreshState;
}
export interface DashboardLoadingState {
    initialLoad: boolean;
    guardianData: boolean;
    systemMetrics: boolean;
    configuration: boolean;
}
export interface DashboardError {
    id: string;
    type: DashboardErrorType;
    message: string;
    timestamp: Date;
    context?: Record<string, any>;
    acknowledged: boolean;
}
export type DashboardErrorType = 'data_fetch_error' | 'configuration_error' | 'guardian_error' | 'network_error' | 'validation_error' | 'unknown_error';
export interface AutoRefreshState {
    enabled: boolean;
    interval: number;
    nextUpdateIn: number;
    paused: boolean;
}
export interface DashboardAPIResponse {
    guardians: GuardianReportsCollection;
    systemHealth: SystemHealthMetrics;
    philosophyAlignment: PhilosophyAlignment;
    alerts: CriticalAlert[];
    timestamp: Date;
    apiVersion: string;
}
export interface DashboardDataParams {
    includeGuardians?: GuardianType[];
    includeHistory?: boolean;
    timeRange?: TimeRange;
    detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}
export interface TimeRange {
    start: Date;
    end: Date;
    granularity?: 'minute' | 'hour' | 'day' | 'week' | 'month';
}
export interface CoomUnityPhilosophyMetrics {
    bienComun: PhilosophyPrincipleMetric;
    ayni: PhilosophyPrincipleMetric;
    cooperacion: PhilosophyPrincipleMetric;
    economiaSagrada: PhilosophyPrincipleMetric;
    metanoia: PhilosophyPrincipleMetric;
    neguentropia: PhilosophyPrincipleMetric;
    vocacion: PhilosophyPrincipleMetric;
}
export interface PhilosophyPrincipleMetric {
    score: number;
    weight: number;
    implementationLevel: ImplementationLevel;
    recommendations: string[];
    goodPractices: string[];
    antiPatterns: string[];
}
export type ImplementationLevel = 'not_implemented' | 'basic_implementation' | 'good_implementation' | 'excellent_implementation' | 'exemplary_implementation';
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    context?: Record<string, any>;
}
export interface ExportConfiguration {
    format: ExportFormat;
    includeData: ExportDataSelection;
    filters: ExportFilters;
    formatOptions: ExportFormatOptions;
}
export type ExportFormat = 'json' | 'csv' | 'xlsx' | 'pdf' | 'xml';
export interface ExportDataSelection {
    guardianReports: boolean;
    systemMetrics: boolean;
    alerts: boolean;
    configuration: boolean;
    historicalData: boolean;
}
export interface ExportFilters {
    timeRange?: TimeRange;
    guardianTypes?: GuardianType[];
    severityLevels?: AlertSeverity[];
    includeAcknowledged?: boolean;
}
export interface ExportFormatOptions {
    includeHeaders?: boolean;
    dateFormat?: string;
    numberFormat?: string;
    encoding?: string;
    compression?: boolean;
}
export interface ValidationRule {
    id: string;
    name: string;
    description: string;
    guardianType: GuardianType;
    priority: ValidationPriority;
    enabled: boolean;
    autoFix: boolean;
    schedule?: ValidationScheduleConfig;
    parameters: Record<string, any>;
    metadata: ValidationRuleMetadata;
}
export type ValidationPriority = 'low' | 'medium' | 'high' | 'critical';
export interface ValidationScheduleConfig {
    type: ScheduleType;
    value: string | number;
    timezone?: string;
    conditions?: ScheduleCondition[];
    retryPolicy?: RetryPolicy;
}
export type ScheduleType = 'interval' | 'cron' | 'daily' | 'weekly' | 'monthly' | 'trigger';
export interface ScheduleCondition {
    type: ConditionType;
    value: any;
    operator: ConditionOperator;
}
export type ConditionType = 'time_range' | 'day_of_week' | 'file_change' | 'git_commit' | 'system_load';
export type ConditionOperator = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
export interface RetryPolicy {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoffTime: number;
}
export interface ValidationRuleMetadata {
    createdAt: Date;
    updatedAt: Date;
    author: string;
    version: string;
    tags?: string[];
    documentation?: string;
}
export interface ValidationExecution {
    id: string;
    ruleId: string;
    ruleName: string;
    guardianType: GuardianType;
    status: ValidationExecutionStatus;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    result?: ValidationResult;
    progress: number;
    logs: string[];
    autoFixApplied?: boolean;
    metrics?: ValidationExecutionMetrics;
}
export type ValidationExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export interface ValidationExecutionMetrics {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
    coveragePercentage: number;
    performanceImpact: number;
    qualityScore: number;
}
export interface ScheduledValidation {
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
    metadata: ScheduledValidationMetadata;
}
export interface ScheduledValidationMetadata {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    lastModifiedBy?: string;
    tags?: string[];
}
export interface ValidationEngineConfig {
    defaultIntervals: Record<GuardianType, number>;
    defaultRetryPolicy: RetryPolicy;
    notificationConfig: ValidationNotificationConfig;
    systemLimits: ValidationSystemLimits;
    autoFixConfig: AutoFixConfig;
}
export interface ValidationNotificationConfig {
    criticalErrors: boolean;
    warnings: boolean;
    successfulRuns: boolean;
    scheduleChanges: boolean;
    channels: NotificationChannel[];
}
export type NotificationChannel = 'email' | 'slack' | 'webhook' | 'in_app';
export interface ValidationSystemLimits {
    maxConcurrentValidations: number;
    maxValidationDuration: number;
    maxRulesPerSchedule: number;
    maxSchedulesPerUser: number;
    maxLogSize: number;
}
export interface AutoFixConfig {
    enabled: boolean;
    allowedFixTypes: AutoFixType[];
    requireConfirmation: boolean;
    createBackup: boolean;
}
export type AutoFixType = 'formatting' | 'imports' | 'linting' | 'dependencies' | 'security' | 'performance';
export interface AutoFixResult {
    success: boolean;
    changesApplied: string[];
    modifiedFiles: string[];
    backupPath?: string;
    errors?: string[];
}
