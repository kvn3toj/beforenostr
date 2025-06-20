import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { ErrorOutline, Refresh, Home } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  errorId?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class VideoPlayerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: props.errorId || this.generateErrorId(),
    };
  }

  private generateErrorId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: Math.random().toString(36).substr(2, 9),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🎬 Video Player Error Boundary caught an error:', {
      errorId: this.state.errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      error,
      errorInfo,
    });

    // Dispatch custom event for error tracking
    window.dispatchEvent(
      new CustomEvent('component-error', {
        detail: {
          errorId: this.state.errorId,
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: Date.now(),
          component: 'VideoPlayerErrorBoundary',
        },
      })
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            p: 3,
          }}
        >
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

              <Typography variant="h5" component="h1" gutterBottom>
                Error del Reproductor de Video
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                Se produjo un error inesperado en el componente del reproductor.
              </Typography>

              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2" fontWeight="bold">
                  ID del Error: {this.state.errorId}
                </Typography>
                {this.state.error && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {this.state.error.message}
                  </Typography>
                )}
              </Alert>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  onClick={this.handleRetry}
                  startIcon={<Refresh />}
                  sx={{ minWidth: 120 }}
                >
                  Reintentar
                </Button>

                <Button
                  variant="outlined"
                  onClick={this.handleReload}
                  startIcon={<Refresh />}
                  sx={{ minWidth: 120 }}
                >
                  Recargar Página
                </Button>

                <Button
                  variant="outlined"
                  onClick={this.handleGoHome}
                  startIcon={<Home />}
                  sx={{ minWidth: 120 }}
                >
                  Ir al Inicio
                </Button>
              </Box>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ mt: 3, textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    🔍 Información de Debug:
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      maxHeight: 200,
                      overflow: 'auto',
                    }}
                  >
                    {this.state.error.stack}
                  </Box>

                  {this.state.errorInfo && (
                    <>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ mt: 2 }}
                      >
                        📋 Component Stack:
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: 'grey.100',
                          p: 2,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          maxHeight: 150,
                          overflow: 'auto',
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default VideoPlayerErrorBoundary;
