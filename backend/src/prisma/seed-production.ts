import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createRoles(prisma: PrismaClient) {
  console.log('🔑 Creating roles...');

  const rolesData = [
    { name: 'admin', description: 'Administrator role' },
    { name: 'user', description: 'Regular user role' },
    { name: 'premium', description: 'Premium user role' },
    { name: 'creator', description: 'Content creator role' },
    { name: 'moderator', description: 'Moderator role' },
  ];

  for (const roleData of rolesData) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }

  console.log('✅ Roles created successfully');
}

async function createUsers(prisma: PrismaClient) {
  console.log('👥 Creating users...');

  const usersData = [
    {
      email: 'admin@gamifier.com',
      password: await bcrypt.hash('CoomUnity2025!Admin', 10),
      name: 'Admin',
      roles: ['admin'],
      stage: 'PROMOTER',
    },
    {
      email: 'user@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Usuario Regular',
      roles: ['user'],
      stage: 'SEEKER',
    },
    {
      email: 'premium@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Usuario Premium',
      roles: ['user', 'premium'],
      stage: 'SOLVER',
    },
    {
      email: 'creator@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Content Creator',
      roles: ['user', 'creator'],
      stage: 'SOLVER',
    },
    {
      email: 'moderator@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Moderador',
      roles: ['user', 'moderator'],
      stage: 'PROMOTER',
    },
  ];

  for (const userData of usersData) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: userData.password,
        name: userData.name,
      },
      create: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        status: 'ACTIVE',
      },
    });

    // Create or update stage progression
    const existingStageProgression = await prisma.stageProgression.findFirst({
      where: {
        userId: user.id,
        stage: userData.stage as any,
      },
    });

    if (existingStageProgression) {
      await prisma.stageProgression.update({
        where: { id: existingStageProgression.id },
        data: {
          isActive: true,
          requirements: {},
        },
      });
    } else {
      await prisma.stageProgression.create({
        data: {
          userId: user.id,
          stage: userData.stage as any,
          isActive: true,
          requirements: {},
        },
      });
    }

    // Assign roles
    for (const roleName of userData.roles) {
      const role = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (role) {
        const existingUserRole = await prisma.userRole.findFirst({
          where: {
            userId: user.id,
            roleId: role.id,
          },
        });

        if (!existingUserRole) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: role.id,
            },
          });
        }
      }
    }
  }

  console.log('✅ Users created successfully');
}

async function createMarketplaceItems(prisma: PrismaClient) {
  console.log('🏪 Creating marketplace items...');

  // Get users for marketplace items
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@gamifier.com' },
  });
  const creatorUser = await prisma.user.findUnique({
    where: { email: 'creator@gamifier.com' },
  });
  const regularUser = await prisma.user.findUnique({
    where: { email: 'user@gamifier.com' },
  });

  const defaultSellerId = adminUser?.id || creatorUser?.id || regularUser?.id;

  if (!defaultSellerId) {
    console.log('⚠️ No users found, skipping marketplace items');
    return;
  }

  const marketplaceItems = [
    {
      name: 'Taller de Huerto Urbano Orgánico',
      description: 'Aprende a cultivar tus propios alimentos en espacios pequeños usando principios de permacultura.',
      itemType: 'SERVICE' as const,
      price: 35,
      priceToins: 15,
      currency: 'UNITS' as const,
      status: 'ACTIVE' as const,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
      tags: ['huerto', 'orgánico', 'taller', 'permacultura', 'sostenibilidad'],
      location: 'Online + Kit presencial',
      sellerId: creatorUser?.id || defaultSellerId,
      metadata: JSON.stringify({
        duration: '3 horas',
        includes: ['Kit de semillas', 'Manual digital', 'Seguimiento 30 días'],
        level: 'Principiante',
      }),
    },
    {
      name: 'Kombucha Artesanal de Jengibre y Cúrcuma',
      description: 'Bebida probiótica fermentada artesanalmente con ingredientes 100% orgánicos.',
      itemType: 'PRODUCT' as const,
      price: 15,
      priceToins: 8,
      currency: 'UNITS' as const,
      status: 'ACTIVE' as const,
      images: ['https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600'],
      tags: ['kombucha', 'probiótico', 'orgánico', 'salud', 'fermentado'],
      location: 'Medellín, Colombia',
      sellerId: adminUser?.id || defaultSellerId,
      metadata: JSON.stringify({
        volume: '500ml',
        ingredients: ['Té verde orgánico', 'Jengibre fresco', 'Cúrcuma', 'SCOBY'],
        shelfLife: '30 días refrigerado',
      }),
    },
    {
      name: 'Sesión de Sound Healing',
      description: 'Viaje sonoro de 60 minutos con cuencos tibetanos, gongs y campanas para equilibrar tu energía.',
      itemType: 'SERVICE' as const,
      price: 60,
      priceToins: 25,
      currency: 'UNITS' as const,
      status: 'ACTIVE' as const,
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
      tags: ['sound healing', 'meditación', 'bienestar', 'relajación', 'energía'],
      location: 'Online via Zoom',
      sellerId: regularUser?.id || defaultSellerId,
      metadata: JSON.stringify({
        duration: '60 minutos',
        instruments: ['Cuencos tibetanos', 'Gongs', 'Campanas'],
        benefits: ['Reducción del estrés', 'Mejora del sueño', 'Equilibrio energético'],
      }),
    },
  ];

  for (const itemData of marketplaceItems) {
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { name: itemData.name },
    });

    if (existingItem) {
      // Separate fields for update (exclude sellerId)
      const { sellerId, ...updateData } = itemData;
      await prisma.marketplaceItem.update({
        where: { id: existingItem.id },
        data: updateData,
      });
    } else {
      await prisma.marketplaceItem.create({
        data: itemData,
      });
    }
  }

  console.log('✅ Marketplace items created successfully');
}

