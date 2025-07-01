import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

export interface LogContext {
  userId?: string;
  videoId?: string;
  endpoint?: string;
  method?: string;
  duration?: number;
  error?: string;
  stackTrace?: string;
  requestPayload?: any;
  [key: string]: any;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    // Configurar formatos
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          message,
          context,
          ...meta,
        });
      })
    );

    // Configurar transports según el entorno
    const transports: winston.transport[] = [
      // Console transport para desarrollo
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message} ${metaStr}`;
          })
        ),
      }),
    ];

    // En producción, agregar file transport
    if (process.env.NODE_ENV === 'production') {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: logFormat,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: logFormat,
        })
      );
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports,
      // Evitar que Winston maneje excepciones no capturadas (NestJS lo hace)
      exitOnError: false,
    });
  }

  log(message: string, context?: string, meta?: LogContext) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: LogContext) {
    this.logger.error(message, { 
      context, 
      stackTrace: trace,
      ...meta 
    });
  }

  warn(message: string, context?: string, meta?: LogContext) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: LogContext) {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: LogContext) {
    this.logger.verbose(message, { context, ...meta });
  }

  // Métodos específicos para métricas de performance
  logPerformance(operation: string, duration: number, context?: string, meta?: LogContext) {
    this.logger.info(`Performance: ${operation}`, {
      context: context || 'Performance',
      operation,
      duration,
      ...meta,
    });
  }

  logVideoCalculation(
    videoId: string,
    method: string,
    duration: number,
    calculatedDuration?: number,
    success: boolean = true,
    error?: string,
    meta?: LogContext
  ) {
    const logData = {
      context: 'VideoCalculation',
      videoId,
      method,
      executionDuration: duration,
      calculatedDuration,
      success,
      error,
      ...meta,
    };

    if (success) {
      this.logger.info(`Video duration calculated: ${method}`, logData);
    } else {
      this.logger.error(`Video duration calculation failed: ${method}`, logData);
    }
  }

  logCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, meta?: LogContext) {
    this.logger.info(`Cache ${operation}: ${key}`, {
      context: 'Cache',
      operation,
      key,
      ...meta,
    });
  }

  logApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number,
    meta?: LogContext
  ) {
    const logData = {
      context: 'API',
      endpoint,
      method,
      statusCode,
      duration,
      ...meta,
    };

    if (statusCode >= 400) {
      this.logger.error(`API Error: ${method} ${endpoint}`, logData);
    } else {
      this.logger.info(`API Call: ${method} ${endpoint}`, logData);
    }
  }

  // Método para logging de errores con contexto completo
  logErrorWithContext(
    error: Error,
    context: string,
    additionalContext?: LogContext
  ) {
    this.logger.error(error.message, {
      context,
      error: error.name,
      stackTrace: error.stack,
      ...additionalContext,
    });
  }
} 