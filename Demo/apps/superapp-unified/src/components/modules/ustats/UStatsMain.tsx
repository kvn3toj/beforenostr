import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import {
  Groups,
  VerifiedUser,
  WorkspacePremium,
} from '@mui/icons-material';

import ElegantStatCard from './components/ElegantStatCard';
import AyniBalanceCard from './components/AyniBalanceCard';
import GrowthElementsCard from './components/GrowthElementsCard';
import CommunityActivityCard from './components/CommunityActivityCard';
import RefinedChartCard from './components/RefinedChartCard';
import ActivityChart from './components/ActivityChart';
import PieChart from './components/PieChart';

const mockActivityData = [
  { time: '08:00', searches: 70, conversions: 5, users: 120 },
  { time: '09:00', searches: 85, conversions: 8, users: 150 },
  { time: '10:00', searches: 110, conversions: 12, users: 200 },
];

const mockPieData = [
  { name: 'Gamificación', value: 400 },
  { name: 'Filosofía', value: 300 },
  { name: 'Tecnología', value: 300 },
  { name: 'Comunidad', value: 200 },
];

const UStatsMain: React.FC = () => {
    return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Tu Progreso en CoomÜnity
              </Typography>
          <Typography sx={{ color: '#475569' }}>
            Un análisis detallado de tu viaje de aprendizaje y contribución.
            </Typography>
          </Box>

        {/* Contenedor Principal de Métricas */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: '24px',
            background: '#ffffff',
            borderColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <Grid container spacing={{ xs: 2, md: 3 }}>

            {/* Columna Izquierda */}
            <Grid item xs={12} md={5}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                  <AyniBalanceCard balance={85} />
        </Grid>
                <Grid item xs={12}>
                  <ElegantStatCard
                    title="Mëritos"
                    value="1,250"
                    subtitle="Colaborador Equilibrado"
                    icon={<WorkspacePremium />}
                    iconColor="warning"
                    bgColor="#fffbeb"
          />
        </Grid>
      </Grid>
            </Grid>

            {/* Columna Derecha */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6}>
                   <ElegantStatCard
                    title="Conexiones"
                    value="42"
                    subtitle="+150 activas"
                    icon={<Groups />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ElegantStatCard
                    title="Confianza"
                    value="4.5"
                    rating={4.5}
                    icon={<VerifiedUser />}
                  />
        </Grid>
                <Grid item xs={12}>
                  <GrowthElementsCard />
        </Grid>
      </Grid>
        </Grid>

            {/* Fila Inferior */}
            <Grid item xs={12}>
              <CommunityActivityCard onlineMembers={24} todayInteractions={120} />
      </Grid>

            {/* Fila de Gráficos Adicionales */}
            <Grid item xs={12} lg={7}>
              <RefinedChartCard title="Actividad Reciente">
                <Box sx={{ height: 300 }}>
                  <ActivityChart data={mockActivityData} />
    </Box>
              </RefinedChartCard>
            </Grid>
            <Grid item xs={12} lg={5}>
              <RefinedChartCard title="Distribución de Contenido">
                 <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart data={mockPieData} />
                      </Box>
              </RefinedChartCard>
            </Grid>

      </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default UStatsMain;
