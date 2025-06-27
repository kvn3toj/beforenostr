import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Personalidades (idempotente)
  await prisma.personality.createMany({
    data: [
      {
        name: 'Visionario',
        description: 'Persona con visión amplia y creativa',
        traits: 'creatividad, intuición, liderazgo',
      },
    ],
    skipDuplicates: true,
  });
  const personality = await prisma.personality.findFirst({ where: { name: 'Visionario' } });

  // Permisos (idempotente)
  await prisma.permission.createMany({
    data: [
      { name: 'admin', description: 'Permiso de administrador' },
    ],
    skipDuplicates: true,
  });
  const permission = await prisma.permission.findFirst({ where: { name: 'admin' } });

  // Roles (idempotente)
  await prisma.role.createMany({
    data: [
      { name: 'Administrador', description: 'Rol de admin' },
    ],
    skipDuplicates: true,
  });
  const role = await prisma.role.findFirst({ where: { name: 'Administrador' } });

  // RolePermissions (idempotente)
  await prisma.rolePermission.createMany({
    data: [
      { roleId: role!.id, permissionId: permission!.id },
    ],
    skipDuplicates: true,
  });

  // Usuarios (idempotente)
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@gamifier.com',
        password: 'admin123',
        name: 'Admin',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  const user = await prisma.user.findFirst({ where: { email: 'admin@gamifier.com' } });

  // ItemType (idempotente)
  await prisma.itemType.createMany({
    data: [
      { name: 'Video', description: 'Video de YouTube' },
    ],
    skipDuplicates: true,
  });
  const itemType = await prisma.itemType.findFirst({ where: { name: 'Video' } });

  if (!role) throw new Error('No se encontró el rol Administrador');
  if (!permission) throw new Error('No se encontró el permiso admin');
  if (!user) throw new Error('No se encontró el usuario admin@gamifier.com');

  // Limpieza previa de questions, video_items, stages, playlists, mundos y worlds para evitar conflictos de clave foránea
  await prisma.question.deleteMany({});
  await prisma.videoItem.deleteMany({});
  await prisma.stage.deleteMany({});
  await prisma.playlist.deleteMany({});
  await prisma.mundo.deleteMany({});
  await prisma.world.deleteMany({});

  // Crear mundo principal (para playlists)
  const mundo = await prisma.mundo.create({
    data: {
      name: 'Mundo Principal',
      description: 'Mundo de ejemplo',
      isActive: true,
      createdById: user.id,
    },
  });

  // Crear world principal (para stages)
  const world = await prisma.world.create({
    data: {
      name: 'World Principal',
      type: 'demo',
      creatorId: user.id,
      description: 'World de ejemplo',
    },
  });

  // Playlist (idempotente, con mundoId)
  await prisma.playlist.createMany({
    data: [
      { name: 'Playlist Principal', description: 'Lista de videos principal', isActive: true, mundoId: mundo.id, createdById: user.id },
    ],
    skipDuplicates: true,
  });
  const playlist = await prisma.playlist.findFirst({ where: { name: 'Playlist Principal', mundoId: mundo.id } });
  if (!playlist) throw new Error('No se encontró la playlist principal');
  if (!itemType) throw new Error('No se encontró el itemType Video');

  // Stages (idempotente, con worldId)
  await prisma.stage.createMany({
    data: [
      { name: 'Inicio', description: 'Primer stage', worldId: world.id, order: 1 },
      { name: 'Avance', description: 'Stage de avance', worldId: world.id, order: 2 },
    ],
    skipDuplicates: true,
  });

  // VideoItems
  const videoItem = await prisma.videoItem.create({
    data: {
      title: 'Video de Bienvenida',
      description: 'Primer video',
      content: 'Contenido de ejemplo',
      playlistId: playlist.id,
      itemTypeId: itemType.id,
      isActive: true,
    },
  });

  // Preguntas y Respuestas
  const question = await prisma.question.create({
    data: {
      videoItemId: videoItem.id,
      timestamp: 10,
      type: 'multiple-choice',
      text: '¿Qué representa el Fuego?',
      languageCode: 'es',
      isActive: true,
      answerOptions: {
        create: [
          { text: 'Acción', isCorrect: true, order: 1 },
          { text: 'Pasividad', isCorrect: false, order: 2 },
        ],
      },
    },
    include: { answerOptions: true },
  });

  // Wallet (idempotente)
  await prisma.wallet.createMany({
    data: [
      { userId: user.id, balanceUnits: 100, balanceToins: 10, status: 'ACTIVE' },
    ],
    skipDuplicates: true,
  });

  // Token (idempotente)
  await prisma.token.createMany({
    data: [
      { userId: user.id, amount: 50, type: 'LUKAS', status: 'ACTIVE', source: 'seed' },
    ],
    skipDuplicates: true,
  });

  // Merit (idempotente)
  await prisma.merit.createMany({
    data: [
      { userId: user.id, amount: 100, type: 'ayni', source: 'bien comun' },
    ],
    skipDuplicates: true,
  });

  // Notification (idempotente)
  await prisma.notification.createMany({
    data: [
      { userId: user.id, type: 'info', message: '¡Bienvenido a CoomÜnity!', read: false },
    ],
    skipDuplicates: true,
  });

  // MarketplaceItem
  await prisma.marketplaceItem.create({
    data: {
      name: 'Servicio de Mentoría',
      description: 'Mentoría personalizada',
      price: 10,
      currency: 'LUKAS',
      itemType: 'SERVICE',
      status: 'ACTIVE',
      sellerId: user.id,
      isActive: true,
      images: [],
      tags: [],
    },
  });

  // Grupo
  const group = await prisma.group.create({
    data: {
      name: 'Grupo Inicial',
      ownerId: user.id,
      type: 'comunidad',
      userGroups: { create: [{ userId: user.id }] },
    },
  });

  // Publicación y Like
  const publication = await prisma.publication.create({
    data: {
      userId: user.id,
      content: '¡Bienvenidos!',
      type: 'anuncio',
    },
  });
  await prisma.like.create({
    data: {
      userId: user.id,
      publicationId: publication.id,
    },
  });

  // Ranking
  await prisma.ranking.create({
    data: {
      name: 'Ranking Inicial',
      type: 'general',
      period: '2025-Q2',
      data: '{}',
    },
  });

  // Configuración (idempotente)
  await prisma.configuration.createMany({
    data: [
      { key: 'app.theme', value: 'guardian', type: 'app' },
      { key: 'app.language', value: 'es', type: 'app' },
    ],
    skipDuplicates: true,
  });

  // Experiences (idempotente)
  // Ajusta los campos según el modelo actual, si no existen, comenta esta sección
  // await prisma.experience.createMany({
  //   data: [
  //     { /* campos válidos aquí */ },
  //   ],
  //   skipDuplicates: true,
  // });

  // Log
  await prisma.log.create({
    data: {
      level: 'info',
      message: 'Seed extendido ejecutado',
      context: 'seed-extended',
    },
  });

  // Poblar videos reales de YouTube (sin Rick Astley)
  await prisma.videoItem.createMany({
    data: [
      {
        title: 'The Game Changers',
        description: 'Documental sobre atletas veganos',
        url: 'https://www.youtube.com/watch?v=iSpglxHTJVM',
        externalId: 'iSpglxHTJVM',
        thumbnailUrl: 'https://img.youtube.com/vi/iSpglxHTJVM/hqdefault.jpg',
        playlistId: playlist.id,
        itemTypeId: itemType.id,
        isActive: true,
        content: 'Video real de YouTube',
      },
      {
        title: 'Happy',
        description: 'Documental sobre la felicidad',
        url: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
        externalId: 'ZbZSe6N_BXs',
        thumbnailUrl: 'https://img.youtube.com/vi/ZbZSe6N_BXs/hqdefault.jpg',
        playlistId: playlist.id,
        itemTypeId: itemType.id,
        isActive: true,
        content: 'Video real de YouTube',
      },
      {
        title: 'What the Bleep Do We Know!?',
        description: 'Película documental sobre física cuántica y consciencia',
        url: 'https://www.youtube.com/watch?v=ioONhpIJ-NY',
        externalId: 'ioONhpIJ-NY',
        thumbnailUrl: 'https://img.youtube.com/vi/ioONhpIJ-NY/hqdefault.jpg',
        playlistId: playlist.id,
        itemTypeId: itemType.id,
        isActive: true,
        content: 'Video real de YouTube',
      },
      {
        title: 'The Great Hack',
        description: 'Documental sobre privacidad y datos',
        url: 'https://www.youtube.com/watch?v=iX8GxLP1FHo',
        externalId: 'iX8GxLP1FHo',
        thumbnailUrl: 'https://img.youtube.com/vi/iX8GxLP1FHo/hqdefault.jpg',
        playlistId: playlist.id,
        itemTypeId: itemType.id,
        isActive: true,
        content: 'Video real de YouTube',
      },
    ],
    skipDuplicates: true,
  });

  // Poblar Experience (asociada al primer stage y usuario)
  const stage = await prisma.stage.findFirst({});
  if (stage) {
    const experience = await prisma.experience.create({
      data: {
        stageId: stage.id,
        title: 'Experiencia Demo',
        description: 'Demo de experiencia avanzada',
        type: 'tutorial',
        creatorId: user.id,
      },
    });

    // Poblar Activity (asociada a la experiencia y usuario)
    const activity = await prisma.activity.create({
      data: {
        experienceId: experience.id,
        title: 'Actividad Demo',
        description: 'Actividad de ejemplo',
        type: 'video',
        creatorId: user.id,
      },
    });

    // Poblar GamifiedPlaylist (asociada a activity y playlist)
    await prisma.gamifiedPlaylist.create({
      data: {
        activityId: activity.id,
        playlistId: playlist.id,
        name: 'Gamified Demo',
        type: 'sequential',
        sequenceType: 'linear',
      },
    });

    // Poblar ActivityQuestion
    const activityQuestion = await prisma.activityQuestion.create({
      data: {
        activityId: activity.id,
        type: 'multiple_choice',
        questionType: 'quiz',
        questionText: '¿Qué es CoomÜnity?',
        options: 'Comunidad, Plataforma, Juego',
        correctAnswer: 'Comunidad',
      },
    });

    // Poblar UserAnswer
    await prisma.userAnswer.create({
      data: {
        userId: user.id,
        activityQuestionId: activityQuestion.id,
        answerGiven: 'Comunidad',
        isCorrect: true,
      },
    });
  }

  // Poblar AnalyticsData (requiere video)
  const video = await prisma.videoItem.findFirst({});
  if (video) {
    await prisma.analyticsData.create({
      data: {
        userId: user.id,
        eventType: 'video_play',
        videoItemId: String(video.id),
        timestamp: new Date(),
      },
    });

    // Poblar Subtitle (para el primer video)
    await prisma.subtitle.create({
      data: {
        videoItemId: video.id,
        languageCode: 'es',
        format: 'srt',
        content: '1\n00:00:01,000 --> 00:00:04,000\nBienvenido a CoomÜnity',
      },
    });

    // Poblar VideoPermissions (para el primer video)
    await prisma.videoPermissions.create({
      data: {
        videoItemId: video.id,
        showWaveCount: true,
        showVideos: true,
        showVideoSubtitles: true,
        showComments: true,
        allowViewComments: true,
        allowMakeComments: true,
        showLikeButton: true,
        playlistPosition: 'position1',
        isDraft: false,
      },
    });
  }

  // Poblar Transaction (entre dos usuarios y wallets)
  const user2 = await prisma.user.findFirst({ where: { email: { not: user.email } } });
  const wallet1 = await prisma.wallet.findFirst({ where: { userId: user.id } });
  const wallet2 = user2 ? await prisma.wallet.findFirst({ where: { userId: user2.id } }) : null;
  if (user2 && wallet1 && wallet2) {
    await prisma.transaction.create({
      data: {
        fromUserId: user.id,
        toUserId: user2.id,
        amount: 10,
        tokenType: 'LUKAS',
        type: 'transfer',
      },
    });
  }

  console.log('✅ Seed extendido ejecutado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
