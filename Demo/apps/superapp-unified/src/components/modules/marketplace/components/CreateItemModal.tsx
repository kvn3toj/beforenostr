import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  Add,
  Store,
  Build,
  EventAvailable,
  SwapHoriz,
  LocationOn,
  MonetizationOn,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateMarketplaceItem } from '../../../../hooks/useRealBackendData';

// 🎯 Schema de validación con Zod alineado con el backend DTO
const createItemSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  type: z.enum(['PRODUCT', 'SERVICE', 'EXPERIENCE', 'SKILL_EXCHANGE'], {
    required_error: 'Selecciona un tipo de item',
  }),
  priceUnits: z
    .number()
    .min(1, 'El precio debe ser mayor a 0')
    .max(10000, 'El precio no puede exceder 10,000 ü'),
  priceToins: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(100, 'La ubicación no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
});

type CreateItemFormData = z.infer<typeof createItemSchema>;

interface CreateItemModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// 🏷️ Opciones de tipos con iconos y colores
const ITEM_TYPES = [
  {
    value: 'SERVICE',
    label: 'Servicio',
    description: 'Ofrece tus habilidades y conocimientos',
    icon: <Build />,
    color: '#2196F3',
  },
  {
    value: 'PRODUCT',
    label: 'Producto',
    description: 'Vende productos físicos o digitales',
    icon: <Store />,
    color: '#4CAF50',
  },
  {
    value: 'EXPERIENCE',
    label: 'Experiencia',
    description: 'Comparte experiencias únicas',
    icon: <EventAvailable />,
    color: '#FF9800',
  },
  {
    value: 'SKILL_EXCHANGE',
    label: 'Intercambio de Habilidades',
    description: 'Intercambia conocimientos sin dinero',
    icon: <SwapHoriz />,
    color: '#9C27B0',
  },
];

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const createItemMutation = useCreateMarketplaceItem();
  const [newTag, setNewTag] = React.useState('');
  const [step, setStep] = React.useState(1); // Multi-step form
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      title: '',
      description: '',
      type: undefined,
      priceUnits: 1,
      priceToins: 0,
      tags: [],
      imageUrl: '',
      location: 'Online',
    },
    mode: 'onChange',
  });

  const watchedType = watch('type');
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');
  const watchedTags = watch('tags') || [];

  // 🏷️ Gestión de tags
  const handleAddTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim()) && watchedTags.length < 10) {
      const updatedTags = [...watchedTags, newTag.trim()];
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = watchedTags.filter((tag) => tag !== tagToRemove);
    setValue('tags', updatedTags);
  };

  // 📝 Manejo del formulario
  const onSubmit = async (data: CreateItemFormData) => {
    try {
      // Preparar datos para el backend
      const itemData = {
        title: data.title,
        description: data.description,
        type: data.type,
        priceUnits: data.priceUnits,
        priceToins: data.priceToins || 0,
        tags: data.tags || [],
        imageUrl: data.imageUrl || undefined,
        location: data.location || undefined,
        // El sellerId se manejará automáticamente en el backend con el usuario autenticado
      };

      await createItemMutation.mutateAsync(itemData);

      // ✅ Éxito
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creando item:', error);
      // El error se muestra automáticamente a través del estado de la mutación
    }
  };

  const handleClose = () => {
    reset();
    setCurrentTags([]);
    setNewTag('');
    setStep(1);
    setSubmitSuccess(false);
    onClose();
  };

  const handleNextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? ['title', 'description', 'type']
        : ['priceUnits', 'location'];

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: CreateItemFormData) => {
    try {
      // Preparar datos para el backend
      const itemData = {
        title: data.title,
        description: data.description,
        type: data.type,
        priceUnits: data.priceUnits,
        priceToins: data.priceToins || 0,
        currency: 'LUKAS',
        tags: currentTags,
        imageUrl: data.imageUrl || undefined,
        location: data.location || 'Online',
      };

      console.log('📤 Enviando datos del item:', itemData);
      await createItemMutation.mutateAsync(itemData);

      // Success animation
      setSubmitSuccess(true);

      // Wait for animation then close
      setTimeout(() => {
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error('Error creating item:', error);
      // Error ya es manejado por el hook mutation
    }
  };

  // Obtener información del tipo seleccionado
  const selectedTypeInfo = ITEM_TYPES.find(
    (type) => type.value === watchedType
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      data-testid="create-item-modal"
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedTypeInfo?.icon}
            <Typography variant="h6" component="div">
              Publicar {selectedTypeInfo?.label}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Comparte tu {selectedTypeInfo?.label.toLowerCase()} para generar
          impacto positivo en la comunidad
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {submitSuccess ? (
          // Vista de éxito
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              <Typography variant="h3" sx={{ color: 'white' }}>
                ✅
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              ¡{selectedTypeInfo?.label} Publicado!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tu {selectedTypeInfo?.label.toLowerCase()} ha sido publicado
              exitosamente en CoomÜnity Marketplace
            </Typography>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {/* Mostrar errores de la mutación */}
            {createItemMutation.isError && (
              <Alert severity="error">
                Error al crear el item. Por favor, verifica que el backend esté
                disponible e intenta nuevamente.
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {createItemMutation.error?.message || 'Error desconocido'}
                </Typography>
              </Alert>
            )}

            {/* Tipo de Item */}
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Tipo de Item</InputLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Tipo de Item"
                    data-testid="item-type-select"
                    startAdornment={
                      selectedTypeInfo && (
                        <InputAdornment position="start">
                          {React.cloneElement(selectedTypeInfo.icon, {
                            sx: { color: selectedTypeInfo.color },
                          })}
                        </InputAdornment>
                      )
                    }
                  >
                    {ITEM_TYPES.map((type) => (
                      <MenuItem
                        key={type.value}
                        value={type.value}
                        data-testid="item-type-option"
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {React.cloneElement(type.icon, {
                            sx: { color: type.color },
                          })}
                          <Box>
                            <Typography variant="body1">
                              {type.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.type.message}
                </Typography>
              )}
            </FormControl>

            {/* Título */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título"
                  placeholder="Ej: Desarrollo Web con React y Node.js"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  inputProps={{ maxLength: 100 }}
                  data-testid="item-title-input"
                />
              )}
            />

            {/* Descripción */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  placeholder="Describe detalladamente lo que ofreces, los beneficios y el impacto positivo que generas..."
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.description}
                  helperText={
                    errors.description?.message ||
                    `${field.value?.length || 0}/1000 caracteres`
                  }
                  inputProps={{ maxLength: 1000 }}
                  data-testid="item-description-input"
                />
              )}
            />

            {/* Precio en Lükas */}
            <Controller
              name="priceUnits"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio en Lükas (ü)"
                  type="number"
                  fullWidth
                  error={!!errors.priceUnits}
                  helperText={errors.priceUnits?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOn />ü
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  data-testid="item-price-input"
                />
              )}
            />

            {/* Precio opcional en Toins */}
            <Controller
              name="priceToins"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio alternativo en Töins (opcional)"
                  type="number"
                  fullWidth
                  error={!!errors.priceToins}
                  helperText={
                    errors.priceToins?.message ||
                    'Los Töins son una moneda adicional para intercambios especiales'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOn />₸
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            {/* Ubicación */}
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ubicación (opcional)"
                  placeholder="Ej: Medellín, Colombia"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* URL de Imagen */}
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="URL de Imagen (opcional)"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  fullWidth
                  error={!!errors.imageUrl}
                  helperText={
                    errors.imageUrl?.message ||
                    'Agrega una imagen representativa de tu oferta'
                  }
                />
              )}
            />

            {/* Gestión de Tags */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Etiquetas (opcional)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {currentTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  label="Agregar etiqueta"
                  placeholder="react, diseño, consultoría..."
                  size="small"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  onClick={handleAddTag}
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  disabled={
                    !newTag.trim() ||
                    currentTags.includes(newTag.trim().toLowerCase()) ||
                    currentTags.length >= 10
                  }
                >
                  Agregar
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {submitSuccess ? (
          <Button onClick={handleClose} variant="contained" fullWidth>
            Continuar
          </Button>
        ) : (
          <>
            <Button
              onClick={handleClose}
              disabled={createItemMutation.isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={createItemMutation.isLoading || !isValid}
              startIcon={
                createItemMutation.isLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  selectedTypeInfo?.icon
                )
              }
              sx={{
                background: selectedTypeInfo
                  ? `linear-gradient(45deg, ${selectedTypeInfo.color}, ${selectedTypeInfo.color}AA)`
                  : 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                '&:hover': {
                  background: selectedTypeInfo
                    ? `linear-gradient(45deg, ${selectedTypeInfo.color}CC, ${selectedTypeInfo.color})`
                    : 'linear-gradient(45deg, #388E3C, #4CAF50)',
                },
                '&:disabled': {
                  background: '#e0e0e0',
                },
              }}
              data-testid="create-item-submit"
            >
              {createItemMutation.isLoading
                ? 'Publicando...'
                : `Publicar ${selectedTypeInfo?.label || 'Item'}`}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateItemModal;
