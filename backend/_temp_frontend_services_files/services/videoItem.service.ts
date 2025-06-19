import { apiService } from './api.service';

export interface VideoItem {
  id: number;
  title: string;
  description?: string;
  content: string;
  playlistId: string;
  itemTypeId: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  duration?: number; // Duración en segundos desde el backend
}

// ===== VIDEO ITEM CRUD =====

export const fetchVideoItemById = async (id: string): Promise<VideoItem> => {
  try {
    console.log(`🔍 fetchVideoItemById: Fetching video item ${id}...`);
    const videoItem = await apiService.get<VideoItem>(`/video-items/${id}`);
    console.log(`✅ fetchVideoItemById: Video item fetched successfully`);
    console.log(`📹 fetchVideoItemById: Title: "${videoItem.title}"`);
    console.log(`⏱️ fetchVideoItemById: Duration: ${videoItem.duration || 'undefined'} seconds`);
    
    return videoItem;
  } catch (error) {
    console.error('❌ fetchVideoItemById: Error fetching video item by ID:', error);
    throw error;
  }
};

/**
 * Función de fallback que no depende de APIs externas
 * @param content Contenido del video
 * @param title Título del video
 * @returns Duración estimada en segundos
 */
const getVideoDurationFallback = (content: string, title: string): number => {
  console.log(`🔄 getVideoDurationFallback: Using fallback estimation...`);
  
  // Extraer el video ID para clasificar el tipo de contenido
  const videoId = extractYouTubeVideoId(content);
  if (videoId) {
    console.log(`📹 getVideoDurationFallback: YouTube video detected: ${videoId}`);
  }
  
  // Analizar el título para estimar duración
  const titleLower = title.toLowerCase();
  console.log(`📝 getVideoDurationFallback: Analyzing title: "${title}"`);
  
  // Buscar patrones de duración en el título
  const durationPatterns = [
    /\[(\d+):(\d+):(\d+)\]/, // [HH:MM:SS]
    /\[(\d+):(\d+)\]/, // [MM:SS]
    /\((\d+):(\d+):(\d+)\)/, // (HH:MM:SS)
    /\((\d+):(\d+)\)/, // (MM:SS)
    /(\d+):(\d+):(\d+)/, // HH:MM:SS
    /(\d+):(\d+)/, // MM:SS
  ];
  
  for (const pattern of durationPatterns) {
    const match = title.match(pattern);
    if (match) {
      const parts = match.slice(1).map(Number);
      let duration = 0;
      if (parts.length === 3) {
        duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        duration = parts[0] * 60 + parts[1];
      }
      if (duration > 0) {
        console.log(`⏱️ getVideoDurationFallback: Duration found in title: ${duration} seconds`);
        return duration;
      }
    }
  }
  
  // Patrones de texto en el título
  const textPatterns = [
    { pattern: /(\d+)\s*min/i, multiplier: 60 },
    { pattern: /(\d+)\s*hour/i, multiplier: 3600 },
    { pattern: /(\d+)\s*hr/i, multiplier: 3600 },
  ];
  
  for (const { pattern, multiplier } of textPatterns) {
    const match = titleLower.match(pattern);
    if (match) {
      const duration = parseInt(match[1]) * multiplier;
      if (duration > 0 && duration < 36000) {
        console.log(`⏱️ getVideoDurationFallback: Text pattern duration: ${duration} seconds`);
        return duration;
      }
    }
  }
  
  // Estimación por palabras clave en el título
  if (titleLower.includes('short')) {
    console.log(`📱 getVideoDurationFallback: Short content detected: 60s`);
    return 60;
  }
  
  if (titleLower.includes('tutorial') || titleLower.includes('how to') || titleLower.includes('cómo')) {
    console.log(`📚 getVideoDurationFallback: Tutorial detected: 600s`);
    return 600;
  }
  
  if (titleLower.includes('música') || titleLower.includes('music') || titleLower.includes('canción') || titleLower.includes('song')) {
    console.log(`🎵 getVideoDurationFallback: Music detected: 240s`);
    return 240;
  }
  
  if (titleLower.includes('mecánica') || titleLower.includes('recompensa') || titleLower.includes('gamificación') || titleLower.includes('educativ')) {
    console.log(`🎓 getVideoDurationFallback: Educational content detected: 480s`);
    return 480;
  }
  
  // Por defecto: contenido educativo de duración media
  console.log(`🔄 getVideoDurationFallback: Default educational duration: 480s`);
  return 480;
};

