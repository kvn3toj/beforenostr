import React, { useState, useEffect, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DiamondIcon from '@mui/icons-material/Diamond';
import GroupsIcon from '@mui/icons-material/Groups';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SchoolIcon from '@mui/icons-material/School';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Notification {
  id: string;
  type:
    | 'ayni'
    | 'achievement'
    | 'social'
    | 'marketplace'
    | 'education'
    | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  avatar?: string;
  actionLabel?: string;
  element?: 'fire' | 'water' | 'earth' | 'air' | 'power';
}

interface NotificationCenterRevolutionaryProps {
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}

// 🔔 Notificaciones simuladas
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: '¡Nuevo Logro Desbloqueado!',
    message:
      'Has alcanzado el nivel "Maestro del Agua" en tu balance elemental',
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    isRead: false,
    priority: 'high',
    actionLabel: 'Ver logro',
    element: 'water',
  },
  {
    id: '2',
    type: 'social',
    title: 'Nueva conexión',
    message: 'María Elena quiere conectar contigo en la comunidad',
    timestamp: new Date(Date.now() - 900000), // 15 min ago
    isRead: false,
    priority: 'medium',
    avatar: '👩‍💻',
    actionLabel: 'Aceptar',
  },
  {
    id: '3',
    type: 'ayni',
    title: 'Balance Ayni Actualizado',
    message: '+250 Öndas recibidas por tu contribución al bien común',
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    isRead: false,
    priority: 'medium',
    actionLabel: 'Ver wallet',
    element: 'power',
  },
  {
    id: '4',
    type: 'marketplace',
    title: 'Oferta Especial',
    message: 'Descuento del 30% en cursos de sostenibilidad',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isRead: true,
    priority: 'low',
    actionLabel: 'Ver ofertas',
  },
  {
    id: '5',
    type: 'system',
    title: 'Actualización del Sistema',
    message: 'Nuevas funcionalidades disponibles en el módulo UPlay',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isRead: true,
    priority: 'low',
    actionLabel: 'Explorar',
  },
];

const NotificationCenterRevolutionary: React.FC<
  NotificationCenterRevolutionaryProps
