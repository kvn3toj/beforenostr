import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Fade,
  Chip,
  Stack,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

// Tipos básicos para el quiz
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timestamp: number;
}

interface QuizOverlayProps {
  question: QuizQuestion | null;
  visible: boolean;
  onAnswer: (questionId: string, selectedOption: number, isCorrect: boolean) => void;
  onSkip: (questionId: string) => void;
}

export const QuizOverlay: React.FC<QuizOverlayProps> = ({
  question,
  visible,
  onAnswer,
  onSkip,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!question || !visible) return null;

  const handleAnswer = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setAnswered(true);
    
    // Callback después de un breve delay
    setTimeout(() => {
      onAnswer(question.id, selectedOption, correct);
      // Reset state para próxima pregunta
      setSelectedOption(null);
      setAnswered(false);
      setIsCorrect(null);
    }, 1500);
  };

  const handleSkip = () => {
    onSkip(question.id);
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrect(null);
  };

  return (
    <Fade in={visible} timeout={300}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          width: { xs: '90%', sm: '80%', md: '60%' },
          maxWidth: 600,
        }}
      >
        <Card
          elevation={8}
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            border: answered 
              ? `2px solid ${isCorrect ? '#4caf50' : '#f44336'}`
              : '2px solid transparent',
            transition: 'border-color 0.3s ease',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
              <QuizIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                Pregunta Interactiva
              </Typography>
              {answered && (
                <Chip
                  icon={isCorrect ? <CheckIcon /> : <CancelIcon />}
                  label={isCorrect ? 'Correcto' : 'Incorrecto'}
                  color={isCorrect ? 'success' : 'error'}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              )}
            </Box>

            {/* Pregunta */}
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
              {question.question}
            </Typography>

            {/* Opciones */}
            {!answered && (
              <RadioGroup
                value={selectedOption?.toString() || ''}
                onChange={(e) => setSelectedOption(parseInt(e.target.value))}
                sx={{ mb: 3 }}
              >
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.95rem',
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            )}

            {/* Resultado */}
            {answered && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  color={isCorrect ? 'success.main' : 'error.main'}
                  gutterBottom
                >
                  {isCorrect ? '¡Excelente!' : 'Respuesta incorrecta'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isCorrect 
                    ? 'Has ganado méritos y experiencia'
                    : `La respuesta correcta era: ${question.options[question.correctAnswer]}`
                  }
                </Typography>
              </Box>
            )}

            {/* Botones */}
            {!answered && (
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleSkip}
                  size="small"
                >
                  Saltar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAnswer}
                  disabled={selectedOption === null}
                  size="small"
                >
                  Responder
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default QuizOverlay; 