// ===== HELPER FUNCTIONS =====

/**
 * Obtiene la duración de un video desde su contenido (YouTube)
 * @param content Contenido HTML del video (iframe de YouTube)
 * @returns Duración en segundos o null si no se puede obtener
 */
export const getVideoDurationFromContent = async (content: string): Promise<number | null> => {
  try {
    console.log(`🔍 getVideoDurationFromContent: Starting duration extraction...`);
    const videoId = extractYouTubeVideoId(content);
    if (!videoId) {
      console.warn('⚠️ getVideoDurationFromContent: No se pudo extraer el video ID de YouTube del contenido');
      return null;
    }

    console.log(`✅ getVideoDurationFromContent: YouTube Video ID extracted: ${videoId}`);

    // Usar diferentes métodos para obtener la duración con timeout
    const duration = await Promise.race([
      getYouTubeVideoDuration(videoId),
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000) // 5 segundos timeout
      )
    ]);
    
    console.log(`🎯 getVideoDurationFromContent: Final duration result: ${duration}`);
    return duration;
  } catch (error) {
    console.error('❌ getVideoDurationFromContent: Error obteniendo duración del video:', error);
    return null;
  }
};

/**
 * Obtiene la duración de un video de YouTube usando múltiples métodos
 * @param videoId ID del video de YouTube
 * @returns Duración en segundos o null si no se puede obtener
 */
export const getYouTubeVideoDuration = async (videoId: string): Promise<number | null> => {
  try {
    console.log(`🔍 getYouTubeVideoDuration: Getting duration for video ${videoId}...`);
    
    // Método 1: Intentar usar la API no oficial de YouTube (más precisa)
    console.log(`1️⃣ getYouTubeVideoDuration: Trying YouTube Data API...`);
    const duration1 = await getYouTubeDurationFromAPI(videoId);
    if (duration1) {
      console.log(`✅ getYouTubeVideoDuration: Got duration from API: ${duration1}`);
      return duration1;
    }

    // Método 2: Usar oembed para obtener información básica y estimar
    console.log(`2️⃣ getYouTubeVideoDuration: Trying YouTube oembed...`);
    const duration2 = await getYouTubeDurationFromOembed(videoId);
    if (duration2) {
      console.log(`✅ getYouTubeVideoDuration: Got duration from oembed: ${duration2}`);
      return duration2;
    }

    // Método 3: Valor por defecto basado en patrones comunes
    console.warn(`⚠️ getYouTubeVideoDuration: No se pudo obtener duración para video ${videoId}, usando valor por defecto`);
    return null;
  } catch (error) {
    console.error('❌ getYouTubeVideoDuration: Error obteniendo duración de YouTube:', error);
    return null;
  }
};

/**
 * Intenta obtener la duración usando el endpoint no oficial de YouTube
 * @param videoId ID del video de YouTube
 * @returns Duración en segundos o null
 */
const getYouTubeDurationFromAPI = async (videoId: string): Promise<number | null> => {
  try {
    // Este método usa el endpoint público de YouTube que a veces funciona sin API key
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyDummy`;
    
    // Como no tenemos API key real, esto no funcionará, pero la estructura está lista
    // En producción, necesitarías una API key válida de YouTube Data API v3
    
    console.log('⚠️ getYouTubeDurationFromAPI: YouTube Data API no disponible sin API key');
    return null;
  } catch (error) {
    console.warn('⚠️ getYouTubeDurationFromAPI: No se pudo usar YouTube Data API:', error);
    return null;
  }
};

/**
 * Obtiene información del video usando oembed y estima la duración
 * @param videoId ID del video de YouTube
 * @returns Duración estimada en segundos o null
 */
const getYouTubeDurationFromOembed = async (videoId: string): Promise<number | null> => {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    console.log(`🔍 getYouTubeDurationFromOembed: Fetching from ${oembedUrl}`);
    
    // Añadir modo CORS para intentar evitar problemas
    const response = await fetch(oembedUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log(`📡 getYouTubeDurationFromOembed: Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      
      console.log(`✅ getYouTubeDurationFromOembed: Video encontrado: "${data.title}" por ${data.author_name}`);
      
      // Intentar extraer duración del título
      const durationFromTitle = extractDurationFromTitle(data.title);
      if (durationFromTitle > 0) {
        console.log(`⏱️ getYouTubeDurationFromOembed: Duración extraída del título: ${durationFromTitle} segundos`);
        return durationFromTitle;
      }
      
      // Si no hay duración en el título, usar estimación inteligente
      const smartEstimate = estimateVideoDurationSmart(data.title, data.author_name);
      console.log(`🤖 getYouTubeDurationFromOembed: Duración estimada inteligentemente: ${smartEstimate} segundos`);
      return smartEstimate;
    } else {
      console.log(`❌ getYouTubeDurationFromOembed: Response not OK: ${response.status} ${response.statusText}`);
    }
    
    return null;
  } catch (error) {
    console.warn('❌ getYouTubeDurationFromOembed: Error con YouTube oembed (posible CORS):', error);
    return null;
  }
};

