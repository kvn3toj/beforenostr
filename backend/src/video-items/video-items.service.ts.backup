import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { MetricsService } from '../common/metrics/metrics.service';
import { VideoPlatform } from '../common/constants/platform.enum';
import {
  VideoQuality,
  VideoMetadata,
} from '../common/interfaces/video-metadata.interface';
import { AbortController } from 'node-abort-controller';
import { CreateVideoItemDto } from './dto/create-video-item.dto';
import { UpdateVideoItemDto } from './dto/update-video-item.dto';

// Minimal interfaces for API responses
interface YouTubeApiResponse {
  items: {
    contentDetails: {
      duration: string;
    };
  }[];
}

interface YouTubeOembedResponse {
  title?: string;
}

interface VimeoApiResponse {
  duration?: number;
  title?: string;
  thumbnail_url?: string;
  tags?: string;
  description?: string;
}

// More specific type for enrichment from YouTube Data API v3
interface YouTubeVideoListResponse {
  items: {
    snippet: {
      title: string;
      description: string;
      tags: string[];
    };
    contentDetails: {
      duration: string;
    };
    statistics: Record<string, unknown>; // Keep it simple for now
  }[];
}

@Injectable()
export class VideoItemsService {
  private readonly logger = new Logger(VideoItemsService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly metricsService: MetricsService
  ) {
    this.logger.log('VideoItemsService initialized');
  }

  private async fetch(
    url: string,
    options: Record<string, unknown> = {}
  ): Promise<any> {
    const { default: fetch } = await import('node-fetch');
    return fetch(url, options);
  }

  /**
   * Encuentra un video item por ID
   */
  async findOne(id: number) {
    //     console.log(`>>> VideoItemsService.findOne: Finding video item with ID: ${id}`);

    const videoItem = await this.prisma.videoItem.findFirst({
      where: { id },
      include: {
        playlist: true,
        questions: {
          include: {
            answerOptions: true,
          },
        },
      },
    });

    if (!videoItem) {
      throw new NotFoundException(`Video item with ID ${id} not found`);
    }

    // Actualizar platform y externalId si están vacíos
    if (!videoItem.platform || !videoItem.externalId) {
      const detectedPlatform = this.detectVideoPlatform(videoItem.content);
      const extractedId = this.extractPlatformId(
        videoItem.content,
        detectedPlatform
      );

      if (detectedPlatform !== VideoPlatform.UNKNOWN) {
        const updatedItem = await this.prisma.videoItem.update({
          where: { id },
          data: {
            platform: detectedPlatform,
            externalId: extractedId,
          },
          include: {
            playlist: true,
            questions: {
              include: {
                answerOptions: true,
              },
            },
          },
        });

        //         console.log(`>>> VideoItemsService.findOne: Updated platform metadata for video ${id}: ${detectedPlatform}`);

        return { ...videoItem, ...updatedItem };
      }
    }

    return videoItem;
  }

  /**
   * Encuentra todos los video items
   */
  async findAll() {
    //     console.log('>>> VideoItemsService.findAll: ENTERING METHOD');
    //       console.log('>>> VideoItemsService.findAll: Finding all video items');
    //       console.log('>>> VideoItemsService.findAll: About to call prisma.videoItem.findMany');

    const result = await this.prisma.videoItem.findMany({
      include: {
        playlist: true,
        questions: {
          include: {
            answerOptions: true,
          },
        },
      },
    });

    //       console.log('>>> VideoItemsService.findAll: Prisma call successful, found', result.length, 'items');
    return result;
  }

  /**
   * Crea un nuevo video item
   */
  async create(data: CreateVideoItemDto) {
    //     console.log('>>> VideoItemsService.create: Creating new video item');

    // Convertir DTO a formato compatible con Prisma
    const createData = {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      platform: data.platform,
      externalId: data.externalId,
      duration: data.duration,
      thumbnailUrl: data.thumbnailUrl,
      itemTypeId: data.itemTypeId,
      tags: data.tags,
      categories: data.categories,
      quality: data.quality,
      // Set playlistId directly as foreign key
      playlistId: data.playlistId
    };

    return this.prisma.videoItem.create({
      data: createData,
    });
  }

