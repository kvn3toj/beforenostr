const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const uPlayVideos = [
  {
    title: '¿De dónde vienen los memes?',
    description: 'Magic Markers',
    youtubeId: 'NYh2yl3R9GU',
    duration: 0,
    categories: ['Memes', 'Cultura Digital'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/NYh2yl3R9GU/maxresdefault.jpg',
  },
  {
    title: 'El valor de la Libertad',
    description: 'Pepe Mujica',
    youtubeId: 'WR0WBXXXwI0',
    duration: 0,
    categories: ['Clips cortos', 'Filosofía'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/WR0WBXXXwI0/maxresdefault.jpg',
  },
  {
    title: 'Autoconocimiento, 5 trucos para conocerte y mejorar tu día',
    description: 'Juan Pablo Gaviria',
    youtubeId: 'rNEnwWmNEQY',
    duration: 0,
    categories: ['Clips cortos', 'Autoconocimiento'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/rNEnwWmNEQY/maxresdefault.jpg',
  },
  {
    title: 'Gamificación, ¿se puede ser productivo jugando?',
    description: 'Magic Markers',
    youtubeId: 'ixBgrqho03E',
    duration: 0,
    categories: ['Clips cortos', 'Gamificación'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/ixBgrqho03E/maxresdefault.jpg',
  },
  {
    title: 'Define tu Visión',
    description: 'Carisma al Instante',
    youtubeId: 'N33xXPOWPPA',
    duration: 0,
    categories: ['Clips cortos', 'Desarrollo Personal'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/N33xXPOWPPA/maxresdefault.jpg',
  },
  {
    title: 'El Método Wim Hof',
    description: 'El Sendero de Rubén',
    youtubeId: 'p5OFO5OZoTk',
    duration: 0,
    categories: ['LifeHacks', 'Bienestar'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/p5OFO5OZoTk/maxresdefault.jpg',
  },
];

const testQuestions = [
  {
    text: 'Según el video, ¿qué es la gamificación?',
    timestamp: 30, // seconds
    type: 'multiple-choice',
    options: [
      { text: 'Una técnica para crear videojuegos', isCorrect: false },
      { text: 'El uso de elementos de juego en contextos no lúdicos', isCorrect: true },
      { text: 'Una forma de marketing digital', isCorrect: false },
      { text: 'Una metodología para enseñar a programar', isCorrect: false },
    ],
  },
  {
    text: '¿Cuál de estos NO es un elemento de gamificación mencionado en el video?',
    timestamp: 60, // seconds
    type: 'multiple-choice',
    options: [
      { text: 'Puntos y recompensas', isCorrect: false },
      { text: 'Niveles y progreso', isCorrect: false },
      { text: 'Contratos y acuerdos legales', isCorrect: true },
      { text: 'Rankings y tablas de clasificación', isCorrect: false },
    ],
  },
];

async function seedUPlay(prisma) {
  console.log('Seeding UPlay data...');

  let mundo = await prisma.mundo.findFirst({ where: { name: 'UPlay Zone' } });
  if (!mundo) {
    mundo = await prisma.mundo.create({
      data: {
        name: 'UPlay Zone',
        description: 'Mundo para videos interactivos de UPlay',
      },
    });
    console.log('   - Created Mundo: UPlay Zone');
  }

  let playlist = await prisma.playlist.findFirst({ where: { name: 'Videos Principales UPlay' } });
  if (!playlist) {
    playlist = await prisma.playlist.create({
      data: {
        name: 'Videos Principales UPlay',
        description: 'Contenido principal de UPlay',
        mundoId: mundo.id,
      },
    });
    console.log('   - Created Playlist: Videos Principales UPlay');
  }

  let itemType = await prisma.itemType.findFirst({ where: { name: 'Video' } });
  if (!itemType) {
    itemType = await prisma.itemType.create({
      data: {
        name: 'Video',
        description: 'Elemento de tipo video para UPlay',
      },
    });
    console.log('   - Created ItemType: Video');
  }

  for (const video of uPlayVideos) {
    let videoRecord = await prisma.videoItem.findFirst({
      where: { title: video.title },
    });

    if (!videoRecord) {
      videoRecord = await prisma.videoItem.create({
        data: {
          title: video.title,
          description: video.description,
          content: video.description,
          externalId: video.youtubeId,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          playlistId: playlist.id,
          itemTypeId: itemType.id,
          categories: video.categories.join(','),
          platform: 'youtube',
          language: 'es',
        },
      });
      console.log(`   - Created video: ${video.title}`);

      // Añadir preguntas de prueba solo al video de Gamificación
      if (video.title.includes('Gamificación')) {
        console.log(`   - Adding test questions to video: ${video.title}`);
        for (const q of testQuestions) {
          const createdQuestion = await prisma.question.create({
            data: {
              videoItemId: videoRecord.id,
              text: q.text,
              timestamp: q.timestamp,
              type: q.type,
              languageCode: 'es',
              isActive: true,
            },
          });

          await prisma.answerOption.createMany({
            data: q.options.map((opt, index) => ({
              questionId: createdQuestion.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
              order: index,
            })),
          });
        }
        console.log(`   - Successfully added ${testQuestions.length} questions.`);
      }

    } else {
      console.log(`   - Video already exists, skipping: ${video.title}`);
    }
  }
  console.log('UPlay data seeded successfully.');
}

async function seedMarketplace(prisma) {
  console.log('Seeding Marketplace data...');

  // Obtener usuarios existentes
  const users = await prisma.user.findMany();
  const premiumUser = await prisma.user.findFirst({ where: { email: 'premium@gamifier.com' } });
  const creatorUser = await prisma.user.findFirst({ where: { email: 'creator@gamifier.com' } });
  const regularUser = await prisma.user.findFirst({ where: { email: 'user@gamifier.com' } });

  const marketplaceItems = [
    {
      name: 'Taller de Huerto Urbano Orgánico',
      description: 'Aprende a cultivar tus propios alimentos en espacios pequeños usando principios de permacultura.',
      itemType: 'SERVICE',
      price: 35,
      priceToins: 15,
      currency: 'UNITS',
      status: 'ACTIVE',
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
      tags: ['huerto', 'orgánico', 'taller', 'permacultura', 'sostenibilidad'],
      location: 'Online + Kit presencial',
      sellerId: creatorUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        duration: '3 horas',
        includes: ['Kit de semillas', 'Manual digital', 'Seguimiento 30 días'],
        level: 'Principiante'
      }),
    },
    {
      name: 'Kombucha Artesanal de Jengibre y Cúrcuma',
      description: 'Bebida probiótica fermentada artesanalmente con ingredientes 100% orgánicos y cultivados localmente.',
      itemType: 'PRODUCT',
      price: 15,
      priceToins: 8,
      currency: 'UNITS',
      status: 'ACTIVE',
      images: ['https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600'],
      tags: ['kombucha', 'probiótico', 'orgánico', 'salud', 'fermentado'],
      location: 'Medellín, Colombia',
      sellerId: premiumUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        volume: '500ml',
        ingredients: ['Té verde orgánico', 'Jengibre fresco', 'Cúrcuma', 'SCOBY'],
        shelfLife: '30 días refrigerado'
      }),
    },
    {
      name: 'Sesión de Sound Healing (Sanación con Sonido)',
      description: 'Viaje sonoro de 60 minutos con cuencos tibetanos, gongs y campanas para equilibrar tu energía.',
      itemType: 'SERVICE',
      price: 60,
      priceToins: 25,
      currency: 'UNITS',
      status: 'ACTIVE',
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
      tags: ['sound healing', 'meditación', 'bienestar', 'relajación', 'energía'],
      location: 'Online via Zoom',
      sellerId: regularUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        duration: '60 minutos',
        instruments: ['Cuencos tibetanos', 'Gongs', 'Campanas'],
        benefits: ['Reducción del estrés', 'Mejora del sueño', 'Equilibrio energético']
      }),
    },
    {
      name: 'Kit de Limpieza Energética: Salvia y Palo Santo',
      description: 'Set completo para rituales de limpieza energética con salvia blanca y palo santo de cultivo ético.',
      itemType: 'PRODUCT',
      price: 25,
      priceToins: 12,
      currency: 'UNITS',
      status: 'ACTIVE',
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'],
      tags: ['limpieza energética', 'salvia', 'palo santo', 'ritual', 'espiritual'],
      location: 'Bogotá, Colombia',
      sellerId: premiumUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        contents: ['3 varas de salvia blanca', '2 palos de palo santo', 'Manual de uso'],
        origin: 'Cultivo ético sostenible',
        certification: 'Fair Trade'
      }),
    },
    {
      name: 'Intercambio: Clases de Guitarra por Diseño Gráfico',
      description: 'Ofrezco clases de guitarra para principiantes a cambio de diseño de logo y material gráfico.',
      itemType: 'SKILL_EXCHANGE',
      price: 0,
      priceToins: 0,
      currency: 'UNITS',
      status: 'ACTIVE',
      images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600'],
      tags: ['intercambio', 'guitarra', 'música', 'diseño gráfico', 'ayni'],
      location: 'Online',
      sellerId: creatorUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        offering: {
          skill: 'Clases de Guitarra',
          level: 'Principiante a Intermedio',
          commitment: '2 horas semanales por 8 semanas'
        },
        seeking: {
          skill: 'Diseño Gráfico',
          needs: ['Logo personal', 'Material promocional', 'Identidad visual']
        }
      }),
    },
    {
      name: 'Microdosis de Cacao Ceremonial',
      description: 'Cacao puro ceremonial de Ecuador para ceremonias de apertura del corazón y conexión espiritual.',
      itemType: 'PRODUCT',
      price: 40,
      priceToins: 20,
      currency: 'UNITS',
      status: 'ACTIVE',
      images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=600'],
      tags: ['cacao ceremonial', 'medicina natural', 'ceremonia', 'conexión', 'Ecuador'],
      location: 'Envío nacional',
      sellerId: regularUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        weight: '250g',
        origin: 'Cacao ancestral de Ecuador',
        preparation: 'Para 8-10 ceremonias',
        includes: 'Guía de preparación'
      }),
    }
  ];

  for (const item of marketplaceItems) {
    const existingItem = await prisma.marketplaceItem.findFirst({
      where: { name: item.name }
    });

    if (!existingItem) {
      await prisma.marketplaceItem.create({
        data: item
      });
      console.log(`   - Created marketplace item: ${item.name}`);
    } else {
      console.log(`   - Marketplace item already exists: ${item.name}`);
    }
  }

  console.log('Marketplace data seeded successfully.');
}

