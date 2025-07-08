"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeDataService = void 0;
class RealTimeDataService {
    constructor(initialData) {
        this.updateHandlers = new Set();
        this.lastFullUpdate = null;
        this.updateQueue = [];
        this.isProcessingQueue = false;
        this.staleTimeout = null;
        this.config = {
            staleThreshold: 5 * 60 * 1000,
            maxQueueSize: 100,
            batchUpdateDelay: 1000,
            enableBatching: true
        };
        this.dataState = {
            systemHealth: {
                overallScore: 0,
                guardiansActive: 0,
                totalRecommendations: 0,
                criticalIssues: 0,
                lastEvolution: null,
                philosophyAlignment: 0,
                healthTrend: { direction: 'stable', percentage: 0, isSignificant: false, comparisonPeriod: '24h' },
                uptime: 0
            },
            guardianReports: {},
            lastUpdated: new Date(),
            isStale: false,
            updateCount: 0,
            ...initialData
        };
        this.startStaleTimer();
    }
    handleWebSocketEvent(event) {
        const updateEvent = {
            type: this.mapEventTypeToUpdateType(event.type),
            data: event.data,
            timestamp: new Date(event.timestamp),
            source: 'websocket'
        };
        this.queueUpdate(updateEvent);
    }
    mapEventTypeToUpdateType(eventType) {
        switch (eventType) {
            case 'system_health_update':
                return 'full_update';
            case 'guardian_analysis_update':
                return 'guardian_update';
            case 'philosophy_alignment_change':
                return 'philosophy_update';
            case 'critical_alert':
            case 'recommendation_generated':
            case 'mission_assigned':
            case 'harmony_analysis_complete':
                return 'partial_update';
            default:
                return 'partial_update';
        }
    }
    queueUpdate(updateEvent) {
        if (this.updateQueue.length >= this.config.maxQueueSize) {
            this.updateQueue.shift();
        }
        this.updateQueue.push(updateEvent);
        if (this.config.enableBatching) {
            this.scheduleBatchProcess();
        }
        else {
            this.processUpdate(updateEvent);
        }
    }
    scheduleBatchProcess() {
        if (this.isProcessingQueue)
            return;
        this.isProcessingQueue = true;
        setTimeout(() => {
            this.processBatchUpdates();
            this.isProcessingQueue = false;
        }, this.config.batchUpdateDelay);
    }
    processBatchUpdates() {
        if (this.updateQueue.length === 0)
            return;
        const updates = [...this.updateQueue];
        this.updateQueue = [];
        const groupedUpdates = this.groupUpdatesByType(updates);
        Object.entries(groupedUpdates).forEach(([type, events]) => {
            this.processBatchedUpdateType(type, events);
        });
        this.dataState.lastUpdated = new Date();
        this.dataState.updateCount += updates.length;
        this.dataState.isStale = false;
        this.restartStaleTimer();
        this.notifyHandlers({
            type: 'full_update',
            data: this.dataState,
            timestamp: new Date(),
            source: 'websocket'
        });
    }
    groupUpdatesByType(updates) {
        return updates.reduce((groups, update) => {
            if (!groups[update.type]) {
                groups[update.type] = [];
            }
            groups[update.type].push(update);
            return groups;
        }, {});
    }
    processBatchedUpdateType(type, events) {
        const latestEvent = events[events.length - 1];
        switch (type) {
            case 'full_update':
                this.processFullUpdate(latestEvent);
                break;
            case 'guardian_update':
                events.forEach(event => this.processGuardianUpdate(event));
                break;
            case 'philosophy_update':
                this.processPhilosophyUpdate(latestEvent);
                break;
            case 'partial_update':
                events.forEach(event => this.processPartialUpdate(event));
                break;
        }
    }
    processUpdate(updateEvent) {
        switch (updateEvent.type) {
            case 'full_update':
                this.processFullUpdate(updateEvent);
                break;
            case 'guardian_update':
                this.processGuardianUpdate(updateEvent);
                break;
            case 'philosophy_update':
                this.processPhilosophyUpdate(updateEvent);
                break;
            case 'partial_update':
                this.processPartialUpdate(updateEvent);
                break;
        }
        this.dataState.lastUpdated = new Date();
        this.dataState.updateCount++;
        this.dataState.isStale = false;
        this.restartStaleTimer();
        this.notifyHandlers(updateEvent);
    }
    processFullUpdate(event) {
        if (event.data.systemHealth) {
            this.dataState.systemHealth = {
                ...this.dataState.systemHealth,
                ...event.data.systemHealth
            };
        }
        if (event.data.guardianReports) {
            this.dataState.guardianReports = {
                ...this.dataState.guardianReports,
                ...event.data.guardianReports
            };
        }
        this.lastFullUpdate = new Date();
    }
    processGuardianUpdate(event) {
        const { guardianType, report } = event.data;
        if (guardianType && report) {
            this.dataState.guardianReports[guardianType] = report;
            this.recalculateSystemHealth();
        }
    }
    processPhilosophyUpdate(event) {
        if (event.data.philosophyAlignment) {
            if (this.dataState.guardianReports.philosophy) {
                this.dataState.guardianReports.philosophy.philosophyAlignment = event.data.philosophyAlignment;
            }
            this.recalculateSystemHealth();
        }
    }
    processPartialUpdate(event) {
        if (event.data.criticalAlert) {
            this.dataState.systemHealth.criticalIssues += 1;
        }
        if (event.data.recommendation) {
            this.dataState.systemHealth.totalRecommendations += 1;
        }
        this.recalculateSystemHealth();
    }
    recalculateSystemHealth() {
        const reports = Object.values(this.dataState.guardianReports);
        if (reports.length === 0)
            return;
        const totalScore = reports.reduce((sum, report) => sum + (report.score || 0), 0);
        this.dataState.systemHealth.overallScore = totalScore / reports.length;
        this.dataState.systemHealth.guardiansActive = reports.filter(r => r.isActive).length;
        this.dataState.systemHealth.criticalIssues = reports.reduce((sum, report) => sum + (report.criticalIssues || 0), 0);
        this.dataState.systemHealth.lastEvolution = new Date();
    }
    subscribe(handler) {
        this.updateHandlers.add(handler);
        return () => {
            this.updateHandlers.delete(handler);
        };
    }
    notifyHandlers(event) {
        this.updateHandlers.forEach(handler => {
            try {
                handler(event);
            }
            catch (error) {
                console.error('Error in data update handler:', error);
            }
        });
    }
    startStaleTimer() {
        this.staleTimeout = setTimeout(() => {
            this.dataState.isStale = true;
            this.notifyHandlers({
                type: 'partial_update',
                data: { isStale: true },
                timestamp: new Date(),
                source: 'manual'
            });
        }, this.config.staleThreshold);
    }
    restartStaleTimer() {
        if (this.staleTimeout) {
            clearTimeout(this.staleTimeout);
        }
        this.startStaleTimer();
    }
    getCurrentState() {
        return { ...this.dataState };
    }
    forceUpdate(data) {
        const updateEvent = {
            type: 'full_update',
            data,
            timestamp: new Date(),
            source: 'manual'
        };
        this.processUpdate(updateEvent);
    }
    isStale() {
        return this.dataState.isStale;
    }
    getStats() {
        return {
            updateCount: this.dataState.updateCount,
            lastUpdated: this.dataState.lastUpdated,
            lastFullUpdate: this.lastFullUpdate,
            isStale: this.dataState.isStale,
            queueSize: this.updateQueue.length,
            handlerCount: this.updateHandlers.size
        };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    destroy() {
        if (this.staleTimeout) {
            clearTimeout(this.staleTimeout);
        }
        this.updateHandlers.clear();
        this.updateQueue = [];
    }
}
exports.RealTimeDataService = RealTimeDataService;
exports.default = RealTimeDataService;
//# sourceMappingURL=RealTimeDataService.js.map