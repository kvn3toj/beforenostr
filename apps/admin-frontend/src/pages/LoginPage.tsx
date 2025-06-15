import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

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
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
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
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                Crear Cuenta
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
} 