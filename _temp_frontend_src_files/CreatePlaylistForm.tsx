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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
// Comentado temporalmente debido a incompatibilidades de versión con React 19
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { CreatePlaylistData } from '../../types/playlist.types';
import { useMundosQuery } from '../../hooks/useMundosQuery';
import { useTranslation } from 'react-i18next';

// Define the validation schema using Zod
const createPlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  description: z
    .string()
    .optional(),
  mundo_id: z
    .string()
    .min(1, 'El mundo es requerido')
    .uuid('Debe ser un ID de mundo válido'),
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
  const { t } = useTranslation();
  
  // Fetch mundos for the selector
  const { data: mundosData, isLoading: mundosLoading } = useMundosQuery({
    page: 0,
    pageSize: 100, // Get all mundos for the selector
    sortBy: 'name',
    sortDirection: 'asc',
    filters: { is_active: true },
  });

  const mundos = mundosData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePlaylistFormData>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      mundo_id: defaultValues?.mundo_id || '',
      is_active: defaultValues?.is_active ?? true,
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
    // Comentado temporalmente debido a incompatibilidades de versión con React 19
    // <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
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
          {t('create_new_playlist_title')}
        </Typography>

        {/* Nombre de la Playlist */}
        <Box>
          <TextField
            fullWidth
            label={t('playlist_name_label')}
            {...register('name')}
            error={!!errors.name}
            disabled={isLoading}
            placeholder="Ej: Matemáticas Básicas"
            data-testid="playlist-name-input"
          />
          {errors.name && (
            <FormHelperText error>{errors.name.message}</FormHelperText>
          )}
        </Box>

        {/* Descripción de la Playlist */}
        <Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('playlist_description_label')}
            {...register('description')}
            error={!!errors.description}
            disabled={isLoading}
            placeholder="Describe el contenido y objetivos de esta playlist..."
            data-testid="playlist-description-input"
          />
          {errors.description && (
            <FormHelperText error>{errors.description.message}</FormHelperText>
          )}
        </Box>

        {/* Selector de Mundo */}
        <FormControl fullWidth error={!!errors.mundo_id}>
          <InputLabel id="mundo-select-label">{t('playlist_mundo_label')}</InputLabel>
          <Controller
            name="mundo_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="mundo-select-label"
                label={t('playlist_mundo_label')}
                disabled={isLoading || mundosLoading}
                data-testid="playlist-mundo-select"
              >
                {mundos.map((mundo) => (
                  <MenuItem key={mundo.id} value={mundo.id}>
                    {mundo.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.mundo_id && (
            <FormHelperText error>{errors.mundo_id.message}</FormHelperText>
          )}
        </FormControl>

        {/* Switch para Estado Activo */}
        <FormControl>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value}
                    disabled={isLoading}
                    data-testid="playlist-active-switch"
                  />
                }
                label={t('playlist_is_active_label')}
              />
            )}
          />
        </FormControl>

        {/* Fechas de Publicación - Reemplazado temporalmente con TextField */}
        <Stack direction="row" spacing={2}>
          <Controller
            name="published_at"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label={t('playlist_published_at_label')}
                type="datetime-local"
                value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                error={!!errors.published_at}
                helperText={errors.published_at?.message}
                disabled={isLoading}
                data-testid="playlist-published-at-input"
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
                label={t('playlist_unpublished_at_label')}
                type="datetime-local"
                value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                error={!!errors.unpublished_at}
                helperText={errors.unpublished_at?.message}
                disabled={isLoading}
                data-testid="playlist-unpublished-at-input"
                InputLabelProps={{
                  shrink: true,
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
          data-testid="create-playlist-submit-button"
          sx={{ mt: 2 }}
        >
          {isLoading ? t('creating_playlist_loading') : t('create_playlist_button')}
        </Button>
      </Box>
    // </LocalizationProvider>
  );
}; 