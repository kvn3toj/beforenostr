import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) {
      return 'El nombre completo es requerido';
    }
    
    if (!formData.email.trim()) {
      return 'El email es requerido';
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'El email no tiene un formato válido';
    }
    
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      navigate('/');
    } catch (err: any) {
      // Manejar errores específicos del backend
      const errorMessage = err.message || 'Error al crear la cuenta';
      
      if (errorMessage.includes('ya está registrado')) {
        setError('Este email ya está registrado. ¿Quieres iniciar sesión en su lugar?');
      } else if (errorMessage.includes('conexión')) {
        setError('No se pudo conectar al servidor. Verifica tu conexión a internet.');
      } else if (errorMessage.includes('timeout')) {
        setError('El servidor tardó demasiado en responder. Intenta nuevamente.');
      } else if (errorMessage.includes('formato')) {
        setError('Alguno de los datos no tiene el formato correcto.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CoomÜnity
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Únete a la SuperApp
              </Typography>
            </Box>

            {/* Loading indicator for registration */}
            {loading && (
              <LoadingSpinner
                variant="linear"
                message="Creando tu cuenta..."
                data-testid="register-loading"
              />
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                data-testid="register-error"
              >
                {error}
                {error.includes('ya está registrado') && (
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      onClick={() => navigate('/login')}
                      sx={{ textTransform: 'none' }}
                    >
                      Ir al Login
                    </Button>
                  </Box>
                )}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="Nombre completo"
                name="fullName"
                autoComplete="name"
                autoFocus
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading || isSubmitting}
                error={error.includes('nombre')}
                data-testid="register-fullname-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || isSubmitting}
                error={error.includes('email') || error.includes('Email')}
                data-testid="register-email-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading || isSubmitting}
                error={error.includes('contraseña')}
                helperText="Mínimo 6 caracteres"
                data-testid="register-password-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading || isSubmitting}
                error={error.includes('coinciden')}
                data-testid="register-confirm-password-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting || loading}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
                data-testid="register-submit-button"
              >
                {(isSubmitting || loading) ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    {loading ? 'Configurando...' : 'Creando cuenta...'}
                  </Box>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ textDecoration: 'none' }}
                  disabled={loading || isSubmitting}
                  data-testid="register-login-link"
                >
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </Link>
              </Box>
            </Box>

            {/* Información de desarrollo */}
            {import.meta.env.DEV && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Desarrollo:</strong><br/>
                  Backend: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}<br/>
                  Authentication: Real backend only
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register; 