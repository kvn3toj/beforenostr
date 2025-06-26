import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Avatar,
  Grid,
  useTheme,
  Fade,
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DiamondIcon from '@mui/icons-material/Diamond';

// Placeholder types - to be replaced with real types from the backend/shared types
interface JourneyData {
  id: string;
  title: string;
  inspirationalQuote: string;
  purpose: string;
  imageUrl: string;
  rewards: {
    meritos: number;
    ondas: number;
  };
  videos: { id: string; title: string }[];
}

const UPlayJourneyPortal: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { journeyId } = useParams<{ journeyId: string }>();
  const location = useLocation();

  // In a real implementation, this data would be fetched based on journeyId
  // For now, we use placeholder data mirroring the wireframe.
  // The actual playlist/journey data might be passed via location state from the dashboard.
  const journeyData: JourneyData = location.state?.journeyData || {
    id: journeyId || 'default-journey',
    title: 'La Senda del Ayni',
    inspirationalQuote: 'El universo no te da lo que pides con tus pensamientos; te da lo que pides con tus acciones.',
    purpose: 'Este viaje te sumergirá en el principio ancestral de la reciprocidad. Aprenderás a ver el mundo no como un lugar de transacciones, sino de intercambios sagrados de energía y valor.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    rewards: {
      meritos: 150,
      ondas: 80,
    },
    videos: [
        { id: 'video1', title: 'Introducción al Ayni' },
        { id: 'video2', title: 'Ayni en la Comunidad' },
    ],
  };

  const handleStartJourney = () => {
    // Navigate to the first video of the journey
    if (journeyData.videos.length > 0) {
      navigate(`/uplay/video/${journeyData.videos[0].id}`, { state: { journeyData } });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <Box
                  component="img"
                  src={journeyData.imageUrl}
                  alt={journeyData.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, letterSpacing: '-1px' }}
              >
                {journeyData.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 2 }}>
                "{journeyData.inspirationalQuote}"
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {journeyData.purpose}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Chip
                  icon={<DiamondIcon />}
                  label={`${journeyData.rewards.meritos} Mëritos`}
                  color="primary"
                  variant="filled"
                />
                <Chip
                  icon={<EmojiEventsIcon />}
                  label={`${journeyData.rewards.ondas} Öndas`}
                  color="secondary"
                  variant="filled"
                />
              </Box>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleStartJourney}
                  fullWidth
                >
                  Comenzar Viaje
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Container>
  );
};

export default UPlayJourneyPortal;
