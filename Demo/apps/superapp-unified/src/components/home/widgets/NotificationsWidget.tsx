import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import {
  Favorite,
  EmojiEvents,
  Groups,
  ShoppingCart,
  School,
  Notifications,
} from '@mui/icons-material';

// Definición simplificada
interface Notification {
  id: string;
  type: 'reciprocidad' | 'achievement' | 'social' | 'marketplace' | 'education' | 'system';
  title: string;
  timestamp: Date;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'achievement', title: 'Nuevo Logro: Maestro del Agua', timestamp: new Date(Date.now() - 300000), isRead: false },
  { id: '2', type: 'social', title: 'María Elena quiere conectar contigo', timestamp: new Date(Date.now() - 900000), isRead: false },
  { id: '3', type: 'reciprocidad', title: '+250 Öndas recibidas', timestamp: new Date(Date.now() - 1800000), isRead: false },
  { id: '4', type: 'marketplace', title: 'Oferta Especial en cursos', timestamp: new Date(Date.now() - 3600000), isRead: true },
  { id: '5', type: 'system', title: 'Nuevas funciones en UPlay', timestamp: new Date(Date.now() - 7200000), isRead: true },
];

const notificationConfig = {
  reciprocidad: { icon: <Favorite />, color: 'error.main' },
  achievement: { icon: <EmojiEvents />, color: 'warning.main' },
  social: { icon: <Groups />, color: 'primary.main' },
  marketplace: { icon: <ShoppingCart />, color: 'info.main' },
  education: { icon: <School />, color: 'success.main' },
  system: { icon: <Notifications />, color: 'text.secondary' },
};

const getRelativeTime = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(diff / 86400000);
  return `${days}d`;
};


export const NotificationsWidget: React.FC = () => {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Notificaciones
        </Typography>
        {unreadCount > 0 && <Chip label={`${unreadCount} sin leer`} size="small" />}
      </Stack>
      <List dense sx={{ p: 0 }}>
        {mockNotifications.slice(0, 4).map((notification, index) => {
          const config = notificationConfig[notification.type];
          return (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  opacity: notification.isRead ? 0.6 : 1,
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  cursor: 'pointer'
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: config.color }}>{config.icon}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={getRelativeTime(notification.timestamp)}
                  primaryTypographyProps={{ fontWeight: 500, color: 'text.primary' }}
                />
              </ListItem>
              {index < mockNotifications.slice(0, 4).length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
       <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button size="small">Ver Todas</Button>
      </Box>
    </Box>
  );
};
