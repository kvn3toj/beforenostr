import React, { useState, useEffect } from 'react';
import { ENV, EnvironmentHelpers } from '../../lib/environment';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'loading';
  details: string;
  data?: any;
  timestamp: number;
}

interface ConnectionDiagnosticsProps {
  show?: boolean;
  onClose?: () => void;
}

/**
 * 🔍 Connection Diagnostics Component
 *
 * Provides real-time diagnostics for backend connectivity issues.
 * Only shows in development/testing environments.
 */
export const ConnectionDiagnostics: React.FC<ConnectionDiagnosticsProps> = ({
  show = false,
  onClose,
}) => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Only show in development/testing
  if (!EnvironmentHelpers.shouldLogDebug() || !show) {
    return null;
  }

  const runDiagnostics = async () => {
    setIsRunning(true);
    const newResults: DiagnosticResult[] = [];

    // Helper to add result
    const addResult = (
      name: string,
      status: 'pass' | 'fail' | 'warning',
      details: string,
      data?: any
    ) => {
      newResults.push({
        name,
        status,
        details,
        data,
        timestamp: Date.now(),
      });
      setResults([...newResults]); // Update UI in real-time
    };

    // 1. Environment Check
    addResult(
      'Environment Configuration',
      'pass',
      `Environment: ${EnvironmentHelpers.getEnvironmentType()}, API: ${ENV.apiBaseUrl}, Origin: ${ENV.currentOrigin}`,
      {
        environment: EnvironmentHelpers.getEnvironmentType(),
        apiBaseUrl: ENV.apiBaseUrl,
        currentOrigin: ENV.currentOrigin,
        mockAuth: ENV.enableMockAuth,
        isTesting: ENV.isTesting,
      }
    );

    // 2. Basic Health Check
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${ENV.apiBaseUrl}/health`, {
        signal: controller.signal,
        headers: EnvironmentHelpers.getCorsHeaders(),
      });

      if (response.ok) {
        const data = await response.text();
        addResult(
          'Backend Health Check',
          'pass',
          `Status: ${response.status} ${response.statusText}`,
          {
            responseText: data,
            headers: Object.fromEntries(response.headers.entries()),
          }
        );
      } else {
        addResult(
          'Backend Health Check',
          'fail',
          `Status: ${response.status} ${response.statusText}`,
          { headers: Object.fromEntries(response.headers.entries()) }
        );
      }
    } catch (error: any) {
      addResult('Backend Health Check', 'fail', `Error: ${error.message}`, {
        errorName: error.name,
        errorStack: error.stack,
      });
    }

    // 3. CORS Preflight Check
    try {
      const response = await fetch(`${ENV.apiBaseUrl}/auth/login`, {
        method: 'OPTIONS',
        headers: {
          Origin: ENV.currentOrigin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type,Authorization',
        },
      });

      const corsOrigin = response.headers.get('access-control-allow-origin');
      const corsOk = corsOrigin === '*' || corsOrigin === ENV.currentOrigin;

      addResult(
        'CORS Preflight Check',
        corsOk ? 'pass' : 'warning',
        `CORS Origin: ${corsOrigin}, Status: ${response.status}`,
        {
          corsHeaders: {
            'access-control-allow-origin': response.headers.get(
              'access-control-allow-origin'
            ),
            'access-control-allow-methods': response.headers.get(
              'access-control-allow-methods'
            ),
            'access-control-allow-headers': response.headers.get(
              'access-control-allow-headers'
            ),
            'access-control-allow-credentials': response.headers.get(
              'access-control-allow-credentials'
            ),
          },
        }
      );
    } catch (error: any) {
      addResult('CORS Preflight Check', 'fail', `Error: ${error.message}`, {
        errorName: error.name,
      });
    }

    // 4. Auth Endpoint Test
    try {
      const response = await fetch(`${ENV.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: EnvironmentHelpers.getCorsHeaders(),
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'invalid',
        }),
      });

      // We expect 401 or 400, which means the endpoint is working
      const authOk = response.status === 401 || response.status === 400;
      addResult(
        'Auth Endpoint Test',
        authOk ? 'pass' : 'warning',
        `Status: ${response.status} ${response.statusText}`,
        { expectedStatuses: [400, 401], actualStatus: response.status }
      );
    } catch (error: any) {
      addResult('Auth Endpoint Test', 'fail', `Error: ${error.message}`, {
        errorName: error.name,
      });
    }

    // 5. Network Connectivity
    addResult(
      'Network Status',
      navigator.onLine ? 'pass' : 'fail',
      `Navigator Online: ${navigator.onLine}`,
      {
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection
          ? {
              effectiveType: (navigator as any).connection.effectiveType,
              downlink: (navigator as any).connection.downlink,
              rtt: (navigator as any).connection.rtt,
            }
          : 'not available',
      }
    );

    setIsRunning(false);
  };

  useEffect(() => {
    if (show) {
      runDiagnostics();
    }
  }, [show]);

  useEffect(() => {
    if (autoRefresh && show) {
      const interval = setInterval(runDiagnostics, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, show]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return '✅';
      case 'fail':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'loading':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600';
      case 'fail':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'loading':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            🔍 Connection Diagnostics
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Auto-refresh (10s)</span>
            </label>
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'Refresh'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {results.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Running diagnostics...
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {getStatusIcon(result.status)} {result.name}
                    </h3>
                    <span
                      className={`text-sm ${getStatusColor(result.status)}`}
                    >
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{result.details}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        Show Details
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Troubleshooting */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-2">
            🛠 Troubleshooting Tips:
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {EnvironmentHelpers.getTroubleshootingInfo().troubleshootingSteps.map(
              (step, index) => (
                <div key={index}>{step}</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 Hook to show connection diagnostics
 */
export const useConnectionDiagnostics = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Auto-show diagnostics on connection errors
  useEffect(() => {
    const handleConnectionError = (event: CustomEvent) => {
      if (EnvironmentHelpers.shouldLogDebug()) {
        console.warn('🚨 Connection error detected, showing diagnostics');
        setShowDiagnostics(true);
      }
    };

    window.addEventListener(
      'api-connection-error',
      handleConnectionError as EventListener
    );

    return () => {
      window.removeEventListener(
        'api-connection-error',
        handleConnectionError as EventListener
      );
    };
  }, []);

  // Keyboard shortcut to show diagnostics (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key === 'D' &&
        EnvironmentHelpers.shouldLogDebug()
      ) {
        event.preventDefault();
        setShowDiagnostics(true);
      }
    };

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, []);

  return {
    showDiagnostics,
    setShowDiagnostics,
    openDiagnostics: () => setShowDiagnostics(true),
    closeDiagnostics: () => setShowDiagnostics(false),
  };
};
