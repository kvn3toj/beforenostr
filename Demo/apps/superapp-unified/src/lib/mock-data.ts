/**
 * 🟡 Catálogo de Datos Mock - Sistema Completo CoomÜnity
 *
 * Proporciona datos falsos realistas para simular respuestas de la API cuando
 * VITE_ENABLE_MOCK_AUTH está activado. Permite desarrollo y pruebas completas
 * del frontend sin necesidad de un backend en funcionamiento.
 *
 * 🚨 ACTIVADO TEMPORALMENTE PARA PRUEBAS DE USUARIO
 * Resolverá problemas del backend en producción mientras se configuran los servidores
 */
import { type User } from '../services/auth.service';

// 👤 Usuario Mock
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'test@coomunity.com',
  name: 'Jugador CoomÜnity',
  avatarUrl: 'https://i.pravatar.cc/150?u=mock-user',
  roles: ['user'],
  permissions: ['content:read', 'marketplace:read', 'wallet:read'],
};

// 🔑 Token Mock
const MOCK_TOKEN = 'mock-jwt-token-string-for-testing-purposes';

// 🛒 Datos Mock del Marketplace - GMP Gamified Match Place
const MOCK_MARKETPLACE_ITEMS = [
  {
    id: 'item-1',
    title: 'Clases de Filosofía Andina - Ayni y Reciprocidad',
    description: 'Sesiones personalizadas sobre filosofía andina, enfocadas en el concepto de Ayni y su aplicación en la vida moderna. Aprende de la sabiduría ancestral.',
    fullDescription: 'Sumérgete en la profunda sabiduría de los pueblos andinos y descubre cómo aplicar el principio del Ayni (reciprocidad) en tu vida cotidiana. Estas sesiones incluyen meditaciones guiadas, ejercicios prácticos y herramientas para desarrollar una perspectiva más consciente del intercambio energético.',
    type: 'SERVICE',
    price: 150,
    originalPrice: 200,
    currency: 'LUKAS',
    category: 'Educación',
    subcategory: 'Filosofía',
    tags: ['filosofía', 'ayni', 'educación', 'cultura andina', 'sabiduría ancestral'],
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
    mainImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    seller: {
      id: 'seller-1',
      name: 'María Elena Quispe',
      username: '@maria_ancestral',
      firstName: 'María Elena',
      lastName: 'Quispe',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      verified: true,
      rating: 4.9,
      reviewCount: 87,
      responseTime: '< 2 horas',
      responseRate: 98,
      isOnline: true,
      isActive: true,
      allowMessages: true,
      memberSince: '2021-03-10',
      location: 'La Paz, Bolivia',
      trustLevel: 'EMPRENDEDOR_CONFIABLE',
      meritos: 2800,
      badges: ['Verificado', 'Emprendedor Confiable'],
      contactMethods: ['message', 'video-call'],
    },
    location: 'Online - Videoconferencia',
    rating: 4.9,
    reviewCount: 87,
    reviews: [
      {
        id: 'review-1',
        userId: 'user-1',
        userName: 'Carlos M.',
        rating: 5,
        comment: 'Experiencia transformadora. María Elena tiene un don especial para transmitir la sabiduría ancestral.',
        date: '2024-01-15',
        verified: true
      }
    ],
    status: 'active',
    featured: true,
    trending: false,
    urgent: false,
    is24Hours: false,
    hasVideo: true,
    viewCount: 245,
    favoriteCount: 32,
    shareCount: 18,
    discount: 25,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    publishedAt: '2024-01-15',
    serviceType: 'online',
    deliveryOptions: [
      {
        id: 'delivery-1',
        name: 'Sesión Online',
        description: 'Videoconferencia de 90 minutos',
        price: 0,
        estimatedTime: '1-2 días'
      }
    ],
    availability: {
      available: true,
      nextAvailable: '2024-02-01'
    },
    ayniScore: 95,
    bienComunScore: 92,
    impactLevel: 'regional',
    sustainabilityScore: 88
  },
  {
    id: 'item-2',
    title: 'Quinoa Orgánica Premium - Cosecha 2024',
    description: 'Quinoa orgánica de alta calidad, cultivada en los Andes bolivianos siguiendo métodos tradicionales y principios de agricultura regenerativa.',
    fullDescription: 'Nuestra quinoa proviene de cooperativas de agricultores bolivianos que mantienen vivas las tradiciones ancestrales de cultivo. Certificada orgánica, libre de pesticidas y cultivada a más de 3800 metros de altura, donde las condiciones naturales producen granos de excepcional calidad nutricional.',
    type: 'PRODUCT',
    price: 25,
    currency: 'ONDAS',
    category: 'Alimentos',
    subcategory: 'Granos',
    tags: ['quinoa', 'orgánico', 'alimentos', 'saludable', 'andes', 'fair-trade'],
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    mainImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    seller: {
      id: 'seller-2',
      name: 'Cooperativa Aynit Uyani',
      username: '@coop_quinoa',
      firstName: 'Cooperativa',
      lastName: 'Aynit Uyani',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      verified: true,
      rating: 4.8,
      reviewCount: 156,
      responseTime: '< 4 horas',
      responseRate: 95,
      isOnline: false,
      isActive: true,
      allowMessages: true,
      memberSince: '2020-08-20',
      location: 'Oruro, Bolivia',
      trustLevel: 'EMPRENDEDOR_CONFIABLE',
      meritos: 3200,
      badges: ['Verificado', 'Comercio Justo', 'Orgánico Certificado'],
      contactMethods: ['message', 'phone'],
    },
    location: 'Oruro, Bolivia',
    rating: 4.8,
    reviewCount: 156,
    status: 'active',
    featured: true,
    trending: true,
    viewCount: 512,
    favoriteCount: 78,
    shareCount: 34,
         createdAt: '2024-01-10',
     updatedAt: '2024-01-18',
     deliveryOptions: [
      {
        id: 'delivery-2',
        name: 'Envío Nacional',
        description: 'Entrega en 3-5 días hábiles',
        price: 5,
        estimatedTime: '3-5 días'
      }
    ],
    availability: {
      available: true,
      quantity: 50,
      reservations: 5
    },
    ayniScore: 94,
    bienComunScore: 96,
    impactLevel: 'global',
    sustainabilityScore: 95
  },
  {
    id: 'item-3',
    title: 'Experiencia de Meditación y Reconexión Natura',
    description: 'Sesión grupal de meditación y prácticas de reconexión con la naturaleza basadas en sabiduría ancestral y técnicas de mindfulness.',
    fullDescription: 'Una experiencia transformadora que combina técnicas milenarias de meditación con prácticas de conexión con la naturaleza. Incluye ejercicios de respiración consciente, caminata meditativa y ritual de gratitud hacia la Pachamama.',
    type: 'EXPERIENCE',
    price: 35,
    currency: 'LUKAS',
    category: 'Bienestar',
    subcategory: 'Meditación',
    tags: ['meditación', 'naturaleza', 'ancestral', 'reconexión', 'bienestar', 'mindfulness'],
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    seller: {
      id: 'seller-3',
      name: 'Centro Wasi Pacha',
      username: '@wasi_pacha',
      firstName: 'Centro',
      lastName: 'Wasi Pacha',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      verified: true,
      rating: 5.0,
      reviewCount: 234,
      responseTime: '< 1 hora',
      responseRate: 100,
      isOnline: true,
      isActive: true,
      allowMessages: true,
      memberSince: '2019-05-15',
      location: 'Valle Sagrado, Cusco',
      trustLevel: 'EMPRENDEDOR_CONFIABLE',
      meritos: 4500,
      badges: ['Verificado', 'Centro Autorizado', 'Maestro Certificado'],
      contactMethods: ['message', 'video-call', 'whatsapp'],
    },
    location: 'Valle Sagrado, Cusco',
    rating: 5.0,
    reviewCount: 234,
    status: 'active',
    featured: true,
    trending: false,
    viewCount: 834,
    favoriteCount: 145,
    shareCount: 67,
         createdAt: '2024-01-05',
     updatedAt: '2024-01-19',
     serviceType: 'in-person',
    deliveryOptions: [
      {
        id: 'delivery-3',
        name: 'Experiencia Presencial',
        description: 'Sesión de 3 horas en Valle Sagrado',
        price: 0,
        estimatedTime: 'Horarios disponibles'
      }
    ],
    availability: {
      available: true,
      nextAvailable: '2024-01-25'
    },
    ayniScore: 98,
    bienComunScore: 97,
    impactLevel: 'regional',
    sustainabilityScore: 92
  },
  {
    id: 'item-4',
    title: 'Desarrollo Web con Tecnologías Conscientes',
    description: 'Creación de sitios web y aplicaciones usando tecnologías modernas, diseñados con principios de sostenibilidad digital y accesibilidad universal.',
    fullDescription: 'Desarrollo completo de aplicaciones web usando React, Node.js y bases de datos sostenibles. Incluye optimización para reducir la huella de carbono digital, diseño accesible universal y arquitectura escalable. Perfecto para emprendimientos conscientes.',
    type: 'SERVICE',
    price: 450,
    originalPrice: 650,
    currency: 'LUKAS',
    category: 'Tecnología',
    subcategory: 'Desarrollo Web',
    tags: ['desarrollo', 'web', 'react', 'nodejs', 'sostenible', 'accesible'],
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'],
    mainImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    seller: {
      id: 'seller-4',
      name: 'Alex Rodriguez',
      username: '@alexdev_consciente',
      firstName: 'Alex',
      lastName: 'Rodriguez',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      verified: true,
      rating: 4.9,
      reviewCount: 67,
      responseTime: '< 30 min',
      responseRate: 100,
      isOnline: true,
      isActive: true,
      allowMessages: true,
      memberSince: '2022-02-14',
      location: 'Medellín, Colombia',
      trustLevel: 'EMPRENDEDOR_CONFIABLE',
      meritos: 2100,
      badges: ['Verificado', 'Top Developer', 'Sostenible'],
      contactMethods: ['message', 'video-call', 'email'],
    },
    location: 'Online - Remoto',
    rating: 4.9,
    reviewCount: 67,
    status: 'active',
    featured: true,
    trending: true,
    urgent: false,
    is24Hours: true,
    hasVideo: true,
    viewCount: 892,
    favoriteCount: 156,
    shareCount: 89,
    discount: 31,
         createdAt: '2024-01-12',
     updatedAt: '2024-01-21',
     serviceType: 'online',
    deliveryOptions: [
      {
        id: 'delivery-4',
        name: 'Proyecto Completo',
        description: 'Entrega en 15-30 días',
        price: 0,
        estimatedTime: '15-30 días'
      }
    ],
    availability: {
      available: true,
      nextAvailable: '2024-02-01'
    },
    ayniScore: 91,
    bienComunScore: 89,
    impactLevel: 'global',
    sustainabilityScore: 94
  },
  {
    id: 'item-5',
    title: 'Intercambio de Habilidades: Permacultura por Diseño',
    description: 'Ofrezco 20 horas de enseñanza en permacultura y agricultura regenerativa a cambio de servicios de diseño gráfico para mi emprendimiento.',
    fullDescription: 'Propuesta de intercambio Ayni: Comparto mi conocimiento de 15 años en permacultura, incluyendo diseño de sistemas alimentarios, compostaje avanzado y técnicas de agua, a cambio de diseño de identidad visual y materiales gráficos para mi proyecto de agricultura regenerativa.',
    type: 'SKILL_EXCHANGE',
    price: 0,
    currency: 'MERITOS',
    category: 'Intercambio',
    subcategory: 'Habilidades',
    tags: ['permacultura', 'diseño', 'intercambio', 'ayni', 'agricultura', 'regenerativo'],
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'],
    mainImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    seller: {
      id: 'seller-5',
      name: 'Pedro Huanca',
      username: '@pedro_permacultor',
      firstName: 'Pedro',
      lastName: 'Huanca',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      verified: true,
      rating: 4.7,
      reviewCount: 43,
      responseTime: '< 6 horas',
      responseRate: 92,
      isOnline: false,
      isActive: true,
      allowMessages: true,
      memberSince: '2021-09-30',
      location: 'Cochabamba, Bolivia',
      trustLevel: 'EMPRENDEDOR_CONFIABLE',
      meritos: 1800,
      badges: ['Verificado', 'Permacultor Certificado'],
      contactMethods: ['message', 'whatsapp'],
    },
    location: 'Cochabamba, Bolivia',
    rating: 4.7,
    reviewCount: 43,
    status: 'active',
    featured: false,
    trending: true,
    viewCount: 267,
    favoriteCount: 89,
    shareCount: 23,
         createdAt: '2024-01-08',
     updatedAt: '2024-01-20',
     serviceType: 'hybrid',
    deliveryOptions: [
      {
        id: 'delivery-5',
        name: 'Intercambio Progresivo',
        description: 'Sesiones de 4 horas semanales',
        price: 0,
        estimatedTime: '5 semanas'
      }
    ],
    availability: {
      available: true,
      nextAvailable: '2024-02-05'
    },
    ayniScore: 100,
    bienComunScore: 95,
    impactLevel: 'local',
    sustainabilityScore: 98
  }
];