> = ({ onNotificationClick, onMarkAllRead, onViewAll }) => {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; color: string; priority: string }>
  >([]);

  // 📊 Estadísticas de notificaciones
  const stats = useMemo(() => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const priorityCount = notifications.filter(
      (n) => n.priority === 'high' || n.priority === 'urgent'
    ).length;
    const totalCount = notifications.length;

    return { unreadCount, priorityCount, totalCount };
  }, [notifications]);

  // ✨ Generar partículas de notificaciones
  useEffect(() => {
    const generateParticles = () => {
      const priorityColors = {
        low: '#4CAF50',
        medium: '#FF9800',
        high: '#F44336',
        urgent: '#9C27B0',
      };

      const newParticles = Array.from({ length: 6 }, (_, i) => {
        const priorities = ['low', 'medium', 'high', 'urgent'];
        const priority =
          priorities[Math.floor(Math.random() * priorities.length)];

        return {
          id: `notification-particle-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: priorityColors[priority as keyof typeof priorityColors],
          priority,
        };
      });
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3500);
    return () => clearInterval(interval);
  }, []);

  // 🎨 Configuración de tipos de notificación
  const getNotificationConfig = (notification: Notification) => {
    const configs = {
      ayni: {
        icon: DiamondIcon,
        gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
        color: '#9C27B0',
        bgColor: 'rgba(156, 39, 176, 0.1)',
      },
      achievement: {
        icon: EmojiEventsIcon,
        gradient: 'linear-gradient(135deg, #FFD700, #FFA000)',
        color: '#FFD700',
        bgColor: 'rgba(255, 215, 0, 0.1)',
      },
      social: {
        icon: GroupsIcon,
        gradient: 'linear-gradient(135deg, #2196F3, #42A5F5)',
        color: '#2196F3',
        bgColor: 'rgba(33, 150, 243, 0.1)',
      },
      marketplace: {
        icon: ShoppingCartIcon,
        gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)',
        color: '#FF9800',
        bgColor: 'rgba(255, 152, 0, 0.1)',
      },
      education: {
        icon: SchoolIcon,
        gradient: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
        color: '#4CAF50',
        bgColor: 'rgba(76, 175, 80, 0.1)',
      },
      system: {
        icon: AutoAwesomeIcon,
        gradient: 'linear-gradient(135deg, #607D8B, #90A4AE)',
        color: '#607D8B',
        bgColor: 'rgba(96, 125, 139, 0.1)',
      },
    };

    return configs[notification.type] || configs.system;
  };

  // ⏰ Formatear tiempo relativo
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // 🔽 Filtrar notificaciones
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'priority':
        return (
          notification.priority === 'high' || notification.priority === 'urgent'
        );
      default:
        return true;
    }
  });

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como leída
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (onMarkAllRead) {
      onMarkAllRead();
    }
  };

  return (
    <Box
      className="revolutionary-card"
      sx={{
        position: 'relative',
        background: 'var(--revolutionary-glass-medium)',
        backdropFilter: 'var(--revolutionary-blur-medium)',
        border: '2px solid var(--revolutionary-glass-strong)',
        borderRadius: 'var(--revolutionary-radius-xl)',
        padding: { xs: 2, sm: 3 },
        overflow: 'hidden',
        maxHeight: isExpanded ? 600 : 400,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      {/* ✨ Partículas de Notificaciones */}
      <Box className="revolutionary-particles">
        {particles.map((particle) => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width:
                particle.priority === 'urgent' || particle.priority === 'high'
                  ? 6
                  : 4,
              height:
                particle.priority === 'urgent' || particle.priority === 'high'
                  ? 6
                  : 4,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 12px ${particle.color}`,
              animation: `revolutionary-sparkle ${particle.priority === 'urgent' ? '1.5s' : '3s'} ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </Box>

      {/* 🎨 Borde Gradiente Superior */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background:
            stats.unreadCount > 0
              ? 'linear-gradient(135deg, #F44336, #FF9800, #4CAF50)'
              : 'linear-gradient(135deg, #607D8B, #90A4AE)',
          opacity: 0.8,
        }}
      />

      {/* 📱 Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background:
                stats.unreadCount > 0
                  ? 'linear-gradient(135deg, #F44336, #FF6B6B)'
                  : 'linear-gradient(135deg, #4CAF50, #66BB6A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation:
                stats.unreadCount > 0
                  ? 'revolutionary-fab-pulse 2s ease-in-out infinite'
                  : 'none',
              boxShadow:
                stats.unreadCount > 0
                  ? '0 8px 32px rgba(244, 67, 54, 0.3)'
                  : '0 8px 32px rgba(76, 175, 80, 0.3)',
            }}
          >
            {stats.unreadCount > 0 ? (
              <NotificationsActiveIcon
                sx={{ color: 'white', fontSize: '1.8rem' }}
              />
            ) : (
              <NotificationsIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
            )}
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
              }}
            >
              Centro de Notificaciones
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
              }}
            >
              {stats.unreadCount} sin leer • {stats.totalCount} total
            </Typography>
          </Box>
        </Box>

        {/* 🎯 Acciones Rápidas */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filtrar">
            <IconButton
              onClick={() => {
                const filters = ['all', 'unread', 'priority'] as const;
                const currentIndex = filters.indexOf(filter);
                setFilter(filters[(currentIndex + 1) % filters.length]);
              }}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          {stats.unreadCount > 0 && (
            <Tooltip title="Marcar todo como leído">
              <IconButton
                onClick={handleMarkAllRead}
                sx={{
                  background: 'rgba(76, 175, 80, 0.2)',
                  color: '#4CAF50',
                  '&:hover': { background: 'rgba(76, 175, 80, 0.3)' },
                }}
              >
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* 📊 Estadísticas Rápidas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          className="revolutionary-metric-card"
          sx={{
            p: 1.5,
            textAlign: 'center',
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#F44336', fontWeight: 700 }}>
            {stats.unreadCount}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Sin leer
          </Typography>
        </Box>

        <Box
          className="revolutionary-metric-card"
          sx={{
            p: 1.5,
            textAlign: 'center',
            background: 'rgba(255, 152, 0, 0.1)',
            border: '1px solid rgba(255, 152, 0, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#FF9800', fontWeight: 700 }}>
            {stats.priorityCount}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Prioritarias
          </Typography>
        </Box>

        <Box
          className="revolutionary-metric-card"
          sx={{
            p: 1.5,
            textAlign: 'center',
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700 }}>
            {stats.totalCount}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Total
          </Typography>
        </Box>
      </Box>

      {/* 🔽 Filtro Activo */}
      {filter !== 'all' && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={
              filter === 'unread' ? '📩 Solo sin leer' : '⚡ Solo prioritarias'
            }
            size="small"
            onDelete={() => setFilter('all')}
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '& .MuiChip-deleteIcon': { color: 'rgba(255, 255, 255, 0.7)' },
            }}
          />
        </Box>
      )}

      {/* 🔔 Lista de Notificaciones */}
      <Box
        sx={{
          maxHeight: isExpanded ? 300 : 180,
          overflowY: 'auto',
          mb: 2,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
          },
        }}
      >
        {filteredNotifications
          .slice(0, isExpanded ? 10 : 3)
          .map((notification, index) => {
            const config = getNotificationConfig(notification);
            const IconComponent = config.icon;

            return (
              <Fade key={notification.id} in timeout={300 + index * 100}>
                <Box
                  className="revolutionary-interactive"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    mb: 1,
                    background: notification.isRead
                      ? 'rgba(255, 255, 255, 0.05)'
                      : config.bgColor,
                    borderRadius: 'var(--revolutionary-radius-md)',
                    border: notification.isRead
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : `1px solid ${config.color}40`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      background: config.bgColor,
                      borderColor: `${config.color}60`,
                    },
                  }}
                >
                  {/* ⚡ Indicador de Prioridad */}
                  {(notification.priority === 'high' ||
                    notification.priority === 'urgent') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background:
                          notification.priority === 'urgent'
                            ? 'linear-gradient(to bottom, #F44336, #FF6B6B)'
                            : 'linear-gradient(to bottom, #FF9800, #FFB74D)',
                      }}
                    />
                  )}

                  {/* 🎨 Icono/Avatar */}
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: config.gradient,
                      boxShadow: `0 4px 16px ${config.color}40`,
                      flexShrink: 0,
                    }}
                  >
                    {notification.avatar ? (
                      <Typography sx={{ fontSize: '1.2rem' }}>
                        {notification.avatar}
                      </Typography>
                    ) : (
                      <IconComponent
                        sx={{ color: 'white', fontSize: '1.2rem' }}
                      />
                    )}
                  </Avatar>

                  {/* 📝 Contenido */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'white',
                          fontWeight: notification.isRead ? 500 : 700,
                          fontSize: '0.9rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {notification.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.7rem',
                          flexShrink: 0,
                          ml: 1,
                        }}
                      >
                        {getRelativeTime(notification.timestamp)}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        mb: notification.actionLabel ? 1 : 0,
                      }}
                    >
                      {notification.message}
                    </Typography>

                    {/* 🎯 Acción */}
                    {notification.actionLabel && (
                      <Button
                        size="small"
                        sx={{
                          color: config.color,
                          fontSize: '0.7rem',
                          textTransform: 'none',
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': {
                            background: 'transparent',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {notification.actionLabel} →
                      </Button>
                    )}
                  </Box>

                  {/* 🔵 Indicador de No Leído */}
                  {!notification.isRead && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: config.gradient,
                        flexShrink: 0,
                        alignSelf: 'center',
                        boxShadow: `0 0 8px ${config.color}`,
                      }}
                    />
                  )}
                </Box>
              </Fade>
            );
          })}
      </Box>

      <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

      {/* 🎯 Acciones Finales */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="text"
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.8rem',
            textTransform: 'none',
            '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          {isExpanded ? '▲ Contraer' : '▼ Ver más'}
        </Button>

        <Button
          onClick={onViewAll}
          variant="text"
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.8rem',
            textTransform: 'none',
            '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          Ver todas →
        </Button>
      </Box>

      {/* 🌟 Efecto de Resplandor Rotatorio */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120%',
          height: '120%',
          background:
            stats.unreadCount > 0
              ? 'conic-gradient(from 0deg, #F4433650, #FF980050, #4CAF5050, #2196F350)'
              : 'conic-gradient(from 0deg, #607D8B30, #90A4AE30)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 20s linear infinite',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default NotificationCenterRevolutionary;
