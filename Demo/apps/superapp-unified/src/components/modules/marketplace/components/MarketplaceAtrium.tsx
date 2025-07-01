import React from 'react';
import { Box, Typography, Button, Stack, alpha, useTheme } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { AutoAwesome, DoubleArrow } from '@mui/icons-material';

interface MarketplaceAtriumProps {
  onEnter: () => void;
}

const MarketplaceAtrium: React.FC<MarketplaceAtriumProps> = ({ onEnter }) => {
  const theme = useTheme();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50 },
    },
  };

  const glowAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        background: `radial-gradient(ellipse at 50% 50%, ${alpha(
          theme.palette.primary.dark,
          0.2
        )} 0%, transparent 70%)`,
        overflow: 'hidden',
        textAlign: 'center',
        px: 2,
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Stack spacing={4} alignItems="center">
          <motion.div animate={glowAnimation}>
            <AutoAwesome sx={{ fontSize: 60, color: 'primary.main' }} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                textShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`,
              }}
            >
              Gamified Match Place
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="h6" color="text.secondary" maxWidth="600px">
              Estás entrando a un ecosistema de intercambio basado en la
              Reciprocidad (Reciprocidad) y el Bien Común. Cada producto y servicio aquí
              es una semilla para un mundo más consciente.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              variant="contained"
              size="large"
              onClick={onEnter}
              endIcon={<DoubleArrow />}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              Explorar el Intercambio Consciente
            </Button>
          </motion.div>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default MarketplaceAtrium;
