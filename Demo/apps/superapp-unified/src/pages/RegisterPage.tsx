import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, signUp, loading: authLoading } = useAuth()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

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

      await signUp(email, password, name)

      console.log('[RegisterPage] Registro exitoso')
      toast.success('¡Registro exitoso! Bienvenido a CoomÜnity')

      // No necesitamos navegar manualmente, el useEffect lo hará cuando isAuthenticated cambie
    } catch (error: any) {
      console.error('[RegisterPage] Error en registro:', error)
      setError(error.message || 'Error al registrar usuario')
      toast.error('Error al registrar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
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
          <CircularProgress />
        </Box>
      </Container>
    )
  }

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
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
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
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Únete a la SuperApp
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre completo"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Confirmar contraseña"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5b5ff1 30%, #8553f6 90%)',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterPage;
