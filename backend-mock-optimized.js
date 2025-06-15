const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Configuración
const PORT = 3002;
const JWT_SECRET = 'gamifier_jwt_secret_key_2025';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Base de datos mock en memoria
const users = [
  {
    id: 1,
    email: 'admin@gamifier.com',
    password: 'admin123',
    name: 'Gamifier Admin',
    roles: ['admin'],
    avatar: null,
    meritos: 1000,
    lukas: 500
  },
  {
    id: 2,
    email: 'user@gamifier.com',
    password: '123456',
    name: 'Usuario Regular',
    roles: ['user'],
    avatar: null,
    meritos: 250,
    lukas: 100
  },
  {
    id: 3,
    email: 'premium@gamifier.com',
    password: '123456',
    name: 'Usuario Premium',
    roles: ['user', 'premium'],
    avatar: null,
    meritos: 750,
    lukas: 300
  }
];

const videos = [
  {
    id: 1,
    title: 'Introducción a CoomÜnity',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Video introductorio al ecosistema CoomÜnity',
    duration: 300,
    meritos: 50
  },
  {
    id: 2,
    title: 'Filosofía Ayni',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Principios de reciprocidad en CoomÜnity',
    duration: 450,
    meritos: 75
  }
];

const challenges = [
  {
    id: 1,
    title: 'Primer Paso en CoomÜnity',
    description: 'Completa tu primer video',
    reward: 100,
    type: 'video_completion'
  }
];

// Utilidades
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      roles: user.roles 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// RUTAS PRINCIPALES

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'CoomÜnity Backend Mock',
    port: PORT,
    timestamp: new Date().toISOString(),
    ecosystem: {
      backend: '✅ FUNCIONANDO',
      admin: '✅ CONECTADO',
      superapp: '✅ CONECTADO'
    }
  });
});

// Autenticación
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log(`🔐 Login attempt: ${email}`);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log(`❌ Login failed for: ${email}`);
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
  
  const token = generateToken(user);
  const userResponse = { ...user };
  delete userResponse.password;
  
  console.log(`✅ Login successful for: ${email} (roles: ${user.roles.join(', ')})`);
  
  res.json({
    message: 'Login exitoso',
    user: userResponse,
    access_token: token
  });
});

app.get('/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  
  const userResponse = { ...user };
  delete userResponse.password;
  
  res.json(userResponse);
});

// Usuarios
app.get('/users', authenticateToken, (req, res) => {
  const usersResponse = users.map(u => {
    const user = { ...u };
    delete user.password;
    return user;
  });
  
  res.json({
    data: usersResponse,
    count: usersResponse.length
  });
});

// Videos y Contenido
app.get('/video-items', (req, res) => {
  res.json({
    data: videos,
    count: videos.length
  });
});

app.get('/playlists', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        title: 'Introducción a CoomÜnity',
        description: 'Playlist de introducción',
        videos: videos
      }
    ],
    count: 1
  });
});

// Challenges
app.get('/challenges', (req, res) => {
  res.json({
    data: challenges,
    count: challenges.length
  });
});

// Analytics
app.get('/analytics/dashboard', authenticateToken, (req, res) => {
  res.json({
    totalUsers: users.length,
    totalVideos: videos.length,
    totalChallenges: challenges.length,
    engagement: {
      activeUsers: users.length - 1,
      completedChallenges: Math.floor(challenges.length * 0.7)
    }
  });
});

// Marketplace
app.get('/marketplace/items', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        title: 'Servicio de Consultoría Ayni',
        price: 150,
        currency: 'lukas',
        seller: 'Emprendedor Confiable',
        category: 'services'
      },
      {
        id: 2,
        title: 'Producto Artesanal CoomÜnity',
        price: 50,
        currency: 'lukas',
        seller: 'Artesano Local',
        category: 'products'
      }
    ],
    count: 2
  });
});

// Social
app.get('/social/publications', authenticateToken, (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        content: 'Bienvenidos a CoomÜnity! 🌟',
        author: users[0].name,
        likes: 15,
        comments: 3,
        createdAt: new Date().toISOString()
      }
    ],
    count: 1
  });
});

// Estadísticas de usuario
app.get('/wallets/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  res.json({
    lukas: user?.lukas || 0,
    meritos: user?.meritos || 0,
    ondas: Math.floor(Math.random() * 100)
  });
});

// Grupos
app.get('/groups', authenticateToken, (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        name: 'CoomÜnity Global',
        description: 'Grupo principal de la comunidad',
        members: users.length,
        type: 'public'
      }
    ],
    count: 1
  });
});

// Notifications
app.get('/notifications/user/:userId', authenticateToken, (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        title: 'Bienvenido a CoomÜnity',
        message: 'Tu journey de transformación comienza aquí',
        type: 'welcome',
        read: false,
        createdAt: new Date().toISOString()
      }
    ],
    count: 1
  });
});

// Catch all para debugging
app.use('*', (req, res) => {
  console.log(`📡 Endpoint no encontrado: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Endpoint no encontrado', 
    method: req.method, 
    path: req.originalUrl,
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
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('❌ Error en el servidor:', error);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: error.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 BACKEND MOCK COOMUNITY INICIADO`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🎮 Ecosistema listo para desarrollo`);
  console.log(`\n🔐 Credenciales disponibles:`);
  users.forEach(user => {
    console.log(`   ${user.email} / ${user.password} (${user.roles.join(', ')})`);
  });
  console.log(`\n✅ Backend mock completamente funcional\n`);
});

module.exports = app;