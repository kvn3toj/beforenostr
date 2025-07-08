"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTrendDirection = exports.getGuardianDisplayName = exports.validateDashboardData = exports.calculateTrend = exports.groupRecommendationsBySeverity = exports.calculateAyniBalance = exports.evaluatePhilosophyPrincipleAlignment = exports.formatTimeUntilNextUpdate = exports.getFormattedTimestamp = exports.formatRelativeTime = exports.isGuardianHealthy = exports.calculateOverallHealthStatus = exports.formatFileSize = exports.formatTimeMetric = exports.formatPhilosophyScore = exports.formatScoreAsPercentage = exports.getGuardianThemeColor = exports.getCriticalStatusColor = exports.getHealthScoreColor = void 0;
function getHealthScoreColor(score) {
    if (score >= 0.9)
        return '#4caf50';
    if (score >= 0.75)
        return '#8bc34a';
    if (score >= 0.6)
        return '#ffeb3b';
    if (score >= 0.4)
        return '#ff9800';
    return '#f44336';
}
exports.getHealthScoreColor = getHealthScoreColor;
function getCriticalStatusColor(criticalCount) {
    if (criticalCount === 0)
        return '#4caf50';
    if (criticalCount <= 2)
        return '#ff9800';
    return '#f44336';
}
exports.getCriticalStatusColor = getCriticalStatusColor;
function getGuardianThemeColor(guardianType) {
    const guardianColors = {
        philosophy: '#9c27b0',
        architecture: '#2196f3',
        ux: '#ff5722',
        performance: '#4caf50',
        default: '#757575'
    };
    return guardianColors[guardianType] || guardianColors.default;
}
exports.getGuardianThemeColor = getGuardianThemeColor;
function formatScoreAsPercentage(score, decimals = 1) {
    const percentage = (score * 100).toFixed(decimals);
    return `${percentage}%`;
}
exports.formatScoreAsPercentage = formatScoreAsPercentage;
function formatPhilosophyScore(score) {
    const percentage = formatScoreAsPercentage(score);
    if (score >= 0.9)
        return `${percentage} - Excelente alineación CoomÜnity`;
    if (score >= 0.75)
        return `${percentage} - Buena alineación con principios`;
    if (score >= 0.6)
        return `${percentage} - Alineación aceptable`;
    if (score >= 0.4)
        return `${percentage} - Requiere mejora filosófica`;
    return `${percentage} - Desalineación crítica`;
}
exports.formatPhilosophyScore = formatPhilosophyScore;
function formatTimeMetric(milliseconds) {
    if (milliseconds < 1000)
        return `${milliseconds.toFixed(0)}ms`;
    if (milliseconds < 60000)
        return `${(milliseconds / 1000).toFixed(1)}s`;
    if (milliseconds < 3600000)
        return `${(milliseconds / 60000).toFixed(1)}m`;
    return `${(milliseconds / 3600000).toFixed(1)}h`;
}
exports.formatTimeMetric = formatTimeMetric;
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
exports.formatFileSize = formatFileSize;
function calculateOverallHealthStatus(guardians) {
    if (guardians.length === 0) {
        return {
            status: 'critical',
            score: 0,
            message: 'No hay guardians activos'
        };
    }
    const totalScore = guardians.reduce((sum, guardian) => sum + guardian.score, 0);
    const averageScore = totalScore / guardians.length;
    const totalCriticalIssues = guardians.reduce((sum, guardian) => sum + guardian.criticalIssues, 0);
    let status;
    let message;
    if (totalCriticalIssues > 5) {
        status = 'critical';
        message = `${totalCriticalIssues} problemas críticos requieren atención inmediata`;
    }
    else if (totalCriticalIssues > 2) {
        status = 'warning';
        message = `${totalCriticalIssues} problemas críticos detectados`;
    }
    else if (averageScore >= 0.9) {
        status = 'excellent';
        message = 'Sistema funcionando de manera excelente';
    }
    else if (averageScore >= 0.7) {
        status = 'good';
        message = 'Sistema funcionando correctamente';
    }
    else if (averageScore >= 0.5) {
        status = 'warning';
        message = 'Sistema requiere atención';
    }
    else {
        status = 'critical';
        message = 'Sistema en estado crítico';
    }
    return {
        status,
        score: averageScore,
        message
    };
}
exports.calculateOverallHealthStatus = calculateOverallHealthStatus;
function isGuardianHealthy(guardian) {
    const hasDecentScore = guardian.score >= 0.6;
    const hasNoCriticalIssues = guardian.criticalIssues === 0;
    const hasRecentAnalysis = guardian.lastAnalysis
        ? (Date.now() - guardian.lastAnalysis.getTime()) < (24 * 60 * 60 * 1000)
        : false;
    return hasDecentScore && hasNoCriticalIssues && hasRecentAnalysis;
}
exports.isGuardianHealthy = isGuardianHealthy;
function formatRelativeTime(date) {
    if (!date)
        return 'Nunca';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1)
        return 'Hace menos de 1 minuto';
    if (diffMinutes < 60)
        return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
        return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7)
        return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4)
        return `Hace ${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`;
    return date.toLocaleDateString();
}
exports.formatRelativeTime = formatRelativeTime;
function getFormattedTimestamp(date = new Date()) {
    return date.toISOString().replace('T', ' ').substring(0, 19);
}
exports.getFormattedTimestamp = getFormattedTimestamp;
function formatTimeUntilNextUpdate(seconds) {
    if (seconds <= 0)
        return 'Actualizando...';
    if (seconds < 60)
        return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}
