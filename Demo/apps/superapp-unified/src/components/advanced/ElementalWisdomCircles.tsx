import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Badge,
} from '@mui/material';
import {

  GroupAdd,
  Psychology,
  AutoAwesome,
  TrendingUp,
  Schedule,
  LocationOn,
  Language,
  Star,
  EmojiEvents,
  Timeline,
  Insights,
  ConnectWithoutContact,
  School,
  Lightbulb,
  Favorite,
  Close,
} from '@mui/icons-material';

import { COSMIC_ELEMENTS, CosmicElement } from '../ui/CosmicThemeSwitcher';
import { useReciprocidadIntelligence } from '../../hooks/useReciprocidadIntelligence';

// Tipos para los Círculos de Sabiduría
interface WisdomCircle {
  id: string;
  name: string;
  element: CosmicElement;
  description: string;
  purpose: string;
  level: 'iniciado' | 'practicante' | 'maestro' | 'sabio';
  members: CircleMember[];
  currentProject?: CircleProject;
  meetingSchedule: MeetingSchedule;
  achievements: CircleAchievement[];
  energyLevel: number; // 0-100
  wisdomPoints: number;
  createdAt: Date;
  tags: string[];
  isPrivate: boolean;
}

interface CircleMember {
  id: string;
  name: string;
  avatar: string;
  elementAffinity: Record<CosmicElement, number>;
  role: 'member' | 'facilitator' | 'elder' | 'guest';
  joinedAt: Date;
  contributionScore: number;
  specialSkills: string[];
  wisdomShared: number;
}

interface CircleProject {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'study' | 'creation' | 'service' | 'ritual';
  progress: number;
  participantCount: number;
  expectedCompletion: Date;
  bienComunImpact: number;
}

interface MeetingSchedule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'lunar_cycle';
  nextMeeting: Date;
  duration: number; // minutes
  location: 'virtual' | 'physical' | 'hybrid';
  timezone: string;
}

interface CircleAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'cosmic';
  participants: string[];
}

interface ElementalWisdomCirclesProps {
  userId: string;
  userElement?: CosmicElement;
  showCreateDialog?: boolean;
  onCircleJoin?: (circleId: string) => void;
}

