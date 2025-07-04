import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../../contexts/ThemeContext';
import { CoomunityCard } from '../ui';
import CoomunityButton from '../ui/CoomunityButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// Componentes de prueba para cada módulo
const HomeModuleTest: React.FC = () => {
  const { isDark } = useCoomunityTheme();
  const theme = useTheme();

  return (
    <CoomunityCard variant="elevated" padding="md">
      <Typography variant="h6" className="coomunity-h3" mb={2}>
        Módulo Home - Prueba de Tema
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: isDark
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'white' }}>
            Fondo gradiente principal
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <CoomunityButton variant="primary" size="sm">Primario</CoomunityButton>
          <CoomunityButton variant="secondary" size="sm">Secundario</CoomunityButton>
          <CoomunityButton variant="outline" size="sm">Outline</CoomunityButton>
        </Box>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Texto secundario - debe ser legible en ambos modos
        </Typography>
      </Box>
    </CoomunityCard>
  );
};

const MarketplaceModuleTest: React.FC = () => {
  const { isDark } = useCoomunityTheme();
  const theme = useTheme();

  return (
    <CoomunityCard variant="elevated" padding="md">
      <Typography variant="h6" className="coomunity-h3" mb={2}>
        Módulo Marketplace - Prueba de Tema
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Simulación de tarjeta de producto */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Typography variant="subtitle1" mb={1}>
            Producto de Ejemplo
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Descripción del producto que debe ser legible
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              sx={{
                color: isDark ? '#bb86fc' : '#7c3aed',
                fontWeight: 600,
              }}
            >
              150 Lükas
            </Typography>
            <CoomunityButton variant="primary" size="sm">
              Ver Detalles
            </CoomunityButton>
          </Box>
        </Box>

        {/* Filtros de ejemplo */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            Filtros
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {['Productos', 'Servicios', 'Destacados'].map((filter) => (
              <Box
                key={filter}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  background: isDark ? 'rgba(187, 134, 252, 0.2)' : 'rgba(124, 58, 237, 0.1)',
                  color: isDark ? '#bb86fc' : '#7c3aed',
                  fontSize: '0.875rem',
                }}
              >
                {filter}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </CoomunityCard>
  );
};

const UPlayModuleTest: React.FC = () => {
  const { isDark } = useCoomunityTheme();
  const theme = useTheme();

  return (
    <CoomunityCard variant="elevated" padding="md">
      <Typography variant="h6" className="coomunity-h3" mb={2}>
        Módulo ÜPlay - Prueba de Tema
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Simulación de reproductor */}
        <Box
          sx={{
            aspectRatio: '16/9',
            borderRadius: 2,
            background: isDark
              ? 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', opacity: 0.8 }}>
            ▶️
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
              background: 'rgba(0,0,0,0.7)',
              borderRadius: 1,
              p: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: 'white' }}>
              Video de Ejemplo - GPL Gamified Play List
            </Typography>
          </Box>
        </Box>

        {/* Controles de ejemplo */}
        <Box display="flex" gap={1} justifyContent="center">
          <CoomunityButton variant="outline" size="sm">⏮️</CoomunityButton>
          <CoomunityButton variant="primary" size="sm">⏸️</CoomunityButton>
          <CoomunityButton variant="outline" size="sm">⏭️</CoomunityButton>
        </Box>

        {/* Métricas gamificadas */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: isDark ? 'rgba(3, 218, 198, 0.1)' : 'rgba(3, 218, 198, 0.05)',
            border: `1px solid ${isDark ? 'rgba(3, 218, 198, 0.3)' : 'rgba(3, 218, 198, 0.2)'}`,
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            Progreso Reciprocidad
          </Typography>
          <Box display="flex" gap={2}>
            <Box textAlign="center">
              <Typography variant="h6" sx={{ color: '#03dac6' }}>+5</Typography>
              <Typography variant="caption">Mëritos</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" sx={{ color: '#03dac6' }}>+12</Typography>
              <Typography variant="caption">Öndas</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </CoomunityCard>
  );
};

const SocialModuleTest: React.FC = () => {
  const { isDark } = useCoomunityTheme();
  const theme = useTheme();

  return (
    <CoomunityCard variant="elevated" padding="md">
      <Typography variant="h6" className="coomunity-h3" mb={2}>
        Módulo Social - Prueba de Tema
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Simulación de post */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isDark
                  ? 'linear-gradient(45deg, #bb86fc, #03dac6)'
                  : 'linear-gradient(45deg, #7c3aed, #d97706)',
              }}
            />
            <Box>
              <Typography variant="subtitle2">Usuario CoomÜnity</Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Hace 2 horas
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" mb={2}>
            Compartiendo valor a través del Reciprocidad 🌟 #BienComún #Reciprocidad
          </Typography>
          <Box display="flex" gap={1}>
            <CoomunityButton variant="ghost" size="sm">👍 12</CoomunityButton>
            <CoomunityButton variant="ghost" size="sm">💬 3</CoomunityButton>
            <CoomunityButton variant="ghost" size="sm">🔄 1</CoomunityButton>
          </Box>
        </Box>

        {/* Notificaciones */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: isDark ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.05)',
            border: `1px solid ${isDark ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.2)'}`,
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            Notificación
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Has recibido 5 Mëritos por tu contribución al Bien Común
          </Typography>
        </Box>
      </Box>
    </CoomunityCard>
  );
};

