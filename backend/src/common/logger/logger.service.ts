import { Injectable, LoggerService } from '@nestjs/common';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

export interface LogContext {
  module?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

@Injectable()
export class CoomUnityLoggerService implements LoggerService {
  private readonly logLevel: LogLevel;
  private readonly enabledModules: Set<string>;
  private readonly colors = {
    reset: '\x1b[0m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    debug: '\x1b[32m',
    verbose: '\x1b[35m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
  };

    constructor() {
    // Configurar nivel de log desde ENV (default: INFO en development, ERROR en production)
    const logLevelString = process.env.LOG_LEVEL ||
      (process.env.NODE_ENV === 'production' ? 'ERROR' : 'INFO');
    this.logLevel = LogLevel[logLevelString.toUpperCase() as keyof typeof LogLevel] ?? LogLevel.INFO;

    // Configurar módulos habilitados desde ENV
    const enabledModulesString = process.env.LOG_MODULES || 'ALL';
    this.enabledModules = enabledModulesString === 'ALL'
      ? new Set(['ALL'])
      : new Set(enabledModulesString.split(',').map(m => m.trim()));
  }

  /**
   * Log de error - Siempre se muestra
   */
  error(message: string, trace?: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.ERROR, context?.module)) {
      this.writeLog('ERROR', message, { trace, ...context });
    }
  }

  /**
   * Log de advertencia
   */
  warn(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.WARN, context?.module)) {
      this.writeLog('WARN', message, context);
    }
  }

  /**
   * Log de información - Para eventos importantes
   */
  log(message: string, context?: LogContext) {
    this.info(message, context);
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.INFO, context?.module)) {
      this.writeLog('INFO', message, context);
    }
  }

  /**
   * Log de debug - Para desarrollo detallado
   */
  debug(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.DEBUG, context?.module)) {
      this.writeLog('DEBUG', message, context);
    }
  }

  /**
   * Log verbose - Para máximo detalle
   */
  verbose(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.VERBOSE, context?.module)) {
      this.writeLog('VERBOSE', message, context);
    }
  }

  /**
   * Métodos específicos del dominio CoomÜnity
   */
  auth(message: string, context?: LogContext) {
    this.debug(`🔐 AUTH: ${message}`, { module: 'AuthService', ...context });
  }

  rbac(message: string, context?: LogContext) {
    this.debug(`🛡️ RBAC: ${message}`, { module: 'RolesGuard', ...context });
  }

  database(message: string, context?: LogContext) {
    this.debug(`🗄️ DB: ${message}`, { module: 'PrismaService', ...context });
  }

  social(message: string, context?: LogContext) {
    this.debug(`👥 SOCIAL: ${message}`, { module: 'SocialService', ...context });
  }

  marketplace(message: string, context?: LogContext) {
    this.debug(`🛒 MARKETPLACE: ${message}`, { module: 'MarketplaceService', ...context });
  }

  uplay(message: string, context?: LogContext) {
    this.debug(`🎮 ÜPLAY: ${message}`, { module: 'UPlayService', ...context });
  }

  wallet(message: string, context?: LogContext) {
    this.debug(`💰 WALLET: ${message}`, { module: 'WalletService', ...context });
  }

  ayni(message: string, context?: LogContext) {
    this.info(`🌿 AYNI: ${message}`, { module: 'AyniService', ...context });
  }

  /**
   * Log de performance para medir tiempos
   */
  performance(operation: string, duration: number, context?: LogContext) {
    const color = duration > 1000 ? 'warn' : duration > 500 ? 'info' : 'debug';
    const level = duration > 1000 ? LogLevel.WARN : duration > 500 ? LogLevel.INFO : LogLevel.DEBUG;

    if (this.shouldLog(level, context?.module)) {
      this.writeLog(level === LogLevel.WARN ? 'WARN' : level === LogLevel.INFO ? 'INFO' : 'DEBUG',
        `⚡ PERF: ${operation} took ${duration}ms`, context);
    }
  }

  /**
   * Log estructurado para eventos de negocio
   */
  business(event: string, data: any, context?: LogContext) {
    this.info(`📊 BUSINESS: ${event}`, {
      module: 'BusinessEvents',
      event,
      data: this.sanitizeData(data),
      ...context
    });
  }

  /**
   * Log de usuario para tracking de acciones
   */
  userAction(userId: string, action: string, details?: any, context?: LogContext) {
    this.info(`👤 USER: ${action}`, {
      module: 'UserActions',
      userId,
      action,
      details: this.sanitizeData(details),
      ...context
    });
  }

  private shouldLog(level: LogLevel, module?: string): boolean {
    // Verificar nivel de log
    if (level > this.logLevel) {
      return false;
    }

    // Verificar módulo habilitado
    if (module && !this.enabledModules.has('ALL') && !this.enabledModules.has(module)) {
      return false;
    }

    return true;
  }

  private writeLog(level: string, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const color = this.colors[level.toLowerCase() as keyof typeof this.colors] || this.colors.reset;
    const reset = this.colors.reset;

    // Formatear contexto
    const contextStr = context ? this.formatContext(context) : '';

    // Log colorizado para desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `${this.colors.dim}${timestamp}${reset} ` +
        `${color}${this.colors.bold}[${level}]${reset} ` +
        `${message}${contextStr}`
      );
    } else {
      // Log JSON estructurado para producción
      const logEntry = {
        timestamp,
        level,
        message,
        ...context
      };
      console.log(JSON.stringify(logEntry));
    }
  }

  private formatContext(context: LogContext): string {
    const entries = Object.entries(context).filter(([key, value]) => value !== undefined);
    if (entries.length === 0) return '';

    const formatted = entries
      .map(([key, value]) => `${key}=${this.formatValue(value)}`)
      .join(' ');

    return ` ${this.colors.dim}(${formatted})${this.colors.reset}`;
  }

  private formatValue(value: any): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return JSON.stringify(value);
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    // Clonar para evitar mutaciones
    const sanitized = JSON.parse(JSON.stringify(data));

    // Eliminar campos sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitizeObject = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return obj;

      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
      return obj;
    };

    return sanitizeObject(sanitized);
  }
}
