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

  // Enable CORS for frontend communication - Configuración mejorada
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3002', 
      'http://localhost:3003', 
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080' // Para tests
    ], // Frontend ports: React dev, custom port, Vite
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Accept', 
      'Authorization', 
      'X-Requested-With',
      'Origin',
      'Access-Control-Allow-Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    credentials: true,
    optionsSuccessStatus: 200, // Para soportar navegadores legacy
    preflightContinue: false,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Importante para transformar query params a tipos DTO
      whitelist: true, // Opcional: remueve propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Opcional: lanza error si hay propiedades extra
    }),
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
  
  loggerService.log(`🚀 Gamifier API is running on: http://localhost:${port}`, 'Bootstrap');
}

bootstrap(); 