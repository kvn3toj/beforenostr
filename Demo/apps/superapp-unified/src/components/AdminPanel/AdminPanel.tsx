import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  BugReport as BugReportIcon,
  AdminPanelSettings as AdminIcon,
  Science as ScienceIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import { useAuth } from '../../contexts/AuthContext';

interface AdminPanelProps {
  isVisible?: boolean;
  onClose?: () => void;
}

/**
 * Panel de Administración para el Sistema de Feedback
 *
 * Este panel permite a los administradores:
 * - Activar/desactivar el modo agente de feedback
 * - Ver estadísticas de feedback pendiente
 * - Acceder a herramientas de análisis
 *
 * Solo visible para usuarios con rol 'admin'
 */
export const AdminPanel: React.FC<AdminPanelProps> = ({
  isVisible = true,
  onClose
}) => {
  const { user } = useAuth();
  const {
    isFeedbackModeActive,
    toggleFeedbackMode,
    canUseAgent
  } = useFeedbackContext();

  // No mostrar el panel si el usuario no es administrador
  if (!canUseAgent || !user?.roles?.includes('admin')) {
    return null;
  }

  // No mostrar si está oculto
  if (!isVisible) {
    return null;
  }

  // Obtener feedback pendiente del localStorage
  const getPendingFeedbackCount = () => {
    try {
      const pendingFeedback = JSON.parse(localStorage.getItem('COOMUNITY_PENDING_FEEDBACK') || '[]');
      return pendingFeedback.length;
    } catch {
      return 0;
    }
  };

  const pendingCount = getPendingFeedbackCount();

  return (
    <Card
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        width: 320,
        zIndex: 1000,
        boxShadow: (theme) => theme.shadows[8],
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(18, 18, 18, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <AdminIcon color="primary" />
            <Typography variant="h6" component="h2">
              Panel Admin
            </Typography>
            <Chip
              label="BETA"
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>

          {onClose && (
            <Tooltip title="Cerrar panel">
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Información del usuario */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Usuario administrador:
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {user.email}
          </Typography>
          <Box display="flex" gap={0.5} mt={1}>
            {user.roles?.map((role) => (
              <Chip
                key={role}
                label={role}
                size="small"
                variant="outlined"
                color={role === 'admin' ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Control del Modo Agente */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            🤖 Oráculo de CoomÜnity
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={isFeedbackModeActive}
                onChange={(event) => toggleFeedbackMode(event.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2">
                  Modo Agente de Feedback
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isFeedbackModeActive
                    ? 'Activo - Botón flotante visible'
                    : 'Inactivo - Sin recolección'
                  }
                </Typography>
              </Box>
            }
          />

          {isFeedbackModeActive && (
            <Alert
              severity="info"
              sx={{ mt: 1 }}
              icon={<BugReportIcon fontSize="inherit" />}
            >
              Modo activo: Haz clic en el botón flotante para reportar feedback
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Estadísticas */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            📊 Estadísticas de Feedback
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Feedback pendiente:
            </Typography>
            <Chip
              label={pendingCount}
              size="small"
              color={pendingCount > 0 ? 'warning' : 'success'}
              variant="filled"
            />
          </Box>

          {pendingCount > 0 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Hay {pendingCount} feedback(s) almacenados localmente esperando sincronización con el backend.
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Herramientas de Desarrollo */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            🔧 Herramientas de Desarrollo
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              icon={<ScienceIcon />}
              label="Scripts Análisis"
              size="small"
              clickable
              onClick={() => {
                console.log('🔍 Ejecutando análisis automático...');
                // Aquí podrías abrir una modal con la lista de scripts disponibles
              }}
            />

            <Chip
              label="Logs Feedback"
              size="small"
              clickable
              onClick={() => {
                const logs = localStorage.getItem('COOMUNITY_PENDING_FEEDBACK');
                console.log('📋 Feedback logs:', logs ? JSON.parse(logs) : 'Sin logs');
              }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Herramientas adicionales para análisis y debugging del sistema de feedback.
          </Typography>
        </Box>

        {/* Información de Ayuda */}
        <Alert
          severity="info"
          sx={{ mt: 2 }}
        >
          <Typography variant="caption">
            💡 <strong>Tip:</strong> El feedback se envía automáticamente al backend cuando está disponible,
            o se almacena localmente como fallback.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
