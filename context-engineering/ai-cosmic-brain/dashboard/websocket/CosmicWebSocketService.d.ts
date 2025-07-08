/// <reference types="node" />
import { EventEmitter } from 'events';
export type WebSocketConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
export type CosmicEventType = 'guardian_analysis_update' | 'philosophy_alignment_change' | 'system_health_update' | 'critical_alert' | 'recommendation_generated' | 'mission_assigned' | 'harmony_analysis_complete';
export interface CosmicWebSocketEvent {
    type: CosmicEventType;
    timestamp: string;
    data: any;
    guardianId?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    metadata?: Record<string, any>;
}
export interface WebSocketConfig {
    url: string;
    reconnectInterval: number;
    maxReconnectAttempts: number;
    heartbeatInterval: number;
    enableLogging: boolean;
    autoConnect: boolean;
}
export interface ConnectionStats {
    connectedAt: Date | null;
    disconnectedAt: Date | null;
    reconnectAttempts: number;
    totalEventsReceived: number;
    lastEventAt: Date | null;
    averageLatency: number;
}
export declare class CosmicWebSocketService extends EventEmitter {
    private socket;
    private config;
    private connectionState;
    private reconnectTimer;
    private heartbeatTimer;
    private stats;
    private eventQueue;
    private isDestroyed;
    constructor(config?: Partial<WebSocketConfig>);
    connect(): Promise<void>;
    disconnect(): void;
    private reconnect;
    private setupEventListeners;
    private handleMessage;
    private handleConnectionError;
    private startHeartbeat;
    private clearTimers;
    sendMessage(message: any): boolean;
    requestGuardianAnalysis(guardianType: string): boolean;
    requestSystemHealthUpdate(): boolean;
    private queueEvent;
    private processEventQueue;
    private setConnectionState;
    getConnectionState(): WebSocketConnectionState;
    isConnected(): boolean;
    getConnectionStats(): ConnectionStats;
    private log;
    destroy(): void;
    getConfig(): WebSocketConfig;
    updateConfig(newConfig: Partial<WebSocketConfig>): void;
}
export default CosmicWebSocketService;
