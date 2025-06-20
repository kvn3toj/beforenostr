import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Divider,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart,
  Message,
  VideoCall,
  Phone,
  Favorite,
  FavoriteBorder,
  Share,
  Flag,
  Schedule,
  Security,
  CheckCircle,
  Send,
  Close,
} from '@mui/icons-material';
import { Product } from '../../../../types/marketplace';

interface ProductActionsProps {
  product: Product;
  selectedDeliveryOption: string;
  onDeliveryOptionChange: (optionId: string) => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  selectedDeliveryOption,
  onDeliveryOptionChange,
  isFavorited,
  onToggleFavorite,
}) => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedDelivery = product.deliveryOptions.find(
    (option) => option.id === selectedDeliveryOption
  );

  const totalPrice = product.price + (selectedDelivery?.price || 0);

  const formatPrice = (price: number, currency: string) => {
    const safePrice = price || 0;
    if (currency === 'ü' || currency === 'Lükas' || currency === 'LUKAS') {
      return `ü ${safePrice.toLocaleString()}`;
    }
    return `$${safePrice.toLocaleString()}`;
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      // Simular proceso de compra
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPurchaseDialogOpen(false);
      // Aquí iría la lógica real de compra
      alert('¡Solicitud enviada! El vendedor se pondrá en contacto contigo.');
    } catch (error) {
      console.error('Error en la compra:', error);
      alert('Error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactSeller = async () => {
    if (!contactMessage.trim()) return;

    setIsProcessing(true);
    try {
      // Simular envío de mensaje
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContactDialogOpen(false);
      setContactMessage('');
      alert('Mensaje enviado al vendedor.');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar mensaje. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason || !reportDetails.trim()) return;

    setIsProcessing(true);
    try {
      // Simular envío de reporte
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReportDialogOpen(false);
      setReportReason('');
      setReportDetails('');
      alert('Reporte enviado. Gracias por tu retroalimentación.');
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      alert('Error al enviar reporte. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Usuario canceló o error
        if (error.name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          alert('Enlace copiado al portapapeles');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <>
      {/* Selector de opciones de entrega */}
      {product.deliveryOptions.length > 1 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Selecciona modalidad
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedDeliveryOption}
              onChange={(e) => onDeliveryOptionChange(e.target.value)}
              displayEmpty
            >
              {product.deliveryOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.description} • {option.estimatedTime}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="bold">
                      {option.price > 0
                        ? `+${formatPrice(option.price, product.currency)}`
                        : 'Gratis'}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      )}

      {/* Resumen de precio */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body1">Precio base</Typography>
          <Typography variant="body1">
            {formatPrice(product.price, product.currency)}
          </Typography>
        </Box>

        {selectedDelivery && selectedDelivery.price > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {selectedDelivery.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +{formatPrice(selectedDelivery.price, product.currency)}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {formatPrice(totalPrice, product.currency)}
          </Typography>
        </Box>
      </Paper>

      {/* Botones de acción principales */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* Botón principal de solicitar/comprar */}
        <Button
          variant="contained"
          size="large"
          startIcon={<ShoppingCart />}
          onClick={() => setPurchaseDialogOpen(true)}
          disabled={!product.availability?.available}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
            },
          }}
        >
          {product.type === 'service' ? 'Solicitar Servicio' : 'Comprar Ahora'}
        </Button>

        {/* Botón de contactar */}
        <Button
          variant="outlined"
          size="large"
          startIcon={<Message />}
          onClick={() => setContactDialogOpen(true)}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Contactar Vendedor
        </Button>
      </Stack>

      {/* Botones secundarios */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* Botones de método de contacto */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {product.seller.contactMethods
            .filter((method) => method.available)
            .slice(0, 3)
            .map((method) => (
              <Tooltip key={method.type} title={method.label}>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                  }}
                  onClick={() => {
                    if (method.type === 'message') {
                      setContactDialogOpen(true);
                    }
                    // Aquí se implementarían otros métodos de contacto
                  }}
                >
                  {method.type === 'message' && <Message fontSize="small" />}
                  {method.type === 'video' && <VideoCall fontSize="small" />}
                  {method.type === 'call' && <Phone fontSize="small" />}
                </IconButton>
              </Tooltip>
            ))}
        </Box>

        {/* Botones de acción adicionales */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isFavorited ? 'Quitar de favoritos' : 'Favorito'}>
            <IconButton
              onClick={onToggleFavorite}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
              }}
            >
              {isFavorited ? (
                <Favorite sx={{ color: '#FF4444' }} />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Compartir">
            <IconButton
              onClick={handleShare}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reportar">
            <IconButton
              onClick={() => setReportDialogOpen(true)}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
              }}
            >
              <Flag />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Información de garantía */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Security color="primary" fontSize="small" />
          <Typography variant="body2" fontWeight="bold">
            Compra protegida
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Tu dinero está protegido hasta que recibas el servicio completo.
        </Typography>
      </Box>

      {/* Dialog de compra/solicitud */}
      <Dialog
        open={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">
              {product.type === 'service'
                ? 'Solicitar Servicio'
                : 'Confirmar Compra'}
            </Typography>
            <IconButton onClick={() => setPurchaseDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Resumen del producto */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              {product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vendido por {product.seller?.name || 'Usuario'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body2">Precio</Typography>
              <Typography variant="body2">
                {formatPrice(product.price, product.currency)}
              </Typography>
            </Box>

            {selectedDelivery && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="body2">{selectedDelivery.name}</Typography>
                <Typography variant="body2">
                  {selectedDelivery.price > 0
                    ? formatPrice(selectedDelivery.price, product.currency)
                    : 'Gratis'}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {formatPrice(totalPrice, product.currency)}
              </Typography>
            </Box>
          </Paper>

          {/* Campos adicionales */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Mensaje adicional (opcional)"
            placeholder="Describe tus necesidades específicas o haz preguntas al vendedor..."
            sx={{ mb: 2 }}
          />

          <Alert severity="info" sx={{ mb: 2 }}>
            Tu solicitud será enviada al vendedor. El pago se procesará una vez
            que ambos confirmen los detalles del proyecto.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setPurchaseDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handlePurchase}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Send />}
            sx={{ minWidth: 120 }}
          >
            {isProcessing ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de contacto */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Contactar Vendedor</Typography>
            <IconButton onClick={() => setContactDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Contactando a <strong>{product.seller?.name || 'Usuario'}</strong>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Responde en {product.seller.responseTime}
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Tu mensaje"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder="Hola! Estoy interesado en tu servicio..."
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setContactDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleContactSeller}
            disabled={!contactMessage.trim() || isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Send />}
            sx={{ minWidth: 120 }}
          >
            {isProcessing ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de reporte */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Reportar Producto</Typography>
            <IconButton onClick={() => setReportDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Motivo del reporte</InputLabel>
            <Select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              label="Motivo del reporte"
            >
              <MenuItem value="spam">Spam o contenido engañoso</MenuItem>
              <MenuItem value="inappropriate">Contenido inapropiado</MenuItem>
              <MenuItem value="fraud">Posible fraude</MenuItem>
              <MenuItem value="copyright">
                Violación de derechos de autor
              </MenuItem>
              <MenuItem value="other">Otro</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Detalles adicionales"
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            placeholder="Proporciona más detalles sobre el problema..."
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setReportDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReport}
            disabled={!reportReason || !reportDetails.trim() || isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Flag />}
            sx={{ minWidth: 120 }}
          >
            {isProcessing ? 'Enviando...' : 'Enviar Reporte'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
