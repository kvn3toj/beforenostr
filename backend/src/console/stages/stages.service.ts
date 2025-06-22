/**
 * 🎭 Stages Service - Customer Journey Management
 *
 * Servicio para gestión de los 4 STAGES del customer journey
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateStageDto } from './dto/update-stage.dto';

@Injectable()
export class StagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStages() {
    // Mock data based on Miro board
    return [
      {
        id: 'buyer',
        name: 'BUYER - Consumidor Inicial',
        description:
          'Usuario que recibe gift cards y experimenta los primeros intercambios',
        isActive: true,
        completionRate: 73,
        timeframe: 'Lunes 12M - Jueves 11:59PM',
      },
      {
        id: 'seeker',
        name: 'SEEKER - Buscador de Oportunidades',
        description: 'Usuario que explora el marketplace y busca crear valor',
        isActive: true,
        completionRate: 45,
        timeframe: 'Proceso continuo hasta validación',
      },
      {
        id: 'solver',
        name: 'SOLVER - Solucionador/Emprendedor',
        description:
          'Usuario que ofrece productos y servicios en el marketplace',
        isActive: true,
        completionRate: 62,
        timeframe: 'Semanal con deadlines específicos',
      },
      {
        id: 'promoter',
        name: 'PROMOTER - Promotor de la Comunidad',
        description: 'Usuario que invita y valida nuevos miembros',
        isActive: true,
        completionRate: 28,
        timeframe: 'Continuo con beneficios acumulativos',
      },
    ];
  }

  async getStageById(stageId: string) {
    const stages = await this.getAllStages();
    return stages.find((stage) => stage.id === stageId);
  }

  async updateStage(stageId: string, data: UpdateStageDto) {
    // Implementation for updating stage
    return { id: stageId, ...data, updated: true };
  }

  async getStageAnalytics(stageId: string) {
    // Mock analytics for specific stage
    return {
      stageId,
      userCount: 247,
      completionRate: 68,
      averageTimeInStage: '5.2 days',
      conversionRate: 0.75,
    };
  }
}
