"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmicWebSocketService = void 0;
const events_1 = require("events");
class CosmicWebSocketService extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.socket = null;
        this.connectionState = 'disconnected';
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        this.eventQueue = [];
        this.isDestroyed = false;
        this.config = {
            url: config.url || 'ws://localhost:3002/cosmic-brain',
            reconnectInterval: config.reconnectInterval || 5000,
            maxReconnectAttempts: config.maxReconnectAttempts || 10,
            heartbeatInterval: config.heartbeatInterval || 30000,
            enableLogging: config.enableLogging ?? true,
            autoConnect: config.autoConnect ?? true
        };
        this.stats = {
            connectedAt: null,
            disconnectedAt: null,
            reconnectAttempts: 0,
            totalEventsReceived: 0,
            lastEventAt: null,
            averageLatency: 0
        };
        if (this.config.autoConnect) {
            this.connect();
        }
    }
    async connect() {
        if (this.isDestroyed) {
            throw new Error('WebSocket service has been destroyed');
        }
        if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
            this.log('Already connected or connecting');
            return;
        }
        this.setConnectionState('connecting');
        this.log(`Connecting to ${this.config.url}`);
        try {
            this.socket = new WebSocket(this.config.url);
            this.setupEventListeners();
        }
        catch (error) {
            this.handleConnectionError(error);
        }
    }
    disconnect() {
        this.log('Disconnecting WebSocket');
        this.clearTimers();
        if (this.socket) {
            this.socket.close(1000, 'Client disconnect');
            this.socket = null;
        }
        this.setConnectionState('disconnected');
        this.stats.disconnectedAt = new Date();
    }
    reconnect() {
        if (this.isDestroyed || this.stats.reconnectAttempts >= this.config.maxReconnectAttempts) {
            this.log('Max reconnect attempts reached or service destroyed');
            this.setConnectionState('error');
            return;
        }
        this.stats.reconnectAttempts++;
        this.setConnectionState('reconnecting');
        const delay = Math.min(this.config.reconnectInterval * Math.pow(2, this.stats.reconnectAttempts - 1), 30000);
        this.log(`Reconnecting in ${delay}ms (attempt ${this.stats.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, delay);
    }
    setupEventListeners() {
        if (!this.socket)
            return;
        this.socket.onopen = () => {
            this.log('WebSocket connected successfully');
            this.setConnectionState('connected');
            this.stats.connectedAt = new Date();
            this.stats.reconnectAttempts = 0;
            this.startHeartbeat();
            this.processEventQueue();
            this.emit('connected');
        };
        this.socket.onmessage = (event) => {
            this.handleMessage(event);
        };
        this.socket.onclose = (event) => {
            this.log(`WebSocket closed: ${event.code} - ${event.reason}`);
            this.clearTimers();
            if (!this.isDestroyed && event.code !== 1000) {
                this.reconnect();
            }
            else {
                this.setConnectionState('disconnected');
            }
            this.emit('disconnected', { code: event.code, reason: event.reason });
        };
        this.socket.onerror = (error) => {
            this.log('WebSocket error:', error);
            this.handleConnectionError(new Error('WebSocket connection error'));
        };
    }
    handleMessage(event) {
        try {
            const cosmicEvent = JSON.parse(event.data);
            this.stats.totalEventsReceived++;
            this.stats.lastEventAt = new Date();
            this.log(`Received event: ${cosmicEvent.type}`, cosmicEvent);
            this.emit(cosmicEvent.type, cosmicEvent);
            this.emit('cosmic_event', cosmicEvent);
            if (cosmicEvent.severity === 'critical') {
                this.emit('critical_alert', cosmicEvent);
            }
        }
        catch (error) {
            this.log('Error parsing WebSocket message:', error);
            this.emit('parse_error', { error, rawData: event.data });
        }
    }
    handleConnectionError(error) {
        this.log('Connection error:', error);
        this.setConnectionState('error');
        this.emit('error', error);
        if (!this.isDestroyed) {
            this.reconnect();
        }
    }
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.sendMessage({
                    type: 'heartbeat',
                    timestamp: new Date().toISOString()
                });
            }
        }, this.config.heartbeatInterval);
    }
    clearTimers() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    sendMessage(message) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.log('Cannot send message: WebSocket not connected');
            this.queueEvent(message);
            return false;
        }
        try {
            this.socket.send(JSON.stringify(message));
            this.log('Message sent:', message);
            return true;
        }
        catch (error) {
            this.log('Error sending message:', error);
            return false;
        }
    }
    requestGuardianAnalysis(guardianType) {
        return this.sendMessage({
            type: 'request_guardian_analysis',
            guardianType,
            timestamp: new Date().toISOString()
        });
    }
    requestSystemHealthUpdate() {
        return this.sendMessage({
            type: 'request_system_health',
            timestamp: new Date().toISOString()
        });
    }
    queueEvent(event) {
        if (this.eventQueue.length >= 100) {
            this.eventQueue.shift();
        }
        this.eventQueue.push({
            ...event,
            queuedAt: new Date().toISOString()
        });
        this.log(`Event queued (queue size: ${this.eventQueue.length})`);
    }
    processEventQueue() {
        if (this.eventQueue.length === 0)
            return;
        this.log(`Processing ${this.eventQueue.length} queued events`);
        const events = [...this.eventQueue];
        this.eventQueue = [];
        events.forEach(event => {
            this.sendMessage(event);
        });
    }
    setConnectionState(state) {
        if (this.connectionState !== state) {
            const previousState = this.connectionState;
            this.connectionState = state;
            this.log(`Connection state changed: ${previousState} -> ${state}`);
            this.emit('state_change', { previous: previousState, current: state });
        }
    }
    getConnectionState() {
        return this.connectionState;
    }
    isConnected() {
        return this.connectionState === 'connected';
    }
    getConnectionStats() {
        return { ...this.stats };
    }
    log(message, data) {
        if (!this.config.enableLogging)
            return;
        const timestamp = new Date().toISOString();
        const prefix = '[CosmicWebSocket]';
        if (data) {
            console.log(`${timestamp} ${prefix} ${message}`, data);
        }
        else {
            console.log(`${timestamp} ${prefix} ${message}`);
        }
    }
    destroy() {
        this.log('Destroying WebSocket service');
        this.isDestroyed = true;
        this.disconnect();
        this.removeAllListeners();
        this.eventQueue = [];
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        const wasConnected = this.isConnected();
        this.config = { ...this.config, ...newConfig };
        this.log('Configuration updated', this.config);
        if (wasConnected) {
            this.disconnect();
            setTimeout(() => this.connect(), 1000);
        }
    }
}
exports.CosmicWebSocketService = CosmicWebSocketService;
exports.default = CosmicWebSocketService;
//# sourceMappingURL=CosmicWebSocketService.js.map