import React from 'react';
// Imports específicos siguiendo reglas Builder.io
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Imports específicos de iconos siguiendo reglas Builder.io
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import {
  errorColors,
  successColors,
  warningColors,
  primaryColors,
  secondaryColors,
  grayColors,
} from '../../utils/theme-helpers';

interface SmartHeaderProps {
  userName?: string;
  reciprocidadBalance: number;
  reciprocidadLevel: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    icon?: React.ReactElement;
    urgency?: 'high' | 'medium' | 'low';
  };
  isBackendConnected: boolean;
  notificationCount: number;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}

const getSmartGreeting = (userName: string, balance: number, level: string) => {
  const timeOfDay = new Date().getHours();
  let timeGreeting = '';

  if (timeOfDay < 12) timeGreeting = 'Buenos días';
  else if (timeOfDay < 18) timeGreeting = 'Buenas tardes';
  else timeGreeting = 'Buenas noches';

  if (balance >= 0.8) {
    return `${timeGreeting}, ${userName}! 🌟`;
  } else if (balance >= 0.6) {
    return `${timeGreeting}, ${userName}! ⚖️`;
  } else {
    return `${timeGreeting}, ${userName}! 🌱`;
  }
};

const getSmartSubtitle = (balance: number, level: string) => {
  if (balance >= 0.8) {
    return `${level} • Excelente equilibrio Reciprocidad`;
  } else if (balance >= 0.6) {
    return `${level} • Fortalece tu balance`;
  } else {
    return `${level} • Oportunidad de crecimiento`;
  }
};

const getBalanceColor = (balance: number) => {
  if (balance >= 0.8) return successColors[500];
  if (balance >= 0.6) return warningColors[500];
  return errorColors[500];
};

const getActionUrgencyStyle = (urgency: string = 'medium') => {
  const urgencyStyles = {
    high: {
      background: `linear-gradient(135deg, ${errorColors[500]}, ${errorColors[600]})`,
      animation: 'gentle-pulse 2s ease-in-out infinite',
    },
    medium: {
      background: `linear-gradient(135deg, ${primaryColors[500]}, ${secondaryColors[500]})`,
    },
    low: {
      background: `linear-gradient(135deg, ${grayColors[600]}, ${grayColors[700]})`,
    },
  };

  return (
    urgencyStyles[urgency as keyof typeof urgencyStyles] || urgencyStyles.medium
  );
};

export const SmartHeader: React.FC<SmartHeaderProps> = ({
  userName = 'CoomÜnity',
  reciprocidadBalance,
  reciprocidadLevel,
  primaryAction,
  isBackendConnected,
  notificationCount,
  onNotificationClick,
  onSettingsClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const balancePercentage = Math.round(reciprocidadBalance * 100);
  const actionStyle = getActionUrgencyStyle(primaryAction.urgency);

  return (
    <Box
      className="smart-header guardian-header"
      sx={{
        color: 'white',
        p: 'var(--space-6)',
        borderRadius: 'var(--radius-3xl)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        // Glassmorphism effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(10px)',
          zIndex: 0,
        },
        // Animated background
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 0,
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        '@keyframes gentle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      }}
    >
      {/* Content with proper z-index */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Top section: Greeting + Controls */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 'var(--space-4)' }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              className="text-2xl font-bold leading-tight home-heading-enhanced"
              sx={{
                mb: 'var(--space-1)',
                color: 'white !important',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {getSmartGreeting(userName, reciprocidadBalance, reciprocidadLevel)}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'white !important',
                opacity: 0.95,
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {getSmartSubtitle(reciprocidadBalance, reciprocidadLevel)}
            </Typography>

            {/* Connection status - minimal */}
            {!isBackendConnected && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                  fontSize: 'var(--text-xs)',
                  display: 'block',
                  mt: 'var(--space-1)',
                }}
              >
                📱 Modo offline
              </Typography>
            )}
          </Box>

          {/* Action buttons - minimal */}
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={onNotificationClick}
              className="focus-outline"
              aria-label={`Ver notificaciones (${notificationCount} nuevas)`}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                },
                transition: 'var(--transition-normal)',
              }}
            >
              <Badge
                badgeContent={notificationCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: errorColors[500],
                    color: 'white',
                  },
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>

            <IconButton
              onClick={onSettingsClick}
              className="focus-outline"
              aria-label="Configuración"
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                },
                transition: 'var(--transition-normal)',
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Main section: Balance + Action */}
        <Stack
          direction={isMobile ? 'column' : 'row'}
          alignItems="center"
          justifyContent="space-between"
          spacing={isMobile ? 3 : 4}
        >
          {/* Balance Reciprocidad - Integrated display */}
          <Box
            sx={{
              textAlign: isMobile ? 'center' : 'left',
              flex: isMobile ? 'none' : 1,
            }}
          >
            <Stack
              direction="row"
              alignItems="baseline"
              spacing={2}
              justifyContent={isMobile ? 'center' : 'flex-start'}
            >
              <Typography
                variant="h1"
                className="text-5xl font-extrabold leading-none home-percentage-display"
                sx={{
                  color: 'white !important',
                  fontWeight: 800,
                  textShadow: '0 3px 6px rgba(0,0,0,0.4)',
                  filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6))',
                  background: 'none !important',
                  WebkitTextFillColor: 'white !important',
                }}
              >
                {balancePercentage}%
              </Typography>
              <Box>
                <Typography
                  variant="body2"
                  className="text-sm font-medium"
                  sx={{ opacity: 0.9, mb: 'var(--space-1)' }}
                >
                  Balance Reciprocidad
                </Typography>
                {reciprocidadBalance >= 0.8 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: 'white' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 'var(--text-xs)',
                        color: 'white',
                        opacity: 0.9,
                      }}
                    >
                      Excelente
                    </Typography>
                  </Box>
                )}
                {reciprocidadBalance >= 0.6 && reciprocidadBalance < 0.8 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'white' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 'var(--text-xs)',
                        color: 'white',
                        opacity: 0.9,
                      }}
                    >
                      Mejorando
                    </Typography>
                  </Box>
                )}
                {reciprocidadBalance < 0.6 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PsychologyIcon sx={{ fontSize: 16, color: 'white' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 'var(--text-xs)',
                        color: 'white',
                        opacity: 0.9,
                      }}
                    >
                      Crecimiento
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Primary Action - Prominent */}
          <Button
            variant="contained"
            size="large"
            startIcon={primaryAction.icon}
            onClick={primaryAction.onClick}
            className="focus-outline"
            sx={{
              ...actionStyle,
              color: 'white',
              fontWeight: 'var(--font-semibold)',
              fontSize: 'var(--text-lg)',
              py: 'var(--space-3)',
              px: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              minWidth: isMobile ? '100%' : '240px',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                '&::before': {
                  opacity: 1,
                },
              },
              '&:active': {
                transform: 'translateY(-1px)',
                transition: 'var(--transition-fast)',
              },
              transition: 'var(--transition-normal)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'all 0.5s',
                opacity: 0,
              },
              '&:hover::before': {
                left: '100%',
                opacity: 1,
              },
            }}
          >
            {primaryAction.label}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
