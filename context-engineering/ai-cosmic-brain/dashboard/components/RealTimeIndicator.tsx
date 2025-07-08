import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Tooltip,
  IconButton,
  Typography,
  Card,
  CardContent,
  Collapse,
  Divider,
  Badge,
} from '@mui/material';
import {
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  Sync as ReconnectingIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Timeline as StatsIcon,
} from '@mui/icons-material';
import {
  useCosmicWebSocket,
  useCosmicConnectionState,
  useCosmicRecentEvents,
} from '../providers/CosmicWebSocketProvider';
import {
  formatRelativeTime,
  formatTimeMetric,
} from '../utils/dashboardHelpers';

/**
 * 🌐 RealTimeIndicator - Indicador de Estado WebSocket en Tiempo Real
 *
 * Componente que muestra el estado de la conexión WebSocket del AI Cosmic Brain
 * con información detallada, estadísticas y controles de conexión.
 *
 * Características:
 * - Indicador visual del estado de conexión
 * - Estadísticas de conexión en tiempo real
 * - Eventos recientes
 * - Controles de reconexión manual
 * - Animaciones suaves para cambios de estado
 *
 * Filosofía aplicada:
 * - Transparencia: Información clara sobre el estado del sistema
 * - Bien Común: Herramienta que beneficia la monitorización del equipo
 * - Neguentropía: Orden visual en la presentación de información
 */

interface RealTimeIndicatorProps {
  /** Mostrar detalles expandidos por defecto */
  expandedByDefault?: boolean;
  /** Mostrar contador de eventos */
  showEventCounter?: boolean;
  /** Posición del indicador */
  position?: 'inline' | 'floating';
  /** Tamaño del indicador */
  size?: 'small' | 'medium' | 'large';
}

