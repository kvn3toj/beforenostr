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
import { useAnalytics } from '../../hooks/useAnalytics';
import React from 'react';

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
  
  // Initialize analytics tracking
  const { trackItemCreationFunnel, trackError } = useAnalytics();

  // Track funnel start when dialog opens
  React.useEffect(() => {
    if (open && !isPreviewMode) {
      trackItemCreationFunnel('ITEM_CREATION_STARTED', {
        itemType: 'video',
        source: 'add_video_dialog',
        timestamp: new Date().toISOString()
      });
    }
  }, [open, isPreviewMode, trackItemCreationFunnel]);

  // Track URL input
  React.useEffect(() => {
    if (iframeInput && iframeInput.length > 20) { // Basic URL length check
      trackItemCreationFunnel('ITEM_URL_ADDED', {
        urlLength: iframeInput.length,
        hasIframe: iframeInput.includes('<iframe'),
        hasYoutube: iframeInput.includes('youtube'),
        hasVimeo: iframeInput.includes('vimeo')
      });
    }
  }, [iframeInput, trackItemCreationFunnel]);

  const handleLoadClick = () => {
    try {
      if (!iframeInput.includes('<iframe') || !iframeInput.includes('src=')) {
        setError('Invalid iframe code. Please paste a valid iframe embed code.');
        trackError('Invalid iframe code provided', 'AddVideoDialog.handleLoadClick');
        return;
      }

      setError('');
      setPreviewContent(iframeInput);
      setIsPreviewMode(true);
      
      // Track successful form filling
      trackItemCreationFunnel('ITEM_FORM_FILLED', {
        iframeValid: true,
        hasPreview: true,
        videoUrl: extractIframeSrc(iframeInput) || 'unknown'
      });
    } catch (error) {
      trackItemCreationFunnel('ITEM_CREATION_FAILED', {
        error: error instanceof Error ? error.message : 'Unknown error during load',
        step: 'load_preview'
      });
      trackError(
        error instanceof Error ? error.message : 'Load preview error',
        'AddVideoDialog.handleLoadClick'
      );
    }
  };

  const handleSaveClick = () => {
    try {
      // Track save attempt
      trackItemCreationFunnel('ITEM_CREATION_SUCCESS', {
        videoUrl: extractIframeSrc(iframeInput) || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      onAddVideo(iframeInput);
    } catch (error) {
      trackItemCreationFunnel('ITEM_CREATION_FAILED', {
        error: error instanceof Error ? error.message : 'Unknown error during save',
        step: 'save_video'
      });
      trackError(
        error instanceof Error ? error.message : 'Save video error',
        'AddVideoDialog.handleSaveClick'
      );
    }
  };

  const handleClose = () => {
    // Track dialog close (potential abandonment)
    if (iframeInput && !isPreviewMode) {
      trackItemCreationFunnel('ITEM_CREATION_FAILED', {
        error: 'User closed dialog before completion',
        step: 'dialog_closed',
        abandonment: true
      });
    }
    
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