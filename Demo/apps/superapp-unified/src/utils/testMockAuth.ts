/**
 * 🧪 Utilidad para verificar el funcionamiento del Mock de Autenticación
 * Este archivo ayuda a validar que el mecanismo de mock esté funcionando correctamente
 */

export const checkMockAuthStatus = () => {
  const isMockEnabled = (import.meta as any).env.VITE_ENABLE_MOCK_AUTH === 'true';
  
  console.group('🧪 [Mock Auth Verification]');
  console.log('Environment variable VITE_ENABLE_MOCK_AUTH:', (import.meta as any).env.VITE_ENABLE_MOCK_AUTH);
  console.log('Mock authentication enabled:', isMockEnabled);
  
  if (isMockEnabled) {
    console.log('✅ Mock authentication is ACTIVE');
    console.log('📝 Expected behavior:');
    console.log('  - App should load directly authenticated');
    console.log('  - No login screen should appear');
    console.log('  - Mock user should be available in AuthContext');
    console.log('  - Dev banner should be visible at top');
  } else {
    console.log('❌ Mock authentication is DISABLED');
    console.log('📝 Expected behavior:');
    console.log('  - Normal authentication flow');
    console.log('  - Login screen should appear if not authenticated');
    console.log('  - Real backend authentication required');
  }
  
  console.groupEnd();
  
  return isMockEnabled;
};

export const validateMockUser = (user: any) => {
  if (!user) {
    console.warn('🚫 [Mock Auth] No user found - authentication may have failed');
    return false;
  }
  
  console.group('👤 [Mock User Validation]');
  console.log('User ID:', user.id);
  console.log('Email:', user.email);
  console.log('Name:', user.full_name);
  console.log('Role:', user.role);
  console.log('Token present:', !!user.access_token);
  
  const isMockUser = user.id === 'mock-user-id-coomunity-tester-123';
  
  if (isMockUser) {
    console.log('✅ Mock user correctly loaded');
  } else {
    console.log('⚠️ This appears to be a real user, not the mock user');
  }
  
  console.groupEnd();
  
  return isMockUser;
};

export const logAuthFlowStep = (step: string, details?: any) => {
  console.log(`🔄 [Auth Flow] ${step}`, details || '');
}; 