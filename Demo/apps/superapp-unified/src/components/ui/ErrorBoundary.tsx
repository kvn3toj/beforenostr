import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Reportar error a Sentry
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
      });
      scope.setLevel('error');
      
      const errorId = Sentry.captureException(error);
      this.setState({ errorId });
    });

    // Callback personalizado si se proporciona
    this.props.onError?.(error, errorInfo);

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.error('🚨 Error Boundary caught an error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            padding: 3,
            textAlign: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              maxWidth: 600,
              width: '100%',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <AlertTriangle
                size={64}
                color="#f44336"
                style={{ marginBottom: '16px' }}
              />
              <Typography variant="h4" component="h1" gutterBottom color="error">
                ¡Oops! Algo salió mal
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Ha ocurrido un error inesperado en la aplicación. Nuestro equipo ha sido notificado automáticamente.
              </Typography>
            </Box>

            {import.meta.env.DEV && this.state.error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Error de Desarrollo:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                  {this.state.error.message}
                </Typography>
              </Alert>
            )}

            {this.state.errorId && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  ID del Error: <code>{this.state.errorId}</code>
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Incluye este ID al reportar el problema.
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<RefreshCw size={20} />}
                onClick={this.handleRetry}
                color="primary"
              >
                Intentar Nuevamente
              </Button>
              <Button
                variant="outlined"
                startIcon={<Home size={20} />}
                onClick={this.handleGoHome}
                color="primary"
              >
                Ir al Inicio
              </Button>
            </Box>

            <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.disabled' }}>
              Si el problema persiste, por favor contacta al soporte técnico.
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// HOC para envolver componentes con Error Boundary fácilmente
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook para reportar errores manualmente
export const useErrorReporting = () => {
  const reportError = React.useCallback((error: Error, context?: Record<string, any>) => {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('manualReport', context);
      }
      scope.setTag('reportedManually', true);
      Sentry.captureException(error);
    });
  }, []);

  return { reportError };
};

export default ErrorBoundary; 