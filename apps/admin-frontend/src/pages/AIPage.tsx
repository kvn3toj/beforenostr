import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Psychology as AIIcon,
  QuestionAnswer as QuestionIcon,
  AutoAwesome as GenerateIcon,
  Settings as ConfigIcon,
  Analytics as MetricsIcon,
  PlayArrow as TestIcon,
  Tune as TuneIcon,
  Code as PromptIcon,
  Speed as PerformanceIcon,
  TrendingUp as SuccessIcon,
  Error as ErrorIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  ExpandMore as ExpandIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface AIModel {
  id: string
  name: string
  provider: 'OPENAI' | 'CLAUDE' | 'GEMINI' | 'LOCAL'
  version: string
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING'
  configuration: {
    temperature: number
    maxTokens: number
    systemPrompt: string
  }
  performance: {
    avgResponseTime: number
    successRate: number
    questionsGenerated: number
    lastUsed: string
  }
}

interface GeneratedQuestion {
  id: string
  content: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED' | 'REFLECTION'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  videoContext: string
  timestamp: number
  status: 'GENERATED' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW'
  model: string
  generatedAt: string
  reviewedBy?: string
  reviewNotes?: string
  options?: string[]
  correctAnswer?: string
}

interface AIMetrics {
  totalQuestions: number
  approvedQuestions: number
  rejectedQuestions: number
  avgQuality: number
  modelsActive: number
  dailyGeneration: number
  costOptimization: number
}

// Mock API functions
const fetchAIModels = async (): Promise<AIModel[]> => {
  return [
    {
      id: '1',
      name: 'GPT-4 Turbo',
      provider: 'OPENAI',
      version: 'gpt-4-1106-preview',
      status: 'ACTIVE',
      configuration: {
        temperature: 0.7,
        maxTokens: 1500,
        systemPrompt: 'Eres un experto educador que genera preguntas profundas y reflexivas sobre contenido educativo relacionado con el Bien Común, Ayni, y desarrollo comunitario.'
      },
      performance: {
        avgResponseTime: 2.3,
        successRate: 94,
        questionsGenerated: 1247,
        lastUsed: '2024-01-15T14:30:00Z'
      }
    },
    {
      id: '2',
      name: 'Claude 3 Haiku',
      provider: 'CLAUDE',
      version: 'claude-3-haiku-20240307',
      status: 'ACTIVE',
      configuration: {
        temperature: 0.6,
        maxTokens: 1200,
        systemPrompt: 'Genera preguntas educativas que fomenten la reflexión sobre principios de reciprocidad, economía colaborativa y desarrollo sostenible.'
      },
      performance: {
        avgResponseTime: 1.8,
        successRate: 91,
        questionsGenerated: 856,
        lastUsed: '2024-01-15T13:45:00Z'
      }
    },
    {
      id: '3',
      name: 'Gemini Pro',
      provider: 'GEMINI',
      version: 'gemini-pro-1.5',
      status: 'TESTING',
      configuration: {
        temperature: 0.8,
        maxTokens: 1000,
        systemPrompt: 'Crea preguntas que conecten el contenido educativo con la filosofía CoomÜnity y principios de permacultura social.'
      },
      performance: {
        avgResponseTime: 3.1,
        successRate: 87,
        questionsGenerated: 342,
        lastUsed: '2024-01-15T12:20:00Z'
      }
    }
  ]
}

