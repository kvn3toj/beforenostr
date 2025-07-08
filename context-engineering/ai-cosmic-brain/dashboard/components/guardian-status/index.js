"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianStatusUtils = exports.defaultGuardianMonitorConfig = exports.defaultGuardianConfigs = exports.GuardianHealthIndicator = exports.GuardianActivityTimeline = exports.GuardianCard = exports.GuardianStatusMonitor = void 0;
var GuardianStatusMonitor_1 = require("../GuardianStatusMonitor");
Object.defineProperty(exports, "GuardianStatusMonitor", { enumerable: true, get: function () { return GuardianStatusMonitor_1.GuardianStatusMonitor; } });
var GuardianCard_1 = require("../GuardianCard");
Object.defineProperty(exports, "GuardianCard", { enumerable: true, get: function () { return GuardianCard_1.GuardianCard; } });
var GuardianActivityTimeline_1 = require("../GuardianActivityTimeline");
Object.defineProperty(exports, "GuardianActivityTimeline", { enumerable: true, get: function () { return GuardianActivityTimeline_1.GuardianActivityTimeline; } });
var GuardianHealthIndicator_1 = require("../GuardianHealthIndicator");
Object.defineProperty(exports, "GuardianHealthIndicator", { enumerable: true, get: function () { return GuardianHealthIndicator_1.GuardianHealthIndicator; } });
exports.defaultGuardianConfigs = {
    philosophy: {
        name: 'Philosophy Guardian',
        icon: 'Psychology',
        color: '#9C27B0',
        description: 'Monitors CoomÜnity philosophy alignment'
    },
    architecture: {
        name: 'Architecture Guardian',
        icon: 'Architecture',
        color: '#2196F3',
        description: 'Monitors system architecture and design patterns'
    },
    ux: {
        name: 'UX Guardian',
        icon: 'Visibility',
        color: '#FF9800',
        description: 'Monitors user experience and accessibility'
    },
    performance: {
        name: 'Performance Guardian',
        icon: 'Speed',
        color: '#4CAF50',
        description: 'Monitors system performance and optimization'
    }
};
exports.defaultGuardianMonitorConfig = {
    refreshInterval: 30000,
    maxActivities: 50,
    compactMode: false,
    showTrends: true,
    autoRefresh: true,
    alertThresholds: {
        critical: 60,
        warning: 75,
        good: 85,
        excellent: 90
    }
};
exports.guardianStatusUtils = {
    getHealthColor: (score) => {
        if (score >= 90)
            return '#4CAF50';
        if (score >= 80)
            return '#8BC34A';
        if (score >= 70)
            return '#FFC107';
        if (score >= 60)
            return '#FF9800';
        return '#F44336';
    },
    getHealthLabel: (score) => {
        if (score >= 90)
            return 'Excellent';
        if (score >= 80)
            return 'Good';
        if (score >= 70)
            return 'Fair';
        if (score >= 60)
            return 'Poor';
        return 'Critical';
    },
    formatTimestamp: (timestamp) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    },
    calculateSystemTrend: (guardianData) => {
        if (!guardianData.length)
            return { direction: 'stable', percentage: 0 };
        const avgTrend = guardianData.reduce((sum, g) => sum + (g.trend || 0), 0) / guardianData.length;
        return {
            direction: avgTrend > 2 ? 'up' : avgTrend < -2 ? 'down' : 'stable',
            percentage: Math.abs(avgTrend)
        };
    }
};
//# sourceMappingURL=index.js.map