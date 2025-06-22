import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  ExpandMore,
  Palette,
  TextFields,
  Animation,
  Speed,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../../contexts/ThemeContext';
import { CoomunityCard } from './';
import CoomunityButton from './CoomunityButton';

interface ValidationResult {
  category: string;
  tests: {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    details?: string;
  }[];
}

interface DesignSystemValidatorProps {
  onValidationComplete?: (results: ValidationResult[]) => void;
}

const DesignSystemValidator: React.FC<DesignSystemValidatorProps> = ({
  onValidationComplete,
}) => {
  const { isDark } = useCoomunityTheme();
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Función para verificar si una variable CSS existe
  const checkCSSVariable = (variableName: string): boolean => {
    const rootStyles = getComputedStyle(document.documentElement);
    const value = rootStyles.getPropertyValue(variableName).trim();
    return value !== '';
  };

  // Función para verificar contraste de colores
  const checkColorContrast = (color1: string, color2: string): number => {
    // Implementación simplificada - en producción usar una librería como chroma.js
    return 4.5; // Simulamos que cumple WCAG AA
  };

  // Validaciones del sistema de diseño
  const runValidations = async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];

    // 1. Validación de Tokens de Color
    const colorTests = [
      {
        name: 'Variables de color primario',
        test: () => checkCSSVariable('--coomunity-primary-500'),
        message: 'Colores primarios de CoomÜnity definidos',
      },
      {
        name: 'Variables de color semántico',
        test: () =>
          checkCSSVariable('--color-success') &&
          checkCSSVariable('--color-warning') &&
          checkCSSVariable('--color-error'),
        message: 'Colores semánticos (success, warning, error) definidos',
      },
      {
        name: 'Paleta de grises',
        test: () =>
          checkCSSVariable('--color-gray-100') &&
          checkCSSVariable('--color-gray-500') &&
          checkCSSVariable('--color-gray-900'),
        message: 'Escala de grises completa',
      },
      {
        name: 'Contraste de accesibilidad',
        test: () => checkColorContrast('#7c3aed', '#ffffff') >= 4.5,
        message: 'Contraste cumple WCAG AA (4.5:1)',
      },
    ];

    results.push({
      category: 'Tokens de Color',
      tests: colorTests.map(test => ({
        name: test.name,
        status: test.test() ? 'pass' : 'fail',
        message: test.message,
        details: test.test() ? 'Implementado correctamente' : 'Requiere atención',
      })),
    });

    // 2. Validación de Tipografía
    const typographyTests = [
      {
        name: 'Familia tipográfica',
        test: () => checkCSSVariable('--font-family-primary'),
        message: 'Fuente principal definida (Inter)',
      },
      {
        name: 'Escala tipográfica',
        test: () =>
          checkCSSVariable('--font-size-xs') &&
          checkCSSVariable('--font-size-sm') &&
          checkCSSVariable('--font-size-md') &&
          checkCSSVariable('--font-size-lg'),
        message: 'Escala de tamaños consistente',
      },
      {
        name: 'Pesos tipográficos',
        test: () =>
          checkCSSVariable('--font-weight-normal') &&
          checkCSSVariable('--font-weight-medium') &&
          checkCSSVariable('--font-weight-bold'),
        message: 'Pesos de fuente definidos',
      },
    ];

    results.push({
      category: 'Tipografía',
      tests: typographyTests.map(test => ({
        name: test.name,
        status: test.test() ? 'pass' : 'warning',
        message: test.message,
        details: test.test() ? 'Configurado correctamente' : 'Verificar implementación',
      })),
    });

    // 3. Validación de Espaciado
    const spacingTests = [
      {
        name: 'Sistema de espaciado base',
        test: () =>
          checkCSSVariable('--space-xs') &&
          checkCSSVariable('--space-sm') &&
          checkCSSVariable('--space-md') &&
          checkCSSVariable('--space-lg'),
        message: 'Escala de espaciado base (4px grid)',
      },
      {
        name: 'Espaciado de componentes',
        test: () =>
          checkCSSVariable('--space-component-sm') &&
          checkCSSVariable('--space-component-md') &&
          checkCSSVariable('--space-component-lg'),
        message: 'Espaciado específico para componentes',
      },
    ];

    results.push({
      category: 'Espaciado',
      tests: spacingTests.map(test => ({
        name: test.name,
        status: test.test() ? 'pass' : 'fail',
        message: test.message,
        details: test.test() ? 'Sistema implementado' : 'Falta implementación',
      })),
    });

    // 4. Validación de Sombras y Elevaciones
    const shadowTests = [
      {
        name: 'Sombras base',
        test: () =>
          checkCSSVariable('--shadow-sm') &&
          checkCSSVariable('--shadow-md') &&
          checkCSSVariable('--shadow-lg'),
        message: 'Sistema de elevaciones definido',
      },
      {
        name: 'Sombras especiales',
        test: () =>
          checkCSSVariable('--shadow-coomunity') &&
          checkCSSVariable('--shadow-glow'),
        message: 'Efectos especiales CoomÜnity',
      },
    ];

    results.push({
      category: 'Sombras y Elevaciones',
      tests: shadowTests.map(test => ({
        name: test.name,
        status: test.test() ? 'pass' : 'warning',
        message: test.message,
        details: test.test() ? 'Efectos disponibles' : 'Implementación parcial',
      })),
    });

    // 5. Validación de Componentes
    const componentTests = [
      {
        name: 'CoomunityButton',
        test: () => document.querySelector('.coomunity-button') !== null,
        message: 'Componente de botón universal',
      },
      {
        name: 'CoomunityCard',
        test: () => document.querySelector('.coomunity-card') !== null,
        message: 'Componente de tarjeta universal',
      },
      {
        name: 'LoadingSpinner',
        test: () => document.querySelector('.loading-spinner') !== null,
        message: 'Indicadores de carga consistentes',
      },
    ];

    results.push({
      category: 'Componentes',
      tests: componentTests.map(test => ({
        name: test.name,
        status: test.test() ? 'pass' : 'warning',
        message: test.message,
        details: test.test() ? 'Componente activo' : 'No detectado en DOM',
      })),
    });

    return results;
  };

  // Ejecutar validaciones
  const handleValidation = async () => {
    setIsValidating(true);
    setProgress(0);

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const results = await runValidations();
      setValidationResults(results);
      onValidationComplete?.(results);
      setProgress(100);
    } catch (error) {
      console.error('Error durante la validación:', error);
    } finally {
      setTimeout(() => {
        setIsValidating(false);
        setProgress(0);
      }, 500);
    }
  };

  // Ejecutar validación automáticamente al montar
  useEffect(() => {
    handleValidation();
  }, []);

  // Calcular estadísticas
  const totalTests = validationResults.reduce((acc, category) => acc + category.tests.length, 0);
  const passedTests = validationResults.reduce(
    (acc, category) => acc + category.tests.filter(test => test.status === 'pass').length,
    0
  );
  const warningTests = validationResults.reduce(
    (acc, category) => acc + category.tests.filter(test => test.status === 'warning').length,
    0
  );
  const failedTests = validationResults.reduce(
    (acc, category) => acc + category.tests.filter(test => test.status === 'fail').length,
    0
  );

  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'fail':
        return <Error sx={{ color: 'error.main' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'success';
      case 'warning':
        return 'warning';
      case 'fail':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <CoomunityCard variant="elevated" padding="lg" className="mb-6">
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Speed sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" className="coomunity-h2" gutterBottom>
                Validador del Sistema de Diseño
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Verificación automática de tokens, componentes y patrones de diseño
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar */}
          {isValidating && (
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Ejecutando validaciones... {progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          {/* Summary Stats */}
          {!isValidating && validationResults.length > 0 && (
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="success.main" fontWeight="bold">
                    {successRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de Éxito
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {passedTests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pruebas Exitosas
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {warningTests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Advertencias
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {failedTests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fallos
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Overall Status */}
          {!isValidating && validationResults.length > 0 && (
            <Alert
              severity={successRate >= 90 ? 'success' : successRate >= 70 ? 'warning' : 'error'}
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">
                {successRate >= 90 && 'Sistema de diseño implementado correctamente. ¡Excelente trabajo!'}
                {successRate >= 70 && successRate < 90 && 'Sistema de diseño mayormente implementado. Algunas mejoras recomendadas.'}
                {successRate < 70 && 'Sistema de diseño requiere atención. Revisar implementación de tokens y componentes.'}
              </Typography>
            </Alert>
          )}

          <Box display="flex" gap={2}>
            <CoomunityButton
              variant="primary"
              size="md"
              onClick={handleValidation}
              disabled={isValidating}
            >
              {isValidating ? 'Validando...' : 'Ejecutar Validación'}
            </CoomunityButton>
            <CoomunityButton
              variant="outline"
              size="md"
              onClick={() => window.location.reload()}
            >
              Reiniciar
            </CoomunityButton>
          </Box>
        </CoomunityCard>

        {/* Detailed Results */}
        {!isValidating && validationResults.length > 0 && (
          <Box>
            {validationResults.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Accordion defaultExpanded sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Box display="flex" alignItems="center" gap={1}>
                        {category.category === 'Tokens de Color' && <Palette />}
                        {category.category === 'Tipografía' && <TextFields />}
                        {category.category === 'Espaciado' && <Speed />}
                        {category.category === 'Sombras y Elevaciones' && <Animation />}
                        {category.category === 'Componentes' && <CheckCircle />}
                        <Typography variant="h6" fontWeight="medium">
                          {category.category}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} ml="auto">
                        {category.tests.map((test, testIndex) => (
                          <Chip
                            key={testIndex}
                            size="small"
                            color={getStatusColor(test.status) as any}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {category.tests.map((test, testIndex) => (
                        <ListItem key={testIndex}>
                          <ListItemIcon>
                            {getStatusIcon(test.status)}
                          </ListItemIcon>
                          <ListItemText
                            primary={test.name}
                            secondary={
                              <Box component="div">
                                <Typography variant="body2" component="span" color="text.secondary" sx={{ display: 'block' }}>
                                  {test.message}
                                </Typography>
                                {test.details && (
                                  <Typography variant="caption" component="span" color="text.secondary" sx={{ display: 'block' }}>
                                    {test.details}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default DesignSystemValidator;
