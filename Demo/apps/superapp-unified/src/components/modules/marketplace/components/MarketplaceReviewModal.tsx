import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Rating,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  useTheme,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Air,
  Public,
  FavoriteBorder,
  Spa,
  WbSunny,
} from '@mui/icons-material';
import { useMatchReview } from "@/hooks/useMatchReview";
import { useSubmitMatchReview } from "@/hooks/useSubmitMatchReview";

// Interfaz para las propiedades del modal
export interface MarketplaceReviewModalProps {
  open: boolean;
  onClose: () => void;
  matchId: string;
  productName: string;
  sellerName: string;
}

// Interfaz para los datos de la reseña
export interface ReviewData {
  resonance: number;
  clarity: number;
  reciprocity: number;
  connection: number;
  publicFeedback: string;
  privateFeedback?: string;
}

const coomunityColors = {
  aire: '#81D4FA', // Azul claro para Claridad (Aire)
  tierra: '#A5D6A7', // Verde para Reciprocidad (Tierra)
  fuego: '#FFAB91', // Naranja para Conexión (Fuego)
  agua: '#90CAF9', // Azul agua para Resonancia
};

// Componente para una dimensión de Ayni
const AyniDimension: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (newValue: number) => void;
  color: string;
}> = ({ label, icon, value, onChange, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ minWidth: 150, display: 'flex', alignItems: 'center' }}>
      {icon}
      <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
    <Rating
      value={value}
      onChange={(_, newValue) => onChange(newValue || 0)}
      sx={{
        '& .MuiRating-iconFilled': {
          color,
          transition: 'transform 0.2s ease-in-out',
        },
        '& .MuiRating-iconHover': {
          color,
          transform: 'scale(1.2)',
        },
      }}
    />
  </Box>
);

export const MarketplaceReviewModal: React.FC<MarketplaceReviewModalProps> = ({
  open,
  onClose,
  matchId,
  productName,
  sellerName,
}) => {
  const theme = useTheme();
  const [resonance, setResonance] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [reciprocity, setReciprocity] = useState(0);
  const [connection, setConnection] = useState(0);
  const [publicFeedback, setPublicFeedback] = useState('');
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [sendPrivateNote, setSendPrivateNote] = useState(false);

  const { data: reviewData, isLoading, isError } = useMatchReview(matchId);
  const mutation = useSubmitMatchReview(matchId);

  const handleSubmit = () => {
    mutation.mutate({
      resonance,
      clarity,
      reciprocity,
      connection,
      publicFeedback,
      privateFeedback: sendPrivateNote ? privateFeedback : undefined,
    });
    onClose();
  };

  const alreadyReviewed = !!reviewData;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: `0 8px 40px -12px ${theme.palette.primary.main}40`,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      }}
      TransitionProps={{ timeout: 400 }}
    >
      <DialogTitle sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Honrando Nuestro Intercambio
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Tu experiencia con "{productName}" de{' '}
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                {sellerName}
              </Box>
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ '&:hover': { transform: 'rotate(90deg)', transition: 'transform 0.3s ease' }}}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3, border: 'none' }}>
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">Cargando estado de reseña...</Typography>
        ) : isError ? (
          <Typography variant="body2" color="error">Error al cargar la reseña.</Typography>
        ) : alreadyReviewed ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              ¡Gracias por compartir tu Ayni!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ya has calificado esta experiencia. Puedes ver tu reseña en el historial.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1, color: coomunityColors.agua, fontWeight: 600 }}
              >
                <WbSunny /> Resonancia General (Agua 💧)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ¿Cuál fue tu sintonía general con esta experiencia?
              </Typography>
              <Rating
                value={resonance}
                onChange={(_, newValue) => setResonance(newValue || 0)}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: coomunityColors.agua,
                    transition: 'transform 0.2s ease-in-out',
                  },
                  '& .MuiRating-iconHover': {
                    color: coomunityColors.agua,
                    transform: 'scale(1.2)',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Dimensiones del Ayni
              </Typography>
              <AyniDimension
                label="Claridad"
                icon={<Air sx={{ color: coomunityColors.aire }} />}
                value={clarity}
                onChange={setClarity}
                color={coomunityColors.aire}
              />
              <AyniDimension
                label="Reciprocidad"
                icon={<Public sx={{ color: coomunityColors.tierra }} />}
                value={reciprocity}
                onChange={setReciprocity}
                color={coomunityColors.tierra}
              />
              <AyniDimension
                label="Conexión"
                icon={<Spa sx={{ color: coomunityColors.fuego }} />}
                value={connection}
                onChange={setConnection}
                color={coomunityColors.fuego}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Feedback Público
              </Typography>
              <TextField
                label="¿Qué te gustaría compartir públicamente sobre esta experiencia?"
                multiline
                minRows={3}
                fullWidth
                value={publicFeedback}
                onChange={e => setPublicFeedback(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendPrivateNote}
                    onChange={e => setSendPrivateNote(e.target.checked)}
                  />
                }
                label="Enviar también una nota privada al vendedor"
              />
              {sendPrivateNote && (
                <TextField
                  label="Nota privada (solo el vendedor la verá)"
                  multiline
                  minRows={2}
                  fullWidth
                  value={privateFeedback}
                  onChange={e => setPrivateFeedback(e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          </>
        )}
      </DialogContent>
      {!alreadyReviewed && !isLoading && !isError && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={mutation.isPending}
            sx={{
              fontFamily: "'Baloo 2', cursive",
              borderRadius: '20px',
              padding: '10px 30px',
            }}
          >
            {mutation.isPending ? <CircularProgress size={24} /> : 'Enviar Valoración'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
