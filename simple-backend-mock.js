const http = require('http');
const url = require('url');

const PORT = 3002;

// Base de datos mock
const users = [
  {
    id: 1,
    email: 'admin@gamifier.com',
    password: 'admin123',
    name: 'Gamifier Admin',
    roles: ['admin'],
    meritos: 1000,
    lukas: 500
  },
  {
    id: 2,
    email: 'user@gamifier.com',
    password: '123456',
    name: 'Usuario Regular',
    roles: ['user'],
    meritos: 250,
    lukas: 100
  }
];

// Token simple (sin JWT para evitar dependencias)
const generateToken = (user) => {
  return Buffer.from(JSON.stringify({
    userId: user.id,
    email: user.email,
    roles: user.roles,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  })).toString('base64');
};

const verifyToken = (token) => {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.exp < Date.now()) {
      return null; // Token expirado
    }
    return decoded;
  } catch {
    return null;
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Helper para responder JSON
  const respondJSON = (data, statusCode = 200) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Helper para leer body
  const readBody = (callback) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        callback(JSON.parse(body || '{}'));
      } catch {
        callback({});
      }
    });
  };

  console.log(`${method} ${path}`);

  // Rutas
  if (path === '/health' && method === 'GET') {
    respondJSON({
      status: 'ok',
      service: 'CoomÜnity Backend Mock Simple',
      port: PORT,
      timestamp: new Date().toISOString(),
      ecosystem: {
        backend: '✅ FUNCIONANDO',
        admin: '✅ CONECTADO',
        superapp: '✅ CONECTADO'
      }
    });

  } else if (path === '/auth/login' && method === 'POST') {
    readBody((body) => {
      const { email, password } = body;
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        respondJSON({ message: 'Credenciales incorrectas' }, 401);
        return;
      }
      
      const token = generateToken(user);
      const userResponse = { ...user };
      delete userResponse.password;
      
      console.log(`✅ Login exitoso: ${email}`);
      
      respondJSON({
        message: 'Login exitoso',
        user: userResponse,
        access_token: token
      });
    });

  } else if (path === '/auth/me' && method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      respondJSON({ message: 'Token requerido' }, 401);
      return;
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      respondJSON({ message: 'Token inválido' }, 403);
      return;
    }
    
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      respondJSON({ message: 'Usuario no encontrado' }, 404);
      return;
    }
    
    const userResponse = { ...user };
    delete userResponse.password;
    respondJSON(userResponse);

  } else if (path === '/users' && method === 'GET') {
    const usersResponse = users.map(u => {
      const user = { ...u };
      delete user.password;
      return user;
    });
    
    respondJSON({
      data: usersResponse,
      count: usersResponse.length
    });

  } else if (path === '/video-items' && method === 'GET') {
    respondJSON({
      data: [
        {
          id: 1,
          title: 'Introducción a CoomÜnity',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Video introductorio',
          duration: 300,
          meritos: 50
        }
      ],
      count: 1
    });

  } else if (path === '/challenges' && method === 'GET') {
    respondJSON({
      data: [
        {
          id: 1,
          title: 'Primer Paso',
          description: 'Completa tu primer video',
          reward: 100
        }
      ],
      count: 1
    });

  } else if (path === '/marketplace/items' && method === 'GET') {
    respondJSON({
      data: [
        {
          id: 1,
          title: 'Servicio Ayni',
          price: 150,
          currency: 'lukas',
          seller: 'Emprendedor Confiable'
        }
      ],
      count: 1
    });

  } else if (path === '/analytics/dashboard' && method === 'GET') {
    respondJSON({
      totalUsers: users.length,
      totalVideos: 1,
      totalChallenges: 1,
      engagement: {
        activeUsers: users.length - 1,
        completedChallenges: 1
      }
    });

  } else {
    // 404 para rutas no encontradas
    respondJSON({
      message: 'Endpoint no encontrado',
      method: method,
      path: path,
      availableEndpoints: [
        'GET /health',
        'POST /auth/login',
        'GET /auth/me',
        'GET /users',
        'GET /video-items',
        'GET /challenges',
        'GET /marketplace/items',
        'GET /analytics/dashboard'
      ]
    }, 404);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 BACKEND MOCK SIMPLE INICIADO`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n🔐 Credenciales:`);
  users.forEach(user => {
    console.log(`   ${user.email} / ${user.password} (${user.roles.join(', ')})`);
  });
  console.log(`\n✅ Backend mock simple listo\n`);
});

module.exports = server;