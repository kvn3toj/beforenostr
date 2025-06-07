/**
 * 🎭 Mock Data para el módulo Social/Chat
 * 
 * Datos de prueba que simulan las respuestas del backend real
 * para permitir desarrollo y testing sin depender del backend.
 */

import type { SocialMatch, ChatMessage, SocialNotification, SocialPost, PostComment } from '../../types';

// 🤝 Matches de ejemplo basados en el análisis extraído
export const mockMatches: SocialMatch[] = [
  {
    id: '38000e9aad777d56', // Match ID del análisis real
    name: 'Juan Manuel Escobar Ramírez', // Nombre del análisis real
    avatar: '/assets/images/avatars/juan.jpg',
    lastMessage: '😊❤️ ¡Excelente servicio!',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
    unread: 2,
    status: 'online',
    userId: 'user-38000e9aad777d56',
    matchedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    isActive: true
  },
  {
    id: 'match-maria-gonzalez',
    name: 'María González',
    avatar: '/assets/images/avatars/maria.jpg',
    lastMessage: '¿Podrías enviarme más detalles del proyecto?',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    unread: 0,
    status: 'offline',
    userId: 'user-maria-gonzalez',
    matchedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    isActive: true
  },
  {
    id: 'match-carlos-lopez',
    name: 'Carlos López',
    avatar: '/assets/images/avatars/carlos.jpg',
    lastMessage: 'Perfecto, acordemos una cita para la próxima semana',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    unread: 1,
    status: 'away',
    userId: 'user-carlos-lopez',
    matchedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    isActive: true
  },
  {
    id: 'match-ana-martinez',
    name: 'Ana Martínez',
    avatar: '/assets/images/avatars/ana.jpg',
    lastMessage: 'Muchas gracias por tu ayuda con el diseño',
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    unread: 0,
    status: 'online',
    userId: 'user-ana-martinez',
    matchedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
    isActive: true
  }
];

// 📝 Posts del feed social de ejemplo
export const mockPosts: SocialPost[] = [
  {
    id: 'post-1',
    authorId: 'user-38000e9aad777d56',
    authorName: 'Juan Manuel Escobar Ramírez',
    authorAvatar: '/assets/images/avatars/juan.jpg',
    content: '¡Increíble experiencia en CoomÜnity! 🚀 Acabo de completar mi primer proyecto colaborativo y la sensación de Ayni es real. La reciprocidad y el Bien Común realmente funcionan cuando nos conectamos con propósito. #CoomÜnity #Ayni #Colaboración',
    type: 'text',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    likes: ['user-maria-gonzalez', 'user-carlos-lopez', 'user-ana-martinez'],
    likesCount: 3,
    commentsCount: 2,
    isLikedByCurrentUser: false,
    media: null
  },
  {
    id: 'post-2',
    authorId: 'user-maria-gonzalez',
    authorName: 'María González',
    authorAvatar: '/assets/images/avatars/maria.jpg',
    content: 'Reflexionando sobre la Economía Sagrada... 💰✨ Es fascinante cómo el dinero puede ser una herramienta de conexión en lugar de separación. Cuando operamos desde el Bien Común, todo fluye de manera natural.',
    type: 'text',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    likes: ['user-38000e9aad777d56', 'user-ana-martinez'],
    likesCount: 2,
    commentsCount: 1,
    isLikedByCurrentUser: true,
    media: null
  },
  {
    id: 'post-3',
    authorId: 'user-carlos-lopez',
    authorName: 'Carlos López',
    authorAvatar: '/assets/images/avatars/carlos.jpg',
    content: '🌱 Metanöia en acción: Estoy en proceso de redefinir completamente mi enfoque profesional. Gracias a la comunidad por el apoyo constante en este proceso de transformación consciente.',
    type: 'text',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    likes: ['user-38000e9aad777d56', 'user-maria-gonzalez', 'user-ana-martinez', 'user-pedro-sanchez'],
    likesCount: 4,
    commentsCount: 3,
    isLikedByCurrentUser: false,
    media: null
  },
  {
    id: 'post-4',
    authorId: 'user-ana-martinez',
    authorName: 'Ana Martínez',
    authorAvatar: '/assets/images/avatars/ana.jpg',
    content: 'Compartiendo mi experiencia con la neguentropía... 🔄 Cada día descubro nuevas maneras de generar orden y belleza a partir del caos aparente. La clave está en la intención consciente.',
    type: 'text',
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    likes: ['user-maria-gonzalez'],
    likesCount: 1,
    commentsCount: 0,
    isLikedByCurrentUser: false,
    media: null
  },
  {
    id: 'post-5',
    authorId: 'user-pedro-sanchez',
    authorName: 'Pedro Sánchez',
    authorAvatar: '/assets/images/avatars/pedro.jpg',
    content: '🎯 Descubriendo mi vocación a través de CoomÜnity. Los elementos (Tierra, Agua, Fuego, Aire) me están ayudando a entender mejor mis fortalezas naturales. ¿Cuál es tu elemento dominante?',
    type: 'text',
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    likes: ['user-carlos-lopez', 'user-ana-martinez'],
    likesCount: 2,
    commentsCount: 4,
    isLikedByCurrentUser: true,
    media: null
  }
];

