"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.philosophyUtils = exports.defaultPhilosophyConfig = exports.PhilosophyComponents = exports.default = exports.PhilosophyAlerts = exports.PhilosophyTrendAnalysis = exports.PhilosophyAlignmentTracker = void 0;
var PhilosophyAlignmentTracker_1 = require("./PhilosophyAlignmentTracker");
Object.defineProperty(exports, "PhilosophyAlignmentTracker", { enumerable: true, get: function () { return PhilosophyAlignmentTracker_1.default; } });
var PhilosophyTrendAnalysis_1 = require("./PhilosophyTrendAnalysis");
Object.defineProperty(exports, "PhilosophyTrendAnalysis", { enumerable: true, get: function () { return PhilosophyTrendAnalysis_1.default; } });
var PhilosophyAlerts_1 = require("./PhilosophyAlerts");
Object.defineProperty(exports, "PhilosophyAlerts", { enumerable: true, get: function () { return PhilosophyAlerts_1.default; } });
var PhilosophyAlignmentTracker_2 = require("./PhilosophyAlignmentTracker");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return PhilosophyAlignmentTracker_2.PhilosophyAlignmentTracker; } });
const PhilosophyAlignmentTracker_3 = require("./PhilosophyAlignmentTracker");
const PhilosophyTrendAnalysis_2 = require("./PhilosophyTrendAnalysis");
const PhilosophyAlerts_2 = require("./PhilosophyAlerts");
exports.PhilosophyComponents = {
    AlignmentTracker: PhilosophyAlignmentTracker_3.default,
    TrendAnalysis: PhilosophyTrendAnalysis_2.default,
    Alerts: PhilosophyAlerts_2.default
};
exports.defaultPhilosophyConfig = {
    alignmentTracker: {
        expandedByDefault: false,
        enableRealTimeUpdates: true,
        readOnly: false
    },
    trendAnalysis: {
        defaultTimeRange: '24h',
        defaultPrinciples: ['bienComun', 'ayni', 'cooperacion']
    },
    alerts: {
        maxAlerts: 10,
        criticalOnly: false
    }
};
exports.philosophyUtils = {
    calculateOverallAlignment: (metrics) => {
        const weights = {
            bienComun: 0.25,
            ayni: 0.20,
            cooperacion: 0.15,
            economiaSagrada: 0.15,
            metanoia: 0.10,
            neguentropia: 0.10,
            vocacion: 0.05
        };
        return Object.entries(weights).reduce((total, [key, weight]) => {
            const metric = metrics[key];
            return total + (metric?.score || 0) * weight;
        }, 0);
    },
    getAlignmentLevel: (score) => {
        if (score >= 0.9)
            return 'exemplary';
        if (score >= 0.8)
            return 'excellent';
        if (score >= 0.7)
            return 'good';
        if (score >= 0.5)
            return 'basic';
        return 'needs_improvement';
    },
    getAlignmentColor: (score) => {
        if (score >= 0.8)
            return '#4caf50';
        if (score >= 0.7)
            return '#8bc34a';
        if (score >= 0.5)
            return '#ff9800';
        if (score >= 0.3)
            return '#ff5722';
        return '#f44336';
    }
};
//# sourceMappingURL=index.js.map