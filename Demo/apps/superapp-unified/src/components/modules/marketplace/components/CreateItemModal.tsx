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
  Grid,
  Card,
  CardContent,
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
  CheckCircle,
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
    label: 'Intercambio',
    description: 'Intercambia habilidades con otros',
    icon: <SwapHoriz />,
    color: '#9C27B0',
  },
];

// 🏷️ Tags predefinidos por categoría
const PREDEFINED_TAGS = {
  SERVICE: [
    'consultoria',
    'desarrollo',
    'diseño',
    'marketing',
    'educacion',
    'salud',
    'bienestar',
  ],
  PRODUCT: [
    'organico',
    'sostenible',
    'artesanal',
    'local',
    'reciclado',
    'natural',
    'ecoamigable',
  ],
  EXPERIENCE: [
    'talleres',
    'experiencias',
    'aprendizaje',
    'cultural',
    'aventura',
    'gastronomia',
    'arte',
  ],
  SKILL_EXCHANGE: [
    'idiomas',
    'musica',
    'cocina',
    'tecnologia',
    'deportes',
    'arte',
    'jardineria',
  ],
};

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  // 🔄 Estado del componente
  const [newTag, setNewTag] = React.useState('');
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // 🔧 Hook de mutación para crear items
  const createItemMutation = useCreateMarketplaceItem();

  // 📝 Configuración del formulario con React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'SERVICE' as const,
      priceUnits: 0,
      priceToins: 0,
      tags: [],
      imageUrl: '',
      location: '',
    },
    mode: 'onChange',
  });

  // 👀 Watch values para reactividad
  const watchedType = watch('type');
  const watchedTags = watch('tags') || [];

  // 🏷️ Gestión de tags
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (
      trimmedTag &&
      !watchedTags.includes(trimmedTag) &&
      watchedTags.length < 10
    ) {
      const updatedTags = [...watchedTags, trimmedTag];
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = watchedTags.filter((tag) => tag !== tagToRemove);
    setValue('tags', updatedTags);
  };

  const handleAddPredefinedTag = (tag: string) => {
    if (!watchedTags.includes(tag) && watchedTags.length < 10) {
      const updatedTags = [...watchedTags, tag];
      setValue('tags', updatedTags);
    }
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
      setSubmitSuccess(true);

      // Delay para mostrar el mensaje de éxito
      setTimeout(() => {
        reset();
        setNewTag('');
        setSubmitSuccess(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error creando item:', error);
      // El error se muestra automáticamente a través del estado de la mutación
    }
  };

  const handleClose = () => {
    reset();
    setNewTag('');
    setSubmitSuccess(false);
    onClose();
  };

  // ✅ Vista de éxito
  if (submitSuccess) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            ¡Item creado exitosamente!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tu item ha sido publicado en CoomÜnity Marketplace
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">
              🌱 Crear Nuevo Item
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comparte tu oferta con la comunidad CoomÜnity
            </Typography>
          </Box>
          <IconButton onClick={handleClose} edge="end">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {/* 🚨 Alert de error global */}
          {createItemMutation.isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al crear el item. Por favor intenta nuevamente.
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {createItemMutation.error?.message ||
                  'Error de conexión con el servidor'}
              </Typography>
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* 📝 Información básica */}
            <Grid size={{xs:12}}>
              <Typography variant="h6" gutterBottom>
                📝 Información Básica
              </Typography>
            </Grid>

            {/* Título */}
            <Grid size={{xs:12}}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Título del item *"
                    placeholder="Ej: Consultoría en Marketing Digital"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">📝</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Descripción */}
            <Grid size={{xs:12}}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción *"
                    placeholder="Describe detalladamente qué ofreces..."
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* Tipo de item */}
            <Grid size={{xs:12}}>
              <Typography variant="subtitle1" gutterBottom>
                Tipo de item *
              </Typography>
              <Grid container spacing={2}>
                {ITEM_TYPES.map((type) => (
                  <Grid size={{xs:12,sm:6,md:3}} key={type.value}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: `2px solid ${
                          watchedType === type.value
                            ? type.color
                            : 'transparent'
                        }`,
                        background:
                          watchedType === type.value
                            ? `${type.color}10`
                            : 'transparent',
                        '&:hover': {
                          borderColor: type.color,
                          background: `${type.color}05`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => setValue('type', type.value as any)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Box
                          sx={{
                            color: type.color,
                            mb: 1,
                            '& svg': { fontSize: 32 },
                          }}
                        >
                          {type.icon}
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {type.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.type.message}
                </Typography>
              )}
            </Grid>

            {/* 💰 Precio */}
            <Grid size={{xs:12}}>
              <Typography variant="h6" gutterBottom>
                💰 Precio
              </Typography>
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <Controller
                name="priceUnits"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(Number(e.target.value) || 0)}
                    label="Precio en Lükas *"
                    type="number"
                    fullWidth
                    error={!!errors.priceUnits}
                    helperText={errors.priceUnits?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">ü</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <Controller
                name="priceToins"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(Number(e.target.value) || 0)}
                    label="Precio en Töins (opcional)"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">🪙</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* 🏷️ Tags */}
            <Grid size={{xs:12}}>
              <Typography variant="h6" gutterBottom>
                🏷️ Etiquetas
              </Typography>

              {/* Tags sugeridos */}
              {watchedType &&
                PREDEFINED_TAGS[
                  watchedType as keyof typeof PREDEFINED_TAGS
                ] && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Etiquetas sugeridas:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {PREDEFINED_TAGS[
                        watchedType as keyof typeof PREDEFINED_TAGS
                      ].map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          variant={
                            watchedTags.includes(tag) ? 'filled' : 'outlined'
                          }
                          onClick={() => handleAddPredefinedTag(tag)}
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Agregar etiqueta..."
                  size="small"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  onClick={handleAddTag}
                  variant="outlined"
                  startIcon={<Add />}
                  disabled={!newTag.trim() || watchedTags.length >= 10}
                >
                  Agregar
                </Button>
              </Box>

              {/* Tags actuales */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {watchedTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="filled"
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {watchedTags.length}/10 etiquetas
              </Typography>
            </Grid>

            {/* 📍 Ubicación e imagen */}
            <Grid size={{xs:12}}>
              <Typography variant="h6" gutterBottom>
                📍 Detalles Adicionales
              </Typography>
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ubicación"
                    placeholder="Ej: Bogotá, Colombia o Online"
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
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="URL de imagen (opcional)"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    fullWidth
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || createItemMutation.isPending}
            startIcon={
              createItemMutation.isPending ? (
                <CircularProgress size={16} />
              ) : (
                <Add />
              )
            }
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
              },
            }}
          >
            {createItemMutation.isPending ? 'Creando...' : 'Crear Item'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateItemModal;
