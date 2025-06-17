import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Balance,
  LocalFireDepartment,
  Water,
  Terrain,
  Air,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

interface ElementData {
  name: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  description: string;
}

interface AyniBalanceVisualizationProps {
  balanceAyni: number;
  elementos: {
    fuego: number;
    agua: number;
    tierra: number;
    aire: number;
  };
  className?: string;
}

export const AyniBalanceVisualization: React.FC<AyniBalanceVisualizationProps> = ({
  balanceAyni,
  elementos,
  className = '',
}) => {
  const theme = useTheme();
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedElements, setAnimatedElements] = useState({
    fuego: 0,
    agua: 0,
    tierra: 0,
    aire: 0,
  });

  // 🎨 Animación de entrada para el balance
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBalance(balanceAyni);
      setAnimatedElements(elementos);
    }, 300);
    return () => clearTimeout(timer);
  }, [balanceAyni, elementos]);

  // 🌟 Configuración de elementos
  const elementConfig: ElementData[] = [
    {
      name: 'Fuego',
      value: animatedElements.fuego,
      icon: <LocalFireDepartment />,
      color: '#FF6B35',
      description: 'Pasión y acción',
    },
    {
      name: 'Agua',
      value: animatedElements.agua,
      icon: <Water />,
      color: '#4FC3F7',
      description: 'Fluir y adaptabilidad',
    },
    {
      name: 'Tierra',
      value: animatedElements.tierra,
      icon: <Terrain />,
      color: '#8BC34A',
      description: 'Estabilidad y confianza',
    },
    {
      name: 'Aire',
      value: animatedElements.aire,
      icon: <Air />,
      color: '#FFD54F',
      description: 'Comunicación e ideas',
    },
  ];

  // 🎯 Calcular el estado del balance
  const getBalanceStatus = (balance: number) => {
    if (balance >= 0.8) return { status: 'Excelente', color: theme.palette.success.main, icon: <TrendingUp /> };
    if (balance >= 0.6) return { status: 'Bueno', color: theme.palette.info.main, icon: <TrendingUp /> };
    if (balance >= 0.4) return { status: 'Regular', color: theme.palette.warning.main, icon: <TrendingDown /> };
    return { status: 'Necesita atención', color: theme.palette.error.main, icon: <TrendingDown /> };
  };

  const balanceStatus = getBalanceStatus(animatedBalance);

  // 🎨 Calcular el ángulo para el indicador circular
  const balanceAngle = (animatedBalance * 360) - 90; // -90 para empezar desde arriba

  return (
    <Card
      className={`glassmorphism-card interactive-card-advanced ${className}`}
      sx={{
        background: 'transparent',
        border: `1px solid ${alpha('#fff', 0.1)}`,
        borderRadius: 3,
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Balance sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            Balance Ayni
          </Typography>
        </Box>

        {/* Balance Circle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box
            className="ayni-balance-circle"
            sx={{
              position: 'relative',
              width: 160,
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Circle */}
            <svg
              width="160"
              height="160"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={alpha('#fff', 0.1)}
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={balanceStatus.color}
                strokeWidth="8"
                strokeDasharray={`${animatedBalance * 440} 440`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{
                  transition: 'stroke-dasharray 1s ease-in-out',
                }}
              />
            </svg>

            {/* Center Content */}
            <Box sx={{ textAlign: 'center', zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: balanceStatus.color,
                  mb: 0.5,
                }}
              >
                {Math.round(animatedBalance * 100)}%
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                Balance
              </Typography>
            </Box>

            {/* Indicator */}
            <Box
              className="ayni-balance-indicator"
              sx={{
                position: 'absolute',
                top: 10,
                left: '50%',
                width: 12,
                height: 12,
                bgcolor: balanceStatus.color,
                borderRadius: '50%',
                transform: `translate(-50%, -50%) rotate(${balanceAngle}deg)`,
                transformOrigin: '50% 70px',
                transition: 'transform 1s ease-in-out',
                boxShadow: `0 0 10px ${balanceStatus.color}`,
              }}
            />
          </Box>
        </Box>

        {/* Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
          {balanceStatus.icon}
          <Chip
            label={balanceStatus.status}
            sx={{
              bgcolor: alpha(balanceStatus.color, 0.2),
              color: balanceStatus.color,
              fontWeight: 'bold',
            }}
          />
        </Box>

        {/* Elements Harmony Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
            Armonía Elemental
          </Typography>
          <Box
            className="element-harmony-grid"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            {elementConfig.map((element, index) => (
              <Tooltip
                key={element.name}
                title={`${element.name}: ${element.description}`}
                arrow
              >
                <Box
                  className="element-harmony-item"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(element.color, 0.1),
                    border: `1px solid ${alpha(element.color, 0.3)}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    animationDelay: `${index * 100}ms`,
                    '&:hover': {
                      background: alpha(element.color, 0.2),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: element.color,
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {element.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    {element.name}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={element.value}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha('#fff', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: element.color,
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha('#fff', 0.7),
                      fontSize: '0.7rem',
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {element.value}%
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Insights */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          }}
        >
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontStyle: 'italic' }}>
            💫 {animatedBalance >= 0.7 
              ? 'Tu balance Ayni está en armonía. Continúa cultivando el equilibrio entre dar y recibir.'
              : 'Considera participar más en intercambios comunitarios para mejorar tu balance Ayni.'
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AyniBalanceVisualization; 