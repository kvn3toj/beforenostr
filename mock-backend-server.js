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

// Datos mock
const users = [
  {
    id: 1,
    email: 'admin@gamifier.com',
    password: 'admin123',
    name: 'Gamifier Admin',
    roles: ['admin'],
    avatar: null
  },
  {
    id: 2,
    email: 'user@gamifier.com',
    password: '123456',
    name: 'Usuario Regular',
    roles: ['user'],
    avatar: null
  },
  {
    id: 3,
    email: 'premium@gamifier.com',
    password: '123456',
    name: 'Usuario Premium',
    roles: ['user', 'premium'],
    avatar: null
  }
];

const videos = [
  {
    id: 1,
    title: 'Introducción a CoomÜnity',
    description: 'Video introductorio sobre la filosofía Ayni',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 300,
    meritos: 10,
    ondas: 5
  },
  {
    id: 2,
    title: 'Economía Colaborativa',
    description: 'Fundamentos de la economía del bien común',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 450,
    meritos: 15,
    ondas: 8
  }
];

// Utility functions
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
    return res.status(401).json({ message: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CoomÜnity Mock Backend funcionando',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'OK',
      database: 'MOCK',
      api: 'OK'
    }
  });
});

// Authentication
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Login exitoso',
    token,
    user: userWithoutPassword
  });
});

// Get current user
app.get('/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Users
app.get('/users', authenticateToken, (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

app.get('/users/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Videos
app.get('/videos', authenticateToken, (req, res) => {
  res.json(videos);
});

app.get('/videos/:id', authenticateToken, (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).json({ message: 'Video no encontrado' });
  }
  res.json(video);
});

// Analytics
app.get('/analytics/dashboard', authenticateToken, (req, res) => {
  res.json({
    totalUsers: users.length,
    totalVideos: videos.length,
    totalMeritos: 1250,
    totalOndas: 890,
    activeUsers: 2,
    recentActivity: [
      { user: 'Usuario Regular', action: 'Completó video', meritos: 10 },
      { user: 'Usuario Premium', action: 'Participó en marketplace', ondas: 5 }
    ]
  });
});

// Marketplace
app.get('/marketplace/items', authenticateToken, (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Servicio de Consultoría Ayni',
      description: 'Consultoría basada en principios de reciprocidad',
      type: 'service',
      lukas: 50,
      emprendedor: 'Juan Pérez',
      ayniScore: 4.8
    },
    {
      id: 2,
      title: 'Producto Artesanal',
      description: 'Producto hecho con materiales locales',
      type: 'product',
      lukas: 25,
      emprendedor: 'María González',
      ayniScore: 4.5
    }
  ]);
});

// Social
app.get('/social/feed', authenticateToken, (req, res) => {
  res.json([
    {
      id: 1,
      user: 'Usuario Regular',
      content: 'Completé mi primer video sobre Ayni. ¡Increíble filosofía!',
      timestamp: new Date().toISOString(),
      meritos: 10,
      likes: 5
    }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CoomÜnity Mock Backend iniciado en puerto ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Credenciales de prueba:`);
  console.log(`   Admin: admin@gamifier.com / admin123`);
  console.log(`   User: user@gamifier.com / 123456`);
  console.log(`🌟 Ecosistema listo para desarrollo!`);
});

module.exports = app;