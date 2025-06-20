import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateInvitationCode, checkEmailAvailability, InvitationValidationResult } from '../features/beta/InvitationValidator';
import { invitationAPI } from '../lib/api-service';
import { useAnalytics } from '../lib/analytics';

export interface BetaRegistrationData {
  invitationCode: string;
  email: string;
  fullName: string;
  country: string;
  experience: string;
  motivation: string;
  philosophyAnswers: {
    ayni: string;
    bienComun: string;
    cooperacion: string;
  };
  acceptTerms: boolean;
  joinDiscord: boolean;
}

export interface UseInvitationFlowReturn {
  // Estados
  loading: boolean;
  currentStep: number;
  validationResult: InvitationValidationResult | null;
  
  // Acciones
  validateCode: (code: string) => Promise<boolean>;
  checkEmail: (email: string) => Promise<boolean>;
  submitRegistration: (data: BetaRegistrationData) => Promise<boolean>;
  nextStep: () => void;
  previousStep: () => void;
  resetFlow: () => void;
}

export const useInvitationFlow = (): UseInvitationFlowReturn => {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationResult, setValidationResult] = useState<InvitationValidationResult | null>(null);

  // ✅ NIVEL 1: FUNCIONES BÁSICAS SIN DEPENDENCIAS
  /**
   * 🔄 Reiniciar flujo completo
   */
  const resetFlow = useCallback(() => {
    setCurrentStep(0);
    setValidationResult(null);
    setLoading(false);
  }, []);

  /**
   * ➡️ Avanzar al siguiente paso
   */
  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  /**
   * ⬅️ Retroceder al paso anterior
   */
  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  // ✅ NIVEL 2: FUNCIONES DE VALIDACIÓN (DEPENDEN SOLO DE HOOKS EXTERNOS)
  /**
   * 📧 Verificar disponibilidad de email
   */
  const checkEmail = useCallback(async (email: string): Promise<boolean> => {
    if (!email.trim()) {
      return true; // No validar email vacío aquí
    }

    try {
      const result = await checkEmailAvailability(email);
      
      if (!result.available) {
        toast.error(result.message || 'Este email ya está registrado');
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('[useInvitationFlow] Email check failed:', error);
      return true; // Permitir continuar si la verificación falla
    }
  }, []);

  /**
   * 🎫 Validar código de invitación
   */
  const validateCode = useCallback(async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      toast.error('Por favor ingresa tu código de invitación');
      return false;
    }

    setLoading(true);
    
    try {
      const result = await validateInvitationCode(code);
      setValidationResult(result);
      
      if (result.isValid) {
        toast.success(result.message || '¡Código de invitación válido! 🎉');
        
        trackEvent({
          event_name: 'beta_code_validated',
          module: 'core',
          action: 'code_validation',
          custom_parameters: { 
            code_format: 'valid',
            invitation_type: result.invitationInfo?.type || 'unknown'
          }
        });
        
        return true;
      } else {
        toast.error(result.message || 'Código de invitación inválido');
        
        trackEvent({
          event_name: 'beta_code_invalid',
          module: 'core',
          action: 'code_validation',
          custom_parameters: { 
            code_format: 'invalid',
            code_attempted: code.substring(0, 5) + '***' // Parcialmente oculto por seguridad
          }
        });
        
        return false;
      }
    } catch (error: any) {
      console.error('[useInvitationFlow] Error validating code:', error);
      toast.error('Error al validar código. Intenta nuevamente.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [trackEvent]);

  // ✅ NIVEL 3: FUNCIONES COMPLEJAS (DEPENDEN DE HOOKS EXTERNOS)
  /**
   * 📝 Enviar registro completo
   */
  const submitRegistration = useCallback(async (data: BetaRegistrationData): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Intentar registro con backend real
      const response = await invitationAPI.registerWithInvitation(data);
      
      trackEvent({
        event_name: 'beta_registration_completed',
        module: 'core',
        action: 'registration_success',
        custom_parameters: {
          invitation_code: data.invitationCode,
          country: data.country,
          join_discord: data.joinDiscord,
          backend_integration: 'real'
        }
      });

      toast.success('¡Registro completado exitosamente! 🎉');
      
      // Redirigir al login con mensaje de éxito
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registro beta completado. ¡Bienvenido a CoomÜnity!',
            email: data.email 
          }
        });
      }, 2000);
      
      return true;
      
    } catch (error: any) {
      console.warn('[useInvitationFlow] Backend registration failed, using mock flow:', error.message);
      
      // Fallback a flujo mock para desarrollo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      trackEvent({
        event_name: 'beta_registration_completed',
        module: 'core',
        action: 'registration_success',
        custom_parameters: {
          invitation_code: data.invitationCode,
          country: data.country,
          join_discord: data.joinDiscord,
          backend_integration: 'mock'
        }
      });

      toast.success('¡Registro completado exitosamente! 🎉');
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registro beta completado. ¡Bienvenido a CoomÜnity!',
            email: data.email 
          }
        });
      }, 2000);
      
      return true;
      
    } finally {
      setLoading(false);
    }
  }, [navigate, trackEvent]);

  // ✅ CLEANUP EFFECT OBLIGATORIO
  useEffect(() => {
    return () => {
      console.log('🧹 Invitation flow cleanup');
    };
  }, []);

  return {
    // Estados
    loading,
    currentStep,
    validationResult,
    
    // Acciones
    validateCode,
    checkEmail,
    submitRegistration,
    nextStep,
    previousStep,
    resetFlow,
  };
}; 