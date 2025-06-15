import React, { Suspense } from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../contexts/ThemeContext';
import { CoomunityCard } from '../components/ui';
import CoomunityButton from '../components/ui/CoomunityButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Lazy loading de componentes pesados
const ModuleCards = React.lazy(() => import('../components/home/ModuleCards'));
const AyniMetricsCard = React.lazy(() => import('../components/home/AyniMetricsCard'));
const NotificationCenter = React.lazy(() => import('../components/home/NotificationCenter'));

const HomePage: React.FC = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useCoomunityTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        pt: 2,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <CoomunityCard
            variant="elevated"
            padding="lg"
            className="mb-6 backdrop-blur-sm bg-opacity-90"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography
                variant="h3"
                className="coomunity-h1"
                sx={{
                  background: isDark
                    ? 'linear-gradient(45deg, #bb86fc, #03dac6)'
                    : 'linear-gradient(45deg, #7c3aed, #d97706)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}
              >
                Bienvenido a CoomÜnity
              </Typography>
              <CoomunityButton
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                startIcon={isDark ? '🌞' : '🌙'}
              >
                {isDark ? 'Modo Claro' : 'Modo Oscuro'}
              </CoomunityButton>
            </Box>
            <Typography
              variant="body1"
              className="coomunity-body-lg"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              Explora el ecosistema de economía colaborativa basado en los principios del Ayni
            </Typography>
          </CoomunityCard>
        </motion.div>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Module Cards Section */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Suspense fallback={<LoadingSpinner size="large" />}>
                <ModuleCards />
              </Suspense>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Ayni Metrics */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LoadingSpinner />}>
                  <AyniMetricsCard />
                </Suspense>
              </motion.div>

              {/* Notification Center */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LoadingSpinner />}>
                  <NotificationCenter />
                </Suspense>
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <CoomunityCard
            variant="ghost"
            padding="md"
            className="mt-6"
          >
            <Typography variant="h6" className="coomunity-h3" mb={2}>
              Acciones Rápidas
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <CoomunityButton variant="primary" size="md">
                Explorar Marketplace
              </CoomunityButton>
              <CoomunityButton variant="secondary" size="md">
                Ver ÜPlay
              </CoomunityButton>
              <CoomunityButton variant="outline" size="md">
                Conectar con la Comunidad
              </CoomunityButton>
            </Box>
          </CoomunityCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomePage; 