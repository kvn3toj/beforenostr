import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('123456', 10);

  // 1. Create Roles if they don't exist
  const rolesToCreate = [
    { name: 'admin', description: 'Administrator role' },
    { name: 'user', description: 'Standard user role' },
    { name: 'premium', description: 'Premium user role' },
    { name: 'creator', description: 'Content creator role' },
    { name: 'moderator', description: 'Moderator role' },
  ];

  const createdRoles: { [key: string]: any } = {};
  for (const roleData of rolesToCreate) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
    createdRoles[role.name] = role;
  }

  // 2. Create users and link them to roles
  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gamifier.com' },
    update: {},
    create: {
      email: 'admin@gamifier.com',
      password: adminPassword,
      name: 'Admin User',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: adminUser.id, roleId: createdRoles['admin'].id },
    },
    update: {},
    create: { userId: adminUser.id, roleId: createdRoles['admin'].id },
  });

  // Regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@gamifier.com' },
    update: {},
    create: {
      email: 'user@gamifier.com',
      password: userPassword,
      name: 'Regular User',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: regularUser.id,
        roleId: createdRoles['user'].id,
      },
    },
    update: {},
    create: { userId: regularUser.id, roleId: createdRoles['user'].id },
  });

  // Premium user
  const premiumUser = await prisma.user.upsert({
    where: { email: 'premium@gamifier.com' },
    update: {},
    create: {
      email: 'premium@gamifier.com',
      password: userPassword,
      name: 'Premium User',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: premiumUser.id,
        roleId: createdRoles['premium'].id,
      },
    },
    update: {},
    create: { userId: premiumUser.id, roleId: createdRoles['premium'].id },
  });

  // Create content creator user
  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@gamifier.com' },
    update: {},
    create: {
      email: 'creator@gamifier.com',
      password: userPassword,
      name: 'Content Creator',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: creatorUser.id,
        roleId: createdRoles['creator'].id,
      },
    },
    update: {},
    create: { userId: creatorUser.id, roleId: createdRoles['creator'].id },
  });

  // Create moderator user
  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@gamifier.com' },
    update: {},
    create: {
      email: 'moderator@gamifier.com',
      password: userPassword,
      name: 'Moderator',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: moderatorUser.id,
        roleId: createdRoles['moderator'].id,
      },
    },
    update: {},
    create: { userId: moderatorUser.id, roleId: createdRoles['moderator'].id },
  });

  console.log('Development users seeded successfully!');

  // 3. Create a default Mundo (World) if it doesn't exist
  const defaultMundo = await prisma.mundo.upsert({
    where: { id: 'default-mundo-id' },
    update: {},
    create: {
      id: 'default-mundo-id',
      name: 'Mundo Principal',
      description: 'El mundo central de la experiencia CoomÜnity.',
      createdById: adminUser.id,
    },
  });

  // Create a default ItemType for videos
  const defaultVideoType = await prisma.itemType.upsert({
    where: { id: 'default-video-type' },
    update: {},
    create: {
      id: 'default-video-type',
      name: 'Video',
      description: 'Item de tipo video para playlists gamificadas.',
    },
  });

  // 4. Create sample Playlists and VideoItems
  console.log('Seeding playlists and videos...');

  const playlist1 = await prisma.playlist.upsert({
    where: { id: 'clxofy60p0000123456789abc' },
    update: {},
    create: {
      id: 'clxofy60p0000123456789abc',
      name: 'Introducción a CoomÜnity',
      description: 'Descubre los fundamentos de nuestra filosofía y cómo funciona la plataforma.',
      createdById: adminUser.id,
      mundoId: defaultMundo.id,
    },
  });

  const playlist2 = await prisma.playlist.upsert({
    where: { id: 'clxofy60p0001123456789def' },
    update: {},
    create: {
      id: 'clxofy60p0001123456789def',
      name: 'Gamificación Avanzada',
      description: 'Profundiza en las mecánicas y estrategias de la gamificación consciente.',
      createdById: creatorUser.id,
      mundoId: defaultMundo.id,
    },
  });

  await prisma.videoItem.createMany({
    data: [
      {
        title: '¿Qué es Ayni?',
        description: 'Una explicación sobre el principio de reciprocidad.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
        duration: 180,
        playlistId: playlist1.id,
        content: 'Contenido del video sobre Ayni',
        itemTypeId: defaultVideoType.id,
      },
      {
        title: 'El Bien Común en la Práctica',
        description: 'Cómo nuestras acciones contribuyen al colectivo.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 240,
        playlistId: playlist1.id,
        content: 'Contenido del video sobre Bien Común',
        itemTypeId: defaultVideoType.id,
      },
      {
        title: 'Diseñando Recompensas con Propósito',
        description: 'Más allá de los puntos: Mëritos y Öndas.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 300,
        playlistId: playlist2.id,
        content: 'Contenido del video sobre Recompensas',
        itemTypeId: defaultVideoType.id,
      },
      {
        title: 'Metanöia: La Transformación Digital',
        description: 'El cambio de perspectiva en la era digital.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 210,
        playlistId: playlist2.id,
        content: 'Contenido del video sobre Metanöia',
        itemTypeId: 'default-video-type',
      },
      {
        title: 'Navegando tu Perfil de Jugador',
        description: 'Un tour por tu dashboard y funcionalidades.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 150,
        playlistId: playlist1.id,
        content: 'Contenido del video sobre Perfil',
        itemTypeId: 'default-video-type',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Playlists and videos seeded successfully!');

  // 5. Create Marketplace Items
  console.log('Seeding marketplace items...');

  await prisma.marketplaceItem.createMany({
    data: [
      {
        name: 'Consultoría de Diseño Sostenible',
        description:
          'Ayudo a marcas a crear productos y empaques que respetan el medio ambiente, utilizando materiales reciclados y procesos de bajo impacto. Sesión de 1 hora.',
        itemType: 'SERVICE',
        price: 50,
        tags: ['diseño', 'sostenibilidad', 'consultoria', 'eco-friendly'],
        images: [
          'https://images.unsplash.com/photo-1579532537598-419180247ac8?w=800&q=80',
        ],
        location: 'Online',
        sellerId: creatorUser.id,
      },
      {
        name: 'Kombucha Artesanal de Jengibre y Cúrcuma',
        description:
          'Bebida probiótica fermentada artesanalmente con ingredientes 100% orgánicos. Botella de 500ml. Promueve la salud digestiva y fortalece el sistema inmune.',
        itemType: 'PRODUCT',
        price: 15,
        tags: ['organico', 'salud', 'probiotico', 'artesanal'],
        images: [
          'https://images.unsplash.com/photo-1556679343-c7306c19761a?w=800&q=80',
        ],
        location: 'Entrega Local (Bogotá)',
        sellerId: premiumUser.id,
      },
      {
        name: 'Taller de Jardinería Urbana',
        description:
          'Aprende a cultivar tus propios alimentos en espacios pequeños. Un taller práctico de 3 horas donde te llevarás tu primera planta y todas las bases para empezar tu huerto en casa.',
        itemType: 'EXPERIENCE',
        price: 35,
        tags: ['taller', 'jardineria', 'diy', 'aprendizaje'],
        images: [
          'https://images.unsplash.com/photo-1587843899958-3738a4a03a0c?w=800&q=80',
        ],
        location: 'Chapinero, Bogotá',
        sellerId: creatorUser.id,
      },
      {
        name: 'Intercambio: Clases de Guitarra por Diseño Gráfico',
        description:
          'Ofrezco clases de guitarra para principiantes (acústica/eléctrica) a cambio de ayuda con el diseño de un logo y branding para mi proyecto musical. Abierto a propuestas.',
        itemType: 'SKILL_EXCHANGE',
        price: 0, // El valor es el intercambio
        tags: ['musica', 'diseño', 'intercambio', 'colaboracion'],
        images: [
          'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80',
        ],
        location: 'Remoto / Bogotá',
        sellerId: regularUser.id,
      },
      {
        name: 'Desarrollo de Landing Page con React',
        description:
          'Creo landing pages modernas, rápidas y optimizadas para SEO utilizando React y Next.js. El paquete básico incluye diseño, desarrollo y despliegue.',
        itemType: 'SERVICE',
        price: 250,
        tags: ['desarrollo', 'web', 'react', 'seo', 'tecnologia'],
        images: [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        ],
        location: 'Online',
        sellerId: creatorUser.id,
      },
      {
        name: 'Juego de Tazas de Cerámica Hechas a Mano',
        description:
          'Set de 2 tazas de cerámica esmaltada, perfectas para tu café de la mañana. Cada pieza es única y hecha a mano en torno de alfarero.',
        itemType: 'PRODUCT',
        price: 40,
        tags: ['ceramica', 'artesanal', 'hogar', 'hecho-a-mano'],
        images: [
          'https://images.unsplash.com/photo-1588499839493-5339a1a2b5e2?w=800&q=80',
        ],
        location: 'Envíos a todo el país',
        sellerId: premiumUser.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Marketplace items seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
