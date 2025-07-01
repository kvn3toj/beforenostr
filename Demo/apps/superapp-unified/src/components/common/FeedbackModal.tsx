import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { BugReport, Lightbulb, Add, Help } from '@mui/icons-material';
import { useFeedback, FeedbackData } from '../../contexts/FeedbackContext';

// Tipos de feedback disponibles
const FEEDBACK_TYPES = [
  {
    value: 'bug',
    label: '🐛 Bug/Error',
    description: 'Algo no funciona correctamente',
    icon: <BugReport fontSize="small" />,
    color: 'error' as const,
  },
  {
    value: 'improvement',
    label: '💡 Mejora',
    description: 'Sugerencia para mejorar algo existente',
    icon: <Lightbulb fontSize="small" />,
    color: 'primary' as const,
  },
  {
    value: 'missing-feature',
    label: '➕ Funcionalidad Faltante',
    description: 'Algo que falta y sería útil',
    icon: <Add fontSize="small" />,
    color: 'secondary' as const,
  },
  {
    value: 'other',
    label: '❓ Otro',
    description: 'Cualquier otro tipo de feedback',
    icon: <Help fontSize="small" />,
    color: 'default' as const,
  },
];

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackData: FeedbackData) => Promise<void>;
}

/**
 * Modal de Recopilación de Feedback para el Oráculo de CoomÜnity
 *
 * Este componente proporciona una interfaz intuitiva para que los usuarios
 * puedan reportar feedback de manera estructurada, siguiendo los principios
 * de Reciprocidad (reciprocidad) y contribuyendo al Bien Común.
 */
const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { currentFeedback, updateFeedback } = useFeedback();

  // Estado local del formulario
  const [formData, setFormData] = useState<Partial<FeedbackData>>({
    feedbackType: 'other',
    feedbackText: '',
    componentContext: '',
  });

  // Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar con el contexto cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        feedbackType: currentFeedback.feedbackType || 'other',
        feedbackText: currentFeedback.feedbackText || '',
        componentContext: currentFeedback.componentContext || '',
      });
      setError(null);
    }
  }, [isOpen, currentFeedback]);

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof FeedbackData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Actualizar también el contexto
    updateFeedback(field, value);
  };

  // Validar formulario
  const isFormValid = () => {
    return formData.feedbackText && formData.feedbackText.trim().length > 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError('Por favor, describe tu feedback para poder ayudarte mejor.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const feedbackData: FeedbackData = {
        feedbackType: formData.feedbackType as any,
        pageUrl: window.location.href,
        componentContext: formData.componentContext,
        feedbackText: formData.feedbackText || '',
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };

      await onSubmit(feedbackData);

      // Limpiar formulario después del envío exitoso
      setFormData({
        feedbackType: 'other',
        feedbackText: '',
        componentContext: '',
      });

    } catch (error) {
      setError('Error al enviar el feedback. Por favor, inténtalo de nuevo.');
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cierre del modal
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'var(--coomunity-card-bg)',
          border: '1px solid var(--coomunity-border)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, var(--coomunity-primary) 0%, var(--coomunity-secondary) 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <Help fontSize="large" />
          <Typography variant="h5" component="h2" fontWeight="bold">
            🎯 Oráculo de CoomÜnity
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Tu feedback contribuye al Bien Común y mejora la experiencia de todos
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Mensaje de error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tipo de Feedback */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tipo de Feedback</InputLabel>
          <Select
            value={formData.feedbackType}
            onChange={(e) => handleInputChange('feedbackType', e.target.value)}
            label="Tipo de Feedback"
          >
            {FEEDBACK_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  {type.icon}
                  <Box>
                    <Typography variant="body1">{type.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {type.description}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Contexto del Componente (opcional) */}
        <TextField
          fullWidth
          label="Contexto (opcional)"
          placeholder="¿En qué parte de la aplicación estás? ¿Qué estabas haciendo?"
          value={formData.componentContext}
          onChange={(e) => handleInputChange('componentContext', e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 3 }}
          helperText="Ayúdanos a entender mejor el contexto de tu feedback"
        />

        {/* Descripción del Feedback */}
        <TextField
          fullWidth
          label="Tu Feedback *"
          placeholder="Describe detalladamente tu experiencia, problema o sugerencia..."
          value={formData.feedbackText}
          onChange={(e) => handleInputChange('feedbackText', e.target.value)}
          multiline
          rows={6}
          required
          error={!isFormValid() && formData.feedbackText !== undefined}
          helperText={
            !isFormValid() && formData.feedbackText !== undefined
              ? 'Por favor, describe tu feedback'
              : `${formData.feedbackText?.length || 0} caracteres`
          }
          sx={{ mb: 3 }}
        />

        {/* Información contextual automática */}
        <Box sx={{ p: 2, bgcolor: 'var(--coomunity-bg-secondary)', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            📍 Información Contextual (se incluye automáticamente):
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip
              label={`Página: ${window.location.pathname}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Fecha: ${new Date().toLocaleDateString()}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Resolución: ${window.screen.width}x${window.screen.height}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Acciones */}
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid() || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          sx={{
            minWidth: 120,
            background: 'linear-gradient(135deg, var(--coomunity-primary) 0%, var(--coomunity-secondary) 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--coomunity-primary-dark) 0%, var(--coomunity-secondary-dark) 100%)',
            },
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
