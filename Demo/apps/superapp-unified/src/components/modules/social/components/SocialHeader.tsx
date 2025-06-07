import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

interface SocialHeaderProps {
  notificationsCount: number;
  isLoadingNotifications: boolean;
}

const SocialHeader: React.FC<SocialHeaderProps> = ({
  notificationsCount,
  isLoadingNotifications,
}) => {
  return (
    <AppBar position="sticky" sx={{ bgcolor: '#E91E63', boxShadow: 'none' }}>
      <Toolbar>
        <PeopleIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Social - Comunidad CoomÜnity
        </Typography>
        <IconButton color="inherit">
          {isLoadingNotifications ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Badge badgeContent={notificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default SocialHeader; 