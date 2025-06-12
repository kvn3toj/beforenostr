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
} from '@mui/material';
import {
  Notifications,
  Settings,
  Circle,
  AutoAwesome,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface WelcomeHeaderProps {
  userName?: string;
  isBackendConnected: boolean;
  notificationCount: number;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  userName = 'CoomÜnity',
  isBackendConnected,
  notificationCount,
  onNotificationClick,
  onSettingsClick,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
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
                bgcolor: theme.palette.primary.main,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                width: 48,
                height: 48,
              }}
            >
              <AutoAwesome />
            </Avatar>
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                ¡Hola, {userName}! 🌟
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Bienvenido a tu espacio de <strong>Bien Común</strong> y{' '}
            <strong>Ayni</strong>
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={
                <Circle
                  sx={{ fontSize: 8 }}
                  color={isBackendConnected ? 'success' : 'warning'}
                />
              }
              label={
                isBackendConnected ? 'Conectado al servidor' : 'Modo offline'
              }
              color={isBackendConnected ? 'success' : 'warning'}
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {isBackendConnected ? 'Datos en tiempo real' : 'Datos simulados'}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={onNotificationClick}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton
            onClick={onSettingsClick}
            sx={{
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.secondary.main, 0.2),
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Settings />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};
