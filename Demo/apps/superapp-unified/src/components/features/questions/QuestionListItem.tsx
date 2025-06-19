import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Question, AnswerOption } from '@prisma/client';

// Tipo extendido que incluye las answerOptions
type QuestionWithAnswers = Question & {
  answerOptions?: AnswerOption[];
};

interface QuestionListItemProps {
  question: QuestionWithAnswers;
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
  showDivider?: boolean;
}

export const QuestionListItem: React.FC<QuestionListItemProps> = ({
  question,
  onEdit,
  onDelete,
  showDivider = true,
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
        return t('question_type_multiple_choice');
      case 'short-answer':
        return t('question_type_short_answer');
      case 'true-false':
        return t('question_type_true_false');
      default:
        return type;
    }
  };

  const handleEditClick = () => {
    onEdit(question);
  };

  const handleDeleteClick = () => {
    onDelete(question);
  };

  return (
    <>
      <ListItem
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          py: 2,
          px: 3,
        }}
      >
        {/* Fila principal con información básica */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <ListItemText
              primary={
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  {question.text}
                </Typography>
              }
              secondary={
                <Box component="div" sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      px: 1, py: 0.25, bgcolor: 'primary.main', color: 'primary.contrastText',
                      borderRadius: 1, fontSize: '0.75rem', border: '1px solid', borderColor: 'primary.main'
                    }}
                  >
                    {formatTimestamp(question.timestamp)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      px: 1, py: 0.25, bgcolor: 'secondary.main', color: 'secondary.contrastText',
                      borderRadius: 1, fontSize: '0.75rem', border: '1px solid', borderColor: 'secondary.main'
                    }}
                  >
                    {getQuestionTypeLabel(question.type)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      px: 1, py: 0.25, bgcolor: 'grey.200', color: 'text.primary',
                      borderRadius: 1, fontSize: '0.75rem', border: '1px solid', borderColor: 'grey.300'
                    }}
                  >
                    {question.languageCode}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      px: 1, py: 0.25,
                      bgcolor: question.isActive ? 'success.main' : 'grey.200',
                      color: question.isActive ? 'success.contrastText' : 'text.primary',
                      borderRadius: 1, fontSize: '0.75rem',
                      border: '1px solid',
                      borderColor: question.isActive ? 'success.main' : 'grey.300'
                    }}
                  >
                    {question.isActive ? t('subtitle_active_label') : t('subtitle_inactive_label')}
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleEditClick}
              color="primary"
              size="small"
              aria-label={t('button_edit_question')}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={handleDeleteClick}
              color="error"
              size="small"
              aria-label={t('button_delete_question')}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Opciones de respuesta (solo para multiple-choice) */}
        {question.type === 'multiple-choice' && question.answerOptions && question.answerOptions.length > 0 && (
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {t('answer_options_title')}:
            </Typography>
            <Stack spacing={0.5}>
              {question.answerOptions
                .sort((a, b) => a.order - b.order)
                .map((option, index) => (
                  <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: '20px' }}>
                      {String.fromCharCode(65 + index)}. {/* A, B, C, D... */}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        fontWeight: option.isCorrect ? 600 : 400,
                        color: option.isCorrect ? 'success.main' : 'text.primary',
                      }}
                    >
                      {option.text}
                    </Typography>
                    {option.isCorrect && (
                      <Chip
                        label="✓"
                        size="small"
                        color="success"
                        sx={{ minWidth: 'auto', height: '20px', fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                ))}
            </Stack>
          </Box>
        )}
      </ListItem>

      {showDivider && <Divider />}
    </>
  );
};
