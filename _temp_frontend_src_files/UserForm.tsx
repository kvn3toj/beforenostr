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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { CreateUserData, UpdateUserData } from '../../../types/user.types';
import { useRolesQuery } from '../../../../hooks/useRolesQuery';
import { useAnalytics } from '../../../../hooks/useAnalytics';

// Schema for user form validation aligned with backend DTOs
const createUserSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().url('Ingresa una URL válida').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  roleId: z.string().optional(),
});

const editUserSchema = z.object({
  email: z.string().email('Ingresa un email válido').optional(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().url('Ingresa una URL válida').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  roleId: z.string().optional(),
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
  // Get available roles
  const { data: rolesData, isLoading: isLoadingRoles } = useRolesQuery({});
  const roles = rolesData?.data || [];

  // Initialize analytics tracking
  const { trackUserCreationFunnel, trackError } = useAnalytics();

  // Track funnel start when component mounts for new users
  React.useEffect(() => {
    if (!isEdit) {
      trackUserCreationFunnel('USER_CREATION_STARTED', {
        source: 'admin_panel',
        timestamp: new Date().toISOString()
      });
    }
  }, [isEdit, trackUserCreationFunnel]);

  // Prepare default values with role information
  const preparedDefaultValues = React.useMemo(() => {
    if (!defaultValues) return { isActive: true, status: 'ACTIVE' as const };
    
    return {
      isActive: true,
      status: 'ACTIVE' as const,
      ...defaultValues,
      // Extract roleId from primaryRole if available
      roleId: defaultValues.roleId || (defaultValues as any)?.primaryRole?.id || '',
    };
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: preparedDefaultValues,
  });

  // Watch form values to track form filling progress
  const watchedValues = watch();

  // Track form filling progress
  React.useEffect(() => {
    if (!isEdit) {
      const filledFields = Object.entries(watchedValues).filter(([key, value]) => {
        if (key === 'isActive' || key === 'status') return true; // Default values
        return value && value !== '';
      }).length;

      if (filledFields >= 2) { // At least email and password
        trackUserCreationFunnel('USER_FORM_FILLED', {
          filledFields,
          totalFields: Object.keys(watchedValues).length,
          completionPercentage: Math.round((filledFields / Object.keys(watchedValues).length) * 100)
        });
      }
    }
  }, [watchedValues, isEdit, trackUserCreationFunnel]);

  const handleFormSubmit = (data: UserFormData) => {
    try {
      // Clean up empty strings for optional fields
      const cleanedData = {
        ...data,
        name: data.name?.trim() || undefined,
        firstName: data.firstName?.trim() || undefined,
        lastName: data.lastName?.trim() || undefined,
        username: data.username?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        country: data.country?.trim() || undefined,
        address: data.address?.trim() || undefined,
        avatarUrl: data.avatarUrl?.trim() || undefined,
        roleId: data.roleId?.trim() || undefined,
      };

      // Track form submission attempt
      if (!isEdit) {
        trackUserCreationFunnel('USER_FORM_FILLED', {
          submissionData: {
            hasEmail: !!cleanedData.email,
            hasPassword: !!cleanedData.password,
            hasRole: !!cleanedData.roleId,
            hasPersonalInfo: !!(cleanedData.firstName || cleanedData.lastName || cleanedData.name),
            hasContactInfo: !!(cleanedData.phone || cleanedData.country || cleanedData.address)
          }
        });
      }

      onSubmit(cleanedData);
    } catch (error) {
      // Track error if form submission fails
      if (!isEdit) {
        trackUserCreationFunnel('USER_CREATION_FAILED', {
          error: error instanceof Error ? error.message : 'Unknown error during form submission',
          formData: Object.keys(data)
        });
        trackError(
          error instanceof Error ? error.message : 'Form submission error',
          'UserForm.handleFormSubmit'
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Instrucciones claras */}
          <Alert severity="info" sx={{ mb: 2 }}>
            {isEdit 
              ? 'Modifica los datos del usuario. Los campos marcados con (*) son obligatorios.'
              : 'Completa la información para crear un nuevo usuario. Los campos marcados con (*) son obligatorios.'
            }
          </Alert>

          {/* Sección: Información de Acceso */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Información de Acceso
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Email Field */}
              <TextField
                label="Email *"
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message || (isEdit ? 'El email no se puede modificar' : 'Dirección de correo electrónico para el acceso')}
                disabled={isLoading || isEdit}
                required={!isEdit}
              />

              {/* Password Field - Only show in create mode */}
              {!isEdit && (
                <TextField
                  label="Contraseña *"
                  type="password"
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message || 'Mínimo 6 caracteres'}
                  disabled={isLoading}
                  required
                />
              )}
            </Box>
          </Box>

          <Divider />

          {/* Sección: Información Personal */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Información Personal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Name Fields */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Nombre"
                  type="text"
                  fullWidth
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                  placeholder="Ej: Juan"
                />
                <TextField
                  label="Apellido"
                  type="text"
                  fullWidth
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                  placeholder="Ej: Pérez"
                />
              </Box>

              {/* Username Field */}
              <TextField
                label="Nombre de Usuario"
                type="text"
                fullWidth
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message || 'Opcional - Se puede usar para el acceso'}
                disabled={isLoading}
                placeholder="Ej: juan.perez"
              />
            </Box>
          </Box>

          <Divider />

          {/* Sección: Información de Contacto */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Información de Contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Contact Fields */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Teléfono"
                  type="tel"
                  fullWidth
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={isLoading}
                  placeholder="Ej: +34 600 123 456"
                />
                <TextField
                  label="País"
                  type="text"
                  fullWidth
                  {...register('country')}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  disabled={isLoading}
                  placeholder="Ej: España"
                />
              </Box>

              {/* Address Field */}
              <TextField
                label="Dirección"
                type="text"
                fullWidth
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                disabled={isLoading}
                placeholder="Ej: Calle Mayor, 123, Madrid"
              />

              {/* Avatar URL Field */}
              <TextField
                label="URL del Avatar"
                type="url"
                fullWidth
                {...register('avatarUrl')}
                error={!!errors.avatarUrl}
                helperText={errors.avatarUrl?.message || 'Opcional - Enlace a imagen de perfil'}
                disabled={isLoading}
                placeholder="https://ejemplo.com/avatar.jpg"
              />
            </Box>
          </Box>

          <Divider />

          {/* Sección: Configuración del Sistema */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Configuración del Sistema
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Role Selection */}
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.roleId}>
                    <InputLabel>Rol del Usuario</InputLabel>
                    <Select
                      {...field}
                      label="Rol del Usuario"
                      disabled={isLoading || isLoadingRoles}
                    >
                      <MenuItem value="">
                        <em>Sin rol asignado</em>
                      </MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name} - {role.description}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.roleId && (
                      <FormHelperText>{errors.roleId.message}</FormHelperText>
                    )}
                    {!errors.roleId && (
                      <FormHelperText>Opcional - Define los permisos del usuario</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Status Selection */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Estado del Usuario</InputLabel>
                    <Select
                      {...field}
                      label="Estado del Usuario"
                      disabled={isLoading}
                    >
                      <MenuItem value="ACTIVE">Activo - Usuario puede acceder normalmente</MenuItem>
                      <MenuItem value="INACTIVE">Inactivo - Usuario no puede acceder</MenuItem>
                      <MenuItem value="SUSPENDED">Suspendido - Acceso temporalmente bloqueado</MenuItem>
                    </Select>
                    {errors.status && (
                      <FormHelperText>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Active Status Switch */}
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
                        color="primary"
                      />
                    }
                    label="Usuario Activo en el Sistema"
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {onClose && (
          <Button 
            onClick={onClose} 
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
          disabled={isLoading || isLoadingRoles}
          sx={{ 
            minWidth: 120,
            fontWeight: 600
          }}
        >
          {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
          {isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
        </Button>
      </DialogActions>
    </form>
  );
}; 