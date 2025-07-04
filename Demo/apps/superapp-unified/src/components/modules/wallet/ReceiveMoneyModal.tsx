import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import { QrCode2, ContentCopy, CheckCircle } from '@mui/icons-material';
import BaseModal from '../../common/BaseModal';

interface ReceiveMoneyModalProps {
  open: boolean;
  onClose: () => void;
  walletAddress: string;
}

export const ReceiveMoneyModal: React.FC<ReceiveMoneyModalProps> = ({
  open,
  onClose,
  walletAddress,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Recibir Fondos">
      <Stack alignItems="center" spacing={3}>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Comparte tu dirección o código QR para recibir fondos en tu billetera.
        </Typography>
        <Box
          sx={{
            p: 3,
            bgcolor: 'grey.100',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <QrCode2 sx={{ fontSize: 160 }} />
        </Box>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            bgcolor: 'background.default',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {walletAddress}
          </Typography>
          <Tooltip title={copied ? '¡Copiado!' : 'Copiar dirección'} placement="top">
            <IconButton onClick={handleCopy}>
              {copied ? <CheckCircle color="success" /> : <ContentCopy />}
            </IconButton>
          </Tooltip>
        </Paper>
        <Button onClick={onClose} variant="contained" fullWidth>
          Cerrar
        </Button>
      </Stack>
    </BaseModal>
  );
};

export default ReceiveMoneyModal;
