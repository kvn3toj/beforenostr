import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
  Slide,
  Fade,
  Stack,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { Close, CheckCircle, Error, Warning, Info } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // en milisegundos, 0 = no auto-close
  persistent?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'text' | 'outlined' | 'contained';
  }[];
  timestamp?: Date;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onAction?: (id: string, actionIndex: number) => void;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  maxNotifications?: number;
  sx?: SxProps<Theme>;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle />;
    case 'error':
      return <Error />;
    case 'warning':
      return <Warning />;
    case 'info':
      return <Info />;
    default:
      return <Info />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'info';
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
  onAction,
  position = { vertical: 'top', horizontal: 'right' },
  maxNotifications = 5,
  sx,
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mostrar solo las notificaciones más recientes
    const recent = notifications.slice(-maxNotifications);
    setVisibleNotifications(recent);

    // Auto-dismiss notifications with duration
    recent.forEach((notification) => {
      if (notification.duration && notification.duration > 0 && !notification.persistent) {
        setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications, maxNotifications, onDismiss]);

  const handleAction = (notificationId: string, actionIndex: number) => {
    if (onAction) {
      onAction(notificationId, actionIndex);
    }
  };

  const getPositionStyles = () => {
    const styles: any = {
      position: 'fixed',
      zIndex: 1400,
      pointerEvents: 'none',
    };

    // Vertical positioning
    if (position.vertical === 'top') {
      styles.top = 24;
    } else {
      styles.bottom = 24;
    }

    // Horizontal positioning
    if (position.horizontal === 'left') {
      styles.left = 24;
    } else if (position.horizontal === 'right') {
      styles.right = 24;
    } else {
      styles.left = '50%';
      styles.transform = 'translateX(-50%)';
    }

    return styles;
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <Box sx={{ ...getPositionStyles(), ...sx }}>
      <Stack spacing={1} direction="column-reverse">
        {visibleNotifications.map((notification, index) => (
          <Slide
            key={notification.id}
            direction={position.horizontal === 'left' ? 'right' : 'left'}
            in={true}
            timeout={300}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Alert
              severity={getNotificationColor(notification.type)}
              icon={getNotificationIcon(notification.type)}
              sx={{
                minWidth: 300,
                maxWidth: 500,
                pointerEvents: 'auto',
                boxShadow: 3,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
              action={
                <Box display="flex" alignItems="center" gap={1}>
                  {notification.timestamp && (
                    <Chip
                      label={new Intl.DateTimeFormat('es', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(notification.timestamp)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => onDismiss(notification.id)}
                    sx={{ color: 'inherit' }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              {notification.title && (
                <AlertTitle>{notification.title}</AlertTitle>
              )}
              <Typography variant="body2" component="div">
                {notification.message}
              </Typography>
              
              {notification.actions && notification.actions.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {notification.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      size="small"
                      variant={action.variant || 'text'}
                      onClick={() => handleAction(notification.id, actionIndex)}
                      sx={{ 
                        color: 'inherit',
                        borderColor: 'currentColor',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              )}
            </Alert>
          </Slide>
        ))}
      </Stack>
    </Box>
  );
};

// Hook para gestionar notificaciones
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      duration: notification.duration ?? 5000, // 5 segundos por defecto
    };

    setNotifications(prev => [...prev, newNotification]);
    return newNotification.id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Métodos de conveniencia
  const showSuccess = (message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'success', message });
  };

  const showError = (message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'error', message, duration: 0 }); // Errores no se auto-cierran
  };

  const showWarning = (message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'warning', message });
  };

  const showInfo = (message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'info', message });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 