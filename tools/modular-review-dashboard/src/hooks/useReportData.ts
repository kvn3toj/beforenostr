import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';

interface SeverityBreakdown {
  Error: number;
  Warning: number;
  Suggestion: number;
  Info: number;
}

interface CategoryBreakdown {
  [category: string]: number;
}

interface ModuleResult {
  module: string;
  moduleName: string;
  description: string;
  priority: string;
  summary: {
    totalFiles: number;
    totalIssues: number;
    filesWithIssues: number;
    severityBreakdown: SeverityBreakdown;
    categoryBreakdown: CategoryBreakdown;
  };
  results: Array<{
    file: string;
    language: string;
    issues: Array<{
      line_number: number | null;
      severity: string;
      message: string;
      recommendation?: string;
      category: string;
    }>;
  }>;
}

interface ConsolidatedReport {
  timestamp: string;
  summary: {
    totalIssues: number;
    severityBreakdown: SeverityBreakdown;
  };
  results: ModuleResult[];
}

interface HistoricalTrends {
  overall: Array<{
    date: string;
    totalIssues: number;
    severity: SeverityBreakdown;
  }>;
  byModule: {
    [moduleName: string]: Array<{
      date: string;
      totalIssues: number;
      severity: SeverityBreakdown;
    }>;
  };
}

// Mock API functions (replace with actual API calls when backend is available)
const fetchLatestReport = async (): Promise<ConsolidatedReport> => {
  try {
    // In a real implementation, this would fetch from a backend API
    // For now, we'll use the test data
    const response = await fetch('/test-data/sample-consolidated-report.json');
    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching latest report:', error);
    // Fallback to mock data if file not found
    return getMockConsolidatedReport();
  }
};

const fetchHistoricalTrends = async (): Promise<HistoricalTrends> => {
  try {
    const response = await fetch('/test-data/historical-data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch trends');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching historical trends:', error);
    return getMockHistoricalTrends();
  }
};

// Mock data generators
const getMockConsolidatedReport = (): ConsolidatedReport => ({
  timestamp: new Date().toISOString(),
  summary: {
    totalIssues: 42,
    severityBreakdown: {
      Error: 3,
      Warning: 12,
      Suggestion: 18,
      Info: 9,
    },
  },
  results: [
    {
      module: 'HOME',
      moduleName: 'Home Dashboard',
      description: 'Página principal y dashboard del usuario',
      priority: 'high',
      summary: {
        totalFiles: 5,
        totalIssues: 8,
        filesWithIssues: 3,
        severityBreakdown: {
          Error: 1,
          Warning: 3,
          Suggestion: 3,
          Info: 1,
        },
        categoryBreakdown: {
          'Code Quality': 4,
          'Performance': 2,
          'Best Practices': 2,
        },
      },
      results: [],
    },
    {
      module: 'UPLAY',
      moduleName: 'UPlay Gaming',
      description: 'Sistema de gamificación y videos interactivos',
      priority: 'high',
      summary: {
        totalFiles: 8,
        totalIssues: 12,
        filesWithIssues: 5,
        severityBreakdown: {
          Error: 0,
          Warning: 4,
          Suggestion: 6,
          Info: 2,
        },
        categoryBreakdown: {
          'Code Quality': 5,
          'Performance': 3,
          'Accessibility': 2,
          'Best Practices': 2,
        },
      },
      results: [],
    },
    {
      module: 'WALLET',
      moduleName: 'Wallet & Ünits',
      description: 'Gestión de Ünits y economía interna',
      priority: 'high',
      summary: {
        totalFiles: 4,
        totalIssues: 6,
        filesWithIssues: 3,
        severityBreakdown: {
          Error: 2,
          Warning: 2,
          Suggestion: 2,
          Info: 0,
        },
        categoryBreakdown: {
          'Security': 3,
          'Code Quality': 2,
          'Best Practices': 1,
        },
      },
      results: [],
    },
    {
      module: 'AUTH',
      moduleName: 'Authentication',
      description: 'Sistema de autenticación y autorización',
      priority: 'high',
      summary: {
        totalFiles: 6,
        totalIssues: 4,
        filesWithIssues: 2,
        severityBreakdown: {
          Error: 0,
          Warning: 1,
          Suggestion: 2,
          Info: 1,
        },
        categoryBreakdown: {
          'Security': 2,
          'Code Quality': 1,
          'Best Practices': 1,
        },
      },
      results: [],
    },
    {
      module: 'SHARED',
      moduleName: 'Shared Components',
      description: 'Componentes y utilidades compartidas',
      priority: 'low',
      summary: {
        totalFiles: 12,
        totalIssues: 12,
        filesWithIssues: 8,
        severityBreakdown: {
          Error: 0,
          Warning: 2,
          Suggestion: 5,
          Info: 5,
        },
        categoryBreakdown: {
          'Code Quality': 6,
          'Performance': 2,
          'Best Practices': 4,
        },
      },
      results: [],
    },
  ],
});

