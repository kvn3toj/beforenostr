import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  Code,
  Palette,
  Architecture,
  Analytics,
  BugReport,
  Speed,
  School,
  Settings,
  Schedule,
  Balance,
  AutoAwesome,
  Extension,
  Storage,
  FormatPaint,
  FactCheck,
  Replay,
  Book,
  Public,
  AccessTime,
  Gavel,
  Nature,
  ContentCopy,
  Refresh,
  Timeline,
  TrendingUp,
  Memory,
  CloudDone,
  PlayArrow,
  CheckCircle,
  Warning,
  Error,
  Science,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Guardian {
  id: string;
  name: string;
  specialization: string;
  icon: React.ElementType;
  description: string;
  mission: string;
  key_files: string[];
  title: string;
  element: string;
  color: string;
}

interface GuardianPageProps {
  guardian: Guardian;
  onAction?: (action: string, details: any) => void;
}

// KIRA - Tejedora de Palabras
export const KiraPage: React.FC<GuardianPageProps> = ({ guardian, onAction }) => {
  const [documentText, setDocumentText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const words = documentText.split(' ').length;
      const sentences = documentText.split('.').length;
      const ayniScore = Math.floor(Math.random() * 100);
      const coherenceScore = Math.floor(Math.random() * 100);

      setAnalysisResult({
        words,
        sentences,
        ayniScore,
        coherenceScore,
        suggestions: [
          'Considerar agregar más referencias a la filosofía CoomÜnity',
          'Mejorar la fluidez narrativa en el párrafo 3',
          'Incluir ejemplos concretos de reciprocidad (Ayni)'
        ]
      });
      setIsAnalyzing(false);
      onAction?.('text_analysis', { words, sentences, ayniScore });
    }, 2000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64 }}>
          <guardian.icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color }}>
            {guardian.name} - Laboratorio de Palabras
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Donde las palabras cobran vida y se impregnan de consciencia
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📝 Análisis Consciente de Texto
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                placeholder="Pega aquí tu texto para analizar su coherencia filosófica..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={analyzeText}
                disabled={!documentText || isAnalyzing}
                startIcon={isAnalyzing ? <CircularProgress size={20} /> : <AutoAwesome />}
                fullWidth
              >
                {isAnalyzing ? 'Analizando Consciencia...' : 'Analizar Texto'}
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          {analysisResult && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📊 Análisis Completo
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Palabras: {analysisResult.words}</Typography>
                    <Typography variant="body2" color="text.secondary">Oraciones: {analysisResult.sentences}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" gutterBottom>Nivel de Ayni (Reciprocidad)</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={analysisResult.ayniScore}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">{analysisResult.ayniScore}%</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" gutterBottom>Coherencia Filosófica</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={analysisResult.coherenceScore}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">{analysisResult.coherenceScore}%</Typography>
                  </Box>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">💡 Sugerencias de KIRA</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        {analysisResult.suggestions.map((suggestion: string, index: number) => (
                          <Chip key={index} label={suggestion} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

// ZENO - Arquitecto de Experiencias
export const ZenoPage: React.FC<GuardianPageProps> = ({ guardian, onAction }) => {
  const [selectedFlow, setSelectedFlow] = useState('onboarding');
  const [currentSteps, setCurrentSteps] = useState<string[]>([]);

  const userFlows = {
    onboarding: ['Invitación recibida', 'Registro inicial', 'Verificación de email', 'Configuración de perfil', 'Primera interacción'],
    uplay: ['Selección de video', 'Reproducción interactiva', 'Participación en preguntas', 'Obtención de Mëritos', 'Feedback y reflexión'],
    marketplace: ['Exploración de ofertas', 'Evaluación de proveedores', 'Negociación Ayni', 'Intercambio de valor', 'Calificación mutua']
  };

  const addJourneyStep = (step: string) => {
    setCurrentSteps(prev => [...prev, step]);
    onAction?.('journey_step_added', { flow: selectedFlow, step });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64 }}>
          <guardian.icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color }}>
            {guardian.name} - Diseñador de Flujos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Creando experiencias que fluyen como la naturaleza
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🌊 Constructor de Flujos de Usuario
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" gutterBottom>Seleccionar Flujo:</Typography>
                  <Stack direction="row" spacing={1}>
                    {Object.keys(userFlows).map((flow) => (
                      <Chip
                        key={flow}
                        label={flow.charAt(0).toUpperCase() + flow.slice(1)}
                        clickable
                        color={selectedFlow === flow ? 'primary' : 'default'}
                        onClick={() => setSelectedFlow(flow)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Pasos predefinidos para {selectedFlow}:
                </Typography>
                <Stack spacing={1}>
                  {userFlows[selectedFlow as keyof typeof userFlows].map((step, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => addJourneyStep(step)}
                    >
                      <Typography variant="body2">{step}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🗺️ Viaje Construido
              </Typography>
              {currentSteps.length === 0 ? (
                <Alert severity="info">
                  Selecciona pasos del flujo para construir el viaje del usuario
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {currentSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Chip label={index + 1} size="small" color="primary" />
                          <Typography variant="body2">{step}</Typography>
                        </Stack>
                      </Paper>
                    </motion.div>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentSteps([])}
                    startIcon={<Refresh />}
                  >
                    Reiniciar Flujo
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

// ATLAS - Guardián de Infraestructura
export const AtlasPage: React.FC<GuardianPageProps> = ({ guardian, onAction }) => {
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: 99.8,
    responseTime: 145,
    databaseConnections: 23,
    memoryUsage: 67,
    cpuUsage: 34
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setSystemMetrics(prev => ({
          uptime: Math.max(95, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
          responseTime: Math.max(100, Math.min(300, prev.responseTime + (Math.random() - 0.5) * 10)),
          databaseConnections: Math.max(10, Math.min(50, prev.databaseConnections + Math.floor((Math.random() - 0.5) * 5))),
          memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
          cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10))
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    onAction?.('monitoring_started', { timestamp: new Date().toISOString() });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64 }}>
          <guardian.icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color }}>
            {guardian.name} - Centro de Comando
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Vigilando la infraestructura sagrada 24/7
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" color="primary">
                  📊 Métricas en Tiempo Real
                </Typography>
                <Button
                  variant={isMonitoring ? "outlined" : "contained"}
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  startIcon={isMonitoring ? <CloudDone /> : <Timeline />}
                  size="small"
                >
                  {isMonitoring ? 'Monitoreando...' : 'Iniciar Monitoreo'}
                </Button>
              </Stack>

              <Stack spacing={3}>
                {[
                  { label: 'Uptime', value: systemMetrics.uptime, unit: '%', color: 'success' },
                  { label: 'Tiempo de Respuesta', value: systemMetrics.responseTime, unit: 'ms', color: 'primary' },
                  { label: 'Conexiones BD', value: systemMetrics.databaseConnections, unit: '', color: 'info' },
                  { label: 'Uso de Memoria', value: systemMetrics.memoryUsage, unit: '%', color: 'warning' },
                  { label: 'Uso de CPU', value: systemMetrics.cpuUsage, unit: '%', color: 'secondary' }
                ].map((metric, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">{metric.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {metric.value.toFixed(1)}{metric.unit}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={metric.value}
                      color={metric.color as any}
                      sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🛡️ Estado de Servicios Críticos
              </Typography>
              <List>
                {[
                  { name: 'Backend NestJS', status: 'operational', port: '3002' },
                  { name: 'SuperApp Frontend', status: 'operational', port: '3001' },
                  { name: 'PostgreSQL Database', status: 'operational', port: '5432' },
                  { name: 'Redis Cache', status: 'operational', port: '6379' },
                  { name: 'Admin Frontend', status: 'operational', port: '3000' }
                ].map((service, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <CloudDone sx={{ color: service.status === 'operational' ? 'success.main' : 'error.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={service.name}
                      secondary={`Puerto ${service.port} - ${service.status === 'operational' ? 'Operacional' : 'Error'}`}
                    />
                    <Chip
                      label={service.status === 'operational' ? 'OK' : 'ERROR'}
                      color={service.status === 'operational' ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

// ARIA - Artista Frontend
export const AriaPage: React.FC<GuardianPageProps> = ({ guardian, onAction }) => {
  const [selectedPalette, setSelectedPalette] = useState('cosmic');

  const colorPalettes = {
    cosmic: { primary: '#9c27b0', secondary: '#673ab7', accent: '#e91e63', name: 'Cósmico' },
    nature: { primary: '#4caf50', secondary: '#8bc34a', accent: '#cddc39', name: 'Naturaleza' },
    fire: { primary: '#ff5722', secondary: '#ff9800', accent: '#ffc107', name: 'Fuego' },
    water: { primary: '#2196f3', secondary: '#03a9f4', accent: '#00bcd4', name: 'Agua' },
    earth: { primary: '#795548', secondary: '#8d6e63', accent: '#a1887f', name: 'Tierra' }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64 }}>
          <guardian.icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color }}>
            {guardian.name} - Atelier Cósmico
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Donde la belleza consciente toma forma
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🎨 Paletas de Color Conscientes
              </Typography>
              <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mt: 2 }}>
                {Object.entries(colorPalettes).map(([key, palette]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: selectedPalette === key ? `3px solid ${guardian.color}` : '2px solid transparent',
                        background: `linear-gradient(135deg, ${palette.primary}22, ${palette.secondary}22)`,
                        '&:hover': { boxShadow: 3 }
                      }}
                      onClick={() => {
                        setSelectedPalette(key);
                        onAction?.('palette_selected', { palette: key, colors: palette });
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom align="center">
                        {palette.name}
                      </Typography>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Box sx={{ width: 20, height: 20, bgcolor: palette.primary, borderRadius: '50%' }} />
                        <Box sx={{ width: 20, height: 20, bgcolor: palette.secondary, borderRadius: '50%' }} />
                        <Box sx={{ width: 20, height: 20, bgcolor: palette.accent, borderRadius: '50%' }} />
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                ✨ Vista Previa de Componente
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: colorPalettes[selectedPalette as keyof typeof colorPalettes].primary,
                    '&:hover': {
                      bgcolor: colorPalettes[selectedPalette as keyof typeof colorPalettes].secondary
                    }
                  }}
                >
                  Botón Primario
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: colorPalettes[selectedPalette as keyof typeof colorPalettes].primary,
                    color: colorPalettes[selectedPalette as keyof typeof colorPalettes].primary
                  }}
                >
                  Botón Secundario
                </Button>
                <Chip
                  label="Elemento Activo"
                  sx={{
                    bgcolor: colorPalettes[selectedPalette as keyof typeof colorPalettes].accent + '33',
                    color: colorPalettes[selectedPalette as keyof typeof colorPalettes].accent
                  }}
                />
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: colorPalettes[selectedPalette as keyof typeof colorPalettes].primary + '11',
                    border: `1px solid ${colorPalettes[selectedPalette as keyof typeof colorPalettes].primary}33`
                  }}
                >
                  <Typography variant="body2">
                    Contenedor temático con la paleta {colorPalettes[selectedPalette as keyof typeof colorPalettes].name}
                  </Typography>
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            🌈 Principios de Diseño Consciente
          </Typography>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
            {[
              { title: 'Armonía Visual', desc: 'Colores que resuenan con la filosofía CoomÜnity' },
              { title: 'Accesibilidad Universal', desc: 'Contraste y legibilidad para todos' },
              { title: 'Fluidez Orgánica', desc: 'Transiciones que imitan la naturaleza' },
              { title: 'Minimalismo Consciente', desc: 'Solo lo necesario, bellamente presentado' }
            ].map((principle, index) => (
              <Box key={index} sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}>
                <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {principle.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {principle.desc}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

// SAGE - Alquimista de Calidad
export const SagePage: React.FC<GuardianPageProps> = ({ guardian, onAction }) => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);

  const runQualityTests = () => {
    setIsRunningTests(true);
    setTestResults([]);

    const mockTests = [
      { name: 'Component Unit Tests', status: 'running', progress: 0 },
      { name: 'Integration Tests', status: 'pending', progress: 0 },
      { name: 'E2E Tests', status: 'pending', progress: 0 },
      { name: 'Accessibility Tests', status: 'pending', progress: 0 },
      { name: 'Performance Tests', status: 'pending', progress: 0 }
    ];

    let testIndex = 0;
    const interval = setInterval(() => {
      if (testIndex < mockTests.length) {
        const currentTest = mockTests[testIndex];
        const success = Math.random() > 0.2; // 80% success rate

        setTestResults(prev => [...prev, {
          ...currentTest,
          status: success ? 'passed' : 'failed',
          progress: 100,
          details: success ? 'All assertions passed' : 'Some assertions failed'
        }]);

        testIndex++;
        if (testIndex === mockTests.length) {
          setIsRunningTests(false);
          const passedTests = testResults.filter(t => t.status === 'passed').length;
          setQualityScore((passedTests / mockTests.length) * 100);
          onAction?.('quality_tests_completed', { totalTests: mockTests.length, passed: passedTests });
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64 }}>
          <guardian.icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color }}>
            {guardian.name} - Laboratorio de Pureza
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Transformando código en oro puro
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" color="primary">
                  🧪 Suite de Pruebas Alquímicas
                </Typography>
                <Button
                  variant="contained"
                  onClick={runQualityTests}
                  disabled={isRunningTests}
                  startIcon={isRunningTests ? <CircularProgress size={20} /> : <Science />}
                >
                  {isRunningTests ? 'Transmutando...' : 'Iniciar Alquimia'}
                </Button>
              </Stack>

              {qualityScore > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>Pureza del Código</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={qualityScore}
                    sx={{ height: 12, borderRadius: 6 }}
                    color={qualityScore > 80 ? "success" : qualityScore > 60 ? "warning" : "error"}
                  />
                  <Typography variant="caption" color="primary">{qualityScore.toFixed(1)}% Pureza Alcanzada</Typography>
                </Box>
              )}

              <Stack spacing={2}>
                {testResults.map((test, index) => (
                  <Paper key={index} sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle2">{test.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{test.details}</Typography>
                      </Box>
                      {test.status === 'passed' && <CheckCircle color="success" />}
                      {test.status === 'failed' && <Error color="error" />}
                      {test.status === 'running' && <CircularProgress size={20} />}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📊 Métricas de Calidad Consciente
              </Typography>
              <Stack spacing={3}>
                {[
                  { name: 'Cobertura de Tests', value: 87, target: 90 },
                  { name: 'Complejidad Ciclomática', value: 12, target: 10, inverse: true },
                  { name: 'Deuda Técnica', value: 23, target: 15, inverse: true },
                  { name: 'Legibilidad Ayni', value: 94, target: 85 }
                ].map((metric, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{metric.name}</Typography>
                      <Typography variant="body2" color="primary">
                        {metric.value}{metric.inverse ? '/100' : '%'}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={metric.inverse ? 100 - metric.value : metric.value}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      color={
                        metric.inverse
                          ? (metric.value <= metric.target ? "success" : "warning")
                          : (metric.value >= metric.target ? "success" : "warning")
                      }
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

// NIRA - Vidente de Patrones
export const NiraPage: React.FC<GuardianPageProps> = ({ guardian, onAction }) => {
  const [activeInsight, setActiveInsight] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const insights = [
    {
      title: '🔮 Patrón de Ayni Detectado',
      description: 'Los usuarios están compartiendo conocimiento 34% más que el mes pasado',
      impact: 'Alto',
      recommendation: 'Amplificar el sistema de recompensas por reciprocidad'
    },
    {
      title: '📈 Crecimiento Orgánico',
      description: 'La retención de usuarios ha aumentado 15% tras implementar gamificación consciente',
      impact: 'Medio',
      recommendation: 'Expandir elementos gamificados en otras secciones'
    },
    {
      title: '⚡ Punto de Fricción Identificado',
      description: 'Los usuarios tardan 3.2s más en el onboarding de lo óptimo',
      impact: 'Bajo',
      recommendation: 'Simplificar el flujo de registro inicial'
    }
  ];

  const startPatternScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onAction?.('pattern_scan_completed', { patternsFound: insights.length });
    }, 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64 }}>
          <guardian.icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color }}>
            {guardian.name} - Observatorio de Patrones
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Revelando la sabiduría oculta en los datos
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 2 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary">
                  🌟 Insights Conscientes
                </Typography>
                <Button
                  variant="contained"
                  onClick={startPatternScan}
                  disabled={isScanning}
                  startIcon={isScanning ? <CircularProgress size={20} /> : <TrendingUp />}
                  size="small"
                >
                  {isScanning ? 'Escaneando...' : 'Escanear Patrones'}
                </Button>
              </Stack>

              <Stack spacing={2}>
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        cursor: 'pointer',
                        border: activeInsight === index ? `2px solid ${guardian.color}` : '1px solid',
                        borderColor: activeInsight === index ? guardian.color : 'divider',
                        '&:hover': { boxShadow: 3 }
                      }}
                      onClick={() => setActiveInsight(index)}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom color="primary">
                            {insight.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" paragraph>
                            {insight.description}
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            💡 {insight.recommendation}
                          </Typography>
                        </Box>
                        <Chip
                          label={insight.impact}
                          size="small"
                          color={
                            insight.impact === 'Alto' ? 'error' :
                            insight.impact === 'Medio' ? 'warning' : 'success'
                          }
                        />
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📊 Métricas Espirituales
              </Typography>
              <Stack spacing={3}>
                {[
                  { name: 'Índice de Ayni', value: 78, unit: '%', color: '#4caf50' },
                  { name: 'Bien Común Score', value: 85, unit: '%', color: '#2196f3' },
                  { name: 'Colaboración vs Competencia', value: 92, unit: '%', color: '#9c27b0' },
                  { name: 'Nivel de Metanöia', value: 67, unit: '%', color: '#ff9800' }
                ].map((metric, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{metric.name}</Typography>
                      <Typography variant="body2" sx={{ color: metric.color, fontWeight: 600 }}>
                        {metric.value}{metric.unit}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={metric.value}
                      sx={{
                        mt: 1,
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: metric.color
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

// PHOENIX - Transformador
export const PhoenixPage: React.FC<GuardianPageProps> = ({ guardian, onAction }) => {
  const [transformationQueue, setTransformationQueue] = useState<any[]>([]);
  const [activeTransformation, setActiveTransformation] = useState<any>(null);
  const [isTransforming, setIsTransforming] = useState(false);

  const transformationTargets = [
    {
      name: 'Legacy Component Refactor',
      complexity: 'High',
      impact: 'Performance +40%',
      description: 'Modernizar componentes clase a funcionales con hooks'
    },
    {
      name: 'Database Query Optimization',
      complexity: 'Medium',
      impact: 'Speed +60%',
      description: 'Optimizar consultas N+1 en el backend'
    },
    {
      name: 'Bundle Size Reduction',
      complexity: 'Low',
      impact: 'Load Time -30%',
      description: 'Implementar tree-shaking y lazy loading'
    }
  ];

  const startTransformation = (target: any) => {
    setActiveTransformation(target);
    setIsTransforming(true);

    setTimeout(() => {
      setTransformationQueue(prev => [...prev, {
        ...target,
        status: 'completed',
        timestamp: new Date().toISOString()
      }]);
      setIsTransforming(false);
      setActiveTransformation(null);
      onAction?.('transformation_completed', { target: target.name });
    }, 4000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64 }}>
          <guardian.icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color }}>
            {guardian.name} - Crisol de Transformación
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Renaciendo desde las cenizas del código legacy
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🔥 Objetivos de Transformación
              </Typography>
              <Stack spacing={2}>
                {transformationTargets.map((target, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      border: activeTransformation?.name === target.name ? `2px solid ${guardian.color}` : '1px solid transparent'
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>{target.name}</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {target.description}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={target.complexity}
                            size="small"
                            color={
                              target.complexity === 'High' ? 'error' :
                              target.complexity === 'Medium' ? 'warning' : 'success'
                            }
                          />
                          <Chip
                            label={target.impact}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: guardian.color, color: guardian.color }}
                          />
                        </Stack>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => startTransformation(target)}
                        disabled={isTransforming}
                        sx={{ ml: 2 }}
                      >
                        {activeTransformation?.name === target.name && isTransforming ? 'Transformando...' : 'Iniciar'}
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                ✨ Transformaciones Completadas
              </Typography>
              {transformationQueue.length === 0 ? (
                <Alert severity="info">
                  No hay transformaciones completadas aún. ¡Inicia tu primera metamorfosis!
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {transformationQueue.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Paper sx={{ p: 2, bgcolor: `${guardian.color}11`, border: `1px solid ${guardian.color}33` }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <CheckCircle sx={{ color: guardian.color }} />
                          <Box>
                            <Typography variant="subtitle2">{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Completado: {new Date(item.timestamp).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </motion.div>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          {isTransforming && activeTransformation && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔄 Transformación en Progreso
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {activeTransformation.name}
                </Typography>
                <LinearProgress
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  color="primary"
                />
                <Typography variant="caption" color="text.secondary">
                  Renaciendo desde las cenizas...
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

// MIRA - Curadora de Herramientas
export const MiraPage: React.FC<GuardianPageProps> = ({ guardian }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: guardian.color, width: 72, height: 72, mx: 'auto', mb: 2 }}>
      <guardian.icon sx={{ fontSize: 40, color: '#fff' }} />
    </Avatar>
    <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color, mb: 1 }}>{guardian.name}</Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>{guardian.title}</Typography>
    <Typography variant="body1" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>{guardian.mission}</Typography>
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: guardian.color, width: 56, height: 56, mb: 1, animation: 'haloPulse 2s infinite alternate' }}>
        <guardian.icon sx={{ fontSize: 32, color: '#fff' }} />
      </Avatar>
      <Typography variant="h6" sx={{ color: guardian.color, fontWeight: 600 }}>
        Laboratorio en construcción
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Próximamente podrás explorar las herramientas de {guardian.name}.
      </Typography>
    </Box>
  </Box>
);

// COSMOS - Tejedor de Sistemas Universales
export const CosmosPage: React.FC<GuardianPageProps> = ({ guardian }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: guardian.color, width: 72, height: 72, mx: 'auto', mb: 2 }}>
      <guardian.icon sx={{ fontSize: 40, color: '#fff' }} />
    </Avatar>
    <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color, mb: 1 }}>{guardian.name}</Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>{guardian.title}</Typography>
    <Typography variant="body1" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>{guardian.mission}</Typography>
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: guardian.color, width: 56, height: 56, mb: 1, animation: 'haloPulse 2s infinite alternate' }}>
        <guardian.icon sx={{ fontSize: 32, color: '#fff' }} />
      </Avatar>
      <Typography variant="h6" sx={{ color: guardian.color, fontWeight: 600 }}>
        Laboratorio en construcción
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Próximamente podrás explorar los sistemas universales de {guardian.name}.
      </Typography>
    </Box>
  </Box>
);

// LUNA - Guardiana de los Ritmos
export const LunaPage: React.FC<GuardianPageProps> = ({ guardian }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: guardian.color, width: 72, height: 72, mx: 'auto', mb: 2 }}>
      <guardian.icon sx={{ fontSize: 40, color: '#fff' }} />
    </Avatar>
    <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color, mb: 1 }}>{guardian.name}</Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>{guardian.title}</Typography>
    <Typography variant="body1" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>{guardian.mission}</Typography>
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: guardian.color, width: 56, height: 56, mb: 1, animation: 'haloPulse 2s infinite alternate' }}>
        <guardian.icon sx={{ fontSize: 32, color: '#fff' }} />
      </Avatar>
      <Typography variant="h6" sx={{ color: guardian.color, fontWeight: 600 }}>
        Laboratorio en construcción
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Próximamente podrás explorar los ritmos y ciclos de {guardian.name}.
      </Typography>
    </Box>
  </Box>
);

// PAX - Mediador de Conflictos
export const PaxPage: React.FC<GuardianPageProps> = ({ guardian }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: guardian.color, width: 72, height: 72, mx: 'auto', mb: 2 }}>
      <guardian.icon sx={{ fontSize: 40, color: '#fff' }} />
    </Avatar>
    <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color, mb: 1 }}>{guardian.name}</Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>{guardian.title}</Typography>
    <Typography variant="body1" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>{guardian.mission}</Typography>
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: guardian.color, width: 56, height: 56, mb: 1, animation: 'haloPulse 2s infinite alternate' }}>
        <guardian.icon sx={{ fontSize: 32, color: '#fff' }} />
      </Avatar>
      <Typography variant="h6" sx={{ color: guardian.color, fontWeight: 600 }}>
        Laboratorio en construcción
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Próximamente podrás explorar la mediación y resolución de conflictos de {guardian.name}.
      </Typography>
    </Box>
  </Box>
);

