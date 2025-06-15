import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

export type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: LiveRegionPoliteness;
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  id?: string;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'additions text',
  id,
  className,
}) => {
  const regionRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={regionRef}
      id={id}
      className={className}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      sx={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        // Solo visible para lectores de pantalla
        '&:not(:focus):not(:active)': {
          clipPath: 'inset(50%)',
          border: 0,
          padding: 0,
          margin: '-1px',
        }
      }}
    >
      {children}
    </Box>
  );
};

// Componente especializado para mensajes de estado
interface StatusRegionProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  visible?: boolean;
}

export const StatusRegion: React.FC<StatusRegionProps> = ({
  message,
  type = 'info',
  visible = true,
}) => {
  const politeness: LiveRegionPoliteness = type === 'error' ? 'assertive' : 'polite';
  
  if (!visible || !message) {
    return null;
  }

  return (
    <LiveRegion politeness={politeness} atomic={true}>
      {message}
    </LiveRegion>
  );
};

// Hook para manejar anuncios dinámicos
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = React.useState<string>('');
  
  const announce = React.useCallback((message: string) => {
    // Limpiar primero para asegurar que el cambio sea detectado
    setAnnouncement('');
    
    // Usar requestAnimationFrame para asegurar que el cambio se procese
    requestAnimationFrame(() => {
      setAnnouncement(message);
    });
  }, []);

  const clearAnnouncement = React.useCallback(() => {
    setAnnouncement('');
  }, []);

  return {
    announcement,
    announce,
    clearAnnouncement,
    AnnouncementRegion: () => (
      <StatusRegion 
        message={announcement} 
        visible={!!announcement}
      />
    )
  };
}; 