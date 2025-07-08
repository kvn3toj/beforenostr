import { useState, useEffect, useCallback, useRef } from 'react';
import { CosmicBrain } from '../../CosmicBrain';
import { AnalysisReport, GuardianType, PhilosophyAlignment } from '../../types';

/**
 * 🎣 useCosmicBrainData Hook
 *
 * Hook personalizado para gestionar el estado y datos del AI Cosmic Brain.
 * Implementa principios de "Naming as a Process" para máxima claridad
 * y mantenibilidad del código.
 *
 * Características:
 * - Actualizaciones automáticas en intervalos configurables
 * - Manejo robusto de errores
 * - Estado de carga optimizado
 * - Limpieza automática de recursos
 * - Caché inteligente de datos
 */

interface SystemHealthMetrics {
  overallScore: number;
  guardiansActive: number;
  totalRecommendations: number;
  criticalIssues: number;
  lastEvolution: Date | null;
  philosophyAlignment: number;
}

interface GuardianReportsCollection {
  philosophy?: AnalysisReport;
  architecture?: AnalysisReport;
  ux?: AnalysisReport;
  performance?: AnalysisReport;
}

interface UseCosmicBrainDataReturn {
  // Datos principales
  guardianReports: GuardianReportsCollection;
  philosophyAlignment: PhilosophyAlignment | null;
  systemHealthMetrics: SystemHealthMetrics;

  // Estados de carga y error
  isDataLoading: boolean;
  dataError: string | null;

  // Funciones de control
  refreshData: () => Promise<void>;
  pauseAutoRefresh: () => void;
  resumeAutoRefresh: () => void;

  // Metadatos útiles
  lastUpdateTimestamp: Date | null;
  nextUpdateIn: number; // segundos hasta próxima actualización
  isAutoRefreshActive: boolean;
}

/**
 * 🔄 Hook principal para datos del Cosmic Brain
 */
