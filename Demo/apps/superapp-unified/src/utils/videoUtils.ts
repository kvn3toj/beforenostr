export const extractIframeSrc = (htmlString: string | undefined): string | null => {
  if (!htmlString) {
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const iframe = doc.querySelector('iframe');

    if (iframe && iframe.src) {
      return iframe.src;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error parsing HTML string:", error);
    return null;
  }
};

/**
 * Extrae la URL del video desde contenido en formato JSON o HTML
 * @param content Contenido del video (JSON string o HTML)
 * @returns URL del video o null si no se puede extraer
 */
export const extractVideoUrl = (content: string | undefined): string | null => {
  if (!content) return null;

  try {
    // Intentar parsear como JSON primero
    if (content.startsWith('{') || content.startsWith('[')) {
      const parsedContent = JSON.parse(content);
      
      // Formato JSON con URL directa
      if (parsedContent.url) {
        return parsedContent.url;
      }
      
      // Formato JSON con videoId de YouTube
      if (parsedContent.videoId) {
        return `https://www.youtube.com/watch?v=${parsedContent.videoId}`;
      }
    }
    
    // Si no es JSON, tratar como HTML y extraer iframe
    const iframeSrc = extractIframeSrc(content);
    if (iframeSrc) {
      return iframeSrc;
    }
    
    return null;
  } catch (error) {
    // Si falla el parsing de JSON, intentar como HTML
    return extractIframeSrc(content);
  }
};

/**
 * Convierte una URL de YouTube a formato embed para iframe
 * @param url URL de YouTube (watch o embed)
 * @returns URL de embed o la URL original si no es de YouTube
 */
export const convertToEmbedUrl = (url: string): string => {
  if (!url) return url;

  try {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  } catch (error) {
    return url;
  }
};

export const isValidVideoUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    // Lista de hostnames confiables (puedes añadir más si es necesario)
    const trustedHosts = [
      'www.youtube.com', 'youtube.com', 'youtu.be',
      'www.vimeo.com', 'vimeo.com', 'player.vimeo.com'
    ];
    return trustedHosts.some(host => hostname === host || hostname.endsWith('.' + host));
  } catch {
    // URL inválida que no se puede parsear
    return false;
  }
};

/**
 * Extrae el ID de un video de YouTube desde una URL de iframe o enlace directo
 * @param urlOrContent URL del video o contenido HTML con iframe
 * @returns El ID del video de YouTube o null si no se encuentra
 */
export const extractYouTubeVideoId = (urlOrContent: string): string | null => {
  if (!urlOrContent) return null;

  try {
    // Primero intentar extraer la URL del iframe si es contenido HTML
    let url = urlOrContent;
    if (urlOrContent.includes('<iframe')) {
      const iframeSrc = extractIframeSrc(urlOrContent);
      if (iframeSrc) {
        url = iframeSrc;
      } else {
        return null;
      }
    }

    // Patrones para diferentes formatos de URL de YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting YouTube video ID:", error);
    return null;
  }
};

/**
 * Genera la URL del thumbnail de un video de YouTube
 * @param videoId ID del video de YouTube
 * @param quality Calidad del thumbnail ('default', 'medium', 'high', 'standard', 'maxres')
 * @returns URL del thumbnail o null si no hay videoId
 */
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string | null => {
  if (!videoId) return null;
  
  const qualityMap = {
    'default': 'default.jpg',
    'medium': 'mqdefault.jpg', 
    'high': 'hqdefault.jpg',
    'standard': 'sddefault.jpg',
    'maxres': 'maxresdefault.jpg'
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
};

/**
 * Genera la URL del thumbnail desde contenido de video (HTML con iframe, JSON o URL directa)
 * @param content Contenido del video (HTML con iframe, JSON o URL)
 * @param quality Calidad del thumbnail
 * @returns URL del thumbnail o null si no se puede generar
 */
export const getVideoThumbnail = (content: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string | null => {
  // Intentar extraer URL desde cualquier formato
  const videoUrl = extractVideoUrl(content);
  
  if (videoUrl) {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (videoId) {
      return getYouTubeThumbnail(videoId, quality);
    }
  }
  
  // También intentar extraer directamente el videoId desde el contenido
  const videoId = extractYouTubeVideoId(content);
  if (videoId) {
    return getYouTubeThumbnail(videoId, quality);
  }
  
  return null;
};

/**
 * Finds a working video URL from an array of video sources
 * @param videoSources Array of video URLs to test
 * @returns Promise that resolves to the first working URL or null
 */
export const findWorkingVideoUrl = async (videoSources: string[]): Promise<string | null> => {
  for (const url of videoSources) {
    if (await checkVideoAvailability(url)) {
      return url;
    }
  }
  return null;
};

/**
 * Checks if a video URL is available and accessible
 * @param url Video URL to check
 * @returns Promise that resolves to true if video is available
 */
export const checkVideoAvailability = async (url: string): Promise<boolean> => {
  try {
    // For YouTube videos, we can check if the URL is valid
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(url);
      return videoId !== null && videoId.length > 0;
    }
    
    // For other video sources, we could implement a more sophisticated check
    // For now, just validate if it's a valid URL
    return isValidVideoUrl(url);
  } catch (error) {
    console.error('Error checking video availability:', error);
    return false;
  }
}; 