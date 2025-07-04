export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    merit: string;
  };
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
}

export interface UserStats {
    reciprocidadBalance: number;
    socialLevel: string;
    connectionsCount: number;
    collaborationsCount: number;
    socialMeritos: number;
    trustScore: number;
    dailyInteractions: number;
    activeCircles: number;
    nextLevel: string;
    socialProgress: number;
    bienComunContributions: number;
    elementos: {
        comunicacion: number;
        empatia: number;
        confianza: number;
        inspiracion: number;
    }
}

export interface CommunityMetrics {
    activeConnections: number;
    onlineMembers: number;
    dailyInteractions: number;
    reciprocidadExchanges: number;
    activeCircles: number;
    weeklyGrowth: number;
}


export const mockPosts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Elena Cósmica',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        merit: 'Guía Estelar',
      },
      timestamp: 'Hace 2 horas',
      content: 'Reflexionando sobre la interconexión universal y el principio de Reciprocidad. Cada acción es un eco en el cosmos. ✨ #BienComún',
      likes: 125,
      comments: 18,
    },
    {
      id: '2',
      author: {
        name: 'David Fractal',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        merit: 'Arquitecto de Sueños',
      },
      timestamp: 'Hace 5 horas',
      content: '¡Nuevo proyecto de colaboración abierto! Buscamos visionarios para co-crear una herramienta de visualización de datos que inspire la acción por el Bien Común. ¿Interesado? Manda un mensaje.',
      likes: 88,
      comments: 27,
    },
];

export const mockUserStats: UserStats = {
    reciprocidadBalance: 0.85,
    socialLevel: 'Colaborador Equilibrado',
    connectionsCount: 42,
    collaborationsCount: 8,
    socialMeritos: 1250,
    trustScore: 4.5,
    dailyInteractions: 12,
    activeCircles: 3,
    nextLevel: 'Guía Estelar',
    socialProgress: 60,
    bienComunContributions: 15,
    elementos: {
        comunicacion: 80,
        empatia: 90,
        confianza: 70,
        inspiracion: 85,
    }
};

export const mockCommunityMetrics: CommunityMetrics = {
    activeConnections: 150,
    onlineMembers: 24,
    dailyInteractions: 120,
    reciprocidadExchanges: 45,
    activeCircles: 5,
    weeklyGrowth: 10,
};
