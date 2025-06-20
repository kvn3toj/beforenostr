import React, { useState } from 'react';
import {
  Fab,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  BugReport,
  Lightbulb,
  Add,
  Help,
  Feedback,
} from '@mui/icons-material';
import { useFeedback } from '../../contexts/FeedbackContext';

// Acciones del SpeedDial
const FEEDBACK_ACTIONS = [
  {
    icon: <BugReport />,
    name: '🐛 Bug/Error',
    value: 'bug',
    description: 'Algo no funciona correctamente',
    color: '#f44336',
  },
  {
    icon: <Lightbulb />,
    name: '💡 Mejora',
    value: 'improvement',
    description: 'Sugerencia para mejorar algo existente',
    color: '#2196f3',
  },
  {
    icon: <Add />,
    name: '➕ Funcionalidad Faltante',
    value: 'missing-feature',
    description: 'Algo que falta y sería útil',
    color: '#9c27b0',
  },
  {
    icon: <Help />,
    name: '❓ Otro',
    value: 'other',
    description: 'Cualquier otro tipo de feedback',
    color: '#ff9800',
  },
];

interface FeedbackButtonProps {
  isVisible: boolean;
  onFeedbackStart: (type?: string) => void;
}

/**
 * Botón Flotante de Feedback para el Oráculo de CoomÜnity
 *
 * Este componente proporciona un acceso rápido y contextual al sistema
 * de feedback, permitiendo a los usuarios reportar problemas o sugerencias
 * de manera intuitiva y eficiente.
 */
const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  isVisible,
  onFeedbackStart,
}) => {
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  // No renderizar si no está visible
  if (!isVisible) {
    return null;
  }

  // Manejar apertura del SpeedDial
  const handleSpeedDialOpen = () => {
    setIsSpeedDialOpen(true);
  };

  // Manejar cierre del SpeedDial
  const handleSpeedDialClose = () => {
    setIsSpeedDialOpen(false);
  };

  // Manejar selección de acción
  const handleActionClick = (action: typeof FEEDBACK_ACTIONS[0]) => {
    handleSpeedDialClose();
    onFeedbackStart(action.value);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      {/* SpeedDial para tipos de feedback */}
      <SpeedDial
        ariaLabel="Feedback rápido"
        sx={{
          '& .MuiFab-primary': {
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, var(--coomunity-primary) 0%, var(--coomunity-secondary) 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--coomunity-primary-dark) 0%, var(--coomunity-secondary-dark) 100%)',
            },
          },
        }}
        icon={<SpeedDialIcon icon={<Feedback />} />}
        onClose={handleSpeedDialClose}
        onOpen={handleSpeedDialOpen}
        open={isSpeedDialOpen}
        direction="up"
      >
        {FEEDBACK_ACTIONS.map((action) => (
          <SpeedDialAction
            key={action.value}
            icon={action.icon}
            tooltipTitle={
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {action.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {action.description}
                </Typography>
              </Box>
            }
            onClick={() => handleActionClick(action)}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                bgcolor: action.color,
                '&:hover': {
                  bgcolor: action.color,
                  opacity: 0.8,
                },
              },
            }}
          />
        ))}
      </SpeedDial>

      {/* Indicador visual cuando está activo */}
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.2)',
              opacity: 0.7,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );
};

export default FeedbackButton;
