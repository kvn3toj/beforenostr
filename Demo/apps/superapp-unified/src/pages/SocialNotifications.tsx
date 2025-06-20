import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Alert,
  Tabs,
  Tab,
  Fade,
  Divider,
  Menu,
  MenuItem,
  LinearProgress,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Notifications,
  NotificationsActive,
  Circle,
  MoreVert,
  Check,
  CheckCircle,
  Delete,
  Group,
  Handshake,
  Star,
  Message,
  Event,
  TrendingUp,
  PersonAdd,
  Share,
  Favorite,
  Settings,
  FilterList,
  MarkAsUnread,
  Schedule,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { RevolutionaryWidget } from '../design-system/templates/RevolutionaryWidget';
import { useSocialNotifications } from '../hooks/useRealBackendData';
import { useAuth } from '../contexts/AuthContext';

// Implementando mejores prácticas de UX:
// - Navegación clara y consistente
// - Estados de loading y error
// - Feedback visual para acciones de usuario

interface NotificationItem {
  id: string;
  type: 'ayni_completed' | 'circle_invitation' | 'connection_request' | 'message' | 'achievement' | 'event' | 'system';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  category: 'ayni' | 'collaboration' | 'network' | 'system';
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
  metadata?: {
    userId?: string;
    groupId?: string;
    eventId?: string;
  };
}

