import React, { useState } from 'react';
import { Box, Container, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { RateLimiter } from '../utils/security';

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
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
      console.log('🔐 Attempting login with:', { email: data.email });
      
      // Simulate API call - replace with actual authentication logic
      const response = await simulateLoginAPI(data);
      
      if (response.success) {
        // Store authentication token (replace with actual token handling)
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        setSuccessMessage('¡Login exitoso! Bienvenido a CoomÜnity');
        
        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
        
      } else {
        setError(response.message || 'Error de autenticación');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate login API - replace with actual API integration
  const simulateLoginAPI = async (data: LoginFormData): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
  }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    const validCredentials = [
      { email: 'test@coomunity.com', password: 'test123' },
      { email: 'admin@coomunity.com', password: 'admin123' },
      { email: 'user@coomunity.com', password: 'user123' }
    ];

    const isValid = validCredentials.some(
      cred => cred.email === data.email && cred.password === data.password
    );

    if (isValid) {
      return {
        success: true,
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          name: 'Usuario CoomÜnity',
          email: data.email,
          avatar: null
        }
      };
    } else {
      return {
        success: false,
        message: 'Credenciales inválidas. Verifica tu email y contraseña.'
      };
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