// 💰 Datos Mock del Wallet
const MOCK_WALLET_DATA = {
  lukas: {
    balance: 1250,
    currency: 'LUKAS',
    transactions: [
      {
        id: 'tx-1',
        type: 'received',
        amount: 150,
        description: 'Pago por sesión de filosofía andina',
        date: '2024-01-20',
        fromUser: 'María Elena Q.'
      },
      {
        id: 'tx-2',
        type: 'sent',
        amount: 25,
        description: 'Compra de quinoa orgánica',
        date: '2024-01-18',
        toUser: 'Cooperativa Aynit'
      }
    ]
  },
  ondas: {
    balance: 2800,
    currency: 'ONDAS',
    transactions: [
      {
        id: 'tx-3',
        type: 'received',
        amount: 100,
        description: 'Öndas por contribución al Bien Común',
        date: '2024-01-19',
        fromUser: 'Sistema CoomÜnity'
      }
    ]
  },
  meritos: {
    balance: 450,
    currency: 'MERITOS',
    transactions: [
      {
        id: 'tx-4',
        type: 'received',
        amount: 50,
        description: 'Méritos por verificar perfil',
        date: '2024-01-15',
        fromUser: 'Sistema CoomÜnity'
      }
    ]
  }
};

// 🎮 Datos Mock de ÜPlay
const MOCK_UPLAY_VIDEOS = [
  {
    id: 1,
    title: 'Introducción al Ayni y la Reciprocidad',
    description: 'Descubre los principios de la economía sagrada y cómo aplicar el Ayni en tu vida diaria.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/ayni/400/225',
    duration: 360,
    categories: '["filosofía", "ayni"]',
    tags: '["ayni", "filosofía", "economía"]',
    questions: [
      {
        id: 1,
        timestamp: 120,
        text: '¿Qué significa Ayni?',
        answerOptions: [
          { id: 1, text: 'Reciprocidad', isCorrect: true },
          { id: 2, text: 'Intercambio', isCorrect: false },
          { id: 3, text: 'Dinero', isCorrect: false },
        ],
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true,
    platform: 'youtube',
    views: 1245,
    likes: 89,
    ayniScore: 95
  },
  {
    id: 2,
    title: 'El Bien Común como Norte',
    description: 'Cómo nuestras acciones individuales construyen una mejor comunidad para todos.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/biencomun/400/225',
    duration: 480,
    categories: '["comunidad", "bienestar"]',
    tags: '["bien común", "comunidad", "cooperación"]',
    questions: [
      {
        id: 2,
        timestamp: 240,
        text: '¿Cuál es el principio del Bien Común?',
        answerOptions: [
          { id: 3, text: 'Beneficio individual', isCorrect: false },
          { id: 4, text: 'Beneficio colectivo', isCorrect: true },
          { id: 5, text: 'Competencia', isCorrect: false },
        ],
      },
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    isActive: true,
    platform: 'youtube',
    views: 892,
    likes: 67,
    ayniScore: 92
  },
  {
    id: 3,
    title: 'Generando Öndas Positivas',
    description: 'El impacto de la energía positiva en nuestro entorno y cómo cultivarla.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/ondas/400/225',
    duration: 240,
    categories: '["energía", "bienestar"]',
    tags: '["ondas", "energía", "bienestar"]',
    questions: [
      {
        id: 3,
        timestamp: 180,
        text: '¿Qué son las Öndas en CoomÜnity?',
        answerOptions: [
          { id: 6, text: 'Unidades de energía positiva', isCorrect: true },
          { id: 7, text: 'Puntos de experiencia', isCorrect: false },
          { id: 8, text: 'Dinero virtual', isCorrect: false },
        ],
      },
    ],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    isActive: true,
    platform: 'youtube',
    views: 567,
    likes: 45,
    ayniScore: 88
  }
];

// 🏆 Datos Mock de Challenges
const MOCK_CHALLENGES = [
  {
    id: 'challenge-1',
    title: 'Desafío de Reciprocidad Semanal',
    description: 'Practica el Ayni realizando 7 actos de reciprocidad durante la semana',
    type: 'WEEKLY',
    status: 'ACTIVE',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    maxParticipants: 100,
    currentParticipants: 67,
    requirements: {
      acts: 7,
      verification: 'photo_or_text',
      category: 'reciprocity'
    },
    rewards: [
      {
        type: 'MERITOS',
        amount: 100,
        description: '100 Méritos por completar el desafío'
      },
      {
        type: 'ONDAS',
        amount: 200,
        description: '200 Öndas por impacto positivo'
      }
    ],
    createdAt: '2024-01-14',
    updatedAt: '2024-01-20'
  },
  {
    id: 'challenge-2',
    title: 'Mes del Bien Común',
    description: 'Contribuye al Bien Común con acciones que beneficien a tu comunidad local',
    type: 'MONTHLY',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    maxParticipants: 500,
    currentParticipants: 234,
    requirements: {
      actions: 10,
      impact_level: 'community',
      documentation: 'required'
    },
    rewards: [
      {
        type: 'LUKAS',
        amount: 50,
        description: '50 Lükas para intercambios'
      },
      {
        type: 'BADGE',
        name: 'Guardián del Bien Común',
        description: 'Insignia especial por contribución excepcional'
      }
    ],
    createdAt: '2023-12-28',
    updatedAt: '2024-01-20'
  }
];

// 👥 Datos Mock Social
const MOCK_SOCIAL_DATA = {
  feed: [
    {
      id: 'post-1',
      userId: 'user-maria',
      userName: 'María Elena Quispe',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      content: '¡Hermosa experiencia compartiendo la sabiduría del Ayni en la última sesión! Cada encuentro refuerza mi convicción de que la reciprocidad es el fundamento de una sociedad más consciente. 🌱✨',
      images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
      likes: 34,
      comments: 8,
      shares: 5,
      timestamp: '2024-01-20T14:30:00Z',
      type: 'achievement'
    },
    {
      id: 'post-2',
      userId: 'user-coop',
      userName: 'Cooperativa Aynit Uyani',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      content: 'Nuestra nueva cosecha de quinoa está lista! 🌾 Cultivada con amor y respeto hacia la Pachamama, siguiendo las tradiciones ancestrales de nuestros abuelos. ¡Disponible en el marketplace!',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
      likes: 67,
      comments: 15,
      shares: 12,
      timestamp: '2024-01-19T10:15:00Z',
      type: 'marketplace'
    }
  ],
  messages: [
    {
      id: 'msg-1',
      senderId: 'user-alex',
      senderName: 'Alex Rodriguez',
      content: '¡Hola! Me interesa mucho tu propuesta de desarrollo web consciente. ¿Podrías contarme más sobre los principios de sostenibilidad digital que implementas?',
      timestamp: '2024-01-20T16:45:00Z',
      read: false
    }
  ]
};

// 📚 Catálogo de respuestas mock por endpoint
const mockResponses: Record<string, (method: string, body?: any) => any> = {
  '/auth/login': (method) => {
    if (method === 'POST') {
      return {
        user: MOCK_USER,
        access_token: MOCK_TOKEN,
      };
    }
    return { error: 'Method not mocked' };
  },
  '/auth/me': (method) => {
    if (method === 'GET') {
      return MOCK_USER;
    }
    return { error: 'Method not mocked' };
  },
  '/auth/logout': (method) => {
    if (method === 'POST') {
      return { message: 'Logout successful' };
    }
    return { error: 'Method not mocked' };
  },
  '/users/profile': (method) => {
    if (method === 'GET') {
      return MOCK_USER;
    }
    return { error: 'Method not mocked' };
  },

  // 🛒 Marketplace Endpoints
  '/marketplace/items': (method) => {
    if (method === 'GET') {
      return {
        items: MOCK_MARKETPLACE_ITEMS,
        total: MOCK_MARKETPLACE_ITEMS.length,
        page: 1,
        limit: 20,
        hasMore: false
      };
    }
    return { error: 'Method not mocked' };
  },
  '/marketplace': (method) => {
    if (method === 'GET') {
      return {
        items: MOCK_MARKETPLACE_ITEMS,
        total: MOCK_MARKETPLACE_ITEMS.length,
        page: 1,
        limit: 20,
        hasMore: false
      };
    }
    return { error: 'Method not mocked' };
  },

  // 💰 Wallet Endpoints
  '/wallets': (method) => {
    if (method === 'GET') {
      return MOCK_WALLET_DATA;
    }
    return { error: 'Method not mocked' };
  },
  '/wallet/balance': (method) => {
    if (method === 'GET') {
      return MOCK_WALLET_DATA;
    }
    return { error: 'Method not mocked' };
  },

  // 🎮 UPlay/Video Endpoints
  '/video-items': (method) => {
    if (method === 'GET') {
      return MOCK_UPLAY_VIDEOS;
    }
    return { error: 'Method not mocked' };
  },
  '/videos': (method) => {
    if (method === 'GET') {
      return MOCK_UPLAY_VIDEOS;
    }
    return { error: 'Method not mocked' };
  },
  '/uplay/videos': (method) => {
    if (method === 'GET') {
      return MOCK_UPLAY_VIDEOS;
    }
    return { error: 'Method not mocked' };
  },

  // 🏆 Challenges Endpoints
  '/challenges': (method) => {
    if (method === 'GET') {
      return MOCK_CHALLENGES;
    }
    return { error: 'Method not mocked' };
  },
  '/user-challenges': (method) => {
    if (method === 'GET') {
      return [];
    }
    return { error: 'Method not mocked' };
  },

  // 👥 Social Endpoints
  '/social/feed': (method) => {
    if (method === 'GET') {
      return MOCK_SOCIAL_DATA.feed;
    }
    return { error: 'Method not mocked' };
  },
  '/social/messages': (method) => {
    if (method === 'GET') {
      return MOCK_SOCIAL_DATA.messages;
    }
    return { error: 'Method not mocked' };
  },

  // 🔄 LETS Endpoints - Nuevos endpoints agregados
  '/lets/wallet/mock-user-123': (method) => {
    if (method === 'GET') {
      return {
        id: 'wallet-mock-123',
        userId: 'mock-user-123',
        balance: 850,
        creditLimit: 1000,
        trustScore: 4.7,
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-20T12:00:00Z',
        transactions: [] // Asegurar que es un array
      };
    }
    return { error: 'Method not mocked' };
  },
  '/lets/history/mock-user-123': (method) => {
    if (method === 'GET') {
      return {
        transactions: [ // Asegurar que es un array
          {
            id: 'tx-lets-1',
            fromUserId: 'other-user-1',
            toUserId: 'mock-user-123',
            amount: 50,
            transactionType: 'SERVICE_PAYMENT',
            description: 'Pago por sesión de consultoría',
            status: 'COMPLETED',
            createdAt: '2024-01-20T10:00:00Z',
            fromUser: { name: 'Carlos López' },
            toUser: { name: 'Jugador CoomÜnity' }
          },
          {
            id: 'tx-lets-2',
            fromUserId: 'mock-user-123',
            toUserId: 'other-user-2',
            amount: 25,
            transactionType: 'KNOWLEDGE_EXCHANGE',
            description: 'Intercambio de conocimiento sobre permacultura',
            status: 'COMPLETED',
            createdAt: '2024-01-18T15:30:00Z',
            fromUser: { name: 'Jugador CoomÜnity' },
            toUser: { name: 'María Fernández' }
          }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      };
    }
    return { error: 'Method not mocked' };
  }
};

/**
 * Devuelve datos mock para un endpoint y método dados.
 * @param endpoint - El endpoint de la API (ej. '/auth/login')
 * @param method - El método HTTP (ej. 'GET', 'POST')
 * @param body - El cuerpo de la petición (opcional)
 * @returns Los datos mock correspondientes o una respuesta de error por defecto.
 */
export const getMockData = (endpoint: string, method: string, body?: any): any => {
  // Remove query parameters for matching
  const cleanEndpoint = endpoint.split('?')[0];

  // Try exact match first
  let handler = mockResponses[endpoint];
  if (!handler) {
    // Try without query parameters
    handler = mockResponses[cleanEndpoint];
  }

  // 🔄 Handle dynamic LETS endpoints with pattern matching
  if (!handler && cleanEndpoint.startsWith('/lets/')) {
    if (cleanEndpoint.includes('/wallet/')) {
      // Map any wallet endpoint to the mock user
      handler = mockResponses['/lets/wallet/mock-user-123'];
    } else if (cleanEndpoint.includes('/history/')) {
      // Map any history endpoint to the mock user
      handler = mockResponses['/lets/history/mock-user-123'];
    }
  }

  if (handler) {
    console.log(`🟡 [MOCK] Found handler for ${cleanEndpoint}, returning mock data`);
    return handler(method, body);
  }

  // 🔄 Respuesta mejorada para endpoints LETS no definidos
  if (cleanEndpoint.startsWith('/lets/')) {
    console.warn(`🟡 [MOCK] LETS endpoint not configured: ${method} ${endpoint}. Returning safe empty array response.`);

    // Devolver respuestas específicas para endpoints LETS comunes
    if (cleanEndpoint.includes('/history/') || cleanEndpoint.includes('/transactions/')) {
      return {
        success: true,
        message: `Mock response for ${method} ${endpoint}`,
        data: [], // Array vacío para transacciones
        transactions: [], // Campo específico para transacciones
        total: 0,
        page: 1,
        totalPages: 0
      };
    }

    if (cleanEndpoint.includes('/wallet/')) {
      return {
        success: true,
        message: `Mock response for ${method} ${endpoint}`,
        data: {
          id: 'mock-wallet',
          userId: 'mock-user-123',
          balance: 0,
          creditLimit: 1000,
          trustScore: 4.0,
          transactions: [] // Array vacío asegurado
        }
      };
    }
  }

  // Respuesta por defecto para otros endpoints no definidos
  console.warn(`🟡 [MOCK] No mock data found for ${method} ${endpoint} (cleaned: ${cleanEndpoint}). Returning default success response.`);
  return {
    success: true,
    message: `Mocked response for ${method} ${endpoint}`,
    data: {},
  };
};

// Exportar datos específicos para uso directo
export {
  MOCK_USER,
  MOCK_TOKEN,
  MOCK_MARKETPLACE_ITEMS,
  MOCK_WALLET_DATA,
  MOCK_UPLAY_VIDEOS,
  MOCK_CHALLENGES,
  MOCK_SOCIAL_DATA
};
