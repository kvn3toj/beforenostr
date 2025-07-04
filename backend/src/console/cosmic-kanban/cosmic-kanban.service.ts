/**
 * 🌌 Cosmic Kanban Service
 * Servicio para la gestión del Portal Kanban Cósmico
 * Implementa los principios del Ayni y la custodia del Bien Común
 */

import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../cache/cache.service';
import {
  CreateCosmicTaskDto,
  ThematicElement,
  GuardianRole,
  ColumnStatus,
  TaskPriority,
  PhilosophicalKpi,
} from './dto/create-cosmic-task.dto';
import { UpdateCosmicTaskDto } from './dto/update-cosmic-task.dto';
import { CosmicTaskResponseDto } from './dto/cosmic-task.response.dto';
import { Challenge } from '../../generated/prisma';

export interface CosmicTaskFilter {
  guardian?: string;
  element?: string;
  status?: string;
  phase?: number;
}

interface ModuleStatus {
  modules: Record<string, number>;
  [key: string]: unknown;
}

interface IntegrationStatus {
  status: Record<string, number>;
  [key: string]: unknown;
}

interface InfrastructureStatus {
  recommendations: string[];
  [key: string]: unknown;
}

@Injectable()
export class CosmicKanbanService {
  // Propiedad para almacenar el ID del intervalo de sincronización automática
  private autoSyncInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CacheService) private readonly cache: CacheService
  ) {}

  /**
   * 🌟 Manifestar nueva tarea cósmica
   * Crear un high-value meme siguiendo los principios del Ayni
   */
  async createTask(
    createTaskDto: CreateCosmicTaskDto
  ): Promise<CosmicTaskResponseDto> {
    try {
      // Por ahora, usaremos el modelo Challenge como base
      // TODO: Crear modelo CosmicTask específico en el futuro
      const cosmicTask = await this.prisma.challenge.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          type: 'COSMIC_TASK',
          status: createTaskDto.status,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días por defecto
          config: JSON.stringify({
            element: createTaskDto.element,
            guardian: createTaskDto.guardian,
            hambreLevel: createTaskDto.hambreLevel,
            priority: createTaskDto.priority,
            phase: createTaskDto.phase,
            estimatedHours: createTaskDto.estimatedHours,
            philosophicalKpi: createTaskDto.philosophicalKpi,
            tags: createTaskDto.tags,
            assignee: createTaskDto.assignee,
            actualHours: createTaskDto.actualHours,
            completionDate: createTaskDto.completionDate,
            metadata: createTaskDto.metadata,
          }),
        },
      });

      // Invalidar caché
      await this.invalidateCosmicCache();

      return this.mapToResponseDto(cosmicTask);
    } catch (error) {
      throw new Error(`Error al crear tarea cósmica: ${error.message}`);
    }
  }

  /**
   * 🔍 Acceder a la sabiduría del Portal Kanban Cósmico
   * Obtener todas las tareas con filtros opcionales
   */
  async getAllTasks(
    filters: CosmicTaskFilter = {}
  ): Promise<CosmicTaskResponseDto[]> {
    try {
      const cacheKey = `cosmic:tasks:${JSON.stringify(filters)}`;
      const cached = await this.cache.get(cacheKey);
      if (cached && typeof cached === 'string') {
        return JSON.parse(cached);
      }

      // Primero obtener todas las tareas COSMIC_TASK sin filtros adicionales
      const cosmicTasks = await this.prisma.challenge.findMany({
        where: {
          type: 'COSMIC_TASK',
        },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      });

      // Aplicar filtros de status después si es necesario
      let filteredByStatus = cosmicTasks;
      if (filters.status) {
        filteredByStatus = cosmicTasks.filter(
          (task) => task.status === filters.status
        );
      }

      // Filtros adicionales basados en config
      let filteredTasks = filteredByStatus;
      if (filters.guardian || filters.element || filters.phase) {
        filteredTasks = filteredByStatus.filter((task) => {
          const config = JSON.parse(task.config || '{}');

          if (filters.guardian && config.guardian !== filters.guardian)
            return false;
          if (filters.element && config.element !== filters.element)
            return false;
          if (filters.phase && config.phase !== filters.phase) return false;

          return true;
        });
      }

      const result = filteredTasks.map((task) => this.mapToResponseDto(task));

      // Cachear por 5 minutos
      await this.cache.set(cacheKey, JSON.stringify(result), 300);

      return result;
    } catch (error) {
      throw new Error(`Error al obtener tareas cósmicas: ${error.message}`);
    }
  }

  /**
   * 🎯 Contemplar tarea cósmica específica
   */
  async getTaskById(id: string): Promise<CosmicTaskResponseDto> {
    try {
      const cosmicTask = await this.prisma.challenge.findUnique({
        where: {
          id,
          type: 'COSMIC_TASK',
        },
      });

      if (!cosmicTask) {
        throw new NotFoundException(
          'Tarea cósmica no encontrada en el Portal Kanban'
        );
      }

      return this.mapToResponseDto(cosmicTask);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener tarea cósmica: ${error.message}`);
    }
  }

  /**
   * 🔄 Evolucionar tarea cósmica
   * Actualizar siguiendo los principios de la Metanöia
   */
  async updateTask(
    id: string,
    updateTaskDto: UpdateCosmicTaskDto
  ): Promise<CosmicTaskResponseDto> {
    try {
      const existingTask = await this.prisma.challenge.findUnique({
        where: {
          id,
          type: 'COSMIC_TASK',
        },
      });

      if (!existingTask) {
        throw new NotFoundException(
          'Tarea cósmica no encontrada para evolución'
        );
      }

      const existingConfig = JSON.parse(existingTask.config || '{}');
      const updatedConfig = { ...existingConfig };

      // Actualizar campos en config si están presentes en el DTO
      Object.keys(updateTaskDto).forEach((key) => {
        if (
          updateTaskDto[key] !== undefined &&
          key !== 'title' &&
          key !== 'description' &&
          key !== 'status'
        ) {
          updatedConfig[key] = updateTaskDto[key];
        }
      });

      const updatedTask = await this.prisma.challenge.update({
        where: { id },
        data: {
          ...(updateTaskDto.title && { title: updateTaskDto.title }),
          ...(updateTaskDto.description && {
            description: updateTaskDto.description,
          }),
          ...(updateTaskDto.status && { status: updateTaskDto.status }),
          config: JSON.stringify(updatedConfig),
        },
      });

      // Invalidar caché
      await this.invalidateCosmicCache();

      return this.mapToResponseDto(updatedTask);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar tarea cósmica: ${error.message}`);
    }
  }

  /**
   * 🔥 Transmutación cósmica
   * Eliminar tarea del Portal Kanban
   */
  async deleteTask(id: string): Promise<void> {
    try {
      const existingTask = await this.prisma.challenge.findUnique({
        where: {
          id,
          type: 'COSMIC_TASK',
        },
      });

      if (!existingTask) {
        throw new NotFoundException(
          'Tarea cósmica no encontrada para transmutación'
        );
      }

      await this.prisma.challenge.delete({
        where: { id },
      });

      // Invalidar caché
      await this.invalidateCosmicCache();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar tarea cósmica: ${error.message}`);
    }
  }

  /**
   * 🗑️ Invalidar caché de tareas cósmicas
   * Limpiar todas las entradas relacionadas
   */
  private async invalidateCosmicCache(): Promise<void> {
    try {
      // Invalidar caché de estadísticas usando el patrón del CacheService
      if (this.cache && typeof this.cache['client'] !== 'undefined') {
        // Acceso al cliente Redis interno del CacheService - SAGE purification: tipo específico para Redis
        const redisClient = (
          this.cache as unknown as {
            client?: {
              isReady: boolean;
              del: (key: string | string[]) => Promise<number>;
              keys: (pattern: string) => Promise<string[]>;
            };
          }
        ).client;
        if (redisClient?.isReady) {
          await redisClient.del('cosmic:stats');

          // Buscar y eliminar todas las claves de filtros de tareas cósmicas
          const cosmicKeys = await redisClient.keys('cosmic:tasks:*');
          if (cosmicKeys.length > 0) {
            await redisClient.del(cosmicKeys);
          }
        }
      }

      // TODO: Invalidar todas las combinaciones de filtros de manera más eficiente
      // Por ahora, simple invalidación. En el futuro se puede optimizar
      // guardando las claves de filtros usadas.
    } catch (error) {
      console.warn('⚠️ Error al invalidar caché cósmico:', error.message);
    }
  }

  /**
   * 📊 Métricas del Portal Kanban Cósmico
   * Estadísticas de manifestación por Guardián y Elemento
   */
  async getCosmicStats() {
    try {
      const cacheKey = 'cosmic:stats';
      const cached = await this.cache.get(cacheKey);
      if (cached && typeof cached === 'string') {
        return JSON.parse(cached);
      }

      const allTasks = await this.prisma.challenge.findMany({
        where: { type: 'COSMIC_TASK' },
      });

      const stats = {
        total: allTasks.length,
        byGuardian: {} as Record<string, number>,
        byElement: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
        byPhase: {} as Record<number, number>,
        totalEstimatedHours: 0,
        totalActualHours: 0,
      };

      allTasks.forEach((task) => {
        const config = JSON.parse(task.config || '{}');

        // Estadísticas por Guardián
        if (config.guardian) {
          stats.byGuardian[config.guardian] =
            (stats.byGuardian[config.guardian] || 0) + 1;
        }

        // Estadísticas por Elemento
        if (config.element) {
          stats.byElement[config.element] =
            (stats.byElement[config.element] || 0) + 1;
        }

        // Estadísticas por Estado
        stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;

        // Estadísticas por Fase
        if (config.phase) {
          stats.byPhase[config.phase] = (stats.byPhase[config.phase] || 0) + 1;
        }

        // Horas totales
        if (config.estimatedHours) {
          stats.totalEstimatedHours += config.estimatedHours;
        }
        if (config.actualHours) {
          stats.totalActualHours += config.actualHours;
        }
      });

      // Cachear por 10 minutos
      await this.cache.set(cacheKey, JSON.stringify(stats), 600);

      return stats;
    } catch (error) {
      throw new Error(
        `Error al obtener estadísticas cósmicas: ${error.message}`
      );
    }
  }

  /**
   * 🔍 DEBUG: Ver todas las challenges en la BD
   */
  async debugAllChallenges() {
    try {
      const allChallenges = await this.prisma.challenge.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return {
        count: allChallenges.length,
        challenges: allChallenges,
      };
    } catch (error) {
      throw new Error(`Error en debug: ${error.message}`);
    }
  }

  /**
   * 📊 Obtener estado actual del proyecto CoomÜnity
   * Recopila información sobre el estado de desarrollo de SuperApp y Gamifier
   */
  async getProjectStatus() {
    try {
      const cacheKey = 'cosmic:project-status';
      const cached = await this.cache.get(cacheKey);
      if (cached && typeof cached === 'string') {
        return JSON.parse(cached);
      }

      // Obtener estadísticas generales del proyecto
      const moduleStatus = await this.getModuleCompletionStatus();
      const integrationStatus = await this.getIntegrationStatus();
      const pendingTasks = await this.getPendingTasksCount();

      // Construir el objeto de estado del proyecto
      const projectStatus = {
        lastUpdated: new Date(),
        superApp: {
          completionPercentage: 95,
          modules: moduleStatus.superApp,
          pendingTasks: pendingTasks.superApp,
          nextMilestone: 'Integración completa con Backend NestJS',
        },
        gamifierAdmin: {
          completionPercentage: 100,
          modules: moduleStatus.gamifierAdmin,
          pendingTasks: pendingTasks.gamifierAdmin,
          nextMilestone: 'Mejoras UX en Portal Kanban Cósmico',
        },
        backend: {
          completionPercentage: 100,
          modules: moduleStatus.backend,
          pendingTasks: pendingTasks.backend,
          nextMilestone: 'Optimización de endpoints para alta concurrencia',
        },
        integration: {
          status: integrationStatus,
          completionPercentage: 90,
          nextSteps:
            'Finalizar integración de módulos SuperApp con Backend NestJS',
        },
        infrastructure: {
          status: 'Estable',
          recommendations: [
            'Implementar monitoreo avanzado con Prometheus',
            'Configurar alertas para endpoints críticos',
            'Optimizar caché Redis para consultas frecuentes',
          ],
        },
      };

      // Cachear por 30 minutos
      await this.cache.set(cacheKey, JSON.stringify(projectStatus), 1800);

      return projectStatus;
    } catch (error) {
      throw new Error(`Error al obtener estado del proyecto: ${error.message}`);
    }
  }

  /**
   * 🔄 Sincronizar estado del proyecto y crear tareas
   * Analiza el estado actual y crea tareas cósmicas automáticamente
   */
  async syncProjectStatus() {
    try {
      // Obtener estado actual del proyecto
      const projectStatus = await this.getProjectStatus();

      // Identificar módulos pendientes y crear tareas correspondientes
      const createdTasks = [];

      // Crear tareas para SuperApp
      if (projectStatus.superApp.completionPercentage < 100) {
        const superAppTasks = await this.generateTasksForSuperApp(
          projectStatus.superApp
        );
        createdTasks.push(...superAppTasks);
      }

      // Crear tareas para integración
      if (projectStatus.integration.completionPercentage < 100) {
        const integrationTasks = await this.generateTasksForIntegration(
          projectStatus.integration
        );
        createdTasks.push(...integrationTasks);
      }

      // Crear tareas para infraestructura
      const infrastructureTasks = await this.generateTasksForInfrastructure(
        projectStatus.infrastructure
      );
      createdTasks.push(...infrastructureTasks);

      // Invalidar caché
      await this.invalidateCosmicCache();

      return {
        syncedAt: new Date(),
        tasksCreated: createdTasks.length,
        tasks: createdTasks,
      };
    } catch (error) {
      throw new Error(
        `Error al sincronizar estado del proyecto: ${error.message}`
      );
    }
  }

  /**
   * 📋 Obtener estado de completitud de módulos
   */
  private async getModuleCompletionStatus() {
    // En una implementación real, esto podría consultar una base de datos
    // o analizar el código fuente para determinar el estado de los módulos
    return {
      superApp: {
        'UPlay (GPL)': 95,
        'Marketplace (GMP)': 90,
        Social: 98,
        UStats: 92,
        Wallet: 95,
      },
      gamifierAdmin: {
        'Consola de Experiencias': 100,
        Desafíos: 100,
        'Marketplace Admin': 100,
        'Portal Kanban Cósmico': 100,
      },
      backend: {
        Auth: 100,
        Users: 100,
        Challenges: 100,
        Merits: 100,
        Marketplace: 100,
        Social: 100,
        Analytics: 100,
      },
    };
  }

  /**
   * 🔌 Obtener estado de integración
   */
  private async getIntegrationStatus() {
    // En una implementación real, esto podría verificar la conectividad
    // entre los diferentes componentes del sistema
    return {
      'SuperApp → Backend NestJS': 90,
      'GamifierAdmin → Backend NestJS': 100,
      'Auth Flow': 100,
      'API Consistency': 95,
    };
  }

  /**
   * 📝 Obtener conteo de tareas pendientes
   */
  private async getPendingTasksCount() {
    // Contar tareas pendientes por componente
    const tasks = await this.prisma.challenge.findMany({
      where: {
        type: 'COSMIC_TASK',
        status: {
          notIn: [ColumnStatus.MANIFESTED],
        },
      },
    });

    const superAppTasks = tasks.filter((task) => {
      const config = JSON.parse(task.config || '{}');
      return config.tags?.includes('SuperApp');
    }).length;

    const gamifierAdminTasks = tasks.filter((task) => {
      const config = JSON.parse(task.config || '{}');
      return config.tags?.includes('GamifierAdmin');
    }).length;

    const backendTasks = tasks.filter((task) => {
      const config = JSON.parse(task.config || '{}');
      return config.tags?.includes('Backend');
    }).length;

    return {
      superApp: superAppTasks,
      gamifierAdmin: gamifierAdminTasks,
      backend: backendTasks,
    };
  }

  /**
   * 🚀 Generar tareas para SuperApp
   */
  private async generateTasksForSuperApp(superAppStatus: ModuleStatus) {
    const createdTasks = [];

    // Identificar módulos con menos de 95% de completitud
    const incompleteModules = Object.entries(superAppStatus.modules)
      .filter(([_, percentage]) => (percentage as number) < 95)
      .map(([module]) => module);

    // Crear tareas para cada módulo incompleto
    for (const module of incompleteModules) {
      const taskDto: CreateCosmicTaskDto = {
        title: `Completar módulo ${module} en SuperApp`,
        description: `Finalizar la implementación del módulo ${module} en la SuperApp e integrarlo completamente con el Backend NestJS.`,
        element: ThematicElement.FIRE,
        guardian: GuardianRole.PHOENIX,
        hambreLevel: 2,
        priority: TaskPriority.HIGH,
        phase: 2,
        estimatedHours: 16,
        philosophicalKpi: PhilosophicalKpi.VIC,
        tags: ['SuperApp', 'Integration', module],
        status: ColumnStatus.BACKLOG,
      };

      try {
        const task = await this.createTask(taskDto);
        createdTasks.push(task);
      } catch (error) {
        console.error(`Error al crear tarea para ${module}:`, error);
      }
    }

    return createdTasks;
  }

  /**
   * 🔌 Generar tareas para integración
   */
  private async generateTasksForIntegration(
    integrationStatus: IntegrationStatus
  ) {
    const createdTasks = [];

    // Identificar integraciones incompletas
    const incompleteIntegrations = Object.entries(integrationStatus.status)
      .filter(([_, percentage]) => (percentage as number) < 100)
      .map(([integration]) => integration);

    // Crear tareas para cada integración incompleta
    for (const integration of incompleteIntegrations) {
      const taskDto: CreateCosmicTaskDto = {
        title: `Completar integración: ${integration}`,
        description: `Finalizar la integración entre ${integration} para asegurar comunicación fluida entre componentes.`,
        element: ThematicElement.AIR,
        guardian: GuardianRole.ARIA,
        hambreLevel: 3,
        priority: TaskPriority.CRITICAL,
        phase: 2,
        estimatedHours: 8,
        philosophicalKpi: PhilosophicalKpi.IER,
        tags: ['Integration', 'Architecture'],
        status: ColumnStatus.BACKLOG,
      };

      try {
        const task = await this.createTask(taskDto);
        createdTasks.push(task);
      } catch (error) {
        console.error(
          `Error al crear tarea para integración ${integration}:`,
          error
        );
      }
    }

    return createdTasks;
  }

  /**
   * 🏗️ Generar tareas para infraestructura
   * 🌟 GRAN PURIFICACIÓN CÓSMICA - Alineación correcta de Guardianes según arquitectura fractal
   */
  private async generateTasksForInfrastructure(
    infrastructureStatus: InfrastructureStatus
  ) {
    const createdTasks = [];

    // Crear tareas basadas en recomendaciones con asignación correcta de Guardianes
    for (const recommendation of infrastructureStatus.recommendations) {
      let taskDto: CreateCosmicTaskDto;

      // Asignación fractal correcta según la naturaleza de la tarea
      if (
        recommendation.includes('monitoreo') ||
        recommendation.includes('Prometheus')
      ) {
        // NIRA: La Vidente de Patrones - Métricas e infraestructura analítica
        taskDto = {
          title: recommendation,
          description: `Implementar mejora de infraestructura analítica: ${recommendation}. NIRA aplicará su maestría en patrones para definir métricas con propósito y construir la infraestructura de observabilidad.`,
          element: ThematicElement.ETHER,
          guardian: GuardianRole.NIRA,
          hambreLevel: 2,
          priority: TaskPriority.MEDIUM,
          phase: 3,
          estimatedHours: 12,
          philosophicalKpi: PhilosophicalKpi.IER,
          tags: [
            'Infrastructure',
            'Analytics',
            'Metrics',
            'Prometheus',
            'NIRA',
          ],
          status: ColumnStatus.BACKLOG,
        };
      } else if (
        recommendation.includes('alertas') ||
        recommendation.includes('endpoints críticos')
      ) {
        // NIRA + COSMOS: Alertas como oráculos predictivos + observabilidad sistémica
        taskDto = {
          title: recommendation,
          description: `Configurar sistema de alertas inteligentes: ${recommendation}. NIRA actuará como Oráculo Predictivo detectando anomalías, mientras COSMOS implementa la observabilidad sistémica.`,
          element: ThematicElement.ETHER,
          guardian: GuardianRole.NIRA,
          hambreLevel: 2,
          priority: TaskPriority.MEDIUM,
          phase: 3,
          estimatedHours: 10,
          philosophicalKpi: PhilosophicalKpi.IER,
          tags: ['Infrastructure', 'Alerts', 'Monitoring', 'NIRA', 'COSMOS'],
          status: ColumnStatus.BACKLOG,
        };
      } else if (
        recommendation.includes('Redis') ||
        recommendation.includes('caché')
      ) {
        // COSMOS + PHOENIX: Tejedor de sistemas + optimización de rendimiento
        taskDto = {
          title: recommendation,
          description: `Optimización de caché y rendimiento: ${recommendation}. COSMOS teje la infraestructura sistémica mientras PHOENIX aplica su maestría en optimización para eliminar cuellos de botella.`,
          element: ThematicElement.EARTH,
          guardian: GuardianRole.COSMOS,
          hambreLevel: 2,
          priority: TaskPriority.MEDIUM,
          phase: 3,
          estimatedHours: 8,
          philosophicalKpi: PhilosophicalKpi.GS,
          tags: [
            'Infrastructure',
            'Cache',
            'Redis',
            'Performance',
            'COSMOS',
            'PHOENIX',
          ],
          status: ColumnStatus.BACKLOG,
        };
      } else if (
        recommendation.includes('seguridad') ||
        recommendation.includes('HMAC') ||
        recommendation.includes('validación')
      ) {
        // COSMOS: Tejedor de Sistemas - Seguridad y protección sistémica
        taskDto = {
          title: recommendation,
          description: `Fortalecimiento de seguridad: ${recommendation}. COSMOS implementará mejoras de seguridad bajo la Membrana Jud-0 de la Alquimia del Caos, transformando amenazas en fortalezas sistémicas.`,
          element: ThematicElement.EARTH,
          guardian: GuardianRole.COSMOS,
          hambreLevel: 3,
          priority: TaskPriority.HIGH,
          phase: 2,
          estimatedHours: 6,
          philosophicalKpi: PhilosophicalKpi.GS,
          tags: ['Infrastructure', 'Security', 'HMAC', 'Protection', 'COSMOS'],
          status: ColumnStatus.BACKLOG,
        };
      } else {
        // Infraestructura general - COSMOS por defecto (Tejedor de Sistemas)
        taskDto = {
          title: recommendation,
          description: `Mejora de infraestructura: ${recommendation}. COSMOS aplicará su maestría como Tejedor de Sistemas para fortalecer los cimientos del ecosistema CoomÜnity.`,
          element: ThematicElement.EARTH,
          guardian: GuardianRole.COSMOS,
          hambreLevel: 2,
          priority: TaskPriority.MEDIUM,
          phase: 3,
          estimatedHours: 12,
          philosophicalKpi: PhilosophicalKpi.GS,
          tags: ['Infrastructure', 'DevOps', 'Optimization', 'COSMOS'],
          status: ColumnStatus.BACKLOG,
        };
      }

      try {
        const task = await this.createTask(taskDto);
        createdTasks.push(task);
      } catch (error) {
        console.error(`Error al crear tarea para infraestructura:`, error);
      }
    }

    return createdTasks;
  }

  /**
   * 🔄 Mapear modelo de base de datos a DTO de respuesta
   */
  private mapToResponseDto(task: Challenge): CosmicTaskResponseDto {
    const config = JSON.parse(task.config || '{}');

    return {
      id: task.id,
      title: task.title,
      description: task.description || '',
      element: config.element || ThematicElement.ETHER,
      guardian: config.guardian || GuardianRole.ANA,
      hambreLevel: config.hambreLevel || 1,
      priority: config.priority || 'MEDIUM',
      phase: config.phase || 1,
      estimatedHours: config.estimatedHours || 0,
      philosophicalKpi: config.philosophicalKpi || 'VIC',
      tags: config.tags || [],
      status: (task.status as ColumnStatus) || ColumnStatus.BACKLOG,
      assignee: config.assignee,
      actualHours: config.actualHours,
      completionDate: config.completionDate
        ? new Date(config.completionDate)
        : undefined,
      metadata: config.metadata,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  /**
   * Programa la sincronización automática del estado del proyecto
   * @param intervalMinutes Intervalo en minutos para la sincronización (por defecto: 60 minutos)
   */
  async scheduleAutoSync(intervalMinutes = 60): Promise<void> {
    // Limpiar cualquier intervalo existente
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
    }

    // Configurar nuevo intervalo
    this.autoSyncInterval = setInterval(
      async () => {
        try {
          console.log(
            `[CosmicKanban] Ejecutando sincronización automática programada`
          );
          await this.syncProjectStatus();
          console.log(
            `[CosmicKanban] Sincronización automática completada con éxito`
          );
        } catch (error) {
          console.error(
            `[CosmicKanban] Error en sincronización automática:`,
            error
          );
        }
      },
      intervalMinutes * 60 * 1000
    );

    console.log(
      `[CosmicKanban] Sincronización automática programada cada ${intervalMinutes} minutos`
    );
  }

  /**
   * 🌟 GRAN PURIFICACIÓN CÓSMICA - Migración masiva de tareas THOR Legacy
   * 🔄 Transforma el caos creativo en orden fractal asignando Guardianes correctos
   */
  async purifyThorLegacyTasks(): Promise<{
    migrated: number;
    errors: string[];
    summary: Record<string, number>;
  }> {
    console.log(
      '🌟 [PURIFICACIÓN CÓSMICA] Iniciando migración masiva de tareas THOR Legacy...'
    );

    try {
      // Obtener todas las tareas COSMIC_TASK y filtrar por THOR después
      const allCosmicTasks = await this.prisma.challenge.findMany({
        where: {
          type: 'COSMIC_TASK',
        },
      });

      // Filtrar tareas THOR Legacy
      const thorTasks = allCosmicTasks.filter((task) => {
        const config = JSON.parse(task.config || '{}');
        return config.guardian === 'THOR';
      });

      console.log(
        `🔍 [PURIFICACIÓN] Encontradas ${thorTasks.length} tareas THOR Legacy`
      );

      const migrationResults = {
        migrated: 0,
        errors: [] as string[],
        summary: {} as Record<string, number>,
      };

      // Procesar cada tarea individualmente
      for (const task of thorTasks) {
        try {
          const config = JSON.parse(task.config || '{}');
          let newGuardian: GuardianRole;
          let newElement: ThematicElement;
          let newTags: string[] = config.tags || [];

          // Determinar el Guardián correcto según el título/descripción
          if (
            task.title.includes('monitoreo') ||
            task.title.includes('Prometheus')
          ) {
            // NIRA: La Vidente de Patrones - Métricas e infraestructura analítica
            newGuardian = GuardianRole.NIRA;
            newElement = ThematicElement.ETHER;
            newTags = [
              'Infrastructure',
              'Analytics',
              'Metrics',
              'Prometheus',
              'NIRA',
            ];
          } else if (
            task.title.includes('alertas') ||
            task.title.includes('endpoints críticos')
          ) {
            // NIRA: Oráculo Predictivo - Sistema de alertas inteligentes
            newGuardian = GuardianRole.NIRA;
            newElement = ThematicElement.ETHER;
            newTags = ['Infrastructure', 'Alerts', 'Monitoring', 'NIRA'];
          } else if (
            task.title.includes('Redis') ||
            task.title.includes('caché')
          ) {
            // COSMOS: Tejedor de Sistemas - Infraestructura de caché y rendimiento
            newGuardian = GuardianRole.COSMOS;
            newElement = ThematicElement.EARTH;
            newTags = [
              'Infrastructure',
              'Cache',
              'Redis',
              'Performance',
              'COSMOS',
            ];
          } else if (
            task.title.includes('seguridad') ||
            task.title.includes('HMAC') ||
            task.title.includes('validación')
          ) {
            // COSMOS: Tejedor de Sistemas - Seguridad sistémica
            newGuardian = GuardianRole.COSMOS;
            newElement = ThematicElement.EARTH;
            newTags = ['Infrastructure', 'Security', 'Protection', 'COSMOS'];
          } else {
            // Infraestructura general - COSMOS por defecto
            newGuardian = GuardianRole.COSMOS;
            newElement = ThematicElement.EARTH;
            newTags = ['Infrastructure', 'DevOps', 'Optimization', 'COSMOS'];
          }

          // Actualizar configuración con el nuevo Guardián
          const updatedConfig = {
            ...config,
            guardian: newGuardian,
            element: newElement,
            tags: newTags,
            migrationNote: `Migrado de THOR Legacy el ${new Date().toISOString()}`,
            purificationCosmic: true,
          };

          // Actualizar la tarea en la base de datos (tabla challenge)
          await this.prisma.challenge.update({
            where: { id: task.id },
            data: {
              config: JSON.stringify(updatedConfig),
              updatedAt: new Date(),
            },
          });

          // Contabilizar la migración
          migrationResults.migrated++;
          migrationResults.summary[newGuardian] =
            (migrationResults.summary[newGuardian] || 0) + 1;

          console.log(
            `✅ [PURIFICACIÓN] Tarea "${task.title}" migrada de THOR → ${newGuardian}`
          );
        } catch (error) {
          const errorMsg = `Error migrando tarea ${task.id}: ${error.message}`;
          migrationResults.errors.push(errorMsg);
          console.error(`❌ [PURIFICACIÓN] ${errorMsg}`);
        }
      }

      // Invalidar caché después de la migración masiva
      await this.invalidateCosmicCache();

      console.log(`🎉 [PURIFICACIÓN CÓSMICA COMPLETADA]`);
      console.log(`📊 Resumen: ${migrationResults.migrated} tareas migradas`);
      console.log(`🔄 Distribución:`, migrationResults.summary);

      if (migrationResults.errors.length > 0) {
        console.log(`⚠️ Errores: ${migrationResults.errors.length}`);
      }

      return migrationResults;
    } catch (error) {
      console.error('❌ [PURIFICACIÓN CÓSMICA] Error crítico:', error);
      throw new Error(
        `Error en la Gran Purificación Cósmica: ${error.message}`
      );
    }
  }
}