export const useCosmicBrainData = (
  cosmicBrain: CosmicBrain,
  refreshIntervalMs: number = 30000
): UseCosmicBrainDataReturn => {

  // ============================================================================
  // 📊 State Management con nombres que explican el propósito
  // ============================================================================

  const [guardianReports, setGuardianReports] = useState<GuardianReportsCollection>({});
  const [philosophyAlignment, setPhilosophyAlignment] = useState<PhilosophyAlignment | null>(null);
  const [systemHealthMetrics, setSystemHealthMetrics] = useState<SystemHealthMetrics>({
    overallScore: 0,
    guardiansActive: 0,
    totalRecommendations: 0,
    criticalIssues: 0,
    lastEvolution: null,
    philosophyAlignment: 0
  });

  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<Date | null>(null);
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(0);
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState<boolean>(true);

  // Referencias para manejo de intervalos y limpieza
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // ============================================================================
  // 🔄 Core Data Fetching Functions
  // ============================================================================

  /**
   * Obtiene datos de todos los guardians de manera eficiente
   */
  const fetchAllGuardianReports = useCallback(async (): Promise<GuardianReportsCollection> => {
    const guardianTypes: GuardianType[] = ['philosophy', 'architecture', 'ux', 'performance'];
    const reports: GuardianReportsCollection = {};

    // Ejecutar análisis de todos los guardians en paralelo
    const analysisPromises = guardianTypes.map(async (type) => {
      try {
        const guardian = cosmicBrain.getGuardian(type);
        if (guardian) {
          const report = await guardian.performSpecializedAnalysis();
          return { type, report };
        }
        return { type, report: null };
      } catch (error) {
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

  /**
   * Obtiene la alineación filosófica actual
   */
  const fetchPhilosophyAlignment = useCallback(async (): Promise<PhilosophyAlignment | null> => {
    try {
      const philosophyGuardian = cosmicBrain.getGuardian('philosophy');
      if (philosophyGuardian) {
        const report = await philosophyGuardian.performSpecializedAnalysis();
        return report.philosophyAlignment || null;
      }
      return null;
    } catch (error) {
      console.warn('Error fetching philosophy alignment:', error);
      return null;
    }
  }, [cosmicBrain]);

  /**
   * Calcula métricas de salud del sistema basadas en reportes
   */
  const calculateSystemHealth = useCallback((
    reports: GuardianReportsCollection,
    philosophy: PhilosophyAlignment | null
  ): SystemHealthMetrics => {
    const activeGuardians = Object.keys(reports).length;
    const allReports = Object.values(reports).filter(Boolean) as AnalysisReport[];

    const totalRecommendations = allReports.reduce(
      (total, report) => total + (report.recommendations?.length || 0),
      0
    );

    const criticalIssues = allReports.reduce(
      (total, report) => total + (report.recommendations?.filter(r => r.severity === 'critical').length || 0),
      0
    );

    // Calcular score general basado en métricas de cada guardian
    const scores = allReports.map(report => {
      const metrics = report.metrics;
      if (!metrics) return 0;

      // Extraer score principal de cada tipo de guardian
      if (report.guardianType === 'philosophy') return metrics.overallPhilosophyScore || 0;
      if (report.guardianType === 'architecture') return metrics.structuralHealth || 0;
      if (report.guardianType === 'ux') return metrics.overallUXScore || 0;
      if (report.guardianType === 'performance') return metrics.overallPerformance || 0;

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

  /**
   * Función principal para refrescar todos los datos
   */
  const refreshData = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;

    try {
      setIsDataLoading(true);
      setDataError(null);

      // Fetch datos en paralelo para mejor performance
      const [reports, philosophy] = await Promise.all([
        fetchAllGuardianReports(),
        fetchPhilosophyAlignment()
      ]);

      if (!isMountedRef.current) return;

      // Actualizar estado solo si el componente sigue montado
      setGuardianReports(reports);
      setPhilosophyAlignment(philosophy);
      setSystemHealthMetrics(calculateSystemHealth(reports, philosophy));
      setLastUpdateTimestamp(new Date());
      setNextUpdateIn(Math.floor(refreshIntervalMs / 1000));

    } catch (error) {
      if (!isMountedRef.current) return;

      const errorMessage = error instanceof Error
        ? error.message
        : 'Error desconocido al actualizar datos';

      setDataError(errorMessage);
      console.error('Error refreshing Cosmic Brain data:', error);
    } finally {
      if (isMountedRef.current) {
        setIsDataLoading(false);
      }
    }
  }, [fetchAllGuardianReports, fetchPhilosophyAlignment, calculateSystemHealth, refreshIntervalMs]);

  // ============================================================================
  // ⏱️ Auto-refresh and Countdown Management
  // ============================================================================

  /**
   * Inicia el auto-refresh con intervalo configurado
   */
  const startAutoRefresh = useCallback(() => {
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
    }

    autoRefreshIntervalRef.current = setInterval(() => {
      if (isAutoRefreshActive) {
        refreshData();
      }
    }, refreshIntervalMs);
  }, [refreshData, refreshIntervalMs, isAutoRefreshActive]);

  /**
   * Inicia el countdown hasta la próxima actualización
   */
  const startCountdown = useCallback(() => {
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

  /**
   * Pausa el auto-refresh manteniendo los datos actuales
   */
  const pauseAutoRefresh = useCallback(() => {
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

  /**
   * Reanuda el auto-refresh
   */
  const resumeAutoRefresh = useCallback(() => {
    setIsAutoRefreshActive(true);
    startAutoRefresh();
    startCountdown();
  }, [startAutoRefresh, startCountdown]);

  // ============================================================================
  // 🔄 Effect Hooks para inicialización y limpieza
  // ============================================================================

  // Inicialización: cargar datos iniciales
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Configurar auto-refresh cuando esté activo
  useEffect(() => {
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

  // Limpieza al desmontar el componente
  useEffect(() => {
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

  // ============================================================================
  // 📤 Return Hook Data
  // ============================================================================

  return {
    // Datos principales
    guardianReports,
    philosophyAlignment,
    systemHealthMetrics,

    // Estados de carga y error
    isDataLoading,
    dataError,

    // Funciones de control
    refreshData,
    pauseAutoRefresh,
    resumeAutoRefresh,

    // Metadatos útiles
    lastUpdateTimestamp,
    nextUpdateIn,
    isAutoRefreshActive
  };
};

export default useCosmicBrainData;
