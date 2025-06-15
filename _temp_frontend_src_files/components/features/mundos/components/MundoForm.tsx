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
  thumbnail_url: z.string()
    .url('Debe ser una URL válida')
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
  defaultValues?: Partial<CreateMundoData>;
  onClose?: () => void;
}

export const MundoForm: React.FC<MundoFormProps> = ({
  onSubmit,
  isLoading = false,
  defaultValues,
  onClose,
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
      ...defaultValues,
      published_at: defaultValues?.published_at ? new Date(defaultValues.published_at) : null,
      unpublished_at: defaultValues?.unpublished_at ? new Date(defaultValues.unpublished_at) : null,
    },
  });

  const handleFormSubmit = (data: CreateMundoFormData) => {
    // Convert dates to ISO strings for the API
    const formattedData: CreateMundoData = {
      ...data,
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Nombre */}
            <TextField
              label="Nombre"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
            />

            {/* Descripción */}
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isLoading}
            />

            {/* URL de Thumbnail */}
            <TextField
              label="URL de Thumbnail"
              fullWidth
              {...register('thumbnail_url')}
              error={!!errors.thumbnail_url}
              helperText={errors.thumbnail_url?.message}
              disabled={isLoading}
            />

            {/* Estado Activo */}
            <FormControlLabel
              control={
                <Switch
                  {...register('is_active')}
                  disabled={isLoading}
                />
              }
              label="Activo"
            />

            {/* Fechas de Publicación y Despublicación - Reemplazado temporalmente con TextField */}
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
                    helperText={errors.published_at?.message}
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
                    helperText={errors.unpublished_at?.message}
                    disabled={isLoading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          {onClose && (
            <Button
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    // </LocalizationProvider>
  );
}; 