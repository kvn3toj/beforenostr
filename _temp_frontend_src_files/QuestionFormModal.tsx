import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Stack,
  Divider,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionMark as QuestionIcon,
  PlaylistAdd as PlaylistAddIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { CreateQuestionDto } from '../../../questions/dto/create-question.dto';

interface QuestionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (questions: CreateQuestionDto[]) => void;
  videoDuration?: number; // Duración del video en segundos
}

interface FormQuestion {
  id: string;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  text: string;
  languageCode: string;
  isActive: boolean;
  answerOptions: Array<{
    text: string;
    isCorrect: boolean;
    order: number;
  }>;
}

interface FormConfig {
  timing: 'inicio' | 'final' | 'personalizado';
  questionDuration: number; // Duración de cada pregunta en segundos
  spacing: number; // Espaciado entre preguntas en segundos
}

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  videoDuration = 600, // 10 minutos por defecto
}) => {
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<FormConfig>({
    timing: 'personalizado',
    questionDuration: 20,
    spacing: 10,
  });

  // Crear una nueva pregunta vacía
  const createEmptyQuestion = (index: number = 0): FormQuestion => {
    let timestamp = 0;
    let endTimestamp = 20;

    // Calcular timestamps automáticamente según la configuración
    if (config.timing === 'inicio') {
      timestamp = index * (config.questionDuration + config.spacing);
      endTimestamp = timestamp + config.questionDuration;
    } else if (config.timing === 'final') {
      const totalQuestionsTime = questions.length * (config.questionDuration + config.spacing);
      const startFromTime = Math.max(0, videoDuration - totalQuestionsTime - (config.questionDuration + config.spacing));
      timestamp = startFromTime + (index * (config.questionDuration + config.spacing));
      endTimestamp = timestamp + config.questionDuration;
    }

    return {
      id: `question_${Date.now()}_${Math.random()}`,
      timestamp,
      endTimestamp,
      type: 'multiple-choice',
      text: '',
      languageCode: 'es-ES',
      isActive: true,
      answerOptions: [
        { text: '', isCorrect: true, order: 0 },
        { text: '', isCorrect: false, order: 1 },
        { text: '', isCorrect: false, order: 2 },
        { text: '', isCorrect: false, order: 3 },
      ],
    };
  };

  // Recalcular timestamps cuando cambia la configuración
  const recalculateTimestamps = (newConfig: FormConfig) => {
    if (newConfig.timing === 'personalizado') return;

    setQuestions(prevQuestions => 
      prevQuestions.map((question, index) => {
        let timestamp = 0;
        let endTimestamp = newConfig.questionDuration;

        if (newConfig.timing === 'inicio') {
          timestamp = index * (newConfig.questionDuration + newConfig.spacing);
          endTimestamp = timestamp + newConfig.questionDuration;
        } else if (newConfig.timing === 'final') {
          const totalQuestionsTime = prevQuestions.length * (newConfig.questionDuration + newConfig.spacing);
          const startFromTime = Math.max(0, videoDuration - totalQuestionsTime);
          timestamp = startFromTime + (index * (newConfig.questionDuration + newConfig.spacing));
          endTimestamp = timestamp + newConfig.questionDuration;
        }

        return {
          ...question,
          timestamp,
          endTimestamp,
        };
      })
    );
  };

  // Añadir nueva pregunta
  const handleAddQuestion = () => {
    const newQuestion = createEmptyQuestion(questions.length);
    setQuestions([...questions, newQuestion]);
  };

  // Eliminar pregunta
  const handleDeleteQuestion = (questionId: string) => {
    const newQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(newQuestions);
    
    // Recalcular timestamps si no es personalizado
    if (config.timing !== 'personalizado') {
      setTimeout(() => {
        recalculateTimestamps(config);
      }, 100);
    }
  };

  // Actualizar configuración
  const handleConfigChange = (field: keyof FormConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    
    // Recalcular timestamps automáticamente
    recalculateTimestamps(newConfig);
  };

  // Actualizar pregunta
  const handleUpdateQuestion = (questionId: string, field: keyof FormQuestion, value: any) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  // Actualizar opción de respuesta
  const handleUpdateAnswerOption = (
    questionId: string, 
    optionIndex: number, 
    field: 'text' | 'isCorrect', 
    value: string | boolean
  ) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.answerOptions];
        if (field === 'isCorrect' && value === true) {
          // Solo una opción puede ser correcta
          newOptions.forEach((opt, idx) => {
            opt.isCorrect = idx === optionIndex;
          });
        } else {
          newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
        }
        return { ...q, answerOptions: newOptions };
      }
      return q;
    }));
  };

  // Añadir opción de respuesta
  const handleAddAnswerOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOption = {
          text: '',
          isCorrect: false,
          order: q.answerOptions.length,
        };
        return { ...q, answerOptions: [...q.answerOptions, newOption] };
      }
      return q;
    }));
  };

  // Eliminar opción de respuesta
  const handleDeleteAnswerOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.answerOptions.length > 2) {
        const newOptions = q.answerOptions.filter((_, idx) => idx !== optionIndex);
        // Reordenar
        newOptions.forEach((opt, idx) => {
          opt.order = idx;
        });
        return { ...q, answerOptions: newOptions };
      }
      return q;
    }));
  };

  // Validar formulario
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (questions.length === 0) {
      errors.push('Debe añadir al menos una pregunta');
    }

    questions.forEach((question, index) => {
      if (!question.text.trim()) {
        errors.push(`Pregunta ${index + 1}: El texto de la pregunta es obligatorio`);
      }

      if (question.timestamp < 0) {
        errors.push(`Pregunta ${index + 1}: El timestamp debe ser mayor o igual a 0`);
      }

      if (question.endTimestamp <= question.timestamp) {
        errors.push(`Pregunta ${index + 1}: El tiempo de fin debe ser mayor al tiempo de inicio`);
      }

      if (question.endTimestamp > videoDuration) {
        errors.push(`Pregunta ${index + 1}: El tiempo de fin no puede exceder la duración del video (${videoDuration}s)`);
      }

      if (question.type === 'multiple-choice') {
        const hasCorrectAnswer = question.answerOptions.some(opt => opt.isCorrect);
        if (!hasCorrectAnswer) {
          errors.push(`Pregunta ${index + 1}: Debe marcar al menos una respuesta como correcta`);
        }

        const hasEmptyOptions = question.answerOptions.some(opt => !opt.text.trim());
        if (hasEmptyOptions) {
          errors.push(`Pregunta ${index + 1}: Todas las opciones de respuesta deben tener texto`);
        }
      }
    });

    return errors;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Errores en el formulario:\n' + errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    try {
      const questionsToSubmit: CreateQuestionDto[] = questions.map(q => ({
        timestamp: q.timestamp,
        endTimestamp: q.endTimestamp,
        type: q.type,
        text: q.text,
        languageCode: q.languageCode,
        isActive: q.isActive,
        answerOptions: q.type === 'multiple-choice' ? q.answerOptions : undefined,
      }));

      await onSubmit(questionsToSubmit);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar modal
  const handleClose = () => {
    setQuestions([]);
    setConfig({
      timing: 'personalizado',
      questionDuration: 20,
      spacing: 10,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 3,
        fontSize: '1.25rem',
        fontWeight: 600
      }}>
        <PlaylistAddIcon sx={{ fontSize: 28 }} />
        Crear Formulario de Preguntas
        <Chip 
          label={`${questions.length} preguntas`} 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white',
            fontWeight: 600 
          }} 
        />
        <Chip 
          label={`Video: ${Math.floor(videoDuration / 60)}:${(videoDuration % 60).toString().padStart(2, '0')}`} 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.15)', 
            color: 'white',
            fontWeight: 500 
          }} 
        />
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Configuración del formulario */}
          <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SettingsIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Configuración del Formulario
                </Typography>
              </Box>

              <Stack spacing={3}>
                {/* Timing de las preguntas */}
                <FormControl component="fieldset">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    ¿Cuándo mostrar las preguntas?
                  </Typography>
                  <RadioGroup
                    value={config.timing}
                    onChange={(e) => handleConfigChange('timing', e.target.value)}
                    row
                  >
                    <FormControlLabel 
                      value="inicio" 
                      control={<Radio />} 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PlayArrowIcon fontSize="small" />
                          Al inicio del video
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="final" 
                      control={<Radio />} 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StopIcon fontSize="small" />
                          Al final del video
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="personalizado" 
                      control={<Radio />} 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon fontSize="small" />
                          Tiempos personalizados
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                {/* Configuración de duración y espaciado */}
                {config.timing !== 'personalizado' && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Duración por pregunta (segundos)"
                      type="number"
                      value={config.questionDuration}
                      onChange={(e) => handleConfigChange('questionDuration', parseInt(e.target.value) || 20)}
                      sx={{ flex: 1 }}
                      inputProps={{ min: 5, max: 120 }}
                      helperText="Tiempo que se mostrará cada pregunta"
                    />
                    <TextField
                      label="Espaciado entre preguntas (segundos)"
                      type="number"
                      value={config.spacing}
                      onChange={(e) => handleConfigChange('spacing', parseInt(e.target.value) || 10)}
                      sx={{ flex: 1 }}
                      inputProps={{ min: 0, max: 60 }}
                      helperText="Tiempo entre una pregunta y la siguiente"
                    />
                  </Box>
                )}

                {/* Información sobre el timing */}
                {config.timing !== 'personalizado' && questions.length > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Vista previa del timing:</strong><br/>
                      {config.timing === 'inicio' 
                        ? `Las preguntas aparecerán desde el segundo 0 hasta el segundo ${questions.length * (config.questionDuration + config.spacing) - config.spacing}`
                        : `Las preguntas aparecerán desde el segundo ${Math.max(0, videoDuration - (questions.length * (config.questionDuration + config.spacing)))} hasta el final del video`
                      }
                    </Typography>
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Botón para añadir pregunta */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5
              }}
            >
              Añadir Nueva Pregunta
            </Button>
          </Box>

          {/* Lista de preguntas */}
          {questions.length === 0 ? (
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center', 
              bgcolor: 'grey.50',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'grey.300'
            }}>
              <QuestionIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay preguntas en el formulario
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Haz clic en "Añadir Nueva Pregunta" para comenzar
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {questions.map((question, index) => (
                <Accordion key={question.id} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color="primary" 
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                        {question.text || `Pregunta ${index + 1}`}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {question.timestamp}s - {question.endTimestamp}s
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={3}>
                      {/* Configuración básica */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          label="Tiempo de inicio (segundos)"
                          type="number"
                          value={question.timestamp}
                          onChange={(e) => handleUpdateQuestion(question.id, 'timestamp', parseInt(e.target.value) || 0)}
                          sx={{ flex: 1 }}
                          inputProps={{ min: 0, max: videoDuration }}
                          disabled={config.timing !== 'personalizado'}
                          helperText={config.timing !== 'personalizado' ? 'Calculado automáticamente' : ''}
                        />
                        <TextField
                          label="Tiempo de fin (segundos)"
                          type="number"
                          value={question.endTimestamp}
                          onChange={(e) => handleUpdateQuestion(question.id, 'endTimestamp', parseInt(e.target.value) || 0)}
                          sx={{ flex: 1 }}
                          inputProps={{ min: 0, max: videoDuration }}
                          disabled={config.timing !== 'personalizado'}
                          helperText={config.timing !== 'personalizado' ? 'Calculado automáticamente' : ''}
                        />
                      </Box>

                      {/* Texto de la pregunta */}
                      <TextField
                        fullWidth
                        label="Texto de la pregunta"
                        multiline
                        rows={2}
                        value={question.text}
                        onChange={(e) => handleUpdateQuestion(question.id, 'text', e.target.value)}
                        placeholder="Escribe aquí tu pregunta..."
                      />

                      {/* Tipo y configuración */}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                          <InputLabel>Tipo de pregunta</InputLabel>
                          <Select
                            value={question.type}
                            label="Tipo de pregunta"
                            onChange={(e) => handleUpdateQuestion(question.id, 'type', e.target.value)}
                          >
                            <MenuItem value="multiple-choice">Opción múltiple</MenuItem>
                            <MenuItem value="short-answer">Respuesta corta</MenuItem>
                            <MenuItem value="true-false">Verdadero/Falso</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel>Idioma</InputLabel>
                          <Select
                            value={question.languageCode}
                            label="Idioma"
                            onChange={(e) => handleUpdateQuestion(question.id, 'languageCode', e.target.value)}
                          >
                            <MenuItem value="es-ES">Español</MenuItem>
                            <MenuItem value="en-US">English</MenuItem>
                            <MenuItem value="fr-FR">Français</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={question.isActive}
                              onChange={(e) => handleUpdateQuestion(question.id, 'isActive', e.target.checked)}
                            />
                          }
                          label="Activa"
                        />
                      </Box>

                      {/* Opciones de respuesta (solo para multiple-choice) */}
                      {question.type === 'multiple-choice' && (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Opciones de respuesta
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => handleAddAnswerOption(question.id)}
                              sx={{ textTransform: 'none' }}
                            >
                              Añadir opción
                            </Button>
                          </Box>
                          <Stack spacing={2}>
                            {question.answerOptions.map((option, optionIndex) => (
                              <Box key={optionIndex} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={option.isCorrect}
                                      onChange={(e) => handleUpdateAnswerOption(question.id, optionIndex, 'isCorrect', e.target.checked)}
                                      size="small"
                                    />
                                  }
                                  label="Correcta"
                                  sx={{ minWidth: 100 }}
                                />
                                <TextField
                                  fullWidth
                                  label={`Opción ${optionIndex + 1}`}
                                  value={option.text}
                                  onChange={(e) => handleUpdateAnswerOption(question.id, optionIndex, 'text', e.target.value)}
                                  placeholder="Texto de la opción..."
                                />
                                {question.answerOptions.length > 2 && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteAnswerOption(question.id, optionIndex)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            borderRadius: 2
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={questions.length === 0 || isSubmitting}
          sx={{ 
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            borderRadius: 2
          }}
        >
          {isSubmitting ? 'Creando...' : `Crear ${questions.length} Pregunta${questions.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 