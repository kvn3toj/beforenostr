import React, { useState, useContext } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  alpha,
  useTheme,
  Zoom,
  ButtonBase,
  LinearProgress,
} from '@mui/material';
import {
  LocalFireDepartment,
  Water,
  Terrain,
  Air,
  AllInclusive,
  AutoAwesome,
  Palette,
  Close,
} from '@mui/icons-material';

// Configuración de los elementos cósmicos
export const COSMIC_ELEMENTS = {
  fuego: {
    name: 'Fuego',
    description: 'Pasión • Acción • Transformación',
    color: '#FF5722',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFC107 100%)',
    icon: LocalFireDepartment,
    personality: 'Líder natural, innovador, emprendedor',
    modules: ['challenges', 'creation', 'leadership'],
    effects: {
      particles: 'flame-sparks',
      glow: 'warm',
      animation: 'flickering-flames'
    },
    philosophy: 'El elemento que impulsa la acción transformadora y la pasión creativa'
  },
  agua: {
    name: 'Agua',
    description: 'Fluidez • Adaptabilidad • Colaboración',
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 50%, #00BCD4 100%)',
    icon: Water,
    personality: 'Colaborador nato, empático, facilitador',
    modules: ['social', 'groups', 'communication'],
    effects: {
      particles: 'flowing-drops',
      glow: 'cool',
      animation: 'rippling-waves'
    },
    philosophy: 'El elemento que conecta y fluye, adaptándose a cualquier forma'
  },
  tierra: {
    name: 'Tierra',
    description: 'Estabilidad • Crecimiento • Abundancia',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)',
    icon: Terrain,
    personality: 'Constructor sólido, práctico, abundante',
    modules: ['marketplace', 'lets', 'resources'],
    effects: {
      particles: 'earth-crystals',
      glow: 'stable',
      animation: 'growing-roots'
    },
    philosophy: 'El elemento que nutre y sostiene, creando bases sólidas para el crecimiento'
  },
  aire: {
    name: 'Aire',
    description: 'Comunicación • Ideas • Sabiduría',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 50%, #F44336 100%)',
    icon: Air,
    personality: 'Comunicador inspirado, visionario, maestro',
    modules: ['uplay', 'learning', 'teaching'],
    effects: {
      particles: 'floating-thoughts',
      glow: 'ethereal',
      animation: 'swirling-winds'
    },
    philosophy: 'El elemento que transporta ideas y conecta mentes a través del conocimiento'
  },
  ether: {
    name: 'Ether',
    description: 'Consciencia • Transcendencia • Unidad',
    color: '#E1BEE7',
    gradient: 'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 50%, #BA68C8 100%)',
    icon: AllInclusive,
    personality: 'Sabio transcendente, consciente cósmico, unificador',
    modules: ['wisdom', 'meditation', 'transcendence'],
    effects: {
      particles: 'cosmic-dust',
      glow: 'transcendent',
      animation: 'ethereal-flow'
    },
    philosophy: 'El elemento que trasciende los límites, conectando con la consciencia universal'
  }
} as const;

export type CosmicElement = keyof typeof COSMIC_ELEMENTS;

interface CosmicThemeSwitcherProps {
  currentElement?: CosmicElement;
  onElementChange?: (element: CosmicElement) => void;
  showProgress?: boolean;
  userBalance?: Record<CosmicElement, number>;
  compact?: boolean;
  position?: 'floating' | 'inline';
}

