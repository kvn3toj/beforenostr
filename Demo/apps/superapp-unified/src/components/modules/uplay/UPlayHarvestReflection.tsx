import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  useTheme,
  Fade,
  Grow,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';

const UPlayHarvestReflection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Datos del viaje, pasados desde el reproductor
  const { journeyData, videoId } = location.state || {};

  const handleSaveReflection = () => {
    setIsSaving(true);
    console.log('[ZENO] Cosechando pensamiento:', {
      journeyId: journeyData?.id,
      videoId,
      reflection,
    });
    // Simular guardado en backend
    setTimeout(() => {
      setIsSaving(false);
      // Navegar al siguiente paso, por ejemplo, la pantalla social o de vuelta al portal
      navigate(`/uplay/journey/${journeyData?.id}`);
    }, 1500);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5, display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          background: `linear-gradient(160deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          width: '100%',
        }}
      >
        <Fade in={true} timeout={1200}>
          <Box textAlign="center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <LightbulbIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                La Cosecha
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                ¿Qué semilla ha plantado este conocimiento en ti?
              </Typography>
            </motion.div>

            <Grow in={true} timeout={1500}>
              <TextField
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                placeholder="Escribe aquí tu reflexión, una idea, una pregunta o una conexión que hayas sentido..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Grow>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                variant="contained"
                size="large"
                color="primary"
                endIcon={isSaving ? <SaveIcon /> : <SendIcon />}
                onClick={handleSaveReflection}
                disabled={!reflection || isSaving}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                }}
              >
                {isSaving ? 'Anclando Semilla...' : 'Anclar mi Semilla'}
              </Button>
            </motion.div>
          </Box>
        </Fade>
      </Paper>
    </Container>
  );
};

export default UPlayHarvestReflection;
