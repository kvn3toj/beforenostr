import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { CreateUserData, UpdateUserData } from '../../../types/user.types';
import { useRolesQuery } from '../../../hooks/useRolesQuery';

// Schema for user form validation
const userFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  role_id: z.string().min(1, 'El rol es requerido'),
  is_active: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userFormSchema>;

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
  // Fetch roles using the custom hook
  const { data: roles, isLoading: isLoadingRoles, isError: isErrorRoles } = useRolesQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      is_active: true,
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data: UserFormData) => {
    // If it's an edit and password is empty, remove it from the data
    if (isEdit && !data.password) {
      const { password, ...dataWithoutPassword } = data;
      onSubmit(dataWithoutPassword);
    } else {
      onSubmit(data as CreateUserData);
    }
  };

  // Determine the role select state and helper text
  const getRoleSelectState = () => {
    if (isLoadingRoles) {
      return {
        disabled: true,
        helperText: 'Cargando roles...',
        showLoading: true,
      };
    }
    if (isErrorRoles) {
      return {
        disabled: true,
        helperText: 'Error al cargar roles',
        showLoading: false,
      };
    }
    if (!roles?.length) {
      return {
        disabled: true,
        helperText: 'No hay roles disponibles',
        showLoading: false,
      };
    }
    return {
      disabled: isLoading,
      helperText: errors.role_id?.message,
      showLoading: false,
    };
  };

  const roleSelectState = getRoleSelectState();

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
            disabled={isLoading}
          />

          {/* Password Field */}
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={
              errors.password?.message ||
              (isEdit ? 'Dejar en blanco para mantener la contraseña actual' : undefined)
            }
            disabled={isLoading}
          />

          {/* Role Field */}
          <FormControl fullWidth error={!!errors.role_id}>
            <InputLabel>Rol</InputLabel>
            <Controller
              name="role_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Rol"
                  disabled={roleSelectState.disabled}
                  endAdornment={
                    roleSelectState.showLoading ? (
                      <CircularProgress size={20} sx={{ mr: 2 }} />
                    ) : null
                  }
                >
                  {roles?.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>
              {roleSelectState.helperText}
            </FormHelperText>
          </FormControl>

          {/* Active Status Field */}
          <FormControlLabel
            control={
              <Switch
                {...register('is_active')}
                disabled={isLoading}
              />
            }
            label="Usuario Activo"
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