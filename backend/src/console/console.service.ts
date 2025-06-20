/**
 * 🎮 Console Service - Main Analytics & Overview
 * 
 * Servicio principal para analytics generales y overview de la Consola
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getConsoleAnalytics() {
    // Mock analytics data based on Miro board requirements
    return {
      activeUsers: {
        weekly: 1247,
        growth: 12
      },
      stageProgression: {
        seekerToSolver: 68,
        target: 75
      },
      engagement: {
        gplEngagement: 84,
        status: 'excellent' as const
      },
      trustVotes: {
        thisWeek: 89,
        dailyAverage: 12.7
      }
    };
  }

  async getConsoleOverview() {
    return {
      totalUsers: 1247,
      activeContests: 3,
      pendingValidations: 12,
      systemHealth: 'excellent'
    };
  }

  async getConsoleNotifications() {
    return [
      {
        id: '1',
        type: 'contest',
        message: 'Concurso Semanal #47 termina en 2 días',
        timestamp: new Date(),
        priority: 'high'
      },
      {
        id: '2',
        type: 'validation',
        message: '12 usuarios pendientes de validación SEEKER → SOLVER',
        timestamp: new Date(),
        priority: 'medium'
      }
    ];
  }
}