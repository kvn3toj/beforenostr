import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useConsoleData, type CreateChallengeData, type UpdateChallengeData } from '../hooks/useConsoleData';

// =====================================================================
// SCHEMAS DE VALIDACIÓN CON ZOD - SIGUIENDO FILOSOFÍA DE CALIDAD
// =====================================================================

const challengeSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(60, 'El título no puede exceder 60 caracteres'),
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  slug: z.string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(50, 'El slug no puede exceder 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'MILESTONE', 'CUSTOM'], {
    errorMap: () => ({ message: 'Selecciona un tipo de desafío válido' })
  }),
  config: z.object({
    targetValue: z.number().min(1, 'El valor objetivo debe ser mayor a 0'),
    actionType: z.string().min(1, 'Selecciona un tipo de acción'),
    maxParticipants: z.number().min(1).optional(),
  }).optional(),
  rewards: z.array(z.object({
    type: z.string().min(1, 'Tipo de recompensa requerido'),
    amount: z.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
    description: z.string().optional(),
  })).optional(),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeEditorProps {
  challenge?: any;
  onClose: () => void;
  onSuccess?: (challenge: any) => void;
}

const CHALLENGE_TYPES = [
  { value: 'DAILY', label: 'Diario', description: 'Se reinicia cada día' },
  { value: 'WEEKLY', label: 'Semanal', description: 'Se reinicia cada semana' },
  { value: 'MONTHLY', label: 'Mensual', description: 'Se reinicia cada mes' },
  { value: 'MILESTONE', label: 'Hito', description: 'Objetivo único a alcanzar' },
  { value: 'CUSTOM', label: 'Personalizado', description: 'Configuración avanzada' },
];

const ACTION_TYPES = [
  { value: 'marketplace_exchange', label: 'Intercambio en Marketplace', reciprocity: true },
  { value: 'video_completion', label: 'Completar Video ÜPlay', reciprocity: false },
  { value: 'social_interaction', label: 'Interacción Social', reciprocity: true },
  { value: 'community_contribution', label: 'Contribución Comunitaria', reciprocity: true },
  { value: 'knowledge_sharing', label: 'Compartir Conocimiento', reciprocity: true },
];

const REWARD_TYPES = [
  { value: 'MERITOS', label: 'Méritos', icon: '🏆', color: '#FFD700' },
  { value: 'LUKAS', label: 'Lükas', icon: '💰', color: '#4CAF50' },
  { value: 'UNITS', label: 'Ünits (Reciprocidad)', icon: '🔄', color: '#2196F3' },
  { value: 'EXPERIENCE', label: 'Experiencia', icon: '⭐', color: '#9C27B0' },
];

export const ChallengeEditor: React.FC<ChallengeEditorProps> = ({
  challenge,
  onClose,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const { createChallenge, updateChallenge, isCreating, isUpdating } = useConsoleData();

  const isEditing = Boolean(challenge);
  const isWorking = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: challenge ? {
      title: challenge.title,
      name: challenge.name,
      slug: challenge.slug,
      description: challenge.description,
      type: challenge.type,
      config: challenge.config || { targetValue: 1, actionType: '' },
      rewards: challenge.rewards || [],
    } : {
      title: '',
      name: '',
      slug: '',
      description: '',
      type: 'WEEKLY',
      config: { targetValue: 1, actionType: '' },
      rewards: [],
    },
  });

  const { fields: rewardFields, append: addReward, remove: removeReward } = useFieldArray({
    control,
    name: 'rewards',
  });

  const formData = watch();

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  const handleTitleChange = useCallback((title: string) => {
    setValue('title', title);
    if (!isEditing) {
      const slug = generateSlug(title);
      setValue('slug', slug);
      setValue('name', slug);
    }
  }, [setValue, generateSlug, isEditing]);

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await trigger(fieldsToValidate as any);
    
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast.error('Por favor corrige los errores antes de continuar');
    }
  };

  const handlePrev = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAddReward = () => {
    addReward({
      type: 'MERITOS',
      amount: 10,
      description: '',
    });
  };

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0: return ['title', 'name', 'slug', 'description', 'type'];
      case 1: return ['config'];
      case 2: return ['rewards'];
      default: return [];
    }
  };

  const onSubmit = async (data: ChallengeFormData) => {
    try {
      if (isEditing) {
        const updatedChallenge = await updateChallenge({
          id: challenge.id,
          ...data,
        } as UpdateChallengeData);
        onSuccess?.(updatedChallenge);
      } else {
        const newChallenge = await createChallenge(data as CreateChallengeData);
        onSuccess?.(newChallenge);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting challenge:', error);
    }
  };

  const StepBasicInfo = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom color="primary">
        📝 Información Básica del Desafío
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Define los aspectos fundamentales que inspirarán a los Jugadores
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Título del Desafío ✨"
                placeholder="ej. Maestro de la Reciprocidad"
                error={!!errors.title}
                helperText={errors.title?.message || 'Un título inspirador que capture la esencia del desafío'}
                onChange={(e) => {
                  field.onChange(e);
                  handleTitleChange(e.target.value);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nombre Técnico"
                placeholder="reciprocity-master"
                error={!!errors.name}
                helperText={errors.name?.message || 'Identificador interno del desafío'}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Slug URL"
                placeholder="reciprocity-master"
                error={!!errors.slug}
                helperText={errors.slug?.message || 'URL amigable para el desafío'}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const steps = [
    {
      label: 'Información Básica',
      description: 'Título, descripción y tipo',
      component: <StepBasicInfo />,
      icon: '📝',
    },
  ];

  return (
    <Paper sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 4, borderRadius: 3 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary">
          {isEditing ? '✏️ Editar Desafío' : '✨ Crear Nuevo Desafío'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Editor de Desafíos Gamificados - Cerebro Operativo de CoomÜnity
        </Typography>
      </Box>

      {isWorking && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {isCreating ? 'Creando desafío...' : 'Actualizando desafío...'}
          </Typography>
        </Box>
      )}

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{step.icon}</span>
                <Box>
                  <Typography variant="subtitle1">{step.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </StepLabel>
            <StepContent>
              {step.component}
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || isWorking}
                  startIcon={isWorking ? undefined : <SuccessIcon />}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                  }}
                >
                  {isWorking 
                    ? (isEditing ? 'Actualizando...' : 'Creando...') 
                    : (isEditing ? 'Actualizar Desafío' : 'Crear Desafío')
                  }
                </Button>
                
                <Button
                  variant="text"
                  onClick={onClose}
                  disabled={isWorking}
                  sx={{ borderRadius: 2 }}
                >
                  Cancelar
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};
