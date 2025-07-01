/**
 * 🚀 PÁGINA DE REGISTRO BETA COOMÜNITY
 * Flujo de registro exclusivo para el programa beta con código de invitación
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  Security,
  Celebration,
  QuestionAnswer,
  Email,
  Code,
  Person,
  Psychology,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { useAnalytics } from '../lib/analytics';

// Tipos para el formulario de registro beta
interface BetaRegistrationData {
  invitationCode: string;
  email: string;
  fullName: string;
  country: string;
  experience: string;
  motivation: string;
  philosophyAnswers: {
    reciprocidad: string;
    bienComun: string;
    cooperacion: string;
  };
  acceptTerms: boolean;
  joinDiscord: boolean;
}

// Preguntas filosóficas para evaluar alineación
const PHILOSOPHY_QUESTIONS = [
  {
    key: 'reciprocidad',
    question: '¿Qué significa para ti la Reciprocidad Consciente?',
    placeholder: 'Comparte tu comprensión sobre dar y recibir de manera equilibrada...'
  },
  {
    key: 'bienComun',
    question: '¿Cómo priorizas el Bien Común sobre el beneficio individual?',
    placeholder: 'Describe una experiencia donde elegiste el beneficio colectivo...'
  },
  {
    key: 'cooperacion',
    question: '¿Qué papel juega la cooperación en la construcción de un mundo mejor?',
    placeholder: 'Explica tu visión sobre la colaboración como motor de cambio...'
  }
];

const STEPS = [
  'Código de Invitación',
  'Datos Personales',
  'Quiz Filosófico',
  'Confirmación'
];

const BetaRegister: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);

  const [formData, setFormData] = useState<BetaRegistrationData>({
    invitationCode: searchParams.get('invite') || '',
    email: '',
    fullName: '',
    country: '',
    experience: '',
    motivation: '',
    philosophyAnswers: {
      reciprocidad: '',
      bienComun: '',
      cooperacion: '',
    },
    acceptTerms: false,
    joinDiscord: false,
  });

  // Track página view al cargar
  useEffect(() => {
    trackEvent({
      event_name: 'beta_register_page_view',
      module: 'core',
      action: 'page_view',
      custom_parameters: {
        has_invite_code: !!formData.invitationCode,
        source: searchParams.get('source') || 'direct',
      }
    });
  }, [trackEvent, formData.invitationCode, searchParams]);

  // Validar código de invitación
  const validateInvitationCode = async (code: string): Promise<boolean> => {
    setLoading(true);

    try {
      // Simular validación de código (en producción sería API call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validación básica de formato
      const isValid = code.startsWith('BETA-') && code.length === 13;

      if (isValid) {
        setCodeValidated(true);
        trackEvent({
          event_name: 'beta_code_validated',
          module: 'core',
          action: 'code_validation',
          custom_parameters: { code_format: 'valid' }
        });
        toast.success('¡Código de invitación válido! 🎉');
        return true;
      } else {
        trackEvent({
          event_name: 'beta_code_invalid',
          module: 'core',
          action: 'code_validation',
          custom_parameters: { code_format: 'invalid', code_attempted: code }
        });
        toast.error('Código de invitación inválido');
        return false;
      }
    } catch (error) {
      toast.error('Error al validar código');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Manejar siguiente paso
  const handleNext = async () => {
    if (activeStep === 0) {
      // Validar código antes de continuar
      if (!formData.invitationCode) {
        toast.error('Por favor ingresa tu código de invitación');
        return;
      }

      const isValid = await validateInvitationCode(formData.invitationCode);
      if (!isValid) return;
    }

    if (activeStep === 1) {
      // Validar datos personales
      if (!formData.email || !formData.fullName || !formData.country) {
        toast.error('Por favor completa todos los campos obligatorios');
        return;
      }

      trackEvent({
        event_name: 'beta_personal_data_completed',
        module: 'core',
        action: 'form_step_completed',
        custom_parameters: { step: 'personal_data' }
      });
    }

    if (activeStep === 2) {
      // Validar respuestas filosóficas
      const { reciprocidad, bienComun, cooperacion } = formData.philosophyAnswers;
      if (!reciprocidad || !bienComun || !cooperacion) {
        toast.error('Por favor responde todas las preguntas filosóficas');
        return;
      }

      if (!formData.acceptTerms) {
        toast.error('Debes aceptar los términos y condiciones');
        return;
      }

      trackEvent({
        event_name: 'beta_philosophy_quiz_completed',
        module: 'core',
        action: 'quiz_completed',
        custom_parameters: {
          step: 'philosophy',
          answers_length: reciprocidad.length + bienComun.length + cooperacion.length
        }
      });
    }

    setActiveStep(prev => prev + 1);
  };

  // Manejar paso anterior
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Enviar registro final
  const handleSubmitRegistration = async () => {
    setLoading(true);

    try {
      // Simular envío de registro (en producción sería API call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      trackEvent({
        event_name: 'beta_registration_completed',
        module: 'core',
        action: 'registration_success',
        custom_parameters: {
          invitation_code: formData.invitationCode,
          country: formData.country,
          join_discord: formData.joinDiscord,
        }
      });

      toast.success('¡Registro completado exitosamente! 🎉');

      // Redirigir al login o dashboard
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Registro beta completado. ¡Bienvenido a CoomÜnity!',
            email: formData.email
          }
        });
      }, 2000);

    } catch (error) {
      toast.error('Error al completar registro');
      trackEvent({
        event_name: 'beta_registration_error',
        module: 'core',
        action: 'registration_error',
        custom_parameters: { error: 'submission_failed' }
      });
    } finally {
      setLoading(false);
    }
  };

  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={3}>
            <Box textAlign="center">
              <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Código de Invitación Exclusivo
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ingresa el código único que recibiste en tu invitación
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Código de Invitación"
              placeholder="BETA-XXXXXXXX"
              value={formData.invitationCode}
              onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value.toUpperCase() })}
              InputProps={{
                startAdornment: <Code sx={{ mr: 1, color: 'primary.main' }} />,
              }}
              helperText="El código tiene formato: BETA-XXXXXXXX"
              disabled={loading}
            />

            {codeValidated && (
              <Alert severity="success" icon={<CheckCircle />}>
                ¡Código validado! Estás invitado al programa beta de CoomÜnity 🌱
              </Alert>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Box textAlign="center">
              <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Datos Personales
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ayúdanos a conocerte mejor
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nombre Completo"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'primary.main' }} />,
              }}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>País/Región</InputLabel>
              <Select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                label="País/Región"
              >
                <MenuItem value="AR">Argentina</MenuItem>
                <MenuItem value="BR">Brasil</MenuItem>
                <MenuItem value="CL">Chile</MenuItem>
                <MenuItem value="CO">Colombia</MenuItem>
                <MenuItem value="ES">España</MenuItem>
                <MenuItem value="MX">México</MenuItem>
                <MenuItem value="PE">Perú</MenuItem>
                <MenuItem value="US">Estados Unidos</MenuItem>
                <MenuItem value="UY">Uruguay</MenuItem>
                <MenuItem value="OTHER">Otro</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Experiencia con Cooperativas/Economía Colaborativa"
              multiline
              rows={3}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="Describe tu experiencia previa con cooperativas, economía solidaria, etc."
            />

            <TextField
              fullWidth
              label="¿Qué te motiva a unirte a CoomÜnity?"
              multiline
              rows={3}
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="Comparte qué esperas lograr con CoomÜnity..."
            />
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Box textAlign="center">
              <Psychology sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                <QuestionAnswer sx={{ mr: 1, verticalAlign: 'middle' }} />
                Quiz Filosófico
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tus respuestas nos ayudan a construir una comunidad alineada con nuestros valores.
              </Typography>
              {PHILOSOPHY_QUESTIONS.map(({ key, question, placeholder }) => (
                <TextField
                  key={key}
                  fullWidth
                  multiline
                  rows={3}
                  label={question}
                  placeholder={placeholder}
                  value={formData.philosophyAnswers[key as keyof typeof formData.philosophyAnswers]}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      philosophyAnswers: {
                        ...prev.philosophyAnswers,
                        [key]: e.target.value,
                      },
                    }))
                  }
                  sx={{ mb: 3 }}
                />
              ))}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Acepto los términos y condiciones del programa beta y la filosofía CoomÜnity
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.joinDiscord}
                    onChange={(e) => setFormData({ ...formData, joinDiscord: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Quiero unirme al Discord de beta testers para colaborar directamente
                  </Typography>
                }
              />
            </Box>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3} alignItems="center">
            <Celebration sx={{ fontSize: 64, color: 'success.main' }} />
            <Typography variant="h3" textAlign="center" color="success.main">
              ¡Bienvenido a CoomÜnity!
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Tu registro beta ha sido completado exitosamente
            </Typography>

            <Paper sx={{ p: 3, bgcolor: 'primary.light', width: '100%', maxWidth: 500 }}>
              <Typography variant="h6" gutterBottom>
                📋 Resumen de tu registro:
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Código de Invitación:</Typography>
                  <Chip label={formData.invitationCode} size="small" color="primary" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Email:</Typography>
                  <Typography variant="body2">{formData.email}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">País:</Typography>
                  <Typography variant="body2">{formData.country}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Discord:</Typography>
                  <Chip
                    label={formData.joinDiscord ? 'Sí, me uno' : 'No por ahora'}
                    size="small"
                    color={formData.joinDiscord ? 'success' : 'default'}
                  />
                </Box>
              </Stack>
            </Paper>

            <Alert severity="info" sx={{ width: '100%' }}>
              <Typography variant="body2">
                📧 Recibirás un email con las instrucciones para acceder a la plataforma y unirte a nuestra comunidad beta.
              </Typography>
            </Alert>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card sx={{ maxWidth: 800, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        {loading && <LinearProgress />}

        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h2" gutterBottom sx={{
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              CoomÜnity
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Programa Beta Exclusivo
            </Typography>
            <Chip
              label="Invitación Especial"
              color="primary"
              sx={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ minHeight: 400 }}>
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
            >
              Anterior
            </Button>

            <Box sx={{ flex: '1 1 auto' }} />

            {activeStep === STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmitRegistration}
                disabled={loading}
                size="large"
                sx={{ minWidth: 160 }}
              >
                {loading ? 'Procesando...' : 'Finalizar Registro'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                size="large"
                sx={{ minWidth: 120 }}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BetaRegister;