const fetchGeneratedQuestions = async (): Promise<GeneratedQuestion[]> => {
  return [
    {
      id: '1',
      content: '¿Cómo puede el principio de Ayni transformar nuestra relación con el consumo y la abundancia en el contexto actual?',
      type: 'REFLECTION',
      difficulty: 'HARD',
      videoContext: 'Economía del Bien Común - Capítulo 3',
      timestamp: 1847,
      status: 'APPROVED',
      model: 'GPT-4 Turbo',
      generatedAt: '2024-01-15T10:30:00Z',
      reviewedBy: 'admin@coomunity.com',
      reviewNotes: 'Excelente pregunta reflexiva que conecta filosofía con práctica'
    },
    {
      id: '2',
      content: 'En el video se menciona que las economías regenerativas priorizan el Bien Común. ¿Verdadero o Falso?',
      type: 'TRUE_FALSE',
      difficulty: 'EASY',
      videoContext: 'Introducción a Economías Regenerativas',
      timestamp: 923,
      status: 'APPROVED',
      model: 'Claude 3 Haiku',
      generatedAt: '2024-01-15T09:15:00Z',
      reviewedBy: 'moderator@coomunity.com',
      correctAnswer: 'Verdadero'
    },
    {
      id: '3',
      content: '¿Cuáles son los tres pilares fundamentales de la permacultura aplicada a sistemas sociales?',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      videoContext: 'Permacultura Social Avanzada',
      timestamp: 2156,
      status: 'IN_REVIEW',
      model: 'Gemini Pro',
      generatedAt: '2024-01-15T08:45:00Z',
      options: [
        'Cuidado de la Tierra, Cuidado de las Personas, Compartir Equitativo',
        'Producción, Distribución, Consumo',
        'Individual, Colectivo, Universal',
        'Local, Regional, Global'
      ],
      correctAnswer: 'Cuidado de la Tierra, Cuidado de las Personas, Compartir Equitativo'
    }
  ]
}

