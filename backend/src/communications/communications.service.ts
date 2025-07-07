import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CoomUnityLoggerService } from '../common/logger/logger.service';
import { DispatchMissionDto } from './dto/dispatch-mission.dto';
import { MissionResponseDto } from './dto/mission-response.dto';
import { $Enums } from '../generated/prisma';

/**
 * 🌟 Communications Service - Orquestador de Agentes IA
 *
 * Servicio para coordinar misiones entre agentes especializados:
 * - Proxy seguro hacia N8N
 * - Gestión de misiones y seguimiento
 * - Logging y auditoría de actividades
 * - Cache para optimización de respuestas
 *
 * Filosofía: Actúa como el Director de Orquesta de la Sinfonía de Agentes
 */
@Injectable()
export class CommunicationsService {
  private readonly logger = new Logger(CommunicationsService.name);
  private readonly n8nWebhookUrl: string;
  private readonly n8nApiKey?: string;

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(CacheService) private readonly cacheService: CacheService,
    @Inject(CoomUnityLoggerService)
    private readonly customLogger: CoomUnityLoggerService
  ) {
    // Configuración de N8N desde variables de entorno
    this.n8nWebhookUrl = process.env.N8N_MASTER_WEBHOOK_URL || '';
    this.n8nApiKey = process.env.N8N_API_KEY;

    if (!this.n8nWebhookUrl) {
      this.logger.error(
        'N8N_MASTER_WEBHOOK_URL no está configurada en las variables de entorno'
      );
    }

    this.customLogger.info('CommunicationsService initialized', {
      module: 'CommunicationsService',
      n8nConfigured: !!this.n8nWebhookUrl,
    });
  }

  /**
   * Despachar una misión a los agentes de IA
   */
  async dispatchMission(
    missionDto: DispatchMissionDto,
    userId: string
  ): Promise<MissionResponseDto> {
    const startTime = Date.now();
    const missionId = this.generateMissionId();

    try {
      this.customLogger.info('Dispatching mission to AI agents', {
        missionId,
        userId,
        missionType: missionDto.missionType,
        targetAgent: missionDto.targetAgent,
        missionLength: missionDto.mission.length,
      });

      // Validar configuración de N8N
      if (!this.n8nWebhookUrl) {
        throw new HttpException(
          'Sistema de agentes IA no configurado. Contacte al administrador.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      // Preparar payload para N8N
      const n8nPayload = this.prepareN8NPayload(missionDto, userId, missionId);

      // Registrar la misión en la base de datos
      await this.recordMissionInDatabase(missionDto, userId, missionId);

      // Enviar la misión a N8N
      const n8nResponse = await this.sendToN8N(n8nPayload);

      // Preparar respuesta exitosa
      const response: MissionResponseDto = {
        success: true,
        missionId,
        status: $Enums.MissionStatus.DISPATCHED,
        message: `Misión despachada exitosamente a ${missionDto.targetAgent || 'ANA'} para coordinación de agentes`,
        data: n8nResponse,
        timestamp: new Date().toISOString(),
        involvedAgents: this.determineInvolvedAgents(missionDto),
        estimatedCompletionTime: this.estimateCompletionTime(missionDto),
        trackingUrl: `${process.env.BACKEND_URL}/communications/missions/${missionId}`,
      };

      // Cache de la respuesta para seguimiento
      await this.cacheService.set(
        `mission:${missionId}`,
        JSON.stringify(response),
        3600
      ); // 1 hora

      const duration = Date.now() - startTime;
      this.customLogger.info('Mission dispatched successfully', {
        missionId,
        duration,
        status: 'success',
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Failed to dispatch mission: ${error.message}`, {
        missionId,
        userId,
        duration,
      });

      // Actualizar estado en base de datos
      await this.updateMissionStatus(
        missionId,
        $Enums.MissionStatus.FAILED,
        error.message
      );

      // Respuesta de error
      return {
        success: false,
        missionId,
        status: $Enums.MissionStatus.FAILED,
        message: `Error al despachar misión: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Obtener el estado de una misión
   */
  async getMissionStatus(
    missionId: string
  ): Promise<MissionResponseDto | null> {
    try {
      // Intentar obtener del cache primero
      const cachedMission = await this.cacheService.get(`mission:${missionId}`);
      if (cachedMission) {
        return JSON.parse(cachedMission as string) as MissionResponseDto;
      }

      // Si no está en cache, buscar en base de datos
      const mission = await this.prisma.aIMission.findUnique({
        where: { id: missionId },
      });

      if (!mission) {
        return null;
      }

      return {
        success: mission.status !== $Enums.MissionStatus.FAILED,
        missionId: mission.id,
        status: mission.status as $Enums.MissionStatus,
        message: mission.errorMessage || 'Misión en progreso',
        timestamp: mission.createdAt.toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting mission status: ${error.message}`);
      return null;
    }
  }

  /**
   * Listar misiones del usuario
   */
  async getUserMissions(
    userId: string,
    limit = 10
  ): Promise<MissionResponseDto[]> {
    try {
      const missions = await this.prisma.aIMission.findMany({
        where: { createdBy: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return missions.map((mission) => ({
        success: mission.status !== $Enums.MissionStatus.FAILED,
        missionId: mission.id,
        status: mission.status as $Enums.MissionStatus,
        message: mission.errorMessage || 'Misión procesada',
        timestamp: mission.createdAt.toISOString(),
      }));
    } catch (error) {
      this.logger.error(`Error getting user missions: ${error.message}`);
      return [];
    }
  }

  // Métodos privados auxiliares

  private generateMissionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `mission_${timestamp}_${random}`;
  }

  private prepareN8NPayload(
    missionDto: DispatchMissionDto,
    userId: string,
    missionId: string
  ) {
    return {
      missionId,
      userId,
      mission: missionDto.mission,
      missionType: missionDto.missionType || $Enums.MissionType.COMPLEX,
      targetAgent: missionDto.targetAgent || $Enums.AgentType.ANA,
      priority: missionDto.priority || 3,
      context: missionDto.context,
      timestamp: new Date().toISOString(),
      source: 'coomunity-gamifier-admin',
      philosophy:
        'Bien Común > bien particular, Cooperar > Competir, Reciprocidad/Ayni',
    };
  }

  private async sendToN8N(
    payload: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'CoomUnity-Gamifier/1.0',
    };

    if (this.n8nApiKey) {
      headers['Authorization'] = `Bearer ${this.n8nApiKey}`;
    }

    const response = await firstValueFrom(
      this.httpService.post(this.n8nWebhookUrl, payload, { headers })
    );

    return response.data;
  }

  private async recordMissionInDatabase(
    missionDto: DispatchMissionDto,
    userId: string,
    missionId: string
  ) {
    try {
      await this.prisma.aIMission.create({
        data: {
          id: missionId,
          title: missionDto.mission.substring(0, 100), // Título truncado
          description: missionDto.mission,
          prompt: missionDto.mission,
          missionType: missionDto.missionType || $Enums.MissionType.COMPLEX,
          primaryAgent: missionDto.targetAgent || $Enums.AgentType.ANA,
          involvedAgents: this.determineInvolvedAgents(missionDto).map(
            (agent) => agent as $Enums.AgentType
          ),
          context: missionDto.context
            ? JSON.parse(JSON.stringify(missionDto.context))
            : null,
          status: $Enums.MissionStatus.DISPATCHED,
          createdBy: userId,
          estimatedDuration: this.estimateCompletionTime(missionDto),
        },
      });
    } catch (error) {
      this.logger.warn(
        `Could not record mission in database: ${error.message}`
      );
      // No fallar la misión por esto, solo advertir
    }
  }

  private async updateMissionStatus(
    missionId: string,
    status: $Enums.MissionStatus,
    message?: string
  ) {
    try {
      await this.prisma.aIMission.update({
        where: { id: missionId },
        data: {
          status,
          errorMessage: message,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.warn(`Could not update mission status: ${error.message}`);
    }
  }

  private determineInvolvedAgents(
    missionDto: DispatchMissionDto
  ): $Enums.AgentType[] {
    if (
      missionDto.targetAgent &&
      missionDto.targetAgent !== $Enums.AgentType.ANA
    ) {
      return [$Enums.AgentType.ANA, missionDto.targetAgent];
    }

    // Determinar agentes basado en el tipo de misión
    const agents: $Enums.AgentType[] = [$Enums.AgentType.ANA]; // ANA siempre está involucrada

    switch (missionDto.missionType) {
      case $Enums.MissionType.RESEARCH:
        agents.push($Enums.AgentType.NIRA);
        break;
      case $Enums.MissionType.MEDIA_CREATION:
        agents.push($Enums.AgentType.ARIA);
        break;
      case $Enums.MissionType.PUBLICATION:
        agents.push($Enums.AgentType.HERALDO);
        break;
      case $Enums.MissionType.NOTIFICATION:
        agents.push($Enums.AgentType.PAX);
        break;
      case $Enums.MissionType.COMPLEX:
      default:
        // Para misiones complejas, incluir múltiples agentes
        agents.push(
          $Enums.AgentType.NIRA,
          $Enums.AgentType.ARIA,
          $Enums.AgentType.HERALDO,
          $Enums.AgentType.PAX
        );
        break;
    }

    return agents;
  }

  private estimateCompletionTime(missionDto: DispatchMissionDto): number {
    // Estimación base en minutos
    let baseTime = 5;

    switch (missionDto.missionType) {
      case $Enums.MissionType.RESEARCH:
        baseTime = 10;
        break;
      case $Enums.MissionType.MEDIA_CREATION:
        baseTime = 15;
        break;
      case $Enums.MissionType.PUBLICATION:
        baseTime = 8;
        break;
      case $Enums.MissionType.NOTIFICATION:
        baseTime = 3;
        break;
      case $Enums.MissionType.COMPLEX:
      default:
        baseTime = 25;
        break;
    }

    // Ajustar basado en la longitud de la misión
    const missionLength = missionDto.mission.length;
    const lengthMultiplier = Math.max(1, Math.min(3, missionLength / 500));

    return Math.round(baseTime * lengthMultiplier);
  }
}