export const CosmicThemeSwitcher: React.FC<CosmicThemeSwitcherProps> = ({
  currentElement = 'fuego',
  onElementChange,
  showProgress = false,
  userBalance,
  compact = false,
  position = 'inline'
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedElement, setSelectedElement] = useState<CosmicElement>(currentElement);

  const handleElementSelect = (element: CosmicElement) => {
    setSelectedElement(element);
    onElementChange?.(element);
    if (compact) setIsExpanded(false);
  };

  const currentConfig = COSMIC_ELEMENTS[selectedElement];

  // Calcular balance promedio si se proporciona
  const averageBalance = userBalance
    ? Math.round(Object.values(userBalance).reduce((sum, val) => sum + val, 0) / 5)
    : 75;

  if (compact && !isExpanded) {
    return (
      <Tooltip title={`Elemento actual: ${currentConfig.name}`}>
        <IconButton
          onClick={() => setIsExpanded(true)}
          sx={{
            width: 56,
            height: 56,
            background: currentConfig.gradient,
            color: 'white',
            boxShadow: `0 4px 20px ${alpha(currentConfig.color, 0.3)}`,
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 6px 25px ${alpha(currentConfig.color, 0.4)}`
            },
            position: position === 'floating' ? 'fixed' : 'relative',
            ...(position === 'floating' && {
              bottom: 20,
              right: 20,
              zIndex: 1000
            })
          }}
        >
          <currentConfig.icon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Zoom in={true}>
      <Card
        sx={{
          p: compact ? 2 : 3,
          background: `linear-gradient(135deg, ${alpha(currentConfig.color, 0.05)} 0%, ${alpha(currentConfig.color, 0.1)} 100%)`,
          border: `2px solid ${alpha(currentConfig.color, 0.2)}`,
          borderRadius: 3,
          position: position === 'floating' ? 'fixed' : 'relative',
          ...(position === 'floating' && {
            bottom: 20,
            right: 20,
            zIndex: 1000,
            minWidth: 320
          }),
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 30px ${alpha(currentConfig.color, 0.2)}`
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: currentConfig.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                animation: `${currentConfig.effects.animation} 3s ease-in-out infinite`
              }}
            >
              <currentConfig.icon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                🌌 Elemento Cósmico
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentConfig.name} • {currentConfig.description}
              </Typography>
            </Box>
          </Box>

          {compact && (
            <IconButton
              size="small"
              onClick={() => setIsExpanded(false)}
              sx={{ opacity: 0.7 }}
            >
              <Close />
            </IconButton>
          )}
        </Box>

        {/* Balance del elemento actual */}
        {showProgress && userBalance && (
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Tu afinidad con {currentConfig.name}
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ color: currentConfig.color }}>
                {userBalance[selectedElement]}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={userBalance[selectedElement]}
              sx={{
                height: 6,
                borderRadius: 3,
                background: alpha(currentConfig.color, 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: currentConfig.gradient
                }
              }}
            />
          </Box>
        )}

        {/* Selector de elementos */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Cambiar Elemento Activo
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {Object.entries(COSMIC_ELEMENTS).map(([key, config]) => {
              const elementKey = key as CosmicElement;
              const isSelected = elementKey === selectedElement;
              const IconComponent = config.icon;
              const balance = userBalance?.[elementKey] || 0;

              return (
                <Tooltip
                  key={elementKey}
                  title={
                    <Box p={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {config.name}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {config.description}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        {config.philosophy}
                      </Typography>
                      {userBalance && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                          Tu nivel: {balance}%
                        </Typography>
                      )}
                    </Box>
                  }
                >
                  <ButtonBase
                    onClick={() => handleElementSelect(elementKey)}
                    className={`guardian-element-button ${isSelected ? 'guardian-element-selected' : ''}`}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      color: isSelected ? 'white' : config.color,
                      minWidth: 80,
                      flexDirection: 'column',
                      gap: 0.5,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px ${alpha(config.color, 0.3)}`,
                        border: `2px solid ${config.color}`
                      },
                      '&::before': isSelected ? {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        background: config.gradient,
                        borderRadius: 'inherit',
                        zIndex: -1,
                        opacity: 0.3,
                        animation: 'cosmicGlow 2s ease-in-out infinite'
                      } : {}
                    }}
                  >
                    <IconComponent sx={{ fontSize: 24 }} />
                    <Typography variant="caption" fontWeight="bold">
                      {config.name}
                    </Typography>

                    {userBalance && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.7rem',
                          opacity: 0.8
                        }}
                      >
                        {balance}%
                      </Typography>
                    )}

                    {/* Indicador de nivel */}
                    {userBalance && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 2,
                          left: 2,
                          right: 2,
                          height: 2,
                          background: alpha(config.color, 0.2),
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${balance}%`,
                            height: '100%',
                            background: isSelected ? 'white' : config.color,
                            borderRadius: 1
                          }}
                        />
                      </Box>
                    )}
                  </ButtonBase>
                </Tooltip>
              );
            })}
          </Stack>
        </Box>

        {/* Información filosófica del elemento seleccionado */}
        {!compact && (
          <Box mt={3} p={2} sx={{
            background: alpha(currentConfig.color, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(currentConfig.color, 0.1)}`
          }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Personalidad:</strong> {currentConfig.personality}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Filosofía:</strong> {currentConfig.philosophy}
            </Typography>
            <Box mt={1}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Módulos afines:
              </Typography>
              <Stack direction="row" spacing={0.5} mt={0.5}>
                {currentConfig.modules.map((module) => (
                  <Chip
                    key={module}
                    label={module}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      background: alpha(currentConfig.color, 0.1),
                      color: currentConfig.color,
                      border: `1px solid ${alpha(currentConfig.color, 0.2)}`
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        )}

        {/* Balance general */}
        {showProgress && userBalance && (
          <Box mt={2} textAlign="center">
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Balance Cósmico General
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: currentConfig.color,
                textShadow: `0 0 10px ${alpha(currentConfig.color, 0.3)}`
              }}
            >
              {averageBalance}%
            </Typography>
          </Box>
        )}

        {/* CSS animations */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            '& @keyframes cosmicGlow': {
              '0%, 100%': { opacity: 0.3 },
              '50%': { opacity: 0.6 }
            },
            '& @keyframes flickering-flames': {
              '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
              '50%': { transform: 'scale(1.05) rotate(2deg)' }
            },
            '& @keyframes rippling-waves': {
              '0%, 100%': { transform: 'scaleY(1)' },
              '50%': { transform: 'scaleY(1.1)' }
            },
            '& @keyframes growing-roots': {
              '0%, 100%': { transform: 'scaleX(1)' },
              '50%': { transform: 'scaleX(1.05)' }
            },
            '& @keyframes swirling-winds': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            },
            '& @keyframes ethereal-flow': {
              '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.05)' }
            }
          }}
        />
      </Card>
    </Zoom>
  );
};

export default CosmicThemeSwitcher;
