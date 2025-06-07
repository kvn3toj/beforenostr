#!/usr/bin/env node

/**
 * CoomÜnity Backend API Server
 * 
 * Express server que sirve APIs para el frontend de CoomÜnity.
 * Separa la lógica de APIs de la servencia de archivos estáticos.
 * 
 * Puerto: 3000 (diferente del frontend en puerto 8080)
 * CORS: Configurado para permitir requests desde http://localhost:8080
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

class CoomUnityBackendServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.dataPath = path.join(__dirname, '..', 'data', 'backups', 'my_recovered_website');
    this.sharedDataPath = path.join(this.dataPath, 'shared', 'data');
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configurar middleware
   */
  setupMiddleware() {
    // Seguridad básica
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false
    }));

    // Compresión
    this.app.use(compression());

    // CORS - permitir requests desde el frontend
    this.app.use(cors({
      origin: [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined'));

    // Request timestamp logging
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      console.log(`🌐 [${timestamp}] ${req.method} ${req.url}`);
      next();
    });
  }

  /**
   * Configurar rutas principales
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        server: 'CoomÜnity Backend API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Rutas API principales
    this.setupPilgrimRoutes();
    this.setupMerchantRoutes();
    this.setupRedPillRoutes();
    this.setupUserRoutes();
    this.setupDataRoutes();
    this.setupFormRoutes();

    // Ruta para servir archivos de datos compartidos
    this.app.get('/api/shared-data/:filename', (req, res) => {
      this.serveSharedDataFile(req, res);
    });

    // Documentación de API
    this.app.get('/api', (req, res) => {
      res.json({
        message: 'CoomÜnity Backend API',
        version: '1.0.0',
        endpoints: {
          health: 'GET /health',
          pilgrim: {
            data: 'GET /api/pilgrim-data',
            profile: 'GET /api/pilgrim/profile',
            journey: 'GET /api/pilgrim/journey',
            quests: 'GET /api/pilgrim/quests'
          },
          merchant: {
            data: 'GET /api/merchant-data',
            profile: 'GET /api/merchant/profile',
            products: 'GET /api/merchant/products',
            matches: 'GET /api/merchant/matches'
          },
          redPill: {
            data: 'GET /api/red-pill-data',
            questions: 'GET /api/red-pill/questions',
            results: 'GET /api/red-pill/results'
          },
          user: {
            profile: 'GET /api/user-profile/:userId',
            preferences: 'GET /api/user/preferences/:userId'
          },
          forms: {
            submit: 'POST /api/submit-form'
          },
          data: {
            shared: 'GET /api/shared-data/:filename',
            recommendations: 'GET /api/data/recommendations'
          }
        }
      });
    });

    // Fallback para rutas no encontradas
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        endpoint: req.originalUrl,
        message: 'The requested API endpoint does not exist',
        availableEndpoints: '/api for documentation'
      });
    });
  }

  /**
   * Rutas para la sección Pilgrim
   */
  setupPilgrimRoutes() {
    // Datos principales de Pilgrim
    this.app.get('/api/pilgrim-data', (req, res) => {
      try {
        const pilgrimData = this.loadMockData('pilgrim');
        res.json(pilgrimData);
      } catch (error) {
        console.error('Error loading pilgrim data:', error);
        res.status(500).json({ error: 'Failed to load pilgrim data' });
      }
    });

    // Perfil del usuario pilgrim
    this.app.get('/api/pilgrim/profile', (req, res) => {
      const mockProfile = {
        id: 'pilgrim_001',
        name: 'Alex Pilgrim',
        avatar: '/assets/img/pilgrim-avatar.jpg',
        level: 5,
        experience: 1250,
        nextLevelExp: 1500,
        title: 'Seeker of Wisdom',
        joinDate: '2024-01-15',
        journey: {
          currentStage: 'exploration',
          completedQuests: 12,
          totalQuests: 20,
          currentPath: 'mindfulness'
        },
        stats: {
          wisdom: 85,
          courage: 92,
          compassion: 78,
          insight: 91
        },
        achievements: [
          { id: 'first_quest', name: 'First Steps', description: 'Completed your first quest' },
          { id: 'wise_owl', name: 'Wise Owl', description: 'Reached wisdom level 80+' }
        ],
        preferences: {
          difficulty: 'intermediate',
          categories: ['self-discovery', 'philosophy', 'meditation']
        }
      };
      res.json(mockProfile);
    });

    // Viaje/progreso del usuario
    this.app.get('/api/pilgrim/journey', (req, res) => {
      const mockJourney = {
        currentPhase: 'Exploration',
        progress: 65,
        milestones: [
          { id: 'awakening', name: 'Awakening', completed: true, date: '2024-01-20' },
          { id: 'questioning', name: 'Questioning', completed: true, date: '2024-02-15' },
          { id: 'exploration', name: 'Exploration', completed: false, progress: 65 },
          { id: 'integration', name: 'Integration', completed: false, progress: 0 }
        ],
        insights: [
          { date: '2024-03-01', content: 'The journey inward is as important as the journey outward' },
          { date: '2024-02-28', content: 'Every challenge is an opportunity for growth' }
        ]
      };
      res.json(mockJourney);
    });

    // Misiones/quests disponibles
    this.app.get('/api/pilgrim/quests', (req, res) => {
      const mockQuests = [
        {
          id: 'quest_001',
          title: 'Discover Your Purpose',
          description: 'Embark on a journey of self-discovery through guided reflection',
          difficulty: 'medium',
          estimatedTime: 30,
          reward: 150,
          status: 'available',
          category: 'self-discovery',
          steps: 5,
          completedSteps: 0
        },
        {
          id: 'quest_002',
          title: 'Help a Fellow Traveler',
          description: 'Assist another pilgrim in their journey by sharing your wisdom',
          difficulty: 'easy',
          estimatedTime: 15,
          reward: 100,
          status: 'completed',
          category: 'compassion',
          steps: 3,
          completedSteps: 3
        },
        {
          id: 'quest_003',
          title: 'Face Your Shadows',
          description: 'Confront and integrate your shadow aspects for personal growth',
          difficulty: 'hard',
          estimatedTime: 60,
          reward: 250,
          status: 'locked',
          category: 'inner-work',
          requirements: ['Complete 5 medium quests']
        }
      ];
      res.json(mockQuests);
    });
  }

  /**
   * Rutas para la sección Merchant
   */
  setupMerchantRoutes() {
    // Datos principales de Merchant
    this.app.get('/api/merchant-data', (req, res) => {
      try {
        const merchantData = this.loadMockData('merchant');
        res.json(merchantData);
      } catch (error) {
        console.error('Error loading merchant data:', error);
        res.status(500).json({ error: 'Failed to load merchant data' });
      }
    });

    // Perfil del merchant
    this.app.get('/api/merchant/profile', (req, res) => {
      const mockProfile = {
        id: 'merchant_001',
        businessName: 'Conscious Commerce Co.',
        owner: 'Maria Merchant',
        avatar: '/assets/img/merchant-avatar.jpg',
        rating: 4.8,
        reviewCount: 142,
        verified: true,
        joinDate: '2023-08-10',
        location: 'Barcelona, Spain',
        category: 'Sustainable Products',
        description: 'Committed to providing ethically sourced, sustainable products that make a positive impact.',
        sales: {
          thisMonth: 15420,
          lastMonth: 12890,
          growth: 19.6,
          currency: 'EUR'
        },
        inventory: {
          totalProducts: 23,
          inStock: 19,
          lowStock: 3,
          outOfStock: 1
        },
        orders: {
          pending: 5,
          processing: 12,
          shipped: 8,
          completed: 156,
          returns: 2
        },
        certifications: [
          'B-Corp Certified',
          'Fair Trade Approved',
          'Organic Certified'
        ]
      };
      res.json(mockProfile);
    });

    // Productos del merchant
    this.app.get('/api/merchant/products', (req, res) => {
      const mockProducts = [
        {
          id: 'prod_001',
          name: 'Eco-Friendly Water Bottle',
          description: 'Sustainable bamboo fiber water bottle',
          price: 24.99,
          currency: 'EUR',
          stock: 15,
          category: 'Eco-Products',
          images: ['/assets/img/products/bottle-1.jpg'],
          rating: 4.6,
          reviews: 23
        },
        {
          id: 'prod_002',
          name: 'Organic Cotton T-Shirt',
          description: 'Comfortable, ethically made cotton t-shirt',
          price: 35.00,
          currency: 'EUR',
          stock: 8,
          category: 'Clothing',
          images: ['/assets/img/products/tshirt-1.jpg'],
          rating: 4.8,
          reviews: 41
        }
      ];
      res.json(mockProducts);
    });

    // Matches/conexiones del merchant
    this.app.get('/api/merchant/matches', (req, res) => {
      const mockMatches = [
        {
          id: 'match_001',
          type: 'customer',
          name: 'Sofia Seeker',
          avatar: '/assets/img/users/sofia.jpg',
          compatibility: 95,
          interests: ['sustainable-living', 'organic-food', 'mindful-consumption'],
          status: 'active',
          connectionDate: '2024-02-20',
          interactionScore: 8.5
        },
        {
          id: 'match_002',
          type: 'partner',
          name: 'Green Earth Collective',
          avatar: '/assets/img/partners/green-earth.jpg',
          compatibility: 87,
          synergy: ['supply-chain', 'shared-values', 'customer-base'],
          status: 'pending',
          connectionDate: '2024-03-01',
          proposal: 'Joint marketing campaign for Earth Day'
        }
      ];
      res.json(mockMatches);
    });
  }

  /**
   * Rutas para la sección Red Pill
   */
  setupRedPillRoutes() {
    // Datos principales de Red Pill
    this.app.get('/api/red-pill-data', (req, res) => {
      try {
        const redPillData = this.loadMockData('red-pill');
        res.json(redPillData);
      } catch (error) {
        console.error('Error loading red pill data:', error);
        res.status(500).json({ error: 'Failed to load red pill data' });
      }
    });

    // Preguntas para el quiz/challenge
    this.app.get('/api/red-pill/questions', (req, res) => {
      const { category, difficulty } = req.query;
      
      const mockQuestions = [
        {
          id: 'q001',
          category: 'critical-thinking',
          difficulty: 'intermediate',
          question: '¿Cuál de las siguientes opciones representa mejor el concepto de "pensamiento independiente"?',
          options: [
            'Seguir siempre la opinión de la mayoría',
            'Cuestionar información y formar juicios propios basados en evidencia',
            'Rechazar automáticamente toda autoridad',
            'Aceptar solo fuentes que confirmen nuestras creencias previas'
          ],
          correctAnswer: 1,
          explanation: 'El pensamiento independiente requiere análisis crítico y evaluación objetiva de la información.',
          timeLimit: 60
        },
        {
          id: 'q002',
          category: 'philosophy',
          difficulty: 'advanced',
          question: '¿Qué representa la metáfora de "la caverna" en la filosofía de Platón?',
          options: [
            'Un lugar físico real donde vivían los antiguos griegos',
            'La transición del mundo de las apariencias al mundo del conocimiento verdadero',
            'Una descripción literal de las condiciones de vida en la antigua Grecia',
            'Un método de construcción arquitectónica'
          ],
          correctAnswer: 1,
          explanation: 'La alegoría de la caverna representa el proceso de iluminación intelectual y la búsqueda de la verdad.',
          timeLimit: 90
        }
      ];

      // Filtrar por categoría y dificultad si se especifican
      let filteredQuestions = mockQuestions;
      if (category) {
        filteredQuestions = filteredQuestions.filter(q => q.category === category);
      }
      if (difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
      }

      res.json({
        questions: filteredQuestions,
        totalCount: filteredQuestions.length,
        filters: { category, difficulty }
      });
    });

    // Resultados y análisis
    this.app.get('/api/red-pill/results', (req, res) => {
      const { sessionId } = req.query;
      
      const mockResults = {
        sessionId: sessionId || 'session_001',
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        timeSpent: 480, // segundos
        categories: {
          'critical-thinking': { score: 90, questions: 4 },
          'philosophy': { score: 80, questions: 3 },
          'logic': { score: 85, questions: 3 }
        },
        level: 'Advanced Thinker',
        insights: [
          'Excelente capacidad de análisis crítico',
          'Fuerte comprensión de conceptos filosóficos',
          'Buena aplicación de principios lógicos'
        ],
        recommendations: [
          'Explora textos filosóficos más avanzados',
          'Practica debates estructurados',
          'Considera estudiar lógica formal'
        ],
        nextSteps: [
          { action: 'Take advanced philosophy course', url: '/courses/advanced-philosophy' },
          { action: 'Join debate community', url: '/community/debates' }
        ]
      };
      
      res.json(mockResults);
    });
  }

  /**
   * Rutas para usuarios
   */
  setupUserRoutes() {
    // Perfil de usuario genérico
    this.app.get('/api/user-profile/:userId', (req, res) => {
      const { userId } = req.params;
      
      const mockProfile = {
        id: userId,
        username: `user_${userId}`,
        displayName: `User ${userId}`,
        email: `user${userId}@coomunity.com`,
        avatar: `/assets/img/avatars/user-${userId}.jpg`,
        joinDate: '2024-01-01',
        status: 'active',
        preferences: {
          language: 'es',
          theme: 'light',
          notifications: {
            email: true,
            push: false,
            sms: false
          }
        },
        stats: {
          totalSessions: 42,
          totalTime: 1250, // minutos
          completedActivities: 18,
          level: 3
        },
        badges: [
          { id: 'newcomer', name: 'Newcomer', earnedDate: '2024-01-01' },
          { id: 'explorer', name: 'Explorer', earnedDate: '2024-01-15' }
        ]
      };
      
      res.json(mockProfile);
    });

    // Preferencias del usuario
    this.app.get('/api/user/preferences/:userId', (req, res) => {
      const { userId } = req.params;
      
      const mockPreferences = {
        userId,
        interface: {
          language: 'es',
          theme: 'light',
          fontSize: 'medium'
        },
        content: {
          difficulty: 'intermediate',
          categories: ['philosophy', 'personal-growth', 'mindfulness'],
          autoplay: false,
          subtitles: true
        },
        privacy: {
          profileVisibility: 'public',
          dataSharing: 'limited',
          analytics: true
        },
        communication: {
          email: true,
          push: false,
          sms: false,
          marketing: false
        }
      };
      
      res.json(mockPreferences);
    });
  }

  /**
   * Rutas para archivos de datos
   */
  setupDataRoutes() {
    // Recomendaciones (archivo principal de datos)
    this.app.get('/api/data/recommendations', (req, res) => {
      try {
        const recommendationsPath = path.join(this.sharedDataPath, 'mock-recommendations.json');
        if (fs.existsSync(recommendationsPath)) {
          const data = fs.readFileSync(recommendationsPath, 'utf8');
          const recommendations = JSON.parse(data);
          res.json(recommendations);
        } else {
          res.status(404).json({ error: 'Recommendations file not found' });
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
        res.status(500).json({ error: 'Failed to load recommendations' });
      }
    });
  }

  /**
   * Rutas para formularios
   */
  setupFormRoutes() {
    // Endpoint genérico para envío de formularios
    this.app.post('/api/submit-form', (req, res) => {
      const { formType, data, timestamp } = req.body;
      
      // Log del formulario recibido
      console.log('📝 Form submission received:');
      console.log('Type:', formType);
      console.log('Timestamp:', timestamp || new Date().toISOString());
      console.log('Data:', JSON.stringify(data, null, 2));
      
      // Respuesta simulada
      const response = {
        success: true,
        message: 'Form submitted successfully',
        formId: `form_${Date.now()}`,
        timestamp: new Date().toISOString(),
        formType,
        status: 'processed'
      };
      
      // Simular diferentes respuestas según el tipo de formulario
      switch (formType) {
        case 'contact':
          response.message = 'Thank you for contacting us. We will get back to you soon.';
          break;
        case 'registration':
          response.message = 'Registration completed successfully. Please check your email.';
          response.userId = `user_${Date.now()}`;
          break;
        case 'feedback':
          response.message = 'Thank you for your feedback. Your input is valuable to us.';
          break;
        case 'quiz-response':
          response.message = 'Quiz response recorded successfully.';
          response.score = Math.floor(Math.random() * 100);
          break;
        default:
          response.message = 'Form submitted successfully.';
      }
      
      res.json(response);
    });
  }

  /**
   * Servir archivo de datos compartidos
   */
  serveSharedDataFile(req, res) {
    const { filename } = req.params;
    const filePath = path.join(this.sharedDataPath, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } else {
        res.status(404).json({
          error: 'File not found',
          filename,
          path: filePath,
          message: `The requested data file '${filename}' was not found`
        });
      }
    } catch (error) {
      console.error(`Error serving shared data file ${filename}:`, error);
      res.status(500).json({
        error: 'Failed to load data file',
        filename,
        message: error.message
      });
    }
  }

  /**
   * Cargar datos mock para una sección
   */
  loadMockData(section) {
    // En una implementación real, esto cargaría datos específicos
    // Por ahora, retornamos datos mock básicos
    const mockData = {
      section,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        message: `Mock data for ${section} section`,
        features: ['feature1', 'feature2', 'feature3'],
        status: 'active'
      }
    };
    
    return mockData;
  }

  /**
   * Configurar manejo de errores
   */
  setupErrorHandling() {
    // Manejo de errores 404
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `The requested resource '${req.originalUrl}' was not found`,
        timestamp: new Date().toISOString()
      });
    });

    // Manejo de errores generales
    this.app.use((err, req, res, next) => {
      console.error('Server Error:', err);
      
      res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Iniciar el servidor
   */
  start() {
    this.app.listen(this.port, () => {
      console.log('\n🚀 CoomÜnity Backend API Server');
      console.log('=====================================');
      console.log(`🌐 Server running on: http://localhost:${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
      console.log(`📚 API docs: http://localhost:${this.port}/api`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📁 Data path: ${this.dataPath}`);
      console.log('=====================================\n');
      
      // Test de carga de datos
      this.testDataAccess();
    });

    // Manejo de cierre graceful
    process.on('SIGTERM', this.shutdown.bind(this));
    process.on('SIGINT', this.shutdown.bind(this));
  }

  /**
   * Test de acceso a datos
   */
  testDataAccess() {
    try {
      const recommendationsPath = path.join(this.sharedDataPath, 'mock-recommendations.json');
      if (fs.existsSync(recommendationsPath)) {
        console.log('✅ Mock recommendations data file found');
      } else {
        console.log('⚠️  Mock recommendations data file not found at:', recommendationsPath);
      }
    } catch (error) {
      console.error('❌ Error testing data access:', error.message);
    }
  }

  /**
   * Cierre graceful del servidor
   */
  shutdown() {
    console.log('\n🔄 Shutting down CoomÜnity Backend API Server...');
    process.exit(0);
  }
}

// Iniciar el servidor si este archivo se ejecuta directamente
if (require.main === module) {
  const server = new CoomUnityBackendServer();
  server.start();
}

module.exports = CoomUnityBackendServer; 