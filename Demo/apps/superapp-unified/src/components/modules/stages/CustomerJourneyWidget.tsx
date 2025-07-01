import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
  Button,
} from '@mui/material';
import {
  ShoppingCart as BuyerIcon,
  Search as SeekerIcon,
  Bolt as SolverIcon,
  Star as PromoterIcon,
  ArrowForward,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomerJourneyVisualization from './CustomerJourneyVisualization';

// Types
type CustomerJourneyStage = 'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER';

interface StageConfig {
  icon: React.ElementType;
  color: string;
  gradient: string;
  name: string;
}

// Configuración de stages (simplificada para el widget)
const STAGE_ICONS: Record<CustomerJourneyStage, StageConfig> = {
  BUYER: {
    icon: BuyerIcon,
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    name: 'Buyer'
  },
  SEEKER: {
    icon: SeekerIcon,
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    name: 'Seeker'
  },
  SOLVER: {
    icon: SolverIcon,
    color: '#45B7D1',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)',
    name: 'Solver'
  },
  PROMOTER: {
    icon: PromoterIcon,
    color: '#96CEB4',
    gradient: 'linear-gradient(135deg, #96CEB4 0%, #FFECD2 100%)',
    name: 'Promoter'
  }
};

interface CustomerJourneyWidgetProps {
  className?: string;
  onViewDetails?: () => void;
}

// Mock data - TODO: Conectar con hook real
const mockUserProgress = {
  currentStage: 'BUYER' as CustomerJourneyStage,
  currentStageProgress: 65,
  timeInCurrentStage: 5,
  nextStageName: 'Seeker',
  daysToNext: 2,
  totalMeritos: 75,
  totalOndas: 180,
  requiredMeritos: 100,
  requiredOndas: 200
};

export const CustomerJourneyWidget: React.FC<CustomerJourneyWidgetProps> = ({
  className,
  onViewDetails
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const currentStageConfig = STAGE_ICONS[mockUserProgress.currentStage];
  const stages = Object.keys(STAGE_ICONS) as CustomerJourneyStage[];
  const currentIndex = stages.indexOf(mockUserProgress.currentStage);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate('/customer-journey'); // Ruta a crear
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card
        sx={{
          background: currentStageConfig.gradient,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 100,
            height: 100,
            background: alpha('#fff', 0.1),
            borderRadius: '50%',
            transform: 'translate(30px, -30px)'
          }
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: alpha('#fff', 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                {React.createElement(currentStageConfig.icon, {
                  sx: { fontSize: 24, color: '#fff' }
                })}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Stage: {currentStageConfig.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Día {mockUserProgress.timeInCurrentStage} en esta etapa
                </Typography>
              </Box>
            </Box>
            <Chip
              label={`${mockUserProgress.currentStageProgress}%`}
              sx={{
                background: alpha('#fff', 0.2),
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            />
          </Box>

          {/* Progreso del Stage Actual */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Progreso en {currentStageConfig.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {mockUserProgress.currentStageProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={mockUserProgress.currentStageProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha('#fff', 0.2),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#fff',
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* Mini Stepper de Stages */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Tu viaje en CoomÜnity:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {stages.map((stage, index) => {
                const stageConfig = STAGE_ICONS[stage];
                const isPast = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isFuture = index > currentIndex;

                return (
                  <React.Fragment key={stage}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: isPast
                          ? alpha('#fff', 0.3)
                          : isCurrent
                            ? alpha('#fff', 0.2)
                            : alpha('#fff', 0.1),
                        border: isCurrent ? `2px solid #fff` : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {React.createElement(stageConfig.icon, {
                        sx: {
                          fontSize: 16,
                          color: '#fff',
                          opacity: isFuture ? 0.5 : 1
                        }
                      })}
                    </Box>
                    {index < stages.length - 1 && (
                      <Box
                        sx={{
                          flex: 1,
                          height: 2,
                          background: alpha('#fff', isPast ? 0.3 : 0.1),
                          mx: 1,
                          borderRadius: 1
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>

          {/* Próximo Objetivo */}
          <Box sx={{ mb: 3, p: 2, background: alpha('#fff', 0.1), borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              🎯 Próximo Objetivo:
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Avanzar a {mockUserProgress.nextStageName} en ~{mockUserProgress.daysToNext} días
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                size="small"
                label={`${mockUserProgress.totalMeritos}/${mockUserProgress.requiredMeritos} Méritos`}
                sx={{
                  background: alpha('#fff', 0.2),
                  color: '#fff',
                  fontSize: '0.7rem'
                }}
              />
              <Chip
                size="small"
                label={`${mockUserProgress.totalOndas}/${mockUserProgress.requiredOndas} Öndas`}
                sx={{
                  background: alpha('#fff', 0.2),
                  color: '#fff',
                  fontSize: '0.7rem'
                }}
              />
            </Box>
          </Box>

          {/* Botón de Acción */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleViewDetails}
            endIcon={<ArrowForward />}
            sx={{
              background: alpha('#fff', 0.2),
              color: '#fff',
              '&:hover': {
                background: alpha('#fff', 0.3)
              }
            }}
          >
            Ver Journey Completo
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Widget aún más compacto para espacios pequeños
export const CustomerJourneyMiniWidget: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const currentStageConfig = STAGE_ICONS[mockUserProgress.currentStage];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          borderRadius: 3,
          background: currentStageConfig.gradient,
          color: '#fff',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(currentStageConfig.icon, {
              sx: { fontSize: 20, mr: 1 }
            })}
            <Typography variant="subtitle2" fontWeight="bold">
              {currentStageConfig.name}
            </Typography>
          </Box>
          <Chip
            label={`${mockUserProgress.currentStageProgress}%`}
            size="small"
            sx={{
              background: alpha('#fff', 0.2),
              color: '#fff',
              fontSize: '0.7rem'
            }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={mockUserProgress.currentStageProgress}
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: alpha('#fff', 0.2),
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#fff',
              borderRadius: 2
            }
          }}
        />

        <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
          Próximo: {mockUserProgress.nextStageName}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default CustomerJourneyWidget;
