#!/usr/bin/env node

/**
 * Servidor Local para CoomÜnity Website Recuperado
 * 
 * Servidor Express que sirve archivos estáticos y proporciona APIs mockeadas
 * para que el frontend funcione completamente sin backend real.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

class CoomUnityLocalServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.staticDir = path.join(__dirname, 'my_recovered_website');
    this.apiRoutes = new Map();
    
    this.setupMiddleware();
    this.setupApiMocks();
    this.setupStaticRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configurar middleware básico
   */
  setupMiddleware() {
    // CORS habilitado para desarrollo
    this.app.use(cors({
      origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
      credentials: true
    }));

    // Parser JSON para requests API
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging de requests
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${req.method} ${req.url}`);
      next();
    });

    // Headers de seguridad básicos
    this.app.use((req, res, next) => {
      res.header('X-Content-Type-Options', 'nosniff');
      res.header('X-Frame-Options', 'DENY');
      res.header('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  /**
   * Configurar rutas API mockeadas
   */
  setupApiMocks() {
    console.log('🔧 Configurando APIs mockeadas...');

    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        server: 'CoomÜnity Local Mock Server',
        sections: ['pilgrim', 'merchant', 'red-pill']
      });
    });

    // API endpoints para Pilgrim
    this.setupPilgrimApis();

    // API endpoints para Merchant
    this.setupMerchantApis();

    // API endpoints para Red Pill
    this.setupRedPillApis();

    // API genérica para archivos de datos
    this.app.get('/api/data/:section/:filename', (req, res) => {
      this.serveDataFile(req, res);
    });

    // Fallback para rutas API no encontradas
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        endpoint: req.originalUrl,
        availableEndpoints: Array.from(this.apiRoutes.keys()),
        suggestion: 'Check the available endpoints or verify the URL'
      });
    });
  }

  /**
   * APIs específicas para la sección Pilgrim
   */
  setupPilgrimApis() {
    // Datos del usuario pilgrim
    this.app.get('/api/pilgrim/profile', (req, res) => {
      const mockProfile = {
        id: 'pilgrim_001',
        name: 'Alex Pilgrim',
        level: 5,
        experience: 1250,
        journey: {
          currentStage: 'exploration',
          completedQuests: 12,
          totalQuests: 20
        },
        stats: {
          wisdom: 85,
          courage: 92,
          compassion: 78
        }
      };
      res.json(mockProfile);
    });

    // Misiones disponibles
    this.app.get('/api/pilgrim/quests', (req, res) => {
      const mockQuests = [
        {
          id: 'quest_001',
          title: 'Discover Your Purpose',
          description: 'Embark on a journey of self-discovery',
          difficulty: 'medium',
          reward: 150,
          status: 'available'
        },
        {
          id: 'quest_002',
          title: 'Help a Fellow Traveler',
          description: 'Assist another pilgrim in their journey',
          difficulty: 'easy',
          reward: 100,
          status: 'completed'
        }
      ];
      res.json(mockQuests);
    });

    this.apiRoutes.set('/api/pilgrim/profile', 'Pilgrim user profile');
    this.apiRoutes.set('/api/pilgrim/quests', 'Available quests for pilgrim');
  }

  /**
   * APIs específicas para la sección Merchant
   */
  setupMerchantApis() {
    // Datos del merchant
    this.app.get('/api/merchant/profile', (req, res) => {
      const mockProfile = {
        id: 'merchant_001',
        businessName: 'Conscious Commerce Co.',
        owner: 'Maria Merchant',
        rating: 4.8,
        sales: {
          thisMonth: 15420,
          lastMonth: 12890,
          growth: 19.6
        },
        products: 23,
        orders: {
          pending: 5,
          processing: 12,
          completed: 156
        }
      };
      res.json(mockProfile);
    });

    // Matches/conexiones del merchant
    this.app.get('/api/merchant/matches', (req, res) => {
      const mockMatches = [
        {
          id: 'match_001',
          type: 'customer',
          name: 'Sofia Seeker',
          compatibility: 95,
          interests: ['sustainable-living', 'organic-food'],
          status: 'active'
        },
        {
          id: 'match_002',
          type: 'partner',
          name: 'Green Earth Collective',
          compatibility: 87,
          synergy: ['supply-chain', 'shared-values'],
          status: 'pending'
        }
      ];
      res.json(mockMatches);
    });

    // Productos del merchant
    this.app.get('/api/merchant/products', (req, res) => {
      const mockProducts = [
        {
          id: 'prod_001',
          name: 'Eco-Friendly Water Bottle',
          price: 25.99,
          category: 'sustainability',
          stock: 45,
          rating: 4.7
        },
        {
          id: 'prod_002',
          name: 'Organic Cotton T-Shirt',
          price: 32.50,
          category: 'clothing',
          stock: 23,
          rating: 4.9
        }
      ];
      res.json(mockProducts);
    });

    this.apiRoutes.set('/api/merchant/profile', 'Merchant business profile');
    this.apiRoutes.set('/api/merchant/matches', 'Customer and partner matches');
    this.apiRoutes.set('/api/merchant/products', 'Merchant product catalog');
  }

  /**
   * APIs específicas para la sección Red Pill
   */
  setupRedPillApis() {
    // Estado del journey
    this.app.get('/api/red-pill/journey/:sessionId?', (req, res) => {
      const sessionId = req.params.sessionId || 'session_' + Date.now();
      const mockJourney = {
        sessionId: sessionId,
        currentStep: 'initial',
        progress: 0,
        choices: [],
        insights: [],
        timeSpent: 0,
        paths: {
          available: ['left', 'right'],
          taken: []
        }
      };
      res.json(mockJourney);
    });

    // Actualizar progreso del journey
    this.app.post('/api/red-pill/journey/:sessionId/choice', (req, res) => {
      const sessionId = req.params.sessionId;
      const choice = req.body;
      
      console.log(`Journey choice for session ${sessionId}:`, choice);
      
      const mockResponse = {
        sessionId: sessionId,
        choiceRecorded: choice,
        nextStep: choice.path === 'left' ? 'left_path' : 'right_path',
        insight: {
          title: 'New Perspective Unlocked',
          description: `You chose the ${choice.path} path, revealing new insights about your journey.`
        },
        progress: Math.min((choice.step || 0) * 20, 100)
      };
      
      res.json(mockResponse);
    });

    // Videos disponibles
    this.app.get('/api/red-pill/videos', (req, res) => {
      const mockVideos = [
        {
          id: 'video_001',
          title: 'The Choice',
          url: '/sections/red-pill/assets/videos/choice_intro.mp4',
          duration: 120,
          triggers: ['video_ended', 'choice_point']
        },
        {
          id: 'video_002',
          title: 'Left Path Revelation',
          url: '/sections/red-pill/assets/videos/left_path.mp4',
          duration: 95,
          triggers: ['insight_unlocked']
        }
      ];
      res.json(mockVideos);
    });

    this.apiRoutes.set('/api/red-pill/journey/:sessionId?', 'Red pill journey state');
    this.apiRoutes.set('/api/red-pill/videos', 'Available journey videos');
  }

  /**
   * Servir archivos de datos desde las secciones
   */
  serveDataFile(req, res) {
    const { section, filename } = req.params;
    const dataPath = path.join(this.staticDir, 'sections', section, 'assets', 'data', filename);
    
    if (fs.existsSync(dataPath)) {
      try {
        const data = fs.readFileSync(dataPath, 'utf-8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (error) {
        console.error(`Error parsing JSON file ${dataPath}:`, error);
        res.status(500).json({
          error: 'Failed to parse data file',
          file: filename,
          details: error.message
        });
      }
    } else {
      res.status(404).json({
        error: 'Data file not found',
        section: section,
        filename: filename,
        path: dataPath
      });
    }
  }

  /**
   * Configurar rutas para archivos estáticos
   */
  setupStaticRoutes() {
    console.log('📁 Configurando servido de archivos estáticos...');

    // Servir archivos estáticos desde my_recovered_website
    this.app.use(express.static(this.staticDir, {
      maxAge: '1d',
      etag: true,
      index: ['index.html']
    }));

    // Ruta raíz redirige a public/
    this.app.get('/', (req, res) => {
      res.redirect('/public/');
    });

    // SPA fallback para rutas de secciones
    this.app.get('/sections/*', (req, res, next) => {
      const filePath = path.join(this.staticDir, req.path);
      
      if (fs.existsSync(filePath)) {
        next(); // Archivo existe, continuar con express.static
      } else {
        // Intentar servir index.html de la sección
        const sectionPath = req.path.split('/').slice(0, 3).join('/'); // /sections/pilgrim
        const indexPath = path.join(this.staticDir, sectionPath, 'index.html');
        
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).sendFile(path.join(this.staticDir, 'public', 'index.html'));
        }
      }
    });
  }

  /**
   * Configurar manejo de errores
   */
  setupErrorHandling() {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Resource not found',
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        suggestion: 'Check the URL or visit /api/health for server status'
      });
    });

    // Error handler general
    this.app.use((error, req, res, next) => {
      console.error('Server error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Iniciar el servidor
   */
  start() {
    // Verificar que el directorio estático existe
    if (!fs.existsSync(this.staticDir)) {
      console.error(`❌ Error: Directorio estático no encontrado: ${this.staticDir}`);
      console.log('💡 Asegúrate de ejecutar el script de unificación primero:');
      console.log('   npx ts-node unify-coomunity-website.ts');
      process.exit(1);
    }

    this.app.listen(this.port, () => {
      console.log('\n🚀 CoomÜnity Local Server iniciado exitosamente!');
      console.log(`📍 Servidor disponible en: http://localhost:${this.port}`);
      console.log(`📁 Sirviendo archivos desde: ${this.staticDir}`);
      console.log('\n🌐 Enlaces útiles:');
      console.log(`   • Página principal: http://localhost:${this.port}/public/`);
      console.log(`   • Pilgrim Demo: http://localhost:${this.port}/sections/pilgrim/`);
      console.log(`   • Merchant Demo: http://localhost:${this.port}/sections/merchant/`);
      console.log(`   • Red Pill Demo: http://localhost:${this.port}/sections/red-pill/`);
      console.log(`   • API Health: http://localhost:${this.port}/api/health`);
      console.log('\n📡 APIs mockeadas disponibles:');
      for (const [route, description] of this.apiRoutes) {
        console.log(`   • ${route} - ${description}`);
      }
      console.log('\n✋ Presiona Ctrl+C para detener el servidor');
    });
  }
}

// Iniciar servidor si se ejecuta directamente
if (require.main === module) {
  const server = new CoomUnityLocalServer();
  server.start();
}

module.exports = { CoomUnityLocalServer }; 