/**
 * SECURITY UTILITIES - SUPERAPP COOMUNITY
 * Implementa medidas de seguridad básicas siguiendo mejores prácticas
 * Basado en OWASP Security Guidelines
 */

import DOMPurify from 'dompurify';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove potential XSS vectors
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
};

// Email validation with security considerations
export const validateEmail = (email: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email es requerido');
    return { isValid: false, errors };
  }

  // Basic format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    errors.push('Formato de email inválido');
  }

  // Length validation
  if (email.length > 254) {
    errors.push('Email demasiado largo');
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /<.*>/,
    /[<>'"]/
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    errors.push('Email contiene caracteres no válidos');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
  score: number;
} => {
  const errors: string[] = [];
  let score = 0;

  if (!password) {
    return {
      isValid: false,
      strength: 'weak',
      errors: ['Contraseña es requerida'],
      score: 0
    };
  }

  // Length check
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 2;

  // Common password patterns to avoid
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('La contraseña es demasiado común');
    score -= 2;
  }

  // Sequential characters check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Evita repetir el mismo carácter');
    score -= 1;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (score < 3) {
    strength = 'weak';
  } else if (score < 6) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: password.length >= 8 && score >= 3,
    strength,
    errors,
    score: Math.max(0, score)
  };
};

// Phone number validation
export const validatePhoneNumber = (phone: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Número de teléfono es requerido');
    return { isValid: false, errors };
  }

  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Basic format validation
  const phoneRegex = /^[+]?[1-9]\d{6,14}$/;
  if (!phoneRegex.test(cleanPhone)) {
    errors.push('Formato de teléfono inválido');
  }

  // Length validation
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    errors.push('Longitud de teléfono inválida');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name validation (first name, last name)
export const validateName = (name: string, fieldName: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push(`${fieldName} es requerido`);
    return { isValid: false, errors };
  }

  // Length validation
  if (name.length < 2) {
    errors.push(`${fieldName} debe tener al menos 2 caracteres`);
  }

  if (name.length > 50) {
    errors.push(`${fieldName} es demasiado largo`);
  }

  // Character validation (only letters, spaces, and common accents)
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
    errors.push(`${fieldName} solo puede contener letras`);
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/i,
    /[<>]/,
    /\d{3,}/, // Multiple consecutive numbers
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(name))) {
    errors.push(`${fieldName} contiene caracteres no válidos`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate CSRF token
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate CSRF token format
export const validateCSRFToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Should be 64 character hex string
  return /^[a-f0-9]{64}$/.test(token);
};

// Rate limiting helper (client-side basic implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove expired attempts
    const validAttempts = attempts.filter(attempt => now - attempt < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    const validAttempts = attempts.filter(attempt => now - attempt < this.windowMs);
    
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }

  getNextResetTime(identifier: string): Date | null {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return null;
    
    const oldestAttempt = Math.min(...attempts);
    return new Date(oldestAttempt + this.windowMs);
  }


  /**
   * Records a failed attempt for rate limiting
   * @param identifier - Usually email or IP address
   */
  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove expired attempts
    const validAttempts = attempts.filter(attempt => now - attempt < this.windowMs);
    
    // Add this failed attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    console.log(`🚫 [RateLimiter] Failed attempt recorded for: ${identifier}. Total attempts: ${validAttempts.length}/${this.maxAttempts}`);
  }
}

// Security headers helper for client-side verification
export const checkSecurityHeaders = async (url: string): Promise<{
  hasHTTPS: boolean;
  hasCSP: boolean;
  hasXFrameOptions: boolean;
  recommendations: string[];
}> => {
  const recommendations: string[] = [];
  
  // Check HTTPS
  const hasHTTPS = url.startsWith('https://');
  if (!hasHTTPS) {
    recommendations.push('Implementar HTTPS para comunicaciones seguras');
  }

  // Note: Cannot check response headers from client-side due to CORS
  // These would need to be verified server-side
  
  return {
    hasHTTPS,
    hasCSP: false, // Would need server-side verification
    hasXFrameOptions: false, // Would need server-side verification
    recommendations
  };
};

// Content Security Policy helper
export const generateCSPDirectives = (): string => {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.coomunity.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'"
  ];
  
  return directives.join('; ');
};

// Security validation for form data
export const validateFormSecurity = (formData: Record<string, any>): {
  isSecure: boolean;
  issues: string[];
  sanitizedData: Record<string, any>;
} => {
  const issues: string[] = [];
  const sanitizedData: Record<string, any> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Check for potential XSS
      if (/<script|javascript:|data:|vbscript:/i.test(value)) {
        issues.push(`Campo ${key} contiene contenido potencialmente peligroso`);
      }
      
      // Sanitize the value
      sanitizedData[key] = sanitizeInput(value);
    } else {
      sanitizedData[key] = value;
    }
  }

  return {
    isSecure: issues.length === 0,
    issues,
    sanitizedData
  };
};

export default {
  sanitizeInput,
  validateEmail,
  validatePasswordStrength,
  validatePhoneNumber,
  validateName,
  generateCSRFToken,
  validateCSRFToken,
  RateLimiter,
  checkSecurityHeaders,
  generateCSPDirectives,
  validateFormSecurity
};