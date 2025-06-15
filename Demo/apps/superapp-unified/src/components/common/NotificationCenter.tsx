import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  alpha,
  useTheme,
  Fade,
  Collapse,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Close,
  Circle,
  CheckCircle,
  Info,
  Warning,
  Error,
  Star,
  Groups,
  AttachMoney,
  VideoLibrary,
  Store,
  MarkEmailRead,
  Delete,
  Settings,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/styles';

interface Notification {
  id: string;
  type: 'ayni' | 'transaction' | 'social' | 'system' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    amount?: number;
    user?: string;
    achievement?: string;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
  onNotificationDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'ayni':
      return <Star sx={{ color: 'warning.main' }} />;
    case 'transaction':
      return <AttachMoney sx={{ color: 'success.main' }} />;
    case 'social':
      return <Groups sx={{ color: 'primary.main' }} />;
    case 'achievement':
      return <CheckCircle sx={{ color: 'success.main' }} />;
    default:
      return <Info sx={{ color: 'info.main' }} />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'ayni':
      return 'warning';
    case 'transaction':
      return 'success';
    case 'social':
      return 'primary';
    case 'achievement':
      return 'success';
    default:
      return 'info';
  }
};

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'info';
  }
};

const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}> = ({ notification, onRead, onDelete, index }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
    >
      <ListItem
        className={cn(
          "rounded-lg mb-2 transition-all duration-200",
          notification.read 
            ? "bg-gray-50 hover:bg-gray-100" 
            : "bg-white hover:bg-coomunity-primary-50 border-l-4 border-coomunity-primary-500"
        )}
        sx={{
          bgcolor: notification.read 
            ? alpha(theme.palette.grey[100], 0.5)
            : 'background.paper',
          borderRadius: 2,
          mb: 1,
          border: notification.read 
            ? `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
            : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderLeft: !notification.read 
            ? `4px solid ${theme.palette.primary.main}`
            : undefined,
          '&:hover': {
            bgcolor: notification.read 
              ? alpha(theme.palette.grey[100], 0.8)
              : alpha(theme.palette.primary.main, 0.05),
            transform: 'translateX(4px)',
          },
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <ListItemAvatar>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar
              sx={{
                bgcolor: `${getNotificationColor(notification.type)}.50`,
                border: `2px solid ${theme.palette[getNotificationColor(notification.type)].main}`,
              }}
            >
              {getNotificationIcon(notification.type)}
            </Avatar>
          </motion.div>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="subtitle2" 
                className="coomunity-label font-semibold"
                sx={{ 
                  fontWeight: notification.read ? 'normal' : 'bold',
                  color: notification.read ? 'text.secondary' : 'text.primary'
                }}
              >
                {notification.title}
              </Typography>
              {notification.priority === 'high' && (
                <Chip 
                  label="Urgente" 
                  size="small" 
                  color="error" 
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
              {!notification.read && (
                <Circle 
                  sx={{ 
                    fontSize: 8, 
                    color: 'primary.main',
                    ml: 'auto'
                  }} 
                />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography 
                variant="body2" 
                className="coomunity-body-sm text-gray-600"
                sx={{ 
                  color: 'text.secondary',
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: expanded ? 'none' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {notification.message}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography 
                  variant="caption" 
                  className="coomunity-caption text-gray-500"
                  color="text.secondary"
                >
                  {formatTime(notification.timestamp)}
                </Typography>
                {notification.metadata?.amount && (
                  <Chip 
                    label={`$${notification.metadata.amount.toLocaleString()}`}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ height: 18, fontSize: '0.65rem' }}
                  />
                )}
              </Stack>
            </Box>
          }
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRead(notification.id);
            }}
            className="hover:bg-blue-100 transition-colors duration-200"
          >
            <MarkEmailRead fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="hover:bg-red-100 transition-colors duration-200"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </ListItem>

      {/* Expanded content */}
      <Collapse in={expanded}>
        <Box 
          className="ml-16 mb-2 p-3 bg-gray-50 rounded-lg"
          sx={{ 
            ml: 8, 
            mb: 1, 
            p: 2, 
            bgcolor: alpha(theme.palette.grey[100], 0.5),
            borderRadius: 2 
          }}
        >
          {notification.actionUrl && (
            <Button
              size="small"
              variant="outlined"
              color={getNotificationColor(notification.type)}
              className="mb-2"
              sx={{ mb: 1 }}
            >
              Ver detalles
            </Button>
          )}
          {notification.metadata?.user && (
            <Typography variant="caption" color="text.secondary">
              De: {notification.metadata.user}
            </Typography>
          )}
        </Box>
      </Collapse>
    </motion.div>
  );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onNotificationRead,
  onNotificationDelete,
  onMarkAllRead,
  onClearAll,
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const theme = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <>
      {/* Notification Bell */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          onClick={() => setOpen(true)}
          className={cn(
            "relative transition-all duration-200",
            unreadCount > 0 
              ? "text-coomunity-primary-600 hover:bg-coomunity-primary-50" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            className="animate-pulse"
          >
            {unreadCount > 0 ? (
              <NotificationsActive />
            ) : (
              <Notifications />
            )}
          </Badge>
        </IconButton>
      </motion.div>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100vw',
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <Box 
            className="p-4 bg-gradient-to-r from-coomunity-primary-500 to-coomunity-secondary-500 text-white"
            sx={{ 
              p: 3, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography 
                  variant="h6" 
                  className="coomunity-h3 font-bold"
                  fontWeight="bold"
                >
                  Notificaciones
                </Typography>
                <Typography 
                  variant="body2" 
                  className="coomunity-body-sm opacity-90"
                  sx={{ opacity: 0.9 }}
                >
                  {unreadCount} sin leer de {notifications.length}
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setOpen(false)}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </Stack>

            {/* Filter buttons */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                size="small"
                variant={filter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setFilter('all')}
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  '&.MuiButton-contained': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  }
                }}
              >
                Todas
              </Button>
              <Button
                size="small"
                variant={filter === 'unread' ? 'contained' : 'outlined'}
                onClick={() => setFilter('unread')}
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  '&.MuiButton-contained': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  }
                }}
              >
                Sin leer ({unreadCount})
              </Button>
            </Stack>
          </Box>

          {/* Actions */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<MarkEmailRead />}
                onClick={onMarkAllRead}
                disabled={unreadCount === 0}
                className="flex-1"
              >
                Marcar todas leídas
              </Button>
              <Button
                size="small"
                startIcon={<Delete />}
                onClick={onClearAll}
                color="error"
                variant="outlined"
                className="flex-1"
              >
                Limpiar todo
              </Button>
            </Stack>
          </Box>

          {/* Notifications List */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Box 
                  className="text-center py-12"
                  sx={{ textAlign: 'center', py: 8 }}
                >
                  <Notifications 
                    sx={{ 
                      fontSize: 64, 
                      color: 'grey.300', 
                      mb: 2 
                    }} 
                  />
                  <Typography 
                    variant="h6" 
                    className="coomunity-h3 text-gray-500 mb-2"
                    color="text.secondary" 
                    gutterBottom
                  >
                    {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="coomunity-body text-gray-400"
                    color="text.secondary"
                  >
                    {filter === 'unread' 
                      ? '¡Excelente! Estás al día con todas tus notificaciones.'
                      : 'Las notificaciones aparecerán aquí cuando tengas actividad.'
                    }
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={onNotificationRead}
                      onDelete={onNotificationDelete}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </List>
            )}
          </Box>

          {/* Footer */}
          <Box 
            className="p-3 bg-gray-50 border-t"
            sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              borderTop: 1, 
              borderColor: 'divider' 
            }}
          >
            <Button
              fullWidth
              startIcon={<Settings />}
              variant="outlined"
              size="small"
              className="text-gray-600"
            >
              Configurar notificaciones
            </Button>
          </Box>
        </motion.div>
      </Drawer>
    </>
  );
}; 