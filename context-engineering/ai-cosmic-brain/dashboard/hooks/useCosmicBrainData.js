"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCosmicBrainData = void 0;
const react_1 = require("react");
const useCosmicBrainData = (cosmicBrain, refreshIntervalMs = 30000) => {
    const [guardianReports, setGuardianReports] = (0, react_1.useState)({});
    const [philosophyAlignment, setPhilosophyAlignment] = (0, react_1.useState)(null);
    const [systemHealthMetrics, setSystemHealthMetrics] = (0, react_1.useState)({
        overallScore: 0,
        guardiansActive: 0,
        totalRecommendations: 0,
        criticalIssues: 0,
        lastEvolution: null,
        philosophyAlignment: 0
    });
    const [isDataLoading, setIsDataLoading] = (0, react_1.useState)(true);
    const [dataError, setDataError] = (0, react_1.useState)(null);
    const [lastUpdateTimestamp, setLastUpdateTimestamp] = (0, react_1.useState)(null);
    const [nextUpdateIn, setNextUpdateIn] = (0, react_1.useState)(0);
    const [isAutoRefreshActive, setIsAutoRefreshActive] = (0, react_1.useState)(true);
    const autoRefreshIntervalRef = (0, react_1.useRef)(null);
    const countdownIntervalRef = (0, react_1.useRef)(null);
    const isMountedRef = (0, react_1.useRef)(true);
    const fetchAllGuardianReports = (0, react_1.useCallback)(async () => {
        const guardianTypes = ['philosophy', 'architecture', 'ux', 'performance'];
        const reports = {};
        const analysisPromises = guardianTypes.map(async (type) => {
            try {
                const guardian = cosmicBrain.getGuardian(type);
                if (guardian) {
                    const report = await guardian.performSpecializedAnalysis();
                    return { type, report };
                }
                return { type, report: null };
            }
            catch (error) {
                console.warn(`Error fetching ${type} guardian report:`, error);
                return { type, report: null };
            }
        });
        const results = await Promise.allSettled(analysisPromises);
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.report) {
                const { type, report } = result.value;
                reports[type] = report;
            }
        });
        return reports;
    }, [cosmicBrain]);
    const fetchPhilosophyAlignment = (0, react_1.useCallback)(async () => {
        try {
            const philosophyGuardian = cosmicBrain.getGuardian('philosophy');
            if (philosophyGuardian) {
                const report = await philosophyGuardian.performSpecializedAnalysis();
                return report.philosophyAlignment || null;
            }
            return null;
        }
        catch (error) {
            console.warn('Error fetching philosophy alignment:', error);
            return null;
        }
    }, [cosmicBrain]);
    const calculateSystemHealth = (0, react_1.useCallback)((reports, philosophy) => {
        const activeGuardians = Object.keys(reports).length;
        const allReports = Object.values(reports).filter(Boolean);
        const totalRecommendations = allReports.reduce((total, report) => total + (report.recommendations?.length || 0), 0);
        const criticalIssues = allReports.reduce((total, report) => total + (report.recommendations?.filter(r => r.severity === 'critical').length || 0), 0);
        const scores = allReports.map(report => {
            const metrics = report.metrics;
            if (!metrics)
                return 0;
            if (report.guardianType === 'philosophy')
                return metrics.overallPhilosophyScore || 0;
            if (report.guardianType === 'architecture')
                return metrics.structuralHealth || 0;
            if (report.guardianType === 'ux')
                return metrics.overallUXScore || 0;
            if (report.guardianType === 'performance')
                return metrics.overallPerformance || 0;
            return 0;
        });
        const overallScore = scores.length > 0
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : 0;
        return {
            overallScore,
            guardiansActive: activeGuardians,
            totalRecommendations,
            criticalIssues,
            lastEvolution: cosmicBrain.getLastEvolutionTimestamp(),
            philosophyAlignment: philosophy?.overallScore || 0
        };
    }, [cosmicBrain]);
    const refreshData = (0, react_1.useCallback)(async () => {
        if (!isMountedRef.current)
            return;
        try {
            setIsDataLoading(true);
            setDataError(null);
            const [reports, philosophy] = await Promise.all([
                fetchAllGuardianReports(),
                fetchPhilosophyAlignment()
            ]);
            if (!isMountedRef.current)
                return;
            setGuardianReports(reports);
            setPhilosophyAlignment(philosophy);
            setSystemHealthMetrics(calculateSystemHealth(reports, philosophy));
            setLastUpdateTimestamp(new Date());
            setNextUpdateIn(Math.floor(refreshIntervalMs / 1000));
        }
        catch (error) {
            if (!isMountedRef.current)
                return;
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error desconocido al actualizar datos';
            setDataError(errorMessage);
            console.error('Error refreshing Cosmic Brain data:', error);
        }
        finally {
            if (isMountedRef.current) {
                setIsDataLoading(false);
            }
        }
    }, [fetchAllGuardianReports, fetchPhilosophyAlignment, calculateSystemHealth, refreshIntervalMs]);
    const startAutoRefresh = (0, react_1.useCallback)(() => {
        if (autoRefreshIntervalRef.current) {
            clearInterval(autoRefreshIntervalRef.current);
        }
        autoRefreshIntervalRef.current = setInterval(() => {
            if (isAutoRefreshActive) {
                refreshData();
            }
        }, refreshIntervalMs);
    }, [refreshData, refreshIntervalMs, isAutoRefreshActive]);
    const startCountdown = (0, react_1.useCallback)(() => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }
        countdownIntervalRef.current = setInterval(() => {
            setNextUpdateIn(prev => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    return Math.floor(refreshIntervalMs / 1000);
                }
                return newValue;
            });
        }, 1000);
    }, [refreshIntervalMs]);
    const pauseAutoRefresh = (0, react_1.useCallback)(() => {
        setIsAutoRefreshActive(false);
        if (autoRefreshIntervalRef.current) {
            clearInterval(autoRefreshIntervalRef.current);
            autoRefreshIntervalRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    }, []);
    const resumeAutoRefresh = (0, react_1.useCallback)(() => {
        setIsAutoRefreshActive(true);
        startAutoRefresh();
        startCountdown();
    }, [startAutoRefresh, startCountdown]);
    (0, react_1.useEffect)(() => {
        refreshData();
    }, [refreshData]);
    (0, react_1.useEffect)(() => {
        if (isAutoRefreshActive) {
            startAutoRefresh();
            startCountdown();
        }
        return () => {
            if (autoRefreshIntervalRef.current) {
                clearInterval(autoRefreshIntervalRef.current);
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [isAutoRefreshActive, startAutoRefresh, startCountdown]);
    (0, react_1.useEffect)(() => {
        return () => {
            isMountedRef.current = false;
            if (autoRefreshIntervalRef.current) {
                clearInterval(autoRefreshIntervalRef.current);
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, []);
    return {
        guardianReports,
        philosophyAlignment,
        systemHealthMetrics,
        isDataLoading,
        dataError,
        refreshData,
        pauseAutoRefresh,
        resumeAutoRefresh,
        lastUpdateTimestamp,
        nextUpdateIn,
        isAutoRefreshActive
    };
};
exports.useCosmicBrainData = useCosmicBrainData;
exports.default = exports.useCosmicBrainData;
//# sourceMappingURL=useCosmicBrainData.js.map