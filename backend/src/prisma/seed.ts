import { PrismaClient } from '../generated/prisma';
const bcrypt = require('bcrypt');

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
      {
        text: 'El uso de elementos de juego en contextos no lúdicos',
        isCorrect: true,
      },
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

  let playlist = await prisma.playlist.findFirst({
    where: { name: 'Videos Principales UPlay' },
  });
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
        console.log(
          `   - Successfully added ${testQuestions.length} questions.`
        );
      }
    } else {
      console.log(`   - Video already exists, skipping: ${video.title}`);
    }
  }
  console.log('UPlay data seeded successfully.');
}

async function seedPermissionsAndRoles(prisma) {
  console.log('Seeding permissions and roles...');
  const permissions = [
    // ... (permission definitions)
    'create:users',
    'read:users',
    'update:users',
    'delete:users',
    'create:roles',
    'read:roles',
    'update:roles',
    'delete:roles',
    'create:content',
    'read:content',
    'update:content',
    'delete:content',
    'manage:system',
  ];

  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const roles = [
    { name: 'admin', permissions },
    { name: 'user', permissions: ['read:content'] },
    {
      name: 'creator',
      permissions: ['read:content', 'create:content', 'update:content'],
    },
    {
      name: 'moderator',
      permissions: ['read:content', 'update:content', 'delete:content'],
    },
    { name: 'premium', permissions: ['read:content'] },
  ];

  for (const roleData of roles) {
    const createdRole = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: { name: roleData.name },
    });

    const permissionRecords = await prisma.permission.findMany({
      where: { name: { in: roleData.permissions } },
    });

    // ✨ TRANSMUTACIÓN CÓSMICA: Usar RolePermission (tabla intermedia) en lugar de relación directa
    for (const permission of permissionRecords) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: createdRole.id,
            permissionId: permission.id,
          },
        },
        update: {}, // Si ya existe, no hacer nada
        create: {
          roleId: createdRole.id,
          permissionId: permission.id,
        },
      });
    }

    console.log(
      `   - Assigned ${permissionRecords.length} permissions to role: ${roleData.name}`
    );
  }
  console.log('Permissions and roles seeded successfully.');
}

async function main() {
  console.log(`Start seeding production data...`);

  await seedPermissionsAndRoles(prisma);

  const users = [
    {
      email: 'admin@gamifier.com',
      password: 'CoomUnity2025!Admin', // 🔐 Nueva contraseña segura para producción
      roleNames: ['admin'],
      name: 'Admin',
      lastName: 'User',
      username: 'admin',
      currentStage: 'PROMOTER',
    },
    {
      email: 'user@gamifier.com',
      password: '123456',
      roleNames: ['user'],
      name: 'Regular',
      lastName: 'User',
      username: 'user',
      currentStage: 'SEEKER',
    },
    {
      email: 'premium@gamifier.com',
      password: '123456',
      roleNames: ['user', 'premium'],
      name: 'Premium',
      lastName: 'User',
      username: 'premium',
      currentStage: 'SOLVER',
    },
    {
      email: 'creator@gamifier.com',
      password: '123456',
      roleNames: ['user', 'creator'],
      name: 'Content',
      lastName: 'Creator',
      username: 'creator',
      currentStage: 'SOLVER',
    },
    {
      email: 'moderator@gamifier.com',
      password: '123456',
      roleNames: ['user', 'moderator'],
      name: 'Moderator',
      lastName: 'User',
      username: 'moderator',
      currentStage: 'PROMOTER',
    },
  ];
  console.log('Seeding users...');
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 🔐 SEGURIDAD: Usar upsert para actualizar contraseñas existentes
    const upsertedUser = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: hashedPassword, // ✨ Actualiza la contraseña si el usuario existe
        name: userData.name,
        lastName: userData.lastName,
        username: userData.username,
        currentStage: userData.currentStage,
      },
      create: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        lastName: userData.lastName,
        username: userData.username,
        currentStage: userData.currentStage,
      },
    });

    // 🔗 Asignar roles (limpiar roles existentes y reasignar)
    await prisma.userRole.deleteMany({
      where: { userId: upsertedUser.id },
    });

    const roles = await prisma.role.findMany({
      where: { name: { in: userData.roleNames } },
    });

    for (const role of roles) {
      await prisma.userRole.create({
        data: {
          userId: upsertedUser.id,
          roleId: role.id,
        },
      });
    }

    console.log(
      `   - Upserted user: ${userData.email} with roles: ${userData.roleNames.join(', ')}`
    );
  }
  console.log('Users seeded successfully.');

  await seedUPlay(prisma);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
