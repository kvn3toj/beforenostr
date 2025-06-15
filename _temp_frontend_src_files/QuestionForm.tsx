import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  IconButton,
  Stack,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Question, AnswerOption } from '@prisma/client';
import { CreateQuestionDto, CreateAnswerOptionDto } from '../../../questions/dto/create-question.dto';
import { UpdateQuestionDto, UpdateAnswerOptionDto } from '../../../questions/dto/update-question.dto';

// Tipo extendido que incluye las answerOptions
type QuestionWithAnswers = Question & {
  answerOptions?: AnswerOption[];
};

interface QuestionFormProps {
  videoItemId: number;
  initialData?: QuestionWithAnswers | null;
  onSubmit: (data: CreateQuestionDto | UpdateQuestionDto) => void;
  onClose: () => void;
  isLoading: boolean;
}

interface FormAnswerOption {
  id?: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  videoItemId,
  initialData,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const { t } = useTranslation();
  const isEditing = !!initialData;

  // Estado del formulario
  const [formData, setFormData] = useState({
    timestamp: 0,
    endTimestamp: undefined as number | undefined,
    type: 'multiple-choice' as 'multiple-choice' | 'short-answer' | 'true-false',
    text: '',
    languageCode: 'es-ES',
    isActive: true,
  });

  const [answerOptions, setAnswerOptions] = useState<FormAnswerOption[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Inicializar el formulario si hay datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        timestamp: initialData.timestamp,
        endTimestamp: (initialData as any).endTimestamp || undefined,
        type: initialData.type as any,
        text: initialData.text,
        languageCode: initialData.languageCode,
        isActive: initialData.isActive,
      });

      if (initialData.answerOptions && initialData.answerOptions.length > 0) {
        setAnswerOptions(
          initialData.answerOptions
            .sort((a, b) => a.order - b.order)
            .map((option) => ({
              id: option.id,
              text: option.text,
              isCorrect: option.isCorrect,
              order: option.order,
            }))
        );
      } else if (initialData.type === 'multiple-choice') {
        // Si es multiple-choice pero no tiene opciones, crear opciones por defecto
        setAnswerOptions([
          { text: '', isCorrect: true, order: 0 },
          { text: '', isCorrect: false, order: 1 },
        ]);
      }
    } else {
      // Datos por defecto para nueva pregunta
      setFormData({
        timestamp: 0,
        endTimestamp: undefined,
        type: 'multiple-choice',
        text: '',
        languageCode: 'es-ES',
        isActive: true,
      });
      setAnswerOptions([
        { text: '', isCorrect: true, order: 0 },
        { text: '', isCorrect: false, order: 1 },
      ]);
    }
  }, [initialData]);

  // Manejar cambios en el tipo de pregunta
  useEffect(() => {
    if (formData.type === 'multiple-choice' && answerOptions.length === 0) {
      setAnswerOptions([
        { text: '', isCorrect: true, order: 0 },
        { text: '', isCorrect: false, order: 1 },
      ]);
    } else if (formData.type !== 'multiple-choice') {
      setAnswerOptions([]);
    }
  }, [formData.type]);

  // Validación del formulario
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.text.trim()) {
      errors.push('El texto de la pregunta es requerido');
    }

    if (formData.timestamp < 0) {
      errors.push('El tiempo de inicio debe ser mayor o igual a 0');
    }

    if (formData.endTimestamp !== undefined) {
      if (formData.endTimestamp < 0) {
        errors.push('El tiempo de fin debe ser mayor o igual a 0');
      }
      
      if (formData.endTimestamp <= formData.timestamp) {
        errors.push('El tiempo de fin debe ser mayor que el tiempo de inicio');
      }
    }

    if (formData.type === 'multiple-choice') {
      if (answerOptions.length < 2) {
        errors.push('Las preguntas de opción múltiple deben tener al menos 2 opciones');
      }

      const hasCorrectAnswer = answerOptions.some(option => option.isCorrect);
      if (!hasCorrectAnswer) {
        errors.push('Las preguntas de opción múltiple deben tener al menos una respuesta correcta');
      }

      const hasEmptyOptions = answerOptions.some(option => !option.text.trim());
      if (hasEmptyOptions) {
        errors.push('Todas las opciones de respuesta deben tener texto');
      }
    }

    return errors;
  };

  // Handlers
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors([]);
  };

  const handleAddOption = () => {
    const newOrder = answerOptions.length;
    setAnswerOptions(prev => [
      ...prev,
      { text: '', isCorrect: false, order: newOrder }
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (answerOptions.length > 2) { // Mantener al menos 2 opciones
      setAnswerOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, field: keyof FormAnswerOption, value: any) => {
    setAnswerOptions(prev => 
      prev.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    );
    setFormErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const submitData: CreateQuestionDto | UpdateQuestionDto = {
      ...formData,
      videoItemId,
    };

    // Agregar opciones de respuesta si es multiple-choice
    if (formData.type === 'multiple-choice') {
      if (isEditing) {
        // Para actualización, incluir IDs si existen
        (submitData as UpdateQuestionDto).answerOptions = answerOptions.map((option, index) => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
          order: index,
        } as UpdateAnswerOptionDto));
      } else {
        // Para creación, sin IDs
        (submitData as CreateQuestionDto).answerOptions = answerOptions.map((option, index) => ({
          text: option.text,
          isCorrect: option.isCorrect,
          order: index,
        } as CreateAnswerOptionDto));
      }
    }

    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Errores de validación */}
      {formErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Texto de la pregunta */}
        <TextField
          fullWidth
          label={t('question_text_label')}
          multiline
          rows={3}
          value={formData.text}
          onChange={(e) => handleInputChange('text', e.target.value)}
          disabled={isLoading}
          required
        />

        {/* Timestamp */}
        <TextField
          fullWidth
          label={t('question_timestamp_label')}
          type="number"
          value={formData.timestamp}
          onChange={(e) => handleInputChange('timestamp', parseInt(e.target.value) || 0)}
          disabled={isLoading}
          inputProps={{ min: 0 }}
          required
        />

        {/* End Timestamp */}
        <TextField
          fullWidth
          label={t('question_end_timestamp_label')}
          type="number"
          value={formData.endTimestamp || ''}
          onChange={(e) => handleInputChange('endTimestamp', e.target.value ? parseInt(e.target.value) : undefined)}
          disabled={isLoading}
          inputProps={{ min: 0 }}
        />

        {/* Tipo de pregunta */}
        <FormControl fullWidth disabled={isLoading}>
          <InputLabel>{t('question_type_label')}</InputLabel>
          <Select
            value={formData.type}
            label={t('question_type_label')}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <MenuItem value="multiple-choice">{t('question_type_multiple_choice')}</MenuItem>
            <MenuItem value="short-answer">{t('question_type_short_answer')}</MenuItem>
            <MenuItem value="true-false">{t('question_type_true_false')}</MenuItem>
          </Select>
        </FormControl>

        {/* Idioma */}
        <TextField
          fullWidth
          label={t('question_language_label')}
          value={formData.languageCode}
          onChange={(e) => handleInputChange('languageCode', e.target.value)}
          disabled={isLoading}
          required
        />

        {/* Estado activo */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              disabled={isLoading}
            />
          }
          label={t('question_active_label')}
        />

        {/* Opciones de respuesta (solo para multiple-choice) */}
        {formData.type === 'multiple-choice' && (
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('answer_options_title')}</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                disabled={isLoading}
                size="small"
              >
                {t('button_add_option')}
              </Button>
            </Box>

            <Stack spacing={2}>
              {answerOptions.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label={`${t('answer_option_text_label')} ${String.fromCharCode(65 + index)}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    disabled={isLoading}
                    size="small"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        disabled={isLoading}
                        size="small"
                      />
                    }
                    label={t('answer_option_is_correct_label')}
                    sx={{ minWidth: 'fit-content' }}
                  />

                  <IconButton
                    onClick={() => handleRemoveOption(index)}
                    disabled={isLoading || answerOptions.length <= 2}
                    color="error"
                    size="small"
                    aria-label="Eliminar opción"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        <Divider />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            {t('button_cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : t('button_save')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}; 