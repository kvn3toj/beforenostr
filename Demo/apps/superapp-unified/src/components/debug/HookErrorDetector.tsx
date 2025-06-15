import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Button, Card, CardContent, Chip } from '@mui/material';
import { BugReport, Warning, CheckCircle } from '@mui/icons-material';

interface HookErrorDetectorProps {
  errorId?: string;
}

const HookErrorDetector: React.FC<HookErrorDetectorProps> = ({ errorId }) => {
  const [detectedError, setDetectedError] = useState<string | null>(null);
  const [componentStack, setComponentStack] = useState<string>('');
  const [errorCount, setErrorCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState<number>(0);

  useEffect(() => {
    // Interceptar errores de React
    const originalError = console.error;
    
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      
      // Detectar errores específicos de hooks
      if (errorMessage.includes('Rendered more hooks than during the previous render') ||
          errorMessage.includes('Rendered fewer hooks than expected') ||
          errorMessage.includes('Invalid hook call')) {
       
        const now = Date.now();
        setDetectedError(errorMessage);
        setErrorCount(prev => prev + 1);
        setLastErrorTime(now);
       
        // Intentar extraer el stack trace
        if (args.length > 1 && typeof args[1] === 'object') {
          setComponentStack(args[1]?.componentStack || '');
        }
       
        // Log detallado para debugging
        console.log('🚨 HOOK ERROR DETECTED:', {
          errorId,
          message: errorMessage,
          timestamp: new Date(now).toISOString(),
          count: errorCount + 1,
          stack: args[1]?.componentStack
        });
      }
     
      // Llamar al console.error original
      originalError.apply(console, args);
    };

    // Cleanup
    return () => {
      console.error = originalError;
    };
  }, [errorId, errorCount]);

  // Auto-clear después de 30 segundos
  useEffect(() => {
    if (detectedError) {
      const timer = setTimeout(() => {
        setDetectedError(null);
        setComponentStack('');
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [detectedError]);

  const handleClearError = () => {
    setDetectedError(null);
    setComponentStack('');
    setErrorCount(0);
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!detectedError) {
    return (
      <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
        <Chip 
          icon={<CheckCircle />} 
          label="Hook Monitor: OK" 
          color="success" 
          size="small"
          variant="outlined"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      zIndex: 9999,
      maxWidth: 400,
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BugReport />
            <Typography variant="h6" fontWeight="bold">
              🪝 Error de Hooks Detectado
            </Typography>
          </Box>
          
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              ID: {errorId || 'No especificado'}
            </Typography>
            <Typography variant="body2">
              Ocurrencias: {errorCount}
            </Typography>
            <Typography variant="body2">
              Último: {new Date(lastErrorTime).toLocaleTimeString()}
            </Typography>
          </Alert>

          <Typography variant="subtitle2" gutterBottom>
            📋 Mensaje de Error:
          </Typography>
          <Box sx={{ 
            bgcolor: 'rgba(0,0,0,0.1)', 
            p: 1, 
            borderRadius: 1, 
            mb: 2,
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            wordBreak: 'break-word'
          }}>
            {detectedError}
          </Box>

          {componentStack && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                🔍 Stack de Componentes:
              </Typography>
              <Box sx={{ 
                bgcolor: 'rgba(0,0,0,0.1)', 
                p: 1, 
                borderRadius: 1, 
                mb: 2,
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                maxHeight: 150,
                overflow: 'auto'
              }}>
                {componentStack}
              </Box>
            </>
          )}

          <Typography variant="subtitle2" gutterBottom>
            🛠️ Soluciones Comunes:
          </Typography>
          <Box sx={{ fontSize: '0.8rem', mb: 2 }}>
            • Mover todos los hooks al inicio del componente<br/>
            • Eliminar early returns antes de hooks<br/>
            • No usar hooks dentro de condicionales<br/>
            • Verificar orden consistente de hooks
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant="contained" 
              onClick={handleClearError}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
            >
              Limpiar
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleReload}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white'
              }}
            >
              Recargar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HookErrorDetector; 