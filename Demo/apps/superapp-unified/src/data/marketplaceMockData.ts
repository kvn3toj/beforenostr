/**
 * 🌱 Datos Mock del Marketplace CoomÜnity
 * Productos y servicios diversos relacionados al bien común
 * Cada item tiene datos únicos e imágenes específicas
 */

export interface MarketplaceItemMock {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  type:
    | 'PRODUCT'
    | 'SERVICE'
    | 'DIGITAL_CONTENT'
    | 'EXPERIENCE'
    | 'SKILL_EXCHANGE';
  tags: string[];
  images: string[];
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string;
    bio?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    isOnline?: boolean;
    responseTime?: string;
    memberSince?: string;
  };
  location: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  impactLevel: 'local' | 'regional' | 'global';
  sustainabilityScore: number;
  ayniCategory:
    | 'reciprocidad'
    | 'bien-comun'
    | 'cooperacion'
    | 'educacion'
    | 'sostenibilidad';
  meritos?: number; // Mëritos ganados por ofrecer este servicio
  ondas?: number; // Öndas generadas por impacto positivo
}

export const marketplaceMockData: MarketplaceItemMock[] = [
  // 🌱 SOSTENIBILIDAD Y AGRICULTURA
  {
    id: 'agricultura-organica-001',
    title: 'Huerto Urbano Orgánico - Kit Completo',
    description:
      'Kit completo para crear tu huerto urbano orgánico. Incluye semillas, tierra, macetas biodegradables y guía step-by-step.',
    fullDescription: `
      Transforma tu hogar en un oasis verde con nuestro kit de huerto urbano orgánico. 
      
      **¿Qué incluye?**
      • 12 variedades de semillas orgánicas certificadas
      • Tierra enriquecida con compost natural
      • 8 macetas biodegradables de fibra de coco
      • Sistema de riego por goteo casero
      • Guía ilustrada de cultivo mes a mes
      • Fertilizante orgánico para 6 meses
      • Acceso a comunidad online de jardineros urbanos
      
      **Beneficios del bien común:**
      • Reduce tu huella de carbono
      • Alimentación más saludable para tu familia
      • Conecta con la naturaleza desde casa
      • Enseña sostenibilidad a los niños
      • Fortalece la seguridad alimentaria local
      
      Perfecto para principiantes. Compatible con balcones, terrazas y espacios pequeños.
    `,
    price: 89,
    originalPrice: 120,
    currency: 'LUKAS',
    category: 'sostenibilidad',
    type: 'PRODUCT',
    tags: [
      'agricultura',
      'orgánico',
      'huerto-urbano',
      'sostenibilidad',
      'alimentación',
    ],
    images: [
      'https://images.pexels.com/photos/2749165/pexels-photo-2749165.jpeg', // Plantas verdes
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop', // Huerto urbano
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', // Verduras orgánicas
    ],
    seller: {
      id: 'seller-eco-001',
      firstName: 'María',
      lastName: 'Fernández',
      username: '@maria_ecohuertos',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
      bio: 'Ingeniera Agrónoma especializada en agricultura urbana sostenible. Fundadora de EcoHuertos Urbanos.',
      location: 'Valencia, España',
      rating: 4.9,
      reviewCount: 127,
      verified: true,
      isOnline: true,
      responseTime: '1 hora',
      memberSince: '2022-03-15',
    },
    location: 'Valencia, España',
    rating: 4.9,
    reviewCount: 127,
    featured: true,
    trending: true,
    viewCount: 2847,
    favoriteCount: 324,
    createdAt: '2024-01-15T00:00:00Z',
    impactLevel: 'local',
    sustainabilityScore: 95,
    ayniCategory: 'sostenibilidad',
    meritos: 25,
    ondas: 40,
  },

  {
    id: 'energia-solar-consulting-002',
    title: 'Consultoría en Energía Solar Doméstica',
    description:
      'Asesoría personalizada para instalar paneles solares en tu hogar. Análisis de viabilidad, diseño del sistema y acompañamiento.',
    fullDescription: `
      Convierte tu hogar en una central de energía limpia con nuestra consultoría especializada en energía solar.
      
      **Nuestro servicio incluye:**
      • Análisis energético completo de tu vivienda
      • Diseño personalizado del sistema solar
      • Cálculo de retorno de inversión
      • Gestión de permisos y trámites
      • Recomendación de proveedores certificados
      • Supervisión de instalación
      • Plan de mantenimiento anual
      
      **Impacto en el bien común:**
      • Reduce emisiones de CO2 hasta 3 toneladas/año
      • Genera energía limpia para la comunidad
      • Crea empleos locales en energías renovables
      • Educación en sostenibilidad energética
      • Ahorro económico a largo plazo
      
      Con más de 200 instalaciones supervisadas y 15 años de experiencia.
    `,
    price: 180,
    currency: 'LUKAS',
    category: 'sostenibilidad',
    type: 'SERVICE',
    tags: [
      'energía-solar',
      'renovables',
      'sostenibilidad',
      'consultoría',
      'eficiencia-energética',
    ],
    images: [
      'https://images.pexels.com/photos/9799712/pexels-photo-9799712.jpeg', // Paneles solares
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop', // Casa con paneles
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop', // Energía limpia
    ],
    seller: {
      id: 'seller-energy-002',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      username: '@carlos_solartech',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Ingeniero en Energías Renovables. Especialista en sistemas fotovoltaicos residenciales. +200 proyectos completados.',
      location: 'Madrid, España',
      rating: 4.8,
      reviewCount: 89,
      verified: true,
      isOnline: false,
      responseTime: '2 horas',
      memberSince: '2021-08-20',
    },
    location: 'Madrid, España',
    rating: 4.8,
    reviewCount: 89,
    featured: false,
    trending: true,
    viewCount: 1653,
    favoriteCount: 198,
    createdAt: '2024-01-10T00:00:00Z',
    impactLevel: 'regional',
    sustainabilityScore: 92,
    ayniCategory: 'sostenibilidad',
    meritos: 35,
    ondas: 55,
  },

  // 📚 EDUCACIÓN Y DESARROLLO PERSONAL
  {
    id: 'educacion-financiera-003',
    title: 'Curso de Educación Financiera para Familias',
    description:
      'Curso online interactivo sobre finanzas personales, ahorro e inversión consciente. Especialmente diseñado para familias.',
    fullDescription: `
      Transforma tu relación con el dinero y construye un futuro financiero sólido para tu familia.
      
      **Módulos del curso:**
      1. Fundamentos de educación financiera
      2. Presupuesto familiar inteligente
      3. Ahorro estratégico y emergencias
      4. Inversión responsable y sostenible
      5. Educación financiera para niños
      6. Emprendimiento familiar
      7. Economía colaborativa y bien común
      
      **Metodología única:**
      • Clases en vivo semanales
      • Ejercicios prácticos con tu presupuesto real
      • Comunidad de apoyo entre familias
      • Herramientas digitales incluidas
      • Seguimiento personalizado 3 meses
      • Certificado de competencias financieras
      
      **Impacto en el bien común:**
      • Reduce el estrés financiero familiar
      • Fomenta el consumo consciente
      • Fortalece la economía local
      • Educa en valores de reciprocidad
      
      +500 familias ya han transformado sus finanzas con nosotros.
    `,
    price: 120,
    originalPrice: 180,
    currency: 'LUKAS',
    category: 'educacion',
    type: 'DIGITAL_CONTENT',
    tags: [
      'educación-financiera',
      'familia',
      'ahorro',
      'inversión',
      'finanzas-personales',
    ],
    images: [
      'https://images.pexels.com/photos/7929249/pexels-photo-7929249.jpeg', // Educación
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop', // Finanzas familiares
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&h=600&fit=crop', // Aprendizaje
    ],
    seller: {
      id: 'seller-edu-003',
      firstName: 'Ana',
      lastName: 'Rodriguez',
      username: '@ana_finanzas_familia',
      avatarUrl:
        'https://images.unsplash.com/photo-1594736797933-d0ceb692683a?w=100&h=100&fit=crop&crop=face',
      bio: 'Educadora financiera certificada. Especialista en economía familiar y emprendimiento social. Madre de 3 hijos.',
      location: 'Barcelona, España',
      rating: 4.9,
      reviewCount: 234,
      verified: true,
      isOnline: true,
      responseTime: '30 minutos',
      memberSince: '2020-11-03',
    },
    location: 'Online',
    rating: 4.9,
    reviewCount: 234,
    featured: true,
    trending: false,
    viewCount: 3947,
    favoriteCount: 445,
    createdAt: '2024-01-05T00:00:00Z',
    impactLevel: 'global',
    sustainabilityScore: 88,
    ayniCategory: 'educacion',
    meritos: 45,
    ondas: 78,
  },

  {
    id: 'tecnologia-social-004',
    title: 'Desarrollo de App para ONGs',
    description:
      'Desarrollo de aplicaciones móviles especializadas para organizaciones sin fines de lucro. Tecnología al servicio del bien común.',
    fullDescription: `
      Potencia el impacto de tu ONG con tecnología diseñada específicamente para organizaciones del bien común.
      
      **Servicios incluidos:**
      • Análisis de necesidades específicas de ONGs
      • Diseño UX/UI centrado en impacto social
      • Desarrollo nativo iOS y Android
      • Sistema de gestión de voluntarios
      • Módulo de donaciones integrado
      • Dashboard de métricas de impacto
      • Sistema de comunicación con beneficiarios
      • Integración con redes sociales
      • Hosting en la nube por 1 año
      
      **Características especiales:**
      • Accesibilidad total (WCAG 2.1)
      • Multiidioma automático
      • Modo offline funcional
      • Geolocalización de servicios
      • Sistema de gamificación para voluntarios
      • Analytics de impacto social
      
      **Nuestro compromiso:**
      • 50% de descuento para ONGs verificadas
      • Código abierto disponible para la comunidad
      • Mantenimiento gratuito el primer año
      • Capacitación del equipo incluida
      
      Hemos desarrollado +40 apps para ONGs en Latinoamérica y España.
    `,
    price: 2500,
    originalPrice: 3500,
    currency: 'LUKAS',
    category: 'tecnologia-social',
    type: 'SERVICE',
    tags: ['desarrollo-móvil', 'ong', 'impacto-social', 'tecnología', 'app'],
    images: [
      'https://images.pexels.com/photos/4314674/pexels-photo-4314674.jpeg', // Tecnología social
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop', // Desarrollo app
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop', // Tecnología para el bien
    ],
    seller: {
      id: 'seller-tech-004',
      firstName: 'Diego',
      lastName: 'Vásquez',
      username: '@diego_tech4good',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'CTO y fundador de Tech4Good. Especialista en desarrollo de tecnología para impacto social. +10 años en el sector.',
      location: 'Buenos Aires, Argentina',
      rating: 4.7,
      reviewCount: 67,
      verified: true,
      isOnline: true,
      responseTime: '4 horas',
      memberSince: '2019-07-12',
    },
    location: 'Buenos Aires, Argentina',
    rating: 4.7,
    reviewCount: 67,
    featured: false,
    trending: true,
    viewCount: 1245,
    favoriteCount: 156,
    createdAt: '2024-01-08T00:00:00Z',
    impactLevel: 'global',
    sustainabilityScore: 85,
    ayniCategory: 'bien-comun',
    meritos: 75,
    ondas: 120,
  },

  // 🏥 SALUD Y BIENESTAR
  {
    id: 'terapia-holistca-005',
    title: 'Terapia Holística y Bienestar Integral',
    description:
      'Sesiones de terapia holística combinando medicina tradicional, mindfulness y técnicas de bienestar emocional.',
    fullDescription: `
      Reconecta con tu bienestar integral a través de un enfoque holístico que honra la sabiduría ancestral y la ciencia moderna.
      
      **Modalidades terapéuticas:**
      • Reiki energético y sanación pránica
      • Mindfulness y meditación guiada
      • Terapia floral de Bach
      • Aromaterapia personalizada
      • Técnicas de respiración consciente
      • Yoga terapéutico adaptado
      • Constelaciones familiares
      • Coaching nutricional integrativo
      
      **Beneficios comprobados:**
      • Reducción del estrés y ansiedad
      • Mejora de la calidad del sueño
      • Fortalecimiento del sistema inmune
      • Mayor claridad mental y emocional
      • Conexión con tu propósito de vida
      • Mejora en relaciones interpersonales
      
      **Filosofía del bien común:**
      • Sanación personal para contribuir al colectivo
      • Técnicas accesibles para toda la familia
      • Enfoque preventivo de la salud
      • Respeto por medicinas tradicionales
      • Formación en autocuidado
      
      Certificada en múltiples modalidades terapéuticas. 8 años de experiencia.
    `,
    price: 65,
    currency: 'LUKAS',
    category: 'salud',
    type: 'SERVICE',
    tags: [
      'terapia-holística',
      'bienestar',
      'mindfulness',
      'reiki',
      'salud-integral',
    ],
    images: [
      'https://images.pexels.com/photos/6998270/pexels-photo-6998270.jpeg', // Terapia holística
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop', // Bienestar
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Meditación
    ],
    seller: {
      id: 'seller-wellness-005',
      firstName: 'Luz',
      lastName: 'Martínez',
      username: '@luz_bienestar_integral',
      avatarUrl:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      bio: 'Terapeuta holística certificada. Especialista en medicina integrativa y bienestar emocional. Facilitadora de círculos de sanación.',
      location: 'Medellín, Colombia',
      rating: 4.9,
      reviewCount: 143,
      verified: true,
      isOnline: false,
      responseTime: '1 hora',
      memberSince: '2021-02-28',
    },
    location: 'Medellín, Colombia',
    rating: 4.9,
    reviewCount: 143,
    featured: true,
    trending: false,
    viewCount: 2156,
    favoriteCount: 298,
    createdAt: '2024-01-12T00:00:00Z',
    impactLevel: 'local',
    sustainabilityScore: 90,
    ayniCategory: 'bien-comun',
    meritos: 30,
    ondas: 65,
  },

  {
    id: 'terapia-familiar-006',
    title: 'Terapia Familiar Sistémica Online',
    description:
      'Sesiones de terapia familiar para fortalecer vínculos, resolver conflictos y mejorar la comunicación en la familia.',
    fullDescription: `
      Fortalece los vínculos familiares y construye relaciones más sanas y conscientes con nuestro enfoque sistémico.
      
      **Áreas de especialización:**
      • Comunicación familiar efectiva
      • Resolución de conflictos entre generaciones
      • Apoyo en transiciones familiares
      • Fortalecimiento de vínculos padre-hijo
      • Terapia de pareja dentro del sistema familiar
      • Manejo de crisis y trauma familiar
      • Integración de nuevos miembros
      • Dinámicas familiares saludables
      
      **Metodología innovadora:**
      • Sesiones familiares online seguras
      • Herramientas digitales interactivas
      • Técnicas de comunicación no violenta
      • Ejercicios de empatía y escucha activa
      • Plan de acción familiar personalizado
      • Seguimiento entre sesiones
      • Recursos educativos familiares
      
      **Enfoque del bien común:**
      • Familias sanas = comunidades fuertes
      • Herramientas para toda la vida
      • Prevención de violencia familiar
      • Promoción de valores colaborativos
      • Crianza consciente y respetuosa
      
      Especialista en terapia sistémica con 12 años de experiencia.
    `,
    price: 85,
    currency: 'LUKAS',
    category: 'salud',
    type: 'SERVICE',
    tags: [
      'terapia-familiar',
      'comunicación',
      'conflictos',
      'vínculos',
      'psicología',
    ],
    images: [
      'https://images.pexels.com/photos/4098218/pexels-photo-4098218.jpeg', // Terapia pareja
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=600&fit=crop', // Familia
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop', // Terapia online
    ],
    seller: {
      id: 'seller-therapy-006',
      firstName: 'Patricia',
      lastName: 'González',
      username: '@patricia_terapia_familiar',
      avatarUrl:
        'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop&crop=face',
      bio: 'Psicóloga clínica especializada en terapia familiar sistémica. Máster en Comunicación No Violenta. 12 años de experiencia.',
      location: 'Ciudad de México, México',
      rating: 4.8,
      reviewCount: 156,
      verified: true,
      isOnline: true,
      responseTime: '2 horas',
      memberSince: '2020-05-15',
    },
    location: 'Ciudad de México, México',
    rating: 4.8,
    reviewCount: 156,
    featured: false,
    trending: false,
    viewCount: 1789,
    favoriteCount: 203,
    createdAt: '2024-01-06T00:00:00Z',
    impactLevel: 'regional',
    sustainabilityScore: 87,
    ayniCategory: 'bien-comun',
    meritos: 40,
    ondas: 72,
  },

  // ♻️ ECONOMÍA CIRCULAR
  {
    id: 'upcycling-muebles-007',
    title: 'Taller de Upcycling para Muebles',
    description:
      'Aprende a transformar muebles viejos en piezas únicas y funcionales. Taller presencial con todos los materiales incluidos.',
    fullDescription: `
      Dale nueva vida a tus muebles y reduce el desperdicio mientras creas piezas únicas llenas de personalidad.
      
      **Lo que aprenderás:**
      • Técnicas de restauración y lijado
      • Pintura y acabados ecológicos
      • Tapicería básica con materiales reciclados
      • Modificación de estructuras
      • Decoración con materiales naturales
      • Cuidado y mantenimiento a largo plazo
      • Diseño personalizado y funcional
      
      **Incluido en el taller:**
      • Espacio de trabajo completamente equipado
      • Herramientas profesionales
      • Materiales ecológicos (pinturas, barnices)
      • Telas y materiales de tapicería
      • Refrigerio orgánico
      • Manual digital de técnicas
      • Acceso a comunidad de upcyclers
      
      **Impacto ambiental:**
      • Reduce residuos que van a vertederos
      • Evita compra de muebles nuevos
      • Usa materiales ecológicos certificados
      • Enseña consumo consciente
      • Fomenta creatividad y autoconfianza
      
      **Modalidades:**
      • Taller grupal (max 8 personas)
      • Sesión individual personalizada
      • Taller familiar (padres e hijos)
      
      +200 muebles transformados en nuestros talleres.
    `,
    price: 75,
    currency: 'LUKAS',
    category: 'economia-circular',
    type: 'EXPERIENCE',
    tags: ['upcycling', 'muebles', 'reciclaje', 'artesanía', 'sostenibilidad'],
    images: [
      'https://images.pexels.com/photos/11849101/pexels-photo-11849101.jpeg', // Materiales reciclados
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', // Muebles vintage
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=600&fit=crop', // Taller artesanía
    ],
    seller: {
      id: 'seller-upcycle-007',
      firstName: 'Roberto',
      lastName: 'Silva',
      username: '@roberto_upcycle_master',
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'Artesano especializado en upcycling y restauración de muebles. Fundador de "Segunda Vida Muebles". 15 años de experiencia.',
      location: 'Sevilla, España',
      rating: 4.7,
      reviewCount: 98,
      verified: true,
      isOnline: false,
      responseTime: '3 horas',
      memberSince: '2021-09-10',
    },
    location: 'Sevilla, España',
    rating: 4.7,
    reviewCount: 98,
    featured: false,
    trending: true,
    viewCount: 1432,
    favoriteCount: 187,
    createdAt: '2024-01-14T00:00:00Z',
    impactLevel: 'local',
    sustainabilityScore: 93,
    ayniCategory: 'sostenibilidad',
    meritos: 20,
    ondas: 35,
  },

  // 🌈 INCLUSIÓN SOCIAL
  {
    id: 'lenguaje-senas-008',
    title: 'Curso de Lengua de Señas Online',
    description:
      'Aprende lengua de señas desde casa. Curso interactivo con instructor sordo nativo. Incluye certificación oficial.',
    fullDescription: `
      Construye puentes de comunicación y contribuye a una sociedad más inclusiva aprendiendo lengua de señas.
      
      **Estructura del curso:**
      
      **Nivel Básico (8 semanas):**
      • Alfabeto e introducción gestual
      • Vocabulario esencial (familia, trabajo, tiempo)
      • Construcción de frases simples
      • Expresiones faciales y corporales
      • Números y cantidades
      • Presentaciones personales
      
      **Nivel Intermedio (10 semanas):**
      • Conversaciones cotidianas
      • Tiempo verbal y gramática visual
      • Vocabulario especializado (salud, educación)
      • Narración y descripción
      • Cultura e historia de la comunidad sorda
      
      **Metodología inclusiva:**
      • Instructores sordos nativos
      • Clases en vivo por videoconferencia
      • Práctica con hablantes nativos
      • Material audiovisual especializado
      • Ejercicios interactivos gamificados
      • Comunidad de práctica online
      • Evaluación continua y certificación
      
      **Impacto social:**
      • Empleabilidad como intérprete
      • Comunicación con familiares sordos
      • Voluntariado en organizaciones
      • Sensibilización sobre discapacidad
      • Construcción de sociedad inclusiva
      
      Certificación reconocida por asociaciones de sordos.
    `,
    price: 150,
    originalPrice: 200,
    currency: 'LUKAS',
    category: 'inclusion',
    type: 'DIGITAL_CONTENT',
    tags: [
      'lengua-de-señas',
      'inclusión',
      'comunicación',
      'accesibilidad',
      'educación',
    ],
    images: [
      'https://images.pexels.com/photos/6146822/pexels-photo-6146822.jpeg', // Diversidad e inclusión
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop', // Lengua de señas
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop', // Educación inclusiva
    ],
    seller: {
      id: 'seller-inclusion-008',
      firstName: 'Carmen',
      lastName: 'Ruiz',
      username: '@carmen_senas_inclusivas',
      avatarUrl:
        'https://images.unsplash.com/photo-1594736797933-d0ceb692683a?w=100&h=100&fit=crop&crop=face',
      bio: 'Intérprete de lengua de señas certificada. Fundadora de "Puentes de Comunicación". Activista por los derechos de las personas sordas.',
      location: 'Lima, Perú',
      rating: 4.9,
      reviewCount: 178,
      verified: true,
      isOnline: true,
      responseTime: '1 hora',
      memberSince: '2020-01-22',
    },
    location: 'Online',
    rating: 4.9,
    reviewCount: 178,
    featured: true,
    trending: false,
    viewCount: 3245,
    favoriteCount: 567,
    createdAt: '2024-01-03T00:00:00Z',
    impactLevel: 'global',
    sustainabilityScore: 95,
    ayniCategory: 'inclusion',
    meritos: 55,
    ondas: 95,
  },

  // 🤝 DESARROLLO COMUNITARIO
  {
    id: 'huertos-comunitarios-009',
    title: 'Consultoría para Huertos Comunitarios',
    description:
      'Diseño e implementación de huertos comunitarios urbanos. Fortalece la cohesión social y la seguridad alimentaria local.',
    fullDescription: `
      Transforma espacios urbanos vacíos en oasis de abundancia comunitaria que fortalecen vínculos y alimentan cuerpos y almas.
      
      **Servicios de consultoría:**
      
      **Fase 1 - Diagnóstico (2 semanas):**
      • Análisis del espacio disponible
      • Estudio de suelo y condiciones ambientales
      • Evaluación de recursos hídricos
      • Mapeo de actores comunitarios
      • Diagnóstico de necesidades alimentarias
      
      **Fase 2 - Diseño participativo (3 semanas):**
      • Talleres de diseño con la comunidad
      • Planificación de cultivos estacionales
      • Sistema de riego eficiente
      • Espacios de encuentro y educación
      • Compostaje y gestión de residuos
      • Plan de gobernanza comunitaria
      
      **Fase 3 - Implementación (8 semanas):**
      • Preparación del terreno
      • Instalación de infraestructura
      • Plantación inicial guiada
      • Capacitación en técnicas orgánicas
      • Formación de líderes comunitarios
      • Sistema de gestión y mantenimiento
      
      **Beneficios para la comunidad:**
      • Alimentos frescos y orgánicos
      • Espacios de encuentro intergeneracional
      • Educación ambiental práctica
      • Fortalecimiento de tejido social
      • Reducción de inseguridad alimentaria
      • Actividad física y bienestar mental
      
      +50 huertos comunitarios implementados en Latinoamérica.
    `,
    price: 800,
    currency: 'LUKAS',
    category: 'comunidad',
    type: 'SERVICE',
    tags: [
      'huertos-comunitarios',
      'desarrollo-social',
      'agricultura-urbana',
      'comunidad',
      'seguridad-alimentaria',
    ],
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop', // Huerto comunitario
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop', // Comunidad trabajando
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop', // Agricultura urbana
    ],
    seller: {
      id: 'seller-community-009',
      firstName: 'Miguel',
      lastName: 'Torres',
      username: '@miguel_huertos_comunidad',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'Especialista en desarrollo comunitario y agricultura urbana. Máster en Agroecología. Coordinador de Red de Huertos Urbanos.',
      location: 'Quito, Ecuador',
      rating: 4.8,
      reviewCount: 76,
      verified: true,
      isOnline: false,
      responseTime: '4 horas',
      memberSince: '2019-11-08',
    },
    location: 'Quito, Ecuador',
    rating: 4.8,
    reviewCount: 76,
    featured: false,
    trending: false,
    viewCount: 987,
    favoriteCount: 134,
    createdAt: '2024-01-11T00:00:00Z',
    impactLevel: 'local',
    sustainabilityScore: 96,
    ayniCategory: 'bien-comun',
    meritos: 60,
    ondas: 105,
  },

  // 💻 TECNOLOGÍA EDUCATIVA
  {
    id: 'plataforma-educativa-010',
    title: 'Plataforma Educativa Colaborativa',
    description:
      'Desarrollo de plataforma educativa que conecta estudiantes, educadores y mentores. Aprendizaje colaborativo y personalizado.',
    fullDescription: `
      Revoluciona la educación con una plataforma que pone la colaboración y el bien común en el centro del aprendizaje.
      
      **Características principales:**
      
      **Para Estudiantes:**
      • Rutas de aprendizaje personalizadas
      • Gamificación educativa con propósito
      • Conexión con mentores y peers
      • Portafolio digital de logros
      • Herramientas de estudio colaborativo
      • Acceso a recursos educativos abiertos
      
      **Para Educadores:**
      • Herramientas de creación de contenido
      • Sistema de evaluación formativa
      • Analytics de progreso estudiantil
      • Comunidad de práctica docente
      • Recursos pedagógicos compartidos
      • Integración con calendarios académicos
      
      **Para Instituciones:**
      • Dashboard administrativo completo
      • Gestión de cursos y programas
      • Reportes de impacto educativo
      • Integración con sistemas existentes
      • Backup y seguridad de datos
      • Soporte técnico especializado
      
      **Tecnologías utilizadas:**
      • Frontend: React + TypeScript
      • Backend: Node.js + Express
      • Base de datos: PostgreSQL
      • Tiempo real: Socket.io
      • Hosting: AWS con SSL
      • Móvil: Progressive Web App
      
      **Metodología de desarrollo:**
      • Co-creación con comunidad educativa
      • Desarrollo iterativo y ágil
      • Testing continuo con usuarios reales
      • Accesibilidad (WCAG 2.1) desde el diseño
      • Código abierto para transparencia
      
      Especialistas en EdTech con +100 proyectos educativos.
    `,
    price: 4500,
    originalPrice: 6000,
    currency: 'LUKAS',
    category: 'tecnologia-social',
    type: 'SERVICE',
    tags: [
      'edtech',
      'plataforma-educativa',
      'aprendizaje-colaborativo',
      'tecnología',
      'educación',
    ],
    images: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop', // Tecnología educativa
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop', // Colaboración online
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop', // Estudiantes tecnología
    ],
    seller: {
      id: 'seller-edtech-010',
      firstName: 'Laura',
      lastName: 'Morales',
      username: '@laura_edtech_colaborativa',
      avatarUrl:
        'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop&crop=face',
      bio: 'Líder técnica especializada en EdTech. Fundadora de "Aprende Colaborando". Educadora y desarrolladora con 8 años de experiencia.',
      location: 'Monterrey, México',
      rating: 4.9,
      reviewCount: 45,
      verified: true,
      isOnline: true,
      responseTime: '2 horas',
      memberSince: '2020-08-17',
    },
    location: 'Monterrey, México',
    rating: 4.9,
    reviewCount: 45,
    featured: true,
    trending: true,
    viewCount: 1876,
    favoriteCount: 289,
    createdAt: '2024-01-09T00:00:00Z',
    impactLevel: 'global',
    sustainabilityScore: 89,
    ayniCategory: 'educacion',
    meritos: 80,
    ondas: 145,
  },
];

