import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Avatar,
  Box,
  Badge,
  Chip,
  IconButton,
  alpha,
  useTheme,
  Divider,
  Fade,
} from '@mui/material';
import {
  Notifications,
  AutoAwesome,
  EmojiEvents,
  Groups,
  Store,
  People,
  Favorite,
  TrendingUp,
  AccessTime,
  CheckCircle,
  Clear,
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'reciprocidad' | 'meritos' | 'social' | 'marketplace' | 'system';
  title: string;
  message: string;
  time: string;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  isRead?: boolean;
  priority?: 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onClearAll?: () => void;
}

  // 🔗 Usando datos reales del backend
  const { data: notifications = [] } = useNotifications();
const NotificationItem: React.FC<{
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
}> = ({ notification, onClick, onMarkAsRead }) => {
  const theme = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        border: `1px solid ${alpha(
          theme.palette[notification.color].main,
          0.2
        )}`,
        bgcolor: notification.isRead
          ? alpha(theme.palette[notification.color].main, 0.02)
          : alpha(theme.palette[notification.color].main, 0.08),
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        '&:hover': {
          bgcolor: alpha(theme.palette[notification.color].main, 0.12),
          transform: 'translateY(-1px)',
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => onClick?.(notification)}
    >
      {/* Indicador de prioridad */}
      {notification.priority && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 4,
            height: '100%',
            bgcolor: getPriorityColor(notification.priority),
            borderRadius: '0 4px 4px 0',
          }}
        />
      )}

      {/* Indicador de no leído */}
      {!notification.isRead && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor:
              notification.color === 'error' ? 'error.main' : 'primary.main',
            animation: 'pulse 2s infinite',
          }}
        />
      )}

      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          sx={{
            bgcolor: `${notification.color}.main`,
            width: 44,
            height: 44,
            fontSize: 20,
          }}
        >
          {notification.icon}
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 0.5 }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                color: notification.isRead ? 'text.secondary' : 'text.primary',
              }}
            >
              {notification.title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTime
                sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.7 }}
              />
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.4,
              mb: notification.actionLabel ? 1 : 0,
            }}
          >
            {notification.message}
          </Typography>

          {/* Acciones */}
          {notification.actionLabel && (
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                label={notification.actionLabel}
                size="small"
                color={notification.color}
                variant="outlined"
                clickable
                onClick={(e) => {
                  e.stopPropagation();
                  notification.onAction?.();
                }}
              />
              {!notification.isRead && onMarkAsRead && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  sx={{ p: 0.5 }}
                >
                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                </IconButton>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = mockNotifications,
  isOpen,
  onNotificationClick,
  onMarkAsRead,
  onClearAll,
}) => {
  const theme = useTheme();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  if (!isOpen) return null;

  return (
    <Fade in={isOpen} timeout={400}>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.02
          )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" fontWeight="bold">
                Centro de Notificaciones
              </Typography>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </Stack>
            {onClearAll && notifications.length > 0 && (
              <IconButton
                onClick={onClearAll}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                }}
              >
                <Clear />
              </IconButton>
            )}
          </Stack>

          {/* Estadísticas rápidas */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip
              icon={<TrendingUp />}
              label={`${unreadCount} nuevas`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<Favorite />}
              label={`${
                notifications.filter((n) => n.type === 'reciprocidad').length
              } Reciprocidad`}
              color="success"
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<EmojiEvents />}
              label={`${
                notifications.filter((n) => n.type === 'meritos').length
              } Mëritos`}
              color="warning"
              variant="outlined"
              size="small"
            />
          </Stack>

          {/* Lista de notificaciones */}
          {recentNotifications.length > 0 ? (
            <Stack spacing={2}>
              {recentNotifications.map((notification, index) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={onNotificationClick}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary',
              }}
            >
              <Notifications sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No hay notificaciones
              </Typography>
              <Typography variant="body2">
                Te mantendremos informado sobre tus actividades en CoomÜnity
              </Typography>
            </Box>
          )}

          {/* Mensaje motivacional */}
          {notifications.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px dashed ${alpha(theme.palette.info.main, 0.2)}`,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  🔔 "Cada notificación es una oportunidad para crecer y
                  contribuir al Bien Común"
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};