async function seedPermissionsAndRoles(prisma) {
  console.log('Seeding permissions and roles...');

  const permissions = [
    // System & Analytics
    { name: 'system:health', description: 'Access to system health metrics' },
    { name: 'analytics:read', description: 'Access to all analytics dashboards' },
    { name: 'dashboard:view', description: 'Can view the main admin dashboard' },

    // User Management
    { name: 'users:read', description: 'Read access to user data' },
    { name: 'users:write', description: 'Write access to user data' },
    { name: 'users:manage', description: 'Full access to manage users' },

    // Content Management
    { name: 'content:read', description: 'Read access to content' },
    { name: 'content:write', description: 'Write access to content' },
    { name: 'content:manage', description: 'Full access to manage content' },

    // Gamification & Challenges
    { name: 'gamification:manage', description: 'Manage gamification settings' },
    { name: 'challenges:manage', description: 'Manage challenges' },

    // Marketplace & Wallet
    { name: 'marketplace:manage', description: 'Manage marketplace items' },
    { name: 'wallet:manage', description: 'Manage user wallets and transactions' },

    // RBAC
    { name: 'roles:read', description: 'Read access to roles and permissions' },
    { name: 'roles:write', description: 'Write access to roles and permissions' },

    // Invitations
    { name: 'invitations:send', description: 'Ability to send invitations' },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }
  console.log('   - Upserted all application permissions.');

  const allPermissions = await prisma.permission.findMany();

  // Roles
  const roles = [
    { name: 'admin', description: 'Administrator with all permissions' },
    { name: 'user', description: 'Regular user with basic permissions' },
    { name: 'premium', description: 'Premium user with extended permissions' },
    { name: 'creator', description: 'Content creator' },
    { name: 'moderator', description: 'Content and community moderator' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
  }
  console.log('   - Upserted all application roles.');

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });

  if (adminRole) {
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log('   - Assigned all permissions to "admin" role.');
  }

  // Assign basic permissions to 'user' role
  const userPermissions = await prisma.permission.findMany({
    where: {
      name: { in: ['content:read', 'wallet:read'] },
    },
  });

  if (userRole) {
    for (const permission of userPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log('   - Assigned basic permissions to "user" role.');
  }

  console.log('Permissions and roles seeded successfully.');
}

async function main() {
  console.log('Starting database seeding...');

  // Seed Permissions and Roles first as other entities depend on them
  await seedPermissionsAndRoles(prisma);

  // Then seed users, as they are needed by Marketplace and others
  const users = [
    // ... (user creation logic remains the same)
    { email: 'admin@gamifier.com', name: 'Admin', password: 'admin123', roles: ['admin'] },
    { email: 'user@gamifier.com', name: 'User', password: '123456', roles: ['user'] },
    { email: 'premium@gamifier.com', name: 'Premium User', password: '123456', roles: ['user', 'premium'] },
    { email: 'creator@gamifier.com', name: 'Content Creator', password: '123456', roles: ['user', 'creator'] },
    { email: 'moderator@gamifier.com', name: 'Moderator', password: '123456', roles: ['user', 'moderator'] },
  ];

  const salt = await bcrypt.genSalt(12);

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      },
    });

    const userRoles = await prisma.role.findMany({
      where: { name: { in: userData.roles } },
    });

    for (const role of userRoles) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
    console.log(`   - Upserted user: ${userData.email} with roles: ${userData.roles.join(', ')}`);
  }

  await seedUPlay(prisma);
  await seedMarketplace(prisma);

  console.log('Database seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
