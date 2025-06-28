import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  //   console.log('>>> Bootstrap: Starting application...');
  //   console.log('>>> Bootstrap: Creating NestFactory...');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  //   console.log('>>> Bootstrap: NestFactory created successfully');

  // Lista blanca de dominios permitidos
  const whiteList = [
    'https://superapp-unified-iota.vercel.app',
    'https://superapp-unified-git-main-kvn3tojs-projects-9cd69e29.vercel.app', // SuperApp Vercel main
    'https://admin-frontend-git-main-kvn3tojs-projects-9cd69e29.vercel.app',   // Admin Vercel main
    'http://localhost:3001',          // Para desarrollo local
    'http://localhost:3000',          // Admin local
    'https://superapp-unified-git-main-kvn3tojs-projects-642e52c0.vercel.app',
  ];

  app.enableCors({
    origin: [
      'https://myfrontend.com',           // Producción
      'https://myfrontend.vercel.app',    // (Opcional) Vercel preview
      'http://localhost:3001',            // (Opcional) Local dev
    ],
    credentials: true, // Si usas cookies/JWT
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With', // <-- CRÍTICO
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Importante para transformar query params a tipos DTO
      whitelist: true, // Opcional: remueve propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Opcional: lanza error si hay propiedades extra
    })
  );

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Gamifier API')
    .setDescription('API for the Gamifier educational platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server on port 3002 to match user's configuration and avoid conflicts
  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0'); // 🌐 ESCUCHAR EN TODAS LAS INTERFACES DE RED

  console.log(`🚀 Gamifier API is running on: http://localhost:${port}`);
  console.log(`🌐 Network access: http://192.168.1.37:${port}`);
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`
  );
}

bootstrap();
