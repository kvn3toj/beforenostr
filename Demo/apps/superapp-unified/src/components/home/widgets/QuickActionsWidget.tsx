import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';

// 🚀 REUTILIZAR EL COMPONENTE REVOLUCIONARIO EXISTENTE
import QuickActionsGridRevolutionary from '../QuickActionsGridRevolutionary';

interface QuickActionsWidgetProps {
  onActionClick?: (action: string) => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  onActionClick,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <QuickActionsGridRevolutionary onActionClick={onActionClick} />
    </Box>
  );
};
