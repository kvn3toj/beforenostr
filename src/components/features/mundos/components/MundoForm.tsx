import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
// Comentado temporalmente debido a incompatibilidades de versión con React 19
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { CreateMundoData } from '../../../../types/mundo.types';

// Define the validation schema using Zod
const createMundoSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .optional()
    .nullable()
    .transform(val => val || null),
  slug: z.string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(100, 'El slug no puede tener más de 100 caracteres')
    .optional(),
  imageUrl: z.string()
    .url('Ingresa una URL válida')
    .optional()
    .nullable()
    .transform(val => val || null),
  is_active: z.boolean().default(true),
  published_at: z.date().nullable(),
  unpublished_at: z.date().nullable().refine(
    (date) => {
      if (!date) return true;
      return date > new Date();
    },
    'La fecha de despublicación debe ser posterior a la fecha actual'
  ),
}).refine(
  (data) => {
    if (!data.published_at || !data.unpublished_at) return true;
    return data.unpublished_at > data.published_at;
  },
  {
    message: 'La fecha de despublicación debe ser posterior a la fecha de publicación',
    path: ['unpublished_at'],
  }
);

type CreateMundoFormData = z.infer<typeof createMundoSchema>;

interface MundoFormProps {
  onSubmit: (data: CreateMundoData) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateMundoData>;
  onCancel?: () => void;
}

export const MundoForm: React.FC<MundoFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMundoFormData>({
    resolver: zodResolver(createMundoSchema),
    defaultValues: {
      is_active: true,
      ...initialData,
      published_at: initialData?.published_at ? new Date(initialData.published_at) : null,
      unpublished_at: initialData?.unpublished_at ? new Date(initialData.unpublished_at) : null,
    },
  });

  const handleFormSubmit = (data: CreateMundoFormData) => {
    // Generate slug from name if not provided
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    // Convert dates to ISO strings for the API
    const formattedData: CreateMundoData = {
      ...data,
      slug,
      published_at: data.published_at?.toISOString() || null,
      unpublished_at: data.unpublished_at?.toISOString() || null,
    };
    onSubmit(formattedData);
  };

  return (
    // Comentado temporalmente debido a incompatibilidades de versión con React 19
    // <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Instrucciones claras */}
            <Alert severity="info" sx={{ mb: 2 }}>
              {initialData 
                ? 'Modifica la información del mundo. Los campos marcados con (*) son obligatorios.'
                : 'Completa la información para crear un nuevo mundo. Los campos marcados con (*) son obligatorios.'
              }
            </Alert>

            {/* Sección: Información Básica */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Información Básica
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Nombre */}
                <TextField
                  label="Nombre del Mundo *"
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message || 'Nombre descriptivo para identificar el mundo'}
                  disabled={isLoading}
                  placeholder="Ej: Mundo de Programación"
                  required
                />

                {/* Descripción */}
                <TextField
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description?.message || 'Descripción opcional del contenido y propósito del mundo'}
                  disabled={isLoading}
                  placeholder="Describe el contenido y objetivos de este mundo..."
                />
              </Box>
            </Box>

            <Divider />

            {/* Sección: Configuración Técnica */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Configuración Técnica
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Slug (opcional) */}
                <TextField
                  label="Identificador (Slug)"
                  fullWidth
                  {...register('slug')}
                  error={!!errors.slug}
                  helperText={errors.slug?.message || 'Se generará automáticamente desde el nombre si se deja vacío. Usado para URLs amigables.'}
                  disabled={isLoading}
                  placeholder="mundo-programacion"
                />

                {/* URL de Imagen (opcional) */}
                <TextField
                  label="URL de Imagen de Portada"
                  fullWidth
                  {...register('imageUrl')}
                  error={!!errors.imageUrl}
                  helperText={errors.imageUrl?.message || 'Opcional - Imagen representativa del mundo'}
                  disabled={isLoading}
                  placeholder="https://ejemplo.com/imagen-mundo.jpg"
                />
              </Box>
            </Box>

            <Divider />

            {/* Sección: Estado y Publicación */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Estado y Publicación
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Estado Activo */}
                <FormControlLabel
                  control={
                    <Switch
                      {...register('is_active')}
                      disabled={isLoading}
                      color="primary"
                    />
                  }
                  label="Mundo Activo - Los usuarios pueden acceder a este mundo"
                />

                {/* Fechas de Publicación y Despublicación - Reemplazado temporalmente con TextField */}
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Programación de Publicación (Opcional)
                </Typography>
                
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="published_at"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Fecha de Publicación"
                        type="datetime-local"
                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        error={!!errors.published_at}
                        helperText={errors.published_at?.message || 'Cuándo estará disponible para los usuarios'}
                        disabled={isLoading}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="unpublished_at"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Fecha de Despublicación"
                        type="datetime-local"
                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        error={!!errors.unpublished_at}
                        helperText={errors.unpublished_at?.message || 'Cuándo dejará de estar disponible (opcional)'}
                        disabled={isLoading}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Stack>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          {onCancel && (
            <Button
              onClick={onCancel}
              disabled={isLoading}
              variant="outlined"
              color="inherit"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ 
              minWidth: 120,
              fontWeight: 600
            }}
          >
            {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
            {initialData ? 'Actualizar Mundo' : 'Crear Mundo'}
          </Button>
        </DialogActions>
      </form>
    // </LocalizationProvider>
  );
}; 