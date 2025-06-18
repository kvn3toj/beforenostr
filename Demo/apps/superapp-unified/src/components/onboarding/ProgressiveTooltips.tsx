import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Fade,
  Popper,
  ClickAwayListener,
  useTheme,
  alpha,
  Avatar,
  Chip
} from '@mui/material';
import {
  Close,
  ArrowForward,
  CheckCircle,
  AutoAwesome,
  PlayArrow,
  TrendingUp,
  Help
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  ondas?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

interface ProgressiveTooltipsProps {
  isActive: boolean;
  steps: TooltipStep[];
  onComplete: () => void;
  onSkip: () => void;
  userStage?: 'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER';
}

export const ProgressiveTooltips: React.FC<ProgressiveTooltipsProps> = ({
  isActive,
  steps,
  onComplete,
  onSkip,
  userStage = 'BUYER'
}) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentTooltip = steps[currentStep];

  // Find target element and position tooltip
  useEffect(() => {
    if (!isActive || !currentTooltip) return;

    const findAndAttach = () => {
      const targetElement = document.querySelector(currentTooltip.target);
      if (targetElement) {
        setAnchorEl(targetElement);
        setIsVisible(true);
        
        // Add highlight effect to target element
        targetElement.classList.add('coomunity-tooltip-highlight');
        
        return true;
      }
      return false;
    };

    // Try immediately, then retry with delays
    if (!findAndAttach()) {
      const retryTimeouts = [500, 1000, 2000];
      
      retryTimeouts.forEach((delay) => {
        setTimeout(() => {
          if (!anchorEl) findAndAttach();
        }, delay);
      });
    }

    return () => {
      // Cleanup highlight class
      if (anchorEl) {
        anchorEl.classList.remove('coomunity-tooltip-highlight');
      }
    };
  }, [isActive, currentTooltip, anchorEl]);

  // Auto-advance based on delay
  useEffect(() => {
    if (!isActive || !currentTooltip?.delay) return;

    const timer = setTimeout(() => {
      handleNext();
    }, currentTooltip.delay);

    return () => clearTimeout(timer);
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      setCompletedSteps(prev => [...prev, currentTooltip.id]);
      
      // Clean up current highlight
      if (anchorEl) {
        anchorEl.classList.remove('coomunity-tooltip-highlight');
      }
      
      setIsVisible(false);
      setAnchorEl(null);
      
      // Move to next step with delay
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCompletedSteps(prev => prev.filter(id => id !== currentTooltip.id));
      
      if (anchorEl) {
        anchorEl.classList.remove('coomunity-tooltip-highlight');
      }
      
      setIsVisible(false);
      setAnchorEl(null);
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 300);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setAnchorEl(null);
    
    // Clean up all highlights
    document.querySelectorAll('.coomunity-tooltip-highlight').forEach(el => {
      el.classList.remove('coomunity-tooltip-highlight');
    });
    
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    setAnchorEl(null);
    
    // Clean up all highlights
    document.querySelectorAll('.coomunity-tooltip-highlight').forEach(el => {
      el.classList.remove('coomunity-tooltip-highlight');
    });
    
    onSkip();
  };

  const handleAction = () => {
    if (currentTooltip.action) {
      currentTooltip.action.onClick();
    }
    
    // Award Öndas if specified
    if (currentTooltip.ondas) {
      // Could integrate with actual Öndas system here
      console.log(`Awarded ${currentTooltip.ondas} Öndas for completing tooltip action`);
    }
    
    handleNext();
  };

  if (!isActive || !currentTooltip) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: alpha(theme.palette.common.black, 0.4),
              zIndex: 9998,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      {/* Tooltip Popper */}
      <Popper
        open={isVisible && Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement={currentTooltip.position || 'bottom'}
        style={{ zIndex: 9999 }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 16],
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={handleSkip}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card
              sx={{
                maxWidth: 350,
                minWidth: 280,
                p: 3,
                boxShadow: theme.shadows[16],
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.05)})`,
                border: `2px solid ${theme.palette.primary.main}`,
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={handleSkip}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'text.secondary'
                }}
              >
                <Close />
              </IconButton>

              {/* Header */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '1rem'
                    }}
                  >
                    {currentStep + 1}
                  </Avatar>
                  
                  {currentTooltip.ondas && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <Chip
                        icon={<AutoAwesome />}
                        label={`+${currentTooltip.ondas} Öndas`}
                        size="small"
                        color="secondary"
                        variant="filled"
                      />
                    </motion.div>
                  )}
                </Box>

                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {currentTooltip.title}
                </Typography>
              </Box>

              {/* Content */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {currentTooltip.content}
              </Typography>

              {/* Action Button */}
              {currentTooltip.action && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAction}
                    startIcon={<PlayArrow />}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #45a049, #1976d2)',
                      }
                    }}
                  >
                    {currentTooltip.action.label}
                  </Button>
                </Box>
              )}

              {/* Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  size="small"
                  color="inherit"
                >
                  Anterior
                </Button>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {steps.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: index <= currentStep ? 'primary.main' : 'grey.300',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>

                <Button
                  onClick={currentTooltip.action ? handleAction : handleNext}
                  size="small"
                  variant="contained"
                  endIcon={<ArrowForward />}
                >
                  {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </Box>

              {/* Progress indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: 3,
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                  bgcolor: 'primary.main',
                  transition: 'width 0.3s ease',
                  borderRadius: '0 0 12px 0'
                }}
              />
            </Card>
          </motion.div>
        </ClickAwayListener>
      </Popper>

      {/* Add custom CSS for highlight effect */}
      <style>
        {`
          .coomunity-tooltip-highlight {
            position: relative !important;
            z-index: 9997 !important;
            box-shadow: 0 0 0 4px ${alpha(theme.palette.primary.main, 0.3)} !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
          }
          
          .coomunity-tooltip-highlight::before {
            content: '';
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border: 2px solid ${theme.palette.primary.main};
            border-radius: 12px;
            animation: pulse-border 2s infinite;
            pointer-events: none;
          }
          
          @keyframes pulse-border {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </>
  );
};

