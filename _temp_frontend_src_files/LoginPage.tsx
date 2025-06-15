import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import { CoomUnityLogo } from '../components/common/Logo/CoomUnityLogo'
// Importar componentes del Design System
import { Button, TextField } from '../components/design-system'
import { colors, spacing } from '../components/design-system'
import { skipLinkFocusStyles, hiddenSkipLinkStyles } from '../utils/accessibility/focus-styles'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('[LoginPage] Usuario autenticado, redirigiendo a /')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log('[LoginPage] Intentando iniciar sesión con:', { email })
      
      await login({ email, password })

      console.log('[LoginPage] Inicio de sesión exitoso')
      toast.success('Inicio de sesión exitoso')
      
      // La navegación se manejará automáticamente por el useEffect
      
    } catch (error) {
      console.error('[LoginPage] Error de inicio de sesión:', error)
      
      let errorMessage = 'Error al iniciar sesión'
      
      if (error instanceof Error) {
        // Personalizar mensajes de error comunes
        if (error.message.includes('Credenciales inválidas') || error.message.includes('Invalid')) {
          errorMessage = 'Credenciales inválidas. Por favor verifica tu email y contraseña.'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email no confirmado. Por favor verifica tu bandeja de entrada.'
        } else if (error.message.includes('401')) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Error del servidor. Por favor intenta más tarde.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading mientras se inicializa la autenticación
  if (authLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Verificando autenticación...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <>
      {/* Skip Link para Accesibilidad */}
      <Box
        component="a"
        href="#login-form"
        sx={{
          ...hiddenSkipLinkStyles,
          backgroundColor: colors.accessibility.skipLinkBackground,
          color: colors.accessibility.skipLink,
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 600,
          border: `2px solid ${colors.accessibility.focusRing}`,
          ...skipLinkFocusStyles,
        }}
      >
        Saltar al formulario de inicio de sesión
      </Box>

      <Container maxWidth="sm" component="main" role="main">
        <Box
          component="section"
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: colors.background.paper,
            borderRadius: `${spacing.md}px`,
            padding: `${spacing['2xl']}px`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
          }}
          aria-labelledby="login-heading"
        >
          {/* Logo de CoomÜnity Gamifier */}
          <Box sx={{ mb: 4 }}>
            <CoomUnityLogo 
              size="large" 
              variant="full" 
              clickable={false}
              color={colors.text.primary}
            />
          </Box>

          <Typography 
            id="login-heading"
            component="h1" 
            variant="h4" 
            gutterBottom
            sx={{ 
              color: colors.text.primary,
              fontWeight: 600,
              marginBottom: spacing.lg
            }}
          >
            Iniciar Sesión
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: spacing.md }}
              role="alert"
              aria-live="polite"
            >
              {error}
            </Alert>
          )}

          <Box 
            id="login-form"
            component="form" 
            onSubmit={handleLogin} 
            noValidate
            sx={{ 
              mt: spacing.sm, 
              width: '100%',
              '& > *': {
                marginBottom: `${spacing.lg}px !important`,
              }
            }}
            aria-label="Formulario de inicio de sesión"
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="Ingresa tu correo electrónico"
              size="large"
              aria-describedby="email-help"
              error={!!error && error.includes('email')}
            />
            
            <TextField
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Ingresa tu contraseña"
              showPasswordToggle
              size="large"
              aria-describedby="password-help"
              error={!!error && error.includes('contraseña')}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="primary"
              size="large"
              disabled={isLoading || !email || !password}
              loading={isLoading}
              sx={{ mt: spacing.xl }}
              aria-describedby={isLoading ? "loading-message" : undefined}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            
            {isLoading && (
              <Typography 
                id="loading-message"
                variant="body2"
                sx={{ 
                  color: colors.text.secondary,
                  textAlign: 'center',
                  mt: spacing.sm
                }}
                aria-live="polite"
              >
                Por favor espera mientras procesamos tu solicitud...
              </Typography>
            )}
            
            <Box sx={{ textAlign: 'center', mt: spacing.lg }}>
              <Typography 
                variant="body2"
                sx={{ 
                  color: colors.text.secondary,
                  fontSize: '0.875rem'
                }}
              >
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    color: colors.primary.main,
                    fontWeight: 500
                  }}
                  aria-label="Ir a la página de registro para crear una nueva cuenta"
                >
                  Crear Cuenta
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
} 