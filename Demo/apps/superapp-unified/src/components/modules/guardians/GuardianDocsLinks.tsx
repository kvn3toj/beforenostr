import React, { useState } from 'react';
import { Paper, Typography, Link, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Importo los .md como string usando ?raw
import PROMPT_GENESIS from 'NARRATIVA/00_GENESIS_UNIVERSAL/PROMPT_GENESIS_UNIVERSO_COOMUNITY.md?raw';
import LOS_12_GUARDIANES from 'NARRATIVA/02_AGENTES_GUARDIANES/LOS_12_GUARDIANES_DIGITALES.md?raw';
import PROMPT_INVOCACION from 'NARRATIVA/02_AGENTES_GUARDIANES/PROMPT_INVOCACION_GUARDIANES_UPLAY.md?raw';

const docs = [
  { title: 'Prompt Génesis Universo CoomÜnity', content: PROMPT_GENESIS },
  { title: 'Los 12 Guardianes Digitales', content: LOS_12_GUARDIANES },
  { title: 'Invocación Guardianes ÜPlay', content: PROMPT_INVOCACION },
];

const GuardianDocsLinks: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  const handleOpen = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <Paper sx={{ p: 3, minHeight: 180 }} className="guardian-card">
      <Typography variant="h5" gutterBottom>
        Documentación y Recursos
      </Typography>
      <List>
        {docs.map((doc) => (
          <ListItem key={doc.title} disablePadding>
            <ListItemText>
              <Link href="#" underline="hover" color="primary" onClick={() => handleOpen(doc.title, doc.content)}>
                {doc.title}
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {modalTitle}
          <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 15 }}>
            {modalContent}
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default GuardianDocsLinks;