export const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  expandedByDefault = false,
  showEventCounter = true,
  position = 'inline',
  size = 'medium',
}) => {
  // ============================================================================
  // 🔄 Hooks and State
  // ============================================================================

  const { reconnect, requestSystemHealthUpdate, service } =
    useCosmicWebSocket();

  const {
    connectionState,
    isConnected,
    connectionStats,
    isConnecting,
    isReconnecting,
    hasError,
  } = useCosmicConnectionState();

  const { recentEvents, eventCount } = useCosmicRecentEvents();

  const [expanded, setExpanded] = useState(expandedByDefault);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // ============================================================================
  // 🎨 Visual Configuration
  // ============================================================================

  const getStateConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          icon: <ConnectedIcon />,
          color: '#4caf50',
          label: 'Conectado',
          description: 'Conexión estable con el AI Cosmic Brain',
          bgColor: '#e8f5e8',
        };
      case 'connecting':
        return {
          icon: <ReconnectingIcon className="animate-spin" />,
          color: '#2196f3',
          label: 'Conectando',
          description: 'Estableciendo conexión...',
          bgColor: '#e3f2fd',
        };
      case 'reconnecting':
        return {
          icon: <ReconnectingIcon className="animate-spin" />,
          color: '#ff9800',
          label: 'Reconectando',
          description: `Intento ${connectionStats.reconnectAttempts}`,
          bgColor: '#fff3e0',
        };
      case 'error':
        return {
          icon: <ErrorIcon />,
          color: '#f44336',
          label: 'Error',
          description: 'Error de conexión',
          bgColor: '#ffebee',
        };
      default:
        return {
          icon: <DisconnectedIcon />,
          color: '#9e9e9e',
          label: 'Desconectado',
          description: 'Sin conexión al AI Cosmic Brain',
          bgColor: '#f5f5f5',
        };
    }
  };

  const stateConfig = getStateConfig();

  // ============================================================================
  // 🎭 Animation Effects
  // ============================================================================

  useEffect(() => {
    if (isConnected) {
      setPulseAnimation(true);
      const timer = setTimeout(() => setPulseAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // ============================================================================
  // 🎯 Event Handlers
  // ============================================================================

  const handleReconnect = () => {
    reconnect();
  };

  const handleRefreshHealth = () => {
    if (isConnected) {
      requestSystemHealthUpdate();
    }
  };

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  // ============================================================================
  // 🎨 Render Helpers
  // ============================================================================

  const renderMainIndicator = () => (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        p: size === 'small' ? 0.5 : size === 'large' ? 1.5 : 1,
        borderRadius: 2,
        bgcolor: stateConfig.bgColor,
        border: `2px solid ${stateConfig.color}`,
        transition: 'all 0.3s ease',
        transform: pulseAnimation ? 'scale(1.05)' : 'scale(1)',
        cursor: 'pointer',
      }}
      onClick={handleToggleExpanded}
    >
      {/* Status Icon */}
      <Box
        sx={{
          color: stateConfig.color,
          display: 'flex',
          alignItems: 'center',
          fontSize:
            size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem',
        }}
      >
        {stateConfig.icon}
      </Box>

      {/* Status Text */}
      <Typography
        variant={
          size === 'small' ? 'caption' : size === 'large' ? 'body1' : 'body2'
        }
        fontWeight="bold"
        color={stateConfig.color}
      >
        {stateConfig.label}
      </Typography>

      {/* Event Counter */}
      {showEventCounter && eventCount > 0 && (
        <Badge
          badgeContent={eventCount}
          color="primary"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.6rem',
              height: '16px',
              minWidth: '16px',
            },
          }}
        >
          <StatsIcon fontSize="small" />
        </Badge>
      )}

      {/* Expand Icon */}
      <IconButton
        size="small"
        sx={{
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          ml: 'auto',
        }}
      >
        <ExpandMoreIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  const renderDetailedStats = () => (
    <Card elevation={1} sx={{ mt: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" gutterBottom>
          Estadísticas de Conexión
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          {/* Connection Time */}
          {connectionStats.connectedAt && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                Conectado desde:
              </Typography>
              <Typography variant="body2">
                {formatRelativeTime(connectionStats.connectedAt)}
              </Typography>
            </Box>
          )}

          {/* Last Disconnect */}
          {connectionStats.disconnectedAt && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                Última desconexión:
              </Typography>
              <Typography variant="body2">
                {formatRelativeTime(connectionStats.disconnectedAt)}
              </Typography>
            </Box>
          )}

          {/* Reconnect Attempts */}
          {connectionStats.reconnectAttempts > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                Intentos de reconexión:
              </Typography>
              <Typography variant="body2" color="warning.main">
                {connectionStats.reconnectAttempts}
              </Typography>
            </Box>
          )}

          {/* Total Events */}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Eventos recibidos:
            </Typography>
            <Typography variant="body2" color="primary.main">
              {connectionStats.totalEventsReceived}
            </Typography>
          </Box>

          {/* Last Event */}
          {connectionStats.lastEventAt && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                Último evento:
              </Typography>
              <Typography variant="body2">
                {formatRelativeTime(connectionStats.lastEventAt)}
              </Typography>
            </Box>
          )}

          {/* Average Latency */}
          {connectionStats.averageLatency > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                Latencia promedio:
              </Typography>
              <Typography variant="body2">
                {formatTimeMetric(connectionStats.averageLatency)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Box display="flex" gap={1} justifyContent="flex-end">
          {!isConnected && (
            <Chip
              icon={<RefreshIcon />}
              label="Reconectar"
              color="primary"
              variant="outlined"
              size="small"
              onClick={handleReconnect}
              disabled={isConnecting || isReconnecting}
            />
          )}

          {isConnected && (
            <Chip
              icon={<StatsIcon />}
              label="Actualizar Estado"
              color="primary"
              variant="outlined"
              size="small"
              onClick={handleRefreshHealth}
            />
          )}
        </Box>

        {/* Recent Events Preview */}
        {recentEvents.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Eventos Recientes ({recentEvents.length})
            </Typography>
            <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
              {recentEvents.slice(0, 5).map((event, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  mb={0.5}
                >
                  <Typography variant="caption" color="textSecondary">
                    {event.type.replace('_', ' ')}
                  </Typography>
                  <Typography variant="caption">
                    {formatRelativeTime(new Date(event.timestamp))}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  const content = (
    <Box>
      {renderMainIndicator()}
      <Collapse in={expanded}>{renderDetailedStats()}</Collapse>
    </Box>
  );

  if (position === 'floating') {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1300,
          minWidth: 280,
          maxWidth: 320,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default RealTimeIndicator;
