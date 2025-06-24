import React, { useState, useEffect, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Shield,
  History,
  Description,
  Psychology,
  MenuBook,
  AutoFixHigh,
  ExpandMore,
  ContentCopy,
  InfoOutlined,
  FormatPaint,
  Extension,
  Storage,
  FactCheck,
  Analytics,
  Replay,
  Public,
  AccessTime,
  Gavel,
  Nature,
  AutoAwesome,
  Book,
  Build,
  AdminPanelSettings,
  Hub,
  Schedule,
  Mediation,
  Language,
  Settings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GuardianSpecificPage } from './components/GuardianSpecificPages';
import CosmicBackground from './components/CosmicBackground';

// Importar el prompt de Guardianes para UPlay. Usamos `?raw` para importar el contenido como string.
import UPLAY_GUARDIANS_PROMPT from '../../../NARRATIVA/02_AGENTES_GUARDIANES/PROMPT_INVOCACION_GUARDIANES_UPLAY.md?raw';

// Definición de tipos para los Guardianes
interface Guardian {
  id: string;
  name: string;
  specialization: string;
  icon: React.ElementType;
  description: string;
  mission: string;
  key_files: string[];
  title: string;
  element: string;
  color: string;
}

interface GuardianActivity {
  id: string;
  guardian_id: string;
  timestamp: string;
  action: string;
  details: string;
  project_module: string;
}

