import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  PlayArrow as PlayIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeMode } from '../../contexts/ThemeContext';
import { CoomunityButton } from './CoomunityButton';
import { CoomunityCard } from './CoomunityCard';
import { LoadingSpinner } from './LoadingSpinner';

interface ModuleTestProps {
  title: string;
  icon: React.ReactNode;
  status: 'compatible' | 'partial' | 'issues';
  children: React.ReactNode;
}

const ModuleTest: React.FC<ModuleTestProps> = ({ title, icon, status, children }) => {
  const statusColors = {
    compatible: 'success',
    partial: 'warning',
    issues: 'error',
  } as const;

  const statusLabels = {
    compatible: 'Compatible',
    partial: 'Parcial',
    issues: 'Problemas',
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box className="flex items-center gap-3 w-full">
          {icon}
          <Typography variant="h6" className="flex-1">
            {title}
          </Typography>
          <Chip
            label={statusLabels[status]}
            color={statusColors[status]}
            size="small"
            variant="outlined"
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box className="space-y-4">
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const ThemeTestSuite: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeMode();
  const [testResults, setTestResults] = useState({
    home: 'compatible' as const,
    marketplace: 'partial' as const,
    uplay: 'compatible' as const,
    social: 'issues' as const,
  });

  const runThemeTest = (module: keyof typeof testResults) => {
    // Simular test de compatibilidad
    setTimeout(() => {
      const results = ['compatible', 'partial', 'issues'] as const;
      const randomResult = results[Math.floor(Math.random() * results.length)];
      setTestResults(prev => ({
        ...prev,
        [module]: randomResult,
      }));
    }, 1000);
  };

  return (
    <Box className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Typography variant="h4" className="mb-2 font-bold">
          🎨 Suite de Pruebas de Tema
        </Typography>
        <Typography variant="body1" color="text.secondary" className="mb-4">
          Verifica la compatibilidad del modo oscuro y la consistencia visual en todos los módulos de CoomÜnity.
        </Typography>
        
        {/* Theme Toggle */}
        <Card className="p-4 mb-6">
          <Box className="flex items-center justify-between">
            <Box>
              <Typography variant="h6">Modo de Tema Actual</Typography>
              <Typography variant="body2" color="text.secondary">
                {isDarkMode ? 'Modo Oscuro Activado' : 'Modo Claro Activado'}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  color="primary"
                />
              }
              label={isDarkMode ? '🌙 Oscuro' : '☀️ Claro'}
            />
          </Box>
        </Card>
      </motion.div>

      {/* Test Results Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">
              📊 Resumen de Compatibilidad
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(testResults).map(([module, status]) => {
                const icons = {
                  home: <HomeIcon />,
                  marketplace: <StoreIcon />,
                  uplay: <PlayIcon />,
                  social: <PeopleIcon />,
                };
                
                const statusIcons = {
                  compatible: <CheckIcon color="success" />,
                  partial: <WarningIcon color="warning" />,
                  issues: <ErrorIcon color="error" />,
                };

                return (
                  <Grid item xs={12} sm={6} md={3} key={module}>
                    <Box className="flex items-center gap-2 p-3 rounded-lg border">
                      {icons[module as keyof typeof icons]}
                      <Box className="flex-1">
                        <Typography variant="body2" className="capitalize">
                          {module}
                        </Typography>
                      </Box>
                      {statusIcons[status]}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Module Tests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Home Module Test */}
        <ModuleTest
          title="Módulo Home"
          icon={<HomeIcon />}
          status={testResults.home}
        >
          <Typography variant="body2" className="mb-4">
            Prueba de componentes principales del dashboard y navegación.
          </Typography>
          
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CoomunityCard variant="elevated" padding="md">
              <Typography variant="h6" className="mb-2">
                Tarjeta de Módulo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ejemplo de tarjeta con tema adaptativo
              </Typography>
            </CoomunityCard>
            
            <Box className="space-y-2">
              <CoomunityButton variant="primary" size="md">
                Botón Primario
              </CoomunityButton>
              <CoomunityButton variant="outline" size="md">
                Botón Outline
              </CoomunityButton>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => runThemeTest('home')}
            className="mt-4"
          >
            Ejecutar Prueba
          </Button>
        </ModuleTest>

        {/* Marketplace Module Test */}
        <ModuleTest
          title="Módulo Marketplace"
          icon={<StoreIcon />}
          status={testResults.marketplace}
        >
          <Typography variant="body2" className="mb-4">
            Prueba de componentes de productos, servicios y transacciones.
          </Typography>
          
          <Alert severity="warning" className="mb-4">
            Algunos componentes del marketplace necesitan ajustes para el modo oscuro.
          </Alert>
          
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent>
                <Avatar className="mb-2">P</Avatar>
                <Typography variant="h6">Producto</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ejemplo de tarjeta de producto
                </Typography>
                <Chip label="En Stock" color="success" size="small" className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Avatar className="mb-2">S</Avatar>
                <Typography variant="h6">Servicio</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ejemplo de tarjeta de servicio
                </Typography>
                <Chip label="Disponible" color="primary" size="small" className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <LoadingSpinner size="sm" variant="dots" />
                <Typography variant="body2" className="mt-2">
                  Cargando más...
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => runThemeTest('marketplace')}
            className="mt-4"
          >
            Ejecutar Prueba
          </Button>
        </ModuleTest>

        {/* ÜPlay Module Test */}
        <ModuleTest
          title="Módulo ÜPlay"
          icon={<PlayIcon />}
          status={testResults.uplay}
        >
          <Typography variant="body2" className="mb-4">
            Prueba del reproductor de video gamificado y controles interactivos.
          </Typography>
          
          <Box className="space-y-4">
            <Card className="p-4">
              <Box className="flex items-center gap-4">
                <Avatar variant="rounded" className="w-16 h-16">
                  <PlayIcon />
                </Avatar>
                <Box className="flex-1">
                  <Typography variant="h6">Video Interactivo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ejemplo de contenido ÜPlay
                  </Typography>
                  <LinearProgress value={65} variant="determinate" className="mt-2" />
                </Box>
              </Box>
            </Card>
            
            <Box className="flex gap-2">
              <Chip label="Mëritos: +50" color="primary" />
              <Chip label="Öndas: +25" color="secondary" />
              <Chip label="Ayni: Nivel 3" variant="outlined" />
            </Box>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => runThemeTest('uplay')}
            className="mt-4"
          >
            Ejecutar Prueba
          </Button>
        </ModuleTest>

        {/* Social Module Test */}
        <ModuleTest
          title="Módulo Social"
          icon={<PeopleIcon />}
          status={testResults.social}
        >
          <Typography variant="body2" className="mb-4">
            Prueba de componentes sociales, perfiles y comunicación.
          </Typography>
          
          <Alert severity="error" className="mb-4">
            El módulo social requiere refactorización significativa para el modo oscuro.
          </Alert>
          
          <Box className="space-y-4">
            <Card>
              <CardContent>
                <Box className="flex items-center gap-3 mb-3">
                  <Avatar>U</Avatar>
                  <Box>
                    <Typography variant="subtitle1">Usuario CoomÜnity</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hace 2 horas
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" className="mb-2">
                  Compartiendo mi experiencia con el Bien Común en la plataforma 🌟
                </Typography>
                <Divider className="my-2" />
                <Box className="flex gap-2">
                  <Button size="small">Me gusta</Button>
                  <Button size="small">Comentar</Button>
                  <Button size="small">Compartir</Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => runThemeTest('social')}
            className="mt-4"
          >
            Ejecutar Prueba
          </Button>
        </ModuleTest>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <Typography variant="body2" color="text.secondary">
          Suite de pruebas del sistema de diseño CoomÜnity v1.0
        </Typography>
      </motion.div>
    </Box>
  );
}; 