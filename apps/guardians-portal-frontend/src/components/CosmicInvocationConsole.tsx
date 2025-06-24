import React, { useState } from 'react';
import { Box, Fab, Modal, Typography, Button, TextField, MenuItem, IconButton, Paper } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';

const GUARDIANS = [
  { id: 'ANA', label: 'ANA (Curadora Cósmica)' },
  { id: 'CIO', label: 'CIO (Orquestador)' },
  { id: 'LYRA', label: 'LYRA (Diseño Armónico)' },
  { id: 'PROMETHEO', label: 'PROMETHEO (Prototipado)' },
];

const SAMPLE_COMMANDS: Record<string, string> = {
  ANA: '/invocar ana --tarea="resumir_conocimiento" --tema="filosofía CoomÜnity"',
  CIO: '/invocar cio --tarea="diagnostico_sistema" --modulo="backend"',
  LYRA: '/invocar lyra --tarea="sugerir_paleta" --contexto="laboratorio ARIA"',
  PROMETHEO: '/invocar prometheo --tarea="prototipo_rapido" --modulo="nuevo_laboratorio"',
};

const SIMULATED_RESPONSES: Record<string, string> = {
  ANA: '“La memoria colectiva es el puente entre el origen y el destino.”',
  CIO: 'Diagnóstico: Arquitectura coherente. Sugerencia: Optimizar integración de módulos.',
  LYRA: 'Paleta sugerida: Violeta cósmico, azul profundo, verde esmeralda.',
  PROMETHEO: 'Prototipo generado: Componente React con animación Framer Motion listo para pruebas.',
};

const styleModal = {
  position: 'fixed' as const,
  bottom: 90,
  right: 32,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
  minWidth: 340,
  maxWidth: 400,
  zIndex: 1300,
};

const CosmicInvocationConsole: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [guardian, setGuardian] = useState('ANA');
  const [command, setCommand] = useState(SAMPLE_COMMANDS['ANA']);
  const [result, setResult] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setResult('');
  };
  const handleGuardianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGuardian(value);
    setCommand(SAMPLE_COMMANDS[value]);
    setResult('');
  };
  const handleExecute = () => {
    setResult(SIMULATED_RESPONSES[guardian] || 'Respuesta generada por el Guardián.');
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="invocar-guardian"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1200,
          boxShadow: '0 4px 24px #9D2EDC88',
        }}
        onClick={handleOpen}
      >
        <AutoFixHighIcon fontSize="large" />
      </Fab>
      <Modal open={open} onClose={handleClose}>
        <Paper sx={styleModal}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              Consola de Invocación Cósmica
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            select
            label="Guardían"
            value={guardian}
            onChange={handleGuardianChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {GUARDIANS.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Comando"
            value={command}
            onChange={e => setCommand(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleExecute} sx={{ mb: 2 }}>
            Ejecutar
          </Button>
          {result && (
            <Box mt={2} p={2} bgcolor="background.default" borderRadius={2}>
              <Typography variant="subtitle2" color="secondary.main">Respuesta:</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>{result}</Typography>
            </Box>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default CosmicInvocationConsole;