// 💬 Comentarios de posts de ejemplo
export const mockPostComments: { [postId: string]: PostComment[] } = {
  'post-1': [
    {
      id: 'comment-1-1',
      postId: 'post-1',
      authorId: 'user-maria-gonzalez',
      authorName: 'María González',
      authorAvatar: '/assets/images/avatars/maria.jpg',
      content: '¡Qué hermoso! Me encanta ver cómo el Ayni se manifiesta en cada colaboración 💚',
      timestamp: new Date(Date.now() - 1500000).toISOString(), // 25 min ago
      likes: ['user-38000e9aad777d56'],
      likesCount: 1,
      isLikedByCurrentUser: false
    },
    {
      id: 'comment-1-2',
      postId: 'post-1',
      authorId: 'user-carlos-lopez',
      authorName: 'Carlos López',
      authorAvatar: '/assets/images/avatars/carlos.jpg',
      content: 'Totalmente de acuerdo. La reciprocidad consciente cambia todo el paradigma.',
      timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 min ago
      likes: [],
      likesCount: 0,
      isLikedByCurrentUser: false
    }
  ],
  'post-2': [
    {
      id: 'comment-2-1',
      postId: 'post-2',
      authorId: 'user-ana-martinez',
      authorName: 'Ana Martínez',
      authorAvatar: '/assets/images/avatars/ana.jpg',
      content: 'Exacto, el dinero como herramienta de conexión y no de poder. Gracias por compartir esta reflexión.',
      timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 min ago
      likes: ['user-maria-gonzalez'],
      likesCount: 1,
      isLikedByCurrentUser: true
    }
  ],
  'post-3': [
    {
      id: 'comment-3-1',
      postId: 'post-3',
      authorId: 'user-ana-martinez',
      authorName: 'Ana Martínez',
      authorAvatar: '/assets/images/avatars/ana.jpg',
      content: '¡Qué valiente! La Metanöia requiere mucho coraje. Estamos aquí para apoyarte en el proceso.',
      timestamp: new Date(Date.now() - 6900000).toISOString(), // 1h 55min ago
      likes: ['user-carlos-lopez'],
      likesCount: 1,
      isLikedByCurrentUser: false
    },
    {
      id: 'comment-3-2',
      postId: 'post-3',
      authorId: 'user-pedro-sanchez',
      authorName: 'Pedro Sánchez',
      authorAvatar: '/assets/images/avatars/pedro.jpg',
      content: 'La transformación consciente es el camino. Te admiro por dar este paso.',
      timestamp: new Date(Date.now() - 6600000).toISOString(), // 1h 50min ago
      likes: [],
      likesCount: 0,
      isLikedByCurrentUser: false
    },
    {
      id: 'comment-3-3',
      postId: 'post-3',
      authorId: 'user-38000e9aad777d56',
      authorName: 'Juan Manuel Escobar Ramírez',
      authorAvatar: '/assets/images/avatars/juan.jpg',
      content: 'Inspirador Carlos. Todos estamos en proceso de evolución constante.',
      timestamp: new Date(Date.now() - 6300000).toISOString(), // 1h 45min ago
      likes: ['user-carlos-lopez'],
      likesCount: 1,
      isLikedByCurrentUser: false
    }
  ],
  'post-5': [
    {
      id: 'comment-5-1',
      postId: 'post-5',
      authorId: 'user-carlos-lopez',
      authorName: 'Carlos López',
      authorAvatar: '/assets/images/avatars/carlos.jpg',
      content: 'Creo que soy una combinación de Tierra y Fuego. Solidez con acción.',
      timestamp: new Date(Date.now() - 14100000).toISOString(), // 3h 55min ago
      likes: ['user-pedro-sanchez'],
      likesCount: 1,
      isLikedByCurrentUser: false
    },
    {
      id: 'comment-5-2',
      postId: 'post-5',
      authorId: 'user-ana-martinez',
      authorName: 'Ana Martínez',
      authorAvatar: '/assets/images/avatars/ana.jpg',
      content: 'Yo me identifico mucho con Agua - fluidez y adaptabilidad 🌊',
      timestamp: new Date(Date.now() - 13800000).toISOString(), // 3h 50min ago
      likes: [],
      likesCount: 0,
      isLikedByCurrentUser: true
    },
    {
      id: 'comment-5-3',
      postId: 'post-5',
      authorId: 'user-maria-gonzalez',
      authorName: 'María González',
      authorAvatar: '/assets/images/avatars/maria.jpg',
      content: 'Aire definitivamente - siempre veo el panorama completo 🌬️',
      timestamp: new Date(Date.now() - 13500000).toISOString(), // 3h 45min ago
      likes: ['user-pedro-sanchez', 'user-ana-martinez'],
      likesCount: 2,
      isLikedByCurrentUser: false
    },
    {
      id: 'comment-5-4',
      postId: 'post-5',
      authorId: 'current-user-id',
      authorName: 'Tú',
      authorAvatar: '/assets/images/avatars/current-user.jpg',
      content: 'Me parece genial esta perspectiva. Yo siento que soy principalmente Fuego con toques de Tierra.',
      timestamp: new Date(Date.now() - 13200000).toISOString(), // 3h 40min ago
      likes: ['user-pedro-sanchez'],
      likesCount: 1,
      isLikedByCurrentUser: false
    }
  ]
};

