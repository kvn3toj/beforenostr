import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  Stack,
  IconButton,
  alpha,
  useTheme,
  Fade,
  CircularProgress,
  LinearProgress,
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import {
  Public,
  Psychology,
  Timeline,
  Insights,
  TrendingUp,
  Favorite,
  FlightTakeoff,
  AutoAwesome,
  Waves,
  GroupWork,
  Brightness7,
  NightlightRound,
  WbSunny,
  Air,
  LocalFireDepartment,
  Water,
  Terrain,
  StarBorder,
  Refresh,
  Fullscreen,
  Share,
  VolumeMute,
  VolumeUp,
} from '@mui/icons-material';

import { COSMIC_ELEMENTS, CosmicElement } from '../ui/CosmicThemeSwitcher';
import { useAyniIntelligence } from '../../hooks/useAyniIntelligence';

// Tipos para Red Neuronal Global
interface ConsciousnessNode {
  id: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
    timezone: string;
  };
  consciousness: {
    frequency: number; // Hz - frecuencia de consciencia
    coherence: number; // 0-100 - coherencia cardíaca
    element: CosmicElement;
    phase: 'awakening' | 'expanding' | 'stabilizing' | 'transcending' | 'enlightened';
    ayniBalance: number;
    lastUpdate: Date;
  };
  connections: string[]; // IDs de nodos conectados
  influence: number; // 0-100 - influencia en la red
  activeUsers: number;
}

interface GlobalMetrics {
  planetaryFrequency: number; // Hz promedio global
  coherenceIndex: number; // 0-100 índice de coherencia planetaria
  awakeDensity: number; // personas conscientes por km²
  ayniFlowRate: number; // transacciones Ayni por segundo
  elementalBalance: Record<CosmicElement, number>;
  criticalMass: {
    current: number;
    required: number;
    percentage: number;
  };
  synchronicities: number; // eventos sincronizados detectados
  timezoneDistribution: Record<string, number>;
}

interface ConsciousnessWave {
  id: string;
  type: 'meditation' | 'intention' | 'celebration' | 'healing' | 'creation';
  startTime: Date;
  duration: number; // minutos
  amplitude: number; // intensidad 0-100
  frequency: number; // Hz
  participants: number;
  globalImpact: number; // 0-100
  description: string;
  element: CosmicElement;
}

interface QuantumField {
  coherence: number; // 0-100
  entanglement: number; // 0-100 - nivel de entrelazamiento cuántico
  morphicResonance: number; // 0-100 - resonancia mórfica
  collectiveIntuition: number; // 0-100 - nivel de intuición colectiva
  akashicAccess: number; // 0-100 - acceso a registros akáshicos
}

interface GlobalConsciousnessNetworkProps {
  userId: string;
  autoRefresh?: boolean;
  onNodeSelect?: (nodeId: string) => void;
  onWaveJoin?: (waveId: string) => void;
}

