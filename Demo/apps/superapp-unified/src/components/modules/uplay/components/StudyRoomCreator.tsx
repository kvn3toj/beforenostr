// 🏫 Componente: Creador de Salas de Estudio Compartidas
// Implementa el sistema de salas según UPLAY_ENVIRONMENT_REVIEW.md
// Diseño minimalista pero gráfico y dinámico

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Avatar,
  Card,
  CardContent,
  Grid,
  IconButton,
  Fade,
  Zoom,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  School as SchoolIcon,
  Psychology as PhilosofiaIcon,
  SportsEsports as GamificacionIcon,
  Handshake as ColaboracionIcon,
  Favorite as AyniIcon,
  Public as BienComunIcon,
  Visibility as PublicIcon,
  VisibilityOff as PrivateIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as RewardsIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { StudyRoom, StudyRoomFilters } from '../../../../types/study-rooms';

interface StudyRoomCreatorProps {
  open: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: Partial<StudyRoom>) => Promise<void>;
  isCreating?: boolean;
}

// Configuración de focos de estudio con iconos y colores
const STUDY_FOCUS_CONFIG = {
  filosofia: {
    label: 'Filosofía CoomÜnity',
    icon: PhilosofiaIcon,
    color: '#8b5cf6',
    description: 'Explora los fundamentos filosóficos de la colaboración',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
  gamificacion: {
    label: 'Gamificación',
    icon: GamificacionIcon,
    color: '#10b981',
    description: 'Aprende jugando con mecánicas avanzadas',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  colaboracion: {
    label: 'Colaboración',
    icon: ColaboracionIcon,
    color: '#f59e0b',
    description: 'Fortalece habilidades de trabajo en equipo',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  ayni: {
    label: 'Principio Ayni',
    icon: AyniIcon,
    color: '#ef4444',
    description: 'Reciprocidad y equilibrio en el intercambio',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
  },
  'bien-común': {
    label: 'Bien Común',
    icon: BienComunIcon,
    color: '#3b82f6',
    description: 'Priorizar el beneficio colectivo sobre el individual',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  },
} as const;

export const StudyRoomCreator: React.FC<StudyRoomCreatorProps> = ({
  open,
  onClose,
  onCreateRoom,
  isCreating = false,
}) => {
  const theme = useTheme();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    studyFocus: 'filosofia' as keyof typeof STUDY_FOCUS_CONFIG,
    maxParticipants: 8,
    isPrivate: false,
    chatEnabled: true,
    scheduledStartTime: '',
    description: '',
  });

  const [step, setStep] = useState(1); // Wizard steps: 1=básico, 2=avanzado, 3=confirmación

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const currentFocus = STUDY_FOCUS_CONFIG[formData.studyFocus];

  const handleCreateRoom = useCallback(async () => {
    try {
      const roomData: Partial<StudyRoom> = {
        name: formData.name,
        studyFocus: formData.studyFocus,
        maxParticipants: formData.maxParticipants,
        isPrivate: formData.isPrivate,
        chatEnabled: formData.chatEnabled,
        scheduledStartTime: formData.scheduledStartTime ? new Date(formData.scheduledStartTime) : undefined,
        status: 'waiting',
        totalMeritosEarned: 0,
        totalOndasEarned: 0,
        questionsAnswered: 0,
        averageAccuracy: 0,
      };

      await onCreateRoom(roomData);
      
      // Reset form
      setFormData({
        name: '',
        studyFocus: 'filosofia',
        maxParticipants: 8,
        isPrivate: false,
        chatEnabled: true,
        scheduledStartTime: '',
        description: '',
      });
      setStep(1);
      onClose();
    } catch (error) {
      console.error('Error creating study room:', error);
    }
  }, [formData, onCreateRoom, onClose]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Stack spacing={4}>
            {/* 🎯 Header con diseño gráfico */}
            <Box textAlign="center" mb={2}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: currentFocus.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: `0 8px 32px ${alpha(currentFocus.color, 0.3)}`,
                }}
              >
                <currentFocus.icon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Crear Sala de Estudio
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Conecta con otros jugadores para aprender colaborativamente
              </Typography>
            </Box>

            {/* 🎯 Nombre de la sala */}
            <TextField
              label="Nombre de la Sala"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="ej: Filosofía Ayni - Sesión Matutina"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentFocus.color,
                  },
                },
              }}
            />

            {/* 🎯 Selección de enfoque de estudio - Diseño visual mejorado */}
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Enfoque de Estudio
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(STUDY_FOCUS_CONFIG).map(([key, config]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: formData.studyFocus === key ? `3px solid ${config.color}` : '2px solid transparent',
                        borderRadius: 3,
                        background: formData.studyFocus === key 
                          ? `linear-gradient(135deg, ${alpha(config.color, 0.1)}, ${alpha(config.color, 0.05)})`
                          : 'background.paper',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: formData.studyFocus === key 
                          ? `0 8px 32px ${alpha(config.color, 0.2)}` 
                          : '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 40px ${alpha(config.color, 0.25)}`,
                        },
                      }}
                      onClick={() => handleInputChange('studyFocus', key)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              background: config.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <config.icon sx={{ fontSize: 24, color: 'white' }} />
                          </Box>
                          <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {config.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontSize="12px">
                              {config.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={4}>
            <Typography variant="h6" fontWeight={600} textAlign="center">
              Configuración Avanzada
            </Typography>

            {/* 🎯 Número de participantes con slider visual */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Máximo de Participantes: {formData.maxParticipants}
              </Typography>
              <Box px={2}>
                <Slider
                  value={formData.maxParticipants}
                  onChange={(_, value) => handleInputChange('maxParticipants', value)}
                  min={2}
                  max={20}
                  marks={[
                    { value: 2, label: '2' },
                    { value: 8, label: '8' },
                    { value: 15, label: '15' },
                    { value: 20, label: '20' },
                  ]}
                  sx={{
                    color: currentFocus.color,
                    '& .MuiSlider-mark': {
                      backgroundColor: currentFocus.color,
                    },
                    '& .MuiSlider-markLabel': {
                      color: 'text.secondary',
                      fontSize: '12px',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* 🎯 Opciones de privacidad y chat */}
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!formData.isPrivate}
                    onChange={(e) => handleInputChange('isPrivate', !e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: currentFocus.color,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: currentFocus.color,
                      },
                    }}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    {formData.isPrivate ? <PrivateIcon /> : <PublicIcon />}
                    <Typography variant="body1" fontWeight={600}>
                      {formData.isPrivate ? 'Sala Privada' : 'Sala Pública'}
                    </Typography>
                  </Stack>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.chatEnabled}
                    onChange={(e) => handleInputChange('chatEnabled', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: currentFocus.color,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: currentFocus.color,
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" fontWeight={600}>
                    Habilitar Chat Colaborativo
                  </Typography>
                }
              />
            </Stack>

            {/* 🎯 Programación opcional */}
            <TextField
              label="Programar Inicio (Opcional)"
              type="datetime-local"
              value={formData.scheduledStartTime}
              onChange={(e) => handleInputChange('scheduledStartTime', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentFocus.color,
                  },
                },
              }}
            />
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={4}>
            <Typography variant="h6" fontWeight={600} textAlign="center">
              Confirmar Sala de Estudio
            </Typography>

            {/* 🎯 Preview de la sala con diseño mejorado */}
            <Card
              sx={{
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(currentFocus.color, 0.1)}, ${alpha(currentFocus.color, 0.05)})`,
                border: `2px solid ${alpha(currentFocus.color, 0.3)}`,
                boxShadow: `0 8px 32px ${alpha(currentFocus.color, 0.2)}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: currentFocus.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <currentFocus.icon sx={{ fontSize: 30, color: 'white' }} />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={700}>
                        {formData.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentFocus.label} • {formData.maxParticipants} participantes máx.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      icon={formData.isPrivate ? <PrivateIcon /> : <PublicIcon />}
                      label={formData.isPrivate ? 'Privada' : 'Pública'}
                      size="small"
                      sx={{ 
                        backgroundColor: alpha(currentFocus.color, 0.2),
                        color: currentFocus.color,
                        fontWeight: 600,
                      }}
                    />
                    {formData.chatEnabled && (
                      <Chip
                        label="Chat habilitado"
                        size="small"
                        sx={{ 
                          backgroundColor: alpha('#10b981', 0.2),
                          color: '#10b981',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {formData.scheduledStartTime && (
                      <Chip
                        icon={<ScheduleIcon />}
                        label="Programada"
                        size="small"
                        sx={{ 
                          backgroundColor: alpha('#f59e0b', 0.2),
                          color: '#f59e0b',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>

                  {/* 🎯 Recompensas estimadas */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: alpha('#10b981', 0.1),
                      border: `1px solid ${alpha('#10b981', 0.2)}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <RewardsIcon sx={{ color: '#10b981' }} />
                      <Typography variant="subtitle1" fontWeight={600} color="#10b981">
                        Recompensas Colaborativas Estimadas
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Mëritos por sesión
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#fbbf24">
                          +{Math.floor(formData.maxParticipants * 2)} - {Math.floor(formData.maxParticipants * 5)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Öndas colaborativas
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#10b981">
                          +{Math.floor(formData.maxParticipants * 1)} - {Math.floor(formData.maxParticipants * 3)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Configuración Básica';
      case 2: return 'Configuración Avanzada';
      case 3: return 'Confirmación';
      default: return '';
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim().length > 3;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: '600px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 1,
          background: `linear-gradient(135deg, ${alpha(currentFocus.color, 0.1)}, transparent)`,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box />
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              {getStepTitle()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paso {step} de 3
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Fade in={true} timeout={300}>
          <Box>{renderStepContent()}</Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
        {step > 1 && (
          <Button
            variant="outlined"
            onClick={() => setStep(step - 1)}
            sx={{
              borderColor: currentFocus.color,
              color: currentFocus.color,
              '&:hover': {
                borderColor: currentFocus.color,
                backgroundColor: alpha(currentFocus.color, 0.1),
              },
            }}
          >
            Anterior
          </Button>
        )}
        
        <Box flex={1} />

        {step < 3 ? (
          <Button
            variant="contained"
            onClick={() => setStep(step + 1)}
            disabled={!isStepValid()}
            sx={{
              background: currentFocus.gradient,
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: currentFocus.gradient,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha(currentFocus.color, 0.3)}`,
              },
            }}
          >
            Continuar
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleCreateRoom}
            disabled={isCreating}
            sx={{
              background: currentFocus.gradient,
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: currentFocus.gradient,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha(currentFocus.color, 0.3)}`,
              },
            }}
          >
            {isCreating ? 'Creando...' : 'Crear Sala'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}; 