exports.formatTimeUntilNextUpdate = formatTimeUntilNextUpdate;
function evaluatePhilosophyPrincipleAlignment(principleScore, principleName) {
    if (principleScore >= 0.9) {
        return {
            level: 'Excelente',
            message: `${principleName} está perfectamente alineado`,
            color: '#4caf50'
        };
    }
    if (principleScore >= 0.75) {
        return {
            level: 'Bueno',
            message: `${principleName} está bien implementado`,
            color: '#8bc34a'
        };
    }
    if (principleScore >= 0.6) {
        return {
            level: 'Aceptable',
            message: `${principleName} necesita algunas mejoras`,
            color: '#ffeb3b'
        };
    }
    if (principleScore >= 0.4) {
        return {
            level: 'Deficiente',
            message: `${principleName} requiere atención prioritaria`,
            color: '#ff9800'
        };
    }
    return {
        level: 'Crítico',
        message: `${principleName} está severamente desalineado`,
        color: '#f44336'
    };
}
exports.evaluatePhilosophyPrincipleAlignment = evaluatePhilosophyPrincipleAlignment;
function calculateAyniBalance(contributionMetrics) {
    const { given, received } = contributionMetrics;
    if (given === 0 && received === 0) {
        return {
            balance: 0,
            status: 'Sin actividad',
            recommendation: 'Iniciar participación en la comunidad'
        };
    }
    const ratio = given / (received + 1);
    if (ratio >= 0.8 && ratio <= 1.2) {
        return {
            balance: 1,
            status: 'Balance perfecto',
            recommendation: 'Mantener el equilibrio actual'
        };
    }
    if (ratio > 1.2) {
        return {
            balance: ratio,
            status: 'Dando más de lo que recibe',
            recommendation: 'Considerar recibir más apoyo de la comunidad'
        };
    }
    return {
        balance: ratio,
        status: 'Recibiendo más de lo que da',
        recommendation: 'Incrementar contribuciones a la comunidad'
    };
}
exports.calculateAyniBalance = calculateAyniBalance;
function groupRecommendationsBySeverity(recommendations) {
    return recommendations.reduce((groups, rec) => {
        const severity = rec.severity;
        if (!groups[severity]) {
            groups[severity] = 0;
        }
        groups[severity]++;
        return groups;
    }, {});
}
exports.groupRecommendationsBySeverity = groupRecommendationsBySeverity;
function calculateTrend(currentValue, previousValue) {
    if (previousValue === 0) {
        return { direction: 'stable', percentage: 0, isSignificant: false };
    }
    const change = currentValue - previousValue;
    const percentage = Math.abs((change / previousValue) * 100);
    const isSignificant = percentage >= 5;
    let direction;
    if (Math.abs(change) < 0.01) {
        direction = 'stable';
    }
    else if (change > 0) {
        direction = 'up';
    }
    else {
        direction = 'down';
    }
    return { direction, percentage, isSignificant };
}
exports.calculateTrend = calculateTrend;
function validateDashboardData(data) {
    const errors = [];
    if (!data) {
        errors.push('No se proporcionaron datos');
        return { isValid: false, errors };
    }
    if (typeof data.overallScore !== 'number' || data.overallScore < 0 || data.overallScore > 1) {
        errors.push('Score general inválido (debe ser entre 0 y 1)');
    }
    if (typeof data.guardiansActive !== 'number' || data.guardiansActive < 0) {
        errors.push('Número de guardians activos inválido');
    }
    if (typeof data.criticalIssues !== 'number' || data.criticalIssues < 0) {
        errors.push('Número de problemas críticos inválido');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
exports.validateDashboardData = validateDashboardData;
function getGuardianDisplayName(guardianType) {
    switch (guardianType) {
        case 'philosophy':
            return 'Guardian Filosófico';
        case 'architecture':
            return 'Guardian de Arquitectura';
        case 'performance':
            return 'Guardian de Performance';
        case 'ux':
            return 'Guardian UX/UI';
        default:
            return 'Guardian Desconocido';
    }
}
exports.getGuardianDisplayName = getGuardianDisplayName;
function calculateTrendDirection(trendData) {
    if (!trendData || typeof trendData.percentage !== 'number') {
        return 'stable';
    }
    const threshold = 5;
    if (Math.abs(trendData.percentage) < threshold) {
        return 'stable';
    }
    return trendData.percentage > 0 ? 'up' : 'down';
}
exports.calculateTrendDirection = calculateTrendDirection;
exports.default = {
    getHealthScoreColor,
    getCriticalStatusColor,
    getGuardianThemeColor,
    formatScoreAsPercentage,
    formatPhilosophyScore,
    formatTimeMetric,
    formatFileSize,
    formatRelativeTime,
    getFormattedTimestamp,
    formatTimeUntilNextUpdate,
    calculateOverallHealthStatus,
    isGuardianHealthy,
    evaluatePhilosophyPrincipleAlignment,
    calculateAyniBalance,
    groupRecommendationsBySeverity,
    calculateTrend,
    validateDashboardData,
    getGuardianDisplayName,
    calculateTrendDirection
};
//# sourceMappingURL=dashboardHelpers.js.map