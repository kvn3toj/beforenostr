import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';

// 🚀 REUTILIZAR EL COMPONENTE REVOLUCIONARIO EXISTENTE
import NotificationCenterRevolutionary from '../NotificationCenterRevolutionary';

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

interface NotificationsWidgetProps {
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  onNotificationClick,
  onMarkAllRead,
  onViewAll,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <NotificationCenterRevolutionary
        onNotificationClick={onNotificationClick}
        onMarkAllRead={onMarkAllRead}
        onViewAll={onViewAll}
      />
    </Box>
  );
};
