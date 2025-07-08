import { CosmicWebSocketEvent } from '../websocket/CosmicWebSocketService';
import { SystemHealthMetrics, GuardianReportsCollection } from '../types';
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
export declare class RealTimeDataService {
    private dataState;
    private updateHandlers;
    private lastFullUpdate;
    private updateQueue;
    private isProcessingQueue;
    private staleTimeout;
    private config;
    constructor(initialData?: Partial<RealTimeDataState>);
    handleWebSocketEvent(event: CosmicWebSocketEvent): void;
    private mapEventTypeToUpdateType;
    private queueUpdate;
    private scheduleBatchProcess;
    private processBatchUpdates;
    private groupUpdatesByType;
    private processBatchedUpdateType;
    private processUpdate;
    private processFullUpdate;
    private processGuardianUpdate;
    private processPhilosophyUpdate;
    private processPartialUpdate;
    private recalculateSystemHealth;
    subscribe(handler: DataUpdateHandler): () => void;
    private notifyHandlers;
    private startStaleTimer;
    private restartStaleTimer;
    getCurrentState(): RealTimeDataState;
    forceUpdate(data: Partial<RealTimeDataState>): void;
    isStale(): boolean;
    getStats(): {
        updateCount: number;
        lastUpdated: Date;
        lastFullUpdate: Date;
        isStale: boolean;
        queueSize: number;
        handlerCount: number;
    };
    updateConfig(newConfig: Partial<typeof this.config>): void;
    destroy(): void;
}
export default RealTimeDataService;
