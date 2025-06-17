import React, { useState, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Badge from '@mui/material/Badge';
import { useTheme, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarIcon from '@mui/icons-material/Star';

interface IntelligentNotification {
  id: string;
  type:
    | 'ayni'
    | 'meritos'
    | 'social'
    | 'marketplace'
    | 'system'
    | 'achievement'
    | 'tip';
  title: string;
  message: string;
  time: string;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  isRead?: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
  category: 'urgent' | 'social' | 'achievement' | 'tip' | 'system';
  aiScore?: number; // Score de relevancia por IA
  userEngagement?: number; // Probabilidad de interacción
  smartSuggestion?: string; // Sugerencia inteligente
}

interface NotificationStats {
  total: number;
  unread: number;
  high: number;
  critical: number;
  byType: Record<string, number>;
  avgEngagement: number;
}

interface IntelligentNotificationCenterProps {
  notifications: IntelligentNotification[];
  isOpen: boolean;
  currentFilter?: 'all' | 'unread' | 'high' | 'critical' | 'smart';
  onFilterChange?: (
    filter: 'all' | 'unread' | 'high' | 'critical' | 'smart'
  ) => void;
  onNotificationClick?: (notification: IntelligentNotification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  onClose?: () => void;
  notificationStats?: NotificationStats;
  className?: string;
}

// 🎯 Configuración de tipos de notificación
const notificationConfig = {
  ayni: {
    label: 'Ayni',
    color: 'success' as const,
    description: 'Reciprocidad y balance',
  },
  meritos: {
    label: 'Mëritos',
    color: 'warning' as const,
    description: 'Logros y reconocimientos',
  },
  social: {
    label: 'Social',
    color: 'primary' as const,
    description: 'Conexiones y comunidad',
  },
  marketplace: {
    label: 'Marketplace',
    color: 'info' as const,
    description: 'Comercio y intercambios',
  },
  system: {
    label: 'Sistema',
    color: 'secondary' as const,
    description: 'Actualizaciones técnicas',
  },
  achievement: {
    label: 'Logros',
    color: 'success' as const,
    description: 'Nuevos achievements',
  },
  tip: {
    label: 'Tips',
    color: 'info' as const,
    description: 'Consejos inteligentes',
  },
};

const priorityConfig = {
  critical: {
    label: 'Crítica',
    color: 'error' as const,
    weight: 4,
  },
  high: {
    label: 'Alta',
    color: 'warning' as const,
    weight: 3,
  },
  medium: {
    label: 'Media',
    color: 'info' as const,
    weight: 2,
  },
  low: {
    label: 'Baja',
    color: 'success' as const,
    weight: 1,
  },
};

const NotificationCard: React.FC<{
  notification: IntelligentNotification;
  onClick: (notification: IntelligentNotification) => void;
  onMarkAsRead: (id: string) => void;
  showAiInsights?: boolean;
}> = ({ notification, onClick, onMarkAsRead, showAiInsights = false }) => {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    onClick(notification);
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  }, [notification, onClick, onMarkAsRead]);

  const handleMarkAsRead = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onMarkAsRead(notification.id);
    },
    [notification.id, onMarkAsRead]
  );

  const priorityColor = priorityConfig[notification.priority].color;
  const notificationTypeConfig = notificationConfig[notification.type];

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        mb: 1,
        bgcolor: notification.isRead
          ? 'background.paper'
          : alpha(theme.palette[priorityColor].main, 0.05),
        border: `1px solid ${
          notification.isRead
            ? alpha(theme.palette.grey[300], 0.5)
            : alpha(theme.palette[priorityColor].main, 0.2)
        }`,
        borderLeft: `4px solid ${theme.palette[priorityColor].main}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          bgcolor: alpha(theme.palette[priorityColor].main, 0.08),
          transform: 'translateX(4px)',
          boxShadow: `0 4px 12px ${alpha(theme.palette[priorityColor].main, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1}>
          {/* Header */}
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <Box
              sx={{ color: theme.palette[notificationTypeConfig.color].main }}
            >
              {notification.icon}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{
                    color: notification.isRead
                      ? 'text.secondary'
                      : 'text.primary',
                  }}
                >
                  {notification.title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {/* AI Score */}
                  {showAiInsights && notification.aiScore && (
                    <Tooltip title={`Relevancia IA: ${notification.aiScore}%`}>
                      <Chip
                        icon={<SmartToyIcon />}
                        label={`${notification.aiScore}%`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Tooltip>
                  )}

                  {/* Priority Badge */}
                  <Chip
                    label={priorityConfig[notification.priority].label}
                    size="small"
                    color={priorityColor}
                    variant={notification.isRead ? 'outlined' : 'filled'}
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />

                  {/* Time */}
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>

                  {/* Mark as read button */}
                  {!notification.isRead && (
                    <Tooltip title="Marcar como leída">
                      <IconButton
                        size="small"
                        onClick={handleMarkAsRead}
                        sx={{ p: 0.5 }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>

              {/* Message */}
              <Typography
                variant="body2"
                color={notification.isRead ? 'text.secondary' : 'text.primary'}
                sx={{ mb: 1, lineHeight: 1.4 }}
              >
                {notification.message}
              </Typography>

              {/* Smart Suggestion */}
              {showAiInsights && notification.smartSuggestion && (
                <Box
                  sx={{
                    p: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AutoAwesomeIcon
                      sx={{ fontSize: 16, color: 'info.main' }}
                    />
                    <Typography variant="caption" color="info.main">
                      Sugerencia: {notification.smartSuggestion}
                    </Typography>
                  </Stack>
                </Box>
              )}

              {/* Action Button */}
              {notification.actionLabel && notification.onAction && (
                <Button
                  size="small"
                  variant="outlined"
                  color={notificationTypeConfig.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    notification.onAction?.();
                  }}
                  sx={{ mt: 1 }}
                >
                  {notification.actionLabel}
                </Button>
              )}
            </Box>
          </Stack>

          {/* User Engagement Prediction */}
          {showAiInsights && notification.userEngagement && (
            <Box sx={{ mt: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 0.5 }}
              >
                <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  Probabilidad de interés: {notification.userEngagement}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={notification.userEngagement}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.2),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'success.main',
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const IntelligentNotificationCenter: React.FC<
  IntelligentNotificationCenterProps
> = ({
  notifications,
  isOpen,
  currentFilter = 'all',
  onFilterChange,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onClose,
  notificationStats,
  className,
}) => {
  const theme = useTheme();
  const [showAiInsights, setShowAiInsights] = useState(false);

  // 🎯 Filtrar y ordenar notificaciones inteligentemente
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Aplicar filtros
    switch (currentFilter) {
      case 'unread':
        filtered = filtered.filter((n) => !n.isRead);
        break;
      case 'high':
        filtered = filtered.filter((n) =>
          ['high', 'critical'].includes(n.priority)
        );
        break;
      case 'critical':
        filtered = filtered.filter((n) => n.priority === 'critical');
        break;
      case 'smart':
        filtered = filtered.filter((n) => n.aiScore && n.aiScore > 70);
        break;
    }

    // Ordenar por relevancia inteligente
    filtered.sort((a, b) => {
      // Primero por prioridad
      const priorityDiff =
        priorityConfig[b.priority].weight - priorityConfig[a.priority].weight;
      if (priorityDiff !== 0) return priorityDiff;

      // Luego por score IA si está disponible
      if (a.aiScore && b.aiScore) {
        return b.aiScore - a.aiScore;
      }

      // Finalmente por no leídas
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }

      return 0;
    });

    return filtered;
  }, [notifications, currentFilter]);

  const handleFilterChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
      if (newFilter && onFilterChange) {
        onFilterChange(newFilter as typeof currentFilter);
      }
    },
    [onFilterChange]
  );

  const handleNotificationClick = useCallback(
    (notification: IntelligentNotification) => {
      if (onNotificationClick) {
        onNotificationClick(notification);
      }
    },
    [onNotificationClick]
  );

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      if (onMarkAsRead) {
        onMarkAsRead(notificationId);
      }
    },
    [onMarkAsRead]
  );

  if (!isOpen) return null;

  return (
    <Box className={className}>
      <Card
        elevation={3}
        sx={{
          maxWidth: 600,
          maxHeight: 600,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Badge
                badgeContent={notificationStats?.unread || 0}
                color="error"
              >
                <NotificationsActiveIcon color="primary" />
              </Badge>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Centro de Notificaciones
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {filteredNotifications.length} de {notifications.length}{' '}
                  notificaciones
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Mostrar insights IA">
                <IconButton
                  size="small"
                  onClick={() => setShowAiInsights(!showAiInsights)}
                  sx={{
                    bgcolor: showAiInsights
                      ? alpha(theme.palette.info.main, 0.1)
                      : 'transparent',
                    color: showAiInsights ? 'info.main' : 'text.secondary',
                  }}
                >
                  <SmartToyIcon />
                </IconButton>
              </Tooltip>

              {onMarkAllAsRead && (
                <Tooltip title="Marcar todas como leídas">
                  <IconButton size="small" onClick={onMarkAllAsRead}>
                    <MarkEmailReadIcon />
                  </IconButton>
                </Tooltip>
              )}

              {onClearAll && (
                <Tooltip title="Limpiar todas">
                  <IconButton size="small" onClick={onClearAll}>
                    <DeleteSweepIcon />
                  </IconButton>
                </Tooltip>
              )}

              {onClose && (
                <IconButton size="small" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          </Stack>

          {/* Filters */}
          <Box sx={{ mt: 2 }}>
            <ToggleButtonGroup
              value={currentFilter}
              exclusive
              onChange={handleFilterChange}
              size="small"
              sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5 } }}
            >
              <ToggleButton value="all">
                Todas ({notifications.length})
              </ToggleButton>
              <ToggleButton value="unread">
                No leídas ({notificationStats?.unread || 0})
              </ToggleButton>
              <ToggleButton value="high">
                Alta prioridad ({notificationStats?.high || 0})
              </ToggleButton>
              <ToggleButton value="smart">IA Score &gt; 70%</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Notifications List */}
        <Box
          sx={{
            p: 2,
            maxHeight: 400,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: alpha(theme.palette.grey[300], 0.3),
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.primary.main, 0.5),
              borderRadius: 4,
            },
          }}
        >
          {filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsIcon
                sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary">
                No hay notificaciones para mostrar
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Cambia el filtro para ver más notificaciones
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onMarkAsRead={handleMarkAsRead}
                  showAiInsights={showAiInsights}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer con estadísticas */}
        {notificationStats && (
          <Box
            sx={{
              p: 1.5,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="center">
              <Chip
                icon={<StarIcon />}
                label={`Engagement: ${Math.round(notificationStats.avgEngagement || 0)}%`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<TrendingUpIcon />}
                label={`${notificationStats.high} alta prioridad`}
                size="small"
                color="warning"
                variant="outlined"
              />
            </Stack>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default IntelligentNotificationCenter;
