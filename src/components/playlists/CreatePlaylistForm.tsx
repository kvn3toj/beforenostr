import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { CreatePlaylistData } from '../../services/playlist.service';

// Define the validation schema using Zod
const createPlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  mundo_id: z
    .string()
    .min(1, 'El mundo es requerido')
    .uuid('Debe ser un ID de mundo válido'),
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

// Infer the type from the schema
type CreatePlaylistFormData = z.infer<typeof createPlaylistSchema>;

interface CreatePlaylistFormProps {
  onSubmit: (data: CreatePlaylistData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CreatePlaylistFormData>;
}

export const CreatePlaylistForm = ({
  onSubmit,
  isLoading = false,
  defaultValues,
}: CreatePlaylistFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePlaylistFormData>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      mundo_id: defaultValues?.mundo_id || '',
      published_at: defaultValues?.published_at ? new Date(defaultValues.published_at) : null,
      unpublished_at: defaultValues?.unpublished_at ? new Date(defaultValues.unpublished_at) : null,
    },
  });

  const handleFormSubmit = (data: CreatePlaylistFormData) => {
    try {
      // Convert dates to ISO strings for the API
      const formattedData: CreatePlaylistData = {
        ...data,
        published_at: data.published_at?.toISOString() || null,
        unpublished_at: data.unpublished_at?.toISOString() || null,
      };
      onSubmit(formattedData);
      toast.success('Formulario validado correctamente');
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      toast.error('Error al procesar el formulario');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Crear Nueva Playlist
        </Typography>

        <Box>
          <TextField
            fullWidth
            label="Nombre de la Playlist"
            {...register('name')}
            error={!!errors.name}
            disabled={isLoading}
          />
          {errors.name && (
            <FormHelperText error>{errors.name.message}</FormHelperText>
          )}
        </Box>

        <Box>
          <TextField
            fullWidth
            label="ID del Mundo"
            {...register('mundo_id')}
            error={!!errors.mundo_id}
            disabled={isLoading}
          />
          {errors.mundo_id && (
            <FormHelperText error>{errors.mundo_id.message}</FormHelperText>
          )}
        </Box>

        <Stack direction="row" spacing={2}>
          <Controller
            name="published_at"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Fecha de Publicación"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.published_at,
                    helperText: errors.published_at?.message,
                    disabled: isLoading,
                  },
                }}
              />
            )}
          />

          <Controller
            name="unpublished_at"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Fecha de Despublicación"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.unpublished_at,
                    helperText: errors.unpublished_at?.message,
                    disabled: isLoading,
                  },
                }}
              />
            )}
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Creando...' : 'Crear Playlist'}
        </Button>
      </Box>
    </LocalizationProvider>
  );
}; 