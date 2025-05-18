import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  DialogContent,
  DialogActions,
  TextField,
  FormHelperText,
} from '@mui/material';
import { Role } from '../../../types/user.types';

// Schema for role form validation
const roleFormSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

// Type for create/update operations
export type CreateRoleData = Pick<Role, 'name'>;

interface RoleFormProps {
  onSubmit: (data: CreateRoleData) => void;
  isLoading?: boolean;
  onClose?: () => void;
  defaultValues?: Partial<RoleFormData>;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  onSubmit,
  isLoading = false,
  onClose,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Name Field */}
          <TextField
            label="Nombre del Rol"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading}
            autoFocus
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
          Crear Rol
        </Button>
      </DialogActions>
    </form>
  );
}; 