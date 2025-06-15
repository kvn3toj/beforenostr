import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
  },
})

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        CoomÜnity Gamifier Admin
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
        Panel de Administración - Puerto 3000
      </Typography>
      
      <Box sx={{ mt: 4, display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Usuarios</Typography>
          <Typography color="text.secondary">Gestión de jugadores y roles</Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Contenido</Typography>
          <Typography color="text.secondary">Videos y experiencias ÜPlay</Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Marketplace</Typography>
          <Typography color="text.secondary">Productos y servicios</Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Analytics</Typography>
          <Typography color="text.secondary">Métricas y estadísticas</Typography>
        </Paper>
      </Box>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body1">
          Ecosistema CoomÜnity - Backend: 3002 | Admin: 3000 | SuperApp: 3001
        </Typography>
      </Box>
    </Container>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  )
}

export default App