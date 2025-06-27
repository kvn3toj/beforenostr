const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const uPlayVideos = [
  {
    title: 'La Economía del Bien Común: Un Nuevo Modelo',
    description: 'Christian Felber explica los principios de la Economía del Bien Común como alternativa al capitalismo tradicional.',
    youtubeId: '7xX-KF08v6I',
    duration: 1089,
    categories: ['Economía', 'Bien Común'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/7xX-KF08v6I/maxresdefault.jpg',
  },
  {
    title: 'Permacultura: Diseñando un Futuro Sostenible',
    description: 'Introducción a los principios de la permacultura y cómo aplicarlos para crear sistemas regenerativos.',
    youtubeId: 'hftgWcD-1Nw',
    duration: 1456,
    categories: ['Sustentabilidad', 'Permacultura'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/hftgWcD-1Nw/maxresdefault.jpg',
  },
  {
    title: 'Mindfulness: La Revolución de la Atención Plena',
    description: 'Jon Kabat-Zinn explica los beneficios de la práctica de mindfulness para el bienestar integral.',
    youtubeId: '3nwwKbM_vJc',
    duration: 3654,
    categories: ['Bienestar', 'Mindfulness'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/3nwwKbM_vJc/maxresdefault.jpg',
  },
  {
    title: 'Economía Circular: Rediseñando el Futuro',
    description: 'Ellen MacArthur presenta el concepto de economía circular y su potencial transformador.',
    youtubeId: 'zCRKvDyyHmI',
    duration: 913,
    categories: ['Economía', 'Sustentabilidad'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/zCRKvDyyHmI/maxresdefault.jpg',
  },
  {
    title: 'Biomímesis: Innovación Inspirada en la Naturaleza',
    description: 'Janine Benyus explora cómo la naturaleza puede inspirar soluciones tecnológicas sostenibles.',
    youtubeId: 'k_GFq12w5WU',
    duration: 1034,
    categories: ['Innovación', 'Biomímesis'],
    thumbnailUrl: 'https://i3.ytimg.com/vi/k_GFq12w5WU/maxresdefault.jpg',
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
    const existingVideo = await prisma.videoItem.findFirst({
      where: { title: video.title },
    });

    if (!existingVideo) {
      await prisma.videoItem.create({
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
      currency: 'LUKAS',
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
      currency: 'LUKAS',
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
      currency: 'LUKAS',
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
      currency: 'LUKAS',
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
      currency: 'LUKAS',
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
      currency: 'LUKAS',
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

async function main() {
  try {
    // --- Hashear contraseñas ---
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('123456', 10);

    // --- Roles ---
    await prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin' } });
    await prisma.role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user' } });
    await prisma.role.upsert({ where: { name: 'premium' }, update: {}, create: { name: 'premium' } });
    await prisma.role.upsert({ where: { name: 'creator' }, update: {}, create: { name: 'creator' } });
    await prisma.role.upsert({ where: { name: 'moderator' }, update: {}, create: { name: 'moderator' } });

    // --- Usuarios ---
    await prisma.user.upsert({
      where: { email: 'admin@gamifier.com' },
      update: { password: adminPassword },
      create: { email: 'admin@gamifier.com', password: adminPassword, name: 'Admin', userRoles: { create: { role: { connect: { name: 'admin' } } } } },
    });
    await prisma.user.upsert({
      where: { email: 'user@gamifier.com' },
      update: { password: userPassword },
      create: { email: 'user@gamifier.com', password: userPassword, name: 'Regular User', userRoles: { create: { role: { connect: { name: 'user' } } } } },
    });
     await prisma.user.upsert({
      where: { email: 'premium@gamifier.com' },
      update: { password: userPassword },
      create: { email: 'premium@gamifier.com', password: userPassword, name: 'Premium User', userRoles: { create: [{ role: { connect: { name: 'user' } } }, { role: { connect: { name: 'premium' } } }] } },
    });
    await prisma.user.upsert({
      where: { email: 'creator@gamifier.com' },
      update: { password: userPassword },
      create: { email: 'creator@gamifier.com', password: userPassword, name: 'Content Creator', userRoles: { create: [{ role: { connect: { name: 'user' } } }, { role: { connect: { name: 'creator' } } }] } },
    });
    await prisma.user.upsert({
      where: { email: 'moderator@gamifier.com' },
      update: { password: userPassword },
      create: { email: 'moderator@gamifier.com', password: userPassword, name: 'Moderator', userRoles: { create: [{ role: { connect: { name: 'user' } } }, { role: { connect: { name: 'moderator' } } }] } },
    });

    console.log('Seed data for gamifier admin created successfully.');

    // --- Videos de UPlay ---
    await seedUPlay(prisma);

    // --- Marketplace ---
    await seedMarketplace(prisma);

  } catch (e) {
    console.error('Error during seeding:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
