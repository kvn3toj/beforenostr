/**
 * 🔔 NotificationSystem - Sistema de Notificaciones Avanzado
 *
 * Sistema completo de notificaciones con soporte para diferentes tipos,
 * persistencia, acciones personalizadas y integración con el backend.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Badge,
  Fab,
  Zoom,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as ActiveIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Star as AchievementIcon,
  AttachMoney as PaymentIcon,
  Message as MessageIcon,
  ShoppingCart as OrderIcon,
  Group as SocialIcon,
  School as LearningIcon,
  TrendingUp as ProgressIcon,
  Delete as DeleteIcon,
  MarkAsUnread as MarkReadIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptionalQuery } from '../../hooks/useGracefulQuery';
import { apiService } from '../../lib/api-service';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { safeFormatDistance as safeDateFormat } from '../../utils/dateUtils';

// 🏷️ Tipos de notificaciones
export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'achievement'
  | 'payment'
  | 'message'
  | 'order'
  | 'social'
  | 'learning'
  | 'progress';

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  persistent?: boolean;
  autoHideDuration?: number;
  actions?: NotificationAction[];
  avatar?: string;
  data?: any;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationState {
  notifications: Notification[];
  showDrawer: boolean;
  unreadCount: number;
}

type NotificationAction_Reducer =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_ALL' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] | any }; // ✅ Permitir any para manejar datos inesperados

// 🎨 Iconos por tipo de notificación
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
    case 'achievement':
      return <AchievementIcon />;
    case 'payment':
      return <PaymentIcon />;
    case 'message':
      return <MessageIcon />;
    case 'order':
      return <OrderIcon />;
    case 'social':
      return <SocialIcon />;
    case 'learning':
      return <LearningIcon />;
    case 'progress':
      return <ProgressIcon />;
    default:
      return <InfoIcon />;
  }
};

// 🎨 Colores por tipo
const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'achievement':
      return 'primary';
    case 'payment':
      return 'success';
    case 'message':
      return 'info';
    case 'social':
      return 'secondary';
    default:
      return 'info';
  }
};

// 🔄 Reducer para gestión de estado
const notificationReducer = (
  state: NotificationState,
  action: NotificationAction_Reducer
): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };

    case 'REMOVE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter((n) => !n.read).length,
      };

    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      };

    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };

    case 'TOGGLE_DRAWER':
      return {
        ...state,
        showDrawer: !state.showDrawer,
      };

    case 'SET_NOTIFICATIONS':
      // ✅ Validar que el payload sea un array antes de usar filter
      const notifications = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };

    default:
      return state;
  }
};

// 🎯 Context para notificaciones
interface NotificationContextType {
  state: NotificationState;
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  toggleDrawer: () => void;
  showSuccess: (
    title: string,
    message?: string,
    actions?: NotificationAction[]
  ) => void;
  showError: (
    title: string,
    message?: string,
    actions?: NotificationAction[]
  ) => void;
  showWarning: (
    title: string,
    message?: string,
    actions?: NotificationAction[]
  ) => void;
  showInfo: (
    title: string,
    message?: string,
    actions?: NotificationAction[]
  ) => void;
  showAchievement: (title: string, message?: string, data?: any) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// 🎪 Provider del sistema de notificaciones
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    showDrawer: false,
    unreadCount: 0,
  });

  // 🧪 Verificar si mock auth está habilitado
  const isMockEnabled =
    (import.meta as any).env.VITE_ENABLE_MOCK_AUTH === 'true';

  // Fetch notifications from backend using graceful query
  const { data: backendNotifications = [] } = useOptionalQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      // En modo mock, retornar notificaciones de ejemplo
      if (isMockEnabled) {
        const mockData = [
          {
            id: 'mock-1',
            title: '¡Bienvenido a CoomÜnity!',
            message: 'Tu cuenta ha sido configurada exitosamente',
            type: 'info',
            read: false,
            created_at: new Date().toISOString(),
          },
        ];
        console.log('🧪 Mock notifications data:', mockData);
        return mockData;
      }

      const result = await apiService.get(`/notifications/user/${user.id}`);
      console.log('📊 Backend notifications data type:', typeof result, 'data:', result);
      return result;
    },
    enabled: !!user && !isMockEnabled, // Only enable for real backend
    refetchInterval: isMockEnabled ? false : 30000,
    fallbackData: [], // Always return empty array on errors
    silentFail: true, // Don't log errors for notifications
    retry: (failureCount, error: any) => {
      // No retry en modo mock
      if (isMockEnabled) return false;

      // Don't retry 404 errors (endpoint not implemented)
      if (error?.statusCode === 404) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // En modo mock, simular operación exitosa sin petición al backend
      if (isMockEnabled) {
        console.info('📍 Mock mode: Marking notification as read locally');
        return { success: true, local: true, mock: true };
      }

      try {
        return await apiService.put(`/notifications/${notificationId}/read`);
      } catch (error: any) {
        // Handle 404 gracefully - endpoint not implemented yet
        if (error.statusCode === 404) {
          console.info(
            '📍 Mark as read endpoint not available yet - handling locally only'
          );
          return { success: true, local: true };
        }
        throw error;
      }
    },
    onSuccess: (result) => {
      // Only invalidate queries if the backend operation was successful
      if (!result?.local && !result?.mock) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        return await apiService.delete(`/notifications/${notificationId}`);
      } catch (error: any) {
        // Handle 404 gracefully - endpoint not implemented yet
        if (error.statusCode === 404) {
          console.info(
            '📍 Delete notification endpoint not available yet - handling locally only'
          );
          return { success: true, local: true };
        }
        throw error;
      }
    },
    onSuccess: (result) => {
      // Only invalidate queries if the backend operation was successful
      if (!result?.local) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    },
  });

  // Sync with backend notifications
  useEffect(() => {
    console.log('🔄 Syncing notifications - Type:', typeof backendNotifications, 'IsArray:', Array.isArray(backendNotifications), 'Data:', backendNotifications);
    
    // ✅ Validar que backendNotifications sea un array válido
    if (Array.isArray(backendNotifications) && backendNotifications.length > 0) {
      console.log('✅ Dispatching valid notifications array:', backendNotifications);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: backendNotifications });
    } else if (backendNotifications && !Array.isArray(backendNotifications)) {
      console.warn('⚠️ Received non-array data for notifications:', backendNotifications);
      // Si no es array, inicializar con array vacío
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
    }
  }, [backendNotifications]);

  // 🎯 Funciones del contexto
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

      // Auto-remove if not persistent
      if (!notification.persistent) {
        const duration = notification.autoHideDuration || 5000;
        setTimeout(() => {
          dispatch({
            type: 'REMOVE_NOTIFICATION',
            payload: newNotification.id,
          });
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const markAsRead = useCallback(
    (id: string) => {
      dispatch({ type: 'MARK_AS_READ', payload: id });
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation]
  );

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const toggleDrawer = useCallback(() => {
    dispatch({ type: 'TOGGLE_DRAWER' });
  }, []);

  // 🎨 Funciones de conveniencia
  const showSuccess = useCallback(
    (title: string, message = '', actions?: NotificationAction[]) => {
      addNotification({ type: 'success', title, message, actions });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message = '', actions?: NotificationAction[]) => {
      addNotification({
        type: 'error',
        title,
        message,
        actions,
        persistent: true,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message = '', actions?: NotificationAction[]) => {
      addNotification({ type: 'warning', title, message, actions });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message = '', actions?: NotificationAction[]) => {
      addNotification({ type: 'info', title, message, actions });
    },
    [addNotification]
  );

  const showAchievement = useCallback(
    (title: string, message = '', data?: any) => {
      addNotification({
        type: 'achievement',
        title,
        message,
        data,
        persistent: true,
        autoHideDuration: 8000,
      });
    },
    [addNotification]
  );

  const contextValue: NotificationContextType = {
    state,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    toggleDrawer,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAchievement,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationDisplay />
    </NotificationContext.Provider>
  );
};

// 🎭 Componente de visualización de notificaciones
const NotificationDisplay: React.FC = () => {
  const context = useContext(NotificationContext);
  if (!context) return null;

  const {
    state,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    toggleDrawer,
  } = context;
  const { notifications, showDrawer, unreadCount } = state;

  // Notificaciones activas (no leídas y no persistentes)
  const activeNotifications = notifications.filter(
    (n) => !n.read && !n.persistent
  );

  return (
    <>
      {/* Snackbars para notificaciones temporales */}
      {activeNotifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHideDuration || 5000}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert
            severity={getNotificationColor(notification.type) as any}
            onClose={() => removeNotification(notification.id)}
            icon={getNotificationIcon(notification.type)}
            action={
              notification.actions && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      size="small"
                      variant={action.variant || 'text'}
                      color={action.color || 'inherit'}
                      onClick={() => {
                        action.action();
                        removeNotification(notification.id);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              )
            }
          >
            <AlertTitle>{notification.title}</AlertTitle>
            {notification.message}
          </Alert>
        </Snackbar>
      ))}

      {/* FAB para abrir el drawer de notificaciones */}
      <Zoom in={unreadCount > 0}>
        <Fab
          color="primary"
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </Fab>
      </Zoom>

      {/* Drawer de notificaciones */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Notificaciones
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Box>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead}>
                  Marcar todas como leídas
                </Button>
              )}
              <IconButton onClick={toggleDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsIcon
                sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary">
                No tienes notificaciones
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read
                        ? 'transparent'
                        : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                      opacity: notification.read ? 0.7 : 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getNotificationColor(notification.type)}.main`,
                          color: 'white',
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {safeDateFormat(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                      onClick={() =>
                        !notification.read && markAsRead(notification.id)
                      }
                      sx={{ cursor: notification.read ? 'default' : 'pointer' }}
                    />

                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {notification.actions && notification.actions.length > 0 && (
                    <Box sx={{ px: 2, pb: 1 }}>
                      <Stack direction="row" spacing={1}>
                        {notification.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            size="small"
                            variant={action.variant || 'outlined'}
                            color={action.color || 'primary'}
                            onClick={() => {
                              action.action();
                              markAsRead(notification.id);
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {notifications.length > 0 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button variant="outlined" color="error" onClick={clearAll}>
                Limpiar todas
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

// 🔧 Hook para usar el sistema de notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

export default NotificationProvider;