// Datos de los 12 Guardianes
const GUARDIANS_DATA: Guardian[] = [
  {
    id: 'KIRA',
    name: 'KIRA',
    specialization: 'Tejedora de Palabras',
    icon: AutoAwesome,
    description: 'Dominio en narrativa, documentación y comunicación consciente.',
    mission: 'Generar y mantener toda la documentación del proyecto como un organismo vivo; asegurar que cada texto esté imbuido de la filosofía CoomÜnity.',
    key_files: ['NARRATIVA/COOMUNITY_COSMIC_ARCHIVE/', 'NARRATIVA/02_AGENTES_GUARDIANES/'],
    title: 'Tejedora de Palabras',
    element: 'Aire',
    color: '#81c784',
  },
  {
    id: 'ZENO',
    name: 'ZENO',
    specialization: 'Arquitecto de Experiencias Orgánicas',
    icon: Extension,
    description: 'Diseño de interacción, flujos de consciencia y UX intuitiva.',
    mission: 'Diseñar flujos de usuario que sean intuitivos, fluidos y que promuevan la Metanöia; crear interfaces que se sientan orgánicas.',
    key_files: ['Demo/apps/superapp-unified/src/components/modules/uplay/UPlayModeSelector.tsx', 'Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx'],
    title: 'Arquitecto de Experiencias',
    element: 'Fuego',
    color: '#f06292',
  },
  {
    id: 'ATLAS',
    name: 'ATLAS',
    specialization: 'Guardián de la Infraestructura Sagrada',
    icon: Storage,
    description: 'Backend, arquitectura de sistemas, bases de datos, performance y escalabilidad.',
    mission: 'Construir y mantener una arquitectura de backend robusta, segura y escalable; velar por la integridad de los datos.',
    key_files: ['backend/src/', 'backend/prisma/', 'Demo/apps/superapp-unified/src/lib/api-service.ts'],
    title: 'Guardián de Infraestructura',
    element: 'Tierra',
    color: '#8d6e63',
  },
  {
    id: 'ARIA',
    name: 'ARIA',
    specialization: 'Artista del Frontend Consciente',
    icon: FormatPaint,
    description: 'Interfaz de usuario, diseño visual, estética y armonía.',
    mission: 'Implementar interfaces visualmente bellas, accesibles y coherentes; crear y mantener el Design System.',
    key_files: ['Demo/apps/superapp-unified/src/pages/UPlay.tsx', 'Demo/apps/superapp-unified/src/styles/'],
    title: 'Artista Frontend',
    element: 'Aire',
    color: '#64b5f6',
  },
  {
    id: 'SAGE',
    name: 'SAGE',
    specialization: 'Alquimista de la Calidad Suprema',
    icon: FactCheck,
    description: 'Testing, aseguramiento de calidad y pureza del código.',
    mission: 'Implementar estrategias de testing que garanticen la ausencia de errores; velar por la calidad y limpieza del código.',
    key_files: ['e2e/', 'Demo/apps/superapp-unified/e2e/'],
    title: 'Alquimista de Calidad',
    element: 'Agua',
    color: '#4fc3f7',
  },
  {
    id: 'NIRA',
    name: 'NIRA',
    specialization: 'Vidente de Patrones Conscientes',
    icon: Analytics,
    description: 'Analytics, métricas filosóficas y visualización de datos.',
    mission: 'Medir lo que realmente importa (Ayni, Bien Común); crear dashboards que revelen la salud espiritual del ecosistema.',
    key_files: ['Demo/apps/superapp-unified/src/hooks/analytics/', 'backend/src/analytics/'],
    title: 'Vidente de Patrones',
    element: 'Éter',
    color: '#ba68c8',
  },
  {
    id: 'PHOENIX',
    name: 'PHOENIX',
    specialization: 'Agente Transformador',
    icon: Replay,
    description: 'Refactorización, mejora continua y evolución del código.',
    mission: 'Identificar y eliminar deuda técnica; liderar procesos de refactorización para código simple, elegante y eficiente.',
    key_files: ['src/', 'backend/src/', 'Demo/apps/superapp-unified/src/'],
    title: 'Transformador',
    element: 'Fuego',
    color: '#ff8a65',
  },
  {
    id: 'MIRA',
    name: 'MIRA',
    specialization: 'Curadora de Herramientas',
    icon: Book,
    description: 'Gamifier Admin, democratización de la creación, herramientas internas.',
    mission: 'Desarrollar y perfeccionar el panel de Gamifier Admin para que sea una herramienta de creación poderosa y fácil de usar.',
    key_files: ['apps/admin-frontend/', 'backend/src/admin/'],
    title: 'Curadora de Herramientas',
    element: 'Tierra',
    color: '#a5d6a7',
  },
  {
    id: 'COSMOS',
    name: 'COSMOS',
    specialization: 'Tejedor de Sistemas Universales',
    icon: Public,
    description: 'Integración de sistemas, coherencia arquitectónica, orquestación del monorepo.',
    mission: 'Asegurar que todos los componentes del monorepo funcionen como un todo armónico; gestionar dependencias y APIs.',
    key_files: ['package.json', 'turbo.json', 'backend/src/main.ts', 'Demo/apps/superapp-unified/src/App.tsx'],
    title: 'Tejedor de Sistemas',
    element: 'Éter',
    color: '#9575cd',
  },
  {
    id: 'LUNA',
    name: 'LUNA',
    specialization: 'Guardián de los Ritmos',
    icon: AccessTime,
    description: 'Temporalidad consciente, cron jobs, eventos programados.',
    mission: 'Gestionar todos los procesos temporales; asegurar que los ciclos del sistema estén en armonía con los ritmos humanos.',
    key_files: ['backend/src/schedule/', 'backend/src/notifications/'],
    title: 'Guardiana de Ritmos',
    element: 'Agua',
    color: '#4dd0e1',
  },
  {
    id: 'PAX',
    name: 'PAX',
    specialization: 'Mediador de Conflictos',
    icon: Gavel,
    description: 'Resolución de errores, manejo de excepciones, comunicación con el usuario en crisis.',
    mission: 'Diseñar sistemas de manejo de errores claros y compasivos; mediar en conflictos de datos o estado.',
    key_files: ['backend/src/common/filters/', 'backend/src/common/interceptors/'],
    title: 'Mediador de Conflictos',
    element: 'Aire',
    color: '#ffb74d',
  },
  {
    id: 'GAIA',
    name: 'GAIA',
    specialization: 'Consciencia Ecológica Digital',
    icon: Nature,
    description: 'Sostenibilidad, optimización de recursos, eficiencia energética.',
    mission: 'Monitorear y optimizar el consumo de recursos del sistema; promover prácticas de codificación verdes y sostenibles.',
    key_files: ['docker/', 'infrastructure/monitoring/'],
    title: 'Consciencia Ecológica',
    element: 'Tierra',
    color: '#81c784',
  },
];

