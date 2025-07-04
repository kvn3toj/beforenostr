import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * [BACKEND] Filtro global de excepciones HTTP para CoomÜnity
 *
 * - Garantiza que los códigos de estado HTTP (404, 400, 403, etc.) se propaguen fielmente al cliente.
 * - Permite mensajes de error alineados a la filosofía CoomÜnity (KIRA, PAX).
 * - Refuerza la gobernanza Lex-Exec-Jud y la transparencia API.
 *
 * Atlas: Fortaleza y confianza en la API
 * Sage: Pureza y calidad en la experiencia
 * Kira: Mensajes cálidos y alineados a la filosofía
 * Pax: Manejo compasivo y educativo de errores
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    // Permite mensajes personalizados o array de errores
    let message = (typeof exceptionResponse === 'string')
      ? exceptionResponse
      : (exceptionResponse as any)?.message || exception.message;
    if (Array.isArray(message)) message = message.join('; ');

    // Logging estructurado
    this.logger.warn(`[${request.method}] ${request.url} - ${status} - ${message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: (exceptionResponse as any)?.error || undefined,
    });
  }
}
