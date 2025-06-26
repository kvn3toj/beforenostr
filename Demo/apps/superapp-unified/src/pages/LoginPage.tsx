import React, { useState } from 'react';
import { Box, Container, Alert, Snackbar, TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// ❌ REMOVIDO: import LoginForm from '../components/forms/LoginForm' (archivo vacío)
import { RateLimiter } from '../utils/security';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

  const handleLogin = async (data: LoginFormData): Promise<void> => {
    // Check rate limiting
    if (!loginRateLimiter.isAllowed(data.email)) {
      const remainingAttempts = loginRateLimiter.getRemainingAttempts(data.email);
      const nextReset = loginRateLimiter.getNextResetTime(data.email);

      setError(
        `Demasiados intentos de login. Intentos restantes: ${remainingAttempts}.
         Próximo reinicio: ${nextReset?.toLocaleTimeString() || 'N/A'}`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting login with real backend:', { email: data.email });

      // ✅ Usar el AuthContext que maneja la conexión real con el backend
      await signIn(data.email, data.password);

      setSuccessMessage('¡Login exitoso! Bienvenido a CoomÜnity');

      // Redirect to home page after short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);

    } catch (error: any) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Error de autenticación. Por favor intenta nuevamente.');

      // Record failed attempt for rate limiting
      loginRateLimiter.recordAttempt(data.email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Iniciar Sesión
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              data-testid="login-email-input"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              data-testid="login-password-input"
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, position: 'relative', zIndex: 1 }}
              disabled={isLoading}
              data-testid="login-submit-button"
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
