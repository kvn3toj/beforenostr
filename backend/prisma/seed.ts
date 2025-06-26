import { PrismaClient, MarketplaceItemType, MarketplaceItemStatus } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // 1. Usuarios
  await prisma.user.createMany({
    data: [
      {
        id: 'user-1',
        email: 'sofia@coomunity.com',
        password: 'hashedpassword1',
        name: 'Sofía Rivera',
        username: 'sofi_riv',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        isActive: true,
      },
      {
        id: 'user-2',
        email: 'carlos@coomunity.com',
        password: 'hashedpassword2',
        name: 'Carlos Méndez',
        username: 'carlom',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        isActive: true,
      },
      {
        id: 'user-3',
        email: 'luz@coomunity.com',
        password: 'hashedpassword3',
        name: 'Luz Martínez',
        username: 'luzma',
        avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // 2. Perfiles
  await prisma.profile.create({
    data: {
      id: 'profile-1',
      userId: 'user-1',
      bio: 'Facilitadora de bienestar y yoga. Apasionada por el crecimiento personal.',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      location: 'Ciudad de México',
    },
  });
  await prisma.profile.create({
    data: {
      id: 'profile-2',
      userId: 'user-2',
      bio: 'Emprendedor ecológico. Promotor de la vida sustentable.',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      location: 'Guadalajara',
    },
  });
  await prisma.profile.create({
    data: {
      id: 'profile-3',
      userId: 'user-3',
      bio: 'Mentora de creatividad y arte. Inspirando a través de la expresión.',
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      location: 'Monterrey',
    },
  });

  // 3. Productos y servicios (MarketplaceItem)
  await prisma.marketplaceItem.create({
    data: {
      id: 'item-1',
      name: 'Clases de Yoga Consciente',
      description: 'Sesión personalizada de yoga para armonizar cuerpo y mente.',
      type: MarketplaceItemType.SERVICE,
      priceUnits: 25,
      priceToins: 0,
      tags: ['yoga', 'salud', 'armonía'],
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      location: 'Online',
      status: MarketplaceItemStatus.ACTIVE,
      sellerId: 'user-2',
    },
  });
  await prisma.marketplaceItem.create({
    data: {
      id: 'item-2',
      name: 'Huerto Urbano Starter Kit',
      description: 'Kit completo para iniciar tu propio huerto en casa.',
      type: MarketplaceItemType.PRODUCT,
      priceUnits: 40,
      priceToins: 0,
      tags: ['huerto', 'ecología', 'hogar'],
      imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
      location: 'CDMX',
      status: MarketplaceItemStatus.ACTIVE,
      sellerId: 'user-1',
    },
  });
  await prisma.marketplaceItem.create({
    data: {
      id: 'item-3',
      name: 'Mentoría Creativa',
      description: 'Sesión de mentoría para desbloquear tu potencial artístico.',
      type: MarketplaceItemType.SERVICE,
      priceUnits: 30,
      priceToins: 0,
      tags: ['arte', 'creatividad', 'mentoría'],
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
      location: 'Monterrey',
      status: MarketplaceItemStatus.ACTIVE,
      sellerId: 'user-3',
    },
  });

  // 4. Reseñas (Review)
  await prisma.review.create({
    data: {
      id: 'review-1',
      reviewerId: 'user-1',
      marketplaceItemId: 'item-1',
      rating: 5,
      comment: 'La clase fue transformadora, Carlos es muy atento y profesional.',
    },
  });
  await prisma.review.create({
    data: {
      id: 'review-2',
      reviewerId: 'user-2',
      marketplaceItemId: 'item-2',
      rating: 5,
      comment: 'El kit llegó rápido y con instrucciones claras. ¡Muy recomendable!',
    },
  });
  await prisma.review.create({
    data: {
      id: 'review-3',
      reviewerId: 'user-3',
      marketplaceItemId: 'item-2',
      rating: 4,
      comment: 'Me gustó mucho el kit, pero faltaron semillas de más variedades.',
    },
  });
  await prisma.review.create({
    data: {
      id: 'review-4',
      reviewerId: 'user-1',
      marketplaceItemId: 'item-3',
      rating: 5,
      comment: 'Luz es una mentora increíble, me ayudó a desbloquear mi creatividad.',
    },
  });

  console.log('Seed completado con usuarios, perfiles, productos y reseñas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
