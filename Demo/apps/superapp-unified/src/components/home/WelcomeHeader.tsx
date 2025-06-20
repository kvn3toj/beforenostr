import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Badge,
  Paper,
  Avatar,
  alpha,
  useTheme,
  Button,
} from '@mui/material';
import {
  Notifications,
  Settings,
  Circle,
  AutoAwesome,
  TrendingUp,
  PlayArrow,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTimeOfDay } from '../../hooks/home';

interface WelcomeHeaderProps {
  userName?: string;
  isBackendConnected: boolean;
  notificationCount: number;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  ayniLevel?: string;
  progressToNextLevel?: number;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactElement;
  };
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  userName = 'CoomÜnity',
  isBackendConnected,
  notificationCount,
  onNotificationClick,
  onSettingsClick,
  ayniLevel = 'Colaborador Equilibrado',
  progressToNextLevel = 78,
  primaryAction,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const timeData = useTimeOfDay(ayniLevel);

  // Acción principal por defecto
  const defaultPrimaryAction = {
    label: 'Continuar Aprendiendo',
    onClick: () => navigate('/uplay'),
    icon: <PlayArrow />,
  };

  const currentPrimaryAction = primaryAction || defaultPrimaryAction;

  return (
    <Paper
      data-testid="welcome-header"
      className="home-welcome-header"
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.08
        )} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elemento decorativo simplificado */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, transparent 70%)`,
        }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        {/* PRIORIDAD 1: Información crítica */}
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            {/* Avatar solo si tiene función específica */}
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                width: 48,
                height: 48,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                display: { xs: 'none', sm: 'flex' }, // Oculto en mobile
              }}
            >
              <AutoAwesome sx={{ fontSize: 24 }} />
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              {/* Saludo personalizado */}
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                ¡Hola, {userName}!
              </Typography>
              
              {/* Nivel Ayni + Progreso */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ fontWeight: 500 }}
                >
                  {ayniLevel}
                </Typography>
                <Chip
                  label={`${progressToNextLevel}%`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<TrendingUp sx={{ fontSize: 16 }} />}
                />
              </Stack>
            </Box>
          </Stack>

          {/* CTA Principal */}
          <Button
            variant="contained"
            size="large"
            startIcon={currentPrimaryAction.icon}
            onClick={currentPrimaryAction.onClick}
            sx={{
              mt: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-out',
            }}
          >
            {currentPrimaryAction.label}
          </Button>
        </Box>

        {/* PRIORIDAD 2: Controles y estado */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Estado de conexión simplificado */}
          <Chip
            icon={
              <Circle
                sx={{ fontSize: 8 }}
                color={isBackendConnected ? 'success' : 'warning'}
              />
            }
            label={isBackendConnected ? 'Online' : 'Offline'}
            color={isBackendConnected ? 'success' : 'warning'}
            variant="outlined"
            size="small"
          />

          {/* Notificaciones */}
          <IconButton
            onClick={onNotificationClick}
            sx={{
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
            aria-label={`Ver notificaciones${notificationCount > 0 ? ` (${notificationCount} nuevas)` : ''}`}
          >
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Configuración */}
          <IconButton
            onClick={onSettingsClick}
            sx={{
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
            aria-label="Configuración"
          >
            <Settings />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};
