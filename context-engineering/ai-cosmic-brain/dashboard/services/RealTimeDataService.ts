/**
 * 🔄 RealTimeDataService - Servicio de Datos en Tiempo Real
 *
 * Servicio que integra el WebSocket del AI Cosmic Brain con el sistema
 * de datos del dashboard, proporcionando actualizaciones automáticas
 * y sincronización bidireccional.
 *
 * Características:
 * - Actualización automática de datos del dashboard
 * - Sincronización con eventos WebSocket
 * - Cache inteligente de datos
 * - Optimización de renderizado
 * - Manejo de conflictos de datos
 *
 * Filosofía aplicada:
 * - Bien Común: Datos actualizados que benefician todo el equipo
 * - Neguentropía: Orden en la sincronización de datos
 * - Ayni: Balance entre frecuencia de actualización y recursos
 */

import { CosmicWebSocketEvent, CosmicEventType } from '../websocket/CosmicWebSocketService';
import { SystemHealthMetrics, GuardianReportsCollection } from '../types';

// ============================================================================
// 🎯 Types and Interfaces
// ============================================================================

export interface RealTimeDataState {
  systemHealth: SystemHealthMetrics;
  guardianReports: GuardianReportsCollection;
  lastUpdated: Date;
  isStale: boolean;
  updateCount: number;
}

export interface DataUpdateEvent {
  type: 'full_update' | 'partial_update' | 'guardian_update' | 'philosophy_update';
  data: any;
  timestamp: Date;
  source: 'websocket' | 'manual' | 'scheduled';
}

export type DataUpdateHandler = (event: DataUpdateEvent) => void;

// ============================================================================
// 🔄 RealTimeDataService Class
// ============================================================================

export class RealTimeDataService {
  private dataState: RealTimeDataState;
  private updateHandlers: Set<DataUpdateHandler> = new Set();
  private lastFullUpdate: Date | null = null;
  private updateQueue: DataUpdateEvent[] = [];
  private isProcessingQueue = false;
  private staleTimeout: NodeJS.Timeout | null = null;

  // Configuration
  private config = {
    staleThreshold: 5 * 60 * 1000, // 5 minutes
    maxQueueSize: 100,
    batchUpdateDelay: 1000, // 1 second
    enableBatching: true
  };

  constructor(initialData?: Partial<RealTimeDataState>) {
    this.dataState = {
      systemHealth: {
        overallScore: 0,
        guardiansActive: 0,
        totalRecommendations: 0,
        criticalIssues: 0,
        lastEvolution: null,
        philosophyAlignment: 0,
        healthTrend: { direction: 'stable', percentage: 0, isSignificant: false, comparisonPeriod: '24h' },
        uptime: 0
      },
      guardianReports: {},
      lastUpdated: new Date(),
      isStale: false,
      updateCount: 0,
      ...initialData
    };

    this.startStaleTimer();
  }

  // ============================================================================
  // 📡 WebSocket Event Handlers
  // ============================================================================

  /**
   * Maneja eventos WebSocket entrantes y actualiza el estado
   */
  public handleWebSocketEvent(event: CosmicWebSocketEvent): void {
    const updateEvent: DataUpdateEvent = {
      type: this.mapEventTypeToUpdateType(event.type),
      data: event.data,
      timestamp: new Date(event.timestamp),
      source: 'websocket'
    };

    this.queueUpdate(updateEvent);
  }

  /**
   * Mapea tipos de eventos WebSocket a tipos de actualización
   */
  private mapEventTypeToUpdateType(eventType: CosmicEventType): DataUpdateEvent['type'] {
    switch (eventType) {
      case 'system_health_update':
        return 'full_update';
      case 'guardian_analysis_update':
        return 'guardian_update';
      case 'philosophy_alignment_change':
        return 'philosophy_update';
      case 'critical_alert':
      case 'recommendation_generated':
      case 'mission_assigned':
      case 'harmony_analysis_complete':
        return 'partial_update';
      default:
        return 'partial_update';
    }
  }

  // ============================================================================
  // 🔄 Data Update Management
  // ============================================================================

