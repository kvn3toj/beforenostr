/**
 * 🛡️ MODULE ERROR BOUNDARY
 * 
 * Error Boundary específico para manejar errores de importación de módulos
 * como "Importing a module script failed" especialmente en Safari móvil
 */

import React, { Component, ReactNode } from 'react';
import { Box, Button, Typography, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';

interface ModuleErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
}

interface ModuleErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
  onError?: (error: Error, errorInfo: any) => void;
  maxRetries?: number;
}

export class ModuleErrorBoundary extends Component<ModuleErrorBoundaryProps, ModuleErrorBoundaryState> {
  private retryTimer: NodeJS.Timeout | null = null;

  constructor(props: ModuleErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ModuleErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ModuleErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Llamar callback de error si está definido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Reportar a Sentry si está disponible
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          errorBoundary: {
            moduleName: this.props.moduleName || 'unknown',
            errorInfo,
            retryCount: this.state.retryCount
          }
        },
        tags: {
          errorBoundary: 'ModuleErrorBoundary',
          errorType: 'module_import_failed',
          errorId: 'd73c7abcef814601834bd32cfc780bc8'
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  private isModuleImportError = (error: Error): boolean => {
    const message = error.message.toLowerCase();
    return (
      message.includes('importing a module script failed') ||
      message.includes('failed to fetch dynamically imported module') ||
      message.includes('loading chunk') ||
      message.includes('dynamic import') ||
      message.includes('module script failed')
    );
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      console.log(`Retrying module load (${retryCount + 1}/${maxRetries})...`);
      
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));

      // Reintentar después de un delay
      this.retryTimer = setTimeout(() => {
        window.location.reload();
      }, 1000 * (retryCount + 1)); // Backoff exponencial
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { children, fallback, moduleName, maxRetries = 3 } = this.props;

    if (hasError && error) {
      // Si hay un fallback personalizado, usarlo
      if (fallback) {
        return fallback;
      }

      const isModuleError = this.isModuleImportError(error);
      const canRetry = retryCount < maxRetries;

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: 3,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            margin: 2
          }}
        >
          {/* Icono y título principal */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 1 }}>
              🔧
            </Typography>
            <Typography variant="h5" gutterBottom color="error">
              Error al cargar el módulo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {moduleName ? `Módulo: ${moduleName}` : 'Módulo desconocido'}
            </Typography>
          </Box>

          {/* Mensaje específico para errores de importación de módulos */}
          {isModuleError && (
            <Alert severity="warning" sx={{ mb: 3, maxWidth: 600 }}>
              <Typography variant="body2">
                Este error es común en Safari móvil y navegadores con soporte limitado para módulos ES6.
                Intenta recargar la página o usar un navegador diferente.
              </Typography>
            </Alert>
          )}

          {/* Información del error */}
          <Box sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Error ID: d73c7abcef814601834bd32cfc780bc8
            </Typography>
            {retryCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                Intentos: {retryCount}/{maxRetries}
              </Typography>
            )}
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            {canRetry && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
              >
                Reintentar ({maxRetries - retryCount} restantes)
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
            >
              Recargar página
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={this.handleGoHome}
            >
              Ir al inicio
            </Button>
          </Box>

          {/* Detalles técnicos (colapsible) */}
          <Accordion sx={{ maxWidth: 600, width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">
                Detalles técnicos (para desarrolladores)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Error:</strong> {error.message}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Stack:</strong>
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    fontSize: '0.75rem',
                    backgroundColor: 'grey.100',
                    padding: 1,
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 200
                  }}
                >
                  {error.stack}
                </Box>
                {errorInfo && (
                  <>
                    <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                      <strong>Component Stack:</strong>
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        fontSize: '0.75rem',
                        backgroundColor: 'grey.100',
                        padding: 1,
                        borderRadius: 1,
                        overflow: 'auto',
                        maxHeight: 200
                      }}
                    >
                      {errorInfo.componentStack}
                    </Box>
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Información adicional para Safari móvil */}
          <Box sx={{ mt: 3, maxWidth: 600 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              💡 Tip: Si usas Safari en iOS, intenta activar "JavaScript" en 
              Configuración → Safari → Avanzado
            </Typography>
          </Box>
        </Box>
      );
    }

    return children;
  }
}

// Hook para usar el Error Boundary de forma más sencilla
export const useModuleErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Declarar Sentry en window para TypeScript
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, options?: any) => void;
    };
  }
} 