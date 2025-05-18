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
              }}
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
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