async function createUPlayContent(prisma: PrismaClient) {
  console.log('🎬 Creating UPlay content...');

  // Create mundo
  let mundo = await prisma.mundo.findUnique({
    where: { name: 'UPlay Zone' },
  });

  if (!mundo) {
    mundo = await prisma.mundo.create({
      data: {
        name: 'UPlay Zone',
        description: 'Mundo para videos interactivos de UPlay',
        isActive: true,
      },
    });
  }

  // Create playlist
  let playlist = await prisma.playlist.findFirst({
    where: {
      mundoId: mundo.id,
      name: 'Videos Principales UPlay',
    },
  });

  if (!playlist) {
    playlist = await prisma.playlist.create({
      data: {
        mundoId: mundo.id,
        name: 'Videos Principales UPlay',
        description: 'Contenido principal de UPlay',
        isActive: true,
      },
    });
  }

  // Create item type
  const itemType = await prisma.itemType.upsert({
    where: { name: 'Video' },
    update: {},
    create: {
      name: 'Video',
      description: 'Elemento de tipo video para UPlay',
    },
  });

  // Create sample videos
  const videos = [
    {
      title: 'Coomunity: La Visión del Futuro',
      description: 'Descubre la visión y misión de Coomunity para construir un futuro colaborativo.',
      content: 'Descubre la visión y misión de Coomunity para construir un futuro colaborativo.',
      externalId: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://i3.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: 212,
      categories: 'Introducción',
      platform: 'youtube',
      language: 'es',
    },
    {
      title: 'Ayni: El Arte de la Reciprocidad',
      description: 'Un documental profundo sobre el principio ancestral del Ayni y su aplicación moderna.',
      content: 'Un documental profundo sobre el principio ancestral del Ayni y su aplicación moderna.',
      externalId: 'oHg5SJYRHA0',
      thumbnailUrl: 'https://i3.ytimg.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
      duration: 300,
      categories: 'Filosofía',
      platform: 'youtube',
      language: 'es',
    },
  ];

  for (const videoData of videos) {
    await prisma.videoItem.upsert({
      where: { title: videoData.title },
      update: videoData,
      create: {
        ...videoData,
        playlistId: playlist.id,
        itemTypeId: itemType.id,
      },
    });
  }

  console.log('✅ UPlay content created successfully');
}

async function main() {
  console.log('🌱 Starting CoomÜnity production seed...');

  try {
    await createRoles(prisma);
    await createUsers(prisma);
    await createMarketplaceItems(prisma);
    await createUPlayContent(prisma);

    console.log('🎉 Production seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('💥 Fatal error:', e);
    process.exit(1);
  });
