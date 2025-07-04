const { PrismaClient } = require('../src/generated/prisma/index');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing comprehensive seed...');

    // Create roles first
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin' }
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: { name: 'user' }
    });

    console.log('Roles created');

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('123456', 10);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@gamifier.com' },
      update: {},
      create: {
        email: 'admin@gamifier.com',
        password: adminPassword,
        name: 'Admin'
      }
    });

    const regularUser = await prisma.user.upsert({
      where: { email: 'user@gamifier.com' },
      update: {},
      create: {
        email: 'user@gamifier.com',
        password: userPassword,
        name: 'Regular User'
      }
    });

    console.log('Users created');

    // Create user roles
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id
        }
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: regularUser.id,
          roleId: userRole.id
        }
      },
      update: {},
      create: {
        userId: regularUser.id,
        roleId: userRole.id
      }
    });

    console.log('User roles created');

    // Now create marketplace items
    const item1 = await prisma.marketplaceItem.create({
      data: {
        name: 'Taller de Huerto Urbano',
        description: 'Aprende a cultivar tus propios alimentos',
        itemType: 'SERVICE',
        price: 35,
        currency: 'LUKAS',
        status: 'ACTIVE',
        sellerId: regularUser.id,
        tags: ['huerto', 'orgánico'],
        images: ['https://example.com/image.jpg'],
      }
    });

    const item2 = await prisma.marketplaceItem.create({
      data: {
        name: 'Kombucha Artesanal',
        description: 'Bebida probiótica fermentada',
        itemType: 'PRODUCT',
        price: 15,
        currency: 'LUKAS',
        status: 'ACTIVE',
        sellerId: adminUser.id,
        tags: ['kombucha', 'salud'],
        images: [],
      }
    });

    console.log('Marketplace items created:', [item1.name, item2.name]);

    // Test video items
    console.log('Testing UPlay video creation...');

    // Create mundo and playlist for videos
    const mundo = await prisma.mundo.create({
      data: {
        name: 'UPlay Zone',
        description: 'Mundo para videos de UPlay'
      }
    });

    const playlist = await prisma.playlist.create({
      data: {
        name: 'Videos Principales',
        description: 'Contenido principal',
        mundoId: mundo.id
      }
    });

    const itemType = await prisma.itemType.create({
      data: {
        name: 'Video',
        description: 'Video content type'
      }
    });

    const video = await prisma.videoItem.create({
      data: {
        title: 'Test Video',
        description: 'Test video description',
        content: 'Test content',
        externalId: '7xX-KF08v6I',
        platform: 'youtube',
        duration: 1089,
        thumbnailUrl: 'https://i3.ytimg.com/vi/7xX-KF08v6I/maxresdefault.jpg',
        playlistId: playlist.id,
        itemTypeId: itemType.id,
        categories: 'Economía',
        language: 'es'
      }
    });

    console.log('Video created:', video.title);
    console.log('✅ All seed data created successfully!');

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
