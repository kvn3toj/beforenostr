import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Alert, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class HookErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generar ID único para el error
    const errorId = Math.random().toString(36).substr(2, 9);
    
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Detectar específicamente errores de hooks
    const isHookError = error.message.includes('Rendered more hooks than during the previous render') ||
                       error.message.includes('Rendered fewer hooks than expected') ||
                       error.message.includes('Cannot read properties of undefined');

    console.error('🚨 Hook Error Boundary capturó un error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      isHookError,
      errorId: this.state.errorId,
    });

    this.setState({
      error,
      errorInfo,
    });

    // Reportar error específico de hooks
    if (isHookError) {
      this.reportHookError(error, errorInfo);
    }
  }

  private reportHookError = (error: Error, errorInfo: ErrorInfo) => {
    const report = {
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      type: 'HOOK_VIOLATION',
    };

    // Log detallado para debugging
    console.group('🔍 HOOK ERROR ANALYSIS');
    console.error('Error Message:', error.message);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);
    console.error('Full Report:', report);
    console.groupEnd();

    // Guardar en localStorage para debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('hook_errors') || '[]');
      existingErrors.push(report);
      localStorage.setItem('hook_errors', JSON.stringify(existingErrors.slice(-10))); // Mantener solo los últimos 10
    } catch (e) {
      console.warn('No se pudo guardar el error en localStorage:', e);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const isHookError = this.state.error?.message.includes('Rendered more hooks than during the previous render');

      return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
          <Alert 
            severity="error" 
            icon={<BugReport />}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              {isHookError ? '🪝 Error de Hooks de React' : '💥 Error de Componente'}
            </Typography>
            <Typography variant="body2">
              {isHookError 
                ? 'Se detectó una violación de las Reglas de Hooks de React. Esto ocurre cuando los hooks se ejecutan en un orden diferente entre renders.'
                : 'Se produjo un error inesperado en el componente.'
              }
            </Typography>
            {this.state.errorId && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', fontFamily: 'monospace' }}>
                ID del Error: {this.state.errorId}
              </Typography>
            )}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" onClick={this.handleReload}>
              Recargar Página
            </Button>
            <Button variant="outlined" onClick={this.handleReset}>
              Intentar Continuar
            </Button>
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Detalles Técnicos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Mensaje de Error:
                </Typography>
                <Box sx={{ 
                  bgcolor: 'grey.100', 
                  p: 2, 
                  borderRadius: 1, 
                  mb: 2,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error?.message}
                </Box>

                {isHookError && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Posibles Causas:
                    </Typography>
                    <Box sx={{ bgcolor: 'warning.light', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" component="div">
                        • Hooks dentro de condicionales (if statements)<br/>
                        • Early returns antes de declarar todos los hooks<br/>
                        • Hooks dentro de loops o funciones anidadas<br/>
                        • Hooks condicionales basados en estado<br/>
                        • Componentes que cambian el número de hooks entre renders
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Solución Recomendada:
                    </Typography>
                    <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" component="div">
                        1. Mover todos los hooks al inicio del componente<br/>
                        2. Colocar early returns DESPUÉS de todos los hooks<br/>
                        3. Usar variables calculadas en lugar de early returns<br/>
                        4. Verificar que no hay hooks dentro de condicionales
                      </Typography>
                    </Box>
                  </>
                )}

                <Typography variant="subtitle2" gutterBottom>
                  Stack de Componentes:
                </Typography>
                <Box sx={{ 
                  bgcolor: 'grey.100', 
                  p: 2, 
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.75rem',
                  maxHeight: 200,
                  overflow: 'auto'
                }}>
                  {this.state.errorInfo?.componentStack}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default HookErrorBoundary; 