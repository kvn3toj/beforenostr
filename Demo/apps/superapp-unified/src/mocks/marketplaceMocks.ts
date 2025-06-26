export const mockUsers = [
  {
    id: 'user-1',
    name: 'Sofía Rivera',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.9,
    reviewCount: 32,
    isOnline: true,
  },
  {
    id: 'user-2',
    name: 'Carlos Méndez',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.7,
    reviewCount: 21,
    isOnline: false,
  },
];

export const mockProducts = [
  {
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
    seller: mockUsers[1],
    rating: 4.8,
    reviewCount: 12,
    status: 'active',
    deliveryOptions: [
      { id: 'del-1', name: 'Online', price: 0, estimatedTime: '1h', type: 'online', available: true },
    ],
    createdAt: '2024-06-01',
    updatedAt: '2024-06-10',
    type: 'service',
  },
  {
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
    seller: mockUsers[0],
    rating: 5.0,
    reviewCount: 8,
    status: 'active',
    deliveryOptions: [
      { id: 'del-2', name: 'Envío a domicilio', price: 5, estimatedTime: '3 días', type: 'standard', available: true },
    ],
    createdAt: '2024-05-20',
    updatedAt: '2024-06-09',
    type: 'product',
  },
];

export const mockMatches = [
  {
    id: 'match-1',
    productId: 'prod-1',
    buyerId: 'user-1',
    sellerId: 'user-2',
    status: 'completed',
    buyerConfirmed: true,
    sellerConfirmed: true,
    completedAt: '2024-06-12T10:00:00Z',
    createdAt: '2024-06-10T09:00:00Z',
    updatedAt: '2024-06-12T10:00:00Z',
  },
  {
    id: 'match-2',
    productId: 'prod-2',
    buyerId: 'user-2',
    sellerId: 'user-1',
    status: 'completed',
    buyerConfirmed: true,
    sellerConfirmed: true,
    completedAt: '2024-06-11T15:00:00Z',
    createdAt: '2024-06-09T14:00:00Z',
    updatedAt: '2024-06-11T15:00:00Z',
  },
];

export const mockMessages = [
  {
    matchId: 'match-1',
    messages: [
      {
        id: 'msg-1',
        sender: 'Sofía Rivera',
        content: '¡Hola Carlos! ¿La clase será por Zoom?',
        timestamp: '2024-06-10T09:05:00Z',
      },
      {
        id: 'msg-2',
        sender: 'Carlos Méndez',
        content: '¡Hola Sofía! Sí, te paso el link un día antes.',
        timestamp: '2024-06-10T09:10:00Z',
      },
      {
        id: 'msg-3',
        sender: 'Sofía Rivera',
        content: '¡Perfecto, gracias! Nos vemos el jueves.',
        timestamp: '2024-06-10T09:12:00Z',
      },
    ],
  },
  {
    matchId: 'match-2',
    messages: [
      {
        id: 'msg-4',
        sender: 'Carlos Méndez',
        content: '¡Hola Sofía! ¿Cuándo envías el kit?',
        timestamp: '2024-06-09T14:10:00Z',
      },
      {
        id: 'msg-5',
        sender: 'Sofía Rivera',
        content: 'Hoy mismo lo despacho, te paso el tracking.',
        timestamp: '2024-06-09T14:15:00Z',
      },
      {
        id: 'msg-6',
        sender: 'Carlos Méndez',
        content: '¡Gracias! Espero con ansias.',
        timestamp: '2024-06-09T14:16:00Z',
      },
    ],
  },
];

export const mockReviews = [
  {
    id: 'review-1',
    matchId: 'match-1',
    reviewerId: 'user-1',
    sellerId: 'user-2',
    productId: 'prod-1',
    resonance: 5,
    clarity: 5,
    reciprocity: 5,
    connection: 5,
    publicFeedback: 'La clase fue transformadora, Carlos es muy atento y profesional.',
    privateFeedback: 'Me encantaría que las sesiones fueran un poco más largas.',
    createdAt: '2024-06-12T11:00:00Z',
  },
  {
    id: 'review-2',
    matchId: 'match-2',
    reviewerId: 'user-2',
    sellerId: 'user-1',
    productId: 'prod-2',
    resonance: 5,
    clarity: 5,
    reciprocity: 5,
    connection: 4,
    publicFeedback: 'El kit llegó rápido y con instrucciones claras. ¡Muy recomendable!',
    privateFeedback: 'Quizá podrías incluir semillas de más variedades.',
    createdAt: '2024-06-11T16:00:00Z',
  },
];
