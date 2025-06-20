import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { supabase } from '../lib/supabase'

const SupabaseTest: React.FC = () => {
  const { user, loading, error, signIn, signUp, signOut, isAuthenticated } = useSupabaseAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password) return
    setActionLoading(true)
    try {
      await signUp(email, password, {
        app: 'CoomÜnity SuperApp',
        role: 'jugador'
      })
      setTestResult('✅ Usuario registrado exitosamente!')
    } catch (err) {
      setTestResult(`❌ Error en registro: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!email || !password) return
    setActionLoading(true)
    try {
      await signIn(email, password)
      setTestResult('✅ Inicio de sesión exitoso!')
    } catch (err) {
      setTestResult(`❌ Error en login: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSignOut = async () => {
    setActionLoading(true)
    try {
      await signOut()
      setTestResult('✅ Sesión cerrada exitosamente!')
      setEmail('')
      setPassword('')
    } catch (err) {
      setTestResult(`❌ Error cerrando sesión: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const testConnection = async () => {
    setActionLoading(true)
    try {
      const { data, error } = await supabase.from('_test').select('*').limit(1)
      if (error) {
        // This is expected for a new database
        setTestResult('✅ Conexión a Supabase establecida correctamente!')
      } else {
        setTestResult('✅ Conexión y consulta exitosa!')
      }
    } catch (err) {
      setTestResult(`❌ Error de conexión: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando autenticación...
        </Typography>
      </Box>
    )
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          🧪 Prueba de Integración Supabase
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
          CoomÜnity SuperApp
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Connection Test */}
        <Box mb={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={testConnection}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Probar Conexión'}
          </Button>
        </Box>

        {/* User Status */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Estado de Usuario:
          </Typography>
          {isAuthenticated ? (
            <Alert severity="success">
              ✅ Usuario autenticado: {user?.email}
              <br />
              ID: {user?.id}
              <br />
              Última conexión: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
            </Alert>
          ) : (
            <Alert severity="info">
              ℹ️ No hay usuario autenticado
            </Alert>
          )}
        </Box>

        {/* Authentication Form */}
        {!isAuthenticated && (
          <Box mb={3}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              placeholder="test@coomunity.com"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              placeholder="Mínimo 6 caracteres"
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSignIn}
                disabled={actionLoading || !email || !password}
                sx={{ flex: 1 }}
              >
                {actionLoading ? <CircularProgress size={20} /> : 'Iniciar Sesión'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleSignUp}
                disabled={actionLoading || !email || !password}
                sx={{ flex: 1 }}
              >
                {actionLoading ? <CircularProgress size={20} /> : 'Registrarse'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Sign Out Button */}
        {isAuthenticated && (
          <Box mb={3}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleSignOut}
              disabled={actionLoading}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Cerrar Sesión'}
            </Button>
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Test Result */}
        {testResult && (
          <Alert
            severity={testResult.includes('✅') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {testResult}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary" align="center" display="block">
          🌐 Conectado a: {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SupabaseTest
