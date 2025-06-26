import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Usuarios
  const sofia = await prisma.user.upsert({
    where: { email: 'sofia@coomunity.com' },
    update: {},
    create: {
      id: 'user-1',
      email: 'sofia@coomunity.com',
      name: 'Sofía Rivera',
      username: 'sofi_riv',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
      rating: 4.9,
      reviewCount: 32,
      isOnline: true,
      isActive: true,
      allowMessages: true,
      memberSince: new Date('2023-01-15'),
    },
  });

  const carlos = await prisma.user.upsert({
    where: { email: 'carlos@coomunity.com' },
    update: {},
    create: {
      id: 'user-2',
      email: 'carlos@coomunity.com',
      name: 'Carlos Méndez',
      username: 'carlom',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
      rating: 4.7,
      reviewCount: 21,
      isOnline: false,
      isActive: true,
      allowMessages: true,
      memberSince: new Date('2022-11-20'),
    },
  });

  // Productos
  const yoga = await prisma.product.create({
    data: {
      id: 'prod-1',
      title: 'Clases de Yoga Consciente',
      description: 'Sesión personalizada de yoga para armonizar cuerpo y mente.',
      price: 25,
      currency: 'LUKAS',
      category: 'Bienestar',
      tags: ['yoga', 'salud', 'armonía'],
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      ],
      mainImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      sellerId: carlos.id,
      rating: 4.8,
      reviewCount: 12,
      status: 'active',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-10'),
      type: 'service',
    },
  });

  const huerto = await prisma.product.create({
    data: {
      id: 'prod-2',
      title: 'Huerto Urbano Starter Kit',
      description: 'Kit completo para iniciar tu propio huerto en casa.',
      price: 40,
      currency: 'LUKAS',
      category: 'Sustentabilidad',
      tags: ['huerto', 'ecología', 'hogar'],
      images: [
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
      ],
      mainImage: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
      sellerId: sofia.id,
      rating: 5.0,
      reviewCount: 8,
      status: 'active',
      createdAt: new Date('2024-05-20'),
      updatedAt: new Date('2024-06-09'),
      type: 'product',
    },
  });

  // Matches/Órdenes
  const match1 = await prisma.marketplaceMatch.create({
    data: {
      id: 'match-1',
      productId: yoga.id,
      buyerId: sofia.id,
      sellerId: carlos.id,
      status: 'completed',
      buyerConfirmed: true,
      sellerConfirmed: true,
      completedAt: new Date('2024-06-12T10:00:00Z'),
      createdAt: new Date('2024-06-10T09:00:00Z'),
      updatedAt: new Date('2024-06-12T10:00:00Z'),
    },
  });

  const match2 = await prisma.marketplaceMatch.create({
    data: {
      id: 'match-2',
      productId: huerto.id,
      buyerId: carlos.id,
      sellerId: sofia.id,
      status: 'completed',
      buyerConfirmed: true,
      sellerConfirmed: true,
      completedAt: new Date('2024-06-11T15:00:00Z'),
      createdAt: new Date('2024-06-09T14:00:00Z'),
      updatedAt: new Date('2024-06-11T15:00:00Z'),
    },
  });

  // Chats
  await prisma.marketplaceMessage.createMany({
    data: [
      // match-1
      { id: 'msg-1', matchId: match1.id, senderId: sofia.id, content: '¡Hola Carlos! ¿La clase será por Zoom?', createdAt: new Date('2024-06-10T09:05:00Z') },
      { id: 'msg-2', matchId: match1.id, senderId: carlos.id, content: '¡Hola Sofía! Sí, te paso el link un día antes.', createdAt: new Date('2024-06-10T09:10:00Z') },
      { id: 'msg-3', matchId: match1.id, senderId: sofia.id, content: '¡Perfecto, gracias! Nos vemos el jueves.', createdAt: new Date('2024-06-10T09:12:00Z') },
      // match-2
      { id: 'msg-4', matchId: match2.id, senderId: carlos.id, content: '¡Hola Sofía! ¿Cuándo envías el kit?', createdAt: new Date('2024-06-09T14:10:00Z') },
      { id: 'msg-5', matchId: match2.id, senderId: sofia.id, content: 'Hoy mismo lo despacho, te paso el tracking.', createdAt: new Date('2024-06-09T14:15:00Z') },
      { id: 'msg-6', matchId: match2.id, senderId: carlos.id, content: '¡Gracias! Espero con ansias.', createdAt: new Date('2024-06-09T14:16:00Z') },
    ],
  });

  // Reseñas
  await prisma.marketplaceReview.createMany({
    data: [
      {
        id: 'review-1',
        matchId: match1.id,
        reviewerId: sofia.id,
        sellerId: carlos.id,
        productId: yoga.id,
        resonance: 5,
        clarity: 5,
        reciprocity: 5,
        connection: 5,
        publicFeedback: 'La clase fue transformadora, Carlos es muy atento y profesional.',
        privateFeedback: 'Me encantaría que las sesiones fueran un poco más largas.',
        createdAt: new Date('2024-06-12T11:00:00Z'),
      },
      {
        id: 'review-2',
        matchId: match2.id,
        reviewerId: carlos.id,
        sellerId: sofia.id,
        productId: huerto.id,
        resonance: 5,
        clarity: 5,
        reciprocity: 5,
        connection: 4,
        publicFeedback: 'El kit llegó rápido y con instrucciones claras. ¡Muy recomendable!',
        privateFeedback: 'Quizá podrías incluir semillas de más variedades.',
        createdAt: new Date('2024-06-11T16:00:00Z'),
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

