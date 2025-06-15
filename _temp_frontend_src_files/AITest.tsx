import { useState } from 'react';
import { googleAIService } from '../services/google-ai.service';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DOMPurify from 'dompurify';

export function AITest() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCustomPrompt = async () => {
    if (!prompt.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await googleAIService.generateText(prompt);
      // Convertir **texto** a <strong>texto</strong>
      const formattedResult = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      setResponse(formattedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Do you want to take the Call?
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleCustomPrompt}
          disabled={loading || !prompt.trim()}
        >
          Enviar
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      {response && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Respuesta:
          </Typography>
          <Typography 
            sx={{ 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              whiteSpace: 'pre-wrap'
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(response) }}
          />
        </Box>
      )}
    </Box>
  );
} 