import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Stack,
  CircularProgress,
  Rating,
  Alert,
} from '@mui/material';
import { Close, StarBorder } from '@mui/icons-material';
import { useMatchReview } from '@/hooks/useMatchReview';
import { useSubmitMatchReview } from '@/hooks/useSubmitMatchReview';
import type { Review } from '../../../../types/marketplace';

interface MarketplaceReviewModalProps {
  open: boolean;
  onClose: () => void;
  matchId: string;
}

export const MarketplaceReviewModal: React.FC<MarketplaceReviewModalProps> = ({ open, onClose, matchId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  // Fetch existing review
  const { review, isLoading: isLoadingReview, error: reviewError } = useMatchReview(matchId);

  // Hook for submitting the review
  const { submitReview, isPending: isSubmitting, error: submitError } = useSubmitMatchReview();

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    } else {
      // Reset form if there's no review or when modal opens for a new match
      setRating(null);
      setComment('');
    }
  }, [review]);

  const handleSubmit = () => {
    if (rating !== null) {
      submitReview({ matchId, rating, comment })
        .then(() => {
          onClose();
        })
        .catch(console.error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="review-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="h2">Calificar Intercambio</Typography>
        <IconButton aria-label="Cerrar" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoadingReview ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : reviewError ? (
          <Alert severity="error">Error al cargar la calificación existente.</Alert>
        ) : (
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Typography component="legend">Tu calificación:</Typography>
            <Rating
              name="item-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              emptyIcon={<StarBorder fontSize="inherit" />}
              size="large"
            />
            <TextField
              label="Comentario (opcional)"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              fullWidth
              placeholder="Describe tu experiencia con el intercambio..."
            />
          </Stack>
        )}
        {submitError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al enviar la calificación: {submitError.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={rating === null || isSubmitting || isLoadingReview}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Enviar Calificación'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarketplaceReviewModal;
