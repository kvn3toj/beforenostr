import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Tooltip,
  IconButton,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  QuestionMark as QuestionIcon,
  Timeline as TimelineIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

// Definimos la interfaz Question localmente para incluir endTimestamp
interface Question {
  id: number;
  videoItemId: number;
  timestamp: number;
  endTimestamp?: number; // Nuevo campo opcional
  type: string;
  text: string;
  languageCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VideoTimelineProps {
  videoDuration: number; // Duración en segundos
  questions: Question[];
  onQuestionClick: (question: Question) => void;
  onTimelineClick: (timestamp: number) => void;
  currentTime?: number; // Tiempo actual de reproducción (opcional)
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  videoDuration,
  questions,
  onQuestionClick,
  onTimelineClick,
  currentTime = 0,
}) => {
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const timestamp = Array.isArray(newValue) ? newValue[0] : newValue;
    onTimelineClick(timestamp);
  };

  const handleQuestionMarkerClick = (question: Question, event: React.MouseEvent) => {
    event.stopPropagation();
    onQuestionClick(question);
  };

  const getQuestionPosition = (timestamp: number): number => {
    return (timestamp / videoDuration) * 100;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return '#1976d2'; // primary
      case 'short-answer':
        return '#9c27b0'; // secondary
      case 'true-false':
        return '#2196f3'; // info
      default:
        return '#757575'; // default
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

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        }
      }}
    >
      {/* Header del Timeline */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ 
          p: 1.5, 
          bgcolor: 'primary.light', 
          borderRadius: 2,
          color: 'primary.contrastText'
        }}>
          <TimelineIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Timeline de Video - Preguntas Interactivas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duración: {formatTime(videoDuration)} • {questions.length} preguntas configuradas
          </Typography>
        </Box>
        <Chip
          icon={<PlayIcon />}
          label={`${formatTime(currentTime)} / ${formatTime(videoDuration)}`}
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Información de tiempo actual */}
      {hoveredTime !== null && (
        <Box sx={{ 
          position: 'absolute',
          top: 80,
          left: `${(hoveredTime / videoDuration) * 100}%`,
          transform: 'translateX(-50%)',
          zIndex: 10
        }}>
          <Paper 
            elevation={4}
            sx={{ 
              px: 2, 
              py: 1, 
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 1,
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            {formatTime(hoveredTime)}
          </Paper>
        </Box>
      )}

      {/* Timeline Principal */}
      <Box sx={{ position: 'relative', px: 2, py: 3 }}>
        {/* Barra de progreso del video */}
        <Box sx={{ 
          position: 'relative',
          height: 8,
          bgcolor: 'grey.200',
          borderRadius: 4,
          mb: 4,
          overflow: 'hidden'
        }}>
          {/* Progreso actual */}
          <Box sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${(currentTime / videoDuration) * 100}%`,
            bgcolor: 'primary.main',
            borderRadius: 4,
            transition: 'width 0.3s ease'
          }} />
          
          {/* Slider invisible para interacción */}
          <Slider
            value={currentTime}
            min={0}
            max={videoDuration}
            onChange={handleSliderChange}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = event.clientX - rect.left;
              const percentage = x / rect.width;
              const time = Math.round(percentage * videoDuration);
              setHoveredTime(Math.max(0, Math.min(videoDuration, time)));
            }}
            onMouseLeave={() => setHoveredTime(null)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              color: 'transparent',
              '& .MuiSlider-thumb': {
                opacity: 0,
              },
              '& .MuiSlider-track': {
                opacity: 0,
              },
              '& .MuiSlider-rail': {
                opacity: 0,
              }
            }}
          />
        </Box>

        {/* Marcadores de Preguntas */}
        <Box sx={{ position: 'relative', height: 60 }}>
          {questions.map((question, index) => {
            const startPosition = getQuestionPosition(question.timestamp);
            const endPosition = question.endTimestamp ? getQuestionPosition(question.endTimestamp) : startPosition;
            const color = getQuestionTypeColor(question.type);
            const hasDuration = question.endTimestamp && question.endTimestamp > question.timestamp;
            
            return (
              <React.Fragment key={question.id}>
                {/* Barra de duración de la pregunta (si tiene endTimestamp) */}
                {hasDuration && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${startPosition}%`,
                      width: `${endPosition - startPosition}%`,
                      top: 25,
                      height: 8,
                      bgcolor: color,
                      borderRadius: 4,
                      opacity: 0.6,
                      zIndex: 2,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        bgcolor: 'white',
                        borderRadius: 6,
                        zIndex: -1,
                      }
                    }}
                  />
                )}
                
                {/* Marcador de inicio de pregunta */}
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {getQuestionTypeIcon(question.type)} Pregunta #{question.id}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        "{question.text}"
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        📍 Inicio: {formatTime(question.timestamp)}
                        {question.endTimestamp && (
                          <>
                            <br />
                            🏁 Fin: {formatTime(question.endTimestamp)}
                            <br />
                            ⏱️ Duración: {formatTime(question.endTimestamp - question.timestamp)}
                          </>
                        )}
                        <br />
                        🏷️ Tipo: {question.type}
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <IconButton
                    onClick={(event) => handleQuestionMarkerClick(question, event)}
                    sx={{
                      position: 'absolute',
                      left: `${startPosition}%`,
                      top: 10,
                      transform: 'translateX(-50%)',
                      width: 40,
                      height: 40,
                      bgcolor: color,
                      color: 'white',
                      border: '3px solid white',
                      boxShadow: 3,
                      zIndex: 5,
                      '&:hover': {
                        transform: 'translateX(-50%) scale(1.2)',
                        boxShadow: 6,
                        zIndex: 10,
                      },
                      transition: 'all 0.3s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: -15,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 2,
                        height: 15,
                        bgcolor: color,
                      }
                    }}
                  >
                    <QuestionIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>

                {/* Marcador de fin de pregunta (si tiene endTimestamp) */}
                {hasDuration && (
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          🏁 Fin de Pregunta #{question.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tiempo: {formatTime(question.endTimestamp!)}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${endPosition}%`,
                        top: 20,
                        transform: 'translateX(-50%)',
                        width: 20,
                        height: 20,
                        bgcolor: color,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                        zIndex: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white',
                        fontWeight: 'bold',
                        '&::before': {
                          content: '"✓"',
                        }
                      }}
                    />
                  </Tooltip>
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Marcadores de tiempo */}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, px: 1 }}>
          {Array.from({ length: 6 }, (_, i) => {
            const time = (videoDuration / 5) * i;
            return (
              <Box key={i} sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 1, 
                  height: 8, 
                  bgcolor: 'grey.400', 
                  mx: 'auto', 
                  mb: 0.5 
                }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {formatTime(Math.round(time))}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Estadísticas del Timeline */}
      <Box sx={{ 
        mt: 3, 
        p: 2, 
        bgcolor: 'grey.50', 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon fontSize="small" color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              <strong>Duración:</strong> {formatTime(videoDuration)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuestionIcon fontSize="small" color="secondary" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              <strong>Preguntas:</strong> {questions.length}
            </Typography>
          </Box>
          {questions.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                <strong>Densidad:</strong> {(questions.length / (videoDuration / 60)).toFixed(1)} preguntas/min
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}; 