export const ElementalWisdomCircles: React.FC<ElementalWisdomCirclesProps> = ({
  userId,
  userElement = 'aire',
  showCreateDialog = false,
  onCircleJoin
}) => {
  const theme = useTheme();
  const [selectedElement, setSelectedElement] = useState<CosmicElement>(userElement);
  const [viewMode, setViewMode] = useState<'discover' | 'my_circles' | 'create'>('discover');
  const [createDialogOpen, setCreateDialogOpen] = useState(showCreateDialog);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<WisdomCircle | null>(null);

  // Hook de inteligencia Reciprocidad para recomendaciones
  const { data: reciprocidadData, recordAction } = useReciprocidadIntelligence(userId);

  // Mock data de círculos por elemento
  const mockCirclesByElement = useMemo((): Record<CosmicElement, WisdomCircle[]> => ({
    fuego: [
      {
        id: 'fuego_1',
        name: 'Forjadores de Cambio',
        element: 'fuego',
        description: 'Emprendedores visionarios que crean transformación positiva en sus comunidades',
        purpose: 'Catalizar proyectos de impacto social y ambiental',
        level: 'practicante',
        members: generateMockMembers(12),
        currentProject: {
          id: 'proj_1',
          title: 'EcoVillage Regenerativo',
          description: 'Diseño de una comunidad autosustentable',
          type: 'creation',
          progress: 65,
          participantCount: 8,
          expectedCompletion: new Date('2025-03-15'),
          bienComunImpact: 92
        },
        meetingSchedule: {
          frequency: 'weekly',
          nextMeeting: new Date('2025-01-28T19:00:00'),
          duration: 90,
          location: 'hybrid',
          timezone: 'UTC-5'
        },
        achievements: [
          {
            id: 'ach_1',
            title: 'Llama Eterna',
            description: 'Mantuvieron el fuego del propósito por 100 días consecutivos',
            unlockedAt: new Date('2024-12-20'),
            rarity: 'epic',
            participants: ['member1', 'member2']
          }
        ],
        energyLevel: 88,
        wisdomPoints: 2470,
        createdAt: new Date('2024-06-15'),
        tags: ['emprendimiento', 'liderazgo', 'innovación', 'impacto'],
        isPrivate: false
      },
      {
        id: 'fuego_2',
        name: 'Guerreros de la Luz',
        element: 'fuego',
        description: 'Activistas espirituales comprometidos con la justicia y la verdad',
        purpose: 'Iluminar las sombras del mundo con acción consciente',
        level: 'maestro',
        members: generateMockMembers(8),
        meetingSchedule: {
          frequency: 'biweekly',
          nextMeeting: new Date('2025-01-30T20:00:00'),
          duration: 120,
          location: 'virtual',
          timezone: 'UTC-5'
        },
        achievements: [],
        energyLevel: 95,
        wisdomPoints: 3890,
        createdAt: new Date('2024-03-10'),
        tags: ['activismo', 'espiritualidad', 'justicia'],
        isPrivate: true
      }
    ],
    agua: [
      {
        id: 'agua_1',
        name: 'Flujo Colaborativo',
        element: 'agua',
        description: 'Facilitadores expertos en crear espacios de colaboración armoniosa',
        purpose: 'Desarrollar habilidades de comunicación no violenta y mediación',
        level: 'practicante',
        members: generateMockMembers(15),
        currentProject: {
          id: 'proj_2',
          title: 'Red de Apoyo Emocional',
          description: 'Plataforma peer-to-peer para soporte mutuo',
          type: 'service',
          progress: 40,
          participantCount: 12,
          expectedCompletion: new Date('2025-04-01'),
          bienComunImpact: 78
        },
        meetingSchedule: {
          frequency: 'weekly',
          nextMeeting: new Date('2025-01-26T18:00:00'),
          duration: 75,
          location: 'virtual',
          timezone: 'UTC-5'
        },
        achievements: [
          {
            id: 'ach_2',
            title: 'Marea de Compasión',
            description: 'Facilitaron 50 círculos de sanación emocional',
            unlockedAt: new Date('2024-11-15'),
            rarity: 'rare',
            participants: ['member3', 'member4', 'member5']
          }
        ],
        energyLevel: 82,
        wisdomPoints: 1950,
        createdAt: new Date('2024-08-20'),
        tags: ['comunicación', 'empatía', 'mediación', 'sanación'],
        isPrivate: false
      }
    ],
    tierra: [
      {
        id: 'tierra_1',
        name: 'Guardianes de Gaia',
        element: 'tierra',
        description: 'Ecologistas y permacultores comprometidos con la regeneración planetaria',
        purpose: 'Crear sistemas abundantes y sostenibles para todas las formas de vida',
        level: 'sabio',
        members: generateMockMembers(20),
        currentProject: {
          id: 'proj_3',
          title: 'Semillas del Futuro',
          description: 'Banco comunitario de semillas ancestrales',
          type: 'creation',
          progress: 85,
          participantCount: 16,
          expectedCompletion: new Date('2025-02-28'),
          bienComunImpact: 96
        },
        meetingSchedule: {
          frequency: 'lunar_cycle',
          nextMeeting: new Date('2025-02-12T19:30:00'),
          duration: 180,
          location: 'physical',
          timezone: 'UTC-5'
        },
        achievements: [
          {
            id: 'ach_3',
            title: 'Raíces Profundas',
            description: 'Plantaron 1000 árboles en áreas degradadas',
            unlockedAt: new Date('2024-09-22'),
            rarity: 'legendary',
            participants: Array.from({length: 20}, (_, i) => `member${i + 10}`)
          }
        ],
        energyLevel: 91,
        wisdomPoints: 4520,
        createdAt: new Date('2024-01-15'),
        tags: ['permacultura', 'sostenibilidad', 'biodiversidad', 'regeneración'],
        isPrivate: false
      }
    ],
    aire: [
      {
        id: 'aire_1',
        name: 'Tejedores de Conocimiento',
        element: 'aire',
        description: 'Educadores y filósofos explorando nuevos paradigmas de aprendizaje',
        purpose: 'Co-crear metodologías pedagógicas para la era de la consciencia',
        level: 'maestro',
        members: generateMockMembers(18),
        currentProject: {
          id: 'proj_4',
          title: 'Universidad Integral',
          description: 'Currículo holístico para el desarrollo humano',
          type: 'study',
          progress: 72,
          participantCount: 14,
          expectedCompletion: new Date('2025-05-15'),
          bienComunImpact: 89
        },
        meetingSchedule: {
          frequency: 'weekly',
          nextMeeting: new Date('2025-01-27T17:00:00'),
          duration: 105,
          location: 'hybrid',
          timezone: 'UTC-5'
        },
        achievements: [
          {
            id: 'ach_4',
            title: 'Vientos de Sabiduría',
            description: 'Compartieron conocimiento con 500+ personas',
            unlockedAt: new Date('2024-10-31'),
            rarity: 'epic',
            participants: Array.from({length: 14}, (_, i) => `member${i + 30}`)
          }
        ],
        energyLevel: 94,
        wisdomPoints: 3760,
        createdAt: new Date('2024-04-05'),
        tags: ['educación', 'filosofía', 'innovación pedagógica', 'consciencia'],
        isPrivate: false
      }
    ],
    ether: [
      {
        id: 'ether_1',
        name: 'Consejo de Ancianos Cósmicos',
        element: 'ether',
        description: 'Sabios y místicos dedicados a la elevación de la consciencia planetaria',
        purpose: 'Servir como puente entre dimensiones para la evolución humana',
        level: 'sabio',
        members: generateMockMembers(7),
        currentProject: {
          id: 'proj_5',
          title: 'Despertar Colectivo',
          description: 'Meditaciones globales sincronizadas',
          type: 'meditation',
          progress: 90,
          participantCount: 7,
          expectedCompletion: new Date('2025-03-21'), // Equinoccio
          bienComunImpact: 100
        },
        meetingSchedule: {
          frequency: 'lunar_cycle',
          nextMeeting: new Date('2025-02-12T21:00:00'),
          duration: 240,
          location: 'virtual',
          timezone: 'UTC-5'
        },
        achievements: [
          {
            id: 'ach_5',
            title: 'Unidad Cósmica',
            description: 'Conectaron a 10,000 meditadores simultáneamente',
            unlockedAt: new Date('2024-12-21'),
            rarity: 'cosmic',
            participants: Array.from({length: 7}, (_, i) => `elder${i + 1}`)
          }
        ],
        energyLevel: 100,
        wisdomPoints: 8888,
        createdAt: new Date('2023-12-21'),
        tags: ['meditación', 'consciencia', 'espiritualidad', 'unidad'],
        isPrivate: true
      }
    ]
  }), []);

  // Generar miembros mock
  function generateMockMembers(count: number): CircleMember[] {
    const names = [
      'Luna Visionaria', 'Sol Radiante', 'Río Fluido', 'Montaña Firme', 'Viento Libre',
      'Fuego Sagrado', 'Agua Cristalina', 'Tierra Fértil', 'Aire Puro', 'Éter Luminoso',
      'Aurora Despertar', 'Nova Creadora', 'Gaia Madre', 'Cosmos Infinito', 'Alma Libre'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `member_${i + 1}`,
      name: names[i % names.length],
      avatar: `https://via.placeholder.com/150/${COSMIC_ELEMENTS[selectedElement].color.replace('#', '')}/FFFFFF?text=${names[i % names.length].charAt(0)}`,
      elementAffinity: {
        fuego: Math.floor(Math.random() * 100),
        agua: Math.floor(Math.random() * 100),
        tierra: Math.floor(Math.random() * 100),
        aire: Math.floor(Math.random() * 100),
        ether: Math.floor(Math.random() * 100)
      },
      role: i === 0 ? 'facilitator' : i === 1 ? 'elder' : 'member',
      joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      contributionScore: Math.floor(Math.random() * 1000),
      specialSkills: ['meditación', 'facilitación', 'arte', 'tecnología'].slice(0, Math.floor(Math.random() * 4) + 1),
      wisdomShared: Math.floor(Math.random() * 500)
    }));
  }

  // Obtener círculos del elemento seleccionado
  const circlesOfElement = mockCirclesByElement[selectedElement] || [];

  // Calcular compatibilidad del usuario con cada círculo
  const calculateCompatibility = (circle: WisdomCircle): number => {
    if (!reciprocidadData) return 75; // Default compatibility

    const userElementAffinity = reciprocidadData.reciprocidadBalance.elements[circle.element];
    const circleEnergyLevel = circle.energyLevel;
    const membershipSize = circle.members.length;

    // Algoritmo de compatibilidad
    let compatibility = userElementAffinity * 0.6; // 60% afinidad elemental
    compatibility += (circleEnergyLevel / 100) * 30; // 30% energía del círculo
    compatibility += Math.min(membershipSize / 20, 1) * 10; // 10% tamaño óptimo

    return Math.round(compatibility);
  };

  // Manejar unirse a círculo
  const handleJoinCircle = (circle: WisdomCircle) => {
    setSelectedCircle(circle);
    setJoinDialogOpen(true);
  };

  // Confirmar unirse a círculo
  const confirmJoinCircle = () => {
    if (selectedCircle) {
      recordAction({
        type: 'collaborating',
        module: 'social',
        value: 30,
        metadata: {
          resourceType: selectedCircle.id,
          skillCategory: selectedCircle.element,
          collaborators: [selectedCircle.id],
          impact: 'regional'
        }
      });

      onCircleJoin?.(selectedCircle.id);
      setJoinDialogOpen(false);
      setSelectedCircle(null);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🔮 Círculos de Sabiduría Elementales
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Conecta con almas afines según tu afinidad cósmica y co-crea sabiduría colectiva
        </Typography>

        {/* Selector de elemento */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {Object.entries(COSMIC_ELEMENTS).map(([key, element]) => {
            const elementKey = key as CosmicElement;
            const isSelected = elementKey === selectedElement;
            const IconComponent = element.icon;
            const circleCount = mockCirclesByElement[elementKey]?.length || 0;

            return (
              <Button
                key={elementKey}
                variant={isSelected ? 'contained' : 'outlined'}
                startIcon={<IconComponent />}
                onClick={() => setSelectedElement(elementKey)}
                sx={{
                  background: isSelected ? element.gradient : 'transparent',
                  color: isSelected ? 'white' : element.color,
                  borderColor: element.color,
                  '&:hover': {
                    background: isSelected ? element.gradient : alpha(element.color, 0.1)
                  }
                }}
              >
                {element.name} ({circleCount})
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* Círculos del elemento seleccionado */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {circlesOfElement.map((circle) => {
          const elementConfig = COSMIC_ELEMENTS[circle.element];
          const compatibility = calculateCompatibility(circle);
          const isHighCompatibility = compatibility >= 80;

          return (
            <Fade key={circle.id} in={true}>
              <Card
                sx={{
                  p: 3,
                  minWidth: 350,
                  maxWidth: 400,
                  background: `linear-gradient(135deg, ${alpha(elementConfig.color, 0.05)} 0%, ${alpha(elementConfig.color, 0.1)} 100%)`,
                  border: `2px solid ${alpha(elementConfig.color, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 30px ${alpha(elementConfig.color, 0.2)}`,
                    border: `2px solid ${elementConfig.color}`
                  }
                }}
              >
                {/* Indicador de compatibilidad */}
                {isHighCompatibility && (
                  <Chip
                    label="🌟 Alta Compatibilidad"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}

                {/* Header del círculo */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: elementConfig.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <elementConfig.icon />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {circle.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={circle.level}
                        size="small"
                        sx={{
                          background: alpha(elementConfig.color, 0.2),
                          color: elementConfig.color,
                          textTransform: 'capitalize'
                        }}
                      />
                      {circle.isPrivate && (
                        <Tooltip title="Círculo privado - requiere invitación">
                          <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                </Box>

                {/* Descripción */}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {circle.description}
                </Typography>

                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  <strong>Propósito:</strong> {circle.purpose}
                </Typography>

                {/* Métricas del círculo */}
                <Box mb={2}>
                  <Stack direction="row" spacing={2} mb={1}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold" sx={{ color: elementConfig.color }}>
                        {circle.members.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Miembros
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold" sx={{ color: elementConfig.color }}>
                        {circle.energyLevel}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Energía
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold" sx={{ color: elementConfig.color }}>
                        {circle.wisdomPoints}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sabiduría
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Barra de energía del círculo */}
                  <LinearProgress
                    variant="determinate"
                    value={circle.energyLevel}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: alpha(elementConfig.color, 0.2),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: elementConfig.gradient
                      }
                    }}
                  />
                </Box>

                {/* Miembros destacados */}
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Miembros activos:
                  </Typography>
                  <AvatarGroup
                    max={6}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem',
                        border: `2px solid ${elementConfig.color}`
                      }
                    }}
                  >
                    {circle.members.slice(0, 8).map((member) => (
                      <Tooltip key={member.id} title={`${member.name} (${member.role})`}>
                        <Avatar
                          src={member.avatar}
                          sx={{
                            background: member.role === 'facilitator' ? '#FFD700' :
                                       member.role === 'elder' ? '#E1BEE7' : elementConfig.color
                          }}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>

                {/* Proyecto actual */}
                {circle.currentProject && (
                  <Box mb={2} p={2} sx={{ background: alpha(elementConfig.color, 0.05), borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      📈 Proyecto Actual
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {circle.currentProject.title}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={circle.currentProject.progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': {
                          background: elementConfig.gradient
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {circle.currentProject.progress}% completado • Impacto: {circle.currentProject.bienComunImpact}%
                    </Typography>
                  </Box>
                )}

                {/* Tags */}
                <Stack direction="row" spacing={0.5} mb={2} flexWrap="wrap" useFlexGap>
                  {circle.tags.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        background: alpha(elementConfig.color, 0.1),
                        color: elementConfig.color
                      }}
                    />
                  ))}
                </Stack>

                {/* Próxima reunión */}
                <Box mb={3} display="flex" alignItems="center" gap={1}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Próxima reunión: {circle.meetingSchedule.nextMeeting.toLocaleDateString()}
                    {circle.meetingSchedule.frequency === 'weekly' ? ' (semanal)' :
                     circle.meetingSchedule.frequency === 'lunar_cycle' ? ' (ciclo lunar)' : ''}
                  </Typography>
                </Box>

                {/* Acciones */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleJoinCircle(circle)}
                    disabled={circle.isPrivate}
                    sx={{
                      background: elementConfig.gradient,
                      color: 'white',
                      '&:hover': {
                        background: elementConfig.gradient,
                        transform: 'scale(1.02)'
                      },
                      '&:disabled': {
                        background: alpha(elementConfig.color, 0.3)
                      }
                    }}
                  >
                    {circle.isPrivate ? '🔒 Privado' : '🚀 Unirse'}
                  </Button>

                  <Tooltip title={`Compatibilidad: ${compatibility}%`}>
                    <IconButton
                      sx={{
                        background: alpha(elementConfig.color, 0.1),
                        color: elementConfig.color,
                        '&:hover': {
                          background: alpha(elementConfig.color, 0.2)
                        }
                      }}
                    >
                      <Insights />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {/* Indicador de compatibilidad */}
                <Box mt={2} textAlign="center">
                  <Typography variant="caption" color="text.secondary">
                    Compatibilidad: {compatibility}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={compatibility}
                    sx={{
                      height: 3,
                      borderRadius: 1.5,
                      mt: 0.5,
                      '& .MuiLinearProgress-bar': {
                        background: compatibility >= 80 ? '#4CAF50' :
                                   compatibility >= 60 ? '#FF9800' : '#F44336'
                      }
                    }}
                  />
                </Box>
              </Card>
            </Fade>
          );
        })}
      </Box>

      {/* Dialog para unirse a círculo */}
      <Dialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: selectedCircle ? COSMIC_ELEMENTS[selectedCircle.element].gradient : '',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              {selectedCircle && React.createElement(COSMIC_ELEMENTS[selectedCircle.element].icon)}
            </Box>
            <Box>
              <Typography variant="h6">Unirse a {selectedCircle?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Círculo de Sabiduría {selectedCircle ? COSMIC_ELEMENTS[selectedCircle.element].name : ''}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" gutterBottom>
            ¿Estás listo para embarcarte en un viaje de crecimiento y sabiduría colectiva?
          </Typography>

          {selectedCircle && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Compromiso del círculo:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • Participar en reuniones {selectedCircle.meetingSchedule.frequency === 'weekly' ? 'semanales' : 'según cronograma'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • Contribuir al proyecto actual: {selectedCircle.currentProject?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • Mantener una actitud de respeto y colaboración
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Compartir sabiduría y aprender de otros miembros
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Mensaje de presentación (opcional)"
            placeholder="Comparte por qué te interesa este círculo y qué puedes aportar..."
            sx={{ mt: 3 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={confirmJoinCircle}
            sx={{
              background: selectedCircle ? COSMIC_ELEMENTS[selectedCircle.element].gradient : '',
              color: 'white'
            }}
          >
            🚀 Confirmar Unión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ElementalWisdomCircles;
