import React from 'react';
import { Grid, Paper, Typography, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RevolutionaryMetricCard from '../../components/Cards/RevolutionaryMetricCard';
import ReciprocidadMetricsCard from '../../components/Metrics/ReciprocidadMetricsCard';
import { useReciprocidad } from '../../hooks/useReciprocidad';
import { useMeritos } from '../../hooks/useMeritos';

const mockReciprocidadData = {
  balanceReciprocidad: 1200,
  nivelReciprocidad: 'Guardián Cósmico',
  historialTransacciones: [
    { id: 1, tipo: 'dado', monto: 50, concepto: 'Colaboración en Proyecto X' },
    { id: 2, tipo: 'recibido', monto: 100, concepto: 'Mentoría en React' },
    { id: 3, tipo: 'dado', monto: 25, concepto: 'Ayuda en diseño de UI' },
  ],
};

const HomeRenovated = () => {
  const { data: reciprocidadData, isLoading: isLoadingReciprocidad } = useReciprocidad();
  const { data: meritosData, isLoading: isLoadingMeritos } = useMeritos();

  const metrics = {
    meritos: meritosData?.totalMeritos || 75,
    luks: meritosData?.balanceLuks || 500,
    reciprocidad: reciprocidadData?.balanceReciprocidad || mockReciprocidadData.balanceReciprocidad,
    racha: 5, // Placeholder
  };

  return (
    <Grid container spacing={3}>
      {/* Metrics Cards */}
      <Grid item xs={6} sm={3}>
        <RevolutionaryMetricCard title="Méritos" value={metrics.meritos} isLoading={isLoadingMeritos} />
      </Grid>
      <Grid item xs={6} sm={3}>
        <RevolutionaryMetricCard title="Luks" value={metrics.luks} isLoading={isLoadingMeritos} />
      </Grid>
      <Grid item xs={6} sm={3}>
        <RevolutionaryMetricCard title="Reciprocidad" value={metrics.reciprocidad} isLoading={isLoadingReciprocidad} />
      </Grid>
      <Grid item xs={6} sm={3}>
        <RevolutionaryMetricCard title="Racha" value={metrics.racha} />
      </Grid>

      {/* Main Content Sections */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Próxima Lección: El Arte de la Escucha Activa
          </Typography>
          <Typography>
            Continúa tu viaje de aprendizaje y descubre cómo la escucha puede transformar tus relaciones y tu impacto en la comunidad.
          </Typography>
          <Button component={Link} to="/uplay" variant="contained" sx={{ mt: 2 }}>
            Ir a ÜPlay
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
           <Typography variant="h6" gutterBottom>
              Métricas de Reciprocidad
            </Typography>
            <ReciprocidadMetricsCard
              balanceReciprocidad={reciprocidadData?.balanceReciprocidad ?? mockReciprocidadData.balanceReciprocidad}
              nivelReciprocidad={reciprocidadData?.nivelReciprocidad ?? mockReciprocidadData.nivelReciprocidad}
              historialTransacciones={reciprocidadData?.historialTransacciones ?? mockReciprocidadData.historialTransacciones}
              isLoading={isLoadingReciprocidad}
            />
        </Paper>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Acciones Rápidas</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item>
                <Button component={Link} to="/marketplace" variant="outlined">
                  Explorar Mercado GMP
                </Button>
              </Grid>
              <Grid item>
                <Button component={Link} to="/social" variant="outlined">
                  Conectar con la Tribu
                </Button>
              </Grid>
              <Grid item>
                <Button component={Link} to="/challenges" variant="outlined">
                  Ver Desafíos
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomeRenovated;
