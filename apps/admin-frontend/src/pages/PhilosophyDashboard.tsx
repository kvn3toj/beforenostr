/**
 * =============================================================================
 * PÁGINA: PhilosophyDashboard - GAMIFIER ADMIN
 * =============================================================================
 * Dashboard principal para visualizar y gestionar las métricas filosóficas
 * de CoomÜnity. Esta página demuestra la integración completa de:
 * - Tipos compartidos (@coomunity/shared-types)
 * - Mocks de datos realistas
 * - Componentes visuales (HambreSlider)
 * - Hook personalizado (usePhilosophyMetrics)
 *
 * Esta es la **Consola de Experiencias del Gamifier Admin** que activará
 * el cerebro operativo de CoomÜnity para HumanWäre.
 *
 * Guardianes responsables:
 * - MIRA (La Curadora de Herramientas): Orquestación general
 * - ARIA (La Artista del Frontend): Diseño y experiencia visual
 * - ZENO (El Arquitecto de Experiencias): Flujos y interacciones
 * - NIRA (La Visualizadora 3D): Futura integración de gráficos avanzados
 * =============================================================================
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Divider,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { HambreSlider } from '../components/philosophy/HambreSlider';
import { usePhilosophyMetrics } from '../hooks/usePhilosophyMetrics';

export const PhilosophyDashboard: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useMockData, setUseMockData] = useState(true); // 🔄 Estado para migración

  // Hook principal para métricas
  const {
    metrics,
    hambreHistory,
    isLoading,
    isLoadingHistory,
    isUpdatingHambre,
    isError,
    error,
    updateHambre,
    refreshAllMetrics,
    hasOptimisticUpdates,
    config
  } = usePhilosophyMetrics({
    enableAutoRefresh: autoRefresh,
    refreshInterval: 30000, // 30 segundos
    useMockData // 🔄 Usar estado dinámico
  });

  // Manejar actualización de HambrE
  const handleHambreChange = async (value: number, notes?: string) => {
    try {
      await updateHambre(value, notes);
    } catch (err) {
      console.error('Error actualizando HambrE:', err);
    }
  };

  // Obtener estado de salud del IEA
  const getIEAHealthStatus = () => {
    const { iea } = metrics;
    if (!iea.indiceCalculado) return { status: 'unknown', color: 'default' };

    const value = iea.indiceCalculado;
    const { targetRange } = metrics.config.iea;

    if (value >= targetRange.min && value <= targetRange.max) {
      return { status: 'saludable', color: 'success' };
    } else if (value < targetRange.min * 0.7 || value > targetRange.max * 1.3) {
      return { status: 'crítico', color: 'error' };
    } else {
      return { status: 'atención', color: 'warning' };
    }
  };

  const ieaHealth = getIEAHealthStatus();

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error cargando métricas filosóficas: {error?.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header del Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🌌 Dashboard Filosófico CoomÜnity
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
              Consola de Experiencias del Gamifier Admin - Métricas del Alma Colectiva
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={`Última sincronización: ${new Date(metrics.lastSync).toLocaleTimeString()}`}>
              <IconButton
                onClick={refreshAllMetrics}
                disabled={isLoading}
                sx={{
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Auto-refresh"
            />

            {/* 🔄 Toggle para migración Mock/Backend Real */}
            <FormControlLabel
              control={
                <Switch
                  checked={!useMockData}
                  onChange={(e) => setUseMockData(!e.target.checked)}
                  color="secondary"
                />
              }
              label="Backend Real"
            />

            <Tooltip title="Configuración avanzada">
              <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Estado del sistema */}
        <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={useMockData ? "Modo Desarrollo (Mock)" : "Datos Reales"}
              color={useMockData ? "warning" : "success"}
              variant="filled"
            />
            <Chip
              label={`IEA: ${ieaHealth.status}`}
              color={ieaHealth.color as any}
              variant="outlined"
            />
            {hasOptimisticUpdates && (
              <Chip
                label="Actualizaciones Pendientes"
                color="info"
                variant="filled"
              />
            )}
            <Chip
              label={`Historial: ${hambreHistory?.length || 0} puntos`}
              variant="outlined"
            />
          </Box>
        </Paper>
      </Box>

      {/* Métricas Principales */}
      <Grid container spacing={4}>
        {/* HambrE Evolutiva */}
        <Grid item xs={12} lg={8}>
          <HambreSlider
            metric={metrics.hambre}
            onChange={(value) => {
              // Actualización inmediata para UX responsiva
              console.log('HambrE cambiado a:', value);
            }}
            onSave={handleHambreChange}
            isLoading={isUpdatingHambre}
            showHistory={true}
          />
        </Grid>

        {/* IEA de Reciprocidad */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ color: 'primary.main', fontSize: 28, mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Índice de Equilibrio de Reciprocidad
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h2" sx={{
                  fontWeight: 'bold',
                  color: ieaHealth.color === 'success' ? 'success.main' :
                         ieaHealth.color === 'error' ? 'error.main' : 'warning.main'
                }}>
                  {metrics.iea.indiceCalculado?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Objetivo: {metrics.config.iea.targetRange.min} - {metrics.config.iea.targetRange.max}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Dar:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {metrics.iea.dar}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Recibir:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {metrics.iea.recibir}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Ponderación:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {(metrics.iea.ponderacion * 100).toFixed(0)}%
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Período: {metrics.iea.metadata?.period || 'No especificado'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuración Avanzada (Expandible) */}
      {showAdvanced && (
        <Box sx={{ mt: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1 }} />
                Configuración Avanzada
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Configuración HambrE
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Modo de visualización: {metrics.config.hambre.displayMode}
                    </Typography>
                    <Typography variant="body2">
                      Umbrales: Bajo ≤{metrics.config.hambre.thresholds.low},
                      Alto ≥{metrics.config.hambre.thresholds.high}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Configuración General
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Intervalo de actualización: {metrics.config.general.refreshInterval} min
                    </Typography>
                    <Typography variant="body2">
                      Retención de historial: {metrics.config.general.historyRetentionDays} días
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Footer con información del desarrollador */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <InfoIcon />
            <Typography variant="body2">
              <strong>Dashboard Filosófico CoomÜnity</strong> - Implementación de 4 entregables clave:
              Tipos compartidos, Mocks realistas, Componentes visuales, y Hooks personalizados.
              Listo para integración con Backend NestJS.
            </Typography>
          </Box>
        </Alert>
      </Box>
    </Box>
  );
};
