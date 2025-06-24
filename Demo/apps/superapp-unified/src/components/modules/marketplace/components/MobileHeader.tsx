import React from 'react';
import { Box, Typography, IconButton, InputBase, useTheme } from '@mui/material';
import { Menu, Chat, Notifications, Search } from '@mui/icons-material';

interface MobileHeaderProps {
  onMenuClick: () => void;
  onChatClick: () => void;
  onNotificationsClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuClick,
  onChatClick,
  onNotificationsClick,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '64px',
        width: '100%',
        px: 1.5,
        py: 1,
        gap: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
        zIndex: 10,
      }}
    >
      {/* Leading Icon - Menu */}
      <IconButton
        onClick={onMenuClick}
        aria-label="Abrir menú principal"
        sx={{
          width: 48,
          height: 48,
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Menu sx={{ width: 24, height: 24, color: theme.palette.text.primary }} />
      </IconButton>

      {/* Logo/Branding (opcional, reemplaza por tu Logo si aplica) */}
      <Typography
        component="h1"
        sx={{
          color: theme.palette.primary.main,
          fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: 22,
          fontWeight: 500,
          lineHeight: 1.27,
          ml: 1,
          mr: 2,
          flexShrink: 0,
        }}
      >
        ÜMarket
      </Typography>

      {/* Search Input centrado y prominente */}
      <Box sx={{ flex: 1, mx: 1, minWidth: 0 }}>
        <InputBase
          placeholder="Buscar en CoomÜnity…"
          inputProps={{ 'aria-label': 'Buscar productos o servicios', style: { fontSize: 16 } }}
          startAdornment={<Search sx={{ mr: 1, color: theme.palette.text.secondary }} />}
          sx={{
            width: '100%',
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            px: 2,
            py: 0.5,
            boxShadow: 1,
            fontSize: 16,
            transition: 'box-shadow 0.2s',
            '&:focus-within': {
              boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
            },
          }}
        />
      </Box>

      {/* Trailing Icons - Chat and Notifications */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 48,
          width: 96,
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <IconButton
          onClick={onChatClick}
          aria-label="Abrir chat comunitario"
          sx={{
            width: 40,
            height: 40,
            borderRadius: 20,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Chat sx={{ width: 20, height: 20, color: theme.palette.text.secondary }} />
        </IconButton>
        <IconButton
          onClick={onNotificationsClick}
          aria-label="Ver notificaciones"
          sx={{
            width: 40,
            height: 40,
            borderRadius: 20,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Notifications sx={{ width: 20, height: 20, color: theme.palette.text.secondary }} />
        </IconButton>
      </Box>
    </Box>
  );
};