// Pre-defined tooltip sequences for different user stages
export const getStageTooltips = (stage: string): TooltipStep[] => {
  switch (stage) {
    case 'BUYER':
      return [
        {
          id: 'welcome_dashboard',
          target: '[data-testid="dashboard-header"]',
          title: '¡Bienvenido a tu Dashboard!',
          content: 'Este es tu centro de control personal. Aquí verás tu progreso, Öndas acumuladas y próximos pasos.',
          position: 'bottom',
          ondas: 5
        },
        {
          id: 'uplay_intro',
          target: '[data-testid="uplay-nav-link"]',
          title: 'Descubre ÜPlay',
          content: 'Aquí encontrarás videos interactivos que te enseñarán sobre Ayni y el Bien Común mientras ganas Öndas.',
          action: {
            label: 'Explorar ÜPlay',
            onClick: () => window.location.href = '/uplay'
          },
          position: 'bottom',
          ondas: 10
        },
        {
          id: 'marketplace_preview',
          target: '[data-testid="marketplace-nav-link"]',
          title: 'Marketplace Local',
          content: 'Explora productos y servicios de tu comunidad. Cada transacción fortalece el ecosistema local.',
          position: 'bottom',
          ondas: 5
        }
      ];

    case 'SEEKER':
      return [
        {
          id: 'social_connections',
          target: '[data-testid="social-nav-link"]',
          title: 'Conecta con tu Comunidad',
          content: 'Es momento de conocer a otros miembros y formar conexiones significativas.',
          action: {
            label: 'Ver Comunidad',
            onClick: () => window.location.href = '/social'
          },
          position: 'bottom',
          ondas: 15
        },
        {
          id: 'trust_voting_intro',
          target: '[data-testid="trust-voting-link"]',
          title: 'Sistema de Confianza',
          content: 'Participa en la validación comunitaria. Tu voto ayuda a mantener la calidad del ecosistema.',
          position: 'bottom',
          ondas: 10
        }
      ];

    case 'SOLVER':
      return [
        {
          id: 'create_offering',
          target: '[data-testid="create-listing-button"]',
          title: 'Crea tu Primera Oferta',
          content: 'Ya es momento de contribuir al marketplace. Comparte tus habilidades o productos con la comunidad.',
          action: {
            label: 'Crear Oferta',
            onClick: () => console.log('Navigate to create listing')
          },
          position: 'top',
          ondas: 25
        },
        {
          id: 'mentor_others',
          target: '[data-testid="mentorship-section"]',
          title: 'Mentoreo',
          content: 'Considera guiar a nuevos Seekers. El mentoreo es una forma poderosa de generar Mëritos.',
          position: 'bottom',
          ondas: 20
        }
      ];

    case 'PROMOTER':
      return [
        {
          id: 'community_leadership',
          target: '[data-testid="community-management"]',
          title: 'Liderazgo Comunitario',
          content: 'Como Promoter, tu rol es liderar iniciativas que beneficien a toda la comunidad.',
          position: 'bottom',
          ondas: 30
        },
        {
          id: 'ecosystem_expansion',
          target: '[data-testid="invite-members-button"]',
          title: 'Expansión del Ecosistema',
          content: 'Invita a nuevos miembros y ayuda a crear nuevos hubs geográficos.',
          action: {
            label: 'Invitar Miembros',
            onClick: () => console.log('Open invite modal')
          },
          position: 'top',
          ondas: 40
        }
      ];

    default:
      return [];
  }
};

export default ProgressiveTooltips;