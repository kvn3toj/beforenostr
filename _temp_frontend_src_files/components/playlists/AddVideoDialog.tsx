import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { extractIframeSrc } from '../../utils/videoUtils';

interface AddVideoDialogProps {
  open: boolean;
  onClose: () => void;
  onAddVideo: (iframeCode: string) => void;
  isLoading: boolean;
}

export const AddVideoDialog = ({ open, onClose, onAddVideo, isLoading }: AddVideoDialogProps) => {
  const [iframeInput, setIframeInput] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleLoadClick = () => {
    if (!iframeInput.includes('<iframe') || !iframeInput.includes('src=')) {
      setError('Invalid iframe code. Please paste a valid iframe embed code.');
      return;
    }

    setError('');
    setPreviewContent(iframeInput);
    setIsPreviewMode(true);
  };

  const handleSaveClick = () => {
    onAddVideo(iframeInput);
  };

  const handleClose = () => {
    setIframeInput('');
    setPreviewContent('');
    setIsPreviewMode(false);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Video to Playlist</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Paste iframe code"
            multiline
            rows={4}
            value={iframeInput}
            onChange={(e) => setIframeInput(e.target.value)}
            disabled={isLoading || isPreviewMode}
            fullWidth
            placeholder="<iframe src='...' width='...' height='...' frameborder='0' allowfullscreen></iframe>"
          />

          {error && <Alert severity="error">{error}</Alert>}

          {previewContent && (
            <Box
              sx={{
                width: '100%',
                aspectRatio: '16/9',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
              }}
            >
              {(() => {
                const src = extractIframeSrc(previewContent);
                if (src) {
                  return (
                    <iframe
                      src={src}
                      title={t('video_preview')}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 0 }}
                    />
                  );
                }
                return (
                  <Box sx={{ color: 'white', textAlign: 'center', width: '100%' }}>
                    {t('video_content_not_available')}
                  </Box>
                );
              })()}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={isPreviewMode ? handleSaveClick : handleLoadClick}
          variant="contained"
          disabled={isLoading || !iframeInput}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? 'Saving...' : isPreviewMode ? 'Save' : 'Load'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 