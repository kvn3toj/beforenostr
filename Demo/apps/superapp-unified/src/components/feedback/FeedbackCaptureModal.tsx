import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Send as SendIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';
import { FeedbackType } from './FeedbackFloatingButton';

interface FeedbackCaptureModalProps {
  isOpen: boolean;
  feedbackType: FeedbackType | null;
  selectedElement: {
    tagName: string;
    id?: string;
    className?: string;
    text?: string;
    position: { x: number; y: number };
  } | null;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => Promise<void>;
}

export interface FeedbackData {
  type: FeedbackType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  elementContext: {
    tagName: string;
    id?: string;
    className?: string;
    text?: string;
    position: { x: number; y: number };
    url: string;
    userAgent: string;
    viewport: { width: number; height: number };
    timestamp: string;
  };
  technicalContext: {
    route: string;
    userId: string;
    userRoles: string[];
    sessionId: string;
    buildVersion: string;
  };
  requestCodeAnalysis: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: 700,
    width: '90vw',
    maxHeight: '90vh',
  }
}));

const priorityOptions = [
  { value: 'low', label: 'Baja', color: 'success' },
  { value: 'medium', label: 'Media', color: 'warning' },
  { value: 'high', label: 'Alta', color: 'error' },
  { value: 'critical', label: 'Crítica', color: 'error' }
] as const;

const getFeedbackTypeInfo = (type: FeedbackType) => {
  const typeMap = {
    'bug': { label: 'Bug Report', color: 'error', category: 'Corrección' },
    'improvement': { label: 'Mejora', color: 'warning', category: 'Optimización' },
    'missing-feature': { label: 'Función Faltante', color: 'info', category: 'Desarrollo' },
    'performance': { label: 'Performance', color: 'secondary', category: 'Optimización' },
    'ux-issue': { label: 'UX Issue', color: 'primary', category: 'Experiencia' },
    'code-analysis': { label: 'Análisis de Código', color: 'success', category: 'Calidad' }
  };
  return typeMap[type] || typeMap['bug'];
};

export const FeedbackCaptureModal: React.FC<FeedbackCaptureModalProps> = ({
  isOpen,
  feedbackType,
  selectedElement,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [requestCodeAnalysis, setRequestCodeAnalysis] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setRequestCodeAnalysis(feedbackType === 'code-analysis');
    }
  }, [isOpen, feedbackType]);

  const handleSubmit = async () => {
    if (!feedbackType || !selectedElement || !title.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        type: feedbackType,
        title: title.trim(),
        description: description.trim(),
        priority,
        category: getFeedbackTypeInfo(feedbackType).category,
        elementContext: {
          ...selectedElement,
          url: window.location.href,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          timestamp: new Date().toISOString()
        },
        technicalContext: {
          route: window.location.pathname,
          userId: 'current-user-id', // TODO: Obtener del AuthContext
          userRoles: ['admin'], // TODO: Obtener del AuthContext
          sessionId: 'session-id', // TODO: Generar o obtener session ID
          buildVersion: import.meta.env.VITE_APP_VERSION || 'development'
        },
        requestCodeAnalysis
      };

      await onSubmit(feedbackData);
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!feedbackType || !selectedElement) {
    return null;
  }

  const typeInfo = getFeedbackTypeInfo(feedbackType);

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={typeInfo.label}
              color={typeInfo.color as any}
              size="small"
              variant="outlined"
            />
            <Typography variant="h6">
              Nuevo Feedback
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título del Feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe brevemente el problema o sugerencia..."
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción Detallada"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica en detalle qué observaste, qué esperabas que pasara y cualquier información adicional relevante..."
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              Prioridad
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {priorityOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  color={option.color as any}
                  variant={priority === option.value ? 'filled' : 'outlined'}
                  onClick={() => setPriority(option.value)}
                  clickable
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                icon={<AIIcon />}
                label="Análisis Automático"
                color={requestCodeAnalysis ? 'success' : 'default'}
                variant={requestCodeAnalysis ? 'filled' : 'outlined'}
                onClick={() => setRequestCodeAnalysis(!requestCodeAnalysis)}
                clickable
              />
              <Tooltip title="Ejecutar scripts de análisis de código en el área reportada">
                <IconButton size="small">
                  <CodeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" variant="outlined">
              <Typography variant="body2">
                📍 <strong>Elemento seleccionado:</strong> {selectedElement.tagName}
                {selectedElement.id && ` #${selectedElement.id}`}
                {selectedElement.className && ` .${selectedElement.className.split(' ')[0]}`}
              </Typography>
              {selectedElement.text && (
                <Typography variant="caption" display="block" mt={0.5}>
                  📝 Texto: "{selectedElement.text.substring(0, 100)}..."
                </Typography>
              )}
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Accordion expanded={showTechnicalDetails} onChange={() => setShowTechnicalDetails(!showTechnicalDetails)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">
                  🔧 Detalles Técnicos
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="URL Actual"
                      secondary={window.location.href}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Viewport"
                      secondary={`${window.innerWidth} x ${window.innerHeight}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Posición del Click"
                      secondary={`X: ${selectedElement.position.x}, Y: ${selectedElement.position.y}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="User Agent"
                      secondary={navigator.userAgent}
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim() || !description.trim() || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <SendIcon />}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default FeedbackCaptureModal;
