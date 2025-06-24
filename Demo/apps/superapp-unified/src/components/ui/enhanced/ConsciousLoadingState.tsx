import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, LinearProgress, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ConsciousLoadingStateProps {
  element?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
  variant?: 'circular' | 'linear' | 'meditation' | 'pulse' | 'cosmic';
  size?: 'small' | 'medium' | 'large';
  message?: string;
  context?: 'marketplace' | 'uplay' | 'ustats' | 'social' | 'general';
  showProgress?: boolean;
  progress?: number;
  className?: string;
  'data-testid'?: string;
}

// 🌿 Mensajes conscientes por elemento
const CONSCIOUS_MESSAGES = {
  fuego: [
    "🔥 Encendiendo la llama del conocimiento...",
    "⚡ Activando la energía transformadora...",
    "🌟 Preparando experiencias dinámicas..."
  ],
  agua: [
    "💧 Fluyendo hacia la sabiduría...",
    "🌊 Navegando corrientes de datos...",
    "🔮 Sincronizando con el ritmo natural..."
  ],
  tierra: [
    "🌱 Sembrando semillas de información...",
    "🏔️ Construyendo bases sólidas...",
    "🌾 Cultivando conocimiento consciente..."
  ],
  aire: [
    "🌪️ Inspirando nuevas perspectivas...",
    "☁️ Expandiendo horizontes digitales...",
    "🦋 Transformando datos en sabiduría..."
  ],
  eter: [
    "✨ Conectando con la consciencia universal...",
    "🌌 Alineando energías cósmicas...",
    "🔗 Integrando todas las dimensiones..."
  ]
};

// 🎨 Configuración visual por elemento
const ELEMENT_CONFIGS = {
  fuego: {
    primaryColor: '#FF6B35',
    secondaryColor: '#FF8E53',
    gradient: 'linear-gradient(135deg, #FF6B35, #FF8E53)',
    glowColor: 'rgba(255, 107, 53, 0.3)',
    bgColor: 'rgba(255, 107, 53, 0.05)'
  },
  agua: {
    primaryColor: '#4ECDC4',
    secondaryColor: '#44A08D',
    gradient: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
    glowColor: 'rgba(78, 205, 196, 0.3)',
    bgColor: 'rgba(78, 205, 196, 0.05)'
  },
  tierra: {
    primaryColor: '#8BC34A',
    secondaryColor: '#689F38',
    gradient: 'linear-gradient(135deg, #8BC34A, #689F38)',
    glowColor: 'rgba(139, 195, 74, 0.3)',
    bgColor: 'rgba(139, 195, 74, 0.05)'
  },
  aire: {
    primaryColor: '#81C784',
    secondaryColor: '#66BB6A',
    gradient: 'linear-gradient(135deg, #81C784, #66BB6A)',
    glowColor: 'rgba(129, 199, 132, 0.3)',
    bgColor: 'rgba(129, 199, 132, 0.05)'
  },
  eter: {
    primaryColor: '#9C27B0',
    secondaryColor: '#7B1FA2',
    gradient: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
    glowColor: 'rgba(156, 39, 176, 0.3)',
    bgColor: 'rgba(156, 39, 176, 0.05)'
  }
};

