import { PrismaClient, Currency, MarketplaceItemType, MarketplaceItemStatus } from '../src/generated/prisma';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding Roles...');
  const roles = [
    { name: 'admin' },
    { name: 'user' },
    { name: 'premium' },
    { name: 'creator' },
    { name: 'moderator' },
  ];
  const roleMap: Record<string, any> = {};
  for (const role of roles) {
    const dbRole = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name },
    });
    roleMap[role.name] = dbRole;
  }
  console.log('Roles seeded.');

  console.log('Seeding Users...');
  const users = [
    {
      email: 'admin@gamifier.com',
      password: 'admin123',
      name: 'Admin',
      roles: ['admin'],
    },
    {
      email: 'user@gamifier.com',
      password: '123456',
      name: 'User',
      roles: ['user'],
    },
    {
      email: 'premium@gamifier.com',
      password: '123456',
      name: 'Premium',
      roles: ['user', 'premium'],
    },
    {
      email: 'creator@gamifier.com',
      password: '123456',
      name: 'Creator',
      roles: ['user', 'creator'],
    },
    {
      email: 'moderator@gamifier.com',
      password: '123456',
      name: 'Moderator',
      roles: ['user', 'moderator'],
    },
    {
      email: 'test@coomunity.com',
      password: 'test123',
      name: 'Test',
      roles: ['user'],
    },
  ];

  for (const user of users) {
    let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) {
      const hashed = await bcrypt.hash(user.password, 10);
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          password: hashed,
          name: user.name,
          isActive: true,
        },
      });
      console.log(`   - Created user: ${user.email}`);
    } else {
      console.log(`   - User already exists, skipping: ${user.email}`);
    }
    // Asignar roles
    for (const roleName of user.roles) {
      const role = roleMap[roleName];
      if (role) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId: dbUser.id,
              roleId: role.id,
            },
          },
          update: {},
          create: {
            userId: dbUser.id,
            roleId: role.id,
          },
        });
        // No log para evitar ruido
      }
    }
  }
  console.log('Users and roles seeded successfully.');
}

async function seedMarketplace(prisma: PrismaClient) {
  console.log('Seeding Marketplace data...');

  // Obtener usuarios existentes
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found, skipping marketplace seed.');
    return;
  }

  const premiumUser = await prisma.user.findFirst({
    where: { email: 'premium@gamifier.com' },
  });
  const creatorUser = await prisma.user.findFirst({
    where: { email: 'creator@gamifier.com' },
  });
  const regularUser = await prisma.user.findFirst({
    where: { email: 'user@gamifier.com' },
  });

  const marketplaceItems = [
    {
      name: 'Taller de Huerto Urbano Orgánico',
      description:
        'Aprende a cultivar tus propios alimentos en espacios pequeños usando principios de permacultura.',
      itemType: MarketplaceItemType.SERVICE,
      price: 35,
      priceToins: 15,
      currency: Currency.UNITS,
      status: MarketplaceItemStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
      ],
      tags: ['huerto', 'orgánico', 'taller', 'permacultura', 'sostenibilidad'],
      location: 'Online + Kit presencial',
      sellerId: creatorUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        duration: '3 horas',
        includes: ['Kit de semillas', 'Manual digital', 'Seguimiento 30 días'],
        level: 'Principiante',
      }),
    },
    {
      name: 'Kombucha Artesanal de Jengibre y Cúrcuma',
      description:
        'Bebida probiótica fermentada artesanalmente con ingredientes 100% orgánicos y cultivados localmente.',
      itemType: MarketplaceItemType.PRODUCT,
      price: 15,
      priceToins: 8,
      currency: Currency.UNITS,
      status: MarketplaceItemStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600',
      ],
      tags: ['kombucha', 'probiótico', 'orgánico', 'salud', 'fermentado'],
      location: 'Medellín, Colombia',
      sellerId: premiumUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        volume: '500ml',
        ingredients: [
          'Té verde orgánico',
          'Jengibre fresco',
          'Cúrcuma',
          'SCOBY',
        ],
        shelfLife: '30 días refrigerado',
      }),
    },
    {
      name: 'Sesión de Sound Healing (Sanación con Sonido)',
      description:
        'Viaje sonoro de 60 minutos con cuencos tibetanos, gongs y campanas para equilibrar tu energía.',
      itemType: MarketplaceItemType.SERVICE,
      price: 60,
      priceToins: 25,
      currency: Currency.UNITS,
      status: MarketplaceItemStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      ],
      tags: [
        'sound healing',
        'meditación',
        'bienestar',
        'relajación',
        'energía',
      ],
      location: 'Online via Zoom',
      sellerId: regularUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        duration: '60 minutos',
        instruments: ['Cuencos tibetanos', 'Gongs', 'Campanas'],
        benefits: [
          'Reducción del estrés',
          'Mejora del sueño',
          'Equilibrio energético',
        ],
      }),
    },
    {
      name: 'Kit de Limpieza Energética: Salvia y Palo Santo',
      description:
        'Set completo para rituales de limpieza energética con salvia blanca y palo santo de cultivo ético.',
      itemType: MarketplaceItemType.PRODUCT,
      price: 25,
      priceToins: 12,
      currency: Currency.UNITS,
      status: MarketplaceItemStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1620656272587-3f3a88647c43?w=600',
      ],
      tags: ['limpieza energética', 'ritual', 'palo santo', 'salvia', 'ético'],
      location: 'Envíos a todo el país',
      sellerId: creatorUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        contents: [
          '1 atado de salvia blanca',
          '3 palos de palo santo',
          'Guía de uso',
        ],
        origin: 'Cultivo sostenible en Perú y California',
      }),
    },
    {
      name: 'Asesoría Personalizada en Astrología Evolutiva',
      description:
        'Una sesión de 90 minutos para explorar tu carta natal y entender tus patrones evolutivos.',
      itemType: MarketplaceItemType.SERVICE,
      price: 90,
      priceToins: 40,
      currency: Currency.UNITS,
      status: MarketplaceItemStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1590212154839-e5399a9a4563?w=600',
      ],
      tags: ['astrología', 'carta natal', 'desarrollo personal', 'evolutivo'],
      location: 'Online',
      sellerId: premiumUser?.id || users[0]?.id,
      metadata: JSON.stringify({
        duration: '90 minutos',
        platform: 'Google Meet',
        includes: [
          'Grabación de la sesión',
          'PDF con claves de la carta natal',
        ],
      }),
    },
  ];

  for (const item of marketplaceItems) {
    const existingItem = await prisma.marketplaceItem.findFirst({
      where: { name: item.name },
    });

    if (!existingItem) {
      await prisma.marketplaceItem.create({
        data: item,
      });
      console.log(`   - Created marketplace item: ${item.name}`);
    } else {
      console.log(
        `   - Marketplace item already exists, skipping: ${item.name}`
      );
    }
  }

  console.log('Marketplace data seeded successfully.');
}

async function seedWallets(prisma: PrismaClient) {
  // ... see previous message for full implementation ...
}

async function seedTransactions(prisma: PrismaClient) {
  // ... see previous message for full implementation ...
}

async function main() {
  console.log(`Start seeding dev data ...`);
  await seedUsers(prisma);
  await seedMarketplace(prisma);
  await seedWallets(prisma);
  await seedTransactions(prisma);
  console.log(`Seeding dev data finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
