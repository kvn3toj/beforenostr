import { PrismaClient, MarketplaceItemType, MarketplaceItemStatus } from '../src/generated/prisma/index';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Upsert users (evita duplicados por email)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@gamifier.com' },
    update: {},
    create: {
      email: 'user@gamifier.com',
      password: '123456',
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      // profile: {
      //   create: {
      //     bio: faker.lorem.paragraph(),
      //     location: faker.location.city(),
      //     skills: ['Desarrollo', 'Diseño', 'Marketing'],
      //     socialLinks: {
      //       linkedin: faker.internet.url(),
      //       twitter: faker.internet.url(),
      //     },
      //   }
      // }
    },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@gamifier.com' },
    update: {},
    create: {
      email: 'seller@gamifier.com',
      password: '123456',
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      // profile: {
      //   create: {
      //     bio: faker.lorem.paragraph(),
      //     location: faker.location.city(),
      //     skills: ['Consultoría', 'Ventas', 'Emprendimiento'],
      //     socialLinks: {
      //       linkedin: faker.internet.url(),
      //       twitter: faker.internet.url(),
      //     },
      //   }
      // }
    },
  });

  // Create marketplace items
  const marketplaceItems = await prisma.marketplaceItem.createMany({
    data: [
      {
        name: 'Consultoría de Desarrollo Web',
        description: 'Sesión de 1 hora para resolver dudas de desarrollo',
        fullDescription: 'Ofrezco consultoría especializada en desarrollo web moderno. Puedo ayudarte con React, Node.js, bases de datos y arquitectura de aplicaciones.',
        itemType: 'SERVICE',
        price: 50,
        priceToins: 100,
        currency: 'LUKAS',
        category: 'Tecnología',
        stock: 10,
        sellerId: sellerUser.id,
      },
      {
        name: 'Clases de Yoga Online',
        description: 'Clases grupales de yoga para principiantes',
        fullDescription: 'Clases de yoga diseñadas para principiantes. Incluye técnicas de respiración, posturas básicas y meditación guiada.',
        itemType: 'SERVICE',
        price: 25,
        priceToins: 50,
        currency: 'LUKAS',
        category: 'Bienestar',
        stock: 20,
        sellerId: sellerUser.id,
      },
      {
        name: 'Taller de Huerto Orgánico',
        description: 'Aprende a crear tu propio huerto en casa',
        fullDescription: 'Taller completo sobre agricultura orgánica urbana. Aprenderás desde la preparación del suelo hasta la cosecha.',
        itemType: 'SERVICE',
        price: 40,
        priceToins: 80,
        currency: 'LUKAS',
        category: 'Agricultura',
        stock: 15,
        sellerId: sellerUser.id,
      },
    ],
  });

  // Get created items for adding tags and images
  const createdItems = await prisma.marketplaceItem.findMany({
    where: {
      sellerId: sellerUser.id
    }
  });

  // Update items with tags and images
  for (const item of createdItems) {
    let updateData: any = {};

    if (item.name.includes('Desarrollo Web')) {
      updateData = {
        tags: { set: ['desarrollo', 'web', 'programación', 'tecnología'] },
        images: { set: ['https://images.unsplash.com/photo-1517180102446-f3ece451e9d8'] }
      };
    } else if (item.name.includes('Yoga')) {
      updateData = {
        tags: { set: ['yoga', 'bienestar', 'salud', 'meditación'] },
        images: { set: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'] }
      };
    } else if (item.name.includes('Huerto')) {
      updateData = {
        tags: { set: ['huerto', 'orgánico', 'agricultura', 'sustentable'] },
        images: { set: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b'] }
      };
    }

    await prisma.marketplaceItem.update({
      where: { id: item.id },
      data: updateData
    });
  }

  // Create reviews for marketplace items
  const reviews = await Promise.all(
    createdItems.map(async (item) => {
      return prisma.review.create({
        data: {
          userId: regularUser.id,
          marketplaceItemId: item.id,
          rating: Number(faker.number.float({ min: 1, max: 5, fractionDigits: 1 })),
          comment: faker.lorem.paragraph(),
          createdAt: faker.date.recent()
        }
      });
    })
  );

  console.log('Seed data created successfully!');

  // Seed UPLAY videos
  console.log('\n🎬 Seeding UPLAY videos...');
  try {
    const { seedUplayVideos } = await import('./seed-uplay-videos.ts');
    await seedUplayVideos();
  } catch (error) {
    console.error('Error seeding UPLAY videos:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
