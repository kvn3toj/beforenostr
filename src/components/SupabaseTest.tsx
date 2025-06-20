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
import useSupabaseAuth from '../hooks/useSupabaseAuth'
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
    setMessage('')
    const { data, error } = await signIn(email, password)

    if (error) {
      setMessage(`Error: ${error.message}`)
      setIsError(true)
    } else {
      setMessage('✅ Sign in successful!')
      setIsError(false)
    }
  }

  const handleSignUp = async () => {
    setMessage('')
    const { data, error } = await signUp(email, password)

    if (error) {
      setMessage(`Error: ${error.message}`)
      setIsError(true)
    } else {
      setMessage('✅ Sign up successful! Check your email for confirmation.')
      setIsError(false)
    }
  }

  const handleSignOut = async () => {
    setMessage('')
    const { error } = await signOut()

    if (error) {
      setMessage(`Error: ${error.message}`)
      setIsError(true)
    } else {
      setMessage('✅ Sign out successful!')
      setIsError(false)
      setEmail('')
      setPassword('')
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        🔗 CoomÜnity + Supabase Integration Test
      </Typography>

      {/* Configuration Status */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
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

        {!configured && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Setup Required:</strong><br/>
              1. Add VITE_SUPABASE_URL to .env<br/>
              2. Add VITE_SUPABASE_ANON_KEY to .env<br/>
              3. Restart the dev server
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Authentication Status */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔐 Authentication Status
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : user ? (
          <Stack spacing={2}>
            <Alert severity="success">
              <strong>Authenticated!</strong><br/>
              Email: {user.email}<br/>
              ID: {user.id.substring(0, 8)}...
            </Alert>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSignOut}
              startIcon={<Lock />}
            >
              Sign Out
            </Button>
          </Stack>
        ) : (
          <Alert severity="info">
            Not authenticated with Supabase
          </Alert>
        )}
      </Paper>

      {/* Authentication Form */}
      {!user && configured && (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔑 Test Authentication
            </Typography>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <AccountCircle sx={{ mr: 1, color: 'action.active' }} />
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
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

      {/* Messages */}
      {message && (
        <Alert
          severity={isError ? 'error' : 'success'}
          sx={{ mt: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      {/* Integration Status */}
      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🚀 Integration Status
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            icon={<CheckCircle />}
            label="@supabase/supabase-js"
            color="success"
            size="small"
          />
          <Chip
            icon={<CheckCircle />}
            label="React Hook"
            color="success"
            size="small"
          />
          <Chip
            icon={<CheckCircle />}
            label="TypeScript"
            color="success"
            size="small"
          />
          <Chip
            icon={<CloudDone />}
            label="Ready for Production"
            color="primary"
            size="small"
          />
        </Stack>
      </Paper>
    </Box>
  )
}

export default SupabaseTest
