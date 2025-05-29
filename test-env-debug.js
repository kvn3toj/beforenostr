// Test para verificar variables de entorno y conectividad básica
console.log('🔍 Verificando variables de entorno...');

// Verificar variables de entorno
console.log('VITE_API_URL:', process.env.VITE_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Verificar si hay archivo .env
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
console.log('📁 Archivo .env existe:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Contenido del .env:');
  console.log(envContent);
}

// Test de conectividad básica
const http = require('http');

function testConnection(url, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data.substring(0, 200) + '...'
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n🌐 Probando conectividad...');
  
  try {
    const mundosResult = await testConnection('localhost:3002', '/mundos');
    console.log('✅ /mundos:', mundosResult.status, mundosResult.data);
  } catch (error) {
    console.log('❌ /mundos:', error.message);
  }

  try {
    const playlistsResult = await testConnection('localhost:3002', '/playlists');
    console.log('✅ /playlists:', playlistsResult.status, playlistsResult.data);
  } catch (error) {
    console.log('❌ /playlists:', error.message);
  }
}

runTests(); 