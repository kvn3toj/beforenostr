import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  Link
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person, 
  PersonAdd,
  Phone,
  CheckCircle 
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema con mejores prácticas de seguridad
const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido')
    .max(254, 'El email es demasiado largo'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[+]?[1-9][\d\s\-()]{7,15}$/, 'Por favor ingresa un número de teléfono válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: Omit<RegisterFormData, 'confirmPassword' | 'acceptTerms'>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
  success = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const password = watch('password');

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, acceptTerms, ...submitData } = data;
      await onSubmit(submitData);
    } catch (error) {
      console.error('Register form submission error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'error.main', text: 'Débil' };
    if (password.length < 8) return { strength: 'medium', color: 'warning.main', text: 'Media' };
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 'medium', color: 'warning.main', text: 'Media' };
    return { strength: 'strong', color: 'success.main', text: 'Fuerte' };
  };

  const passwordStrength = getPasswordStrength(password);

  if (success) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 500, 
          mx: 'auto',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="success.main">
          ¡Registro Exitoso!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Tu cuenta ha sido creada exitosamente. Revisa tu email para activar tu cuenta.
        </Typography>
        <Button 
          variant="contained" 
          color="success"
          onClick={() => window.location.href = '/login'}
          data-testid="goto-login-button"
        >
          Ir a Iniciar Sesión
        </Button>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        maxWidth: 500, 
        mx: 'auto',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,248,255,0.95))',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <PersonAdd 
          sx={{ 
            fontSize: 48, 
            color: 'primary.main', 
            mb: 1,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            borderRadius: '50%',
            p: 1
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Crear Cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Únete a la comunidad CoomÜnity
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          data-testid="register-error-alert"
        >
          {error}
        </Alert>
      )}

      {/* Registration Form */}
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Name Fields Row */}
        <Box display="flex" gap={2} mb={2}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nombre"
                variant="outlined"
                required
                autoComplete="given-name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={isLoading}
                data-testid="register-firstname-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.firstName ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Apellido"
                variant="outlined"
                required
                autoComplete="family-name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={isLoading}
                data-testid="register-lastname-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.lastName ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* Email Field */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Correo Electrónico"
              type="email"
              variant="outlined"
              margin="normal"
              required
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              data-testid="register-email-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color={errors.email ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* Phone Field */}
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Número de Teléfono"
              type="tel"
              variant="outlined"
              margin="normal"
              required
              autoComplete="tel"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              disabled={isLoading}
              data-testid="register-phone-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color={errors.phone ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              data-testid="register-password-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color={errors.password ? "error" : "action"} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                      data-testid="toggle-password-visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* Password Strength Indicator */}
        {password && (
          <Box mt={1} mb={2}>
            <Typography variant="caption" color={passwordStrength.color}>
              Fortaleza de contraseña: {passwordStrength.text}
            </Typography>
          </Box>
        )}

        {/* Confirm Password Field */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Confirmar Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
              data-testid="register-confirm-password-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color={errors.confirmPassword ? "error" : "action"} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                      data-testid="toggle-confirm-password-visibility"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* Terms and Conditions */}
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  disabled={isLoading}
                  data-testid="accept-terms-checkbox"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{' '}
                  <Link href="/terms" target="_blank" color="primary">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="/privacy" target="_blank" color="primary">
                    política de privacidad
                  </Link>
                </Typography>
              }
              sx={{ mt: 2, mb: 1 }}
            />
          )}
        />

        {errors.acceptTerms && (
          <Typography variant="caption" color="error" display="block" mb={2}>
            {errors.acceptTerms.message}
          </Typography>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!isValid || isLoading}
          data-testid="register-submit-button"
          sx={{
            mt: 2,
            mb: 2,
            py: 1.5,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #2196f3)',
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600
          }}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PersonAdd />
            )
          }
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>

        {/* Form State Debug Info (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="caption" display="block">
              Debug Info (Dev only):
            </Typography>
            <Typography variant="caption" display="block">
              Valid: {isValid ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="caption" display="block">
              Errors: {Object.keys(errors).join(', ') || 'None'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer Links */}
      <Box textAlign="center" mt={3}>
        <Typography variant="body2" color="text.secondary">
          ¿Ya tienes una cuenta?{' '}
          <Button 
            variant="text" 
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              color: 'primary.main'
            }}
            data-testid="login-link"
            onClick={() => window.location.href = '/login'}
          >
            Inicia sesión aquí
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
};

export default RegisterForm;