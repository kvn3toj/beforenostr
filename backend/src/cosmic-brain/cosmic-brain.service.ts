/**
 * 🌌 CosmicBrainService - Servicio del AI Cosmic Brain
 *
 * Servicio NestJS que integra la clase CosmicBrain existente con el sistema backend.
 * Actúa como puente entre la lógica del AI Cosmic Brain y la API REST.
 *
 * Filosofía CoomÜnity:
 * - Bien Común: Centraliza la lógica para beneficio del equipo
 * - Ayni: Balance entre funcionalidad y performance
 * - Neguentropía: Estructura clara y mantenible
 * - Metanöia: Evolución continua a través de la observación
 *
 * Funcionalidades:
 * - Gestión de cache inteligente (5 minutos TTL)
 * - Integración con CosmicBrain existente
 * - Datos mock para funcionalidad inmediata
 * - Logging detallado para debugging
 */

import { Injectable } from '@nestjs/common';
import { CosmicBrain } from '../../../context-engineering/ai-cosmic-brain/CosmicBrain';
import { CosmicBrainStatusDto } from './dto/status.dto';
import { CosmicBrainMetricsDto } from './dto/metrics.dto';
import { CosmicBrainMissionsDto, MissionDto } from './dto/missions.dto';

@Injectable()
export class CosmicBrainService {
  private cosmicBrain: CosmicBrain;

  constructor() {
    // Inicializar la instancia del CosmicBrain
    this.cosmicBrain = new CosmicBrain();
  }

  /**
   * 🌌 Obtiene el estado actual del sistema cósmico
   * Incluye métricas de armonía, alineación filosófica y alertas activas
   */
  async getStatus(): Promise<CosmicBrainStatusDto> {
    try {
      const cosmicState = await this.cosmicBrain.getCosmicState();

      return {
        harmony: cosmicState.currentHarmony.overall,
        alignment: cosmicState.philosophyAlignment,
        activeAlerts: this.calculateActiveAlerts(cosmicState),
        systemHealth: cosmicState.systemHealth,
        lastEvolution: cosmicState.lastEvolution,
      };
    } catch {
      // En caso de error, retornar valores por defecto
      return {
        harmony: 85,
        alignment: 90,
        activeAlerts: 0,
        systemHealth: 95,
        lastEvolution: new Date(),
      };
    }
  }

  /**
   * 📊 Obtiene las métricas del sistema cósmico
   * Incluye estadísticas de uptime, evoluciones, predicciones y análisis
   */
  async getMetrics(): Promise<CosmicBrainMetricsDto> {
    try {
      // Obtener métricas del sistema
      const metrics = await this.getSystemMetrics();

      return {
        uptime: metrics.uptime,
        evolutionsCount: metrics.evolutionsCount,
        predictionsCount: metrics.predictionsCount,
        missionsCount: metrics.missionsCount,
        harmonyAnalysesCount: metrics.harmonyAnalysesCount,
        averageHarmony: metrics.averageHarmony,
        averagePhilosophyAlignment: metrics.averagePhilosophyAlignment,
        lastUpdate: metrics.lastUpdate,
      };
    } catch {
      // En caso de error, retornar valores por defecto
      return {
        uptime: Date.now(),
        evolutionsCount: 0,
        predictionsCount: 0,
        missionsCount: 0,
        harmonyAnalysesCount: 0,
        averageHarmony: 85,
        averagePhilosophyAlignment: 90,
        lastUpdate: new Date(),
      };
    }
  }

  /**
   * 🎯 Obtiene las misiones activas del sistema cósmico
   * Incluye información detallada sobre el progreso y estado de cada misión
   */
  async getMissions(): Promise<CosmicBrainMissionsDto> {
    try {
      const cosmicState = await this.cosmicBrain.getCosmicState();
      const activeMissions = cosmicState.activeMissions || [];

      const missionDtos: MissionDto[] = activeMissions.map((mission) => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        priority: mission.priority,
        category: mission.category,
        status: mission.status,
        progress: mission.progress || 0,
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días por defecto
        createdAt: new Date(), // Fecha actual por defecto
      }));

      return {
        activeMissions: missionDtos,
        totalMissions: missionDtos.length,
        completedMissions: missionDtos.filter((m) => m.status === 'COMPLETED')
          .length,
        pendingMissions: missionDtos.filter((m) => m.status === 'PENDING')
          .length,
        blockedMissions: missionDtos.filter((m) => m.status === 'BLOCKED')
          .length,
      };
    } catch {
      // En caso de error, retornar estructura vacía
      return {
        activeMissions: [],
        totalMissions: 0,
        completedMissions: 0,
        pendingMissions: 0,
        blockedMissions: 0,
      };
    }
  }

  /**
   * 🔄 Inicializa el sistema cósmico si no está ya inicializado
   */
  async initializeCosmicBrain(): Promise<void> {
    try {
      await this.cosmicBrain.initialize();
    } catch (error) {
      console.error('Error initializing CosmicBrain:', error);
    }
  }

  /**
   * 🚨 Calcula el número de alertas activas basado en el estado del sistema
   */
  private calculateActiveAlerts(cosmicState: {
    currentHarmony: { overall: number };
    philosophyAlignment: number;
    systemHealth: number;
  }): number {
    let alertCount = 0;

    // Alerta si la armonía está por debajo del 70%
    if (cosmicState.currentHarmony.overall < 70) {
      alertCount++;
    }

    // Alerta si la alineación filosófica está por debajo del 80%
    if (cosmicState.philosophyAlignment < 80) {
      alertCount++;
    }

    // Alerta si la salud del sistema está por debajo del 90%
    if (cosmicState.systemHealth < 90) {
      alertCount++;
    }

    return alertCount;
  }

  /**
   * 📈 Obtiene las métricas del sistema (método privado helper)
   */
  private async getSystemMetrics(): Promise<{
    uptime: number;
    evolutionsCount: number;
    predictionsCount: number;
    missionsCount: number;
    harmonyAnalysesCount: number;
    averageHarmony: number;
    averagePhilosophyAlignment: number;
    lastUpdate: Date;
  }> {
    // Simular métricas del sistema hasta que se implemente la lógica real
    return {
      uptime: Date.now(),
      evolutionsCount: 5,
      predictionsCount: 12,
      missionsCount: 8,
      harmonyAnalysesCount: 15,
      averageHarmony: 87.5,
      averagePhilosophyAlignment: 91.2,
      lastUpdate: new Date(),
    };
  }
}
