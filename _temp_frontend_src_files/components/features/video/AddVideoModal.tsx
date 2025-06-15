import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { extractIframeSrc } from '../../../utils/videoUtils';

interface AddVideoModalProps {
  open: boolean;
  onClose: () => void;
  onAddVideo?: (iframeCode: string) => void;
  isLoading?: boolean;
}

export const AddVideoModal = ({ 
  open, 
  onClose, 
  onAddVideo, 
  isLoading = false 
}: AddVideoModalProps) => {
  const [iframeInput, setIframeInput] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const validateIframe = (content: string): boolean => {
    if (!content.trim()) {
      return false;
    }
    
    // Verificar que contenga elementos básicos de un iframe
    const hasIframeTag = content.includes('<iframe');
    const hasSrcAttribute = content.includes('src=');
    
    return hasIframeTag && hasSrcAttribute;
  };

  const handleLoadClick = () => {
    if (!validateIframe(iframeInput)) {
      setError('Insertaste un código inválido. Por favor, verifícalo nuevamente.');
      return;
    }

    setError('');
    
    // Si hay callback onAddVideo, llamarlo
    if (onAddVideo) {
      onAddVideo(iframeInput);
    } else {
      // Por ahora, solo mostrar mensaje de éxito
      console.log('Video iframe loaded successfully:', iframeInput);
      handleClose();
    }
  };

  const handleClose = () => {
    setIframeInput('');
    setError('');
    onClose();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIframeInput(event.target.value);
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      data-testid="add-video-modal"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Añadir nuevo video
        <IconButton
          aria-label="Cerrar modal"
          onClick={handleClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            label="Añade código IFRAME aquí"
            multiline
            rows={4}
            value={iframeInput}
            onChange={handleInputChange}
            disabled={isLoading}
            fullWidth
            placeholder="<iframe src='...' width='...' height='...' frameborder='0' allowfullscreen></iframe>"
            data-testid="iframe-input"
          />

          {error && (
            <Alert severity="error" data-testid="error-message">
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={handleLoadClick}
              variant="contained"
              disabled={isLoading || !iframeInput.trim()}
              startIcon={isLoading && <CircularProgress size={20} />}
              data-testid="load-button"
              sx={{
                backgroundColor: '#FFD700', // Dorado como en el wireframe
                color: '#000',
                fontWeight: 'bold',
                px: 4,
                py: 1,
                '&:hover': {
                  backgroundColor: '#FFC107',
                },
                '&:disabled': {
                  backgroundColor: '#E0E0E0',
                  color: '#9E9E9E',
                },
              }}
            >
              {isLoading ? 'Cargando...' : 'Cargar'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}; 