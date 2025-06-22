import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Fab,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Zoom,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Dashboard,
  VideoLibrary,
  EmojiEvents,
  Groups,
  TrendingUp,
  AutoAwesome,
  School,
  Celebration,
  Diamond,
  Bolt,
  Star,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

// 🌌 IMPORTS DEL COSMIC DESIGN SYSTEM
import { RevolutionaryWidget } from '../design-system/templates/RevolutionaryWidget';

// 🎬 IMPORTS DE COMPONENTES UPLAY MEJORADOS
import UPlayEnhancedDashboard from '../components/modules/uplay/UPlayEnhancedDashboard';
import UPlayAdvancedVideoPlayer from '../components/modules/uplay/UPlayAdvancedVideoPlayer';
import UPlayInteractiveLibrary from '../components/modules/uplay/UPlayInteractiveLibrary';
import UPlayAchievementSystem from '../components/modules/uplay/UPlayAchievementSystem';
import UPlayStudyRooms from '../components/modules/uplay/UPlayStudyRooms';

// 🎯 HOOKS Y SERVICIOS
import { useVideos } from '../hooks/data/useVideoData';
import { useAuth } from '../contexts/AuthContext';

/**
 * UPlay Page Component - Version 2.0
 *
 * 🌟 CARACTERÍSTICAS AVANZADAS IMPLEMENTADAS:
 * ✨ Glassmorphism y efectos visuales cósmicos
 * 🎮 Sistema de gamificación completo con Mëritos y Öndas
 * 📱 Diseño responsive con animaciones fluidas
 * 🎬 Reproductor de video interactivo con preguntas dinámicas
 * 🏆 Sistema de logros y progreso visual
 * 👥 Salas de estudio colaborativas
 * 🔄 Integración completa con backend NestJS
 *
 * Filosofía CoomÜnity integrada:
 * - Ayni: Reciprocidad en el aprendizaje colaborativo
 * - Bien Común: Conocimiento compartido para todos
 * - Öndas: Energía positiva a través del aprendizaje
 * - Mëritos: Reconocimiento por contribuciones valiosas
 */

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
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const UPlay: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { user } = useAuth();

  // Estados locales
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Datos de videos desde el backend
  const { data: videos, isLoading: videosLoading, error: videosError } = useVideos();

  // Manejar cambio de pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // 🎨 Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // 🎯 Mock data gamificado mejorado
  const userStats = useMemo(() => ({
    meritos: 340,
    ondas: 125,
    logrosDesbloqueados: 7,
    nextLevel: 'Maestro del Conocimiento',
    progress: 78,
    streak: 12,
    weeklyGoal: 85,
    totalVideos: 23,
    completedChallenges: 15,
    studyHours: 48,
    socialInteractions: 156
  }), []);

  // 🌀 ESTADO DE CARGA: Mostrar un spinner mientras se cargan los datos de los videos
  if (videosLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando Universo ÜPlay...</Typography>
      </Box>
    );
  }

  // ❌ ESTADO DE ERROR: Mostrar un mensaje si falla la carga de videos
  if (videosError) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" color="error">Error al Cargar Contenido</Typography>
        <Typography color="text.secondary">
          No pudimos conectar con el universo ÜPlay. Por favor, intenta de nuevo más tarde.
        </Typography>
      </Box>
    );
  }

  // Renderizar header principal con efectos cósmicos
  const renderCosmicHeader = () => (
    <Fade in={animate} timeout={800}>
      <Box
        data-testid="uplay-cosmic-header"
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg,
            ${alpha('#6366f1', 0.1)} 0%,
            ${alpha('#a855f7', 0.08)} 50%,
            ${alpha('#10b981', 0.06)} 100%)`,
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 20%, ${alpha('#6366f1', 0.15)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${alpha('#a855f7', 0.12)} 0%, transparent 50%)`,
            pointerEvents: 'none',
            zIndex: 1
          }
        }}
      >
        <RevolutionaryWidget
          variant="cosmic"
          intensity="medium"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}
        />

        <Box
          className="uplay-glassmorphism"
          sx={{
            position: 'relative',
            zIndex: 2,
            p: 4,
            textAlign: 'center'
          }}
        >
          <Zoom in={animate} timeout={1000}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AutoAwesome
                sx={{
                  fontSize: 40,
                  color: '#6366f1',
                  mr: 2,
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))'
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                }}
              >
                ÜPlay - GPL Gamified Play List
              </Typography>
            </Box>
          </Zoom>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
              opacity: 0.9
            }}
          >
            Plataforma Interactiva de Aprendizaje Gamificado
          </Typography>

          {/* Métricas principales mejoradas */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[
              {
                label: 'Mëritos Totales',
                value: userStats.meritos,
                icon: <Diamond />,
                color: '#7c3aed',
                key: 'meritos'
              },
              {
                label: 'Öndas Activas',
                value: userStats.ondas,
                icon: <Bolt />,
                color: '#f59e0b',
                key: 'ondas'
              },
              {
                label: 'Logros Desbloqueados',
                value: userStats.logrosDesbloqueados,
                icon: <EmojiEvents />,
                color: '#10b981',
                key: 'logros'
              }
            ].map((metric, index) => (
              <Grid key={metric.key} item xs={12} sm={6} md={4}>
                <Zoom in={animate} timeout={1000 + index * 200}>
                  <Card
                    className="uplay-metric-card"
                    onMouseEnter={() => setHoveredMetric(metric.key)}
                    onMouseLeave={() => setHoveredMetric(null)}
                    sx={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      transform: hoveredMetric === metric.key ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: `0 0 25px ${alpha(metric.color, 0.4)}`
                      }
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${alpha(metric.color, 0.2)}, ${alpha(metric.color, 0.1)})`,
                          color: metric.color,
                          mb: 2,
                          boxShadow: `0 0 15px ${alpha(metric.color, 0.3)}`
                        }}
                      >
                        {metric.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        className="uplay-metric-value"
                        sx={{
                          mb: 1,
                          background: `linear-gradient(135deg, ${metric.color}, ${alpha(metric.color, 0.7)})`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Mensaje motivacional mejorado */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg,
                ${alpha('#6366f1', 0.1)} 0%,
                ${alpha('#a855f7', 0.08)} 100%)`,
              border: `1px solid ${alpha('#6366f1', 0.2)}`,
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                mb: 2,
                lineHeight: 1.6
              }}
            >
              Sumérgete en una experiencia de aprendizaje revolucionaria donde cada video es una
              aventura interactiva. Gana <strong style={{ color: '#7c3aed' }}>Mëritos</strong> y{' '}
              <strong style={{ color: '#f59e0b' }}>Öndas</strong> mientras contribuyes al{' '}
              <strong style={{ color: '#10b981' }}>Bien Común</strong> de nuestra
              comunidad a través del <strong style={{ color: '#6366f1' }}>Ayni</strong> del conocimiento.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                  boxShadow: '0 12px 32px rgba(99, 102, 241, 0.6)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => setCurrentTab(1)}
            >
              Comenzar Aprendizaje
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );

  // Renderizar pestañas con glassmorphism
  const renderNavigationTabs = () => (
    <Fade in={animate} timeout={1200}>
      <Card
        sx={{
          background: alpha('#ffffff', 0.05),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 4,
          mb: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: isMobile ? '0.875rem' : '1rem',
              minHeight: 64,
              color: alpha(theme.palette.text.primary, 0.7),
              position: 'relative',
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: '3px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: '2px 2px 0 0',
                }
              },
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.05),
                transform: 'translateY(-1px)',
              }
            },
            '& .MuiTabs-indicator': {
              display: 'none', // Usamos nuestro indicador personalizado
            }
          }}
        >
          <Tab
            icon={<Dashboard />}
            label="Dashboard"
            iconPosition="start"
          />
          <Tab
            icon={<VideoLibrary />}
            label="Biblioteca"
            iconPosition="start"
          />
          <Tab
            icon={
              <Badge badgeContent={userStats.logrosDesbloqueados} color="secondary">
                <EmojiEvents />
              </Badge>
            }
            label="Logros"
            iconPosition="start"
          />
          <Tab
            icon={<Groups />}
            label="Salas de Estudio"
            iconPosition="start"
          />
        </Tabs>
      </Card>
    </Fade>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {renderCosmicHeader()}
      {renderNavigationTabs()}

      <Box sx={{ mt: 2 }}>
        <TabPanel value={currentTab} index={0}>
          <UPlayEnhancedDashboard />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <UPlayInteractiveLibrary
            videos={videos || []}
            onVideoSelect={setSelectedVideoId}
            loading={videosLoading}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <UPlayAchievementSystem />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <UPlayStudyRooms />
        </TabPanel>
      </Box>

      {selectedVideoId && (
        <UPlayAdvancedVideoPlayer
          videoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </Container>
  );
};

export default UPlay;
