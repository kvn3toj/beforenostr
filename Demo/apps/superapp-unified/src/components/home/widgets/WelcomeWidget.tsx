import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';

// 🚀 REUTILIZAR EL COMPONENTE REVOLUCIONARIO EXISTENTE
import WelcomeHeaderRevolutionary from '../WelcomeHeaderRevolutionary';

interface WelcomeWidgetProps {
  onNotificationClick?: () => void;
  totalNotifications?: number;
}

export const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({
  onNotificationClick,
  totalNotifications = 0,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <WelcomeHeaderRevolutionary
        onNotificationClick={onNotificationClick}
        totalNotifications={totalNotifications}
      />
    </Box>
  );
};
