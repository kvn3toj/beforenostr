import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert,
  Stack
} from '@mui/material';
import { BugReport, Analytics, Speed, Visibility } from '@mui/icons-material';
import { useMonitoring } from '../../hooks/useMonitoring';

// 🧪 COMPONENTE DE TESTING - Solo para verificación de monitoreo
// Este componente demuestra cómo usar todos los hooks de monitoreo
// Remover antes de producción o incluir solo en modo desarrollo

const MonitoringTestComponent: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    reportButtonClick,
    reportFormSubmission,
    reportAsyncError,
    trackAsyncOperation,
    trackFeatureUsage,
    reportUIError,
  } = useMonitoring();

  // Demostrar tracking de performance de componente
  React.useEffect(() => {
    trackFeatureUsage('monitoring_test_component', {
      component_loaded: true,
      timestamp: new Date().toISOString()
    });
  }, [trackFeatureUsage]);

  // Test de reporte de error manual
  const handleErrorTest = () => {
    try {
      reportButtonClick('error_test_button', 'monitoring_test');
      
      // Simular un error
      throw new Error('Test error for monitoring verification');
    } catch (error) {
      reportUIError(error as Error, 'MonitoringTestComponent', 'error_test');
    }
  };

  // Test de operación asíncrona con tracking
  const handleAsyncTest = async () => {
    setIsLoading(true);
    reportButtonClick('async_test_button', 'monitoring_test');
    
    try {
      await trackAsyncOperation('test_async_operation', async () => {
        // Simular operación lenta
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true };
      });
      
      alert('✅ Operación async completada - revisa Sentry Performance');
    } catch (error) {
      await reportAsyncError(async () => {
        throw new Error('Async operation failed');
      }, { 
        operation_type: 'test',
        component: 'MonitoringTestComponent'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test de formulario con tracking
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = formData.name && formData.email;
    const errors = [];
    
    if (!formData.name) errors.push('Name is required');
    if (!formData.email) errors.push('Email is required');
    
    reportFormSubmission('monitoring_test_form', isValid, errors);
    
    if (isValid) {
      alert('✅ Formulario enviado - revisa GA4 Events');
      setFormData({ name: '', email: '' });
    }
  };

  // Test de tracking de feature específico
  const handleFeatureTest = () => {
    reportButtonClick('feature_test_button', 'monitoring_test');
    
    trackFeatureUsage('test_feature_usage', {
      feature_type: 'button_interaction',
      user_action: 'click',
      test_mode: true,
      form_data: formData,
    });
    
    alert('✅ Feature usage tracked - revisa GA4 Custom Events');
  };

  if (!import.meta.env.DEV) {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3, 
        m: 2, 
        border: '2px dashed #ff9800',
        backgroundColor: '#fff3e0'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReport color="warning" />
        🧪 Monitoring Test Component
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Modo Desarrollo:</strong> Este componente es solo para testing de monitoreo. 
        Revisa Sentry y GA4 dashboards después de cada test.
      </Alert>

      <Stack spacing={3}>
        {/* Test de Error Tracking */}
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BugReport color="error" />
            Error Tracking Test
          </Typography>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleErrorTest}
            startIcon={<BugReport />}
          >
            Generar Error de Prueba
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Esto generará un error que aparecerá en Sentry
          </Typography>
        </Box>

        {/* Test de Performance Tracking */}
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Speed color="primary" />
            Performance Tracking Test
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAsyncTest}
            disabled={isLoading}
            startIcon={<Speed />}
          >
            {isLoading ? 'Ejecutando...' : 'Test Operación Async (2s)'}
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Esto medirá performance y aparecerá en Sentry Performance
          </Typography>
        </Box>

        {/* Test de Form Tracking */}
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Analytics color="success" />
            Form Analytics Test
          </Typography>
          
          <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              size="small"
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              size="small"
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="success"
              startIcon={<Analytics />}
            >
              Enviar Test Form
            </Button>
          </Box>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Esto rastreará envío de formulario en GA4
          </Typography>
        </Box>

        {/* Test de Feature Usage */}
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Visibility color="info" />
            Feature Usage Test
          </Typography>
          <Button 
            variant="contained" 
            color="info"
            onClick={handleFeatureTest}
            startIcon={<Visibility />}
          >
            Track Feature Usage
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Esto enviará evento personalizado a GA4
          </Typography>
        </Box>
      </Stack>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          📊 Verificación de Dashboards:
        </Typography>
        <Typography variant="body2">
          • <strong>Sentry:</strong> Issues → Errores, Performance → Métricas<br/>
          • <strong>GA4:</strong> Realtime → Eventos, Events → Custom events<br/>
          • <strong>DevTools:</strong> Console → Logs de monitoreo
        </Typography>
      </Alert>
    </Paper>
  );
};

export default MonitoringTestComponent; 