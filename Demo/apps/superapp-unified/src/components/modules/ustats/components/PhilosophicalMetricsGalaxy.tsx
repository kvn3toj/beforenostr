import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Tooltip,
  Chip,
  Grid,
  Stack,
  IconButton,
  Collapse,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Whatshot,
  Waves,
  Terrain,
  Air,
  AutoAwesome,
  ExpandMore,
  ExpandLess,
  Psychology,
  AllInclusive,
  Timeline,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🌌 ARIA & PHOENIX (Frontend Artist & Transformer) - Cosmic Design System
import { CosmicCard } from '../../../../design-system';
import { UNIFIED_COLORS } from '../../../../theme/colors';

interface ElementalData {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface PhilosophicalMetricsGalaxyProps {
  elementos: ElementalData;
  dominantElement: keyof ElementalData;
  balanceScore: number; // 0-100
  recommendations?: Array<{
    element: keyof ElementalData;
    action: string;
    philosophy: string;
  }>;
  isExpanded?: boolean;
  cosmicEffects?: {
    enableGlow?: boolean;
    enableParticles?: boolean;
    enableAnimations?: boolean;
  };
}

// 🎨 Configuración Elemental Cósmica
const ELEMENTAL_CONFIG = {
  fuego: {
    name: 'Fuego',
    symbol: '🔥',
    description: 'Pasión y Acción',
    philosophy: 'Energía creativa y manifestación',
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)',
    icon: Whatshot,
    keywords: ['creatividad', 'acción', 'pasión', 'liderazgo'],
    balance: 'equilibra con Agua para evitar el agotamiento'
  },
  agua: {
    name: 'Agua',
    symbol: '🌊',
    description: 'Fluidez y Adaptabilidad',
    philosophy: 'Colaboración y inteligencia emocional',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    icon: Waves,
    keywords: ['colaboración', 'empatía', 'fluidez', 'sanación'],
    balance: 'equilibra con Fuego para mantener la dirección'
  },
  tierra: {
    name: 'Tierra',
    symbol: '🌍',
    description: 'Estabilidad y Materialización',
    philosophy: 'Fundamentos sólidos y crecimiento sostenible',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    icon: Terrain,
    keywords: ['estabilidad', 'práctica', 'abundancia', 'crecimiento'],
    balance: 'equilibra con Aire para evitar el estancamiento'
  },
  aire: {
    name: 'Aire',
    symbol: '💨',
    description: 'Comunicación y Visión',
    philosophy: 'Ideas claras y perspectiva elevada',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    icon: Air,
    keywords: ['comunicación', 'visión', 'innovación', 'libertad'],
    balance: 'equilibra con Tierra para materializar las ideas'
  },
};

/**
 * 🌌 PHILOSOPHICAL METRICS GALAXY - ARIA & PHOENIX
 * ===============================================
 *
 * Visualización cósmica del equilibrio elemental en formato galaxia
 *
 * Filosofía CoomÜnity:
 * - **4 Elementos**: Fuego, Agua, Tierra, Aire como dimensiones del ser
 * - **Balance Dinámico**: No hay elemento "malo", solo desequilibrios temporales
 * - **Sabiduría Ancestral**: Cada elemento tiene su momento y propósito
 * - **Crecimiento Integral**: El desarrollo consciente requiere todos los elementos
 */
