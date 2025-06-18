import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  IconButton,
  alpha,
  useTheme,
  Fade,
  CircularProgress,
  LinearProgress,
  Divider,
  TextField,
  Paper,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  Star,
  Insights,
  Timeline,
  Send,
  VolumeUp,
  Refresh,
  Bookmark,
  Share,
  ExpandMore,
  Lightbulb,
  EmojiEvents,
  Favorite,
  FlightTakeoff,
} from '@mui/icons-material';

import { COSMIC_ELEMENTS, CosmicElement } from '../ui/CosmicThemeSwitcher';
import { useAyniIntelligence } from '../../hooks/useAyniIntelligence';

// Tipos para el AI Mentor Cósmico
interface MentorPersonality {
  name: string;
  essence: string;
  dominantElement: CosmicElement;
  avatar: string;
  specialties: string[];
  wisdom: string[];
  communicationStyle: 'ancient' | 'modern' | 'mystical' | 'practical';
}

interface CosmicGuidance {
  id: string;
  type: 'daily_wisdom' | 'challenge_support' | 'evolution_path' | 'cosmic_timing' | 'ritual_guidance';
  title: string;
  message: string;
  actionSteps: string[];
  elements: CosmicElement[];
  priority: 'gentle' | 'important' | 'urgent' | 'transcendent';
  estimatedImpact: number;
  timeToImplement: string;
  relatedConcepts: string[];
  timestamp: Date;
}

interface EvolutionStage {
  name: string;
  description: string;
  progress: number;
  requirements: string[];
  gifts: string[];
  challenges: string[];
  nextMilestone: string;
}

interface CosmicAIMentorProps {
  userId: string;
  mentorPersonality?: MentorPersonality;
  onGuidanceAccept?: (guidanceId: string) => void;
}

