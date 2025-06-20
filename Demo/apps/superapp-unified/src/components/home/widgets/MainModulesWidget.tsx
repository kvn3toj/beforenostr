import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';

// 🚀 REUTILIZAR EL COMPONENTE REVOLUCIONARIO EXISTENTE
import ModuleCardsRevolutionary from '../ModuleCardsRevolutionary';

interface MainModulesWidgetProps {
  onModuleClick?: (moduleId: string) => void;
}

export const MainModulesWidget: React.FC<MainModulesWidgetProps> = ({
  onModuleClick,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <ModuleCardsRevolutionary onModuleClick={onModuleClick} />
    </Box>
  );
};