// GAIA - Consciencia Ecológica Digital
export const GaiaPage: React.FC<GuardianPageProps> = ({ guardian }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: guardian.color, width: 72, height: 72, mx: 'auto', mb: 2 }}>
      <guardian.icon sx={{ fontSize: 40, color: '#fff' }} />
    </Avatar>
    <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color, mb: 1 }}>{guardian.name}</Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>{guardian.title}</Typography>
    <Typography variant="body1" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>{guardian.mission}</Typography>
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: guardian.color, width: 56, height: 56, mb: 1, animation: 'haloPulse 2s infinite alternate' }}>
        <guardian.icon sx={{ fontSize: 32, color: '#fff' }} />
      </Avatar>
      <Typography variant="h6" sx={{ color: guardian.color, fontWeight: 600 }}>
        Laboratorio en construcción
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Próximamente podrás explorar la consciencia ecológica de {guardian.name}.
      </Typography>
    </Box>
  </Box>
);

// Crear un componente maestro que maneje todos los guardianes
export const GuardianSpecificPage: React.FC<{ guardian: Guardian; onAction?: (action: string, details: any) => void }> = ({ guardian, onAction }) => {
  switch (guardian.id) {
    case 'KIRA':
      return <KiraPage guardian={guardian} onAction={onAction} />;
    case 'ZENO':
      return <ZenoPage guardian={guardian} onAction={onAction} />;
    case 'ATLAS':
      return <AtlasPage guardian={guardian} onAction={onAction} />;
    case 'ARIA':
      return <AriaPage guardian={guardian} onAction={onAction} />;
    case 'SAGE':
      return <SagePage guardian={guardian} onAction={onAction} />;
    case 'NIRA':
      return <NiraPage guardian={guardian} onAction={onAction} />;
    case 'PHOENIX':
      return <PhoenixPage guardian={guardian} onAction={onAction} />;
    case 'MIRA':
      return <MiraPage guardian={guardian} onAction={onAction} />;
    case 'COSMOS':
      return <CosmosPage guardian={guardian} onAction={onAction} />;
    case 'LUNA':
      return <LunaPage guardian={guardian} onAction={onAction} />;
    case 'PAX':
      return <PaxPage guardian={guardian} onAction={onAction} />;
    case 'GAIA':
      return <GaiaPage guardian={guardian} onAction={onAction} />;
    default:
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: guardian.color, width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <guardian.icon sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, color: guardian.color, mb: 1 }}>
            {guardian.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {guardian.specialization}
          </Typography>
          <Paper sx={{ p: 3, mt: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="body1" paragraph>
              {guardian.description}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              <strong>Misión:</strong> {guardian.mission}
            </Typography>
          </Paper>
          <Alert severity="info" sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
            🚧 La página especializada de este Guardián está en desarrollo.
            ¡Pronto tendrá herramientas interactivas únicas!
          </Alert>
        </Box>
      );
  }
};