  /**
   * Agrega actualización a la cola
   */
  private queueUpdate(updateEvent: DataUpdateEvent): void {
    // Prevent queue overflow
    if (this.updateQueue.length >= this.config.maxQueueSize) {
      this.updateQueue.shift(); // Remove oldest update
    }

    this.updateQueue.push(updateEvent);

    if (this.config.enableBatching) {
      this.scheduleBatchProcess();
    } else {
      this.processUpdate(updateEvent);
    }
  }

  /**
   * Programa procesamiento en lotes
   */
  private scheduleBatchProcess(): void {
    if (this.isProcessingQueue) return;

    this.isProcessingQueue = true;
    setTimeout(() => {
      this.processBatchUpdates();
      this.isProcessingQueue = false;
    }, this.config.batchUpdateDelay);
  }

  /**
   * Procesa actualizaciones en lotes
   */
  private processBatchUpdates(): void {
    if (this.updateQueue.length === 0) return;

    const updates = [...this.updateQueue];
    this.updateQueue = [];

    // Group updates by type for optimization
    const groupedUpdates = this.groupUpdatesByType(updates);

    // Process each group
    Object.entries(groupedUpdates).forEach(([type, events]) => {
      this.processBatchedUpdateType(type as DataUpdateEvent['type'], events);
    });

    // Update metadata
    this.dataState.lastUpdated = new Date();
    this.dataState.updateCount += updates.length;
    this.dataState.isStale = false;
    this.restartStaleTimer();

    // Notify handlers
    this.notifyHandlers({
      type: 'full_update',
      data: this.dataState,
      timestamp: new Date(),
      source: 'websocket'
    });
  }

  /**
   * Agrupa actualizaciones por tipo
   */
  private groupUpdatesByType(updates: DataUpdateEvent[]): Record<string, DataUpdateEvent[]> {
    return updates.reduce((groups, update) => {
      if (!groups[update.type]) {
        groups[update.type] = [];
      }
      groups[update.type].push(update);
      return groups;
    }, {} as Record<string, DataUpdateEvent[]>);
  }

  /**
   * Procesa lote de actualizaciones del mismo tipo
   */
  private processBatchedUpdateType(type: DataUpdateEvent['type'], events: DataUpdateEvent[]): void {
    const latestEvent = events[events.length - 1]; // Use most recent

    switch (type) {
      case 'full_update':
        this.processFullUpdate(latestEvent);
        break;
      case 'guardian_update':
        events.forEach(event => this.processGuardianUpdate(event));
        break;
      case 'philosophy_update':
        this.processPhilosophyUpdate(latestEvent);
        break;
      case 'partial_update':
        events.forEach(event => this.processPartialUpdate(event));
        break;
    }
  }

  /**
   * Procesa actualización individual
   */
  private processUpdate(updateEvent: DataUpdateEvent): void {
    switch (updateEvent.type) {
      case 'full_update':
        this.processFullUpdate(updateEvent);
        break;
      case 'guardian_update':
        this.processGuardianUpdate(updateEvent);
        break;
      case 'philosophy_update':
        this.processPhilosophyUpdate(updateEvent);
        break;
      case 'partial_update':
        this.processPartialUpdate(updateEvent);
        break;
    }

    this.dataState.lastUpdated = new Date();
    this.dataState.updateCount++;
    this.dataState.isStale = false;
    this.restartStaleTimer();

    this.notifyHandlers(updateEvent);
  }

  // ============================================================================
  // 🔧 Specific Update Processors
  // ============================================================================

  /**
   * Procesa actualización completa del sistema
   */
  private processFullUpdate(event: DataUpdateEvent): void {
    if (event.data.systemHealth) {
      this.dataState.systemHealth = {
        ...this.dataState.systemHealth,
        ...event.data.systemHealth
      };
    }

    if (event.data.guardianReports) {
      this.dataState.guardianReports = {
        ...this.dataState.guardianReports,
        ...event.data.guardianReports
      };
    }

    this.lastFullUpdate = new Date();
  }

  /**
   * Procesa actualización de guardian específico
   */
  private processGuardianUpdate(event: DataUpdateEvent): void {
    const { guardianType, report } = event.data;

    if (guardianType && report) {
      this.dataState.guardianReports[guardianType] = report;

      // Update system health metrics if needed
      this.recalculateSystemHealth();
    }
  }