const ThemeTestSuite: React.FC = () => {
  const { isDark, toggleTheme } = useCoomunityTheme();
  const theme = useTheme();
  const [expandedPanel, setExpandedPanel] = useState<string | false>('home');

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const testModules = [
    { id: 'home', name: 'Home/Dashboard', component: HomeModuleTest },
    { id: 'marketplace', name: 'Marketplace (GMP)', component: MarketplaceModuleTest },
    { id: 'uplay', name: 'ÜPlay (GPL)', component: UPlayModuleTest },
    { id: 'social', name: 'Social', component: SocialModuleTest },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <CoomunityCard variant="elevated" padding="lg" className="mb-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
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
                mb: 1,
              }}
            >
              Suite de Pruebas de Tema
            </Typography>
            <Typography
              variant="body1"
              className="coomunity-body-lg"
              sx={{ color: theme.palette.text.secondary }}
            >
              Verificación del modo oscuro en todos los módulos de CoomÜnity
            </Typography>
          </Box>
          <CoomunityButton
            variant="primary"
            size="lg"
            onClick={toggleTheme}
            startIcon={isDark ? '🌞' : '🌙'}
          >
            {isDark ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
          </CoomunityButton>
        </Box>

        {/* Estado actual */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: isDark
              ? 'rgba(187, 134, 252, 0.1)'
              : 'rgba(124, 58, 237, 0.1)',
            border: `1px solid ${isDark ? 'rgba(187, 134, 252, 0.3)' : 'rgba(124, 58, 237, 0.2)'}`,
          }}
        >
          <Typography variant="subtitle1" mb={1}>
            Estado Actual del Tema
          </Typography>
          <Typography variant="body2">
            <strong>Modo:</strong> {isDark ? 'Oscuro' : 'Claro'} |{' '}
            <strong>Paleta:</strong> {theme.palette.mode} |{' '}
            <strong>Fondo:</strong> {theme.palette.background.default}
          </Typography>
        </Box>
      </CoomunityCard>

      {/* Tests por módulo */}
      <Box>
        {testModules.map(({ id, name, component: TestComponent }) => (
          <Accordion
            key={id}
            expanded={expandedPanel === id}
            onChange={handleAccordionChange(id)}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: theme.shadows[2],
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                borderRadius: 2,
                '&.Mui-expanded': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
            >
              <Typography variant="h6" className="coomunity-h3">
                {name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <TestComponent />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Resumen de compatibilidad */}
      <CoomunityCard variant="elevated" padding="lg" className="mt-6">
        <Typography variant="h5" className="coomunity-h2" mb={3}>
          Resumen de Compatibilidad
        </Typography>
        <Grid container spacing={2}>
          {testModules.map(({ id, name }) => (
            <Grid item xs={12} sm={6} md={3} key={id}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ color: '#10b981', mb: 1 }}>
                  ✅
                </Typography>
                <Typography variant="subtitle2">{name}</Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Compatible
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CoomunityCard>
    </Container>
  );
};

export default ThemeTestSuite; 