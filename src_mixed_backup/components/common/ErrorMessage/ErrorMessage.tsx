import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '../Icons';

interface ErrorMessageProps {
  title?: string;
  message: string;
  severity?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  retryLabel?: string;
  showRetry?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
}

export const ErrorMessage = ({
  title,
  message,
  severity = 'error',
  onRetry,
  retryLabel = 'Reintentar',
  showRetry = true,
  variant = 'standard'
}: ErrorMessageProps) => {
  return (
    <Alert 
      severity={severity} 
      variant={variant}
      sx={{ mt: 2 }}
      action={
        showRetry && onRetry ? (
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            startIcon={<RefreshIcon />}
          >
            {retryLabel}
          </Button>
        ) : undefined
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <Typography component="div" variant="body2">
        {message}
      </Typography>
    </Alert>
  );
}; 