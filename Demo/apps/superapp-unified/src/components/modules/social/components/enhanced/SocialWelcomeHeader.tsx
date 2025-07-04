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
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  Settings,
  Circle,
  People,
  Favorite,
  TrendingUp,
  Groups,
} from '@mui/icons-material';

interface SocialWelcomeHeaderProps {
  userName: string;
  userLevel: string;
  isBackendConnected: boolean;
  notificationCount: number;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}

export const SocialWelcomeHeader: React.FC<SocialWelcomeHeaderProps> = ({
  userName,
  userLevel,
  isBackendConnected,
  notificationCount,
  onNotificationClick,
  onSettingsClick,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      className="guardian-social-header"
      sx={{
        p: 3,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            '#E91E63',
            0.1
          )} 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            '#9C27B0',
            0.1
          )} 0%, transparent 70%)`,
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: '#E91E63',
                background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                width: 56,
                height: 56,
              }}
            >
              <People sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                ¡Hola, {userName}! 🤝
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Tu red social de <strong>Reciprocidad</strong> y <strong>Bien Común</strong>
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Chip
              icon={
                <Circle
                  sx={{ fontSize: 8 }}
                  color={isBackendConnected ? 'success' : 'warning'}
                />
              }
              label={
                isBackendConnected
                  ? 'Red social activa'
                  : 'Modo exploración social'
              }
              color={isBackendConnected ? 'success' : 'warning'}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<TrendingUp sx={{ fontSize: 16 }} />}
              label={userLevel}
              color="primary"
              variant="filled"
              sx={{
                bgcolor: alpha('#E91E63', 0.1),
                color: '#E91E63',
                fontWeight: 'bold',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {isBackendConnected
                ? 'Conexiones en tiempo real'
                : 'Funciones de demostración'}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Notificaciones sociales">
            <IconButton
              onClick={onNotificationClick}
              sx={{
                bgcolor: alpha('#E91E63', 0.1),
                '&:hover': {
                  bgcolor: alpha('#E91E63', 0.2),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Configuración social">
            <IconButton
              onClick={onSettingsClick}
              sx={{
                bgcolor: alpha('#9C27B0', 0.1),
                '&:hover': {
                  bgcolor: alpha('#9C27B0', 0.2),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Métricas rápidas sociales */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha('#fff', 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#E91E63', 0.1)}`,
        }}
      >
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#E91E63"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Groups sx={{ fontSize: 20 }} />
              127
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Red Activa
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#9C27B0"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Favorite sx={{ fontSize: 20 }} />
              23
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Reciprocidad Hoy
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#3F51B5"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <TrendingUp sx={{ fontSize: 20 }} />
              +12%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Crecimiento
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};
