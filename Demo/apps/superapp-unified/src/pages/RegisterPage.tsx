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

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, register, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('[RegisterPage] Usuario autenticado, redirigiendo a /')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones básicas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      console.log('[RegisterPage] Intentando registrar usuario con:', { email, name })
      
      await register({ 
        email, 
        password, 
        name: name.trim() || undefined 
      })

      console.log('[RegisterPage] Registro exitoso')
      toast.success('Registro exitoso. ¡Bienvenido!')
      
      // La navegación se manejará automáticamente por el useEffect
      
    } catch (error) {
      console.error('[RegisterPage] Error de registro:', error)
      
      let errorMessage = 'Error al registrar usuario'
      
      if (error instanceof Error) {
        // Personalizar mensajes de error comunes
        if (error.message.includes('El email ya está registrado') || error.message.includes('already exists')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'El formato del email no es válido.'
        } else if (error.message.includes('Password')) {
          errorMessage = 'La contraseña no cumple con los requisitos mínimos.'
        } else if (error.message.includes('400')) {
          errorMessage = 'Datos inválidos. Verifica la información ingresada.'
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
          Crear Cuenta
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Nombre (opcional)"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            helperText="Mínimo 6 caracteres"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !email || !password || !confirmPassword}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Iniciar Sesión
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterPage; 