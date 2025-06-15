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

  // 🚀 CORS DINÁMICO Y ROBUSTO - Configuración a prueba de balas para desarrollo
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Log all CORS requests for debugging
      loggerService.log(
        `CORS Request from origin: ${origin || 'no-origin'}`,
        'CORS'
      );

      // ✅ PERMITIR requests sin origin (aplicaciones móviles, Postman, server-to-server)
      if (!origin) {
        loggerService.log('CORS: Allowing request without origin', 'CORS');
        return callback(null, true);
      }

      // ✅ DESARROLLO: Permitir CUALQUIER puerto de localhost/127.0.0.1 (SOLUCIÓN PRINCIPAL)
      // Esta expresión regular captura localhost con cualquier puerto (3001, 3003, 3009, 48752, etc.)
      const localhostDynamicRegex = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/;
      if (localhostDynamicRegex.test(origin)) {
        loggerService.log(
          `CORS: ✅ Allowing localhost origin with dynamic port: ${origin}`,
          'CORS'
        );
        return callback(null, true);
      }

      // ✅ DESARROLLO: Permitir dominios .local y variantes de desarrollo
      const developmentRegex = /^https?:\/\/(.*\.(local|localhost|test|dev))(:\d+)?$/;
      if (developmentRegex.test(origin)) {
        loggerService.log(
          `CORS: ✅ Allowing development domain: ${origin}`,
          'CORS'
        );
        return callback(null, true);
      }

      // ✅ PRODUCCIÓN: Lista específica de orígenes permitidos
      const allowedProductionOrigins = [
        // Variables de entorno para producción
        process.env.FRONTEND_URL,
        process.env.VITE_BASE_URL,
        process.env.ALLOWED_ORIGIN,
        process.env.PRODUCTION_FRONTEND_URL,
        // Dominios de producción específicos (agregar según necesidad)
        'https://app.coomunity.com',
        'https://coomunity.com',
        'https://www.coomunity.com',
      ].filter(Boolean);

      if (allowedProductionOrigins.includes(origin)) {
        loggerService.log(
          `CORS: ✅ Allowing production origin: ${origin}`,
          'CORS'
        );
        return callback(null, true);
      }

      // 🔍 DETERMINAR ENTORNO
      const isDevelopment = 
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV !== 'production' ||
        !process.env.NODE_ENV;

      if (isDevelopment) {
        // 🚨 DESARROLLO: Ser ultra-permisivo para evitar bloqueos
        loggerService.warn(
          `CORS: ⚠️ DEVELOPMENT MODE - Allowing unknown origin: ${origin}`,
          'CORS'
        );
        return callback(null, true);
      }

      // 🚫 PRODUCCIÓN: Rechazar orígenes no autorizados
      loggerService.error(
        `CORS: ❌ PRODUCTION MODE - Blocked unauthorized origin: ${origin}`,
        'CORS'
      );
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