const getMockHistoricalTrends = (): HistoricalTrends => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return {
    overall: last30Days.map((date, index) => ({
      date,
      totalIssues: Math.floor(Math.random() * 20) + 30 + (index % 7 === 0 ? 10 : 0),
      severity: {
        Error: Math.floor(Math.random() * 5),
        Warning: Math.floor(Math.random() * 8) + 5,
        Suggestion: Math.floor(Math.random() * 10) + 8,
        Info: Math.floor(Math.random() * 6) + 3,
      },
    })),
    byModule: {
      HOME: last30Days.map((date, index) => ({
        date,
        totalIssues: Math.floor(Math.random() * 10) + 5,
        severity: {
          Error: Math.floor(Math.random() * 2),
          Warning: Math.floor(Math.random() * 3),
          Suggestion: Math.floor(Math.random() * 4),
          Info: Math.floor(Math.random() * 2),
        },
      })),
      UPLAY: last30Days.map((date, index) => ({
        date,
        totalIssues: Math.floor(Math.random() * 15) + 8,
        severity: {
          Error: Math.floor(Math.random() * 1),
          Warning: Math.floor(Math.random() * 4),
          Suggestion: Math.floor(Math.random() * 6),
          Info: Math.floor(Math.random() * 3),
        },
      })),
      WALLET: last30Days.map((date, index) => ({
        date,
        totalIssues: Math.floor(Math.random() * 8) + 3,
        severity: {
          Error: Math.floor(Math.random() * 3),
          Warning: Math.floor(Math.random() * 2),
          Suggestion: Math.floor(Math.random() * 3),
          Info: Math.floor(Math.random() * 1),
        },
      })),
      AUTH: last30Days.map((date, index) => ({
        date,
        totalIssues: Math.floor(Math.random() * 6) + 2,
        severity: {
          Error: Math.floor(Math.random() * 1),
          Warning: Math.floor(Math.random() * 2),
          Suggestion: Math.floor(Math.random() * 3),
          Info: Math.floor(Math.random() * 2),
        },
      })),
      SHARED: last30Days.map((date, index) => ({
        date,
        totalIssues: Math.floor(Math.random() * 12) + 8,
        severity: {
          Error: 0,
          Warning: Math.floor(Math.random() * 3),
          Suggestion: Math.floor(Math.random() * 6),
          Info: Math.floor(Math.random() * 4),
        },
      })),
    },
  };
};

// Custom hooks
export const useLatestReport = () => {
  return useQuery({
    queryKey: ['latest-report'],
    queryFn: async () => {
      // Conectar con el backend real en lugar de usar mock data
      const response = await fetch('http://localhost:3002/analytics/modular-review', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token de autenticación si es necesario
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching modular review data: ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    refetchInterval: 30000, // Refetch cada 30 segundos
    staleTime: 10000, // Considera los datos frescos por 10 segundos
    retry: 3, // Reintentar 3 veces en caso de error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useHistoricalTrends = () => {
  return useQuery<HistoricalTrends, Error>(
    'historical-trends',
    fetchHistoricalTrends,
    {
      refetchInterval: 300000, // Refetch every 5 minutes
      staleTime: 120000, // Consider data stale after 2 minutes
      retry: 2,
    }
  );
};

export const useModuleDetail = (moduleId: string) => {
  const { data: report } = useLatestReport();

  // Validación defensiva: solo buscar si report y report.results son válidos
  const moduleData = (report && Array.isArray(report.results))
    ? report.results.find((module) => module.module === moduleId)
    : undefined;

  return {
    data: moduleData,
    isLoading: !report,
    error: !moduleData && report ? new Error(`Module ${moduleId} not found`) : null,
  };
};

// Hook for real-time alerts simulation
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    module?: string;
  }>>([]);

  const { data: report } = useLatestReport();

  useEffect(() => {
    if (!report) return;

    const newAlerts: any[] = [];
    const now = new Date().toISOString();

    // Check for critical issues
    const criticalErrors = report.summary.severityBreakdown.Error;
    if (criticalErrors > 5) {
      newAlerts.push({
        id: `critical-${now}`,
        type: 'error',
        message: `Critical: ${criticalErrors} error-level issues found across modules`,
        timestamp: now,
      });
    }

    // Check per module
    report.results.forEach((module) => {
      if (module.summary.severityBreakdown.Error > 2) {
        newAlerts.push({
          id: `module-critical-${module.module}-${now}`,
          type: 'error',
          message: `High error count in ${module.moduleName}: ${module.summary.severityBreakdown.Error} errors`,
          timestamp: now,
          module: module.module,
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
    }
  }, [report]);

  return { alerts, clearAlert: (id: string) => setAlerts(prev => prev.filter(a => a.id !== id)) };
};

export type { ConsolidatedReport, HistoricalTrends, ModuleResult, SeverityBreakdown };