const SocialNotifications: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  // 🔗 Conectar al backend con fallback a datos mock
  const {
    data: notificationsResponse,
    isLoading,
    error,
    refetch
  } = useSocialNotifications(user?.id || '');

  // Datos mock mejorados para la demostración
  const mockNotifications: NotificationItem[] = [
    {
      id: '1',
      type: 'ayni_completed',
      title: 'Intercambio Ayni Completado',
      message: 'Tu intercambio de conocimiento con Ana María ha sido equilibrado. ¡Has ganado 15 Öndas!',
      time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: 'high',
      category: 'ayni',
      isRead: false,
      avatar: '/images/user-ana.jpg',
      actionUrl: '/social/ayni/exchange/123',
    },
    {
      id: '2',
      type: 'circle_invitation',
      title: 'Invitación a Círculo',
      message: 'Te invitaron al círculo "Emprendedores Sostenibles de Medellín". 12 miembros activos.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      category: 'collaboration',
      isRead: false,
      avatar: '/images/circle-sustainable.jpg',
      actionUrl: '/social/circles/456',
      metadata: { groupId: '456' }
    },
    {
      id: '3',
      type: 'connection_request',
      title: 'Nueva Conexión',
      message: 'Carlos Ramírez quiere conectar contigo por intereses comunes en Tecnología Social.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      category: 'network',
      isRead: true,
      avatar: '/images/user-carlos.jpg',
      actionUrl: '/social/connections/789',
    },
    {
      id: '4',
      type: 'achievement',
      title: '¡Nuevo Logro Desbloqueado!',
      message: 'Has alcanzado el nivel "Tejedor de Redes" por tus 25 conexiones exitosas.',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      category: 'system',
      isRead: true,
      avatar: '/images/achievement-badge.jpg',
    },
    {
      id: '5',
      type: 'message',
      title: 'Mensaje en el Chat',
      message: 'María González te ha enviado un mensaje sobre el proyecto de huerta comunitaria.',
      time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      category: 'collaboration',
      isRead: true,
      avatar: '/images/user-maria.jpg',
      actionUrl: '/social/chat/maria',
    },
  ];

  // Usar datos del backend o fallback a mock
  const notifications = (notificationsResponse as any)?.data || mockNotifications;

  const tabs = [
    { label: 'Todas', value: 'all', icon: <Notifications /> },
    { label: 'Ayni', value: 'ayni', icon: <Handshake /> },
    { label: 'Círculos', value: 'collaboration', icon: <Group /> },
    { label: 'Conexiones', value: 'network', icon: <PersonAdd /> },
    { label: 'Sistema', value: 'system', icon: <Settings /> },
  ];

  const filteredNotifications = notifications.filter((notif: NotificationItem) => {
    if (selectedFilter === 'all') return true;
    return notif.category === selectedFilter;
  });

  const unreadCount = notifications.filter((n: NotificationItem) => !n.isRead).length;

  const getNotificationIcon = (type: string, priority: string) => {
    const iconProps = {
      sx: {
        fontSize: 20,
        color: priority === 'high' ? theme.palette.error.main :
               priority === 'medium' ? theme.palette.warning.main :
               theme.palette.action.active
      }
    };

    switch (type) {
      case 'ayni_completed':
        return <Handshake {...iconProps} />;
      case 'circle_invitation':
        return <Group {...iconProps} />;
      case 'connection_request':
        return <PersonAdd {...iconProps} />;
      case 'message':
        return <Message {...iconProps} />;
      case 'achievement':
        return <Star {...iconProps} />;
      case 'event':
        return <Event {...iconProps} />;
      default:
        return <Circle {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      default:
        return theme.palette.action.active;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch {
      return timeString;
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Marcar como leída (aquí se haría la llamada al backend)
    console.log('Marcando notificación como leída:', notification.id);
    
    // Navegar a la acción correspondiente
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    console.log('Marcando como leída:', notificationId);
    handleMenuClose();
  };

  const handleDelete = (notificationId: string) => {
    console.log('Eliminando notificación:', notificationId);
    handleMenuClose();
  };

  const handleMarkAllAsRead = () => {
    console.log('Marcando todas como leídas');
  };

  if (isLoading) {
    return (
      <RevolutionaryWidget
        title="🔔 Notificaciones"
        subtitle="Cargando tus actualizaciones..."
        variant="elevated"
        element="aire"
      >
        <Container maxWidth="md" sx={{ py: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Cargando notificaciones...
          </Typography>
        </Container>
      </RevolutionaryWidget>
    );
  }

  if (error) {
    return (
      <RevolutionaryWidget
        title="🔔 Notificaciones"
        subtitle="Error cargando notificaciones"
        variant="elevated"
        element="aire"
      >
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Alert severity="error" action={
            <Button onClick={() => refetch()}>Reintentar</Button>
          }>
            Error cargando notificaciones. Verifica tu conexión.
          </Alert>
        </Container>
      </RevolutionaryWidget>
    );
  }

  return (
    <RevolutionaryWidget
      title="🔔 Notificaciones Sociales"
      subtitle="Mantente conectado con tu comunidad CoomÜnity"
      variant="elevated"
      element="aire" // Elemento aire para comunicación y flujo
      cosmicEffects={{
        enableParticles: true,
        enableGlow: true,
        enableAnimations: true,
      }}
    >
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/social')}
            sx={{ mb: 2 }}
          >
            Volver a Social
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Notificaciones
                {unreadCount > 0 && (
                  <Badge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{ ml: 2 }}
                  >
                    <NotificationsActive color="primary" />
                  </Badge>
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {notifications.length} notificaciones total • {unreadCount} sin leer
              </Typography>
            </Box>

            {unreadCount > 0 && (
              <Button
                variant="outlined"
                startIcon={<CheckCircle />}
                onClick={handleMarkAllAsRead}
                size="small"
              >
                Marcar todas como leídas
              </Button>
            )}
          </Box>
        </Box>

        {/* Filtros por categoría */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ pb: 1 }}>
            <Tabs
              value={tabs.findIndex(tab => tab.value === selectedFilter)}
              onChange={(_, newValue) => setSelectedFilter(tabs[newValue].value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontWeight: 'medium',
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  sx={{
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Lista de notificaciones */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No hay notificaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedFilter === 'all' 
                  ? 'No tienes notificaciones en este momento.'
                  : `No tienes notificaciones de ${tabs.find(t => t.value === selectedFilter)?.label.toLowerCase()}.`
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1}>
            {filteredNotifications.map((notification: NotificationItem) => (
              <Fade key={notification.id} in={true}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: notification.isRead 
                      ? 'background.paper' 
                      : alpha(theme.palette.primary.main, 0.05),
                    borderLeft: notification.isRead 
                      ? 'none' 
                      : `4px solid ${getPriorityColor(notification.priority)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Avatar/Icono */}
                      <Avatar
                        src={notification.avatar}
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: alpha(getPriorityColor(notification.priority), 0.1),
                        }}
                      >
                        {getNotificationIcon(notification.type, notification.priority)}
                      </Avatar>

                      {/* Contenido */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={notification.isRead ? 'normal' : 'bold'}
                            sx={{ mb: 0.5 }}
                          >
                            {notification.title}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(notification.time)}
                            </Typography>
                            
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, notification.id)}
                              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {notification.message}
                        </Typography>

                        {/* Chips de categoría y prioridad */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={notification.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {!notification.isRead && (
                            <Chip
                              label="Sin leer"
                              size="small"
                              color="error"
                              variant="filled"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Stack>
        )}

        {/* Menú contextual */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification || '')}>
            <MarkAsUnread sx={{ mr: 1 }} />
            Marcar como leída
          </MenuItem>
          <MenuItem onClick={() => handleDelete(selectedNotification || '')}>
            <Delete sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Mensaje inspiracional */}
        <Alert severity="info" sx={{ mt: 4 }}>
          💫 <strong>Conexión Consciente:</strong> Cada notificación es una oportunidad 
          para fortalecer los lazos de tu comunidad CoomÜnity y contribuir al Bien Común.
        </Alert>
      </Container>
    </RevolutionaryWidget>
  );
};

export default SocialNotifications;