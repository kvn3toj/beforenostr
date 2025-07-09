import React from 'react';
import { Grid, Box, CircularProgress, Alert, Typography, useTheme, alpha } from '@mui/material';
import { useWalletKpiData } from '../../hooks/metrics/useWalletKpiData';
import { WalletKpiCard } from './WalletKpiCard';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for list items
const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // Staggered animation
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export const WalletMetricsDashboard: React.FC = () => {
  const theme = useTheme();
  const { kpis, isLoading, isFetching, isError, error } = useWalletKpiData();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '250px', p: 2, backgroundColor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>Cargando métricas de conciencia...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2, mx: 'auto', maxWidth: 'md' }}>
        <Typography fontWeight="medium">Error al Cargar Métricas</Typography>
        <Typography variant="body2">{error?.message || 'No se pudieron cargar las métricas de la billetera. Por favor, inténtalo de nuevo más tarde.'}</Typography>
      </Alert>
    );
  }

  if (!kpis || kpis.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '200px', p: 2, textAlign: 'center', backgroundColor: alpha(theme.palette.background.default, 0.3), borderRadius: 2, border: `1px dashed ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb:1 }}>No Hay Métricas Disponibles</Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          Parece que aún no hay datos para mostrar las métricas de conciencia de tu billetera.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* Optional: Title for the dashboard, can also be provided by parent component */}
      {/* <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: 'text.primary' }}>
        Dashboard de Conciencia (Wallet)
      </Typography> */}

      {isFetching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={20} thickness={4} />
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>Actualizando datos...</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        <AnimatePresence>
          {kpis.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={kpi.id}>
              <motion.div
                custom={index}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout // Enable layout animations if items reorder/add/remove
              >
                <WalletKpiCard kpi={kpi} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
};

// Notes:
// - Handles isLoading, isError, and empty states for the KPIs.
// - Renders a grid of WalletKpiCard components.
// - Added `isFetching` state display for background updates.
// - The main title for the dashboard is commented out, as it might be better handled by the parent page/component
//   that includes this dashboard, for better layout control.
// - Uses framer-motion for staggered item animations on load.
// - Grid responsiveness: xs={12} (1 card per row on extra small), sm={6} (2 cards), md={4} (3 cards), lg={3} (4 cards).
// - Error and empty state messages are more user-friendly.
// - Background colors and styles are slightly adjusted for better visual feedback during loading/empty states.
// - The `layout` prop on `motion.div` can help animate reordering if KPIs list changes dynamically,
//   though for this initial implementation, it's mainly for enter/exit animations.
// This completes the WalletMetricsDashboard component.El componente `WalletMetricsDashboard.tsx` ha sido creado.
*   Utiliza el hook `useWalletKpiData` para obtener los KPIs y los estados de carga/error.
*   Maneja los estados `isLoading`, `isFetching`, `isError` y el caso de que no haya KPIs (`kpis.length === 0`).
*   Renderiza una `Grid` de Material UI que contiene `WalletKpiCard` para cada KPI.
*   Se han añadido animaciones con `framer-motion` para la aparición de las tarjetas.

Este paso está completo. Pasaré al siguiente.
