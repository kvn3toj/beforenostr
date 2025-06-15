import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Fade,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TimerIcon,
  SkipNextIcon,
} from '@mui/icons-material';
import type { Question } from '../../../../hooks/interactive-video/useQuestionSystem';

interface QuestionOverlayProps {
  question: Question;
  selectedAnswer: string | null;
  timeRemaining: number;
  isTimerActive: boolean;
  onAnswerSelect: (answerId: string) => void;
  onSubmitAnswer: () => void;
  onSkipQuestion: () => void;
  isMobile?: boolean;
}

const QuestionOverlay: React.FC<QuestionOverlayProps> = React.memo(({
  question,
  selectedAnswer,
  timeRemaining,
  isTimerActive,
  onAnswerSelect,
  onSubmitAnswer,
  onSkipQuestion,
  isMobile = false,
}) => {
  const progressPercentage = isTimerActive 
    ? (timeRemaining / question.timeLimit) * 100 
    : 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  return (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          p: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            maxWidth: { xs: '100%', md: '600px' },
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {/* Header with timer and difficulty */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Chip
              label={getDifficultyLabel(question.difficulty)}
              sx={{
                backgroundColor: getDifficultyColor(question.difficulty),
                color: 'white',
                fontWeight: 600,
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon sx={{ color: '#6b7280', fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: timeRemaining <= 5 ? '#ef4444' : '#6b7280',
                }}
              >
                {timeRemaining}s
              </Typography>
            </Box>
          </Box>

          {/* Timer progress bar */}
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              mb: 3,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#f3f4f6',
              '& .MuiLinearProgress-bar': {
                backgroundColor: timeRemaining <= 5 ? '#ef4444' : '#10b981',
                borderRadius: 3,
              },
            }}
          />

          {/* Question text */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Montserrat, -apple-system, Roboto, Helvetica, sans-serif',
              fontSize: { xs: '16px', md: '18px' },
              fontWeight: 600,
              lineHeight: 1.4,
              mb: 4,
              textAlign: 'center',
              color: '#1f2937',
            }}
          >
            {question.question}
          </Typography>

          {/* Answer options */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 4,
              justifyContent: 'center',
              alignItems: 'stretch',
            }}
          >
            {question.options.map((option) => (
              <Card
                key={option.id}
                sx={{
                  minWidth: { xs: '100%', md: 200 },
                  maxWidth: { xs: '100%', md: 280 },
                  cursor: 'pointer',
                  borderRadius: '16px',
                  backgroundColor:
                    selectedAnswer === option.id
                      ? 'rgba(103, 80, 164, 0.9)'
                      : 'var(--m3-sys-light-surface-container-low, #f3edf7)',
                  color:
                    selectedAnswer === option.id
                      ? 'white'
                      : 'rgba(66, 65, 65, 1)',
                  transform:
                    selectedAnswer === option.id
                      ? 'scale(1.05)'
                      : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow:
                    selectedAnswer === option.id
                      ? '0px 8px 32px rgba(103, 80, 164, 0.5)'
                      : '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
                  border:
                    selectedAnswer === option.id
                      ? '3px solid rgba(103, 80, 164, 0.8)'
                      : 'none',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow:
                      selectedAnswer === option.id
                        ? '0px 12px 40px rgba(103, 80, 164, 0.6)'
                        : '0px 2px 4px 0px rgba(0, 0, 0, 0.40), 0px 2px 6px 2px rgba(0, 0, 0, 0.20)',
                  },
                }}
                onClick={() => onAnswerSelect(option.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onAnswerSelect(option.id);
                  }
                }}
                aria-pressed={selectedAnswer === option.id}
                aria-label={`Opción ${option.label}: ${option.text}`}
              >
                <CardContent sx={{ p: '15px 15px 33px 15px' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily:
                        'Montserrat, -apple-system, Roboto, Helvetica, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      textAlign: 'center',
                      mb: 1,
                    }}
                  >
                    {option.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily:
                        'Montserrat, -apple-system, Roboto, Helvetica, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {option.text}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Action buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {/* Submit button */}
            {selectedAnswer && (
              <Button
                variant="contained"
                onClick={onSubmitAnswer}
                sx={{
                  backgroundColor: '#10b981',
                  borderRadius: '24px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': { backgroundColor: '#059669' },
                }}
                aria-label="Confirmar respuesta seleccionada"
              >
                Confirmar Respuesta
              </Button>
            )}

            {/* Skip button */}
            <Button
              variant="outlined"
              onClick={onSkipQuestion}
              startIcon={<SkipNextIcon />}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                borderRadius: '24px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '16px',
                '&:hover': {
                  borderColor: '#4b5563',
                  color: '#4b5563',
                  backgroundColor: 'rgba(107, 114, 128, 0.04)',
                },
              }}
              aria-label="Saltar esta pregunta"
            >
              Saltar Pregunta
            </Button>
          </Box>

          {/* Reward preview */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                fontWeight: 500,
                mb: 1,
              }}
            >
              Recompensa por respuesta correcta:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Chip
                label={`+${question.reward.meritos} Mëritos`}
                size="small"
                sx={{
                  backgroundColor: '#ddd6fe',
                  color: '#7c3aed',
                  fontWeight: 600,
                }}
              />
              <Chip
                label={`+${question.reward.ondas} Öndas`}
                size="small"
                sx={{
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
});

QuestionOverlay.displayName = 'QuestionOverlay';

export default QuestionOverlay; 