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
 * Obtiene el thumbnail real y correspondiente para cualquier video (YouTube, Vumbnail, custom, fallback)
 * - Si hay thumbnailUrl y es de YouTube, añade cache busting con videoId
 * - Si hay thumbnailUrl custom, úsalo
 * - Si hay externalId (YouTube), genera la URL oficial
 * - Si hay url, intenta extraer videoId y generar thumbnail
 * - Si no hay nada, retorna un placeholder
 * @param video Objeto video con posibles campos: thumbnailUrl, externalId, url
 * @param quality Calidad del thumbnail (default: 'high')
 * @returns URL del thumbnail
 */
export function getVideoThumbnail(
  video: { thumbnailUrl?: string; externalId?: string; url?: string },
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'
): string {
  // 1. Si hay thumbnailUrl y es de YouTube, añade cache busting
  if (video.thumbnailUrl) {
    if (video.thumbnailUrl.includes('img.youtube.com')) {
      // Extraer videoId si es posible
      const match = video.thumbnailUrl.match(/\/vi\/([^/]+)\//);
      const videoId = match ? match[1] : Date.now();
      return `${video.thumbnailUrl}?cb=${videoId}`;
    }
    // Si es Vumbnail (https://vumbnail.com/VIDEOID.jpg)
    if (video.thumbnailUrl.includes('vumbnail.com')) {
      const match = video.thumbnailUrl.match(/vumbnail.com\/([^./?&]+)/);
      const videoId = match ? match[1] : Date.now();
      return `${video.thumbnailUrl}?cb=${videoId}`;
    }
    // Si es custom, úsalo tal cual
    return video.thumbnailUrl;
  }
  // 2. Si hay externalId (YouTube), genera la URL
  if (video.externalId) {
    return `https://img.youtube.com/vi/${video.externalId}/hqdefault.jpg?cb=${video.externalId}`;
  }
  // 3. Si hay url, intenta extraer videoId y generar thumbnail
  if (video.url) {
    const videoId = extractYouTubeVideoId(video.url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg?cb=${videoId}`;
    }
    // Soporte para Vumbnail
    const vumbnailId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)?.[1];
    if (vumbnailId) {
      return `https://vumbnail.com/${vumbnailId}.jpg?cb=${vumbnailId}`;
    }
  }
  // 4. Crear placeholders específicos para diferentes plataformas
  if (video.url) {
    if (video.url.includes('netflix.com')) {
      // Placeholder para Netflix con un color distintivo
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
          <defs>
            <linearGradient id="netflix" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#E50914;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#B20710;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="480" height="270" fill="url(#netflix)" />
          <circle cx="240" cy="135" r="35" fill="rgba(255,255,255,0.9)" />
          <polygon points="230,120 230,150 255,135" fill="#E50914" />
          <text x="240" y="190" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="600">
            Netflix Content
          </text>
          <text x="240" y="210" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="12">
            Disponible en plataforma
          </text>
        </svg>
      `);
    }
    if (video.url.includes('vimeo.com')) {
      // Placeholder para Vimeo
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
          <defs>
            <linearGradient id="vimeo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1ab7ea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0088cc;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="480" height="270" fill="url(#vimeo)" />
          <circle cx="240" cy="135" r="35" fill="rgba(255,255,255,0.9)" />
          <polygon points="230,120 230,150 255,135" fill="#1ab7ea" />
          <text x="240" y="190" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="600">
            Vimeo Content
          </text>
          <text x="240" y="210" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="12">
            Video educativo
          </text>
        </svg>
      `);
    }
  }

  // 5. Fallback general
  return '/placeholder-video.svg';
}

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
    // Validar que url existe y no es null/undefined
    if (!url || typeof url !== 'string') {
      console.warn('checkVideoAvailability: URL is null, undefined, or not a string:', url);
      return false;
    }

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
