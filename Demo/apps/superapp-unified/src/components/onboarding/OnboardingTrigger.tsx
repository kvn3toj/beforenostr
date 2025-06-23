import React, { useState, useEffect } from 'react';
import { Box, Fab, Tooltip, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { Help, AutoAwesome, Refresh, RocketLaunch } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

interface OnboardingTriggerProps {
  userEmail?: string;
  hasCompletedOnboarding?: boolean;
  onOnboardingComplete?: (data: any) => void;
}

export const OnboardingTrigger: React.FC<OnboardingTriggerProps> = ({
  userEmail,
  hasCompletedOnboarding = false,
  onOnboardingComplete
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [shouldAutoTrigger, setShouldAutoTrigger] = useState(false);
  const [completed, setCompleted] = useState(false);
  const theme = useTheme();

  // Check if user should see onboarding on first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('coomunity_onboarding_completed');
    const isNewUser = !hasCompletedOnboarding && !hasSeenOnboarding;

    if (isNewUser && userEmail) {
      // Delay auto-trigger to let the app load
      setTimeout(() => {
        setShouldAutoTrigger(true);
        setShowOnboarding(true);
      }, 2000);
    }
  }, [userEmail, hasCompletedOnboarding]);

  const handleOnboardingComplete = (onboardingData?: any) => {
    setShowOnboarding(false);
    localStorage.setItem('coomunity_onboarding_completed', 'true');
    localStorage.setItem('coomunity_onboarding_date', new Date().toISOString());

    if (onboardingData) {
      localStorage.setItem('coomunity_onboarding_data', JSON.stringify(onboardingData));
    }

    if (onOnboardingComplete) {
      onOnboardingComplete(onboardingData);
    }
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('coomunity_onboarding_skipped', 'true');
    localStorage.setItem('coomunity_onboarding_skip_date', new Date().toISOString());
  };

  const handleManualTrigger = () => {
    setShowOnboarding(true);
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('coomunity_onboarding_completed');
    localStorage.removeItem('coomunity_onboarding_skipped');
    localStorage.removeItem('coomunity_onboarding_data');
    setShowOnboarding(true);
  };

  const handleComplete = () => {
    setCompleted(true);
    // setTimeout(() => setShowOnboarding(false), 2000);
  };

  return (
    <>
      {/* Manual Trigger FAB */}
      <AnimatePresence>
        {!showOnboarding && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              delay: shouldAutoTrigger ? 0 : 3, // Show after auto-trigger or 3 seconds
              type: "spring",
              stiffness: 400
            }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Help/Restart Button */}
              <Tooltip
                title={hasCompletedOnboarding ? "Repetir Onboarding" : "Iniciar Tutorial"}
                placement="left"
              >
                <Fab
                  color="primary"
                  onClick={hasCompletedOnboarding ? handleRestartOnboarding : handleManualTrigger}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049, #1976d2)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {hasCompletedOnboarding ? <Refresh /> : <Help />}
                </Fab>
              </Tooltip>

              {/* Pulsing ring for new users */}
              {!hasCompletedOnboarding && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.3, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: -8,
                    right: -8,
                    bottom: -8,
                    border: '2px solid #4CAF50',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1300,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2
        }}>
          <motion.div>
            Onboarding placeholder - Component needs implementation
            <button onClick={handleOnboardingComplete}>Completar</button>
            <button onClick={handleSkipOnboarding}>Saltar</button>
          </motion.div>
        </Box>
      )}

      {/* Welcome Message for Returning Users */}
      <AnimatePresence>
        {hasCompletedOnboarding && shouldAutoTrigger && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1200
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <AutoAwesome />
              <span style={{ fontWeight: 600 }}>
                ¡Bienvenido de vuelta a CoomÜnity! 🎉
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={showOnboarding}
        onClose={handleSkipOnboarding}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {/* Onboarding content */}
          {/* ❌ REMOVIDO: OnboardingFlow component (archivo vacío) */}
          <motion.div>
            Onboarding placeholder - Component needs implementation
            <button onClick={handleOnboardingComplete}>Completar</button>
            <button onClick={handleSkipOnboarding}>Saltar</button>
          </motion.div>
        </DialogContent>
        <DialogActions sx={{ p: 2, background: theme.palette.background.default }}>
          <Button
            onClick={handleComplete}
            variant="contained"
            sx={{
              color: theme.palette.primary.contrastText,
              background: theme.palette.secondary.main,
              '&:hover': {
                background: theme.palette.secondary.dark,
              }
            }}
          >
            Marcar como Completado
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OnboardingTrigger;
