import React, { useEffect, useState } from 'react';
import { EnvironmentHelpers } from '../../lib/environment';

interface ErrorLog {
  id: string;
  timestamp: number;
  error: any;
  source: string;
  details: any;
}

/**
 * 🔍 Error Logger Component
 *
 * Captures and displays API errors in development for better debugging
 */
export const ErrorLogger: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (!EnvironmentHelpers.shouldLogDebug()) {
    return null;
  }

  useEffect(() => {
    const handleQueryError = (event: CustomEvent) => {
      const errorLog: ErrorLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        error: event.detail.error,
        source: 'react-query',
        details: {
          queryKey: event.detail.query,
          category: event.detail.category,
          statusCode: event.detail.statusCode,
        },
      };

      setErrors((prev) => [errorLog, ...prev.slice(0, 9)]); // Keep last 10 errors

      // Auto-show on errors
      if (event.detail.statusCode === 404 || event.detail.statusCode === 401) {
        setIsVisible(true);
      }
    };

    const handleApiError = (event: CustomEvent) => {
      const errorLog: ErrorLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        error: event.detail,
        source: 'api-service',
        details: event.detail,
      };

      setErrors((prev) => [errorLog, ...prev.slice(0, 9)]);
    };

    window.addEventListener('query-error', handleQueryError as EventListener);
    window.addEventListener('api-error', handleApiError as EventListener);

    return () => {
      window.removeEventListener(
        'query-error',
        handleQueryError as EventListener
      );
      window.removeEventListener('api-error', handleApiError as EventListener);
    };
  }, []);

  // Keyboard shortcut to toggle (Ctrl+Shift+E)
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 shadow-lg"
          title="Show Error Log (Ctrl+Shift+E)"
        >
          🚨 Errors ({errors.length})
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-red-300 rounded-lg shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-red-50 border-b border-red-200">
        <h3 className="font-medium text-red-900">🚨 Error Log</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-600">{errors.length} errors</span>
          <button
            onClick={() => setErrors([])}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Error List */}
      <div className="max-h-80 overflow-y-auto">
        {errors.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No errors logged yet
          </div>
        ) : (
          errors.map((errorLog) => (
            <div key={errorLog.id} className="border-b border-gray-200 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">
                  {errorLog.source}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(errorLog.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="text-sm text-red-700 mb-2">
                {errorLog.error?.message || 'Unknown error'}
              </div>

              {errorLog.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    Details
                  </summary>
                  <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                    {JSON.stringify(errorLog.details, null, 2)}
                  </pre>
                </details>
              )}

              {/* Quick Actions */}
              <div className="mt-2 flex flex-wrap gap-2">
                {errorLog.details?.statusCode === 404 && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Endpoint Missing
                  </span>
                )}
                {errorLog.details?.statusCode === 401 && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Auth Required
                  </span>
                )}
                {errorLog.details?.category === 'network' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Network Issue
                  </span>
                )}
                {errorLog.details?.queryKey?.includes('game') && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Game API
                  </span>
                )}
                {errorLog.details?.queryKey?.includes('wallet') && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Wallet API
                  </span>
                )}
                {errorLog.details?.queryKey?.includes('notifications') && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Notifications
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 bg-gray-50 border-t text-xs text-gray-600">
        Press <kbd className="bg-white px-1 rounded border">Ctrl+Shift+E</kbd>{' '}
        to toggle
      </div>
    </div>
  );
};

export default ErrorLogger;
