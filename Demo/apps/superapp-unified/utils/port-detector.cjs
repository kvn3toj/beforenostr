const { execSync } = require('child_process');
const net = require('net');

/**
 * Detecta el puerto activo de la SuperApp CoomÜnity
 * Busca procesos de Vite que contengan "superapp" o "coomunity-superapp"
 */
async function detectSuperAppPort() {
  try {
    // Método 1: Buscar procesos de Vite relacionados con SuperApp
    const processes = execSync('ps aux | grep -E "(vite|superapp)" | grep -v grep', { encoding: 'utf8' });
    
    // Buscar líneas que contengan información de puerto
    const lines = processes.split('\n');
    for (const line of lines) {
      // Buscar patrones como "localhost:3005" o "3005/"
      const portMatch = line.match(/localhost:(\d{4})|:(\d{4})\//);
      if (portMatch) {
        const port = parseInt(portMatch[1] || portMatch[2]);
        if (port >= 3000 && port <= 3020) {
          // Verificar que el puerto esté realmente activo
          const isActive = await checkPortActive(port);
          if (isActive) {
            console.log(`🎯 Puerto SuperApp detectado: ${port}`);
            return port;
          }
        }
      }
    }

    // Método 2: Verificar puertos comunes en orden (priorizando 3001)
    const commonPorts = [3001, 3000, 3003, 3005, 3006, 3007, 3008, 3009, 3010];
    for (const port of commonPorts) {
      const isActive = await checkPortActive(port);
      if (isActive) {
        // Verificar que sea realmente la SuperApp haciendo una petición HTTP
        const isSuperApp = await checkIfSuperApp(port);
        if (isSuperApp) {
          console.log(`🎯 Puerto SuperApp detectado (método 2): ${port}`);
          return port;
        }
      }
    }

    // Puerto por defecto si no se encuentra nada
    console.log('⚠️  No se pudo detectar puerto activo, usando 3001 por defecto');
    return 3001;

  } catch (error) {
    console.log('⚠️  Error detectando puerto:', error.message);
    return 3001;
  }
}

/**
 * Verifica si un puerto está activo
 */
function checkPortActive(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => resolve(false));
      server.close();
    });
    
    server.on('error', () => resolve(true));
  });
}

/**
 * Verifica si el puerto corresponde a la SuperApp haciendo una petición HTTP
 */
async function checkIfSuperApp(port) {
  try {
    const response = await fetch(`http://localhost:${port}`);
    const text = await response.text();
    
    // Buscar indicadores de que es la SuperApp CoomÜnity
    return text.includes('CoomÜnity') || 
           text.includes('SuperApp') || 
           text.includes('coomunity') ||
           text.includes('vite') ||
           text.includes('React');
  } catch (error) {
    return false;
  }
}

// Función de prueba para ejecutar directamente
async function testPortDetection() {
  console.log('🚀 Iniciando prueba de detección de puerto...');
  const port = await detectSuperAppPort();
  console.log(`✅ Resultado: Puerto ${port}`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testPortDetection();
}

module.exports = { detectSuperAppPort }; 