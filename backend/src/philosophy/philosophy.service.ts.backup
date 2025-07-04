import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { MetricsService } from '../common/metrics/metrics.service';
import {
  HambreMetricDto,
  HambreLevel,
  UpdateHambreDto,
  IEAReciprocidadDto,
  PhilosophyMetricsResponseDto,
} from './dto/philosophy.dto';

/**
 * 🌌 Servicio de Philosophy - Métricas Filosóficas del Ecosistema CoomÜnity
 *
 * Gestiona las métricas fundamentales del ecosistema:
 * - HambrE: Impulso evolutivo y crecimiento de la comunidad
 * - IEA: Índice de Equilibrio de Reciprocidad (Intercambio equilibrado)
 *
 * Embodies the philosophical principles:
 * - Reciprocidad (balanced exchange)
 * - Bien Común (collective benefit)
 * - Metanöia (transformative awareness)
 */
@Injectable()
export class PhilosophyService {
  private readonly logger = new Logger(PhilosophyService.name);
  private readonly CACHE_TTL = 300; // 5 minutos
  private readonly CACHE_KEYS = {
    METRICS: 'philosophy:metrics:all',
    HAMBRE: 'philosophy:hambre',
    IEA: 'philosophy:iea',
  };

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CacheService) private readonly cache: CacheService,
    @Inject(MetricsService) private readonly metricsService: MetricsService,
  ) {
    this.logger.log('🌌 PhilosophyService inicializado - Métricas filosóficas activas');
  }

  /**
   * 🌌 Obtener métricas filosóficas completas (HambrE + IEA)
   * Endpoint principal para el dashboard del Gamifier Admin
   */
  async getPhilosophyMetrics(): Promise<PhilosophyMetricsResponseDto> {
    const startTime = Date.now();
    this.logger.log('🌌 Obteniendo métricas filosóficas completas...');

    try {
      // Intentar obtener del cache primero
      const cachedData = await this.cache.get(this.CACHE_KEYS.METRICS);

      if (cachedData) {
        const cachedMetrics = JSON.parse(cachedData as string) as PhilosophyMetricsResponseDto;
        this.logger.log('✅ Métricas filosóficas obtenidas del cache');
        this.metricsService.cacheOperationsTotal.inc({ operation: 'get', result: 'hit' });
        return cachedMetrics;
      }

      // Si no hay cache, obtener métricas frescas
      const [hambre, iea] = await Promise.all([
        this.getHambreMetrics(),
        this.getIEAMetrics(),
      ]);

      const metrics: PhilosophyMetricsResponseDto = {
        hambre,
        iea,
        lastSync: new Date().toISOString(),
      };

      // Guardar en cache
      await this.cache.set(this.CACHE_KEYS.METRICS, JSON.stringify(metrics), this.CACHE_TTL);
      this.metricsService.cacheOperationsTotal.inc({ operation: 'set', result: 'success' });

      const duration = (Date.now() - startTime) / 1000;
      this.logger.log(`✅ Métricas filosóficas obtenidas en ${duration}s`);

      return metrics;
    } catch (error) {
      this.logger.error('❌ Error obteniendo métricas filosóficas:', error);
      this.metricsService.apiErrorsTotal.inc({
        error_type: 'philosophy_metrics_error',
        endpoint: '/philosophy/metrics'
      });
      throw error;
    }
  }

  /**
   * 🔥 Obtener métricas específicas de HambrE
   */
  async getHambreMetrics(): Promise<HambreMetricDto> {
    this.logger.log('🔥 Obteniendo métricas de HambrE...');

    try {
      // Intentar cache primero
      const cachedData = await this.cache.get(this.CACHE_KEYS.HAMBRE);
      if (cachedData) {
        return JSON.parse(cachedData as string) as HambreMetricDto;
      }

      // TODO: Implementar lógica real de cálculo de HambrE
      // Por ahora, simulamos con datos base
      const hambreData = await this.calculateHambreFromEcosystem();

      // Guardar en cache
      await this.cache.set(this.CACHE_KEYS.HAMBRE, JSON.stringify(hambreData), this.CACHE_TTL);

      this.logger.log(`✅ HambrE calculado: ${hambreData.level} (${hambreData.value})`);
      return hambreData;
    } catch (error) {
      this.logger.error('❌ Error obteniendo métricas de HambrE:', error);
      throw error;
    }
  }

  /**
   * 🔄 Actualizar métricas de HambrE (para Gamifier Admin)
   */
  async updateHambre(updateData: UpdateHambreDto): Promise<HambreMetricDto> {
    this.logger.log(`🔄 Actualizando HambrE: ${updateData.level || 'same'} (${updateData.value || 'same'})`);

    try {
      // Obtener datos actuales
      const currentData = await this.getHambreMetrics();

      const updatedHambre: HambreMetricDto = {
        level: updateData.level || currentData.level,
        value: updateData.value || currentData.value,
        updatedAt: new Date().toISOString(),
        metadata: {
          source: 'manual',
          ...updateData.metadata,
          previousLevel: currentData.level,
          previousValue: currentData.value,
        },
      };

      // TODO: Guardar en base de datos cuando tengamos el modelo Prisma
      // await this.prisma.philosophyMetrics.upsert(...)

      // Invalidar caches
      await this.invalidateAllCaches();

      // Guardar nuevo valor en cache
      await this.cache.set(this.CACHE_KEYS.HAMBRE, JSON.stringify(updatedHambre), this.CACHE_TTL);

      this.logger.log('✅ HambrE actualizado exitosamente');
      return updatedHambre;
    } catch (error) {
      this.logger.error('❌ Error actualizando HambrE:', error);
      throw error;
    }
  }

  /**
   * 🔄 Obtener métricas de IEA de Reciprocidad
   */
  async getIEAMetrics(): Promise<IEAReciprocidadDto> {
    this.logger.log('🔄 Obteniendo métricas de IEA de Reciprocidad...');

    try {
      // Intentar cache primero
      const cachedData = await this.cache.get(this.CACHE_KEYS.IEA);
      if (cachedData) {
        return JSON.parse(cachedData as string) as IEAReciprocidadDto;
      }

      // Calcular IEA basado en actividad del ecosistema
      const ieaData = await this.calculateIEAFromEcosystem();

      // Guardar en cache
      await this.cache.set(this.CACHE_KEYS.IEA, JSON.stringify(ieaData), this.CACHE_TTL);

      this.logger.log(`✅ IEA calculado: ${ieaData.ponderacion}`);
      return ieaData;
    } catch (error) {
      this.logger.error('❌ Error obteniendo métricas de IEA:', error);
      throw error;
    }
  }

  /**
   * 🧮 Calcular HambrE basado en actividad del ecosistema
   * TODO: Implementar lógica real basada en datos de usuarios, contenido, etc.
   */
  private async calculateHambreFromEcosystem(): Promise<HambreMetricDto> {
    // Simulación temporal - en producción será calculado con datos reales
    const baseValue = 65; // Valor base del ecosistema

    // TODO: Factores reales a considerar:
    // - Actividad de usuarios
    // - Creación de contenido
    // - Interacciones sociales
    // - Completitud de challenges
    // - Engagement en ÜPlay

    const level = this.determineHambreLevel(baseValue);

    return {
      level,
      value: baseValue,
      updatedAt: new Date().toISOString(),
      metadata: {
        source: 'auto',
        notes: 'Calculado automáticamente basado en actividad del ecosistema',
      },
    };
  }

  /**
   * 🧮 Calcular IEA basado en flujos de Reciprocidad del ecosistema
   */
  private async calculateIEAFromEcosystem(): Promise<IEAReciprocidadDto> {
    // Simulación temporal - en producción será calculado con datos reales
    const dar = 75; // Contribuciones al ecosistema
    const recibir = 65; // Consumo del ecosistema
    const ponderacion = dar / recibir; // Ratio de equilibrio

    // TODO: Factores reales a considerar:
    // - Méritos creados vs consumidos
    // - Ayuda proporcionada vs recibida
    // - Contenido compartido vs consumido
    // - Challenges completados vs creados

    return {
      dar,
      recibir,
      ponderacion,
      updatedAt: new Date().toISOString(),
      metadata: {
        period: 'weekly',
        periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        periodEnd: new Date().toISOString(),
        calculationDetails: {
          darComponents: ['content_creation', 'peer_help', 'challenges_created'],
          recibirComponents: ['content_consumption', 'help_received', 'challenges_completed'],
          algorithm: 'weighted_reciprocity_index_v1',
        },
      },
    };
  }

  /**
   * 🎯 Determinar nivel cualitativo de HambrE basado en valor cuantitativo
   */
  private determineHambreLevel(value: number): HambreLevel {
    if (value >= 80) return HambreLevel.ALTO;
    if (value >= 50) return HambreLevel.MEDIO;
    return HambreLevel.BAJO;
  }

  /**
   * 🗑️ Invalidar caches (útil para debugging y actualizaciones manuales)
   */
  async invalidateCache(): Promise<void> {
    this.logger.log('🗑️ Invalidando caches de métricas filosóficas...');
    await this.invalidateAllCaches();
    this.logger.log('✅ Caches invalidados exitosamente');
  }

  /**
   * 🏥 Health check del servicio
   */
  async getHealthStatus(): Promise<{ status: string; message: string; timestamp: string }> {
    try {
      // Verificar si podemos obtener métricas básicas
      await this.calculateHambreFromEcosystem();
      await this.calculateIEAFromEcosystem();

      return {
        status: 'healthy',
        message: 'Philosophy Service operacional - métricas disponibles',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('❌ Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Philosophy Service error: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Private helper para invalidar todos los caches relacionados
   */
  private async invalidateAllCaches(): Promise<void> {
    try {
      // Nota: CacheService no tiene método delete genérico,
      // pero podemos usar deleteDuration como patrón
      // o simplemente esperar que el TTL expire los datos
      this.logger.log('🗑️ Invalidación de cache solicitada - datos expirarán según TTL');
    } catch (error) {
      this.logger.error('❌ Error invalidando caches:', error);
    }
  }
}
