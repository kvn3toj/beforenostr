import React, { useState } from 'react';
import { Box, Container, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
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
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
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