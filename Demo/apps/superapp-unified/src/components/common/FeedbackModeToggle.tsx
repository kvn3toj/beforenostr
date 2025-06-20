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
const FeedbackModeToggle: React.FC = () => {
  const { isFeedbackModeActive, toggleFeedbackMode } = useFeedback();

  // Iconos para los tipos de feedback
  const feedbackIcons = [
    <BugReport key="bug" fontSize="small" />,
    <Lightbulb key="improvement" fontSize="small" />,
    <Add key="feature" fontSize="small" />,
    <Help key="other" fontSize="small" />,
  ];

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Feedback color={isFeedbackModeActive ? 'primary' : 'action'} />
      <FormControlLabel
        control={
          <Switch
            checked={isFeedbackModeActive}
            onChange={toggleFeedbackMode}
          />
        }
        label={
          <Typography variant="body2">
            {isFeedbackModeActive ? 'Oráculo Activo' : 'Activar Oráculo'}
          </Typography>
        }
      />
    </Box>
  );
};

export default FeedbackModeToggle;