  /**
   * Actualiza un video item
   */
  async update(id: number, data: UpdateVideoItemDto) {
    //     console.log(`>>> VideoItemsService.update: Updating video item with ID: ${id}`);

    // Convertir DTO a formato compatible con Prisma
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.platform !== undefined) updateData.platform = data.platform;
    if (data.externalId !== undefined) updateData.externalId = data.externalId;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
    if (data.itemTypeId !== undefined) updateData.itemTypeId = data.itemTypeId;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.categories !== undefined) updateData.categories = data.categories;
    if (data.quality !== undefined) updateData.quality = data.quality;

    // Set playlistId directly as foreign key if present
    if (data.playlistId !== undefined) {
      updateData.playlistId = data.playlistId;
    }

    return this.prisma.videoItem.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Elimina un video item
   */
  async remove(id: number) {
    //     console.log(`>>> VideoItemsService.remove: Removing video item with ID: ${id}`);

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

    if (
      contentLower.includes('youtube.com') ||
      contentLower.includes('youtu.be')
    ) {
      return VideoPlatform.YOUTUBE;
    }

    if (contentLower.includes('vimeo.com')) {
      return VideoPlatform.VIMEO;
    }

    if (
      contentLower.includes('localhost') ||
      contentLower.includes('gamifier')
    ) {
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
    const patterns = [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/];

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
    this.logger.log(
      `Starting video duration calculation for content: ${content.substring(0, 100)}...`
    );

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
          // if (duration) {
          //   this.metricsService.incrementVideoDurationMethods('estimation', true);
          // }
          break;

        case VideoPlatform.VIMEO:
          duration = await this.getVimeoDuration(content);
          // if (duration) {
          //   this.metricsService.incrementVideoDurationMethods('estimation', true);
          // }
          break;

        default:
          // this.logger.warn(`Unknown platform for content: ${content}`);
          break;
      }

      // Fallback a estimación
      if (!duration || duration <= 0) {
        duration = this.getEstimatedDuration(content);
        // this.metricsService.incrementVideoDurationMethods('estimation', true);
        // this.logger.log(`Using estimated duration: ${duration}s`);
      }

      // Cachear resultado
      // if (duration > 0) {
      //   await this.cacheService.setDuration(content, duration);
      //   this.metricsService.incrementCacheOperations('set', 'success');
      // }

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // this.logger.logVideoCalculation(
      //   content,
      //   duration,
      //   platform,
      //   executionTime
      // );

      return duration;
    } catch (error) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // this.metricsService.incrementApiErrors('video_duration', 'calculate_duration');

      // this.logger.logVideoCalculation(
      //   content,
      //   -1,
      //   VideoPlatform.UNKNOWN,
      //   executionTime,
      //   error
      // );

      const fallbackDuration = this.getEstimatedDuration(content);
      // this.logger.warn(`Error calculating duration, using fallback: ${fallbackDuration}s`);
      return fallbackDuration;
    }
  }

  /**
   * Obtiene duración de YouTube
   */
  private async getYouTubeDuration(content: string): Promise<number | null> {
    const videoId = this.extractYouTubeVideoId(content);
    if (!videoId) {
      this.logger.warn(`Could not extract YouTube video ID from: ${content}`);
      return null;
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      this.logger.error('YOUTUBE_API_KEY not found in environment variables.');
      // Fallback to oEmbed
      try {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await this.fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
          this.logger.error(
            `YouTube oEmbed API request failed with status ${response.status} for video ID: ${videoId}`
          );
          return null;
        }
        const data = (await response.json()) as YouTubeOembedResponse;
        if (data && data.title) {
          return this.extractDurationFromTitle(data.title);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          this.logger.error('YouTube oEmbed API request timed out.');
        } else {
          this.logger.error(
            `Error fetching from YouTube oEmbed API: ${error.message}`
          );
        }
        return null;
      }
      return null;
    }

    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await this.fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        this.logger.error(
          `YouTube Data API request failed with status ${response.status} for video ID: ${videoId}`
        );
        return null;
      }
      const data = (await response.json()) as YouTubeApiResponse;
      if (data && data.items && data.items.length > 0) {
        const duration = this.parseISO8601Duration(
          data.items[0].contentDetails.duration
        );
        return duration;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logger.error('YouTube Data API request timed out.');
      } else {
        this.logger.error(
          `Error fetching from YouTube Data API: ${error.message}`
        );
      }
      return null;
    }

    return null;
  }

  /**
   * Obtiene duración de Vimeo
   */
  private async getVimeoDuration(content: string): Promise<number | null> {
    const videoId = this.extractVimeoVideoId(content);
    if (!videoId) {
      this.logger.warn(`Could not extract Vimeo video ID from: ${content}`);
      return null;
    }

    try {
      const url = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await this.fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        this.logger.error(
          `Vimeo API request failed with status ${response.status} for video ID: ${videoId}`
        );
        return null;
      }
      const data = (await response.json()) as VimeoApiResponse;
      if (data && data.duration) {
        return data.duration;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logger.error('Vimeo API request timed out.');
      } else {
        this.logger.error(`Error fetching from Vimeo API: ${error.message}`);
      }
      return null;
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
        EEZkQv25uEs: 729, // Sacred Economics with Charles Eisenstein - A Short Film
        ScMzIvxBSi4: 94, // Elementos de Juego en Educación
        ZXsQAXx_ao0: 64, // Narrativa y Storytelling
        '9bZkp7q19f0': 252, // Mecánicas de Recompensa
        kJQP7kiw5Fk: 282, // Evaluación Gamificada
        dQw4w9WgXcQ: 212, // Rick Roll - 3:32 (video de prueba común)
        // Agregar más videos conocidos aquí según sea necesario
      };

      if (knownDurations[videoId]) {
        this.logger.log(
          `✅ Using known duration for video ${videoId}: ${knownDurations[videoId]}s`
        );
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
        if (duration > 0 && duration < 36000) {
          // Máximo 10 horas
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
        const duration = parseInt(match[1], 10) * multiplier;
        if (duration > 0 && duration < 36000) {
          // Máximo 10 horas
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

    if (
      titleLower.includes('tutorial') ||
      titleLower.includes('how to') ||
      titleLower.includes('cómo')
    ) {
      this.logger.log(`📚 Tutorial detected: 600s`);
      return 600; // 10 minutos
    }

    if (
      titleLower.includes('podcast') ||
      titleLower.includes('interview') ||
      titleLower.includes('entrevista')
    ) {
      this.logger.log(`🎙️ Podcast/Interview detected: 2400s`);
      return 2400; // 40 minutos
    }

    if (
      titleLower.includes('live') ||
      titleLower.includes('stream') ||
      titleLower.includes('en vivo')
    ) {
      this.logger.log(`📺 Live stream detected: 3600s`);
      return 3600; // 1 hora
    }

    if (
      titleLower.includes('full movie') ||
      titleLower.includes('película completa') ||
      titleLower.includes('film')
    ) {
      this.logger.log(`🎞️ Full movie detected: 6000s`);
      return 6000; // 100 minutos
    }

    // TED talks tienen típicamente 18 minutos
    if (titleLower.includes('ted') || titleLower.includes('tedx')) {
      this.logger.log(`🎤 TED talk detected: 1080s`);
      return 1080; // 18 minutos
    }

    // 🎯 PRIORIDAD 5: Estimaciones específicas por palabras clave de gamificación
    if (
      titleLower.includes('gamificación') ||
      titleLower.includes('gamification')
    ) {
      this.logger.log(`🎮 Gamification content detected: 720s`);
      return 720; // 12 minutos (contenido educativo de gamificación)
    }

    if (
      titleLower.includes('elementos de juego') ||
      titleLower.includes('game elements')
    ) {
      this.logger.log(`🎯 Game elements content detected: 480s`);
      return 480; // 8 minutos
    }

    if (
      titleLower.includes('narrativa') ||
      titleLower.includes('storytelling')
    ) {
      this.logger.log(`📖 Storytelling content detected: 360s`);
      return 360; // 6 minutos
    }

    if (
      titleLower.includes('mecánica') ||
      titleLower.includes('recompensa') ||
      titleLower.includes('reward')
    ) {
      this.logger.log(`🏆 Mechanics/Reward content detected: 420s`);
      return 420; // 7 minutos
    }

    if (
      titleLower.includes('evaluación') ||
      titleLower.includes('assessment')
    ) {
      this.logger.log(`📊 Assessment content detected: 360s`);
      return 360; // 6 minutos
    }

    // 🎯 PRIORIDAD 6: Estimaciones por palabras clave educativas
    if (
      titleLower.includes('curso') ||
      titleLower.includes('course') ||
      titleLower.includes('clase') ||
      titleLower.includes('lesson')
    ) {
      this.logger.log(`🎓 Educational course content: 900s`);
      return 900; // 15 minutos
    }

    if (
      titleLower.includes('introducción') ||
      titleLower.includes('introduction') ||
      titleLower.includes('intro')
    ) {
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
    // this.logger.log(`Extracting video metadata for content: ${content.substring(0, 100)}...`);
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
      // this.logger.error(`Error extracting video metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return metadata;
  }

  /**
   * Enriquece metadatos de YouTube
   */
  private async enrichYouTubeMetadata(
    metadata: VideoMetadata,
    videoId: string
  ): Promise<void> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'YOUTUBE_API_KEY not found. Skipping metadata enrichment for YouTube.'
      );
      return;
    }

    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await this.fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        this.logger.error(
          `YouTube metadata request failed with status ${response.status} for video ID: ${videoId}`
        );
        return;
      }
      const data = (await response.json()) as YouTubeVideoListResponse;
      if (data && data.items && data.items.length > 0) {
        const videoData = data.items[0];
        metadata.title = videoData.snippet.title;
        metadata.description = videoData.snippet.description;
        metadata.duration = this.parseISO8601Duration(
          videoData.contentDetails.duration
        );
        metadata.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        metadata.tags = videoData.snippet.tags || [];
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logger.error('YouTube metadata enrichment request timed out.');
      } else {
        this.logger.error(`Error enriching YouTube metadata: ${error.message}`);
      }
    }
  }

  /**
   * Enriquece metadatos de Vimeo
   */
  private async enrichVimeoMetadata(
    metadata: VideoMetadata,
    videoId: string
  ): Promise<void> {
    try {
      const url = `https://vimeo.com/api/v2/video/${videoId}.json`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await this.fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        this.logger.error(
          `Vimeo metadata request failed with status ${response.status} for video ID: ${videoId}`
        );
        return;
      }
      const data = (await response.json()) as VimeoApiResponse[];
      if (data && data.length > 0) {
        const videoData = data[0];
        metadata.title = videoData.title;
        metadata.description = videoData.description;
        metadata.duration = videoData.duration;
        metadata.thumbnailUrl = videoData.thumbnail_url;
        metadata.tags = videoData.tags ? videoData.tags.split(', ') : [];
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logger.error('Vimeo metadata enrichment request timed out.');
      } else {
        this.logger.error(`Error enriching Vimeo metadata: ${error.message}`);
      }
    }
  }

  /**
   * Actualiza metadatos de un video existente
   */
  async updateVideoMetadata(
    id: number
  ): Promise<{ metadata: VideoMetadata; [key: string]: any }> {
    // this.logger.log(`Updating metadata for video item ${id}`);
    const videoItem = await this.prisma.videoItem.findUnique({ where: { id } });

    if (!videoItem.content) {
      throw new Error(
        `Video item ${id} has no content to extract metadata from`
      );
    }

    const metadata = await this.extractVideoMetadata(videoItem.content);

    const updateData: Partial<UpdateVideoItemDto> = {};

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

      this.logger.log(
        `Updated metadata for video item ${id} - fields: ${Object.keys(updateData).join(', ')}`
      );

      return { ...updatedItem, metadata };
    } else {
      this.logger.log(`No metadata updates needed for video item ${id}`);

      return { ...videoItem, metadata };
    }
  }

  /**
   * Recalcula las duraciones de todos los videos que tienen duration: null
   */
  async recalculateAllDurations(): Promise<{
    updated: number;
    errors: number;
    results: {
      id: number;
      title: string;
      duration?: number;
      status: string;
      error?: string;
    }[];
  }> {
    // this.logger.log('Starting bulk duration recalculation for videos with null duration');
    const videosWithNullDuration = await this.prisma.videoItem.findMany({
      where: {
        duration: null,
      },
      select: {
        id: true,
        content: true,
        title: true,
      },
    });

    // this.logger.log(`Found ${videosWithNullDuration.length} videos with null duration`);
    let updated = 0;
    let errors = 0;
    const results: {
      id: number;
      title: string;
      duration?: number;
      status: string;
      error?: string;
    }[] = [];

    for (const video of videosWithNullDuration) {
      try {
        // this.logger.log(`Processing video ${video.id}: ${video.title}`);
        const duration = await this.calculateVideoDuration(video.content);

        if (duration && duration > 0) {
          await this.prisma.videoItem.update({
            where: { id: video.id },
            data: { duration },
          });

          updated++;
          results.push({
            id: video.id,
            title: video.title,
            duration,
            status: 'updated',
          });

          this.logger.log(
            `Successfully updated duration for video ${video.id}: ${duration}s`
          );
        } else {
          errors++;
          results.push({
            id: video.id,
            title: video.title,
            status: 'error',
            error: 'Could not calculate duration',
          });

          this.logger.warn(
            `Could not calculate duration for video ${video.id}`
          );
        }
      } catch (error) {
        errors++;
        results.push({
          id: video.id,
          title: video.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        this.logger.error(
          `Error processing video ${video.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // this.logger.log(`Bulk duration recalculation completed - Total: ${videosWithNullDuration.length}, Updated: ${updated}, Errors: ${errors}`);
    return { updated, errors, results };
  }

  /**
   * FUERZA la recalculación de duraciones de TODOS los videos, incluso los que ya tienen duration
   * ⚠️  VERSIÓN MEJORADA CON PROTECCIÓN DE DATOS
   */
  async forceRecalculateAllDurations(): Promise<{
    total: number;
    updated: number;
    errors: number;
    verified: number;
    protectedCount: number;
    results: {
      id: number;
      title: string;
      status: string;
      duration?: number;
      message?: string;
      oldDuration?: number;
      newDuration?: number;
      change?: number;
      calculatedDuration?: number;
      currentDuration?: number;
      error?: string;
    }[];
  }> {
    // this.logger.log('🔄 Starting FORCE bulk duration recalculation for ALL videos (WITH DATA PROTECTION)');

    const allVideos = await this.prisma.videoItem.findMany({
      select: {
        id: true,
        content: true,
        title: true,
        duration: true, // Incluir duración actual para comparación
        tags: true,
      },
    });

    // this.logger.log(`📊 Found ${allVideos.length} total videos to recalculate`);

    let updated = 0;
    let errors = 0;
    let verified = 0; // Videos que ya tenían la duración correcta
    let protectedCount = 0; // Videos protegidos de sobrescritura destructiva
    const results: {
      id: number;
      title: string;
      status: string;
      duration?: number;
      message?: string;
      oldDuration?: number;
      newDuration?: number;
      change?: number;
      calculatedDuration?: number;
      currentDuration?: number;
      error?: string;
    }[] = [];

    // 🛡️ LISTA DE DURACIONES CONOCIDAS Y VERIFICADAS MANUALMENTE
    const manuallyVerifiedDurations: Record<number, number> = {
      39: 729, // Introducción a la Gamificación (12:09)
      40: 94, // Elementos de Juego en Educación (1:34)
      41: 64, // Narrativa y Storytelling (1:04)
      42: 252, // Mecánicas de Recompensa (4:12)
      43: 282, // Evaluación Gamificada (4:42)
    };

    for (const video of allVideos) {
      try {
        // this.logger.log(`🔍 Processing video ${video.id}: ${video.title}`);

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
              message: 'Manually verified duration - protected from overwrite',
            });

            this.logger.log(
              `🛡️  PROTECTED video ${video.id}: ${verifiedDuration}s (manually verified)`
            );
            continue;
          } else {
            // La duración no coincide con la verificada manualmente - restaurar
            await this.prisma.videoItem.update({
              where: { id: video.id },
              data: { duration: verifiedDuration },
            });

            updated++;
            results.push({
              id: video.id,
              title: video.title,
              oldDuration: video.duration,
              newDuration: verifiedDuration,
              status: 'restored',
              message: 'Restored to manually verified duration',
              change: verifiedDuration - (video.duration || 0),
            });

            this.logger.log(
              `🔧 RESTORED video ${video.id}: ${video.duration}s → ${verifiedDuration}s (manually verified)`
            );
            continue;
          }
        }

        // Para videos no verificados manualmente, proceder con cálculo normal
        const calculatedDuration = await this.calculateVideoDuration(
          video.content
        );

        if (calculatedDuration > 0) {
          // 🛡️ PROTECCIÓN ADICIONAL: No sobrescribir si la diferencia es mínima (±10s)
          if (
            video.duration &&
            Math.abs(video.duration - calculatedDuration) <= 10
          ) {
            verified++;
            results.push({
              id: video.id,
              title: video.title,
              duration: video.duration,
              calculatedDuration,
              status: 'verified',
              message: `Duration within acceptable range (±10s) - no change needed`,
            });

            this.logger.log(
              `✅ VERIFIED video ${video.id}: ${video.duration}s (calculated: ${calculatedDuration}s, diff: ${Math.abs(video.duration - calculatedDuration)}s)`
            );
            continue;
          }

          // Comparar con la duración actual
          if (video.duration !== calculatedDuration) {
            // 🛡️ PROTECCIÓN: Solo actualizar si la nueva duración parece más confiable
            const shouldUpdate = this.shouldUpdateDuration(
              video.duration,
              calculatedDuration,
              video.title || ''
            );

            if (shouldUpdate) {
              await this.prisma.videoItem.update({
                where: { id: video.id },
                data: { duration: calculatedDuration },
              });

              updated++;
              results.push({
                id: video.id,
                title: video.title,
                oldDuration: video.duration,
                newDuration: calculatedDuration,
                status: 'updated',
                change: calculatedDuration - (video.duration || 0),
              });

              this.logger.log(
                `✅ UPDATED duration for video ${video.id}: ${video.duration}s → ${calculatedDuration}s`
              );
            } else {
              protectedCount++;
              results.push({
                id: video.id,
                title: video.title,
                currentDuration: video.duration,
                calculatedDuration,
                status: 'protected',
                message:
                  'Current duration seems more reliable - protected from overwrite',
              });

              this.logger.log(
                `🛡️  PROTECTED video ${video.id}: keeping ${video.duration}s (calculated: ${calculatedDuration}s deemed less reliable)`
              );
            }
          } else {
            // La duración ya era correcta
            verified++;
            results.push({
              id: video.id,
              title: video.title,
              duration: calculatedDuration,
              status: 'verified',
              message: 'Duration already correct',
            });

            this.logger.log(
              `✅ VERIFIED duration for video ${video.id}: ${calculatedDuration}s (no change needed)`
            );
          }
        } else {
          errors++;
          results.push({
            id: video.id,
            title: video.title,
            currentDuration: video.duration,
            status: 'error',
            error: 'Could not calculate duration',
          });

          this.logger.warn(
            `❌ Could not calculate duration for video ${video.id}`
          );
        }
      } catch (error) {
        errors++;
        results.push({
          id: video.id,
          title: video.title,
          currentDuration: video.duration,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        this.logger.error(
          `❌ Error processing video ${video.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }

      // Pequeña pausa para no sobrecargar el sistema
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    this.logger.log(
      `🎉 FORCE bulk duration recalculation completed (WITH PROTECTION):`
    );
    this.logger.log(`   📊 Total videos processed: ${allVideos.length}`);
    this.logger.log(`   ✅ Updated: ${updated}`);
    this.logger.log(`   ✅ Verified (already correct): ${verified}`);
    this.logger.log(`   🛡️  Protected (from overwrite): ${protectedCount}`);
    this.logger.log(`   ❌ Errors: ${errors}`);

    return {
      total: allVideos.length,
      updated,
      errors,
      verified,
      protectedCount,
      results,
    };
  }

  /**
   * 🛡️ Determina si una duración debe ser actualizada basándose en criterios de confiabilidad
   */
  private shouldUpdateDuration(
    currentDuration: number | null,
    calculatedDuration: number,
    title: string
  ): boolean {
    if (!currentDuration || currentDuration <= 0) return true; // Siempre actualizar si no hay duración o es inválida

    // Proteger si la duración calculada es un fallback genérico
    if (calculatedDuration === 300) {
      // this.logger.warn(`⚠️  Calculated duration is generic fallback (300s) - protecting current duration ${currentDuration}s`);
      return false;
    }

    if (calculatedDuration === 480) {
      // Smart fallback
      // Permitir actualización si la duración actual es un valor por defecto conocido y probablemente incorrecto
      if ([300, 600, 900].includes(currentDuration)) {
        // this.logger.log(`⚠️  Current duration seems incorrect (${currentDuration}s), accepting new fallback (480s)`);
        return true;
      }
      // this.logger.warn(`⚠️  Calculated duration is fallback (480s) - protecting current duration ${currentDuration}s`);
      return false;
    }

    const percentageDiff = Math.abs(
      (currentDuration - calculatedDuration) / currentDuration
    );
    if (percentageDiff > 0.5) {
      // Si la diferencia es mayor al 50%
      // this.logger.warn(`⚠️  Large duration difference (${(percentageDiff * 100).toFixed(1)}%) - protecting current duration`);
      return false;
    }

    return true; // En otros casos, actualizar
  }

  /**
   * Encuentra todas las preguntas asociadas a un video específico
   * Incluye las opciones de respuesta para cada pregunta
   * @param videoId Puede ser el ID numérico del sistema o el externalId (YouTube ID)
   */
  async findQuestionsByVideoId(videoId: string) {
    this.logger.log(`Finding questions for video ID: ${videoId}`);
    const videoNumericId = parseInt(videoId, 10);
    if (isNaN(videoNumericId)) {
      throw new NotFoundException(`Invalid video ID format: ${videoId}`);
    }

    const videoItem = await this.prisma.videoItem.findUnique({
      where: { id: videoNumericId },
      include: {
        questions: {
          include: {
            answerOptions: true,
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });

    if (!videoItem) {
      this.logger.warn(`Video item with ID ${videoNumericId} not found.`);
      throw new NotFoundException(
        `Video item with ID ${videoNumericId} not found`
      );
    }

    this.logger.log(
      `Found ${videoItem.questions.length} questions for video ID: ${videoNumericId}`
    );
    return videoItem.questions;
  }
}
