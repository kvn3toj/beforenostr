import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { authAPIDebug } from '../../lib/api-service-debug'; // COMENTADO: archivo no existe

interface NetworkErrorDebugProps {
  error?: Error | any;
  onRetry?: () => void;
  onClose?: () => void;
}

export const NetworkErrorDebug: React.FC<NetworkErrorDebugProps> = ({
  error,
  onRetry,
  onClose,
}) => {
  // Only run diagnostics in very specific development conditions
  const shouldRunDiagnostics =
    typeof window !== 'undefined' &&
    typeof import.meta !== 'undefined' &&
    import.meta.env?.DEV === true &&
    import.meta.env?.MODE === 'development' &&
    process.env.NODE_ENV !== 'test' &&
    !process.env.CI;

  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<any>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<string>('');

  const runDiagnostics = async () => {
    setDiagnosticsRunning(true);
    try {
      // Don't make network requests unless in development
      if (!shouldRunDiagnostics) {
        const mockResult = {
          success: true,
          diagnostics: [
            {
              step: 'CI Environment Detected',
              success: true,
              details: 'Diagnostics disabled in CI',
            },
          ],
        };
        setDiagnosticsResult(mockResult);
        setDiagnosticReport('Diagnostics disabled in CI environment');
        return;
      }

      // Since authAPIDebug is not available, run basic diagnostics
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || 'http://backend:3002';
      const diagnostics = [];

      // Test backend health
      try {
        const healthResponse = await fetch(`${baseURL}/health`);
        diagnostics.push({
          step: 'Backend Health Check',
          success: healthResponse.ok,
          error: healthResponse.ok ? null : `HTTP ${healthResponse.status}`,
          details: healthResponse.ok
            ? 'Backend is responding'
            : 'Backend not available',
        });
      } catch (err: any) {
        diagnostics.push({
          step: 'Backend Health Check',
          success: false,
          error: err.message,
          details: 'Failed to connect to backend',
        });
      }

      // Test CORS
      try {
        const corsResponse = await fetch(`${baseURL}/auth/login`, {
          method: 'OPTIONS',
          headers: {
            Origin: 'https://frontend:3001',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
          },
        });
        diagnostics.push({
          step: 'CORS Preflight Test',
          success: corsResponse.ok,
          error: corsResponse.ok ? null : `HTTP ${corsResponse.status}`,
          details: corsResponse.ok
            ? 'CORS configured correctly'
            : 'CORS configuration issue',
        });
      } catch (err: any) {
        diagnostics.push({
          step: 'CORS Preflight Test',
          success: false,
          error: err.message,
          details: 'CORS test failed',
        });
      }

      const result = {
        success: diagnostics.every((d) => d.success),
        diagnostics,
      };

      setDiagnosticsResult(result);

      const report = `Network Diagnostics Report
Generated: ${new Date().toISOString()}

Test Results:
${diagnostics.map((d) => `${d.success ? '✅' : '❌'} ${d.step}: ${d.details || d.error || 'OK'}`).join('\n')}

Environment:
- Navigator Online: ${navigator.onLine}
`;
      setDiagnosticReport(report);
    } catch {
      // Silently handle diagnostic errors
    } finally {
      setDiagnosticsRunning(false);
    }
  };

  const copyDiagnosticReport = () => {
    navigator.clipboard.writeText(diagnosticReport);
  };

  const getErrorCategory = (error: any) => {
    if (error?.category) return error.category;
    if (error?.message?.includes('fetch')) return 'network';
    if (error?.message?.includes('CORS')) return 'cors';
    if (error?.message?.includes('timeout')) return 'timeout';
    return 'unknown';
  };

  const getErrorSeverity = (category: string) => {
    switch (category) {
      case 'network':
        return 'error';
      case 'cors':
        return 'warning';
      case 'timeout':
        return 'info';
      default:
        return 'error';
    }
  };

  const getQuickFixes = (error: any) => {
    const category = getErrorCategory(error);
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://backend:3002';

    switch (category) {
      case 'network':
        return [
          'Verificar que el backend esté ejecutándose',
          `Probar: npm run start:backend:dev`,
          `Verificar acceso: curl ${baseURL}/health`,
          'Revisar logs del backend para errores',
        ];
      case 'cors':
        return [
          'Verificar configuración CORS del backend',
          'Asegurar que el frontend esté permitido en CORS',
          'Revisar headers Access-Control-Allow-Origin',
          'Verificar que credentials estén configurados correctamente',
        ];
      case 'timeout':
        return [
          'Verificar conexión de red',
          'El servidor puede estar sobrecargado',
          'Intentar nuevamente en unos segundos',
          'Verificar latencia de red',
        ];
      default:
        return [
          'Verificar logs del navegador (F12)',
          'Revisar tab Network para detalles de la petición',
          'Verificar que el endpoint esté disponible',
          'Contactar soporte técnico si persiste',
        ];
    }
  };

  const getTroubleshootingSteps = () => {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

    return [
      {
        title: '1. Verificar Backend',
        steps: [
          'Abrir terminal en el directorio del proyecto',
          'Ejecutar: npm run start:backend:dev',
          `Verificar que responda en: ${baseURL}/health`,
          'Revisar logs del backend para errores',
        ],
      },
      {
        title: '2. Verificar Conectividad',
        steps: [
          `Abrir: ${baseURL}/health en el navegador`,
          'Verificar respuesta JSON con status: "ok"',
          'Si no responde, el backend no está ejecutándose',
          'Si hay error CORS, verificar configuración',
        ],
      },
      {
        title: '3. Verificar CORS',
        steps: [
          'Abrir DevTools (F12) → Network tab',
          'Intentar login nuevamente',
          'Buscar requests fallidos en la lista',
          'Verificar headers de respuesta CORS',
        ],
      },
      {
        title: '4. Verificar Configuración',
        steps: [
          'Verificar archivo .env en Demo/apps/superapp-unified/',
          `VITE_API_BASE_URL=${baseURL}`,
          'VITE_ENABLE_MOCK_AUTH=false',
          'Reiniciar frontend después de cambios',
        ],
      },
    ];
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" color="error">
            🚨 Error de Conexión Detectado
          </Typography>
          {onClose && (
            <Button onClick={onClose} size="small">
              Cerrar
            </Button>
          )}
        </Box>

        {error && (
          <Alert
            severity={getErrorSeverity(getErrorCategory(error))}
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Error: {error.message}
            </Typography>
            <Chip
              label={`Categoría: ${getErrorCategory(error)}`}
              size="small"
              color={getErrorSeverity(getErrorCategory(error)) as any}
              variant="outlined"
            />
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            onClick={runDiagnostics}
            disabled={diagnosticsRunning}
            startIcon={
              diagnosticsRunning ? <CircularProgress size={16} /> : null
            }
          >
            {diagnosticsRunning ? 'Ejecutando...' : '🔍 Ejecutar Diagnósticos'}
          </Button>
          {onRetry && (
            <Button variant="outlined" onClick={onRetry}>
              🔄 Reintentar Login
            </Button>
          )}
        </Box>

        {/* Diagnostics Results */}
        {diagnosticsResult && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                📊 Resultados del Diagnóstico{' '}
                {diagnosticsResult.success ? '✅' : '❌'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {diagnosticsResult.diagnostics.map(
                  (diag: any, index: number) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <span>{diag.success ? '✅' : '❌'}</span>
                            <span>{diag.step}</span>
                            {!diag.success && (
                              <Chip label="FALLÓ" size="small" color="error" />
                            )}
                          </Box>
                        }
                        secondary={
                          !diag.success
                            ? `Error: ${diag.error}`
                            : diag.details
                              ? `Detalles: ${JSON.stringify(diag.details, null, 2)}`
                              : 'Prueba exitosa'
                        }
                      />
                    </ListItem>
                  )
                )}
              </List>

              {diagnosticReport && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={copyDiagnosticReport}
                  >
                    📋 Copiar Reporte Completo
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Quick Fixes */}
        {error && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">🛠️ Soluciones Rápidas</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {getQuickFixes(error).map((fix, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${index + 1}. ${fix}`} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Detailed Troubleshooting */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              🔧 Guía de Solución Detallada
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {getTroubleshootingSteps().map((section, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {section.title}
                </Typography>
                <List dense sx={{ ml: 2 }}>
                  {section.steps.map((step, stepIndex) => (
                    <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={`• ${step}`}
                        sx={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
                {index < getTroubleshootingSteps().length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Environment Info */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              ℹ️ Información del Entorno
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                backgroundColor: 'grey.100',
                p: 1,
                borderRadius: 1,
                fontSize: '0.8rem',
              }}
            >
              {`Mock Auth: ${import.meta.env.VITE_ENABLE_MOCK_AUTH || 'false'}
Navigator Online: ${navigator.onLine}
Timestamp: ${new Date().toISOString()}`}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Additional Help */}
        <Box
          sx={{ mt: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}
        >
          <Typography variant="body2" color="info.contrastText">
            💡 <strong>Tip:</strong> Si el problema persiste después de seguir
            estos pasos, copia el reporte de diagnósticos y compártelo con el
            equipo de desarrollo.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