const PhilosophicalMetricsGalaxy: React.FC<PhilosophicalMetricsGalaxyProps> = React.memo(({
  elementos,
  dominantElement,
  balanceScore,
  recommendations = [],
  isExpanded = false,
  cosmicEffects = {}
}) => {
  const theme = useTheme();
  const [selectedElement, setSelectedElement] = useState<keyof ElementalData | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const galaxyRef = useRef<HTMLDivElement>(null);

  // 🌟 Análisis del Balance Elemental
  const elementalAnalysis = useMemo(() => {
    const total = elementos.fuego + elementos.agua + elementos.tierra + elementos.aire;
    const percentages = {
      fuego: total > 0 ? (elementos.fuego / total) * 100 : 25,
      agua: total > 0 ? (elementos.agua / total) * 100 : 25,
      tierra: total > 0 ? (elementos.tierra / total) * 100 : 25,
      aire: total > 0 ? (elementos.aire / total) * 100 : 25,
    };

    // Determinar estado del balance
    const variance = Object.values(percentages).reduce((acc, curr) => acc + Math.pow(curr - 25, 2), 0) / 4;
    const balanceStatus = variance < 50 ? 'Armonía' : variance < 150 ? 'Creciendo' : 'Desbalanceado';

    return { percentages, balanceStatus, variance };
  }, [elementos]);

  // 🎯 Posicionamiento Cósmico de Elementos
  const getElementPosition = (element: keyof ElementalData, index: number) => {
    const angle = (index * 90) * (Math.PI / 180); // 90 grados entre elementos
    const radius = 80; // Radio de la galaxia
    const centerX = 50;
    const centerY = 50;

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // 🌊 Efectos de Partículas Elementales
  useEffect(() => {
    if (!cosmicEffects.enableParticles || !galaxyRef.current) return;

    const createElementalParticle = (element: keyof ElementalData) => {
      const config = ELEMENTAL_CONFIG[element];
      const particle = document.createElement('div');

      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: ${config.color};
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.6;
        animation: elementalDrift 8s linear infinite;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
      `;

      galaxyRef.current?.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 8000);
    };

    const interval = setInterval(() => {
      Object.keys(elementos).forEach((element) => {
        if (Math.random() < 0.3) {
          createElementalParticle(element as keyof ElementalData);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [cosmicEffects.enableParticles, elementos]);

  return (
    <CosmicCard
      variant="elevated"
      element="fuego"
      enableGlow={cosmicEffects.enableGlow}
      enableAnimations={cosmicEffects.enableAnimations}
      enableParticles={cosmicEffects.enableParticles}
      cosmicIntensity="medium"
      sx={{ height: '100%', position: 'relative' }}
    >
      {/* 🌟 Header con Balance Score */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          🌌 Galaxia Elemental de tu Ser
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={balanceScore}
            size={60}
            thickness={4}
            sx={{
              color: balanceScore >= 80 ? '#10B981' : balanceScore >= 60 ? '#3B82F6' : '#F59E0B',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {balanceScore}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Balance Cósmico
            </Typography>
          </Box>
        </Box>

        <Chip
          label={elementalAnalysis.balanceStatus}
          sx={{
            background: alpha(ELEMENTAL_CONFIG[dominantElement].color, 0.15),
            color: ELEMENTAL_CONFIG[dominantElement].color,
            fontWeight: 600
          }}
        />
      </Box>

      {/* 🌌 Galaxia Central con Elementos */}
      <Box
        ref={galaxyRef}
        sx={{
          position: 'relative',
          height: 250,
          borderRadius: 3,
          background: `
            radial-gradient(circle at center,
              rgba(15, 23, 42, 0.05) 0%,
              rgba(30, 41, 59, 0.02) 70%,
              transparent 100%
            )
          `,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden',
          mb: 3
        }}
      >
        {/* 🌟 Centro Cósmico */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#FFD700', 0.3)}, transparent)`,
            border: `2px solid ${alpha('#FFD700', 0.5)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: cosmicEffects.enableAnimations ? 'cosmicPulse 3s ease-in-out infinite' : 'none'
          }}
        >
          <AllInclusive sx={{ color: '#FFD700', fontSize: 20 }} />
        </Box>

        {/* 🔥💧🌍💨 Elementos Orbitales */}
        {(Object.keys(elementos) as Array<keyof ElementalData>).map((element, index) => {
          const config = ELEMENTAL_CONFIG[element];
          const position = getElementPosition(element, index);
          const percentage = elementalAnalysis.percentages[element];
          const ElementIcon = config.icon;
          const isDominant = element === dominantElement;

          return (
            <motion.div
              key={element}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: `${position.y}%`,
                left: `${position.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Tooltip
                title={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {config.symbol} {config.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {config.description}
                    </Typography>
                    <Typography variant="caption">
                      {percentage.toFixed(1)}% de tu energía elemental
                    </Typography>
                  </Box>
                }
                arrow
              >
                <Box
                  onClick={() => setSelectedElement(selectedElement === element ? null : element)}
                  sx={{
                    width: isDominant ? 80 : 60,
                    height: isDominant ? 80 : 60,
                    borderRadius: '50%',
                    background: config.gradient,
                    border: `3px solid ${alpha(config.color, isDominant ? 0.8 : 0.5)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: isDominant
                      ? `0 0 20px ${alpha(config.color, 0.4)}`
                      : `0 0 10px ${alpha(config.color, 0.2)}`,
                    animation: cosmicEffects.enableAnimations && isDominant
                      ? `elementalPulse-${element} 2s ease-in-out infinite`
                      : 'none',
                    '&:hover': {
                      transform: 'translate(-50%, -50%) scale(1.1)',
                      boxShadow: `0 0 25px ${alpha(config.color, 0.6)}`,
                    }
                  }}
                >
                  <ElementIcon sx={{
                    fontSize: isDominant ? 32 : 24,
                    color: 'white',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} />

                  {/* 📊 Indicador de Porcentaje */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: config.color,
                      color: 'white',
                      borderRadius: 1,
                      px: 1,
                      py: 0.25,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      minWidth: 32,
                      textAlign: 'center'
                    }}
                  >
                    {Math.round(percentage)}%
                  </Box>
                </Box>
              </Tooltip>
            </motion.div>
          );
        })}

        {/* 🌟 Líneas de Conexión Energética */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.3
          }}
        >
          {(Object.keys(elementos) as Array<keyof ElementalData>).map((element, index) => {
            const pos1 = getElementPosition(element, index);
            const pos2 = { x: 50, y: 50 }; // Centro

            return (
              <line
                key={`line-${element}`}
                x1={`${pos1.x}%`}
                y1={`${pos1.y}%`}
                x2={`${pos2.x}%`}
                y2={`${pos2.y}%`}
                stroke={ELEMENTAL_CONFIG[element].color}
                strokeWidth="2"
                strokeDasharray={element === dominantElement ? "none" : "4,4"}
                style={{
                  animation: cosmicEffects.enableAnimations
                    ? `energyFlow 3s ease-in-out infinite ${index * 0.5}s`
                    : 'none'
                }}
              />
            );
          })}
        </svg>
      </Box>

      {/* 🔮 Información del Elemento Seleccionado */}
      <Collapse in={selectedElement !== null}>
        {selectedElement && (
          <Box sx={{
            p: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(ELEMENTAL_CONFIG[selectedElement].color, 0.05)}, transparent)`,
            border: `1px solid ${alpha(ELEMENTAL_CONFIG[selectedElement].color, 0.2)}`,
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: ELEMENTAL_CONFIG[selectedElement].gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6">
                  {ELEMENTAL_CONFIG[selectedElement].symbol}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: ELEMENTAL_CONFIG[selectedElement].color }}>
                  Elemento {ELEMENTAL_CONFIG[selectedElement].name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ELEMENTAL_CONFIG[selectedElement].description}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              {ELEMENTAL_CONFIG[selectedElement].philosophy}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                Palabras Clave:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {ELEMENTAL_CONFIG[selectedElement].keywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    size="small"
                    sx={{
                      background: alpha(ELEMENTAL_CONFIG[selectedElement].color, 0.1),
                      color: ELEMENTAL_CONFIG[selectedElement].color,
                      fontSize: '0.75rem'
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{
              p: 2,
              borderRadius: 1,
              background: alpha(ELEMENTAL_CONFIG[selectedElement].color, 0.05),
              borderLeft: `3px solid ${ELEMENTAL_CONFIG[selectedElement].color}`
            }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                💡 Para equilibrar: {ELEMENTAL_CONFIG[selectedElement].balance}
              </Typography>
            </Box>
          </Box>
        )}
      </Collapse>

      {/* 🎯 Recomendaciones de Balance */}
      {recommendations.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              🌟 Recomendaciones de Equilibrio
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowRecommendations(!showRecommendations)}
              sx={{ color: 'text.secondary' }}
            >
              {showRecommendations ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showRecommendations}>
            <Stack spacing={1}>
              {recommendations.slice(0, 3).map((rec, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(ELEMENTAL_CONFIG[rec.element].color, 0.05),
                    border: `1px solid ${alpha(ELEMENTAL_CONFIG[rec.element].color, 0.15)}`
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {ELEMENTAL_CONFIG[rec.element].symbol} {rec.action}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    {rec.philosophy}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Collapse>
        </Box>
      )}

      {/* 🎨 Keyframes para Animaciones */}
      <style>
        {`
          @keyframes cosmicPulse {
            0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          }
          @keyframes elementalPulse-fuego {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.4); }
            50% { box-shadow: 0 0 30px rgba(255, 107, 53, 0.8); }
          }
          @keyframes elementalPulse-agua {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
          }
          @keyframes elementalPulse-tierra {
            0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
            50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.8); }
          }
          @keyframes elementalPulse-aire {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
            50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8); }
          }
          @keyframes energyFlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          @keyframes elementalDrift {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
            100% { transform: translateY(-40px) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
    </CosmicCard>
  );
});

PhilosophicalMetricsGalaxy.displayName = 'PhilosophicalMetricsGalaxy';

export default PhilosophicalMetricsGalaxy;