export const CosmicAIMentor: React.FC<CosmicAIMentorProps> = ({
  userId,
  mentorPersonality,
  onGuidanceAccept
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  // Hook de inteligencia Ayni
  const { data: ayniData, recordAction } = useAyniIntelligence(userId);

  // Mentor personalizado basado en el elemento dominante del usuario
  const activeMentor = useMemo((): MentorPersonality => {
    if (mentorPersonality) return mentorPersonality;

    const userElement = ayniData?.dominantElement || 'aire';
    const mentors: Record<CosmicElement, MentorPersonality> = {
      fuego: {
        name: 'Solaris',
        essence: 'Maestro del Fuego Sagrado y la Manifestación',
        dominantElement: 'fuego',
        avatar: '🔥',
        specialties: ['Poder Personal', 'Liderazgo Consciente', 'Transformación', 'Acción Divina'],
        wisdom: [
          'El fuego que arde en ti es el mismo que ilumina las estrellas.',
          'La acción consciente es oración en movimiento.',
          'Tu pasión es el combustible de la transformación mundial.'
        ],
        communicationStyle: 'practical'
      },
      agua: {
        name: 'Aquaellis',
        essence: 'Guardiana de la Sabiduría Emocional y Flujo',
        dominantElement: 'agua',
        avatar: '🌊',
        specialties: ['Inteligencia Emocional', 'Sanación', 'Colaboración', 'Adaptabilidad'],
        wisdom: [
          'Como el agua, encuentra tu camino rodeando los obstáculos.',
          'En la profundidad de tus emociones reside tu mayor sabiduría.',
          'La verdadera fortaleza fluye como el río: constante y serena.'
        ],
        communicationStyle: 'mystical'
      },
      tierra: {
        name: 'Gaialius',
        essence: 'Anciano de la Madre Tierra y Abundancia',
        dominantElement: 'tierra',
        avatar: '🌍',
        specialties: ['Abundancia', 'Manifestación Material', 'Sanación Planetaria', 'Paciencia'],
        wisdom: [
          'Todo lo que necesitas ya existe en el campo cuántico de posibilidades.',
          'La paciencia de la Tierra enseña que todo tiene su tiempo perfecto.',
          'Tus raíces determinan qué tan alto pueden crecer tus ramas.'
        ],
        communicationStyle: 'ancient'
      },
      aire: {
        name: 'Mentalis',
        essence: 'Tejedor del Conocimiento y Comunicación Cósmica',
        dominantElement: 'aire',
        avatar: '💨',
        specialties: ['Sabiduría', 'Comunicación', 'Innovación', 'Perspectiva Elevada'],
        wisdom: [
          'Los pensamientos son semillas; siémbralos conscientemente.',
          'La comunicación verdadera trasciende las palabras.',
          'Tu mente es el puente entre lo divino y lo humano.'
        ],
        communicationStyle: 'modern'
      },
      ether: {
        name: 'Ethereus',
        essence: 'Guardián del Vacío Cuántico y Consciencia Universal',
        dominantElement: 'ether',
        avatar: '✨',
        specialties: ['Consciencia Cósmica', 'Unidad', 'Trascendencia', 'Multidimensionalidad'],
        wisdom: [
          'En el vacío aparente está la plenitud infinita.',
          'Eres tanto la gota como el océano.',
          'La separación es la ilusión; la unidad es la realidad.'
        ],
        communicationStyle: 'mystical'
      }
    };

    return mentors[userElement];
  }, [ayniData, mentorPersonality]);

  // Evaluación del estado evolutivo actual
  const currentEvolutionStage = useMemo((): EvolutionStage => {
    const ayniBalance = ayniData?.ayniBalance?.overall || 50;
    
    if (ayniBalance >= 90) {
      return {
        name: 'Bodhisattva Cósmico',
        description: 'Ser iluminado que sirve a la evolución de toda la vida',
        progress: ayniBalance,
        requirements: ['Servicio desinteresado', 'Compasión infinita', 'Sabiduría trascendente'],
        gifts: ['Sanación multidimensional', 'Telepática cósmica', 'Manifestación instantánea'],
        challenges: ['Mantener conexión humana', 'No interferir con el libre albedrío'],
        nextMilestone: 'Ascensión planetaria completa'
      };
    } else if (ayniBalance >= 75) {
      return {
        name: 'Maestro Consciente',
        description: 'Guía espiritual que enseña a través del ejemplo',
        progress: ayniBalance,
        requirements: ['Dominio personal', 'Servicio activo', 'Sabiduría práctica'],
        gifts: ['Visión clara', 'Influencia positiva', 'Magnetismo espiritual'],
        challenges: ['Ego espiritual', 'Aislamiento por elevación'],
        nextMilestone: 'Trascendencia del yo personal'
      };
    } else if (ayniBalance >= 60) {
      return {
        name: 'Buscador Avanzado',
        description: 'Estudiante serio del camino de evolución consciente',
        progress: ayniBalance,
        requirements: ['Práctica constante', 'Estudio profundo', 'Servicio regular'],
        gifts: ['Intuición desarrollada', 'Liderazgo natural', 'Claridad mental'],
        challenges: ['Dudas espirituales', 'Impaciencia con el proceso'],
        nextMilestone: 'Estabilización en la presencia'
      };
    } else {
      return {
        name: 'Despertar Inicial',
        description: 'Primera etapa del camino consciente',
        progress: ayniBalance,
        requirements: ['Apertura mental', 'Voluntad de cambio', 'Práctica básica'],
        gifts: ['Curiosidad espiritual', 'Flexibilidad', 'Potencial infinito'],
        challenges: ['Confusión inicial', 'Resistencia del ego'],
        nextMilestone: 'Establecimiento de práctica diaria'
      };
    }
  }, [ayniData]);

  // Generar guía personalizada basada en el perfil
  const cosmicGuidance = useMemo((): CosmicGuidance[] => [
    {
      id: 'daily_1',
      type: 'daily_wisdom',
      title: `Mensaje de ${activeMentor.name}`,
      message: activeMentor.wisdom[Math.floor(Math.random() * activeMentor.wisdom.length)],
      actionSteps: [
        'Respira profundamente y conecta con tu esencia',
        'Visualiza esta sabiduría integrándose en tu ser',
        'Elige una acción pequeña que refleje esta verdad hoy'
      ],
      elements: [activeMentor.dominantElement],
      priority: 'gentle',
      estimatedImpact: 85,
      timeToImplement: '5-10 minutos',
      relatedConcepts: ['Presencia', 'Sabiduría', 'Integración'],
      timestamp: new Date()
    },
    {
      id: 'evolution_1',
      type: 'evolution_path',
      title: 'Próximo Paso Evolutivo',
      message: `Para avanzar hacia "${currentEvolutionStage.nextMilestone}", enfócate en desarrollar ${currentEvolutionStage.requirements[0]}.`,
      actionSteps: [
        'Identifica un área específica para crecer',
        'Diseña una práctica diaria de 15 minutos',
        'Busca un mentor o comunidad de apoyo',
        'Registra tu progreso semanalmente'
      ],
      elements: ['ether', activeMentor.dominantElement],
      priority: 'important',
      estimatedImpact: 92,
      timeToImplement: '21 días',
      relatedConcepts: ['Evolución', 'Disciplina', 'Crecimiento'],
      timestamp: new Date()
    },
    {
      id: 'cosmic_1',
      type: 'cosmic_timing',
      title: 'Alineación Cósmica Detectada',
      message: 'La configuración energética actual favorece proyectos de sanación colectiva. Es momento de expandir tu servicio.',
      actionSteps: [
        'Identifica una necesidad en tu comunidad',
        'Conecta con personas afines',
        'Diseña un proyecto de impacto social',
        'Inicia con una acción pequeña pero consistente'
      ],
      elements: ['agua', 'tierra', 'ether'],
      priority: 'transcendent',
      estimatedImpact: 96,
      timeToImplement: '30 días',
      relatedConcepts: ['Servicio', 'Timing', 'Bien Común'],
      timestamp: new Date()
    }
  ], [activeMentor, currentEvolutionStage]);

  // Manejar envío de mensaje al mentor
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);
    
    // Simular respuesta del AI mentor
    const mentorResponse = generateMentorResponse(userMessage);
    
    setConversationHistory(prev => [
      ...prev,
      { type: 'user', message: userMessage, timestamp: new Date() },
      { type: 'mentor', message: mentorResponse, timestamp: new Date() }
    ]);

    recordAction({
      type: 'learning',
      module: 'profile',
      value: 15,
      metadata: {
        resourceType: 'ai_mentor_interaction',
        skillCategory: activeMentor.dominantElement
      }
    });

    setUserMessage('');
    setLoading(false);
  };

  // Generar respuesta contextual del mentor
  const generateMentorResponse = (message: string): string => {
    const responses = {
      greeting: `Namaste, querido ${currentEvolutionStage.name}. Soy ${activeMentor.name}, y estoy aquí para acompañarte en tu viaje de evolución consciente.`,
      guidance: `Desde la sabiduría del elemento ${COSMIC_ELEMENTS[activeMentor.dominantElement].name}, te sugiero: ${activeMentor.wisdom[0]}`,
      evolution: `En tu etapa actual de "${currentEvolutionStage.name}", es importante que te enfoques en ${currentEvolutionStage.requirements[0]}.`,
      encouragement: `Tu luz brilla con el ${currentEvolutionStage.progress}% de su potencial. Cada paso consciente multiplica exponencialmente tu impacto.`
    };

    if (message.toLowerCase().includes('hola') || message.toLowerCase().includes('help')) {
      return responses.greeting;
    } else if (message.toLowerCase().includes('guía') || message.toLowerCase().includes('consejo')) {
      return responses.guidance;
    } else if (message.toLowerCase().includes('evolución') || message.toLowerCase().includes('siguiente')) {
      return responses.evolution;
    } else {
      return responses.encouragement;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      {/* Header del Mentor */}
      <Card sx={{ 
        p: 3, 
        mb: 3,
        background: `linear-gradient(135deg, ${alpha(COSMIC_ELEMENTS[activeMentor.dominantElement].color, 0.1)} 0%, ${alpha('#E1BEE7', 0.1)} 100%)`,
        border: `2px solid ${alpha(COSMIC_ELEMENTS[activeMentor.dominantElement].color, 0.3)}`
      }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: '2rem',
              background: COSMIC_ELEMENTS[activeMentor.dominantElement].gradient,
              color: 'white'
            }}
          >
            {activeMentor.avatar}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {activeMentor.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {activeMentor.essence}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {activeMentor.specialties.map((specialty) => (
                <Chip
                  key={specialty}
                  label={specialty}
                  size="small"
                  sx={{
                    background: alpha(COSMIC_ELEMENTS[activeMentor.dominantElement].color, 0.2),
                    color: COSMIC_ELEMENTS[activeMentor.dominantElement].color
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Card>

      {/* Estado Evolutivo Actual */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          <EmojiEvents sx={{ color: '#FFD700' }} />
          Tu Estado Evolutivo Actual
        </Typography>
        
        <Stack direction="row" spacing={3} alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: COSMIC_ELEMENTS[activeMentor.dominantElement].color }}>
              {currentEvolutionStage.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentEvolutionStage.description}
            </Typography>
          </Box>
          
          <Box textAlign="center">
            <CircularProgress
              variant="determinate"
              value={currentEvolutionStage.progress}
              size={60}
              thickness={6}
              sx={{
                color: COSMIC_ELEMENTS[activeMentor.dominantElement].color,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round'
                }
              }}
            />
            <Typography variant="caption" display="block" mt={1}>
              {currentEvolutionStage.progress}% Realizado
            </Typography>
          </Box>
        </Stack>

        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            🎯 Próximo Hito: {currentEvolutionStage.nextMilestone}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={currentEvolutionStage.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              background: alpha(COSMIC_ELEMENTS[activeMentor.dominantElement].color, 0.1),
              '& .MuiLinearProgress-bar': {
                background: COSMIC_ELEMENTS[activeMentor.dominantElement].gradient
              }
            }}
          />
        </Box>

        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="caption" fontWeight="bold" color="success.main">
              ✨ Dones Actuales:
            </Typography>
            {currentEvolutionStage.gifts.map((gift, idx) => (
              <Typography key={idx} variant="body2" color="text.secondary">
                • {gift}
              </Typography>
            ))}
          </Box>
          <Box flex={1}>
            <Typography variant="caption" fontWeight="bold" color="warning.main">
              🎯 Desafíos:
            </Typography>
            {currentEvolutionStage.challenges.map((challenge, idx) => (
              <Typography key={idx} variant="body2" color="text.secondary">
                • {challenge}
              </Typography>
            ))}
          </Box>
        </Stack>
      </Card>

      {/* Guías Cósmicas */}
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
          <AutoAwesome sx={{ color: '#9C27B0' }} />
          Guías Cósmicas Personalizadas
        </Typography>

        {cosmicGuidance.map((guidance, index) => {
          const priorityColor = guidance.priority === 'transcendent' ? '#E1BEE7' :
                               guidance.priority === 'urgent' ? '#F44336' :
                               guidance.priority === 'important' ? '#FF9800' : '#4CAF50';

          return (
            <Fade key={guidance.id} in={true} timeout={500 + index * 200}>
              <Card
                sx={{
                  p: 3,
                  background: alpha(priorityColor, 0.05),
                  border: `2px solid ${alpha(priorityColor, 0.2)}`,
                  borderRadius: 3
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {guidance.title}
                    </Typography>
                    <Stack direction="row" spacing={1} mb={1}>
                      <Chip
                        label={guidance.type.replace('_', ' ')}
                        size="small"
                        sx={{ background: alpha(priorityColor, 0.2), color: priorityColor }}
                      />
                      <Chip
                        label={`${guidance.estimatedImpact}% impacto`}
                        size="small"
                        sx={{ background: alpha('#4CAF50', 0.2), color: '#4CAF50' }}
                      />
                    </Stack>
                  </Box>
                  
                  <Typography
                    variant="caption"
                    sx={{
                      background: alpha(priorityColor, 0.1),
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      color: priorityColor,
                      fontWeight: 'bold'
                    }}
                  >
                    {guidance.timeToImplement}
                  </Typography>
                </Stack>

                <Typography variant="body1" gutterBottom sx={{ fontStyle: 'italic', mb: 2 }}>
                  "{guidance.message}"
                </Typography>

                <Box mb={2}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    🗺️ Pasos de Acción:
                  </Typography>
                  {guidance.actionSteps.map((step, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" gutterBottom>
                      {idx + 1}. {step}
                    </Typography>
                  ))}
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1}>
                    {guidance.elements.map(element => (
                      <Chip
                        key={element}
                        label={COSMIC_ELEMENTS[element].name}
                        size="small"
                        sx={{
                          background: alpha(COSMIC_ELEMENTS[element].color, 0.1),
                          color: COSMIC_ELEMENTS[element].color,
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onGuidanceAccept?.(guidance.id)}
                      sx={{
                        background: priorityColor,
                        color: 'white',
                        '&:hover': { background: priorityColor }
                      }}
                    >
                      ✨ Acepto
                    </Button>
                    <IconButton size="small" sx={{ color: priorityColor }}>
                      <Bookmark />
                    </IconButton>
                    <IconButton size="small" sx={{ color: priorityColor }}>
                      <Share />
                    </IconButton>
                  </Stack>
                </Stack>
              </Card>
            </Fade>
          );
        })}
      </Stack>

      {/* Chat con el Mentor */}
      <Card sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          <Psychology sx={{ color: COSMIC_ELEMENTS[activeMentor.dominantElement].color }} />
          Conversación con {activeMentor.name}
        </Typography>

        <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2, p: 2, background: alpha(theme.palette.primary.main, 0.02), borderRadius: 2 }}>
          {conversationHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Inicia una conversación con tu mentor cósmico...
            </Typography>
          ) : (
            conversationHistory.map((entry, idx) => (
              <Box key={idx} mb={2}>
                <Paper
                  sx={{
                    p: 2,
                    background: entry.type === 'user' ? alpha(theme.palette.primary.main, 0.1) : alpha(COSMIC_ELEMENTS[activeMentor.dominantElement].color, 0.1),
                    ml: entry.type === 'user' ? 4 : 0,
                    mr: entry.type === 'mentor' ? 4 : 0
                  }}
                >
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    {entry.type === 'user' ? 'Tú' : activeMentor.name}
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {entry.message}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
        </Box>

        <Stack direction="row" spacing={2} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Pregunta a tu mentor cósmico..."
            variant="outlined"
            size="small"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={loading || !userMessage.trim()}
            sx={{
              background: COSMIC_ELEMENTS[activeMentor.dominantElement].gradient,
              color: 'white',
              minWidth: 100
            }}
          >
            {loading ? <CircularProgress size={20} /> : <Send />}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default CosmicAIMentor;