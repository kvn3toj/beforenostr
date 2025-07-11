/**
 * 🎮 Constructor Visual de Desafíos - CoomÜnity Challenge Builder
 *
 * Interface drag-and-drop revolucionaria que permite al equipo HumanWäre
 * crear experiencias gamificadas intuitivamente sin código
 *
 * Características:
 * - Drag & Drop visual para elementos de desafío
 * - Preview en tiempo real del customer journey
 * - Integración con Framework Octalysis
 * - Templates reutilizables y marketplace
 * - Generación automática de código React
 * - Validación de flujos UX y lógica de negocio
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Unstable_Grid2 as Grid,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Avatar,
  Badge,
  Divider,
  Switch,
  FormControlLabel,
  Fab,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Add as AddIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  Group as GroupIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  PlayCircle as PlayIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Extension as ExtensionIcon,
  AccountTree as FlowIcon,
  AutoAwesome as MagicIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Store as MarketplaceIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Template Marketplace Integration
import TemplateMarketplaceIntegration from './TemplateMarketplaceIntegration';
import { ChallengeTemplate } from '../../../types/template-marketplace.types';

// Types para el Challenge Builder
interface ChallengeElement {
  id: string;
  type: 'trigger' | 'action' | 'reward' | 'condition' | 'timer' | 'social' | 'content';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
  octalysisElements: OctalysisElement[];
  validationRules: ValidationRule[];
}

interface OctalysisElement {
  core: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  name: string;
  description: string;
}

interface ValidationRule {
  type: 'required' | 'conditional' | 'logic' | 'ux';
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface ChallengeFlow {
  id: string;
  name: string;
  description: string;
  elements: ChallengeElement[];
  connections: FlowConnection[];
  metadata: {
    stage: 'buyer' | 'seeker' | 'solver' | 'promoter';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    octalysisProfile: Record<number, number>;
    tags: string[];
  };
}

interface FlowConnection {
  id: string;
  source: string;
  target: string;
  condition?: string;
  type: 'success' | 'failure' | 'timeout' | 'choice';
}

// Paleta de elementos predefinidos para drag & drop
const ELEMENT_PALETTE: Omit<ChallengeElement, 'id' | 'position' | 'connections'>[] = [
  {
    type: 'trigger',
    title: 'Activador de Inicio',
    description: 'Momento que inicia el desafío',
    config: { triggerType: 'manual', autoStart: false },
    octalysisElements: [{ core: 2, name: 'Development & Accomplishment', description: 'Sensación de progreso' }],
    validationRules: [{ type: 'required', message: 'Todo flujo debe tener un activador', severity: 'error' }],
  },
  {
    type: 'action',
    title: 'Acción Requerida',
    description: 'Tarea específica que el jugador debe completar',
    config: { actionType: 'task', verification: 'manual', points: 10 },
    octalysisElements: [
      { core: 2, name: 'Development & Accomplishment', description: 'Progreso hacia meta' },
      { core: 4, name: 'Ownership & Possession', description: 'Apropiación del logro' },
    ],
    validationRules: [{ type: 'required', message: 'Toda acción necesita criterios de éxito', severity: 'error' }],
  },
  {
    type: 'reward',
    title: 'Sistema de Recompensas',
    description: 'Reconocimiento por completar la acción',
    config: { rewardType: 'ünits', amount: 50, visibility: 'public' },
    octalysisElements: [
      { core: 2, name: 'Development & Accomplishment', description: 'Reconocimiento del logro' },
      { core: 5, name: 'Social Influence & Relatedness', description: 'Status social' },
    ],
    validationRules: [{ type: 'conditional', message: 'Recompensas deben alinearse con la acción', severity: 'warning' }],
  },
  {
    type: 'condition',
    title: 'Condición Lógica',
    description: 'Bifurcación del flujo basada en criterios',
    config: { conditionType: 'if_then', logic: 'simple' },
    octalysisElements: [{ core: 7, name: 'Unpredictability & Curiosity', description: 'Elementos de sorpresa' }],
    validationRules: [{ type: 'logic', message: 'Condiciones deben tener casos verdadero y falso', severity: 'error' }],
  },
  {
    type: 'timer',
    title: 'Temporizador',
    description: 'Límite de tiempo para completar',
    config: { duration: 3600, showCountdown: true, timeoutAction: 'fail' },
    octalysisElements: [{ core: 6, name: 'Scarcity & Impatience', description: 'Urgencia temporal' }],
    validationRules: [{ type: 'ux', message: 'Temporizadores pueden generar estrés', severity: 'warning' }],
  },
  {
    type: 'social',
    title: 'Elemento Social',
    description: 'Colaboración o competencia entre jugadores',
    config: { socialType: 'collaboration', groupSize: 4, visibility: 'community' },
    octalysisElements: [{ core: 5, name: 'Social Influence & Relatedness', description: 'Conexión social' }],
    validationRules: [{ type: 'conditional', message: 'Elementos sociales necesitan gestión de grupos', severity: 'info' }],
  },
  {
    type: 'content',
    title: 'Contenido Educativo',
    description: 'Material de aprendizaje o contexto',
    config: { contentType: 'video', duration: 300, interactive: true },
    octalysisElements: [{ core: 3, name: 'Empowerment of Creativity & Feedback', description: 'Aprendizaje creativo' }],
    validationRules: [{ type: 'ux', message: 'Contenido debe ser engaging y accesible', severity: 'info' }],
  },
];

export const ChallengeBuilder: React.FC = () => {
  // Estados principales
  const [currentFlow, setCurrentFlow] = useState<ChallengeFlow | null>(null);
  const [selectedElement, setSelectedElement] = useState<ChallengeElement | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationRule[]>([]);
  
  // Estados de UI
  const [showElementDialog, setShowElementDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  
  // Template Marketplace Integration
  const [showTemplateMarketplace, setShowTemplateMarketplace] = useState(false);
  
  // Referencias
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  // Inicializar flujo vacío
  useEffect(() => {
    if (!currentFlow) {
      setCurrentFlow({
        id: `flow_${Date.now()}`,
        name: 'Nuevo Desafío',
        description: 'Descripción del desafío',
        elements: [],
        connections: [],
        metadata: {
          stage: 'seeker',
          difficulty: 'beginner',
          estimatedTime: 1800, // 30 minutos
          octalysisProfile: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
          tags: [],
        },
      });
    }
  }, [currentFlow]);

  // Validación en tiempo real
  useEffect(() => {
    if (currentFlow) {
      validateFlow(currentFlow);
    }
  }, [currentFlow]);

  // Funciones de drag & drop
  const handleDragStart = useCallback((elementType: string) => {
    setDragging(elementType);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  const handleCanvasDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!dragging || !currentFlow || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const elementTemplate = ELEMENT_PALETTE.find(el => el.type === dragging);
    if (!elementTemplate) return;

    const newElement: ChallengeElement = {
      ...elementTemplate,
      id: `element_${Date.now()}`,
      position: { x, y },
      connections: [],
    };

    setCurrentFlow({
      ...currentFlow,
      elements: [...currentFlow.elements, newElement],
    });

    setDragging(null);
  }, [dragging, currentFlow]);

  const handleCanvasDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  // Función de validación del flujo
  const validateFlow = useCallback((flow: ChallengeFlow) => {
    const results: ValidationRule[] = [];

    // Validaciones básicas
    if (flow.elements.length === 0) {
      results.push({
        type: 'required',
        message: 'El flujo necesita al menos un elemento',
        severity: 'error',
      });
    }

    const hasStartTrigger = flow.elements.some(el => el.type === 'trigger');
    if (!hasStartTrigger) {
      results.push({
        type: 'required',
        message: 'Todo desafío necesita un activador de inicio',
        severity: 'error',
      });
    }

    const hasReward = flow.elements.some(el => el.type === 'reward');
    if (!hasReward) {
      results.push({
        type: 'ux',
        message: 'Considera agregar recompensas para motivar completitud',
        severity: 'warning',
      });
    }

    // Validación de Octalysis balance
    const octalysisUsage = flow.elements.reduce((acc, element) => {
      element.octalysisElements.forEach(oe => {
        acc[oe.core] = (acc[oe.core] || 0) + 1;
      });
      return acc;
    }, {} as Record<number, number>);

    const activeCores = Object.keys(octalysisUsage).length;
    if (activeCores < 2) {
      results.push({
        type: 'ux',
        message: 'Considera usar múltiples Core Drives de Octalysis para mayor engagement',
        severity: 'info',
      });
    }

    setValidationResults(results);
  }, []);

  // Función para generar código React del desafío
  const generateChallengeCode = useCallback(async () => {
    if (!currentFlow) return;

    setIsGeneratingCode(true);
    
    // Simulación de generación de código
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedCode = `
// Generated Challenge Component: ${currentFlow.name}
import React from 'react';
import { ChallengeContainer } from '@/components/challenges';

export const ${currentFlow.name.replace(/\s+/g, '')}Challenge: React.FC = () => {
  return (
    <ChallengeContainer
      name="${currentFlow.name}"
      description="${currentFlow.description}"
      stage="${currentFlow.metadata.stage}"
      difficulty="${currentFlow.metadata.difficulty}"
      estimatedTime={${currentFlow.metadata.estimatedTime}}
    >
      ${currentFlow.elements.map(element => `
      <ChallengeElement
        type="${element.type}"
        title="${element.title}"
        config={${JSON.stringify(element.config, null, 6)}}
      />`).join('')}
    </ChallengeContainer>
  );
};`;

    console.log('Generated Challenge Code:', generatedCode);
    setIsGeneratingCode(false);
  }, [currentFlow]);

  // Template Marketplace Handlers
  const handleTemplateSelect = useCallback((template: ChallengeTemplate) => {
    console.log('Template selected:', template);
  }, []);

  const handleTemplateUse = useCallback((template: ChallengeTemplate) => {
    if (!template.challengeFlow) return;

    // Convert template to current flow format and apply
    const newFlow: ChallengeFlow = {
      id: `flow_${Date.now()}`,
      name: `${template.title} (desde template)`,
      description: template.description,
      elements: template.elements || [],
      connections: [],
      metadata: {
        stage: 'seeker',
        difficulty: template.difficulty as any,
        estimatedTime: 1800,
        octalysisProfile: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
        tags: template.tags,
      },
    };

    setCurrentFlow(newFlow);
    console.log('Template applied to challenge builder:', template.title);
  }, []);

  const getValidationColor = (severity: ValidationRule['severity']) => {
    switch (severity) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const renderTabPanel = (value: number, index: number, children: React.ReactNode) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  if (!currentFlow) return null;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header con controles principales */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderRadius: 0, 
          borderBottom: 1, 
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MagicIcon />
              Constructor Visual de Desafíos
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {currentFlow.name} • {currentFlow.elements.length} elementos • {currentFlow.metadata.stage.toUpperCase()}
            </Typography>
          </Grid>
          <Grid xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="contained"
                startIcon={<MarketplaceIcon />}
                onClick={() => setShowTemplateMarketplace(true)}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  position: 'relative'
                }}
              >
                <Badge
                  badgeContent="🌟"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: -8,
                      top: -8,
                      fontSize: '0.6rem',
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  Templates
                </Badge>
              </Button>
              <Button
                variant="contained"
                startIcon={<PreviewIcon />}
                onClick={() => setPreviewMode(!previewMode)}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
              >
                {previewMode ? 'Editar' : 'Vista Previa'}
              </Button>
              <Button
                variant="contained"
                startIcon={<CodeIcon />}
                onClick={generateChallengeCode}
                disabled={validationResults.some(r => r.severity === 'error') || isGeneratingCode}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
              >
                {isGeneratingCode ? 'Generando...' : 'Generar Código'}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => setShowSaveDialog(true)}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
              >
                Guardar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Validación en tiempo real */}
      {validationResults.length > 0 && (
        <Alert 
          severity={validationResults.some(r => r.severity === 'error') ? 'error' : 'warning'}
          sx={{ borderRadius: 0 }}
        >
          <Typography variant="body2">
            <strong>{validationResults.filter(r => r.severity === 'error').length} errores</strong> • 
            <strong> {validationResults.filter(r => r.severity === 'warning').length} advertencias</strong> • 
            <strong> {validationResults.filter(r => r.severity === 'info').length} sugerencias</strong>
          </Typography>
        </Alert>
      )}

      {/* Área principal con tabs */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<ExtensionIcon />} label="Constructor Visual" />
          <Tab icon={<FlowIcon />} label="Flujo y Conexiones" />
          <Tab icon={<PsychologyIcon />} label="Análisis Octalysis" />
          <Tab icon={<SettingsIcon />} label="Configuración" />
        </Tabs>

        {/* Tab 1: Constructor Visual */}
        {renderTabPanel(activeTab, 0, (
          <Grid container sx={{ height: 'calc(100vh - 200px)' }}>
            {/* Paleta de elementos (izquierda) */}
            <Grid xs={12} lg={3} sx={{ borderRight: 1, borderColor: 'divider', p: 2, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon />
                Paleta de Elementos
              </Typography>
              
              {ELEMENT_PALETTE.map((element) => (
                <Card
                  key={element.type}
                  draggable
                  onDragStart={() => handleDragStart(element.type)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    mb: 2,
                    cursor: 'grab',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 3,
                    },
                    '&:active': {
                      cursor: 'grabbing',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <DragIcon color="action" />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {element.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {element.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {element.octalysisElements.map((oe, index) => (
                        <Chip
                          key={index}
                          label={`Core ${oe.core}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            {/* Canvas principal (centro) */}
            <Grid xs={12} lg={6}>
              <Box
                ref={canvasRef}
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
                sx={{
                  height: '100%',
                  bgcolor: 'grey.50',
                  position: 'relative',
                  backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  overflow: 'hidden',
                }}
              >
                {/* Elementos del flujo en el canvas */}
                {currentFlow.elements.map((element) => (
                  <Card
                    key={element.id}
                    onClick={() => setSelectedElement(element)}
                    sx={{
                      position: 'absolute',
                      left: element.position.x,
                      top: element.position.y,
                      width: 200,
                      cursor: 'pointer',
                      border: selectedElement?.id === element.id ? 2 : 1,
                      borderColor: selectedElement?.id === element.id ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {element.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {element.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip label={element.type} size="small" variant="outlined" />
                        {element.octalysisElements.length > 0 && (
                          <Badge badgeContent={element.octalysisElements.length} color="primary">
                            <PsychologyIcon fontSize="small" />
                          </Badge>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                {/* Indicador de drop cuando se está arrastrando */}
                {dragging && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'primary.main',
                      opacity: 0.1,
                      border: 2,
                      borderColor: 'primary.main',
                      borderStyle: 'dashed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Typography variant="h6" color="primary.main">
                      Suelta aquí para agregar elemento
                    </Typography>
                  </Box>
                )}

                {/* Mensaje cuando el canvas está vacío */}
                {currentFlow.elements.length === 0 && !dragging && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <MagicIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      Comienza creando tu desafío
                    </Typography>
                    <Typography variant="body2">
                      Arrastra elementos desde la paleta hacia este canvas
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Panel de propiedades (derecha) */}
            <Grid xs={12} lg={3} sx={{ borderLeft: 1, borderColor: 'divider', p: 2, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Propiedades
              </Typography>
              
              {selectedElement ? (
                <Box>
                  <TextField
                    fullWidth
                    label="Título"
                    value={selectedElement.title}
                    onChange={(e) => {
                      const updated = { ...selectedElement, title: e.target.value };
                      setCurrentFlow({
                        ...currentFlow,
                        elements: currentFlow.elements.map(el => 
                          el.id === selectedElement.id ? updated : el
                        ),
                      });
                      setSelectedElement(updated);
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                    value={selectedElement.description}
                    onChange={(e) => {
                      const updated = { ...selectedElement, description: e.target.value };
                      setCurrentFlow({
                        ...currentFlow,
                        elements: currentFlow.elements.map(el => 
                          el.id === selectedElement.id ? updated : el
                        ),
                      });
                      setSelectedElement(updated);
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Elementos Octalysis
                  </Typography>
                  {selectedElement.octalysisElements.map((oe, index) => (
                    <Chip
                      key={index}
                      label={`Core ${oe.core}: ${oe.name}`}
                      size="small"
                      color="primary"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Validaciones
                  </Typography>
                  {selectedElement.validationRules.map((rule, index) => (
                    <Alert 
                      key={index}
                      severity={getValidationColor(rule.severity)}
                      sx={{ mb: 1, fontSize: '0.75rem' }}
                    >
                      {rule.message}
                    </Alert>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  Selecciona un elemento del canvas para ver y editar sus propiedades
                </Alert>
              )}
            </Grid>
          </Grid>
        ))}

        {/* Tab 2: Flujo y Conexiones */}
        {renderTabPanel(activeTab, 1, (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Flujo y Conexiones
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Funcionalidad de conexiones entre elementos - próximamente
            </Alert>
          </Box>
        ))}

        {/* Tab 3: Análisis Octalysis */}
        {renderTabPanel(activeTab, 2, (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Análisis del Framework Octalysis
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Análisis automático de Core Drives - próximamente
            </Alert>
          </Box>
        ))}

        {/* Tab 4: Configuración */}
        {renderTabPanel(activeTab, 3, (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuración del Desafío
            </Typography>
            
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Desafío"
                  value={currentFlow.name}
                  onChange={(e) => setCurrentFlow({
                    ...currentFlow,
                    name: e.target.value,
                  })}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción"
                  value={currentFlow.description}
                  onChange={(e) => setCurrentFlow({
                    ...currentFlow,
                    description: e.target.value,
                  })}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Etapa del Customer Journey</InputLabel>
                  <Select
                    value={currentFlow.metadata.stage}
                    onChange={(e) => setCurrentFlow({
                      ...currentFlow,
                      metadata: {
                        ...currentFlow.metadata,
                        stage: e.target.value as any,
                      },
                    })}
                  >
                    <MenuItem value="buyer">Buyer - Descubrimiento</MenuItem>
                    <MenuItem value="seeker">Seeker - Exploración</MenuItem>
                    <MenuItem value="solver">Solver - Acción</MenuItem>
                    <MenuItem value="promoter">Promoter - Advocacy</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Dificultad</InputLabel>
                  <Select
                    value={currentFlow.metadata.difficulty}
                    onChange={(e) => setCurrentFlow({
                      ...currentFlow,
                      metadata: {
                        ...currentFlow.metadata,
                        difficulty: e.target.value as any,
                      },
                    })}
                  >
                    <MenuItem value="beginner">Principiante</MenuItem>
                    <MenuItem value="intermediate">Intermedio</MenuItem>
                    <MenuItem value="advanced">Avanzado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>

      {/* FAB para acciones rápidas */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setShowElementDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Loading overlay para generación de código */}
      {isGeneratingCode && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Generando código del desafío...</Typography>
            <Typography variant="body2" color="text.secondary">
              Creando componente React optimizado
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Template Marketplace Integration */}
      <TemplateMarketplaceIntegration
        isOpen={showTemplateMarketplace}
        onClose={() => setShowTemplateMarketplace(false)}
        onTemplateSelect={handleTemplateSelect}
        onTemplateUse={handleTemplateUse}
        currentChallengeContext={currentFlow?.name}
      />
    </Box>
  );
};

export default ChallengeBuilder;