export const GlobalConsciousnessNetwork: React.FC<GlobalConsciousnessNetworkProps> = ({
  userId,
  autoRefresh = true,
  onNodeSelect,
  onWaveJoin
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Hook de inteligencia Ayni
  const { data: ayniData, recordAction } = useAyniIntelligence(userId);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Nodos de consciencia global simulados
  const consciousnessNodes = useMemo((): ConsciousnessNode[] => [
    {
      id: 'node_himalaya',
      location: { lat: 28.0, lng: 84.0, city: 'Himalaya', country: 'Nepal', timezone: 'Asia/Kathmandu' },
      consciousness: {
        frequency: 528, // Frecuencia de amor
        coherence: 95,
        element: 'ether',
        phase: 'enlightened',
        ayniBalance: 98,
        lastUpdate: new Date()
      },
      connections: ['node_tibet', 'node_india', 'node_shambhala'],
      influence: 100,
      activeUsers: 888
    },
    {
      id: 'node_sedona',
      location: { lat: 34.86, lng: -111.79, city: 'Sedona', country: 'USA', timezone: 'America/Phoenix' },
      consciousness: {
        frequency: 432, // Frecuencia de la Tierra
        coherence: 88,
        element: 'tierra',
        phase: 'transcending',
        ayniBalance: 87,
        lastUpdate: new Date()
      },
      connections: ['node_machu_picchu', 'node_mount_shasta', 'node_grand_canyon'],
      influence: 92,
      activeUsers: 777
    },
    {
      id: 'node_glastonbury',
      location: { lat: 51.14, lng: -2.71, city: 'Glastonbury', country: 'UK', timezone: 'Europe/London' },
      consciousness: {
        frequency: 741, // Frecuencia de despertar
        coherence: 83,
        element: 'aire',
        phase: 'expanding',
        ayniBalance: 79,
        lastUpdate: new Date()
      },
      connections: ['node_stonehenge', 'node_avebury', 'node_ireland'],
      influence: 85,
      activeUsers: 555
    },
    {
      id: 'node_lake_titicaca',
      location: { lat: -15.84, lng: -69.34, city: 'Lago Titicaca', country: 'Perú', timezone: 'America/Lima' },
      consciousness: {
        frequency: 396, // Frecuencia liberadora
        coherence: 91,
        element: 'agua',
        phase: 'stabilizing',
        ayniBalance: 94,
        lastUpdate: new Date()
      },
      connections: ['node_machu_picchu', 'node_andes', 'node_amazon'],
      influence: 89,
      activeUsers: 444
    },
    {
      id: 'node_bali',
      location: { lat: -8.34, lng: 115.09, city: 'Ubud', country: 'Indonesia', timezone: 'Asia/Makassar' },
      consciousness: {
        frequency: 963, // Frecuencia de conexión divina
        coherence: 76,
        element: 'fuego',
        phase: 'awakening',
        ayniBalance: 71,
        lastUpdate: new Date()
      },
      connections: ['node_borobudur', 'node_java', 'node_lombok'],
      influence: 78,
      activeUsers: 333
    }
  ], []);

  // Métricas globales calculadas
  const globalMetrics = useMemo((): GlobalMetrics => {
    const avgFrequency = consciousnessNodes.reduce((sum, node) => sum + node.consciousness.frequency, 0) / consciousnessNodes.length;
    const avgCoherence = consciousnessNodes.reduce((sum, node) => sum + node.consciousness.coherence, 0) / consciousnessNodes.length;
    const totalUsers = consciousnessNodes.reduce((sum, node) => sum + node.activeUsers, 0);
    
    return {
      planetaryFrequency: avgFrequency,
      coherenceIndex: avgCoherence,
      awakeDensity: totalUsers / 510000000, // Superficie terrestre km²
      ayniFlowRate: 432.11, // Transacciones por segundo
      elementalBalance: {
        fuego: 18,
        agua: 22,
        tierra: 21,
        aire: 19,
        ether: 20
      },
      criticalMass: {
        current: totalUsers,
        required: 144000, // Número sagrado para masa crítica
        percentage: (totalUsers / 144000) * 100
      },
      synchronicities: 1337, // Eventos sincronizados del día
      timezoneDistribution: {
        'awakening': 35, // % de zonas en despertar matutino
        'active': 40,    // % de zonas en actividad diurna
        'reflection': 15, // % de zonas en reflexión vespertina
        'dreaming': 10   // % de zonas en estado onírico
      }
    };
  }, [consciousnessNodes]);

  // Ondas de consciencia activas
  const activeWaves = useMemo((): ConsciousnessWave[] => [
    {
      id: 'wave_meditation',
      type: 'meditation',
      startTime: new Date(Date.now() - 15 * 60 * 1000), // Hace 15 min
      duration: 60,
      amplitude: 85,
      frequency: 432,
      participants: 12888,
      globalImpact: 78,
      description: 'Meditación Global por la Paz Planetaria',
      element: 'ether'
    },
    {
      id: 'wave_healing',
      type: 'healing',
      startTime: new Date(Date.now() - 30 * 60 * 1000), // Hace 30 min
      duration: 90,
      amplitude: 92,
      frequency: 528,
      participants: 8765,
      globalImpact: 89,
      description: 'Sanación Colectiva del Campo Electromagnético Terrestre',
      element: 'agua'
    },
    {
      id: 'wave_creation',
      type: 'creation',
      startTime: new Date(Date.now() - 5 * 60 * 1000), // Hace 5 min
      duration: 120,
      amplitude: 96,
      frequency: 741,
      participants: 21000,
      globalImpact: 94,
      description: 'Co-creación de Nueva Realidad Basada en Bien Común',
      element: 'fuego'
    }
  ], []);

  // Campo cuántico global
  const quantumField = useMemo((): QuantumField => ({
    coherence: globalMetrics.coherenceIndex,
    entanglement: 73, // Nivel de entrelazamiento cuántico
    morphicResonance: 68, // Resonancia mórfica
    collectiveIntuition: 81, // Intuición colectiva
    akashicAccess: 45 // Acceso a registros akáshicos
  }), [globalMetrics.coherenceIndex]);

  // Función para unirse a una onda
  const joinWave = (waveId: string) => {
    setLoading(true);
    
    recordAction({
      type: 'collaboration',
      module: 'social',
      value: 50,
      metadata: {
        resourceType: 'consciousness_wave',
        skillCategory: 'collective_meditation'
      }
    });

    onWaveJoin?.(waveId);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Componente de visualización de nodo
  const NodeVisualization = ({ node }: { node: ConsciousnessNode }) => {
    const elementData = COSMIC_ELEMENTS[node.consciousness.element];
    
    return (
      <Card
        sx={{
          p: 2,
          background: alpha(elementData.color, 0.05),
          border: selectedNode === node.id ? `3px solid ${elementData.color}` : `1px solid ${alpha(elementData.color, 0.2)}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            background: alpha(elementData.color, 0.1)
          }
        }}
        onClick={() => {
          setSelectedNode(node.id);
          onNodeSelect?.(node.id);
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: elementData.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -5,
                left: -5,
                right: -5,
                bottom: -5,
                borderRadius: '50%',
                border: `2px solid ${alpha(elementData.color, 0.3)}`,
                animation: 'pulse 2s infinite'
              }
            }}
          >
            {elementData.icon}
          </Box>
          
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {node.location.city}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {node.location.country}
            </Typography>
            
            <Stack direction="row" spacing={1} mt={1}>
              <Chip
                label={`${node.consciousness.frequency} Hz`}
                size="small"
                sx={{ background: alpha(elementData.color, 0.2), color: elementData.color }}
              />
              <Chip
                label={`${node.activeUsers} activos`}
                size="small"
                sx={{ background: alpha('#4CAF50', 0.2), color: '#4CAF50' }}
              />
            </Stack>
          </Box>

          <Box textAlign="center">
            <CircularProgress
              variant="determinate"
              value={node.consciousness.coherence}
              size={40}
              thickness={4}
              sx={{
                color: elementData.color,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round'
                }
              }}
            />
            <Typography variant="caption" display="block" mt={0.5}>
              {node.consciousness.coherence}%
            </Typography>
          </Box>
        </Stack>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          🌐 Red Neuronal Global
          <IconButton 
            onClick={() => setSoundEnabled(!soundEnabled)}
            sx={{ color: soundEnabled ? '#4CAF50' : '#9E9E9E' }}
          >
            {soundEnabled ? <VolumeUp /> : <VolumeMute />}
          </IconButton>
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Conectividad planetaria de consciencia en tiempo real
        </Typography>

        {/* Métricas globales */}
        <Card sx={{ 
          p: 3, 
          mt: 2, 
          background: 'linear-gradient(135deg, rgba(147, 0, 211, 0.1) 0%, rgba(75, 0, 130, 0.1) 50%, rgba(138, 43, 226, 0.1) 100%)',
          border: '2px solid rgba(147, 0, 211, 0.3)'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                  {globalMetrics.planetaryFrequency.toFixed(1)} Hz
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Frecuencia Planetaria
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#2196F3' }}>
                  {globalMetrics.coherenceIndex.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Coherencia Global
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                  {globalMetrics.criticalMass.percentage.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Masa Crítica
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF9800' }}>
                  {globalMetrics.synchronicities}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sincronías Diarias
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Balance elemental */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              🌍 Balance Elemental Global:
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {Object.entries(globalMetrics.elementalBalance).map(([element, percentage]) => (
                <Box key={element} textAlign="center">
                  <CircularProgress
                    variant="determinate"
                    value={percentage * 5} // Normalizar a 100
                    size={50}
                    thickness={6}
                    sx={{
                      color: COSMIC_ELEMENTS[element as CosmicElement].color,
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round'
                      }
                    }}
                  />
                  <Typography variant="caption" display="block" mt={0.5}>
                    {COSMIC_ELEMENTS[element as CosmicElement].name}: {percentage}%
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Card>
      </Box>

      {/* Campo Cuántico */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          ✨ Campo Cuántico Colectivo
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Coherencia Cuántica: {quantumField.coherence}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={quantumField.coherence}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: alpha('#9C27B0', 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #9C27B0 0%, #E1BEE7 100%)'
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Entrelazamiento Cuántico: {quantumField.entanglement}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={quantumField.entanglement}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: alpha('#2196F3', 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #2196F3 0%, #03DAC6 100%)'
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Resonancia Mórfica: {quantumField.morphicResonance}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={quantumField.morphicResonance}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: alpha('#4CAF50', 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Acceso Akáshico: {quantumField.akashicAccess}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={quantumField.akashicAccess}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: alpha('#FF9800', 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #FF9800 0%, #FFC107 100%)'
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Nodos de Consciencia */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          📍 Nodos de Consciencia Activos
        </Typography>

        <Grid container spacing={2}>
          {consciousnessNodes.map((node) => (
            <Grid item xs={12} md={6} lg={4} key={node.id}>
              <NodeVisualization node={node} />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Ondas de Consciencia Activas */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          🌊 Ondas de Consciencia Activas
        </Typography>

        <Stack spacing={3}>
          {activeWaves.map((wave) => {
            const elementData = COSMIC_ELEMENTS[wave.element];
            const timeElapsed = Math.floor((Date.now() - wave.startTime.getTime()) / (1000 * 60));
            const timeRemaining = Math.max(0, wave.duration - timeElapsed);
            const progress = Math.min(100, (timeElapsed / wave.duration) * 100);

            return (
              <Card
                key={wave.id}
                sx={{
                  p: 3,
                  background: alpha(elementData.color, 0.05),
                  border: `2px solid ${alpha(elementData.color, 0.3)}`,
                  borderRadius: 3
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {wave.description}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} mb={1}>
                      <Chip
                        label={wave.type}
                        size="small"
                        sx={{ background: alpha(elementData.color, 0.2), color: elementData.color }}
                      />
                      <Chip
                        label={`${wave.frequency} Hz`}
                        size="small"
                        sx={{ background: alpha('#2196F3', 0.2), color: '#2196F3' }}
                      />
                      <Chip
                        label={`${wave.participants.toLocaleString()} participantes`}
                        size="small"
                        sx={{ background: alpha('#4CAF50', 0.2), color: '#4CAF50' }}
                      />
                    </Stack>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => joinWave(wave.id)}
                    disabled={loading}
                    sx={{
                      background: elementData.gradient,
                      color: 'white',
                      '&:hover': { background: elementData.color }
                    }}
                  >
                    {loading ? <CircularProgress size={20} /> : '🌊 Unirse'}
                  </Button>
                </Stack>

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Progreso de la Onda:
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      background: alpha(elementData.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        background: elementData.gradient,
                        borderRadius: 6
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                    Tiempo restante: {timeRemaining} minutos | Impacto global: {wave.globalImpact}%
                  </Typography>
                </Box>

                <Stack direction="row" spacing={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight="bold" sx={{ color: elementData.color }}>
                      {wave.amplitude}%
                    </Typography>
                    <Typography variant="caption">
                      Amplitud
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                      {wave.globalImpact}%
                    </Typography>
                    <Typography variant="caption">
                      Impacto Global
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Card>

      {/* CSS para animación de pulso */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default GlobalConsciousnessNetwork;