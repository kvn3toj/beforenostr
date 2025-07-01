// Mocks para ÜPlay (GPL Gamified Play List)

export const MOCK_UPLAY_VIDEOS = [
  {
    id: 'video-1',
    title: 'El Camino del Reciprocidad',
    description: 'Descubre el principio de reciprocidad en la vida cotidiana.',
    url: 'https://videos.coomunity.com/reciprocidad.mp4',
    thumbnail: '/thumbnails/reciprocidad.jpg',
    duration: 900,
    questions: [
      { id: 'q1', text: '¿Qué significa Reciprocidad?', options: ['Reciprocidad', 'Competencia', 'Individualismo'], answer: 0 }
    ],
    tags: ['reciprocidad', 'filosofía', 'bien común'],
    createdAt: '2024-06-01T12:00:00Z',
    author: {
      id: 'user-1',
      name: 'Ana Sabia',
      avatarUrl: '/avatars/ana.png'
    }
  },
  {
    id: 'video-2',
    title: 'Economía Sagrada',
    description: 'Explora cómo la economía puede servir al bien común.',
    url: 'https://videos.coomunity.com/economia.mp4',
    thumbnail: '/thumbnails/economia.jpg',
    duration: 1200,
    questions: [
      { id: 'q2', text: '¿Qué es la economía sagrada?', options: ['Acumulación', 'Colaboración', 'Competencia'], answer: 1 }
    ],
    tags: ['economía', 'sagrada', 'bien común'],
    createdAt: '2024-06-02T12:00:00Z',
    author: {
      id: 'user-2',
      name: 'Luis Consciente',
      avatarUrl: '/avatars/luis.png'
    }
  }
];
