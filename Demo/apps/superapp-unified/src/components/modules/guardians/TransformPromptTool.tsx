import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Select, Paper, Divider, Tooltip, IconButton, Snackbar, Fade, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CasinoIcon from '@mui/icons-material/Casino';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { GUARDIANS, GuardianExtended } from './guardianData';

const MODES = [
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'practico', label: 'Práctico' },
  { value: 'narrativo', label: 'Narrativo' },
  { value: 'ai', label: 'AI (Próximamente)' },
];

// Iconos representativos por guardián (puedes personalizar más)
const GUARDIAN_ICONS: Record<string, React.ReactNode> = {
  kira: <span role="img" aria-label="Kira">📝</span>,
  zeno: <span role="img" aria-label="Zeno">🧭</span>,
  atlas: <span role="img" aria-label="Atlas">🛡️</span>,
  aria: <span role="img" aria-label="Aria">🎨</span>,
  sage: <span role="img" aria-label="Sage">🧪</span>,
  nira: <span role="img" aria-label="Nira">📊</span>,
  phoenix: <span role="img" aria-label="Phoenix">🔥</span>,
  mira: <span role="img" aria-label="Mira">🛠️</span>,
  cosmos: <span role="img" aria-label="Cosmos">🌌</span>,
  luna: <span role="img" aria-label="Luna">🌙</span>,
  pax: <span role="img" aria-label="Pax">🕊️</span>,
  gaia: <span role="img" aria-label="Gaia">🌱</span>,
};

// Gradientes adaptativos por guardián
const GUARDIAN_GRADIENTS: Record<string, string> = {
  kira: 'linear-gradient(135deg, #a7c7e7 0%, #fbc2eb 100%)',
  zeno: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  atlas: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  aria: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
  sage: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  nira: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  phoenix: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
  mira: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  cosmos: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
  luna: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  pax: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  gaia: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
};

function buildTransformation(prompt: string, guardian: GuardianExtended, mode: string) {
  let intro = '';
  let explanation = '';
  switch (mode) {
    case 'inspirador':
      intro = `✨ ${guardian.philosophy}\n\n"${guardian.mantra}"`;
      explanation = 'Transformación inspiradora basada en la filosofía y mantra del guardián.';
      break;
    case 'practico':
      intro = `🔧 Enfoque práctico de ${guardian.name}:\n- ${guardian.functions.join('\n- ')}`;
      explanation = 'Transformación práctica usando las funciones clave del guardián.';
      break;
    case 'narrativo':
      intro = `📖 Narrativa de ${guardian.name}:\n${guardian.mission}`;
      explanation = 'Transformación narrativa usando la misión y voz del guardián.';
      break;
    default:
      intro = '';
      explanation = '';
  }
  return {
    result: `${intro}\n\n---\n${prompt}`,
    explanation,
    mantra: guardian.mantra,
  };
}

const EXAMPLES: Record<string, string> = {
  inspirador: '¿Cómo puedo aplicar el principio de Ayni en mi equipo de trabajo?',
  practico: 'Genera una checklist para asegurar la calidad en un módulo React.',
  narrativo: 'Cuéntame una historia sobre la transformación de un sistema legacy.',
  ai: '¿Cómo puede la IA ayudar a la evolución consciente de una comunidad digital?'
};

// Mock de llamada AI
async function mockAITransform(prompt: string, guardian: GuardianExtended) {
  return new Promise<{ result: string; explanation: string; mantra: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        result: `🤖 [AI] Respuesta generada por la sabiduría viva de ${guardian.name} (mock):\n\n${prompt}\n\n---\n[Esta función pronto usará IA real para transformar tus prompts con la voz del guardián.]`,
        explanation: 'Transformación generada por IA (simulada). Pronto podrás invocar la sabiduría viva de los Guardianes.',
        mantra: guardian.mantra,
      });
    }, 1800);
  });
}

const TransformPromptTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [guardianId, setGuardianId] = useState(GUARDIANS[0].id);
  const [mode, setMode] = useState(MODES[0].value);
  const [result, setResult] = useState('');
  const [explanation, setExplanation] = useState('');
  const [mantra, setMantra] = useState('');
  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const guardian = GUARDIANS.find(g => g.id === guardianId)!;
  const gradient = GUARDIAN_GRADIENTS[guardianId] || 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
  const icon = GUARDIAN_ICONS[guardianId] || <span>🛡️</span>;

  const handleTransform = async () => {
    if (!prompt.trim()) return;
    setShowResult(false);
    setResult('');
    setExplanation('');
    setMantra('');
    if (mode === 'ai') {
      setLoading(true);
      const aiRes = await mockAITransform(prompt, guardian);
      setResult(aiRes.result);
      setExplanation(aiRes.explanation);
      setMantra(aiRes.mantra);
      setLoading(false);
      setTimeout(() => setShowResult(true), 100);
    } else {
      const { result, explanation, mantra } = buildTransformation(prompt, guardian, mode);
      setResult(result);
      setExplanation(explanation);
      setMantra(mantra);
      setTimeout(() => setShowResult(true), 100);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
  };

  const handleExample = () => {
    setPrompt(EXAMPLES[mode] || '');
    setResult('');
    setExplanation('');
    setMantra('');
    setShowResult(false);
  };

  const handleRandom = () => {
    const randomGuardian = GUARDIANS[Math.floor(Math.random() * GUARDIANS.length)];
    const randomMode = MODES[Math.floor(Math.random() * MODES.length)].value;
    setGuardianId(randomGuardian.id);
    setMode(randomMode);
    setPrompt(EXAMPLES[randomMode] || '');
    setResult('');
    setExplanation('');
    setMantra('');
    setShowResult(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ingresa tu prompt, selecciona un Guardián y el modo de transformación:
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mb={2}>
        <TextField
          label="Tu Prompt Original"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
        <Tooltip title={guardian.philosophy} arrow>
          <Select
            value={guardianId}
            onChange={e => setGuardianId(e.target.value as string)}
            sx={{ minWidth: 180 }}
          >
            {GUARDIANS.map(g => (
              <MenuItem key={g.id} value={g.id}>
                {GUARDIAN_ICONS[g.id]} {g.name} - {g.specialization}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
        <Select
          value={mode}
          onChange={e => setMode(e.target.value as string)}
          sx={{ minWidth: 170 }}
        >
          {MODES.map(m => (
            <MenuItem key={m.value} value={m.value} disabled={m.value === 'ai'}>
              {m.value === 'ai' ? <><SmartToyIcon fontSize="small" sx={{ mr: 1 }} />{m.label}</> : m.label}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={handleTransform} sx={{ minWidth: 140 }} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Transformar'}
        </Button>
        <Tooltip title="Ver ejemplo para este modo">
          <Button variant="outlined" onClick={handleExample} disabled={loading}>Ejemplo</Button>
        </Tooltip>
        <Tooltip title="Modo aleatorio (elige guardián y modo)">
          <IconButton color="secondary" onClick={handleRandom} disabled={loading}>
            <CasinoIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ my: 2 }} />
      {loading && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ minHeight: 120, mb: 2 }}>
          <SmartToyIcon fontSize="large" color="secondary" sx={{ mb: 1, animation: 'guardian-spin 1.2s linear infinite' }} />
          <Typography variant="body2" color="text.secondary">Invocando sabiduría AI Guardian...</Typography>
        </Box>
      )}
      <Fade in={showResult} timeout={600}>
        <Box>
          {result && (
            <Box>
              <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
                <span style={{ fontSize: 28, marginRight: 8, transition: 'transform 0.3s', animation: 'guardian-bounce 1s' }}>{icon}</span>
                Resultado:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  background: gradient,
                  color: '#222',
                  position: 'relative',
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                  transition: 'background 0.5s',
                  minHeight: 120,
                  fontFamily: 'inherit',
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: 0.1,
                  overflowX: 'auto',
                  animation: 'guardian-glow 1.5s ease-in-out',
                }}
                className="guardian-animated"
              >
                <IconButton
                  aria-label="Copiar resultado"
                  onClick={handleCopy}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>{result}</Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {explanation}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mt: 2, fontStyle: 'italic', fontWeight: 600 }}>
                {mantra && `"${mantra}"`}
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="¡Prompt copiado al portapapeles!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <style>{`
        @keyframes guardian-bounce {
          0% { transform: scale(1) translateY(0); }
          30% { transform: scale(1.2) translateY(-8px); }
          60% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes guardian-glow {
          0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.10); }
          50% { box-shadow: 0 0 24px 8px rgba(255,255,255,0.18); }
          100% { box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10); }
        }
        @keyframes guardian-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Paper>
  );
};

export default TransformPromptTool;
