import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          autoFocus
        >
          {isLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 