export const ConsciousLoadingState: React.FC<ConsciousLoadingStateProps> = ({
  element = 'eter',
  variant = 'meditation',
  size = 'medium',
  message,
  context = 'general',
  showProgress = false,
  progress,
  className,
  'data-testid': testId = 'conscious-loading-state'
}) => {
  const theme = useTheme();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);

  const elementConfig = ELEMENT_CONFIGS[element];
  const messages = CONSCIOUS_MESSAGES[element];
  const displayMessage = message || messages[currentMessageIndex];

  // 🔄 Rotación de mensajes conscientes
  useEffect(() => {
    if (!message && messages.length > 1) {
      const interval = setInterval(() => {
        setShowMessage(false);
        setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setShowMessage(true);
        }, 300);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [message, messages.length]);

  // 📏 Configuración de tamaños
  const sizeConfig = {
    small: { spinner: 32, container: 120, fontSize: '0.75rem' },
    medium: { spinner: 48, container: 180, fontSize: '0.875rem' },
    large: { spinner: 64, container: 240, fontSize: '1rem' }
  };

  const config = sizeConfig[size];

  // 🎯 Renderizado de variante Meditation (Principal)
  const renderMeditationVariant = () => (
    <Box
      data-testid={testId}
      data-conscious-element={element}
      data-conscious-variant={variant}
      className={`conscious-loading-meditation ${className || ''}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: config.container,
        padding: 3,
        borderRadius: 3,
        background: elementConfig.bgColor,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: elementConfig.gradient,
          opacity: 0.03,
          borderRadius: 3,
        }
      }}
    >
      {/* 🌟 Círculo central consciente */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: config.spinner + 24,
          height: config.spinner + 24,
          borderRadius: '50%',
          background: elementConfig.gradient,
          opacity: 0.1,
          mb: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: config.spinner + 8,
            height: config.spinner + 8,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${elementConfig.glowColor}`,
            animation: 'consciousPulse 2s ease-in-out infinite',
          }
        }}
      >
        <CircularProgress
          size={config.spinner}
          thickness={3}
          sx={{
            color: elementConfig.primaryColor,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
              filter: `drop-shadow(0 0 8px ${elementConfig.glowColor})`,
            }
          }}
        />
      </Box>

      {/* 💬 Mensaje consciente */}
      <Fade in={showMessage} timeout={300}>
        <Typography
          variant="body2"
          sx={{
            color: elementConfig.primaryColor,
            fontSize: config.fontSize,
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '200px',
            lineHeight: 1.4,
            mb: showProgress ? 2 : 0,
          }}
        >
          {displayMessage}
        </Typography>
      </Fade>

      {/* 📊 Barra de progreso (opcional) */}
      {showProgress && (
        <Box sx={{ width: '100%', maxWidth: 200 }}>
          <LinearProgress
            variant={progress !== undefined ? 'determinate' : 'indeterminate'}
            value={progress}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: `${elementConfig.primaryColor}20`,
              '& .MuiLinearProgress-bar': {
                background: elementConfig.gradient,
                borderRadius: 2,
              }
            }}
          />
          {progress !== undefined && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 1,
                color: elementConfig.primaryColor,
                opacity: 0.8
              }}
            >
              {Math.round(progress)}%
            </Typography>
          )}
        </Box>
      )}

      {/* ✨ Keyframes CSS integradas */}
      <style>
        {`
          @keyframes consciousPulse {
            0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
          }
        `}
      </style>
    </Box>
  );

  // 🔥 Renderizado de variante Pulse (Energía)
  const renderPulseVariant = () => (
    <Box
      data-testid={testId}
      data-conscious-element={element}
      data-conscious-variant={variant}
      className={`conscious-loading-pulse ${className || ''}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        gap: 2
      }}
    >
      <Box
        sx={{
          width: config.spinner,
          height: config.spinner,
          borderRadius: '50%',
          background: elementConfig.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'consciousBreath 1.5s ease-in-out infinite',
          boxShadow: `0 0 20px ${elementConfig.glowColor}`,
        }}
      >
        <Box
          sx={{
            width: config.spinner * 0.6,
            height: config.spinner * 0.6,
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: 0.9,
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: elementConfig.primaryColor,
          fontSize: config.fontSize,
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {displayMessage}
      </Typography>

      <style>
        {`
          @keyframes consciousBreath {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );

  // 🌌 Renderizado de variante Cosmic (Cósmica)
  const renderCosmicVariant = () => (
    <Box
      data-testid={testId}
      data-conscious-element={element}
      data-conscious-variant={variant}
      className={`conscious-loading-cosmic ${className || ''}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: config.container,
        padding: 3,
        position: 'relative',
        background: `radial-gradient(circle, ${elementConfig.bgColor} 0%, transparent 70%)`,
      }}
    >
      {/* 🌌 Orbitales cósmicos */}
      <Box sx={{ position: 'relative', width: config.spinner + 40, height: config.spinner + 40 }}>
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: config.spinner + (index * 15),
              height: config.spinner + (index * 15),
              border: `1px solid ${elementConfig.primaryColor}`,
              borderRadius: '50%',
              opacity: 0.3 - (index * 0.1),
              transform: 'translate(-50%, -50%)',
              animation: `cosmicRotate${index} ${3 + index}s linear infinite`,
            }}
          />
        ))}

        <CircularProgress
          size={config.spinner}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: elementConfig.primaryColor,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: elementConfig.primaryColor,
          fontSize: config.fontSize,
          fontWeight: 500,
          textAlign: 'center',
          mt: 2,
        }}
      >
        {displayMessage}
      </Typography>

      <style>
        {`
          @keyframes cosmicRotate0 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
          @keyframes cosmicRotate1 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-360deg); } }
          @keyframes cosmicRotate2 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        `}
      </style>
    </Box>
  );

  // 📐 Renderizado según variante
  switch (variant) {
    case 'pulse':
      return renderPulseVariant();
    case 'cosmic':
      return renderCosmicVariant();
    case 'circular':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={config.spinner} sx={{ color: elementConfig.primaryColor }} />
        </Box>
      );
    case 'linear':
      return (
        <Box sx={{ width: '100%', p: 2 }}>
          <LinearProgress
            sx={{
              backgroundColor: `${elementConfig.primaryColor}20`,
              '& .MuiLinearProgress-bar': { background: elementConfig.gradient }
            }}
          />
        </Box>
      );
    case 'meditation':
    default:
      return renderMeditationVariant();
  }
};
