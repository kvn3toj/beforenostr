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
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('usuario@coomunity.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      // Manejar errores específicos del backend
      const errorMessage = err.message || 'Error al iniciar sesión';
      
      if (errorMessage.includes('Credenciales incorrectas')) {
        setError('Email o contraseña incorrectos. Verifica tus datos.');
      } else if (errorMessage.includes('conexión')) {
        setError('No se pudo conectar al servidor. Verifica tu conexión a internet.');
      } else if (errorMessage.includes('timeout')) {
        setError('El servidor tardó demasiado en responder. Intenta nuevamente.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = () => {
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
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
                Inicia sesión en tu SuperApp
              </Typography>
            </Box>

            {/* Loading indicator for form submission */}
            {loading && (
              <LoadingSpinner
                variant="linear"
                message="Verificando credenciales..."
                data-testid="login-loading"
              />
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                data-testid="login-error"
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                disabled={loading || isSubmitting}
                data-testid="login-email-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange();
                }}
                disabled={loading || isSubmitting}
                data-testid="login-password-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || isSubmitting}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
                data-testid="login-submit-button"
              >
                {(loading || isSubmitting) ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    {loading ? 'Verificando...' : 'Iniciando sesión...'}
                  </Box>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{ textDecoration: 'none' }}
                  disabled={loading || isSubmitting}
                  data-testid="login-register-link"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </Link>
              </Box>
            </Box>

            {/* Información de desarrollo */}
            {import.meta.env.DEV && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Desarrollo:</strong><br/>
                  Backend: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'}<br/>
                  Mock Auth: {import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true' ? 'Habilitado' : 'Deshabilitado'}<br/>
                  Status: {import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true' ? '🔶 Modo Mock' : '✅ Backend Real NestJS'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}; 