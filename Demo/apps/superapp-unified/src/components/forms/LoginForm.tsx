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
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Login as LoginIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema siguiendo mejores prácticas de seguridad
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido')
    .max(254, 'El email es demasiado largo'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(128, 'La contraseña es demasiado larga')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Login form submission error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        maxWidth: 400, 
        mx: 'auto',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,248,255,0.95))',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <LoginIcon 
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
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Accede a tu cuenta CoomÜnity
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          data-testid="login-error-alert"
        >
          {error}
        </Alert>
      )}

      {/* Login Form */}
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
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
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              data-testid="login-email-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color={errors.email ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  }
                }
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
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              data-testid="login-password-input"
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  }
                }
              }}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!isValid || isLoading}
          data-testid="login-submit-button"
          sx={{
            mt: 3,
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
              <LoginIcon />
            )
          }
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
              Touched: {Object.keys(touchedFields).join(', ') || 'None'}
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
          ¿No tienes una cuenta?{' '}
          <Button 
            variant="text" 
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              color: 'primary.main'
            }}
            data-testid="register-link"
          >
            Regístrate aquí
          </Button>
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          <Button 
            variant="text" 
            size="small"
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary'
            }}
            data-testid="forgot-password-link"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoginForm;