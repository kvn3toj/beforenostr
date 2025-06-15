import React from 'react';
import { Box, Typography, Button, TextField, Paper, CircularProgress, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { MeritAction } from '../../pages/NostrDemoPage'; // Importar el tipo MeritAction

interface NostrFormsProps {
  privateKey: Uint8Array | null;
  isReadyToPublish: boolean;

  // Note State & Handlers
  noteContent: string;
  setNoteContent: (content: string) => void;
  isPublishing: boolean;
  handlePublishNote: () => Promise<void>;

  // Reply State & Handlers
  replyToEventId: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  isReplying: boolean;
  handleReply: () => Promise<void>;
  setReplyToEventId: (id: string | null) => void;

  // Ünits State & Handlers
  recipientPubkey: string;
  setRecipientPubkey: (pubkey: string) => void;
  unitAmount: string;
  setUnitAmount: (amount: string) => void;
  unitMemo: string;
  setUnitMemo: (memo: string) => void;
  isSendingUnits: boolean;
  handleSendUnits: () => Promise<void>;

  // Merits State & Handlers
  meritRecipientPubkey: string;
  setMeritRecipientPubkey: (pubkey: string) => void;
  meritAmount: string;
  setMeritAmount: (amount: string) => void;
  meritType: string;
  setMeritType: (type: string) => void;
  meritAction: MeritAction;
  setMeritAction: (action: MeritAction) => void;
  isSendingMerits: boolean;
  handleSendMerits: () => Promise<void>;

  // Mundo State & Handlers
  mundoDTag: string;
  setMundoDTag: (dTag: string) => void;
  mundoTitle: string;
  setMundoTitle: (title: string) => void;
  mundoDescription: string;
  setMundoDescription: (description: string) => void;
  isPublishingMundo: boolean;
  handlePublishMundo: () => Promise<void>;
}

const NostrForms: React.FC<NostrFormsProps> = ({
  privateKey,
  isReadyToPublish,
  noteContent,
  setNoteContent,
  isPublishing,
  handlePublishNote,
  replyToEventId,
  replyContent,
  setReplyContent,
  isReplying,
  handleReply,
  setReplyToEventId,
  recipientPubkey,
  setRecipientPubkey,
  unitAmount,
  setUnitAmount,
  unitMemo,
  setUnitMemo,
  isSendingUnits,
  handleSendUnits,
  meritRecipientPubkey,
  setMeritRecipientPubkey,
  meritAmount,
  setMeritAmount,
  meritType,
  setMeritType,
  meritAction,
  setMeritAction,
  isSendingMerits,
  handleSendMerits,
  mundoDTag,
  setMundoDTag,
  mundoTitle,
  setMundoTitle,
  mundoDescription,
  setMundoDescription,
  isPublishingMundo,
  handlePublishMundo,
}) => {
  return (
    <>
      {/* Formulario de Nota */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Publicar Nota
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Escribe tu nota aquí..."
          disabled={!privateKey || isPublishing || !isReadyToPublish}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handlePublishNote}
          disabled={!privateKey || !noteContent.trim() || isPublishing || !isReadyToPublish}
          sx={{ mt: 2 }}
        >
          {isPublishing ? <CircularProgress size={24} /> : 'Publicar Nota'}
        </Button>
      </Paper>

      {/* Formulario de Respuesta */}
      {replyToEventId && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Responder a Nota
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            disabled={!privateKey || isReplying || !isReadyToPublish}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleReply}
              disabled={!privateKey || !replyContent.trim() || isReplying || !isReadyToPublish}
            >
              {isReplying ? <CircularProgress size={24} /> : 'Enviar Respuesta'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setReplyToEventId(null);
                setReplyContent('');
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Formulario Enviar Ünits */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Enviar Ünits
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Clave Pública del Destinatario"
            value={recipientPubkey}
            onChange={(e) => setRecipientPubkey(e.target.value)}
            disabled={!privateKey || isSendingUnits || !isReadyToPublish}
            placeholder="npub..."
          />
          <TextField
            fullWidth
            label="Cantidad de Ünits"
            type="number"
            value={unitAmount}
            onChange={(e) => setUnitAmount(e.target.value)}
            disabled={!privateKey || isSendingUnits || !isReadyToPublish}
            inputProps={{ min: "0", step: "0.01" }}
          />
          <TextField
            fullWidth
            label="Memo (opcional)"
            value={unitMemo}
            onChange={(e) => setUnitMemo(e.target.value)}
            disabled={!privateKey || isSendingUnits || !isReadyToPublish}
            placeholder="Mensaje opcional..."
          />
          <Button
            variant="contained"
            onClick={handleSendUnits}
            disabled={!privateKey || !recipientPubkey.trim() || !unitAmount.trim() || isSendingUnits || !isReadyToPublish}
          >
            {isSendingUnits ? <CircularProgress size={24} /> : 'Enviar Ünits'}
          </Button>
        </Stack>
      </Paper>

      {/* Formulario Enviar Méritos */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Enviar Méritos
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Clave Pública del Afectado"
            value={meritRecipientPubkey}
            onChange={(e) => setMeritRecipientPubkey(e.target.value)}
            disabled={!privateKey || isSendingMerits || !isReadyToPublish}
            placeholder="npub..."
          />
          <TextField
            fullWidth
            label="Cantidad de Méritos"
            type="number"
            value={meritAmount}
            onChange={(e) => setMeritAmount(e.target.value)}
            disabled={!privateKey || isSendingMerits || !isReadyToPublish}
            inputProps={{ min: "0", step: "0.01" }}
          />
          <TextField
            fullWidth
            label="Tipo de Mérito"
            value={meritType}
            onChange={(e) => setMeritType(e.target.value)}
            disabled={!privateKey || isSendingMerits || !isReadyToPublish}
            placeholder="Ej: Contribución, Participación..."
          />
          <FormControl fullWidth>
            <InputLabel>Acción</InputLabel>
            <Select
              value={meritAction}
              onChange={(e) => setMeritAction(e.target.value as MeritAction)}
              disabled={!privateKey || isSendingMerits || !isReadyToPublish}
              label="Acción"
            >
              <MenuItem value="gain">Ganar</MenuItem>
              <MenuItem value="spend">Gastar</MenuItem>
              <MenuItem value="award">Otorgar</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSendMerits}
            disabled={!privateKey || !meritRecipientPubkey.trim() || !meritAmount.trim() || !meritType.trim() || isSendingMerits || !isReadyToPublish}
          >
            {isSendingMerits ? <CircularProgress size={24} /> : 'Enviar Méritos'}
          </Button>
        </Stack>
      </Paper>

      {/* Formulario Crear/Actualizar Mundo */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Crear/Actualizar Mundo
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="ID Único del Mundo"
            value={mundoDTag}
            onChange={(e) => setMundoDTag(e.target.value)}
            disabled={!privateKey || isPublishingMundo || !isReadyToPublish}
            placeholder="Ej: mundo1, comunidad1..."
          />
          <TextField
            fullWidth
            label="Título del Mundo"
            value={mundoTitle}
            onChange={(e) => setMundoTitle(e.target.value)}
            disabled={!privateKey || isPublishingMundo || !isReadyToPublish}
            placeholder="Ej: Mundo de Programación..."
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción del Mundo"
            value={mundoDescription}
            onChange={(e) => setMundoDescription(e.target.value)}
            disabled={!privateKey || isPublishingMundo || !isReadyToPublish}
            placeholder="Describe tu mundo..."
          />
          <Button
            variant="contained"
            onClick={handlePublishMundo}
            disabled={!privateKey || !mundoDTag.trim() || !mundoTitle.trim() || !mundoDescription.trim() || isPublishingMundo || !isReadyToPublish}
          >
            {isPublishingMundo ? <CircularProgress size={24} /> : 'Publicar Mundo'}
          </Button>
        </Stack>
      </Paper>
    </>
  );
};

export default NostrForms; 