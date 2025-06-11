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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { NetworkErrorDebug } from '../components/debug/NetworkErrorDebug';
import { authAPIDebug } from '../lib/api-service-debug';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('superapp@coomunity.com');
  const [password, setPassword] = useState('superapp123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState<any>(null);
  const [showDebugDialog, setShowDebugDialog] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNetworkError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      // Categorize errors for better handling
      const errorMessage = err.message || 'Error al iniciar sesión';
      const errorCategory = err.category || 'unknown';

      // Handle network/connectivity errors with enhanced debugging
      if (
        errorCategory === 'network' ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('connect') ||
        errorMessage.includes('Cannot connect')
      ) {
        setNetworkError(err);
        setError(
          '🚨 Error de conexión detectado. Haz clic en "Diagnosticar" para obtener ayuda detallada.'
        );

        // Auto-show debug dialog for network errors in development
        if (import.meta.env.DEV) {
          setShowDebugDialog(true);
        }
      } else if (errorCategory === 'timeout') {
        setError(
          '⏰ El servidor tardó demasiado en responder. Verifica tu conexión e intenta nuevamente.'
        );
      } else if (errorCategory === 'cors') {
        setError(
          '🔒 Error de configuración CORS. El backend no permite conexiones desde este origen.'
        );
      } else if (
        errorMessage.includes('Credenciales incorrectas') ||
        errorMessage.includes('401')
      ) {
        setError('❌ Email o contraseña incorrectos. Verifica tus datos.');
      } else if (errorMessage.includes('400')) {
        setError(
          '⚠️ Datos de entrada inválidos. Verifica el formato del email.'
        );
      } else if (errorMessage.includes('500')) {
        setError(
          '🛠️ Error interno del servidor. Intenta nuevamente en unos momentos.'
        );
      } else {
        setError(errorMessage);
      }

      // Enhanced logging for debugging
      console.group('🚨 Login Error Details');
      console.error('Original Error:', err);
      console.error('Message:', errorMessage);
      console.error('Category:', errorCategory);
      console.error('Stack:', err.stack);
      console.error('Troubleshooting:', err.troubleshooting);
      console.error('Timestamp:', new Date().toISOString());
      console.groupEnd();

      // Store error for debugging component
      if (
        errorCategory === 'network' ||
        errorCategory === 'cors' ||
        errorCategory === 'timeout'
      ) {
        setNetworkError(err);
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
    if (networkError) {
      setNetworkError(null);
    }
  };

  const openDiagnosticDialog = () => {
    setShowDebugDialog(true);
  };

  const closeDiagnosticDialog = () => {
    setShowDebugDialog(false);
  };

  const retryLogin = () => {
    setShowDebugDialog(false);
    handleSubmit(new Event('submit') as any);
  };

  // Función para probar login con debugging service
  const testEnhancedLogin = async () => {
    console.log('🧪 Testing enhanced login with diagnostics...');
    setError('');
    setNetworkError(null);
    setIsSubmitting(true);

    try {
      console.group('🧪 Enhanced Login Test');

      // First run diagnostics
      console.log('🔍 Running pre-login diagnostics...');
      const diagnostics = await authAPIDebug.runDiagnostics();

      if (!diagnostics.success) {
        const failedTests = diagnostics.diagnostics
          .filter((d) => !d.success)
          .map((d) => d.step);

        setError(`❌ Diagnostics failed: ${failedTests.join(', ')}`);
        setShowDebugDialog(true);
        console.groupEnd();
        return;
      }

      // Try enhanced login
      console.log('🔐 Attempting enhanced login...');
      const result = await authAPIDebug.login(email, password);

      console.log('✅ Enhanced login successful:', result);
      setError('✅ Enhanced login successful! Check console for details.');
      console.groupEnd();

      // Now try with AuthContext
      setTimeout(() => {
        setError('✅ Enhanced login OK. Now trying with AuthContext...');
        handleSubmit(new Event('submit') as any);
      }, 2000);
    } catch (error: any) {
      console.error('💥 Enhanced login error:', error);
      setNetworkError(error);
      setError(`💥 Enhanced login error: ${error.message}`);
      setShowDebugDialog(true);
      console.groupEnd();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para probar login simple sin ApiService
  const testSimpleLogin = async () => {
    console.log('🧪 Testing simple login...');
    setError('');
    setIsSubmitting(true);

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

      console.group('🧪 Simple Login Test');
      console.log('📍 API URL:', `${API_BASE_URL}/auth/login`);
      console.log('🌍 Origin:', window.location.origin);
      console.log('📧 Email:', email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: window.location.origin,
        },
        mode: 'cors',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log('📊 Response Status:', response.status);
      console.log(
        '📋 Response Headers:',
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Simple login successful:', data);
        setError('✅ Simple login successful! Check console for details.');
        console.groupEnd();

        // Ahora probemos con el AuthContext
        setTimeout(() => {
          setError('✅ Simple login OK. Now trying with AuthContext...');
          handleSubmit(new Event('submit') as any);
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('❌ Simple login failed:', errorData);
        setError(
          `❌ Simple login failed: ${response.status} ${errorData.message}`
        );
        console.groupEnd();
      }
    } catch (error: any) {
      console.error('💥 Simple login error:', error);
      setNetworkError(error);
      setError(`💥 Simple login fetch error: ${error.message}`);
      console.groupEnd();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para ejecutar debug de autenticación
  const runAuthDebug = () => {
    console.log('🔍 Ejecutando debug de autenticación...');

    // Debug inmediato en consola
    const debugAuth = async () => {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

      console.group('🔍 Auth Connection Debug');

      // Test 1: Health Check
      try {
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Backend Health:', healthData);
      } catch (error) {
        console.error('❌ Backend Health Error:', error);
      }

      // Test 2: CORS Preflight
      try {
        const corsResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'OPTIONS',
          headers: {
            Origin: window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
          },
        });
        console.log('✅ CORS Preflight Status:', corsResponse.status);
        console.log(
          '📋 CORS Headers:',
          Object.fromEntries(corsResponse.headers.entries())
        );
      } catch (error) {
        console.error('❌ CORS Preflight Error:', error);
      }

      // Test 3: Login Test
      try {
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: window.location.origin,
          },
                  body: JSON.stringify({
          email: 'superapp@coomunity.com',
          password: 'superapp123',
        }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('✅ Login Test Success:', {
            hasToken: !!loginData.access_token,
            hasUser: !!loginData.user,
            userEmail: loginData.user?.email,
          });
        } else {
          const errorData = await loginResponse.json();
          console.error(
            '❌ Login Test Failed:',
            loginResponse.status,
            errorData
          );
        }
      } catch (error) {
        console.error('❌ Login Test Error:', error);
      }

      console.groupEnd();
    };

    debugAuth();
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
                  background:
                    'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
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
                severity={error.includes('✅') ? 'success' : 'error'}
                sx={{ mb: 2 }}
                data-testid="login-error"
                action={
                  networkError && (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={openDiagnosticDialog}
                      sx={{ fontSize: '0.8rem' }}
                    >
                      🔍 Diagnosticar
                    </Button>
                  )
                }
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
                  fontWeight: 'bold',
                }}
                data-testid="login-submit-button"
              >
                {loading || isSubmitting ? (
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
                  <strong>🔧 Desarrollo:</strong>
                  <br />
                  Backend:{' '}
                  {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'}
                  <br />
                  Mock Auth:{' '}
                  {import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'
                    ? 'Habilitado'
                    : 'Deshabilitado'}
                  <br />
                  Status:{' '}
                  {import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'
                    ? '🔶 Modo Mock'
                    : '✅ Backend Real NestJS'}
                  <br />
                  Origin: {window.location.origin}
                  <br />
                  <strong>📋 Credenciales válidas:</strong>
                  <br />
                  • superapp@coomunity.com / superapp123
                  <br />
                  • Usuario específico para SuperApp CoomÜnity
                  <br />• (Diferentes del Gamifier Admin)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={runAuthDebug}
                    sx={{ fontSize: '0.7rem' }}
                    disabled={loading || isSubmitting}
                  >
                    🔍 Debug Auth
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testSimpleLogin}
                    sx={{ fontSize: '0.7rem' }}
                    disabled={loading || isSubmitting}
                  >
                    🧪 Test Simple
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={testEnhancedLogin}
                    sx={{ fontSize: '0.7rem' }}
                    disabled={loading || isSubmitting}
                  >
                    🔬 Test Enhanced
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={openDiagnosticDialog}
                    sx={{ fontSize: '0.7rem' }}
                    disabled={loading || isSubmitting}
                  >
                    🏥 Diagnostics
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Network Error Debug Dialog */}
      <Dialog
        open={showDebugDialog}
        onClose={closeDiagnosticDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>🔍 Diagnóstico de Error de Red</DialogTitle>
        <DialogContent>
          <NetworkErrorDebug
            error={networkError}
            onRetry={retryLogin}
            onClose={closeDiagnosticDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDiagnosticDialog}>Cerrar</Button>
          <Button
            variant="contained"
            onClick={retryLogin}
            disabled={loading || isSubmitting}
          >
            🔄 Reintentar Login
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
