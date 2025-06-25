import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Button,
  Chip,
  IconButton,
  Divider,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  ExpandMore,
  Reply,
  MoreVert,
  Flag,
  Verified,
  CheckCircle,
  StarBorder as Star,
  Send,
  Close,
  Image as ImageIcon,
} from '@mui/icons-material';
import { Review } from '../../../../types/marketplace';
import apiService from '../../../../lib/api-service';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface ProductReviewsProps {
  reviews: Review[];
}

interface ReviewItemProps {
  review: Review;
  onHelpfulVote: (reviewId: string, helpful: boolean) => void;
}

interface WriteReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: any) => void;
  isSubmitting: boolean;
}

const WriteReviewDialog: React.FC<WriteReviewDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [rating, setRating] = useState<number | null>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [aspectRatings, setAspectRatings] = useState({
    communication: 0,
    quality: 0,
    delivery: 0,
    value: 0,
  });

  const handleSubmit = () => {
    if (!rating || !comment.trim()) return;

    onSubmit({
      rating,
      title: title.trim(),
      comment: comment.trim(),
      aspects: aspectRatings,
    });

    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
    setAspectRatings({
      communication: 0,
      quality: 0,
      delivery: 0,
      value: 0,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Escribir Reseña</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Calificación general */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Calificación general *
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>

        {/* Título opcional */}
        <TextField
          fullWidth
          label="Título de la reseña (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
          placeholder="Resumen de tu experiencia..."
        />

        {/* Comentario */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Tu reseña *"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 3 }}
          placeholder="Comparte tu experiencia con este servicio..."
          required
        />

        {/* Calificaciones por aspecto */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Califica aspectos específicos
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(aspectRatings).map(([aspect, value]) => (
              <Grid item xs={12} sm={6} key={aspect}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {aspect === 'communication'
                      ? 'Comunicación'
                      : aspect === 'quality'
                        ? 'Calidad'
                        : aspect === 'delivery'
                          ? 'Cumplimiento'
                          : 'Relación calidad-precio'}
                  </Typography>
                  <Rating
                    value={value}
                    onChange={(event, newValue) =>
                      setAspectRatings((prev) => ({
                        ...prev,
                        [aspect]: newValue || 0,
                      }))
                    }
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Alert severity="info">
          Tu reseña ayudará a otros usuarios a tomar mejores decisiones. Sé
          honesto y constructivo en tus comentarios.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!rating || !comment.trim() || isSubmitting}
          startIcon={<Send />}
        >
          Publicar Reseña
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onHelpfulVote }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [userVote, setUserVote] = useState<'helpful' | 'not-helpful' | null>(
    review.userVote || null
  );

  const handleVote = (helpful: boolean) => {
    const newVote = helpful ? 'helpful' : 'not-helpful';
    if (userVote === newVote) {
      setUserVote(null);
    } else {
      setUserVote(newVote);
    }
    onHelpfulVote(review.id, helpful);
  };

  const shouldTruncate = review.comment.length > 300;
  const displayComment =
    shouldTruncate && !showFullComment
      ? review.comment.substring(0, 300) + '...'
      : review.comment;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      {/* Header de la reseña */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            review.reviewer.verified ? (
              <CheckCircle
                sx={{
                  color: '#4CAF50',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  fontSize: 16,
                }}
              />
            ) : null
          }
        >
          <Avatar src={review.reviewer.avatar} sx={{ width: 48, height: 48 }} />
        </Badge>

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {review.reviewer.name}
                </Typography>
                {review.reviewer.verified && (
                  <Tooltip title="Usuario verificado">
                    <Verified sx={{ color: '#1976d2', fontSize: 16 }} />
                  </Tooltip>
                )}
                {review.verifiedPurchase && (
                  <Chip
                    label="Compra verificada"
                    size="small"
                    color="success"
                    sx={{ fontSize: '10px', height: 18 }}
                  />
                )}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {review.createdAt.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
            </Box>

            <IconButton size="small">
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>

          {/* Rating principal */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {review.rating}/5
            </Typography>
          </Box>

          {/* Título de la reseña */}
          {review.title && (
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              {review.title}
            </Typography>
          )}

          {/* Comentario */}
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
            {displayComment}
            {shouldTruncate && (
              <Button
                size="small"
                onClick={() => setShowFullComment(!showFullComment)}
                sx={{ ml: 1, p: 0, minWidth: 'auto' }}
              >
                {showFullComment ? 'Ver menos' : 'Ver más'}
              </Button>
            )}
          </Typography>

          {/* Calificaciones por aspecto */}
          {review.aspects && (
            <Accordion elevation={0} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  px: 0,
                  '& .MuiAccordionSummary-content': { margin: '8px 0' },
                }}
              >
                <Typography variant="body2" color="primary">
                  Ver calificaciones detalladas
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0 }}>
                <Grid container spacing={2}>
                  {Object.entries(review.aspects).map(([aspect, rating]) => (
                    <Grid item xs={6} key={aspect}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ minWidth: 80, textTransform: 'capitalize' }}
                        >
                          {aspect === 'communication'
                            ? 'Comunicación'
                            : aspect === 'quality'
                              ? 'Calidad'
                              : aspect === 'delivery'
                                ? 'Cumplimiento'
                                : 'Precio-Valor'}
                        </Typography>
                        <Rating value={rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {rating}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Respuesta del vendedor */}
          {review.sellerResponse && (
            <Box
              sx={{
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                p: 2,
                border: '1px solid #e9ecef',
                mb: 2,
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <Reply sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" fontWeight="bold">
                  Respuesta del vendedor
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  •{' '}
                  {review.sellerResponse.createdAt.toLocaleDateString('es-ES')}
                </Typography>
              </Box>
              <Typography variant="body2">
                {review.sellerResponse.comment}
              </Typography>
            </Box>
          )}

          {/* Acciones de la reseña */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<ThumbUp />}
                onClick={() => handleVote(true)}
                variant={userVote === 'helpful' ? 'contained' : 'outlined'}
                color={userVote === 'helpful' ? 'primary' : 'inherit'}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                {review.helpful}
              </Button>
              <Button
                size="small"
                startIcon={<ThumbDown />}
                onClick={() => handleVote(false)}
                variant={userVote === 'not-helpful' ? 'contained' : 'outlined'}
                color={userVote === 'not-helpful' ? 'error' : 'inherit'}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                {review.notHelpful}
              </Button>
            </Box>

            <Button
              size="small"
              startIcon={<Flag />}
              color="inherit"
              sx={{ minWidth: 'auto' }}
            >
              Reportar
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful'
  >('newest');
  const [showAll, setShowAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [localReviews, setLocalReviews] = useState(reviews);

  const handleHelpfulVote = (reviewId: string, helpful: boolean) => {
    // Aquí se implementaría la lógica para votar
    console.log('Vote:', reviewId, helpful);
  };

  const handleWriteReview = async (reviewData: any) => {
    setIsSubmitting(true);
    try {
      // Ajusta la URL si el endpoint real es diferente
      const response = await apiService.post('/marketplace/reviews', reviewData);
      setSnackbar({ open: true, message: '¡Reseña enviada! Gracias por contribuir al Bien Común y practicar el Ayni.', severity: 'success' });
      setWriteReviewOpen(false);
      // Refrescar la lista localmente (idealmente, refetch desde backend)
      const newId = (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data)
        ? response.data.id
        : Date.now();
      setLocalReviews(prev => [{ ...reviewData, id: newId }, ...prev]);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al enviar la reseña. Intenta de nuevo.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ordenar reseñas
  const sortedReviews = [...localReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  if (localReviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Star sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Aún no hay reseñas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sé el primero en compartir tu experiencia con este servicio
        </Typography>
        <Button
          variant="contained"
          startIcon={<Star />}
          onClick={() => setWriteReviewOpen(true)}
        >
          Escribir Primera Reseña
        </Button>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header con botones de acción */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Reseñas de clientes ({localReviews.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Star />}
          onClick={() => setWriteReviewOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Escribir Reseña
        </Button>
      </Box>

      {/* Filtros de ordenamiento */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Ordenar por:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {[
            { value: 'newest', label: 'Más recientes' },
            { value: 'helpful', label: 'Más útiles' },
            { value: 'rating-high', label: 'Mayor calificación' },
            { value: 'rating-low', label: 'Menor calificación' },
          ].map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => setSortBy(option.value as any)}
              variant={sortBy === option.value ? 'filled' : 'outlined'}
              color={sortBy === option.value ? 'primary' : 'default'}
              size="small"
              clickable
            />
          ))}
        </Stack>
      </Box>

      {/* Lista de reseñas */}
      <Box>
        {displayedReviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            onHelpfulVote={handleHelpfulVote}
          />
        ))}
      </Box>

      {/* Botón ver más/menos */}
      {localReviews.length > 3 && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAll(!showAll)}
            sx={{ borderRadius: 2 }}
          >
            {showAll
              ? 'Ver menos reseñas'
              : `Ver todas las reseñas (${localReviews.length})`}
          </Button>
        </Box>
      )}

      {/* Dialog para escribir reseña */}
      <WriteReviewDialog
        open={writeReviewOpen}
        onClose={() => setWriteReviewOpen(false)}
        onSubmit={handleWriteReview}
        isSubmitting={isSubmitting}
      />
      {/* Snackbar para feedback visual */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};
