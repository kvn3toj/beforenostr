// Mocks para Social (Módulo Social)

export const MOCK_SOCIAL_POSTS = [
  {
    id: 'post-1',
    author: {
      id: 'user-1',
      name: 'Ana Sabia',
      avatarUrl: '/avatars/ana.png'
    },
    content: '¡Hoy compartí mi primer acto de Ayni en la comunidad!',
    createdAt: '2024-06-10T09:00:00Z',
    likes: 12,
    comments: [
      { id: 'c1', author: 'Luis Consciente', text: '¡Inspirador!' }
    ],
    tags: ['ayni', 'comunidad']
  },
  {
    id: 'post-2',
    author: {
      id: 'user-2',
      name: 'Luis Consciente',
      avatarUrl: '/avatars/luis.png'
    },
    content: '¿Alguien quiere sumarse a la próxima acción de bien común?',
    createdAt: '2024-06-11T14:30:00Z',
    likes: 8,
    comments: [],
    tags: ['bien común', 'acción']
  }
];