/**
 * Extrae la duración del título si está presente
 * @param title Título del video
 * @returns Duración en segundos o 0 si no se encuentra
 */
const extractDurationFromTitle = (title: string): number => {
  const durationPatterns = [
    /\[(\d+):(\d+):(\d+)\]/, // [HH:MM:SS]
    /\[(\d+):(\d+)\]/, // [MM:SS]
    /\((\d+):(\d+):(\d+)\)/, // (HH:MM:SS)
    /\((\d+):(\d+)\)/, // (MM:SS)
    /(\d+):(\d+):(\d+)/, // HH:MM:SS
    /(\d+):(\d+)/, // MM:SS (debe ir al final para no interferir con HH:MM:SS)
  ];
  
  for (const pattern of durationPatterns) {
    const match = title.match(pattern);
    if (match) {
      const parts = match.slice(1).map(Number);
      if (parts.length === 3) {
        // HH:MM:SS
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        // MM:SS
        return parts[0] * 60 + parts[1];
      }
    }
  }
  
  return 0;
};

/**
 * Estima la duración basándose en el título y el canal
 * @param title Título del video
 * @param author Nombre del canal/autor
 * @returns Duración estimada en segundos
 */
const estimateVideoDurationSmart = (title: string, author: string = ''): number => {
  const titleLower = title.toLowerCase();
  const authorLower = author.toLowerCase();
  
  // Patrones de texto que indican duración
  const textPatterns = [
    { pattern: /(\d+)\s*hours?/, multiplier: 3600 },
    { pattern: /(\d+)\s*hrs?/, multiplier: 3600 },
    { pattern: /(\d+)\s*h/, multiplier: 3600 },
    { pattern: /(\d+)\s*minutes?/, multiplier: 60 },
    { pattern: /(\d+)\s*mins?/, multiplier: 60 },
    { pattern: /(\d+)\s*m(?!\w)/, multiplier: 60 }, // 'm' no seguido de letra
    { pattern: /(\d+)\s*seconds?/, multiplier: 1 },
    { pattern: /(\d+)\s*secs?/, multiplier: 1 },
    { pattern: /(\d+)\s*s(?!\w)/, multiplier: 1 }, // 's' no seguido de letra
  ];
  
  for (const { pattern, multiplier } of textPatterns) {
    const match = titleLower.match(pattern);
    if (match) {
      const duration = parseInt(match[1]) * multiplier;
      if (duration > 0 && duration < 36000) { // Máximo 10 horas
        return duration;
      }
    }
  }
  
  // Estimaciones basadas en el tipo de contenido
  if (titleLower.includes('short') || titleLower.includes('shorts')) {
    return 60; // YouTube Shorts: ~1 minuto
  }
  
  if (titleLower.includes('trailer') || titleLower.includes('teaser')) {
    return 120; // Trailers: ~2 minutos
  }
  
  if (titleLower.includes('tutorial') || titleLower.includes('how to')) {
    return 600; // Tutoriales: ~10 minutos
  }
  
  if (titleLower.includes('podcast') || titleLower.includes('interview')) {
    return 2400; // Podcasts/Entrevistas: ~40 minutos
  }
  
  if (titleLower.includes('live') || titleLower.includes('stream')) {
    return 3600; // Streams: ~1 hora
  }
  
  if (titleLower.includes('full movie') || titleLower.includes('película completa')) {
    return 6000; // Películas: ~100 minutos
  }
  
  // Estimaciones basadas en el canal
  if (authorLower.includes('music') || authorLower.includes('records')) {
    return 240; // Música: ~4 minutos
  }
  
  if (authorLower.includes('news') || authorLower.includes('noticias')) {
    return 300; // Noticias: ~5 minutos
  }
  
  // Duración por defecto para videos educativos/corporativos
  return 480; // 8 minutos (duración común para contenido educativo)
}; 