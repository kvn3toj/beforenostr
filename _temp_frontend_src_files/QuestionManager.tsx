import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Container,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { 
  Add as AddIcon,
  QuestionMark as QuestionIcon,
  PlaylistAdd as PlaylistAddIcon,
  Timeline as TimelineIcon,
  SmartDisplay as VideoIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQuestionsQuery } from '../../../hooks/features/questions/useQuestionsQuery';
import { useCreateQuestionMutation } from '../../../hooks/features/questions/useCreateQuestionMutation';
import { useUpdateQuestionMutation } from '../../../hooks/features/questions/useUpdateQuestionMutation';
import { useDeleteQuestionMutation } from '../../../hooks/features/questions/useDeleteQuestionMutation';
import { useVideoItemQuery } from '../../../hooks/features/video/useVideoItemQuery';
import { QuestionCard } from './QuestionCard';
import { QuestionForm } from './QuestionForm';
import { VideoTimeline } from '../video/VideoTimeline';
import { AIQuestionGeneratorModal } from './AIQuestionGeneratorModal';
import { QuestionFormModal } from './QuestionFormModal';
import type { Question } from '@prisma/client';
import { CreateQuestionDto } from '../../../questions/dto/create-question.dto';
import { UpdateQuestionDto } from '../../../questions/dto/update-question.dto';
import { GeneratedQuestion } from '../../../lib/aiQuestionGenerator';

