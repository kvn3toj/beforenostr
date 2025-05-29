import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { CreateUserData, UpdateUserData } from '../../../types/user.types';

// Schema for user form validation aligned with backend DTOs
const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().optional(),
  avatarUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

const editUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().optional(),
  avatarUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof createUserSchema>;

interface UserFormProps {
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  isLoading?: boolean;
  onClose?: () => void;
  defaultValues?: Partial<UserFormData>;
  isEdit?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  isLoading = false,
  onClose,
  defaultValues,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      isActive: true,
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data: UserFormData) => {
    // Clean up empty strings for optional fields
    const cleanedData = {
      ...data,
      name: data.name?.trim() || undefined,
      avatarUrl: data.avatarUrl?.trim() || undefined,
    };

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Email Field */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading || isEdit} // Email should not be editable in edit mode
          />

          {/* Password Field - Only show in create mode */}
          {!isEdit && (
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />
          )}

          {/* Name Field */}
          <TextField
            label="Nombre"
            type="text"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading}
          />

          {/* Avatar URL Field */}
          <TextField
            label="URL del Avatar"
            type="url"
            fullWidth
            {...register('avatarUrl')}
            error={!!errors.avatarUrl}
            helperText={errors.avatarUrl?.message}
            disabled={isLoading}
          />

          {/* Active Status Field */}
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                }
                label="Usuario Activo"
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        {onClose && (
          <Button onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isEdit ? 'Actualizar' : 'Crear'} Usuario
        </Button>
      </DialogActions>
    </form>
  );
}; 