  /**
   * Procesa actualización de alineación filosófica
   */
  private processPhilosophyUpdate(event: DataUpdateEvent): void {
    if (event.data.philosophyAlignment) {
      // Update philosophy guardian report
      if (this.dataState.guardianReports.philosophy) {
        this.dataState.guardianReports.philosophy.philosophyAlignment = event.data.philosophyAlignment;
      }

      // Update system health if philosophy is critical
      this.recalculateSystemHealth();
    }
  }

  /**
   * Procesa actualización parcial
   */
  private processPartialUpdate(event: DataUpdateEvent): void {
    // Handle specific partial updates based on data content
    if (event.data.criticalAlert) {
      this.dataState.systemHealth.criticalIssues += 1;
    }

    if (event.data.recommendation) {
      this.dataState.systemHealth.totalRecommendations += 1;
    }

    // Trigger recalculation if significant changes
    this.recalculateSystemHealth();
  }

  /**
   * Recalcula métricas de salud del sistema
   */
  private recalculateSystemHealth(): void {
    const reports = Object.values(this.dataState.guardianReports);

    if (reports.length === 0) return;

    // Calculate overall score
    const totalScore = reports.reduce((sum, report) => sum + (report.score || 0), 0);
    this.dataState.systemHealth.overallScore = totalScore / reports.length;

    // Count active guardians
    this.dataState.systemHealth.guardiansActive = reports.filter(r => r.isActive).length;

    // Count critical issues
    this.dataState.systemHealth.criticalIssues = reports.reduce(
      (sum, report) => sum + (report.criticalIssues || 0), 0
    );

    // Update last evolution time
    this.dataState.systemHealth.lastEvolution = new Date();
  }

  // ============================================================================
  // 📢 Handler Management
  // ============================================================================

  /**
   * Registra handler para actualizaciones de datos
   */
  public subscribe(handler: DataUpdateHandler): () => void {
    this.updateHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.updateHandlers.delete(handler);
    };
  }

  /**
   * Notifica a todos los handlers
   */
  private notifyHandlers(event: DataUpdateEvent): void {
    this.updateHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in data update handler:', error);
      }
    });
  }

  // ============================================================================
  // ⏰ Stale Data Management
  // ============================================================================

  /**
   * Inicia timer para marcar datos como obsoletos
   */
  private startStaleTimer(): void {
    this.staleTimeout = setTimeout(() => {
      this.dataState.isStale = true;
      this.notifyHandlers({
        type: 'partial_update',
        data: { isStale: true },
        timestamp: new Date(),
        source: 'manual'
      });
    }, this.config.staleThreshold);
  }

  /**
   * Reinicia timer de datos obsoletos
   */
  private restartStaleTimer(): void {
    if (this.staleTimeout) {
      clearTimeout(this.staleTimeout);
    }
    this.startStaleTimer();
  }

  // ============================================================================
  // 🔍 Public API
  // ============================================================================

  /**
   * Obtiene estado actual de datos
   */
  public getCurrentState(): RealTimeDataState {
    return { ...this.dataState };
  }

  /**
   * Fuerza actualización manual
   */
  public forceUpdate(data: Partial<RealTimeDataState>): void {
    const updateEvent: DataUpdateEvent = {
      type: 'full_update',
      data,
      timestamp: new Date(),
      source: 'manual'
    };

    this.processUpdate(updateEvent);
  }

  /**
   * Verifica si los datos están obsoletos
   */
  public isStale(): boolean {
    return this.dataState.isStale;
  }

  /**
   * Obtiene estadísticas del servicio
   */
  public getStats() {
    return {
      updateCount: this.dataState.updateCount,
      lastUpdated: this.dataState.lastUpdated,
      lastFullUpdate: this.lastFullUpdate,
      isStale: this.dataState.isStale,
      queueSize: this.updateQueue.length,
      handlerCount: this.updateHandlers.size
    };
  }

  /**
   * Actualiza configuración
   */
  public updateConfig(newConfig: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Limpia recursos
   */
  public destroy(): void {
    if (this.staleTimeout) {
      clearTimeout(this.staleTimeout);
    }
    this.updateHandlers.clear();
    this.updateQueue = [];
  }
}

export default RealTimeDataService;
