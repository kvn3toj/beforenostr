import React, { useState } from 'react';
import { Box, Container, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { RateLimiter } from '../utils/security';

// Rate limiter for registration attempts
const registrationRateLimiter = new RateLimiter(3, 30 * 60 * 1000); // 3 attempts per 30 minutes

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async (data: RegisterFormData): Promise<void> => {
    // Check rate limiting
    if (!registrationRateLimiter.isAllowed(data.email)) {
      const remainingAttempts = registrationRateLimiter.getRemainingAttempts(data.email);
      const nextReset = registrationRateLimiter.getNextResetTime(data.email);
      
      setError(
        `Demasiados intentos de registro. Intentos restantes: ${remainingAttempts}. 
         Próximo reinicio: ${nextReset?.toLocaleTimeString() || 'N/A'}`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📝 Attempting registration with:', { 
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      });
      
      // Simulate API call - replace with actual registration logic
      const response = await simulateRegistrationAPI(data);
      
      if (response.success) {
        setSuccess(true);
        setSuccessMessage('¡Registro exitoso! Revisa tu email para activar tu cuenta.');
        
        // Show success message for a bit longer since user needs to check email
        console.log('✅ Registration successful for:', data.email);
        
      } else {
        setError(response.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate registration API - replace with actual API integration
  const simulateRegistrationAPI = async (data: RegisterFormData): Promise<{
    success: boolean;
    userId?: string;
    message?: string;
  }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock registration validation
    const existingEmails = [
      'admin@coomunity.com',
      'test@coomunity.com'
    ];

    if (existingEmails.includes(data.email)) {
      return {
        success: false,
        message: 'Este email ya está registrado. Intenta con otro email o inicia sesión.'
      };
    }

    // Mock phone validation
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < 10) {
      return {
        success: false,
        message: 'El número de teléfono parece ser inválido.'
      };
    }

    // Simulate successful registration
    return {
      success: true,
      userId: 'user_' + Date.now(),
      message: 'Registro exitoso. Revisa tu email para activar tu cuenta.'
    };
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
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

export default RegisterPage; 