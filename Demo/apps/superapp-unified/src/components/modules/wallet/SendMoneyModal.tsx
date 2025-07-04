import React from 'react';
import {
  TextField,
  Button,
  Box,
  Stack,
} from '@mui/material';
import BaseModal from '../../common/BaseModal';

interface SendMoneyModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (recipient: string, amount: number) => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  open,
  onClose,
  onSend,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const recipient = formData.get('recipient') as string;
    const amount = Number(formData.get('amount'));
    if (recipient && amount > 0) {
      onSend(recipient, amount);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Enviar Dinero">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="recipient"
            name="recipient"
            label="Destinatario (email o alias)"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="amount"
            name="amount"
            label="Monto"
            type="number"
            fullWidth
            variant="outlined"
            InputProps={{
              inputProps: {
                step: 'any',
                min: '0.01',
              },
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Enviar
            </Button>
          </Box>
        </Stack>
      </form>
    </BaseModal>
  );
};

export default SendMoneyModal;