// 💬 Mensajes de ejemplo basados en el análisis
export const mockMessages: { [matchId: string]: ChatMessage[] } = {
  '38000e9aad777d56': [
    {
      id: 'msg-1',
      matchId: '38000e9aad777d56',
      senderId: 'user-38000e9aad777d56',
      senderName: 'Juan Manuel Escobar Ramírez',
      content: '¡Hola! Me interesa tu servicio de desarrollo web',
      type: 'text',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      isRead: true,
      isDelivered: true
    },
    {
      id: 'msg-2',
      matchId: '38000e9aad777d56',
      senderId: 'current-user-id',
      senderName: 'Tú',
      content: '¡Perfecto! Te puedo ayudar con eso. ¿Qué tipo de proyecto tienes en mente?',
      type: 'text',
      timestamp: new Date(Date.now() - 1500000).toISOString(), // 25 min ago
      isRead: true,
      isDelivered: true
    },
    {
      id: 'msg-3',
      matchId: '38000e9aad777d56',
      senderId: 'user-38000e9aad777d56',
      senderName: 'Juan Manuel Escobar Ramírez',
      content: 'Necesito una plataforma e-commerce moderna con React',
      type: 'text',
      timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 min ago
      isRead: true,
      isDelivered: true
    },
    {
      id: 'msg-4',
      matchId: '38000e9aad777d56',
      senderId: 'current-user-id',
      senderName: 'Tú',
      content: 'Excelente, tengo mucha experiencia en React y e-commerce. ¿Tienes un presupuesto estimado?',
      type: 'text',
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
      isRead: true,
      isDelivered: true
    },
    {
      id: 'msg-5',
      matchId: '38000e9aad777d56',
      senderId: 'user-38000e9aad777d56',
      senderName: 'Juan Manuel Escobar Ramírez',
      content: '😊❤️👍',
      type: 'emoji',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      isRead: false,
      isDelivered: true
    }
  ],
  'match-maria-gonzalez': [
    {
      id: 'msg-maria-1',
      matchId: 'match-maria-gonzalez',
      senderId: 'user-maria-gonzalez',
      senderName: 'María González',
      content: 'Hola, vi tu perfil y me interesa tu experiencia en UX/UI',
      type: 'text',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      isRead: true,
      isDelivered: true
    },
    {
      id: 'msg-maria-2',
      matchId: 'match-maria-gonzalez',
      senderId: 'current-user-id',
      senderName: 'Tú',
      content: '¡Hola María! Muchas gracias. ¿En qué proyecto estás trabajando?',
      type: 'text',
      timestamp: new Date(Date.now() - 6900000).toISOString(),
      isRead: true,
      isDelivered: true
    },
    {
      id: 'msg-maria-3',
      matchId: 'match-maria-gonzalez',
      senderId: 'user-maria-gonzalez',
      senderName: 'María González',
      content: '¿Podrías enviarme más detalles del proyecto?',
      type: 'text',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRead: true,
      isDelivered: true
    }
  ],
  'match-carlos-lopez': [
    {
      id: 'msg-carlos-1',
      matchId: 'match-carlos-lopez',
      senderId: 'user-carlos-lopez',
      senderName: 'Carlos López',
      content: 'Perfecto, acordemos una cita para la próxima semana',
      type: 'text',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      isRead: false,
      isDelivered: true
    }
  ]
};

