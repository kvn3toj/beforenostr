import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import { Public, School, Brush } from '@mui/icons-material';
import { useMundos, useMundosTest, useBackendHealth } from '../hooks/useRealBackendData';

// 🎨 Iconos para diferentes tipos de mundos
const getMundoIcon = (name: string) => {
  if (name.toLowerCase().includes('programación') || name.toLowerCase().includes('tecnología')) {
    return <School color="primary" sx={{ fontSize: 40 }} />;
  }
  if (name.toLowerCase().includes('diseño')) {
    return <Brush color="secondary" sx={{ fontSize: 40 }} />;
  }
  return <Public color="action" sx={{ fontSize: 40 }} />;
};

// 🏷️ Tipos de datos
interface Mundo {
  id: string;
  name: string;
  description: string;
}

export const Mundos: React.FC = () => {
  // 🔗 Conectar con el backend real
  const backendHealth = useBackendHealth();
  const mundosTest = useMundosTest();
  const { data: mundos, isLoading, isError, error, refetch } = useMundos();

  // 🎯 Estados de carga y error
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" py={8}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Cargando mundos desde el backend...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        >
          Error al cargar mundos: {error?.message || 'Error desconocido'}
        </Alert>
        
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No se pudieron cargar los mundos del backend
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          🌍 Mundos CoomÜnity
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Explora diferentes mundos de aprendizaje y experiencias gamificadas
        </Typography>
        
        {/* Estado del backend */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip 
            label={backendHealth.isAvailable ? "Backend: Conectado" : "Backend: Desconectado"}
            color={backendHealth.isAvailable ? "success" : "error"}
            size="small"
          />
          <Chip 
            label={mundosTest.data ? "Servicio Mundos: OK" : "Servicio Mundos: Error"}
            color={mundosTest.data ? "success" : "warning"}
            size="small"
          />
          {mundos && (
            <Chip 
              label={`${mundos.length} Mundos Disponibles`}
              color="info"
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* Lista de Mundos */}
      {mundos && mundos.length > 0 ? (
        <Grid container spacing={3}>
          {mundos.map((mundo: Mundo) => (
            <Grid item xs={12} md={6} lg={4} key={mundo.id}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Icono y título */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getMundoIcon(mundo.name)}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {mundo.name}
                      </Typography>
                      <Chip 
                        label={`ID: ${mundo.id}`}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  {/* Descripción */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, flex: 1 }}
                  >
                    {mundo.description}
                  </Typography>

                  {/* Botón de acción */}
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => {
                        console.log(`Navegando al mundo ${mundo.id}: ${mundo.name}`);
                        // TODO: Navegar al detalle del mundo
                      }}
                    >
                      Explorar Mundo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <Public sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay mundos disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Los mundos se cargarán cuando estén disponibles en el backend
          </Typography>
        </Box>
      )}

      {/* Información de debug en desarrollo */}
      {import.meta.env.DEV && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Debug Info:</strong><br/>
            Backend URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'}<br/>
            Mundos cargados: {mundos?.length || 0}<br/>
            Test endpoint: {mundosTest.data?.message || 'No data'}<br/>
            Health status: {backendHealth.isAvailable ? 'OK' : 'Error'}
          </Typography>
        </Box>
      )}
    </Container>
  );
}; 