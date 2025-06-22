import React, { useState, Suspense } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../contexts/ThemeContext';
import { CoomunityCard } from '../components/ui';
import CoomunityButton from '../components/ui/CoomunityButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Lazy loading de secciones de documentación
// TODO: Create design-system components
// const ColorsSection = React.lazy(() => import('../components/design-system/ColorsSection'));
// const TypographySection = React.lazy(() => import('../components/design-system/TypographySection'));
// const ComponentsSection = React.lazy(() => import('../components/design-system/ComponentsSection'));
// const AnimationsSection = React.lazy(() => import('../components/design-system/AnimationsSection'));
// const TokensSection = React.lazy(() => import('../components/design-system/TokensSection'));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`design-system-tabpanel-${index}`}
      aria-labelledby={`design-system-tab-${index}`}
    >
      {value === index && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ py: 3 }}>{children}</Box>
        </motion.div>
      )}
    </div>
  );
};

const DesignSystemShowcase: React.FC = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useCoomunityTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Colores', icon: '🎨' },
    { label: 'Tipografía', icon: '📝' },
    { label: 'Componentes', icon: '🧩' },
    { label: 'Animaciones', icon: '✨' },
    { label: 'Tokens', icon: '🔧' },
  ];

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
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        pt: 2,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <CoomunityCard
            variant="elevated"
            padding="lg"
            className="mb-6 backdrop-blur-sm bg-opacity-95"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography
                  variant="h2"
                  className="coomunity-h1"
                  sx={{
                    background: isDark
                      ? 'linear-gradient(45deg, #bb86fc, #03dac6)'
                      : 'linear-gradient(45deg, #7c3aed, #d97706)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Sistema de Diseño CoomÜnity
                </Typography>
                <Typography
                  variant="h6"
                  className="coomunity-body-lg"
                  sx={{ color: theme.palette.text.secondary, mb: 2 }}
                >
                  Documentación completa de componentes, tokens y patrones de diseño
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                      v2.0.0
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      background: isDark ? 'rgba(187, 134, 252, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                      border: `1px solid ${isDark ? 'rgba(187, 134, 252, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark ? '#bb86fc' : '#7c3aed',
                        fontWeight: 600,
                      }}
                    >
                      React 18+ • Material UI v7 • Tailwind CSS
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {!isMobile && (
                <Box display="flex" gap={2} alignItems="center">
                  <CoomunityButton
                    variant="outline"
                    size="md"
                    onClick={toggleTheme}
                    startIcon={isDark ? '🌞' : '🌙'}
                  >
                    {isDark ? 'Modo Claro' : 'Modo Oscuro'}
                  </CoomunityButton>
                  <CoomunityButton
                    variant="primary"
                    size="md"
                    onClick={() => window.open('https://github.com/coomunity/design-system', '_blank')}
                  >
                    Ver en GitHub
                  </CoomunityButton>
                </Box>
              )}
            </Box>

            {/* Estadísticas del sistema */}
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      color: isDark ? '#bb86fc' : '#7c3aed',
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    25+
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Componentes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      color: isDark ? '#03dac6' : '#0891b2',
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    50+
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Tokens de Diseño
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      color: isDark ? '#ffc107' : '#d97706',
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    12
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Animaciones
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    sx={{
                      color: isDark ? '#4caf50' : '#10b981',
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    2
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Temas
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CoomunityCard>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div variants={itemVariants}>
          <CoomunityCard variant="elevated" padding="sm" className="mb-6">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  gap: 1,
                },
                '& .MuiTabs-indicator': {
                  background: isDark
                    ? 'linear-gradient(45deg, #bb86fc, #03dac6)'
                    : 'linear-gradient(45deg, #7c3aed, #d97706)',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </Box>
                  }
                  id={`design-system-tab-${index}`}
                  aria-controls={`design-system-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </CoomunityCard>
        </motion.div>

        {/* Tab Content */}
        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            <TabPanel value={activeTab} index={0}>
              <CoomunityCard variant="outlined" padding="lg">
                <Typography variant="h5" mb={2}>🎨 Colores</Typography>
                <Typography variant="body1" color="text.secondary">
                  Sección de colores del sistema de diseño CoomÜnity en desarrollo...
                </Typography>
              </CoomunityCard>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <CoomunityCard variant="outlined" padding="lg">
                <Typography variant="h5" mb={2}>📝 Tipografía</Typography>
                <Typography variant="body1" color="text.secondary">
                  Sección de tipografía del sistema de diseño CoomÜnity en desarrollo...
                </Typography>
              </CoomunityCard>
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <CoomunityCard variant="outlined" padding="lg">
                <Typography variant="h5" mb={2}>🧩 Componentes</Typography>
                <Typography variant="body1" color="text.secondary">
                  Sección de componentes del sistema de diseño CoomÜnity en desarrollo...
                </Typography>
              </CoomunityCard>
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <CoomunityCard variant="outlined" padding="lg">
                <Typography variant="h5" mb={2}>✨ Animaciones</Typography>
                <Typography variant="body1" color="text.secondary">
                  Sección de animaciones del sistema de diseño CoomÜnity en desarrollo...
                </Typography>
              </CoomunityCard>
            </TabPanel>
            <TabPanel value={activeTab} index={4}>
              <CoomunityCard variant="outlined" padding="lg">
                <Typography variant="h5" mb={2}>🎯 Tokens</Typography>
                <Typography variant="body1" color="text.secondary">
                  Sección de tokens del sistema de diseño CoomÜnity en desarrollo...
                </Typography>
              </CoomunityCard>
            </TabPanel>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants}>
          <CoomunityCard variant="ghost" padding="lg" className="mt-8">
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" justifyContent="between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="h6" className="coomunity-h3" mb={1}>
                  ¿Necesitas ayuda?
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Consulta la documentación completa o contacta al equipo de diseño
                </Typography>
              </Box>
              <Box display="flex" gap={2}>
                <CoomunityButton variant="outline" size="md">
                  Documentación
                </CoomunityButton>
                <CoomunityButton variant="secondary" size="md">
                  Slack #design-system
                </CoomunityButton>
              </Box>
            </Box>
            
            <Box mt={3} textAlign="center">
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Sistema de Diseño CoomÜnity • Construido con ❤️ para el Bien Común
              </Typography>
            </Box>
          </CoomunityCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DesignSystemShowcase; 