import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Menu, Chat, Notifications } from '@mui/icons-material';

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
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '57px',
        width: '100%',
        paddingX: '4px',
        paddingY: '5px',
        gap: '4px',
        backgroundColor: '#FFF8F8',
        zIndex: 10,
      }}
    >
      {/* Leading Icon - Menu */}
      <IconButton
        onClick={onMenuClick}
        sx={{
          width: '48px',
          height: '48px',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Menu
          sx={{
            width: '24px',
            height: '24px',
            color: '#1D1B20',
          }}
        />
      </IconButton>

      {/* Headline - ÜMarket */}
      <Typography
        component="h1"
        sx={{
          color: '#625B71',
          fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: '22px',
          fontWeight: 400,
          lineHeight: '1.27',
          flex: 1,
          textAlign: 'left',
          marginLeft: 1,
        }}
      >
        ÜMarket
      </Typography>

      {/* Trailing Icons - Chat and Notifications */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '48px',
          width: '96px',
          justifyContent: 'flex-end',
          gap: '4px',
        }}
      >
        <IconButton
          onClick={onChatClick}
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Chat
            sx={{
              width: '20px',
              height: '20px',
              color: '#625B71',
            }}
          />
        </IconButton>

        <IconButton
          onClick={onNotificationsClick}
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Notifications
            sx={{
              width: '20px',
              height: '20px',
              color: '#625B71',
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};
