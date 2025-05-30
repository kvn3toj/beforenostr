import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Settings as SettingsIcon,
  Preview as PreviewIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as BrainIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  QuestionGenerationConfig, 
  GeneratedQuestion,
  PRESET_CONFIGS 
} from '../../../lib/aiQuestionGenerator';
import { apiService } from '../../../services/api.service';

interface AIQuestionGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  videoItemId: number;
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

export const AIQuestionGeneratorModal: React.FC<AIQuestionGeneratorModalProps> = ({
  open,
  onClose,
  videoItemId,
  onQuestionsGenerated,
}) => {
  const { t } = useTranslation();
  
  // Estado de la configuración
  const [config, setConfig] = useState<QuestionGenerationConfig>({
    numberOfQuestions: 3,
    focusContext: 'general',
    questionTypes: ['multiple-choice', 'true-false'],
    timeDistribution: 'distributed',
    difficultyLevel: 'medium',
    languageCode: 'es-ES',
  });

  // Estados de la UI
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'config' | 'preview'>('config');

  // Handlers para configuración
  const handleConfigChange = (field: keyof QuestionGenerationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleQuestionTypeToggle = (type: string) => {
    setConfig(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type as any)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type as any]
    }));
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = PRESET_CONFIGS[presetKey];
    if (preset) {
      setConfig(prev => ({ ...prev, ...preset }));
    }
  };

  // Generar preguntas usando el backend
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      console.log('🚀 Llamando al backend para generar preguntas...');
      console.log('📹 Video ID:', videoItemId);
      console.log('⚙️ Configuración:', config);
      
      // Llamar al backend en lugar del generador local
      const response = await apiService.post('/ai/generate-questions', {
        videoItemId: videoItemId,
        numberOfQuestions: config.numberOfQuestions,
        focusContext: config.focusContext,
        questionTypes: config.questionTypes,
        timeDistribution: config.timeDistribution,
        difficultyLevel: config.difficultyLevel,
        languageCode: config.languageCode,
        autoSave: false
      });

      if (!response.success) {
        throw new Error(response.message || 'Error generando preguntas');
      }

      setGeneratedQuestions(response.questions);
      setStep('preview');

      console.log('✅ Preguntas generadas exitosamente desde el backend:', response.questions);

    } catch (err) {
      console.error('❌ Error generando preguntas:', err);
      setError(err.message || 'Error generando preguntas con IA');
    } finally {
      setIsGenerating(false);
    }
  };

  // Confirmar preguntas generadas
  const handleConfirm = () => {
    onQuestionsGenerated(generatedQuestions);
    handleClose();
  };

  // Cerrar modal
  const handleClose = () => {
    setStep('config');
    setGeneratedQuestions([]);
    setError(null);
    setIsGenerating(false);
    onClose();
  };

  // Validación
  const isConfigValid = () => {
    return (
      config.numberOfQuestions > 0 &&
      config.questionTypes.length > 0 &&
      config.languageCode.trim() !== ''
    );
  };

  const formatTimestamp = (timestamp: number): string => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = timestamp % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isGenerating}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          minHeight: '70vh'
        }
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{ 
          bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 3,
          px: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AIIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {t('ai_question_generator_title')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {step === 'config' ? t('ai_question_generator_subtitle_config') : t('ai_question_generator_subtitle_preview')}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {step === 'config' && (
          <Box sx={{ p: 4 }}>
            {/* Presets rápidos */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon color="primary" />
                {t('ai_quick_config_title')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => handlePresetSelect('quick')}
                  startIcon={<SpeedIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {t('ai_preset_quick')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handlePresetSelect('standard')}
                  startIcon={<StarIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {t('ai_preset_standard')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handlePresetSelect('comprehensive')}
                  startIcon={<BrainIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {t('ai_preset_comprehensive')}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Configuración básica */}
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon color="primary" />
                  {t('ai_basic_config_title')}
                </Typography>
                
                <Stack spacing={3}>
                  {/* Número de preguntas */}
                  <TextField
                    fullWidth
                    label={t('ai_number_of_questions_label')}
                    type="number"
                    value={config.numberOfQuestions}
                    onChange={(e) => handleConfigChange('numberOfQuestions', parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1, max: 10 }}
                    helperText={t('ai_number_of_questions_helper')}
                  />

                  {/* Idioma */}
                  <FormControl fullWidth>
                    <InputLabel>{t('ai_language_label')}</InputLabel>
                    <Select
                      value={config.languageCode}
                      label={t('ai_language_label')}
                      onChange={(e) => handleConfigChange('languageCode', e.target.value)}
                    >
                      <MenuItem value="es-ES">Español</MenuItem>
                      <MenuItem value="en-US">English</MenuItem>
                      <MenuItem value="fr-FR">Français</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Tipos de pregunta */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      {t('ai_question_types_title')}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {[
                        { value: 'multiple-choice', label: t('ai_multiple_choice_label'), icon: '🔘' },
                        { value: 'true-false', label: t('ai_true_false_label'), icon: '✅' },
                        { value: 'short-answer', label: t('ai_short_answer_label'), icon: '✏️' }
                      ].map(type => (
                        <FormControlLabel
                          key={type.value}
                          control={
                            <Checkbox
                              checked={config.questionTypes.includes(type.value as any)}
                              onChange={() => handleQuestionTypeToggle(type.value)}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{type.icon}</span>
                              {type.label}
                            </Box>
                          }
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Configuración avanzada */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{t('ai_advanced_config_title')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3}>
                    {/* Enfoque */}
                    <FormControl fullWidth>
                      <InputLabel>{t('ai_focus_context_label')}</InputLabel>
                      <Select
                        value={config.focusContext}
                        label={t('ai_focus_context_label')}
                        onChange={(e) => handleConfigChange('focusContext', e.target.value)}
                      >
                        <MenuItem value="general">{t('ai_focus_general')}</MenuItem>
                        <MenuItem value="visual">{t('ai_focus_visual')}</MenuItem>
                        <MenuItem value="audio">{t('ai_focus_audio')}</MenuItem>
                        <MenuItem value="specific_moments">{t('ai_focus_specific_moments')}</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Distribución temporal */}
                    <FormControl fullWidth>
                      <InputLabel>{t('ai_time_distribution_label')}</InputLabel>
                      <Select
                        value={config.timeDistribution}
                        label={t('ai_time_distribution_label')}
                        onChange={(e) => handleConfigChange('timeDistribution', e.target.value)}
                      >
                        <MenuItem value="distributed">{t('ai_distribution_distributed')}</MenuItem>
                        <MenuItem value="beginning">{t('ai_distribution_beginning')}</MenuItem>
                        <MenuItem value="middle">{t('ai_distribution_middle')}</MenuItem>
                        <MenuItem value="end">{t('ai_distribution_end')}</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Dificultad */}
                    <FormControl fullWidth>
                      <InputLabel>{t('ai_difficulty_label')}</InputLabel>
                      <Select
                        value={config.difficultyLevel}
                        label={t('ai_difficulty_label')}
                        onChange={(e) => handleConfigChange('difficultyLevel', e.target.value)}
                      >
                        <MenuItem value="easy">{t('ai_difficulty_easy')}</MenuItem>
                        <MenuItem value="medium">{t('ai_difficulty_medium')}</MenuItem>
                        <MenuItem value="hard">{t('ai_difficulty_hard')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}

        {step === 'preview' && (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PreviewIcon color="primary" />
              {t('ai_preview_title')} ({generatedQuestions.length})
            </Typography>

            <Stack spacing={3}>
              {generatedQuestions.map((question, index) => (
                <Paper key={index} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {index + 1}. {question.text}
                    </Typography>
                    <Chip 
                      label={`${formatTimestamp(question.timestamp)}`}
                      color="primary" 
                      size="small" 
                    />
                  </Box>

                  {question.options && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        {t('ai_preview_options_title')}
                      </Typography>
                      <Stack spacing={1}>
                        {question.options.map((option, optIndex) => (
                          <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: '20px' }}>
                              {String.fromCharCode(65 + optIndex)}.
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ 
                                fontWeight: optIndex === question.correctAnswer ? 600 : 400,
                                color: optIndex === question.correctAnswer ? 'success.main' : 'text.primary'
                              }}
                            >
                              {option}
                            </Typography>
                            {optIndex === question.correctAnswer && (
                              <Chip label="✓" size="small" color="success" sx={{ ml: 1 }} />
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {question.explanation && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <strong>{t('ai_preview_explanation_title')}</strong> {question.explanation}
                    </Alert>
                  )}
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        {step === 'config' && (
          <>
            <Button onClick={handleClose} disabled={isGenerating}>
              {t('ai_cancel_button')}
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={!isConfigValid() || isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} /> : <AIIcon />}
              sx={{ minWidth: 160 }}
            >
              {isGenerating ? t('ai_generating_button') : t('ai_generate_button')}
            </Button>
          </>
        )}
        
        {step === 'preview' && (
          <>
            <Button onClick={() => setStep('config')}>
              {t('ai_back_to_config_button')}
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              startIcon={<PreviewIcon />}
            >
              {t('ai_use_questions_button')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}; 