interface QuestionManagerProps {
  videoItemId: number;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({ videoItemId }) => {
  const { t } = useTranslation();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [currentTime, setCurrentTime] = useState(0); // Estado para el tiempo actual del video

  // Queries y mutaciones
  const { 
    data: questions, 
    isLoading, 
    error 
  } = useQuestionsQuery({ videoItemId });

  // Obtener información del video item incluyendo duración
  const { 
    data: videoItem, 
    isLoading: isLoadingVideoItem,
    error: videoItemError 
  } = useVideoItemQuery(videoItemId);

  const createQuestionMutation = useCreateQuestionMutation();
  const updateQuestionMutation = useUpdateQuestionMutation();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  // Obtener duración del video
  const videoDuration = videoItem?.duration || 600; // Usar duración del video o 10 minutos por defecto

  // Handlers
  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setIsFormDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsFormDialogOpen(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    setQuestionToDelete(question);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (questionToDelete) {
      deleteQuestionMutation.mutate({
        id: questionToDelete.id,
        videoItemId: questionToDelete.videoItemId,
      });
      setQuestionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmitForm = (data: CreateQuestionDto | UpdateQuestionDto) => {
    if (editingQuestion) {
      // Actualizar pregunta existente
      updateQuestionMutation.mutate({
        id: editingQuestion.id,
        data: data as UpdateQuestionDto,
      });
    } else {
      // Crear nueva pregunta
      createQuestionMutation.mutate({
        ...data,
        videoItemId,
      } as CreateQuestionDto);
    }
    setIsFormDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleCloseForm = () => {
    setIsFormDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setQuestionToDelete(null);
  };

  // Handler para el generador AI
  const handleOpenAIGenerator = () => {
    setIsAIGeneratorOpen(true);
  };

  const handleCloseAIGenerator = () => {
    setIsAIGeneratorOpen(false);
  };

  // Handler para el formulario de preguntas múltiples
  const handleOpenFormModal = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleFormSubmit = async (formQuestions: CreateQuestionDto[]) => {
    try {
      console.log('🎯 Procesando formulario de preguntas múltiples:', formQuestions);

      // Crear todas las preguntas del formulario
      for (const questionData of formQuestions) {
        await createQuestionMutation.mutateAsync({
          ...questionData,
          videoItemId,
        });
      }

      console.log('✅ Todas las preguntas del formulario fueron creadas exitosamente');
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('❌ Error creando preguntas del formulario:', error);
      // El error se maneja automáticamente por la mutación
    }
  };

  const handleQuestionsGenerated = async (generatedQuestions: GeneratedQuestion[]) => {
    try {
      console.log('🎯 Procesando preguntas generadas por IA:', generatedQuestions);

      // Convertir las preguntas generadas al formato del sistema
      for (const genQuestion of generatedQuestions) {
        const questionData: CreateQuestionDto = {
          videoItemId,
          timestamp: genQuestion.timestamp,
          endTimestamp: genQuestion.endTimestamp,
          type: genQuestion.type as any,
          text: genQuestion.text,
          languageCode: 'es-ES', // Por defecto, pero se puede hacer configurable
          isActive: true,
          answerOptions: genQuestion.options ? genQuestion.options.map((option, index) => ({
            text: option,
            isCorrect: index === genQuestion.correctAnswer,
            order: index
          })) : undefined
        };

        // Crear la pregunta usando la mutación existente
        await createQuestionMutation.mutateAsync(questionData);
      }

      console.log('✅ Todas las preguntas AI fueron creadas exitosamente');
    } catch (error) {
      console.error('❌ Error creando preguntas AI:', error);
      // El error se maneja automáticamente por la mutación
    }
  };

  // Handlers del VideoTimeline
  const handleQuestionClick = (question: Question) => {
    console.log('Pregunta clickeada:', question);
    // Navegar al tiempo de la pregunta
    setCurrentTime(question.timestamp);
    // Opcionalmente abrir el modal de edición
    handleEditQuestion(question);
  };

  const handleTimelineClick = (timestamp: number) => {
    console.log('Timeline clickeado en:', timestamp);
    setCurrentTime(timestamp);
  };

  // Estados de carga combinados
  const isLoading_combined = isLoading || isLoadingVideoItem;
  const isFormLoading = createQuestionMutation.isPending || updateQuestionMutation.isPending;

  // Renderizado
  if (isLoading_combined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={56} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            {isLoadingVideoItem ? 'Cargando información del video...' : 'Cargando preguntas interactivas...'}
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error || videoItemError) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 4, 
          mx: 3,
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '2rem'
          }
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {videoItemError ? 'Error al cargar el video' : 'Error al cargar las preguntas'}
        </Typography>
        <Typography variant="body2">
          {((error || videoItemError) as Error)?.message || 'Error desconocido'}
        </Typography>
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Cabecera principal mejorada */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <QuestionIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Administrador de Preguntas
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Gestiona preguntas interactivas para el video
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <VideoIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Video ID: {videoItemId} • {questions?.length || 0} preguntas configuradas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row', md: 'column' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleCreateQuestion}
                  disabled={isFormLoading}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Crear Nueva Pregunta
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AIIcon />}
                  onClick={handleOpenAIGenerator}
                  disabled={isFormLoading}
                  sx={{ 
                    bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🤖 Generar con IA
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlaylistAddIcon />}
                  onClick={handleOpenFormModal}
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Añadir Formulario
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* VideoTimeline - Componente principal del timeline */}
        <VideoTimeline
          videoDuration={videoDuration}
          questions={questions || []}
          currentTime={currentTime}
          onQuestionClick={handleQuestionClick}
          onTimelineClick={handleTimelineClick}
        />

        {/* Lista de preguntas mejorada */}
        {!questions || questions.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              py: 8,
              bgcolor: 'grey.50',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'grey.300'
            }}
          >
            <Stack spacing={3} alignItems="center">
              <Box sx={{ 
                p: 3, 
                bgcolor: 'primary.light', 
                borderRadius: '50%',
                color: 'primary.contrastText'
              }}>
                <QuestionIcon sx={{ fontSize: 48 }} />
              </Box>
              <Box>
                <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                  No hay preguntas configuradas
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                  Comienza creando preguntas interactivas que aparecerán durante la reproducción del video
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateQuestion}
                disabled={isFormLoading}
                sx={{ 
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                Crear Primera Pregunta
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <QuestionIcon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Preguntas Configuradas ({questions.length})
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleCreateQuestion}
                disabled={isFormLoading}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Agregar Pregunta
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {questions.map((question) => (
                <Grid item xs={12} lg={6} key={question.id}>
                  <QuestionCard
                    question={question}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Stack>

      {/* Diálogo del formulario mejorado */}
      <Dialog
        open={isFormDialogOpen}
        onClose={handleCloseForm}
        maxWidth="lg"
        fullWidth
        disableEscapeKeyDown={isFormLoading}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 3,
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          <QuestionIcon sx={{ fontSize: 28 }} />
          {editingQuestion 
            ? 'Editar Pregunta Interactiva' 
            : 'Crear Nueva Pregunta Interactiva'
          }
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <QuestionForm
            videoItemId={videoItemId}
            initialData={editingQuestion}
            onSubmit={handleSubmitForm}
            onClose={handleCloseForm}
            isLoading={isFormLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación mejorado */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'error.main', 
          fontWeight: 600,
          fontSize: '1.25rem',
          py: 3
        }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ py: 2, fontSize: '1rem' }}>
            ¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.
          </Typography>
          {questionToDelete && (
            <Paper sx={{ 
              p: 3, 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              border: '1px solid',
              borderColor: 'grey.200',
              mt: 2
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Pregunta a eliminar:</strong>
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {questionToDelete.text}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: 2
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteQuestionMutation.isPending}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: 2
            }}
          >
            {deleteQuestionMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Eliminar Pregunta'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal del Generador AI */}
      <AIQuestionGeneratorModal
        open={isAIGeneratorOpen}
        onClose={handleCloseAIGenerator}
        videoItemId={videoItemId}
        onQuestionsGenerated={handleQuestionsGenerated}
      />

      {/* Modal de formulario de preguntas */}
      <QuestionFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        videoDuration={videoDuration}
      />
    </Container>
  );
}; 