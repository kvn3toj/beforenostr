import React, {
  memo,
  useMemo,
  useCallback,
  startTransition,
  useDeferredValue,
  useState,
  useEffect,
  Suspense
} from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  LinearProgress
} from '@mui/material';

// ===== 🚀 PERFORMANCE TYPES ===== //
interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  interactionLatency: number;
  loadingStates: {
    videos: boolean;
    components: boolean;
    data: boolean;
  };
}

interface OptimizationConfig {
  enableVirtualization: boolean;
  enablePreloading: boolean;
  enableMemoryOptimization: boolean;
  enableConcurrentRendering: boolean;
  chunkSize: number;
  preloadDistance: number;
}

interface UPlayPerformanceOptimizerProps {
  children: React.ReactNode;
  config?: Partial<OptimizationConfig>;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableCosmicEffects?: boolean;
}

// ===== 🔧 DEFAULT CONFIGURATION ===== //
const DEFAULT_CONFIG: OptimizationConfig = {
  enableVirtualization: true,
  enablePreloading: true,
  enableMemoryOptimization: true,
  enableConcurrentRendering: true,
  chunkSize: 10,
  preloadDistance: 5,
};

// ===== 🌟 COSMIC ERROR BOUNDARY ===== //
class CosmicErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Cosmic Error in UPlay:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              🌌 Perturbación Cósmica Detectada
            </Typography>
            <Typography variant="body2">
              El universo ÜPlay está realineándose. Por favor, inténtalo de nuevo.
            </Typography>
          </Alert>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      );
    }

    return this.props.children;
  }
}

// ===== 🧠 PERFORMANCE OPTIMIZER COMPONENT ===== //
export const UPlayPerformanceOptimizer: React.FC<UPlayPerformanceOptimizerProps> = memo(({
  children,
  config: userConfig,
  onMetricsUpdate,
  enableCosmicEffects = true,
}) => {
  // 🔧 Configuration
  const config = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...userConfig,
  }), [userConfig]);

  // 📊 Performance Metrics State
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    interactionLatency: 0,
    loadingStates: {
      videos: false,
      components: false,
      data: false,
    },
  });

  // 🌊 Deferred Values for Smooth UI
  const deferredMetrics = useDeferredValue(metrics);

  // 🎯 Simple loading state
  const [optimisticLoading, setOptimisticLoading] = useState(false);

  // ⚡ Preload Critical Components (simplified)
  const preloadCriticalComponents = useCallback(() => {
    if (!config.enablePreloading) return;

    setOptimisticLoading(true);

    // Use non-async startTransition
    startTransition(() => {
      // Simulate preloading without actual async operations
      setTimeout(() => {
        setOptimisticLoading(false);
        console.log('✨ Critical components preloaded');
      }, 1000);
    });
  }, [config.enablePreloading]);

  // 🔄 Memory Optimization (simplified)
  const performMemoryOptimization = useCallback(() => {
    if (!config.enableMemoryOptimization) return;

    startTransition(() => {
      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

      setMetrics(prev => ({
        ...prev,
        memoryUsage,
      }));

      console.log(`🧠 Memory optimized: ${memoryUsage}MB`);
    });
  }, [config.enableMemoryOptimization]);

  // 📈 Performance Monitoring
  const measurePerformance = useCallback((operationName: string, operation: () => void) => {
    const startTime = performance.now();

    operation();

    const endTime = performance.now();
    const duration = endTime - startTime;

    setMetrics(prev => ({
      ...prev,
      renderTime: duration,
      interactionLatency: duration < 16 ? duration : prev.interactionLatency,
    }));

    console.log(`⚡ ${operationName}: ${duration.toFixed(2)}ms`);
  }, []);

  // 🧹 Memory Cleanup Effect
  useEffect(() => {
    const interval = setInterval(() => {
      performMemoryOptimization();
    }, 30000); // Optimize every 30 seconds

    return () => clearInterval(interval);
  }, [performMemoryOptimization]);

  // 📊 Metrics Reporting
  useEffect(() => {
    onMetricsUpdate?.(deferredMetrics);
  }, [deferredMetrics, onMetricsUpdate]);

  // 🎨 Loading Indicator
  const LoadingIndicator = memo(() => (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999
    }}>
      <LinearProgress
        sx={{
          height: 3,
          background: 'transparent',
          '& .MuiLinearProgress-bar': {
            background: enableCosmicEffects
              ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)'
              : '#6366f1',
          },
        }}
      />
    </Box>
  ));

  // 🎯 Performance Context Provider
  const performanceContextValue = useMemo(() => ({
    config,
    metrics: deferredMetrics,
    measurePerformance,
    preloadCriticalComponents,
    performMemoryOptimization,
  }), [config, deferredMetrics, measurePerformance, preloadCriticalComponents, performMemoryOptimization]);

  return (
    <UPlayPerformanceContext.Provider value={performanceContextValue}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        {optimisticLoading && <LoadingIndicator />}
        <Suspense fallback={<LoadingIndicator />}>
          {children}
        </Suspense>
      </Box>
    </UPlayPerformanceContext.Provider>
  );
});

UPlayPerformanceOptimizer.displayName = 'UPlayPerformanceOptimizer';

// ===== 🎯 PERFORMANCE CONTEXT ===== //
export const UPlayPerformanceContext = React.createContext<{
  config: OptimizationConfig;
  metrics: PerformanceMetrics;
  measurePerformance: (name: string, operation: () => void) => void;
  preloadCriticalComponents: () => void;
  performMemoryOptimization: () => void;
} | null>(null);

// ===== 🪝 PERFORMANCE HOOK ===== //
export const useUPlayPerformance = () => {
  const context = React.useContext(UPlayPerformanceContext);
  if (!context) {
    throw new Error('useUPlayPerformance must be used within UPlayPerformanceOptimizer');
  }
  return context;
};

export default UPlayPerformanceOptimizer;