/**
 * 🎯 Función para obtener items por categoría
 */
export const getItemsByCategory = (category: string): MarketplaceItemMock[] => {
  return marketplaceMockData.filter((item) => item.category === category);
};

/**
 * 🔍 Función para buscar items por término
 */
export const searchItems = (searchTerm: string): MarketplaceItemMock[] => {
  const term = searchTerm.toLowerCase();
  return marketplaceMockData.filter(
    (item) =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.tags.some((tag) => tag.toLowerCase().includes(term)) ||
      item.seller.firstName.toLowerCase().includes(term) ||
      item.seller.lastName.toLowerCase().includes(term)
  );
};

/**
 * 🎲 Función para obtener items aleatorios
 */
export const getRandomItems = (count: number = 6): MarketplaceItemMock[] => {
  const shuffled = [...marketplaceMockData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * 📊 Función para obtener items por impacto
 */
export const getItemsByImpact = (
  impactLevel: 'local' | 'regional' | 'global'
): MarketplaceItemMock[] => {
  return marketplaceMockData.filter((item) => item.impactLevel === impactLevel);
};

/**
 * 🏆 Función para obtener items por categoría Ayni
 */
export const getItemsByAyniCategory = (
  ayniCategory: string
): MarketplaceItemMock[] => {
  return marketplaceMockData.filter(
    (item) => item.ayniCategory === ayniCategory
  );
};

/**
 * ⭐ Función para obtener items destacados
 */
export const getFeaturedItems = (): MarketplaceItemMock[] => {
  return marketplaceMockData.filter((item) => item.featured);
};

/**
 * 🔥 Función para obtener items trending
 */
export const getTrendingItems = (): MarketplaceItemMock[] => {
  return marketplaceMockData.filter((item) => item.trending);
};

/**
 * 🎯 Función para obtener item por ID
 */
export const getItemById = (id: string): MarketplaceItemMock | undefined => {
  return marketplaceMockData.find((item) => item.id === id);
};