const fetchAIMetrics = async (): Promise<AIMetrics> => {
  return {
    totalQuestions: 2445,
    approvedQuestions: 2187,
    rejectedQuestions: 258,
    avgQuality: 89.4,
    modelsActive: 2,
    dailyGeneration: 47,
    costOptimization: 23.7
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
  </div>
)

export const AIPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: models = [], isLoading: loadingModels } = useQuery({
    queryKey: ['ai-models'],
    queryFn: fetchAIModels,
  })

  const { data: questions = [], isLoading: loadingQuestions } = useQuery({
    queryKey: ['generated-questions'],
    queryFn: fetchGeneratedQuestions,
  })

  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['ai-metrics'],
    queryFn: fetchAIMetrics,
  })

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OPENAI': return '#10B981'
      case 'CLAUDE': return '#8B5CF6'
      case 'GEMINI': return '#3B82F6'
      case 'LOCAL': return '#F59E0B'
      default: return '#6B7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'TESTING': return 'warning'
      case 'INACTIVE': return 'error'
      case 'APPROVED': return 'success'
      case 'IN_REVIEW': return 'warning'
      case 'REJECTED': return 'error'
      default: return 'default'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return '🔤'
      case 'TRUE_FALSE': return '✓/✗'
      case 'OPEN_ENDED': return '💭'
      case 'REFLECTION': return '🤔'
      default: return '❓'
    }
  }

  if (loadingModels || loadingQuestions || loadingMetrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#CDAB5A' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <AIIcon sx={{ fontSize: 32, color: '#CDAB5A', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: 'text.primary' }}>
              Gestión de IA CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generador Inteligente de Preguntas • {metrics?.modelsActive} modelos activos
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsConfigDialogOpen(true)}
          sx={{ 
            backgroundColor: '#CDAB5A',
            '&:hover': { backgroundColor: '#B8954A' }
          }}
        >
          Nuevo Modelo
        </Button>
      </Box>

      {/* Metrics Overview */}
      {metrics && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#CDAB5A' }}>
                      {metrics.totalQuestions.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preguntas Generadas
                    </Typography>
                  </Box>
                  <QuestionIcon sx={{ fontSize: 40, color: '#CDAB5A' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#10B981' }}>
                      {metrics.avgQuality}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calidad Promedio
                    </Typography>
                  </Box>
                  <SuccessIcon sx={{ fontSize: 40, color: '#10B981' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#3B82F6' }}>
                      {metrics.dailyGeneration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generación Diaria
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#3B82F6' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#F59E0B' }}>
                      ${metrics.costOptimization.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ahorro Mensual
                    </Typography>
                  </Box>
                  <PerformanceIcon sx={{ fontSize: 40, color: '#F59E0B' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: '#CDAB5A',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#CDAB5A',
            },
          }}
        >
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <ConfigIcon sx={{ mr: 1, fontSize: 20 }} />
                Modelos IA ({models.length})
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <QuestionIcon sx={{ mr: 1, fontSize: 20 }} />
                Preguntas ({questions.length})
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <MetricsIcon sx={{ mr: 1, fontSize: 20 }} />
                Análisis
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* AI Models Tab */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {models.map((model) => (
            <Grid item xs={12} md={6} lg={4} key={model.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  border: model.status === 'ACTIVE' ? '2px solid #10B981' : '1px solid rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(205, 171, 90, 0.2)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                        {model.name}
                      </Typography>
                      <Chip
                        label={model.provider}
                        size="small"
                        sx={{ 
                          backgroundColor: getProviderColor(model.provider),
                          color: 'white',
                          mt: 0.5
                        }}
                      />
                    </Box>
                    <Chip
                      label={model.status}
                      color={getStatusColor(model.status) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {model.version}
                  </Typography>

                  {/* Performance Metrics */}
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" color="text.secondary">
                        Tasa de Éxito
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {model.performance.successRate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={model.performance.successRate}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProviderColor(model.provider)
                        }
                      }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Tiempo Resp.
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {model.performance.avgResponseTime}s
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Preguntas
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {model.performance.questionsGenerated}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Configuration Preview */}
                  <Accordion sx={{ mt: 1 }}>
                    <AccordionSummary expandIcon={<ExpandIcon />}>
                      <Typography variant="body2" fontWeight="bold">
                        Configuración
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="caption" color="text.secondary">
                        Temperatura: {model.configuration.temperature} • 
                        Max Tokens: {model.configuration.maxTokens}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem' }}>
                        {model.configuration.systemPrompt.substring(0, 100)}...
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<TuneIcon />}
                    onClick={() => {
                      setSelectedModel(model)
                      setIsConfigDialogOpen(true)
                    }}
                    sx={{ color: '#CDAB5A' }}
                  >
                    Configurar
                  </Button>
                  <Button
                    size="small"
                    startIcon={<TestIcon />}
                    onClick={() => {
                      setSelectedModel(model)
                      setIsTestDialogOpen(true)
                    }}
                    sx={{ color: '#3B82F6' }}
                  >
                    Probar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Generated Questions Tab */}
      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={2}>
          {questions.map((question) => (
            <Grid item xs={12} key={question.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" justify-content="space-between" alignItems="start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          {getTypeIcon(question.type)}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                          {question.content}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} mb={2}>
                        <Chip label={question.type} size="small" variant="outlined" sx={{ borderColor: '#CDAB5A', color: '#CDAB5A' }} />
                        <Chip label={question.difficulty} size="small" sx={{ backgroundColor: '#F59E0B', color: 'white' }} />
                        <Chip 
                          label={question.status}
                          color={getStatusColor(question.status) as any}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Contexto:</strong> {question.videoContext} • {Math.floor(question.timestamp / 60)}:{(question.timestamp % 60).toString().padStart(2, '0')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Generado por {question.model} • {new Date(question.generatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" sx={{ color: '#CDAB5A' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {question.options && (
                    <Box sx={{ pl: 2, borderLeft: '3px solid #CDAB5A', mt: 2 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                        Opciones:
                      </Typography>
                      {question.options.map((option, index) => (
                        <Typography 
                          key={index} 
                          variant="body2" 
                          sx={{ 
                            mb: 0.5,
                            color: option === question.correctAnswer ? '#10B981' : 'text.secondary',
                            fontWeight: option === question.correctAnswer ? 'bold' : 'normal'
                          }}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                          {option === question.correctAnswer && ' ✓'}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {question.reviewNotes && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Revisión:</strong> {question.reviewNotes}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#CDAB5A' }}>
                  Distribución por Estado
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#10B981' }}>
                        {metrics?.approvedQuestions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aprobadas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#EF4444' }}>
                        {metrics?.rejectedQuestions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rechazadas
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#CDAB5A' }}>
                  Rendimiento por Modelo
                </Typography>
                {models.map((model) => (
                  <Box key={model.id} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">
                        {model.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {model.performance.successRate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={model.performance.successRate}
                      sx={{ 
                        height: 4, 
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProviderColor(model.provider)
                        }
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Configuration Dialog */}
      <ModelConfigDialog 
        open={isConfigDialogOpen}
        model={selectedModel}
        onClose={() => {
          setIsConfigDialogOpen(false)
          setSelectedModel(null)
        }}
      />

      {/* Test Dialog */}
      <TestModelDialog 
        open={isTestDialogOpen}
        model={selectedModel}
        onClose={() => {
          setIsTestDialogOpen(false)
          setSelectedModel(null)
        }}
      />
    </Box>
  )
}

// Configuration Dialog Component
interface ModelConfigDialogProps {
  open: boolean
  model: AIModel | null
  onClose: () => void
}

const ModelConfigDialog: React.FC<ModelConfigDialogProps> = ({ open, model, onClose }) => {
  const [formData, setFormData] = useState({
    temperature: model?.configuration.temperature || 0.7,
    maxTokens: model?.configuration.maxTokens || 1500,
    systemPrompt: model?.configuration.systemPrompt || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updating model configuration:', formData)
    toast.success('Configuración actualizada exitosamente')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Configurar Modelo IA: {model?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Temperatura"
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                inputProps={{ min: 0, max: 2, step: 0.1 }}
                helperText="Controla la creatividad (0 = determinístico, 2 = muy creativo)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Máximo de Tokens"
                type="number"
                value={formData.maxTokens}
                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                inputProps={{ min: 100, max: 4000 }}
                helperText="Longitud máxima de la respuesta"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prompt del Sistema"
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                multiline
                rows={6}
                helperText="Instrucciones que guían el comportamiento del modelo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#CDAB5A',
              '&:hover': { backgroundColor: '#B8954A' }
            }}
          >
            Guardar Configuración
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

// Test Dialog Component
interface TestModelDialogProps {
  open: boolean
  model: AIModel | null
  onClose: () => void
}

const TestModelDialog: React.FC<TestModelDialogProps> = ({ open, model, onClose }) => {
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const handleTest = async () => {
    setIsTesting(true)
    // Simulate API call
    setTimeout(() => {
      setTestResult('¿Cómo podemos aplicar el principio de Ayni en nuestras decisiones de consumo diarias para fortalecer el Bien Común de nuestra comunidad?')
      setIsTesting(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Probar Modelo: {model?.name}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Contexto del Video"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          multiline
          rows={3}
          placeholder="Ej: Video sobre economía circular y principios de reciprocidad..."
          sx={{ mb: 2 }}
        />
        
        {testResult && (
          <Box sx={{ p: 2, backgroundColor: 'rgba(205, 171, 90, 0.1)', borderRadius: 2, mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: '#CDAB5A', mb: 1 }}>
              Pregunta Generada:
            </Typography>
            <Typography variant="body1">
              {testResult}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button
          onClick={handleTest}
          disabled={!testInput || isTesting}
          variant="contained"
          startIcon={isTesting ? <CircularProgress size={16} /> : <TestIcon />}
          sx={{
            backgroundColor: '#CDAB5A',
            '&:hover': { backgroundColor: '#B8954A' }
          }}
        >
          {isTesting ? 'Generando...' : 'Probar Modelo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AIPage