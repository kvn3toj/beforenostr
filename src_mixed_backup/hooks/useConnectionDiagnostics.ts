import { useState, useEffect, useCallback } from 'react';
import { EnvironmentHelpers } from '../lib/environment';

/**
 * 🎯 Hook to show connection diagnostics
 * ✅ BUILDER.IO RULES COMPLIANT
 */
export const useConnectionDiagnostics = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // 🔧 BUILDER.IO RULES: Funciones sin dependencias primero
  const openDiagnostics = useCallback(() => {
    setShowDiagnostics(true);
  }, []);

  const closeDiagnostics = useCallback(() => {
    setShowDiagnostics(false);
  }, []);

  // 🔧 BUILDER.IO RULES: Event handlers que dependen SOLO de openDiagnostics
  const handleConnectionError = useCallback((event: CustomEvent) => {
    if (EnvironmentHelpers.shouldLogDebug()) {
      console.warn('🚨 Connection error detected, showing diagnostics');
      openDiagnostics();
    }
  }, [openDiagnostics]);

  const handleKeyboard = useCallback((event: KeyboardEvent) => {
    if (
      event.ctrlKey &&
      event.shiftKey &&
      event.key === 'D' &&
      EnvironmentHelpers.shouldLogDebug()
    ) {
      event.preventDefault();
      openDiagnostics();
    }
  }, [openDiagnostics]);

  // 🔧 BUILDER.IO RULES: useEffect con dependencias correctas
  useEffect(() => {
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
  }, [handleConnectionError]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [handleKeyboard]);

  // 🧹 BUILDER.IO RULES: Cleanup effect obligatorio
  useEffect(() => {
    return () => {
      // Limpiar estado al desmontar
      setShowDiagnostics(false);
    };
  }, []);

  return {
    showDiagnostics,
    setShowDiagnostics,
    openDiagnostics,
    closeDiagnostics,
  };
}; 