// 📢 Notificaciones de ejemplo
export const mockNotifications: SocialNotification[] = [
  {
    id: 'notif-1',
    type: 'new_message',
    title: 'Nuevo mensaje',
    message: 'Juan Manuel te envió un mensaje',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
    isRead: false,
    matchId: '38000e9aad777d56',
    senderId: 'user-38000e9aad777d56'
  },
  {
    id: 'notif-2',
    type: 'new_message',
    title: 'Nuevo mensaje',
    message: 'Carlos López te envió un mensaje',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    isRead: false,
    matchId: 'match-carlos-lopez',
    senderId: 'user-carlos-lopez'
  },
  {
    id: 'notif-3',
    type: 'new_match',
    title: 'Nuevo match',
    message: 'Tienes un nuevo match con Ana Martínez',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isRead: true,
    matchId: 'match-ana-martinez',
    senderId: 'user-ana-martinez'
  },
  {
    id: 'notif-4',
    type: 'post_like',
    title: 'Le gustó tu publicación',
    message: 'A María González le gustó tu publicación sobre Ayni',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    isRead: true,
    postId: 'post-1',
    senderId: 'user-maria-gonzalez'
  }
];

// 🛠️ API Mock para simular el backend
export const mockAPI = {
  // Simulación de latencia de red
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Gestión de matches
  getMatches: async () => {
    await mockAPI.delay(300);
    return { data: mockMatches, success: true };
  },

  getMatch: async (matchId: string) => {
    await mockAPI.delay(200);
    const match = mockMatches.find(m => m.id === matchId);
    if (!match) throw new Error('Match no encontrado');
    return { data: match, success: true };
  },

  // Gestión de mensajes
  getMessages: async (matchId: string, page = 0, limit = 50) => {
    await mockAPI.delay(400);
    const messages = mockMessages[matchId] || [];
    return { data: messages, success: true };
  },

  sendMessage: async (matchId: string, content: string, type: 'text' | 'emoji' | 'audio' = 'text') => {
    await mockAPI.delay(600);
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: 'current-user-id',
      senderName: 'Tú',
      content,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: true
    };

    // Simular agregar mensaje a la lista
    if (!mockMessages[matchId]) {
      mockMessages[matchId] = [];
    }
    mockMessages[matchId].push(newMessage);

    return { data: newMessage, success: true };
  },

  // Estados de usuario
  updateUserStatus: async (status: 'online' | 'away' | 'offline') => {
    await mockAPI.delay(200);
    console.log(`Estado actualizado a: ${status}`);
    return { data: { status }, success: true };
  },

  // Notificaciones
  getNotifications: async () => {
    await mockAPI.delay(300);
    return { data: mockNotifications, success: true };
  },

  // === FEED SOCIAL API ===

  // Obtener posts del feed
  getPosts: async (page = 0, limit = 20) => {
    await mockAPI.delay(500);
    
    // Simular paginación
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = mockPosts.slice(startIndex, endIndex);
    
    return { 
      data: paginatedPosts, 
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockPosts.length / limit),
        totalPosts: mockPosts.length,
        hasNextPage: endIndex < mockPosts.length
      }
    };
  },

  // Obtener un post específico
  getPost: async (postId: string) => {
    await mockAPI.delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post no encontrado');
    return { data: post, success: true };
  },

  // Crear nuevo post
  createPost: async (content: string, type: 'text' | 'image' | 'video' = 'text', media?: File) => {
    await mockAPI.delay(800);
    
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: 'current-user-id',
      authorName: 'Tú',
      authorAvatar: '/assets/images/avatars/current-user.jpg',
      content,
      type,
      timestamp: new Date().toISOString(),
      likes: [],
      likesCount: 0,
      commentsCount: 0,
      isLikedByCurrentUser: false,
      media: media ? `/uploads/${media.name}` : null
    };

    // Agregar al inicio de la lista
    mockPosts.unshift(newPost);

    return { data: newPost, success: true };
  },

  // Eliminar post
  deletePost: async (postId: string) => {
    await mockAPI.delay(400);
    const index = mockPosts.findIndex(p => p.id === postId);
    if (index === -1) throw new Error('Post no encontrado');
    
    mockPosts.splice(index, 1);
    delete mockPostComments[postId];
    
    return { data: { deleted: true }, success: true };
  },

  // Dar like a un post
  likePost: async (postId: string) => {
    await mockAPI.delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post no encontrado');

    if (!post.isLikedByCurrentUser) {
      post.likes.push('current-user-id');
      post.likesCount++;
      post.isLikedByCurrentUser = true;
    }

    return { data: { liked: true, likesCount: post.likesCount }, success: true };
  },

  // Quitar like de un post
  unlikePost: async (postId: string) => {
    await mockAPI.delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post no encontrado');

    if (post.isLikedByCurrentUser) {
      post.likes = post.likes.filter(userId => userId !== 'current-user-id');
      post.likesCount--;
      post.isLikedByCurrentUser = false;
    }

    return { data: { liked: false, likesCount: post.likesCount }, success: true };
  },

  // Obtener likes de un post
  getPostLikes: async (postId: string) => {
    await mockAPI.delay(250);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post no encontrado');
    
    return { data: post.likes, success: true };
  },

  // Obtener comentarios de un post
  getPostComments: async (postId: string, page = 0, limit = 10) => {
    await mockAPI.delay(400);
    const comments = mockPostComments[postId] || [];
    
    // Simular paginación
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);
    
    return { 
      data: paginatedComments, 
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(comments.length / limit),
        totalComments: comments.length,
        hasNextPage: endIndex < comments.length
      }
    };
  },

  // Crear comentario
  createComment: async (postId: string, content: string) => {
    await mockAPI.delay(600);
    
    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: 'current-user-id',
      authorName: 'Tú',
      authorAvatar: '/assets/images/avatars/current-user.jpg',
      content,
      timestamp: new Date().toISOString(),
      likes: [],
      likesCount: 0,
      isLikedByCurrentUser: false
    };

    // Agregar comentario
    if (!mockPostComments[postId]) {
      mockPostComments[postId] = [];
    }
    mockPostComments[postId].push(newComment);

    // Actualizar contador en el post
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.commentsCount++;
    }

    return { data: newComment, success: true };
  },

  // Eliminar comentario
  deleteComment: async (postId: string, commentId: string) => {
    await mockAPI.delay(400);
    const comments = mockPostComments[postId];
    if (!comments) throw new Error('Post no encontrado');
    
    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) throw new Error('Comentario no encontrado');
    
    comments.splice(index, 1);

    // Actualizar contador en el post
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.commentsCount--;
    }

    return { data: { deleted: true }, success: true };
  },

  // Dar like a un comentario
  likeComment: async (postId: string, commentId: string) => {
    await mockAPI.delay(300);
    const comments = mockPostComments[postId];
    if (!comments) throw new Error('Post no encontrado');
    
    const comment = comments.find(c => c.id === commentId);
    if (!comment) throw new Error('Comentario no encontrado');

    if (!comment.isLikedByCurrentUser) {
      comment.likes.push('current-user-id');
      comment.likesCount++;
      comment.isLikedByCurrentUser = true;
    }

    return { data: { liked: true, likesCount: comment.likesCount }, success: true };
  }
}; 