import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { ExpandMore, BugReport, CheckCircle, Warning } from '@mui/icons-material';

interface HookCall {
  name: string;
  timestamp: number;
  component: string;
  order: number;
}

interface ComponentRender {
  component: string;
  timestamp: number;
  hookCount: number;
  hooks: HookCall[];
}

const HookDiagnostics: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [renders, setRenders] = useState<ComponentRender[]>([]);
  const [violations, setViolations] = useState<string[]>([]);
  const renderCountRef = useRef(0);
  const hookCallsRef = useRef<HookCall[]>([]);

  // Interceptar console.error para detectar errores de hooks
  useEffect(() => {
    if (!isEnabled) return;

    const originalError = console.error;
    
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      if (message.includes('Rendered more hooks than during the previous render') ||
          message.includes('Rendered fewer hooks than expected') ||
          message.includes('Cannot read properties of undefined')) {
        
        setViolations(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
        
        // Analizar el stack trace para identificar el componente problemático
        const stack = new Error().stack;
        if (stack) {
          const componentMatch = stack.match(/at (\w+) \(/);
          if (componentMatch) {
            console.group('🚨 HOOK VIOLATION DETECTED');
            console.error('Component:', componentMatch[1]);
            console.error('Message:', message);
            console.error('Stack:', stack);
            console.groupEnd();
          }
        }
      }
      
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, [isEnabled]);

  // Monitorear renders y hooks
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      // Simular detección de renders (en un entorno real, esto se haría con React DevTools)
      renderCountRef.current++;
      
      // Detectar patrones problemáticos
      const currentHooks = hookCallsRef.current;
      if (currentHooks.length > 0) {
        const componentGroups = currentHooks.reduce((acc, hook) => {
          if (!acc[hook.component]) {
            acc[hook.component] = [];
          }
          acc[hook.component].push(hook);
          return acc;
        }, {} as Record<string, HookCall[]>);

        Object.entries(componentGroups).forEach(([component, hooks]) => {
          const newRender: ComponentRender = {
            component,
            timestamp: Date.now(),
            hookCount: hooks.length,
            hooks: hooks.sort((a, b) => a.order - b.order),
          };

          setRenders(prev => [...prev.slice(-9), newRender]); // Mantener solo los últimos 10
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isEnabled]);

  const clearData = () => {
    setRenders([]);
    setViolations([]);
    hookCallsRef.current = [];
    renderCountRef.current = 0;
  };

  const analyzeHookPatterns = () => {
    const patterns = renders.reduce((acc, render) => {
      const key = `${render.component}-${render.hookCount}`;
      if (!acc[key]) {
        acc[key] = { component: render.component, hookCounts: [], renders: 0 };
      }
      acc[key].hookCounts.push(render.hookCount);
      acc[key].renders++;
      return acc;
    }, {} as Record<string, { component: string; hookCounts: number[]; renders: number }>);

    return Object.values(patterns).filter(pattern => {
      const uniqueCounts = [...new Set(pattern.hookCounts)];
      return uniqueCounts.length > 1; // Componente con número variable de hooks
    });
  };

  const suspiciousPatterns = analyzeHookPatterns();

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BugReport color="primary" />
              Diagnóstico de Hooks de React
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label="Habilitar Monitoreo"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Herramienta de diagnóstico para detectar violaciones de las Reglas de Hooks de React.
            ID del Error Reportado: <code>606a01429171495f976e60b10b376ee2</code>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={clearData}>
              Limpiar Datos
            </Button>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              color="warning"
            >
              Recargar Página
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Estado Actual */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Estado Actual
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={isEnabled ? <CheckCircle /> : <Warning />}
              label={`Monitoreo: ${isEnabled ? 'Activo' : 'Inactivo'}`}
              color={isEnabled ? 'success' : 'default'}
            />
            <Chip 
              label={`Renders Detectados: ${renders.length}`}
              color="info"
            />
            <Chip 
              label={`Violaciones: ${violations.length}`}
              color={violations.length > 0 ? 'error' : 'success'}
            />
            <Chip 
              label={`Patrones Sospechosos: ${suspiciousPatterns.length}`}
              color={suspiciousPatterns.length > 0 ? 'warning' : 'success'}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Violaciones Detectadas */}
      {violations.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="error">
              🚨 Violaciones de Hooks Detectadas
            </Typography>
            <List>
              {violations.map((violation, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={violation}
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'error.main'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Patrones Sospechosos */}
      {suspiciousPatterns.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="warning.main">
              ⚠️ Patrones Sospechosos Detectados
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Componentes que muestran un número variable de hooks entre renders:
            </Typography>
            <List>
              {suspiciousPatterns.map((pattern, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${pattern.component}`}
                    secondary={`Hook counts: [${[...new Set(pattern.hookCounts)].join(', ')}] en ${pattern.renders} renders`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Historial de Renders */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            Historial de Renders ({renders.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renders.length === 0 ? (
            <Alert severity="info">
              No hay datos de renders. Habilita el monitoreo y navega por la aplicación para recopilar datos.
            </Alert>
          ) : (
            <List>
              {renders.slice(-10).map((render, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${render.component} - ${render.hookCount} hooks`}
                    secondary={`${new Date(render.timestamp).toLocaleTimeString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Guía de Solución */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🛠️ Guía de Solución
          </Typography>
          <Typography variant="body2" paragraph>
            Si encuentras el error "Rendered more hooks than during the previous render", sigue estos pasos:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" paragraph>
              <strong>Identifica el componente:</strong> Revisa el stack trace en la consola del navegador.
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              <strong>Busca early returns:</strong> Asegúrate de que no hay <code>return</code> statements antes de declarar todos los hooks.
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              <strong>Revisa condicionales:</strong> Los hooks NO deben estar dentro de <code>if</code>, <code>for</code>, o funciones anidadas.
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              <strong>Orden consistente:</strong> Todos los hooks deben ejecutarse en el mismo orden en cada render.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HookDiagnostics; 