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
} from '@mui/material';
import {
  Close,
  Air,
  Public,
  FavoriteBorder,
  Spa,
  WbSunny,
} from '@mui/icons-material';

// Interfaz para las propiedades del modal
export interface MarketplaceReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => void;
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
  onSubmit,
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

  const handleSubmit = () => {
    onSubmit({
      resonance,
      clarity,
      reciprocity,
      connection,
      publicFeedback,
      privateFeedback: sendPrivateNote ? privateFeedback : undefined,
    });
    onClose();
  };

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
            icon={<FavoriteBorder sx={{ color: coomunityColors.fuego }} />}
            value={connection}
            onChange={setConnection}
            color={coomunityColors.fuego}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Palabras que Nutren (Éter ✨)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Comparte tu experiencia pública"
            placeholder="¿Qué fue lo más valioso? Tu perspectiva es un regalo que fortalece a toda la CoomÜnity."
            value={publicFeedback}
            onChange={(e) => setPublicFeedback(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
                },
              },
            }}
          />
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={sendPrivateNote}
                onChange={(e) => setSendPrivateNote(e.target.checked)}
              />
            }
            label="Deseo enviar una nota privada y constructiva al Emprendedor."
          />
          {sendPrivateNote && (
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              label="Nota para el Corazón"
              placeholder="Este mensaje será visible solo para el Emprendedor, para ayudarle a crecer."
              value={privateFeedback}
              onChange={(e) => setPrivateFeedback(e.target.value)}
              sx={{
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.secondary.main,
                    boxShadow: `0 0 0 2px ${theme.palette.secondary.main}30`,
                  },
                },
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, background: 'rgba(240, 240, 240, 0.5)' }}>
        <Button onClick={onClose} color="secondary" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<Spa />}
          sx={{
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
            boxShadow: theme.shadows[3],
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 20px -8px ${theme.palette.primary.main}80`,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            },
          }}
        >
          Sellar el Ciclo
        </Button>
      </DialogActions>
    </Dialog>
  );
};