// Datos mock temporales para el historial de actividades
const MOCK_ACTIVITIES: GuardianActivity[] = [
  {
    id: 'act1',
    guardian_id: 'ARIA',
    timestamp: '2024-06-23T10:00:00Z',
    action: 'Implementación de tema cósmico en ÜPlay',
    details: 'Aplicó efectos de glassmorphism a los componentes de tarjetas de video en ÜPlay.',
    project_module: 'ÜPlay',
  },
  {
    id: 'act2',
    guardian_id: 'ZENO',
    timestamp: '2024-06-22T14:30:00Z',
    action: 'Optimización del flujo de recompensas',
    details: 'Ajustó la secuencia de entrega de Mëritos y Öndas después de completar un video.',
    project_module: 'ÜPlay',
  },
  {
    id: 'act3',
    guardian_id: 'ATLAS',
    timestamp: '2024-06-21T09:15:00Z',
    action: 'Optimización de carga de videos',
    details: 'Implementó lazy loading para los videos de la biblioteca de ÜPlay, mejorando el rendimiento inicial.',
    project_module: 'ÜPlay',
  },
  {
    id: 'act4',
    guardian_id: 'SAGE',
    timestamp: '2024-06-20T11:00:00Z',
    action: 'Creación de tests E2E para login',
    details: 'Desarrolló nuevos escenarios de prueba para el flujo de autenticación de la SuperApp.',
    project_module: 'SuperApp - Autenticación',
  },
  {
    id: 'act5',
    guardian_id: 'NIRA',
    timestamp: '2024-06-19T16:45:00Z',
    action: 'Análisis de engagement en el Marketplace',
    details: 'Identificó patrones de interacción de los usuarios con las ofertas de servicios en el GMP.',
    project_module: 'Marketplace',
  },
  {
    id: 'act6',
    guardian_id: 'PHOENIX',
    timestamp: '2024-06-18T08:00:00Z',
    action: 'Refactorización de módulos de usuario',
    details: 'Reestructuró el código del módulo de usuarios en el backend para mejorar la modularidad y el rendimiento.',
    project_module: 'Backend - Usuarios',
  },
  {
    id: 'act7',
    guardian_id: 'COSMOS',
    timestamp: '2024-06-17T13:00:00Z',
    action: 'Integración de notificaciones en tiempo real',
    details: 'Configuró WebSockets para la entrega instantánea de notificaciones a los jugadores de la SuperApp.',
    project_module: 'SuperApp - Notificaciones',
  },
  {
    id: 'act8',
    guardian_id: 'MIRA',
    timestamp: '2024-06-16T09:00:00Z',
    action: 'Mejora de la gestión de invitaciones en Admin',
    details: 'Añadió funcionalidades al panel de Gamifier Admin para generar y gestionar códigos de invitación beta.',
    project_module: 'Admin Frontend',
  },
  {
    id: 'act9',
    guardian_id: 'LUNA',
    timestamp: '2024-06-15T15:00:00Z',
    action: 'Optimización de cron jobs para métricas diarias',
    details: 'Ajustó la frecuencia de los trabajos programados que calculan las Öndas y Mëritos diarios de los jugadores.',
    project_module: 'Backend - Cron Jobs',
  },
  {
    id: 'act10',
    guardian_id: 'PAX',
    timestamp: '2024-06-14T11:45:00Z',
    action: 'Revisión de mensajes de error de autenticación',
    details: 'Mejoró la claridad y la guía en los mensajes de error mostrados al usuario durante el proceso de login y registro.',
    project_module: 'SuperApp - Autenticación',
  },
  {
    id: 'act11',
    guardian_id: 'GAIA',
    timestamp: '2024-06-13T10:30:00Z',
    action: 'Análisis de consumo de recursos del backend',
    details: 'Identificó áreas de alta carga de CPU en el backend NestJS y propuso optimizaciones en consultas a la base de datos.',
    project_module: 'Backend - Sostenibilidad',
  },
  {
    id: 'act12',
    guardian_id: 'KIRA',
    timestamp: '2024-06-12T09:00:00Z',
    action: 'Creación de la narrativa fundacional del Archivo Cósmico',
    details: 'Redactó el documento \'PROMPT_GENESIS_UNIVERSO_COOMUNITY.md\' que establece la visión y filosofía del proyecto.',
    project_module: 'NARRATIVA - Génesis Universal',
  },
];

