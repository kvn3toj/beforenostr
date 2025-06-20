import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  Grid,
  Stack,
  Paper
} from '@mui/material'
import {
  AccountCircle,
  Lock,
  CheckCircle,
  Warning,
  CloudDone,
  Storage
} from '@mui/icons-material'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { getSupabaseConfig } from '../lib/supabase'

export const SupabaseTest: React.FC = () => {
  const {
    user,
    session,
    loading,
    configured,
    signIn,
    signUp,
    signOut
  } = useSupabaseAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const config = getSupabaseConfig()

  const handleSignIn = async () => {
    try {
      const { data, error } = await signIn(email, password)
      if (error) {
        setMessage(`Login Error: ${error.message}`)
        setIsError(true)
      } else {
        setMessage('Login successful!')
        setIsError(false)
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`)
      setIsError(true)
    }
  }

  const handleSignUp = async () => {
    try {
      const { data, error } = await signUp(email, password)
      if (error) {
        setMessage(`Register Error: ${error.message}`)
        setIsError(true)
      } else {
        setMessage('Registration successful! Check your email.')
        setIsError(false)
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`)
      setIsError(true)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        setMessage(`Logout Error: ${error.message}`)
        setIsError(true)
      } else {
        setMessage('Logged out successfully!')
        setIsError(false)
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`)
      setIsError(true)
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        🗄️ Supabase Integration Test
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
        Testing Supabase connection and authentication for CoomÜnity SuperApp
      </Typography>

      {/* Configuration Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Configuration Status
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Chip
                icon={configured ? <CheckCircle /> : <Warning />}
                label={configured ? 'Configured' : 'Needs Setup'}
                color={configured ? 'success' : 'warning'}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Chip
                icon={<Storage />}
                label={`URL: ${config.url.split('.')[0]}...`}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              URL: {config.url}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Key: {config.anonKey ? `${config.anonKey.substring(0, 20)}...` : 'Not configured'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Authentication Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔐 Authentication Status
          </Typography>

          {user ? (
            <Stack spacing={2}>
              <Alert severity="success" icon={<CheckCircle />}>
                <Typography variant="body1">
                  Authenticated as: {user.email}
                </Typography>
                <Typography variant="body2">
                  User ID: {user.id}
                </Typography>
                <Typography variant="body2">
                  Created: {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </Alert>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSignOut}
                disabled={loading}
              >
                Sign Out
              </Button>
            </Stack>
          ) : (
            <Alert severity="info" icon={<AccountCircle />}>
              Not authenticated - please sign in below
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Authentication Form */}
      {!user && configured && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔑 Authentication Test
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSignIn}
                    disabled={!email || !password || loading}
                  >
                    Sign In
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleSignUp}
                    disabled={!email || !password || loading}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Configuration Setup */}
      {!configured && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="warning.main">
              ⚙️ Setup Required
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              To use Supabase, add these environment variables:
            </Typography>

            <Paper sx={{ p: 2, bgcolor: 'grey.100', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              VITE_SUPABASE_URL=your_supabase_url<br/>
              VITE_SUPABASE_ANON_KEY=your_anon_key
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Session Information */}
      {session && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 Session Details
            </Typography>

            <Typography variant="body2" component="pre" sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.75rem'
            }}>
              {JSON.stringify(session, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      {message && (
        <Alert
          severity={isError ? 'error' : 'success'}
          sx={{ mb: 2 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default SupabaseTest
