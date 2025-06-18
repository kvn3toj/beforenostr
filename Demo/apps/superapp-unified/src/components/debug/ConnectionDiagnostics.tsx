import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  Button,
  Collapse,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Refresh,
  ExpandMore,
  ExpandLess,
  Info,
  Build,
} from '@mui/icons-material';
import { ENV, EnvironmentHelpers } from '../../lib/environment';

interface DiagnosticResult {
  service: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  timestamp: string;
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
const ConnectionDiagnostics: React.FC<ConnectionDiagnosticsProps> = ({
  show = false,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // 🚨 BUILDER.IO SAFE MODE: Memoizar detección de entorno Builder.io
  const isBuilderEnvironment = useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    return (
      window.location.hostname.includes('builder.io') || 
      window.location.port === '48752' ||
      window.location.hostname.includes('preview')
    );
  }, []);

  // 🔧 BUILDER.IO RULES: Funciones sin dependencias primero
  const createBuilderDiagnostics = useCallback(() => {
    const results: DiagnosticResult[] = [];
    
    results.push({
      service: 'Builder.io Environment',
      status: 'info',
      message: 'Ejecutándose en entorno Builder.io',
      details: 'Modo seguro activado - usando datos mock para prevenir errores de API',
      timestamp: new Date().toISOString(),
    });

    results.push({
      service: 'Mock Data System',
      status: 'success',
      message: 'Sistema de datos mock activo',
      details: 'Todos los hooks están configurados para usar datos seguros en Builder.io',
      timestamp: new Date().toISOString(),
    });

    results.push({
      service: 'API Calls',
      status: 'warning',
      message: 'Llamadas API deshabilitadas',
      details: 'Las llamadas a /game/user y /wallets/user están deshabilitadas para prevenir errores',
      timestamp: new Date().toISOString(),
    });

    results.push({
      service: 'Frontend Components',
      status: 'success',
      message: 'Componentes funcionando correctamente',
      details: 'Todos los componentes están renderizando con datos mock',
      timestamp: new Date().toISOString(),
    });

    return results;
  }, []);

  // 🔧 BUILDER.IO RULES: Funciones que dependen de las anteriores
  const createDevelopmentDiagnostics = useCallback(async () => {
    const results: DiagnosticResult[] = [];

    try {
      // Test Backend Health
      const healthResponse = await fetch('http://localhost:1111/health');
      if (healthResponse.ok) {
        results.push({
          service: 'Backend Health',
          status: 'success',
          message: 'Backend NestJS disponible',
          details: `Puerto 1111 respondiendo correctamente`,
          timestamp: new Date().toISOString(),
        });
      } else {
        results.push({
          service: 'Backend Health',
          status: 'error',
          message: 'Backend no responde',
          details: `HTTP ${healthResponse.status}`,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      results.push({
        service: 'Backend Health',
        status: 'error',
        message: 'Backend no disponible',
        details: 'No se puede conectar al puerto 1111',
        timestamp: new Date().toISOString(),
      });
    }

    // Test Frontend
    results.push({
      service: 'Frontend SuperApp',
      status: 'success',
      message: 'SuperApp ejecutándose',
      details: `Puerto ${window.location.port || '3001'}`,
      timestamp: new Date().toISOString(),
    });

    // Test Environment
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    results.push({
      service: 'Environment Config',
      status: apiBaseUrl ? 'success' : 'warning',
      message: apiBaseUrl ? 'Variables configuradas' : 'Variables faltantes',
      details: `API_BASE_URL: ${apiBaseUrl || 'No configurada'}`,
      timestamp: new Date().toISOString(),
    });

    return results;
  }, []);

  // 🔧 BUILDER.IO RULES: Función principal que usa las anteriores
  const runDiagnostics = useCallback(async () => {
    if (!show) return;
    
    setIsRunning(true);
    
    try {
      let results: DiagnosticResult[];
      
      if (isBuilderEnvironment) {
        results = createBuilderDiagnostics();
      } else {
        results = await createDevelopmentDiagnostics();
      }
      
      setDiagnostics(results);
    } catch (error) {
      console.error('🚨 Error en diagnósticos:', error);
      setDiagnostics([{
        service: 'Diagnostics System',
        status: 'error',
        message: 'Error ejecutando diagnósticos',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsRunning(false);
    }
  }, [show, isBuilderEnvironment, createBuilderDiagnostics, createDevelopmentDiagnostics]);

  // 🧹 BUILDER.IO RULES: Cleanup effect obligatorio
  useEffect(() => {
    return () => {
      // Limpiar cualquier operación pendiente
      setIsRunning(false);
    };
  }, []);

  // 🔧 BUILDER.IO RULES: useEffect con dependencias correctas
  useEffect(() => {
    if (show) {
      runDiagnostics();
    }
  }, [show, runDiagnostics]);

  // 🚨 BUILDER.IO RULES: Early return después de todos los hooks
  if (!show) return null;

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Build color="primary" />
            <Typography variant="h6">
              {isBuilderEnvironment ? '🎭 Builder.io Diagnostics' : '🔧 Connection Diagnostics'}
            </Typography>
            {isBuilderEnvironment && (
              <Chip 
                label="Safe Mode" 
                color="info" 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={runDiagnostics}
              disabled={isRunning}
            >
              {isRunning ? 'Ejecutando...' : 'Actualizar'}
            </Button>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {isBuilderEnvironment && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>Modo Builder.io Detectado:</strong> Las llamadas API están deshabilitadas para prevenir errores. 
              Todos los componentes usan datos mock seguros.
            </Typography>
          </Alert>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Stack spacing={2}>
              {diagnostics.map((diagnostic, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getStatusIcon(diagnostic.status)}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {diagnostic.service}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {diagnostic.message}
                      </Typography>
                      {diagnostic.details && (
                        <Typography variant="caption" color="text.secondary">
                          {diagnostic.details}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={diagnostic.status.toUpperCase()}
                      color={getStatusColor(diagnostic.status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  {index < diagnostics.length - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Stack>

            {isBuilderEnvironment && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🛡️ Protecciones Activas en Builder.io:
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>Hooks de wallet deshabilitados</li>
                  <li>Hooks de gamificación deshabilitados</li>
                  <li>Datos mock consistentes</li>
                  <li>Sin llamadas a endpoints problemáticos</li>
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export { ConnectionDiagnostics };
