import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
} from '@mui/material';
import {
  Add,
  Remove,
  Save,
  Preview,
  Help,
  Upload,
  Schedule,
  Star,
  Group,
  WorkspacePremium,
  MonetizationOn,
  Psychology,
  EmojiEvents,
  Close,
  School,
  Nature,
  Lightbulb,
  Public,
  Recycling,
  EmojiObjects,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import {
  ChallengeType,
  ChallengeStatus,
  ChallengeDifficulty,
  ChallengeCategory,
  CreateChallengeDto,
  ChallengeTask,
  ChallengeReward,
} from '../../../types/challenges';

interface ChallengeCreatorProps {
  onSave?: (challengeData: CreateChallengeDto) => Promise<void>;
  onPreview?: (challengeData: CreateChallengeDto) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateChallengeDto>;
  isLoading?: boolean;
}

interface ChallengeFormData extends CreateChallengeDto {
  tasks: ChallengeTask[];
  rewards: ChallengeReward[];
}

const CATEGORY_OPTIONS = [
  {
    value: 'LEARNING',
    label: 'Aprendizaje',
    icon: School,
    color: '#2196F3',
    description: 'Expande tu conocimiento y sabiduría',
  },
  {
    value: 'SOCIAL',
    label: 'Social',
    icon: Group,
    color: '#FF9800',
    description: 'Fortalece los lazos comunitarios',
  },
  {
    value: 'WELLNESS',
    label: 'Bienestar',
    icon: 'Favorite',
    color: '#4CAF50',
    description: 'Cuida tu cuerpo, mente y espíritu',
  },
  {
    value: 'CREATIVITY',
    label: 'Creatividad',
    icon: Lightbulb,
    color: '#9C27B0',
    description: 'Expresa tu potencial creativo',
  },
  {
    value: 'COMMUNITY',
    label: 'Comunidad',
    icon: Public,
    color: '#FF5722',
    description: 'Construye el Bien Común',
  },
  {
    value: 'SUSTAINABILITY',
    label: 'Sostenibilidad',
    icon: Nature,
    color: '#8BC34A',
    description: 'Protege nuestro planeta',
  },
  {
    value: 'INNOVATION',
    label: 'Innovación',
    icon: EmojiObjects,
    color: '#607D8B',
    description: 'Crea soluciones transformadoras',
  },
];

const DIFFICULTY_OPTIONS = [
  { value: 'BEGINNER', label: 'Principiante', icon: '🌱', points: 50 },
  { value: 'INTERMEDIATE', label: 'Intermedio', icon: '⚡', points: 100 },
  { value: 'ADVANCED', label: 'Avanzado', icon: '🔥', points: 200 },
  { value: 'EXPERT', label: 'Experto', icon: '💎', points: 500 },
];

const TYPE_OPTIONS = [
  { value: 'CUSTOM', label: 'Personalizado' },
  { value: 'AUTOMATED', label: 'Automático' },
  { value: 'DAILY', label: 'Diario' },
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensual' },
  { value: 'SEASONAL', label: 'Estacional' },
];

const TASK_TYPES = [
  {
    value: 'ACTION',
    label: 'Acción',
    description: 'Realizar una actividad específica',
  },
  {
    value: 'VERIFICATION',
    label: 'Verificación',
    description: 'Verificar completitud de tarea',
  },
  {
    value: 'SUBMISSION',
    label: 'Entrega',
    description: 'Subir evidencia o archivo',
  },
  { value: 'QUIZ', label: 'Quiz', description: 'Responder preguntas' },
  {
    value: 'SOCIAL',
    label: 'Social',
    description: 'Interactuar con la comunidad',
  },
];

const REWARD_TYPES = [
  {
    value: 'MERITS',
    label: 'Mëritos',
    icon: WorkspacePremium,
    color: '#FF9800',
  },
  { value: 'LUKAS', label: 'Lükas', icon: MonetizationOn, color: '#4CAF50' },
  { value: 'ONDAS', label: 'Öndas', icon: Psychology, color: '#2196F3' },
  { value: 'BADGE', label: 'Insignia', icon: EmojiEvents, color: '#9C27B0' },
  { value: 'ITEM', label: 'Objeto', icon: Star, color: '#FF5722' },
];

const RECIPROCIDAD_TAGS = [
  'reciprocidad',
  'bien común',
  'cooperación',
  'reciprocidad',
  'minga',
  'colaborativo',
  'comunitario',
  'transformación',
  'conciencia',
  'equilibrio',
];

export const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({
  onSave,
  onPreview,
  onCancel,
  initialData = {},
  isLoading = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ChallengeFormData>({
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      type: 'CUSTOM',
      difficulty: 'BEGINNER',
      category: 'COMMUNITY',
      points: 100,
      maxParticipants: undefined,
      startDate: '',
      endDate: '',
      duration: 7,
      imageUrl: '',
      tags: [],
      requirements: [],
      tasks: [],
      rewards: [],
      ...initialData,
    },
  });

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: 'tasks',
  });

  const {
    fields: rewardFields,
    append: appendReward,
    remove: removeReward,
  } = useFieldArray({
    control,
    name: 'rewards',
  });

  const watchedDifficulty = watch('difficulty');
  const watchedCategory = watch('category');
  const watchedType = watch('type');

  // Calcular puntos sugeridos basados en dificultad y tareas
  const calculateSuggestedPoints = () => {
    const difficultyMultiplier =
      DIFFICULTY_OPTIONS.find((d) => d.value === watchedDifficulty)?.points ||
      100;
    const taskCount = taskFields.length || 1;
    return Math.round(difficultyMultiplier * (1 + taskCount * 0.2));
  };

  // Actualizar puntos automáticamente cuando cambie la dificultad
  React.useEffect(() => {
    const suggestedPoints = calculateSuggestedPoints();
    setValue('points', suggestedPoints);
  }, [watchedDifficulty, taskFields.length, setValue]);

  const handleAddTask = () => {
    appendTask({
      id: `task-${Date.now()}`,
      challengeId: '',
      title: '',
      description: '',
      order: taskFields.length + 1,
      type: 'ACTION',
      isRequired: true,
      points: 50,
    });
  };

  const handleAddReward = () => {
    appendReward({
      id: `reward-${Date.now()}`,
      type: 'MERITS',
      amount: 100,
      description: '',
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // TODO: Implementar upload real de imagen
      // const imageUrl = await uploadImage(file);
      // setValue('imageUrl', imageUrl);

      // Mock implementation
      setTimeout(() => {
        setValue('imageUrl', URL.createObjectURL(file));
        toast.success('Imagen subida exitosamente');
        setUploadingImage(false);
      }, 2000);
    } catch (error) {
      toast.error('Error subiendo imagen');
      setUploadingImage(false);
    }
  };

  const handlePreview = () => {
    const formData = watch();
    if (onPreview) {
      onPreview(formData);
    }
    setShowPreview(true);
  };

  const onSubmit = async (data: ChallengeFormData) => {
    try {
      if (onSave) {
        await onSave(data);
        toast.success('Desafío creado exitosamente');
      }
    } catch (error) {
      toast.error('Error creando desafío');
    }
  };

  const steps = [
    'Información Básica',
    'Configuración',
    'Tareas',
    'Recompensas',
    'Revisión',
  ];

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'El título es obligatorio' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Título del Desafío *"
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder="Ej: Práctica Diaria de Reciprocidad"
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="shortDescription"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Descripción Corta"
              placeholder="Breve resumen del desafío"
              inputProps={{ maxLength: 150 }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          rules={{ required: 'La descripción es obligatoria' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Descripción Detallada *"
              error={!!errors.description}
              helperText={errors.description?.message}
              placeholder="Describe en detalle qué implica este desafío, cómo contribuye al Bien Común y qué aprenderán los participantes..."
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select {...field} label="Categoría">
                {CATEGORY_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <IconComponent
                          sx={{ fontSize: 20, color: option.color }}
                        />
                        <Box>
                          <Typography variant="body2">
                            {option.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Dificultad</InputLabel>
              <Select {...field} label="Dificultad">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{option.icon}</Typography>
                      <Box>
                        <Typography variant="body2">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ~{option.points} Mëritos base
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
          }}
        >
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<Upload />}
              disabled={uploadingImage}
              fullWidth
            >
              {uploadingImage ? 'Subiendo...' : 'Subir Imagen del Desafío'}
            </Button>
          </label>
          {watch('imageUrl') && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={watch('imageUrl')}
                alt="Preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '120px',
                  borderRadius: 8,
                }}
              />
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );

  const renderConfiguration = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Tipo de Desafío</InputLabel>
              <Select {...field} label="Tipo de Desafío">
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              label="Duración (días)"
              helperText="0 = sin límite de tiempo"
              InputProps={{ inputProps: { min: 0, max: 365 } }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="points"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              label="Mëritos Totales"
              helperText={`Sugerido: ${calculateSuggestedPoints()}`}
              InputProps={{ inputProps: { min: 1, max: 10000 } }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="maxParticipants"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              label="Máximo de Participantes"
              helperText="Dejar vacío para ilimitado"
              InputProps={{ inputProps: { min: 1, max: 10000 } }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              freeSolo
              options={RECIPROCIDAD_TAGS}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Etiquetas"
                  placeholder="Agregar etiquetas relacionadas con Reciprocidad..."
                />
              )}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            💡 <strong>Filosofía CoomÜnity:</strong> Los desafíos deben fomentar
            la reciprocidad (Reciprocidad) y contribuir al Bien Común. Considera cómo
            este desafío beneficiará tanto al individuo como a la comunidad.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const renderTasks = () => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">Tareas del Desafío</Typography>
        <Button startIcon={<Add />} onClick={handleAddTask} variant="outlined">
          Agregar Tarea
        </Button>
      </Box>

      {taskFields.length === 0 ? (
        <Paper
          sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay tareas definidas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Agrega tareas específicas que los participantes deben completar
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={handleAddTask}
            variant="contained"
          >
            Crear Primera Tarea
          </Button>
        </Paper>
      ) : (
        <List>
          {taskFields.map((task, index) => (
            <ListItem
              key={task.id}
              sx={{ bgcolor: 'background.paper', mb: 2, borderRadius: 2 }}
            >
              <Box sx={{ width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`tasks.${index}.title`}
                      control={control}
                      rules={{ required: 'El título es obligatorio' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          label="Título de la Tarea"
                          placeholder="Ej: Realizar acto de reciprocidad"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`tasks.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel>Tipo</InputLabel>
                          <Select {...field} label="Tipo">
                            {TASK_TYPES.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                <Tooltip title={type.description} arrow>
                                  <span>{type.label}</span>
                                </Tooltip>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name={`tasks.${index}.points`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          type="number"
                          label="Puntos"
                          InputProps={{ inputProps: { min: 1, max: 1000 } }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name={`tasks.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          multiline
                          rows={2}
                          label="Descripción"
                          placeholder="Describe qué debe hacer el participante..."
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Controller
                        name={`tasks.${index}.isRequired`}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch {...field} checked={field.value} />
                            }
                            label="Obligatoria"
                          />
                        )}
                      />
                      <IconButton
                        onClick={() => removeTask(index)}
                        color="error"
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const renderRewards = () => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">Recompensas</Typography>
        <Button
          startIcon={<Add />}
          onClick={handleAddReward}
          variant="outlined"
        >
          Agregar Recompensa
        </Button>
      </Box>

      {rewardFields.length === 0 ? (
        <Paper
          sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay recompensas definidas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define las recompensas que recibirán los participantes
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={handleAddReward}
            variant="contained"
          >
            Crear Primera Recompensa
          </Button>
        </Paper>
      ) : (
        <List>
          {rewardFields.map((reward, index) => (
            <ListItem
              key={reward.id}
              sx={{ bgcolor: 'background.paper', mb: 2, borderRadius: 2 }}
            >
              <Box sx={{ width: '100%' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name={`rewards.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel>Tipo</InputLabel>
                          <Select {...field} label="Tipo">
                            {REWARD_TYPES.map((type) => {
                              const IconComponent = type.icon;
                              return (
                                <MenuItem key={type.value} value={type.value}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                    }}
                                  >
                                    <IconComponent
                                      sx={{ fontSize: 16, color: type.color }}
                                    />
                                    {type.label}
                                  </Box>
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name={`rewards.${index}.amount`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          type="number"
                          label="Cantidad"
                          InputProps={{ inputProps: { min: 1, max: 10000 } }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`rewards.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          label="Descripción"
                          placeholder="Ej: Por completar el desafío de Reciprocidad"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      onClick={() => removeReward(index)}
                      color="error"
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const renderReview = () => {
    const formData = watch();
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Revisión Final
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {formData.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {formData.shortDescription}
                </Typography>
                <Typography variant="body1" paragraph>
                  {formData.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={formData.category} color="primary" />
                  <Chip label={formData.difficulty} color="secondary" />
                  <Chip label={formData.type} variant="outlined" />
                </Box>

                {formData.tags && formData.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Etiquetas:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        flexWrap: 'wrap',
                        mt: 0.5,
                      }}
                    >
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Tareas"
                      secondary={`${taskFields.length} tareas definidas`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Recompensas"
                      secondary={`${rewardFields.length} recompensas`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Mëritos Totales"
                      secondary={formData.points}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Duración"
                      secondary={
                        formData.duration
                          ? `${formData.duration} días`
                          : 'Sin límite'
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderConfiguration();
      case 2:
        return renderTasks();
      case 3:
        return renderRewards();
      case 4:
        return renderReview();
      default:
        return 'Paso desconocido';
    }
  };

  return (
    <Card sx={{ maxWidth: 1000, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" fontWeight={700}>
            🏆 Crear Nuevo Desafío
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Preview />}
              onClick={handlePreview}
              variant="outlined"
              disabled={!isValid}
            >
              Vista Previa
            </Button>
            {onCancel && (
              <Button startIcon={<Close />} onClick={onCancel} color="inherit">
                Cancelar
              </Button>
            )}
          </Box>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Box sx={{ mt: 2, mb: 4 }}>{getStepContent(index)}</Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    Anterior
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading || !isValid}
                      startIcon={<Save />}
                    >
                      {isLoading ? 'Creando...' : 'Crear Desafío'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(activeStep + 1)}
                    >
                      Siguiente
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Preview Dialog */}
        <Dialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Vista Previa del Desafío</DialogTitle>
          <DialogContent>
            {/* Aquí se mostraría el ChallengeCard con los datos del formulario */}
            <Typography variant="body2" color="text.secondary">
              Vista previa del desafío con los datos ingresados...
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPreview(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
