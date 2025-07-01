/**
 * 🚀 Hook simplificado de performance cósmica
 * Versión liviana para UStats que reemplaza la dependencia compleja
 */
import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
}

interface CosmicPerformanceHook {
  performance3D: PerformanceMetrics;
  cosmicMode: boolean;
  toggleCosmicMode: () => void;
}

interface CosmicPerformanceConfig {
  enabledByDefault?: boolean;
  performanceThreshold?: number;
}

export const useCosmicPerformance = (config: CosmicPerformanceConfig = {}): CosmicPerformanceHook => {
  const { enabledByDefault = true, performanceThreshold = 45 } = config;

  const [cosmicMode, setCosmicMode] = useState(enabledByDefault);
  const [performance3D, setPerformance3D] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 50,
    renderTime: 16.67
  });

  const toggleCosmicMode = useCallback(() => {
    setCosmicMode(prev => !prev);
  }, []);

  // Simular métricas de performance básicas
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformance3D(prev => ({
        fps: Math.max(30, Math.min(60, prev.fps + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(30, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 10)),
        renderTime: Math.max(8, Math.min(33, prev.renderTime + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-deshabilitar cosmic mode si performance es baja
  useEffect(() => {
    if (performance3D.fps < performanceThreshold && cosmicMode) {
      setCosmicMode(false);
    }
  }, [performance3D.fps, performanceThreshold, cosmicMode]);

  return {
    performance3D,
    cosmicMode,
    toggleCosmicMode
  };
};
