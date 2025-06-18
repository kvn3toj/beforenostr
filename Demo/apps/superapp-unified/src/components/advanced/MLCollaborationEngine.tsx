import React, { useState, useEffect, useMemo } from 'react';
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
  CircularProgress,
  LinearProgress,
  Rating,
  Divider,
  Badge,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  TrendingUp,
  Groups,
  Star,
  Favorite,
  ConnectWithoutContact,
  School,
  Lightbulb,
  EmojiEvents,
  Timeline,
  Insights,
  Science,
  Radar,
  FilterList,
  Refresh,
  ThumbUp,
  Share,
  Message,
  Schedule,
  LocationOn,
  Language,
  FlightTakeoff,
} from '@mui/icons-material';

import { COSMIC_ELEMENTS, CosmicElement } from '../ui/CosmicThemeSwitcher';
import { useAyniIntelligence } from '../../hooks/useAyniIntelligence';

// Tipos para el Motor de Colaboración ML
interface CollaborationProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  cosmicSignature: CosmicSignature;
  skills: Skill[];
  interests: Interest[];
  availableTime: number; // horas por semana
  collaborationHistory: CollaborationRecord[];
  trustScore: number; // 0-100
  ayniBalance: number; // -100 a 100
  preferredCollaborationTypes: CollaborationType[];
  location: GeographicInfo;
  languages: string[];
  timezone: string;
  lastActive: Date;
}

interface CosmicSignature {
  dominantElement: CosmicElement;
  elementDistribution: Record<CosmicElement, number>;
  evolutionStage: 'seed' | 'growth' | 'bloom' | 'mastery' | 'transcendence';
  resonanceFrequency: number; // 0-1000 Hz metafórico
  manifestationPower: number; // 0-100
}

interface Skill {
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  element: CosmicElement;
  verified: boolean;
  endorsements: number;
}

interface Interest {
  name: string;
  category: InterestCategory;
  intensity: number; // 0-100
  element: CosmicElement;
  isActive: boolean;
}

interface CollaborationRecord {
  projectId: string;
  partnerId: string;
  duration: number; // días
  outcome: 'excellent' | 'good' | 'neutral' | 'challenging';
  ayniFlow: number; // balance final -100 a 100
  skillsShared: string[];
  skillsLearned: string[];
  impactLevel: 'local' | 'regional' | 'global' | 'cosmic';
  completedAt: Date;
}

interface GeographicInfo {
  continent: string;
  country: string;
  timezone: string;
  coordinates?: { lat: number; lng: number };
  isRemotePreferred: boolean;
}

interface MLMatch {
  profile: CollaborationProfile;
  compatibilityScore: number; // 0-100
  matchReasons: MatchReason[];
  potentialOutcomes: PotentialOutcome[];
  estimatedCollaborationSuccess: number; // 0-100
  recommendedProject: ProjectRecommendation;
  cosmicAlignment: number; // 0-100
  ayniPotential: number; // 0-100
  energeticSynergy: number; // 0-100
}

interface MatchReason {
  type: 'skill_complement' | 'element_harmony' | 'goal_alignment' | 'experience_match' | 'cosmic_timing';
  description: string;
  strength: number; // 0-100
  element?: CosmicElement;
}

interface PotentialOutcome {
  type: 'skill_growth' | 'network_expansion' | 'project_success' | 'consciousness_evolution' | 'bien_comun_impact';
  description: string;
  probability: number; // 0-100
  timeframe: string;
  impactLevel: number; // 0-100
}

interface ProjectRecommendation {
  title: string;
  description: string;
  estimatedDuration: string;
  skillsRequired: string[];
  expectedImpact: string;
  bienComunAlignment: number; // 0-100
}

type SkillCategory = 'technical' | 'creative' | 'social' | 'spiritual' | 'business' | 'healing' | 'educational';
type InterestCategory = 'technology' | 'art' | 'nature' | 'spirituality' | 'community' | 'learning' | 'wellness';
type CollaborationType = 'mentorship' | 'peer_learning' | 'project_partnership' | 'skill_exchange' | 'consciousness_work';

