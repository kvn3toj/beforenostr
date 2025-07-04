import { PrismaClient } from '../src/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedMarketplace(prisma) {
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
      itemType: 'SERVICE',
      price: 35,
      priceToins: 15,
      currency: 'UNITS',
      status: 'ACTIVE',
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
      itemType: 'PRODUCT',
      price: 15,
      priceToins: 8,
      currency: 'UNITS',
      status: 'ACTIVE',
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
      itemType: 'SERVICE',
      price: 60,
      priceToins: 25,
      currency: 'UNITS',
      status: 'ACTIVE',
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
      itemType: 'PRODUCT',
      price: 25,
      priceToins: 12,
      currency: 'UNITS',
      status: 'ACTIVE',
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
      itemType: 'SERVICE',
      price: 90,
      priceToins: 40,
      currency: 'UNITS',
      status: 'ACTIVE',
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

async function main() {
  console.log(`Start seeding dev data ...`);
  await seedMarketplace(prisma);
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
