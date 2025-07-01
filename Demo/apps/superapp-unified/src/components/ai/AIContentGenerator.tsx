import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,

  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

  LinearProgress,
  Avatar,
  Stack,
  Divider,
  Alert,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material'
import {
  AutoAwesome as AIIcon,
  Psychology as BrainIcon,
  QuestionAnswer as QuestionIcon,
  School as EducationIcon,
  Campaign as ChallengeIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Quiz as QuizIcon,
  Lightbulb as IdeaIcon,
  Tune as TuneIcon,
  PlayArrow as GenerateIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  AutoFixHigh as MagicIcon,
  TrendingUp as TrendingIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { triggerReward, triggerHapticFeedback } from '../../lib/gameFeelSystem'

// Types
interface AIGenerationRequest {
  type: 'QUESTION' | 'CHALLENGE' | 'ARTICLE' | 'VIDEO_SCRIPT' | 'QUIZ'
  topic: string
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  philosophy: ('RECIPROCIDAD' | 'BIEN_COMUN' | 'MERITOS' | 'SOSTENIBILIDAD')[]
  tone: 'FRIENDLY' | 'PROFESSIONAL' | 'INSPIRING' | 'EDUCATIONAL'
  length: 'SHORT' | 'MEDIUM' | 'LONG'
  audience: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  customPrompt?: string
}

interface GeneratedContent {
  id: string
  type: AIGenerationRequest['type']
  title: string
  content: string
  metadata: {
    topic: string
    difficulty: string
    estimatedTime: number
    philosophyAlignment: string[]
    aiModel: string
    generatedAt: Date
    version: number
  }
  metrics: {
    aiScore: number
    engagementPrediction: number
    philosophyAlignment: number
    uniqueness: number
  }
  variations?: GeneratedContent[]
}

interface AIModel {
  id: string
  name: string
  description: string
  capabilities: string[]
  speed: 'FAST' | 'MEDIUM' | 'SLOW'
  quality: 'GOOD' | 'EXCELLENT' | 'OUTSTANDING'
  premium: boolean
}

const AIContentGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [generationRequest, setGenerationRequest] = useState<AIGenerationRequest>({
    type: 'QUESTION',
    topic: '',
    difficulty: 'INTERMEDIATE',
    philosophy: ['RECIPROCIDAD'],
    tone: 'EDUCATIONAL',
    length: 'MEDIUM',
    audience: 'INTERMEDIATE'
  })
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4-coomunity')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)

  const queryClient = useQueryClient()

  // Available AI models
  const aiModels: AIModel[] = [
    {
      id: 'gpt-4-coomunity',
      name: 'CoomÜnity GPT-4',
      description: 'Modelo especializado en filosofía CoomÜnity y valores del Bien Común',
      capabilities: ['Preguntas profundas', 'Contenido filosófico', 'Desafíos éticos'],
      speed: 'MEDIUM',
      quality: 'OUTSTANDING',
      premium: false
    },
    {
      id: 'claude-reciprocidad',
      name: 'Claude Reciprocidad',
      description: 'Experto en reciprocidad y balance para generar contenido equilibrado',
      capabilities: ['Análisis de balance', 'Contenido de intercambio', 'Reflexiones Reciprocidad'],
      speed: 'FAST',
      quality: 'EXCELLENT',
      premium: true
    },
    {
      id: 'gemini-sustainability',
      name: 'Gemini Sostenibilidad',
      description: 'Especializado en contenido de sostenibilidad y medio ambiente',
      capabilities: ['Ecología', 'Sostenibilidad', 'Cambio climático'],
      speed: 'FAST',
      quality: 'EXCELLENT',
      premium: false
    },
    {
      id: 'llama-entrepreneurship',
      name: 'LLaMA Emprendimiento',
      description: 'Enfocado en emprendimiento confiable y economía colaborativa',
      capabilities: ['Negocios éticos', 'Startup advice', 'Economía colaborativa'],
      speed: 'SLOW',
      quality: 'GOOD',
      premium: false
    }
  ]

  // Generation history
  const { data: generationHistory } = useQuery<GeneratedContent[]>({
    queryKey: ['ai-generation-history'],
    queryFn: async () => [
      {
        id: '1',
        type: 'QUESTION',
        title: '¿Cómo puedes aplicar el principio de Reciprocidad en tu vida diaria?',
        content: 'Esta pregunta invita a reflexionar sobre la reciprocidad sagrada en acciones cotidianas...',
        metadata: {
          topic: 'Reciprocidad en la vida cotidiana',
          difficulty: 'INTERMEDIATE',
          estimatedTime: 10,
          philosophyAlignment: ['RECIPROCIDAD', 'BIEN_COMUN'],
          aiModel: 'gpt-4-coomunity',
          generatedAt: new Date(),
          version: 1
        },
        metrics: {
          aiScore: 0.92,
          engagementPrediction: 0.85,
          philosophyAlignment: 0.95,
          uniqueness: 0.88
        }
      },
      {
        id: '2',
        type: 'CHALLENGE',
        title: 'Desafío: Intercambio Sostenible de 7 Días',
        content: 'Durante una semana, realiza al menos un intercambio consciente cada día...',
        metadata: {
          topic: 'Intercambio sostenible',
          difficulty: 'BASIC',
          estimatedTime: 7,
          philosophyAlignment: ['RECIPROCIDAD', 'SOSTENIBILIDAD'],
          aiModel: 'claude-reciprocidad',
          generatedAt: new Date(),
          version: 1
        },
        metrics: {
          aiScore: 0.89,
          engagementPrediction: 0.92,
          philosophyAlignment: 0.91,
          uniqueness: 0.85
        }
      }
    ]
  })

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (request: AIGenerationRequest) => {
      setIsGenerating(true)
      setGenerationStep(0)

      // Simulate AI generation steps
      const steps = [
        'Analizando tema y contexto...',
        'Aplicando filosofía CoomÜnity...',
        'Generando contenido único...',
        'Optimizando para engagement...',
        'Validando alineación filosófica...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Mock AI generation
      const mockContent: GeneratedContent = {
        id: Date.now().toString(),
        type: request.type,
        title: generateMockTitle(request),
        content: generateMockContent(request),
        metadata: {
          topic: request.topic,
          difficulty: request.difficulty,
          estimatedTime: request.length === 'SHORT' ? 5 : request.length === 'MEDIUM' ? 15 : 30,
          philosophyAlignment: request.philosophy,
          aiModel: selectedModel,
          generatedAt: new Date(),
          version: 1
        },
        metrics: {
          aiScore: 0.85 + Math.random() * 0.15,
          engagementPrediction: 0.75 + Math.random() * 0.25,
          philosophyAlignment: 0.80 + Math.random() * 0.20,
          uniqueness: 0.70 + Math.random() * 0.30
        }
      }

      setIsGenerating(false)
      return mockContent
    },
    onSuccess: (content) => {
      setGeneratedContent(content)
      triggerReward('MERITOS', 10)
      triggerHapticFeedback('success')
      toast.success('¡Contenido generado exitosamente!', {
        description: `+10 Méritos por usar IA generativa`,
        duration: 3000,
      })
      queryClient.invalidateQueries({ queryKey: ['ai-generation-history'] })
    }
  })

  const generateMockTitle = (request: AIGenerationRequest): string => {
    const templates = {
      QUESTION: [
        `¿Cómo aplicar ${request.philosophy[0]} en ${request.topic}?`,
        `Reflexión sobre ${request.topic} desde la perspectiva del Bien Común`,
        `¿Qué significa ${request.topic} en el contexto de CoomÜnity?`
      ],
      CHALLENGE: [
        `Desafío: ${request.topic} Sostenible`,
        `Reto de 7 días: ${request.topic} Consciente`,
        `Transformando ${request.topic} con Reciprocidad`
      ],
      ARTICLE: [
        `Guía completa: ${request.topic} y el Bien Común`,
        `Explorando ${request.topic} desde la filosofía CoomÜnity`,
        `${request.topic}: Un enfoque de reciprocidad sagrada`
      ],
      VIDEO_SCRIPT: [
        `Script: ${request.topic} para Emprendedores Confiables`,
        `Video educativo: ${request.topic} y Sostenibilidad`,
        `Masterclass: ${request.topic} con valores CoomÜnity`
      ],
      QUIZ: [
        `Quiz: ¿Cuánto sabes sobre ${request.topic}?`,
        `Evaluación: ${request.topic} y Filosofía CoomÜnity`,
        `Test de conocimiento: ${request.topic} Consciente`
      ]
    }

    const typeTemplates = templates[request.type]
    return typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
  }

  const generateMockContent = (request: AIGenerationRequest): string => {
    const philosophyContext = request.philosophy.includes('RECIPROCIDAD')
      ? 'Desde el principio de reciprocidad sagrada (Reciprocidad)'
      : request.philosophy.includes('BIEN_COMUN')
      ? 'Priorizando siempre el Bien Común sobre el bien particular'
      : 'Aplicando los valores fundamentales de CoomÜnity'

    const baseContent = `${philosophyContext}, este contenido sobre ${request.topic} te invita a reflexionar y actuar de manera consciente.

En el contexto de CoomÜnity, ${request.topic} representa una oportunidad para crear valor genuino tanto para ti como para la comunidad. Cada acción que realizas tiene el potencial de generar ondas positivas que se expanden hacia el bienestar colectivo.

**Puntos clave para reflexionar:**

1. **Conexión con el propósito**: ¿Cómo se alinea ${request.topic} con tu vocación personal y el servicio al Bien Común?

2. **Reciprocidad consciente**: ¿De qué manera puedes aplicar el principio de Reciprocidad en este contexto?

3. **Impacto sostenible**: ¿Cuál es el efecto a largo plazo de tus acciones en la comunidad y el ecosistema?

4. **Crecimiento mutuo**: ¿Cómo puede este tema contribuir al desarrollo tanto personal como colectivo?

Recuerda que en CoomÜnity, cada pequeña acción cuenta y tiene el potencial de transformar no solo tu realidad, sino la de toda la comunidad. ¡Juntos construimos un mundo más consciente y equitativo!`

    return request.length === 'SHORT'
      ? baseContent.substring(0, 300) + '...'
      : request.length === 'LONG'
      ? baseContent + '\n\n**Ejercicio práctico:** [Contenido específico del ejercicio]\n\n**Recursos adicionales:** [Enlaces y referencias]'
      : baseContent
  }

  const handleGenerate = () => {
    if (!generationRequest.topic.trim()) {
      toast.error('Por favor ingresa un tema para generar contenido')
      return
    }

    triggerHapticFeedback('light')
    generateContentMutation.mutate(generationRequest)
  }

  const handleSaveContent = () => {
    if (!generatedContent) return

    // Simulate saving to library
    triggerReward('MERITOS', 5)
    toast.success('Contenido guardado en tu biblioteca')
  }

  const getMetricColor = (value: number) => {
    if (value >= 0.9) return 'success'
    if (value >= 0.7) return 'warning'
    return 'error'
  }

  const getModelIcon = (model: AIModel) => {
    if (model.id.includes('gpt')) return <BrainIcon />
    if (model.id.includes('claude')) return <MagicIcon />
    if (model.id.includes('gemini')) return <SpeedIcon />
    return <AIIcon />
  }

  const generationSteps = [
    'Analizando tema',
    'Aplicando filosofía',
    'Generando contenido',
    'Optimizando',
    'Finalizando'
  ]

  const contentTypes = [
    { id: 'QUESTION', label: 'Preguntas', icon: <QuestionIcon /> },
    { id: 'CHALLENGE', label: 'Desafíos', icon: <ChallengeIcon /> },
    { id: 'ARTICLE', label: 'Artículos', icon: <ArticleIcon /> },
    { id: 'VIDEO_SCRIPT', label: 'Scripts', icon: <VideoIcon /> },
    { id: 'QUIZ', label: 'Quiz', icon: <QuizIcon /> }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: '#CDAB5A' }}>
        🤖 Generador de Contenido IA
      </Typography>

      <Grid container spacing={3}>
        {/* Generation Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Crear Contenido Inteligente
              </Typography>

              {/* Content Type Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Tipo de contenido:
                </Typography>
                <Grid container spacing={1}>
                  {contentTypes.map((type) => (
                    <Grid item xs={6} sm={4} md={2.4} key={type.id}>
                      <Button
                        fullWidth
                        variant={generationRequest.type === type.id ? 'contained' : 'outlined'}
                        startIcon={type.icon}
                        onClick={() => setGenerationRequest(prev => ({ ...prev, type: type.id as any }))}
                        sx={{
                          backgroundColor: generationRequest.type === type.id ? '#CDAB5A' : 'transparent',
                          py: 1.5
                        }}
                      >
                        {type.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Topic Input */}
              <TextField
                fullWidth
                label="Tema principal"
                placeholder="Ej: Emprendimiento sostenible, Comunidades resilientes, Tecnología consciente..."
                value={generationRequest.topic}
                onChange={(e) => setGenerationRequest(prev => ({ ...prev, topic: e.target.value }))}
                sx={{ mb: 3 }}
                helperText="Describe el tema específico que quieres explorar"
              />

              {/* Quick Settings */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Dificultad</InputLabel>
                    <Select
                      value={generationRequest.difficulty}
                      onChange={(e) => setGenerationRequest(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    >
                      <MenuItem value="BASIC">Básico</MenuItem>
                      <MenuItem value="INTERMEDIATE">Intermedio</MenuItem>
                      <MenuItem value="ADVANCED">Avanzado</MenuItem>
                      <MenuItem value="EXPERT">Experto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Extensión</InputLabel>
                    <Select
                      value={generationRequest.length}
                      onChange={(e) => setGenerationRequest(prev => ({ ...prev, length: e.target.value as any }))}
                    >
                      <MenuItem value="SHORT">Corto (5 min)</MenuItem>
                      <MenuItem value="MEDIUM">Medio (15 min)</MenuItem>
                      <MenuItem value="LONG">Largo (30+ min)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tono</InputLabel>
                    <Select
                      value={generationRequest.tone}
                      onChange={(e) => setGenerationRequest(prev => ({ ...prev, tone: e.target.value as any }))}
                    >
                      <MenuItem value="FRIENDLY">Amigable</MenuItem>
                      <MenuItem value="PROFESSIONAL">Profesional</MenuItem>
                      <MenuItem value="INSPIRING">Inspirador</MenuItem>
                      <MenuItem value="EDUCATIONAL">Educativo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Audiencia</InputLabel>
                    <Select
                      value={generationRequest.audience}
                      onChange={(e) => setGenerationRequest(prev => ({ ...prev, audience: e.target.value as any }))}
                    >
                      <MenuItem value="BEGINNER">Principiante</MenuItem>
                      <MenuItem value="INTERMEDIATE">Intermedio</MenuItem>
                      <MenuItem value="ADVANCED">Avanzado</MenuItem>
                      <MenuItem value="EXPERT">Experto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Philosophy Alignment */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Alineación filosófica:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {['RECIPROCIDAD', 'BIEN_COMUN', 'MERITOS', 'SOSTENIBILIDAD'].map((phil) => (
                    <Chip
                      key={phil}
                      label={phil}
                      clickable
                      color={generationRequest.philosophy.includes(phil as any) ? 'primary' : 'default'}
                      onClick={() => {
                        setGenerationRequest(prev => ({
                          ...prev,
                          philosophy: prev.philosophy.includes(phil as any)
                            ? prev.philosophy.filter(p => p !== phil)
                            : [...prev.philosophy, phil as any]
                        }))
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Advanced Settings */}
              <Box sx={{ mb: 3 }}>
                <Button
                  startIcon={<TuneIcon />}
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  endIcon={showAdvancedSettings ? <CollapseIcon /> : <ExpandIcon />}
                >
                  Configuración Avanzada
                </Button>

                <Collapse in={showAdvancedSettings}>
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    {/* AI Model Selection */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Modelo de IA</InputLabel>
                      <Select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        {aiModels.map((model) => (
                          <MenuItem key={model.id} value={model.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              {getModelIcon(model)}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                  {model.name}
                                  {model.premium && <Chip label="Premium" size="small" sx={{ ml: 1 }} />}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {model.description}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Custom Prompt */}
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Prompt personalizado (opcional)"
                      placeholder="Añade instrucciones específicas para personalizar la generación..."
                      value={generationRequest.customPrompt || ''}
                      onChange={(e) => setGenerationRequest(prev => ({ ...prev, customPrompt: e.target.value }))}
                    />
                  </Box>
                </Collapse>
              </Box>

              {/* Generate Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<GenerateIcon />}
                onClick={handleGenerate}
                disabled={isGenerating || !generationRequest.topic.trim()}
                sx={{
                  backgroundColor: '#CDAB5A',
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': { backgroundColor: '#B8954A' }
                }}
              >
                {isGenerating ? 'Generando...' : 'Generar Contenido con IA'}
              </Button>

              {/* Generation Progress */}
              {isGenerating && (
                <Box sx={{ mt: 3 }}>
                  <Stepper activeStep={generationStep} orientation="horizontal">
                    {generationSteps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Content Preview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                {generatedContent ? 'Contenido Generado' : 'Vista Previa'}
              </Typography>

              {generatedContent ? (
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    {generatedContent.title}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip size="small" label={generatedContent.type} color="primary" />
                    <Chip size="small" label={generatedContent.metadata.difficulty} />
                    <Chip size="small" label={`${generatedContent.metadata.estimatedTime} min`} />
                  </Stack>

                  <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.50', maxHeight: 300, overflow: 'auto' }}>
                    <Typography variant="body2">
                      {generatedContent.content}
                    </Typography>
                  </Paper>

                  {/* AI Metrics */}
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Métricas de Calidad:
                  </Typography>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    {[
                      { label: 'IA Score', value: generatedContent.metrics.aiScore },
                      { label: 'Engagement', value: generatedContent.metrics.engagementPrediction },
                      { label: 'Filosofía', value: generatedContent.metrics.philosophyAlignment },
                      { label: 'Únique', value: generatedContent.metrics.uniqueness }
                    ].map((metric) => (
                      <Grid item xs={6} key={metric.label}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {metric.label}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={metric.value * 100}
                            color={getMetricColor(metric.value) as any}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" fontWeight="bold">
                            {Math.round(metric.value * 100)}%
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveContent}
                      variant="outlined"
                    >
                      Guardar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ShareIcon />}
                      variant="outlined"
                    >
                      Compartir
                    </Button>
                    <Button
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleGenerate}
                    >
                      Regenerar
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AIIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    El contenido generado aparecerá aquí
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Acciones Rápidas
              </Typography>

              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingIcon />}
                  size="small"
                >
                  Temas Trending
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AnalyticsIcon />}
                  size="small"
                >
                  Analizar Performance
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<IdeaIcon />}
                  size="small"
                >
                  Inspiración IA
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Generation History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Historial de Generaciones
              </Typography>

              <Grid container spacing={2}>
                {generationHistory?.map((content) => (
                  <Grid item xs={12} sm={6} md={4} key={content.id}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Chip size="small" label={content.type} color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          {content.metadata.generatedAt.toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        {content.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {content.content.substring(0, 100)}...
                      </Typography>

                      <Stack direction="row" spacing={1} justifyContent="space-between">
                        <Box>
                          <Chip size="small" label={`${Math.round(content.metrics.aiScore * 100)}%`} />
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small">
                            <LikeIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AIContentGenerator