interface MLCollaborationEngineProps {
  userId: string;
  filters?: {
    maxDistance?: number;
    minTrustScore?: number;
    preferredElements?: CosmicElement[];
    collaborationTypes?: CollaborationType[];
  };
  onMatchConnect?: (matchId: string) => void;
  onFilterChange?: (filters: any) => void;
}

export const MLCollaborationEngine: React.FC<MLCollaborationEngineProps> = ({
  userId,
  filters = {},
  onMatchConnect,
  onFilterChange
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MLMatch | null>(null);
  const [viewMode, setViewMode] = useState<'matches' | 'analytics' | 'history'>('matches');

  // Hook de inteligencia Ayni
  const { data: ayniData, recordAction } = useAyniIntelligence(userId);

  // Simular perfil del usuario actual
  const userProfile = useMemo((): CollaborationProfile => ({
    id: userId,
    userId,
    name: 'Tu Perfil Cósmico',
    avatar: '',
    cosmicSignature: {
      dominantElement: ayniData?.dominantElement || 'aire',
      elementDistribution: ayniData?.ayniBalance?.elements || {
        fuego: 75, agua: 60, tierra: 80, aire: 90, ether: 70
      },
      evolutionStage: 'bloom',
      resonanceFrequency: 432,
      manifestationPower: ayniData?.ayniBalance?.overall || 85
    },
    skills: [
      { name: 'Facilitación', category: 'social', level: 85, element: 'agua', verified: true, endorsements: 12 },
      { name: 'Desarrollo Web', category: 'technical', level: 75, element: 'aire', verified: true, endorsements: 8 },
      { name: 'Meditación', category: 'spiritual', level: 90, element: 'ether', verified: true, endorsements: 15 }
    ],
    interests: [
      { name: 'Tecnología Consciente', category: 'technology', intensity: 90, element: 'aire', isActive: true },
      { name: 'Ecología Profunda', category: 'nature', intensity: 85, element: 'tierra', isActive: true },
      { name: 'Sabiduría Ancestral', category: 'spirituality', intensity: 80, element: 'ether', isActive: true }
    ],
    availableTime: 15,
    collaborationHistory: [],
    trustScore: 88,
    ayniBalance: 15,
    preferredCollaborationTypes: ['peer_learning', 'project_partnership', 'consciousness_work'],
    location: {
      continent: 'América',
      country: 'México',
      timezone: 'UTC-6',
      isRemotePreferred: true
    },
    languages: ['Español', 'English'],
    timezone: 'UTC-6',
    lastActive: new Date()
  }), [userId, ayniData]);

  // Simular matches ML generados
  const mlMatches = useMemo((): MLMatch[] => [
    {
      profile: {
        id: 'user_cosmic_1',
        userId: 'cosmic_1',
        name: 'Aurora Consciencia',
        avatar: 'https://via.placeholder.com/150/E1BEE7/FFFFFF?text=A',
        cosmicSignature: {
          dominantElement: 'ether',
          elementDistribution: { fuego: 65, agua: 85, tierra: 70, aire: 75, ether: 95 },
          evolutionStage: 'transcendence',
          resonanceFrequency: 528,
          manifestationPower: 92
        },
        skills: [
          { name: 'Sanación Energética', category: 'healing', level: 95, element: 'ether', verified: true, endorsements: 25 },
          { name: 'Liderazgo Consciente', category: 'social', level: 88, element: 'fuego', verified: true, endorsements: 18 },
          { name: 'Diseño de Rituales', category: 'spiritual', level: 90, element: 'ether', verified: true, endorsements: 22 }
        ],
        interests: [
          { name: 'Medicina Ancestral', category: 'wellness', intensity: 100, element: 'ether', isActive: true },
          { name: 'Redes de Apoyo', category: 'community', intensity: 95, element: 'agua', isActive: true }
        ],
        availableTime: 20,
        collaborationHistory: [
          {
            projectId: 'healing_circle_1',
            partnerId: 'healer_maya',
            duration: 90,
            outcome: 'excellent',
            ayniFlow: 25,
            skillsShared: ['Sanación', 'Ceremonias'],
            skillsLearned: ['Plantas Maestras'],
            impactLevel: 'regional',
            completedAt: new Date('2024-11-15')
          }
        ],
        trustScore: 96,
        ayniBalance: 30,
        preferredCollaborationTypes: ['consciousness_work', 'mentorship', 'skill_exchange'],
        location: {
          continent: 'América',
          country: 'Guatemala',
          timezone: 'UTC-6',
          isRemotePreferred: false
        },
        languages: ['Español', 'Maya', 'English'],
        timezone: 'UTC-6',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      compatibilityScore: 94,
      matchReasons: [
        {
          type: 'cosmic_timing',
          description: 'Ambos están en un momento de expansión de consciencia perfectamente sincronizado',
          strength: 95,
          element: 'ether'
        },
        {
          type: 'skill_complement',
          description: 'Tu fortaleza en facilitación complementa su maestría en sanación energética',
          strength: 88
        },
        {
          type: 'goal_alignment',
          description: 'Comparten la visión de sanación colectiva y elevación de consciencia',
          strength: 92
        }
      ],
      potentialOutcomes: [
        {
          type: 'consciousness_evolution',
          description: 'Aceleración del despertar espiritual mutuo',
          probability: 90,
          timeframe: '3-6 meses',
          impactLevel: 95
        },
        {
          type: 'bien_comun_impact',
          description: 'Creación de una red de sanación comunitaria',
          probability: 85,
          timeframe: '6-12 meses',
          impactLevel: 88
        }
      ],
      estimatedCollaborationSuccess: 92,
      recommendedProject: {
        title: 'Círculo de Sanación Digital-Ancestral',
        description: 'Plataforma que une tecnología y sabiduría ancestral para sanación colectiva',
        estimatedDuration: '6-9 meses',
        skillsRequired: ['Facilitación', 'Sanación Energética', 'Tecnología'],
        expectedImpact: 'Sanación de 1000+ personas, red de 50+ sanadores',
        bienComunAlignment: 96
      },
      cosmicAlignment: 94,
      ayniPotential: 90,
      energeticSynergy: 96
    },
    {
      profile: {
        id: 'user_earth_2',
        userId: 'earth_2',
        name: 'Pachamama Regenera',
        avatar: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=P',
        cosmicSignature: {
          dominantElement: 'tierra',
          elementDistribution: { fuego: 70, agua: 80, tierra: 98, aire: 65, ether: 75 },
          evolutionStage: 'mastery',
          resonanceFrequency: 256,
          manifestationPower: 89
        },
        skills: [
          { name: 'Permacultura', category: 'technical', level: 96, element: 'tierra', verified: true, endorsements: 30 },
          { name: 'Bioconstrucción', category: 'technical', level: 88, element: 'tierra', verified: true, endorsements: 22 },
          { name: 'Agricultura Regenerativa', category: 'technical', level: 93, element: 'tierra', verified: true, endorsements: 28 }
        ],
        interests: [
          { name: 'Restauración Ecosistémica', category: 'nature', intensity: 100, element: 'tierra', isActive: true },
          { name: 'Comunidades Sostenibles', category: 'community', intensity: 92, element: 'tierra', isActive: true }
        ],
        availableTime: 25,
        collaborationHistory: [],
        trustScore: 91,
        ayniBalance: 20,
        preferredCollaborationTypes: ['project_partnership', 'skill_exchange', 'mentorship'],
        location: {
          continent: 'América',
          country: 'Colombia',
          timezone: 'UTC-5',
          isRemotePreferred: false
        },
        languages: ['Español', 'Quechua'],
        timezone: 'UTC-5',
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      compatibilityScore: 87,
      matchReasons: [
        {
          type: 'element_harmony',
          description: 'Tu elemento Aire armoniza perfectamente con su dominio Tierra',
          strength: 85,
          element: 'tierra'
        },
        {
          type: 'skill_complement',
          description: 'Tu experiencia tech puede potenciar sus proyectos regenerativos',
          strength: 82
        }
      ],
      potentialOutcomes: [
        {
          type: 'project_success',
          description: 'Lanzamiento de plataforma para comunidades regenerativas',
          probability: 88,
          timeframe: '4-8 meses',
          impactLevel: 85
        }
      ],
      estimatedCollaborationSuccess: 85,
      recommendedProject: {
        title: 'EcoTech: Plataforma de Regeneración',
        description: 'App que conecta comunidades para proyectos de restauración ecosistémica',
        estimatedDuration: '6 meses',
        skillsRequired: ['Desarrollo Web', 'Permacultura', 'Facilitación'],
        expectedImpact: '20+ proyectos regenerativos, 500+ familias beneficiadas',
        bienComunAlignment: 92
      },
      cosmicAlignment: 87,
      ayniPotential: 85,
      energeticSynergy: 83
    },
    {
      profile: {
        id: 'user_fire_3',
        userId: 'fire_3',
        name: 'Sol Emprendedor',
        avatar: 'https://via.placeholder.com/150/FF5722/FFFFFF?text=S',
        cosmicSignature: {
          dominantElement: 'fuego',
          elementDistribution: { fuego: 95, agua: 60, tierra: 70, aire: 80, ether: 65 },
          evolutionStage: 'bloom',
          resonanceFrequency: 741,
          manifestationPower: 88
        },
        skills: [
          { name: 'Emprendimiento Social', category: 'business', level: 90, element: 'fuego', verified: true, endorsements: 20 },
          { name: 'Marketing Consciente', category: 'business', level: 85, element: 'fuego', verified: true, endorsements: 15 },
          { name: 'Liderazgo Transformacional', category: 'social', level: 87, element: 'fuego', verified: true, endorsements: 18 }
        ],
        interests: [
          { name: 'Economía Regenerativa', category: 'community', intensity: 95, element: 'fuego', isActive: true },
          { name: 'Innovación Social', category: 'technology', intensity: 88, element: 'fuego', isActive: true }
        ],
        availableTime: 30,
        collaborationHistory: [],
        trustScore: 83,
        ayniBalance: 10,
        preferredCollaborationTypes: ['project_partnership', 'peer_learning'],
        location: {
          continent: 'América',
          country: 'Argentina',
          timezone: 'UTC-3',
          isRemotePreferred: true
        },
        languages: ['Español', 'English', 'Português'],
        timezone: 'UTC-3',
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      compatibilityScore: 79,
      matchReasons: [
        {
          type: 'goal_alignment',
          description: 'Ambos buscan crear impacto social a través de la tecnología',
          strength: 80
        }
      ],
      potentialOutcomes: [
        {
          type: 'network_expansion',
          description: 'Acceso a red de emprendedores sociales latinoamericanos',
          probability: 85,
          timeframe: '2-4 meses',
          impactLevel: 75
        }
      ],
      estimatedCollaborationSuccess: 78,
      recommendedProject: {
        title: 'Aceleradora de Consciencia',
        description: 'Programa de aceleración para startups con propósito de Bien Común',
        estimatedDuration: '12 meses',
        skillsRequired: ['Emprendimiento', 'Tecnología', 'Facilitación'],
        expectedImpact: '50+ startups incubadas, 500+ empleos conscientes',
        bienComunAlignment: 88
      },
      cosmicAlignment: 79,
      ayniPotential: 75,
      energeticSynergy: 77
    }
  ], []);

  // Manejar conexión con match
  const handleConnectWithMatch = (match: MLMatch) => {
    recordAction({
      type: 'collaborating',
      module: 'social',
      value: 25,
      metadata: {
        resourceType: 'ml_match_connection',
        skillCategory: match.profile.cosmicSignature.dominantElement,
        collaborators: [match.profile.userId],
        impact: 'regional'
      }
    });

    onMatchConnect?.(match.profile.id);
    
    // Simular conexión establecida
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Aquí iría la lógica real de conectar con el usuario
    }, 2000);
  };

  // Función para obtener el color del elemento
  const getElementColor = (element: CosmicElement) => {
    return COSMIC_ELEMENTS[element]?.color || '#666';
  };

  // Función para obtener el ícono del elemento
  const getElementIcon = (element: CosmicElement) => {
    return COSMIC_ELEMENTS[element]?.icon || Psychology;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🤖 Motor de Colaboración ML
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Inteligencia artificial para matching perfecto basado en afinidades cósmicas
        </Typography>
        
        {/* Estadísticas del usuario */}
        <Card sx={{ p: 2, mt: 2, background: alpha(theme.palette.primary.main, 0.05) }}>
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" sx={{ color: getElementColor(userProfile.cosmicSignature.dominantElement) }}>
                {userProfile.cosmicSignature.manifestationPower}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Poder de Manifestación
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                {userProfile.trustScore}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Score de Confianza
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" sx={{ color: userProfile.ayniBalance >= 0 ? '#4CAF50' : '#FF9800' }}>
                {userProfile.ayniBalance > 0 ? '+' : ''}{userProfile.ayniBalance}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Balance Ayni
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                {userProfile.availableTime}h
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tiempo Disponible/sem
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>

      {/* Matches ML */}
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center" gap={1}>
          <AutoAwesome sx={{ color: '#FFD700' }} />
          Matches Cósmicos Detectados por IA
        </Typography>

        {mlMatches.map((match, index) => {
          const profile = match.profile;
          const ElementIcon = getElementIcon(profile.cosmicSignature.dominantElement);
          
          return (
            <Fade key={profile.id} in={true} timeout={500 + index * 200}>
              <Card
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${alpha(getElementColor(profile.cosmicSignature.dominantElement), 0.05)} 0%, ${alpha(getElementColor(profile.cosmicSignature.dominantElement), 0.1)} 100%)`,
                  border: `2px solid ${alpha(getElementColor(profile.cosmicSignature.dominantElement), 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(getElementColor(profile.cosmicSignature.dominantElement), 0.15)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Score de compatibilidad */}
                <Chip
                  label={`${match.compatibilityScore}% Compatible`}
                  sx={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />

                <Stack direction="row" spacing={3} alignItems="flex-start">
                  {/* Avatar y datos básicos */}
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: getElementColor(profile.cosmicSignature.dominantElement),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid white'
                          }}
                        >
                          <ElementIcon sx={{ fontSize: 14, color: 'white' }} />
                        </Box>
                      }
                    >
                      <Avatar
                        src={profile.avatar}
                        sx={{
                          width: 80,
                          height: 80,
                          border: `3px solid ${getElementColor(profile.cosmicSignature.dominantElement)}`
                        }}
                      >
                        {profile.name.charAt(0)}
                      </Avatar>
                    </Badge>
                    
                    <Typography variant="h6" fontWeight="bold" mt={1} textAlign="center">
                      {profile.name}
                    </Typography>
                    
                    <Chip
                      label={profile.cosmicSignature.evolutionStage}
                      size="small"
                      sx={{
                        background: alpha(getElementColor(profile.cosmicSignature.dominantElement), 0.2),
                        color: getElementColor(profile.cosmicSignature.dominantElement),
                        textTransform: 'capitalize',
                        mt: 0.5
                      }}
                    />

                    <Typography variant="caption" color="text.secondary" textAlign="center" mt={1}>
                      {profile.location.country} • {profile.languages.join(', ')}
                    </Typography>
                  </Box>

                  {/* Información principal */}
                  <Box flex={1}>
                    {/* Métricas de compatibilidad */}
                    <Box mb={2}>
                      <Stack direction="row" spacing={2} mb={1}>
                        <Box textAlign="center">
                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                            {match.cosmicAlignment}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Alineación Cósmica
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#2196F3' }}>
                            {match.ayniPotential}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Potencial Ayni
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                            {match.energeticSynergy}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sinergia Energética
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Barras de progreso */}
                      <Stack spacing={1}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              Probabilidad de Éxito
                            </Typography>
                            <Typography variant="caption" fontWeight="bold">
                              {match.estimatedCollaborationSuccess}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={match.estimatedCollaborationSuccess}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              '& .MuiLinearProgress-bar': {
                                background: `linear-gradient(90deg, ${getElementColor(profile.cosmicSignature.dominantElement)} 0%, #4CAF50 100%)`
                              }
                            }}
                          />
                        </Box>
                      </Stack>
                    </Box>

                    {/* Razones de match */}
                    <Box mb={2}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        🎯 Razones del Match:
                      </Typography>
                      <Stack spacing={1}>
                        {match.matchReasons.slice(0, 2).map((reason, idx) => (
                          <Box key={idx} display="flex" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                background: reason.element ? getElementColor(reason.element) : '#666'
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {reason.description} ({reason.strength}% match)
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* Skills principales */}
                    <Box mb={2}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        ⭐ Habilidades Destacadas:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {profile.skills.slice(0, 3).map((skill) => (
                          <Chip
                            key={skill.name}
                            label={`${skill.name} (${skill.level}%)`}
                            size="small"
                            sx={{
                              background: alpha(getElementColor(skill.element), 0.1),
                              color: getElementColor(skill.element),
                              fontSize: '0.7rem'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* Proyecto recomendado */}
                    <Box mb={3} p={2} sx={{ background: alpha(getElementColor(profile.cosmicSignature.dominantElement), 0.05), borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        💡 Proyecto Recomendado por IA:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        {match.recommendedProject.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {match.recommendedProject.description}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                        <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {match.recommendedProject.estimatedDuration}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                          {match.recommendedProject.bienComunAlignment}% Bien Común
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Acciones */}
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleConnectWithMatch(match)}
                        disabled={loading}
                        sx={{
                          background: `linear-gradient(135deg, ${getElementColor(profile.cosmicSignature.dominantElement)} 0%, #4CAF50 100%)`,
                          color: 'white',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={20} /> : '🤝 Conectar'}
                      </Button>
                      
                      <Button variant="outlined" startIcon={<Message />}>
                        Mensaje
                      </Button>
                      
                      <Button variant="outlined" startIcon={<Share />}>
                        Compartir
                      </Button>

                      <Tooltip title="Me gusta este match">
                        <IconButton 
                          sx={{ 
                            color: '#E91E63',
                            '&:hover': { background: alpha('#E91E63', 0.1) }
                          }}
                        >
                          <ThumbUp />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Fade>
          );
        })}
      </Stack>

      {/* Insights del motor ML */}
      <Card sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
          <Science />
          Insights del Motor ML
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" gutterBottom>
              🎯 <strong>Análisis de Patrones:</strong> Tu perfil muestra alta compatibilidad con personas en etapa de "transcendencia" y "mastery". 
              El algoritmo detecta que tu elemento Aire armoniza especialmente bien con Éter y Tierra.
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>
              ⚡ <strong>Optimización Sugerida:</strong> Para aumentar tu score de matches, considera desarrollar más habilidades en la categoría "healing" 
              y participa en proyectos con alto impacto de Bien Común (&gt;85%).
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              🌟 <strong>Predicción IA:</strong> Tu próxima colaboración más exitosa será con alguien del elemento Éter en los próximos 30 días. 
              Probabilidad: 87%.
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default MLCollaborationEngine;