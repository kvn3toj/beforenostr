import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
  Backdrop,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      aria-labelledby="base-modal-title"
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400, md: 500 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography id="base-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <IconButton onClick={onClose} aria-label="Cerrar modal">
              <Close />
            </IconButton>
          </Box>
          {children}
        </Paper>
      </Fade>
    </Modal>
  );
};

export default BaseModal;

