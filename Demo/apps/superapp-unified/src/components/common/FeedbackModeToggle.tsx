import React from 'react';
import {
  Box,
  Switch,
  FormControlLabel,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Feedback,
  BugReport,
  Lightbulb,
  Add,
  Help,
} from '@mui/icons-material';
import { useFeedback } from '../../contexts/FeedbackContext';

interface FeedbackModeToggleProps {
  isActive: boolean;
  onToggle: () => void;
  showLabel?: boolean;
  compact?: boolean;
}

/**
 * Toggle de Modo Feedback para el Oráculo de CoomÜnity
 *
 * Este componente permite a los administradores activar/desactivar
 * el modo de recopilación de feedback, siguiendo los principios
 * de Ayni y contribuyendo al Bien Común.
 */
const FeedbackModeToggle: React.FC<FeedbackModeToggleProps> = ({
  isActive,
  onToggle,
  showLabel = true,
  compact = false,
}) => {
  const { isFeedbackModeActive } = useFeedback();

  // Iconos para los tipos de feedback
  const feedbackIcons = [
    <BugReport key="bug" fontSize="small" />,
    <Lightbulb key="improvement" fontSize="small" />,
    <Add key="feature" fontSize="small" />,
    <Help key="other" fontSize="small" />,
  ];

  if (compact) {
    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {isActive ? 'Desactivar' : 'Activar'} Oráculo de Feedback
            </Typography>
            <Typography variant="caption">
              {isActive
                ? 'El sistema de feedback está activo'
                : 'Activar para recopilar feedback de usuarios'
              }
            </Typography>
          </Box>
        }
        arrow
      >
        <IconButton
          onClick={onToggle}
          sx={{
            color: isActive ? 'var(--coomunity-primary)' : 'text.secondary',
            '&:hover': {
              color: isActive ? 'var(--coomunity-primary-dark)' : 'var(--coomunity-primary)',
            },
          }}
        >
          <Feedback />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: 2,
        background: isActive
          ? 'linear-gradient(135deg, rgba(var(--coomunity-primary-rgb), 0.1) 0%, rgba(var(--coomunity-secondary-rgb), 0.1) 100%)'
          : 'var(--coomunity-bg-secondary)',
        border: `1px solid ${isActive ? 'var(--coomunity-primary)' : 'var(--coomunity-border)'}`,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Icono principal */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: isActive
            ? 'linear-gradient(135deg, var(--coomunity-primary) 0%, var(--coomunity-secondary) 100%)'
            : 'var(--coomunity-bg-primary)',
          color: isActive ? 'white' : 'text.secondary',
          transition: 'all 0.3s ease',
        }}
      >
        <Feedback />
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1 }}>
        {showLabel && (
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🎯 Oráculo de CoomÜnity
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {isActive
            ? 'Sistema de feedback activo - Recopilando contribuciones al Bien Común'
            : 'Activar para recopilar feedback estructurado de usuarios'
          }
        </Typography>

        {/* Estado actual */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <Chip
            label={isActive ? 'ACTIVO' : 'INACTIVO'}
            size="small"
            color={isActive ? 'success' : 'default'}
            variant={isActive ? 'filled' : 'outlined'}
            sx={{ fontWeight: 'bold' }}
          />

          {isActive && (
            <Chip
              label="Recopilando"
              size="small"
              color="primary"
              variant="outlined"
              icon={<Feedback fontSize="small" />}
            />
          )}
        </Box>

        {/* Iconos de tipos de feedback cuando está activo */}
        {isActive && (
          <Box display="flex" gap={0.5} mt={1}>
            {feedbackIcons.map((icon, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(var(--coomunity-primary-rgb), 0.1)',
                  color: 'var(--coomunity-primary)',
                  animation: 'pulse 2s infinite',
                  animationDelay: `${index * 0.2}s`,
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                    '50%': {
                      opacity: 0.7,
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                {icon}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Toggle Switch */}
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={onToggle}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'var(--coomunity-primary)',
                  '&:hover': {
                    backgroundColor: 'rgba(var(--coomunity-primary-rgb), 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--coomunity-primary)',
                },
              }}
            />
          }
          label=""
        />
      </Box>
    </Box>
  );
};

export default FeedbackModeToggle;
