import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  PlayArrow as TestIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import { useCosmicBrainData } from '../../hooks/useCosmicBrainData';
import { CosmicBrainService } from '../../services/cosmic-brain.service';
import { CosmicCard } from '../../design-system';

/**
 * 🧪 COSMIC BRAIN QUICK TEST COMPONENT
 *
 * Componente de prueba rápida para verificar la integración
 * del AI Cosmic Brain Dashboard con el backend NestJS.
 */

export const CosmicBrainQuickTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    backend: 'pending' | 'success' | 'error';
    auth: 'pending' | 'success' | 'error';
    dashboard: 'pending' | 'success' | 'error';
    guardians: 'pending' | 'success' | 'error';
  }>({
    backend: 'pending',
    auth: 'pending',
    dashboard: 'pending',
    guardians: 'pending',
  });

  const [isRunning, setIsRunning] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);

  const { dashboardData, guardians, isLoading, isError, error, refreshData } =
    useCosmicBrainData(5000, false); // Desactivar auto-refresh para pruebas

  const addLog = (message: string) => {
    setTestLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const runIntegrationTest = async () => {
    setIsRunning(true);
    setTestResults({
      backend: 'pending',
      auth: 'pending',
      dashboard: 'pending',
      guardians: 'pending',
    });
    setTestLog([]);

    try {
      // Test 1: Backend Health Check
      addLog('🔍 Probando conectividad con backend...');
      try {
        const healthResponse = await fetch('http://localhost:3002/health');
        if (healthResponse.ok) {
          setTestResults((prev) => ({ ...prev, backend: 'success' }));
          addLog('✅ Backend health check: OK');
        } else {
          throw new Error('Backend no responde correctamente');
        }
      } catch (error) {
        setTestResults((prev) => ({ ...prev, backend: 'error' }));
        addLog('❌ Backend health check: ERROR');
        throw error;
      }

      // Test 2: Authentication
      addLog('🔐 Probando autenticación admin...');
      try {
        const authResponse = await fetch('http://localhost:3002/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@gamifier.com',
            password: 'admin123',
          }),
        });

        if (authResponse.ok) {
          const authData = await authResponse.json();
          if (authData.access_token) {
            setTestResults((prev) => ({ ...prev, auth: 'success' }));
            addLog('✅ Autenticación admin: OK');

            // Test 3: Dashboard Data
            addLog('📊 Probando endpoint dashboard...');
            try {
              const dashboardResponse = await fetch(
                'http://localhost:3002/admin/cosmic-brain/dashboard',
                {
                  headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                  },
                }
              );

              if (dashboardResponse.ok) {
                const dashboardData = await dashboardResponse.json();
                setTestResults((prev) => ({ ...prev, dashboard: 'success' }));
                addLog('✅ Dashboard data: OK');
                addLog(
                  `📈 Datos recibidos: ${Object.keys(dashboardData).length} propiedades`
                );

                // Test 4: Guardians Data
                addLog('🛡️ Probando endpoint guardians...');
                try {
                  const guardiansResponse = await fetch(
                    'http://localhost:3002/admin/cosmic-brain/guardians',
                    {
                      headers: {
                        Authorization: `Bearer ${authData.access_token}`,
                      },
                    }
                  );

                  if (guardiansResponse.ok) {
                    const guardiansData = await guardiansResponse.json();
                    setTestResults((prev) => ({
                      ...prev,
                      guardians: 'success',
                    }));
                    addLog('✅ Guardians data: OK');
                    addLog(
                      `🛡️ Guardianes encontrados: ${guardiansData.length || 0}`
                    );
                  } else {
                    throw new Error('Error al obtener datos de guardianes');
                  }
                } catch (error) {
                  setTestResults((prev) => ({ ...prev, guardians: 'error' }));
                  addLog('❌ Guardians data: ERROR');
                }
              } else {
                throw new Error('Error al obtener datos del dashboard');
              }
            } catch (error) {
              setTestResults((prev) => ({ ...prev, dashboard: 'error' }));
              addLog('❌ Dashboard data: ERROR');
            }
          } else {
            throw new Error('Token no recibido');
          }
        } else {
          throw new Error('Credenciales inválidas');
        }
      } catch (error) {
        setTestResults((prev) => ({ ...prev, auth: 'error' }));
        addLog('❌ Autenticación admin: ERROR');
      }

      addLog('🎯 Prueba de integración completada');
    } catch (error) {
      addLog(
        `💥 Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <SuccessIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <CosmicCard element="aire" variant="elevated" enableGlow>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <TestIcon sx={{ mr: 2 }} />
            🧪 Cosmic Brain Integration Test
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prueba rápida de integración entre frontend y backend del AI Cosmic
            Brain
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={runIntegrationTest}
          disabled={isRunning}
          startIcon={isRunning ? <CircularProgress size={20} /> : <TestIcon />}
          sx={{ mb: 3 }}
        >
          {isRunning
            ? 'Ejecutando Pruebas...'
            : 'Ejecutar Prueba de Integración'}
        </Button>

        {/* Test Results */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1">🔧 Backend Health</Typography>
            <Chip
              icon={getStatusIcon(testResults.backend)}
              label={testResults.backend.toUpperCase()}
              color={getStatusColor(testResults.backend) as any}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1">🔐 Admin Authentication</Typography>
            <Chip
              icon={getStatusIcon(testResults.auth)}
              label={testResults.auth.toUpperCase()}
              color={getStatusColor(testResults.auth) as any}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1">📊 Dashboard Data</Typography>
            <Chip
              icon={getStatusIcon(testResults.dashboard)}
              label={testResults.dashboard.toUpperCase()}
              color={getStatusColor(testResults.dashboard) as any}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1">🛡️ Guardians Data</Typography>
            <Chip
              icon={getStatusIcon(testResults.guardians)}
              label={testResults.guardians.toUpperCase()}
              color={getStatusColor(testResults.guardians) as any}
              size="small"
            />
          </Box>
        </Stack>

        {/* Hook Status */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          🎣 Hook Status
        </Typography>
        <Stack spacing={1}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2">Loading State:</Typography>
            <Chip
              label={isLoading ? 'LOADING' : 'READY'}
              color={isLoading ? 'warning' : 'success'}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2">Error State:</Typography>
            <Chip
              label={isError ? 'ERROR' : 'OK'}
              color={isError ? 'error' : 'success'}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2">Dashboard Data:</Typography>
            <Chip
              label={dashboardData ? 'LOADED' : 'NULL'}
              color={dashboardData ? 'success' : 'default'}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2">Guardians Count:</Typography>
            <Chip label={guardians?.length || 0} color="info" size="small" />
          </Box>

          {isError && error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Typography variant="body2">Error: {error.message}</Typography>
            </Alert>
          )}
        </Stack>

        {/* Test Log */}
        {testLog.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              📝 Test Log
            </Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflow: 'auto',
                backgroundColor: 'rgba(0,0,0,0.05)',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              {testLog.map((log, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                  {log}
                </Typography>
              ))}
            </Box>
          </>
        )}

        {/* Actions */}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={refreshData}
            disabled={isLoading}
            size="small"
          >
            🔄 Refresh Hook Data
          </Button>
        </Stack>
      </CardContent>
    </CosmicCard>
  );
};

export default CosmicBrainQuickTest;
