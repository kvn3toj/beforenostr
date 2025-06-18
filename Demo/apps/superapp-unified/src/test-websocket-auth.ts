// 🧪 Test Script - Verificación de Autenticación WebSocket
// Script temporal para verificar la integración JWT con WebSocket

import { 
  connectAuthenticatedWebSocket, 
  hasValidAuthForWebSocket,
  getWebSocketService
} from './lib/websocket-service';
import { AUTH_STORAGE_KEYS } from './config/constants';

console.log('🧪 [WebSocket Auth Test] Iniciando verificación...');

// 1. Verificar si hay token válido
console.log('🔑 [Test] Verificando token de autenticación...');
const hasToken = hasValidAuthForWebSocket();
console.log(`Token presente: ${hasToken ? '✅ Sí' : '❌ No'}`);

if (hasToken) {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  console.log(`Token (primeros 20 chars): ${token?.substring(0, 20)}...`);
  
  // 2. Test de conexión autenticada
  console.log('🔌 [Test] Probando conexión autenticada...');
  
  connectAuthenticatedWebSocket()
    .then((connected) => {
      console.log(`✅ [Test] Conexión exitosa: ${connected}`);
      
      // 3. Verificar estado de la conexión
      const service = getWebSocketService();
      const status = service.getStatus();
      console.log('📊 [Test] Estado de conexión:', status);
      
      // 4. Test básico de unirse a sala
      setTimeout(() => {
        console.log('🚪 [Test] Probando unirse a sala de prueba...');
        service.joinRoom('test-auth-room');
        
        // 5. Desconectar después de 5 segundos
        setTimeout(() => {
          console.log('🔌 [Test] Desconectando...');
          service.disconnect();
          console.log('✅ [Test] Test completado');
        }, 5000);
      }, 2000);
    })
    .catch((error) => {
      console.error('❌ [Test] Error en conexión:', error.message);
    });
} else {
  console.log('⚠️ [Test] No hay token - Usuario debe iniciar sesión primero');
}

export {}; 