import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger';

async function bootstrap() {
  console.log('>>> Bootstrap: Starting application...');
  console.log('>>> Bootstrap: Creating NestFactory...');

  const app = await NestFactory.create(AppModule, {
    logger: false, // Deshabilitamos el logger por defecto para usar Winston
  });

  console.log('>>> Bootstrap: NestFactory created successfully');

  // Configurar Winston como logger global
  const loggerService = app.get(LoggerService);
  app.useLogger(loggerService);

  loggerService.log('Application starting...', 'Bootstrap');

  // Enhanced CORS configuration with better debugging and dynamic port support
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Log all CORS requests for debugging
      loggerService.log(
        `CORS Request from origin: ${origin || 'no-origin'}`,
        'CORS'
      );

      // Permitir requests sin origin (ej. aplicaciones móviles, Postman, server-to-server)
      if (!origin) {
        loggerService.log('CORS: Allowing request without origin', 'CORS');
        return callback(null, true);
      }

      // Enhanced localhost/127.0.0.1 regex to handle more cases including all port ranges
      const localhostRegex =
        /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/;
      if (localhostRegex.test(origin)) {
        loggerService.log(
          `CORS: Allowing localhost/127.0.0.1 origin: ${origin}`,
          'CORS'
        );
        return callback(null, true);
      }

      // Handle Vite dev server dynamic ports - expanded to handle ALL port ranges
      // This includes test environment ports like 48752
      const viteDevRegex = /^https?:\/\/(localhost|127\.0\.0\.1):(\d{1,5})$/;
      if (viteDevRegex.test(origin)) {
        const portMatch = origin.match(/:(\d{1,5})$/);
        const port = portMatch ? parseInt(portMatch[1]) : 0;

        // Allow any port between 1024-65535 for development/testing
        if (port >= 1024 && port <= 65535) {
          loggerService.log(
            `CORS: Allowing development/test origin with port ${port}: ${origin}`,
            'CORS'
          );
          return callback(null, true);
        }
      }

      // Permitir orígenes específicos para desarrollo y producción
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        // Environment variables for production
        process.env.FRONTEND_URL,
        process.env.VITE_BASE_URL,
        process.env.ALLOWED_ORIGIN,
      ].filter(Boolean);

      if (allowedOrigins.includes(origin)) {
        loggerService.log(
          `CORS: Allowing whitelisted origin: ${origin}`,
          'CORS'
        );
        return callback(null, true);
      }

      // En desarrollo, ser más permisivo
      const isDevelopment =
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV !== 'production' ||
        !process.env.NODE_ENV;

      if (isDevelopment) {
        // Allow any local development origin in development mode
        const devOriginRegex =
          /^https?:\/\/(localhost|127\.0\.0\.1|.*\.local)(:\d+)?$/;
        if (devOriginRegex.test(origin)) {
          loggerService.log(
            `CORS: Allowing development origin: ${origin}`,
            'CORS'
          );
          return callback(null, true);
        }

        // In development, log and allow unknown origins with warning
        loggerService.warn(
          `CORS: Allowing unknown origin in development mode: ${origin}`,
          'CORS'
        );
        return callback(null, true);
      }

      // En producción, rechazar orígenes no permitidos
      loggerService.error(`CORS: Blocked disallowed origin: ${origin}`, 'CORS');
      return callback(
        new Error(`CORS: Origin ${origin} not allowed by CORS policy`),
        false
      );
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'Origin',
      'Access-Control-Allow-Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'Link'],
    credentials: true,
    optionsSuccessStatus: 200, // Para soportar navegadores legacy
    preflightContinue: false,
    maxAge: 86400, // Cache preflight for 24 hours
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Importante para transformar query params a tipos DTO
      whitelist: true, // Opcional: remueve propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Opcional: lanza error si hay propiedades extra
    })
  );

  // Swagger documentation setup - TESTING AFTER FIXING CIRCULAR DEPENDENCY
  // try {
  //   console.log('>>> Bootstrap: Setting up Swagger...');
  //   const config = new DocumentBuilder()
  //     .setTitle('Gamifier API')
  //     .setDescription('API for the Gamifier educational platform')
  //     .setVersion('1.0')
  //     .addBearerAuth()
  //     .build();

  //   console.log('>>> Bootstrap: Creating Swagger document...');
  //   const document = SwaggerModule.createDocument(app, config);
  //   console.log('>>> Bootstrap: Swagger document created successfully');
  //   console.log('>>> Bootstrap: Setting up Swagger UI...');
  //   SwaggerModule.setup('api', app, document);

  //   loggerService.log('✅ Swagger documentation enabled successfully', 'Bootstrap');
  //   console.log('>>> Bootstrap: Swagger setup completed successfully');
  // } catch (error) {
  //   console.error('❌ Swagger setup failed with error:', error);
  //   console.error('❌ Error stack:', error.stack);
  //   console.error('❌ Error message:', error.message);
  //   loggerService.error('❌ Swagger setup failed:', error, 'Bootstrap');

  //   // Continue without Swagger if there's an error
  //   console.log('>>> Bootstrap: Continuing without Swagger documentation');
  // }

  console.log('>>> Bootstrap: Skipping Swagger setup for debugging...');

  // Start server on port 3002 to match user's configuration and avoid conflicts
  const port = process.env.PORT || 3002;
  await app.listen(port);

  loggerService.log(
    `🚀 Gamifier API is running on: http://localhost:${port}`,
    'Bootstrap'
  );
}

bootstrap();