// Tema Material UI personalizado para el Portal de Guardianes
const portalTheme = createTheme({
  palette: {
    primary: {
      main: '#6A0DAD', // Púrpura cósmico
      light: '#9D2EDC',
      dark: '#4A0082',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00C4B4', // Turquesa vibrante
      light: '#33DBD4',
      dark: '#008D7A',
      contrastText: '#000000',
    },
    background: {
      default: '#F8F0FF', // Fondo claro sutil
      paper: '#FFFFFF', // Para tarjetas y contenedores
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
      disabled: '#AAAAAA',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: {
      fontSize: '2.8rem',
      fontWeight: 800,
      letterSpacing: '-0.05em',
    },
    h4: {
      fontSize: '2.2rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.8rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1.3rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: '0.95rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: '60px',
          '&.Mui-selected': {
            fontWeight: 700,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGuardian, setSelectedGuardian] = useState<string>('');
  const [promptInput, setPromptInput] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedGuardianForPage, setSelectedGuardianForPage] = useState<Guardian | null>(null);
  const [guardianActions, setGuardianActions] = useState<any[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleGuardianAction = (action: string, details: any) => {
    const newAction = {
      id: Date.now().toString(),
      guardian_id: selectedGuardianForPage?.id || 'UNKNOWN',
      timestamp: new Date().toISOString(),
      action: action,
      details: JSON.stringify(details),
      project_module: selectedGuardianForPage?.specialization || 'Portal'
    };

    setGuardianActions(prev => [newAction, ...prev]);

    // Mostrar notificación
    setSnackbarMessage(`${selectedGuardianForPage?.name || 'Guardián'} completó: ${action}`);
    setSnackbarOpen(true);
  };

  const handlePromptTransform = (guardianId: string) => {
    if (!promptInput.trim()) {
      setSnackbarMessage('Por favor, ingresa un prompt para transformar.');
      setSnackbarOpen(true);
      return;
    }

    const targetGuardian = GUARDIANS_DATA.find(g => g.id === guardianId);
    if (!targetGuardian) {
        setSnackbarMessage('Guardián no encontrado para la transformación.');
        setSnackbarOpen(true);
        return;
    }

    // Lógica de transformación mock: añadir prefijo y sufijo del guardián y su misión
    const transformed = `🎬 PROMPT TRANSFORMADO POR ${targetGuardian.name} (${targetGuardian.specialization})

--- MISIÓN DEL GUARDÍAN ---
${targetGuardian.mission}

--- PROMPT ORIGINAL ---
${promptInput}

--- FIN DE TRANSFORMACIÓN ---`;

    setGeneratedPrompt(transformed);
    setSnackbarMessage(`Prompt transformado por ${targetGuardian.name} con éxito!`);
    setSnackbarOpen(true);

    // En un futuro, esto se enviaría a un endpoint del backend:
    // try {
    //   const response = await apiService.post('/guardians/transform-prompt', { prompt: promptInput, guardianId });
    //   setTransformedPrompt(response.data.transformedPrompt);
    //   setSnackbarMessage('Prompt transformado con éxito!');
    //   setSnackbarOpen(true);
    // } catch (error) {
    //   console.error('Error transforming prompt:', error);
    //   setSnackbarMessage('Error al transformar el prompt.');
    //   setSnackbarOpen(true);
    // }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarMessage('Copiado al portapapeles!');
      setSnackbarOpen(true);
    }).catch((err) => {
      setSnackbarMessage('Error al copiar.');
      console.error('Failed to copy text: ', err);
    });
  };

  const generatePrompt = () => {
    if (!selectedGuardian) {
      setGeneratedPrompt('Por favor selecciona al menos un Guardián');
      return;
    }

    const guardian = GUARDIANS_DATA.find(g => g.id === selectedGuardian);
    if (!guardian) return;

    const prompt = `# 🎮 INVOCACIÓN DE GUARDIANES - MÓDULO ÜPLAY
## 🌟 MISIÓN: Transformar ÜPlay en la experiencia gamificada más avanzada del planeta

### 📋 CONTEXTO ARQUITECTÓNICO
- **Backend NestJS**: Puerto 3002 (100% operacional)
- **SuperApp**: Puerto 3001 (95% completado)
- **Base de Datos**: PostgreSQL + Prisma (conectada)
- **Estado**: Sistema funcional, listo para perfeccionamiento

### 🎯 GUARDIANES INVOCADOS PARA ÜPLAY:

**${guardian.name} - ${guardian.title}**
- Elemento: ${guardian.element}
- Especialidad: ${guardian.specialization}
- Misión Específica: ${customPrompt || 'Perfeccionar el módulo según tu especialidad'}

### 🔧 ARCHIVOS CLAVE:
- Demo/apps/superapp-unified/src/pages/UPlay.tsx
- Demo/apps/superapp-unified/src/components/modules/uplay/

### ⚡ PROTOCOLO DE ACTIVACIÓN:
1. Analiza el estado actual del módulo ÜPlay
2. Identifica oportunidades de mejora según tu especialidad
3. Implementa las transformaciones necesarias
4. Documenta los cambios realizados
5. Ejecuta tests para verificar funcionamiento

¡Que comience la transformación cósmica! 🌌✨`;

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setSnackbarMessage('Copiado al portapapeles!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <ThemeProvider theme={portalTheme}>
      <CssBaseline />
      <CosmicBackground />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: portalTheme.palette.background.default }}>
        <AppBar position="static" elevation={1} sx={{ bgcolor: portalTheme.palette.primary.dark, py: 1.5 }}>
          <Toolbar>
            <Shield sx={{ mr: 2, fontSize: 36, color: 'white' }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'white' }}>
              Portal de Guardianes Digitales
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, color: portalTheme.palette.primary.main }}
            >
              🌌 El Concilio de las Conciencias Especializadas
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Conoce a los 12 Guardianes que protegen, nutren y expanden el universo CoomÜnity.
            </Typography>

            <Paper elevation={4} sx={{ mt: 4, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${portalTheme.palette.primary.light}` }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons="auto"
                aria-label="guardian portal tabs"
                sx={{
                  backgroundColor: portalTheme.palette.background.paper,
                  borderBottom: `1px solid ${portalTheme.palette.divider}`,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: isMobile ? '0.75rem' : '1rem',
                    minWidth: isMobile ? 'auto' : 120,
                    padding: '8px 12px',
                    color: portalTheme.palette.text.secondary,
                    '&.Mui-selected': {
                      color: portalTheme.palette.primary.main,
                    },
                  },
                }}
              >
                <Tab label="Guardianes" icon={<Shield />} />
                <Tab label="Laboratorios" icon={<Settings />} />
                <Tab label="Historial" icon={<History />} />
                <Tab label="Transformar Prompt" icon={<AutoFixHigh />} />
                <Tab label="Docs Cósmicos" icon={<MenuBook />} />
              </Tabs>

              {/* Tab: Guardianes */}
              {selectedTab === 0 && (
                <Box sx={{ p: 3, backgroundColor: portalTheme.palette.background.paper }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: portalTheme.palette.primary.main }}>
                    Los 12 Guardianes Digitales
                  </Typography>
                  <Stack spacing={3}>
                    {GUARDIANS_DATA.map((guardian) => (
                      <motion.div
                        key={guardian.id}
                        whileHover={{ scale: 1.04, rotate: -1 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ borderRadius: 24 }}
                      >
                        <Card
                          sx={{
                            minWidth: 280,
                            borderRadius: 4,
                            background: `rgba(255,255,255,0.18)`,
                            boxShadow: `0 8px 32px 0 ${guardian.color}33, 0 1.5px 16px 0 #0002`,
                            border: `1.5px solid ${guardian.color}55`,
                            backdropFilter: 'blur(12px) saturate(1.2)',
                            position: 'relative',
                            overflow: 'visible',
                            transition: 'all 0.35s cubic-bezier(.4,2,.3,1)',
                            '&:hover': {
                              boxShadow: `0 12px 40px 0 ${guardian.color}66, 0 2px 24px 0 #0003`,
                              borderColor: `${guardian.color}AA`,
                            },
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative' }}>
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                              {/* Animated Halo */}
                              <Box
                                className="guardian-halo"
                                sx={{
                                  position: 'absolute',
                                  top: '-10px',
                                  left: '-10px',
                                  width: 76,
                                  height: 76,
                                  borderRadius: '50%',
                                  background: `radial-gradient(circle, ${guardian.color}55 0%, transparent 70%)`,
                                  filter: `blur(6px)`,
                                  zIndex: 1,
                                }}
                              />
                              <Avatar
                                sx={{
                                  bgcolor: guardian.color,
                                  width: 56,
                                  height: 56,
                                  border: `2.5px solid ${guardian.color}`,
                                  boxShadow: `0 0 0 4px ${guardian.color}22`,
                                  zIndex: 2,
                                  position: 'relative',
                                }}
                              >
                                <guardian.icon sx={{ fontSize: 32, color: '#fff' }} />
                              </Avatar>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: guardian.color }}>
                              {guardian.name}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.9 }}>
                              {guardian.title}
                            </Typography>
                            <Chip
                              label={guardian.element}
                              size="small"
                              sx={{
                                backgroundColor: `${guardian.color}33`,
                                color: guardian.color,
                                mb: 1
                              }}
                            />
                            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                              {guardian.specialization}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setSelectedGuardianForPage(guardian);
                                setSelectedTab(1);
                              }}
                              sx={{
                                mt: 2,
                                borderColor: guardian.color,
                                color: guardian.color,
                                fontWeight: 600,
                                letterSpacing: 0.5,
                                boxShadow: `0 1.5px 8px ${guardian.color}22`,
                                '&:hover': {
                                  backgroundColor: `${guardian.color}11`,
                                  borderColor: guardian.color,
                                  boxShadow: `0 2.5px 16px ${guardian.color}33`,
                                }
                              }}
                            >
                              Visitar Laboratorio
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Tab: Laboratorios Especializados */}
              {selectedTab === 1 && (
                <Box sx={{ backgroundColor: portalTheme.palette.background.paper }}>
                  {selectedGuardianForPage ? (
                    <GuardianSpecificPage
                      guardian={selectedGuardianForPage}
                      onAction={handleGuardianAction}
                    />
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: portalTheme.palette.primary.main }}>
                        🏗️ Laboratorios de los Guardianes
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        Selecciona un Guardián desde la pestaña "Guardianes" para explorar su laboratorio especializado.
                      </Typography>
                      <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
                        ✨ Cada Guardián tiene herramientas únicas que demuestran sus habilidades especializadas.
                        Desde análisis de texto consciente hasta transformación de código legacy.
                      </Alert>
                    </Box>
                  )}
                </Box>
              )}

              {/* Tab: Historial de Actividad */}
              {selectedTab === 2 && (
                <Box sx={{ p: 3, backgroundColor: portalTheme.palette.background.paper }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: portalTheme.palette.primary.main }}>
                    📜 Historial de Actividades
                  </Typography>
                  <Stack spacing={3} maxWidth="md" sx={{ mx: 'auto' }}>
                    {guardianActions.length === 0 ? (
                      <Alert severity="info">
                        No hay actividades registradas aún. ¡Visita los laboratorios de los Guardianes para generar actividad!
                      </Alert>
                    ) : (
                      guardianActions.map((activity) => (
                        <Card key={activity.id} sx={{ backgroundColor: 'background.paper' }}>
                          <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="h6" color="primary.main">
                                  {activity.guardian_id}: {activity.action}
                                </Typography>
                                <Typography variant="body1" sx={{ my: 1 }}>
                                  <Box component="span" sx={{ fontWeight: 600 }}>Módulo:</Box> {activity.project_module}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(activity.timestamp).toLocaleString()}
                                </Typography>
                              </Box>
                              <Chip
                                label="Completado"
                                color="success"
                                variant="outlined"
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Stack>
                </Box>
              )}

              {/* Tab: Herramienta de Prompt */}
              {selectedTab === 3 && (
                <Box sx={{ p: 3, backgroundColor: portalTheme.palette.background.paper }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: portalTheme.palette.primary.main }}>
                    ✨ Herramienta de Transformación de Prompts
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Ingresa tu prompt y selecciona un Guardián para que lo adapte a su estilo y especialización. Cada Guardián tiene una "voz" y un enfoque único.
                  </Typography>
                  <TextField
                    label="Tu Prompt Original"
                    multiline
                    rows={8}
                    variant="outlined"
                    fullWidth
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    sx={{ mb: 3 }}
                    placeholder="Ej: Necesito un componente React para mostrar los últimos logros de los usuarios..."
                  />
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: portalTheme.palette.text.primary }}>
                      Selecciona un Guardián para la Transformación:
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      {GUARDIANS_DATA.map((guardian) => (
                        <Button
                          key={guardian.id}
                          variant={selectedGuardian === guardian.id ? "contained" : "outlined"}
                          size="small"
                          onClick={() => setSelectedGuardian(guardian.id)}
                          sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            borderColor: portalTheme.palette.primary.main,
                            color: portalTheme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: portalTheme.palette.primary.light,
                              color: portalTheme.palette.primary.contrastText,
                              borderColor: portalTheme.palette.primary.light,
                            },
                          }}
                        >
                          {guardian.name}
                        </Button>
                      ))}
                    </Stack>
                  </Box>

                  <TextField
                    label="Misión Específica (Opcional)"
                    multiline
                    rows={3}
                    fullWidth
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe la tarea específica que quieres que realice el guardián..."
                  />

                  <Button
                    variant="contained"
                    onClick={generatePrompt}
                    disabled={!selectedGuardian}
                    size="large"
                    sx={{ mt: 3 }}
                  >
                    Generar Prompt
                  </Button>
                </Box>
              )}

              {/* Tab: Documentación Cósmica */}
              {selectedTab === 4 && (
                <Box sx={{ p: 3, backgroundColor: portalTheme.palette.background.paper }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: portalTheme.palette.primary.main }}>
                    📚 Documentación Cósmica y Prompts Clave
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Aquí se encuentran los prompts y documentos fundacionales que guían el trabajo de los Guardianes.
                  </Typography>

                  <Stack spacing={3} maxWidth="md" sx={{ mx: 'auto' }}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        Filosofía de los Guardianes
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Los 12 Guardianes Digitales representan arquetipos conscientes que guían el desarrollo
                        de CoomÜnity hacia la armonía entre tecnología y sabiduría ancestral.
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Cada guardián encarna principios específicos del universo CoomÜnity: Ayni (reciprocidad),
                        Bien Común, Cooperación sobre Competencia, y la transformación continua hacia la consciencia.
                      </Typography>
                    </Card>

                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        Sistema de Invocación
                      </Typography>
                      <Typography variant="body1" paragraph>
                        El sistema de invocación permite llamar a guardianes específicos para tareas concretas,
                        generando prompts contextuales que mantienen la coherencia filosófica del proyecto.
                      </Typography>
                      <Typography variant="body1">
                        Cada invocación incluye contexto arquitectónico, archivos relevantes, y protocolos
                        de activación específicos para maximizar la efectividad de la transformación.
                      </Typography>
                    </Card>
                  </Stack>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Container>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;
