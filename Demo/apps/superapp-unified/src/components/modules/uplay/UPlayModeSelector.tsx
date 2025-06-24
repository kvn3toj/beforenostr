import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons for each mode
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

interface UPlayModeSelectorProps {
  currentMode?: 'unified';
  compact?: boolean;
}

interface ModeConfig {
  id: 'unified';
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  route: string;
  features: Array<{
    icon: React.ReactNode;
    label: string;
    color: string;
  }>;
}

const modeConfigs: ModeConfig[] = [
  {
    id: 'unified',
    title: 'ÜPlay Unificado',
    subtitle: 'GPL - Experiencia Completa Integrada',
    description: 'Experiencia unificada que combina lo mejor de todos los modos: gamificación completa, diseño adaptativo, preguntas interactivas y filosofía CoomÜnity',
    icon: <PlayArrowIcon sx={{ fontSize: '2rem' }} />,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #FF5722 100%)',
    route: '/uplay',
    features: [
      { icon: <QuizIcon />, label: 'Preguntas Interactivas', color: '#6366f1' },
      { icon: <SportsEsportsIcon />, label: 'Gamificación Completa', color: '#FF5722' },
      { icon: <ScreenRotationIcon />, label: 'Diseño Adaptativo', color: '#6750A4' },
      { icon: <DiamondIcon />, label: 'Mëritos y Öndas', color: '#8b5cf6' },
      { icon: <EmojiEventsIcon />, label: 'Sistema de Logros', color: '#FF9800' },
      { icon: <AccessibilityIcon />, label: 'Totalmente Accesible', color: '#10b981' },
      { icon: <TrendingUpIcon />, label: 'Analytics Integrados', color: '#f59e0b' },
      { icon: <BoltIcon />, label: 'Filosofía Ayni', color: '#ec4899' },
    ],
  },
];

const UPlayModeSelector: React.FC<UPlayModeSelectorProps> = ({
  currentMode,
  compact = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleModeSelect = (route: string) => {
    navigate(route);
  };

  if (compact) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Modos de Reproducción ÜPlay
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {modeConfigs.map((mode) => (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: currentMode === mode.id ? 0 : 0, // placeholder for future animations
              }}
            >
              <Button
                variant={currentMode === mode.id ? 'contained' : 'outlined'}
                onClick={() => handleModeSelect(mode.route)}
                startIcon={mode.icon}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'all 0.2s ease-in-out',
                  ...(currentMode === mode.id
                    ? {
                        background: mode.gradient,
                        color: 'white',
                        '&:hover': {
                          background: mode.gradient,
                          opacity: 0.9,
                        },
                        boxShadow: '0 0 12px rgba(99,102,241,0.6)',
                      }
                    : {}),
                }}
              >
                {mode.title.replace('ÜPlay ', '')}
              </Button>
            </motion.div>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          🎬 Elige tu Experiencia ÜPlay
        </Typography>
        <Typography variant="h6" color="text.secondary">
          GPL - Gamified Play List | Tres formas de aprender y crecer
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modeConfigs.map((mode) => (
          <Grid item xs={12} md={4} key={mode.id}>
            <motion.div
              initial={false}
              animate={currentMode === mode.id ? { boxShadow: '0 0 24px 8px #8b5cf6' } : { boxShadow: 'none' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ borderRadius: 16 }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: currentMode === mode.id ? '3px solid' : '1px solid',
                  borderColor: currentMode === mode.id ? theme.palette.primary.main : theme.palette.divider,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  },
                }}
                onClick={() => handleModeSelect(mode.route)}
              >
                {/* Header with gradient */}
                <Box
                  sx={{
                    height: 120,
                    background: mode.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative',
                  }}
                >
                  {mode.icon}
                  {currentMode === mode.id && (
                    <Chip
                      label="Activo"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {mode.title}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {mode.subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {mode.description}
                  </Typography>

                  {/* Features */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Características:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {mode.features.map((feature, index) => (
                        <Chip
                          key={index}
                          icon={feature.icon}
                          label={feature.label}
                          size="small"
                          sx={{
                            bgcolor: `${feature.color}15`,
                            color: feature.color,
                            '& .MuiChip-icon': {
                              color: feature.color,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant={currentMode === mode.id ? 'contained' : 'outlined'}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      ...(currentMode === mode.id
                        ? {
                            background: mode.gradient,
                            color: 'white',
                            '&:hover': {
                              background: mode.gradient,
                              opacity: 0.9,
                            },
                          }
                        : {
                            borderColor: mode.gradient.includes('#6366f1') ? '#6366f1' :
                                        mode.gradient.includes('#FF5722') ? '#FF5722' : '#6750A4',
                            color: mode.gradient.includes('#6366f1') ? '#6366f1' :
                                  mode.gradient.includes('#FF5722') ? '#FF5722' : '#6750A4',
                          }),
                    }}
                  >
                    {currentMode === mode.id ? 'Modo Actual' : 'Seleccionar Modo'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Philosophy Integration */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          💜 Cada modo está diseñado siguiendo los principios de{' '}
          <strong>Ayni (reciprocidad)</strong>, <strong>Bien Común</strong> y{' '}
          <strong>crecimiento consciente</strong> de CoomÜnity
        </Typography>
      </Box>
    </Box>
  );
};

export default UPlayModeSelector;
