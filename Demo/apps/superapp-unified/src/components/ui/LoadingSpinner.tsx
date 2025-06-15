import React from 'react';
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  variant?: 'circular' | 'linear' | 'overlay';
  size?: 'small' | 'medium' | 'large';
  message?: string;
  progress?: number;
  className?: string;
  'data-testid'?: string;
  context?: 'dashboard' | 'marketplace' | 'search' | 'transaction' | 'authentication' | 'video' | 'general';
}

// Contextual messages for different loading contexts
const getContextualMessage = (context?: string, message?: string): string => {
  if (message) return message;
  
  switch (context) {
    case 'dashboard':
      return 'Cargando dashboard...';
    case 'marketplace':
      return 'Cargando marketplace...';
    case 'search':
      return 'Buscando resultados...';
    case 'transaction':
      return 'Procesando transacción...';
    case 'authentication':
      return 'Verificando credenciales...';
    case 'video':
      return 'Cargando videos...';
    default:
      return 'Cargando...';
  }
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'circular',
  size = 'medium',
  message,
  progress,
  className,
  context = 'general',
  'data-testid': testId = 'loading-spinner',
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  const contextualMessage = getContextualMessage(context, message);

  if (variant === 'overlay') {
    return (
      <Box
        className={`loading-overlay contextual-loading system-loading ${className || ''}`}
        data-testid={testId}
        data-loading="true"
        data-contextual="overlay-loading"
        data-context-type="system-overlay"
        data-loading-variant="overlay"
        data-loading-context={context}
        data-responsive="fullscreen-overlay"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          zIndex: 9999,
        }}
      >
        <CircularProgress 
          className="spinner loading contextual-progress overlay-spinner" 
          size={getSize()} 
          sx={{ color: 'white' }}
          data-contextual="loading-animation"
          data-context-type="circular-progress"
          data-loading-context={context}
        />
        <Typography 
          variant="body1" 
          sx={{ color: 'white', textAlign: 'center', maxWidth: '80%' }}
          className="loading-message contextual-text"
          data-contextual="loading-message"
          data-context-type="status-text"
          data-loading-context={context}
        >
          {contextualMessage}
        </Typography>
      </Box>
    );
  }

  if (variant === 'linear') {
    return (
      <Box 
        className={`loading-progress contextual-loading ${className || ''}`}
        data-testid={testId}
        data-loading="true"
        data-contextual="linear-loading"
        data-context-type="progress-indicator"
        data-loading-variant="linear"
        data-loading-context={context}
        data-responsive="progress-bar"
        sx={{ width: '100%', mb: 2 }}
      >
        <LinearProgress 
          className="progress-bar loading contextual-progress linear-progress"
          variant={progress !== undefined ? 'determinate' : 'indeterminate'}
          value={progress}
          data-contextual="progress-animation"
          data-context-type="linear-progress"
          data-progress-type={progress !== undefined ? 'determinate' : 'indeterminate'}
          data-loading-context={context}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              transition: 'background-color 0.3s ease-in-out, transform 0.5s ease-out'
            }
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ mt: 1, display: 'block', textAlign: 'center' }}
          className="loading-message contextual-text progress-caption"
          data-contextual="progress-message"
          data-context-type="status-caption"
          data-loading-context={context}
        >
          {contextualMessage}
          {progress !== undefined && ` (${Math.round(progress)}%)`}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className={`loading-spinner contextual-loading ${className || ''}`}
      data-testid={testId}
      data-loading="true"
      data-contextual="circular-loading"
      data-context-type="inline-spinner"
      data-loading-variant="circular"
      data-loading-size={size}
      data-loading-context={context}
      data-responsive="inline-spinner"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        p: 2,
      }}
    >
      <CircularProgress 
        className="spinner loading contextual-progress circular-spinner" 
        size={getSize()}
        data-contextual="loading-animation"
        data-context-type="circular-progress"
        data-spinner-size={size}
        data-loading-context={context}
        sx={{
          ...(context === 'transaction' && { color: 'success.main' }),
          ...(context === 'search' && { color: 'primary.main' }),
          ...(context === 'marketplace' && { color: 'secondary.main' }),
        }}
      />
      <Typography 
        variant="body2" 
        sx={{ textAlign: 'center', maxWidth: '200px' }}
        className="loading-message contextual-text spinner-caption"
        data-contextual="spinner-message"
        data-context-type="status-text"
        data-loading-context={context}
      >
        {contextualMessage}
      </Typography>
    </Box>
  );
};

// ✅ SOLUCIÓN: Añadir exportación por defecto para React.lazy()
export default LoadingSpinner; 