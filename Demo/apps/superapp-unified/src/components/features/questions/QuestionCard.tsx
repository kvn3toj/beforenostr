import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  QuestionMark as QuestionIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Question, AnswerOption } from '@prisma/client';

// Tipo extendido que incluye las answerOptions
type QuestionWithAnswers = Question & {
  answerOptions?: AnswerOption[];
};

interface QuestionCardProps {
  question: QuestionWithAnswers;
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const formatTimestamp = (timestamp: number): string => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = timestamp % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeLabel = (type: string): string => {
    switch (type) {
      case 'multiple-choice':
        return 'Opción Múltiple';
      case 'short-answer':
        return 'Respuesta Corta';
      case 'true-false':
        return 'Verdadero/Falso';
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'primary';
      case 'short-answer':
        return 'secondary';
      case 'true-false':
        return 'info';
      default:
        return 'default';
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return '🔘';
      case 'short-answer':
        return '✏️';
      case 'true-false':
        return '✅';
      default:
        return '❓';
    }
  };

  const handleEditClick = () => {
    onEdit(question);
  };

  const handleDeleteClick = () => {
    onDelete(question);
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%',
        border: '2px solid',
        borderColor: question.isActive ? 'primary.light' : 'grey.200',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          elevation: 8,
          borderColor: 'primary.main',
          transform: 'translateY(-4px)',
          '& .question-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: question.isActive 
            ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)'
            : 'linear-gradient(90deg, #bdbdbd 0%, #e0e0e0 100%)',
        }
      }}
    >
      <CardContent sx={{ pb: 1, p: 3 }}>
        {/* Header mejorado con icono y estado */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'primary.light', 
              borderRadius: 2,
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QuestionIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Pregunta #{question.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTimestamp(question.timestamp)}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={question.isActive ? <ActiveIcon /> : <InactiveIcon />}
            label={question.isActive ? 'Activa' : 'Inactiva'}
            size="small"
            color={question.isActive ? 'success' : 'default'}
            variant="filled"
            sx={{ 
              fontWeight: 600,
              '& .MuiChip-icon': {
                fontSize: '1rem'
              }
            }}
          />
        </Box>

        {/* Texto de la pregunta mejorado */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2.5, 
            mb: 3, 
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 500,
              color: 'text.primary',
              lineHeight: 1.6,
              fontSize: '1rem'
            }}
          >
            "{question.text}"
          </Typography>
        </Paper>

        {/* Metadatos mejorados */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<PlayIcon />}
            label={formatTimestamp(question.timestamp)}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={`${getQuestionTypeIcon(question.type)} ${getQuestionTypeLabel(question.type)}`}
            size="small"
            variant="filled"
            color={getQuestionTypeColor(question.type) as any}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<LanguageIcon />}
            label={question.languageCode}
            size="small"
            variant="outlined"
            color="secondary"
            sx={{ fontWeight: 500 }}
          />
        </Stack>

        {/* Opciones de respuesta mejoradas (solo para multiple-choice) */}
        {question.type === 'multiple-choice' && question.answerOptions && question.answerOptions.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              📝 Opciones de respuesta:
            </Typography>
            <Stack spacing={1}>
              {question.answerOptions
                .sort((a, b) => a.order - b.order)
                .map((option, index) => (
                  <Paper
                    key={option.id}
                    elevation={0}
                    sx={{ 
                      p: 1.5,
                      bgcolor: option.isCorrect ? 'success.light' : 'grey.50',
                      border: '1px solid',
                      borderColor: option.isCorrect ? 'success.main' : 'grey.200',
                      borderRadius: 1.5,
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5
                    }}
                  >
                    <Box sx={{ 
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      bgcolor: option.isCorrect ? 'success.main' : 'grey.400',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {String.fromCharCode(65 + index)}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        fontWeight: option.isCorrect ? 600 : 500,
                        color: option.isCorrect ? 'success.dark' : 'text.primary',
                      }}
                    >
                      {option.text}
                    </Typography>
                    {option.isCorrect && (
                      <Chip
                        label="✓ Correcta"
                        size="small"
                        color="success"
                        variant="filled"
                        sx={{ 
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          height: '20px'
                        }}
                      />
                    )}
                  </Paper>
                ))}
            </Stack>
          </>
        )}
      </CardContent>

      <CardActions 
        className="question-actions"
        sx={{ 
          justifyContent: 'flex-end', 
          pt: 0, 
          pb: 2, 
          px: 3,
          gap: 1,
          opacity: 0.7,
          transform: 'translateY(4px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Tooltip title="Editar pregunta" arrow>
          <IconButton
            onClick={handleEditClick}
            color="primary"
            size="medium"
            sx={{ 
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': { 
                bgcolor: 'primary.main',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar pregunta" arrow>
          <IconButton
            onClick={handleDeleteClick}
            color="error"
            size="medium"
            sx={{ 
              bgcolor: 'error.light',
              color: 'error.contrastText',
              '&:hover': { 
                bgcolor: 'error.main',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}; 