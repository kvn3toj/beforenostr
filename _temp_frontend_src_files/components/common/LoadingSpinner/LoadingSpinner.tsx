import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number | string;
  minHeight?: string | number;
  variant?: 'default' | 'centered' | 'inline';
}

export const LoadingSpinner = ({ 
  message = 'Cargando...', 
  size = 40,
  minHeight = '200px',
  variant = 'centered'
}: LoadingSpinnerProps) => {
  if (variant === 'inline') {
    return (
      <Box display="inline-flex" alignItems="center" gap={1}>
        <CircularProgress size={size} />
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight={minHeight}
      gap={2}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {message}
        </Typography>
      )}
    </Box>
  );
}; 