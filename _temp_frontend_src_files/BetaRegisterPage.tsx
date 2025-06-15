import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Link,
  FormControlLabel,
  Checkbox,
  Container
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { useRegisterMutation } from '../hooks/auth/useRegisterMutation';
import { useAuthStore } from '../store/authStore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

// Fixed: Replaced non-existent EcoIcon with EnergySavingsLeafIcon

interface BetaRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  invitationCode: string;
  fullName: string;
  agreeToTerms: boolean;
  agreeToPhilosophy: boolean;
  cooperativeExperience: string;
  motivationForJoining: string;
}

const steps = [
  'Código de Invitación',
  'Información Personal',
  'Experiencia y Motivación',
  'Términos y Filosofía'
];

export const BetaRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { trackRegistration, trackOnboardingStep } = useAnalytics();
  const registerMutation = useRegisterMutation();
  const { login } = useAuthStore();

  const [activeStep, setActiveStep] = useState(0);
  const [registrationData, setRegistrationData] = useState<BetaRegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: searchParams.get('code') || '',
    fullName: '',
    agreeToTerms: false,
    agreeToPhilosophy: false,
    cooperativeExperience: '',
    motivationForJoining: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invitationValid, setInvitationValid] = useState<boolean | null>(null);

  // Trackear llegada a página de registro beta
  useEffect(() => {
    const source = searchParams.get('source') || 'direct';
    const code = searchParams.get('code') || '';
    
    if (code) {
      trackRegistration(code, source);
    }

    // Trackear inicio del proceso
    trackOnboardingStep('beta_registration_started', true);
  }, [searchParams, trackRegistration, trackOnboardingStep]);

  // Validar código de invitación
  const validateInvitationCode = async (code: string) => {
    if (!code) return false;
    
    try {
      // Aquí iría la validación real con el backend
      // Por ahora, simulamos la validación
      const isValid = code.startsWith('BETA') && code.length >= 8;
      setInvitationValid(isValid);
      
      if (isValid) {
        trackOnboardingStep('invitation_code_validated', true);
      } else {
        trackOnboardingStep('invitation_code_invalid', false);
      }
      
      return isValid;
    } catch (error) {
      setInvitationValid(false);
      return false;
    }
  };

  // Validación por pasos
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Código de invitación
        if (!registrationData.invitationCode) {
          newErrors.invitationCode = 'El código de invitación es requerido';
        }
        if (!invitationValid) {
          newErrors.invitationCode = 'Código de invitación inválido';
        }
        break;

      case 1: // Información personal
        if (!registrationData.fullName) {
          newErrors.fullName = 'El nombre completo es requerido';
        }
        if (!registrationData.email) {
          newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
          newErrors.email = 'Email inválido';
        }
        if (!registrationData.password) {
          newErrors.password = 'La contraseña es requerida';
        } else if (registrationData.password.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        if (registrationData.password !== registrationData.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        break;

      case 2: // Experiencia y motivación
        if (!registrationData.cooperativeExperience) {
          newErrors.cooperativeExperience = 'Por favor describe tu experiencia';
        }
        if (!registrationData.motivationForJoining) {
          newErrors.motivationForJoining = 'Por favor describe tu motivación';
        }
        break;

      case 3: // Términos y filosofía
        if (!registrationData.agreeToTerms) {
          newErrors.agreeToTerms = 'Debes aceptar los términos y condiciones';
        }
        if (!registrationData.agreeToPhilosophy) {
          newErrors.agreeToPhilosophy = 'Debes aceptar la filosofía CoomÜnity';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (activeStep === 0 && registrationData.invitationCode) {
      const isValid = await validateInvitationCode(registrationData.invitationCode);
      if (!isValid) return;
    }

    if (validateStep(activeStep)) {
      trackOnboardingStep(`step_${activeStep + 1}_completed`, true);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      trackOnboardingStep(`step_${activeStep + 1}_failed`, false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      const result = await registerMutation.mutateAsync({
        email: registrationData.email,
        password: registrationData.password,
        name: registrationData.fullName,
        betaCode: registrationData.invitationCode,
        cooperativeExperience: registrationData.cooperativeExperience,
        motivationForJoining: registrationData.motivationForJoining
      });

      // Trackear registro exitoso
      trackOnboardingStep('beta_registration_completed', true);
      
      // Login automático después del registro
      if (result.token) {
        login(result.token, result.user);
        navigate('/beta-onboarding');
      }
    } catch (error) {
      trackOnboardingStep('beta_registration_failed', false);
      setErrors({ general: 'Error al registrarse. Por favor intenta de nuevo.' });
    }
  };

  const updateRegistrationData = (field: keyof BetaRegistrationData, value: string | boolean) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores del campo específico
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              Código de Invitación Beta
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Ingresa tu código de invitación exclusivo para acceder al programa beta de CoomÜnity.
            </Typography>
            <TextField
              fullWidth
              label="Código de Invitación"
              value={registrationData.invitationCode}
              onChange={(e) => updateRegistrationData('invitationCode', e.target.value.toUpperCase())}
              error={!!errors.invitationCode}
              helperText={errors.invitationCode}
              placeholder="BETA-XXXX-XXXX"
              margin="normal"
            />
            {invitationValid === true && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon />
                  Código válido - ¡Bienvenido al programa beta!
                </Box>
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupsIcon color="primary" />
              Información Personal
            </Typography>
            <TextField
              fullWidth
              label="Nombre Completo"
              value={registrationData.fullName}
              onChange={(e) => updateRegistrationData('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={registrationData.email}
              onChange={(e) => updateRegistrationData('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={registrationData.password}
              onChange={(e) => updateRegistrationData('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              value={registrationData.confirmPassword}
              onChange={(e) => updateRegistrationData('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EnergySavingsLeafIcon color="primary" />
              Experiencia y Motivación
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Experiencia en Cooperativismo/Economía Colaborativa"
              value={registrationData.cooperativeExperience}
              onChange={(e) => updateRegistrationData('cooperativeExperience', e.target.value)}
              error={!!errors.cooperativeExperience}
              helperText={errors.cooperativeExperience || "Cuéntanos sobre tu experiencia previa en cooperativas, economía colaborativa, o proyectos comunitarios"}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="¿Por qué quieres unirte a CoomÜnity?"
              value={registrationData.motivationForJoining}
              onChange={(e) => updateRegistrationData('motivationForJoining', e.target.value)}
              error={!!errors.motivationForJoining}
              helperText={errors.motivationForJoining || "Comparte tu motivación para ser parte del cambio hacia una economía del Bien Común"}
              margin="normal"
            />
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Términos y Filosofía CoomÜnity
            </Typography>
            
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" gutterBottom>
                🌱 Principios Fundamentales de CoomÜnity
              </Typography>
              <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                • <strong>Ayni (Reciprocidad):</strong> Intercambio justo y equilibrado de valor<br/>
                • <strong>Bien Común:</strong> Priorizar el beneficio colectivo sobre el individual<br/>
                • <strong>Cooperación:</strong> Colaborar en lugar de competir<br/>
                • <strong>Economía Sagrada:</strong> Relaciones económicas basadas en la confianza y el respeto
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={registrationData.agreeToTerms}
                  onChange={(e) => updateRegistrationData('agreeToTerms', e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los <Link href="/terms" target="_blank">términos y condiciones</Link> y la <Link href="/privacy" target="_blank">política de privacidad</Link>
                </Typography>
              }
            />
            {errors.agreeToTerms && (
              <Typography color="error" variant="caption" display="block">
                {errors.agreeToTerms}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={registrationData.agreeToPhilosophy}
                  onChange={(e) => updateRegistrationData('agreeToPhilosophy', e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  Me comprometo a alinearme con la filosofía CoomÜnity y contribuir al Bien Común
                </Typography>
              }
            />
            {errors.agreeToPhilosophy && (
              <Typography color="error" variant="caption" display="block">
                {errors.agreeToPhilosophy}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              CoomÜnity Beta
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Únete a la transformación hacia una economía del Bien Común
            </Typography>
            <Chip 
              label="PROGRAMA BETA EXCLUSIVO" 
              color="primary" 
              variant="outlined" 
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error general */}
          {errors.general && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.general}
            </Alert>
          )}

          {/* Loading */}
          {registerMutation.isPending && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                Creando tu cuenta...
              </Typography>
            </Box>
          )}

          {/* Step Content */}
          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Anterior
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={registerMutation.isPending}
                size="large"
              >
                Crear Cuenta Beta
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                size="large"
              >
                Siguiente
              </Button>
            )}
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={4}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}; 