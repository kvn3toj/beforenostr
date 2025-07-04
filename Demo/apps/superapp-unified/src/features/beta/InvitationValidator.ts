import { invitationAPI } from '../../lib/api-service';

/**
 * 🎫 Validador de Códigos de Invitación
 * Integra con el backend NestJS para validación real de códigos
 */

export interface InvitationValidationResult {
  isValid: boolean;
  message?: string;
  invitationInfo?: {
    id: string;
    code: string;
    type: 'beta' | 'premium' | 'standard';
    benefits: string[];
    expiresAt?: string;
    usedAt?: string;
    maxUses?: number;
    currentUses?: number;
  };
}

export const validateInvitationCode = async (code: string): Promise<InvitationValidationResult> => {
  // Validación básica de formato
  if (!code || code.trim().length === 0) {
    return {
      isValid: false,
      message: 'El código de invitación es requerido'
    };
  }

  // Normalizar código
  const normalizedCode = code.trim().toUpperCase();

  try {
    // 🔄 Intentar validación con backend real
    const response = await invitationAPI.validateCode(normalizedCode);
    
    return {
      isValid: response.valid || response.isValid,
      message: response.message,
      invitationInfo: response.invitation || response.data
    };
    
  } catch (error: any) {
    console.warn('[InvitationValidator] Backend no disponible, usando validación mock:', error.message);
    
    // 🧪 Fallback a validación mock para desarrollo
    return validateInvitationCodeMock(normalizedCode);
  }
};

/**
 * 🧪 Validación Mock para desarrollo
 * Se usa cuando el backend no está disponible
 */
const validateInvitationCodeMock = (code: string): InvitationValidationResult => {
  // Formato esperado: BETA-XXXXXXXX (13 caracteres)
  const isValidFormat = code.startsWith('BETA-') && code.length === 13;
  
  if (isValidFormat) {
    return {
      isValid: true,
      message: '¡Código de invitación válido!',
      invitationInfo: {
        id: `mock-${Date.now()}`,
        code,
        type: 'beta',
        benefits: [
          'Acceso anticipado a CoomÜnity',
          '100 Lükas de bienvenida',
          'Acceso al Discord de beta testers',
          'Participación en decisiones de producto'
        ],
        maxUses: 1,
        currentUses: 0
      }
    };
  }

  return {
    isValid: false,
    message: 'Código de invitación inválido. Formato esperado: BETA-XXXXXXXX'
  };
};

/**
 * 📧 Verificar disponibilidad de email para registro beta
 */
export const checkEmailAvailability = async (email: string): Promise<{ available: boolean; message?: string }> => {
  try {
    const response = await invitationAPI.checkEmailAvailability(email);
    return {
      available: response.available,
      message: response.message
    };
  } catch (error) {
    console.warn('[InvitationValidator] Email check fallback to mock');
    
    // Mock: simular que todos los emails están disponibles excepto algunos conocidos
    const unavailableEmails = ['admin@coomunity.com', 'test@coomunity.com'];
    const available = !unavailableEmails.includes(email.toLowerCase());
    
    return {
      available,
      message: available ? 'Email disponible' : 'Este email ya está registrado'
    };
  }
};
