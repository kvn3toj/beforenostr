/**
 * =============================================================================
 * SERVICIO API DE FILOSOFÍA - GAMIFIER ADMIN
 * =============================================================================
 * Servicio que conecta el Gamifier Admin Frontend con los endpoints del
 * Backend NestJS para métricas filosóficas (HambrE, IEA).
 *
 * Migración: De mocks locales a backend real
 * Guardián responsable: ATLAS (integración backend) + MIRA (admin frontend)
 * =============================================================================
 */

import { apiService } from './api.service';
import {
  PhilosophyMetricsState,
  HambreMetric,
  IEAReciprocidad,
  HambreLevel
} from '../../../../packages/shared-types/src/philosophy-metrics';

/**
 * DTOs específicos para la API del backend
 */
interface UpdateHambreRequest {
  level: HambreLevel;
  value: number;
  notes?: string;
  updatedBy?: string;
}

interface PhilosophyMetricsResponse {
  hambre: HambreMetric;
  iea: IEAReciprocidad;
  lastSync: string;
}

/**
 * 🌌 Servicio API para métricas filosóficas
 * Conecta la Consola de Experiencias con el Backend Sagrado de ATLAS
 */
export class PhilosophyApiService {
  private static readonly BASE_PATH = '/philosophy';

  /**
   * 📊 Obtener todas las métricas filosóficas
   * Endpoint principal para la Consola de Experiencias
   */
  static async getMetrics(): Promise<PhilosophyMetricsResponse> {
    try {
      console.log('🌌 PhilosophyApiService: Obteniendo métricas del backend...');

      const response = await apiService.get<PhilosophyMetricsResponse>(
        `${this.BASE_PATH}/metrics`
      );

      console.log('✅ Métricas filosóficas obtenidas:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo métricas filosóficas:', error);
      throw new Error(`Failed to fetch philosophy metrics: ${error}`);
    }
  }

  /**
   * 🔥 Obtener métricas específicas de HambrE
   */
  static async getHambreMetrics(): Promise<HambreMetric> {
    try {
      console.log('🔥 PhilosophyApiService: Obteniendo HambrE...');

            const response = await apiService.get<HambreMetric>(
        `${this.BASE_PATH}/hambre`
      );

      console.log('✅ HambrE obtenido:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo HambrE:', error);
      throw new Error(`Failed to fetch HambrE metrics: ${error}`);
    }
  }

  /**
   * 🔄 Actualizar métricas de HambrE
   * Solo disponible para administradores
   */
  static async updateHambre(
    value: number,
    notes?: string,
    updatedBy?: string
  ): Promise<HambreMetric> {
    try {
      console.log(`🔄 PhilosophyApiService: Actualizando HambrE a ${value}...`);

      // Determinar level basado en value
      const level: HambreLevel = value <= 33 ? 'bajo' : value >= 67 ? 'alto' : 'medio';

      const updateData: UpdateHambreRequest = {
        level,
        value,
        notes,
        updatedBy
      };

      const response = await apiService.post<HambreMetric>(
        `${this.BASE_PATH}/hambre`,
        updateData
      );

      console.log('✅ HambrE actualizado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error actualizando HambrE:', error);
      throw new Error(`Failed to update HambrE: ${error}`);
    }
  }

  /**
   * 🔄 Obtener métricas de IEA de Reciprocidad
   */
  static async getIEAMetrics(): Promise<IEAReciprocidad> {
    try {
      console.log('🔄 PhilosophyApiService: Obteniendo IEA...');

      const response = await apiService.get<IEAReciprocidad>(
        `${this.BASE_PATH}/iea`
      );

      console.log('✅ IEA obtenido:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo IEA:', error);
      throw new Error(`Failed to fetch IEA metrics: ${error}`);
    }
  }

  /**
   * 🧹 Invalidar cache de métricas (para desarrollo/depuración)
   */
  static async invalidateCache(): Promise<{ message: string; timestamp: string }> {
    try {
      console.log('🧹 PhilosophyApiService: Invalidando cache...');

      const response = await apiService.delete<{ message: string; timestamp: string }>(
        `${this.BASE_PATH}/cache`
      );

      console.log('✅ Cache invalidado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error invalidando cache:', error);
      throw new Error(`Failed to invalidate cache: ${error}`);
    }
  }

  /**
   * 🏥 Health check del módulo de filosofía
   */
  static async healthCheck(): Promise<{ status: string; module: string; timestamp: string }> {
    try {
      console.log('🏥 PhilosophyApiService: Health check...');

      const response = await apiService.get<{ status: string; module: string; timestamp: string }>(
        `${this.BASE_PATH}/health`
      );

      console.log('✅ Health check exitoso:', response);
      return response;
    } catch (error) {
      console.error('❌ Error en health check:', error);
      throw new Error(`Philosophy module health check failed: ${error}`);
    }
  }

  /**
   * 🔄 Convertir respuesta del backend a estado de frontend
   * Transforma la respuesta del backend en el formato esperado por el frontend
   */
  static backendResponseToFrontendState(
    backendResponse: PhilosophyMetricsResponse
  ): PhilosophyMetricsState {
    return {
      hambre: backendResponse.hambre,
      iea: backendResponse.iea,
      lastSync: backendResponse.lastSync,
      // Configuración por defecto - en el futuro vendrá del backend
      config: {
        hambre: {
          enabled: true,
          displayMode: 'both' as const,
          thresholds: {
            low: 33,
            medium: 66,
            high: 100
          }
        },
        iea: {
          enabled: true,
          displayMode: 'both' as const,
          targetRange: {
            min: 0.8,
            max: 1.2
          }
        },
        general: {
          refreshInterval: 15,
          showHistory: true,
          historyRetentionDays: 30
        }
      }
    };
  }
}

/**
 * Instancia exportada para uso directo
 */
export const philosophyApiService = PhilosophyApiService;
