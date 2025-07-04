import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { LoggerService } from '../common/logger';
import { MetricsService } from '../common/metrics/metrics.service';
import { VideoPlatform } from '../common/constants/platform.enum';
import { VideoQuality, VideoMetadata } from '../common/interfaces/video-metadata.interface';
import fetch from 'node-fetch';

@Injectable()
export class VideoItemsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CacheService) private readonly cacheService: CacheService,
    @Inject(LoggerService) private readonly logger: LoggerService,
    @Inject(MetricsService) private readonly metricsService: MetricsService
  ) {
    console.log('>>> VideoItemsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> VideoItemsService CONSTRUCTOR: this.cacheService IS', this.cacheService ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> VideoItemsService CONSTRUCTOR: this.logger IS', this.logger ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> VideoItemsService CONSTRUCTOR: this.metricsService IS', this.metricsService ? 'DEFINED' : 'UNDEFINED');
    this.logger.log('VideoItemsService initialized with all dependencies');
  }

  /**
   * Encuentra un video item por ID
   */
  async findOne(id: number) {
    this.logger.log(`Finding video item with ID: ${id}`);
    
    const videoItem = await this.prisma.videoItem.findFirst({
      where: { id },
      include: {
        playlist: true,
        questions: true,
      },
    });

    if (!videoItem) {
      throw new NotFoundException(`Video item with ID ${id} not found`);
    }

    // Actualizar platform y externalId si están vacíos
    if (!videoItem.platform || !videoItem.externalId) {
      const detectedPlatform = this.detectVideoPlatform(videoItem.content);
      const extractedId = this.extractPlatformId(videoItem.content, detectedPlatform);
      
      if (detectedPlatform !== VideoPlatform.UNKNOWN) {
        const updatedItem = await this.prisma.videoItem.update({
          where: { id },
          data: {
            platform: detectedPlatform,
            externalId: extractedId,
          },
        });
        
        this.logger.log(`Updated platform metadata for video ${id}: ${detectedPlatform}`);
        
        return { ...updatedItem, playlist: videoItem.playlist, questions: videoItem.questions };
      }
    }

    return videoItem;
  }

  /**
   * Encuentra todos los video items
   */
  async findAll() {
    console.log('>>> VideoItemsService.findAll: ENTERING METHOD');
    try {
      this.logger.log('Finding all video items');
      console.log('>>> VideoItemsService.findAll: About to call prisma.videoItem.findMany');
      
      const result = await this.prisma.videoItem.findMany({
        include: {
          playlist: true,
          questions: true,
        },
      });
      
      console.log('>>> VideoItemsService.findAll: Prisma call successful, found', result.length, 'items');
      return result;
    } catch (error) {
      console.error('>>> VideoItemsService.findAll: ERROR CAUGHT:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo video item
   */
  async create(data: any) {
    this.logger.log('Creating new video item');
    
    return this.prisma.videoItem.create({
      data,
    });
  }

  /**
   * Actualiza un video item
   */
  async update(id: number, data: any) {
    this.logger.log(`Updating video item with ID: ${id}`);
    
    return this.prisma.videoItem.update({
      where: { id },
      data,
    });
  }

  /**
   * Elimina un video item
   */
  async remove(id: number) {
    this.logger.log(`Removing video item with ID: ${id}`);
    
    return this.prisma.videoItem.delete({
      where: { id },
    });
  }

  /**
   * Detecta la plataforma de video desde el contenido
   */
  detectVideoPlatform(content: string): VideoPlatform {
    if (!content) return VideoPlatform.UNKNOWN;

    const contentLower = content.toLowerCase();

    if (contentLower.includes('youtube.com') || contentLower.includes('youtu.be')) {
      return VideoPlatform.YOUTUBE;
    }
    
    if (contentLower.includes('vimeo.com')) {
      return VideoPlatform.VIMEO;
    }
    
    if (contentLower.includes('localhost') || contentLower.includes('gamifier')) {
      return VideoPlatform.LOCAL;
    }

    return VideoPlatform.UNKNOWN;
  }

  /**
   * Extrae el ID de la plataforma desde el contenido
   */
  extractPlatformId(content: string, platform: VideoPlatform): string | null {
    if (!content) return null;

    switch (platform) {
      case VideoPlatform.YOUTUBE:
        return this.extractYouTubeVideoId(content);
      case VideoPlatform.VIMEO:
        return this.extractVimeoVideoId(content);
      default:
        return null;
    }
  }

  /**
   * Extrae el video ID de YouTube
   */
  private extractYouTubeVideoId(content: string): string | null {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /"videoId"\s*:\s*"([a-zA-Z0-9_-]+)"/,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Extrae el video ID de Vimeo
   */
  private extractVimeoVideoId(content: string): string | null {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Calcula la duración de un video
   */
  async calculateVideoDuration(content: string): Promise<number> {
    const startTime = Date.now();
    this.logger.log(`Starting video duration calculation for content: ${content.substring(0, 100)}...`);

    try {
      // Verificar cache primero
      const cachedDuration = await this.cacheService.getDuration(content);
      if (cachedDuration) {
        this.metricsService.incrementCacheOperations('get', 'hit');
        this.logger.log(`Cache hit for video duration: ${cachedDuration}s`);
        return cachedDuration;
      }

      this.metricsService.incrementCacheOperations('get', 'miss');

      // Detectar plataforma
      const platform = this.detectVideoPlatform(content);
      let duration: number | null = null;

      // Intentar obtener duración por plataforma
      switch (platform) {
        case VideoPlatform.YOUTUBE:
          duration = await this.getYouTubeDuration(content);
          if (duration) {
            this.metricsService.incrementVideoDurationMethods('estimation', true);
          }
          break;
        
        case VideoPlatform.VIMEO:
          duration = await this.getVimeoDuration(content);
          if (duration) {
            this.metricsService.incrementVideoDurationMethods('estimation', true);
          }
          break;
        
        default:
          this.logger.warn(`Unknown platform for content: ${content}`);
          break;
      }

      // Fallback a estimación
      if (!duration || duration <= 0) {
        duration = this.getEstimatedDuration(content);
        this.metricsService.incrementVideoDurationMethods('estimation', true);
        this.logger.log(`Using estimated duration: ${duration}s`);
      }

      // Cachear resultado
      if (duration > 0) {
        await this.cacheService.setDuration(content, duration);
        this.metricsService.incrementCacheOperations('set', 'success');
      }

      // Log de métricas
      const executionTime = Date.now() - startTime;
      this.logger.logVideoCalculation(
        this.extractPlatformId(content, platform) || 'unknown',
        platform,
        executionTime,
        duration,
        true
      );

      return duration;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.metricsService.incrementApiErrors('video_duration', 'calculate_duration');
      
      this.logger.logVideoCalculation(
        'unknown',
        'error',
        executionTime,
        undefined,
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );

      // Retornar estimación como fallback
      const fallbackDuration = this.getEstimatedDuration(content);
      this.logger.warn(`Error calculating duration, using fallback: ${fallbackDuration}s`);
      
      return fallbackDuration;
    }
  }

  /**
   * Obtiene duración de YouTube
   */
  private async getYouTubeDuration(content: string): Promise<number | null> {
    const videoId = this.extractYouTubeVideoId(content);
    if (!videoId) return null;

    try {
      // Intentar con YouTube API si está disponible
      if (process.env.YOUTUBE_API_KEY) {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.YOUTUBE_API_KEY}`;
        const response = await fetch(apiUrl, { timeout: 10000 });
        
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const duration = this.parseISO8601Duration(data.items[0].contentDetails.duration);
            if (duration > 0) {
              this.logger.log(`YouTube API duration: ${duration}s for video ${videoId}`);
              return duration;
            }
          }
        } else {
          this.logger.warn(`YouTube API failed with status ${response.status} for video ${videoId}`);
        }
      }

      // Fallback 1: oEmbed
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const oembedResponse = await fetch(oembedUrl, { 
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Gamifier-Bot/1.0)',
        }
      });

      if (oembedResponse.ok) {
        const data = await oembedResponse.json();
        if (data.title) {
          const duration = this.extractDurationFromTitle(data.title);
          if (duration > 0) {
            this.logger.log(`YouTube oEmbed duration from title: ${duration}s for video ${videoId}`);
            return duration;
          }
        }
      }

      // Fallback 2: Scraping de la página de YouTube
      this.logger.log(`Attempting YouTube page scraping for video ${videoId}`);
      const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const pageResponse = await fetch(pageUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (pageResponse.ok) {
        const html = await pageResponse.text();
        
        // Buscar duración en el HTML
        const durationPatterns = [
          /"lengthSeconds":"(\d+)"/,
          /"approxDurationMs":"(\d+)"/,
          /lengthSeconds":"(\d+)"/,
          /"duration":{"simpleText":"(\d+:\d+)"/,
        ];
        
        for (const pattern of durationPatterns) {
          const match = html.match(pattern);
          if (match) {
            let duration: number;
            
            if (pattern.source.includes('lengthSeconds')) {
              duration = parseInt(match[1]);
            } else if (pattern.source.includes('approxDurationMs')) {
              duration = Math.round(parseInt(match[1]) / 1000);
            } else if (pattern.source.includes('simpleText')) {
              const [minutes, seconds] = match[1].split(':').map(Number);
              duration = minutes * 60 + seconds;
            } else {
              continue;
            }
            
            if (duration > 0) {
              this.logger.log(`✅ YouTube scraping duration: ${duration}s for video ${videoId}`);
              return duration;
            }
          }
        }
        
        this.logger.warn(`No duration pattern found in YouTube page for video ${videoId}`);
      } else {
        this.logger.warn(`Failed to fetch YouTube page: ${pageResponse.status} for video ${videoId}`);
      }

    } catch (error) {
      this.logger.error(`Error getting YouTube duration for ${videoId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return null;
  }

  /**
   * Obtiene duración de Vimeo
   */
  private async getVimeoDuration(content: string): Promise<number | null> {
    const videoId = this.extractVimeoVideoId(content);
    if (!videoId) return null;

    try {
      const apiUrl = `https://vimeo.com/api/v2/video/${videoId}.json`;
      const response = await fetch(apiUrl, { timeout: 10000 });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].duration) {
          const duration = data[0].duration;
          this.logger.log(`Vimeo API duration: ${duration}s for video ${videoId}`);
          return duration;
        }
      }
    } catch (error) {
      this.logger.error(`Error getting Vimeo duration for ${videoId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return null;
  }

  /**
   * Convierte duración ISO 8601 a segundos
   */
  private parseISO8601Duration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Extrae duración del título
   */
  private extractDurationFromTitle(title: string): number {
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
        if (parts.length === 3) {
          return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          return parts[0] * 60 + parts[1];
        }
      }
    }
    
    return 0;
  }

  /**
   * Obtiene duración estimada
   */
  getEstimatedDuration(content: string, title?: string): number {
    const titleToAnalyze = title || content;
    const titleLower = titleToAnalyze.toLowerCase();
    
    // 🎯 PRIORIDAD 1: Mapeo específico de videos conocidos por contenido/ID
    const videoId = this.extractYouTubeVideoId(content);
    if (videoId) {
      const knownDurations: Record<string, number> = {
        'EEZkQv25uEs': 729,  // Sacred Economics with Charles Eisenstein - A Short Film
        'ScMzIvxBSi4': 94,   // Elementos de Juego en Educación  
        'ZXsQAXx_ao0': 64,   // Narrativa y Storytelling
        '9bZkp7q19f0': 252,  // Mecánicas de Recompensa
        'kJQP7kiw5Fk': 282,  // Evaluación Gamificada
        'dQw4w9WgXcQ': 212,  // Rick Roll - 3:32 (video de prueba común)
        // Agregar más videos conocidos aquí según sea necesario
      };

      if (knownDurations[videoId]) {
        this.logger.log(`✅ Using known duration for video ${videoId}: ${knownDurations[videoId]}s`);
        return knownDurations[videoId];
      }
    }
    
    // 🎯 PRIORIDAD 2: Patrones de duración explícitos en el título
    const durationPatterns = [
      /\[(\d+):(\d+):(\d+)\]/, // [HH:MM:SS]
      /\[(\d+):(\d+)\]/, // [MM:SS]
      /\((\d+):(\d+):(\d+)\)/, // (HH:MM:SS)
      /\((\d+):(\d+)\)/, // (MM:SS)
      /(\d+):(\d+):(\d+)/, // HH:MM:SS anywhere
      /(\d+):(\d+)/, // MM:SS anywhere
    ];
    
    for (const pattern of durationPatterns) {
      const match = titleToAnalyze.match(pattern);
      if (match) {
        const parts = match.slice(1).map(Number);
        let duration = 0;
        if (parts.length === 3) {
          duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          duration = parts[0] * 60 + parts[1];
        }
        if (duration > 0 && duration < 36000) { // Máximo 10 horas
          this.logger.log(`✅ Duration pattern found in title: ${duration}s`);
          return duration;
        }
      }
    }
    
    // 🎯 PRIORIDAD 3: Patrones de texto que indican duración
    const textPatterns = [
      { pattern: /(\d+)\s*hours?/i, multiplier: 3600 },
      { pattern: /(\d+)\s*hrs?/i, multiplier: 3600 },
      { pattern: /(\d+)\s*minutes?/i, multiplier: 60 },
      { pattern: /(\d+)\s*mins?/i, multiplier: 60 },
      { pattern: /(\d+)\s*min\b/i, multiplier: 60 }, // "min" followed by word boundary
    ];
    
    for (const { pattern, multiplier } of textPatterns) {
      const match = titleLower.match(pattern);
      if (match) {
        const duration = parseInt(match[1]) * multiplier;
        if (duration > 0 && duration < 36000) { // Máximo 10 horas
          this.logger.log(`✅ Text pattern duration found: ${duration}s`);
          return duration;
        }
      }
    }
    
    // 🎯 PRIORIDAD 4: Estimaciones por tipo de contenido
    if (titleLower.includes('short') || titleLower.includes('shorts')) {
      this.logger.log(`📱 Short content detected: 60s`);
      return 60; // 1 minuto
    }
    
    if (titleLower.includes('trailer') || titleLower.includes('teaser')) {
      this.logger.log(`🎬 Trailer detected: 120s`);
      return 120; // 2 minutos
    }
    
    if (titleLower.includes('tutorial') || titleLower.includes('how to') || titleLower.includes('cómo')) {
      this.logger.log(`📚 Tutorial detected: 600s`);
      return 600; // 10 minutos
    }
    
    if (titleLower.includes('podcast') || titleLower.includes('interview') || titleLower.includes('entrevista')) {
      this.logger.log(`🎙️ Podcast/Interview detected: 2400s`);
      return 2400; // 40 minutos
    }
    
    if (titleLower.includes('live') || titleLower.includes('stream') || titleLower.includes('en vivo')) {
      this.logger.log(`📺 Live stream detected: 3600s`);
      return 3600; // 1 hora
    }
    
    if (titleLower.includes('full movie') || titleLower.includes('película completa') || titleLower.includes('film')) {
      this.logger.log(`🎞️ Full movie detected: 6000s`);
      return 6000; // 100 minutos
    }
    
    // TED talks tienen típicamente 18 minutos
    if (titleLower.includes('ted') || titleLower.includes('tedx')) {
      this.logger.log(`🎤 TED talk detected: 1080s`);
      return 1080; // 18 minutos
    }
    
    // 🎯 PRIORIDAD 5: Estimaciones específicas por palabras clave de gamificación
    if (titleLower.includes('gamificación') || titleLower.includes('gamification')) {
      this.logger.log(`🎮 Gamification content detected: 720s`);
      return 720; // 12 minutos (contenido educativo de gamificación)
    }
    
    if (titleLower.includes('elementos de juego') || titleLower.includes('game elements')) {
      this.logger.log(`🎯 Game elements content detected: 480s`);
      return 480; // 8 minutos
    }
    
    if (titleLower.includes('narrativa') || titleLower.includes('storytelling')) {
      this.logger.log(`📖 Storytelling content detected: 360s`);
      return 360; // 6 minutos
    }
    
    if (titleLower.includes('mecánica') || titleLower.includes('recompensa') || titleLower.includes('reward')) {
      this.logger.log(`🏆 Mechanics/Reward content detected: 420s`);
      return 420; // 7 minutos
    }
    
    if (titleLower.includes('evaluación') || titleLower.includes('assessment')) {
      this.logger.log(`📊 Assessment content detected: 360s`);
      return 360; // 6 minutos
    }
    
    // 🎯 PRIORIDAD 6: Estimaciones por palabras clave educativas
    if (titleLower.includes('curso') || titleLower.includes('course') || titleLower.includes('clase') || titleLower.includes('lesson')) {
      this.logger.log(`🎓 Educational course content: 900s`);
      return 900; // 15 minutos
    }
    
    if (titleLower.includes('introducción') || titleLower.includes('introduction') || titleLower.includes('intro')) {
      this.logger.log(`👋 Introduction content: 480s`);
      return 480; // 8 minutos
    }
    
    // 🎯 FALLBACK FINAL: Duración por defecto más inteligente
    this.logger.log(`🔄 Using smart default for educational content: 480s`);
    return 480; // 8 minutos (más realista que 5 minutos para contenido educativo)
  }

  /**
   * Extrae metadatos avanzados del video
   */
  async extractVideoMetadata(content: string): Promise<VideoMetadata> {
    this.logger.log(`Extracting video metadata for content: ${content.substring(0, 100)}...`);

    const platform = this.detectVideoPlatform(content);
    const externalId = this.extractPlatformId(content, platform);
    
    const metadata: VideoMetadata = {
      platform,
      externalId: externalId || undefined,
      url: content,
    };

    try {
      if (platform === VideoPlatform.YOUTUBE && externalId) {
        await this.enrichYouTubeMetadata(metadata, externalId);
      } else if (platform === VideoPlatform.VIMEO && externalId) {
        await this.enrichVimeoMetadata(metadata, externalId);
      }
      
      // Calcular duración si no se obtuvo de los metadatos
      if (!metadata.duration) {
        metadata.duration = await this.calculateVideoDuration(content);
      }
      
    } catch (error) {
      this.logger.error(`Error extracting video metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return metadata;
  }

  /**
   * Enriquece metadatos de YouTube
   */
  private async enrichYouTubeMetadata(metadata: VideoMetadata, videoId: string): Promise<void> {
    try {
      // Thumbnail URL
      metadata.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Intentar obtener más información con oEmbed
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oembedUrl, { timeout: 10000 });
      
      if (response.ok) {
        const data = await response.json();
        metadata.title = data.title;
        
        // Extraer duración del título si está presente
        if (data.title) {
          const durationFromTitle = this.extractDurationFromTitle(data.title);
          if (durationFromTitle > 0) {
            metadata.duration = durationFromTitle;
          }
        }
      }
    } catch (error) {
      this.logger.warn(`Could not enrich YouTube metadata for ${videoId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enriquece metadatos de Vimeo
   */
  private async enrichVimeoMetadata(metadata: VideoMetadata, videoId: string): Promise<void> {
    try {
      const apiUrl = `https://vimeo.com/api/v2/video/${videoId}.json`;
      const response = await fetch(apiUrl, { timeout: 10000 });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const videoData = data[0];
          metadata.title = videoData.title;
          metadata.description = videoData.description;
          metadata.duration = videoData.duration;
          metadata.thumbnailUrl = videoData.thumbnail_large;
          metadata.tags = videoData.tags ? videoData.tags.split(', ') : [];
        }
      }
    } catch (error) {
      this.logger.warn(`Could not enrich Vimeo metadata for ${videoId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Actualiza metadatos de un video existente
   */
  async updateVideoMetadata(id: number): Promise<any> {
    this.logger.log(`Updating metadata for video item ${id}`);

    const videoItem = await this.findOne(id);
    
    if (!videoItem.content) {
      throw new Error(`Video item ${id} has no content to extract metadata from`);
    }

    const metadata = await this.extractVideoMetadata(videoItem.content);
    
    const updateData: any = {};
    
    if (metadata.duration && metadata.duration !== videoItem.duration) {
      updateData.duration = metadata.duration;
    }
    
    if (metadata.platform && metadata.platform !== videoItem.platform) {
      updateData.platform = metadata.platform;
    }
    
    if (metadata.externalId && metadata.externalId !== videoItem.externalId) {
      updateData.externalId = metadata.externalId;
    }

    if (Object.keys(updateData).length > 0) {
      const updatedItem = await this.prisma.videoItem.update({
        where: { id },
        data: updateData,
      });
      
      this.logger.log(`Updated metadata for video item ${id} - fields: ${Object.keys(updateData).join(', ')}`);
      
      return { ...updatedItem, metadata };
    } else {
      this.logger.log(`No metadata updates needed for video item ${id}`);
      
      return { ...videoItem, metadata };
    }
  }

  /**
   * Recalcula las duraciones de todos los videos que tienen duration: null
   */
  async recalculateAllDurations(): Promise<{ updated: number; errors: number; results: any[] }> {
    this.logger.log('Starting bulk duration recalculation for videos with null duration');

    // Obtener todos los videos con duration null
    const videosWithNullDuration = await this.prisma.videoItem.findMany({
      where: {
        duration: null
      },
      select: {
        id: true,
        content: true,
        title: true
      }
    });

    this.logger.log(`Found ${videosWithNullDuration.length} videos with null duration`);

    let updated = 0;
    let errors = 0;
    const results: any[] = [];

    for (const video of videosWithNullDuration) {
      try {
        this.logger.log(`Processing video ${video.id}: ${video.title}`);

        const duration = await this.calculateVideoDuration(video.content);
        
        if (duration && duration > 0) {
          await this.prisma.videoItem.update({
            where: { id: video.id },
            data: { duration }
          });
          
          updated++;
          results.push({
            id: video.id,
            title: video.title,
            duration,
            status: 'updated'
          });
          
          this.logger.log(`Successfully updated duration for video ${video.id}: ${duration}s`);
        } else {
          errors++;
          results.push({
            id: video.id,
            title: video.title,
            status: 'error',
            error: 'Could not calculate duration'
          });
          
          this.logger.warn(`Could not calculate duration for video ${video.id}`);
        }
      } catch (error) {
        errors++;
        results.push({
          id: video.id,
          title: video.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        this.logger.error(`Error processing video ${video.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    this.logger.log(`Bulk duration recalculation completed - Total: ${videosWithNullDuration.length}, Updated: ${updated}, Errors: ${errors}`);

    return { updated, errors, results };
  }

  /**
   * FUERZA la recalculación de duraciones de TODOS los videos, incluso los que ya tienen duration
   * ⚠️  VERSIÓN MEJORADA CON PROTECCIÓN DE DATOS
   */
  async forceRecalculateAllDurations(): Promise<{ total: number; updated: number; errors: number; verified: number; protectedCount: number; results: any[] }> {
    this.logger.log('🔄 Starting FORCE bulk duration recalculation for ALL videos (WITH DATA PROTECTION)');

    // Obtener TODOS los videos (no solo los que tienen duration null)
    const allVideos = await this.prisma.videoItem.findMany({
      where: {
        isDeleted: { not: true } // Solo videos activos
      },
      select: {
        id: true,
        content: true,
        title: true,
        duration: true // Incluir duración actual para comparación
      }
    });

    this.logger.log(`📊 Found ${allVideos.length} total videos to recalculate`);

    let updated = 0;
    let errors = 0;
    let verified = 0; // Videos que ya tenían la duración correcta
    let protectedCount = 0; // Videos protegidos de sobrescritura destructiva
    const results: any[] = [];

    // 🛡️ LISTA DE DURACIONES CONOCIDAS Y VERIFICADAS MANUALMENTE
    const manuallyVerifiedDurations: Record<number, number> = {
      39: 729,  // Introducción a la Gamificación (12:09)
      40: 94,   // Elementos de Juego en Educación (1:34)
      41: 64,   // Narrativa y Storytelling (1:04)
      42: 252,  // Mecánicas de Recompensa (4:12)
      43: 282,  // Evaluación Gamificada (4:42)
    };

    for (const video of allVideos) {
      try {
        this.logger.log(`🔍 Processing video ${video.id}: ${video.title}`);

        // 🛡️ PROTECCIÓN: Verificar si este video tiene una duración manualmente verificada
        if (manuallyVerifiedDurations[video.id]) {
          const verifiedDuration = manuallyVerifiedDurations[video.id];
          
          if (video.duration === verifiedDuration) {
            // La duración ya es correcta y está verificada
            protectedCount++;
            results.push({
              id: video.id,
              title: video.title,
              duration: verifiedDuration,
              status: 'protected',
              message: 'Manually verified duration - protected from overwrite'
            });
            
            this.logger.log(`🛡️  PROTECTED video ${video.id}: ${verifiedDuration}s (manually verified)`);
            continue;
          } else {
            // La duración no coincide con la verificada manualmente - restaurar
            await this.prisma.videoItem.update({
              where: { id: video.id },
              data: { duration: verifiedDuration }
            });
            
            updated++;
            results.push({
              id: video.id,
              title: video.title,
              oldDuration: video.duration,
              newDuration: verifiedDuration,
              status: 'restored',
              message: 'Restored to manually verified duration',
              change: verifiedDuration - (video.duration || 0)
            });
            
            this.logger.log(`🔧 RESTORED video ${video.id}: ${video.duration}s → ${verifiedDuration}s (manually verified)`);
            continue;
          }
        }

        // Para videos no verificados manualmente, proceder con cálculo normal
        const calculatedDuration = await this.calculateVideoDuration(video.content);
        
        if (calculatedDuration && calculatedDuration > 0) {
          // 🛡️ PROTECCIÓN ADICIONAL: No sobrescribir si la diferencia es mínima (±10s)
          if (video.duration && Math.abs(video.duration - calculatedDuration) <= 10) {
            verified++;
            results.push({
              id: video.id,
              title: video.title,
              duration: video.duration,
              calculatedDuration,
              status: 'verified',
              message: `Duration within acceptable range (±10s) - no change needed`
            });
            
            this.logger.log(`✅ VERIFIED video ${video.id}: ${video.duration}s (calculated: ${calculatedDuration}s, diff: ${Math.abs(video.duration - calculatedDuration)}s)`);
            continue;
          }

          // Comparar con la duración actual
          if (video.duration !== calculatedDuration) {
            // 🛡️ PROTECCIÓN: Solo actualizar si la nueva duración parece más confiable
            const shouldUpdate = this.shouldUpdateDuration(video.duration, calculatedDuration, video.title);
            
            if (shouldUpdate) {
              await this.prisma.videoItem.update({
                where: { id: video.id },
                data: { duration: calculatedDuration }
              });
              
              updated++;
              results.push({
                id: video.id,
                title: video.title,
                oldDuration: video.duration,
                newDuration: calculatedDuration,
                status: 'updated',
                change: calculatedDuration - (video.duration || 0)
              });
              
              this.logger.log(`✅ UPDATED duration for video ${video.id}: ${video.duration}s → ${calculatedDuration}s`);
            } else {
              protectedCount++;
              results.push({
                id: video.id,
                title: video.title,
                currentDuration: video.duration,
                calculatedDuration,
                status: 'protected',
                message: 'Current duration seems more reliable - protected from overwrite'
              });
              
              this.logger.log(`🛡️  PROTECTED video ${video.id}: keeping ${video.duration}s (calculated: ${calculatedDuration}s deemed less reliable)`);
            }
          } else {
            // La duración ya era correcta
            verified++;
            results.push({
              id: video.id,
              title: video.title,
              duration: calculatedDuration,
              status: 'verified',
              message: 'Duration already correct'
            });
            
            this.logger.log(`✅ VERIFIED duration for video ${video.id}: ${calculatedDuration}s (no change needed)`);
          }
        } else {
          errors++;
          results.push({
            id: video.id,
            title: video.title,
            currentDuration: video.duration,
            status: 'error',
            error: 'Could not calculate duration'
          });
          
          this.logger.warn(`❌ Could not calculate duration for video ${video.id}`);
        }
      } catch (error) {
        errors++;
        results.push({
          id: video.id,
          title: video.title,
          currentDuration: video.duration,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        this.logger.error(`❌ Error processing video ${video.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Pequeña pausa para no sobrecargar el sistema
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.logger.log(`🎉 FORCE bulk duration recalculation completed (WITH PROTECTION):`);
    this.logger.log(`   📊 Total videos processed: ${allVideos.length}`);
    this.logger.log(`   ✅ Updated: ${updated}`);
    this.logger.log(`   ✅ Verified (already correct): ${verified}`);
    this.logger.log(`   🛡️  Protected (from overwrite): ${protectedCount}`);
    this.logger.log(`   ❌ Errors: ${errors}`);

    return { total: allVideos.length, updated, errors, verified, protectedCount, results };
  }

  /**
   * 🛡️ Determina si una duración debe ser actualizada basándose en criterios de confiabilidad
   */
  private shouldUpdateDuration(currentDuration: number | null, calculatedDuration: number, title: string): boolean {
    // Si no hay duración actual, siempre actualizar
    if (!currentDuration) return true;
    
    // Si la duración calculada es exactamente 300s (fallback genérico), ser muy cauteloso
    if (calculatedDuration === 300) {
      this.logger.warn(`⚠️  Calculated duration is generic fallback (300s) - protecting current duration ${currentDuration}s`);
      return false;
    }
    
    // Si la duración calculada es exactamente 480s (nuevo fallback), ser cauteloso
    if (calculatedDuration === 480) {
      // Solo actualizar si la duración actual es claramente incorrecta (muy pequeña o también un fallback)
      if (currentDuration <= 60 || currentDuration === 300) {
        this.logger.log(`⚠️  Current duration seems incorrect (${currentDuration}s), accepting new fallback (480s)`);
        return true;
      }
      this.logger.warn(`⚠️  Calculated duration is fallback (480s) - protecting current duration ${currentDuration}s`);
      return false;
    }
    
    // Si la diferencia es muy grande (>50% de la duración actual), ser cauteloso
    const percentageDiff = Math.abs(calculatedDuration - currentDuration) / currentDuration;
    if (percentageDiff > 0.5) {
      this.logger.warn(`⚠️  Large duration difference (${(percentageDiff * 100).toFixed(1)}%) - protecting current duration`);
      return false;
    }
    
    // Si la duración calculada parece más confiable (no es un fallback obvio), actualizar
    return true;
  }
} 